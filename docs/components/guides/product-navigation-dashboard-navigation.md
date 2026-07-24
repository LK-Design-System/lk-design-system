# Dashboard Navigation

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `DashboardShell` |
| Storybook | `LDS Product/Navigation/Dashboard Navigation` |
| Source | `../component-content.json#product-navigation-dashboard-navigation` |

DashboardShell — 제품 대시보드의 상단 바, 넓은 화면 탐색, 본문, 좁은 화면 탐색을 한 개의 landmark·반응형 계약으로 조합합니다.

## 사용 판단

### 사용

- DashboardShell — 제품 대시보드의 상단 바, 넓은 화면 탐색, 본문, 좁은 화면 탐색을 한 개의 landmark·반응형 계약으로 조합합니다.
- header는 자체 header/banner landmark를 소유해야 하며 LDS에서는 TopBar를 사용합니다. 셸이 다시 로 감싸지 않아 중첩 landmark를 만들지 않습니다.
- navigation과 narrowNavigation은 자체 를 소유하는 SideNav/NavRail과 BottomNav를 전달합니다. 소비자가 이름을 주지 않으면 셸이 주 탐색을 제공합니다.
- narrowNavigation을 생략해도 layout="auto"가 기존 navigation을 숨기지 않습니다. 좁은 화면에서는 wide navigation을 본문 앞 한 행에 유지해 탐색이 조용히 사라지는 실패를 막습니다. 최적화된 모바일 표현이 필요하면 BottomNav를 명시합니다.

### 사용하지 않음

- 좁은 탐색 래퍼는 하단 safe area를 적용합니다. BottomNav 자체는 고정 위치나 safe area를 소유하지 않습니다.
- 셸 자체는 카드, edge line, inset border, radius, shadow를 추가하지 않습니다. 배경은 기존 페이지 canvas 토큰만 사용합니다.
- UserMenu는 SideNav footer 계약을 기본으로 합니다. 같은 브랜드·목적지·계정을 TopBar와 SideNav에 반복하지 않습니다.
- 세 고정 소스에서 공통 KPI 요구는 확인되지 않았습니다. DashboardShell은 MetricCard-first 화면을 규정하지 않고 제품이 중요도를 정한 실제 컴포넌트 조합만 수용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | DashboardShell의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Header | header/banner landmark를 소유하는 상단 슬롯. LDS에서는 TopBar를 권장합니다. |
| Navigation | 넓은 화면의 navigation landmark 슬롯. SideNav 또는 NavRail을 사용합니다. |
| Narrow Navigation | 좁은 화면의 navigation landmark 슬롯. BottomNav를 사용합니다. 생략하면 navigation이 좁은 화면에서 본문 앞에 유지됩니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Topology | header-first는 전폭 header 아래에 탐색을 두고, side-first는 넓은 화면에서 탐색을 전체 높이의 첫 열에 둡니다. @default "header-first" |
| Main Label | main landmark의 접근 가능한 이름. |
| Skip Label | 첫 focus 대상인 건너뛰기 링크 문구. @default "본문으로 건너뛰기" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `header` | `React.ReactNode` | No | header/banner landmark를 소유하는 상단 슬롯. LDS에서는 TopBar를 권장합니다. |
| `navigation` | `React.ReactNode` | No | 넓은 화면의 navigation landmark 슬롯. SideNav 또는 NavRail을 사용합니다. |
| `narrowNavigation` | `React.ReactNode` | No | 좁은 화면의 navigation landmark 슬롯. BottomNav를 사용합니다. 생략하면 navigation이 좁은 화면에서 본문 앞에 유지됩니다. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `layout` | `'auto' \| 'wide' \| 'narrow'` | No | auto는 768px 미만에서 좁은 구성을 사용합니다. @default "auto" |
| `topology` | `'header-first' \| 'side-first'` | No | header-first는 전폭 header 아래에 탐색을 두고, side-first는 넓은 화면에서 탐색을 전체 높이의 첫 열에 둡니다. @default "header-first" |
| `mainId` | `string` | No | main landmark id. 생략하면 인스턴스별 id를 생성합니다. |
| `mainLabel` | `string` | No | main landmark의 접근 가능한 이름. |
| `mainClassName` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `mainStyle` | `React.CSSProperties` | No | 공개 타입 계약에 정의된 속성입니다. |
| `skipLabel` | `string` | No | 첫 focus 대상인 건너뛰기 링크 문구. @default "본문으로 건너뛰기" |
| `navigationLabel` | `string` | No | 넓은 화면 navigation의 기본 접근 가능한 이름. @default "주 탐색" |
| `narrowNavigationLabel` | `string` | No | 좁은 화면 navigation의 기본 접근 가능한 이름. @default "주 탐색" |

## States

| State | Contract |
| --- | --- |
| 변형·상태 · 탑바 접기 토글 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 변형·상태 · 호버 확장 레일 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 320px 전환 결정 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- 의미·키보드 순서는 본문 건너뛰기 → header/banner → 넓은 주 탐색 → main → 좁은 주 탐색입니다. CSS로 숨겨진 탐색 슬롯은 접근성 트리에서도 제외됩니다.
- layout — auto는 LDS의 sm=768px 아래에서 좁은 구성을 사용합니다. Storybook과 테스트에서는 wide/narrow로 상태를 결정적으로 고정할 수 있습니다.
- topology — 기본 header-first는 전폭 header 아래에 navigation과 main을 둬 기존 소비자와 Web Viz·Control 계열 셸을 유지합니다. side-first는 넓은 화면에서 navigation을 전체 높이 첫 열에, utility header와 main을 둘째 열에 둡니다. 좁은 화면에서는 두 토폴로지 모두 같은 단일 열·하단 탐색 계약으로 수렴합니다.
- main은 하나만 렌더링하고 tabIndex={-1}과 안정적인 id를 가져 skip link의 실제 focus 목적지가 됩니다. mainLabel은 같은 문서에 여러 셸이 있는 검증 fixture에서만 명시합니다.
- TopBar, SideNav, NavRail, BottomNav의 control/icon 크기, typography, radius, border, fill, active/focus/disabled 처리를 그대로 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | layout — auto는 LDS의 sm=768px 아래에서 좁은 구성을 사용합니다. Storybook과 테스트에서는 wide/narrow로 상태를 결정적으로 고정할 수 있습니다. |
| 명시 규칙 2 | main은 하나만 렌더링하고 tabIndex={-1}과 안정적인 id를 가져 skip link의 실제 focus 목적지가 됩니다. mainLabel은 같은 문서에 여러 셸이 있는 검증 fixture에서만 명시합니다. |
| 명시 규칙 3 | 넓은 구성은 auto + minmax(0, 1fr), 좁은 구성은 단일 본문 열과 하단 탐색 행입니다. 이 배치 차이는 탐색 공간을 확보하기 위한 기능적 차이이며 새로운 장식 언어가 아닙니다. |
| 명시 규칙 4 | Container의 page margin과 최대 폭, PageHeader의 본문 위계, DashboardGrid의 카드 간격은 각각 해당 컴포넌트가 소유합니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 의미·키보드 순서는 본문 건너뛰기 → header/banner → 넓은 주 탐색 → main → 좁은 주 탐색입니다. CSS로 숨겨진 탐색 슬롯은 접근성 트리에서도 제외됩니다.
- navigation과 narrowNavigation은 자체 를 소유하는 SideNav/NavRail과 BottomNav를 전달합니다. 소비자가 이름을 주지 않으면 셸이 주 탐색을 제공합니다.
- narrowNavigation을 생략해도 layout="auto"가 기존 navigation을 숨기지 않습니다. 좁은 화면에서는 wide navigation을 본문 앞 한 행에 유지해 탐색이 조용히 사라지는 실패를 막습니다. 최적화된 모바일 표현이 필요하면 BottomNav를 명시합니다.
- layout — auto는 LDS의 sm=768px 아래에서 좁은 구성을 사용합니다. Storybook과 테스트에서는 wide/narrow로 상태를 결정적으로 고정할 수 있습니다.

## Content and writing

- navigation과 narrowNavigation은 자체 를 소유하는 SideNav/NavRail과 BottomNav를 전달합니다. 소비자가 이름을 주지 않으면 셸이 주 탐색을 제공합니다.
- main은 하나만 렌더링하고 tabIndex={-1}과 안정적인 id를 가져 skip link의 실제 focus 목적지가 됩니다. mainLabel은 같은 문서에 여러 셸이 있는 검증 fixture에서만 명시합니다.
- 건너뛰기 링크의 테두리는 primary 색으로 focus 위치를 알리고, 문구는 semantic label 색을 사용해 밝은·어두운 셸 배경 모두에서 본문 텍스트 대비를 유지합니다.
- header-first: TopBar가 실제 LK Lockup과 제품 이름을 소유하고 SideNav는 로컬 목적지만 제공합니다.

## Accessibility

- 의미·키보드 순서는 본문 건너뛰기 → header/banner → 넓은 주 탐색 → main → 좁은 주 탐색입니다. CSS로 숨겨진 탐색 슬롯은 접근성 트리에서도 제외됩니다.
- main은 하나만 렌더링하고 tabIndex={-1}과 안정적인 id를 가져 skip link의 실제 focus 목적지가 됩니다. mainLabel은 같은 문서에 여러 셸이 있는 검증 fixture에서만 명시합니다.
- TopBar, SideNav, NavRail, BottomNav의 control/icon 크기, typography, radius, border, fill, active/focus/disabled 처리를 그대로 유지합니다.
- 건너뛰기 링크의 테두리는 primary 색으로 focus 위치를 알리고, 문구는 semantic label 색을 사용해 밝은·어두운 셸 배경 모두에서 본문 텍스트 대비를 유지합니다.
- Carbon UI shell accessibility — 첫 keyboard 항목으로 skip-to-main을 제공하고 native header 구조를 사용합니다. LDS도 보이는 focus skip link와 실제 focus 가능한 main 목적지를 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | header는 자체 header/banner landmark를 소유해야 하며 LDS에서는 TopBar를 사용합니다. 셸이 다시 로 감싸지 않아 중첩 landmark를 만들지 않습니다. |
| Don't | 좁은 탐색 래퍼는 하단 safe area를 적용합니다. BottomNav 자체는 고정 위치나 safe area를 소유하지 않습니다. |
| Do | navigation과 narrowNavigation은 자체 를 소유하는 SideNav/NavRail과 BottomNav를 전달합니다. 소비자가 이름을 주지 않으면 셸이 주 탐색을 제공합니다. |
| Don't | 셸 자체는 카드, edge line, inset border, radius, shadow를 추가하지 않습니다. 배경은 기존 페이지 canvas 토큰만 사용합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 DashboardShell의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BottomNav` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Lockup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SideNav` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TopBar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DashboardGrid` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DockPanel` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<DashboardShell
  topology="side-first"
  header={<TopBar brand="대덕 운영" actions={<GlobalActions />} />}
  navigation={(
    <SideNav
      surface="docked"
      header={<Lockup />}
      footer={<UserMenu />}
      items={items}
    />
  )}
  narrowNavigation={<BottomNav items={compactItems} />}
>
  <Container size="wide">…</Container>
</DashboardShell>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-normal`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--control-h-sm`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--label1-size`
- `--mobile-safe-area-bottom`
- `--radius-md`
- `--shadow-md`
- `--space-3`
- `--space-6`

### Source contracts

- `components/layout/DashboardShell.jsx`
- `components/layout/DashboardShell.d.ts`
- `components/layout/DashboardShell.prompt.md`
- `stories/NavigationDashboard.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- DashboardShell prompt contract: `components/layout/DashboardShell.prompt.md`
- Storybook implementation evidence: `stories/NavigationDashboard.stories.jsx`
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/)
- [Carbon UI shell accessibility](https://carbondesignsystem.com/components/UI-shell-header/accessibility/)
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
