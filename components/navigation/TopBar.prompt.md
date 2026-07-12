**TopBar** — 상단 앱 바: 좌측 브랜드 슬롯, 가운데 내비(children), 우측 액션 슬롯. 헤어라인 베이스; `sticky`는 프로스티드 블러로 고정, `dark`는 네이비 마스트헤드.

Classification: **LK Product Extension**. 랜딩·콘텐츠 사이트에서는 전역 탐색으로 전체형 `Footer`와 조합합니다. `SideNav`와 함께 쓸 때는 검색·알림·제품 전환 같은 전역 utility만 두고, 로고와 제품 내부 경로를 양쪽에 중복하지 않습니다.

```jsx
<TopBar navAlign="center" brand={<Lockup variant="inline" height={22} />} actions={<Button size="sm">새 항목</Button>}>
  <TopBarNavItem active menuItems={[{ label: '문서' }, { label: '컴포넌트' }]}>문서</TopBarNavItem>
  <TopBarNavItem>토큰</TopBarNavItem>
  <TopBarNavItem>가이드</TopBarNavItem>
</TopBar>
<TopBar dark sticky brand={<Lockup variant="inline" tone="white" height={22} />} />
```

- 내비는 기본적으로 `TopBarNavItem`을 사용하면 기존 TopBar 카드의 active underline/dropdown 처리를 유지한다. 액션은 `Button`/`IconButton`/`Avatar`로 구성. **height** 기본 64px. **bordered={false}**로 하단 헤어라인 제거.
- **의도적 한계** — 모바일용 접힘 내비·햄버거 트리거를 제공하지 않습니다. 좁은 화면 전환은 제품 셸이 별도로 책임지며, 현재 TopBar를 완성된 모바일 랜딩 헤더로 간주하지 않습니다.
- 타입 스케일 정합: 주 내비 링크 14.5px → `--body2-size`(15px)로 스냅했습니다. 주 내비는 위로 스냅해 14px 드롭다운 항목보다 위 위계를 유지합니다.
