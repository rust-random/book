# Types of generators

The previous section introduced [`RngCore`], the trait which all *random data
sources* must implement. But what exactly is a random data source?

This section concerns theory; see also the chapter on
[random number generators](guide-rngs.md).

```rust
use rand::{RngExt, SeedableRng};

# fn main() {
// prepare a non-deterministic random number generator:
let mut rng = rand::rng();
println!("{}", rng.random::<i32>()); // prints an unknown value

// prepare a deterministic generator:
let mut rng = rand::rngs::ChaCha8Rng::seed_from_u64(123);
println!("{}", rng.random::<i32>()); // prints -416273517
# }
```

## True random number generators

A **true** random number generator (TRNG) is something which produces random
numbers by observing some natural process, such as atomic decay or thermal noise.
(Whether or not these things are *truly* random or are in fact deterministic —
for example if the universe itself is a simulation — is besides the point here.
For our purposes, it is sufficient that they are not distinguishable from true
randomness.)

Note that these processes are often biased, thus some type of *debiasing* must
be used to yield the unbiased random data we desire.

## Pseudo-random number generators

CPUs are of course supposed to compute deterministically, yet it turns out they
can do a pretty good job of emulating random processes. Most pseudo-random
number generators are deterministic and can be defined by just:

-   some initial *state*
-   a function to compute a random value from the state
-   a function to advance to the next state
-   (optionally) a function to derive the initial state from a *seed* or *key*

The fact that these are deterministic can sometimes be very useful: it allows a
simulation, randomised art work or game to be repeated exactly, producing a
result which is a function of the seed. For more on this see the
[reproducibility](crate-reprod.md) chapter (note that determinism alone isn't
enough to guarantee reproducibility).

The other big attraction of PRNGs is their speed: some of these algorithms
require only a few CPU operations per random value, and thus can produce
random data on demand much more quickly than most TRNGs.

Note however that PRNGs have several limitations:

-   They are no stronger than their seed: if the seed is known or guessable,
    and the algorithm is known (or guessed), then only a small number of output
    sequences are likely.
-   Since the state size is usually fixed, only a finite number of output values
    are possible before the generator loops and repeats itself.
-   Several algorithms are easily predictable after seeing a few values, and
    with many other algorithms it is not clear whether they could be "cracked".

## Cryptographically secure pseudo-random number generator

Cryptographically secure pseudo-random number generators (CSPRNGs) are the
subset of PRNGs which are considered secure. That is:

-   their state is sufficiently large that a brute-force approach simply trying
    all initial values is not a feasible method of finding the initial state
    used to produce an observed sequence of output values,
-   and there is no other algorithm which is sufficiently better than the
    brute-force method which would make it feasible to predict the next output
    value.

Achieving secure generation requires not only a secure algorithm (CSPRNG), but
also a secure and sufficiently large seed value (typically 256 bits), and
protection against side-channel attacks (i.e. preventing attackers from reading
the internal state).

Some CSPRNGs additionally satisfy a third property:

-   a CSPRNG is backtracking resistant if it is impossible for an attacker to
    calculate prior output values of the PRNG despite having discovered the
    value of the current internal state (implying that all future output is
    compromised).

## Hardware random number generator

A **hardware** random number generator (HRNG) is theoretically an adaptor from
some TRNG to digital information. In practice, these may use a PRNG to debias
the TRNG. Even though an HRNG has some underlying TRNG, it is not guaranteed to
be secure: the TRNG itself may produce insufficient entropy (i.e. be too
predictable), or the signal amplification and debiasing process may be flawed.

An HRNG may be used to provide the seed for a PRNG, although usually this is not
the only way to obtain a secure seed (see the next section). An HRNG might
replace a PRNG altogether, although since we now have very fast and very strong
software PRNGs, and since software implementations are easier to verify than
hardware ones, this is often not the preferred solution.

Since a PRNG needs a random seed value to be secure, an HRNG may be used to
provide that seed, or even replace the need for a PRNG. However, since the goal
is usually "only" to produce unpredictable random values, there are acceptable
alternatives to *true* random number generators (see next section).

## Entropy

As noted above, for a CSPRNG to be secure, its seed value must also be secure.
The word *entropy* can be used in two ways:

-   as a measure of the amount of unknown information in some piece of data
-   as a piece of unknown data

Ideally, a random boolean or a coin flip has 1 bit of entropy, although if the
value is biased, there will be less. Shannon Entropy attempts to measure this.

For example, a Unix time-stamp (seconds since the start of 1970) contains both
high- and low-resolution data. This is typically a 32-bit number, but the amount
of *entropy* will depend on how precisely a hypothetical attacker can guess the
number. If an attacker can guess the number to the nearest minute, this may be
approximately 6 bits (2^6 = 64); if an attacker can guess this to the second,
this is 0 bits. [`JitterRng`] uses this concept to scavenge entropy without an
HRNG (but using nanosecond resolution timers and conservatively assuming only a
couple of bits entropy is available per time-stamp, after running several tests
on the timer's quality).

[`RngCore`]: https://docs.rs/rand_core/latest/rand_core/trait.RngCore.html
[`JitterRng`]: https://docs.rs/rand_jitter/latest/rand_jitter/struct.JitterRng.html
