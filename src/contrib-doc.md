# Documentation

### Style

All documentation is in English, but no particular dialect is preferred.

The documentation should be accessible to multiple audiences: both seasoned
Rustaceans and relative newcomers, those with experience in statistical
modelling or cryptography, as well as those new to the subjects. Since it is
often impossible to write appropriate one-size-fits-all documentation, we
prefer concise technical documentation with reference to extended articles
aimed at more specific audiences.

## API documentation

### Rand crates

It is recommended to use nightly Rust for correct link handling.

To build all API documentation for all crates in the
[rust-random/rand](https://github.com/rust-random/rand) repository, run:

```sh
# Build doc for all modules:
cargo doc --all --no-deps

# And open it:
xdg-open target/doc/rand/index.html
```

On Linux, it is easy to set up automatic rebuilds after any edit:
```sh
while inotifywait -r -e close_write src/ rand_*/; do cargo doc; done
```

After editing API documentation, we recommend testing examples:

```sh
cargo test --doc
```

### Getrandom crate

The [rust-random/getrandom](https://github.com/rust-random/getrandom)
repository contains only a single crate, hence a simple `cargo doc` will
suffice.

### Cross-crate links

When referring to another crate, we prefer linking to the crate page on
crates.io since (a) this includes the README documenting the purpose of the
crate and (b) this links directly to both the repository and the API
documentation. Example:

```rust,noplayground
// Link to the crate page:
//! [`rand_chacha`]: https://crates.io/crates/rand_chacha
```

When referring to an item from within another crate,

1.  if that item is accessible via a crate dependency (even if not via the
    public API), use the Rust item path
2.  otherwise, use an absolute link to docs.rs

Examples:

```rust,noplayground
//! We depend on rand_core, therefore can use the Rust path:
//! [`BlockRngCore`]: rand_core::block::BlockRngCore

//! rand_chacha is not a dependency, but is within the same repository:
//! [`ChaCha20Rng`]: ../../rand_chacha/struct.ChaCha20Rng.html

//! Link directly to docs.rs, with major & minor but no patch version:
//! [`getrandom`]: https://docs.rs/getrandom/0.1/getrandom/fn.getrandom.html
```

## Auxiliary documentation

### README files

README files contain a brief introduction to the crate, shield badges, useful
links, feature-flag documentation, licence information, and potentially an
example.

For the most part these files do not have any continuous testing.
Where examples are included (currently only for the `rand_jitter` crate),
we enable continuous testing via `doc_comment` (see
[lib.rs:62 onwards](https://github.com/rust-random/rngs/blob/master/rand_jitter/src/lib.rs#L62)).

### CHANGELOG files

Changelog formats are based on the
[Keep a Changelog](http://keepachangelog.com/en/1.0.0/) format.

All significant changes merged since the last release should be listed under an
`[Unreleased]` section at the top of log.

### The book

The source to this book is contained in the
[rust-random/book](https://github.com/rust-random/book) repository.
It is built using mdbook, which makes building and testing easy:

```sh
cargo install mdbook --version "^0.4"

mdbook build --open
mdbook test

# To automatically rebuild after any changes:
mdbook watch
```

Note that links in the book are relative and designed to work in the
[published book](https://rust-random.github.io/book/). If you build the book
locally, you might want to set up a symbolic link pointing to your build of the
API documentation:
```sh
ln -s ../rand/target/doc rand
```

[docs#204]: https://github.com/rust-lang/docs.rs/issues/204
