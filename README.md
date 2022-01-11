# bit-buffer

An incredibly simple bit buffer (aka bit-string) implementation.

## Usage

```ts
import { BitBuffer } from "bit-buffer"

// Create a buffer with 16 byte capacity
const bits = new BitBuffer(16 * 8)

// set bit 7 to 1
bits.set(7) // => bits

// test a bit
bits.test(7) // => true

// unset bit 7 to 0
bits.unset(7) // => bits

bits.test(7) // => false
```

## Getting started

```
npm run dev
```

## Building

```
npm run build
```
