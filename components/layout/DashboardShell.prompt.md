**DashboardShell** — 제품 대시보드의 상단 바, 넓은 화면 탐색, 본문, 좁은 화면 탐색을 한 개의 landmark·반응형 계약으로 조합합니다.

Classification: **LK Product Extension**. WDS Core 축이 아니며 제품 셸 조합입니다. 화면별 데이터 fetching이나 앱 라우팅을 포함하지 않습니다.

```jsx
<DashboardShell
  header={<TopBar brand={<Lockup />} actions={<UserMenu />} />}
  navigation={<SideNav items={items} />}
  narrowNavigation={<BottomNav items={compactItems} />}
>
  <Container size="wide">…</Container>
</DashboardShell>
```

- 의미·키보드 순서는 **본문 건너뛰기 → header/banner → 넓은 주 탐색 → main → 좁은 주 탐색**입니다. CSS로 숨겨진 탐색 슬롯은 접근성 트리에서도 제외됩니다.
- **header**는 자체 `header`/banner landmark를 소유해야 하며 LDS에서는 `TopBar`를 사용합니다. 셸이 다시 `<header>`로 감싸지 않아 중첩 landmark를 만들지 않습니다.
- **navigation**과 **narrowNavigation**은 자체 `<nav>`를 소유하는 `SideNav`/`NavRail`과 `BottomNav`를 전달합니다. 소비자가 이름을 주지 않으면 셸이 `주 탐색`을 제공합니다.
- `narrowNavigation`을 생략해도 `layout="auto"`가 기존 `navigation`을 숨기지 않습니다. 좁은 화면에서는 wide navigation을 본문 앞 한 행에 유지해 탐색이 조용히 사라지는 실패를 막습니다. 최적화된 모바일 표현이 필요하면 `BottomNav`를 명시합니다.
- **layout** — `auto`는 LDS의 `sm=768px` 아래에서 좁은 구성을 사용합니다. Storybook과 테스트에서는 `wide`/`narrow`로 상태를 결정적으로 고정할 수 있습니다.
- `main`은 하나만 렌더링하고 `tabIndex={-1}`과 안정적인 id를 가져 skip link의 실제 focus 목적지가 됩니다. `mainLabel`은 같은 문서에 여러 셸이 있는 검증 fixture에서만 명시합니다.
- 좁은 탐색 래퍼는 하단 safe area를 적용합니다. `BottomNav` 자체는 고정 위치나 safe area를 소유하지 않습니다.

### 내부 시각 차이 점검

- `TopBar`, `SideNav`, `NavRail`, `BottomNav`의 control/icon 크기, typography, radius, border, fill, active/focus/disabled 처리를 그대로 유지합니다.
- 셸 자체는 카드, edge line, inset border, radius, shadow를 추가하지 않습니다. 배경은 기존 페이지 canvas 토큰만 사용합니다.
- 넓은 구성은 `auto + minmax(0, 1fr)`, 좁은 구성은 단일 본문 열과 하단 탐색 행입니다. 이 배치 차이는 탐색 공간을 확보하기 위한 기능적 차이이며 새로운 장식 언어가 아닙니다.
- `Container`의 page margin과 최대 폭, `PageHeader`의 본문 위계, `DashboardGrid`의 카드 간격은 각각 해당 컴포넌트가 소유합니다.

### 외부 기준과 적용 결론

- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/) — 지속적인 header, 선택적인 left panel, product→global 순서를 분리하고 좁은 폭에서는 header link를 left navigation으로 이동합니다. LDS 셸도 header와 제품 탐색을 별도 슬롯으로 유지합니다.
- [Carbon UI shell accessibility](https://carbondesignsystem.com/components/UI-shell-header/accessibility/) — 첫 keyboard 항목으로 skip-to-main을 제공하고 native `header` 구조를 사용합니다. LDS도 보이는 focus skip link와 실제 focus 가능한 main 목적지를 제공합니다.
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 주 탐색은 쉽게 접근 가능하되 좁은 화면에서 다른 표면으로 전환하고, 복잡한 계층은 단순 nav에 넣지 않습니다. LDS는 같은 평면 목적지를 NavRail↔BottomNav로, 계층 목적지는 SideNav로 구분합니다.
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — `header`, `nav`, `main`을 논리적 최상위 영역으로 두고 한 문서의 main을 하나로 유지합니다.

의도적 제외: 라우터 인스턴스, 인증·권한 판정, drawer open state, URL 동기화, 데이터 새로고침, 사용자별 셸 저장은 제품이 소유합니다. `DashboardShell`은 슬롯 배치와 landmark, skip link, 반응형 전환만 소유합니다.
