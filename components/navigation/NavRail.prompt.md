**NavRail** — 세로 아이콘+라벨 내비게이션 레일(데스크톱 사이드 내비).

Classification: **LK Product Extension**. 동등한 중요도의 평면형 주요 목적지 3–5개에 사용하고, 같은 목적지 집합의 모바일 표현은 `BottomNav`로 전환합니다. 계층형 `SideNav`와 동시에 주 탐색으로 사용하지 않습니다.

```jsx
<NavRail defaultValue="docs" onChange={setTab} items={[
  { value: 'docs', label: '문서', href: '/docs', icon: <Icon name="document" size={22} /> },
  { value: 'components', label: '컴포넌트', href: '/components', icon: <Icon name="layers" size={22} /> },
  { value: 'alerts', label: '알림', href: '/alerts', icon: <Icon name="bell" size={22} /> },
]} />
```

- **items** — `{ value, label, ariaLabel?, icon, href?, disabled? }`. `href`가 있으면 native anchor, 없으면 기존 선택 button입니다. **value / defaultValue / onChange**. 활성은 시안 워시 + 시그널 잉크. 모바일에는 `BottomNav`를 쓰세요.
- **renderLink** — router 통합 시 `renderLink={(item, { href, ...props }) => <RouterLink to={href} {...props} />}`로 native anchor만 치환합니다.
- 긴 label은 68px 레일 안에서 한 줄 ellipsis로 줄이고 `title`/`ariaLabel`로 전체 이름을 유지합니다. 아이콘은 장식으로 처리합니다.
- 레일 외곽은 `fit-content`라 Grid/Flex 자식으로 배치해도 남는 가로 공간까지 카드 표면이 늘어나지 않습니다.

### 내부 시각 차이 점검

- `BottomNav`와 동일한 icon+caption, primary ink, `aria-current="page"`를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다.
- `SideNav`의 섹션 heading, 계층 indent, badge, disclosure, panel shadow는 쓰지 않습니다. 평면 목적지 3–5개만 보여주기 때문입니다.
- anchor와 button의 padding, radius, fill, color, disabled opacity는 같습니다. 링크 전환 때문에 underline이나 별도 테두리를 만들지 않습니다.

### 외부 기준과 적용 결론

- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 주 목적지는 실제 link로 제공하고 짧고 스캔 가능한 이름을 사용하며 좁은 화면에서는 다른 표면으로 전환합니다.
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — shell 탐색과 global utility를 분리합니다. NavRail은 제품 내부의 평면 주 탐색만 담당합니다.
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — `<nav>` landmark와 `aria-current="page"`를 유지합니다.

라우터 인스턴스, 목적지 권한 판정, NavRail↔BottomNav 전환은 소비자 셸이 소유합니다.
