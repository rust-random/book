# Testing

Rand has a number of unit tests, though these are not comprehensive or perfect
(improvements welcome). We prefer to have tests for all new functionality.

The first line of testing is simply to run `cargo test` from the appropriate
directory. Since Rand supports `no_std` (core-only), `core+alloc` and `std`
environments, it is important to test all three (depending on which features
are applicable to the code in question):

```sh
# Test using std:
cargo test
# Test using only core:
cargo test --tests --no-default-features
# Test using core + alloc (requires nightly):
cargo +nightly test --tests --no-default-features --features=alloc
```

It may also be worth testing with other feature flags:

```sh
cargo test --all-features
```

Note that this only tests the current package (i.e. the main Rand lib when run
from the repo's top level). To test another lib, `cd` to its directory.

We do not recommend using Cargo's `--package` option due to its 
[surprising interactions](https://github.com/rust-lang/cargo/issues/5364)
with `--feature` options and failure when multiple versions of the same package
are in the build tree. The CI instead uses `--manifest-path` to select packages;
while developing, using `cd` is easier.

## Writing tests

Tests may be unit tests within a `test` sub-module, documentation examples,
example applications (`examples` dir), integration tests (`tests` dir), or
benchmarks (`benches` dir).

Note that *only* unit tests and integration tests are expected to pass in
`no_std` (core only) and `core+alloc` configurations. This is a deliberate
choice; example code should only need to target the common case (`std`).

### Random Number Generators

Often test code needs some RNG to test with, but does not need any particular
RNG. In this case, we prefer use of `::test::rng` which is simple, fast to
initialise and deterministic:

```rust,ignore
let mut rng = ::test::rng(528); // just pick some number
```

Various tests concern properties which are *probably* true, but not definitely.
We prefer that such tests are deterministic to avoid spurious failures.
