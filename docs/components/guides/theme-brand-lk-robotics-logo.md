# LK ROBOTICS Logo

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Theme / Brand |
| Owner | `Lockup` |
| Storybook | `LDS Theme/Brand/LK ROBOTICS Logo` |
| Source | `../component-content.json#theme-brand-lk-robotics-logo` |

기업 표기형과 기본형은 원본 조합을 그대로 사용하고, 제품 UI 파생형은 같은 벡터 윤곽만 재사용합니다. 기능 아이콘이나 장식처럼 반복 사용하지 않으며 비율·색상·자간을 임의로 바꾸지 않습니다.

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

## Responsive

- LK ROBOTICS 로고. 제공된 공식 원본 SVG의 실제 path를 사용하는 자체 완결형 SVG입니다. stacked는 공식 원본의 배경 없는 조합이고, mark와 inline은 공식 윤곽을 그대로 사용하는 제품 UI 파생형입니다. tone은 ink/white/brand/current, 크기는 height로 지정합니다. 워드마크를 임의로 확대·재배치하거나 로고 색을 UI 토큰으로 바꾸지 마세요.

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
