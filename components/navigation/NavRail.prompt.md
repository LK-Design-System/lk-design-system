**NavRail** — 세로 아이콘+라벨 내비게이션 레일(데스크톱 사이드 내비).

Classification: **LK Product Extension**. 동등한 중요도의 평면형 주요 목적지 3–5개에 사용하고, 같은 목적지 집합의 모바일 표현은 `BottomNav`로 전환합니다. 같은 목적지 층을 `NavRail`과 계층형 `SideNav`로 중복해 주 탐색으로 쓰지 않습니다. `DashboardShell topology="rail-panel"`에서는 docked `NavRail`이 영역(1층)을, `ShellPanel` 안의 목록이 영역 안 목록(2층)을 맡으므로 함께 씁니다. 이때 패널 안 목록은 평면이고(디스클로저 그룹 없음), 패널 안에 SideNav 전체(브랜드, 푸터, 접힘)를 넣지 않습니다.

```jsx
<NavRail defaultValue="docs" onChange={setTab} items={[
  { value: 'docs', label: '문서', href: '/docs', icon: <Icon name="document" size={22} /> },
  { value: 'components', label: '컴포넌트', href: '/components', icon: <Icon name="layers" size={22} /> },
  { value: 'alerts', label: '알림', href: '/alerts', icon: <Icon name="bell" size={22} /> },
]} />
```

- **items** — `{ value, label, ariaLabel?, icon, href?, disabled? }`. `href`가 있으면 native anchor, 없으면 기존 선택 button입니다. **value / defaultValue / onChange**. 활성은 primary 틴트 면(`--color-semantic-primary-surface-strong`, hover는 `-normal`) + `label-normal` 잉크와 굵기입니다(코드 기준으로 정정, 2026-10-09; 이전 문구 「시안 워시 + 시그널 잉크」는 구현과 달랐습니다). 모바일에는 `BottomNav`를 쓰세요.
- **surface** — `floating`(기본)은 기존 68×60 카드형 레일입니다. `docked`는 `DashboardShell topology="rail-panel"`의 전체 높이 영역 레일입니다: 폭 64px(`--component-nav-rail-docked-width`, SideNav 접힌 레일과 같음), 항목 56×56(아이콘 20 + 간격 4 + 캡션 14 + 상하 9), 항목 간격 4px, 위아래 8px, 위 `header`(로고 홈 링크, 56px 블록)와 아래 `footer`(`UserMenu collapsed`, 56px 블록), 끝 구분선 1px, 카드 radius·테두리·그림자 없음. `drawer`는 같은 항목을 rail-panel 좁은 화면 드로어의 가로 행(아이콘 + 라벨, 40px)으로 그리며 보통 셸이 대신 렌더합니다.
- **appearance** — `default`는 primary 틴트 선택, `neutral`은 SideNav neutral과 같은 무채색 선택(`--component-nav-rail-neutral-*`, SideNav neutral 토큰과 같은 atomic 값: 채움 `cool-neutral-96` + `label-normal` + 굵기)입니다. rail-panel 셸은 `neutral`을 씁니다. floating의 기존 틴트는 호환을 위해 유지합니다(L-S3b).
- **docked 캡션** — 캡션은 늘 보입니다(레이블 표시 축을 두지 않음, L-S3). 말줄임이 생긴 캡션만 DS `Tooltip`(hover와 focus)으로 전체 이름을 보이고 native `title`은 쓰지 않습니다. Material 기본 `auto`(4개 이상이면 선택 항목만 라벨)와 의도적으로 다르며, 한국어 영역 이름의 발견성 때문입니다.
- **항목 수와 높이** — docked는 영역 3–7개입니다. 8개 이상이면 개발 경고를 냅니다. 높이 예산은 로고 56 + 위 8 + N×56 + (N−1)×4 + 아래 8 + 계정 56이며, 문서 높이 600px(1280×720 화면)에서 7개가 스크롤 없이 들어가야 합니다(`RailPanelMaxItems` story가 검사). 그보다 낮은 창이나 확대에서만 목록이 스크롤바 없이 wheel·keyboard로 스크롤됩니다(WCAG 1.4.10, `collapsed-navigation-rail` 스크롤바 예외 재사용, L-S8).
- **getItemCurrent** — 제품 라우트로 `aria-current`를 정합니다. 영역 첫 화면은 `'page'`, 영역 안 다른 화면은 `'true'`입니다. 생략하면 선택 항목이 `'page'`입니다. 레일 항목은 영역 첫 화면으로 가는 진짜 링크이며, 이동 없이 패널만 바꾸는 클릭은 두지 않습니다.
- **renderLink** — router 통합 시 `renderLink={(item, { href, ...props }) => <RouterLink to={href} {...props} />}`로 native anchor만 치환합니다.
- 긴 label은 68px 레일 안에서 한 줄 ellipsis로 줄이고 `title`/`ariaLabel`로 전체 이름을 유지합니다. 아이콘은 장식으로 처리합니다.
- 레일 외곽은 `fit-content`라 Grid/Flex 자식으로 배치해도 남는 가로 공간까지 카드 표면이 늘어나지 않습니다.

### 내부 시각 차이 점검

- `BottomNav`와 동일한 icon+caption, primary ink, `aria-current="page"`를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다.
- `SideNav`의 섹션 heading, 계층 indent, badge, disclosure, panel shadow는 쓰지 않습니다. 평면 목적지 3–5개만 보여주기 때문입니다.
- anchor와 button의 padding, radius, fill, color, disabled opacity는 같습니다. 링크 전환 때문에 underline이나 별도 테두리를 만들지 않습니다.

- docked는 floating과 같은 icon+caption 해부, `aria-current`, 링크·버튼 동일 시각을 유지하고, 폭·항목 크기·카드 chrome 제거·끝 구분선·neutral 선택만 다릅니다. 전체 높이 셸 열이 되므로 카드 테두리를 없애고 SideNav docked와 같은 끝 구분선을 씁니다. 포커스는 SideNav처럼 항목 안쪽(`outline-offset: -2px`)에 그려 목록 가장자리에서 잘리지 않습니다.

### 외부 기준과 적용 결론

- [Material Components NavigationRail](https://github.com/material-components/material-components-android/blob/master/docs/components/NavigationRail.md) — 접힌 레일은 앱 목적지 3–7개이고 위에 로고나 FAB를 header로 고정할 수 있습니다. docked 레일 상한 7과 로고 header의 근거입니다. 라벨 기본값 auto는 따르지 않습니다(위 docked 캡션).

- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 주 목적지는 실제 link로 제공하고 짧고 스캔 가능한 이름을 사용하며 좁은 화면에서는 다른 표면으로 전환합니다.
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — shell 탐색과 global utility를 분리합니다. NavRail은 제품 내부의 평면 주 탐색만 담당합니다.
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — `<nav>` landmark와 `aria-current="page"`를 유지합니다. `nav`의 기본 `aria-label`은 `'주 탐색'`이며 소비자가 전달한 `aria-label`이 우선합니다.

라우터 인스턴스, 목적지 권한 판정, NavRail↔BottomNav 전환은 소비자 셸이 소유합니다.
