# Rand and co

## rand_core (API)

The [`rand_core`] crate defines the core traits implemented by RNGs. This exists
as a separate crate with two purposes:

-   to provide a minimal API for defining and using RNGs
-   to provide tools to aid implementation of RNGs

The [`RngCore`], [`SeedableRng`], [`CryptoRng`] traits and [`Error`] type are
all defined by this crate and re-exported by the [`rand`] crate.

## rand (primary interface)

The [`rand`] crate is optimised for easy usage of common random-number
functionality. This has several aspects:

-   the [`rngs`] module provides a few convenient generators
-   the [`distributions`] module concerns sampling of random values
-   the [`seq`] module concerns sampling from and shuffling sequences
-   the [`Rng`] trait provides a few convenience methods for generating
    random values
-   the [`random`] function provides convenient generation in a single call

### Feature flags

Besides the [common feature flags], several aspects are configurable:

-   `small_rng` enables the [`SmallRng`] generator (feature-gated since v0.7)
-   `simd_support` enables experimental (nightly-only) support for generating
    SIMD values

Note regarding SIMD: the above flag concerns explicit generation of SIMD types
only and not optimisation. SIMD operations may be used internally regardless of
this flag; e.g. the ChaCha generator has explicit support for SIMD operations
internally.

## Distributions

The [`rand`] crate only implements sampling from the most common random
number distributions: uniform and weighted sampling. For everything else,

-   [`rand_distr`] provides fast sampling from a variety of other distributions,
    including Normal (Gauss), Binomial, Poisson, UnitCircle, and many more
-   [`statrs`] is a port of the C# Math.NET library, implementing many of the
    same distributions (plus/minus a few), along with PDF and CDF functions,
    the *error*, *beta*, *gamma* and *logistic* special functions, plus a few
    utilities. (For clarity, [`statrs`] is not part of the Rand library.)

[common feature flags]: crates.md#feature-flags

[`rand_core`]: https://rust-random.github.io/rand/rand_core/index.html
[`rand`]: https://rust-random.github.io/rand/rand/index.html
[`rand_distr`]: https://rust-random.github.io/rand/rand_distr/index.html
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

[`SmallRng`]: https://rust-random.github.io/rand/rand/rngs/struct.SmallRng.html
