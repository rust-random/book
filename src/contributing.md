# Contributing

Thank you for your interest in contributing to Rand!

The following is a list of notes and tips for when you want to contribute to
Rand with a pull request.

## Open Participation

This project is open to contributions from anyone, with the main criteria of
review being correctness, utility, project scope, and good documentation. Where
correctness is less obvious (PRNGs and some type-conversion algorithms),
additional criteria apply (see below).

Additionally we welcome feedback in the form of bug reports, feature requests
(preferably with motivation and consideration for the scope of the project),
code reviews, and input on current topics of discussion.

Since we must sometimes reject new features in order to limit the project's
scope, you may wish to ask first before writing a new feature.


## Code style

Rand doesn't (yet) use rustfmt. It is best to follow the style of the
surrounding code, and try to keep an 80 character line limit.

Rand does **make use of `unsafe`**, both for performance and out of necessity.
We consider this acceptable so long as correctness is easy to verify.
In order to make this as simple as possible,
we prefer that all parameters affecting safety of `unsafe` blocks are checked or
prepared close to the `unsafe` code,
and wherever possible within the same function (thus making the function safe).
