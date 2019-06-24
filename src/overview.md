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

The [`thread_rng()`] function provides a convenient, thread-local, auto-seeded,
crypto-grade random number generator.

## Consumers

The [`Rng`] trait provides a layer of convenience on top of [`RngCore`], whose
highlights are:

-   [`Rng::gen()`] provides a random value of any type supporting the [`Standard`] distribution.
-   [`Rng::gen_range(low, high)`] provides a uniform random value within the given range.
-   [`Rng::gen_bool(p)`] yields `true` with probability `p`.
-   [`Rng::sample(distribution)`] produces a value from the supplied `distribution`.
-   [`Rng::fill(dest)`] fills any "byte slice" with random data.

The [`random()`] function is a wrapper around [`Rng::gen()`] on [`thread_rng()`].

### Distributions

The [`distributions`] module governs conversion of random data to meaningful typed
random values. Key contents:

-   [`Distribution<T>`] is the trait governing production of values of type `T`
    from a configured distribution; its key function is [`Distribution::sample`].
-   [`Standard`] is a zero-config distribution supporting sampling of values in
    the "expected" manner for the given type (with explicit support for many
    different types, from ints to floats to tuples, arrays and `Option`).
-   [`Open01`] and [`OpenClosed01`] provide variations on sampling floating point
    values from the 0-1 range.
-   [`Uniform`] is the backbone behind [`Rng::gen_range(low, high)`], allowing uniform sampling
    from a configured type-specific range.

Many more distributions are available; consult the API documentation.

### Sequences

The [`seq`] module allows:

-   sampling one (`choose`) or multiple (`choose_multiple`) elements from iterators and slices
-   weighted sampling (`choose_weighted` via the `WeightedIndex` distribution)
-   shuffling a slice

[`prelude`]: ../rand/rand/prelude/index.html
[`distributions`]: ../rand/rand/distributions/index.html
[`Rng::gen_range(low, high)`]: ../rand/rand/trait.Rng.html#method.gen_range
[`random()`]: ../rand/rand/fn.random.html
[`Rng::fill(dest)`]: ../rand/rand/trait.Rng.html#method.fill
[`Rng::gen_bool(p)`]: ../rand/rand/trait.Rng.html#method.gen_bool
[`Rng::gen()`]: ../rand/rand/trait.Rng.html#method.gen
[`Rng::shuffle`]: ../rand/rand/trait.Rng.html#method.shuffle
[`RngCore`]: ../rand/rand/trait.RngCore.html
[`Rng`]: ../rand/rand/trait.Rng.html
[`Rng::fill(dest)`]: ../rand/rand/trait.Rng.html#method.fill
[`Rng::sample(distribution)`]: ../rand/rand/trait.Rng.html#method.sample
[`SeedableRng`]: ../rand/rand/trait.SeedableRng.html
[`seq`]: ../rand/rand/seq/index.html
[`SmallRng`]: ../rand/rand/rngs/struct.SmallRng.html
[`StdRng`]: ../rand/rand/rngs/struct.StdRng.html
[`thread_rng()`]: ../rand/rand/fn.thread_rng.html
[`Standard`]: ../rand/rand/distributions/struct.Standard.html
[`Uniform`]: ../rand/rand/distributions/struct.Uniform.html
[`rand`]: https://crates.io/crates/rand
[`rand_core`]: https://crates.io/crates/rand_core
[`FromEntropy`]: ../rand/rand/trait.FromEntropy.html
[`EntropyRng`]: ../rand/rand/rngs/struct.EntropyRng.html
[`Distribution<T>`]: ../rand/rand/distributions/trait.Distribution.html
[`Distribution::sample`]: ../rand/rand/distributions/trait.Distribution.html#tymethod.sample
[`Open01`]: ../rand/rand/distributions/struct.Open01.html
[`OpenClosed01`]: ../rand/rand/distributions/struct.OpenClosed01.html
[`OsRng`]: ../rand/rand/rngs/struct.OsRng.html
