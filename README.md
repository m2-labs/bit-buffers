# bit-buffer

A simple bit buffer (bit-string) implementation with base64 zlib compressed bitstring support.

## Usage

```ts
import { BitBuffer } from "bit-buffer"

// BitBuffers are immutable and default to 16kb capacity by default.
const bits = new BitBuffer()

// To create a smaller BitBuffer, you can pass in a smaller capacity, for
// example this will create a BitBuffer with 16 bytes:
// const smallerBits = new BitBuffer(16 * 8)

// set bit 7 to 1.
const bits2 = bits.set(7) // => bits
bits2.test(7) // => true

// unset bit 7 to 0
const bits3 = bits2.unset(7) // => bits
bits3.test(7) // => false

const bits4 = bits3.set(3)
const bitstring = bits4.toBitstring() // => "eJwTYEAFAAEQABE="

const bits5 = BitBuffer.fromBitstring(bitstring)
bits5 === bits4 // true
const indexArray = bits5.toIndexArray() // => [3]

const bits6 = BitBuffer.fromIndexArray(indexArray)
bits6 === bits5 // => true
```

## Getting started

```
npm run dev
```

## Building

```
npm run build
```
