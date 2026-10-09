**ShellPanel** — `DashboardShell topology="rail-panel"`의 맥락 패널. 레일이 고른 영역 안의 긴 목록 하나를 고정 머리, 주 동작 행, 고정 구역, 스크롤 구역 하나로 보여 줍니다.

Classification: **LK Product Extension · Operations Dashboard**. 기존 `SideNav`·`NavRail`·`ScrollArea`·`ListCell`의 해부를 조합하며 새 디자인 언어를 만들지 않습니다. 화면 템플릿이나 목록 데이터를 포함하지 않습니다.

## 승인된 동작 행 개정 (D02, 2026-10-09)

D01의 `density="compact"`는 패널 제목 label1(14px/20px)과 header 최소40px를 공개합니다.
기본 comfortable의 제목16px/header56px는 유지합니다. children의 목적지 행은
`ListCell typography="small" verticalPadding="small" paddingX="var(--space-2)"`로 조합합니다.
8px 외곽 inset + 8px 행 padding은 ConversationList와 같은 16px 글자 시작점을 만듭니다.
다른 child 컴포넌트의 밀도를 숨겨서 바꾸거나 Core→Product 의존을 만들지 않습니다.

주 동작은 목적지 선택과 구분해 36px/14px과 투명한 idle background를 사용합니다.
`primaryAction.current`의 aria-current는 유지하고 semibold로 current를 표시합니다.
hover·pressed·keyboard focus는 기존 token, forced-colors는 Highlight 잉크와 bold입니다.
ConversationList의 36px/14px과 ListCell small을 비교했고 레일 영역 선택은 그대로 둡니다.
기존 40px·selected fill 결정을 36px·quiet action으로 개정합니다.
외부 근거와 비교는 [소스 검토 기록](../../docs/handoff/2026-10-09-portal-density-source-review.md)에 있습니다.

```jsx
<DashboardShell
  topology="rail-panel"
  navigation={<NavRail surface="docked" appearance="neutral" aria-label="주요 영역" items={areas} header={<HomeMark />} footer={<UserMenu collapsed … />} />}
  panel={(
    <ShellPanel
      title="질문"
      actions={<IconButton variant="plain" label="대화 검색"><Icon name="search" /></IconButton>}
      primaryAction={{ label: '새 질문', icon: <Icon name="plus" />, href: '/', current: isNewQuestion }}
      scrollRegion={<ConversationList groups={groups} currentId={conversationId} itemActions={actions} onItemAction={run} />}
    />
  )}
  panelOpen={panelOpen}
  onPanelOpenChange={setPanelOpen}
  panelId="question-panel"
  panelReturnFocusRef={toggleRef}
>
  …
</DashboardShell>
```

## 해부 (DOM 순서와 같음)

1. **머리**(56px, 고정): 제목(`h2` 기본, `headingLevel`)과 오른쪽 `actions`(아이콘 버튼 최대 2개, 넘치면 개발 경고). 접기 토글은 두지 않습니다. 토글은 셸 상단 바 시작에 하나만 둡니다(`SideNav`와 같은 원칙).
2. **주 동작 행**(선택, 고정): `primaryAction` 객체는 목록 행과 같은 해부(아이콘 + 라벨, 36px)의 링크입니다. 해당 화면이면 `current: true`로 `aria-current="page"`와 semibold를 받으며 평소 배경은 투명합니다. 노드를 직접 넘길 수도 있지만 행 해부는 제품 책임이 됩니다.
3. **고정 구역**(선택, `children`): 고정한 대화처럼 짧고 스크롤하지 않는 목록.
4. **스크롤 구역**(`scrollRegion`, 0개 또는 1개): `ScrollArea scrollbar="compact" gutter="stable"`이며 `data-scroll-region`을 가집니다. 스크롤될 때만 위쪽 경계선이 나타납니다. 이름은 `{title} 목록`(목록 nav의 이름과 겹치지 않게)이고 `scrollRegionLabel`로 바꿀 수 있습니다.
5. **꼬리**(선택): 계정은 레일에 있으므로 비우기를 권장합니다.

- `renderLink`는 `primaryAction.href` 링크를 router link로 치환하는 훅입니다.
- `titleId`로 제목 id를 지정할 수 있고, 생략하면 생성합니다. 안의 목록은 context로 이 id를 받아 nav 이름으로 씁니다.
- 패널은 랜드마크가 아닙니다. 안의 목록(`ConversationList`)이 패널 제목을 `aria-labelledby`로 쓰는 `nav`가 됩니다. 레일 nav와 이름이 같으면 `DashboardShell`이 개발 경고를 냅니다.
- 폭은 셸이 소유합니다(`--component-shell-panel-width` 240px, SideNav 기본 폭과 같음). 제품은 `--lds-dashboard-shell-panel-width`로 224–288px 사이에서만 조정합니다. 패널 안 콘텐츠는 그 폭을 채웁니다. 크기 조절 핸들은 두지 않습니다.
- 표면은 SideNav neutral과 같은 navy-wash 면(`--component-shell-panel-surface`)과 1px 끝 구분선이며 그림자는 없습니다. 좁은 범위 overlay에서만 셸이 덮는 쪽 그림자를 둡니다.
- 좁은 화면에서는 셸이 같은 패널을 드로어 안 영역 행 아래에 그립니다. 그때는 Drawer 본문이 영역·패널·계정 전체의 유일한 세로 스크롤을 소유합니다.

## 내부 시각 차이 점검

- 주 동작 행은 SideNav neutral과 같은 radius·hover·pressed·focus token을 씁니다. 36px/14px은 대화 행과 같고 평소 selected fill은 생략합니다. 영역 선택은 레일이, 동작의 현재 화면은 aria-current와 semibold가 표시합니다.
- 제목은 `--body1-size` bold로 레일 캡션과 행 라벨보다 크고, 페이지 제목보다 작습니다.
- 앞쪽 색 띠, 카드 테두리, 그림자, 강조색 선택 표시는 쓰지 않습니다.

## 외부 기준과 적용 결론

- [Atlassian navigation system layout](https://atlassian.design/components/navigation-system/layout/usage) — side nav는 머리와 꼬리가 고정이고 가운데만 스크롤됩니다. 각 랜드마크에 고유 이름을 붙이고 1024px 이하에서 panel은 overlay가 됩니다. 머리 고정 + 스크롤 구역 하나, 768–1023px overlay에 반영했습니다.
- [Carbon UI shell left panel usage](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/) — 왼쪽 패널은 보조 항목이 5개를 넘거나 자주 오갈 때 씁니다. 하위 목적지가 2–4개인 영역은 패널 대신 본문 탭을 쓰라는 결론의 근거입니다.
- [Fluent 2 Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage) — 보조 동작은 하나로 줄이고 나머지는 overflow 메뉴에 둡니다. 머리 동작 최대 2개의 근거입니다.
- [WAI-ARIA APG Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) — nav가 여럿이면 고유 이름, 보이는 제목이 있으면 `aria-labelledby`.

의도적 제외: 패널 너비 조절, 패널 안 디스클로저 그룹(그런 계층은 SideNav), 패널 안 SideNav 전체, 무한 스크롤, 사용자별 접힘 저장(제품 소유).

## LK 제품 workflow coverage

- **LK Portal** `ops/lk-portal` `dev` `438c131e`(2026-10-09, 작업 트리 미커밋 셸 변경 있음) — 질문 영역의 대화 목록이 이 패턴의 주 사례입니다. 새 계약으로 지원 예정(supported by new contract, 미적용). 대화별 URL, 셸 목록 상태, 이름 바꾸기 API, 목록 커서는 Portal이 소유하며 아직 gap입니다.
- **LK Control Full Daedeok** `d8c215fd` — 단일 열 그룹 메뉴와 mini drawer이고 사용자 소유 긴 목록이 없어 not applicable입니다. 다른 팀 소유이며 수정하지 않습니다.
- **LK Web Viz** 로컬 `7e535341`(main 아님, unverified pin) — 가로 상단 launcher라 not applicable입니다.
