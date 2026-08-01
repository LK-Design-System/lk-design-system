# Vendored release artifacts

`lk-robotics-lds-robotics-ui-0.1.0-rc.2.tgz` is the exact external Robotics
release consumed by this private workspace and its compatibility build.

The package remains externally owned by
`LK-Design-System/lk-design-system-robotics`; vendoring does not transfer source
ownership into this repository. The tarball is retained only so clean installs
and CI do not depend on the legacy `@lk-robotics` GitHub Packages location,
which no longer serves this release after the repository organization move.

- Package: `@lk-design-system/lds-robotics-ui@0.1.0-rc.2`
- SHA-256:
  `ad69eec796b0dba5b001dc3d4d554aea17017d2a5e0f702f5f28c0585f423ff2`
- Contents: published `dist`, `styles.css`, and `tokens` only; no source tree

When a successor package is published from its canonical repository, replace
the root workspace's file dependency with that immutable release and remove
this tarball in the same verified change.
