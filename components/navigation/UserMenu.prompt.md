# UserMenu

사이드바 푸터용 계정 행. 아바타 + 이름/역할 + 셰브론이 트리거이고, 계정 메뉴가 **위로** 열립니다. SideNav의 `collapsed`와 같은 값을 넘기면 접힌 레일에서 아바타만 남습니다.

```jsx
const [col, setCol] = React.useState(false);
<SideNav
  collapsible collapsed={col} onCollapsedChange={setCol}
  footer={
    <UserMenu
      name="김도윤" detail="관제 어드민" status="online" collapsed={col}
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
