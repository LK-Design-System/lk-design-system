**SideNav** — 넓은 라벨형 대시보드 사이드바(브랜드 헤더 + 그룹 내비 + 서브메뉴 + 접힘 레일 + 고정 푸터).

```jsx
<SideNav
  defaultValue="docs-overview" onChange={setTab}
  overlay collapsed={collapsed} onCollapsedChange={setCollapsed}
  header={<Lockup variant="inline" color="var(--label-normal)" height={24} />}
  headerCollapsed={<Lockup variant="mark" color="var(--label-normal)" height={20} />}
  items={[
    { heading: '문서' },
    { value: 'dash', label: '대시보드', icon: <Icon name="home" size={19} /> },
    { value: 'docs', label: '문서', icon: <Icon name="document" size={19} />, children: [
      { value: 'docs-overview', label: '개요', badge: '8' },
      { value: 'docs-components', label: '컴포넌트' },
    ] },
    { value: 'events', label: '이벤트', icon: <Icon name="bell" size={19} />, badge: '5' },
  ]}
/>
```

- **items** — `{ value, label, icon, badge?, disabled?, children? }` + `{ heading }` 섹션 헤딩. `children`이 있으면 디스클로저 그룹(펼침/접힘, 활성 자식이면 부모가 잉크색). **value / defaultValue / onChange**.
- **접힘** — 앱 셸에서는 `overlay` + `collapsed/onCollapsedChange`를 권장합니다. 접힌 레일에서 hover-in 시 펼쳐지고 hover-out, 바깥 클릭, Esc에서 다시 접힙니다. 명시적 토글이 필요한 관리 화면에서만 `collapsible`를 켭니다. 접히면 아이콘 레일(`collapsedWidth` 기본 64): 라벨→툴팁, 배지→도트, 헤딩→헤어라인, 브랜드→`headerCollapsed`.
- **header / headerCollapsed / footer** — 브랜드는 `Lockup` 사용(inline 20px / mark 22px 권장). 푸터는 `height` 지정 시 바닥 고정.
- 활성은 시안 워시 + 시그널 잉크. 고정 아이콘 레일은 `NavRail`, 모바일 하단은 `BottomNav`.
