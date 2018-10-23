# Sequences

Rand implements a few common random operations on sequences via the
[`IteratorRandom`] and [`SliceRandom`] traits:

-   `choose` one element uniformly from the sequence
-   `choose_multiple` elements uniformly without replacement
-   `choose_weighted` — choose an element non-uniformly by use of a defined
    weight from a slice (also see the [`WeightedIndex`] distribution)
-   `shuffle` a slice
-   `partial_shuffle` a slice, effectively extracting `amount` elements in
    random order

[`IteratorRandom`]: ../rand/rand/seq/trait.IteratorRandom.html
[`SliceRandom`]: ../rand/rand/seq/trait.SliceRandom.html
[`WeightedIndex`]: ../rand/rand/distributions/struct.WeightedIndex.html
