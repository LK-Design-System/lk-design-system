**SideNav** — 넓은 라벨형 대시보드 사이드바(브랜드 헤더 + 그룹 내비 + 서브메뉴 + 접힘 레일 + 고정 푸터).

Classification: **LK Product Extension**. WDS Navigation의 Category, Tab, Page Indicator, Pagination과 별개이며 데스크톱 제품 셸에서만 사용합니다.

SideNav의 shell padding, top-level/child row height와 row padding은 profile-aware token을
사용합니다. `ops`에서도 목적지 계층, active/current 의미, disclosure와 keyboard focus는
동일하고 모든 row는 24px target floor를 넘습니다. 기존 `--lds-side-nav-*` vars가 profile
token보다 우선합니다.

대시보드·관리 제품의 주 탐색으로 `UserMenu`를 푸터에 조합합니다. TopBar가 함께 있으면 전역 utility만 담당하게 하고 로고·경로를 중복하지 않으며, 평면형 대안인 `NavRail`과 같은 목적지 층을 중복해 주 탐색으로 쓰지 않습니다. `DashboardShell topology="rail-panel"`에서는 docked `NavRail`(영역)과 `ShellPanel` 안 평면 목록(영역 안 목록)이 다른 층이므로 함께 쓰며, 패널 안에 SideNav 전체를 넣지 않습니다.

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
- **appearance** — `default`(기본)는 현재 theme의 neutral semantic surface 위에서 현재 leaf를 text-safe blue accent(`--color-semantic-accent-blue-text`) label·icon과 굵기로 표시합니다. `brand`는 평면 브랜드 네이비 셸과 전용 상태 잉크를 쓰는 theme-stable 외형이며, 어두운 셸에서는 accent 잉크만으로 현재 위치가 읽히지 않아 현재 leaf에 상시 selected fill(`--component-side-nav-brand-active-surface`)과 primary 잉크를 함께 둡니다. `neutral`은 테마를 따르는 밝은(다크에서는 어두운) 무채색 셸이며, 현재 leaf를 무채색 상시 채움 + `label-normal` 잉크 + 굵기로 표시하고 내비게이션 안에 강조색을 두지 않습니다(아래 Neutral appearance). `surface`가 배치 geometry를, `appearance`가 SideNav 내부 색 역할만 소유하므로 두 축은 독립입니다. 알 수 없는 런타임 값은 `default`로 안전하게 돌아갑니다.
- **접힘** — 접기/펼치기 수단은 상단 바 시작 부분에 두는 외부 토글 하나뿐이며, `collapsed`/`onCollapsedChange` 제어 프롭으로 패널 상태를 구동합니다. side-first 셸에서는 본문 상단 바의 시작(shadcn/ui SidebarTrigger 배치), header-first 셸에서는 전폭 상단 바의 시작(Atlassian top-nav SideNavToggleButton 배치)입니다. 접기 토글을 사이드 패널 내부에 두지 않으며, SideNav는 자체 토글을 렌더하지 않습니다. 외부 토글에는 `사이드바 접기`/`사이드바 펼치기` 이름·`aria-expanded`·`aria-controls`(SideNav에 부여한 id 참조)를 함께 제공합니다. 접히면 아이콘 레일(`collapsedWidth` 기본 64): 라벨→DS Tooltip(호버뿐 아니라 키보드 focus에서도 열려 native `title`처럼 포인터 전용이 아님, `aria-describedby` 연결·`aria-label`/`aria-current` 유지), 배지→도트, 헤딩→헤어라인, 브랜드→`headerCollapsed`. 접힌 레일의 항목 목록은 wheel·keyboard로 세로 스크롤되며 공간을 잠식하지 않도록 네이티브 스크롤바만 숨깁니다. 항목 버튼 DOM은 전환 전후 동일하게 유지되어 focus를 잃지 않으며 reduced-motion 환경에서는 폭 전환이 즉시 완료됩니다. SideNav가 소유하는 브랜드 아래 패딩과 목적지 행 높이(44px)는 전환 전후 동일하며, 슬롯 콘텐츠 자체의 높이는 제품이 맞춥니다.
- **모션** — 패널 폭과 행의 column gap은 기존 `--dur-base`(200ms) `ease-out`으로 전환합니다. 라벨·배지·chevron은 같은 DOM을 유지한 채 `--dur-fast`(120ms) opacity와 논리적 inline 방향 4px 이하의 이동으로 사라지고 나타납니다. 펼칠 때만 약 40ms 지연해 폭이 텍스트 공간을 먼저 확보하게 하고, 접을 때는 즉시 감쇠합니다. 아이콘의 크기·x 좌표·44px 행 높이는 움직이지 않으며 항목별 stagger, bounce, scale은 사용하지 않습니다. 하위 목록은 200ms grid row와 120ms opacity로 열고 닫되, 닫히는 즉시 `aria-hidden`·`inert`와 tab stop 제거를 적용해 시각 전환 중에도 비노출 콘텐츠가 상호작용되지 않게 합니다. 임의 ReactNode를 받는 header/footer slot은 중복 mount하지 않고 현재 슬롯 하나에 짧은 진입 fade만 적용합니다. `prefers-reduced-motion: reduce`에서는 폭·라벨·chevron·하위 목록·slot 애니메이션을 모두 즉시 완료합니다.
- **overlay** — `overlay` peek는 공간이 제한된 데스크톱에서만 쓰는 선택 기능입니다. 비제어 SideNav에서 `overlay`가 런타임에 `false → true`로 바뀌면 레일로 접고, `true → false`로 돌아오면 overlay 진입 전의 persistent 접힘 상태를 복원합니다. 접힌 overlay는 hover뿐 아니라 키보드 focus 진입에서도 펼쳐지며 포인터와 focus가 모두 이탈하면 다시 접힙니다. 바깥 클릭과 Esc도 레일로 복귀시키고, Esc로 자식 항목이 사라질 때 focus는 레일에 남는 부모 항목으로 복구됩니다. 펼침 그림자는 [`TOKEN_GOVERNANCE.md`](../../docs/TOKEN_GOVERNANCE.md)의 elevation 규칙에 따라 콘텐츠를 실제로 덮는 inline-end 쪽에만 남기고 나머지 변은 `clip-path`로 잘라냅니다(엣지 부착 오버레이의 기준 구현).
- **collapsed / defaultCollapsed / onCollapsedChange** — 제품이 접힘 상태를 소유하면 `collapsed`와 `onCollapsedChange`를 함께 사용하고, 비제어 초기값만 필요하면 `defaultCollapsed`를 사용합니다. controlled 상태는 부모가 prop을 갱신할 때만 시각적으로 바뀌므로 런타임 `overlay` 전환 때도 부모가 원하는 `collapsed` 값을 함께 갱신해야 합니다. 사용자별 영속화는 제품이 소유하고 SideNav는 브라우저 저장소를 읽거나 쓰지 않습니다.
- **autoExpandActiveGroup** — 기본 `true`는 활성 자식의 그룹을 초기 선택과 값 변경 때 자동으로 엽니다. `false`이면 활성 값·부모의 현재 경로 잉크·자식을 열었을 때의 `aria-current`는 그대로 두고 disclosure open state만 사용자 조작과 분리합니다. 제품이 패널을 열 때 모든 그룹을 닫아 두고 싶다면 이 축을 끄되 현재 route를 지우지 않습니다.
- **multiple** — 기본 `false`는 한 번에 한 disclosure 그룹만 열리는 accordion 동작입니다. 다른 그룹이나 다른 최상위 목적지를 선택하면 기존에 열린 그룹을 닫고, 활성 자식이 바뀌면 해당 그룹만 엽니다. `multiple={true}`를 명시하면 여러 그룹을 동시에 열 수 있습니다.
- **header / headerCollapsed / footer** — 브랜드는 `Lockup` 사용(inline 20px / mark 22px 권장). 푸터는 `height` 지정 시 바닥 고정.
- 지속 선택 상태는 `aria-current="page"`인 현재 leaf 목적지만 소유합니다. 현재 목적지는 상시 배경 없이 text-safe blue accent label·icon과 굵기로 표시하며 별도 시작 표시선도 추가하지 않습니다. 펼쳐진 부모는 chevron과 활성 자손을 뜻하는 강한 label/icon만 사용합니다. pointer hover와 active-hover는 neutral `fill-normal`, pressed는 `fill-strong`, keyboard focus는 전역 focus ring으로 분리해 상시 선택과 순간 상호작용을 표면 유무로 구분합니다. 비선택 행의 hover·pressed label·icon은 rest 잉크(`label-alternative`)보다 한 단계 진한 `label-neutral`로 올라갑니다. rest 잉크를 그대로 두면 다크 hover 면에서 3.90:1, pressed 면에서 3.68:1로 AA에 못 미쳤습니다(2026-10-09 수정, 지금 5.92 / 5.54:1, 라이트 8.47 / 7.83:1). 포인터 없이 키보드 Space로 누른 `:active` 상태도 표면과 함께 잉크를 바꿔, 비선택 행은 hover 잉크, 현재 행과 활성 자손 부모는 각자의 선택 잉크를 유지합니다. 선택 잉크는 rest·hover·pressed 모두 14px 텍스트의 4.5:1 대비를 지키도록 일반 primary action 색보다 어두운/밝은 text 전용 토큰을 사용합니다.
- 펼쳐진 `childList`는 논리적 시작 방향에서 `--space-3`(12px)만큼 들어가 하위 목적지의 hover 표면 자체를 부모 행보다 안쪽에 둡니다. 자식 라벨도 아이콘 유무와 관계없이 부모 라벨보다 12px 안쪽에서 시작하고 `--label2-line`(18px)을 사용합니다. 44px hit target과 현재 leaf 하나만 소유하는 선택 시각(default는 accent 잉크·굵기, brand는 selected fill·primary 잉크·굵기)은 유지하며, 별도 connector·중첩 표면·active bar는 추가하지 않습니다. brand의 selected fill은 childList inset을 그대로 따르므로 자식 행의 fill이 부모 행보다 안쪽에서 시작합니다.
- 접힌 레일의 점은 실제 `badge`만 뜻합니다. 활성 자손은 부모 아이콘의 강한 잉크로만 표시해
  동일한 점이 상태와 현재 위치를 동시에 뜻하지 않게 합니다.
- 내비게이션 disabled 표면은 wrapper opacity `0.45`를 공통 문법으로 사용합니다. 개별 자식의
  색 토큰을 다시 바꿔 이중으로 흐리게 만들지 않습니다.
- 섹션 헤딩은 모든 외형에서 입력한 대로의 문장형 `--label2-size`(13px)·`--label2-line`·`--fw-medium`·자간 `0`이며 색은 각 외형의 subtle 잉크(default·neutral `label-alternative` 5.07~5.19:1, brand `navy-shell-65` 7.48:1)입니다. 이전의 11px bold 대문자·자간 1px은 한국어 제목에서 대문자 변환이 의미가 없고 자간이 음절 간격을 벌려 어색했습니다(2026-10-09 owner 승인 L-N5, 모든 SideNav 화면의 섹션 제목 모양이 바뀜). [Fluent 2 Nav](https://fluent2.microsoft.design/components/web/react/core/nav/usage)의 sentence-style capitalization과 shadcn `SidebarGroupLabel`(대문자 변환 없는 작은 medium 라벨, 2차 근거)을 따릅니다. 타이포는 색 역할이 아니므로 appearance에 묶지 않습니다. padding(첫 제목 `4px 12px 6px`, 이후 `14px 12px 6px`)과 접힌 레일의 hairline은 그대로이며, 자식 항목은 `--label2-size`(13px), 14px 부모 항목보다 1px 아래 위계를 유지합니다.

### 내부 시각 차이 점검

- neutral은 default와 행 geometry·끝 구분선·포커스·굵기가 같고, 표면(navy-wash)·상시 선택 채움·`label-normal` 선택 잉크·무채색 배지·접힌 proxy 타일만 다릅니다. 상시 채움은 ListCell `selectedPresentation="tint"`와 DropdownMenu 현재 항목의 기존 무채색 문법을 SideNav로 옮긴 것이며 행 하나 크기라 넓은 wash 우려에 해당하지 않습니다.
- `NavRail`/`BottomNav`와 icon, caption/label scale, `aria-current="page"` 의미를 공유하되 각 탐색 표면의 밀도에 맞는 선택 시각을 사용합니다. default default SideNav는 넓은 패널에서 상시 wash가 차지하는 면적을 줄이기 위해 현재 leaf의 text-safe accent 잉크·굵기만 유지하며, 섹션 heading, badge, 자식 indent, disclosure chevron, 펼친 panel width를 추가합니다. compact navigation의 선택 표면을 그대로 복제하지 않는 것은 이 면적·위계 차이 때문입니다.
- anchor와 button은 동일한 padding, radius, hover, pressed, focus, disabled 시각을 공유합니다. 링크 여부가 아니라 `aria-current`만 선택 시각(accent 잉크·굵기, brand에서는 selected fill까지)을 만들며, 링크라는 이유로 underline·shadow·배경을 추가하지 않습니다.
- 항목 keyboard focus ring은 전역 2px focus-indicator를 `outline-offset: -2px`로 안쪽에 그립니다. 목록이 `overflow-x: hidden` 스크롤 영역이라 바깥 offset ring은 가장자리에서 잘리므로, 항목 자체 radius를 따르는 inset ring이 잘림 없는 기준입니다.
- `floating`은 기존 SideNav의 border/radius와 overlay 확장 shadow를 유지합니다. `docked`는 앱 셸과 한 평면으로 읽히도록 상시·레일 상태에서 논리적 끝 divider만 사용하지만, overlay 패널이 콘텐츠 위로 펼쳐진 동안에는 floating과 같은 확장 shadow로 부유 위계를 표시하고 접히면 다시 평면으로 돌아갑니다. 두 표면은 항목의 padding, radius, 순간 interaction fill, active ink를 공유합니다.
- 접힌 레일과 펼친 패널은 SideNav가 소유하는 브랜드 아래 패딩 18px과 44px 목적지 행 높이를 공유합니다. `header`와 `headerCollapsed` 슬롯 자체의 intrinsic 높이는 제품이 맞추며, 레일에서는 label·badge가 시각적으로 사라지되 아이콘의 inline 시작 좌표는 바뀌지 않습니다.

### 외부 기준과 적용 결론

- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — 복잡한 제품 탐색은 header와 지속적인 left panel을 조합하고 좁은 폭에서는 탐색 표면을 전환합니다. 그래서 셸에 붙는 SideNav는 docked를, 독립 배치는 floating을 사용합니다.
- [Carbon UI shell left panel style](https://carbondesignsystem.com/components/UI-shell-left-panel/style/) — sub-menu item은 상위 link/sub-menu보다 추가로 들여쓰고 hover와 selected를 별도 상태로 정의합니다. LDS도 하위 목적지의 hover 표면과 라벨을 `--space-3`만큼 함께 inset해 계층을 분리하되, Carbon의 4px interactive border는 채택하지 않습니다. default는 현재 leaf의 text-safe accent 잉크·굵기만 유지하고, brand는 Carbon의 dark UI shell처럼 selected 행에 상시 fill을 둡니다(아래 brand 항목 참고). 들여쓴 자식 라벨과 가장자리 bar가 하나로 읽히지 않는다는 점이 border 대신 행 fill을 고른 이유입니다.
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 목적지는 link, category는 펼침/접힘이며 category 자체는 이동하지 않습니다. category 아이콘이 없을 때도 subitem을 명확히 들여쓰라는 원칙을 적용해 LDS는 자식 아이콘 유무와 무관하게 같은 라벨 시작선을 보장합니다. 축소 가능 내비게이션의 상태는 명시적 토글로 설명하고 hover peek는 선택 기능으로 제한합니다.
- [WAI-ARIA Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/) — 한 패널만 허용하는 accordion은 다른 헤더를 열 때 기존 패널을 닫고 `aria-expanded`를 실제 노출 상태와 동기화합니다. LDS의 기본 SideNav도 이 단일 열림 규칙을 따릅니다.
- [Carbon UI shell left panel accessibility](https://preview.carbondesignsystem.com/building-blocks/core/components/ui-shell-left-panel/accessibility) — rail은 hover나 focus에서 펼쳐져도 같은 링크·서브메뉴 keyboard model을 유지합니다. 이 동작을 LDS에 적용할 때는 동일 DOM뿐 아니라 44px hit target과 세로 위치도 유지해, 포인터와 키보드 사용자가 확장 중 움직이는 목적지를 다시 추적하지 않게 합니다.
- [Atlassian navigation system layout](https://atlassian.design/components/navigation-system/layout/examples) — 접기 토글(`SideNavToggleButton`)은 top nav 항목이며 사이드 패널 내부에 두지 않습니다. [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/base/sidebar)의 `SidebarTrigger`(본문 상단 바 시작)와 IBM Carbon UI shell 헤더 햄버거도 같은 원칙입니다. LDS는 이 원칙을 따라 셸의 접기 토글을 상단 바 시작 부분에 두며, side-first에서는 shadcn 배치를, header-first에서는 Atlassian 배치를 사용합니다.
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — `<nav>` landmark와 명확한 accessible name을 유지합니다. 소비자가 `aria-label`을 주지 않으면 기본 이름 `사이드 탐색`을 제공하고, 같은 문서에 탐색 landmark가 여러 개면 고유한 이름으로 덮어씁니다. 현재 목적지는 `aria-current="page"`로 노출하고, 키보드 focus 진입·이탈과 Esc 뒤에도 초점을 잃지 않습니다.
- [WAI Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) — 부모 button의 `aria-expanded`는 자식 노출 상태이고 leaf link의 `aria-current="page"`는 현재 위치입니다. LDS는 두 상태를 같은 persistent highlight로 합치지 않습니다.
- [Material UI transitions](https://mui.com/material-ui/customization/transitions/) — 화면 진입 225ms·이탈 195ms의 짧은 표면 전환과 reduced-motion 대응을 기본으로 합니다. LDS는 새 timing scale을 만들지 않고 기존 `--dur-base` 200ms를 패널 geometry에, `--dur-fast` 120ms를 라벨과 상태 콘텐츠에 사용해 같은 체감 범위 안에서 더 절제된 위계를 만듭니다.
- [Atlassian motion](https://atlassian.design/foundations/motion)과 [Applying motion](https://atlassian.design/foundations/motion/applying-motion) — 제품 UI 전환은 대체로 150–400ms 안에서 목적을 설명할 만큼만 사용하고, 성능과 공간 안정성을 위해 transform·opacity를 우선합니다. LDS도 아이콘을 이동시키거나 항목별로 연출하지 않고 opacity와 작은 inline 이동을 사용합니다. docked panel의 실제 폭 변경은 본문 공간을 재배치해야 하는 layout 예외이며 기존 200ms 전환을 유지합니다.
- [WCAG C39: reduced motion](https://www.w3.org/WAI/WCAG22/Techniques/css/C39) — `prefers-reduced-motion` 사용자에게 비필수 움직임을 제거합니다. SideNav는 surface뿐 아니라 chevron·라벨·하위 목록·slot까지 transition과 animation duration/delay를 0으로 만듭니다.

라우터 생성, URL 동기화, 권한에 따른 item 제거, 접힘 상태 영속화는 제품이 소유합니다.

## Shell integration extensions

- `brandAlign="center|start"` controls the expanded brand region. The collapsed mark remains centered so the 64px rail stays balanced.
- `footer` accepts either a node or a render function receiving `{ collapsed, expanded, overlay }`. Use the render form when the account/footer composition must change before an overlay peek or rail collapse exposes it.
- `footerGap` controls the gap above the footer divider without changing the footer's internal padding.
- The collapsed item rail scrolls vertically with a hidden native scrollbar. Do not reduce or remove authorized destinations merely to fit a short viewport; preserve keyboard and wheel scrolling.
- Child destinations accept `icon`; when any child in a group has one, SideNav reserves the same decorative slot for every sibling.
- In uncontrolled mode, changing `overlay` at runtime collapses on entry and restores the prior persistent state on exit. In controlled mode, the product updates `collapsed` explicitly.
- `appearance="default"`는 `data-theme="dark"` 또는 `.theme-dark` 안에서 기존 dark semantic surface를 그대로 사용합니다. `appearance="brand"`는 generic dark theme와 별개인 명시적이고 theme-stable한 제품 셸 팔레트입니다.

### Neutral appearance

- `appearance="neutral"`은 질문 우선 홈처럼 셸과 본문이 둘 다 밝을 때 쓰는 무채색 외형입니다(LDS 결정, 2026-10-09 owner "권고안대로" 승인: L-N1 C, L-N2 `neutral`, L-N3 `label-normal`, L-N4 `cool-neutral-96`, L-N6 무채색 배지, L-N7 접힌 레일 채움 타일, L-N8 forced-colors 세 외형 공통). 파랑은 주 동작·보내기·포커스에만 쓰고 내비게이션 안에서는 키보드 포커스 링 하나만 남깁니다.
- 표면은 흰 본문과 일부러 다르게 둡니다. 새 atomic `navy-wash-98`(`#F7F9FC`, 색상각 216°로 브랜드 네이비 218°와 같은 계열, 흰 본문 대비 1.055:1)과 1px `line-solid-normal` 끝 구분선을 씁니다. 다크는 `background-band`에 raw literal로만 있던 `#0E121F`를 `navy-wash-6`으로 승격해 band와 함께 참조합니다(값 불변). `blue-99`(204°)는 accent 파랑 색상각이라 선택·정보로 읽힐 위험이 있어 쓰지 않았습니다.
- 상태 면은 기존 opaque `cool-neutral` 단계입니다. hover `-97`(라이트 표면 대비 1.13), selected `-96`(1.23), selected+hover·pressed `-95`(1.30). 다크는 `-17`/`-20`/`-22`. hover < selected < selected+hover 순서라 상시 상태와 순간 상태가 섞이지 않고, brand처럼 selected+hover와 pressed가 같은 단계입니다. 새 hex는 `navy-wash` 두 단계뿐입니다.
- 선택 = 채움 + 글자 명도(rest 5.11 → 선택 13.82:1) + **굵기 medium → bold** + `aria-current="page"`. 채움과 표면의 대비 1.23 / 1.30:1은 WCAG 1.4.11이 범위 밖으로 보는 컴포넌트 안 배경 변화이고 1.4.1(Use of Color)로 판단하므로, 굵기는 장식이 아니라 계약입니다. 채움만으로 선택을 알리지 않습니다.
- 비선택 hover 글자는 `label-neutral`(7.95 / 7.37:1), 키보드 Space `:active`는 pressed 면과 hover 잉크(7.12 / 6.31:1)를 함께 씁니다. 배지는 `fill-strong` 알파 pill + `label-neutral`이라 선택 면 위에서도 한 단계 진하게 합성되고(최악 6.22 / 4.85:1), 접힌 레일 점은 `label-alternative`(5.11 / 5.19:1)입니다. 상태 의미가 필요한 수는 제품이 `badge` 자리에 `StatusBadge`를 조합합니다.
- 접힌 레일에서는 라벨 굵기 단서가 사라지므로, 활성 자손을 가진 부모 아이콘 타일에 selected 채움과 `label-normal` 잉크를 둡니다. `aria-current`는 숨은 실제 leaf에 남습니다.
- 포커스는 전역 2px `focus-indicator` inset으로 표면 5.23:1, selected+hover 면 4.02:1(다크 9.95 / 7.13:1)입니다.
- forced-colors(고대비)에서는 author 배경이 강제되어 채움이 사라지므로, 세 외형 모두 `aria-current="page"` 행에 `SelectedItem`/`SelectedItemText`(미지원 브라우저는 앞선 `Highlight`/`HighlightText` 선언이 남음)를 주고, 접힌 레일 proxy에는 `CanvasText` 1px outline을 둡니다. `forced-color-adjust: none`은 쓰지 않습니다.
- 워드마크는 라이트에서 `Lockup tone="ink"`(17.55:1), 다크를 열면 `Lockup adaptive`입니다. 워드마크 색을 SideNav 토큰으로 칠하지 않습니다. adaptive의 LK Navy 판은 0.5X 패딩 때문에 64px 레일에 들어가지 않으므로 다크 접힌 레일에서는 브랜드 슬롯을 비우거나 별도 판단이 필요합니다.
- 토큰은 `--component-side-nav-neutral-*`(brand 키와 1:1 대칭)이며 JSX는 component 토큰만 참조합니다. footer `UserMenu`는 밝은 면용 기본 토큰을 그대로 씁니다.
- 대비는 `scripts/check-color-contrast.mjs`의 `side nav neutral *` 쌍이 라이트·다크에서 검사합니다.
- 외부 근거: [WCAG 2.2 Understanding 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)(컴포넌트 안 배경 변화는 범위 밖, 1.4.1로 판단), [Understanding 1.4.1](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)(비색상 단서 필요 → 굵기 계약), [CSS Color Adjust 1](https://www.w3.org/TR/css-color-adjust-1/#forced-colors-properties)·[MDN system colors](https://developer.mozilla.org/en-US/docs/Web/CSS/system-color)(forced colors에서 시스템 색만 보존), [Fluent 2 Nav](https://fluent2.microsoft.design/components/web/react/core/nav/usage)(sentence case, 닫힌 category로 indicator 이동), [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/sidebar)(2차: 무채색 accent 채움 + 굵기). Carbon·Fluent·Primer의 앞쪽 indicator bar는 `check:no-leading-bars` 규칙에 따라 채택하지 않았고, shadcn처럼 hover와 active를 같은 면으로 두지 않고 면 단계로 구분합니다.
- 제품 workflow gate(2026-10-09 확인): **LK Portal**(`ops/lk-portal` `dev` `438c131e`, 작업 트리에서 `Sidebar.tsx`가 `surface="docked" appearance="default"`, LDS 0.4.5 tgz) — neutral이 포함된 release 뒤 prop 하나로 전환하는 supported by composition, 지금 소비 버전에는 없음(gap). **LK Control Full Daedeok**(`d8c215fd`) — MUI 어두운 사이드바이고 LDS SideNav를 쓰지 않아 not applicable. **LK Web Viz**(로컬 `codex/s1c-new-identity-20260823` `7e535341`, main 아님) — flat header-first launcher라 not applicable(unverified pin). 공식 coverage pin 갱신은 Portal 적용 뒤에 한다.

### Brand navy appearance

- `appearance="brand"`는 브랜드 네이비 `#05132B`(`--color-semantic-brand-surface`)를 평면 단색으로 쓰는 제품 셸 외형입니다. 그라데이션과 wash를 쓰지 않습니다 — 셸은 카드가 아니라 캔버스이고, 표면 색 변화는 의미를 싣지 않은 채 상태 신호의 색 예산을 잠식하기 때문입니다. 로고 자산이 설계된 배경색과 같은 값이라 화이트 lockup이 그대로 올라갑니다.
- 전경과 상태 표면은 `navy-shell` atomic ramp를 참조합니다. 이 ramp는 brand-on-surface 잉크를 브랜드 네이비 위에 합성한 불투명 값입니다: hover·selected·badge surface `-18`(white 10% 합성), selected-hover·pressed `-20`(12%), badge active `-24`(16%), divider `-26`(18%), muted·section·badge ink `-65`(62%), hover ink `-93`(92%). 활성 leaf의 label·icon은 primary 잉크(`--component-side-nav-brand-foreground`, white)를 쓰고, 접힌 레일의 활성 proxy·badge dot·focus는 다음 항목의 `navy-shell-68`을 사용합니다. 반투명 대신 불투명 합성값을 쓰는 이유는 셸 표면이 고정이라 합성 결과가 결정적이고, 트랜지션 중 계산색이 보간 색공간으로 직렬화되는 것을 피할 수 있기 때문입니다.
- 활성 proxy 잉크와 focus ink는 `navy-shell-68`(`#7FB0DE`)로, primary 계열(hue 209°)을 유지해 브랜드 네이비(218°)와 같은 블루 패밀리 안에 머뭅니다.
- default와 상태 문법은 같고 색 토큰만 바뀝니다. SideNav geometry, spacing, logo composition, item typography, disclosure, collapse/overlay behavior와 ARIA 의미는 동일합니다. default의 선택 목적지는 행 전체의 상시 단색 fill 없이 굵은 label·icon accent와 `aria-current="page"`로 표시하고, 행 surface는 hover·active-hover·pressed 순간에만 나타납니다. brand는 여기서 한 가지만 다릅니다: 현재 leaf 행에 `--component-side-nav-brand-active-surface`(`navy-shell-18`, hover와 같은 톤)를 상시 두고 label·icon을 primary white로 올립니다. 어두운 네이비 위에서는 `navy-shell-68` accent 잉크만으로 현재 위치가 훑어 읽히지 않고, hover와 같은 톤을 재사용하면 셸 안의 표면 톤 수가 늘지 않기 때문입니다(LDS 결정, 2026-09-07; LK Portal 224px 레일에서 A 잉크만 / B fill+white / C fill+accent / D edge bar를 같은 상태로 비교해 B를 채택). 활성 행 hover는 `-20`으로 한 단계 더 밝아져 상시 fill과 구분됩니다. 목적지의 별도 badge pill은 이 행 배경 규칙과 독립입니다.
- 대비는 네이비 표면 위에서 primary text `18.51:1`, muted·section ink `7.48:1`, active ink와 focus ink `8.08:1`입니다. Hover ink는 hover surface에서 `12.05:1`, active ink는 hover surface에서 `6.22:1`, primary ink는 selected surface(`-18`)에서 `14.24:1`·selected-hover surface(`-20`)에서 `13.45:1`, primary ink는 selected surface(`-18`)에서 `14.24:1`·selected-hover surface(`-20`)에서 `13.45:1`, badge는 inactive `5.76:1` / active `5.08:1`입니다. 이 쌍들은 `scripts/check-color-contrast.mjs`가 CI에서 검사합니다.
- 값은 공용 brand/semantic token의 의미를 바꾸지 않고 `navy-shell` atomic family와 `--component-side-nav-brand-*` generated component tokens로 관리합니다. 이 토큰들은 라이트·다크 양쪽에서 같은 값으로 해석되는 의도된 dark island이며, 이 범위는 SideNav 외형에만 한정하고 전역 theme나 다른 컴포넌트로 암묵적으로 전파하지 않습니다.
- 제품 coverage는 기존 WF-16 composition seam을 재사용합니다. LK Web Viz의 현재 flat launcher에는 적용하지 않으며, LK Control Full Daedeok와 LK Portal은 제품 셸 조합으로 지원합니다. 실제 opt-in 여부, route, permission, supervision state와 domain iconography는 제품이 소유합니다.
- [Linear's 2026 interface refresh](https://linear.app/now/behind-the-latest-design-refresh) dims navigation chrome, mutes inactive text, adds vertical breathing room, and softens separators so task content stays dominant. [Linear's 2024 redesign](https://linear.app/now/how-we-redesigned-the-linear-ui) also validates testing shell color and hierarchy as a complete prototype rather than tuning isolated swatches.
- [Primer color usage](https://primer.style/product/getting-started/foundations/color-usage/) separates default, muted, and emphasis surfaces and reserves accent for selected, active, and focus roles. [Grafana navigation](https://grafana.com/developers/saga/patterns/navigation/) supports docked primary navigation, sentence-case destinations, and icons at the first hierarchy level.

The header remains a composition slot, so a product mark plus product name should be composed with `Lockup` or product-owned text rather than adding a domain-specific product-name prop.
