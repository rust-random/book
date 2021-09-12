# Contributing

Thank you for your interest in contributing to Rand!

We are open to all contributors, but please consider that we have limited
resources, usually have other on-going work within the project, and that even
accepting complete PRs costs us time (review and potentially on-going support),
thus we may take considerable time to get back to you.

## All contributions

-   **Scope:** please consider whether your "issue" falls within the existing
    scope of the project or is an enhancement. Note that whether something is
    considered a *defect* may depend on your point of view. We may choose to
    reject contributions to avoid increasing our workload.

    If you wish to expand the scope of the project (e.g. new platforms or
    additional CI testing) then please be prepared to provide on-going
    support.
-   **Fixes:** if you can easily fix this yourself, please consider making a PR
    instead of opening an issue. On the other hand if it's less easy or looks
    like it may conflict with other work, don't hesitate to open an issue.

## Pull Requests

-   **Changelog:** unless your change is trivial, please include a note in the
    changelog (`CHANGELOG.md`) of each crate affected, under the `[Unreleased]`
    heading at the top (add if necessary). Please include the PR number (this
    implies the note must be added *after* opening a PR).
-   **Commits:** if contributing large changes, consider splitting these over
    multiple commits, if possible such that each commit at least compiles.
    Rebasing commits may be appropriate when making significant changes.
-   **Documentation:** we require documentation of all public items. Short
    examples may be included where appropriate.
-   **Maintainability:** it is important to us that code is easy to read and
    understand and not hard to review for correctness.
-   **Performance:** we always aim for good performance and sometimes do
    considerable extra work to get there, however we must also make compromises
    for the sake of maintainability, and consider whether a minor efficiency
    gain is worth the extra code complexity. [Use benchmarks](contrib-bench.md).
-   **Style:** make it neat. *Usually* limit length to 80 chars.
-   **Unsafe:** use it where necessary, not if there is a good alternative.
    Ensure `unsafe` code is easy to review for correctness.
-   **License and attribution:** this project is freely licenced under the MIT
    and Apache Public Licence v2. We assume that all contributions are made
    under these licence grants. Copyrights are retained by their contributors.
    
    Our works are attributed to "The Rand Project Developers". This is not a
    formal entity but merely the collection of all contributors to this project.
    For more, see the [COPYRIGHT](COPYRIGHT) file.
-   **Thank you!**
