# The crate family

<pre><code class="language-plain">                                           ┌ <a href="https://docs.rs/statrs/">statrs</a>
<a href="https://docs.rs/getrandom/">getrandom</a> ┐                                ├ <a href="https://docs.rs/rand_distr/">rand_distr</a>
          └ <a href="https://docs.rs/rand_core/">rand_core</a> ┬─────────────┬ <a href="https://docs.rs/rand/">rand</a> ┘
                      ├ <a href="https://docs.rs/rand_chacha/">rand_chacha</a> ┘
                      ├ <a href="https://docs.rs/rand_pcg/">rand_pcg</a>
                      └ [other RNG crates]
</code></pre>

## Interfaces

[`rand_core`] defines [`RngCore`] and other core traits, as well as several helpers for implementing RNGs.

The [`getrandom`] crate provides a low-level API around platform-specific
random-number sources, and is an important building block of `rand` and
`rand_core` as well as a number of cryptography libraries.
It is not intended for usage outside of low-level libraries.

## Pseudo-random generators

The following crates implement pseudo-random number generators
(see [Our RNGs](guide-rngs.md)):

-   [`rand_chacha`] provides generators using the ChaCha cipher
-   [`rand_hc`] implements a generator using the HC-128 cipher
-   [`rand_isaac`] implements the ISAAC generators
-   [`rand_pcg`] implements a small selection of PCG generators
-   [`rand_xoshiro`] implements the SplitMix and Xoshiro generators
-   [`rand_xorshift`] implements the basic Xorshift generator

Exceptionally, [`SmallRng`] is implemented directly in [`rand`].

## rand (main crate)

The [`rand`] crate is designed for easy usage of common random-number
functionality. This has several aspects:

-   the [`rngs`] module provides a few convenient generators
-   the [`distributions`] module concerns sampling of random values
-   the [`seq`] module concerns sampling from and shuffling sequences
-   the [`Rng`] trait provides a few convenience methods for generating
    random values
-   the [`random`] function provides convenient generation in a single call

## Distributions

The [`rand`] crate only implements sampling from the most common random
number distributions: uniform and weighted sampling. For everything else,

-   [`rand_distr`] provides fast sampling from a variety of other distributions,
    including Normal (Gauss), Binomial, Poisson, UnitCircle, and many more
-   [`statrs`] is a port of the C# Math.NET library, implementing many of the
    same distributions (plus/minus a few), along with PDF and CDF functions,
    the *error*, *beta*, *gamma* and *logistic* special functions, plus a few
    utilities. (For clarity, [`statrs`] is not part of the Rand library.)

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
the ChaCha generator supports [getting and setting the stream position](https://docs.rs/rand_chacha/latest/rand_chacha/struct.ChaCha20Rng.html#method.get_word_pos),
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


[`rand_core`]: https://docs.rs/rand_core/
[`rand`]: https://docs.rs/rand/
[`rand_distr`]: https://docs.rs/rand_distr/
[`statrs`]: https://docs.rs/statrs/
[`getrandom`]: https://docs.rs/getrandom/
[`rand_chacha`]: https://docs.rs/rand_chacha/
[`rand_pcg`]: https://docs.rs/rand_pcg/
[`rand_xoshiro`]: https://docs.rs/rand_xoshiro/
[`log`]: https://docs.rs/log/
[`serde`]: https://serde.rs/
[`rand_hc`]: https://docs.rs/rand_hc/
[`rand_isaac`]: https://docs.rs/rand_isaac/
[`rand_xorshift`]: https://docs.rs/rand_xorshift/

[`RngCore`]: https://docs.rs/rand_core/latest/rand_core/trait.RngCore.html

[`rngs`]: https://docs.rs/rand/latest/rand/rngs/
[`distributions`]: https://docs.rs/rand/latest/rand/distributions/
[`seq`]: https://docs.rs/rand/latest/rand/seq/
[`Rng`]: https://docs.rs/rand/latest/rand/trait.Rng.html
[`random`]: https://docs.rs/rand/latest/rand/fn.random.html

[`SmallRng`]: https://docs.rs/rand/latest/rand/rngs/struct.SmallRng.html
