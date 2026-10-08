# Montserrat Bold 700 and SemiBold 600 (v7.222)

This directory pins the exact static fonts used to construct the outlined
`ROBOTICS` wordmark (Bold 700), plus the canonical fixed `PORTAL` and
parent-brand-first `ProductLockup` product names (SemiBold 600). They are
build-time brand sources only; the LDS runtime and UI typography continue to
use Pretendard and do not load these TTF files.

- Upstream project: https://github.com/JulietaUla/Montserrat
- Pinned release: https://github.com/JulietaUla/Montserrat/releases/tag/v7.222
- Pinned tag commit: `5dae7a4ef9c0bf9fe48dc54fd1076eefaa0a8c7e`
- Bold source: `fonts/ttf/Montserrat-Bold.ttf`
- Bold SHA-256: `4E6D93BC38122C371ACB8DC0DBEFBF2649C235191E1BE136BB5720546D719808`
- SemiBold source: `fonts/ttf/Montserrat-SemiBold.ttf`
- SemiBold SHA-256: `49FBFCE003AD1692D7C9A6502791577088C12C50088D4CAA27DBBFE540AD9D13`
- Embedded version metadata: `Version 7.222` for both static fonts
- License: SIL Open Font License 1.1; see `OFL.txt`
- OFL.txt SHA-256: `41F82BB4D24B304F30F7136BC47ABDD083782E4265C984160F5649D1E78EA49C`

Do not replace or re-export these binaries under the same applicable construction version.
To adopt another Montserrat release, update the construction manifest, review
the generated outlines visually, and publish it as an explicit logo revision.

Construction version 5 (2026-08 to 2026-10-08) built `ROBOTICS` from Montserrat
ExtraBold 800 (`fonts/ttf/Montserrat-ExtraBold.ttf`, SHA-256
`1B364C3400BF7B1CC2C47A25DD0D3EDD8331DA451412AA5539080F78F8F70B63`). That binary
was removed with construction version 6; recover it from the pinned tag commit if
the v5 outlines ever need to be regenerated.
