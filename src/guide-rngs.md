# Our RNGs

There are many kinds of RNGs, with different trade-offs. Rand provides some
convenient generators in the [`rngs` module]. Often you can just use
[`thread_rng`], a function which automatically initializes an RNG in
thread-local memory and returns a reference to it. It is fast, good quality,
and (to the best of our knowledge) cryptographically secure.

Contents of this documentation:

1. [The generators](#the-generators)
1. [Performance and size](#performance)
1. [Quality and cycle length](#quality)
1. [Security](#security)
1. [Extra features](#extra-features)
1. [Further reading](#further-reading)


# The generators

## Basic pseudo-random number generators (PRNGs)

The goal of regular, non-cryptographic PRNGs is usually to find a good
balance between simplicity, quality, memory usage and performance.
Non-cryptographic generators pre-date cryptographic ones and since we now have
fast cryptographic generators, some people argue that the non-cryptographic ones
are now obsolete. They can however have some advantages: small state size, fast
initialisation and simplicity (though this is not true of all non-crypto PRNGs;
e.g. the Mersenne Twister has a large state despite being easy to predict).

These algorithms are very important to Monte Carlo simulations, and also
suitable for several other problems such as randomized algorithms and games,
where predictability is not an issue. (Note that it might be problematic for
betting games and multiplayer games, where a cryptographic PRNG is usually more
appropriate.)

The Rand project provides several non-cryptographic PRNGs. A sub-set of these
are summarised below.
You may wish to refer to the [pcg-random] and [xoshiro] websites.

| name | full name | performance | memory | quality | period | features |
|------|-----------|-------------|--------|---------|--------|----------|
| [`SmallRng`] | (unspecified) | 7 GB/s | 16 bytes | ★★★☆☆ | ≥ `u32` * 2<sup>64</sup> | not portable |
| [`Pcg32`] | PCG XSH RR 64/32 (LCG) | 3 GB/s | 16 bytes | ★★★☆☆ | `u32` * 2<sup>64</sup> | — |
| [`Pcg64`] | PCG XSL 128/64 (LCG) | 4 GB/s | 32 bytes | ★★★★☆ | `u64` * 2<sup>128</sup> | — |
| [`Pcg64Mcg`] | PCG XSL 128/64 (MCG) | 7 GB/s | 16 bytes | ★★★☆☆ | `u64` * 2<sup>126</sup> | — |
| [`XorShiftRng`] | Xorshift 32/128 | 5 GB/s | 16 bytes | ★☆☆☆☆ | `u32` * 2<sup>128</sup> - 1 | — |
| [`Xoshiro256StarStar`] | Xoshiro256\*\* | 7 GB/s | 32 bytes | ★★★☆☆ | `u64` * 2<sup>256</sup> - 1 | jump-ahead |
| [`Xoshiro256Plus`] | Xoshiro256+ | 8 GB/s | 32 bytes | ★★☆☆☆ | `u64` * 2<sup>256</sup> - 1 | jump-ahead |
| [`SplitMix64`] | splitmix64 | 8 GB/s | 8 bytes | ★☆☆☆☆ | `u64` * 2<sup>64</sup> | — |
| [`StepRng`] | counter | 51 GB/s | 16 bytes | ☆☆☆☆☆ | `u64` * 2<sup>64</sup> | — |

Here, performance is measured roughly for `u64` outputs on a 3.4GHz Haswell CPU
(note that this will vary significantly by application; in general cryptographic
RNGs do better with byte sequence output). Quality ratings are
based on theory and observable defects, roughly as follows:

-   ★☆☆☆☆ = suitable for simple applications but with significant flaws
-   ★★☆☆☆ = good performance in most tests, some issues
-   ★★★☆☆ = good performance and theory, no major issues
-   ★★★★☆ = no observable issues and not trivial to predict (but not
    recommended for security)
-   ★★★★★ = cryptographic quality

## Cryptographically secure pseudo-random number generators (CSPRNGs)

CSPRNGs have much higher requirements than basic PRNGs. The primary
consideration is security. Performance and simplicity are also important,
but in general CSPRNGs are more complex and slower than regular PRNGs.
Quality is no longer a concern, as it is a requirement for a
CSPRNG that the output is basically indistinguishable from true randomness
since any bias or correlation makes the output more predictable.

There is a close relationship between CSPRNGs and cryptographic ciphers.
Any block cipher can be turned into a CSPRNG by encrypting a counter. Stream
ciphers are basically a CSPRNG and a combining operation, usually XOR. This
means that we can easily use any stream cipher as a CSPRNG.

This library provides the following CSPRNGs. We can make no guarantees
of any security claims. This table omits the "quality" column from the previous
table since CSPRNGs may not have observable defects.

| name | full name |  performance | initialization | memory | security (predictability) | forward secrecy |
|------|-----------|--------------|--------------|----------|----------------|-------------------------|
| [`StdRng`] | (unspecified) | 1.5 GB/s | fast | 136 bytes | widely trusted | no |
| [`ChaCha20Rng`] | ChaCha20 | 1.8 GB/s | fast | 136 bytes | [rigorously analysed](https://tools.ietf.org/html/rfc7539#section-1) | no |
| [`ChaCha8Rng`] | ChaCha8 | 2.2 GB/s | fast | 136 bytes | small security margin | no |
| [`Hc128Rng`] | HC-128 | 2.1 GB/s | slow | 4176 bytes | [recommended by eSTREAM](http://www.ecrypt.eu.org/stream/) | no |
| [`IsaacRng`] | ISAAC | 1.1 GB/s | slow | 2072 bytes | [unknown](https://burtleburtle.net/bob/rand/isaacafa.html) | unknown |
| [`Isaac64Rng`] | ISAAC-64 | 2.2 GB/s | slow | 4136 bytes| unknown | unknown |

It should be noted that the ISAAC generators are only included for
historical reasons, they have been with the Rust language since the very
beginning. They have good quality output and no attacks are known, but have
received little attention from cryptography experts.


# Notes on generators

## Performance

First it has to be said most PRNGs are very fast, and will rarely be a
performance bottleneck.

Performance of basic PRNGs is a bit of a subtle thing. It depends a lot on
the CPU architecture (32 vs. 64 bits), inlining, and also on the number of
available registers. This often causes the performance to be affected by
surrounding code due to inlining and other usage of registers.

When choosing a PRNG for performance it is important to benchmark your own
application due to interactions between PRNGs and surrounding code and
dependence on the CPU architecture as well as the impact of the size of
data requested. Because of all this, we do not include performance numbers
here but merely a qualitative rating.

CSPRNGs are a little different in that they typically generate a block of
output in a cache, and pull outputs from the cache. This allows them to have
good amortised performance, and reduces or completely removes the influence
of surrounding code on the CSPRNG performance.

### Worst-case performance
Simple PRNGs typically produce each random value on demand. In contrast, CSPRNGs
usually produce a whole block at once, then read from this cache until it is
exhausted, giving them much less consistent performance when drawing small
quantities of random data.

### Memory usage

Simple PRNGs often use very little memory, commonly only a few words, where
a *word* is usually either `u32` or `u64`. This is not true for all
non-cryptographic PRNGs however, for example the historically popular
Mersenne Twister MT19937 algorithm requires 2.5 kB of state.

CSPRNGs typically require more memory; since the seed size is recommended
to be at least 192 bits and some more may be required for the algorithm,
256 bits would be approximately the minimum secure size. In practice,
CSPRNGs tend to use quite a bit more, [`ChaChaRng`] is relatively small with
136 bytes of state.

### Initialization time

The time required to initialize new generators varies significantly. Many
simple PRNGs and even some cryptographic ones (including [`ChaChaRng`])
only need to copy the seed value and some constants into their state, and
thus can be constructed very quickly. In contrast, CSPRNGs with large state
require an expensive key-expansion.

## Quality

Many basic PRNGs are not much more than a couple of bitwise and arithmetic
operations. Their simplicity gives good performance, but also means there
are small regularities hidden in the generated random number stream.

How much do those hidden regularities matter? That is hard to say, and
depends on how the RNG gets used. If there happen to be correlations between
the random numbers and the algorithm they are used in, the results can be
wrong or misleading.

A random number generator can be considered good if it gives the correct
results in as many applications as possible. The quality of PRNG
algorithms can be evaluated to some extend analytically, to determine the
cycle length and to rule out some correlations. Then there are empirical
test suites designed to test how well a PRNG performs on a wide range of
possible uses, the latest and most complete of which are [TestU01] and
[PractRand].

CSPRNGs tend to be more complex, and have an explicit requirement to be
unpredictable. This implies there must be no obvious correlations between
output values.

### Quality stars:
PRNGs with 3 stars or more should be good enough for most non-crypto
applications. 1 or 2 stars may be good enough for typical apps and games, but do
not work well with all algorithms.

### Period

The *period* or *cycle length* of a PRNG is the number of values that can be
generated after which it starts repeating the same random number stream.
Many PRNGs have a fixed-size period, but for some only an expected average
cycle length can be given, where the exact length depends on the seed.

On today's hardware, even a fast RNG with a cycle length of *only*
2<sup>64</sup> can be used sequentially for centuries before cycling. However,
this is not the case for parallel applications. We recommend a period of
2<sup>128</sup> or more, which most modern PRNGs satisfy. Alternatively a PRNG
with shorter period but support for multiple streams may be chosen. There are
two reasons for this, as follows.

If we see the entire period of an RNG as one long random number stream,
every independently seeded RNG returns a slice of that stream. When multiple
RNG are seeded randomly, there is an increasingly large chance to end up
with a partially overlapping slice of the stream.

If the period of the RNG is 2<sup>128</sup>, and an application consumes
2<sup>48</sup> values, it then takes about 2<sup>32</sup> random
initializations to have a chance of 1 in a million to repeat part of an
already used stream. This seems good enough for common usage of
non-cryptographic generators, hence the recommendation of at least
2<sup>128</sup>. As an estimate, the chance of any overlap in a period of
size `p` with `n` independent seeds and `u` values used per seed is
approximately `1 - e^(-u * n^2 / (2 * p))`.

Further, it is not recommended to use the full period of an RNG. Many
PRNGs have a property called *k-dimensional equidistribution*, meaning that
for values of some size (potentially larger than the output size), all
possible values are produced the same number of times over the generator's
period. This is not a property of true randomness. This is known as the
generalized birthday problem, see the [PCG paper] for a good explanation.
This results in a noticable bias on output after generating more values
than the square root of the period (after 2<sup>64</sup> values for a
period of 2<sup>128</sup>).


## Security

### Predictability

From the context of any PRNG, one can ask the question *given some previous
output from the PRNG, is it possible to predict the next output value?*
This is an important property in any situation where there might be an
adversary.

Regular PRNGs tend to be predictable, although with varying difficulty. In
some cases prediction is trivial, for example plain Xorshift outputs part of
its state without mutation, and prediction is as simple as seeding a new
Xorshift generator from four `u32` outputs. Other generators, like
[PCG](http://www.pcg-random.org/predictability.html) and truncated Xorshift*
are harder to predict, but not outside the realm of common mathematics and a
desktop PC.

The basic security that CSPRNGs must provide is the infeasibility to predict
output. This requirement is formalized as the [next-bit test]; this is
roughly stated as: given the first *k* bits of a random sequence, the
sequence satisfies the next-bit test if there is no algorithm able to
predict the next bit using reasonable computing power.

A further security that *some* CSPRNGs provide is forward secrecy:
in the event that the CSPRNGs state is revealed at some point, it must be
infeasible to reconstruct previous states or output. Note that many CSPRNGs
*do not* have forward secrecy in their usual formulations.

Verifying security claims of an algorithm is a *hard problem*, and we are not
able to provide any guarantees of the security of algorithms used or recommended
by this project. We refer you to the [NIST] institute and [ECRYPT] network
for recommendations.

### State and seeding

It is worth noting that a CSPRNG's security relies absolutely on being
seeded with a secure random key. Should the key be known or guessable, all
output of the CSPRNG is easy to guess. This implies that the seed should
come from a trusted source; usually either the OS or another CSPRNG. Our
seeding helper trait, [`FromEntropy`], and the source it uses
([`EntropyRng`]), should be secure. Additionally, [`ThreadRng`] is a CSPRNG,
thus it is acceptable to seed from this (although for security applications
fresh/external entropy should be preferred).

Further, it should be obvious that the internal state of a CSPRNG must be
kept secret. With that in mind, our implementations do not provide direct
access to most of their internal state, and `Debug` implementations do not
print any internal state. This does not fully protect CSPRNG state; code
within the same process may read this memory (and we allow cloning and
serialisation of CSPRNGs for convenience). Further, a running process may be
forked by the operating system, which may leave both processes with a copy
of the same generator.

### Not a crypto library

It should be emphasised that this is not a cryptography library; although
Rand does take some measures to provide secure random numbers, it does not
necessarily take all recommended measures. Further, cryptographic processes
such as encryption and authentication are complex and must be implemented
very carefully to avoid flaws and resist known attacks. It is therefore
recommended to use specialized libraries where possible, for example
[openssl], [ring] and the [RustCrypto libraries].


## Extra features

Some PRNGs may provide extra features, like:

- Support for multiple streams, which can help with parallel tasks.
- The ability to jump or seek around in the random number stream;
with a large period this can be used as an alternative to streams.


## Further reading

There is quite a lot that can be said about PRNGs. The [PCG paper] is very
approachable and explains more concepts.

Another good paper about RNG quality is
["Good random number generators are (not so) easy to find"](
http://random.mat.sbg.ac.at/results/peter/A19final.pdf) by P. Hellekalek.


[`rngs` module]: ../rand/rand/rngs/index.html
[`SmallRng`]: ../rand/rand/rngs/struct.SmallRng.html
[`StdRng`]: ../rand/rand/rngs/struct.StdRng.html
[`StepRng`]: ../rand/rand/rngs/mock/struct.StepRng.html
[`thread_rng`]: ../rand/rand/fn.thread_rng.html
[basic PRNGs]: #basic-pseudo-random-number-generators-prngs
[CSPRNGs]: #cryptographically-secure-pseudo-random-number-generators-csprngs
[`Pcg32`]: ../rand/rand_pcg/type.Pcg32.html
[`Pcg64`]: ../rand/rand_pcg/type.Pcg64.html
[`Pcg64Mcg`]: ../rand/rand_pcg/type.Pcg64Mcg.html
[`XorShiftRng`]: ../rand/rand_xorshift/struct.XorShiftRng.html
[`Xoshiro256StarStar`]: ../rand/rand_xoshiro/struct.Xoshiro256StarStar.html
[`Xoshiro256Plus`]: ../rand/rand_xoshiro/struct.Xoshiro256Plus.html
[`SplitMix64`]: ../rand/rand_xoshiro/struct.SplitMix64.html
[`ChaChaRng`]: ../rand/rand_chacha/struct.ChaChaRng.html
[`ChaCha20Rng`]: ../rand/rand_chacha/struct.ChaCha20Rng.html
[`ChaCha8Rng`]: ../rand/rand_chacha/struct.ChaCha8Rng.html
[`Hc128Rng`]: ../rand/rand_hc/struct.Hc128Rng.html
[`IsaacRng`]: ../rand/rand_isaac/isaac/struct.IsaacRng.html
[`Isaac64Rng`]: ../rand/rand_isaac/isaac64/struct.Isaac64Rng.html
[`ThreadRng`]: ../rand/rand/rngs/struct.ThreadRng.html
[`FromEntropy`]: ../rand/rand/trait.FromEntropy.html
[`EntropyRng`]: ../rand/rand/rngs/struct.EntropyRng.html
[TestU01]: http://simul.iro.umontreal.ca/testu01/tu01.html
[PractRand]: http://pracrand.sourceforge.net/
[pcg-random]: http://www.pcg-random.org/
[xoshiro]: http://xoshiro.di.unimi.it/
[PCG paper]: http://www.pcg-random.org/pdf/hmc-cs-2014-0905.pdf
[openssl]: https://crates.io/crates/openssl
[ring]: https://crates.io/crates/ring
[RustCrypto libraries]: https://github.com/RustCrypto
[next-bit test]: https://en.wikipedia.org/wiki/Next-bit_test
[NIST]: https://www.nist.gov/
[ECRYPT]: http://www.ecrypt.eu.org/
