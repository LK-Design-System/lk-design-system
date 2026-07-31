# Wave 0 attestation and Wave 1 package split handoff

| Field | Value |
| --- | --- |
| Type | Historical handoff snapshot |
| Status | Current resume point |
| Created | 2026-07-19 |
| Branch | `main` |
| Resume commit | `f8dd678f32c92798b05d7f97d84449dec916d3a4` |
| Remote | `origin` · `LK-ROBOTICS/lk-design-system` |

## Safe resume point

Wave 0 is complete and pushed. At handoff capture, `main` and `origin/main`
both resolved to `f8dd678f32c92798b05d7f97d84449dec916d3a4`, with no uncommitted
project files. No Wave 1 workspace, source, CSS, or facade implementation has
been created yet.

The immutable historical references are:

| Role | Tag | Commit |
| --- | --- | --- |
| Original pre-runner provenance | `wave0-baseline-2026-07-19` | `5b4c1f299511acf13262b38f1cd6886ecbdb8e09` |
| Authoritative Wave 0 source baseline | `wave0-baseline-2026-07-19-r2` | `679859bc8b5126bcff7146eaedd871bbe9e62891` |
| Evidence attestation | `wave0-attested-2026-07-19` | `f8dd678f32c92798b05d7f97d84449dec916d3a4` |

Run the following before making any source change on another computer:

```powershell
git fetch --prune --tags origin
git switch main
git pull --ff-only origin main
git status --short
git rev-parse HEAD
git rev-parse origin/main
git show --no-patch wave0-attested-2026-07-19
```

Use Node `22.17.1` and npm `10.9.2` for historical Wave 0 verification. On
Windows installations where PowerShell blocks `npm.ps1`, use `npm.cmd`.

```powershell
npm ci
npm run check:package-migration:wave0
```

## Proven Wave 0 evidence

- `docs/references/package-split/MIGRATION_AUDIT.json` records `wave0Gate: ready`.
- The actual aggregate tarball was installed in isolated React `18.3.1` and
  React `19.2.3` consumers. CJS, SSR, Vite production build, browser runtime,
  selected-import tree-shaking, and size limits passed on Windows; the same
  Windows tarball passed consumption on Linux.
- The canonical full check recorded 579 Axe stories, 259 play functions, and
  65/65 visual smoke cases without regressions.
- The tracked evidence is in `docs/references/package-split/baselines/`:
  `WAVE0_AGGREGATE_ARTIFACT.json`, `WAVE0_FULL_CHECK.json`, and
  `WAVE0_CONSUMER_MATRIX.json`.

## Wave 1 first change: preserve historical evidence semantics

The current `scripts/check-package-migration.mjs` intentionally requires that
only evidence-attestation files occur after the Wave 0 source baseline. That
was correct while Wave 0 was being approved, but it must not be left as a
current-source rule once package source changes begin.

Before adding a workspace package, change the verifier so it validates the
historical pair below without rebuilding the current source as the old
aggregate artifact:

1. `wave0-baseline-2026-07-19-r2` is the source baseline.
2. `wave0-attested-2026-07-19` is the attestation commit.
3. The diff between those commits contains only the recorded audit/evidence
   attestation paths.
4. The evidence files and their SHA-256 values match the audit at the
   attestation commit.

Keep the old baseline artifact evidence immutable. Do not move or delete any
Wave 0 tag and do not claim that a post-Wave-1 package build must byte-match
the historical aggregate tarball.

## Approved Wave 1 target

Create these packages in the current monorepo, in dependency order:

| Workspace | Package | Runtime package dependencies |
| --- | --- | --- |
| `packages/core` | `@lk-design-system/lds-core` | none |
| `packages/theme` | `@lk-design-system/lds-theme` | Core |
| `packages/product` | `@lk-design-system/lds-product` | Core |
| `packages/robotics-ui` | `@lk-robotics/lds-robotics-ui` | Core, Product |
| `packages/compat` | `@lk-design-system/design-system-core` | all four packages |

The canonical owner inventory is
`docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json`: Core 88 modules,
Theme 2, Product 92, Robotics UI 43. Preserve the compatibility facade's root,
layer, `components/*`, CSS, token, and asset paths during the support window.
New packages require ESM and types; legacy CJS remains the compatibility
facade responsibility.

Do not mix token-value changes, brand-color changes, component redesign, or
product workflow code into this migration. `ManualControlSession` remains a
presentation/release seam; transport, authority, watchdog, STOP, and safety
logic remain product-owned.

## LDS3D boundary

`lk-design-system-3d` remains a separate sibling repository. Its current
working tree is not a release baseline, and `apps/docs` currently consumes
this repository through a local `link:` junction. Treat that as local visual
integration only.

- Keep DOM/SVG chrome such as `Scene3DFrame`, `ViewerToolbar`,
  `ViewportStatusBar`, `CanvasEditorShell`, and inspector/panel components in
  `@lk-robotics/lds-robotics-ui`.
- Keep coordinate, frame, pose, camera, picking, GLB, WebGL, and renderer
  lifecycle in LDS3D packages.
- Do not add an LDS ↔ LDS3D runtime dependency. A product or docs integration
  app is the only layer that composes both systems.
- LDS supports React 18–19, while current LDS3D R3F packages require React
  19.1.1+. The React 18/R3F8 Control adapter is still unimplemented and stays
  an explicit Wave 2/3 compatibility item.

## Remaining milestones

1. Wave 1: physical workspace packages, package-level source/declaration
   generation, CSS/asset ownership, compatibility facade, and tarball/boundary
   verification.
2. Wave 2: immutable package RCs and migration of pinned product consumers,
   including replacement of LDS3D docs' local `link:` dependency.
3. Wave 3: Robotics repository extraction go/no-go. A separate repository is
   not authorized by package separation alone.
4. Wave 4: extract `packages/robotics-ui` only if the Wave 3 criteria pass.

See [`../PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md`](../PACKAGE_AND_REPOSITORY_SEPARATION_PLAN.md)
for the authoritative gates and
[`../references/package-split/MIGRATION_AUDIT.json`](../references/package-split/MIGRATION_AUDIT.json)
for the machine-readable Wave 0 evidence.
