# Reproducibility

The `rust-random` libraries make limited commitments to reproducibility of seedable PRNGs and stochastic algorithms.

This chapter concerns value-stability of deterministic processes using the `rust-random` libraries.

## API-breaking, value-breaking and SemVer

A change (to a library) is considered **API-breaking** if it may cause a compilation failure of code which was compatible with a prior version of the API, or is otherwise an incompatible change.

We aim to follow [SemVer rules](https://semver.org/) regarding API-breaking changes and `MAJOR.MINOR.PATCH` versions. That is, post 1.0, new minor versions should not introduce API-breaking changes.

A change is considered **value-breaking** if it is not API-breaking yet would result in changed output values of a deterministic stochastic process using only unchanged parts of the `rust-random` API.

Value-breaking changes are permitted in minor versions.

## Non-portable deterministic items

An item in a `rust-random` API (such as a struct or function) may be declared to be **non-portable**, meaning that it opts out of all reproducibility guarantees. Non-portable items may be deterministic, yet yield different results on different platforms and library versions (they may make value-breaking changes in any release).

This is a change in policy affecting `rand` from version `0.10` or `1.0` (whichever release is next); up to version `0.9` non-portable items were not permitted to make value-breaking changes in patch releases.

This non-portable declaration must be clearly mentioned in documentation. The following items make such a declaration:

-   [`rand::rngs::SmallRng`](https://docs.rs/rand/latest/rand/rngs/struct.SmallRng.html)
-   [`rand::rngs::StdRng`](https://docs.rs/rand/latest/rand/rngs/struct.StdRng.html)

## Portable items

Some items are clearly non-deterministic (e.g. [`rand::rng`]). Some items are deterministic but non-portable (above). All other parts of the public API of `rust-random` crates (including PRNGs, distributions and other stochastic algorithms) are expected to be portable:

-   Results should be reproducible across platforms
-   Results should be reproducible across patch releases
-   Minor releases, including after 1.0, may make value-breaking changes to portable items. Such changes must be well motivated and should be clearly mentioned in the CHANGELOG.

### Testing

We expect all portable stochastic algorithms to test the value-stability of their output with some form of test vector.

-   PRNGs should test against a reference vector where available ([example](https://github.com/rust-random/rngs/blob/master/rand_xoshiro/src/xoshiro256starstar.rs#L122))
-   Other algorithms should include their own test vectors within a
    `value_stability` test or similar ([example](https://github.com/rust-random/rand/blob/master/src/distr/bernoulli.rs#L226))

## Support for prior versions

We aim to support users of `rust-random` crates using a prior `MAJOR.MINOR` version for the purposes of reproducibility by:

-   Providing security fixes as patch versions where appropriate
-   Facilitating the back-porting of compatible additions from future crate versions *on request*
-   Other fixes may be considered for back-porting, but are often not possible without API-breaking or value-breaking changes

## Limitations

### Portability of usize

There is unfortunately one non-portable item baked into the heart of the Rust
language: `usize` (and `isize`). For example, the size of an empty
`Vec` will differ on 32-bit and 64-bit targets. For most purposes this is not an
issue, but when it comes to generating random numbers in a portable manner
it does matter.

A simple rule follows: if portability is required, *never* sample a `usize` or
`isize` value directly.

From `rand v0.9`, `isize` and `usize` types are no longer supported in many parts of the public API, including [`StandardUniform`]. `usize` is supported by [`SampleUniform`] and thus [`Rng::random_range`], using `u32` sampling whenever possible to maximise portability.

### Portability of floats

The results of floating point arithmetic depend on rounding modes and
implementation details. In particular, the results of transcendental functions vary
from platform to platform. Due to this, results of distributions in `rand_distr` using `f32` or `f64` may not be portable.

To alleviate (or further complicate) this concern, we prefer to use `libm` over `std` implementations of these transcendental functions. See [rand_distr features](crate-features.html#rand_distr-features).

[`rand::rng`]: https://docs.rs/rand/latest/rand/fn.rng.html
[`StandardUniform`]: https://docs.rs/rand/latest/rand/distr/struct.StandardUniform.html
[`SampleUniform`]: https://docs.rs/rand/latest/rand/distr/uniform/trait.SampleUniform.html
[`Rng::random_range`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random_range
