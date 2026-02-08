# Updating to 0.10

In the following, instructions are provided for porting your code from
`rand 0.9` to `rand 0.10`.

The following is a migration guide focussing on potentially-breaking changes. For a full list of changes, see the relevant changelogs:

-   [CHANGELOG.md](https://github.com/rust-random/rand/blob/master/CHANGELOG.md).
-   [rand_core/CHANGELOG.md](https://docs.rs/crate/rand_core/latest/source/CHANGELOG.md).


## [Try]Rng traits

The `rand_core` traits `RngCore, TryRngCore` were renamed to `Rng, TryRng` and the `rand` trait `Rng` to `RngExt` respectively.

The relationship between these traits also changed; previously, every `R: RngCore` implemented `TryRngCore` but otherwise the two traits were independent; now `Rng: TryRng<Error = Infallible>` and every `R: TryRng<Error = Infallible> + ?Sized` implements `Rng`.

Further, while we previously implemented `R: RngCore` for every `R: DerefMut where R::Target: RngCore`, we were unable to do so due to conflicting-trait errors (solving this would have required specialization or negative trait bounds). Now, we implement `R: TryRng` for every `R: DerefMut where R::Target: TryRng` which thus implies `R: Rng` for every `R: DerefMut where R::Target: Rng`.

The biggest impact here is that infallible PRNGs must implement `TryRng` with `Error = Infallible` instead of implementing `RngCore`.

Users of `rand` will often need to import `rand::RngExt` may need to migrate from `R: RngCore` to `R: Rng` (noting that where `R: Rng` was previously used it may be preferable to keep `R: Rng` even though the direct replacement would be `R: RngExt`; the two bounds are equivalent for `R: Sized`).


## SysRng

`rand_core::OsRng` has been replaced with `getrandom::SysRng` (also available as `rand::rngs::SysRng`).

The methods `SeedableRng::from_os_rng` and `try_from_os_rng` have thus been removed. `rand::make_rng()` is provided as a partial replacement; otherwise use `SomeRng::try_from_rng(&mut SysRng).unwrap()`.


## PRNGs

`StdRng` is now provided by `chacha20` instead of `rand_chacha`. For the time being both packages are maintained, but `rand_chacha` is likely to be discontinued in the future. The `ChaCha{8,12,20}Rng` types are a direct replacement for the like-named `rand_chacha` types; these maintain reproducibility of output and have a similar API.

Note that `rand::rngs` now provides several named PRNGs, making it simpler to write [reproducible](crate-reprod.md) code: `ChaCha{8,12,20}Rng`, `Xoshiro{128,256}PlusPlus`.

Other PRNG crates have been updated with minimal changes (though this may not remain the case indefinitely; see [rngs#98](https://github.com/rust-random/rngs/issues/98)). One new crate has been added: [rand_sfc](https://docs.rs/rand_sfc/latest/rand_sfc/).

### Clone and serialization support

`StdRng` and `ChaCha{8,12,20}Rng` no longer implement `Clone` or the [serde] traits. This was a deliberate choice to prevent accidental key-stream duplication or persisting to external storage. Note that it remains possible to clone or serialize these RNGs by reconstructing a new instance with the same key, then setting the stream (if applicable) and word position. For example:
```rust,editable
use rand::{rngs::ChaCha8Rng, Rng};

let mut rng1: ChaCha8Rng = rand::make_rng();
let _: u128 = rng1.next_u64();

let mut rng2 = ChaCha8Rng::from_seed(rng1.get_seed());
rng2.set_stream(rng1.get_stream());
rng2.set_word_pos(rng1.get_word_pos());

assert_eq!(rng1.next_u64(), rng2.next_u64());
```


## Other changes

`TryRngCore::read_adapter` was replaced with `rand::RngReader`.

### ReseedingRng

`ReseedingRng` has been removed without replacement since, as far as we have been able to discern, `ThreadRng` is the only important use-case. We have thus opted to move its functionality into `ThreadRng` as an implementation detail.


## Dependencies

Rand crates now require **`rustc`** version 1.85.0 or later.

The dependency on **`getrandom`** was bumped to version 0.4. See [the getrandom CHANGELOG](https://github.com/rust-random/getrandom/blob/master/CHANGELOG.md).

### Features

Feature flags:

-   `os_rng` was renamed to `sys_rng`
-   `thread_rng`, `std_rng` and `sys_rng` are no longer enabled by default (TODO: this is not yet confirmed)
-   `small_rng` has been removed; its functionality is always available
-   `chacha` is a new flag, enabling `rand::rngs::ChaCha{8,12,20}Rng`


## Reproducibility

There are no known value-breaking changes to `rand` in v0.10.


[serde]: https://serde.rs/
