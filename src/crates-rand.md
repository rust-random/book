# Rand and co

### Feature flags

Besides the [common feature flags], several aspects are configurable:

-   `small_rng` enables the [`SmallRng`] generator (feature-gated since v0.7)
-   `simd_support` enables experimental (nightly-only) support for generating
    SIMD values

Note regarding SIMD: the above flag concerns explicit generation of SIMD types
only and not optimisation. SIMD operations may be used internally regardless of
this flag; e.g. the ChaCha generator has explicit support for SIMD operations
internally.

[common feature flags]: crates.md#feature-flags

[`SmallRng`]: https://docs.rs/rand/latest/rand/rngs/struct.SmallRng.html
