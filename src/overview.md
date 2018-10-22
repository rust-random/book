# Overview

## Functionality

The Rand crate provides:

- A convenient to use default RNG, `thread_rng`: an automatically seeded,
  crypto-grade generator stored in thread-local memory.
- Pseudo-random number generators: `StdRng`, `SmallRng`, `prng` module.
- Functionality for seeding PRNGs: the `FromEntropy` trait, and as sources of
  external randomness `EntropyRng`, `OsRng` and `JitterRng`.
- Most content from [`rand_core`](https://crates.io/crates/rand_core)
  (re-exported): base random number generator traits and error-reporting types.
- 'Distributions' producing many different types of random values:
  - A `Standard` distribution for integers, floats, and derived types including
    tuples, arrays and `Option`
  - Unbiased sampling from specified `Uniform` ranges.
  - Sampling from exponential/normal/gamma distributions.
  - Sampling from binomial/poisson distributions.
  - `gen_bool` aka Bernoulli distribution.
- `seq`-uence related functionality:
  - Sampling a subset of elements.
  - Randomly shuffling a list.
