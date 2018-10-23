# Random distributions

For maximum flexibility when producing random values, we define the
[`Distribution`] trait:

```rust
// a producer of data of type T:
pub trait Distribution<T> {
    // the key function:
    fn sample<R: Rng + ?Sized>(&self, rng: &mut R) -> T;

    // a convenience function defined using sample:
    fn sample_iter<'a, R>(&'a self, rng: &'a mut R) -> DistIter<'a, Self, R, T>
    where
        Self: Sized,
        R: Rng,
    { ... }
}
```

Rand provides implementations of many different distributions; for the full
list see the [`distributions`] module; the most common are highlighted below.

## Uniform distributions

The most obvious type of distribution is the one we already discussed: one
without pattern, where each value or range of values is equally likely. This is
known as *uniform*.

Rand actually has several variants of this:

-   [`Standard`] requires no parameters and produces uniformly distributed
    values over the entire range of the output type (for `bool` and integers)
    or over the range from 0 to 1 (for floats) or over valid unicode code
    points. It also has extensions to tuples, array types and `Option`.
-   [`Uniform`] is parameterised with `low` and `high` points, and produces
    values uniformly distributed within this range.
-   [`Alphanumeric`] is uniform over the values `0-9A-Za-z`
-   [`Open01`] and [`OpenClosed01`] are variations of [`Standard`] for floating
    point numbers between 0 and 1 (partially) exclusive of end points.

For convenience, [`Rng::gen`] and [`random`] are short-cuts to [`Standard`],
and [`Rng::gen_range`] is a short-cut to [`Uniform`], allowing things like:

```rust
# extern crate rand;
# use rand::prelude::*;
let mut rng = thread_rng();
let cood: (f64, f64) = rng.gen();
let die_roll = rng.gen_range(1, 7);
```

## More continuous distributions

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

## Probability distributions

The [`Bernoulli`] distribution is very simple: given a probability `p` (or a
ratio `num / denom`), a boolean value is produced with the given probability
of being `true` (simulating a trial with probability `p` of success).

For convenience, [`Rng::gen_bool`] and [`Rng::gen_ratio`] are short-cuts to [`Bernoulli`].

The [`Binomial`] distribution is related: given a probability `p` and a number
`n`, this distribution simulates running `n` Bernoulli trials and tells you the
number which were successful.

The [`Poisson`] distribution expresses the expected number of events occurring
within a fixed interval, given that events occur with fixed rate λ.

The [`Beta`] distribution is a two-parameter probabilty distribution, whose
output values lie between 0 and 1. The [`Dirichlet`] distribution is a
generalisation to any positive number of parameters.

## Weighted sampling

Finally, [`WeightedIndex`] is a discrete distribution sampling from a finite
selection of choices each with given weight.

[`Distribution`]: ../rand/rand/distributions/trait.Distribution.html
[`distributions`]: ../rand/rand/distributions/index.html
[`Rng::gen_range`]: ../rand/rand/trait.Rng.html#method.gen_range
[`random`]: ../rand/rand/fn.random.htm
[`Rng::gen_bool`]: ../rand/rand/trait.Rng.html#method.gen_bool
[`Rng::gen_ratio`]: ../rand/rand/trait.Rng.html#method.gen_ratio
[`Rng::gen`]: ../rand/rand/trait.Rng.html#method.gen
[`Rng`]: ../rand/rand/trait.Rng.html
[`Standard`]: ../rand/rand/distributions/struct.Standard.html
[`Uniform`]: ../rand/rand/distributions/struct.Uniform.html
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
[`WeightedIndex`]: ../rand/rand/distributions/struct.WeightedIndex.html
