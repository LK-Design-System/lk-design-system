# LK ROBOTICS Logo

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Theme / Brand |
| Owner | `Lockup` |
| Storybook | `LDS Theme/Brand/LK ROBOTICS Logo` |
| Source | `../component-content.json#theme-brand-lk-robotics-logo` |

LK는 고정된 geometry v1.0을 유지하고 ROBOTICS는 Montserrat ExtraBold 800 v7.222, 한글 법인명은 Noto Sans KR ExtraBold 800 v2.004-H2에서 아웃라인으로 생성합니다. construction grid, variant 저장소 정책 최소 크기, 0.5X/1X 여백, 배경·오용·플랫폼 전달 규칙을 함께 확인합니다.

## 사용 판단

### 사용

- Positive: 흰색 또는 밝고 단순한 단색 배경에는 공식 네이비 tone="ink"를 사용합니다.
- Reverse: 공식 네이비 또는 충분히 어둡고 단순한 배경에는 tone="white"를 사용합니다.

### 사용하지 않음

- ROBOTICS: 대문자, Montserrat ExtraBold 정적 weight 800 Version 7.222, 글꼴 기본 커닝, 추가 자간 0, 가로·세로 비율 1:1, 글리프 수동 수정 금지.
- 주식회사 엘케이로보틱스: NFC, Noto Sans KR ExtraBold wght=800 Version 2.004-H2, 글꼴 기본 커닝, 글자 사이 0.105em, 마지막 글자 뒤 자간 없음, 가로·세로 비율 1:1, 글리프 수동 수정 금지.
- 공식 사각형 자산은 전경과 배경이 함께 고정된 조합입니다. tone, currentColor나 UI semantic token으로 다시 칠하지 않습니다.
- 이 manifest들은 deterministic 전달 입력과 hash를 기록할 뿐입니다. Figma live sync, 실제 업로드, 디자이너 승인이나 제품 저장소 적용을 증명하지 않습니다. 특히 iOS AppIcon과 Android adaptive icon은 현재 제공하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 접근성 이름. portal은 "LK Portal", 나머지는 "LK ROBOTICS"가 기본값입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `'mark' \| 'stacked' \| 'inline' \| 'portal'` | No | 'mark'(심볼만) · 'stacked' · 'inline'(가로) · 'portal'(SemiBold 600 LK Portal 고정 정본; ProductLockup의 portal과 동일 조형). @default "inline" |
| `tone` | `'ink' \| 'white' \| 'brand' \| 'current'` | No | 채움 프리셋 — 공식 네이비, 반전 화이트, 호환용 currentColor. 제약된 검정 단색 출력은 color="#000000"을 명시합니다. @default "ink" |
| `color` | `string` | No | 호환용 명시 채움. 임의 색을 공식 로고 사용으로 승인하지 않으며 신규 사용은 tone을 우선합니다. |
| `height` | `number` | No | 요청 자연 높이. 최소 20 mark / 64 stacked / 20 inline으로 보정됩니다. 기본 responsive style의 축소는 실제 표시 최소를 보장하지 않습니다. @default 32 / 64 / 28 |
| `title` | `string` | No | 접근성 이름. portal은 "LK Portal", 나머지는 "LK ROBOTICS"가 기본값입니다. |
| `decorative` | `boolean` | No | 이미지가 아니라 장식으로 표시(aria-hidden). @default false |

## States

| State | Contract |
| --- | --- |
| variant | 'mark'(심볼만) · 'stacked' · 'inline'(가로) · 'portal'(SemiBold 600 LK Portal 고정 정본; ProductLockup의 portal과 동일 조형). @default "inline" |
| tone | 채움 프리셋 — 공식 네이비, 반전 화이트, 호환용 currentColor. 제약된 검정 단색 출력은 color="#000000"을 명시합니다. @default "ink" |

## Behavior and interaction

- 변형 선택과 저장소 정책 최소 크기 (광학 승인 대기).

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 심볼의 정규화된 보이는 치수는 W = 1.08176X, H = 1X입니다. |
| 명시 규칙 2 | 투명 배경 mark·stacked·inline의 외부 clear space는 보이는 로고 bounds부터 사방 0.5X, 공동 브랜딩은 1X입니다. banner는 0.5X를 배경 안에 포함하고, 기본/기업 사각형과 favicon tile은 생성된 전체 캔버스가 보호면입니다. 타이트한 배포 SVG의 내부 패딩과 혼동하지 않습니다. |
| 명시 규칙 3 | geometry v1.0의 path, transform, visible bounds와 SHA-256이 정본입니다. 작도 도표는 검증 기준이며 심볼을 다시 그리는 템플릿이 아닙니다. |
| 명시 규칙 4 | 작은 크기용 별도 redraw는 승인되지 않았습니다. optical test와 승인 기록 전까지 모든 크기에서 v1.0을 유지합니다. |

## Responsive

- X는 패딩이나 SVG viewBox가 아니라 LK 심볼 path의 보이는 높이입니다.
- PORTAL(고정 제품 워드마크): Montserrat SemiBold 600이며 ProductLockup product="portal"과 동일한 정본 path를 사용합니다. 배치는 보이는 높이 1X에 심볼 보이는 폭의 0.35배 간격이며, inline의 심볼 보이는 폭 0.2배보다 넓은 이유는 20px 렌더에서 더 좁은 간격일 때 K의 사선과 P가 붙어 한 단어로 읽히기 때문입니다. 이 값은 0.35X가 아닙니다.
- | 변형 | 사용 | 최소 크기 | | --- | --- | --- | | mark | 브랜드가 이미 식별되는 좁은 제품 UI | 렌더 높이 20px. 이때 보이는 심볼은 16px 이상. 최소 슬롯 폭 21.431318px | | stacked | 세로형·정사각형에 가까운 독립 로크업 | 렌더 높이 64px. 최소 슬롯 폭 82.612990px | | inline | TopBar·SideNav·가로 헤더 | 렌더 높이 20px. 최소 슬롯 폭 156.324048px | | portal | LK Portal 고정 정본.
- height는 요청하는 자연 렌더 높이이며 variant별 최소값 아래에서는 최소값으로 보정됩니다. 기본 출력은 실제 variant viewBox 비율로 intrinsic width를 계산하고 max-width: 100%; height: auto를 적용해, 스타일을 재정의하지 않은 좁은 부모에서는 두 축을 같은 비율로 축소합니다. 이 반응형 축소는 overflow를 피하지만 실제 표시 높이도 낮추므로 저장소 정책 최소 크기를 대신 보장하지 않습니다.

## Content and writing

- variant="portal"은 자유 텍스트 슬롯이 아니라 승인된 LK Portal 고정 조합입니다. 다른 제품명을 전달하거나 PORTAL만 별도 폰트 텍스트로 조판하지 않습니다.
- 적용 범위는 LK Portal을 식별하는 화면입니다. Console은 ProductLockup, Web Viz와 Control은 승인 registry가 생기기 전까지 회사 Lockup과 별도 제품 제목을 사용하며 Portal path를 재사용하지 않습니다.
- LK ROBOTICS의 공식 로고 컴포넌트입니다. LK는 geometry v1.0으로 동결한 커스텀 벡터 심볼이고, ROBOTICS는 Montserrat ExtraBold 800 v7.222에서 생성한 아웃라인입니다. 기업 표기형의 주식회사 엘케이로보틱스는 Noto Sans KR ExtraBold 800 v2.004-H2에서 생성합니다. 제품에서는 공식 SVG, Lockup 또는 승인 registry의 ProductLockup만 사용하며 워드마크·제품명·법인명을 텍스트로 다시 조판하지 않습니다.
- variant="portal"은 SemiBold 600으로 갱신한 LK Portal 고정 정본이며 ProductLockup product="portal"과 path·transform·viewBox가 같습니다. 기존 통합은 공개 Lockup API를 유지하고, 일반 제품 셸은 승인 registry의 ProductLockup을 사용합니다. 현재 product key는 console | portal만 지원합니다. 두 컴포넌트 모두 일반 제품명 slot이 아니므로 mark 옆에 live text를 직접 조판하거나 registry에 없는 이름을 우회 렌더링하지 않습니다.

## Accessibility

- 가장 가까운 회사 변형은 inline입니다. 차이는 ROBOTICS 대신 PORTAL 아웃라인을 쓰고 간격이 LK 심볼 보이는 폭의 0.35배라는 점뿐이며, LK 심볼·1X 높이·최소 크기 보정·색상·접근성 규칙은 모두 같습니다. LK 심볼 폭은 1.08176X이므로 이 간격은 약 0.378616X이고 0.35X가 아닙니다.
- 접근성 이름의 기본값은 LK Portal입니다(회사 변형은 LK ROBOTICS). 이미 aria-label="LK Portal"이 있는 링크 안에서는 decorative로 중복 이름을 만들지 않습니다.
- 사진 배경: 로고와 clear space 전체에 안정적인 대비가 없으면 사진 위에 직접 놓지 않고 공식 단색 보호면을 사용합니다.
- 호환용 color와 tone="current"는 기존 제품 통합을 위한 escape hatch이며, 임의 색을 공식 브랜드 색으로 승인하지 않습니다.

## Exceptions

- Mono: 단색 출력 제약이 확인된 경우에만 검정 tone="current" color="#000000" 또는 흰색 반전을 사용합니다. 기업 표기형의 포인트 색을 임의 회색으로 바꾸지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ProductLockup` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="mark" tone="white" height={32} decorative />
<Lockup variant="stacked" tone="current" color="#000000" height={64} />
<Lockup variant="portal" tone="white" height={20} />
```

## Tokens and API

### Source contracts

- `components/brand/Lockup.jsx`
- `components/brand/Lockup.d.ts`
- `components/brand/Lockup.prompt.md`
- `stories/Brand.stories.jsx`

## Sources

- Lockup prompt contract: `components/brand/Lockup.prompt.md`
- Storybook implementation evidence: `stories/Brand.stories.jsx`
- Figma vector import contract: `assets/brand/platforms/figma/import-manifest.json`
- iOS vector asset contract: `assets/brand/platforms/ios/manifest.json`
- Android VectorDrawable contract: `assets/brand/platforms/android/manifest.json`
- Web canonical SVG contract: `assets/brand/platforms/web/manifest.json`
- [Montserrat v7.222 공식 릴리스](https://github.com/JulietaUla/Montserrat/releases/tag/v7.222)
- [Noto Sans KR 공식 Google Fonts 소스](https://github.com/google/fonts/tree/4efc2774c63917927efe769ca845def6bd6debae/ofl/notosanskr)
