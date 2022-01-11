const BITS_PER_BYTE = 8
const MAX_BITS = Number.MAX_SAFE_INTEGER.toString(2).length
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
  constructor(lengthOrBuffer: number | Buffer | BitBuffer) {
    if (lengthOrBuffer instanceof Buffer) {
      this.buffer = lengthOrBuffer
    } else if (typeof lengthOrBuffer === "number") {
      if (lengthOrBuffer > MAX_BITS) {
        throw new RangeError(
          "Can not create a bit buffer of length greater than 2^53"
        )
      }
      this.buffer = Buffer.alloc(Math.ceil(lengthOrBuffer / BITS_PER_BYTE))
    } else {
      throw new TypeError("Invalid type, must be a number or a Buffer")
    }
  }

  /**
   * The length of the bit buffer in bits.
   */
  get length(): number {
    return this.buffer.length * BITS_PER_BYTE
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
}
