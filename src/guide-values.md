# Random values

Now that we have a way of producing random data, how can we convert it to the
type of value we want?

This is a trick question: we need to know both the *range* we want and the type
of *distribution* of this value (which is what the [`next`](guide-dist.md) section
is all about).

## The `Rng` trait

For convenience, all generators automatically implement the [`Rng`] trait,
which provides short-cuts to a few ways of generating values. This has several
convenience functions for producing uniformly distributed values:

-   [`Rng::random`] generates an unbiased (uniform) random value from a range
    appropriate for the
    type. For integers this is normally the full representable range
    (e.g. from `0u32` to `std::u32::MAX`), for floats this is between 0 and 1,
    and some other types are supported, including arrays and tuples.
    
    This method is a convenience wrapper around the [`StandardUniform`] distribution,
    as documented in the [next section](guide-dist.html#uniform-distributions).
-   [`Rng::random_range`] generates an unbiased random value in the given range
-   [`Rng::fill`] and [`Rng::try_fill`] are optimised functions for filling any byte or
    integer slice with random values

It also has convenience functions for producing non-uniform boolean values:

-   [`Rng::random_bool`] generates a boolean with the given probability
-   [`Rng::random_ratio`] also generates a boolean, where the probability is defined
    via a fraction

Finally, it has a function to sample from arbitrary distributions:

-   [`Rng::sample`] samples directly from some [distribution](guide-dist.md)

Examples:

```rust
# extern crate rand;
use rand::Rng;
# fn main() {
let mut rng = rand::rng();

// an unbiased integer over the entire range:
let i: i32 = rng.random();
println!("i = {i}");

// a uniformly distributed value between 0 and 1:
let x: f64 = rng.random();
println!("x = {x}");

// simulate rolling a die:
println!("roll = {}", rng.random_range(1..=6));
# }
```

Additionally, the [`random`] function is a short-cut to [`Rng::random`] on the [`rng()`]:
```rust
# extern crate rand;
# use rand::Rng;
# fn main() {
println!("Tossing a coin...");
if rand::random() {
    println!("We got lucky!");
}
# }
```

## Custom random types

Notice from the above that `rng.random()` yields a different distribution of values
depending on the type:

-   `i32` values are sampled from `i32::MIN ..= i32::MAX` uniformly
-   `f32` values are sampled from `0.0 .. 1.0` uniformly

This is the [`StandardUniform`] distribution. [`Distribution`]s are the topic of the
next chapter, but given the importance of the [`StandardUniform`] distribution we
introduce it here. As usual, standards are somewhat arbitrary, but chosen
according to reasonable logic:

-   Values are sampled uniformly: given any two sub-ranges of equal size, each
    has an equal chance of containing the next sampled value
-   Usually, the whole range of the target type is used
-   For `f32` and `f64` the range `0.0 .. 1.0` is used (exclusive of `1.0`), for
    two reasons: (a) this is common practice for random-number generators and
    (b) because for many purposes having a uniform distribution of samples
    (along the Real number line) is important, and this is only possible for
    floating-point representations by restricting the range.

Given that, we can implement the [`StandardUniform`] distribution for our own types:
```rust
# extern crate rand;
use rand::Rng;
use rand::distr::{Distribution, StandardUniform, Uniform};
use std::f64::consts::TAU; // = 2π

/// Represents an angle, in radians
#[derive(Debug)]
pub struct Angle(f64);
impl Angle {
    pub fn from_degrees(degrees: f64) -> Self {
        Angle(degrees * (std::f64::consts::TAU / 360.0))
    }
}

impl Distribution<Angle> for StandardUniform {
    fn sample<R: Rng + ?Sized>(&self, rng: &mut R) -> Angle {
        // It would be correct to write:
        // Angle(rng.random::<f64>() * TAU)

        // However, the following is preferred:
        Angle(Uniform::new(0.0, TAU).unwrap().sample(rng))
    }
}

fn main() {
    let angle: Angle = rand::rng().random();
    println!("Random angle: {angle:?}");
}
```

[`Rng`]: https://docs.rs/rand/latest/rand/trait.Rng.html
[`Rng::random`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random
[`Rng::random_range`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random_range
[`Rng::sample`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.sample
[`Rng::random_bool`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random_bool
[`Rng::random_ratio`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.random_ratio
[`Rng::fill`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.fill
[`Rng::try_fill`]: https://docs.rs/rand/latest/rand/trait.Rng.html#method.try_fill
[`random`]: https://docs.rs/rand/latest/rand/fn.random.html
[`rng()`]: https://docs.rs/rand/latest/rand/fn.rng.html
[`Distribution`]: https://docs.rs/rand/latest/rand/distr/trait.Distribution.html
[`StandardUniform`]: https://docs.rs/rand/latest/rand/distr/struct.StandardUniform.html
