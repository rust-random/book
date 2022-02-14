# Random processes

You may have noticed that the [`Distribution`] trait does not allow mutation of
self (no `&mut self` methods). This is by design: a probability distribution is
defined as a mapping from events to probabilities.

In contrast, a [Stochastic Process](https://en.wikipedia.org/wiki/Stochastic_process)
concerns a family of variables (or state) which mutate in a random manner.

We do not attempt to define a general API covering random processes or to
provide direct support for modelling them. Here we merely discuss some.


## Sampling without replacement

Given, for example, a bag of 10 red marbles and 30 green marbles, the initial
probability that a marble sampled from the bag is red is `10/(10 + 30) = ¼ = 0.25`.
If the first marble *is* red and *is not replaced*, then the probability that
the second marble sampled from the bag is red is `9/(9 + 30) = 3/13 ≅ 0.23`.

The `rand` crate does not provide any system supporting step-wise sampling
without replacement. What it does provide is support for sampling multiple
distinct values from a sequence in a single step:
[`IteratorRandom::choose_multiple`] and [`SliceRandom::choose_multiple`].

If you wish to implement step-wise sampling yourself, here are a few ideas:

-   Place all elements in a `Vec`. Each step sample and remove one value. Note
    that if the set of all possible elements is large this is inefficient since
    `Vec::remove` is `O(n)` and since all elements must be constructed.
-   Place all elements in a `Vec` and shuffle. Each step simply take the next
    element.
-   Construct a method of sampling values from the initial distribution plus an
    empty `HashSet` representing "taken" values. Each step, sample a value; if
    it is in the `HashSet` then reject the value and sample again, otherwise
    place a copy in a `HashSet` and return. Note that this method is inefficient
    unless the number of samples taken is much smaller than the number of
    available elements.
-   Investigate [`src/seq/index.rs`]: several sampling algorithms are used which
    may be adjusted to this application.


[`Distribution`]: ../rand/rand/distributions/trait.Distribution.html
[`IteratorRandom::choose_multiple`]: ../rand/rand/seq/trait.IteratorRandom.html#method.choose_multiple
[`SliceRandom::choose_multiple`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.choose_multiple
[`src/seq/index.rs`]: https://github.com/rust-random/rand/blob/master/src/seq/index.rs
