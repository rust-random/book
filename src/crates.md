# Crates and features

The Rand library consists of a family of crates. The [`rand`] crate provides the
main user-interface; where additional distributions are required, the
[`rand_distr`] or [`statrs`] crate may be used in addition.

The library contains several building blocks: [`getrandom`] interfaces with the
platform-dependent random number source, [`rand_core`] defines the API that
generators must implement, and a number of crates like [`rand_chacha`] and
[`rand_xoshiro`] provide pseudo-random generators.

```plain
getrandom ┐
          └ rand_core ┐
                      ├ rand_chacha ┐
                      ├ rand_hc     ┤
                      ├ rand_pcg    ┤
                      └─────────────┴ rand ┐
                                           ├ rand_distr
                                           └ statrs
```

## Feature flags

Rand crates allow some configuration via feature flags. Check the READMEs of
individual crates for details.

No-std support is available across most Rand crates by disabling default
features: `rand = { version = "0.7", default-features = false }`.
This is affected by the following flags:

-   `std` opts-in to functionality dependent on the `std` lib
-   `alloc` (implied by `std`) enables functionality requiring an allocator
    (when using this feature in `no_std`, Rand requires Rustc version 1.36 or greater)

Some Rand crates can be built with support for the following third-party crates:

-   `log` enables a few log messages via [`log`]
-   `serde1` enables serialization via [`serde`], version 1.0

Note that cryptographic RNGs *do not* support serialisation since this could be
a security risk. If you need state-restore functionality on a cryptographic RNG,
the ChaCha generator supports [getting and setting the stream position](https://rust-random.github.io/rand/rand_chacha/struct.ChaCha20Rng.html#method.get_word_pos),
which, together with the seed, can be used to reconstruct the generator's state.

## WASM support

Almost all Rand crates support WASM out of the box. However, when using the
`wasm32-unknown-unknown` target, which doesn't make any assumptions about its
operating environment by default, the `getrandom` crate may require enabling
features for seeding entropy via the platform-provided APIs.
Consequently, if you are using `rand` (or another Rand project crate)
depending on `getrandom`, you may have to explicitly [enable `getrandom`
features](https://github.com/rust-random/getrandom#features) for seeding to
work. Alternatively, in case you are developing for a sandboxed or unknown
WASM platform that can't depend on environment provided APIs, you might want
to disable the `rand` crate's `getrandom` feature and seed the generator
manually.


[`rand_core`]: https://rust-random.github.io/rand/rand_core/index.html
[`rand`]: https://rust-random.github.io/rand/rand/index.html
[`rand_distr`]: https://rust-random.github.io/rand/rand_distr/index.html
[`statrs`]: https://github.com/boxtown/statrs
[`getrandom`]: https://docs.rs/getrandom/
[`rand_chacha`]: https://rust-random.github.io/rand/rand_chacha/index.html
[`rand_xoshiro`]: https://docs.rs/rand_xoshiro/
[`log`]: https://docs.rs/log/
[`serde`]: https://serde.rs/
