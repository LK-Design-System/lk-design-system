# UserMenu

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
