# Parallel RNGs

## Theory: multiple RNGs

If you want to use random generators in multiple worker threads simultaneously,
then you will want to use multiple RNGs. A few suggested approaches:

1.  Use [`rng()`] in each worker thread. This is seeded automatically
    (lazily and uniquely) on each thread where it is used.
2.  Use [`rng()`] (or another master RNG) to seed a custom RNG on each
    worker thread. The main advantage here is flexibility over the RNG used.
3.  Use a custom RNG per *work unit*, not per *worker thread*. If these RNGs
    are seeded in a deterministic fashion, then deterministic results are
    possible. Unfortunately, seeding a new RNG for each work unit from a master
    generator cannot be done in parallel, thus may be slow.
4.  Use a single master seed. For each work unit, seed an RNG using the master
    seed and set the RNG's stream to the work unit number. This is potentially a
    faster than (3) while still deterministic, but not supported by all RNGs.

Note: do not simply clone RNGs for worker threads/units. Clones return the same
sequence of output as the original. You may however use clones if you then set
a unique stream on each.

### Streams

Which RNG families support multiple streams?

-   [ChaCha](https://docs.rs/rand_chacha/latest/rand_chacha/): the ChaCha RNGs
    support 256-bit seed, 64-bit stream and 64-bit counter (per 16-word block),
    thus supporting 2<sup>64</sup> streams of 2<sup>68</sup> words each.
-   [Hc128](https://docs.rs/rand_hc/latest/rand_hc/) is a cryptographic RNG
    supporting a 256-bit seed; one could construct this seed from (e.g.) a
    smaller 192-bit key plus a 64-bit stream.

Note that the above approach of constructing the seed from a smaller key plus a
stream counter can only be recommended with cryptographic PRNGs since simpler
RNGs often have correlations in the RNG's output using two similar keys, and
may also require "random looking" seeds to produce high quality output.

Non-cryptographic PRNGs may still support multiple streams, but likely with
significant limitations (especially noting that a common recommendation with
such PRNGs is not to consume more than the square root of the generator's
period).

-   [Xoshiro](https://docs.rs/rand_xoshiro/latest/rand_xoshiro/): the Xoshiro
    family of RNGs support `jump` and `long_jump` methods which may effectively
    be used to divide the output of a single RNG into multiple streams. In
    practice this is only useful with a small number of streams, since `jump`
    must be called `n` times to select the nth "stream".
-   [Pcg](https://docs.rs/rand_pcg/latest/rand_pcg/): these RNGs support
    construction with `state` and `stream` parameters. Note, however, that the
    RNGs have been critiqued in that multiple streams using the same key are
    often strongly correlated. See the [author's own comments](https://www.pcg-random.org/posts/critiquing-pcg-streams.html).

    The PCG RNGs *also* support an `fn advance(delta)` method, which might be
    used to divide a single stream into multiple sub-streams as with Xoshiro's
    `jump` (but better since the offset can be specified).

## Practice: non-deterministic multi-threaded

We use Rayon's [parallel iterators](https://docs.rs/rayon/latest/rayon/iter/index.html), using [`map_init`] to initialize an RNG in
each worker thread. Note: this RNG may be re-used across multiple work units,
which may be split between worker threads in non-deterministic fashion.

```rust
use rand::distr::{Distribution, Uniform};
use rayon::prelude::*;

static SAMPLES: u64 = 1_000_000;

fn main() {
    let range = Uniform::new(-1.0f64, 1.0).unwrap();

    let in_circle = (0..SAMPLES)
        .into_par_iter()
        .map_init(|| rand::rng(), |rng, _| {
            let a = range.sample(rng);
            let b = range.sample(rng);
            if a * a + b * b <= 1.0 {
                1
            } else {
                0
            }
        })
        .reduce(|| 0usize, |a, b| a + b);

    // prints something close to 3.14159...
    println!(
        "π is approximately {}",
        4. * (in_circle as f64) / (SAMPLES as f64)
    );
}
```

## Practice: deterministic multi-threaded

We use approach (4) above to achieve a deterministic result: initialize all RNGs
from a single seed, but using multiple streams.
We use [`ChaCha8Rng::set_stream`] to achieve this.

Note further that we manually batch multiple work-units according to
`BATCH_SIZE`. This is important since the cost of initializing an RNG is large
compared to the cost of our work unit (generating two random samples plus some
trivial calculations). Manual batching could improve performance of the above
non-deterministic simulation too.

(Note: this example is <https://github.com/rust-random/rand/blob/master/examples/rayon-monte-carlo.rs>.)

```rust
use rand::distr::{Distribution, Uniform};
use rand::{SeedableRng, rngs::ChaCha8Rng};
use rayon::prelude::*;

static SEED: u64 = 0;
static BATCH_SIZE: u64 = 10_000;
static BATCHES: u64 = 1000;

fn main() {
    let range = Uniform::new(-1.0f64, 1.0).unwrap();

    let in_circle = (0..BATCHES)
        .into_par_iter()
        .map(|i| {
            let mut rng = ChaCha8Rng::seed_from_u64(SEED);
            rng.set_stream(i);
            let mut count = 0;
            for _ in 0..BATCH_SIZE {
                let a = range.sample(&mut rng);
                let b = range.sample(&mut rng);
                if a * a + b * b <= 1.0 {
                    count += 1;
                }
            }
            count
        })
        .reduce(|| 0usize, |a, b| a + b);

    // prints 3.1409052 (determinstic and reproducible result)
    println!(
        "π is approximately {}",
        4. * (in_circle as f64) / ((BATCH_SIZE * BATCHES) as f64)
    );
}
```

[`rng()`]: https://docs.rs/rand/latest/rand/fn.rng.html
[`map_init`]: https://docs.rs/rayon/latest/rayon/iter/trait.ParallelIterator.html#method.map_init
[`ChaCha8Rng::set_stream`]: https://docs.rs/rand_chacha/latest/rand_chacha/struct.ChaCha8Rng.html#method.set_stream
