# Third-party attributions

## Material Symbols (Google)

The LK Robotics navigation marker badge glyphs are derived from **Material
Symbols** (rounded style, filled weight) by Google, used under the **Apache
License, Version 2.0**.

- Source: https://github.com/google/material-design-icons
- License: https://www.apache.org/licenses/LICENSE-2.0

The icon artwork is unmodified: the SVG path data is embedded verbatim from the
Material Symbols rounded fill set (native viewBox `0 -960 960 960`) and is only
re-centered and scaled via an SVG `transform` so it fits each marker's badge
coordinate space. No runtime dependency is added — the paths are inlined.

Icons used:

| Usage | Material Symbols icon |
| --- | --- |
| Facility · door | `door_sliding` |
| Facility · lift | `elevator` |
| Facility · dock | `home` |
| Facility · charging | `bolt` |
| Facility · gate | `shield` |
| Hazard · stairs | `stairs_2` |
| State · unknown | `question_mark` |
| State · invalid | `priority_high` |
| State · conflict | `warning` |
| State · closed / blocked | `close` |
| State · waiting | `pause` |
| State · rerouting | `sync` |
| State · active | `play_arrow` |
| State · planned | `radio_button_unchecked` |
| State · completed | `check` |
| State · stale | `history` |

The `ramp`, `handoff`, `dropoff`, and `obstacle` glyphs are **not** third-party
artwork: Material Symbols has no level-change ramp glyph (its `ramp_*` icons are
highway on-ramps), no filled transfer glyph (its arrow icons have no fill
variant), no ledge/fall glyph, and no traffic-cone glyph, so all four are
LDS-authored — a ramp incline silhouette, a load-into-box icon, a one-step edge
profile with a falling arrow, and a traffic-cone silhouette — drawn on the same
`0 -960 960 960` grid. The ramp silhouette is shared by the facility marker and
the hazard marker so the same physical slope reads as the same object in either
classification.

Embedded in:

- `components/robotics/_FacilityGlyph.js`
- `components/robotics/_NavigationStateGlyph.js`
- `components/robotics/_HazardGlyph.js`
