**TopBar** — 상단 앱 바: 좌측 브랜드 슬롯, 가운데 내비(children), 우측 액션 슬롯. 헤어라인 베이스; `sticky`는 프로스티드 블러로 고정, `dark`는 네이비 마스트헤드.

```jsx
<TopBar navAlign="center" brand={<Lockup variant="inline" height={22} />} actions={<Button size="sm">새 항목</Button>}>
  <TopBarNavItem active menuItems={[{ label: '문서' }, { label: '컴포넌트' }]}>문서</TopBarNavItem>
  <TopBarNavItem>토큰</TopBarNavItem>
  <TopBarNavItem>가이드</TopBarNavItem>
</TopBar>
<TopBar dark sticky brand={<Lockup variant="inline" tone="white" height={22} />} />
```

- 내비는 기본적으로 `TopBarNavItem`을 사용하면 기존 TopBar 카드의 active underline/dropdown 처리를 유지한다. 액션은 `Button`/`IconButton`/`Avatar`로 구성. **height** 기본 64px. **bordered={false}**로 하단 헤어라인 제거.
