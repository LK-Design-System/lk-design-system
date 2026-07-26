# Grid and Columns

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `Grid` |
| Storybook | `LDS Core/Components/Layout/Grid and Columns` |
| Source | `../component-content.json#core-components-layout-grid-and-columns` |

주요·보조 영역의 비율이나 반복 카드의 최소 너비가 여러 화면 구간에서 유지되어야 할 때 적합합니다. 단순한 한 방향 간격에는 Grid를 사용하지 말고 Stack 또는 Cluster를 사용하세요.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `span` | `number` | No | 기본(모바일) 폭에서 차지할 컬럼 수(1–12). @default 12 |
| `sm` | `number` | No | sm 브레이크포인트(≥768)부터 차지할 컬럼 수. |
| `md` | `number` | No | md 브레이크포인트(≥992)부터 차지할 컬럼 수. |
| `lg` | `number` | No | lg 브레이크포인트(≥1200)부터 차지할 컬럼 수. |
| `children` | `React.ReactNode` | No |  |
| `columns` | `number` | No | 나눌 그리드 트랙 수. @default 12 |
| `gap` | `number \| string` | No | 컬럼 & 행 갭 단축(숫자 = px). 기본값 --grid-gutter(20). |
| `columnGap` | `number \| string` | No | 컬럼 사이 가로 갭. |
| `rowGap` | `number \| string` | No | 줄바꿈된 행 사이 세로 갭. |
| `children` | `React.ReactNode` | No |  |
| `columns` | `number` | No | 고정 컬럼 수. |
| `minItemWidth` | `number \| string` | No | 반응형: auto-fill용 최소 트랙 폭(px 또는 CSS). |
| `gap` | `number \| string` | No | 갭. @default 20 |
| `children` | `React.ReactNode` | No |  |

## Responsive

- columns — 고정 개수. minItemWidth — 반응형 auto-fill 트랙. gap — px/CSS.

## Related components

| Component | Relationship |
| --- | --- |
| `Col` | 같은 페이지가 소유 |
| `Columns` | 같은 페이지가 소유 |
| `AspectRatio` | 대표 시나리오에서 조합 |
| `Center` | 대표 시나리오에서 조합 |
| `Cluster` | 대표 시나리오에서 조합 |
| `Container` | 대표 시나리오에서 조합 |
| `Divider` | 대표 시나리오에서 조합 |
| `MobileSystemBars` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Grid columns={3} gap={20}>…</Grid>
<Grid minItemWidth={240}>…</Grid>   {/* 반응형 auto-fill */}
```

## Tokens and API

### Source contracts

- `components/layout/Col.jsx`
- `components/layout/Col.d.ts`
- `components/layout/Col.prompt.md`
- `components/layout/Columns.jsx`
- `components/layout/Columns.d.ts`
- `components/layout/Columns.prompt.md`
- `components/layout/Grid.jsx`
- `components/layout/Grid.d.ts`
- `components/layout/Grid.prompt.md`
- `stories/LayoutGrid.stories.jsx`

## Sources

- Grid prompt contract: `components/layout/Grid.prompt.md`
- Storybook implementation evidence: `stories/LayoutGrid.stories.jsx`
