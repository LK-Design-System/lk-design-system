# Third-party notices

This file records third-party material used as a source for the LK Design
System (LDS). It must be retained with redistributed copies or substantial
portions of the corresponding material.

## Montage / Wanted Design System

LDS is based on **Montage, the Wanted Design System by Wantedlab**, and adapts
its foundations, generic component structure, token hierarchy, interaction
expectations, and documentation conventions for LK ROBOTICS.

**Attribution:** Design system: [Montage by Wantedlab](https://montage.wanted.co.kr/) (MIT)

- Upstream terms: https://montage.wanted.co.kr/docs/getting-started/terms-of-use
- Copyright: © 2026 Wanted Lab, Inc.
- License: MIT
- Changes: modified, rebranded, and extended for LK ROBOTICS

LDS is an independent derivative. It is not affiliated with or endorsed by
Wantedlab. Wanted logos, wordmarks, and other Wanted brand assets are governed
separately and are not included in the reusable LDS license grant.

### MIT License

Copyright (c) 2026 Wanted Lab, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Montserrat

The outlined `ROBOTICS` wordmark is generated from Montserrat ExtraBold 800.
The canonical fixed `PORTAL` product name and parent-brand-first `ProductLockup`
product names are generated from Montserrat SemiBold 600. Both fonts are Version
7.222 static fonts obtained from the official Montserrat v7.222 release. The
exact TTF files are retained as build-time sources only; they are not loaded by
the LDS runtime and do not replace Pretendard as the UI typeface.

- Upstream project: https://github.com/JulietaUla/Montserrat
- Pinned release: https://github.com/JulietaUla/Montserrat/releases/tag/v7.222
- Copyright: Copyright 2011 The Montserrat Project Authors
- License: SIL Open Font License 1.1
- Full license: `vendor/montserrat-v7.222/OFL.txt`

## Pretendard

LDS embeds unmodified Pretendard v1.3.9 webfonts for interface typography.

- Upstream project: https://github.com/orioncactus/pretendard
- Pinned release: https://github.com/orioncactus/pretendard/releases/tag/v1.3.9
- Copyright: Copyright (c) 2021, Kil Hyung-jin
- License: SIL Open Font License 1.1
- Full license: `assets/fonts/Pretendard-LICENSE.txt`

## Noto Sans KR

The outlined `주식회사 엘케이로보틱스` corporate descriptor is generated
from the unmodified Noto Sans KR variable TTF at the named ExtraBold
`wght=800` instance, with `0.105em` tracking and uniform scaling. The pinned
font is retained as a build-time source only; production logo SVGs contain
paths and do not load Noto Sans KR at runtime.

- Upstream project: https://github.com/notofonts/noto-cjk
- Pinned Google Fonts source commit: `4efc2774c63917927efe769ca845def6bd6debae`
- Copyright: Copyright 2014-2021 Adobe, with Reserved Font Name `Source`
- License: SIL Open Font License 1.1
- Full license: `vendor/noto-sans-kr-v2.004-h2/OFL.txt`
