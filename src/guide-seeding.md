# Seeding RNGs

As we have seen, the output of pseudo-random number generators (PRNGs) is
determined by their initial state.

Some PRNG definitions specify how the initial state should be generated from a
key, usually specified as a byte-sequence for cryptographic generators or,
for small PRNGs, often just a word. We formalise this for all our generators
with the [`SeedableRng`] trait.

## The Seed type

We require all seedable RNGs to define a [`Seed`] type satisfying
`AsMut<[u8]> + Default + Sized` (usually `[u8; N]` for a fixed `N`).
We recommend using `[u8; 12]` or larger for non-cryptographic PRNGs and
`[u8; 32]` for cryptographic PRNGs.

PRNGs may be seeded directly from such a value with [`SeedableRng::from_seed`].

## Seeding from ...

### Fresh entropy

Using a fresh seed (direct from the OS) is easy using [`SeedableRng::from_entropy`]:

```rust,editable
use rand::prelude::*;
use rand_chacha::ChaCha20Rng;

let rng = ChaCha20Rng::from_entropy();
```

Note that this requires `rand_core` has the feature `getrandom` enabled.

### Another RNG

Quite obviously, another RNG may be used to fill a seed. We provide a
convenience method for this:

```rust,editable
use rand::prelude::*;
use rand_pcg::Pcg64;

let rng = Pcg64::from_rng(thread_rng());
```

But, say you want to save a key and use it later. For that you need to be a
little bit more explicit:

```rust,editable
use rand::prelude::*;
use rand_chacha::ChaCha8Rng;

let mut seed: <ChaCha8Rng as SeedableRng>::Seed = Default::default();
thread_rng().fill(&mut seed);
let rng = ChaCha8Rng::from_seed(seed);
```

**Obligatory warning**: a few simple PRNGs, notably [`XorShiftRng`],
behave badly when seeded from the same type of generator (in this case, Xorshift
generates a clone). For cryptographic PRNGs this is not a problem;
for others it is recommended to seed from a different type of generator.
[`ChaCha8Rng`] is an excellent choice for a fast, non-cryptographic
deterministic master generator.

### A simple number

For some applications, especially simulations, all you want are a sequence of
distinct, fixed random number seeds, e.g. 1, 2, 3, etc.

[`SeedableRng::seed_from_u64`] is designed exactly for this use-case.
Internally, it uses a simple PRNG to fill the bits of the seed from the input
number while providing good bit-avalance (so that two similar numbers such as
0 and 1 translate to very different seeds and independent RNG sequences).

```rust,editable
use rand::prelude::*;
use rand_pcg::Pcg64;

let rng = Pcg64::seed_from_u64(2);
```

Note that a number with 64-bits or less **cannot be secure**, so this should
not be used for applications such as gambling games.

### A string, or any hashable data

Say you let users enter a string to seed the random number generator. Ideally,
all parts of the string should influence the generator and making only a small
change to the string should result in a fully independent generator sequence.

This can be achieved via use of a hash function to compress all input data down
to a hash result, then using that result to seed a generator. The
[`rand_seeder`] crate is designed for just this purpose.

```rust,editable
use rand::prelude::*;
use rand_seeder::{Seeder, SipHasher};
use rand_pcg::Pcg64;

let rng: Pcg64 = Seeder::from("stripy zebra").make_rng();

// Or, more explicitly:
let hasher = SipHasher::from("a sailboat");
let hasher_rng = hasher.into_rng(); // this is a full RNG: use it directly if you want
let mut seed = [0u8; 16];
hasher_rng.fill(&mut seed);
```


[`SeedableRng`]: ../rand/rand_core/trait.SeedableRng.html
[`Seed`]: ../rand/rand_core/trait.SeedableRng.html#type.Seed
[`SeedableRng::from_seed`]: ../rand/rand_core/trait.SeedableRng.html#tymethod.from_seed
[`SeedableRng::from_rng`]: ../rand/rand_core/trait.SeedableRng.html#method.from_rng
[`SeedableRng::seed_from_u64`]: ../rand/rand_core/trait.SeedableRng.html#method.seed_from_u64
[`SeedableRng::from_entropy`]: ../rand/rand_core/trait.SeedableRng.html#method.from_entropy
[`XorShiftRng`]: ../rand/rand_xorshift/struct.XorShiftRng.html
[`ChaCha8Rng`]: ../rand/rand_chacha/struct.ChaCha8Rng.html
[`rand_seeder`]: https://github.com/rust-random/seeder/
