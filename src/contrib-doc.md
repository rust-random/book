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

After editing API documentation, we reccomend testing examples and
checking for broken links:

```sh
cargo test --doc

cargo install cargo-deadlinks
# It is recommended to remove left-over files from previous compilations
rm -rf /target/doc
cargo doc --all --no-deps
cargo deadlinks --dir target/doc
```

TODO: document how to make cross-links

Rand API docs are automatically built and hosted at
[rust-random.github.io/rand/](https://rust-random.github.io/rand/) for the
latest code in master.

### Getrandom crate

The [rust-random/getrandom](https://github.com/rust-random/getrandom)
repository contains only a single crate, hence a simple `cargo doc` will
suffice.

## Auxilliary documentation

### README files

TODO: for `rand_jitter/README.md`, example code is checked by `cargo test`.

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
cargo install mdbook --version "^0.2"

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
