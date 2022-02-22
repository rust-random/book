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

-   [`OsRng`] is a wrapper over [`getrandom`]. "In general, on supported
    platforms, failure is highly unlikely, though not impossible."
-   [`thread_rng`] seeds itself via [`OsRng`] on first use and periodically
    thereafter, thus can potentially fail, though unlikely

[`Rng::try_fill`]: ../rand/rand/trait.Rng.html#method.try_fill
[`RngCore::try_fill_bytes`]: ../rand/rand_core/trait.RngCore.html#tymethod.try_fill_bytes
[`SeedableRng::from_rng`]: ../rand/rand_core/trait.SeedableRng.html#method.from_rng
[`RngCore`]: ../rand/rand_core/trait.RngCore.html
[`thread_rng`]: ../rand/rand/fn.thread_rng.html
[`OsRng`]: ../rand/rand/rngs/struct.OsRng.html
[`getrandom`]: https://docs.rs/getrandom/latest/getrandom/
