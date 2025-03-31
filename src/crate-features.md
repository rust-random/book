# Crate features

It is recommended to check the crate's `Cargo.toml` or `README.md` for features.
Since `rand v0.9`, `rust-random` crates only use explicit features (i.e. all
features are listed under `[features]`).

Release versions of `Cargo.toml` can be viewed on `docs.rs`:

-   <https://docs.rs/crate/rand/latest/source/Cargo.toml.orig>
-   <https://docs.rs/crate/rand_core/latest/source/Cargo.toml.orig>
-   <https://docs.rs/crate/rand_distr/latest/source/Cargo.toml.orig>
-   <https://docs.rs/crate/rand_chacha/latest/source/Cargo.toml.orig>
-   <https://docs.rs/crate/rand_xoshiro/latest/source/Cargo.toml.orig>
-   <https://docs.rs/crate/rand_pcg/latest/source/Cargo.toml.orig>

## Common features

The following features are common to `rand_core`, `rand`, `rand_distr` and potentially some RNG crates:

-   `std`: opt into functionality dependent on the `std` lib. This is default-enabled except in `rand_core`; for `no_std` usage, use `default-features = false`.
-   `alloc`: enables functionality requiring an allocator (for usage with `no_std`). This is implied by `std`.
-   `serde`: enables serialization via [`serde`], version 1.0.

## rand_distr features

The floating point functions from `num_traits` and `libm` are used to support
`no_std` environments and ensure reproducibility. If the floating point
functions from `std` are preferred, which may provide better accuracy and
performance but may produce different random values, the `std_math` feature
can be enabled. (Note that any other crate depending on `num-traits`'s `std` feature (default-enabled) will have the same effect.)

[`SmallRng`]: https://docs.rs/rand/latest/rand/rngs/struct.SmallRng.html
[`serde`]: https://serde.rs/
