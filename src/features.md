# Feature flags

Some functionality is gated behind Cargo features, which must be enabled as
required, e.g.

```
rand = { version = "0.6", features = ["log"] }
```

### Logging

Rand can optionally log a few events related to `OsRng` and `thread_rng`. This
is gated behind the `log` feature.

### Serde

Some parts of the Rand lib support serialisation via [Serde](https://serde.rs/).
To enable this, use the `serde1` feature.

### SIMD support

SIMD support is still experimental, and is gated behind the `simd_support`
feature.

### Nightly-only features

The `nightly` feature enables some less-stable functionality. If you use this,
don't be surprised when your build breaks!

Historically, `nightly` was required for `i128` support; this is now stable.

The `nightly` feature enables `simd_support`, along with some additional
SIMD functionality not available on stable compilers.

### Core-only (`no_std`)

The Rand lib supports `no_std` mode. To achieve this you must disable the `std`
module, which is enabled by default:

```
rand = { version = "0.6", default-features = false }
```

Optionally, you can enable the `alloc` feature, which can be used instead of
`std` to enable several features (especially those in the `seq` module).
