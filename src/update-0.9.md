# Updating to 0.9

In the following, instructions are provided for porting your code from
`rand 0.8` and `rand_distr 0.4` to `rand 0.9` and `rand_distr 0.5`.

The following is a migration guide focussing on potentially-breaking changes. For a full list of changes, see the relevant changelogs:

-   [CHANGELOG.md](https://github.com/rust-random/rand/blob/master/CHANGELOG.md).
-   [rand_core/CHANGELOG.md](https://github.com/rust-random/rand/blob/master/rand_core/CHANGELOG.md).
-   [rand_distr/CHANGELOG.md](https://github.com/rust-random/rand/blob/master/rand_distr/CHANGELOG.md).

## Renamed functions and methods

In the 2024 edition, [`gen` is a reserved keyword][gen-keyword]. The raw syntax `r#gen()` is awkward, so some methods in `rand::Rng` have been renamed:
- `gen` -> `random`
- `gen_range` -> `random_range`
- `gen_bool` -> `random_bool`
- `gen_ratio` -> `random_ratio`

Additionally, `rand::thread_rng()` has been renamed to the simpler `rng()`.

The previous names still exist but are deprecated.

[gen-keyword]: https://doc.rust-lang.org/edition-guide/rust-2024/gen-keyword.html

## Security

It was determined in [#1514](https://github.com/rust-random/rand/pull/1514) that
"rand is not a crypto library". This change clarifies that:

1.  The rand library is a community project without any legally-binding guarantees
2.  The rand library provides functionality for generating unpredictable random numbers but does not provide any high-level cryptographic functionality
3.  `rand::rngs::OsRng` is a stateless generator, thus has no state to leak or need for (re)seeding
4.  `rand::rngs::ThreadRng` is an automatically seeded generator with periodic reseeding using a cryptographically-strong pseudo-random algorithm, but which does not have protection of its in-memory state, in particular it does not automatically zero its memory when destructed. Further, its design is a compromise: it is designed to be a “fast, reasonably secure generator”.

Further, the former very limited fork-protection for [`ReseedingRng`] and [`ThreadRng`] were removed in [#1379](https://github.com/rust-random/rand/pull/1379). It is recommended instead that reseeding be the responsibility of the code causing the fork (see [`ThreadRng`] docs for more details):
```rust,ignore
fn do_fork() {
    let pid = unsafe { libc::fork() };
    if pid == 0 {
        // Reseed ThreadRng in child processes:
        rand::rng().reseed();
    }
}
```

## Dependencies

Rand crates now require **`rustc`** version 1.63.0 or later.

The dependency on **`getrandom`** was bumped to version 0.3.
[This release](https://github.com/rust-random/getrandom/blob/master/CHANGELOG.md#030---2025-01-25)
includes breaking changes for some platforms (WASM is particularly affected).

### Features

Feature flags:

-   `serde1` was renamed to `serde`
-   `getrandom` was renamed to `os_rng`
-   `thread_rng` is a new feature (enabled by default), required by [`rng()`] ([`ThreadRng`])
-   `small_rng` is now enabled by default
-   `rand_chacha` is no longer an (implicit) feature; use `std_rng` instead

## Core traits

In [#1424](https://github.com/rust-random/rand/pull/1424), a new trait, [`TryRngCore`], was added to [`rand_core`]:
```rust,ignore
pub trait TryRngCore {
    /// The type returned in the event of a RNG error.
    type Error: fmt::Debug + fmt::Display;

    /// Return the next random `u32`.
    fn try_next_u32(&mut self) -> Result<u32, Self::Error>;
    /// Return the next random `u64`.
    fn try_next_u64(&mut self) -> Result<u64, Self::Error>;
    /// Fill `dest` entirely with random data.
    fn try_fill_bytes(&mut self, dst: &mut [u8]) -> Result<(), Self::Error>;

    // [Provided methods hidden]
}
```
This trait is generic over both fallible and infallible RNGs (the latter use `Error` type [`Infallible`]), while [`RngCore`] now only represents infallible RNGs.

The trait [`CryptoRng`] is now a sub-trait of [`RngCore`]. A matching trait, [`TryCryptoRng`], is available to mark implementors of [`TryRngCore`] which are cryptographically strong.

### Seeding RNGs

The trait [`SeedableRng`] had a few changes:

-   `type Seed` now has additional bounds: `Clone` and `AsRef<[u8]>`
-   `fn from_rng` was renamed to `try_from_rng` while an infallible variant was added as the new `from_rng`
-   `fn from_entropy` was renamed to `from_os_rng` along with a new fallible variant, `fn try_from_os_rng`


## Generators

[`ThreadRng`] is now accessed via [`rng()`] (previously `thread_rng()`).


## Sequences

The old trait `SliceRandom` has been split into three traits: [`IndexedRandom`], [`IndexedMutRandom`] and [`SliceRandom`]. This allows `choose` functionality to be made available to `Vec`-like containers with non-contiguous storage, though `shuffle` functionality remains limited to slices.


## Distributions

The module `rand::distributions` was renamed to [`rand::distr`] for brevity and to match `rand_distr`.

Several items in `distr` were also renamed or moved:

-   Struct `Standard` -> `StandardUniform`
-   Struct `Slice` → `slice::Choose`
-   Struct `EmptySlice` → `slice::Empty`
-   Trait `DistString` → `SampleString`
-   Struct `DistIter` → `Iter`
-   Struct `DistMap` → `Map`
-   Struct `WeightedIndex` → `weighted::WeightedIndex`
-   Enum `WeightedError` → `weighted::Error`

Some additional items were renamed in `rand_distr`:

-   Struct `weighted_alias::WeightedAliasIndex` → `weighted::WeightedAliasIndex`
-   Trait `weighted_alias::AliasableWeight` → `weighted::AliasableWeight`

The [`StandardUniform`] distribution no longer supports sampling `Option<T>` types (for any `T`).

`isize` and `usize` types are no longer supported by [`Fill`], [`WeightedAliasIndex`] or [`StandardUniform`]. `isize` is also no longer supported by [`Uniform`]. `usize` remains supported by [`Uniform`] through [`UniformUsize`] and now has portable results across 32- and 64-bit platforms.

The constructors `fn new`, `fn new_inclusive` for [`Uniform`] and [`UniformSampler`] now return a [`Result`] instead of panicking on invalid inputs. Additionally, [`Uniform`] now supports [`TryFrom`] (instead of `From`) for range types.


## Nightly features

### SIMD

SIMD support now targets [`std::simd`].


## Reproducibility

See the `CHANGELOG.md` files for details of reproducibility-breaking changes affecting `rand` and `rand_distr`.


[`Fill`]: https://docs.rs/rand/latest/rand/trait.Fill.html
[`ThreadRng`]: https://docs.rs/rand/latest/rand/rngs/struct.ThreadRng.html
[`ReseedingRng`]: https://docs.rs/rand/latest/rand/rngs/struct.ReseedingRng.html
[`Uniform`]: https://docs.rs/rand/latest/rand/distr/struct.Uniform.html
[`UniformUsize`]: https://docs.rs/rand/latest/rand/distr/uniform/struct.UniformUsize.html
[`WeightedAliasIndex`]: https://docs.rs/rand_distr/latest/rand_distr/weighted_alias/struct.WeightedAliasIndex.html
[`rand_core`]: https://docs.rs/rand_core/
[`rand_distr`]: https://docs.rs/rand_distr/
[`RngCore`]: https://docs.rs/rand_core/latest/rand_core/trait.RngCore.html
[`TryRngCore`]: https://docs.rs/rand_core/latest/rand_core/trait.TryRngCore.html
[`Infallible`]: https://doc.rust-lang.org/std/convert/enum.Infallible.html
[`CryptoRng`]: https://docs.rs/rand/latest/rand/trait.CryptoRng.html
[`TryCryptoRng`]: https://docs.rs/rand/latest/rand/trait.TryCryptoRng.html
[`rng()`]: https://docs.rs/rand/latest/rand/fn.rng.html
[`SliceRandom`]: https://docs.rs/rand/latest/rand/seq/trait.SliceRandom.html
[`IndexedRandom`]: https://docs.rs/rand/latest/rand/seq/trait.IndexedRandom.html
[`IndexedMutRandom`]: https://docs.rs/rand/latest/rand/seq/trait.IndexedMutRandom.html
[`StandardUniform`]: https://docs.rs/rand/latest/rand/distr/struct.StandardUniform.html
[`UniformSampler`]: https://docs.rs/rand/latest/rand/distr/uniform/trait.UniformSampler.html
[`Result`]: https://doc.rust-lang.org/stable/std/result/enum.Result.html
[`TryFrom`]: https://doc.rust-lang.org/stable/std/convert/trait.TryFrom.html
[`SeedableRng`]: https://docs.rs/rand_core/latest/rand_core/trait.SeedableRng.html
[`rand::distr`]: https://docs.rs/rand/latest/rand/distr/index.html
[`std::simd`]: https://doc.rust-lang.org/stable/std/simd/index.html
