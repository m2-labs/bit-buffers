import { BitBuffer } from "../lib"

test("constructor() accepts a number", () => {
  const bits = new BitBuffer(8)

  expect(bits.length).toBe(8)
})

test("constructor() accepts an existing buffer", () => {
  const bits = new BitBuffer(Buffer.alloc(2))

  expect(bits.length).toBe(16)
})

test("constructor() throws if given a size too large", () => {
  expect(() => {
    new BitBuffer(2 ^ 53)
  }).toThrow(RangeError)
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
