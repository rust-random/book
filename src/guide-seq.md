# Sequences

Rand implements a few common random operations on sequences via the
[`IteratorRandom`] and [`SliceRandom`] traits.

## Generating indices

To sample:

-   a single index within a given range, use [`Rng::gen_range`]
-   multiple distinct indices from `0..length`, use [`index::sample`]
-   multiple distinct indices from `0..length` with weights, use [`index::sample_weighted`]

## Shuffling

To shuffle a slice:

-   [`SliceRandom::shuffle`]: fully shuffle a slice
-   [`SliceRandom::partial_shuffle`]: partial shuffle; useful to extract
    `amount` random elements in random order

## Sampling

The following provide a convenient way of sampling a value from a slice or iterator:

-   [`SliceRandom::choose`]: sample one element from a slice (by ref)
-   [`SliceRandom::choose_mut`]: sample one element from a slice (by ref mut)
-   [`SliceRandom::choose_multiple`]: sample multiple distinct elements from a slice (returns iterator of references to elements)
-   [`IteratorRandom::choose`]: sample one element from an iterator (by value)
-   [`IteratorRandom::choose_stable`]: sample one element from an iterator (by value), where RNG calls are unaffected by the iterator's [`size_hint`]
-   [`IteratorRandom::choose_multiple_fill`]: sample multiple elements, placing into a buffer
-   [`IteratorRandom::choose_multiple`]: sample multiple elements, returning a [`Vec`]

Note that operating on an iterator is often less efficient than operating on a
slice.

## Weighted sampling

For example, weighted sampling could be used to model the colour of a marble
sampled from a bucket containing 5 green, 15 red and 80 blue marbles.

### With replacement

Sampling *with replacement* implies that any sampled values (marbles) are
replaced (thus, the probability of sampling each variant is not affected by the
action of sampling).

This is implemented by the following distributions:

-   [`WeightedIndex`] has fast setup and `O(log N)` sampling
-   [`WeightedAliasIndex`] has slow setup and `O(1)` sampling, thus *may* be
    faster with a large number of samples

For convenience, you may use:

-   [`SliceRandom::choose_weighted`]
-   [`SliceRandom::choose_weighted_mut`]

### Without replacement

Sampling *without replacement* implies that the action of sampling modifies the
distribution. Since the [`Distribution`] trait is built around the idea of
immutable distributions, we offer the following:

-   [`SliceRandom::choose_multiple_weighted`]: sample `amount` distinct values
    from a slice with weights
-   [`index::sample_weighted`]: sample `amount` distinct indices from a range with
    weights
-   Implement yourself: see the section in [Random processes](guide-process.html#sampling-without-replacement)

[`Distribution`]: ../rand/rand/distributions/trait.Distribution.html
[`IteratorRandom`]: ../rand/rand/seq/trait.IteratorRandom.html
[`SliceRandom`]: ../rand/rand/seq/trait.SliceRandom.html
[`WeightedIndex`]: ../rand/rand/distributions/struct.WeightedIndex.html
[`WeightedAliasIndex`]: ../rand/rand_distr/weighted_alias/struct.WeightedAliasIndex.html
[`SliceRandom::choose`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.choose
[`SliceRandom::choose_mut`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.choose_mut
[`SliceRandom::choose_multiple`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.choose_multiple
[`IteratorRandom::choose`]: ../rand/rand/seq/trait.IteratorRandom.html#method.choose
[`IteratorRandom::choose_stable`]: ../rand/rand/seq/trait.IteratorRandom.html#method.choose_stable
[`IteratorRandom::choose_multiple`]: ../rand/rand/seq/trait.IteratorRandom.html#method.choose_multiple
[`IteratorRandom::choose_multiple_fill`]: ../rand/rand/seq/trait.IteratorRandom.html#method.choose_multiple_fill
[`SliceRandom::choose_weighted`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.choose_weighted
[`SliceRandom::choose_weighted_mut`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.choose_weighted_mut
[`SliceRandom::choose_multiple_weighted`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.choose_multiple_weighted
[`SliceRandom::shuffle`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.shuffle
[`SliceRandom::partial_shuffle`]: ../rand/rand/seq/trait.SliceRandom.html#tymethod.partial_shuffle
[`Rng::gen_range`]: ../rand/rand/trait.Rng.html#method.gen_range
[`index::sample`]: ../rand/rand/seq/index/fn.sample.html
[`index::sample_weighted`]: ../rand/rand/seq/index/fn.sample_weighted.html
[`size_hint`]: https://doc.rust-lang.org/stable/std/iter/trait.Iterator.html#method.size_hint
[`Vec`]: https://doc.rust-lang.org/stable/std/vec/struct.Vec.html
