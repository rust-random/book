# Our RNGs

There are many kinds of RNGs, with different trade-offs. You can read more
about them in the [`rngs` module] and even more in the [`prng` module],
however, often you can just use [`thread_rng`]. This function
automatically initializes an RNG in thread-local memory, then returns a
reference to it. It is fast, good quality, and secure (unpredictable).

TODO
