# Side Nav

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `SideNav` |
| Storybook | `LDS Product/Navigation/Side Nav` |
| Source | `../component-content.json#product-navigation-side-nav` |

데스크톱 제품에서 그룹·하위 항목·배지·계정 진입점을 계속 노출할 때 적합합니다. 35개의 평면 목적지만 필요하면 Adaptive Navigation을, 페이지 안 이동이면 Anchor를 사용하세요.

## 사용 판단

### 사용

- Atlassian navigation system layout — 접기 토글(SideNavToggleButton)은 top nav 항목이며 사이드 패널 내부에 두지 않습니다. shadcn/ui Sidebar의 SidebarTrigger(본문 상단 바 시작)와 IBM Carbon UI shell 헤더 햄버거도 같은 원칙입니다. LDS는 이 원칙을 따라 셸의 접기 토글을 상단 바 시작 부분에 두며, side-first에서는 shadcn 배치를, header-first에서는 Atlassian 배치를 사용합니다.
- footer accepts either a node or a render function receiving { collapsed, expanded, overlay }. Use the render form when the account/footer composition must change before an overlay peek or rail collapse exposes it.
- Child destinations accept icon; when any child in a group has one, SideNav reserves the same decorative slot for every sibling.
- appearance="default"는 data-theme="dark" 또는 .theme-dark 안에서 기존 dark semantic surface를 그대로 사용합니다. appearance="brand"는 generic dark theme와 별개인 명시적이고 theme-stable한 제품 셸 팔레트입니다.

### 사용하지 않음

- 접힌 레일의 점은 실제 badge만 뜻합니다. 활성 자손은 부모 아이콘의 강한 잉크로만 표시해 동일한 점이 상태와 현재 위치를 동시에 뜻하지 않게 합니다.
- Fluent Nav usage — 목적지는 link, category는 펼침/접힘이며 category 자체는 이동하지 않습니다. category 아이콘이 없을 때도 subitem을 명확히 들여쓰라는 원칙을 적용해 LDS는 자식 아이콘 유무와 무관하게 같은 라벨 시작선을 보장합니다. 축소 가능 내비게이션의 상태는 명시적 토글로 설명하고 hover peek는 선택 기능으로 제한합니다.
- Carbon UI shell left panel accessibility — rail은 hover나 focus에서 펼쳐져도 같은 링크·서브메뉴 keyboard model을 유지합니다. 이 동작을 LDS에 적용할 때는 동일 DOM뿐 아니라 44px hit target과 세로 위치도 유지해, 포인터와 키보드 사용자가 확장 중 움직이는 목적지를 다시 추적하지 않게 합니다.
- 전경과 상태 표면은 navy-shell atomic ramp를 참조합니다. 이 ramp는 brand-on-surface 잉크를 브랜드 네이비 위에 합성한 불투명 값입니다: hover·badge surface -18(white 10% 합성), pressed -20(12%), badge active -24(16%), divider -26(18%), muted·section·badge ink -65(62%), hover ink -93(92%). 활성 label은 static-white를 그대로 씁니다.

## Anatomy

| Part | Contract |
| --- | --- |
| aria-label | nav landmark의 접근 가능한 이름. @default '사이드 탐색' |
| header | 상단 브랜드 영역(예: ). |
| headerCollapsed | 접힌 상태의 브랜드(예: ). 없으면 header를 그대로 사용. |
| brandAlign | 펼친 브랜드 영역의 가로 정렬. 접힌 레일은 항상 가운데 정렬합니다. @default 'center' |
| footer | 하단 고정 영역. 함수면 overlay peek를 포함한 실제 내부 접힘 상태를 받습니다. |
| footerGap | 스크롤 목록과 푸터 구분선 사이의 간격. @default 'var(--space-2)' |
| renderLink | href leaf를 router link로 치환하는 렌더 훅. 그룹 disclosure는 항상 button입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `Array` | Yes | 내비 항목·서브메뉴·섹션 헤딩을 섞은 배열. 항목은 native ul/li 리스트로 렌더되고 그룹의 자식은 중첩 리스트가 됩니다. |
| `aria-label` | `string` | No | nav landmark의 접근 가능한 이름. @default '사이드 탐색' |
| `header` | `React.ReactNode` | No | 상단 브랜드 영역(예: ). |
| `headerCollapsed` | `React.ReactNode` | No | 접힌 상태의 브랜드(예: ). 없으면 header를 그대로 사용. |
| `brandAlign` | `'start' \| 'center'` | No | 펼친 브랜드 영역의 가로 정렬. 접힌 레일은 항상 가운데 정렬합니다. @default 'center' |
| `footer` | `React.ReactNode \| ((state: { collapsed: boolean; expanded: boolean; overlay: boolean }) = React.ReactNode)` | No | 하단 고정 영역. 함수면 overlay peek를 포함한 실제 내부 접힘 상태를 받습니다. |
| `footerGap` | `number \| string` | No | 스크롤 목록과 푸터 구분선 사이의 간격. @default 'var(--space-2)' |
| `width` | `number \| string` | No | 펼친 폭. @default 240 |
| `surface` | `'floating' \| 'docked'` | No | 외곽 표면. floating은 전체 outline과 radius를, docked는 논리적 끝 divider만 사용합니다. @default 'floating' |
| `appearance` | `'default' \| 'brand'` | No | 색상 외형. default는 현재 theme semantic 색을 그대로 사용하고, brand는 밝은 작업면과 대비되는 평면 브랜드 네이비 셸을 사용합니다. 배치 형태는 surface가 별도로 소유합니다. @default 'default' |
| `collapsed` | `boolean` | No | 제어되는 접힘 상태. 접기 토글은 셸의 상단 바에 두고 이 프롭으로 패널을 구동합니다. 상태 영속화는 SideNav가 아니라 소비 제품이 소유합니다. |
| `defaultCollapsed` | `boolean` | No | 비제어 시 초기 접힘. @default false |
| `onCollapsedChange` | `(collapsed: boolean) = void` | No | 다음 접힘 상태 요청. controlled 사용 시 부모가 collapsed를 갱신하기 전에는 시각 상태가 바뀌지 않습니다. |
| `collapsedWidth` | `number` | No | 접힌 아이콘 레일 폭. 기본 64px에서 브랜드 마크와 목적지 아이콘을 유지합니다. @default 64 |
| `overlay` | `boolean` | No | 오버레이 모드 — 레이아웃은 레일 폭 고정, 호버(피크)·키보드 초점·클릭으로 펼치면 패널이 콘텐츠 위로 뜹니다. 비제어 런타임 전환 시 진입은 접고 이탈은 이전 persistent 상태를 복원하며, 제어 모드는 부모가 collapsed를 갱신합니다. @default false |
| `autoExpandActiveGroup` | `boolean` | No | 활성 자식이 속한 disclosure 그룹을 초기 선택과 값 변경 때 자동으로 펼칩니다. false이면 활성 표시는 유지하되 그룹 열림은 사용자 상호작용과 독립됩니다. @default true |
| `multiple` | `boolean` | No | Allows multiple disclosure groups to remain open. When false, selecting another group or top-level destination closes the previous group. @default false |
| `value` | `string` | No | 제어되는 활성 값. |
| `defaultValue` | `string` | No | 비제어 시 초기 활성 값. |
| `onChange` | `(value: string) = void` | No |  |
| `renderLink` | `(item: SideNavItem \| SideNavChildItem, props: React.AnchorHTMLAttributes) = React.ReactElement` | No | href leaf를 router link로 치환하는 렌더 훅. 그룹 disclosure는 항상 button입니다. |
| `classNames` | `LdsClassNames` | No |  |
| `styles` | `LdsStyles` | No |  |
| `vars` | `LdsVars` | No |  |

## States

| State | Contract |
| --- | --- |
| footer | 하단 고정 영역. 함수면 overlay peek를 포함한 실제 내부 접힘 상태를 받습니다. |
| autoExpandActiveGroup | 활성 자식이 속한 disclosure 그룹을 초기 선택과 값 변경 때 자동으로 펼칩니다. false이면 활성 표시는 유지하되 그룹 열림은 사용자 상호작용과 독립됩니다. @default true |

## Behavior and interaction

- appearance — default(기본)는 기존 semantic color와 현재 theme를 픽셀 그대로 따릅니다. brand는 평면 브랜드 네이비 셸과 상태 잉크를 사용하는 theme-stable 컴포넌트 외형입니다. surface가 배치 geometry를, appearance가 SideNav 내부 색 역할만 소유하므로 두 축은 독립입니다. 알 수 없는 런타임 값은 default로 안전하게 돌아갑니다.
- collapsed / defaultCollapsed / onCollapsedChange — 제품이 접힘 상태를 소유하면 collapsed와 onCollapsedChange를 함께 사용하고, 비제어 초기값만 필요하면 defaultCollapsed를 사용합니다. controlled 상태는 부모가 prop을 갱신할 때만 시각적으로 바뀌므로 런타임 overlay 전환 때도 부모가 원하는 collapsed 값을 함께 갱신해야 합니다. 사용자별 영속화는 제품이 소유하고 SideNav는 브라우저 저장소를 읽거나 쓰지 않습니다.
- multiple — 기본 false는 한 번에 한 disclosure 그룹만 열리는 accordion 동작입니다. 다른 그룹이나 다른 최상위 목적지를 선택하면 기존에 열린 그룹을 닫고, 활성 자식이 바뀌면 해당 그룹만 엽니다. multiple={true}를 명시하면 여러 그룹을 동시에 열 수 있습니다.
- floating은 기존 SideNav의 border/radius와 overlay 확장 shadow를 유지합니다. docked는 앱 셸과 한 평면으로 읽히도록 상시·레일 상태에서 논리적 끝 divider만 사용하지만, overlay 패널이 콘텐츠 위로 펼쳐진 동안에는 floating과 같은 확장 shadow로 부유 위계를 표시하고 접히면 다시 평면으로 돌아갑니다. 두 표면은 항목의 padding, radius, fill, active marker를 공유합니다.
- WAI-ARIA Accordion pattern — 한 패널만 허용하는 accordion은 다른 헤더를 열 때 기존 패널을 닫고 aria-expanded를 실제 노출 상태와 동기화합니다. LDS의 기본 SideNav도 이 단일 열림 규칙을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 접힘 — 접기/펼치기 수단은 상단 바 시작 부분에 두는 외부 토글 하나뿐이며, collapsed/onCollapsedChange 제어 프롭으로 패널 상태를 구동합니다. side-first 셸에서는 본문 상단 바의 시작(shadcn/ui SidebarTrigger 배치), header-first 셸에서는 전폭 상단 바의 시작(Atlassian top-nav SideNavToggleButton 배치)입니다. 접기 토글을 사이드 패널 내부에 두지 않으며, SideNav는 자체 토글을 렌더하지 않습니다. |
| 명시 규칙 2 | header / headerCollapsed / footer — 브랜드는 Lockup 사용(inline 20px / mark 22px 권장). 푸터는 height 지정 시 바닥 고정. |
| 명시 규칙 3 | 펼쳐진 childList는 논리적 시작 방향에서 --space-3(12px)만큼 들어가 하위 목적지의 hover·선택 표면 자체를 부모 행보다 안쪽에 둡니다. 자식 라벨도 아이콘 유무와 관계없이 부모 라벨보다 12px 안쪽에서 시작하고 --label2-line(18px)을 사용합니다. 44px hit target과 현재 leaf 하나만 소유하는 선택 배경은 유지하며, 별도 connector·중첩 표면·active bar는 추가하지 않습니다. |
| 명시 규칙 4 | 내비게이션 disabled 표면은 wrapper opacity 0.45를 공통 문법으로 사용합니다. 개별 자식의 색 토큰을 다시 바꿔 이중으로 흐리게 만들지 않습니다. |
| --caption2-size | 11px |

## Responsive

- Width, rail width, padding, radius, and item geometry can be tuned only through the documented --lds-side-nav- variables. Navigation value, routing, and shell collapse controls remain product-owned.
- 접힌 레일과 펼친 패널은 SideNav가 소유하는 브랜드 아래 패딩 18px과 44px 목적지 행 높이를 공유합니다. header와 headerCollapsed 슬롯 자체의 intrinsic 높이는 제품이 맞추며, 레일에서는 label·badge가 사라지고 행의 가로 정렬만 바뀝니다.
- Carbon UI shell usage — 복잡한 제품 탐색은 header와 지속적인 left panel을 조합하고 좁은 폭에서는 탐색 표면을 전환합니다. 그래서 셸에 붙는 SideNav는 docked를, 독립 배치는 floating을 사용합니다.
- The collapsed item rail scrolls vertically with a hidden native scrollbar. Do not reduce or remove authorized destinations merely to fit a short viewport; preserve keyboard and wheel scrolling.

## Content and writing

- ref, className, and style target the native nav landmark.
- Stable parts are root, overlaySurface, panel, brand, list, heading, item, icon, label, badge, childList, and footer. Root and items expose stable collapsed/active state attributes.
- items — { value, label, ariaLabel?, icon, badge?, href?, disabled?, children? } + { heading } 섹션 헤딩. 자식도 icon?: ReactNode를 받을 수 있으며, 한 그룹에 아이콘이 하나라도 있으면 모든 자식에 고정 슬롯을 예약해 라벨 시작선을 맞춥니다. 항목 전체는 native ul/li 리스트(그룹 자식은 중첩 ul)로 렌더되어 보조기술이 항목 수와 계층을 읽을 수 있고, 시각은 기존과 동일합니다(list-style 없음).
- 타입 스케일 정합: 섹션 헤딩 10.5px → --caption2-size(11px, 스케일 하한; 대문자 letterSpacing 1px 유지), 자식 항목 13.5px → --label2-size(13px)로 스냅했습니다. 14px 부모 항목보다 1px 아래 위계는 그대로 유지됩니다.

## Accessibility

- renderLink — native anchor 대신 router link를 쓸 때만 제공합니다. renderLink={(item, { href, ...props }) = }처럼 DS가 만든 aria-current, disabled, style, activation 계약을 전달합니다.
- overlay — overlay peek는 공간이 제한된 데스크톱에서만 쓰는 선택 기능입니다. 비제어 SideNav에서 overlay가 런타임에 false → true로 바뀌면 레일로 접고, true → false로 돌아오면 overlay 진입 전의 persistent 접힘 상태를 복원합니다. 접힌 overlay는 hover뿐 아니라 키보드 focus 진입에서도 펼쳐지며 포인터와 focus가 모두 이탈하면 다시 접힙니다. 바깥 클릭과 Esc도 레일로 복귀시키고, Esc로 자식 항목이 사라질 때 focus는 레일에 남는 부모 항목으로 복구됩니다.
- autoExpandActiveGroup — 기본 true는 활성 자식의 그룹을 초기 선택과 값 변경 때 자동으로 엽니다. false이면 활성 값·부모의 현재 경로 잉크·자식을 열었을 때의 aria-current는 그대로 두고 disclosure open state만 사용자 조작과 분리합니다. 제품이 패널을 열 때 모든 그룹을 닫아 두고 싶다면 이 축을 끄되 현재 route를 지우지 않습니다.
- 지속 선택 표면은 aria-current="page"인 현재 leaf 목적지만 소유합니다. 현재 목적지는 LDS의 NavRail·TopBar와 같은 primary wash와 굵은 label을 사용하며 별도 시작 표시선은 추가하지 않습니다. 펼쳐진 부모는 배경을 유지하지 않고 chevron과 활성 자손을 뜻하는 강한 label/icon만 사용하며, pointer hover는 선택 표면보다 약한 neutral fill-alternative, pressed는 fill-normal, keyboard focus는 전역 focus ring으로 분리합니다.
- NavRail/BottomNav와 같은 icon, caption/label scale, primary surface/ink, aria-current="page"를 사용합니다. SideNav에만 섹션 heading, badge, 자식 indent, disclosure chevron, 펼친 panel width가 있습니다. 이는 계층 구조와 상태 수를 표현하기 위한 기능 차이입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `Lockup` | 대표 시나리오에서 조합 |
| `UserMenu` | 대표 시나리오에서 조합 |
| `Anchor` | 대표 시나리오에서 조합 |
| `BottomNav` | 대표 시나리오에서 조합 |
| `Breadcrumb` | 대표 시나리오에서 조합 |
| `Footer` | 대표 시나리오에서 조합 |
| `LanguageSwitcher` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--_lds-side-nav-focus-indicator`
- `--_lds-side-nav-pressed-surface`
- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-fill-strong`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--component-side-nav-brand-active-foreground`
- `--component-side-nav-brand-active-hover-surface`
- `--component-side-nav-brand-badge-active-surface`
- `--component-side-nav-brand-badge-foreground`
- `--component-side-nav-brand-badge-surface`
- `--component-side-nav-brand-divider`
- `--component-side-nav-brand-focus-indicator`
- `--component-side-nav-brand-foreground`
- `--component-side-nav-brand-hover-foreground`
- `--component-side-nav-brand-hover-surface`
- `--component-side-nav-brand-muted-foreground`
- `--component-side-nav-brand-pressed-surface`
- `--component-side-nav-brand-subtle-foreground`
- `--component-side-nav-brand-surface`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--label1-line`
- `--label1-size`
- `--label2-size`
- `--lds-side-nav-child-item-height`
- `--lds-side-nav-collapsed-width`
- `--lds-side-nav-item-height`
- `--lds-side-nav-item-radius`
- `--lds-side-nav-padding`
- `--lds-side-nav-radius`
- `--lds-side-nav-width`
- `--radius-lg`
- `--radius-pill`
- `--radius-xl`
- `--shadow-lg`
- `--space-0-5`
- `--space-1-5`
- `--space-2`
- `--space-2-5`
- `--space-3`
- `--space-4-5`

### Source contracts

- `components/navigation/SideNav.jsx`
- `components/navigation/SideNav.d.ts`
- `components/navigation/SideNav.prompt.md`
- `stories/NavigationSideNav.stories.jsx`

## Migration

- surface — floating(기본)은 독립 패널용 전체 outline·--radius-xl을 유지합니다. 제품 셸의 지속적인 주 탐색에는 docked를 사용합니다. docked는 외곽 radius·shadow·전체 outline 없이 논리적 끝 divider만 남겨 콘텐츠와 경계를 표시합니다. 기본값은 기존 소비자의 시각 호환을 위해 floating입니다.

## Sources

- SideNav prompt contract: `components/navigation/SideNav.prompt.md`
- Storybook implementation evidence: `stories/NavigationSideNav.stories.jsx`
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/)
- [Carbon UI shell left panel style](https://carbondesignsystem.com/components/UI-shell-left-panel/style/)
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
- [WAI-ARIA Accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)
- [Carbon UI shell left panel accessibility](https://preview.carbondesignsystem.com/building-blocks/core/components/ui-shell-left-panel/accessibility)
- [Atlassian navigation system layout](https://atlassian.design/components/navigation-system/layout/examples)
- [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/base/sidebar)
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
