# Reproducibility

## Definitions

Given fixed inputs, all items (should) fall into one of three categories:

-   Output is non-deterministic, thus never reproducible
-   Output is deterministic, but not considered portable
-   Output is deterministic and portable

In general, functionality is considered deterministic and portable *unless*
it is clearly non-deterministic (e.g. `getrandom`, `ThreadRng`) *or* it is
documented as being unportable (e.g. `StdRng`, `SmallRng`).

## Crate versions

We try to follow [semver rules](https://semver.org/) regarding
API-breaking changes and `MAJOR.MINOR.PATCH` versions:

-   New *patch* versions should not include API-breaking changes or major new
    features
-   Before 1.0, *minor* versions may include API breaking changes. After 1.0
    they should not.

Additionally, we must also consider *value-breaking changes* and *portability*.
When given fixed inputs,

-   For non-deterministic items, implementations may change in any release
-   For deterministic unportable items, output should be preserved in patch
    releases, but may change in any minor release (including after 1.0)
-   For portable items, any change of output across versions is considered
    equivalent to an API breaking change.

### Testing

We expect all pseudo-random algorithms to test the value-stability of their
output, where possible:

-   PRNGs should be compared with a reference vector ([example](https://github.com/rust-random/rngs/blob/master/rand_xoshiro/src/xoshiro256starstar.rs#L115))
-   Other algorithms should include their own test vectors within a
    `value_stability` test or similar ([example](https://github.com/rust-random/rand/blob/master/src/distributions/bernoulli.rs#L203))

## Limitations

### Portability of usize

There is unfortunately one non-portable item baked into the heart of the Rust
language: `usize` (and `isize`). For example, the size of an empty
`Vec` will differ on 32-bit and 64-bit targets. For most purposes this is not an
issue, but when it comes to generating random numbers in a portable manner
it does matter.

A simple rule follows: if portability is required, *never* sample a `usize` or
`isize` value directly.

Within Rand we adhere to this rule whenever possible. All sequence-related
code requiring a bounded `usize` value will sample a `u32` value unless the
upper bound exceeds `u32::MAX`.
(Note that this actually improves benchmark performance in many cases.)

### Portability of floats

The results of floating point arithmetic depend on rounding modes and
implementation details. In particular, the results of transcendental functions vary
from platform to platform. Due to this, results of distributions in `rand_distr` using `f32` or `f64` may not be portable.

To aleviate (or further complicate) this concern, we prefer to use `libm` over `std` implementations of these transcendental functions. See [rand_distr features](crate-features.html#rand_distr-features).
