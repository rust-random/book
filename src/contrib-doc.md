# Documentation

We are very happy to recieve documentation pull-requests.

Documentation is split into two parts: the API documentation (from the code,
usually in [rust-random/rand](https://github.com/rust-random/rand)), and this
book (from [rust-random/book](https://github.com/rust-random/book)).

## Style

All documentation is in English, but no particular dialect is preferred.

The documentation should be accessible to multiple audiences: both seasoned
Rustaceans and relative newcomers, those with experience in statistical
modelling or cryptography, as well as those new to the subjects. Since it is
often impossible to write appropriate one-size-fits-all documentation, we
prefer concise technical documentation with reference to extended articles
aimed at more specific audiences.

## Building and testing

### API documentation

To build the API documentation locally, run:

```sh
# Build doc for all modules:
cargo doc --all --no-deps

# And open it:
xdg-open target/doc/rand/index.html
```

On Linux, it is easy to set up automatic rebuilds after any edit:
```sh
while inotifywait -r -e close_write src/ rand_core/; do cargo doc; done
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

### The book

The book is built using mdbook, which makes building and testing easy:

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
