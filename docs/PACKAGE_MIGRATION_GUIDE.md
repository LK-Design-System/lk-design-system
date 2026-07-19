# LDS workspace package migration guide

| Field | Value |
| --- | --- |
| Type | Guide |
| Status | Wave 2 preparation |
| Owner | Design system owner · consumer owners |
| Last reviewed | 2026-07-19 |
| Source | `docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json` |

This guide describes the consumer-side import migration that follows the Wave 1
workspace split. It does not authorize package publication or consumer-repository
writes. Use it only after an immutable release set has been published and its
versions and checksums have been recorded in the package-split audit.

## Target packages

| Owner | Package | Dependencies |
| --- | --- | --- |
| Core | `@lk-robotics/lds-core` | — |
| Theme | `@lk-robotics/lds-theme` | Core |
| Product | `@lk-robotics/lds-product` | Core |
| Robotics UI | `@lk-robotics/lds-robotics-ui` | Core, Product |
| Compatibility only | `@lk-robotics/design-system-core` | all four packages |

The canonical owner for every public export and deep component path is
`docs/references/wds/PUBLIC_EXPORT_CLASSIFICATION.json`. Do not infer a package
from a component folder name.

## Import migration

| Existing import | Replacement |
| --- | --- |
| `@lk-robotics/design-system-core` | Import each symbol from its owner package. |
| `@lk-robotics/design-system-core/core` | `@lk-robotics/lds-core` |
| `@lk-robotics/design-system-core/theme` | `@lk-robotics/lds-theme` |
| `@lk-robotics/design-system-core/product` | `@lk-robotics/lds-product` |
| `@lk-robotics/design-system-core/robotics` | `@lk-robotics/lds-robotics-ui` |
| `@lk-robotics/design-system-core/components/<path>` | `<owner package>/components/<path>` using the classification inventory. |

For example:

```tsx
import { Button } from '@lk-robotics/lds-core';
import { ThemeToggle } from '@lk-robotics/lds-theme';
import { TopBar } from '@lk-robotics/lds-product';
import { Scene3DFrame } from '@lk-robotics/lds-robotics-ui';
```

## CSS and assets

Import the owner package CSS entries in dependency order. Product applications
that use all layers should normally import all four entries:

```ts
import '@lk-robotics/lds-core/styles.css';
import '@lk-robotics/lds-theme/styles.css';
import '@lk-robotics/lds-product/styles.css';
import '@lk-robotics/lds-robotics-ui/styles.css';
```

The legacy `styles.css`, token and asset paths remain available through the
compatibility package during the approved support window. New direct asset paths
must use the owning package only after the consumer has recorded the concrete
path in its migration evidence.

## Consumer release checklist

1. Pin the exact package versions and release-set checksum; never use a sibling
   source path, `link:`, or a mutable branch reference.
2. Replace root, layer and deep imports according to the owner classification.
3. Run the consumer's install, production build, representative workflow smoke,
   and rollback test at the pinned revision.
4. Record the package versions, source commit, checksum, imports removed, test
   output and rollback version in the package-split consumer report.
5. For LDS3D docs, replace the local `link:` dependency only in a separate
   clean checkout; LDS3D renderer packages must not import LDS at runtime.

`ManualControlSession` is a presentation/release seam only. Transport,
authority, watchdog, STOP and safety behavior remain product-owned and are not
part of this package migration.
