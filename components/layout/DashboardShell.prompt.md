**DashboardShell** — 제품 대시보드의 상단 바, 넓은 화면 탐색, 본문, 좁은 화면 탐색을 한 개의 landmark·반응형 계약으로 조합합니다.

Classification: **LK Product Extension · Operations Dashboard**. 루트 `DESIGN.md`의 Operations Dashboard 계약을 따르며 WDS Core 축이나 별도 디자인 시스템이 아닙니다. 화면별 데이터 fetching이나 앱 라우팅을 포함하지 않습니다.

## 낮은 모바일 높이와 경계 왕복 (R01/V03, 2026-10-09)

자동 rail-panel 모바일 Drawer 본문이 영역 → 패널 → 계정 전체를 세로 스크롤합니다.
Drawer 안 ShellPanel ScrollArea는 visible overflow로 풀어 중첩 스크롤을 피합니다.
데스크톱 고정 영역·목록 스크롤은 유지합니다. custom temporaryNavigation도 Drawer overflow를 숨기지 않습니다.
열린 narrow→wide 전환은 공개 `onTemporaryNavigationClose`를 한 번 통지합니다.
부모는 false로 갱신해야 하며 왕복 후 이전 intent로 재개방하지 않습니다.
닫기/Escape는 기존 Drawer engine으로 trigger에, wide 전환은 사라지는 mobile trigger 대신 main에 복귀합니다.
Portal matchMedia나 새 breakpoint API는 필요 없습니다.
[WAI-ARIA Modal Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)와
[MDN ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)를 검토했습니다.
[소스 검토 기록](../../docs/handoff/2026-10-09-portal-density-source-review.md) 참조.

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

- 의미·키보드 순서는 **본문 건너뛰기 → header/banner → 넓은 주 탐색 → main → 좁은 주 탐색**입니다(`rail-panel`은 아래 절의 순서). CSS로 숨겨진 탐색 슬롯은 접근성 트리에서도 제외됩니다.
- **header**는 자체 `header`/banner landmark를 소유해야 하며 LDS에서는 `TopBar`를 사용합니다. 셸이 다시 `<header>`로 감싸지 않아 중첩 landmark를 만들지 않습니다.
- **navigation**과 **narrowNavigation**은 자체 `<nav>`를 소유하는 `SideNav`/`NavRail`과 `BottomNav`를 전달합니다. 소비자가 이름을 주지 않으면 셸이 `주 탐색`을 제공합니다.
- 목적지가 네 개를 넘거나 disclosure 계층을 유지해야 하는 좁은 화면은 **temporaryNavigation**에 `SideNav`를 전달합니다. 제품이 trigger와 `temporaryNavigationOpen` 상태·라우트 선택을 소유하고, 셸은 기존 `Drawer` 엔진으로 스크림, Tab containment, Escape, 초점 복원, body scroll lock을 제공합니다. 열려 있는 동안 skip link·header·wide navigation·main·bottom navigation은 `inert`입니다.
- header trigger는 `temporaryNavigationId`를 가리키는 `aria-controls`와 실제 open state의 `aria-expanded`를 갖습니다. 일반 dismiss는 `temporaryNavigationReturnFocusRef`로 trigger에 복원하고, 목적지를 선택한 뒤에는 제품이 Drawer를 닫고 focus 가능한 `main`으로 이동할 수 있습니다.
- `temporaryNavigationLabel`은 dialog와 내부 nav의 접근 가능한 이름, `temporaryNavigationCloseLabel`은 닫기 버튼 이름, `temporaryNavigationCloseButtonVariant`는 Drawer가 소유한 X의 표현, `temporaryNavigationWidth`는 px 단위 Drawer 폭입니다. 브랜드 모바일 셸에서 외곽선 없는 X만 필요할 때만 `temporaryNavigationCloseButtonVariant="plain"`을 명시하며, 색·target·dismiss 동작은 Drawer가 소유합니다. 특별한 업무 순서가 있을 때만 `temporaryNavigationInitialFocusRef`로 첫 초점을 재정의하고, 기본은 Drawer 안의 첫 focusable control입니다.
- `narrowNavigation`을 생략해도 `layout="auto"`가 기존 `navigation`을 숨기지 않습니다. 좁은 화면에서는 wide navigation을 본문 앞 한 행에 유지해 탐색이 조용히 사라지는 실패를 막습니다. 최적화된 모바일 표현이 필요하면 `BottomNav`를 명시합니다.
- **layout** — `auto`는 LDS의 `sm=768px` 아래에서 좁은 구성을 사용합니다. Storybook과 테스트에서는 `wide`/`narrow`로 상태를 결정적으로 고정할 수 있습니다.
- **topology** — 기본 `header-first`는 전폭 header 아래에 navigation과 main을 둬 기존 소비자와 Web Viz·Control 계열 셸을 유지합니다. `side-first`는 넓은 화면에서 navigation을 전체 높이 첫 열에, utility header와 main을 둘째 열에 둡니다. 좁은 화면에서는 두 토폴로지 모두 같은 단일 열·하단 탐색 계약으로 수렴합니다.
- `main`은 하나만 렌더링하고 `tabIndex={-1}`과 안정적인 id를 가져 skip link의 실제 focus 목적지가 됩니다. `mainLabel`은 같은 문서에 여러 셸이 있는 검증 fixture에서만 명시합니다.
- 좁은 탐색 래퍼는 하단 safe area를 적용합니다. `BottomNav` 자체는 고정 위치나 safe area를 소유하지 않습니다.

### `topology="rail-panel"` — 레일 + 맥락 패널

- `navigation`에 `NavRail surface="docked" appearance="neutral"`(영역 3–7개, 로고 `header`, 계정 `footer`)을, `panel`에 `ShellPanel`(제목, 동작 최대 2개, 주 동작 행, 스크롤 구역 하나)을 넘깁니다. 레일 64px과 패널 240px이 전체 높이 두 열이 되고, header와 main은 셋째 열입니다. 셸은 고정 높이(`100dvh`, `style`로 덮을 수 있음)이며 **레일과 패널은 스크롤되지 않고 main이 스크롤 컨테이너**입니다. main은 실제로 넘칠 때만 tab 순서에 들어갑니다(`ScrollArea`와 같은 WCAG 2.1.1 계약).
- 의미·키보드 순서는 시각 순서를 따라 **건너뛰기 → 레일 → 패널 → header → main**입니다(L-S6). 건너뛰기 링크가 첫 정지점입니다. 레일 nav는 제품이 붙인 `aria-label`, 패널 안 nav는 패널 제목 `aria-labelledby`이며 둘이 같으면 개발 경고를 냅니다. 패널 자체는 랜드마크가 아닙니다.
- 패널은 **긴 목록을 가진 영역에만** 넘깁니다(P1, L-S4). 하위 목적지가 2–4개인 영역은 `panel`을 생략하고 본문 머리의 경로 탭을 씁니다. 레일 → 패널 → 탭을 넘는 깊이는 금지합니다. 영역을 바꾸면 본문 폭이 패널 폭만큼 바뀌지만 레일 위치는 고정입니다.
- 접기 토글은 header 시작의 제품 버튼 하나입니다(「패널 접기」/「패널 펼치기」, `aria-expanded`, `aria-controls={panelId}`). `panelOpen`/`onPanelOpenChange`로 제어하고, 접힌 패널은 폭 0·`inert`·`aria-hidden`입니다. 패널 안 focus가 있는 채로 접히면 `panelReturnFocusRef`로 돌아갑니다. 폭 전환은 `--dur-base`, reduced-motion에서 즉시입니다. 사용자별 저장은 제품 소유입니다.
- 768–1023px(`panelMode="auto"`)에서는 패널이 본문을 밀지 않고 덮는 overlay입니다. overlay는 본문 행에만 놓여 상단 바와 패널 토글을 가리지 않습니다. 이 범위에 들어오면 열린 패널을 `onPanelOpenChange(false)`로 닫아 접힌 상태로 시작하고, 열면 덮는 쪽에만 그림자를 두며 Escape로 닫혀 focus가 토글로 돌아갑니다(L-S9). 검증에서는 `panelMode="inline"|"overlay"`로 고정합니다.
- 768px 미만(`layout`이 narrow로 해석될 때)에는 레일과 패널을 렌더하지 않고 **드로어 하나**로 합칩니다. `temporaryNavigation`을 따로 넘기지 않으면 셸이 같은 레일 항목을 `NavRail surface="drawer"` 가로 행으로, 그 아래 현재 영역의 패널(스크롤 구역 하나)을, 마지막에 레일 `footer`(계정)를 그립니다. 제품은 항목을 한 번만 넘기고 trigger와 `temporaryNavigationOpen`을 소유합니다. 기존 Drawer 엔진의 스크림·Tab 가둠·Escape·focus 복원을 그대로 씁니다.
- 공존 규칙: 같은 목적지 층을 NavRail과 SideNav로 중복하지 않는다는 원칙은 유지됩니다. rail-panel은 레일(영역)과 패널(영역 안 목록)이 다른 층이라 허용합니다.
- 외부 근거: [Material NavigationRail](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md)(3–7개, 로고 header)·[NavigationDrawer](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationDrawer.md)(모바일 modal 드로어), [Fluent 2 Nav](https://fluent2.microsoft.design/components/web/react/core/nav/usage)(아이콘 전용 배치 미지원, 640px 이하 overlay), [Carbon UI shell left panel](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/)(보조 항목 5개 초과 시 패널, 세 단계 금지), [Atlassian navigation system layout](https://atlassian.design/components/navigation-system/layout/usage)(슬롯 순서가 Tab·낭독 순서, 1024px 이하 panel overlay), [WAI-ARIA APG landmarks](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/). 제품 참고(근거 아님): ChatGPT 레일 + 대화 패널. 아이콘 전용 레일은 따르지 않았습니다.
- 의도적 제외: 레일 펼침(Material expanded rail, SideNav와 중복), 패널 너비 조절, 패널 안 디스클로저 그룹, 레일 배지 숫자, 레일 안 FAB, 아이콘 전용 레일, 방향키 roving.

### 내부 시각 차이 점검

- `TopBar`, `SideNav`, `NavRail`, `BottomNav`의 control/icon 크기, typography, radius, border, fill, active/focus/disabled 처리를 그대로 유지합니다.
- 셸 자체는 카드, edge line, inset border, radius, shadow를 추가하지 않습니다. 배경은 기존 페이지 canvas 토큰만 사용합니다.
- 건너뛰기 링크의 테두리는 primary 색으로 focus 위치를 알리고, 문구는 semantic label 색을 사용해 밝은·어두운 셸 배경 모두에서 본문 텍스트 대비를 유지합니다.
- 넓은 구성은 `auto + minmax(0, 1fr)`, 좁은 구성은 단일 본문 열과 선택적인 하단 탐색 행입니다. temporary navigation은 문서 흐름을 차지하지 않고 왼쪽 edge의 기존 Drawer 표면을 사용합니다. 이 배치 차이는 탐색 공간을 확보하기 위한 기능적 차이이며 새로운 장식 언어가 아닙니다.
- `side-first`는 SideNav의 시각 표면을 바꾸지 않습니다. 전체 높이의 평평한 앱 셸에는 `SideNav surface="docked"`, 독립 패널에는 기존 `floating`을 조합합니다.
- `Container`의 page margin과 최대 폭, `PageHeader`의 본문 위계, `DashboardGrid`의 카드 간격은 각각 해당 컴포넌트가 소유합니다.

### 브랜드·전역 도구 소유권

- `header-first`: TopBar가 실제 LK `Lockup`과 제품 이름을 소유하고 SideNav는 로컬 목적지만 제공합니다.
- `side-first`: SideNav header가 `Lockup`과 제품 이름을 소유하고 TopBar는 workspace/project 맥락과 검색·알림·도움말 같은 전역 utility만 제공합니다.
- `UserMenu`는 SideNav footer 계약을 기본으로 합니다. 같은 브랜드·목적지·계정을 TopBar와 SideNav에 반복하지 않습니다.

### 모바일 드로어 표면

- `temporaryNavigationAppearance="brand"`는 `temporaryNavigation` Drawer의 골격(제목 행, 닫기 버튼, divider, 본문)까지 네이비 브랜드 표면으로 렌더링합니다. 기본값은 `"default"`로 기존 출력과 동일합니다.
- 어두운 셸을 모바일에서 이어가려면 세 표면을 함께 지정합니다: `TopBar dark` + `temporaryNavigationAppearance="brand"` + `SideNav appearance="brand"`. 하나라도 빠지면 "네이비 masthead → 흰 타이틀 바 → 네이비 내비 패널"로 표면이 끊깁니다.
- 이 축은 `Drawer appearance`를 그대로 전달할 뿐이며 Drawer의 anatomy, focus/Escape, portal 계약은 바뀌지 않습니다. 자식 `SideNav`의 `appearance`를 훔쳐보고 자동으로 맞추지 않습니다 — 셸의 표면 결정은 명시적 prop으로 남깁니다.
- `temporaryNavigationCloseButtonVariant`도 같은 방식으로 Drawer의 `closeButtonVariant`를 명시적으로 전달합니다. 기본 표현을 다시 정의하지 않으며, `plain`을 선택해도 브랜드 표면의 X 대비와 32px action target은 Drawer가 유지합니다.

### 외부 기준과 적용 결론

- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — 지속적인 header, 선택적인 left panel, product→global 순서를 분리하고 좁은 폭에서는 header link를 left navigation으로 이동합니다. LDS 셸도 header와 제품 탐색을 별도 슬롯으로 유지합니다.
- [Carbon UI shell accessibility](https://carbondesignsystem.com/components/UI-shell-header/accessibility/) — 첫 keyboard 항목으로 skip-to-main을 제공하고 native `header` 구조를 사용합니다. LDS도 보이는 focus skip link와 실제 focus 가능한 main 목적지를 제공합니다.
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 주 탐색은 쉽게 접근 가능하되 좁은 화면에서 다른 표면으로 전환하고, 복잡한 계층은 단순 nav에 넣지 않습니다. LDS는 같은 평면 목적지를 NavRail↔BottomNav로, 계층 목적지는 SideNav로 구분합니다.
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) — modal 배경은 inert이고, Tab/Shift+Tab은 dialog 안에 머물며 Escape와 호출 지점 복원을 제공해야 합니다. temporary navigation은 이 책임을 제품별 scrim 코드가 아니라 공용 Drawer 엔진에서 상속합니다.
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — `header`, `nav`, `main`을 논리적 최상위 영역으로 두고 한 문서의 main을 하나로 유지합니다.

### LK 제품 workflow coverage

- **LK Web Viz** `a984def117c05acd213f494cbb8a42e990595505` — 고정 frontend의 dashboard는 로고 TopBar, 연결 상태, 로봇 카드와 메뉴 launcher를 사용합니다. `header-first`와 Card/Status 조합은 supported by composition이며 SideNav·KPI·표·차트는 이 화면에 not applicable입니다.
- **LK Control Full Daedeok** `93802fc2aa5d29f930380ae58d51dcb68322b5e7` — 고정 header, docked/temporary drawer, monitoring·status·chart·table은 supported by composition입니다. temporary navigation의 modal coordination은 셸 계약으로 지원하며 지도·영상·telemetry truth·위험 action lifecycle은 제품이 소유합니다.
- **rail-panel**(2026-10-09 확인): **LK Portal** `ops/lk-portal` `dev` `438c131e`(작업 트리 미커밋 셸 변경 있음) — 질문 영역 대화 목록이 주 사례이며 새 계약으로 지원 예정(미적용). 대화 URL, 셸 목록 상태, 이름 바꾸기 API, 목록 커서는 Portal gap입니다. **LK Control Full Daedeok** `d8c215fd` — 사용자 소유 긴 목록이 없고 현장 관제는 지도·영상 폭이 우선이라 not applicable(기존 SideNav 계약으로 충분). **LK Web Viz** 로컬 `7e535341`(main 아님, unverified pin) — 가로 상단 launcher라 not applicable.
- **LK Portal** `e5ee99d5062170e26abe63d9105c2b8a024ce710` — 실제 logo가 있는 고정 SideNav와 프로젝트/attention collection은 `side-first`와 DashboardGrid/DataGrid 조합으로 supported by composition입니다. 계층형 narrow navigation은 temporary navigation으로 지원하며 route·권한·query·저장은 제품이 소유합니다.
- 세 고정 소스에서 공통 KPI 요구는 확인되지 않았습니다. DashboardShell은 MetricCard-first 화면을 규정하지 않고 제품이 중요도를 정한 실제 컴포넌트 조합만 수용합니다.

의도적 제외: 라우터 인스턴스, 인증·권한 판정, drawer open state의 저장, URL 동기화, 데이터 새로고침, 사용자별 셸 저장은 제품이 소유합니다. `DashboardShell`은 슬롯 배치와 landmark, skip link, 반응형 전환, temporary Drawer의 modal coordination만 소유합니다.
