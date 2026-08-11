# Third-party attributions

## Montage / Wanted Design System (Wantedlab)

LDS is based on **Montage, the Wanted Design System by Wantedlab**, and adapts
its foundations, generic component structure, token hierarchy, interaction
expectations, and documentation conventions for LK ROBOTICS.

- Attribution: **Design system: Montage by Wantedlab (MIT)**
- Source: https://montage.wanted.co.kr/
- Terms: https://montage.wanted.co.kr/docs/getting-started/terms-of-use
- License: MIT
- Copyright: © 2026 Wanted Lab, Inc.
- Modification status: modified and extended for LK ROBOTICS
- Full notice: [`../../THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)

LDS is an independent derivative. It is not affiliated with or endorsed by
Wantedlab, and it does not grant rights to Wanted logos, wordmarks, or other
Wanted brand assets.

## Montserrat (The Montserrat Project Authors)

The approved `ROBOTICS` wordmark and legacy fixed `PORTAL` outline are
generated from Montserrat ExtraBold 800. Parent-brand-first `ProductLockup`
product names are generated from Montserrat SemiBold 600. Both static fonts
come from the official Version 7.222 release.

- Source: https://github.com/JulietaUla/Montserrat/releases/tag/v7.222
- License: SIL Open Font License 1.1
- Copyright: Copyright 2011 The Montserrat Project Authors
- Pinned font and license: `vendor/montserrat-v7.222/`
- Full notice: [`../../THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)

The pinned TTF is a build-time brand source. Production logos contain outlined
SVG paths and do not load Montserrat at runtime; LDS interface typography
continues to use Pretendard.

## Pretendard (Kil Hyung-jin)

LDS interface typography uses unmodified Pretendard v1.3.9 webfonts.

- Source: https://github.com/orioncactus/pretendard/releases/tag/v1.3.9
- License: SIL Open Font License 1.1
- Copyright: Copyright (c) 2021, Kil Hyung-jin
- Full license: `assets/fonts/Pretendard-LICENSE.txt`
- Full notice: [`../../THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)

## Noto Sans KR (Adobe and the Noto project)

The approved Korean corporate descriptor outline is generated from the
unmodified Noto Sans KR Version 2.004-H2 variable TTF at the named ExtraBold
`wght=800` instance, with `0.105em` tracking and uniform scaling.

- Source: https://raw.githubusercontent.com/google/fonts/4efc2774c63917927efe769ca845def6bd6debae/ofl/notosanskr/NotoSansKR%5Bwght%5D.ttf
- License: SIL Open Font License 1.1
- Copyright: Copyright 2014-2021 Adobe, with Reserved Font Name `Source`
- Pinned font and license: `vendor/noto-sans-kr-v2.004-h2/`
- Full notice: [`../../THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md)

The variable TTF is a build-time brand source. Corporate logo SVGs contain
outlined paths and have no runtime font dependency.

## Material Symbols (Google)

The LK Robotics navigation marker badge glyphs and LDS `Icon` `unlink` and
`model` glyphs are derived from **Material Symbols** by Google, used under the
**Apache License, Version 2.0**.

- Source: https://github.com/google/material-design-icons
- License: https://www.apache.org/licenses/LICENSE-2.0

The LDS `unlink` asset is the unmodified Material Symbols `link_off` outlined
path from `@material-symbols/svg-400@0.45.10`, kept on its native
`0 -960 960 960` viewBox. Its inherited fill is set to `currentColor` solely so
it follows the LDS `Icon` color API; no runtime dependency is added.

The LDS `model` asset is the unmodified Material Symbols `deployed_code`
rounded filled 24 px path from the official source repository, kept on its
native `0 -960 960 960` viewBox. The semantic LDS name describes an AI/ML model
artifact; the source name describes the cube-shaped artwork. Its fill is set to
`currentColor`, and no runtime dependency is added.

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
