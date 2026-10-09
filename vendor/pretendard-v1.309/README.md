# Pretendard ExtraBold 800 (v1.3.9)

This directory pins the exact static WOFF2 used only at build time to construct
the outlined `주식회사 엘케이로보틱스` corporate descriptor. Production logo
SVGs contain paths and do not load this font.

It is deliberately the same file the UI typography loads from
`assets/fonts/Pretendard-ExtraBold.woff2`; `scripts/generate-brand-assets.mjs`
asserts that both files share the pinned SHA-256, so upgrading the UI font
requires an explicit logo revision at the same time.

- Upstream project: https://github.com/orioncactus/pretendard
- Pinned release: https://github.com/orioncactus/pretendard/releases/tag/v1.3.9
- Upstream path: `packages/pretendard/dist/web/static/woff2/Pretendard-ExtraBold.woff2`
- Embedded version metadata: `Version 1.309`
- Font SHA-256: `DD7C1E156F508EB962ACC7A33A7A1896D1E0B71E11156FAD96E731689CEB6DC3`
- License: SIL Open Font License 1.1; see `OFL.txt`
- OFL.txt SHA-256: `85FCE85E25260B03777BF10373D3BD9363B9DA96D9E0CA86A280DD37ED7667A0`

The generator applies default font positioning plus `0.105em` tracking between
characters only, and exports outlines with uniform scaling and no manual glyph
edits. The corporate descriptor's visible width is `1.90X`, its gap from the
stacked lockup is `0.21X`, and it is centred on the lockup's visible axis.

Construction versions 5 and 6 (2026-08 to 2026-10-08) built the descriptor from
Noto Sans KR ExtraBold `wght=800` v2.004-H2 (SHA-256
`194018E6B2B293A7964F037B25C0249CE1418BC9AB3C971060A03AA57861E252`). That vendor
directory was removed with construction version 7; recover it from Git history
if the earlier outlines ever need to be regenerated.
