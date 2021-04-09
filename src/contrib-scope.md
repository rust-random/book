# Scope

Over time, the scope of the project has grown, and Rand has moved from using a
monolithic crate to using a "main" crate plus multiple single-purpose crates.
For new functionality, one must consider where, and whether, it fits within the
Rand project.

Small, focussed crates may be used for a few reasons, but we aim *not* to
maximally divide functionality into small crates. Valid reasons for using a
separate crate for a feature are therefore:

-   to allow a clear dependency hierarchy (`rand_core`)
-   to make the feature available in a stand-alone fashion (e.g. `getrandom`)
-   to remove little-used features with non-trivial amounts of code from widely
    used crates (e.g. `rand_jitter` and `rand_distr` both extracted
    functionality from `rand`)
-   to allow choice, without including large amounts of unused code for all
    users, but also without producing an enormous number of new crates
    (RNG family crates like `rand_xoshiro` and `rand_isaac`)


## Traits, basics and UI

The main user interface to the Rand project remains the central `rand` crate.
Goals for this crate are:

-   ease of use
-   expose commonly used functionality in a single place
-   permit usage of additional randomness sources and distribution samplers

To allow better modularity, the core traits have been moved to the `rand_core`
crate. Goals of this crate are:

-   expose the core traits with minimal dependencies
-   provide common tools needed to implement various randomness sources

## External random sources

The main (and usually only) external source of randomness is the Operating
System, interfaced via the `getrandom` crate. This crate also supports usage of
RDRAND on a few `no_std` targets.

Support for other `no_std` targets has been discussed but with little real
implementation effort. See
[getrandom#4](https://github.com/rust-random/getrandom/issues/4).

The `rand_jitter` crate provides an implementation of a
[CPU Jitter](http://www.chronox.de/jent.html) entropy harvestor, and is only
included in Rand for historical reasons.


## Pseudo-random generators

The Rand library includes several pseudo-random number generators, for the
following reasons:

-   to implement the `StdRng` and `SmallRng` generators
-   to provide a few high-quality alternative generators
-   historical usage

These are implemented within "family" crates, e.g. `rand_chacha`, `rand_pcg`,
`rand_xoshiro`.

We have received several requests to adopt new algorithms into the library; when
evaluating such requests we must consider several things:

-   purpose for inclusion within Rand
-   whether the PRNG is cryptographically secure, and if so, how trustworthy
    such claims are
-   statistical quality of output
-   performance and features of the generator
-   reception and third-party review of the algorithm

## Distributions

The `Distribution` trait is provided by Rand, along with commonly-used
distributions (mostly linear ones).

Additional distributions are packaged within the `rand_distr` crate, which
depends on `rand` and re-exports all of its distributions.
