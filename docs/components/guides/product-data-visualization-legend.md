# Legend

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Visualization |
| Owner | `Legend` |
| Storybook | `LDS Product/Data/Visualization/Legend` |
| Source | `../component-content.json#product-data-visualization-legend` |

맵·차트·다이어그램의 시각 인코딩을 명시적인 라벨과 값에 연결할 때 적합합니다. 항목 자체에 충분한 직접 라벨이 있거나 단순 상태 하나만 설명할 때는 별도 Legend 대신 인라인 라벨을 사용하세요.

## 사용 판단

### 사용하지 않음

- Layer: LDS Product Data extension. Use it with charts, maps, and diagrams; do not claim a standalone WDS chart primitive parity surface.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `LegendItem[]` | No |  |
| `direction` | `'horizontal' \| 'vertical'` | No |  |
| `size` | `'sm' \| 'md'` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |

## Behavior and interaction

- Legend — 맵·차트·다이어그램용 색상 키(스와치 + 라벨 + 선택적 값). 새 chart primitive가 아니라 데이터 시각화 컴포넌트 옆에 붙는 설명 패턴입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 두 상태는 대비 차이만으로 구분하지 않습니다(WCAG 1.4.1). disabled는 라벨에 취소선을 추가해 색이 아닌 형태 단서를 주고, 두 상태 모두 라벨 뒤에 숨김 텍스트(표시 꺼짐 / 강조 낮음)를 붙여 보조기술에도 전달합니다. 상태는 data-legend-state="disabled\|muted", 라벨 요소는 data-legend-label로 노출됩니다. |
| 명시 규칙 2 | 항목은 role="listitem"이므로 aria-disabled를 붙이지 않습니다. ARIA 1.2에서 aria-disabled는 글로벌 상태가 아니고 listitem에서 지원되지 않아 무효 속성이 됩니다 — 위의 숨김 텍스트가 그 자리를 대신합니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |

## Content and writing

- items {id?,label,color,shape,dashed,value,muted,disabled}[] · direction horizontal|vertical · size sm|md · emptyLabel.
- Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizontal/vertical layout, empty state, and no invented interaction state.
- shape는 dot, line, square만 사용합니다. line은 차트/경로 stroke를 설명할 때 쓰고, dashed는 예측값·검증 전 경로·비활성 레이어처럼 선 스타일 의미가 있을 때만 씁니다.
- value는 카운트/비율 같은 보조 수치입니다. horizontal에서는 라벨 옆에, vertical에서는 오른쪽 컬럼에 정렬됩니다.

## Accessibility

- DS 관행: semantic color token 또는 시각화 팔레트 token을 넘기고, hardcoded hex는 피합니다. 텍스트는 label2/caption1, 값은 tabular nums, focus ring이나 interaction state는 만들지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 조합 |
| `BarChart` | 대표 시나리오에서 조합 |
| `Calendar` | 대표 시나리오에서 조합 |
| `ChartFrame` | 대표 시나리오에서 조합 |
| `Carousel` | 대표 시나리오에서 조합 |
| `DataGrid` | 대표 시나리오에서 조합 |
| `DataToolbar` | 대표 시나리오에서 조합 |
| `DataExportAction` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Legend items={[
  { label: '가용', color: 'var(--color-semantic-status-positive)', shape: 'dot' },
  { label: '검증 경로', color: 'var(--color-semantic-primary-normal)', shape: 'line', dashed: true },
]} />
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--font-sans`
- `--fw-medium`
- `--label2-line`
- `--label2-size`
- `--space-1`
- `--space-1-5`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/data/Legend.jsx`
- `components/data/Legend.d.ts`
- `components/data/Legend.prompt.md`
- `stories/DataLegend.stories.jsx`

## Sources

- Legend prompt contract: `components/data/Legend.prompt.md`
- Storybook implementation evidence: `stories/DataLegend.stories.jsx`
