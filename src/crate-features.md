# Crate features

For definitive documentation of crate features, check the crate release's `Cargo.toml`:

-   <https://docs.rs/crate/rand/latest/source/Cargo.toml.orig>
-   <https://docs.rs/crate/rand_core/latest/source/Cargo.toml.orig>
-   <https://docs.rs/crate/rand_distr/latest/source/Cargo.toml.orig>

## Common features

The following features are common to `rand_core`, `rand`, `rand_distr` and potentially some RNG crates:

-   `std`: opt into functionality dependent on the `std` lib. This is default-enabled except in `rand_core`; for `no_std` usage, use `default-features = false`.
-   `alloc`: enables functionality requiring an allocator (for usage with `no_std`). This is implied by `std`.
-   `serde1`: enables serialization via [`serde`], version 1.0.

## Rand features

Additional `rand` features:

-   `small_rng` enables the [`SmallRng`] generator (feature-gated since v0.7).
-   `simd_support`: Experimental support for generating various SIMD types (requires nightly `rustc`).
-   `log` enables a few log messages via [`log`].

Note regarding SIMD: the above flag concerns explicit generation of SIMD types
only and not optimisation. SIMD operations may be used internally regardless of
this flag; e.g. the ChaCha generator has explicit support for SIMD operations
internally.

## rand_distr features

The floating point functions from `num_traits` and `libm` are used to support
`no_std` environments and ensure reproducibility. If the floating point
functions from `std` are preferred, which may provide better accuracy and
performance but may produce different random values, the `std_math` feature
can be enabled. (Note that any other crate depending on `num-traits`'s `std` feature (default-enabled) will have the same effect.)

[`SmallRng`]: https://docs.rs/rand/latest/rand/rngs/struct.SmallRng.html
