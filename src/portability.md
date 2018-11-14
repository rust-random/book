# Portability

We try to follow [semver rules](https://docs.npmjs.com/misc/semver) regarding
API-breaking changes and `MAJOR.MINOR.PATCH` versions:

-   New *patch* versions should not include API-breaking changes or major new
    features
-   Before 1.0, *minor* versions may include API breaking changes. After 1.0
    they should not.
-   We may make pre-releases like `0.5.0-pre.0`. In this case:
    
    -   although these are public versions, they are not used by default unless
        opting into using a pre-release on the specific `MAJOR.MINOR.PATCH`
        version
    -   pre-releases are considered semantically less than their final release
        (e.g. Cargo may automatically upgrade from `0.5.0-pre.0` to `0.5.0`)
    -   all pre-release versions are unstable and may make any change
    -   we make no commitment to support users of pre-releases

Additionally, we must also consider *value-breaking changes* and *portability*.
A function is *value-stable* if, given the same inputs:

-   it is portable (produces the same results on all platforms)
-   changing the output value for some input in a new library version is
    considered a breaking change

Note that some Rand functionality is supposed to be value stable, and some
functionality is supposed to be non-deterministic (i.e. depend on something
external). Some functionality may be deterministic but not value-stable.

A trait should define which of its functions are expected to be value-stable.
An implementation of a trait must meet those stability requirements, unless the
object for which the trait is implemented is explicitly not value-stable.
As an example, `SeedableRng::from_seed` is required to be value-stable, but
`SeedableRng::from_rng` is not. RNGs implementing the trait are value-stable
when they guarantee `SeedableRng::from_seed` is value-stable, while
`SeedableRng::from_rng` may receive optimisations.

Before 1.0, we allow any new *minor* version to break value-stability, though
we do expect such changes to be mentioned in the changelog. Post 1.0 we have
not yet determined exact stability rules.

Additionally, we expect patch versions not to change the output of any
deterministic functions, even if not value-stable (this is not a hard
requirement, but exceptions should be noted in the changelog).

Defining which parts of Rand are value-stable is still in progress. Many parts
of `rand_core` have some documentation on value-stability.
