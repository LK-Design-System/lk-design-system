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

- Classification: LK Product Extension · Operations Dashboard. 루트 DESIGN.md의 Operations Dashboard 계약을 따르며 WDS의 새로운 Grid 축이나 별도 디자인 시스템이 아닙니다. 기존 Grid/Columns가 임의의 컬럼과 span을 제공하는 기반이라면, DashboardGrid는 운영 요약 카드 반복에 필요한 기본값만 고정합니다.

### 사용하지 않음

- gap — 기본 --grid-gutter. 카드는 표면·radius·내부 padding을 직접 소유하며 이 패턴은 테두리, 배경, 그림자를 추가하지 않습니다.
- 이 패턴은 동급인 반복 표면만 배치합니다. 모든 대시보드가 KPI부터 시작한다고 규정하지 않으며, 중요한 작업·주의 항목·분석 표면이 더 높은 위계를 가져야 하면 Columns/Col 또는 명시적인 section 조합을 사용합니다.
- 데이터 fetching, 카드 순서 저장, drag-and-drop 개인화, 권한 판정은 제품의 책임이며 이 패턴에는 포함하지 않습니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `minCardWidth` | `number \| string` | No | 카드 한 칸의 읽기 가능한 최소 폭. 숫자는 px로 해석합니다. @default 220 |
| `gap` | `number \| string` | No | 카드 사이 간격. @default "var(--grid-gutter)" |
| `fillLastRow` | `boolean` | No | 중간 폭에서 감긴 마지막 행의 카드가 남은 폭을 채우도록 확장합니다. 열 정렬이 필요한 스캔 비교보다 빈 트랙 제거가 중요할 때만 켭니다. @default false |
| `children` | `React.ReactNode` | No |  |

## Behavior and interaction

- 열 수나 카드 span을 고정해야 하는 분석 레이아웃은 Columns/Col, 일반 반복 목록은 Grid를 사용합니다.
- LK Web Viz — 고정 dashboard는 연결 상태와 메뉴 launcher가 중심이어서 KPI형 DashboardGrid는 not applicable입니다.
- LK Control Full Daedeok — 상태·차트·표의 비대칭 운영 화면이므로 동급 요약 카드에만 DashboardGrid를 사용하고 주요 monitoring 표면은 별도 layout 조합이 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | minCardWidth — 기본 220px. 트랙은 auto-fit과 min(100%, minCardWidth)를 사용해 320px 이하의 좁은 컨테이너에서도 가로 overflow를 만들지 않습니다. |
| 명시 규칙 2 | 유지한 차이는 auto-fill 대신 빈 트랙을 남기지 않는 auto-fit, 기본 최소 카드 폭 220px, 자식 min-width: 0뿐입니다. 이 차이는 반복 카드의 균등 확장과 좁은 폭 overflow 방지라는 기능적 이유로 유지합니다. |
| 명시 규칙 3 | Fluent Nav usage — 640px 이하에서 내비게이션 표면을 전환하는 원칙을 참고했지만, 카드 열 전환은 고정 breakpoint가 아니라 실제 사용 가능한 폭과 최소 카드 폭으로 결정합니다. |
| 명시 규칙 4 | DashboardGrid — 지표·요약·상태 카드를 읽기 가능한 최소 폭에 맞춰 자동 배치하는 LK Product 패턴입니다. |
| --grid-gutter | 20px |

## Responsive

- fillLastRow — 기본 false. 켜면 wrap 기반 배치로 전환되어, 중간 폭에서 마지막 행에 남은 카드가 빈 트랙을 남기지 않고 남은 폭을 나눠 채웁니다. 행마다 카드 폭이 달라질 수 있으므로 열 단위 수직 정렬로 값을 비교하는 화면에서는 끄고, 요약 카드 흐름에서 빈 공간 제거가 우선일 때만 사용합니다.
- fillLastRow를 켠 경우에만 wrap 배치로 전환해 마지막 행의 잔여 카드가 남은 폭을 채웁니다. 표면·간격·typography 계약은 동일하며 기본값은 기존 grid 동작 그대로입니다.
- Carbon UI shell usage — 셸과 본문을 분리하고 좁은 폭에서 탐색 구조를 전환합니다. DashboardGrid는 셸이 제공한 본문 폭 안에서만 반응합니다.

## Accessibility

- 카드의 typography, fill, divider, active/focus/disabled 표현은 카드 컴포넌트의 계약이며 DashboardGrid가 재정의하지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `MetricCard` | 대표 시나리오에서 조합 |
| `DashboardShell` | 대표 시나리오에서 조합 |
| `DockPanel` | 대표 시나리오에서 조합 |
| `PageHeader` | 대표 시나리오에서 조합 |
| `PrimaryDetail` | 대표 시나리오에서 조합 |

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

## Sources

- DashboardGrid prompt contract: `components/layout/DashboardGrid.prompt.md`
- Storybook implementation evidence: `stories/LayoutDashboardGrid.stories.jsx`
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/)
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
