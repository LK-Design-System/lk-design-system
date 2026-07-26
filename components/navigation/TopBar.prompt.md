**TopBar** — 상단 앱 바: 좌측 브랜드 슬롯, 가운데 내비(children), 우측 액션 슬롯. 헤어라인 베이스; `sticky`는 프로스티드 블러로 고정, `dark`는 네이비 마스트헤드.

Classification: **LK Product Extension**. 랜딩·콘텐츠 사이트에서는 전역 탐색으로 전체형 `Footer`와 조합합니다. `SideNav`와 함께 쓸 때는 검색·알림·제품 전환 같은 전역 utility만 두고, 로고와 제품 내부 경로를 양쪽에 중복하지 않습니다.

```jsx
<TopBar navAlign="center" brand={<Lockup variant="inline" height={22} />} actions={<Button size="sm">새 항목</Button>}>
  <TopBarNavItem
    active
    href="/docs"
    menuItems={[{ label: '문서 개요', href: '/docs' }, { label: '컴포넌트', href: '/docs/components' }]}
    menuTriggerLabel="문서 하위 메뉴"
  >
    문서
  </TopBarNavItem>
  <TopBarNavItem>토큰</TopBarNavItem>
  <TopBarNavItem>가이드</TopBarNavItem>
</TopBar>
<TopBar dark sticky brand={<Lockup variant="inline" tone="white" height={22} />} />
```

- 내비는 기본적으로 `TopBarNavItem`을 사용하면 active underline/dropdown 처리를 유지한다. active underline은 헤더 하단 구분선에 붙이지 않고 좌우 텍스트 padding을 제외한 글자 폭으로, 글자 바로 아래에 표시한다. 활성 목적지가 바뀔 때만 왼쪽을 기준으로 `--dur-base`(200ms) 동안 펼쳐지며, hover는 글자색만 바꾸고 현재 active underline을 이동시키거나 숨기지 않는다. children으로 준 주 내비 항목은 드롭다운과 동일하게 navigation landmark 안의 native `<ul>`/`<li>` 리스트로 감싸 렌더된다(list-style 없음, 시각 동일). 액션은 `Button`/`IconButton`/`Avatar`로 구성. **height** 기본 64px. **bordered={false}**로 하단 헤어라인 제거.
- **navigationLabel**은 children으로 렌더되는 navigation landmark의 이름입니다. 기본은 `주 탐색`이며, 비교 fixture처럼 같은 문서에 TopBar가 여러 개 있으면 각각 고유한 이름을 제공합니다.
- `href`와 `menuItems`를 함께 주면 주 레이블은 목적지를 유지하는 실제 링크이고, 바로 옆의 별도 disclosure button이 드롭다운을 엽니다. 복합 children에는 **menuTriggerLabel**을 명시합니다. 드롭다운은 application menu가 아니라 native `<ul>` 안의 링크/버튼이므로 `role="menu"`를 쓰지 않고 자연스러운 `Tab` 순서를 유지합니다.
- TopBar 드롭다운은 navigation disclosure 의미를 유지하되 범용 `DropdownMenu`와 같은 시각 밀도와
  적응형 폭을 사용합니다. 콘텐츠에 따라 176–320px 사이에서 늘어나며 viewport 양쪽 16px 여백을
  침범하지 않습니다. padding 8px·항목 간격 4px·패널 radius 12px, 항목 14/20px·최소 높이
  40px·padding 10px 16px·radius 10px과 폭 경계는 공통 `--component-menu-*` 토큰을
  `--component-topbar-menu-*`가 alias합니다. 항목 전체 행이 클릭 영역이며 pointer hover와 keyboard
  focus는 같은 배경을 사용합니다. 현재 목적지는 `menuItems[].current`로 `aria-current`와 더 약한
  지속 선택 배경을 함께 표시합니다.
- 드롭다운은 disclosure 클릭·hover·focus로 열리고 브라우저 top layer에서 trigger를 기준으로 위·아래를 선택한 뒤 viewport 안으로 정렬합니다. 링크와 분리된 disclosure chevron은 최소 28px 클릭 폭을 유지하면서 라벨과 시각적으로 4px 간격을 두고, 열리면 180° 회전합니다. active underline과 chevron transition은 `prefers-reduced-motion: reduce`에서 즉시 전환합니다. trigger와 panel 사이의 4px 간격은 160ms pointer grace로 건널 수 있고, panel 바깥의 mouse/touch `pointerdown`, 항목 선택, `Escape`는 닫습니다. 따라서 TopBar의 가로 스크롤 영역이나 셸의 clip에 메뉴를 가두지 않습니다.
- disclosure에서 `ArrowDown`/`ArrowUp`은 첫/마지막 항목을 열어 포커스하고, 열린 목록 안에서는 `ArrowDown`/`ArrowUp`이 순환하며 `Home`/`End`가 처음/끝으로 이동합니다. `Escape`는 닫은 뒤 disclosure로 포커스를 돌려줍니다. `Enter`/`Space`와 `Tab`은 native button/link 의미를 그대로 사용합니다.
- `TopBarNavItem`에 전달한 `onMouseEnter`, `onMouseLeave`, `onFocus`, `onBlur`, `onKeyDown`, `onClick`은 내부 동작보다 먼저 호출해 합성합니다. 소비자가 이벤트에서 `preventDefault()`를 호출하면 해당 내부 토글·포커스·hover 처리를 건너뛰므로 `...rest`가 기본 상호작용을 덮어쓰지 않습니다.
- 좁은 폭에서는 브랜드와 전역 액션을 제거하지 않고 가운데 내비가 먼저 가로 스크롤합니다. 액션이 매우 많으면 액션 슬롯 자체도 가로 스크롤되어 각 컨트롤에 계속 접근할 수 있습니다.
- **의도적 한계** — 모바일용 접힘 내비·햄버거 트리거를 제공하지 않습니다. 좁은 화면 전환은 제품 셸이 별도로 책임지며, 현재 TopBar를 완성된 모바일 랜딩 헤더로 간주하지 않습니다.
- 타입 스케일 정합: 주 내비 링크 14.5px → `--body2-size`(15px)로 스냅했습니다. 주 내비는 위로 스냅해 14px 드롭다운 항목보다 위 위계를 유지합니다.

외부 근거:

- [Carbon UI shell header](https://carbondesignsystem.com/components/UI-shell-header/usage/)의 제품→전역 읽기 순서, 우측 utility, 클릭으로 여는 submenu, 좁은 폭에서 셸이 탐색 전환을 소유하는 원칙을 따릅니다. LDS TopBar는 메뉴가 잘리지 않도록 배치만 책임지고, hamburger/SideNav 전환은 DashboardShell에 남깁니다.
- [Carbon UI shell header style](https://carbondesignsystem.com/components/UI-shell-header/style/)의 전체 행 링크, 명확한 hover/focus 피드백, 조밀한 헤더 하위 탐색 원칙을 공통 menu density에 적용합니다. LDS는 14/20px 글줄과 포커스 링을 수용하도록 항목 높이를 40px로 정규화합니다.
- [WAI Landmarks Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)에 따라 TopBar만 제품 셸의 banner를 소유합니다. Storybook 설명 chrome이나 DashboardShell이 별도 banner로 감싸지 않습니다.
- [WAI Disclosure Navigation Example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)처럼 사이트/제품 탐색은 native link와 disclosure button, 자연스러운 `Tab` 이동을 유지합니다. 링크 목적지와 하위 탐색을 한 control에 겹치지 않습니다.
- [WAI Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)의 `menu`/`menuitem`과 managed focus는 application command menu에 적합합니다. TopBar는 목적지 링크 탐색이므로 그 역할 모델은 채택하지 않고, 편의용 방향키 이동만 추가합니다.
