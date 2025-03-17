# The Rust Rand Book

[![Build Status](https://github.com/rust-random/book/actions/workflows/test.yml/badge.svg)](https://github.com/rust-random/book/actions)
[![License](https://img.shields.io/crates/l/rand.svg)](https://github.com/rust-random/rand#license)

The source to [The Rust Rand Book](https://rust-random.github.io/book/).

## Contributing

This book is published under the same licence as the Rand lib itself.
Contributing should be as simple as forking, editing the contents of the `src/`
directory, and making a PR.

The book is built using [mdBook](https://rust-lang.github.io/mdBook/index.html).
To preview your changes locally:

```
cargo install mdbook --version "^0.4" --force
mdbook build --open
```

`mdbook test` does not currently work, see: https://github.com/rust-random/book/issues/79

As a workaround, please run:

```
cd tests
./generate.sh
cargo test
```

## License

The Rust Rand Book is distributed under the terms of both the MIT license and the
Apache License (Version 2.0).

See [LICENSE-APACHE](LICENSE-APACHE) and [LICENSE-MIT](LICENSE-MIT), and
[COPYRIGHT](COPYRIGHT) for details.
