# Crates

The Rand library consists of a family of crates. For common usage, the `rand`
crate alone will often suffice. Other crates serve as building-blocks and/or
provide additional functionality.

### rand_core

The [`rand_core`] crate defines the core traits implemented by RNGs. This exists
as a separate crate with two purposes:

-   to provide a minimal API for defining and using RNGs
-   to provide tools to aid implementation of RNGs

The [`RngCore`], [`SeedableRng`], [`CryptoRng`] traits and [`Error`] type are
all defined by this crate and re-exported by the [`rand`] crate.

### rand

The [`rand`] crate is optimised for easy usage of common random-number
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

## Generators

### Deterministic generators

The following crates implement [PRNGs]:

-   [`rand_chacha`] provides generators using the ChaCha cipher
-   [`rand_hc`] implements a generator using the HC-128 cipher
-   [`rand_isaac`] implements the ISAAC generators
-   [`rand_pcg`] implements a small selection of PCG generators
-   [`rand_xoshiro`] implements the SplitMix and Xoshiro generators
-   [`rand_xorshift`] implements the basic Xorshift generator

### Non-deterministic generators

The following crates provide non-deterministic random data:

-   [`getrandom`] provides an interface to system-specific random data sources
-   [`rand_os`] provides a simple RNG wrapping [`getrandom`] functionality
    (this wrapper is duplicated by the [`rand`] crate)
-   [`rand_jitter`] implements a CPU-jitter-based entropy harvestor

[`rand_core`]: https://rust-random.github.io/rand/rand_core/index.html
[`rand`]: https://rust-random.github.io/rand/rand/index.html
[`rand_distr`]: https://rust-random.github.io/rand/rand_distr/index.html
[`rand_chacha`]: https://rust-random.github.io/rand/rand_chacha/index.html
[`rand_hc`]: https://rust-random.github.io/rand/rand_hc/index.html
[`rand_isaac`]: https://rust-random.github.io/rand/rand_isaac/index.html
[`rand_pcg`]: https://rust-random.github.io/rand/rand_pcg/index.html
[`rand_xoshiro`]: https://rust-random.github.io/rand/rand_xoshiro/index.html
[`rand_xorshift`]: https://rust-random.github.io/rand/rand_xorshift/index.html
[`rand_os`]: https://rust-random.github.io/rand/rand_os/index.html
[`rand_jitter`]: https://rust-random.github.io/rand/rand_jitter/index.html
[`getrandom`]: https://docs.rs/getrandom/
[`statrs`]: https://github.com/boxtown/statrs

[`RngCore`]: https://rust-random.github.io/rand/rand_core/trait.RngCore.html
[`SeedableRng`]: https://rust-random.github.io/rand/rand_core/trait.SeedableRng.html
[`CryptoRng`]: https://rust-random.github.io/rand/rand_core/trait.CryptoRng.html
[`Error`]: https://rust-random.github.io/rand/rand_core/struct.Error.html

[`rngs`]: https://rust-random.github.io/rand/rand/rngs/index.html
[`distributions`]: https://rust-random.github.io/rand/rand/distributions/index.html
[`seq`]: https://rust-random.github.io/rand/rand/seq/index.html
[`Rng`]: https://rust-random.github.io/rand/rand/trait.Rng.html
[`random`]: https://rust-random.github.io/rand/rand/fn.random.html
