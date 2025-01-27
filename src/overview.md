# Overview

This section provides a birds-eye view of Rand. If you want more details,
skip to the next section, [the guide](guide.md).

## Producers

Tying produces and consumers together, we have the [`RngCore`] trait
(defined in [`rand_core`] but also available from [`rand`]).

All deterministic producers should implement [`SeedableRng`], which concerns
seeding of PRNGs.

Any implementer of [`SeedableRng`] is automatically supported by [`FromEntropy`]
which allows easy construction from an external source of randomness. For more
direct usage, [`EntropyRng`] and [`OsRng`] directly provide data from external
sources.

Two "standard" PRNG algorithms are provided: [`StdRng`] and [`SmallRng`].
Meanwhile many more are available from other crates, including several within
the scope of this project and several more outside of it.

The [`rng()`] function provides a convenient, thread-local, auto-seeded,
crypto-grade random number generator.

## Consumers

The [`Rng`] trait provides a layer of convenience on top of [`RngCore`], whose
highlights are:

-   [`Rng::random()`] provides a random value of any type supporting the [`StandardUniform`] distribution.
-   [`Rng::random_range(low..high)`] provides a uniform random value within the
    given range. A range includes the lower bound `low` and excludes the upper
    bound `high`.
-   [`Rng::random_range(low..=high)`] provides a uniform random value within the
    given inclusive range. Here the range is inclusive of both the lower bound
    `low` and the upper bound `high`.
-   [`Rng::random_bool(p)`] yields `true` with probability `p`.
-   [`Rng::sample(distribution)`] produces a value from the supplied `distribution`.
-   [`Rng::fill(dest)`] fills any "byte slice" with random data.

The [`random()`] function is a wrapper around [`Rng::random()`] on [`rng()`].

### Distributions

The [`distr`] module governs conversion of random data to meaningful typed
random values. Key contents:

-   [`Distribution<T>`] is the trait governing production of values of type `T`
    from a configured distribution; its key function is [`Distribution::sample`].
-   [`StandardUniform`] is a zero-config distribution supporting sampling of values in
    the "expected" manner for the given type (with explicit support for many
    different types, from ints to floats to tuples, arrays and `Option`).
-   [`Open01`] and [`OpenClosed01`] provide variations on sampling floating point
    values from the 0-1 range.
-   [`Uniform`] is the backbone behind [`Rng::random_range(low..high)`], allowing uniform sampling
    from a configured type-specific range.

Many more distributions are available; consult the API documentation.

### Sequences

The [`seq`] module allows:

-   sampling one (`choose`) or multiple (`choose_multiple`) elements from iterators and slices
-   weighted sampling (`choose_weighted` via the `WeightedIndex` distribution)
-   shuffling a slice

[`prelude`]: https://docs.rs/rand/latest/rand/prelude/
[`distr`]: https://docs.rs/rand/latest/rand/distr/
[`Rng::random_range(low..high)`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random_range
[`Rng::random_range(low..=high)`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random_range
[`random()`]: https://docs.rs/rand/latest/rand/fn.random.html
[`Rng::fill(dest)`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.fill
[`Rng::random_bool(p)`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random_bool
[`Rng::random()`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random
[`Rng::shuffle`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.shuffle
[`RngCore`]: https://docs.rs/rand/latest/rand/trait.RngCore.html
[`Rng`]: https://docs.rs/rand/latest/rand/trait.Rng.html
[`Rng::fill(dest)`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.fill
[`Rng::sample(distribution)`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.sample
[`SeedableRng`]: https://docs.rs/rand/latest/rand/trait.SeedableRng.html
[`seq`]: https://docs.rs/rand/latest/rand/seq/
[`SmallRng`]: https://docs.rs/rand/latest/rand/rngs/struct.SmallRng.html
[`StdRng`]: https://docs.rs/rand/latest/rand/rngs/struct.StdRng.html
[`rng()`]: https://docs.rs/rand/latest/rand/fn.rng.html
[`StandardUniform`]: https://docs.rs/rand/latest/rand/distr/struct.StandardUniform.html
[`Uniform`]: https://docs.rs/rand/latest/rand/distr/struct.Uniform.html
[`rand`]: https://crates.io/crates/rand
[`rand_core`]: https://crates.io/crates/rand_core
[`FromEntropy`]: https://docs.rs/rand/latest/rand/trait.FromEntropy.html
[`EntropyRng`]: https://docs.rs/rand/latest/rand/rngs/struct.EntropyRng.html
[`Distribution<T>`]: https://docs.rs/rand/latest/rand/distr/trait.Distribution.html
[`Distribution::sample`]: https://docs.rs/rand/latest/rand/distr/trait.Distribution.html#tymethod.sample
[`Open01`]: https://docs.rs/rand/latest/rand/distr/struct.Open01.html
[`OpenClosed01`]: https://docs.rs/rand/latest/rand/distr/struct.OpenClosed01.html
[`OsRng`]: https://docs.rs/rand/latest/rand/rngs/struct.OsRng.html
