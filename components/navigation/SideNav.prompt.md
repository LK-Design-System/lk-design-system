**SideNav** — 넓은 라벨형 대시보드 사이드바(브랜드 헤더 + 그룹 내비 + 서브메뉴 + 접힘 레일 + 고정 푸터).

Classification: **LK Product Extension**. WDS Navigation의 Category, Tab, Page Indicator, Pagination과 별개이며 데스크톱 제품 셸에서만 사용합니다.

대시보드·관리 제품의 주 탐색으로 `UserMenu`를 푸터에 조합합니다. TopBar가 함께 있으면 전역 utility만 담당하게 하고 로고·경로를 중복하지 않으며, 평면형 대안인 `NavRail`과 동시에 주 탐색으로 사용하지 않습니다.

```jsx
<SideNav
  defaultValue="docs-overview" onChange={setTab}
  surface="docked"
  header={<Lockup variant="inline" color="var(--color-semantic-label-normal)" height={24} />}
  headerCollapsed={<Lockup variant="mark" color="var(--color-semantic-label-normal)" height={20} />}
  items={[
    { heading: '문서' },
    { value: 'dash', label: '대시보드', href: '/dashboard', icon: <Icon name="home" size={19} /> },
    { value: 'docs', label: '문서', icon: <Icon name="document" size={19} />, children: [
      { value: 'docs-overview', label: '개요', href: '/docs', icon: <Icon name="home" size={16} />, badge: '8' },
      { value: 'docs-components', label: '컴포넌트', href: '/docs/components' },
    ] },
    { value: 'events', label: '이벤트', icon: <Icon name="bell" size={19} />, badge: '5' },
  ]}
/>
```

## Public surface and ref

- `ref`, `className`, and `style` target the native `nav` landmark.
- Stable parts are `root`, `overlaySurface`, `panel`, `brand`, `list`, `heading`, `item`, `icon`, `label`, `badge`, `childList`, and `footer`. Root and items expose stable collapsed/active state attributes.
- Width, rail width, padding, radius, and item geometry can be tuned only through the documented `--lds-side-nav-*` variables. Navigation value, routing, and shell collapse controls remain product-owned.

- **items** — `{ value, label, ariaLabel?, icon, badge?, href?, disabled?, children? }` + `{ heading }` 섹션 헤딩. 자식도 `icon?: ReactNode`를 받을 수 있으며, 한 그룹에 아이콘이 하나라도 있으면 모든 자식에 고정 슬롯을 예약해 라벨 시작선을 맞춥니다. 항목 전체는 native `ul`/`li` 리스트(그룹 자식은 중첩 `ul`)로 렌더되어 보조기술이 항목 수와 계층을 읽을 수 있고, 시각은 기존과 동일합니다(list-style 없음). `href` leaf는 native anchor, `href`가 없는 leaf는 기존 선택 button입니다. `children`이 있으면 이동하지 않는 디스클로저 button(펼침/접힘, 활성 자식이면 부모가 잉크색)입니다. 아이콘은 장식으로 처리되며, 복합 ReactNode `label`은 접힌 레일에서도 이름이 남도록 `ariaLabel`을 제공합니다. **value / defaultValue / onChange**.
- **renderLink** — native anchor 대신 router link를 쓸 때만 제공합니다. `renderLink={(item, { href, ...props }) => <RouterLink to={href} {...props} />}`처럼 DS가 만든 `aria-current`, disabled, style, activation 계약을 전달합니다.
- **surface** — `floating`(기본)은 독립 패널용 전체 outline·`--radius-xl`을 유지합니다. 제품 셸의 지속적인 주 탐색에는 `docked`를 사용합니다. docked는 외곽 radius·shadow·전체 outline 없이 논리적 끝 divider만 남겨 콘텐츠와 경계를 표시합니다. 기본값은 기존 소비자의 시각 호환을 위해 floating입니다.
- **접힘** — 접기/펼치기 수단은 상단 바 시작 부분에 두는 외부 토글 하나뿐이며, `collapsed`/`onCollapsedChange` 제어 프롭으로 패널 상태를 구동합니다. side-first 셸에서는 본문 상단 바의 시작(shadcn/ui SidebarTrigger 배치), header-first 셸에서는 전폭 상단 바의 시작(Atlassian top-nav SideNavToggleButton 배치)입니다. 접기 토글을 사이드 패널 내부에 두지 않으며, SideNav는 자체 토글을 렌더하지 않습니다. 외부 토글에는 `사이드바 접기`/`사이드바 펼치기` 이름·`aria-expanded`·`aria-controls`(SideNav에 부여한 id 참조)를 함께 제공합니다. 접히면 아이콘 레일(`collapsedWidth` 기본 64): 라벨→DS Tooltip(호버뿐 아니라 키보드 focus에서도 열려 native `title`처럼 포인터 전용이 아님, `aria-describedby` 연결·`aria-label`/`aria-current` 유지), 배지→도트, 헤딩→헤어라인, 브랜드→`headerCollapsed`. 접힌 레일의 항목 목록은 wheel·keyboard로 세로 스크롤되며 공간을 잠식하지 않도록 네이티브 스크롤바만 숨깁니다. 항목 버튼 DOM은 전환 전후 동일하게 유지되어 focus를 잃지 않으며 reduced-motion 환경에서는 폭 전환이 즉시 완료됩니다. SideNav가 소유하는 브랜드 아래 패딩과 목적지 행 높이(44px)는 전환 전후 동일하며, 슬롯 콘텐츠 자체의 높이는 제품이 맞춥니다.
- **overlay** — `overlay` peek는 공간이 제한된 데스크톱에서만 쓰는 선택 기능입니다. 비제어 SideNav에서 `overlay`가 런타임에 `false → true`로 바뀌면 레일로 접고, `true → false`로 돌아오면 overlay 진입 전의 persistent 접힘 상태를 복원합니다. 접힌 overlay는 hover뿐 아니라 키보드 focus 진입에서도 펼쳐지며 포인터와 focus가 모두 이탈하면 다시 접힙니다. 바깥 클릭과 Esc도 레일로 복귀시키고, Esc로 자식 항목이 사라질 때 focus는 레일에 남는 부모 항목으로 복구됩니다. 펼침 그림자는 [`TOKEN_GOVERNANCE.md`](../../docs/TOKEN_GOVERNANCE.md)의 elevation 규칙에 따라 콘텐츠를 실제로 덮는 inline-end 쪽에만 남기고 나머지 변은 `clip-path`로 잘라냅니다(엣지 부착 오버레이의 기준 구현).
- **collapsed / defaultCollapsed / onCollapsedChange** — 제품이 접힘 상태를 소유하면 `collapsed`와 `onCollapsedChange`를 함께 사용하고, 비제어 초기값만 필요하면 `defaultCollapsed`를 사용합니다. controlled 상태는 부모가 prop을 갱신할 때만 시각적으로 바뀌므로 런타임 `overlay` 전환 때도 부모가 원하는 `collapsed` 값을 함께 갱신해야 합니다. 사용자별 영속화는 제품이 소유하고 SideNav는 브라우저 저장소를 읽거나 쓰지 않습니다.
- **autoExpandActiveGroup** — 기본 `true`는 활성 자식의 그룹을 초기 선택과 값 변경 때 자동으로 엽니다. `false`이면 활성 값·부모의 현재 경로 잉크·자식을 열었을 때의 `aria-current`는 그대로 두고 disclosure open state만 사용자 조작과 분리합니다. 제품이 패널을 열 때 모든 그룹을 닫아 두고 싶다면 이 축을 끄되 현재 route를 지우지 않습니다.
- **multiple** — 기본 `false`는 한 번에 한 disclosure 그룹만 열리는 accordion 동작입니다. 다른 그룹이나 다른 최상위 목적지를 선택하면 기존에 열린 그룹을 닫고, 활성 자식이 바뀌면 해당 그룹만 엽니다. `multiple={true}`를 명시하면 여러 그룹을 동시에 열 수 있습니다.
- **header / headerCollapsed / footer** — 브랜드는 `Lockup` 사용(inline 20px / mark 22px 권장). 푸터는 `height` 지정 시 바닥 고정.
- 지속 선택 표면은 `aria-current="page"`인 현재 leaf 목적지만 소유합니다. 현재 목적지는 LDS의 NavRail·TopBar와 같은 primary wash와 굵은 label을 사용하며 별도 시작 표시선은 추가하지 않습니다. 펼쳐진 부모는 배경을 유지하지 않고 chevron과 활성 자손을 뜻하는 강한 label/icon만 사용하며, pointer hover는 선택 표면보다 약한 neutral `fill-alternative`, pressed는 `fill-normal`, keyboard focus는 전역 focus ring으로 분리합니다.
- 펼쳐진 `childList`는 논리적 시작 방향에서 `--space-3`(12px)만큼 들어가 하위 목적지의 hover·선택 표면 자체를 부모 행보다 안쪽에 둡니다. 자식 라벨도 아이콘 유무와 관계없이 부모 라벨보다 12px 안쪽에서 시작하고 `--label2-line`(18px)을 사용합니다. 44px hit target과 현재 leaf 하나만 소유하는 선택 배경은 유지하며, 별도 connector·중첩 표면·active bar는 추가하지 않습니다.
- 접힌 레일의 점은 실제 `badge`만 뜻합니다. 활성 자손은 부모 아이콘의 강한 잉크로만 표시해
  동일한 점이 상태와 현재 위치를 동시에 뜻하지 않게 합니다.
- 내비게이션 disabled 표면은 wrapper opacity `0.45`를 공통 문법으로 사용합니다. 개별 자식의
  색 토큰을 다시 바꿔 이중으로 흐리게 만들지 않습니다.
- 타입 스케일 정합: 섹션 헤딩 10.5px → `--caption2-size`(11px, 스케일 하한; 대문자 letterSpacing 1px 유지), 자식 항목 13.5px → `--label2-size`(13px)로 스냅했습니다. 14px 부모 항목보다 1px 아래 위계는 그대로 유지됩니다.

### 내부 시각 차이 점검

- `NavRail`/`BottomNav`와 같은 icon, caption/label scale, primary surface/ink, `aria-current="page"`를 사용합니다. SideNav에만 섹션 heading, badge, 자식 indent, disclosure chevron, 펼친 panel width가 있습니다. 이는 계층 구조와 상태 수를 표현하기 위한 기능 차이입니다.
- anchor와 button은 동일한 padding, radius, fill, hover, focus, disabled 시각을 공유합니다. 링크 여부가 아니라 `aria-current`만 지속 선택 배경을 만들며, 링크라는 이유로 underline이나 shadow를 추가하지 않습니다.
- `floating`은 기존 SideNav의 border/radius와 overlay 확장 shadow를 유지합니다. `docked`는 앱 셸과 한 평면으로 읽히도록 상시·레일 상태에서 논리적 끝 divider만 사용하지만, overlay 패널이 콘텐츠 위로 펼쳐진 동안에는 floating과 같은 확장 shadow로 부유 위계를 표시하고 접히면 다시 평면으로 돌아갑니다. 두 표면은 항목의 padding, radius, fill, active marker를 공유합니다.
- 접힌 레일과 펼친 패널은 SideNav가 소유하는 브랜드 아래 패딩 18px과 44px 목적지 행 높이를 공유합니다. `header`와 `headerCollapsed` 슬롯 자체의 intrinsic 높이는 제품이 맞추며, 레일에서는 label·badge가 사라지고 행의 가로 정렬만 바뀝니다.

### 외부 기준과 적용 결론

- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — 복잡한 제품 탐색은 header와 지속적인 left panel을 조합하고 좁은 폭에서는 탐색 표면을 전환합니다. 그래서 셸에 붙는 SideNav는 docked를, 독립 배치는 floating을 사용합니다.
- [Carbon UI shell left panel style](https://carbondesignsystem.com/components/UI-shell-left-panel/style/) — sub-menu item은 상위 link/sub-menu보다 추가로 들여쓰고 hover와 selected를 별도 상태로 정의합니다. LDS도 하위 목적지 표면과 라벨을 `--space-3`만큼 함께 inset해 계층을 분리하되, Carbon의 4px interactive border는 내부 NavRail·TopBar 선택 문법과 맞지 않아 채택하지 않고 현재 leaf의 선택 배경만 유지합니다.
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 목적지는 link, category는 펼침/접힘이며 category 자체는 이동하지 않습니다. category 아이콘이 없을 때도 subitem을 명확히 들여쓰라는 원칙을 적용해 LDS는 자식 아이콘 유무와 무관하게 같은 라벨 시작선을 보장합니다. 축소 가능 내비게이션의 상태는 명시적 토글로 설명하고 hover peek는 선택 기능으로 제한합니다.
- [WAI-ARIA Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) — 한 패널만 허용하는 accordion은 다른 헤더를 열 때 기존 패널을 닫고 `aria-expanded`를 실제 노출 상태와 동기화합니다. LDS의 기본 SideNav도 이 단일 열림 규칙을 따릅니다.
- [Carbon UI shell left panel accessibility](https://preview.carbondesignsystem.com/building-blocks/core/components/ui-shell-left-panel/accessibility) — rail은 hover나 focus에서 펼쳐져도 같은 링크·서브메뉴 keyboard model을 유지합니다. 이 동작을 LDS에 적용할 때는 동일 DOM뿐 아니라 44px hit target과 세로 위치도 유지해, 포인터와 키보드 사용자가 확장 중 움직이는 목적지를 다시 추적하지 않게 합니다.
- [Atlassian navigation system layout](https://atlassian.design/components/navigation-system/layout/examples) — 접기 토글(`SideNavToggleButton`)은 top nav 항목이며 사이드 패널 내부에 두지 않습니다. [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/base/sidebar)의 `SidebarTrigger`(본문 상단 바 시작)와 IBM Carbon UI shell 헤더 햄버거도 같은 원칙입니다. LDS는 이 원칙을 따라 셸의 접기 토글을 상단 바 시작 부분에 두며, side-first에서는 shadcn 배치를, header-first에서는 Atlassian 배치를 사용합니다.
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — `<nav>` landmark와 명확한 accessible name을 유지합니다. 소비자가 `aria-label`을 주지 않으면 기본 이름 `사이드 탐색`을 제공하고, 같은 문서에 탐색 landmark가 여러 개면 고유한 이름으로 덮어씁니다. 현재 목적지는 `aria-current="page"`로 노출하고, 키보드 focus 진입·이탈과 Esc 뒤에도 초점을 잃지 않습니다.
- [WAI Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) — 부모 button의 `aria-expanded`는 자식 노출 상태이고 leaf link의 `aria-current="page"`는 현재 위치입니다. LDS는 두 상태를 같은 persistent highlight로 합치지 않습니다.

라우터 생성, URL 동기화, 권한에 따른 item 제거, 접힘 상태 영속화는 제품이 소유합니다.

## Shell integration extensions

- `brandAlign="center|start"` controls the expanded brand region. The collapsed mark remains centered so the 64px rail stays balanced.
- `footer` accepts either a node or a render function receiving `{ collapsed, expanded, overlay }`. Use the render form when the account/footer composition must change before an overlay peek or rail collapse exposes it.
- `footerGap` controls the gap above the footer divider without changing the footer's internal padding.
- The collapsed item rail scrolls vertically with a hidden native scrollbar. Do not reduce or remove authorized destinations merely to fit a short viewport; preserve keyboard and wheel scrolling.
- Child destinations accept `icon`; when any child in a group has one, SideNav reserves the same decorative slot for every sibling.
- In uncontrolled mode, changing `overlay` at runtime collapses on entry and restores the prior persistent state on exit. In controlled mode, the product updates `collapsed` explicitly.
- A dark navigation surface is obtained by placing SideNav inside `data-theme="dark"` or `.theme-dark`; it is not a separate SideNav palette prop.

The header remains a composition slot, so a product mark plus product name should be composed with `Lockup` or product-owned text rather than adding a domain-specific product-name prop.
