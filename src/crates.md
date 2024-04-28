# The crate family

<pre><code class="language-plain">                                           ┌ <a href="https://docs.rs/statrs/">statrs</a>
<a href="https://docs.rs/getrandom/">getrandom</a> ┐                                ├ <a href="https://docs.rs/rand_distr/">rand_distr</a>
          └ <a href="https://docs.rs/rand_core/">rand_core</a> ┬─────────────┬ <a href="https://docs.rs/rand/">rand</a> ┘
                      ├ <a href="https://docs.rs/rand_chacha/">rand_chacha</a> ┘
                      ├ <a href="https://docs.rs/rand_pcg/">rand_pcg</a>
                      └ [other RNG crates]
</code></pre>

## Interfaces

[`rand_core`] defines [`RngCore`] and other core traits, as well as several helpers for implementing RNGs.

The [`getrandom`] crate provides a low-level API around platform-specific
random-number sources.

## Pseudo-random generators

The following crates implement pseudo-random number generators
(see [Our RNGs](guide-rngs.md)):

-   [`rand_chacha`] provides generators using the ChaCha cipher
-   [`rand_hc`] implements a generator using the HC-128 cipher
-   [`rand_isaac`] implements the ISAAC generators
-   [`rand_pcg`] implements a small selection of PCG generators
-   [`rand_xoshiro`] implements the SplitMix and Xoshiro generators
-   [`rand_xorshift`] implements the basic Xorshift generator

Exceptionally, [`SmallRng`] is implemented directly in [`rand`].

## rand (main crate)

The [`rand`] crate is designed for easy usage of common random-number
functionality. This has several aspects:

-   the [`rngs`] module provides a few convenient generators
-   the [`distributions`] module concerns sampling of random values
-   the [`seq`] module concerns sampling from and shuffling sequences
-   the [`Rng`] trait provides a few convenience methods for generating
    random values
-   the [`random`] function provides convenient generation in a single call

## Distributions

The [`rand`] crate only implements sampling from the most common random
number distributions: uniform and weighted sampling. For everything else,

-   [`rand_distr`] provides fast sampling from a variety of other distributions,
    including Normal (Gauss), Binomial, Poisson, UnitCircle, and many more
-   [`statrs`] is a port of the C# Math.NET library, implementing many of the
    same distributions (plus/minus a few), along with PDF and CDF functions,
    the *error*, *beta*, *gamma* and *logistic* special functions, plus a few
    utilities. (For clarity, [`statrs`] is not part of the Rand library.)


[`rand_core`]: https://docs.rs/rand_core/
[`rand`]: https://docs.rs/rand/
[`rand_distr`]: https://docs.rs/rand_distr/
[`statrs`]: https://docs.rs/statrs/
[`getrandom`]: https://docs.rs/getrandom/
[`rand_chacha`]: https://docs.rs/rand_chacha/
[`rand_pcg`]: https://docs.rs/rand_pcg/
[`rand_xoshiro`]: https://docs.rs/rand_xoshiro/
[`log`]: https://docs.rs/log/
[`serde`]: https://serde.rs/
[`rand_hc`]: https://docs.rs/rand_hc/
[`rand_isaac`]: https://docs.rs/rand_isaac/
[`rand_xorshift`]: https://docs.rs/rand_xorshift/

[`RngCore`]: https://docs.rs/rand_core/latest/rand_core/trait.RngCore.html

[`rngs`]: https://docs.rs/rand/latest/rand/rngs/
[`distributions`]: https://docs.rs/rand/latest/rand/distributions/
[`seq`]: https://docs.rs/rand/latest/rand/seq/
[`Rng`]: https://docs.rs/rand/latest/rand/trait.Rng.html
[`random`]: https://docs.rs/rand/latest/rand/fn.random.html

[`SmallRng`]: https://docs.rs/rand/latest/rand/rngs/struct.SmallRng.html
