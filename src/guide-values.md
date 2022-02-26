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

-   [`Rng::gen`] generates an unbiased (uniform) random value from a range
    appropriate for the
    type. For integers this is normally the full representable range
    (e.g. from `0u32` to `std::u32::MAX`), for floats this is between 0 and 1,
    and some other types are supported, including arrays and tuples.
    
    This method is a convenience wrapper around the [`Standard`] distribution,
    as documented in the [next section](guide-dist.html#uniform-distributions).
-   [`Rng::gen_range`] generates an unbiased random value in the given range
-   [`Rng::fill`] and [`Rng::try_fill`] are optimised functions for filling any byte or
    integer slice with random values

It also has convenience functions for producing non-uniform boolean values:

-   [`Rng::gen_bool`] generates a boolean with the given probability
-   [`Rng::gen_ratio`] also generates a boolean, where the probability is defined
    via a fraction

Finally, it has a function to sample from arbitrary distributions:

-   [`Rng::sample`] samples directly from some [distribution](guide-dist.md)

Examples:

```rust
# extern crate rand;
use rand::Rng;
let mut rng = rand::thread_rng();

// an unbiased integer over the entire range:
let i: i32 = rng.gen();

// a uniformly distributed value between 0 and 1:
let x: f64 = rng.gen();

// simulate rolling a die:
let roll = rng.gen_range(1..7);
```

Additionally, the [`random`] function is a short-cut to [`Rng::gen`] on the [`thread_rng`]:
```rust
if rand::random() {
    println!("we got lucky!");
}
```

## Custom random types

Notice from the above that `rng.gen()` yields a different distribution of values
depending on the type:

-   `i32` values are sampled from `i32::MIN ..= i32::MAX` uniformly
-   `f32` values are sampled from `0.0 .. 1.0` uniformly

This is the [`Standard`] distribution. [`Distribution`]s are the topic of the
next chapter, but given the importance of the [`Standard`] distribution we
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

Given that, we can implement the [`Standard`] distribution for our own types:
```rust
# extern crate rand;
use rand::Rng;
use rand::distributions::{Distribution, Standard, Uniform};
use std::f64::consts::TAU; // = 2π

/// Represents an angle, in radians
#[derive(Debug)]
pub struct Angle(f64);
impl Angle {
    pub fn from_degrees(degrees: f64) -> Self {
        Angle(degrees * (std::f64::consts::TAU / 360.0))
    }
}

impl Distribution<Angle> for Standard {
    fn sample<R: Rng + ?Sized>(&self, rng: &mut R) -> Angle {
        // It would be correct to write:
        // Angle(rng.gen::<f64>() * TAU)

        // However, the following is preferred:
        Angle(Uniform::new(0.0, TAU).sample(rng))
    }
}

fn main() {
    let mut rng = rand::thread_rng();
    let angle: Angle = rng.gen();
    println!("Random angle: {angle:?}");
}
```

[`Rng`]: ../rand/rand/trait.Rng.html
[`Rng::gen`]: ../rand/rand/trait.Rng.html#method.gen
[`Rng::gen_range`]: ../rand/rand/trait.Rng.html#method.gen_range
[`Rng::sample`]: ../rand/rand/trait.Rng.html#method.sample
[`Rng::gen_bool`]: ../rand/rand/trait.Rng.html#method.gen_bool
[`Rng::gen_ratio`]: ../rand/rand/trait.Rng.html#method.gen_ratio
[`Rng::fill`]: ../rand/rand/trait.Rng.html#method.fill
[`Rng::try_fill`]: ../rand/rand/trait.Rng.html#method.try_fill
[`random`]: ../rand/rand/fn.random.html
[`thread_rng`]: ../rand/rand/fn.thread_rng.html
[`Standard`]: ../rand/rand/distributions/struct.Standard.html
