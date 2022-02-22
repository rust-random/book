# Updating to 0.7

Since the 0.6 release, [rust-random](https://github.com/rust-random)
gained a logo and a new crate: [getrandom]!

## Dependencies

Rand crates now require `rustc` version 1.32.0 or later.
This allowed us to remove all `build.rs` files for faster compilation.

The Rand crate now has fewer dependencies overall, though
with some new ones.

## Getrandom

As mentioned above, we have a new crate: [getrandom], delivering a minimal API
around platform-independent access to fresh entropy. This replaces the previous
implementation in [`OsRng`], which is now merely a wrapper.

## Core features

The [`FromEntropy`] trait has now been removed. Fear not though, its
[`from_entropy`] method continues to provide easy initialisation from its new
home in the [`SeedableRng`] trait (this requires that `rand_core` has the `std`
or `getrandom` feature enabled):
```rust
use rand::{SeedableRng, rngs::StdRng};
let mut rng = StdRng::from_entropy();
```

The [`SeedableRng::from_rng`] method is now considered value-stable:
implementations should have portable results.

The [`Error`] type of `rand_core` and `rand` has seen a major redesign; direct
usage of this type is likely to need adjustment.

## PRNGs

These have seen less change than in the previous release, but noteworthy is:

-   [`rand_chacha`](https://crates.io/crates/rand_chacha) has been rewritten
    for much better performance (via SIMD instructions)
-   [`StdRng`] and [`ThreadRng`] now use the ChaCha algorithm. This is a
    value-breaking change for [`StdRng`].
-   [`SmallRng`] is now gated behind the `small_rng` feature flag.
-   The `xoshiro` crate is now [`rand_xoshiro`](https://crates.io/crates/rand_xoshiro).
-   `rand_pcg` now includes [`Pcg64`].

## Distributions

For the most widely used distributions ([`Standard`] and [`Uniform`]), there have
been no significant changes. But for *most* of the rest...

-   We added a new crate, [`rand_distr`], to house the all distributions
    (including re-exporting those still within [`rand::distributions`]). If you
    previously used `rand::distributions::Normal`, now you use
    [`rand_distr::Normal`].
-   Constructors for many distributions changed in order to return a `Result`
    instead of panicking on error.
-   Many distributions are now generic over their parameter type (in most cases
    supporting `f32` and `f64`). This aids usage with generic code, and allows
    reduced size of parameterised distributions. Currently the more complex
    algorithms always use `f64` internally.
-   [`Standard`] can now sample [`NonZeroU*`] values

We also added several distributions:

-   [`rand::distributions::weighted::alias_method::WeightedIndex`]
-   [`rand_distr::Pert`]
-   [`rand_distr::Triangular`]
-   [`rand_distr::UnitBall`]
-   [`rand_distr::UnitDisc`]
-   [`rand_distr::UnitSphere`] (previously named `rand::distributions::UnitSphereSurface`)


## Sequences

To aid portability, all random samples of type `usize` now instead sample a
`u32` value when the upper-bound is less than `u32::MAX`. This means that
upgrading to 0.7 is a value-breaking change for use of `seq` functionality, but
that after upgrading to 0.7 results should be consistent across CPU
architectures.


[`from_entropy`]: https://rust-random.github.io/rand/rand/trait.SeedableRng.html#method.from_entropy
[`SeedableRng::from_rng`]: https://rust-random.github.io/rand/rand/trait.SeedableRng.html#method.from_rng
[`SmallRng`]: ../rand/rand/rngs/struct.SmallRng.html
[`StdRng`]: ../rand/rand/rngs/struct.StdRng.html
[`ThreadRng`]: ../rand/rand/rngs/struct.ThreadRng.html
[`Pcg64`]: ../rand/rand_pcg/type.Pcg64.html
[`rand::distributions::weighted::alias_method::WeightedIndex`]: https://docs.rs/rand/0.7/rand/distributions/weighted/alias_method/struct.WeightedIndex.html
[getrandom]: https://github.com/rust-random/getrandom
[`FromEntropy`]: https://docs.rs/rand/0.6.0/rand/trait.FromEntropy.html
[`SeedableRng`]: https://rust-random.github.io/rand/rand/trait.SeedableRng.html
[`Error`]: https://rust-random.github.io/rand/rand_core/struct.Error.html
[`Standard`]: ../rand/rand/distributions/struct.Standard.html
[`Uniform`]: ../rand/rand/distributions/struct.Uniform.html
[`rand::distributions`]: ../rand/rand/distributions/index.html
[`rand_distr`]: ../rand/rand_distr/index.html
[`rand_distr::Normal`]: ../rand/rand_distr/struct.Normal.html
[`NonZeroU*`]: https://doc.rust-lang.org/std/num/index.html
[`rand_distr::Pert`]: ../rand/rand_distr/struct.Pert.html
[`rand_distr::Triangular`]: ../rand/rand_distr/struct.Triangular.html
[`rand_distr::UnitBall`]: ../rand/rand_distr/struct.UnitBall.html
[`rand_distr::UnitDisc`]: ../rand/rand_distr/struct.UnitDisc.html
[`rand_distr::UnitSphere`]: ../rand/rand_distr/struct.UnitSphere.html
[`OsRng`]: ../rand/rand_core/struct.OsRng.html
