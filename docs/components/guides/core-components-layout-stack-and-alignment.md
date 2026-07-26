# Stack and Alignment

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `Stack` |
| Storybook | `LDS Core/Components/Layout/Stack and Alignment` |
| Source | `../component-content.json#core-components-layout-stack-and-alignment` |

세로 콘텐츠 묶음, 줄바꿈 가능한 가로 태그 묶음, 양끝 정렬처럼 단순한 흐름을 구성할 때 적합합니다. 여러 열의 반응형 배치는 Grid나 Columns를, 페이지 전체 구획은 Page Structure를 사용하고 의미 없는 래퍼를 늘리지 마세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `gap` | `number \| string` | No | 갭. @default 10 |
| `align` | `React.CSSProperties['alignItems']` | No |  |
| `justify` | `React.CSSProperties['justifyContent']` | No |  |
| `children` | `React.ReactNode` | No |  |
| `size` | `number \| string` | No | 고정 크기(px/CSS). 생략하면 유연한 스페이서(flex:1). |
| `axis` | `'vertical' \| 'horizontal'` | No | 고정 크기의 축. @default "vertical" |
| `direction` | `'row' \| 'column'` | No |  |
| `gap` | `number \| string` | No | 갭(px 또는 CSS 길이). @default 16 |
| `align` | `React.CSSProperties['alignItems']` | No |  |
| `justify` | `React.CSSProperties['justifyContent']` | No |  |
| `wrap` | `boolean` | No |  |
| `as` | `React.ElementType` | No |  |
| `children` | `React.ReactNode` | No |  |

## Responsive

- direction row · column. gap — px/CSS. align / justify / wrap — 플렉스 컨트롤. as — 요소. 줄바꿈되는 칩 행에는 Cluster를 쓰세요.

## Related components

| Component | Relationship |
| --- | --- |
| `Cluster` | 같은 페이지가 소유 |
| `Spacer` | 같은 페이지가 소유 |
| `AspectRatio` | 대표 시나리오에서 조합 |
| `Center` | 대표 시나리오에서 조합 |
| `Col` | 대표 시나리오에서 조합 |
| `Columns` | 대표 시나리오에서 조합 |
| `Container` | 대표 시나리오에서 조합 |
| `Divider` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Stack gap={12}>…</Stack>
<Stack direction="row" gap={8} align="center" justify="space-between">…</Stack>
```

## Tokens and API

### Source contracts

- `components/layout/Cluster.jsx`
- `components/layout/Cluster.d.ts`
- `components/layout/Cluster.prompt.md`
- `components/layout/Spacer.jsx`
- `components/layout/Spacer.d.ts`
- `components/layout/Spacer.prompt.md`
- `components/layout/Stack.jsx`
- `components/layout/Stack.d.ts`
- `components/layout/Stack.prompt.md`
- `stories/LayoutStack.stories.jsx`

## Sources

- Stack prompt contract: `components/layout/Stack.prompt.md`
- Storybook implementation evidence: `stories/LayoutStack.stories.jsx`
