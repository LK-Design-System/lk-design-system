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

### 사용하지 않음

- 접힌 레일의 점은 실제 badge만 뜻합니다. 활성 자손은 부모 아이콘의 강한 잉크로만 표시해 동일한 점이 상태와 현재 위치를 동시에 뜻하지 않게 합니다.
- Carbon UI shell left panel style — sub-menu hover와 sub-menu item selected를 별도 상태로 정의합니다. LDS도 펼침·hover·현재 위치의 상태 분리는 따르되, Carbon의 4px interactive border는 내부 NavRail·TopBar 선택 문법과 맞지 않아 채택하지 않고 현재 leaf의 선택 배경만 유지합니다.
- 대시보드·관리 제품의 주 탐색으로 UserMenu를 푸터에 조합합니다. TopBar가 함께 있으면 전역 utility만 담당하게 하고 로고·경로를 중복하지 않으며, 평면형 대안인 NavRail과 동시에 주 탐색으로 사용하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| aria-label | nav landmark의 접근 가능한 이름. @default '사이드 탐색' |
| header | 상단 브랜드 영역(예: ). |
| headerCollapsed | 접힌 상태의 브랜드(예: ). 없으면 header를 그대로 사용. |
| footer | 하단에 고정되는 푸터. |
| renderLink | href leaf를 router link로 치환하는 렌더 훅. 그룹 disclosure는 항상 button입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `Array` | Yes | 내비 항목·서브메뉴·섹션 헤딩을 섞은 배열. 항목은 native ul/li 리스트로 렌더되고 그룹의 자식은 중첩 리스트가 됩니다. |
| `aria-label` | `string` | No | nav landmark의 접근 가능한 이름. @default '사이드 탐색' |
| `header` | `React.ReactNode` | No | 상단 브랜드 영역(예: ). |
| `headerCollapsed` | `React.ReactNode` | No | 접힌 상태의 브랜드(예: ). 없으면 header를 그대로 사용. |
| `footer` | `React.ReactNode` | No | 하단에 고정되는 푸터. |
| `width` | `number \| string` | No | 펼친 폭. @default 240 |
| `surface` | `'floating' \| 'docked'` | No | 외곽 표면. floating은 전체 outline과 radius를, docked는 논리적 끝 divider만 사용합니다. @default 'floating' |
| `collapsed` | `boolean` | No | 제어되는 접힘 상태. 접기 토글은 셸의 상단 바에 두고 이 프롭으로 패널을 구동합니다. 상태 영속화는 SideNav가 아니라 소비 제품이 소유합니다. |
| `defaultCollapsed` | `boolean` | No | 비제어 시 초기 접힘. @default false |
| `onCollapsedChange` | `(collapsed: boolean) = void` | No | 다음 접힘 상태 요청. controlled 사용 시 부모가 collapsed를 갱신하기 전에는 시각 상태가 바뀌지 않습니다. |
| `collapsedWidth` | `number` | No | 접힌 아이콘 레일 폭. 기본 64px에서도 브랜드 마크와 경계 토글을 유지합니다. @default 64 |
| `overlay` | `boolean` | No | 오버레이 모드 — 레이아웃은 레일 폭 고정, 호버(피크)·키보드 초점·클릭으로 펼치면 패널이 콘텐츠 위로 뜨고, 마우스 아웃과 초점 이탈·바깥 클릭·Esc로 접힘. 시작은 접힘. @default false |
| `value` | `string` | No | 제어되는 활성 값. |
| `defaultValue` | `string` | No | 비제어 시 초기 활성 값. |
| `onChange` | `(value: string) = void` | No |  |
| `renderLink` | `(item: SideNavItem \| SideNavChildItem, props: React.AnchorHTMLAttributes) = React.ReactElement` | No | href leaf를 router link로 치환하는 렌더 훅. 그룹 disclosure는 항상 button입니다. |

## Behavior and interaction

- collapsed / defaultCollapsed / onCollapsedChange — 제품이 접힘 상태를 소유하면 collapsed와 onCollapsedChange를 함께 사용하고, 비제어 초기값만 필요하면 defaultCollapsed를 사용합니다. controlled 상태는 부모가 prop을 갱신할 때만 시각적으로 바뀌며, 사용자별 영속화는 제품이 소유하고 SideNav는 브라우저 저장소를 읽거나 쓰지 않습니다.
- floating은 기존 SideNav의 border/radius와 overlay 확장 shadow를 유지합니다. docked는 앱 셸과 한 평면으로 읽히도록 상시·레일 상태에서 논리적 끝 divider만 사용하지만, overlay 패널이 콘텐츠 위로 펼쳐진 동안에는 floating과 같은 확장 shadow로 부유 위계를 표시하고 접히면 다시 평면으로 돌아갑니다. 두 표면은 항목의 padding, radius, fill, active marker를 공유합니다.
- WAI Disclosure Navigation — 부모 button의 aria-expanded는 자식 노출 상태이고 leaf link의 aria-current="page"는 현재 위치입니다. LDS는 두 상태를 같은 persistent highlight로 합치지 않습니다.
- 라우터 생성, URL 동기화, 권한에 따른 item 제거, 접힘 상태 영속화는 제품이 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 접힘 — 접기/펼치기 수단은 상단 바 시작 부분에 두는 외부 토글 하나뿐이며, collapsed/onCollapsedChange 제어 프롭으로 패널 상태를 구동합니다. side-first 셸에서는 본문 상단 바의 시작(shadcn/ui SidebarTrigger 배치), header-first 셸에서는 전폭 상단 바의 시작(Atlassian top-nav SideNavToggleButton 배치)입니다. 접기 토글을 사이드 패널 내부에 두지 않으며, SideNav는 자체 토글을 렌더하지 않습니다. |
| 명시 규칙 2 | header / headerCollapsed / footer — 브랜드는 Lockup 사용(inline 20px / mark 22px 권장). 푸터는 height 지정 시 바닥 고정. |
| 명시 규칙 3 | 내비게이션 disabled 표면은 wrapper opacity 0.45를 공통 문법으로 사용합니다. 개별 자식의 색 토큰을 다시 바꿔 이중으로 흐리게 만들지 않습니다. |
| 명시 규칙 4 | 타입 스케일 정합: 섹션 헤딩 10.5px → --caption2-size(11px, 스케일 하한; 대문자 letterSpacing 1px 유지), 자식 항목 13.5px → --label2-size(13px)로 스냅했습니다. 14px 부모 항목보다 1px 아래 위계는 그대로 유지됩니다. |
| --caption2-size | 11px |

## Responsive

- Carbon UI shell usage — 복잡한 제품 탐색은 header와 지속적인 left panel을 조합하고 좁은 폭에서는 탐색 표면을 전환합니다. 그래서 셸에 붙는 SideNav는 docked를, 독립 배치는 floating을 사용합니다.
- Classification: LK Product Extension. WDS Navigation의 Category, Tab, Page Indicator, Pagination과 별개이며 데스크톱 제품 셸에서만 사용합니다.

## Content and writing

- items — { value, label, ariaLabel?, icon, badge?, href?, disabled?, children? } + { heading } 섹션 헤딩. 항목 전체는 native ul/li 리스트(그룹 자식은 중첩 ul)로 렌더되어 보조기술이 항목 수와 계층을 읽을 수 있고, 시각은 기존과 동일합니다(list-style 없음). href leaf는 native anchor, href가 없는 leaf는 기존 선택 button입니다.
- Fluent Nav usage — 목적지는 link, category는 펼침/접힘이며 category 자체는 이동하지 않습니다. 축소 가능 내비게이션도 상태를 설명하는 명시적인 제어를 제공하므로 LDS는 명시적 토글을 정식 수단으로 두고 hover peek를 선택 기능으로 제한합니다.
- SideNav — 넓은 라벨형 대시보드 사이드바(브랜드 헤더 + 그룹 내비 + 서브메뉴 + 접힘 레일 + 고정 푸터).

## Accessibility

- renderLink — native anchor 대신 router link를 쓸 때만 제공합니다. renderLink={(item, { href, ...props }) = }처럼 DS가 만든 aria-current, disabled, style, activation 계약을 전달합니다.
- overlay — overlay peek는 공간이 제한된 데스크톱에서만 쓰는 선택 기능입니다. 접힌 overlay는 hover뿐 아니라 키보드 focus 진입에서도 펼쳐지며 포인터와 focus가 모두 이탈하면 다시 접힙니다. 바깥 클릭과 Esc도 레일로 복귀시키고, Esc로 자식 항목이 사라질 때 focus는 레일에 남는 부모 항목으로 복구됩니다. 펼침 그림자는 TOKENGOVERNANCE.md의 elevation 규칙에 따라 콘텐츠를 실제로 덮는 inline-end 쪽에만 남기고 나머지 변은 clip-path로 잘라냅니다(엣지 부착 오버레이의 기준 구현).
- 지속 선택 표면은 aria-current="page"인 현재 leaf 목적지만 소유합니다. 현재 목적지는 LDS의 NavRail·TopBar와 같은 primary wash와 굵은 label을 사용하며 별도 시작 표시선은 추가하지 않습니다. 펼쳐진 부모는 배경을 유지하지 않고 chevron과 활성 자손을 뜻하는 강한 label/icon만 사용하며, pointer hover는 선택 표면보다 약한 neutral fill-alternative, pressed는 fill-normal, keyboard focus는 전역 focus ring으로 분리합니다.
- NavRail/BottomNav와 같은 icon, caption/label scale, primary surface/ink, aria-current="page"를 사용합니다. SideNav에만 섹션 heading, badge, 자식 indent, disclosure chevron, 펼친 panel width가 있습니다. 이는 계층 구조와 상태 수를 표현하기 위한 기능 차이입니다.
- anchor와 button은 동일한 padding, radius, fill, hover, focus, disabled 시각을 공유합니다. 링크 여부가 아니라 aria-current만 지속 선택 배경을 만들며, 링크라는 이유로 underline이나 shadow를 추가하지 않습니다.

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
      { value: 'docs-overview', label: '개요', href: '/docs', badge: '8' },
      { value: 'docs-components', label: '컴포넌트', href: '/docs/components' },
    ] },
    { value: 'events', label: '이벤트', icon: <Icon name="bell" size={19} />, badge: '5' },
  ]}
/>
```

## Tokens and API

### Tokens

- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--label1-line`
- `--label1-size`
- `--label2-size`
- `--radius-lg`
- `--radius-pill`
- `--radius-xl`
- `--shadow-lg`
- `--space-0-5`
- `--space-1-5`
- `--space-2-5`
- `--space-3`

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
- [Atlassian navigation system layout](https://atlassian.design/components/navigation-system/layout/examples)
- [shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/base/sidebar)
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
- [WAI Disclosure Navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)
