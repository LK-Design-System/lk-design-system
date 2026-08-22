# R3B owner and API migration

| Field | Value |
| --- | --- |
| Type | Stable migration contract |
| Status | Active for the complete `0.1.x` line |
| Owner | Design system owner |
| Last reviewed | 2026-08-22 |
| Machine authority | [`references/architecture/R3B_OWNER_API_DECISIONS.json`](references/architecture/R3B_OWNER_API_DECISIONS.json) |

R3B assigns domain-neutral navigation, single-value input, anchored-overlay, progress and
measurement primitives to Core. This is an owner/package correction, not a component behavior
or prop change.

## New canonical imports

The following exports now have `@lk-design-system/lds-core` as their primary owner:

- `Link`
- `Popover`
- `Calendar`
- `DatePicker`
- `NumberField`
- `PasswordInput`
- `ProgressBar`
- `CircularProgress`
- `Meter`

Prefer the Core root:

```js
import {
  Calendar,
  CircularProgress,
  DatePicker,
  Link,
  Meter,
  NumberField,
  PasswordInput,
  Popover,
  ProgressBar,
} from '@lk-design-system/lds-core';
```

The equivalent Core deep imports remain available under
`@lk-design-system/lds-core/components/<family>/<Component>`.

## Compatibility window

The Product root and matching Product deep imports are deprecated compatibility re-exports in
every `0.1.x` release. They resolve to the same Core implementation, so migration does not create
two component copies or change runtime behavior. They may be removed no earlier than `0.2.0`.

Removal additionally requires all registered consumer scans to show zero Product-root and
Product-deep use for these exports, explicit owner approval, and a breaking release note. Until
then, rolling a consumer back means restoring its prior Product import without changing JSX.

The private `anchored-panel-style` helper follows the same Product-deep compatibility window.
The broader `./components/*` wildcard cannot be narrowed during `0.1.x`; its allowlist redesign is
deferred to the `0.2` breaking-surface review.

## Boundaries that do not move

- `DateRangeField` remains Product/Application because coupled start/end validation and range-level
  errors are a Product composition over Core date primitives.
- `BatteryGauge`, `ConnectionBadge`, `EquipmentStatusCard`, `TelemetryGauge`, and
  `TelemetryValue` remain Product/Operations. They present renderer-neutral operational facts but
  do not own telemetry truth, thresholds, transport, or robot semantics.
- Product viewer chrome remains Product/Operations; robot authority, safety state, control, pose,
  and spatial-navigation meaning remain in `@lk-design-system/lds-robotics-ui`.
- `HoverCard`, `InputGroup`, `TimePicker`, and `PinInput` remain Product until the machine decision
  register's two-consumer or Core-dependency review trigger is met.

No Product family subpaths are added. Application, Operations, and Workspace remain discovery
families inside one package until two consumers or independent bundle/ownership evidence justify
an additive subpath.

## Verification and rollback

The owner boundary checker validates one physical Core owner, every generated Product root/deep
compatibility wrapper, the `0.1.x` support policy, and all `move-now | stay | defer` decisions.
Workspace package checks exclude compatibility wrappers from Product ownership and family counts
while still building and type-checking their artifacts.

For a pre-removal rollback, switch an import back to `@lk-design-system/lds-product`; JSX and props
stay unchanged. After the compatibility window is eventually removed, use the last immutable
`0.1.x` package set as the rollback target.
