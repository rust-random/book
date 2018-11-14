# The Rust Rand Book

This is the extended documentation set for Rust's **Rand**om number lib
([source](https://github.com/rust-random/book)).

See also:

-   [The Rand repository](https://github.com/rust-random/rand)
-   [API reference for the latest release](https://docs.rs/rand/)
-   [API reference for the master branch](https://rust-random.github.io/rand/)
-   [The crate page](https://crates.io/crates/rand)


## Distinction between Rand and `rand_core`

The [`rand_core`] crate provides the necessary traits and functionality for
implementing RNGs; this includes the [`RngCore`] and [`SeedableRng`] traits
and the [`Error`] type.
Crates implementing RNGs should depend on [`rand_core`].

Applications and libraries consuming random values are encouraged to use the
Rand crate, which re-exports the common parts of [`rand_core`].

## [Overview](overview.md)

A quick introduction to the various crates, modules and traits.

## [Feature flags](features.md)

A run-down of our feature gates (extra functionality).

## [Guide](guide.md)

Want an overview of how everything fits together? Or confused by some of the
terminology used in this lib? Read the guide.

## [Portability](portability.md)

"Random number generation" often involves producing deterministic yet "random"
data. If you wish to produce reproducible results (i.e. deterministic, stable
and portable), then you should read this chapter.

## [Updating](update.md)

A guide to upgrading to the next signficant version.

## [Contributing](contributing.md)

About contributing to the Rand project and running its tests and benchmarks.

[`rand_core`]: https://crates.io/crates/rand_core
[`RngCore`]: ../rand/rand_core/trait.RngCore.html
[`SeedableRng`]: ../rand/rand_core/trait.SeedableRng.html
[`Error`]: ../rand/rand_core/struct.Error.html
