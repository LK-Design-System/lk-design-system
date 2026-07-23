**BottomNav** — 모바일 하단 탭 바(아이콘 + 라벨). 활성 탭은 시그널 잉크를 띱니다.

Classification: **LK Product Extension**. 동등한 중요도의 평면형 주요 목적지 3–5개에 사용하며, 같은 목적지 집합을 데스크톱 `NavRail`과 반응형으로 전환할 수 있습니다. `SideNav`와 동시에 주 탐색으로 사용하지 않습니다.

```jsx
<BottomNav defaultValue="home" onChange={setTab} items={[
  { value: 'home', label: '홈', href: '/', icon: <Icon name="home" size={22} /> },
  { value: 'docs', label: '문서', href: '/docs', icon: <Icon name="document" size={22} /> },
  { value: 'alerts', label: '알림', href: '/alerts', icon: <Icon name="bell" size={22} /> },
  { value: 'me', label: '내정보', href: '/me', icon: <Icon name="person" size={22} /> },
]} />
```

- **items** — `{ value, label, ariaLabel?, icon, href?, disabled? }`. `href`가 있으면 native anchor, 없으면 기존 선택 button입니다. **value / defaultValue / onChange** — 제어/비제어. 표준 바에는 `nav-*` 아이콘을 쓰세요.
- **renderLink** — router 통합 시 native anchor만 치환합니다. DS가 제공한 `aria-current`, disabled, 균등 폭, activation props를 그대로 전달하세요.
- 3–5개 목적지를 권장합니다. label은 한 줄 ellipsis이며 `title`/`ariaLabel`로 전체 이름을 유지합니다.
- **의도적 한계** — safe-area와 화면 하단 고정은 소비자 셸의 책임입니다. 컨테이너에서 `--mobile-safe-area-bottom`을 적용합니다.

### 내부 시각 차이 점검

- `NavRail`과 같은 icon+caption, primary ink, `aria-current="page"`, disabled opacity를 사용합니다. BottomNav에만 상단 hairline과 균등 가로 분할이 있으며, 화면 하단 표면의 경계를 전달하는 기능적 차이입니다.
- `SideNav`의 outer card border/radius, hierarchy, badge, disclosure는 쓰지 않습니다. 같은 화면에서 두 주 탐색을 동시에 렌더하지 않습니다.
- anchor와 button은 같은 크기·색·간격을 사용하고 링크 기본 underline을 제거합니다.

### 외부 기준과 적용 결론

- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 좁은 화면에서 주 탐색 표면을 전환하고 label을 짧고 스캔 가능하게 유지합니다.
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — responsive shell은 좁은 폭에서 desktop navigation을 대체 표면으로 옮깁니다. LDS는 DashboardShell에서 NavRail/SideNav를 숨기고 BottomNav를 보입니다.
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — native `<nav>`와 현재 페이지 link의 `aria-current="page"`를 유지합니다. `nav`의 기본 `aria-label`은 `'주 탐색'`이며 소비자가 전달한 `aria-label`이 우선합니다.

라우터, 현재 URL 계산, safe-area 적용, sticky/fixed 위치와 권한 판정은 소비자 셸이 소유합니다.
