# Changelog

All notable package-facing changes are recorded here. The package follows semantic versioning once external publication is enabled; while `private: true` remains in effect, each release candidate must still maintain the current-version section.

## 0.1.0 - 2026-07-11

### Added

- Automated accessibility lifecycle, target-size, API grammar, token hygiene, motion, prompt, story coverage, pixel regression, package artifact, and strict React consumer checks.
- Compiled per-component package subpaths and React 18/19 strict declaration coverage.

### Changed

- Split the package build into tree-shakeable component entries and preserved the `"use client"` boundary in ESM and CJS output.
- Normalized modal focus handling, menu keyboard behavior, field sizing, status semantics, overlay surfaces, copy conventions, and composed layout hierarchy.
- Replaced the oversized traced Instagram asset with a compact equivalent vector.

### Fixed

- Removed accidental runtime dependency pollution and raw JSX/prompt publication.
- Resolved global JSX namespace and intrinsic HTML prop conflicts in public declarations.
- Corrected Dimmer contrast, table numeric alignment, viewer fallback icons, focus trapping, and multiple keyboard interaction gaps.

### Deprecated

- See [the generated deprecation register](docs/DEPRECATIONS.md).
