# Guide

This section attempts to explain some of the concepts used in this library.

1.  [Intro: Hello Random example](guide-start.md)
1.  [What is random data and what is randomness anyway?](guide-data.md)
1.  [What kind of random generators are there?](guide-gen.md)
1.  [What random number generators does Rand provide?](guide-rngs.md)
1.  [Turning random data into useful values](guide-values.md)
1.  [Distributions: more control over random values](guide-dist.md)
1.  [Sequences](guide-seq.md)
1.  [Error handling](guide-err.md)

## Importing items (prelude)

The most convenient way to import items from Rand is to use the [`prelude`].
This includes the most important parts of Rand, but only those unlikely to
cause name conflicts.

Note that Rand 0.5 has significantly changed the module organization and
contents relative to previous versions. Where possible old names have been
kept (but are hidden in the documentation), however these will be removed
in the future. We therefore recommend migrating to use the prelude or the
new module organization in your imports.


## Further examples

For some inspiration, see the example applications:

- [Monte Carlo estimation of π](
  https://github.com/rust-random/rand/blob/master/examples/monte-carlo.rs)
- [Monty Hall Problem](
   https://github.com/rust-random/rand/blob/master/examples/monty-hall.rs)

[`prelude`]: ../rand/rand/prelude/index.html
