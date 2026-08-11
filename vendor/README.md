# Vendored release artifacts

`lk-design-system-lds-robotics-ui-0.1.0-rc.5.tgz` is the exact external
Robotics release-candidate artifact consumed by this private workspace and its
compatibility build.

The package remains externally owned by
`LK-Design-System/lk-design-system-robotics`; vendoring does not transfer source
or documentation ownership into this repository. The external repository and
its GitHub Pages deployment remain the canonical Robotics documentation source.
The tarball is retained so clean installs and CI resolve one immutable package
artifact without a registry dependency.

The v3 external surface records the immutable Robotics release as `published`.
Local vendoring verifies the exact registry artifact bytes as well as the
workspace lock entry, so clean installs do not depend on a mutable tag.

- Package: `@lk-design-system/lds-robotics-ui@0.1.0-rc.5`
- File: `lk-design-system-lds-robotics-ui-0.1.0-rc.5.tgz`
- SHA-256: `8cd4639f47dbecdd3e1fc88869d7c3343c446cb95f5244098972dffcae41017c`
- Contents: ESM/types runtime, styles and tokens, licensing, AI entry points,
  and the self-contained `docs/package/*` documentation bundle; no source tree

When a successor package is published from its canonical repository, update
`ROBOTICS_EXTERNAL_SURFACE.json`, replace this immutable artifact and its
workspace lock entry, then re-run the package, documentation, and clean-consumer
checks in one change.

`montserrat-v7.222/` contains the exact OFL-licensed static font used only at
build time to generate the outlined LK ROBOTICS wordmark. Its README records
the pinned upstream release, hashes, and replacement policy.

`noto-sans-kr-v2.004-h2/` contains the exact unmodified OFL-licensed variable
TTF used only at build time to generate the outlined Korean corporate
descriptor. Its README records the pinned source, hashes, `wght=800` instance,
tracking rule, and replacement policy.
