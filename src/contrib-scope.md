# Scope

The [`getrandom`](https://github.com/rust-random/getrandom/) library deals with
platform-specific interfaces.

The `rand_core` library has the following scope:

-   the core traits which RNGs may implement
-   tools for implementing these traits

The `rand` library has the following scope:

-   re-export all parts of `rand_core` applicable to end users
-   the `Rng` extension trait
-   misc. rngs: `thread_rng`, `StdRng`, `ReadRng`, `mock::StepRng`, etc.
-   `seq` functionality
-   the `Distribution` trait and most used implementations

The `rand_distr` library hosts additional random number distributions, and
re-exports all distributions provided by `rand`. Note that this crate has
significant functional overlap with `statrs`, however `rand_distr` focusses
almost exclusively on sampling (and doing so fast), while `statrs` includes
more functionality, e.g. PDFs, CDFs, `beta`, `gamma` and `error` functions.

The `rand_os` crate provides a simple wrapper around `getrandom`, which is
duplicated within the `rand` crate.

The `rand_jitter` crate houses `JitterRng`.

The `rand_chacha`, `rand_hc`, `rand_isaac`, `rand_pcg` and `rand_xorshift`
libraries provide additional PRNGs. They are recommended over `StdRng` and
`SmallRng` when reproducibility is needed.

## New PRNG Algorithms

The Rand library includes several pseudo-random number generators, for the
following reasons:

-   to implement the `StdRng` and `SmallRng` generators
-   to provide a strong, widely trusted CSPRNG (ChaCha)
-   historical usage

We have received several requests to adopt new algorithms into the library; when
evaluating such requests we must consider several things:

-   whether the PRNG is cryptographically secure, and if so, how trustworthy
    such claims are
-   statistical quality of output
-   performance and features of the generator
-   scope of the project
-   reception and third-party review of the algorithm
