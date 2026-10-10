# Dashboard Navigation

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `DashboardShell` |
| Storybook | `LDS Product/Navigation/Dashboard Navigation` |
| Source | `../component-content.json#product-navigation-dashboard-navigation` |

탐색 전환이 잦고 본문 최소 폭이 남는 넓은 화면에서는 고정 폭 사이드 탐색을 사용합니다. 가용 폭이 줄면 호버 확장 레일로 본문 폭을 돌려주고, 좁은 화면에서는 같은 최상위 목적지를 하단 탐색으로 전환합니다. 셸 전체는 Dashboard Shell, 개별 동작은 각 탐색 컴포넌트가 소유합니다.

## 사용 판단

### 사용

- header는 자체 header/banner landmark를 소유해야 하며 LDS에서는 TopBar를 사용합니다. 셸이 다시 로 감싸지 않아 중첩 landmark를 만들지 않습니다.
- WAI-ARIA APG Modal Dialog Pattern — modal 배경은 inert이고, Tab/Shift+Tab은 dialog 안에 머물며 Escape와 호출 지점 복원을 제공해야 합니다. temporary navigation은 이 책임을 제품별 scrim 코드가 아니라 공용 Drawer 엔진에서 상속합니다.
- 의도적 제외: 라우터 인스턴스, 인증·권한 판정, drawer open state의 저장, URL 동기화, 데이터 새로고침, 사용자별 셸 저장은 제품이 소유합니다. DashboardShell은 슬롯 배치와 landmark, skip link, 반응형 전환, temporary Drawer의 modal coordination만 소유합니다.

### 사용하지 않음

- 공존 규칙: 같은 목적지 층을 NavRail과 SideNav로 중복하지 않는다는 원칙은 유지됩니다. rail-panel은 레일(영역)과 패널(영역 안 목록)이 다른 층이라 허용합니다.
- 외부 근거: Material NavigationRail(3–7개, 로고 header)·NavigationDrawer(모바일 modal 드로어), Fluent 2 Nav(아이콘 전용 배치 미지원, 640px 이하 overlay), Carbon UI shell left panel(보조 항목 5개 초과 시 패널, 세 단계 금지), Atlassian navigation system layout(슬롯 순서가 Tab·낭독 순서, 1024px 이하 panel overlay), WAI-ARIA APG landmarks. 제품 참고(근거 아님): ChatGPT 레일 + 대화 패널.
- 셸 자체는 카드, edge line, inset border, radius, shadow를 추가하지 않습니다. 배경은 기존 페이지 canvas 토큰만 사용합니다.
- 넓은 구성은 auto + minmax(0, 1fr), 좁은 구성은 단일 본문 열과 선택적인 하단 탐색 행입니다. temporary navigation은 문서 흐름을 차지하지 않고 왼쪽 edge의 기존 Drawer 표면을 사용합니다. 이 배치 차이는 탐색 공간을 확보하기 위한 기능적 차이이며 새로운 장식 언어가 아닙니다.

## Anatomy

| Part | Contract |
| --- | --- |
| header | header/banner landmark를 소유하는 상단 슬롯. LDS에서는 TopBar를 권장합니다. |
| navigation | 넓은 화면의 navigation landmark 슬롯. SideNav 또는 NavRail을 사용합니다. |
| narrowNavigation | 좁은 화면의 navigation landmark 슬롯. BottomNav를 사용합니다. 생략하면 navigation이 좁은 화면에서 본문 앞에 유지됩니다. |
| temporaryNavigation | 좁은 화면에서 modal Drawer로 표시할 계층형 탐색 슬롯. 제공하면 좁은 화면에서 넓은 navigation은 숨고 본문은 그대로 유지됩니다. |
| temporaryNavigationOpen | temporaryNavigation Drawer의 제품 소유 열린 상태. 넓은 화면에서는 렌더되지 않습니다. @default false |
| onTemporaryNavigationClose | Escape, scrim, 닫기 버튼 또는 narrow→wide 전환으로 temporaryNavigation을 닫아 달라는 요청. 부모는 열린 상태를 false로 갱신합니다. |
| temporaryNavigationId | 헤더 trigger의 aria-controls와 연결할 Drawer dialog id. 생략하면 내부 id를 생성합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `header` | `React.ReactNode` | No | header/banner landmark를 소유하는 상단 슬롯. LDS에서는 TopBar를 권장합니다. |
| `navigation` | `React.ReactNode` | No | 넓은 화면의 navigation landmark 슬롯. SideNav 또는 NavRail을 사용합니다. |
| `narrowNavigation` | `React.ReactNode` | No | 좁은 화면의 navigation landmark 슬롯. BottomNav를 사용합니다. 생략하면 navigation이 좁은 화면에서 본문 앞에 유지됩니다. |
| `temporaryNavigation` | `React.ReactNode` | No | 좁은 화면에서 modal Drawer로 표시할 계층형 탐색 슬롯. 제공하면 좁은 화면에서 넓은 navigation은 숨고 본문은 그대로 유지됩니다. |
| `temporaryNavigationOpen` | `boolean` | No | temporaryNavigation Drawer의 제품 소유 열린 상태. 넓은 화면에서는 렌더되지 않습니다. @default false |
| `onTemporaryNavigationClose` | `() = void` | No | Escape, scrim, 닫기 버튼 또는 narrow→wide 전환으로 temporaryNavigation을 닫아 달라는 요청. 부모는 열린 상태를 false로 갱신합니다. |
| `temporaryNavigationId` | `string` | No | 헤더 trigger의 aria-controls와 연결할 Drawer dialog id. 생략하면 내부 id를 생성합니다. |
| `temporaryNavigationTitle` | `React.ReactNode` | No | Drawer에 보이는 탐색 제목. |
| `temporaryNavigationLabel` | `string` | No | Drawer dialog와 내부 navigation의 접근 가능한 이름. @default "주 탐색" |
| `temporaryNavigationCloseLabel` | `string` | No | Drawer 닫기 버튼의 접근 가능한 이름. @default "탐색 닫기" |
| `temporaryNavigationCloseButtonVariant` | `'soft' \| 'solid' \| 'signal' \| 'ghost' \| 'plain' \| 'on-dark'` | No | temporaryNavigation Drawer 닫기 아이콘의 표현. 생략하면 Drawer 표면의 기본값을 사용합니다. 브랜드 모바일 셸에서 외곽선 없는 X만 필요하면 "plain"을 사용합니다. |
| `temporaryNavigationWidth` | `number` | No | temporaryNavigation Drawer 너비(px). @default 320 |
| `temporaryNavigationAppearance` | `'default' \| 'brand'` | No | temporaryNavigation Drawer 표면. TopBar dark + SideNav appearance="brand" 조합에서 "brand"를 주면 드로어 골격까지 같은 네이비 표면으로 이어집니다. @default "default" |
| `temporaryNavigationInitialFocusRef` | `React.RefObject` | No | Drawer가 열릴 때 우선 초점을 받을 내부 요소. |
| `temporaryNavigationReturnFocusRef` | `React.RefObject` | No | Drawer가 닫힐 때 초점을 복원할 persistent trigger. |
| `children` | `React.ReactNode` | No |  |
| `layout` | `'auto' \| 'wide' \| 'narrow'` | No | auto는 768px 미만에서 좁은 구성을 사용합니다. @default "auto" |
| `topology` | `'header-first' \| 'side-first' \| 'rail-panel'` | No | header-first는 전폭 header 아래에 탐색을 두고, side-first는 넓은 화면에서 탐색을 전체 높이의 첫 열에 둡니다. rail-panel은 navigation의 docked NavRail(영역)과 panel의 ShellPanel(영역 안 긴 목록)을 전체 높이의 두 열로 두는 고정 높이 앱 셸이며 main이 스크롤 컨테이너입니다. 좁은 화면에서는 레일 항목과 패널을 드로어 하나로 합칩니다. |
| `panel` | `React.ReactNode` | No | rail-panel의 맥락 패널 슬롯(ShellPanel). 긴 목록을 가진 영역에만 넘기고, 하위 목적지 2–4개뿐인 영역은 생략해 본문 탭을 씁니다. |
| `panelOpen` | `boolean` | No | 패널 펼침 상태. 토글은 header 시작의 제품 소유 버튼 하나이며 aria-expanded·aria-controls={panelId}를 둡니다. @default true |
| `onPanelOpenChange` | `(open: boolean) = void` | No | 패널 접힘 요청. overlay 범위에서 Escape를 누르거나 768–1023px 범위로 들어가면 false로 호출됩니다. |
| `panelId` | `string` | No | 패널 영역 id. 토글의 aria-controls와 연결합니다. 생략하면 내부 id를 생성합니다. |
| `panelMode` | `'auto' \| 'inline' \| 'overlay'` | No | 패널 배치. auto는 768–1023px에서 본문을 덮는 overlay, 그 이상에서 inline입니다. 검증에서는 inline/overlay로 고정합니다. @default "auto" |
| `panelReturnFocusRef` | `React.RefObject` | No | 패널 안에 focus가 있는 채로 접히거나 overlay에서 Escape로 닫힐 때 focus를 돌려줄 토글. |

## States

| State | Contract |
| --- | --- |
| temporaryNavigationOpen | temporaryNavigation Drawer의 제품 소유 열린 상태. 넓은 화면에서는 렌더되지 않습니다. @default false |
| temporaryNavigationCloseButtonVariant | temporaryNavigation Drawer 닫기 아이콘의 표현. 생략하면 Drawer 표면의 기본값을 사용합니다. 브랜드 모바일 셸에서 외곽선 없는 X만 필요하면 "plain"을 사용합니다. |
| panelOpen | 패널 펼침 상태. 토글은 header 시작의 제품 소유 버튼 하나이며 aria-expanded·aria-controls={panelId}를 둡니다. @default true |
| onPanelOpenChange | 패널 접힘 요청. overlay 범위에서 Escape를 누르거나 768–1023px 범위로 들어가면 false로 호출됩니다. |

## Behavior and interaction

- 768–1023px(panelMode="auto")에서는 패널이 본문을 밀지 않고 덮는 overlay입니다. overlay는 본문 행에만 놓여 상단 바와 패널 토글을 가리지 않습니다. 이 범위에 들어오면 열린 패널을 onPanelOpenChange(false)로 닫아 접힌 상태로 시작하고, 열면 덮는 쪽에만 그림자를 두며 Escape로 닫혀 focus가 토글로 돌아갑니다(L-S9). 검증에서는 panelMode="inline"|"overlay"로 고정합니다.
- TopBar, SideNav, NavRail, BottomNav의 control/icon 크기, typography, radius, border, fill, active/focus/disabled 처리를 그대로 유지합니다.
- 이 축은 Drawer appearance를 그대로 전달할 뿐이며 Drawer의 anatomy, focus/Escape, portal 계약은 바뀌지 않습니다. 자식 SideNav의 appearance를 훔쳐보고 자동으로 맞추지 않습니다 — 셸의 표면 결정은 명시적 prop으로 남깁니다.
- temporaryNavigationCloseButtonVariant도 같은 방식으로 Drawer의 closeButtonVariant를 명시적으로 전달합니다. 기본 표현을 다시 정의하지 않으며, plain을 선택해도 브랜드 표면의 X 대비와 32px action target은 Drawer가 유지합니다.
- Carbon UI shell usage — 지속적인 header, 선택적인 left panel, product→global 순서를 분리하고 좁은 폭에서는 header link를 left navigation으로 이동합니다. LDS 셸도 header와 제품 탐색을 별도 슬롯으로 유지합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | layout — auto는 LDS의 sm=768px 아래에서 좁은 구성을 사용합니다. Storybook과 테스트에서는 wide/narrow로 상태를 결정적으로 고정할 수 있습니다. |
| 명시 규칙 2 | main은 하나만 렌더링하고 tabIndex={-1}과 안정적인 id를 가져 skip link의 실제 focus 목적지가 됩니다. mainLabel은 같은 문서에 여러 셸이 있는 검증 fixture에서만 명시합니다. |
| 명시 규칙 3 | navigation에 NavRail surface="docked" appearance="neutral"(영역 3–7개, 로고 header, 계정 footer)을, panel에 ShellPanel(제목, 동작 최대 2개, 주 동작 행, 스크롤 구역 하나)을 넘깁니다. 레일 64px과 패널 240px이 전체 높이 두 열이 되고, header와 main은 셋째 열입니다. 셸은 고정 높이(100dvh, style로 덮을 수 있음)이며 레일과 패널은 스크롤되지 않고 main이 스크롤 컨테이너입니다. |
| 명시 규칙 4 | 패널은 긴 목록을 가진 영역에만 넘깁니다(P1, L-S4). 하위 목적지가 2–4개인 영역은 panel을 생략하고 본문 머리의 경로 탭을 씁니다. 레일 → 패널 → 탭을 넘는 깊이는 금지합니다. 영역을 바꾸면 본문 폭이 패널 폭만큼 바뀌지만 레일 위치는 고정입니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- navigation과 narrowNavigation은 자체 를 소유하는 SideNav/NavRail과 BottomNav를 전달합니다. 소비자가 이름을 주지 않으면 셸이 주 탐색을 제공합니다.
- narrowNavigation을 생략해도 layout="auto"가 기존 navigation을 숨기지 않습니다. 좁은 화면에서는 wide navigation을 본문 앞 한 행에 유지해 탐색이 조용히 사라지는 실패를 막습니다. 최적화된 모바일 표현이 필요하면 BottomNav를 명시합니다.
- topology — 기본 header-first는 전폭 header 아래에 navigation과 main을 둬 기존 소비자와 Web Viz·Control 계열 셸을 유지합니다. side-first는 넓은 화면에서 navigation을 전체 높이 첫 열에, utility header와 main을 둘째 열에 둡니다. 좁은 화면에서는 두 토폴로지 모두 같은 단일 열·하단 탐색 계약으로 수렴합니다.
- 좁은 탐색 래퍼는 하단 safe area를 적용합니다. BottomNav 자체는 고정 위치나 safe area를 소유하지 않습니다.

## Content and writing

- 건너뛰기 링크의 테두리는 primary 색으로 focus 위치를 알리고, 문구는 semantic label 색을 사용해 밝은·어두운 셸 배경 모두에서 본문 텍스트 대비를 유지합니다.
- header-first: TopBar가 실제 LK Lockup과 제품 이름을 소유하고 SideNav는 로컬 목적지만 제공합니다.
- side-first: SideNav header가 Lockup과 제품 이름을 소유하고 TopBar는 workspace/project 맥락과 검색·알림·도움말 같은 전역 utility만 제공합니다.
- temporaryNavigationAppearance="brand"는 temporaryNavigation Drawer의 골격(제목 행, 닫기 버튼, divider, 본문)까지 네이비 브랜드 표면으로 렌더링합니다. 기본값은 "default"로 기존 출력과 동일합니다.

## Accessibility

- 의미·키보드 순서는 본문 건너뛰기 → header/banner → 넓은 주 탐색 → main → 좁은 주 탐색입니다(rail-panel은 아래 절의 순서). CSS로 숨겨진 탐색 슬롯은 접근성 트리에서도 제외됩니다.
- 목적지가 네 개를 넘거나 disclosure 계층을 유지해야 하는 좁은 화면은 temporaryNavigation에 SideNav를 전달합니다. 제품이 trigger와 temporaryNavigationOpen 상태·라우트 선택을 소유하고, 셸은 기존 Drawer 엔진으로 스크림, Tab containment, Escape, 초점 복원, body scroll lock을 제공합니다. 열려 있는 동안 skip link·header·wide navigation·main·bottom navigation은 inert입니다.
- header trigger는 temporaryNavigationId를 가리키는 aria-controls와 실제 open state의 aria-expanded를 갖습니다. 일반 dismiss는 temporaryNavigationReturnFocusRef로 trigger에 복원하고, 목적지를 선택한 뒤에는 제품이 Drawer를 닫고 focus 가능한 main으로 이동할 수 있습니다.
- temporaryNavigationLabel은 dialog와 내부 nav의 접근 가능한 이름, temporaryNavigationCloseLabel은 닫기 버튼 이름, temporaryNavigationCloseButtonVariant는 Drawer가 소유한 X의 표현, temporaryNavigationWidth는 px 단위 Drawer 폭입니다. 브랜드 모바일 셸에서 외곽선 없는 X만 필요할 때만 temporaryNavigationCloseButtonVariant="plain"을 명시하며, 색·target·dismiss 동작은 Drawer가 소유합니다.
- 의미·키보드 순서는 시각 순서를 따라 건너뛰기 → 레일 → 패널 → header → main입니다(L-S6). 건너뛰기 링크가 첫 정지점입니다. 레일 nav는 제품이 붙인 aria-label, 패널 안 nav는 패널 제목 aria-labelledby이며 둘이 같으면 개발 경고를 냅니다. 패널 자체는 랜드마크가 아닙니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BottomNav` | 대표 시나리오에서 조합 |
| `Icon` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `Lockup` | 대표 시나리오에서 조합 |
| `SideNav` | 대표 시나리오에서 조합 |
| `TopBar` | 대표 시나리오에서 조합 |
| `DashboardGrid` | 대표 시나리오에서 조합 |
| `DockPanel` | 대표 시나리오에서 조합 |

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
  temporaryNavigation={<SideNav items={items} surface="docked" />}
  temporaryNavigationOpen={navigationOpen}
  onTemporaryNavigationClose={() => setNavigationOpen(false)}
  temporaryNavigationId="product-navigation-drawer"
  temporaryNavigationTitle="주 탐색"
  temporaryNavigationReturnFocusRef={menuButtonRef}
>
  <Container size="wide">…</Container>
</DashboardShell>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-normal`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--component-shell-panel-width`
- `--control-h-sm`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--label1-size`
- `--lds-dashboard-shell-panel-width`
- `--mobile-safe-area-bottom`
- `--radius-md`
- `--shadow-lg`
- `--shadow-md`
- `--space-2`
- `--space-3`
- `--space-6`

### Source contracts

- `components/layout/DashboardShell.jsx`
- `components/layout/DashboardShell.d.ts`
- `components/layout/DashboardShell.prompt.md`
- `stories/NavigationDashboard.stories.jsx`

## Sources

- DashboardShell prompt contract: `components/layout/DashboardShell.prompt.md`
- Storybook implementation evidence: `stories/NavigationDashboard.stories.jsx`
- [WAI-ARIA Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [Material NavigationRail](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)
- [NavigationDrawer](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationDrawer.md)
- [Fluent 2 Nav](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
- [Carbon UI shell left panel](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/)
- [Atlassian navigation system layout](https://atlassian.design/components/navigation-system/layout/usage)
- [WAI-ARIA APG landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
