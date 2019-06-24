# Portability

## Definitions

Given fixed inputs, all items (should) fall into one of three categories:

-   Output is non-deterministic, thus never reproducible
-   Output is deterministic, but not considered portable
-   Output is deterministic and portable

In general, functionality is considered deterministic and portable *unless*
it is clearly non-deterministic (e.g. `getrandom`, `ThreadRng`) *or* it is
documented as being unportable (e.g. `StdRng`, `SmallRng`).

## Crate versions

We try to follow [semver rules](https://docs.npmjs.com/misc/semver) regarding
API-breaking changes and `MAJOR.MINOR.PATCH` versions:

-   New *patch* versions should not include API-breaking changes or major new
    features
-   Before 1.0, *minor* versions may include API breaking changes. After 1.0
    they should not.

Additionally, we must also consider *value-breaking changes* and *portability*.
When given fixed inputs,

-   For non-deterministic items, implementations may change in any release
-   For deterministic unportable items, output should be preserved in patch
    releases, but may change in any minor release (including after 1.0)
-   For portable items, any change of output across versions is considered
    equivalent to an API breaking change.

## Portability of usize

There is unfortunately one non-portable item baked into the heart of the Rust
language: `usize` (and `isize`). For example, the size of an empty
`Vec` will differ on 32-bit and 64-bit targets. For most purposes this is not an
issue, but when it comes to generating random numbers in a portable manner
it does matter.

A simple rule follows: if portability is required, *never* sample a `usize` or
`isize` value directly.

Within Rand we adhere to this rule whenever possible. All sequence-releated
code requiring a bounded `usize` value will sample a `u32` value unless the
upper bound exceeds `u32::MAX`.
(Note that this actually improves benchmark performance in many cases.)
