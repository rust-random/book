# Feature flags

Some functionality is gated behind Cargo features, which must be enabled as
required, e.g.

```
rand = { version = "0.7", features = ["log", "serde1"] }
```

### Small RNG

From Rand version 0.7, the [`SmallRng`] type is gated behind the `small_rng`
feature flag (this reduces `rand`'s depnedency count by one if not used).

### Logging

Rand can optionally log a few events (mostly related to reseeding of
[`ThreadRng`] and to [`rand_jitter`]).

### Serde

Some parts of the Rand lib support serialisation via [Serde](https://serde.rs/).
To enable this, use the `serde1` feature.

Note that cryptographic RNGs *do not* support serialisation since this could be
a security risk. If you need state-restore functionality on a cryptographic RNG,
the ChaCha generator supports [getting and setting the stream position](https://rust-random.github.io/rand/rand_chacha/struct.ChaCha20Rng.html#method.get_word_pos),
which, together with the seed, can be used to reconstruct the generator's state.

### SIMD support

Experimental support for generating SIMD values is available under the
`simd_support` feature gate. This requires nightly Rust.

The ChaCha implementations provided by [`rand_chacha`] use SIMD operations
internally even on stable Rust. This is enabled by default.

### No-std mode

Almost all Rand libraries can be used without Rust's standard library:

-   For the [`rand`] and [`rand_chacha`] crates, one must disable default features
    (`default-features = false`) and some functionality is lost.
-   The [`rand_core`] and [`rand_jitter`] crates assume `no_std` by default, but
    support some additional functionality when the `std` feature is enabled.
-   [`getrandom`] (and by extension [`rand_os`]) has limited support for `no_std`.
    It does not use feature flags, instead detecting requirements based on the target platform.
-   The [`rand_distr`] crate does not support `no_std` mode.
-   All PRNG crates other than [`rand_chacha`] do not require `std`.

If an allocator is available, some functionality can be recovered by use of the
`alloc` feature. On:

-   [`rand_core`], the `alloc` feature enables blanket trait impls for `Box<T>`
-   [`rand`], the `alloc` feature enables sequence-related functionality


[`SmallRng`]: https://rust-random.github.io/rand/rand/rngs/struct.SmallRng.html
[`ThreadRng`]: https://rust-random.github.io/rand/rand/rngs/struct.ThreadRng.html
[`rand_jitter`]: https://rust-random.github.io/rand/rand_jitter/index.html
[`rand_chacha`]: https://rust-random.github.io/rand/rand_chacha/index.html
[`rand_core`]: https://rust-random.github.io/rand/rand_core/index.html
[`rand`]: https://rust-random.github.io/rand/rand/index.html
[`rand_distr`]: https://rust-random.github.io/rand/rand_distr/index.html
[`getrandom`]: https://docs.rs/getrandom/
[`rand_os`]: https://rust-random.github.io/rand/rand_os/index.html
