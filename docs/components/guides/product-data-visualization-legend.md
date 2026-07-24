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

### 사용

- 맵·차트·다이어그램의 시각 인코딩을 명시적인 라벨과 값에 연결할 때 적합합니다. 항목 자체에 충분한 직접 라벨이 있거나 단순 상태 하나만 설명할 때는 별도 Legend 대신 인라인 라벨을 사용하세요.
- Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizontal/vertical layout, empty state, and no invented interaction state.
- shape는 dot, line, square만 사용합니다. line은 차트/경로 stroke를 설명할 때 쓰고, dashed는 예측값·검증 전 경로·비활성 레이어처럼 선 스타일 의미가 있을 때만 씁니다.
- - items {id?,label,color,shape,dashed,value,muted,disabled}[] · direction horizontal|vertical · size sm|md · emptyLabel. - Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizonta….

### 사용하지 않음

- Layer: LDS Product Data extension. Use it with charts, maps, and diagrams; do not claim a standalone WDS chart primitive parity surface.
- 두 상태는 대비 차이만으로 구분하지 않습니다(WCAG 1.4.1). disabled는 라벨에 취소선을 추가해 색이 아닌 형태 단서를 주고, 두 상태 모두 라벨 뒤에 숨김 텍스트(표시 꺼짐 / 강조 낮음)를 붙여 보조기술에도 전달합니다. 상태는 data-legend-state="disabled|muted", 라벨 요소는 data-legend-label로 노출됩니다.
- 항목은 role="listitem"이므로 aria-disabled를 붙이지 않습니다. ARIA 1.2에서 aria-disabled는 글로벌 상태가 아니고 listitem에서 지원되지 않아 무효 속성이 됩니다 — 위의 숨김 텍스트가 그 자리를 대신합니다.
- - items {id?,label,color,shape,dashed,value,muted,disabled}[] · direction horizontal|vertical · size sm|md · emptyLabel. - Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizonta….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Legend의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Items | items 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Empty Label | emptyLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `LegendItem[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `direction` | `'horizontal' \| 'vertical'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `emptyLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| emptyLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| 변형·상태 · 항목 없음 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 차트의 조밀한 배치 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizontal/vertical layout, empty state, and no invented interaction state.
- muted는 낮은 강조, disabled는 현재 꺼진 레이어나 표시 불가 상태입니다. 둘 다 label과 swatch를 낮은 대비로 처리하되 의미 색상 자체를 임의 색으로 바꾸지 않습니다.
- 두 상태는 대비 차이만으로 구분하지 않습니다(WCAG 1.4.1). disabled는 라벨에 취소선을 추가해 색이 아닌 형태 단서를 주고, 두 상태 모두 라벨 뒤에 숨김 텍스트(표시 꺼짐 / 강조 낮음)를 붙여 보조기술에도 전달합니다. 상태는 data-legend-state="disabled|muted", 라벨 요소는 data-legend-label로 노출됩니다.
- 항목은 role="listitem"이므로 aria-disabled를 붙이지 않습니다. ARIA 1.2에서 aria-disabled는 글로벌 상태가 아니고 listitem에서 지원되지 않아 무효 속성이 됩니다 — 위의 숨김 텍스트가 그 자리를 대신합니다.
- DS 관행: semantic color token 또는 시각화 팔레트 token을 넘기고, hardcoded hex는 피합니다. 텍스트는 label2/caption1, 값은 tabular nums, focus ring이나 interaction state는 만들지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 두 상태는 대비 차이만으로 구분하지 않습니다(WCAG 1.4.1). disabled는 라벨에 취소선을 추가해 색이 아닌 형태 단서를 주고, 두 상태 모두 라벨 뒤에 숨김 텍스트(표시 꺼짐 / 강조 낮음)를 붙여 보조기술에도 전달합니다. 상태는 data-legend-state="disabled\|muted", 라벨 요소는 data-legend-label로 노출됩니다. |
| 명시 규칙 2 | 항목은 role="listitem"이므로 aria-disabled를 붙이지 않습니다. ARIA 1.2에서 aria-disabled는 글로벌 상태가 아니고 listitem에서 지원되지 않아 무효 속성이 됩니다 — 위의 숨김 텍스트가 그 자리를 대신합니다. |
| 명시 규칙 3 | - items {id?,label,color,shape,dashed,value,muted,disabled}[] · direction horizontal\|vertical · size sm\|md · emptyLabel. - Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizonta… |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- items {id?,label,color,shape,dashed,value,muted,disabled}[] · direction horizontal|vertical · size sm|md · emptyLabel.
- Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizontal/vertical layout, empty state, and no invented interaction state.
- shape는 dot, line, square만 사용합니다. line은 차트/경로 stroke를 설명할 때 쓰고, dashed는 예측값·검증 전 경로·비활성 레이어처럼 선 스타일 의미가 있을 때만 씁니다.
- value는 카운트/비율 같은 보조 수치입니다. horizontal에서는 라벨 옆에, vertical에서는 오른쪽 컬럼에 정렬됩니다.

## Accessibility

- 두 상태는 대비 차이만으로 구분하지 않습니다(WCAG 1.4.1). disabled는 라벨에 취소선을 추가해 색이 아닌 형태 단서를 주고, 두 상태 모두 라벨 뒤에 숨김 텍스트(표시 꺼짐 / 강조 낮음)를 붙여 보조기술에도 전달합니다. 상태는 data-legend-state="disabled|muted", 라벨 요소는 data-legend-label로 노출됩니다.
- 항목은 role="listitem"이므로 aria-disabled를 붙이지 않습니다. ARIA 1.2에서 aria-disabled는 글로벌 상태가 아니고 listitem에서 지원되지 않아 무효 속성이 됩니다 — 위의 숨김 텍스트가 그 자리를 대신합니다.
- DS 관행: semantic color token 또는 시각화 팔레트 token을 넘기고, hardcoded hex는 피합니다. 텍스트는 label2/caption1, 값은 tabular nums, focus ring이나 interaction state는 만들지 않습니다.
- - items {id?,label,color,shape,dashed,value,muted,disabled}[] · direction horizontal|vertical · size sm|md · emptyLabel. - Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizonta….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Compare against common legend expectations before changing it: stable item identity, label and optional value, swatch shape that matches the represented mark, muted/disabled distinction, horizontal/vertical layout, empty state, and no invented interaction state. |
| Don't | Layer: LDS Product Data extension. Use it with charts, maps, and diagrams; do not claim a standalone WDS chart primitive parity surface. |
| Do | shape는 dot, line, square만 사용합니다. line은 차트/경로 stroke를 설명할 때 쓰고, dashed는 예측값·검증 전 경로·비활성 레이어처럼 선 스타일 의미가 있을 때만 씁니다. |
| Don't | 두 상태는 대비 차이만으로 구분하지 않습니다(WCAG 1.4.1). disabled는 라벨에 취소선을 추가해 색이 아닌 형태 단서를 주고, 두 상태 모두 라벨 뒤에 숨김 텍스트(표시 꺼짐 / 강조 낮음)를 붙여 보조기술에도 전달합니다. 상태는 data-legend-state="disabled\|muted", 라벨 요소는 data-legend-label로 노출됩니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Legend의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AnnotatedImage` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BarChart` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Calendar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ChartFrame` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Carousel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataToolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DataExportAction` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/data/Legend.jsx`
- `components/data/Legend.d.ts`
- `components/data/Legend.prompt.md`
- `stories/DataLegend.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Legend prompt contract: `components/data/Legend.prompt.md`
- Storybook implementation evidence: `stories/DataLegend.stories.jsx`
