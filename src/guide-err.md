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

-   [`OsRng`] is a wrapper over [`getrandom`]. From the latter's documentation:
    "In general, on supported platforms, failure is highly unlikely, though not
    impossible." [`OsRng`] will forward errors through
    [`RngCore::try_fill_bytes`] while other methods panic on error.
-   [`rng`] seeds itself via [`OsRng`] on first use and periodically
    thereafter, thus can potentially fail, though unlikely. If initial seeding
    fails, a panic will result. If a failure happens during reseeding (less
    likely) then the RNG continues without reseeding; a log message (warning)
    is emitted if logging is enabled.

[`Rng::try_fill`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.try_fill
[`RngCore::try_fill_bytes`]: https://docs.rs/rand_core/latest/rand_core/trait.RngCore.html#tymethod.try_fill_bytes
[`SeedableRng::from_rng`]: https://docs.rs/rand_core/latest/rand_core/trait.SeedableRng.html#method.from_rng
[`RngCore`]: https://docs.rs/rand_core/latest/rand_core/trait.RngCore.html
[`rng`]: https://docs.rs/rand/latest/rand/fn.rng.html
[`OsRng`]: https://docs.rs/rand/latest/rand/rngs/struct.OsRng.html
[`getrandom`]: https://docs.rs/getrandom/latest/getrandom/
