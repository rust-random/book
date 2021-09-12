# Updating to 0.8

In the following, instructions are provided for porting your code from
`rand 0.7` and `rand_distr 0.2` to `rand 0.8` and `rand_distr 0.3`.

## Dependencies

Rand crates now require **`rustc`** version 1.36.0 or later.
This allowed us to remove some unsafe code and simplify the internal `cfg` logic.

The dependency on **`getrandom`** was bumped to version 0.2. While this does not
affect Rand's API, you may be affected by some of the breaking changes even if
you use `getrandom` only as a dependency:

-    You may have to update the `getrandom` features you are using. The
     following features are now available:
     -   `"rdrand"`: Use the RDRAND instruction on `no_std` `x86/x86_64`
         targets.
     -   `"js"`: Use JavaScript calls on `wasm32-unknown-unknown`. This
         replaces the `stdweb` and `wasm-bindgen` features, which are
         removed.
     -   `"custom"`: Allows you to specify a custom implementation.
-   Unsupported targets no longer compile. If you require the previous behavior
    (panicking at runtime instead of failing to compile), you can use the
    `custom` feature to provide a panicking implementation.
-   Windows XP and stdweb are, as of `getrandom` version 0.2.1, no longer
    supported. If you require support for either of these platforms you may add
    a dependency on `getrandom = "=0.2.0"` to pin this version.
-   Hermit, L4Re and UEFI are no longer officially supported. You can use the
    `rdrand` feature on these platforms.
-   The minimum supported Linux kernel version is now 2.6.32.

If you are using `getrandom`'s API directly, there are further breaking changes
that may affect you. See its
[changelog](https://github.com/rust-random/getrandom/blob/master/CHANGELOG.md#020---2020-09-10).

[Serde] has been re-added as an optional dependency (use the `serde1` feature
flag), supporting many types (where appropriate). `StdRng` and `SmallRng` are
deliberately excluded since these types are not portable.

## Core features

#### `ThreadRng`

`ThreadRng` no longer implements `Copy`. This was necessary to fix a possible
use-after-free in its thread-local destructor. Any code relying on `ThreadRng`
being copied must be updated to use a mutable reference instead. For example,
```
let rng = thread_rng();
let a: u32 = Standard.sample(rng);
let b: u32 = Standard.sample(rng);
```
can be replaced with the following code:
```
let mut rng = thread_rng();
let a: u32 = Standard.sample(&mut rng);
let b: u32 = Standard.sample(&mut rng);
```

#### `gen_range`

[`Rng::gen_range`] now takes a `Range` instead of two numbers. Thus, replace
`gen_range(a, b)` with `gen_range(a..b)`. We suggest using the following regular
expression to search-replace in all files:

-   replace `gen_range\(([^,]*),\s*([^)]*)\)`
-   with `gen_range(\1..\2)`
-   or with `gen_range($1..$2)` (if your tool does not support backreferences)

Most IDEs support search-replace-across-files or similar; alternatively an
external tool such as Regexxer may be used.

This change has a couple of other implications:

-   inclusive ranges are now supported, e.g. `gen_range(1..=6)` or `gen_range('A'..='Z')`
-   it may be necessary to explicitly dereference some parameters
-   SIMD types are no longer supported (`Uniform` types may still be used directly)

#### `fill`

The `AsByteSliceMut` trait was replaced with the [`Fill`] trait. This should
only affect code implementing `AsByteSliceMut` on user-defined types, since the
[`Rng::fill`] and [`Rng::try_fill`] retain support for previously-supported types.

`Fill` supports some additional slice types which could not be supported with
`AsByteSliceMut`: `[bool], [char], [f32], [f64]`.

#### `adapter`

The entire [`rand::rngs::adapter`] module is now restricted to the `std` feature.
While this is technically a breaking change, it should only affect `no_std` code
using [`ReseedingRng`], which is unlikely to exist in the wild.

## Generators

**StdRng** has switched from the 20-round ChaCha20 to ChaCha12 for improved
performance. This is a reduction in complexity but the 12-round variant is still
considered secure: see [rand#932]. This is a value-breaking change for `StdRng`.

**SmallRng** now uses the Xoshiro128++ and Xoshiro256++ algorithm on 32-bit
and 64-bit platforms respectively. This reduces correlations of random data
generated from similar seeds and improves performance. It is a value-breaking
change.

We now implement `PartialEq` and `Eq` for [`StdRng`], [`SmallRng`], and [`StepRng`].

## Distributions

Several smaller changes occurred to rand distributions:

-   The [`Uniform`] distribution now additionally supports the `char` type, so
    for example `rng.gen_range('a'..='f')` is now supported.
-   [`UniformSampler::sample_single_inclusive`] was added.
-   The [`Alphanumeric`] distribution now samples bytes instead of chars. This
    more closely reflects the internally used type, but old code likely has to
    be adapted to perform the conversion from `u8` to `char`. For example, with
    Rand 0.7 you could write:
    ```
    let chars: String = iter::repeat(())
        .map(|()| rng.sample(Alphanumeric))
        .take(7)
        .collect();
    ```
    With Rand 0.8, this is equivalent to the following:
    ```
    let chars: String = iter::repeat(())
        .map(|()| rng.sample(Alphanumeric))
        .map(char::from)
        .take(7)
        .collect();
    ```
-   The alternative implementation of [`WeightedIndex`] employing the alias
    method was moved from `rand` to [`rand_distr::WeightedAliasIndex`]. The
    alias method is faster for large sizes, but it suffers from a slow
    initialization, making it less generally useful.

In `rand_distr` v0.4, more changes occurred (since v0.2):

-   [`rand_distr::WeightedAliasIndex`] was added (moved from the `rand` crate)
-   [`rand_distr::InverseGaussian`] and [`rand_distr::NormalInverseGaussian`]
    were added
-   The [`Geometric`] and [`Hypergeometric`] distributions are now supported.
-   A different algorithm is used for the [`Beta`] distribution, improving both
    performance and accuracy. This is a value-breaking change.
-   The [`Normal`] and [`LogNormal`] distributions now support a `from_mean_cv`
    constructor method and `from_zscore` sampler method.
-   [`rand_distr::Dirichlet`] now uses boxed slices internally instead of `Vec`.
    Therefore, the weights are taken as a slice instead of a `Vec` as input.
    For example, the following `rand_distr 0.2` code
    ```
    Dirichlet::new(vec![1.0, 2.0, 3.0]).unwrap();
    ```
    can be replaced with the following `rand_distr 0.3` code:
    ```
    Dirichlet::new(&[1.0, 2.0, 3.0]).unwrap();
    ```
-   [`rand_distr::Poisson`] does no longer support sampling `u64` values directly.
    Old code may have to be updated to perform the conversion from `f64`
    explicitly.
-   The custom `Float` trait in `rand_distr` was replaced with
    `num_traits::Float`. Any implementations of `Float` for user-defined types
    have to be migrated. Thanks to the math functions from `num_traits::Float`,
    `rand_distr` now supports `no_std`.

Additionally, there were some minor improvements:

-   The treatment of rounding errors and NaN was improved for the
    [`WeightedIndex`] distribution.
-   The [`rand_distr::Exp`] distribution now supports the `lambda = 0` parametrization.


## Sequences

Weighted sampling without replacement is now supported, see
[`rand::seq::index::sample_weighted`] and
[`SliceRandom::choose_multiple_weighted`].

There have been [value-breaking
changes](https://github.com/rust-random/rand/pull/1059) to
[`IteratorRandom::choose`], improving accuracy and performance. Furthermore,
[`IteratorRandom::choose_stable`] was added to provide an alternative that
sacrifices performance for independence of iterator size hints.

## Feature flags

`StdRng` is now gated behind a new feature flag, `std_rng`. This is enabled by
default.

The `nightly` feature no longer implies the `simd_support` feature. If you were
relying on this for SIMD support, you will have to use `simd_support` feature
directly.

## Tests

Value-stability tests were added for all distributions ([rand#786]), helping
enforce our rules regarding value-breaking changes (see [Portability] section).


[`Fill`]: ../rand/rand/trait.Fill.html
[`Rng::gen_range`]: ../rand/rand/trait.Rng.html#method.gen_range
[`Rng::fill`]: ../rand/rand/trait.Rng.html#method.fill
[`Rng::try_fill`]: ../rand/rand/trait.Rng.html#method.try_fill
[`SmallRng`]: ../rand/rand/rngs/struct.SmallRng.html
[`StdRng`]: ../rand/rand/rngs/struct.StdRng.html
[`StepRng`]: ../rand/rand/rngs/struct.StepRng.html
[`ThreadRng`]: ../rand/rand/rngs/struct.ThreadRng.html
[`ReseedingRng`]: ../rand/rand/rngs/adapter/struct.ReseedingRng.html
[`Standard`]: ../rand/rand/distributions/struct.Standard.html
[`Uniform`]: ../rand/rand/distributions/struct.Uniform.html
[`UniformInt`]: ../rand/rand/distributions/struct.UniformInt.html
[`UniformSampler::sample_single_inclusive`]: ../rand/rand/distributions/uniform/trait.UniformSampler.html#method.sample_single_inclusive
[`Alphanumeric`]: ../rand/rand/distributions/struct.Alphanumeric.html
[`WeightedIndex`]: ../rand/rand/distributions/struct.WeightedIndex.html
[`rand::rngs::adpater`]: ../rand/rand/rngs/adapter/index.html
[`rand::seq::index::sample_weighted`]: ../rand/rand/seq/index/fn.sample_weighted.html
[`SliceRandom::choose_multiple_weighted`]: ../rand/rand/seq/trait.SliceRandom.html#method.choose_multiple_weighted
[`IteratorRandom::choose`]: ../rand/rand/seq/trait.IteratorRandom.html#method.choose
[`IteratorRandom::choose_stable`]: ../rand/rand/seq/trait.IteratorRandom.html#method.choose_stable
[`rand_distr::WeightedAliasIndex`]: ../rand/rand_distr/struct.WeightedAliasIndex.html
[`rand_distr::InverseGaussian`]: ../rand/rand_distr/struct.InverseGaussian.html
[`rand_distr::NormalInverseGaussian`]: ../rand/rand_distr/struct.NormalInverseGaussian.html
[`rand_distr::Dirichlet`]: ../rand/rand_distr/struct.Dirichlet.html
[`rand_distr::Poisson`]: ../rand/rand_distr/struct.Poisson.html
[`rand_distr::Exp`]: ../rand/rand_distr/struct.Exp.html
[`Geometric`]: ../rand/rand_distr/struct.Geometric.html
[`Hypergeometric`]: ../rand/rand_distr/struct.Hypergeometric.html
[`Beta`]: ../rand/rand_distr/struct.Beta.html
[`Normal`]: ../rand/rand_distr/struct.Normal.html
[`LogNormal`]: ../rand/rand_distr/struct.LogNormal.html
[rand#932]: https://github.com/rust-random/rand/issues/932
[rand#786]: https://github.com/rust-random/rand/issues/786
[Portability]: ./portability.html
[Serde]: https://serde.rs/
