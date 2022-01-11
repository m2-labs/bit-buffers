import { BitBuffer } from "../lib"

const TEST_VECTORS = [
  {
    indexArray: [],
    bitstring: "eJztwTEBAAAAwqD1T20MH6AAAAAAAAAAAAAAAAAAAACAtwFAAAAB"
  },
  {
    indexArray: [0],
    bitstring: "eJztwSEBAAAAAiCnO90ZFqABAAAAAAAAAAAAAAAAAAAA3gZB4ACB"
  },
  {
    indexArray: [3], // zero index
    bitstring: "eJztwSEBAAAAAiAn+H+tMyxAAwAAAAAAAAAAAAAAAAAAALwNQDwAEQ=="
  },
  {
    skipGenerate: true, // When I generate a bitstring, I get the string found in the first vector. However, both these values decode to the same empty array.
    indexArray: [],
    bitstring:
      "H4sIAAAAAAAAA-3BMQEAAADCoPVPbQsvoAAAAAAAAAAAAAAAAP4GcwM92tQwAAA="
  }
]

test("constructor() accepts a number", () => {
  const bits = new BitBuffer(8)

  expect(bits.length).toBe(8)
})

test("constructor() accepts an existing buffer", () => {
  const bits = new BitBuffer(Buffer.alloc(2))

  expect(bits.length).toBe(16)
})

test("constructor() throws if given an invalid type", () => {
  expect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    new BitBuffer("nope")
  }).toThrow(TypeError)
})

test("write() sets a bit at a given offset", () => {
  const bits = new BitBuffer(8)
  const updated = bits.write(0, 1).write(2, 1)

  expect(updated.get(0)).toBe(1)
  expect(updated.get(1)).toBe(0)
  expect(updated.get(2)).toBe(1)
  expect(updated.get(3)).toBe(0)
  expect(updated.get(4)).toBe(0)
  expect(updated.get(5)).toBe(0)
  expect(updated.get(6)).toBe(0)
  expect(updated.get(7)).toBe(0)

  const updated2 = updated.write(0, 0)
  expect(updated2.get(0)).toBe(0)
  expect(updated2.get(1)).toBe(0)
  expect(updated2.get(2)).toBe(1)
})

test("write() throws if attempting to write to an invalid offset", () => {
  const bits = new BitBuffer(8)

  expect(() => {
    bits.write(8, 1)
  }).toThrow()
})

test("get() reads a bit at a given offset", () => {
  const bits = new BitBuffer(8)
  expect(bits.get(0)).toBe(0)
  expect(bits.get(1)).toBe(0)
  expect(bits.get(2)).toBe(0)
  expect(bits.get(3)).toBe(0)
  expect(bits.get(4)).toBe(0)
  expect(bits.get(5)).toBe(0)
  expect(bits.get(6)).toBe(0)
  expect(bits.get(7)).toBe(0)

  const updated = bits.write(0, 1)
  expect(updated.get(0)).toBe(1)
  expect(updated.get(1)).toBe(0)
  expect(updated.get(2)).toBe(0)
  expect(updated.get(3)).toBe(0)
  expect(updated.get(4)).toBe(0)
  expect(updated.get(5)).toBe(0)
  expect(updated.get(6)).toBe(0)
  expect(updated.get(7)).toBe(0)
})

test("get() throws if accessing out of range", () => {
  const bits = new BitBuffer(8)

  expect(() => {
    bits.get(8)
  }).toThrow()
})

test("set() sets a bit to 1", () => {
  const bits = new BitBuffer(8)
  expect(bits.get(0)).toBe(0)
  expect(bits.get(1)).toBe(0)
  expect(bits.get(2)).toBe(0)
  expect(bits.get(3)).toBe(0)
  expect(bits.get(4)).toBe(0)
  expect(bits.get(5)).toBe(0)
  expect(bits.get(6)).toBe(0)
  expect(bits.get(7)).toBe(0)

  const updated = bits.set(7)
  expect(updated.get(0)).toBe(0)
  expect(updated.get(1)).toBe(0)
  expect(updated.get(2)).toBe(0)
  expect(updated.get(3)).toBe(0)
  expect(updated.get(4)).toBe(0)
  expect(updated.get(5)).toBe(0)
  expect(updated.get(6)).toBe(0)
  expect(updated.get(7)).toBe(1)

  const updated2 = updated.set(7)
  expect(updated2.get(7)).toBe(1)
})

test("unset() sets a bit to 0", () => {
  const original = new BitBuffer(8)
  const bits = original.set(4)

  expect(bits.get(0)).toBe(0)
  expect(bits.get(1)).toBe(0)
  expect(bits.get(2)).toBe(0)
  expect(bits.get(3)).toBe(0)
  expect(bits.get(4)).toBe(1)
  expect(bits.get(5)).toBe(0)
  expect(bits.get(6)).toBe(0)
  expect(bits.get(7)).toBe(0)

  const updated = bits.unset(4)
  expect(updated.get(0)).toBe(0)
  expect(updated.get(1)).toBe(0)
  expect(updated.get(2)).toBe(0)
  expect(updated.get(3)).toBe(0)
  expect(updated.get(4)).toBe(0)
  expect(updated.get(5)).toBe(0)
  expect(updated.get(6)).toBe(0)
  expect(updated.get(7)).toBe(0)

  const updated2 = bits.unset(4)
  expect(updated2.get(4)).toBe(0)
})

test("test() returns true if a given bit is set, false otherwise", () => {
  const original = new BitBuffer(8)
  const bits = original.set(5)

  expect(bits.test(0)).toBe(false)
  expect(bits.test(1)).toBe(false)
  expect(bits.test(2)).toBe(false)
  expect(bits.test(3)).toBe(false)
  expect(bits.test(4)).toBe(false)
  expect(bits.test(5)).toBe(true)
  expect(bits.test(6)).toBe(false)
  expect(bits.test(7)).toBe(false)
})

test(".fromBitstring() builds a BitBuffer from a compressed bitstring", () => {
  TEST_VECTORS.forEach(({ indexArray, bitstring }) => {
    const bits = BitBuffer.fromBitstring(bitstring)
    expect(bits.toIndexArray()).toEqual(indexArray)
  })
})

test(".fromIndexArray() builds a BitBuffer from an index array", () => {
  const bits = BitBuffer.fromIndexArray([4, 5])

  expect(bits.test(0)).toBe(false)
  expect(bits.test(1)).toBe(false)
  expect(bits.test(2)).toBe(false)
  expect(bits.test(3)).toBe(false)
  expect(bits.test(4)).toBe(true)
  expect(bits.test(5)).toBe(true)
  expect(bits.test(6)).toBe(false)
  expect(bits.test(7)).toBe(false)
  expect(bits.test(8)).toBe(false)
  expect(bits.test(9)).toBe(false)
  expect(bits.test(10)).toBe(false)
  expect(bits.test(11)).toBe(false)
  expect(bits.test(12)).toBe(false)
  expect(bits.test(13)).toBe(false)
  expect(bits.test(14)).toBe(false)
  expect(bits.test(15)).toBe(false)
})

test(".fromIndexArray() accepts a size for the array", () => {
  const bits = BitBuffer.fromIndexArray([4, 5], 8)

  expect(bits.test(0)).toBe(false)
  expect(bits.test(1)).toBe(false)
  expect(bits.test(2)).toBe(false)
  expect(bits.test(3)).toBe(false)
  expect(bits.test(4)).toBe(true)
  expect(bits.test(5)).toBe(true)
  expect(bits.test(6)).toBe(false)
  expect(bits.test(7)).toBe(false)
})

test("toBitString() returns a compressed base64 representation of the BitBuffer", () => {
  TEST_VECTORS.forEach(({ indexArray, bitstring, skipGenerate }) => {
    if (skipGenerate) {
      return
    }

    const bits = BitBuffer.fromIndexArray(indexArray)

    expect(bits.toBitstring()).toEqual(bitstring)
  })
})

test("toIndexArray() returns an array of indexes which are set to 1", () => {
  const original = new BitBuffer(8)
  const bits = original.set(5).set(6)

  expect(bits.toIndexArray()).toEqual([5, 6])
})

test("README example", () => {
  const bits = new BitBuffer()

  const bits2 = bits.set(7)
  expect(bits2.test(7)).toBe(true)

  const bits3 = bits2.unset(7)
  expect(bits3.test(7)).toBe(false)

  const bits4 = bits3.set(3)
  const bitstring = bits4.toBitstring()
  expect(bitstring).toEqual(
    "eJztwSEBAAAAAiAn+H+tMyxAAwAAAAAAAAAAAAAAAAAAALwNQDwAEQ=="
  )

  const bits5 = BitBuffer.fromBitstring(bitstring)
  expect(bits5).toEqual(bits4)
  const indexArray = bits5.toIndexArray()
  expect(indexArray).toEqual([3])

  const bits6 = BitBuffer.fromIndexArray(indexArray)
  expect(bits6).toEqual(bits5)
})
