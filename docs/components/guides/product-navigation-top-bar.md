# Top Bar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `TopBar` |
| Storybook | `LDS Product/Navigation/Top Bar` |
| Source | `../component-content.json#product-navigation-top-bar` |

랜딩의 주요 섹션이나 대시보드의 전역 검색·알림을 상단에 유지할 때 적합합니다. 깊은 제품 계층에는 Top Bar 목적지를 반복하지 말고 Side Nav를 사용하세요.

## 사용 판단

### 사용

- 랜딩의 주요 섹션이나 대시보드의 전역 검색·알림을 상단에 유지할 때 적합합니다. 깊은 제품 계층에는 Top Bar 목적지를 반복하지 말고 Side Nav를 사용하세요.
- 내비는 기본적으로 TopBarNavItem을 사용하면 기존 TopBar 카드의 active underline/dropdown 처리를 유지한다. children으로 준 주 내비 항목은 드롭다운과 동일하게 navigation landmark 안의 native / 리스트로 감싸 렌더된다(list-style 없음, 시각 동일). 액션은 Button/IconButton/Avatar로 구성. height 기본 64px. bordered={false}로 하단 헤어라인 제거.
- navigationLabel은 children으로 렌더되는 navigation landmark의 이름입니다. 기본은 주 탐색이며, 비교 fixture처럼 같은 문서에 TopBar가 여러 개 있으면 각각 고유한 이름을 제공합니다.
- 드롭다운은 disclosure 클릭·hover·focus로 열리고 브라우저 top layer에서 trigger를 기준으로 위·아래를 선택한 뒤 viewport 안으로 정렬합니다. trigger와 panel 사이의 4px 간격은 160ms pointer grace로 건널 수 있고, panel 바깥의 mouse/touch pointerdown, 항목 선택, Escape는 닫습니다. 따라서 TopBar의 가로 스크롤 영역이나 셸의 clip에 메뉴를 가두지 않습니다.

### 사용하지 않음

- 좁은 폭에서는 브랜드와 전역 액션을 제거하지 않고 가운데 내비가 먼저 가로 스크롤합니다. 액션이 매우 많으면 액션 슬롯 자체도 가로 스크롤되어 각 컨트롤에 계속 접근할 수 있습니다.
- 의도적 한계 — 모바일용 접힘 내비·햄버거 트리거를 제공하지 않습니다. 좁은 화면 전환은 제품 셸이 별도로 책임지며, 현재 TopBar를 완성된 모바일 랜딩 헤더로 간주하지 않습니다.
- WAI Menu Button Pattern의 menu/menuitem과 managed focus는 application command menu에 적합합니다. TopBar는 목적지 링크 탐색이므로 그 역할 모델은 채택하지 않고, 편의용 방향키 이동만 추가합니다.
- Classification: LK Product Extension. 랜딩·콘텐츠 사이트에서는 전역 탐색으로 전체형 Footer와 조합합니다. SideNav와 함께 쓸 때는 검색·알림·제품 전환 같은 전역 utility만 두고, 로고와 제품 내부 경로를 양쪽에 중복하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | TopBar의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | 내비 영역 — 링크 / 탭 / 버튼. |
| Actions | 오른쪽 정렬 액션(버튼, 아이콘 버튼, 아바타). |
| Navigation Label | children으로 만든 navigation landmark의 접근 가능한 이름. @default "주 탐색" |
| Nav Align | 내비 정렬. @default "start" |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Menu Trigger Label | href와 menuItems를 함께 쓸 때 생성되는 disclosure button의 접근 가능한 이름. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `brand` | `React.ReactNode` | No | 왼쪽 브랜드 슬롯(예: ). |
| `children` | `React.ReactNode` | No | 내비 영역 — 링크 / 탭 / 버튼. |
| `actions` | `React.ReactNode` | No | 오른쪽 정렬 액션(버튼, 아이콘 버튼, 아바타). |
| `navigationLabel` | `string` | No | children으로 만든 navigation landmark의 접근 가능한 이름. @default "주 탐색" |
| `navAlign` | `'start' \| 'center'` | No | 내비 정렬. @default "start" |
| `sticky` | `boolean` | No | 프로스티드 블러로 상단 고정. @default false |
| `bordered` | `boolean` | No | 하단 헤어라인 룰 표시. @default true |
| `dark` | `boolean` | No | 네이비 마스트헤드 변형. @default false |
| `height` | `number` | No | 바 높이(px). @default 64 |
| `children` | `React.ReactNode` | No | 내비 라벨. |
| `active` | `boolean` | No | 활성 상태. |
| `href` | `string` | No | 링크 목적지. menuItems와 함께 제공해도 링크는 이동 의미를 유지하고 별도 disclosure button이 메뉴를 엽니다. |
| `menuItems` | `TopBarNavItemMenuItem[]` | No | hover/focus/disclosure로 표시되는 native link/button 드롭다운 항목. |
| `menuTriggerLabel` | `string` | No | href와 menuItems를 함께 쓸 때 생성되는 disclosure button의 접근 가능한 이름. |
| `menuTheme` | `'light' \| 'dark'` | No | 드롭다운 메뉴의 명시 테마. @default "light" |
| `onClick` | `React.MouseEventHandler` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| active | 활성 상태. 타입 계약: boolean |
| 상호작용 · 링크와 하위 탐색 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 320px 브랜드와 전역 액션 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- href와 menuItems를 함께 주면 주 레이블은 목적지를 유지하는 실제 링크이고, 바로 옆의 별도 disclosure button이 드롭다운을 엽니다. 복합 children에는 menuTriggerLabel을 명시합니다. 드롭다운은 application menu가 아니라 native 안의 링크/버튼이므로 role="menu"를 쓰지 않고 자연스러운 Tab 순서를 유지합니다.
- 드롭다운은 disclosure 클릭·hover·focus로 열리고 브라우저 top layer에서 trigger를 기준으로 위·아래를 선택한 뒤 viewport 안으로 정렬합니다. trigger와 panel 사이의 4px 간격은 160ms pointer grace로 건널 수 있고, panel 바깥의 mouse/touch pointerdown, 항목 선택, Escape는 닫습니다. 따라서 TopBar의 가로 스크롤 영역이나 셸의 clip에 메뉴를 가두지 않습니다.
- disclosure에서 ArrowDown/ArrowUp은 첫/마지막 항목을 열어 포커스하고, 열린 목록 안에서는 ArrowDown/ArrowUp이 순환하며 Home/End가 처음/끝으로 이동합니다. Escape는 닫은 뒤 disclosure로 포커스를 돌려줍니다. Enter/Space와 Tab은 native button/link 의미를 그대로 사용합니다.
- TopBarNavItem에 전달한 onMouseEnter, onMouseLeave, onFocus, onBlur, onKeyDown, onClick은 내부 동작보다 먼저 호출해 합성합니다. 소비자가 이벤트에서 preventDefault()를 호출하면 해당 내부 토글·포커스·hover 처리를 건너뛰므로 ...rest가 기본 상호작용을 덮어쓰지 않습니다.
- WAI Disclosure Navigation Example처럼 사이트/제품 탐색은 native link와 disclosure button, 자연스러운 Tab 이동을 유지합니다. 링크 목적지와 하위 탐색을 한 control에 겹치지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 내비는 기본적으로 TopBarNavItem을 사용하면 기존 TopBar 카드의 active underline/dropdown 처리를 유지한다. children으로 준 주 내비 항목은 드롭다운과 동일하게 navigation landmark 안의 native / 리스트로 감싸 렌더된다(list-style 없음, 시각 동일). 액션은 Button/IconButton/Avatar로 구성. height 기본 64px. bordered={false}로 하단 헤어라인 제거. |
| 명시 규칙 2 | 드롭다운은 disclosure 클릭·hover·focus로 열리고 브라우저 top layer에서 trigger를 기준으로 위·아래를 선택한 뒤 viewport 안으로 정렬합니다. trigger와 panel 사이의 4px 간격은 160ms pointer grace로 건널 수 있고, panel 바깥의 mouse/touch pointerdown, 항목 선택, Escape는 닫습니다. 따라서 TopBar의 가로 스크롤 영역이나 셸의 clip에 메뉴를 가두지 않습니다. |
| 명시 규칙 3 | 타입 스케일 정합: 주 내비 링크 14.5px → --body2-size(15px)로 스냅했습니다. 주 내비는 위로 스냅해 14px 드롭다운 항목보다 위 위계를 유지합니다. |
| 명시 규칙 4 | - 내비는 기본적으로 TopBarNavItem을 사용하면 기존 TopBar 카드의 active underline/dropdown 처리를 유지한다. children으로 준 주 내비 항목은 드롭다운과 동일하게 navigation landmark 안의 native / 리스트로 감싸 렌더된다(list-style 없음, 시각 동일). 액션은 Button/IconButton/Avatar로 구성. height 기본 64px. bordered={false}로 하단 헤어라인 제거. - navigationLabel은 children으로 렌더되는 navigation landmark의… |
| --body2-size | 15px |

## Responsive

- 내비는 기본적으로 TopBarNavItem을 사용하면 기존 TopBar 카드의 active underline/dropdown 처리를 유지한다. children으로 준 주 내비 항목은 드롭다운과 동일하게 navigation landmark 안의 native / 리스트로 감싸 렌더된다(list-style 없음, 시각 동일). 액션은 Button/IconButton/Avatar로 구성. height 기본 64px. bordered={false}로 하단 헤어라인 제거.
- 드롭다운은 disclosure 클릭·hover·focus로 열리고 브라우저 top layer에서 trigger를 기준으로 위·아래를 선택한 뒤 viewport 안으로 정렬합니다. trigger와 panel 사이의 4px 간격은 160ms pointer grace로 건널 수 있고, panel 바깥의 mouse/touch pointerdown, 항목 선택, Escape는 닫습니다. 따라서 TopBar의 가로 스크롤 영역이나 셸의 clip에 메뉴를 가두지 않습니다.
- 좁은 폭에서는 브랜드와 전역 액션을 제거하지 않고 가운데 내비가 먼저 가로 스크롤합니다. 액션이 매우 많으면 액션 슬롯 자체도 가로 스크롤되어 각 컨트롤에 계속 접근할 수 있습니다.
- 의도적 한계 — 모바일용 접힘 내비·햄버거 트리거를 제공하지 않습니다. 좁은 화면 전환은 제품 셸이 별도로 책임지며, 현재 TopBar를 완성된 모바일 랜딩 헤더로 간주하지 않습니다.

## Content and writing

- navigationLabel은 children으로 렌더되는 navigation landmark의 이름입니다. 기본은 주 탐색이며, 비교 fixture처럼 같은 문서에 TopBar가 여러 개 있으면 각각 고유한 이름을 제공합니다.
- href와 menuItems를 함께 주면 주 레이블은 목적지를 유지하는 실제 링크이고, 바로 옆의 별도 disclosure button이 드롭다운을 엽니다. 복합 children에는 menuTriggerLabel을 명시합니다. 드롭다운은 application menu가 아니라 native 안의 링크/버튼이므로 role="menu"를 쓰지 않고 자연스러운 Tab 순서를 유지합니다.
- WAI Landmarks Pattern에 따라 TopBar만 제품 셸의 banner를 소유합니다. Storybook 설명 chrome이나 DashboardShell이 별도 banner로 감싸지 않습니다.
- - 내비는 기본적으로 TopBarNavItem을 사용하면 기존 TopBar 카드의 active underline/dropdown 처리를 유지한다. children으로 준 주 내비 항목은 드롭다운과 동일하게 navigation landmark 안의 native / 리스트로 감싸 렌더된다(list-style 없음, 시각 동일). 액션은 Button/IconButton/Avatar로 구성. height 기본 64px. bordered={false}로 하단 헤어라인 제거. - navigationLabel은 children으로 렌더되는 navigation landmark의….

## Accessibility

- href와 menuItems를 함께 주면 주 레이블은 목적지를 유지하는 실제 링크이고, 바로 옆의 별도 disclosure button이 드롭다운을 엽니다. 복합 children에는 menuTriggerLabel을 명시합니다. 드롭다운은 application menu가 아니라 native 안의 링크/버튼이므로 role="menu"를 쓰지 않고 자연스러운 Tab 순서를 유지합니다.
- 드롭다운은 disclosure 클릭·hover·focus로 열리고 브라우저 top layer에서 trigger를 기준으로 위·아래를 선택한 뒤 viewport 안으로 정렬합니다. trigger와 panel 사이의 4px 간격은 160ms pointer grace로 건널 수 있고, panel 바깥의 mouse/touch pointerdown, 항목 선택, Escape는 닫습니다. 따라서 TopBar의 가로 스크롤 영역이나 셸의 clip에 메뉴를 가두지 않습니다.
- disclosure에서 ArrowDown/ArrowUp은 첫/마지막 항목을 열어 포커스하고, 열린 목록 안에서는 ArrowDown/ArrowUp이 순환하며 Home/End가 처음/끝으로 이동합니다. Escape는 닫은 뒤 disclosure로 포커스를 돌려줍니다. Enter/Space와 Tab은 native button/link 의미를 그대로 사용합니다.
- TopBarNavItem에 전달한 onMouseEnter, onMouseLeave, onFocus, onBlur, onKeyDown, onClick은 내부 동작보다 먼저 호출해 합성합니다. 소비자가 이벤트에서 preventDefault()를 호출하면 해당 내부 토글·포커스·hover 처리를 건너뛰므로 ...rest가 기본 상호작용을 덮어쓰지 않습니다.
- WAI Disclosure Navigation Example처럼 사이트/제품 탐색은 native link와 disclosure button, 자연스러운 Tab 이동을 유지합니다. 링크 목적지와 하위 탐색을 한 control에 겹치지 않습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 내비는 기본적으로 TopBarNavItem을 사용하면 기존 TopBar 카드의 active underline/dropdown 처리를 유지한다. children으로 준 주 내비 항목은 드롭다운과 동일하게 navigation landmark 안의 native / 리스트로 감싸 렌더된다(list-style 없음, 시각 동일). 액션은 Button/IconButton/Avatar로 구성. height 기본 64px. bordered={false}로 하단 헤어라인 제거. |
| Don't | 좁은 폭에서는 브랜드와 전역 액션을 제거하지 않고 가운데 내비가 먼저 가로 스크롤합니다. 액션이 매우 많으면 액션 슬롯 자체도 가로 스크롤되어 각 컨트롤에 계속 접근할 수 있습니다. |
| Do | navigationLabel은 children으로 렌더되는 navigation landmark의 이름입니다. 기본은 주 탐색이며, 비교 fixture처럼 같은 문서에 TopBar가 여러 개 있으면 각각 고유한 이름을 제공합니다. |
| Don't | 의도적 한계 — 모바일용 접힘 내비·햄버거 트리거를 제공하지 않습니다. 좁은 화면 전환은 제품 셸이 별도로 책임지며, 현재 TopBar를 완성된 모바일 랜딩 헤더로 간주하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 TopBar의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Lockup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TopBarNavItem` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Anchor` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BottomNav` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Breadcrumb` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-brand-canvas-from`
- `--color-semantic-brand-canvas-to`
- `--color-semantic-inverse-fill-normal`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-neutral-soft`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--label1-size`
- `--radius-10`
- `--radius-14`
- `--shadow-md`
- `--space-8`

### Source contracts

- `components/navigation/TopBar.jsx`
- `components/navigation/TopBar.d.ts`
- `components/navigation/TopBar.prompt.md`
- `stories/Navigation.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- TopBar prompt contract: `components/navigation/TopBar.prompt.md`
- Storybook implementation evidence: `stories/Navigation.stories.jsx`
- [Carbon UI shell header](https://carbondesignsystem.com/components/UI-shell-header/usage/)
- [WAI Landmarks Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)
- [WAI Disclosure Navigation Example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
- [WAI Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [SEED Top Bar benchmark](https://seed-design.io/components/top-navigation)
