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

## 두 표면의 대비 계약

`UserMenu`는 한 컴포넌트가 **서로 다른 두 표면**에 걸쳐 있습니다. trigger는 호스트
사이드바 footer 위(=`SideNav appearance="brand"`면 네이비 다크 셸), 팝업 패널은 언제나
자신의 밝은 elevated 표면입니다. 따라서 각 표면이 독립적으로 대비를 만족해야 합니다.

| 요소 | 토큰 | 기본 대비 | brand footer 대비 |
| --- | --- | --- | --- |
| trigger 이름 | `--component-user-menu-label` → `label-normal` | 17.9:1 | 18.5:1 (white on `#05132B`) |
| trigger 상세·셰브론 | `--component-user-menu-detail`·`-indicator` | — | 7.5:1 |
| trigger 열림 배경 | `--component-user-menu-open-surface` | `primary-surface-normal` | brand hover surface |
| 팝업 일반 항목 | `--color-semantic-label-normal` | 17.9:1 | 동일(팝업은 항상 밝은 표면) |
| 팝업 danger 항목 | `--color-semantic-status-negative-text` | 7.0:1 | 동일 |

- **호스트는 `--color-semantic-label-*`를 재매핑하지 않습니다.** 팝업은 trigger와 같은
  DOM 스코프의 자손이므로 그 반전을 그대로 상속받아, 밝은 패널 위에 흰 글자(대비 1:1)를
  그리게 됩니다. 다크 표면에 얹을 때는 위 `--component-user-menu-*` 토큰만 재정의하세요.
- `SideNav appearance="brand"`는 footer 스코프에 이 네 토큰을 자동으로 심습니다. 소비 측
  추가 CSS는 필요 없습니다.
- danger 잉크는 상태 색상(`--color-semantic-status-negative`, 흰 배경에서 3.44:1로 AA 미달)이
  아니라 `DropdownMenu`와 같은 on-light 텍스트 토큰을 씁니다.

### 외부 기준과 적용 결론

- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/) — trigger의
  `aria-haspopup`·`aria-expanded`와 열림 시 메뉴 항목 초점 이동을 적용했습니다.
- [React Aria Menu](https://react-aria.adobe.com/Menu) — menu item은 텍스트·장식 아이콘만
  포함하고 방향키 탐색을 제공하며 disabled item은 탐색·활성화에서 제외합니다.
