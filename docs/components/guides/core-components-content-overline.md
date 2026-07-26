# Overline

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Content |
| Owner | `Overline` |
| Storybook | `LDS Core/Components/Content/Overline` |
| Source | `../component-content.json#core-components-content-overline` |

화면·섹션의 상위 맥락처럼 문장형 표기가 필요한 경우에는 페이지 헤더의 eyebrow가 적합합니다. GUIDE·EVENT처럼 짧은 범주나 브랜드 키커에는 Overline을 사용하고, 상태·긴 설명·제목 자체를 아이브로우로 대신하지 마세요.

## 사용 판단

### 사용

- 강제 대문자 표기는 짧은 라틴 범주에만 사용한다. 한국어를 포함한 비라틴 문자는 원문을 보존하며, 현지화되는 문장은 문장형 아이브로우를 사용한다.
- GOV.UK Design System — Headings: 제목 위 caption은 더 큰 섹션의 맥락을 제공하며 문장형 표기를 사용한다.

### 사용하지 않음

- tone은 강조 수준만 바꾼다. 상태나 중요도를 색 하나로 전달하지 않는다.
- 분류: LDS Core의 콘텐츠 텍스트 프리미티브. 공개 WDS export의 직접 핀으로 주장하지 않는 LDS 고유 계약이다.
- Web Viz: 해당 없음 — 표시 전용 텍스트 프리미티브라 라우트·상태 전이·비동기·권한 흐름을 소유하지 않는다.
- Control Full Daedeok: 해당 없음 — 제어 액션이나 안전 상태를 소유하지 않으며 화면 헤더·콘텐츠 제목에 조합될 수만 있다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `as` | `React.ElementType` | No | 렌더할 요소. @default "div" |
| `tone` | `'signal' \| 'ink' \| 'muted'` | No | 색상 역할 — 'muted'(그레이) · 'signal'(브랜드 시안) · 'ink'(최대 대비). @default "muted" |
| `onDark` | `boolean` | No | 다크 서피스용 색상 사용(라이트 테마 안에서). @default false |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| tone | 색상 역할 — 'muted'(그레이) · 'signal'(브랜드 시안) · 'ink'(최대 대비). @default "muted" |

## Behavior and interaction

- | 필요 | 선택 | 표기 | | --- | --- | --- | | 페이지·섹션의 상위 위치나 범위 | PageHeader의 eyebrow | 문장형 표기와 원래 대소문자 유지 | | GUIDE, EVENT, RESEARCH 같은 짧은 범주·브랜드 키커 | Overline | 짧은 대문자 시각 처리 | | 성공·경고·오류 같은 현재 상태 | 상태 배지 | 텍스트와 상태 의미를 함께 전달 |.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 13px 굵은 signal 텍스트는 밝은 표면에서 --color-semantic-primary-normal(4.66:1), 어두운 역상 표면에서 --color-semantic-inverse-primary(4.84:1)를 사용해 WCAG AA 4.5:1을 충족한다. |
| 명시 규칙 2 | 320px 같은 좁은 폭에서는 화면 맥락과 제목이 자연스럽게 줄바꿈되도록 두고, Overline 문구 자체는 짧게 유지한다. |
| 명시 규칙 3 | tone: "muted"(기본) · "signal"(브랜드 시안) · "ink"(최대 대비) |
| 명시 규칙 4 | W3C WAI — Understanding Contrast (Minimum): 작은 일반 텍스트는 배경과 최소 4.5:1 대비를 확보한다. |
| --color-semantic-inverse-label-neutral-soft | light: rgba(255, 255, 255, 0.62); dark: rgba(255, 255, 255, 0.62) |

## Content and writing

- 제목을 읽기 전에 한두 단어의 범주를 빠르게 구분할 때 Overline을 사용한다.
- 번역되는 문장, 긴 설명, 페이지 경로에는 Overline을 사용하지 않는다.
- 아이브로우는 실제 h1–h6 제목을 대신하지 않는다. as는 문서 구조에 필요한 요소만 바꾸며 시각적 라벨을 heading으로 승격하는 용도가 아니다.
- 아이브로우와 제목의 DOM 읽기 순서는 아이브로우 → 제목을 유지한다.

## Accessibility

- 장식 목적의 색·대문자·자간은 의미를 추가하지 않으므로 별도 ARIA를 붙이지 않는다.
- Fluent 2 — Accessibility: 명확한 시각적 위계와 논리적인 semantic heading 순서를 함께 유지한다.

## Related components

| Component | Relationship |
| --- | --- |
| `Card` | 대표 시나리오에서 조합 |
| `PageHeader` | 대표 시나리오에서 조합 |
| `Accordion` | 대표 시나리오에서 조합 |
| `Blockquote` | 대표 시나리오에서 조합 |
| `Code` | 대표 시나리오에서 조합 |
| `Collapsible` | 대표 시나리오에서 조합 |
| `ContentBadge` | 대표 시나리오에서 조합 |
| `Kbd` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Overline>AI ROBOT PLATFORM</Overline>
<Overline tone="signal">PRODUCTS</Overline>
<Overline onDark tone="ink">KEY CAPABILITIES</Overline>
```

### 추가 조합 2

```jsx
<PageHeader
  eyebrow="시설 모니터링"
  title="층별 현황"
/>
```

## Tokens and API

### Tokens

- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-inverse-primary`
- `--color-semantic-label-alternative`
- `--color-semantic-label-strong`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--font-sans`
- `--fs-caption`
- `--fw-bold`
- `--ls-overline`

### Source contracts

- `components/content/Overline.jsx`
- `components/content/Overline.d.ts`
- `components/content/Overline.prompt.md`
- `stories/ContentOverline.stories.jsx`

## Sources

- Overline prompt contract: `components/content/Overline.prompt.md`
- Storybook implementation evidence: `stories/ContentOverline.stories.jsx`
- [GOV.UK Design System — Headings](https://design-system.service.gov.uk/styles/headings/)
- [W3C WAI — Headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [W3C WAI — Understanding Contrast (Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Carbon Design System — Type sets](https://carbondesignsystem.com/elements/typography/type-sets/)
- [Fluent 2 — Accessibility](https://fluent2.microsoft.design/accessibility)
