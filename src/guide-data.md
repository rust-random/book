# Random data

```rust
# extern crate rand;
# use rand::RngCore;
// get some random data:
let mut data = [0u8; 32];
rand::thread_rng().fill_bytes(&mut data);
```

## What is randomness?

What does **random** mean? Colloquially the word can mean simply *unexpected*
or *unknown*, but we need to be a bit more precise than that. Wikipedia gives us
a more specific definition:

> **Randomness** is the lack of pattern or predictability in events.

We can take this further: *lack of pattern* implies there is no *bias*; in
other words, all possible values are equally likely.

To understand what a *random value* is, we still need a context: what pool of
numbers can our random value come from?

-   To give a simple example, consider dice: they have values 1, 2, 3, 4, 5 and
    6, and an unbiased (fair) die will make each number equally likely, with
    probability ⅙th.
-   Now lets take a silly example: the natural numbers (1, 2, 3, etc.). These
    numbers have no limit. So if you were to ask for an unbiased random
    natural number, 1, 5, 1000, 1 million, 1 trillion — all would be equally
    likely. In fact, for *any* natural number `k`, the numbers `1, 2, ..., k`
    are an infinitely small fraction of all the natural numbers, which means the
    chance of picking a unbiased number from this range is effectively `1/∞ = 0`.
    Put another way: for *any* natural number, we expect an unbiased random
    value to be bigger. This is impossible, so there cannot be any such thing as
    an unbiased random natural number.
-   Another example: real numbers between 0 and 1. Real numbers include all the
    fractions, irrational numbers like π and √2, and all multiples of those...
    there are infinitely many possibilities, even in a small range like `(0, 1)`,
    so simply saying "all possibilities are equally likely" is not enough.
    Instead we interpret *lack of pattern* in a different way: every interval
    of equal size is equally likely; for example we could subdivide the interval
    `0,1` into `0,½` and `½,1` and toss a coin to decide which interval our
    random sample comes from. Say we pick `½,1` we can then toss another coin to
    decide between `½,¾` and `¾,1`, restricting our random value to an inverval
    of size `¼`. We can repeat this as many times as necessary to pick a random
    value between `0` and `1` with as much precision as we want — although we
    should realise that we are not choosing an *exact* value but rather just a
    small interval.

What we have defined (or failed to define) above are uniform random number
distributions, or simply **uniform distributions**. There are also non-uniform
distributions, as we shall see later. It's also worth noting here that a
uniform distribution does not imply that its samples will be *evenly* spread
(try rolling six dice: you probably won't get 1, 2, 3, 4, 5, 6).

To bring us back to computing, we can now define what a uniformly distributed
random value (an unbiased random value) is in several contexts:

-   `u32`: a random number between 0 and `u32::MAX` where each value is equally
    likely
-   `BigInt`: since this type has no upper bound, we cannot produce an unbiased
    random value (it would be infinitely large, and use infinite amounts of memory)
-   `f64`: we treat this as an approximation of the real numbers, and,
    *by convention*, restrict to the range 0 to 1 (if not otherwise specified).
    Note that this type has finite precision, so we use the coin-flipping method
    above (but with random bits instead of coins) until we get as much precision
    as the type can represent; however, since floating-point numbers are much
    more precise close to 0 than they are near 1, we typically simplify here and
    stop once we have enough precision to differentiate between 1 and the next
    smallest value representable (`1 - ε/2`).

## Random data

As seen above, the term "random number" is meaningless without context. "Random
data" typically means a sequence of random *bytes*, where for each byte, each of
the 256 possible values are equally likely.

[`RngCore::fill_bytes`] produces exactly this: a sequence of random bytes.

If a sequence of unbiased random bytes of the correct length is instead
interpreted as an integer — say a `u32` or `u64` — the result is an unbiased
integer. Since this conversion is trivial, [`RngCore::next_u32`] and
[`RngCore::next_u64`] are part of the same trait. (In fact the conversion is
often the other way around — algorithmic generators usually work with integers
internally, which are then converted to whichever form of random data is
required.)

[`RngCore::fill_bytes`]: ../rand/rand_core/trait.RngCore.html#tymethod.fill_bytes
[`RngCore::next_u32`]: ../rand/rand_core/trait.RngCore.html#tymethod.next_u32
[`RngCore::next_u64`]: ../rand/rand_core/trait.RngCore.html#tymethod.next_u64
