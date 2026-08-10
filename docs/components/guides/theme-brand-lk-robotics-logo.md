# LK ROBOTICS Logo

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Theme / Brand |
| Owner | `Lockup` |
| Storybook | `LDS Theme/Brand/LK ROBOTICS Logo` |
| Source | `../component-content.json#theme-brand-lk-robotics-logo` |

LK는 승인된 커스텀 벡터를 유지하고 ROBOTICS는 Montserrat ExtraBold 800 v7.222, 한글 법인명은 Noto Sans KR ExtraBold 800 v2.004-H2에서 아웃라인으로 생성합니다. 승인 SVG 또는 Lockup만 사용하며 기능 아이콘처럼 반복하거나 비율·색상·자간을 임의로 바꾸지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 접근성 이름. @default "LK ROBOTICS" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `'mark' \| 'stacked' \| 'inline'` | No | 'mark'(심볼만) · 'stacked'(기본) · 'inline'(가로). @default "inline" |
| `tone` | `'ink' \| 'white' \| 'brand' \| 'current'` | No | 채움 프리셋 — 'ink'/'brand' 공식 네이비(05132B) · 'white' · 'current'(currentColor). @default "ink" |
| `color` | `string` | No | 명시적 채움, tone을 재정의. |
| `height` | `number` | No | 렌더 픽셀 높이. @default 32 mark / 64 stacked / 28 inline |
| `title` | `string` | No | 접근성 이름. @default "LK ROBOTICS" |
| `decorative` | `boolean` | No | 이미지가 아니라 장식으로 표시(aria-hidden). @default false |

## States

| State | Contract |
| --- | --- |
| variant | 'mark'(심볼만) · 'stacked'(기본) · 'inline'(가로). @default "inline" |
| tone | 채움 프리셋 — 'ink'/'brand' 공식 네이비(05132B) · 'white' · 'current'(currentColor). @default "ink" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | ROBOTICS: 대문자, Montserrat ExtraBold 정적 weight 800 Version 7.222, 글꼴 기본 커닝, 추가 자간 0, 가로·세로 비율 1:1, 글리프 수동 수정 금지 |
| 명시 규칙 2 | 주식회사 엘케이로보틱스: NFC 텍스트, Noto Sans KR 가변 TTF의 명명된 ExtraBold wght=800 Version 2.004-H2, 글꼴 기본 커닝, 글자 사이 자간 0.105em, 마지막 글자 뒤 자간 없음, 가로·세로 비율 1:1, 글리프 수동 수정 금지 |
| 명시 규칙 3 | 배치: 법인명 보이는 폭 1.90X, 상단 로크업과의 간격 0.21X, 상단 로크업의 보이는 중심축에 가운데 정렬 |
| 명시 규칙 4 | 최소 크기: 디지털 160px, 권장 192px 이상, 인쇄 32mm. 이보다 작으면 법인명 없는 기본형 사용 |

## Responsive

- X는 커스텀 LK 심볼의 보이는 높이입니다. stacked는 워드마크 명목 cap height를 0.25X로 하고 심볼 보이는 폭의 0.2배만큼 띄워 가운데 정렬합니다. inline은 워드마크의 보이는 높이를 1X로 하고 같은 0.2배 간격을 둡니다. 배너 최소 여백은 사방 0.5X, 제품 UI용 inline 최소 렌더 높이는 20px입니다.

## Content and writing

- LK ROBOTICS의 승인 로고 컴포넌트입니다. LK는 커스텀 벡터 심볼이고, ROBOTICS는 고정된 Montserrat ExtraBold 800 v7.222 글꼴에서 생성한 아웃라인입니다. 기업 표기형의 주식회사 엘케이로보틱스는 Noto Sans KR ExtraBold 800 v2.004-H2에서 생성합니다. 제품에서는 승인 SVG 또는 Lockup만 사용하며 워드마크나 법인명을 텍스트로 다시 조판하지 않습니다.
- 승인 SVG와 Lockup은 동일한 생성 원본을 사용합니다. 개별 SVG path를 직접 편집하거나 텍스트로 다시 만들지 않습니다.

## Examples

### 기본 조합

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="mark" tone="white" height={40} />
<Lockup variant="stacked" height={72} />
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
- [Montserrat v7.222 공식 릴리스](https://github.com/JulietaUla/Montserrat/releases/tag/v7.222)
- [Noto Sans KR 공식 Google Fonts 소스](https://github.com/google/fonts/tree/4efc2774c63917927efe769ca845def6bd6debae/ofl/notosanskr)
