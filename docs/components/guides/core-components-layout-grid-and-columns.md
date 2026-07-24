# Grid and Columns

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Layout |
| Owner | `Grid` |
| Storybook | `LDS Core/Components/Layout/Grid and Columns` |
| Source | `../component-content.json#core-components-layout-grid-and-columns` |

주요·보조 영역의 비율이나 반복 카드의 최소 너비가 여러 화면 구간에서 유지되어야 할 때 적합합니다. 단순한 한 방향 간격에는 Grid를 사용하지 말고 Stack 또는 Cluster를 사용하세요.

## 사용 판단

### 사용

- 주요·보조 영역의 비율이나 반복 카드의 최소 너비가 여러 화면 구간에서 유지되어야 할 때 적합합니다. 단순한 한 방향 간격에는 Grid를 사용하지 말고 Stack 또는 Cluster를 사용하세요.
- Grid and Columns가 소유하는 Layout 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Grid API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- Grid and Columns가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Grid의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `span` | `number` | No | 기본(모바일) 폭에서 차지할 컬럼 수(1–12). @default 12 |
| `sm` | `number` | No | sm 브레이크포인트(≥768)부터 차지할 컬럼 수. |
| `md` | `number` | No | md 브레이크포인트(≥992)부터 차지할 컬럼 수. |
| `lg` | `number` | No | lg 브레이크포인트(≥1200)부터 차지할 컬럼 수. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `columns` | `number` | No | 나눌 그리드 트랙 수. @default 12 |
| `gap` | `number \| string` | No | 컬럼 & 행 갭 단축(숫자 = px). 기본값 --grid-gutter(20). |
| `columnGap` | `number \| string` | No | 컬럼 사이 가로 갭. |
| `rowGap` | `number \| string` | No | 줄바꿈된 행 사이 세로 갭. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `columns` | `number` | No | 고정 컬럼 수. |
| `minItemWidth` | `number \| string` | No | 반응형: auto-fill용 최소 트랙 폭(px 또는 CSS). |
| `gap` | `number \| string` | No | 갭. @default 20 |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- Grid의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Grid는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 제품 임계값 | 0개 내장. source/API에 없는 수치 정책은 제품 계층이 소유하고 컴포넌트에는 추가하지 않습니다. |

## Responsive

- columns — 고정 개수. minItemWidth — 반응형 auto-fill 트랙. gap — px/CSS.
- - columns — 고정 개수. minItemWidth — 반응형 auto-fill 트랙. gap — px/CSS.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 사용자에게 보이는 Grid and Columns 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Grid and Columns가 소유하는 Layout 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | Grid and Columns가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | 제품별 구현 대신 공개 Grid API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Grid의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Col` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Columns` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `AspectRatio` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Center` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Cluster` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Container` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Divider` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `MobileSystemBars` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Grid columns={3} gap={20}>…</Grid>
<Grid minItemWidth={240}>…</Grid>   {/* 반응형 auto-fill */}
```

## Tokens and API

### Tokens

- `No component-specific CSS custom property; Foundation semantic tokens apply.`

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Grid prompt contract: `components/layout/Grid.prompt.md`
- Storybook implementation evidence: `stories/LayoutGrid.stories.jsx`
