# LK ROBOTICS 로고 브랜드 표준 v1.0

| Field | Value |
| --- | --- |
| Type | Brand policy and construction standard |
| Status | Current |
| Owner | Brand owner · Design system owner |
| Last reviewed | 2026-08-11 |
| Standard version | 1.0.0 |
| Construction source | [`../../assets/brand/lk-logo-construction.json`](../../assets/brand/lk-logo-construction.json) |
| Governance record | [`lk-logo-governance.json`](lk-logo-governance.json) |

이 표준은 현재 저장소에서 LK ROBOTICS 로고를 선택·배치·검수·배포하는 기준입니다. 로고의 법적 등록 여부를 주장하거나 외부 사용 권한을 자동으로 부여하지는 않습니다. 법인·상표·파트너 맥락의 공개 사용은 [외부 사용과 승인](#외부-사용과-승인)을 별도로 통과해야 합니다. 제품 UI 셸의 모브랜드 우선 `LK mark + 제품명` outline은 별도 [`LK 제품 로크업 표준`](LK_PRODUCT_LOCKUP_STANDARD.md)의 승인 registry를 따르며, 임의 문자열을 runtime font로 조판하지 않습니다.

## 1. v1.0 정본과 권위

로고를 직접 편집할 수 있는 단일 그림 파일은 없습니다. v1.0의 정본은 다음 소스가 결합된 생성 체계입니다.

1. LK 심볼 geometry: [`../../scripts/brand/lk-logo-source.mjs`](../../scripts/brand/lk-logo-source.mjs)의 `LK_MARK_PATHS`와 `LOGO_GEOMETRY.markBounds`
2. 글꼴·문자열·비율·색상·출력 규칙: [`../../assets/brand/lk-logo-construction.json`](../../assets/brand/lk-logo-construction.json)
3. 결정적 생성과 검증: [`../../scripts/generate-brand-assets.mjs`](../../scripts/generate-brand-assets.mjs)
4. 생성된 시각 기준판: [`../../assets/brand/lk-logo-master.svg`](../../assets/brand/lk-logo-master.svg)
5. 실제 배치 자산: `assets/brand/lk-*.svg`와 제품 UI용 [`../../components/brand/Lockup.jsx`](../../components/brand/Lockup.jsx)

충돌할 때는 위 순서를 따릅니다. `lk-logo-master.svg`는 공식형과 기업 표기형을 함께 확인하는 기준판이며, 두 로고가 나란히 있는 파일 자체를 한 개의 배치용 로고로 사용하지 않습니다. 생성된 SVG와 런타임 path 모듈은 결과물입니다. 직접 수정하지 않고 생성기를 통해 갱신합니다.

v1.0은 현재 커스텀 LK 심볼을 승인 geometry로 동결합니다. 심볼 hash, path, transform 또는 보이는 bounds 중 하나라도 바뀌면 같은 v1.0으로 취급하지 않습니다. 현재 기하 hash와 construction version은 construction manifest가 소유하며 `npm run check:brand`가 소스와 생성 결과의 일치를 검사합니다.

## 2. 심볼 작도와 검증 프레임

### 2.1 기준 단위와 정확한 비율

`X`는 커스텀 LK 심볼의 **보이는 잉크 높이**입니다. SVG `viewBox` 높이나 타일 높이가 아닙니다.

| 항목 | 값 |
| --- | ---: |
| 보이는 bounds 폭 | `60.75467` source units |
| 보이는 bounds 높이 `X` | `56.1628` source units |
| 정확한 원본 W:H | `60.75467 : 56.1628` |
| 정규화 W:H | `1.0817599905987594X : 1X` |
| 사람이 확인할 때의 반올림 표기 | `1.08176 : 1` |

정확성 검사는 반올림 표기가 아니라 [`LOGO_GEOMETRY.markBounds`](../../scripts/brand/lk-logo-source.mjs) 원본과 geometry SHA-256을 사용합니다. `viewBox`에는 기술적 padding이 포함될 수 있으므로 심볼 비율을 `viewBox`에서 역산하지 않습니다.

### 2.2 construction grid의 역할

정규화 검증 프레임은 왼쪽 위를 `(0, 0)`, 오른쪽 아래를 `(1.0817599905987594X, 1X)`로 보는 측정 좌표계입니다. 다음 항목을 검수하는 데 사용합니다.

- 비균일 확대·축소 여부
- 심볼의 잘림과 의도치 않은 내부 여백
- 워드마크에 대한 크기·간격·중심축
- 다른 자산 간 보이는 bounds 일치

이 프레임은 **재작도 허가나 재작도 레시피가 아닙니다.** 현재 심볼은 두 개의 채워진 custom path로 정의되며, 별도의 공인 stroke width·사선 각도·모듈형 격자 값은 저장소에 없습니다. 격자에 맞춰 새 path를 그리거나 문자 `L`, `K`를 폰트로 조판한 결과는 정본이 아닙니다. 정본을 잃었을 때도 눈대중으로 복원하지 않고 Git 이력과 승인 asset package에서 회수합니다.

### 2.3 워드마크와 법인명

| 요소 | 규칙 |
| --- | --- |
| `ROBOTICS` | 대문자 `ROBOTICS`; Montserrat ExtraBold 800 v7.222; 기본 kerning; 추가 자간 `0`; 수평·수직 scale `1`; 수동 glyph 수정 금지 |
| 승인 제품명 | 현재 `CONSOLE`·`PORTAL`; Montserrat SemiBold 600 v7.222; 대문자; 기본 kerning; 추가 자간 `0`; 수평·수직 scale `1`; 수동 glyph 수정 금지; registry 밖 이름 금지. 기존 고정 Portal만 ExtraBold 800 호환 자산으로 유지 |
| 법인명 | NFC `주식회사 엘케이로보틱스`; Noto Sans KR ExtraBold `wght=800` v2.004-H2; 기본 kerning; 글자 사이 `0.105em`; 마지막 글자 뒤 tracking 없음; 수평·수직 scale `1`; 수동 glyph 수정 금지 |
| 배포 | 모든 wordmark·제품명·법인명은 SVG outline path; `<text>` 금지; 런타임 글꼴 의존성 없음 |

폰트 파일·라이선스·SHA-256은 construction manifest에 고정되어 있습니다. Montserrat와 Noto Sans KR은 로고를 생성하기 위한 build-time 재료이며, 제품 본문 글꼴을 이들로 바꾸라는 의미가 아닙니다.

### 2.4 조합 비율

| 조합 | v1.0 규칙 |
| --- | --- |
| stacked | `ROBOTICS` 명목 cap height `0.25X`; 심볼 보이는 폭의 `0.2배` 간격; 가로 중앙 정렬 |
| inline | `ROBOTICS` 보이는 높이 `1X`; 심볼 보이는 폭의 `0.2배` 간격; 보이는 bounds 기준 세로 정렬 |
| ProductLockup | 승인 제품명 보이는 높이 `1X`; 심볼 보이는 폭의 `0.35배` 간격(약 `0.378616X`, **`0.35X`가 아님**); 보이는 bounds 기준 세로 정렬 |
| corporate | 법인명 보이는 폭 `1.9X`; 상단 로크업과 `0.21X` 간격; 상단 로크업 보이는 중심축에 중앙 정렬 |
| banner | inline 조합을 사용하고 사방 `0.5X` 보호 여백을 자산 안에 포함 |

## 3. 변형 선택

| 변형 | 사용 | 사용하지 않는 경우 | 승인 자산/API |
| --- | --- | --- | --- |
| mark | 이미 LK 브랜드임이 명확한 매우 작은 UI, 향후 플랫폼 icon의 핵심 도형 후보 | 법인 식별이 처음 필요한 문서, 파트너십 서명, 기능 아이콘 대체, 승인 없이 만든 iOS/Android app icon | `lk-mark-navy.svg`, `lk-mark-white.svg`, `Lockup variant="mark"` |
| inline | Top bar, Side navigation, 가로 헤더, 제한된 세로 공간 | 정사각형 중심 구성, 법인명 필수 문서 | `lk-logo-inline-navy.svg`, `lk-logo-inline-white.svg`, `Lockup variant="inline"` |
| portal fixed lockup | 기존 ExtraBold 800 통합 호환 또는 Portal 정본 변경 비교가 필요한 표면 | 다른 제품명, 신규 registry 확장, 자유 텍스트 slot | `Lockup variant="portal"` |
| registered product lockup | Console·Portal의 TopBar·SideNav 제품 식별 | Web Viz·Control(승인 대기), 임의 제품명, 고객·환경·상태 문자열 | `ProductLockup product="console"` / `product="portal"` |
| stacked | 세로 중심 구성, 정사각형에 가까운 브랜드 영역 | 낮은 높이의 탐색 바 | `lk-logo-navy.svg`, `lk-logo-white.svg`, `Lockup variant="stacked"` |
| official square | 프로필, 일반 회사 식별, 고정된 정사각형 표면 | 법인명 표기가 필요한 공식 서류 | `lk-logo-official.svg`, `lk-logo-official-light.svg` |
| corporate square | 회사 소개, 법인 식별, 대외 문서에서 법인명이 필요한 경우 | 최소 크기를 확보할 수 없는 UI | `lk-logo-official-corporate.svg`, `lk-logo-official-corporate-light.svg` |
| banner | 배경과 여백까지 한 자산으로 고정해야 하는 가로 배너 | 임의 비율의 컨테이너에 잘라 넣는 경우 | `lk-logo-banner-navy.svg`, `lk-logo-banner-light.svg` |
| tile | 정사각형 브랜드 타일을 명시적으로 요구하는 표면 | 투명 배경 로크업이 필요한 경우 | `lk-logo-tile-navy.svg`, `lk-logo-tile-light.svg` |
| favicon | 브라우저 favicon | 본문 로고, iOS AppIcon, Android adaptive icon 대체 | `lk-favicon.svg` |
| iOS/Android app icon | 플랫폼별 mask·safe area·store 심사가 필요한 별도 파생 | 현재 v1.0 package에는 승인 app icon이 없음 | mark를 후보로 새 자산·실기기·store 검수를 별도 승인 |

`official`과 `tile`의 현재 출력 geometry가 같더라도 의미가 다릅니다. 공식 회사 식별에는 `official`, UI의 브랜드 타일에는 `tile` 이름을 유지해 향후 용도별 변경을 추적합니다. `master` 기준판을 위 변형 대신 배치하지 않습니다.

## 4. 보호 여백

- 투명 mark·inline·stacked·portal fixed lockup·registered product lockup: 전체 보이는 로고 bounds의 상·하·좌·우에 최소 `0.5X`
- 공동 브랜딩: LK 로고의 보이는 bounds와 파트너 로고·구분선·문자 사이에 최소 `1X`
- banner: 생성 자산이 사방 `0.5X`를 포함합니다. 자산을 crop하면 보호 여백도 제거되므로 금지합니다.
- 투명 mark·inline·stacked·portal fixed lockup·registered product lockup: SVG의 tight `viewBox` padding은 렌더링 안전 여유일 뿐 브랜드 보호 여백이 아닙니다. 배치 컨테이너에서 별도로 확보합니다.
- official·corporate·tile·favicon: 배경 사각형과 내부 padding을 그대로 유지하고 crop하지 않습니다. 내부 심볼을 기준으로 `0.5X`를 다시 더하는 계약은 아니며, 주변 콘텐츠와의 외부 간격은 완성된 containment canvas 경계부터 사용 매체의 레이아웃 규칙을 적용합니다.

여백 안에는 제목, 버튼, 테두리, 사진의 강한 모서리, 다른 로고, 워터마크를 넣지 않습니다. 배경색 자체와 전체 표면을 채우는 균일한 색상은 여백 침범으로 보지 않습니다.

## 5. 최소 크기

아래 수치는 플랫폼별 **논리 단위 기준의 전체 렌더 box 크기**입니다. 표의 `px` 표기는 웹 기준이며 같은 숫자를 Figma는 design px, iOS는 pt, Android는 dp로 해석합니다. 물리 화면 pixel 수나 raster 배율이 아니라 layout 단위이며, 브라우저 zoom, 캡처 확대, Retina/고밀도 배율을 이용해 최소 크기를 충족했다고 계산하지 않습니다.

이 수치는 잘림·과도한 축소를 막기 위한 **저장소 정책 최소값**이며, 아직 사람의 small-use 광학 승인 기록은 없습니다. 따라서 “브랜드 담당자가 광학적으로 승인한 절대 최소 크기”로 외부에 주장하지 않습니다. 현재 제품 구현은 아래 값보다 작게 사용하지 않고, 정식 승인 전에는 값을 더 낮추지 않습니다.

| 변형 | 디지털 최소 | 권장 | 판정 기준 |
| --- | ---: | ---: | --- |
| mark | `20px` | `Lockup` 기본값 `32px` | 전체 SVG/`Lockup` 렌더 높이; 이때 보이는 LK 도형은 최소 `16px` |
| inline | `20px` | 기본 `28px` 이상 | 전체 SVG 렌더 높이 |
| portal fixed lockup | `20px` | 기본 `28px` 이상 | 승인된 전체 `LK Portal` SVG 렌더 높이 |
| registered product lockup | `20px` | `ProductLockup` 기본값 `28px` | 전체 SVG 렌더 높이; 좁은 rail은 `compact`로 명시 전환 |
| stacked | `64px` | 기본 `64px` 이상 | 전체 SVG 렌더 높이 |
| banner | `28px` | 사용 표면에 맞춰 확대 | 전체 banner SVG 렌더 높이; crop 금지 |
| official square / tile | `64px` | `96px` 이상 | 정사각형 한 변 |
| corporate square | `160px` | `192px` 이상 | 정사각형 한 변 |
| favicon tile | `16px` | 환경이 지원하는 더 큰 크기 | 정사각형 한 변; 일반 mark와 별도 계약 |

최소 높이를 유지하려면 반응형 슬롯 너비도 mark `21.431318`, inline `156.324048`, stacked `82.612990`, banner `137.019722` 이상의 같은 플랫폼 논리 단위로 확보합니다. ProductLockup은 선택 registry 결과의 intrinsic width를 그대로 확보합니다. 슬롯이 더 좁으면 비균일 축소하거나 overflow시키지 말고, inline·stacked는 mark로, ProductLockup은 `compact`로 전환하거나 레이아웃을 넓힙니다.

corporate square의 인쇄 최소 한 변은 `32mm`입니다. 이보다 작으면 법인명을 축소하지 말고 법인명 없는 official 또는 매체에 맞는 기본 조합으로 바꿉니다. mark·inline·stacked·banner·official의 인쇄 최소 크기는 현재 물리 교정으로 승인된 값이 없으므로 디지털 px 값을 mm로 환산해 공식 인쇄 최소치라고 주장하지 않습니다.

## 6. 색상과 배경

### 6.1 승인 디지털 색상

| 역할 | HEX | RGB | 사용 |
| --- | --- | --- | --- |
| LK Navy | `#05132B` | `5, 19, 43` | 밝은 배경의 심볼·워드마크, 네이비 containment 배경 |
| LK Accent | `#6BBBDD` | `107, 187, 221` | 생성된 corporate 자산의 한글 법인명에만 사용 |
| White | `#FFFFFF` | `255, 255, 255` | 네이비 배경의 reverse 심볼·워드마크, 밝은 containment 배경 |

색상 source of truth는 construction manifest입니다. Theme token의 모드별 의미색과 로고 정본 색상을 혼동하지 않습니다. 특히 dark mode의 일반 `brand-ink` token 값은 로고 네이비 정본을 대체하지 않습니다.

### 6.2 positive, reverse, monochrome

- **Positive:** 공식 기본 조합은 흰색 배경의 navy 자산입니다. 다른 균일한 밝은 단색은 시안을 별도 검토하고, 승인되지 않았으면 light containment 자산을 사용합니다.
- **Reverse:** 공식 기본 조합은 LK Navy 배경의 white 자산입니다. 다른 어두운 색이 LK Navy와 비슷해 보여도 자동 승인 색으로 취급하지 않고 navy containment 자산을 사용합니다.
- **Corporate:** 생성된 corporate asset의 심볼·`ROBOTICS`와 Accent 법인명 조합을 그대로 유지합니다. 법인명만 별도 색으로 재조정하지 않습니다.
- **Monochrome:** 제작 공정이 한 가지 잉크만 허용할 때만 사용하며, 매체·잉크·배경 샘플을 포함한 별도 승인을 받습니다. 임의 CMYK, 회색, 가까운 파랑으로 바꾸지 않습니다. 승인 전 디지털 사용은 navy 또는 white 정본으로 제한합니다.
- `Lockup`의 `tone="current"`와 `color` prop은 기술적으로 단색 주입을 허용하지만, 이것이 임의 색상 사용 승인은 아닙니다. 외부 브랜드 표면에서는 이 표준과 승인 기록이 API보다 우선합니다.

### 6.3 사진·영상·복잡한 배경

사진, 영상, 그라디언트, 패턴, 데이터 시각화 위에는 투명 로고를 직접 올리지 않습니다. `banner`, `official`, `tile`, `corporate`처럼 승인된 균일 containment 배경이 포함된 자산을 사용합니다. 배경을 임의 blur·shadow·반투명 판으로 보정하지 않습니다. 필요한 containment 비율이 없으면 자산을 늘이거나 crop하지 말고 브랜드 담당자에게 새 승인 변형을 요청합니다.

### 6.4 인쇄 색상 거버넌스

현재 저장소에는 물리 교정으로 승인된 CMYK 또는 Pantone 값이 없습니다.

| 체계 | 공식 값 | 상태 |
| --- | --- | --- |
| HEX / RGB | 위 표의 값 | 승인된 디지털 정본 |
| CMYK | 없음 | 미승인 — 임의 환산값을 브랜드 표준에 기재하거나 재사용하지 않음 |
| Pantone | 없음 | 미승인 — 코팅·비코팅 번호를 추정하지 않음 |

CMYK/Pantone을 추가하려면 최소한 출력 공정, ICC profile, 용지·소재, 코팅 여부, 잉크, 교정 출력, 관찰 조건, 공급업체와 날짜를 기록합니다. 브랜드 담당자가 실물을 비교·승인한 후 governance record에 값과 proof 식별자를 추가하고 표준 version을 올립니다. 화면용 HEX를 변환한 소프트웨어 값이나 인쇄소의 구두 권고만으로는 공식 값이 되지 않습니다.

## 7. small-use 검증 정책

현재 mark의 저장소 정책 기준은 **전체 SVG/`Lockup` 높이 `20px` 이상이면서 보이는 LK 도형 높이 `16px` 이상**입니다. `lk-favicon.svg`의 `16px` 정사각 tile 계약과 투명 mark 계약을 혼동하지 않습니다. 다음 조건을 모두 확인하고 governance record에 판정자를 기록하기 전에는 어떤 raster export, 렌더러, geometry 또는 색상 조합도 사람의 광학 승인을 획득한 것으로 보지 않습니다.

1. `16 / 20 / 24 / 28 / 32 / 48 / 64px`의 실제 CSS 크기에서 캡처합니다.
2. `1x`와 `2x` rasterization을 확인합니다.
3. navy-on-light와 white-on-navy를 모두 확인합니다.
4. K 내부 음각, L/K 분리, 사선 끝, 외곽 crop, 중심과 비균일 scale을 검사합니다.
5. 각 변형의 최소 크기에서 문자열 또는 법인명이 읽히는지 사람이 확인합니다.
6. 자동 pixel diff는 회귀 증거로 사용하되, 사람의 광학 판정을 대체하지 않습니다.
7. favicon은 실제 브라우저 탭에서 확인합니다. 향후 app icon을 만들면 favicon을 재사용하지 않고 플랫폼 mask·safe area·실제 OS 런처·store 검수 결과를 별도 확인합니다.

전체 렌더 높이 20px 또는 보이는 도형 16px 중 하나라도 충족하지 못하는 mark, 20px보다 작은 inline, 64px보다 작은 stacked, 28px보다 작은 banner, 64px보다 작은 official/tile은 저장소 정책상 허용되지 않습니다. favicon tile만 별도 16px 정사각 계약을 따릅니다. 더 작은 사용이 필요하면 기존 path를 단순화하지 말고 별도 `small-use` master에 대한 geometry·구간·자산명·회귀 기준을 승인받습니다. 현재 v1.0에는 별도의 small-use geometry가 없습니다.

## 8. 금지 사용

| 금지 사례 | 문제 | 올바른 처리 |
| --- | --- | --- |
| 가로·세로 비균일 확대 | 정본 W:H와 획의 시각 무게가 바뀜 | aspect ratio를 고정해 비례 확대 |
| 회전·기울임·원근 변형·반전 | 심볼 인지 구조가 바뀜 | 원래 수평 방향 유지 |
| 심볼 path 재작도·간소화 | geometry hash와 small-use 근거를 잃음 | 제공 mark 사용 |
| `LK`를 폰트로 재조판 | 커스텀 심볼과 다른 형태가 됨 | 정본 path 사용 |
| `ROBOTICS` 또는 법인명 재입력 | pinned font·kerning·tracking·outline이 달라짐 | 생성 SVG 사용 |
| 워드마크 크기·간격·중심 이동 | 조합 비율이 깨짐 | 적합한 공식 variant 선택 |
| 심볼과 워드마크 분리·재결합 | 승인되지 않은 lockup 생성 | mark 또는 완성된 lockup 중 하나 사용 |
| 임의 색·그라디언트·사진 mask | 정본 색상과 실루엣이 사라짐 | positive/reverse/containment 자산 사용 |
| outline, shadow, glow, bevel, 3D | 승인되지 않은 효과로 형태가 달라짐 | 효과 없는 원본 사용 |
| 투명도 변경 | 대비와 정본 색이 불안정해짐 | 100% opacity 유지 |
| logo crop 또는 container 모서리 잘림 | 심볼·보호 여백 손실 | 전체 SVG를 안전 영역 안에 배치 |
| 보호 여백 안에 문구·선·버튼 배치 | 독립성과 식별성 저하 | 일반 `0.5X`, co-brand `1X` 확보 |
| 복잡한 사진에 투명 logo 직접 배치 | 위치마다 대비가 달라짐 | 승인 containment asset 사용 |
| 기능 아이콘으로 반복 사용 | 회사 식별과 동작 의미를 혼동 | 기능에는 LDS `Icon`, 브랜드에는 logo 사용 |
| 배경 pattern·bullet·워터마크로 반복 | 상표 희석과 시각 소음 | 필요한 한 위치에만 식별자로 사용 |
| path를 그리는 animation 또는 분해 motion | 일시적으로 승인되지 않은 형태 노출 | 완성 로고의 단순 등장/퇴장도 별도 motion 승인 |
| AI로 비슷하게 재생성 | path·글꼴·간격·권리 provenance를 검증할 수 없음 | 저장소 정본을 직접 제공 |
| partner logo와 한 SVG로 임의 합성 | 간격·위계·권리 오인 가능 | 공동 브랜딩 절차 사용 |
| `master` 기준판 전체를 한 로고로 배치 | 두 선택지를 하나의 lockup처럼 보이게 함 | 필요한 개별 배치 자산 선택 |
| screenshot·저해상도 PNG 재사용 | 배경과 해상도가 고정되고 outline 품질 손실 | SVG에서 목적 크기로 1회 export |

## 9. 공동 브랜딩

1. LK와 파트너 로고는 각각의 공식 원본을 사용하고 geometry를 수정하지 않습니다.
2. 두 로고의 보이는 bounds 사이에 최소 `1X`를 둡니다. 파트너 표준이 더 큰 여백을 요구하면 더 큰 값을 적용합니다.
3. 단순히 같은 픽셀 높이로 맞추지 않습니다. 각 브랜드의 최소 크기를 먼저 충족하고, 광학적 무게와 계약상 위계를 검토합니다.
4. 순서, `×`·구분선·`powered by` 문구, 주최/후원 위계는 계약과 승인에 따라 결정합니다. 기본값으로 추정하지 않습니다.
5. 공동 lockup을 새로운 LK master로 저장하지 않습니다. 캠페인·파트너·매체·기간이 명시된 파생물로 관리합니다.
6. 제3자 logo 라이선스와 파트너 승인을 LK 승인과 별도로 확인합니다.
7. mark 단독은 파트너 문맥에서 LK 식별이 이미 명확할 때만 검토합니다. 공식 계약·보도·법인 식별에는 full lockup 또는 corporate asset을 우선합니다.

## 10. 외부 사용과 승인

저장소에 SVG가 존재하거나 패키지에서 렌더할 수 있다는 사실은 외부 상표 사용 허가가 아닙니다. 다음은 공개 전 브랜드 담당자 승인이 필요합니다.

- 고객·파트너·언론·채용·행사·광고에 제공하는 원본 또는 제작물
- 다른 조직 logo와 함께 쓰는 공동 브랜딩
- 명함, 계약서, 회사 소개서, 간판, 차량, 유니폼, 포장, 자수, 각인
- app store, marketplace, social profile처럼 장기간 공개되는 브랜드 식별
- navy/white 디지털 정본 외의 단색, 인쇄색, 특수 소재
- logo motion, 3D, 조명, 입체 사인, 제작 공정상 geometry 보정

승인 요청에는 목적, 소유 조직, 채널·매체, 공개 지역, 공개 기간, 선택 asset 이름, 표준 version, 최종 크기, 배경, 보호 여백, 시안, 제작업체를 포함합니다. 인쇄면 proof 식별자와 소재·공정을, 공동 브랜딩이면 파트너 사용 허가를 추가합니다.

법인명은 승인 corporate asset 안의 `주식회사 엘케이로보틱스`를 사용합니다. 임의 영문 법인명·번역·약칭을 logo 일부로 추가하지 않습니다. 이 문서는 LK 또는 LK ROBOTICS의 상표 등록 상태, 권리 범위, 지정 상품·서비스를 선언하지 않습니다. 등록 표기나 법적 문구가 필요하면 법률 또는 상표 담당자의 별도 확인을 받습니다. logo를 사용해 실제로 존재하지 않는 후원·인증·제휴를 암시해서는 안 됩니다.

## 11. 접근성과 콘텐츠

- 독립적으로 회사 식별 정보를 전달하면 `role="img"`와 문맥에 맞는 접근성 이름을 제공합니다. 기본 이름은 `LK ROBOTICS`입니다.
- 인접 제목이나 링크 텍스트가 같은 의미를 이미 전달하는 장식용 instance는 `decorative`/`aria-hidden`으로 중복 낭독을 막습니다.
- 법인명까지 정보로 필요한 문서에서는 이미지 대체 텍스트나 주변 본문에도 `주식회사 엘케이로보틱스`를 제공합니다.
- 로고 이미지는 버튼의 동작 이름을 대신하지 않습니다. 클릭 가능한 logo에는 목적지 이름이 이해되도록 링크 이름을 구성합니다.
- SVG `<title>`은 파일 자체의 기본 설명이고, 제품 문맥의 접근성 이름은 `Lockup` API 또는 host markup에서 결정합니다.

## 12. 자산 형식과 전달

| 형식 | 상태 | 규칙 |
| --- | --- | --- |
| SVG | 공식 원본 형식 | outline path와 `preserveAspectRatio` 유지; path 직접 편집 금지 |
| React `Lockup` | 제품 UI 공식 runtime | 승인 variant와 색상 정책 사용; `height`가 최소 크기 이상인지 확인 |
| React `ProductLockup` | 제품 UI 로크업 runtime | `console`·`portal` registry의 SemiBold 600 승인 SVG outline만 렌더; 기본 28px·최소 20px, positive/reverse, full/compact; raw text·runtime font 금지 |
| PNG | 필요 시 파생 export | 승인 SVG에서 최종 픽셀 크기와 `1x/2x`로 내보내고 재압축·재확대 체인을 만들지 않음 |
| PDF / EPS | 현재 공식 생성물 없음 | 인쇄업체가 요구하면 승인 SVG에서 곡선을 보존해 제작하고 proof 승인 전에는 새 정본으로 취급하지 않음 |
| 폰트 포함 파일 | 배포 불필요 | wordmark와 법인명은 outline이므로 logo 사용을 위해 폰트를 설치·동봉하지 않음 |

플랫폼별 자산은 [`assets/brand/platforms/manifest.json`](../../assets/brand/platforms/manifest.json)이 source asset hash와 전달 계약을 연결합니다.

| 플랫폼 | 제공 계약 | 현재 경계 |
| --- | --- | --- |
| Figma | [`figma/import-manifest.json`](../../assets/brand/platforms/figma/import-manifest.json)의 component/variant import 명세 | 수동 import 계약이며 live sync, 실제 upload 또는 디자인 승인 증거가 아님 |
| iOS | [`LKBrandAssets.xcassets`](../../assets/brand/platforms/ios/LKBrandAssets.xcassets) scalable imageset | vector representation을 보존하지만 브라우저 전용 favicon은 catalog에서 제외하며, `AppIcon.appiconset`이나 App Store 승인 자산은 제공하지 않음 |
| Android | [`android/res`](../../assets/brand/platforms/android/res)의 fixed-color VectorDrawable | `autoMirrored=false`; consumer tint·mirror 금지; adaptive icon은 제공하지 않으며 generic favicon을 adaptive icon으로 취급하지 않음 |
| Web | [`web/manifest.json`](../../assets/brand/platforms/web/manifest.json)의 canonical path, hash와 integrity | SVG를 복제하지 않고 root canonical asset을 직접 사용 |

플랫폼 출력과 manifest도 생성 결과입니다. 직접 수정하지 않고 `npm run generate:brand`로 갱신하며 `npm run check:brand`가 root와 플랫폼 projection을 함께 검사합니다. Figma 수동 import나 mobile product repository 적용처럼 저장소 밖에서 일어나는 배포는 자동 동기화됐다고 추정하지 않고 별도 수신·승인 기록을 남깁니다.

construction manifest, governance 원문과 build-time 글꼴은 저장소 루트/문서 전용이며 npm package에 배포하지 않습니다. package에 복사되는 `platforms/manifest.json`의 source path는 provenance 식별자이고 construction은 `distribution: repository-root-only`, governance는 `distribution: repository-docs-only`, 둘 다 `resolvableInPackage: false`로 명시됩니다. package 소비자는 그 경로를 package 내부 파일로 해석하지 말고 포함된 construction version·SHA-256과 `brandStandard` snapshot을 확인합니다. 이 snapshot은 표준 version과 최소 크기가 저장소 정책이며 사람의 광학 승인 대기 상태라는 범위를 각 플랫폼 계약에도 전달합니다.

외부 전달 package에는 사용 목적에 필요한 최소 asset만 넣고 표준 version, asset 파일명, checksum, 색상/배경 용도, 최소 크기와 승인 범위를 함께 기록합니다. `lk-logo-construction.json`, build font, generator 또는 master 기준판 전체를 일반 사용자가 logo를 재조립하도록 전달하지 않습니다.

## 13. 제품 적용 감사 경계

현재 제품별 근거와 source revision은 [`PRODUCT_BRAND_ASSET_AUDIT.json`](../references/brand/PRODUCT_BRAND_ASSET_AUDIT.json)이 소유합니다. 이 표준은 회사 심볼·워드마크·색상·여백·최소 크기와 생성 자산을 소유합니다. [`ProductLockup`](../../components/brand/ProductLockup.jsx)은 승인 제품 registry, mark+wordmark outline, canonical 접근성 이름과 full/compact 계약을 소유하고, 각 제품은 TopBar/SideNav 소유 위치, route/click, breakpoint와 package upgrade 시점을 소유합니다.

| 제품 | 현재 판정 | 필요한 조치 |
| --- | --- | --- |
| LK Web Viz | `migration-required` | registry는 `registry-name-approval-pending`이므로 `ProductLockup` 미지원; 로컬 gradient PNG migration과 회사 `Lockup` 적용은 별도 수행 |
| LK Control Full Daedeok | `migration-required` | registry는 `registry-name-approval-pending`이므로 `ProductLockup` 미지원; 로그인 로컬 asset은 승인 회사 `Lockup` 자산으로 교체 |
| LK Portal | `contract-compatible-upgrade-required` | 신규 셸 제안은 SemiBold 600 `ProductLockup product="portal"`; ExtraBold 800 `Lockup variant="portal"`은 호환·비교 자산으로 유지하고 정본 변경은 별도 승인 |

이 판정은 audit에 pin된 revision의 증거입니다. 제품의 최신 상태를 자동으로 보증하지 않으므로 migration 완료를 주장하려면 source pin과 asset checksum을 다시 갱신합니다.

## 14. version과 변경 절차

### 14.1 version 의미

- **Major:** 심볼 geometry, wordmark/법인명 글꼴·문자열·비율, 정본 색상, 기존 variant의 보이는 결과 또는 승인 의미 변경
- **Minor:** 기존 결과를 깨지 않는 새 공식 variant, 새 매체 규칙, 승인된 print color 또는 small-use master 추가
- **Patch:** 결과를 바꾸지 않는 설명, 오탈자, 링크, 승인 metadata 보완

문서 standard version과 생성 체계의 `constructionVersion`은 목적이 다릅니다. standard version은 사용·승인 정책을, constructionVersion과 geometry/font hashes는 결정적 자산 생성을 추적합니다. 보이는 출력에 영향을 주는 변경은 둘 다 검토해야 합니다.

### 14.2 변경 gate

1. 변경 이유와 현재 표준으로 해결할 수 없는 문제를 기록합니다.
2. 영향받는 geometry, font, layout, color, variant, size, channel을 나열합니다.
3. 현재/제안 자산을 같은 크기·배경에서 비교하고 small-use matrix를 갱신합니다.
4. 브랜드 담당자가 시각·사업 결정을, design-system 담당자가 생성·API·회귀 영향을 검토합니다.
5. 외부 상표 표현은 법률/상표 검토를, print color는 물리 proof 승인을 추가합니다.
6. source와 manifest를 먼저 변경하고 `npm run generate:brand`로 결과를 만듭니다. 생성 SVG를 먼저 손대지 않습니다.
7. 최소 `npm run check:brand`와 `npm run check:docs`를 통과시키고, 제품 audit를 바꾸면 `npm run check:brand-products`, 영향받는 화면을 바꾸면 시각 회귀·접근성 검사를 함께 기록합니다.
8. 표준 version, constructionVersion/hash, asset package, 변경 기록과 폐기 예정 자산을 함께 release합니다.
9. 이전 자산을 조용히 덮어쓰지 않습니다. Git/release 이력에서 회수 가능하게 하고 외부 수신자에게 교체 기한을 알립니다.

승인자 개인 이름·일자·proof가 저장소에 기록되지 않았다면 “승인됨”으로 추정하지 않습니다. [`lk-logo-governance.json`](lk-logo-governance.json)의 빈 `approvalRecords`는 그런 승인을 가공해 넣지 않았다는 의미입니다.

## 15. 검수 체크리스트

- [ ] 목적에 맞는 공식 variant와 파일을 선택했다.
- [ ] aspect ratio, path, 문자열, tracking, 간격을 바꾸지 않았다.
- [ ] 일반 `0.5X` 또는 공동 브랜딩 `1X` 보호 여백을 확보했다.
- [ ] 해당 변형의 최소 렌더 크기를 충족했다.
- [ ] positive/reverse/containment 배경 규칙을 지켰다.
- [ ] 디지털 정본 외 색상 또는 print color라면 별도 승인과 proof가 있다.
- [ ] 외부 사용·파트너 logo·법적 표기에 필요한 권한을 확인했다.
- [ ] 정보성/장식용 의미에 맞는 접근성 이름을 제공했다.
- [ ] 전달 asset의 standard version, 파일명, checksum과 승인 범위를 기록했다.
- [ ] 생성 변경이면 brand/docs 및 영향 범위 검사를 통과했다.

## 16. 외부 1차 자료와 적용 판단

이 표준의 체계 수준은 아래 기업의 **공식** 브랜드 자료와 비교해 검토했습니다. 이 링크는 LK geometry나 수치를 가져오는 원본이 아니라, 자산 선택·보호·승인 체계가 빠지지 않았는지 확인하는 benchmark입니다.

| 공식 자료 | 확인한 성숙도 기준 | LK에 적용한 판단 |
| --- | --- | --- |
| [IBM Design Language — 8-Bar](https://www.ibm.com/design/language/ibm-logos/8-bar/) | 제공 master의 비율·색·간격을 바꾸지 않고, positive/reverse의 광학 차이·clear space·사진 배경·오용을 별도 관리 | 정본 path를 재작도하지 않고 배경별 승인 output과 오용 목록을 둔다는 원칙을 채택했습니다. IBM의 `1X` 수치와 별도 광학 master는 LK에 복사하지 않습니다. LK reverse는 현재 동일 geometry이며 새 광학 보정은 별도 version 승인이 필요합니다. |
| [Red Hat Logo Standards](https://www.redhat.com/en/about/brand/standards/logo) | 공간 비율에 맞는 variant 선택, 브랜드 문맥이 명확할 때만 symbol 단독 사용, 작은 표면과 복잡한 배경의 별도 처리, AI 재생성 금지 | mark/inline/stacked/square 선택표, mark 단독 조건, favicon과 app icon 분리, AI 재생성 금지를 채택했습니다. Red Hat의 글자 기반 clear-space 단위와 variant geometry는 가져오지 않습니다. |
| [Spotify for Developers — Design & Branding Guidelines](https://developer.spotify.com/documentation/design) | icon/full logo의 exclusion zone, 디지털·인쇄 최소 크기, 배경별 색상과 회전·늘임·저대비 금지 | LK도 `0.5X` 보호 여백, 변형별 최소 크기, 배경·오용 검사를 둡니다. Spotify의 `70px/21px`나 인쇄 수치를 LK에 환산하지 않으며, LK 인쇄 최소값은 corporate square의 검증 범위만 주장합니다. |
| [Slack Media Kit](https://join.slack.com/media-kit) · [Slack Brand Guidelines PDF](https://a.slack-edge.com/4d5bb/marketing/img/media-kit/slack_brand_guidelines_september2020.pdf) | 승인 자산의 중앙 배포, 자기 geometry를 기준으로 한 clear space, 파트너 결합 규칙과 가이드 밖 사용의 mockup 승인 | checksum이 있는 asset contract, co-brand `1X`, 외부 시안·권한 승인 workflow를 채택했습니다. Slack octothorpe/lozenge 단위와 파트너 lockup geometry는 LK 수치가 아닙니다. |

공통적으로 채택한 것은 “공식 원본을 제공하고, 쓰임에 맞는 variant를 고르고, 최소 크기·여백·배경·금지 사례·승인자를 함께 관리한다”는 운영 구조입니다. 다른 회사의 숫자나 grid를 LK 심볼의 설계 근거로 소급하지 않습니다. 각 링크의 상표·자산 사용 권한도 LK에 전이되지 않습니다.

## 17. 저장소 근거

- 정본 construction manifest: [`../../assets/brand/lk-logo-construction.json`](../../assets/brand/lk-logo-construction.json)
- 심볼 geometry와 정확한 bounds: [`../../scripts/brand/lk-logo-source.mjs`](../../scripts/brand/lk-logo-source.mjs)
- 생성·font metadata·hash·layout 검증: [`../../scripts/generate-brand-assets.mjs`](../../scripts/generate-brand-assets.mjs)
- 제품 runtime 구현: [`../../components/brand/Lockup.jsx`](../../components/brand/Lockup.jsx)
- 컴포넌트 제작 규정: [`../../components/brand/Lockup.prompt.md`](../../components/brand/Lockup.prompt.md)
- 제품 사용 가이드: [`../components/guides/theme-brand-lk-robotics-logo.md`](../components/guides/theme-brand-lk-robotics-logo.md)
- 제품 로크업 표준: [`LK_PRODUCT_LOCKUP_STANDARD.md`](LK_PRODUCT_LOCKUP_STANDARD.md)
- 제품 로크업 runtime: [`../../components/brand/ProductLockup.jsx`](../../components/brand/ProductLockup.jsx)
- 디지털 색상 원천: [`../../tokens/source.json`](../../tokens/source.json)
- 제품 적용 감사: [`../references/brand/PRODUCT_BRAND_ASSET_AUDIT.json`](../references/brand/PRODUCT_BRAND_ASSET_AUDIT.json)
- 플랫폼 자산 계약: [`../../assets/brand/platforms/manifest.json`](../../assets/brand/platforms/manifest.json)
- 운영 record: [`lk-logo-governance.json`](lk-logo-governance.json)
