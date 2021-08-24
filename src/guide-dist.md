# Random distributions

For maximum flexibility when producing random values, we define the
[`Distribution`] trait:

```rust
// a producer of data of type T:
pub trait Distribution<T> {
    // the key function:
    fn sample<R: Rng + ?Sized>(&self, rng: &mut R) -> T;

    // a convenience function defined using sample:
    fn sample_iter<R>(self, rng: R) -> DistIter<Self, R, T>
    where
        Self: Sized,
        R: Rng,
    { ... }
}
```

Rand provides implementations of many different distributions; we cover the most
common of these here, but for full details refer to the [`distributions`] module
and the [`rand_distr`] crate.

# Uniform distributions

The most obvious type of distribution is the one we already discussed: one
without pattern, where each value or range of values is equally likely. This is
known as *uniform*.

Rand actually has several variants of this, representing different ranges:

-   [`Standard`] requires no parameters and samples values uniformly according
    to the type. [`Rng::gen`] provides a short-cut to this distribution.
-   [`Uniform`] is parametrised by `Uniform::new(low, high)` (including `low`,
    excluding `high`) or `Uniform::new_inclusive(low, high)` (including both),
    and samples values uniformly within this range.
    [`Rng::gen_range`] is a convenience method defined over
    [`Uniform::sample_single`], optimised for single-sample usage.
-   [`Alphanumeric`] is uniform over the `char` values `0-9A-Za-z`.
-   [`Open01`] and [`OpenClosed01`] are provide alternate sampling ranges for
    floating-point types (see below).

## Uniform sampling by type

Lets go over the distributions by type:

-   For `bool`, [`Standard`] samples each value with probability 50%.
-   For `Option<T>`, the [`Standard`] distribution samples `None` with
    probability 50%, otherwise `Some(value)` is sampled, according to its type.
-   For integers (`u8` through to `u128`, `usize`, and `i*` variants),
    [`Standard`] samples from all possible values while
    [`Uniform`] samples from the parameterised range.
-   For `NonZeroU8` and other "non-zero" types, [`Standard`] samples uniformly
    from all non-zero values (rejection method).
-   `Wrapping<T>` integer types are sampled as for the corresponding integer
    type by the [`Standard`] distribution.
-   For floats (`f32`, `f64`),

    -   [`Standard`] samples from the half-open range `[0, 1)` with 24 or 53
        bits of precision (for `f32` and `f64` respectively)
    -   [`OpenClosed01`] samples from the half-open range `(0, 1]` with 24 or
        53 bits of precision
    -   [`Open01`] samples from the open range `(0, 1)` with 23 or 52 bits of
        precision
    -   [`Uniform`] samples from a given range with 23 or 52 bits of precision
-   For the `char` type, the [`Standard`] distribution samples from all
    available Unicode code points, uniformly; many of these values may not be
    printable (depending on font support). The [`Alphanumeric`] samples from
    only a-z, A-Z and 0-9 uniformly.
-   For tuples and arrays, each element is sampled as above, where supported.
    The [`Standard`] and [`Uniform`] distributions each support a selection of
    these types (up to 12-tuples and 32-element arrays).
    This includes the empty tuple `()` and array.
    When using `rustc` ≥ 1.51, enable the `min_const_gen` feature to support
    arrays larger than 32 elements.
-   For SIMD types, each element is sampled as above, for [`Standard`] and
    [`Uniform`] (for the latter, `low` and `high` parameters are *also* SIMD
    types, effectively sampling from multiple ranges simultaneously). SIMD
    support is gated behind a [feature flag](../features.html#simd-support).
-   For enums, you have to implement uniform sampling yourself. For example, you
    could use the following approach:
    ```rust
    pub enum Food {
        Burger,
        Pizza,
        Kebab,
    }

    impl Distribution<Food> for Standard {
        fn sample<R: Rng + ?Sized>(&self, rng: &mut R) -> Food {
            let index: u8 = rng.gen_range(0..3);
            match index {
                0 => Food::Burger,
                1 => Food::Pizza,
                2 => Food::Kebab,
                _ => unreachable!(),
            }
        }
    }
    ```

# Non-uniform distributions

Non-uniform distributions can be divided into two categories, as follows.
Some of these discrete and all of the continuous distributions have been moved
from the main [`rand`] crate to a dedicated [`rand_distr`] crate.

## Discrete non-uniform distributions

Discrete distributions sample from boolean or integer types. As above, these
can be sampled uniformly, or, as below, via a non-uniform distribution.

Potentially a discrete distribution could sample directly from a set of discrete
values such as a slice or an `enum`. See the section on [Sequences] regarding
Rand's traits for slice and iterator types. Rand does not provide direct
sampling from `enum`s, with the exception of `Option` (see above).

### Booleans

The [`Bernoulli`] distribution is a fancy name for generating a boolean
with a given a probability `p` of being `true`, or defined via a
`success : failure` ratio. Often this is described as a *trial* with
probability `p` of *success* (`true`).

The methods [`Rng::gen_bool`] and [`Rng::gen_ratio`] are short-cuts to this
distribution.

### Integers

The [`Binomial`] distribution is related to the [`Bernoulli`] in that it
models running `n` independent trials each with probability `p` of success,
then counts the number of successes.

Note that for large `n` the [`Binomial`] distribution's implementation is
much faster than sampling `n` trials individually.

The [`Poisson`] distribution expresses the expected number of events
occurring within a fixed interval, given that events occur with fixed rate λ.
[`Poisson`] distribution sampling generates `Float` values because `Float`s
are used in the sampling calculations, and we prefer to defer to the user on
integer types and the potentially lossy and panicking associated conversions.
For example, `u64` values can be attained with `rng.sample(Poisson) as u64`.

Note that out of range float to int conversions with `as` result in undefined
behavior for Rust <1.45 and a saturating conversion for Rust >=1.45.

### Weighted sequences

The [`WeightedIndex`] distribution samples an index from sequence of weights.
See the [Sequences] section for convenience wrappers directly sampling a slice
element.

For example, weighted sampling could be used to model the colour of a marble
sampled from a bucket containing 5 green, 15 red and 80 blue marbles.

Currently the Rand lib only implements *sampling with replacement*, i.e.
repeated sampling assumes the same distribution (that any sampled marble
has been replaced). An alternative distribution implementing
*sampling without replacement* has been
[requested](https://github.com/rust-random/rand/issues/596).

Note also that two implementations of [`WeightedIndex`] are available; the
first is optimised for a small number of samples while
[`alias_method::WeightedIndex`] is optimised for a large number of samples
(where "large" may mean "> 1000"; benchmarks recommended).

## Continuous non-uniform distributions

Continuous distributions model samples drawn from the real number line ℝ, or in
some cases a point from a higher dimension (ℝ², ℝ³, etc.). We provide
implementations for `f64` and for `f32` output in most cases, although currently
the `f32` implementations simply reduce the precision of an `f64` sample.

The exponential distribution, [`Exp`], simulates time until decay, assuming a
fixed rate of decay (i.e. exponential decay).

The [`Normal`] distribution (also known as Gaussian) simulates sampling from
the Normal distribution ("Bell curve") with the given mean and standard
deviation. The [`LogNormal`] is related: for sample `X` from the log-normal
distribution, `log(X)` is normally distributed; this "skews" the normal
distribution to avoid negative values and to have a long positive tail.

The [`UnitCircle`] and [`UnitSphereSurface`] distributions simulate uniform
sampling from the edge of a circle or surface of a sphere.

The [`Cauchy`] distribution (also known as the Lorentz distribution) is the
distribution of the x-intercept of a ray from point `(x0, γ)` with uniformly
distributed angle.

The [`Beta`] distribution is a two-parameter probability distribution, whose
output values lie between 0 and 1. The [`Dirichlet`] distribution is a
generalisation to any positive number of parameters.

[Sequences]: ../guide-seq.html
[`Distribution`]: ../rand/rand/distributions/trait.Distribution.html
[`distributions`]: ../rand/rand/distributions/index.html
[`rand`]: ../rand/rand/index.html
[`rand_distr`]: ../rand/rand_distr/index.html
[`Rng::gen_range`]: ../rand/rand/trait.Rng.html#method.gen_range
[`random`]: ../rand/rand/fn.random.html
[`Rng::gen_bool`]: ../rand/rand/trait.Rng.html#method.gen_bool
[`Rng::gen_ratio`]: ../rand/rand/trait.Rng.html#method.gen_ratio
[`Rng::gen`]: ../rand/rand/trait.Rng.html#method.gen
[`Rng`]: ../rand/rand/trait.Rng.html
[`Standard`]: ../rand/rand/distributions/struct.Standard.html
[`Uniform`]: ../rand/rand/distributions/struct.Uniform.html
[`Uniform::sample_single`]: ../rand/rand/distributions/struct.Uniform.html#method.sample_single
[`Alphanumeric`]: ../rand/rand/distributions/struct.Alphanumeric.html
[`Open01`]: ../rand/rand/distributions/struct.Open01.html
[`OpenClosed01`]: ../rand/rand/distributions/struct.OpenClosed01.html
[`Bernoulli`]: ../rand/rand/distributions/struct.Bernoulli.html
[`Binomial`]: ../rand/rand/distributions/struct.Binomial.html
[`Exp`]: ../rand/rand/distributions/struct.Exp.html
[`Normal`]: ../rand/rand/distributions/struct.Normal.html
[`LogNormal`]: ../rand/rand/distributions/struct.LogNormal.html
[`UnitCircle`]: ../rand/rand/distributions/struct.UnitCircle.html
[`UnitSphereSurface`]: ../rand/rand/distributions/struct.UnitSphereSurface.html
[`Cauchy`]: ../rand/rand/distributions/struct.Cauchy.html
[`Poisson`]: ../rand/rand/distributions/struct.Poisson.html
[`Beta`]: ../rand/rand/distributions/struct.Beta.html
[`Dirichlet`]: ../rand/rand/distributions/struct.Dirichlet.html
[`WeightedIndex`]: ../rand/rand/distributions/weighted/struct.WeightedIndex.html
[`alias_method::WeightedIndex`]: ../rand/rand/distributions/weighted/alias_method/struct.WeightedIndex.html
