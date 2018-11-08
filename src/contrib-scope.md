# Scope

The `rand_core` library has the following scope:

-   the core traits which RNGs may implement
-   tools for implementing these traits

The `rand` library has the following scope:

-   re-export all parts of `rand_core` applicable to end users
-   an interface to request entropy from an external source
-   hooks to provide entropy from several platform-specific sources
-   traits covering common RNG functionality
-   some PRNGs, notably `StdRng` and `SmallRng`
-   `thread_rng` auto-seeding source of randomness
-   conversion of random bits to common types and uses
-   shuffling and sampling from sequences
-   sampling from various random number distributions

The `rand_chacha`, `rand_hc`, `rand_isaac`, `rand_pcg` and `rand_xorshift`
libraries provide additional PRNGs.

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

## New distributions

Currently the `rand` lib and [`statrs`](https://github.com/boxtown/statrs) have
significant overlap in that both libraries implement sampling for many of the
same statistical distributions. Because of this, we are reluctant to accept new
sampling algorithms in Rand itself. This issue is not yet resolved (see #290).
