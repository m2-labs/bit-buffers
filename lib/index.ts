import base64js from "base64-js"
import { inflate, deflate } from "pako"

const BITS_PER_BYTE = 8
const DEFAULT_MIN_LENGTH = 16 * 1_024 * BITS_PER_BYTE // 16KB
const FULL_BYTE = 0b111

/**
 * @class
 * BitBuffer
 *
 * A class representing a bit buffer
 */
export class BitBuffer {
  private buffer: Buffer

  /**
   * @constructor
   * Build a new Bit Buffer
   *
   * @param lengthOrBuffer the length of the buffer in bits, or an existing
   * buffer to use
   */
  constructor(
    lengthOrBuffer: number | Buffer | BitBuffer = DEFAULT_MIN_LENGTH
  ) {
    if (lengthOrBuffer instanceof Buffer) {
      this.buffer = lengthOrBuffer
    } else if (typeof lengthOrBuffer === "number") {
      this.buffer = Buffer.alloc(Math.ceil(lengthOrBuffer / BITS_PER_BYTE))
    } else {
      throw new TypeError("Invalid type, must be a number or a Buffer")
    }
  }

  /**
   * Build a new BitBuffer from a compressed bit string
   */
  static fromBitstring(input: string): BitBuffer {
    const buffer = decompress(input)

    return new BitBuffer(buffer)
  }

  /**
   * Built a new BitBuffer from an index array
   */
  static fromIndexArray(input: number[], minLength?: number): BitBuffer {
    return input.reduce((acc, index) => {
      return acc.set(index)
    }, new BitBuffer(minLength))
  }

  /**
   * The length of the bit buffer in bits.
   */
  get length(): number {
    return this.buffer.byteLength * BITS_PER_BYTE
  }

  /**
   *
   * @param offset
   * @param value
   * @returns
   */
  write(offset: number, value: number): BitBuffer {
    if (offset >= this.length) {
      throw new RangeError(`Cannot read bits, offset ${offset} out of bounds.`)
    }

    const newBuffer = Buffer.from(this.buffer)
    const currentByte = offset >> 3
    const byteOffset = offset & FULL_BYTE
    const byteShift = 7 - byteOffset

    newBuffer[currentByte] =
      (newBuffer[currentByte] & ~(1 << byteShift)) |
      (((value >>> 0) & 1) << byteShift)

    return new BitBuffer(newBuffer)
  }

  /**
   *
   * @param offset
   * @returns
   *
   * @throws RangeError if the offset is out of bounds
   */
  get(offset: number): number {
    if (offset >= this.length) {
      throw new RangeError(`Cannot read bits, offset ${offset} out of bounds.`)
    }

    const currentByte = offset >> 3
    const byteOffset = offset & FULL_BYTE
    const byteShift = 7 - byteOffset

    return (this.buffer[currentByte] >> byteShift) & 1
  }

  /**
   * Set a bit to `1` at a given offset.
   *
   * @param offset the location to flip the bit
   * @returns a a copy of this BitBuffer with the bit set
   */
  set(offset: number): BitBuffer {
    return this.write(offset, 1)
  }

  /**
   * Set a bit to `0` at a given offset.
   *
   * @param offset the location to flip the bit
   * @returns a a copy of this BitBuffer with the bit unset
   */
  unset(offset: number): BitBuffer {
    return this.write(offset, 0)
  }

  /**
   * Test a bit at a given offset. Returns `true` if the bit is set, `false`
   * otherwise
   *
   * @param offset the location to test
   * @returns whether or not the bit is set at the given offset.
   */
  test(offset: number): boolean {
    return this.get(offset) === 1
  }

  /**
   * Generates a compressed bit string from an array of index values
   *
   * @returns a compressed string of bits representing the input array
   */
  toBitstring(): string {
    return compress(this.buffer)
  }

  /**
   * Generates an array of indices from the buffer
   *
   * @returns an array of indices
   */
  toIndexArray(): number[] {
    const results: number[] = []

    for (let i = 0; i < this.length; i++) {
      if (this.test(i)) {
        results.push(i)
      }
    }

    return results
  }
}

/**
 * Apply zlib compression with Base64 encoding to a given string or buffer
 *
 * @returns a base64 encoded string containing the zlib compressed input
 */
function compress(input: string | Buffer): string {
  const deflated = deflate(input)
  return base64js.fromByteArray(deflated)
}

/**
 * Given the base64 encoded input array, decode and unzip it to a Buffer
 *
 * @returns a Buffer containing the decoded base64 encoded string
 */
function decompress(input: string): Buffer {
  const decoded = base64js.toByteArray(input)
  return Buffer.from(inflate(decoded))
}
