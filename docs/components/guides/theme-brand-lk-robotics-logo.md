# LK ROBOTICS Logo

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Theme / Brand |
| Owner | `Lockup` |
| Storybook | `LDS Theme/Brand/LK ROBOTICS Logo` |
| Source | `../component-content.json#theme-brand-lk-robotics-logo` |

제품 식별이 필요한 시작점과 브랜드 표면에 정해진 lockup과 여백으로 사용하는 데 적합합니다. 기능 아이콘이나 장식처럼 반복 사용하지 않으며, 비율·색상·자간을 임의로 바꾸거나 다른 문구와 재조합하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 접근성 이름. @default "LK ROBOTICS" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `'mark' \| 'stacked' \| 'inline'` | No | 'mark'(심볼만) · 'stacked'(기본) · 'inline'(가로). @default "inline" |
| `tone` | `'ink' \| 'white' \| 'brand' \| 'current'` | No | 채움 프리셋 — 'ink' 네이비 · 'white' · 'brand' 시그널 잉크 · 'current'(currentColor). @default "ink" |
| `color` | `string` | No | 명시적 채움, tone을 재정의. |
| `height` | `number` | No | 렌더 픽셀 높이. @default 32 mark / 64 stacked / 28 inline |
| `title` | `string` | No | 접근성 이름. @default "LK ROBOTICS" |
| `decorative` | `boolean` | No | 이미지가 아니라 장식으로 표시(aria-hidden). @default false |

## States

| State | Contract |
| --- | --- |
| variant | 'mark'(심볼만) · 'stacked'(기본) · 'inline'(가로). @default "inline" |
| tone | 채움 프리셋 — 'ink' 네이비 · 'white' · 'brand' 시그널 잉크 · 'current'(currentColor). @default "ink" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-brand-ink | light: #1B2240; dark: #E7EAF2 |

## Responsive

- LK ROBOTICS 로고. 에셋 파일 없이 자체 완결형 SVG입니다. variant는 mark/stacked/inline, tone은 ink/white/brand/current, 크기는 height로 지정합니다. 구성(마크·워드마크 비율)은 원본 트레이스 에셋(assets/brand/lk-logo-.svg)과 동일하게 고정 — 워드마크를 임의로 확대/재배치하지 마세요.

## Examples

### 기본 조합

```jsx
<Lockup variant="inline" tone="ink" height={28} />
<Lockup variant="mark" tone="white" height={40} />
<Lockup variant="stacked" height={72} />
```

## Tokens and API

### Tokens

- `--color-semantic-brand-ink`
- `--color-semantic-static-white`

### Source contracts

- `components/brand/Lockup.jsx`
- `components/brand/Lockup.d.ts`
- `components/brand/Lockup.prompt.md`
- `stories/Brand.stories.jsx`

## Sources

- Lockup prompt contract: `components/brand/Lockup.prompt.md`
- Storybook implementation evidence: `stories/Brand.stories.jsx`
