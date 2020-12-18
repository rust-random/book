# Updating to 0.8

In the following, instructions are provided for porting your code from
`rand 0.7` and `rand_distr 0.2` to `rand 0.8` and `rand_distr 0.3`.

## Dependencies

Rand crates now require `rustc` version 1.36.0 or later.
This allowed us to remove some unsafe code and simplify the internal `cfg` logic.

The dependency on `getrandom` was bumped to version 0.2. While this does not
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


## Core features

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

[`Rng::gen_range`] now takes a `Range` instead of two numbers. This requires
replacing `gen_range(a, b)` with `gen_range(a..b)` in code written for `rand
0.7`. We suggest to replace the regular expression
`gen_range\(([^,]*),\s*([^)]*)\)` with `gen_range(\1..\2)` (or
`gen_range($1..$2)` in some tools without support for backreferences).
Additionally, if `a` or `b` were a reference, explicit dereferencing may now be
required. Inclusive ranges are now supported: `gen_range(a, b + 1)` can be
replaced with `gen_range(a..=b)`.

The `AsByteSliceMut` trait was replaced with the [`Fill`] trait. This should
only affect code implementing `AsByteSliceMut` on user-defined types, so they
are supported by [`Rng::fill`] and [`Rng::try_fill`]. Now, the [`Fill`] trait
has to be implemented instead: Rather than providing a mutable byte slice, the
user-defined type must be filled with random data.

The entire [`rand::rngs::adapter`] module is now restricted to the `std` feature.
While this is technically a breaking change, it should only affect `no_std` code
using [`ReseedingRng`], which is unlikely to exist in the wild.

## PRNGs

These have seen only small changes, but noteworthy is:

-   [`StdRng`] and [`ThreadRng`] now use the ChaCha12 instead of the ChaCha20
    algorithm. This improves performance and is a value-breaking change for
    [`StdRng`].
-   [`SmallRng`] now uses the Xoshiro128++ and Xoshiro256++ algorithm on 32-bit
    and 64-bit platforms respectively. This reduces correlations of random data
    generated from similar seeds, improves performance and is a value-breaking
    change.
-   [`StdRng`], [`SmallRng`], and [`StepRng`] now implement `PartialEq` and `Eq`.

## Distributions

The most widely used distributions ([`Standard`] and [`Uniform`]), were not
significantly changed. Only the following distributions suffered breaking
changes:

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

Additonally, there were some minor improvements:

-   The treatment of rounding errors and NaN was improved for the
    [`WeightedIndex`] distribution.
-   The [`UniformInt`] and [`WeightedIndex`] distributions now support serialization
    via the `serde1` feature.
-   The [`rand_distr::Exp`] distribution now supports the `lambda = 0` parametrization.

We also added several distributions:

-   [`rand_distr::WeightedAliasIndex`] (moved from the `rand` crate)
-   [`rand_distr::InverseGaussian`]
-   [`rand_distr::NormalInverseGaussian`]

The `nightly` feature no longer implies the `simd_support` feature. If you were
relying on this for SIMD support, you will have to use `simd_support` feature
directly.

## Sequences

Weighted sampling without replacement is now supported, see
[`rand::seq::index::sample_weighted`] and
[`SliceRandom::choose_multiple_weighted`].

There have been [value-breaking
changes](https://github.com/rust-random/rand/pull/1059) to
[`IteratorRandom::choose`], improving accuracy and performance. Furthermore,
[`IteratorRandom::choose_stable`] was added to provide an alternative that
sacrifices performance for independence of iterator size hints.


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
[`Alphanumeric`]: ../rand/rand/distributions/struct.Alphanumeric.html
[`WeightedIndex`]: ../rand/rand/distributions/struct.WeightedIndex.html
[`rand::rngs::adapter`]: ../rand/rand/rngs/adapter/index.html
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
