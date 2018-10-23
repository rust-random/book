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
    6, and an unbiased (fair) die will make each number equally likely.
-   Now lets take a silly example: the natural numbers (1, 2, 3, etc.). These
    numbers have no limit. So if you were to ask for an unbiased random
    natural number, 1, 5, 1000, 1 million, 1 trillion — all would be equally
    likely. Since there is no upper bound here, the *expected value* (the
    "average" value) is infinitely large. So maybe this isn't useful to us.
-   Another example: real numbers between 0 and 1. Real numbers include all the
    fractions, irrational numbers like π and √2, and all multiples of those...
    there are infinitely many possibilities, even in a small range like `(0, 1)`,
    so simply saying "all possibilities are equally likely" is not enough.
    Instead we interpret *lack of pattern* in a different way: every interval
    of equal size is equally likely; e.g. 0-0.1 is just as likely as 0.1-0.2
    and 0.9-1.0 to contain our random value.

To bring us back to computing, we can now define what an *unbiased random value*
is in several contexts:

-   `u32`: a random number between 0 and `u32::MAX` where each value is equally
    likely
-   `BigInt`: since this type has no upper bound, we cannot produce an unbiased
    random value (it would be infinitely large, and use infinite amounts of memory)
-   `f64`: again, this has a large range, however, *by convention*, we usually
    restrict to the range 0 to 1 (if not otherwise specified)

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
