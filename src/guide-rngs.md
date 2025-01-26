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

The goal of "standard" non-cryptographic PRNGs is usually to find a good
balance between simplicity, quality, memory usage and performance.
Non-cryptographic generators pre-date cryptographic ones and are in some ways
obsoleted by them, however non-cryptographic generators do have some advantages:
a small state size, fast initialisation, simplicity, lower energy usage for
embedded CPUs. (However, not all non-crypto PRNGs provide these benefits,
e.g. the Mersenne Twister has a very large state despite being easy to predict).

These algorithms are very important to Monte Carlo simulations, and also
suitable for several other problems such as randomized algorithms and games,
where predictability is not an issue. (Note however that for gambling games
predictability may be an issue and a cryptographic PRNG is recommended.)

The Rand project provides several non-cryptographic PRNGs. A sub-set of these
are summarised below.
You may wish to refer to the [pcg-random] and [xoshiro] websites.

| name | full name | performance | memory | quality | period | features |
|------|-----------|-------------|--------|---------|--------|----------|
| [`SmallRng`] | (unspecified) | 7 GB/s | 16 bytes | ★★★☆☆ | ≥ `u32` * 2<sup>64</sup> | not portable |
| [`Pcg32`] | PCG XSH RR 64/32 (LCG) | 3 GB/s | 16 bytes | ★★★☆☆ | `u32` * 2<sup>64</sup> | — |
| [`Pcg64`] | PCG XSL 128/64 (LCG) | 4 GB/s | 32 bytes | ★★★☆☆ | `u64` * 2<sup>128</sup> | — |
| [`Pcg64Mcg`] | PCG XSL 128/64 (MCG) | 7 GB/s | 16 bytes | ★★★☆☆ | `u64` * 2<sup>126</sup> | — |
| [`XorShiftRng`] | Xorshift 32/128 | 5 GB/s | 16 bytes | ★☆☆☆☆ | `u32` * 2<sup>128</sup> - 1 | — |
| [`Xoshiro256PlusPlus`] | Xoshiro256++ | 7 GB/s | 32 bytes | ★★★☆☆ | `u64` * 2<sup>256</sup> - 1 | jump-ahead |
| [`Xoshiro256Plus`] | Xoshiro256+ | 8 GB/s | 32 bytes | ★★☆☆☆ | `u64` * 2<sup>256</sup> - 1 | jump-ahead |
| [`SplitMix64`] | splitmix64 | 8 GB/s | 8 bytes | ★☆☆☆☆ | `u64` * 2<sup>64</sup> | — |
| [`StepRng`] | counter | 51 GB/s | 16 bytes | ☆☆☆☆☆ | `u64` * 2<sup>64</sup> | — |

Here, performance is measured roughly for `u64` outputs on a 3.4GHz Haswell CPU
(note that this will vary significantly by application; in general cryptographic
RNGs do better with byte sequence output). Quality ratings are
based on theory and observable defects, roughly as follows:

-   ★☆☆☆☆ = suitable for simple applications but with significant flaws
-   ★★☆☆☆ = no major issues in qualitative testing
-   ★★★☆☆ = good theory, no major issues in qualitative testing
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
historical reasons: they have been with the Rust language since the very
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
algorithms can be evaluated to some extent analytically, to determine the
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
Many PRNGs have a fixed-size period, while for others ("chaotic RNGs") the
cycle length may depend on the seed and short cycles may exist.

Note that a long period does not imply high quality (e.g. a counter through
`u128` values provides a decently long period). Conversely, a short period may
be a problem, especially when multiple RNGs are used simultaneously.
In general, we recommend a period of at least 2<sup>128</sup>.
(Alternatively, a PRNG with shorter period of at least 2<sup>64</sup> and
support for multiple streams may be sufficient. Note however that in the case
of PCG, its streams are closely correlated.)

*Avoid reusing values!*
On today's hardware, a fast RNG with a cycle length of *only*
2<sup>64</sup> can be used sequentially for centuries before cycling. However,
when multiple RNGs are used in parallel (each with a unique seed), there is a
significant chance of overlap between the sequences generated.
For a generator with a *large* period `P`, `n` independent generators, and
a sequence of length `L` generated by each generator, the chance of any overlap
between sequences can be approximated by `Ln² / P` when `nL / P` is close to
zero. For more on this topic, please see these
[remarks by the Xoshiro authors](http://prng.di.unimi.it/#remarks).

*Collisions and the birthday paradox!*
For a generator with outputs of equal size to its state, it is recommended not
to use more than `√P` outputs. A generalisation for `kw`-bit state and `w`-bit
generators is to ensure `kL² < P`. This requirement stems from the
*generalised birthday problem*, asking how many unbiased samples from a set of
size `d = 2^w` can be taken before the probability of a repeat is at least half.
Note that for `kL² > P` a generator with `kw`-dimensional equidistribution
*cannot* generate the expected number of repeated samples, however generators
without this property are *also* not guaranteed to generate the expected number
of repeats.

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
come from a trusted source; usually either the OS or another CSPRNG. For this
purpose, we recommend using the [`getrandom`] crate which interfaces the OS's
secure random interface. [`SeedableRng::from_os_rng`] is a wrapper around
[`getrandom`] for convenience. Alternatively, using a user-space CSPRNG such as
[`ThreadRng`] for seeding should be sufficient.

Further, it should be obvious that the internal state of a CSPRNG must be
kept secret. With that in mind, our implementations do not provide direct
access to most of their internal state, and `Debug` implementations do not
print any internal state. This does not fully protect CSPRNG state; code
within the same process may read this memory (and we allow cloning and
serialisation of CSPRNGs for convenience). Further, a running process may be
forked by the operating system, which may leave both processes with a copy
of the same generator.

### Not a cryptography library

Cryptographic processes
such as encryption and authentication are complex and must be implemented
very carefully to avoid flaws and resist known attacks. It is therefore
recommended to use specialized libraries where possible, for example
[openssl], [ring] and the [RustCrypto libraries].

The Rand crates attempt to provide unpredictable data sources, with limitations.
First, the software is provided "as is", without any form of guarantee.
Second, it is generally assumed that program memory is private; if there are
concerns in this regard it may be preferred to use an external generator such
as [`getrandom`] instead. Note that even privacy of freed memory is important,
and that while we may integrate some mitigations such as [zeroize] in the
future, such measures are incomplete. Note that Rand does not protect against
process forks (past versions of Rand up to 0.8.x have a limited mitigation but
not full protection). Finally, note that there are many possible ways that the
security of unpredictability could be broken, from complex hardware bugs like
Spectre to stupid mistakes like printing generator state in log messages.

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
https://web.archive.org/web/20160801142711/http://random.mat.sbg.ac.at/results/peter/A19final.pdf)
by P. Hellekalek.


[`rngs` module]: https://docs.rs/rand/latest/rand/rngs/
[`SmallRng`]: https://docs.rs/rand/latest/rand/rngs/struct.SmallRng.html
[`StdRng`]: https://docs.rs/rand/latest/rand/rngs/struct.StdRng.html
[`StepRng`]: https://docs.rs/rand/latest/rand/rngs/mock/struct.StepRng.html
[`rng()`]: https://docs.rs/rand/latest/rand/fn.rng.html
[basic PRNGs]: #basic-pseudo-random-number-generators-prngs
[CSPRNGs]: #cryptographically-secure-pseudo-random-number-generators-csprngs
[`Pcg32`]: https://docs.rs/rand_pcg/latest/rand_pcg/type.Pcg32.html
[`Pcg64`]: https://docs.rs/rand_pcg/latest/rand_pcg/type.Pcg64.html
[`Pcg64Mcg`]: https://docs.rs/rand_pcg/latest/rand_pcg/type.Pcg64Mcg.html
[`XorShiftRng`]: https://docs.rs/rand_xorshift/latest/rand_xorshift/struct.XorShiftRng.html
[`Xoshiro256PlusPlus`]: https://docs.rs/rand_xoshiro/latest/rand_xoshiro/struct.Xoshiro256PlusPlus.html
[`Xoshiro256Plus`]: https://docs.rs/rand_xoshiro/latest/rand_xoshiro/struct.Xoshiro256Plus.html
[`SplitMix64`]: https://docs.rs/rand_xoshiro/latest/rand_xoshiro/struct.SplitMix64.html
[`ChaChaRng`]: https://docs.rs/rand_chacha/latest/rand_chacha/type.ChaChaRng.html
[`ChaCha20Rng`]: https://docs.rs/rand_chacha/latest/rand_chacha/struct.ChaCha20Rng.html
[`ChaCha8Rng`]: https://docs.rs/rand_chacha/latest/rand_chacha/struct.ChaCha8Rng.html
[`Hc128Rng`]: https://docs.rs/rand_hc/latest/rand_hc/struct.Hc128Rng.html
[`IsaacRng`]: https://docs.rs/rand_isaac/latest/rand_isaac/isaac/struct.IsaacRng.html
[`Isaac64Rng`]: https://docs.rs/rand_isaac/latest/rand_isaac/isaac64/struct.Isaac64Rng.html
[`ThreadRng`]: https://docs.rs/rand/latest/rand/rngs/struct.ThreadRng.html
[`FromEntropy`]: https://docs.rs/rand/latest/rand/trait.FromEntropy.html
[`EntropyRng`]: https://docs.rs/rand/latest/rand/rngs/struct.EntropyRng.html
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
[`getrandom`]: https://docs.rs/getrandom/
[`SeedableRng::from_os_rng`]: https://docs.rs/rand/latest/rand/trait.SeedableRng.html#method.from_os_rng
[zeroize]: https://crates.io/crates/zeroize
