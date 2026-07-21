# LK ROBOTICS Design System Visual Parity Ledger

| Field | Value |
| --- | --- |
| Type | Current parity register |
| Status | Current |
| Owner | Design system owner |
| Last reviewed | 2026-07-20 |
| Source | accepted WDS `.fig`, parity audit JSON, current Storybook index |

This ledger tracks parity between the WDS source and the current
React/Storybook implementation. Parity is anchored to the accepted local `.fig`
snapshot under `docs/references/wds/` and to the LDS component/pattern surfaces
in Storybook. It is the Markdown owner for visual coverage and the automated
parity gates.

## Current coverage

| Area | Source baseline | Current status |
| --- | ---: | --- |
| Runtime export gaps | 0 | No public export gap required by the WDS source |
| React component entry exports | 173 | Public package component entries covered by checks |
| Named public exports | 176 | Public package surface covered by type checks |
| Storybook public stories | 313 | Component and pattern surfaces only |
| Storybook hidden visual parity stories | 73 | Tagged `visual-parity` and `!dev` |
| Visual inventory React stories | 415 | Current implementation stories checked by the accessibility guard |
| Accessibility checked implementation stories | 415 | Current implementation stories checked by accessibility guard |

## Parity source of truth

The legacy static-card + `_ds_bundle.js` preview layer and its pixel-diff
pipeline were retired. Parity is now verified two ways:

- **WDS source alignment** — `docs/references/wds/` holds the accepted local
  `.fig` snapshot content and the coverage/foundation/node-queue audits.
  `npm run check:wds-alignment` and `npm run check:wds-local-fig` validate that
  every claimed coverage and evidence reference still exists.
- **Storybook implementation surface** — component and pattern behavior is
  exercised in Storybook. WDS-to-LDS 1:1 comparison stories stay tagged
  `visual-parity` and `!dev` so they run for regression checks but stay hidden
  from the public sidebar.

## Visual QA commands

| Command | Purpose | Artifact location |
| --- | --- | --- |
| `npm run check:parity` | Guards typography spacing and card motion contracts in the React source | — |
| `npm run check:visual-token-drift` | Guards token usage drift in component source | — |
| `npm run check:wds-alignment` | Validates WDS coverage/foundation/node-queue evidence references exist | — |
| `npm run check:wds-local-fig` | Validates LDS content against the accepted local `.fig` snapshot | — |
| `npm run check:storybook-public` | Keeps `visual-parity` stories out of the public sidebar | — |
| `npm run check:a11y` | Runs the accessibility guard over implementation stories | — |

## Status labels

| Status | Meaning |
| --- | --- |
| Fixed | Source parity issue was identified and corrected in code |
| Watch | Source and React map exists, but layout, interaction, or responsive behavior needs continued verification |
| Gap | Current implementation differs from source or lacks a documented API/story contract |
| Deferred | Legacy/static area or product decision that should not block current release |

## Current debt

- Button and button-family parity is fixed or watched through dedicated hidden
  parity stories.
- Navigation, forms, overlays, selection, data, status, cards, content, layout,
  and the remaining robotics surfaces stay under Watch until their interaction
  and responsive surfaces are fully exercised.
- ViewerFrame, Map2DCanvas, Scene3DFrame, VideoStreamTile, ViewerToolbar, and
  telemetry now have explicit state/keyboard/dark/narrow stories, Viewer-targeted
  Axe coverage, and visual-smoke captures. Their shared frame contract is guarded;
  renderer- and transport-specific product behavior remains intentionally out of scope.
- `npm run check:storybook-public` keeps visual parity stories out of the public
  sidebar.
- `npm run check:inventory` keeps README, repository inventory, visual ledger,
  and Storybook-facing numeric summaries aligned with current source counts.

## Next verification order

1. Keep P0/P1 stories layout-stable against the WDS `.fig` snapshot.
2. Add interaction tests for buttons, navigation, and form states.
3. Keep `npm run check:wds-alignment` and `npm run check:wds-local-fig` green
   whenever source references are added, removed, or reclassified.
4. Run `npm run check:a11y` for implemented Storybook stories.
