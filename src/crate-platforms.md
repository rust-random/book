# Platform support

Thanks to many community contributions, Rand crates support a wide variety of platforms.

## no_std

With `default-features = false`, both `rand` and `rand_distr` support `no_std` builds. See [Common features](crate-features.html#common-features).

## getrandom

The [`getrandom`] crate provides a low-level API around platform-specific
random-number sources, and is an important building block of `rand` and
`rand_core` as well as a number of cryptography libraries.
It is not intended for usage outside of low-level libraries.

### WebAssembly

The `wasm32-unknown-unknown` target does not make any assumptions about which JavaScript interface is available, thus the `getrandom` crate requires configuration. See [WebAssembly support](https://docs.rs/getrandom/latest/getrandom/#webassembly-support).

Note that the `wasm32-wasi` and `wasm32-unknown-emscripten` targets do not have this limitation.

[`getrandom`]: https://docs.rs/getrandom/
