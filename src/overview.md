# Overview

The Rand project provides a lot of functionality related to random numbers.
This can be divided into two topics: producing random numbers, and consuming
random numbers. More on this in [the guide](guide.md).

Much of what you need should be available in the prelude:
```rust
use rand::prelude::*;
```

## Producers

Tying produces and consumers together, we have the `RngCore` trait
(defined in `rand_core` but also available from `rand`).

All deterministic producers should implement `SeedableRng`, which concerns
seeding of PRNGs.

Any implementor of `SeedableRng` is automatically supported by `FromEntropy`
which allows easy construction from an external source of randomness. For more
direct usage, `EntropyRng` and `OsRng` directly provide data from external
sources.

Two "standard" PRNG algorithms are provided: `StdRng` and `SmallRng`.
Meanwhile many more are available from other crates, including several within
the scope of this project and several more outside of it.

The `thread_rng()` function provides a convenient, thread-local, auto-seeded,
crypto-grade random number generator.

## Consumers

The `Rng` trait provides a layer of convenience on top of `RngCore`, whose
highlights are:

-   `Rng::gen()` provides a random value of any type supporting the `Standard` distribution.
-   `Rng::gen_range(low, high)` provides a uniform random value within the given range.
-   `Rng::gen_bool(p)` yields `true` with probability `p`.
-   `Rng::sample(distribution)` produces a value from the supplied `distribution`.
-   `Rng::fill(dest)` fills any "byte slice" with random data.

The `random()` function is a wrapper around `Rng::gen` on `thread_rng()`.

### Distributions

The `distributions` module governs conversion of random data to meaningful typed
random values. Key contents:

-   `Distribution<T>` is the trait governing production of values of type `T`
    from a configured distribution; its key function is `Distribution::sample`.
-   `Standard` is a zero-config distribution supporting sampling of values in
    the "expected" manner for the given type (with explicit support for many
    different types, from ints to floats to tuples, arrays and `Option`).
-   `Open01` and `OpenClosed01` provide variations on sampling floating point
    values from the 0-1 range.
-   `Uniform` is the backbone behind `gen_range`, allowing uniform sampling
    from a configured type-specific range.

Many more distributions are available; consult the API documentation.

### Sequences

The `seq` module allows:

-   sampling one (`choose`) or multiple (`choose_multiple`) elements from iterators and slices
-   weighted sampling (`choose_weighted` via the `WeightedIndex` distribution)
-   shuffling a slice
