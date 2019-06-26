# Updating to 0.6

During the 0.6 cycle, Rand found a new home under the
[rust-random](https://github.com/rust-random) project. We already feel at home,
but if you'd like to help us decorate, a [new logo](https://github.com/rust-random/rand/issues/278) would be appreciated!

We also found a new home for user-centric documentation — this book!

## PRNGs

All PRNGs in our [old PRNG module](https://docs.rs/rand/0.5/rand/prng/index.html)
have been moved to new crates. We also added an additional crate with the PCG
algorithms, and an external crate with Xoshiro / Xoroshiro algorithms:

-   [`rand_chacha`](https://crates.io/crates/rand_chacha)
-   [`rand_hc`](https://crates.io/crates/rand_hc)
-   [`rand_isaac`](https://crates.io/crates/rand_isaac)
-   [`rand_xorshift`](https://crates.io/crates/rand_xorshift)
-   [`rand_pcg`](https://crates.io/crates/rand_pcg)
-   [`xoshiro`](https://crates.io/crates/xoshiro)

### SmallRng

This update, we switched the algorithm behind [`SmallRng`] from Xorshift to a
PCG algorithm (either [`Pcg64Mcg`] aka XSL 128/64 MCG, or [`Pcg32`] aka
XSH RR 64/32 LCG aka the standard PCG algorithm).


## Sequences

The [`seq` module](../rand/rand/seq/index.html) has been completely re-written,
and the `choose` and `shuffle` methods have been removed from the [`Rng`] trait.
Most functionality can now be found in the [`IteratorRandom`] and
[`SliceRandom`] traits.

### Weighted choices

The [`WeightedChoice`] distribution has now been replaced with
[`WeightedIndex`], solving a few issues by making the functionality more
generic.

For convenience, the [`SliceRandom::choose_weighted`] method (and `_mut`
variant) allow a [`WeightedIndex`] sample to be applied directly to a slice.

## Other features

### SIMD types

Rand now has rudimentary support for generating SIMD types, gated behind the
`simd_support` feature flag.

### `i128` / `u128` types

Since these types are now available on stable compilers, these types are
supported automatically (with recent enough Rust version). The `i128_support`
feature flag still exists to avoid breakage, but no longer does anything.


[`SmallRng`]: ../rand/rand/rngs/struct.SmallRng.html
[`Pcg32`]: ../rand/rand_pcg/type.Pcg32.html
[`Pcg64Mcg`]: ../rand/rand_pcg/type.Pcg64Mcg.html
[`Rng`]: ../rand/trait.Rng.html
[`IteratorRandom`]: ../rand/rand/seq/trait.IteratorRandom.html
[`SliceRandom`]: ../rand/rand/seq/trait.SliceRandom.html
[`WeightedChoice`]: https://docs.rs/rand/0.5/rand/distributions/struct.WeightedChoice.html
[`WeightedIndex`]: ../rand/rand/distributions/struct.WeightedIndex.html
[`SliceRandom::choose_weighted`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.choose_weighted
