# Cargo and features

The latest version of rand is available here: <https://crates.io/crates/rand>

On the same page, and also from the repository's README, you can see documentation
of the [Crate Features](https://github.com/rust-random/rand#crate-features).
In particular, you may want to use the `small_rng` feature to enable the `SmallRng` generator.

To add this dependency on Rand from the console, type:
```sh
cargo add rand --features small_rng
```

Or, add this to your `Cargo.toml`, under `[dependencies]`:
```toml
rand = { version = "0.8.5", features = ["small_rng"] }
```

Note: using `version = "0.8.5"` matches version `0.8.5`, `0.8.6`, etc., but not `0.9`.
Using instead `version = "0.8"` will match any `0.8.x` version. In both cases,
Cargo will normally install the latest matching version when the dependency is
first added. Dependencies may be updated later via `cargo update`, and in some
cases running `cargo update` can solve dependency problems.

For more on Cargo, see [The Cargo Book](https://doc.rust-lang.org/cargo/index.html).

## Other crates

As noted on the [Crates](crates.md) page, the Rand library consists of a family of crates.
To run the examples in this guide, ensure you have the following dependencies
in your `Cargo.toml`:
```toml
[dependencies]
rand = { version = "0.8.5", features = ["small_rng"] }
rand_chacha = "0.3.1"
rand_distr = "0.4.3"
rand_pcg = "0.3.1"
rand_seeder = "0.2.3"
```
