# Random generators

The previous section introduced [`RngCore`], the trait which all *random data
sources* must implement. But what exactly is a random data source?

This section concerns theory; see also the chapter on
[random number generators](rngs.md).

```rust
# extern crate rand;
// prepare a random number generator:
let mut rng = rand::thread_rng();
```

## True random number generators

A **true** random number generator (TRNG) is something which produces random
numbers by observing some natural process, such as atomic decay or thermal noise.
(Whether or not these things are *truely* random or are in fact deterministic —
for example if the universe itself is a simulation — is besides the point here.
Since from our point of view these things are unpredictable and we require some
source of *entropy*, we are forced to assume that at least some such processes
are truely random.)

Note that these processes are often biased, thus some type of *debiasing* must
be used to yield the unbiased random data we desire.

## Psuedo-random number generators

CPUs are of course supposed to compute deterministically, yet it turns out they
can do a pretty good job of emulating random processes. Most psuedo-random
number generators are deterministic and can be defined by three things:

-   some initial *state*
-   a function to compute a random value from the state
-   a function to advance to the next state

The fact that these are deterministic can sometimes be very useful: it allows a
simulation, randomised art work or game to be repeated exactly, producing a
result which is a function of the seed. For more on this see the
[portability](portability.md) chapter (note that deterministicity alone isn't
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

TODO: move
This is usually
not an issue in practice; for example 16 bytes allows a length of 2^128
values (approx 10^38); since modern CPUs have "only" around 10^17 clock
cycles per year even a super fast generator producing one value per cycle
would take 10^21 years to run its cycle.

## Crytographically secure pseudo-random number generator

Crytographically secure pseudo-random number generators (CSPRNGs) are the
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

A **hardware** random number generator (HRNG) may be a TRNG or a PRNG or some
combination of the two.

## Entropy

As noted above, for a CSPRNG to be secure, its seed value must also be secure.
The word *entropy* can be used in two ways:

-   as a measure of the amount of unknown information in some piece of data
    (typically measured in bits; see Shannon Entropy)
-   as a piece of unknown data

[`RngCore`]: ../rand/rand_core/trait.RngCore.html
