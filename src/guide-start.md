# Getting Started

Below we list a short example. For more, please refer to the [API documentation]
or the [guide].

Lets kick things off with an example ([playground link](https://play.rust-lang.org/?version=stable&mode=debug&edition=2018&gist=7792ed032694bc558ca229be71a7783a)):

```rust,editable
# extern crate rand;
// import commonly used items from the prelude:
use rand::prelude::*;

fn main() {
    // We can use random() immediately. It can produce values of many common types:
    let x: u8 = random();
    println!("{}", x);

    if random() { // generates a boolean
        println!("Heads!");
    }

    // If we want to be a bit more explicit (and a little more efficient) we can
    // make a handle to the thread-local generator:
    let mut rng = thread_rng();
    if rng.gen() { // random bool
        let x: f64 = rng.gen(); // random number in range [0, 1]
        let y = rng.gen_range(-10.0..10.0);
        println!("x is: {}", x);
        println!("y is: {}", y);
    }

    println!("Die roll: {}", rng.gen_range(1..=6));
    println!("Number from 0 to 9: {}", rng.gen_range(0..10));
    
    // Sometimes it's useful to use distributions directly:
    let distr = rand::distributions::Uniform::new_inclusive(1, 100);
    let mut nums = [0i32; 3];
    for x in &mut nums {
        *x = rng.sample(distr);
    }
    println!("Some numbers: {:?}", nums);

    // We can also interact with iterators and slices:
    let arrows_iter = "➡⬈⬆⬉⬅⬋⬇⬊".chars();
    println!("Lets go in this direction: {}", arrows_iter.choose(&mut rng).unwrap());
    let mut nums = [1, 2, 3, 4, 5];
    nums.shuffle(&mut rng);
    println!("I shuffled my {:?}", nums);
}
```

The first thing you may have noticed is that we imported everything from the
[prelude]. This is the lazy way to `use` rand, and like the
[standard library's prelude](https://doc.rust-lang.org/std/prelude/index.html),
only imports the most common items. If you don't wish to use the prelude,
remember to import the [`Rng`] trait!

The Rand library automatically initialises a secure, thread-local generator
on demand. This can be accessed via the [`thread_rng`] and [`random`] functions.
For more on this topic, see [Random generators](guide-gen.md).

While the [`random`] function can only sample values in a [`Standard`]
(type-dependent) manner, [`thread_rng`] gives you a handle to a generator.
All generators implement the [`Rng`] trait, which provides the [`gen`],
[`gen_range`] and [`sample`] methods used above.

Rand provides functionality on iterators and slices via two more traits,
[`IteratorRandom`] and [`SliceRandom`].

## Fixed seed RNGs

You may have noticed the use of `thread_rng()` above and wondered how to
specify a fixed seed. To do so, you need to specify an RNG then use a method
like [`seed_from_u64`] or [`from_seed`].

Note that [`seed_from_u64`] is **not suitable for cryptographic uses** since a
single `u64` cannot provide sufficient entropy to securely seed an RNG.
All cryptographic RNGs accept a more appropriate seed via [`from_seed`].

We use `ChaCha8Rng` below because it is fast and portable with good quality.
See the [RNGs] section for more RNGs, but avoid `SmallRng` and `StdRng` if you
care about reproducible results.

```rust,editable
# extern crate rand;
# extern crate rand_chacha;
use rand::{Rng, SeedableRng};

fn main() {
    let mut rng = rand_chacha::ChaCha8Rng::seed_from_u64(10);
    println!("Random f32: {}", rng.gen::<f32>());
}
```

[API documentation]: https://rust-random.github.io/rand/rand/index.html
[guide]: guide.md
[RNGs]: guide-rngs.md
[prelude]: https://rust-random.github.io/rand/rand/prelude/index.html
[`Rng`]: https://rust-random.github.io/rand/rand/trait.Rng.html
[`gen`]: https://rust-random.github.io/rand/rand/trait.Rng.html#method.gen
[`gen_range`]: https://rust-random.github.io/rand/rand/trait.Rng.html#method.gen_range
[`sample`]: https://rust-random.github.io/rand/rand/trait.Rng.html#method.sample
[`thread_rng`]: https://rust-random.github.io/rand/rand/fn.thread_rng.html
[`random`]: https://rust-random.github.io/rand/rand/fn.random.html
[`Standard`]: https://rust-random.github.io/rand/rand/distributions/struct.Standard.html
[`IteratorRandom`]: https://rust-random.github.io/rand/rand/seq/trait.IteratorRandom.html
[`SliceRandom`]: https://rust-random.github.io/rand/rand/seq/trait.SliceRandom.html
[`seed_from_u64`]: https://rust-random.github.io/rand/rand/trait.SeedableRng.html#method.seed_from_u64
[`from_seed`]: https://rust-random.github.io/rand/rand/trait.SeedableRng.html#tymethod.from_seed
