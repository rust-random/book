# Random Generators

## Getrandom

The [`getrandom`] crate provides a low-level API around platform-specific
random-number sources, and is an important building block of `rand` and
`rand_core` as well as a number of cryptography libraries.
It is not intended for usage outside of low-level libraries.

In some cases, particularly when targeting WASM, end-users may need to
configure this crate.
Consult the [`getrandom`] documentation for the relevant version.

## CPU Jitter

The [`rand_jitter`] crate implements a CPU-jitter-based entropy harvester which
may be used to provide an alternative source of entropy where a high-resolution
CPU timer is available.

It should be noted that CPU-jitter harvesters [may be prone to side-channel
attacks](https://github.com/rust-random/rand/issues/699) and that this
implementation is quite slow (due to conservative estimates of entropy gained
per step).

In prior versions of `rand` this was a direct dependency, used
automatically when other sources of entropy failed.
In current versions it is not a dependency (not even an optional one).


## Deterministic generators

The following crates implement pseudo-random number generators
(see [Our RNGs](guide-rngs.md)):

-   [`rand_chacha`] provides generators using the ChaCha cipher
-   [`rand_hc`] implements a generator using the HC-128 cipher
-   [`rand_isaac`] implements the ISAAC generators
-   [`rand_pcg`] implements a small selection of PCG generators
-   [`rand_xoshiro`] implements the SplitMix and Xoshiro generators
-   [`rand_xorshift`] implements the basic Xorshift generator


[`rand_chacha`]: https://rust-random.github.io/rand/rand_chacha/index.html
[`rand_hc`]: https://rust-random.github.io/rand/rand_hc/index.html
[`rand_isaac`]: https://docs.rs/rand_isaac/
[`rand_pcg`]: https://rust-random.github.io/rand/rand_pcg/index.html
[`rand_xoshiro`]: https://docs.rs/rand_xoshiro/
[`rand_xorshift`]: https://docs.rs/rand_xorshift/
[`rand_jitter`]: https://docs.rs/rand_jitter/
[`getrandom`]: https://docs.rs/getrandom/
