**SideNav** — 넓은 라벨형 대시보드 사이드바(브랜드 헤더 + 그룹 내비 + 서브메뉴 + 접힘 레일 + 고정 푸터).

Classification: **LK Product Extension**. WDS Navigation의 Category, Tab, Page Indicator, Pagination과 별개이며 데스크톱 제품 셸에서만 사용합니다.

대시보드·관리 제품의 주 탐색으로 `UserMenu`를 푸터에 조합합니다. TopBar가 함께 있으면 전역 utility만 담당하게 하고 로고·경로를 중복하지 않으며, 평면형 대안인 `NavRail`과 동시에 주 탐색으로 사용하지 않습니다.

```jsx
<SideNav
  defaultValue="docs-overview" onChange={setTab}
  surface="docked" collapsible
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

- **items** — `{ value, label, ariaLabel?, icon, badge?, href?, disabled?, children? }` + `{ heading }` 섹션 헤딩. `href` leaf는 native anchor, `href`가 없는 leaf는 기존 선택 button입니다. `children`이 있으면 이동하지 않는 디스클로저 button(펼침/접힘, 활성 자식이면 부모가 잉크색)입니다. 아이콘은 장식으로 처리되며, 복합 ReactNode `label`은 접힌 레일에서도 이름이 남도록 `ariaLabel`을 제공합니다. **value / defaultValue / onChange**.
- **renderLink** — native anchor 대신 router link를 쓸 때만 제공합니다. `renderLink={(item, { href, ...props }) => <RouterLink to={href} {...props} />}`처럼 DS가 만든 `aria-current`, disabled, style, activation 계약을 전달합니다.
- **surface** — `floating`(기본)은 독립 패널용 전체 outline·`--radius-xl`을 유지합니다. 제품 셸의 지속적인 주 탐색에는 `docked`를 사용합니다. docked는 외곽 radius·shadow·전체 outline 없이 논리적 끝 divider만 남겨 콘텐츠와 경계를 표시합니다. 기본값은 기존 소비자의 시각 호환을 위해 floating입니다.
- **접힘** — 제품 셸의 정식 접기/펼치기 수단은 `collapsible`의 명시적 토글입니다. 접히면 아이콘 레일(`collapsedWidth` 기본 64): 라벨→툴팁, 배지→도트, 헤딩→헤어라인, 브랜드→`headerCollapsed`. `overlay` peek는 공간이 제한된 데스크톱에서만 쓰는 선택 기능이며 단독 탐색 수단이 아닙니다. 접힌 overlay는 hover뿐 아니라 키보드 focus 진입에서도 펼쳐지고 포인터와 focus가 모두 이탈하면 다시 접힙니다. 바깥 클릭과 Esc도 레일로 복귀시키며, Esc로 자식 항목이 사라질 때 focus는 레일에 남는 부모 항목으로 복구됩니다.
- **collapsed / defaultCollapsed / onCollapsedChange** — 제품이 접힘 상태를 소유하면 `collapsed`와 `onCollapsedChange`를 함께 사용하고, 비제어 초기값만 필요하면 `defaultCollapsed`를 사용합니다.
- **header / headerCollapsed / footer** — 브랜드는 `Lockup` 사용(inline 20px / mark 22px 권장). 푸터는 `height` 지정 시 바닥 고정.
- 활성은 시안 워시 + 시그널 잉크. 고정 아이콘 레일은 `NavRail`, 모바일 하단은 `BottomNav`.
- 타입 스케일 정합: 섹션 헤딩 10.5px → `--caption2-size`(11px, 스케일 하한; 대문자 letterSpacing 1px 유지), 자식 항목 13.5px → `--label2-size`(13px)로 스냅했습니다. 14px 부모 항목보다 1px 아래 위계는 그대로 유지됩니다.

### 내부 시각 차이 점검

- `NavRail`/`BottomNav`와 같은 icon, caption/label scale, primary surface/ink, `aria-current="page"`를 사용합니다. SideNav에만 섹션 heading, badge, 자식 indent, disclosure chevron, 펼친 panel width가 있습니다. 이는 계층 구조와 상태 수를 표현하기 위한 기능 차이입니다.
- anchor와 button은 동일한 padding, radius, fill, hover, focus, disabled 시각을 공유합니다. 링크라는 이유로 underline, 별도 edge line, shadow를 추가하지 않습니다.
- `floating`은 기존 SideNav의 border/radius와 overlay 확장 shadow를 유지합니다. `docked`는 앱 셸과 한 평면으로 읽히도록 논리적 끝 divider만 사용하고 overlay에서도 shadow를 만들지 않습니다. 두 표면은 항목의 padding, radius, fill, active marker를 공유합니다.

### 외부 기준과 적용 결론

- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — 복잡한 제품 탐색은 header와 지속적인 left panel을 조합하고 좁은 폭에서는 탐색 표면을 전환합니다. 그래서 셸에 붙는 SideNav는 docked를, 독립 배치는 floating을 사용합니다.
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 목적지는 link, category는 펼침/접힘이며 category 자체는 이동하지 않습니다. 축소 가능 내비게이션도 명시적인 제어를 제공하므로 LDS는 `collapsible`을 정식 수단으로 두고 hover peek를 선택 기능으로 제한합니다.
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — `<nav>` landmark와 명확한 accessible name을 유지합니다. 현재 목적지는 `aria-current="page"`로 노출하고, 키보드 focus 진입·이탈과 Esc 뒤에도 초점을 잃지 않습니다.

라우터 생성, URL 동기화, 권한에 따른 item 제거, 접힘 상태 영속화는 제품이 소유합니다.
