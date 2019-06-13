# Benchmarks

We already have many benchmarks:

```sh
cargo +nightly bench

# In a few cases, nightly features may use different code paths:
cargo +nightly bench --features=nightly
```

Benchmarks for distributions now live in the `rand_distr` crate; all other
benchmarks (including all our RNGs) live in the main `rand` crate
(hence the many dev-dependencies).

A lot of code in Rand is performance sensitive, most of it is expected to be
used in hot loops in some libraries/applications. If you change code in
`rand_core`, in PRNG crates, or in the `rngs` or `distributions` modules
(especially when an 'obvious cleanup'), make sure the benchmarks do not regress.

Please report before-and-after results for any affected benchmarks. If you are
optimising something previously not benchmarked, please add new benchmarks
first, then add your changes in a separate commit (to make before-and-after
benchmarking easy).
