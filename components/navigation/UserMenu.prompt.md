# UserMenu

Implementation note: `viewportPadding` controls the inline popover viewport clamp inset in pixels. The default `12` keeps docked SideNav footer menus aligned with their account trigger. Pointer opening keeps focus on the trigger; keyboard opening enters the first command so the two surfaces do not compete for emphasis.

Classification: **LK Product Extension**. 대시보드에서 `SideNav` 푸터에 배치하는 계정 액션이며, 위로 열리는 구조이므로 TopBar의 계정 메뉴나 전역 내비게이션으로 사용하지 않습니다.

사이드바 푸터용 계정 행. 아바타 + 이름/역할 + 셰브론이 트리거이고, 계정 메뉴가 **위로** 열립니다. SideNav의 `collapsed`와 같은 값을 넘기면 접힌 레일에서 아바타만 남습니다.

```jsx
const [col, setCol] = React.useState(false);
<SideNav
  collapsible collapsed={col} onCollapsedChange={setCol}
  footer={
    <UserMenu
      name="김도윤" detail="관리자" status="online" collapsed={col}
      items={[
        { label: '프로필', onClick: openProfile },
        { label: '환경설정' },
        { divider: true },
        { label: '로그아웃', danger: true, onClick: signOut },
      ]}
    />
  }
  items={...}
/>
```

- 타입 스케일 정합: 항목 13.5px → `--label2-size`(13px), 상세 11.5px → `--caption1-size`(12px)로 스냅했습니다. 이름(13px bold)과의 위계는 굵기·색으로 유지됩니다.
- 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다.
  열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정
  trigger로 초점을 복원합니다. menu는 trigger id를 `aria-labelledby`로 참조하고 Tab은 메뉴를
  닫고 다음 문서 순서로 이동합니다. 항목 하이라이트는 hover와 키보드 focus에서 동일하게
  적용되어 초점 위치가 시각적으로 드러납니다. `collapsed`(아바타 전용) trigger도 같은 키보드
  계약으로 열립니다.
- SideNav footer라는 위치 근거 때문에 Dropdown Menu와 달리 위쪽을 선호합니다. 공간이 부족하면
  아래로 flip하고 좌우 viewport를 clamp하지만, 이 배치 차이는 계정 메뉴의 고정 위치 때문에 유지합니다.
- Menu shell은 Dropdown Menu와 같은 elevated surface, r16, 8px/20px padding, shadow-md를 사용합니다.

### 외부 기준과 적용 결론

- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) — trigger의
  `aria-haspopup`·`aria-expanded`와 열림 시 메뉴 항목 초점 이동을 적용했습니다.
- [React Aria Menu](https://react-aria.adobe.com/Menu) — menu item은 텍스트·장식 아이콘만
  포함하고 방향키 탐색을 제공하며 disabled item은 탐색·활성화에서 제외합니다.
