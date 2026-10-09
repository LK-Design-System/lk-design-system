# Pretendard v1.3.9 (ExtraBold 800, SemiBold 600)

This directory pins the exact static WOFF2 files used only at build time to
construct outlined logo text. Production logo SVGs contain paths and do not load
these fonts.

| File | Builds | Generator | Same bytes as |
| --- | --- | --- | --- |
| `Pretendard-ExtraBold.woff2` | `주식회사 엘케이로보틱스` corporate descriptor | `scripts/generate-brand-assets.mjs` | `assets/fonts/Pretendard-ExtraBold.woff2` |
| `Pretendard-SemiBold.woff2` | company-endorsed product name (`LK ROBOTICS Portal`) | `scripts/generate-product-lockups.mjs` | `assets/fonts/Pretendard-SemiBold.woff2` |

Each file is deliberately the same file the UI typography loads; the generators
assert that both copies share the pinned SHA-256, so upgrading the UI font
requires an explicit logo revision at the same time.

- Upstream project: https://github.com/orioncactus/pretendard
- Pinned release: https://github.com/orioncactus/pretendard/releases/tag/v1.3.9
- Upstream path: `packages/pretendard/dist/web/static/woff2/Pretendard-{ExtraBold,SemiBold}.woff2`
- Embedded version metadata: `Version 1.309`
- ExtraBold SHA-256: `DD7C1E156F508EB962ACC7A33A7A1896D1E0B71E11156FAD96E731689CEB6DC3`
- SemiBold SHA-256: `C863F76A7DE5C1DDC1ED8B2FA794964530774592C4F31407A84E2A2AE93F17F0`
- License: SIL Open Font License 1.1; see `OFL.txt`
- OFL.txt SHA-256: `85FCE85E25260B03777BF10373D3BD9363B9DA96D9E0CA86A280DD37ED7667A0`

For the corporate descriptor the generator applies default font positioning plus
`0.105em` tracking between characters only, and exports outlines with uniform scaling and no manual glyph
edits. The corporate descriptor's visible width is `1.90X`, its gap from the
stacked lockup is `0.21X`, and it is centred on the lockup's visible axis.

For the company-endorsed product name the generator calls fontkit
`layout(text, { kern: true })` with no added tracking, rejects `.notdef`, checks the
applied feature set and golden glyph metrics recorded in
`assets/brand/lk-product-lockups.json`, and scales so the name's cap height equals the
Montserrat Bold `ROBOTICS` cap height on a shared baseline.

Construction versions 5 and 6 (2026-08 to 2026-10-08) built the descriptor from
Noto Sans KR ExtraBold `wght=800` v2.004-H2 (SHA-256
`194018E6B2B293A7964F037B25C0249CE1418BC9AB3C971060A03AA57861E252`). That vendor
directory was removed with construction version 7; recover it from Git history
if the earlier outlines ever need to be regenerated.
