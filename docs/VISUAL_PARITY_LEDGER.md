# LK ROBOTICS Design System Visual Parity Ledger

Updated: 2026-07-08

This ledger tracks parity between the original static design-system cards and
the current React/Storybook implementation. It is the Markdown owner for visual
coverage, visual regression commands, and release-blocking pixel-diff gates.

## Current coverage

| Area | Source baseline | Current status |
| --- | ---: | --- |
| Foundation guidelines | 20 | Exposed through original preview evidence |
| Component cards | 83 | Mapped to React exports and parity captures |
| Template cards | 4 | Mapped to starter template previews |
| Runtime export gaps | 0 | No public export gap required by source cards |
| React component entry exports | 156 | Public package component entries covered by checks |
| Named public exports | 160 | Public package surface covered by type checks |
| Storybook public stories | 101 | Component and pattern surfaces only |
| Storybook hidden visual parity stories | 82 | Tagged `visual-parity` and `!dev` |
| Visual inventory React stories | 193 | Current implementation stories captured by visual inventory |
| Accessibility checked implementation stories | 193 | Current implementation stories checked by accessibility guard |

`components/navigation/navigation-footer.card.html` uses a namespace fallback
to reference `Footer`, but it is still part of the original preview target and
does not represent a runtime export gap.

## Latest visual diff result

Latest run: `npm run check:visual-diff` at 2026-07-07 02:26 KST.

| Metric | Result |
| --- | ---: |
| Legacy component cards | 83 |
| Primary React cards | 83 |
| React implementation stories | 126 |
| Compared pairs | 83 |
| Size mismatches | 0 |
| Mean mismatch ratio | 0.01066455849450229 |
| Max mismatch ratio | 0.046059027777777775 |
| Mean gate | 0.015 |
| Max gate | 0.05 |

The latest strict gate passed. `components/buttons/buttons.card.html` is kept
within threshold through a scoped legacy-letter-spacing adjustment in its
hidden visual parity story. Dedicated parity stories are preferred over broad
inventory stories when a card maps to a single component, because they reduce
false mismatch from unrelated components on the same page.

Current top mismatch list:

1. `components/cards/cards-stat.card.html`: `0.046059027777777775`
2. `components/viz/viz-map2d.card.html`: `0.04589699074074074`
3. `components/overlay/overlay-alert.card.html`: `0.04407916666666667`
4. `components/navigation/navigation-pagination.card.html`: `0.03869318181818182`
5. `components/overlay/overlay-sheet.card.html`: `0.03535573122529644`
6. `components/overlay/overlay-modal.card.html`: `0.0348968253968254`
7. `components/overlay/overlay-toast.card.html`: `0.034305555555555554`
8. `components/cards/cards-checklistitem.card.html`: `0.03376736111111111`
9. `components/overlay/overlay-commandpalette.card.html`: `0.033215287517531555`
10. `components/overlay/overlay-toaststack.card.html`: `0.03299382716049383`

## Visual QA commands

| Command | Purpose | Artifact location |
| --- | --- | --- |
| `npm run check:visual` | Smoke-captures representative original previews and React stories after a Storybook build | `visual-artifacts/smoke/` |
| `npm run check:legacy-render` | Verifies all 107 original previews render as visible DOM in Storybook | `visual-artifacts/legacy-render/` |
| `npm run check:visual-inventory` | Captures all original cards, same-viewport React primaries, and implementation stories | `visual-artifacts/inventory/` |
| `npm run check:visual-review` | Builds side-by-side original versus React review HTML | `visual-artifacts/inventory/review.html` |
| `npm run check:visual-diff` | Computes strict pixel diff for all 83 original-to-primary pairs | `visual-artifacts/inventory/diffs/` |

Install Chromium first if Playwright has not been prepared locally:

```powershell
npx playwright install chromium
```

Visual artifacts are local QA outputs and must stay out of git.

## Strict gate

`npm run check:visual-diff` is release-blocking for the current migration
thresholds:

- Size mismatch must be `0`.
- Max mismatch ratio must be less than or equal to `0.05`.
- Mean mismatch ratio must be less than or equal to `0.015`.

The capture hides Storybook-only chrome such as theme toggles and iframe shell
styling so the comparison is source card content versus React story content.

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
  viz, and robotics surfaces remain under Watch until their interaction states
  and responsive surfaces are fully exercised.
- `npm run check:coverage` guards the 20 foundation guidelines, 83 component
  cards, and 4 template cards.
- `npm run check:map` guards component-card to React export, type, dist, legacy
  bundle, and Storybook story links.
- `npm run check:storybook-public` keeps visual parity stories out of the public
  sidebar.
- `npm run check:inventory` keeps README, repository inventory, visual ledger,
  and Storybook-facing numeric summaries aligned with current source counts.

## Next verification order

1. Keep P0/P1 stories layout-stable against the original cards.
2. Add interaction tests for buttons, navigation, and form states.
3. Run `npm run check:legacy-render` after original preview changes.
4. Keep `npm run check:visual-diff` under the strict size, max, and mean gates.
5. Keep `npm run check:coverage` and `npm run check:map` aligned whenever
   source files are added, removed, or reclassified.
6. Run `npm run check:a11y` for implemented Storybook stories.
