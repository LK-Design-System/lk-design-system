# Dashboard Grid

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Operations Dashboard |
| Owner | `DashboardGrid` |
| Storybook | `LDS Product/Operations Dashboard/Dashboard Grid` |
| Source | `../component-content.json#product-operations-dashboard-dashboard-grid` |

DashboardGrid는 동급인 요약 카드의 최소 폭과 간격만 관리합니다. 중요도가 다른 분석 표면이나 고정 span이 필요하면 Columns/Col을 사용하고, 표면·상태·본문 위계는 실제 카드 컴포넌트가 소유합니다.

## 사용 판단

### 사용

- DashboardGrid는 동급인 요약 카드의 최소 폭과 간격만 관리합니다. 중요도가 다른 분석 표면이나 고정 span이 필요하면 Columns/Col을 사용하고, 표면·상태·본문 위계는 실제 카드 컴포넌트가 소유합니다.
- minCardWidth — 기본 220px. 트랙은 auto-fit과 min(100%, minCardWidth)를 사용해 320px 이하의 좁은 컨테이너에서도 가로 overflow를 만들지 않습니다.
- fillLastRow — 기본 false. 켜면 wrap 기반 배치로 전환되어, 중간 폭에서 마지막 행에 남은 카드가 빈 트랙을 남기지 않고 남은 폭을 나눠 채웁니다. 행마다 카드 폭이 달라질 수 있으므로 열 단위 수직 정렬로 값을 비교하는 화면에서는 끄고, 요약 카드 흐름에서 빈 공간 제거가 우선일 때만 사용합니다.
- 열 수나 카드 span을 고정해야 하는 분석 레이아웃은 Columns/Col, 일반 반복 목록은 Grid를 사용합니다.

### 사용하지 않음

- gap — 기본 --grid-gutter. 카드는 표면·radius·내부 padding을 직접 소유하며 이 패턴은 테두리, 배경, 그림자를 추가하지 않습니다.
- 이 패턴은 동급인 반복 표면만 배치합니다. 모든 대시보드가 KPI부터 시작한다고 규정하지 않으며, 중요한 작업·주의 항목·분석 표면이 더 높은 위계를 가져야 하면 Columns/Col 또는 명시적인 section 조합을 사용합니다.
- 유지한 차이는 auto-fill 대신 빈 트랙을 남기지 않는 auto-fit, 기본 최소 카드 폭 220px, 자식 min-width: 0뿐입니다. 이 차이는 반복 카드의 균등 확장과 좁은 폭 overflow 방지라는 기능적 이유로 유지합니다.
- 카드의 typography, fill, divider, active/focus/disabled 표현은 카드 컴포넌트의 계약이며 DashboardGrid가 재정의하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | DashboardGrid의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `minCardWidth` | `number \| string` | No | 카드 한 칸의 읽기 가능한 최소 폭. 숫자는 px로 해석합니다. @default 220 |
| `gap` | `number \| string` | No | 카드 사이 간격. @default "var(--grid-gutter)" |
| `fillLastRow` | `boolean` | No | 중간 폭에서 감긴 마지막 행의 카드가 남은 폭을 채우도록 확장합니다. 열 정렬이 필요한 스캔 비교보다 빈 트랙 제거가 중요할 때만 켭니다. @default false |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- fillLastRow — 기본 false. 켜면 wrap 기반 배치로 전환되어, 중간 폭에서 마지막 행에 남은 카드가 빈 트랙을 남기지 않고 남은 폭을 나눠 채웁니다. 행마다 카드 폭이 달라질 수 있으므로 열 단위 수직 정렬로 값을 비교하는 화면에서는 끄고, 요약 카드 흐름에서 빈 공간 제거가 우선일 때만 사용합니다.
- 열 수나 카드 span을 고정해야 하는 분석 레이아웃은 Columns/Col, 일반 반복 목록은 Grid를 사용합니다.
- fillLastRow를 켠 경우에만 wrap 배치로 전환해 마지막 행의 잔여 카드가 남은 폭을 채웁니다. 표면·간격·typography 계약은 동일하며 기본값은 기존 grid 동작 그대로입니다.
- 카드의 typography, fill, divider, active/focus/disabled 표현은 카드 컴포넌트의 계약이며 DashboardGrid가 재정의하지 않습니다.
- Fluent Nav usage — 640px 이하에서 내비게이션 표면을 전환하는 원칙을 참고했지만, 카드 열 전환은 고정 breakpoint가 아니라 실제 사용 가능한 폭과 최소 카드 폭으로 결정합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | minCardWidth — 기본 220px. 트랙은 auto-fit과 min(100%, minCardWidth)를 사용해 320px 이하의 좁은 컨테이너에서도 가로 overflow를 만들지 않습니다. |
| 명시 규칙 2 | 유지한 차이는 auto-fill 대신 빈 트랙을 남기지 않는 auto-fit, 기본 최소 카드 폭 220px, 자식 min-width: 0뿐입니다. 이 차이는 반복 카드의 균등 확장과 좁은 폭 overflow 방지라는 기능적 이유로 유지합니다. |
| 명시 규칙 3 | Fluent Nav usage — 640px 이하에서 내비게이션 표면을 전환하는 원칙을 참고했지만, 카드 열 전환은 고정 breakpoint가 아니라 실제 사용 가능한 폭과 최소 카드 폭으로 결정합니다. |
| 명시 규칙 4 | DashboardGrid — 지표·요약·상태 카드를 읽기 가능한 최소 폭에 맞춰 자동 배치하는 LK Product 패턴입니다. |
| --grid-gutter | 20px |

## Responsive

- minCardWidth — 기본 220px. 트랙은 auto-fit과 min(100%, minCardWidth)를 사용해 320px 이하의 좁은 컨테이너에서도 가로 overflow를 만들지 않습니다.
- fillLastRow — 기본 false. 켜면 wrap 기반 배치로 전환되어, 중간 폭에서 마지막 행에 남은 카드가 빈 트랙을 남기지 않고 남은 폭을 나눠 채웁니다. 행마다 카드 폭이 달라질 수 있으므로 열 단위 수직 정렬로 값을 비교하는 화면에서는 끄고, 요약 카드 흐름에서 빈 공간 제거가 우선일 때만 사용합니다.
- 유지한 차이는 auto-fill 대신 빈 트랙을 남기지 않는 auto-fit, 기본 최소 카드 폭 220px, 자식 min-width: 0뿐입니다. 이 차이는 반복 카드의 균등 확장과 좁은 폭 overflow 방지라는 기능적 이유로 유지합니다.
- fillLastRow를 켠 경우에만 wrap 배치로 전환해 마지막 행의 잔여 카드가 남은 폭을 채웁니다. 표면·간격·typography 계약은 동일하며 기본값은 기존 grid 동작 그대로입니다.

## Content and writing

- LK Context Hub — 프로젝트/attention landing의 Card/DataGrid 반복은 supported by composition이지만 route·query·권한과 카드 우선순위는 제품이 소유합니다.
- - LK Web Viz — 고정 dashboard는 연결 상태와 메뉴 launcher가 중심이어서 KPI형 DashboardGrid는 not applicable입니다. - LK Control Full Daedeok — 상태·차트·표의 비대칭 운영 화면이므로 동급 요약 카드에만 DashboardGrid를 사용하고 주요 monitoring 표면은 별도 layout 조합이 소유합니다. - LK Context Hub — 프로젝트/attention landing의 Card/DataGrid 반복은 supported by composition이지만 route·query·권한과….
- 사용자에게 보이는 Dashboard Grid 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- 카드의 typography, fill, divider, active/focus/disabled 표현은 카드 컴포넌트의 계약이며 DashboardGrid가 재정의하지 않습니다.
- - Grid와 동일하게 display: grid, 무표면, 무테두리, 무radius이며 간격은 --grid-gutter를 그대로 씁니다. - 유지한 차이는 auto-fill 대신 빈 트랙을 남기지 않는 auto-fit, 기본 최소 카드 폭 220px, 자식 min-width: 0뿐입니다. 이 차이는 반복 카드의 균등 확장과 좁은 폭 overflow 방지라는 기능적 이유로 유지합니다. - fillLastRow를 켠 경우에만 wrap 배치로 전환해 마지막 행의 잔여 카드가 남은 폭을 채웁니다. 표면·간격·typography 계약은 동일하며 기본값은 기존 grid 동작….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | minCardWidth — 기본 220px. 트랙은 auto-fit과 min(100%, minCardWidth)를 사용해 320px 이하의 좁은 컨테이너에서도 가로 overflow를 만들지 않습니다. |
| Don't | gap — 기본 --grid-gutter. 카드는 표면·radius·내부 padding을 직접 소유하며 이 패턴은 테두리, 배경, 그림자를 추가하지 않습니다. |
| Do | fillLastRow — 기본 false. 켜면 wrap 기반 배치로 전환되어, 중간 폭에서 마지막 행에 남은 카드가 빈 트랙을 남기지 않고 남은 폭을 나눠 채웁니다. 행마다 카드 폭이 달라질 수 있으므로 열 단위 수직 정렬로 값을 비교하는 화면에서는 끄고, 요약 카드 흐름에서 빈 공간 제거가 우선일 때만 사용합니다. |
| Don't | 이 패턴은 동급인 반복 표면만 배치합니다. 모든 대시보드가 KPI부터 시작한다고 규정하지 않으며, 중요한 작업·주의 항목·분석 표면이 더 높은 위계를 가져야 하면 Columns/Col 또는 명시적인 section 조합을 사용합니다. |

## Exceptions

- fillLastRow를 켠 경우에만 wrap 배치로 전환해 마지막 행의 잔여 카드가 남은 폭을 채웁니다. 표면·간격·typography 계약은 동일하며 기본값은 기존 grid 동작 그대로입니다.
- - Grid와 동일하게 display: grid, 무표면, 무테두리, 무radius이며 간격은 --grid-gutter를 그대로 씁니다. - 유지한 차이는 auto-fill 대신 빈 트랙을 남기지 않는 auto-fit, 기본 최소 카드 폭 220px, 자식 min-width: 0뿐입니다. 이 차이는 반복 카드의 균등 확장과 좁은 폭 overflow 방지라는 기능적 이유로 유지합니다. - fillLastRow를 켠 경우에만 wrap 배치로 전환해 마지막 행의 잔여 카드가 남은 폭을 채웁니다. 표면·간격·typography 계약은 동일하며 기본값은 기존 grid 동작….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 DashboardGrid의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `MetricCard` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DashboardShell` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DockPanel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PageHeader` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PrimaryDetail` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<DashboardGrid minCardWidth={220}>
  <MetricCard label="가동 로봇" value={24} />
  <MetricCard label="대기 작업" value={7} />
</DashboardGrid>
```

## Tokens and API

### Tokens

- `--dashboard-grid-min-card-width`
- `--grid-gutter`

### Source contracts

- `components/layout/DashboardGrid.jsx`
- `components/layout/DashboardGrid.d.ts`
- `components/layout/DashboardGrid.prompt.md`
- `stories/LayoutDashboardGrid.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- DashboardGrid prompt contract: `components/layout/DashboardGrid.prompt.md`
- Storybook implementation evidence: `stories/LayoutDashboardGrid.stories.jsx`
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/)
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
