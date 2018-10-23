# Error handling

Error handling in Rand is a compromise between simplicity and necessity.
Most RNGs and sampling functions will never produce errors, and making these
able to handle errors would add significant overhead (to code complexity
and ergonomics of usage at least, and potentially also performance,
depending on the approach).
However, external RNGs can fail, and being able to handle this is important.

It has therefore been decided that *most* methods should not return a
`Result` type, but with a few important exceptions, namely:

-   [`Rng::try_fill`]
-   [`RngCore::try_fill_bytes`]
-   [`SeedableRng::from_rng`]

Most functions consuming random values will not attempt any error handling, and
reduce to calls to [`RngCore`]'s "infallible" methods. Since most RNGs cannot
fail anyway this is usually not a problem, but the few generators which can may
be forced to fail in this case:

-   [`OsRng`] interfaces with the Operating System's generator; in rare cases
    this may fail as "not ready" or simply "unavailable".
-   [`JitterRng`] is a generator based on timer jitter; if the timer does not
    appear to be capable of sufficient precision or is too predictable, this
    will fail.
-   [`EntropyRng`] is an abstraction over the above, falling back to the next
    option when the first fails but ultimately failing if all sources fail
-   [`thread_rng`] seeds itself via [`EntropyRng`], thus can potentially fail
    on its first use on each thread (though it never fails after the first use)
-   [`ReadRng`] tries to read data from its source but fails when the stream
    ends or errors (though it retries on interrupt).

[`Rng::try_fill`]: ../rand/rand/trait.Rng.html#method.try_fill
[`RngCore::try_fill_bytes`]: ../rand/rand_core/trait.RngCore.html#tymethod.try_fill_bytes
[`SeedableRng::from_rng`]: ../rand/rand_core/trait.SeedableRng.html#method.from_rng
[`RngCore`]: ../rand/rand_core/trait.RngCore.html
[`thread_rng`]: ../rand/rand/fn.thread_rng.html
[`OsRng`]: ../rand/rand/rngs/struct.OsRng.html
[`JitterRng`]: ../rand/rand/rngs/struct.JitterRng.html
[`EntropyRng`]: ../rand/rand/rngs/struct.EntropyRng.html
[`ReadRng`]: ../rand/rand/rngs/adapter/struct.ReadRng.html
