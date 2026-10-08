# Shell Panel

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Layout |
| Owner | `ShellPanel` |
| Storybook | `LDS Product/Layout/Shell Panel` |
| Source | `../component-content.json#product-layout-shell-panel` |

DashboardShell topology="rail-panel"의 둘째 열입니다. 고정 머리(제목과 동작 최대 2개), 목록 행과 같은 해부의 주 동작 행, 짧은 고정 구역, 스크롤 구역 하나로 구성합니다. 접기 토글은 상단 바에 두고 패널 안에는 두지 않습니다.

## 사용 판단

### 사용하지 않음

- Carbon UI shell left panel usage — 왼쪽 패널은 보조 항목이 5개를 넘거나 자주 오갈 때 씁니다. 하위 목적지가 2–4개인 영역은 패널 대신 본문 탭을 쓰라는 결론의 근거입니다.
- LK Control Full Daedeok d8c215fd — 단일 열 그룹 메뉴와 mini drawer이고 사용자 소유 긴 목록이 없어 not applicable입니다. 다른 팀 소유이며 수정하지 않습니다.
- Classification: LK Product Extension · Operations Dashboard. 기존 SideNav·NavRail·ScrollArea·ListCell의 해부를 조합하며 새 디자인 언어를 만들지 않습니다. 화면 템플릿이나 목록 데이터를 포함하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| title | 패널 제목. 안의 목록 nav가 aria-labelledby로 이 제목을 이름으로 씁니다. |
| actions | 머리 오른쪽 아이콘 동작(예: 검색). 최대 2개이며 넘치면 개발 경고를 냅니다. 접기 토글은 두지 않습니다. |
| primaryAction | 목록 행과 같은 해부의 주 동작 행(예: 새 질문). 객체를 주면 LDS 행으로 렌더링합니다. |
| renderLink | primaryAction.href를 router link로 치환하는 렌더 훅. |
| children | 스크롤하지 않는 짧은 고정 구역(예: 고정한 대화). |
| scrollRegionLabel | 스크롤 구역의 접근 가능한 이름. 생략하면 {title} 목록입니다. |
| footer | 선택 꼬리. 계정은 레일에 두므로 보통 비웁니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | Yes | 패널 제목. 안의 목록 nav가 aria-labelledby로 이 제목을 이름으로 씁니다. |
| `headingLevel` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | No | 제목 heading 단계. @default 2 |
| `actions` | `React.ReactNode` | No | 머리 오른쪽 아이콘 동작(예: 검색). 최대 2개이며 넘치면 개발 경고를 냅니다. 접기 토글은 두지 않습니다. |
| `primaryAction` | `ShellPanelPrimaryAction \| React.ReactNode` | No | 목록 행과 같은 해부의 주 동작 행(예: 새 질문). 객체를 주면 LDS 행으로 렌더링합니다. |
| `renderLink` | `(action: ShellPanelPrimaryAction, props: React.AnchorHTMLAttributes) = React.ReactElement` | No | primaryAction.href를 router link로 치환하는 렌더 훅. |
| `children` | `React.ReactNode` | No | 스크롤하지 않는 짧은 고정 구역(예: 고정한 대화). |
| `scrollRegion` | `React.ReactNode` | No | 패널의 유일한 스크롤 구역(긴 목록). 스크롤될 때만 위쪽 경계선을 보입니다. |
| `scrollRegionLabel` | `string` | No | 스크롤 구역의 접근 가능한 이름. 생략하면 {title} 목록입니다. |
| `footer` | `React.ReactNode` | No | 선택 꼬리. 계정은 레일에 두므로 보통 비웁니다. |
| `titleId` | `string` | No | 제목 id. 생략하면 생성합니다. |

## Behavior and interaction

- 앞쪽 색 띠, 카드 테두리, 그림자, 강조색 선택 표시는 쓰지 않습니다.
- ShellPanel — DashboardShell topology="rail-panel"의 맥락 패널. 레일이 고른 영역 안의 긴 목록 하나를 고정 머리, 주 동작 행, 고정 구역, 스크롤 구역 하나로 보여 줍니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 폭은 셸이 소유합니다(--component-shell-panel-width 240px, SideNav 기본 폭과 같음). 제품은 --lds-dashboard-shell-panel-width로 224–288px 사이에서만 조정합니다. 패널 안 콘텐츠는 그 폭을 채웁니다. 크기 조절 핸들은 두지 않습니다. |
| 명시 규칙 2 | 표면은 SideNav neutral과 같은 navy-wash 면(--component-shell-panel-surface)과 1px 끝 구분선이며 그림자는 없습니다. 좁은 범위 overlay에서만 셸이 덮는 쪽 그림자를 둡니다. |
| 명시 규칙 3 | 주 동작 행은 SideNav neutral 행과 같은 radius, 무채색 hover(cool-neutral-97)·selected(-96)·pressed(-95) 단계, label-normal 선택 잉크, 굵기를 씁니다. 패널 행 높이는 40px로 SideNav 44px 최상위 행보다 한 단계 촘촘하고 대화 행(36px)보다 한 단계 큽니다. 주 동작이 목록 행보다 먼저 읽히게 하는 위계 차이입니다. |
| 명시 규칙 4 | Atlassian navigation system layout — side nav는 머리와 꼬리가 고정이고 가운데만 스크롤됩니다. 각 랜드마크에 고유 이름을 붙이고 1024px 이하에서 panel은 overlay가 됩니다. 머리 고정 + 스크롤 구역 하나, 768–1023px overlay에 반영했습니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- 좁은 화면에서는 셸이 같은 패널을 드로어 안 영역 행 아래에 그립니다. 그때도 스크롤 구역은 하나입니다.
- Fluent 2 Nav usage — 보조 동작은 하나로 줄이고 나머지는 overflow 메뉴에 둡니다. 머리 동작 최대 2개의 근거입니다.
- 의도적 제외: 패널 너비 조절, 패널 안 디스클로저 그룹(그런 계층은 SideNav), 패널 안 SideNav 전체, 무한 스크롤, 사용자별 접힘 저장(제품 소유).

## Content and writing

- titleId로 제목 id를 지정할 수 있고, 생략하면 생성합니다. 안의 목록은 context로 이 id를 받아 nav 이름으로 씁니다.
- 제목은 --body1-size bold로 레일 캡션과 행 라벨보다 크고, 페이지 제목보다 작습니다.
- LK Portal ops/lk-portal dev 438c131e(2026-10-09, 작업 트리 미커밋 셸 변경 있음) — 질문 영역의 대화 목록이 이 패턴의 주 사례입니다. 새 계약으로 지원 예정(supported by new contract, 미적용). 대화별 URL, 셸 목록 상태, 이름 바꾸기 API, 목록 커서는 Portal이 소유하며 아직 gap입니다.

## Accessibility

- 패널은 랜드마크가 아닙니다. 안의 목록(ConversationList)이 패널 제목을 aria-labelledby로 쓰는 nav가 됩니다. 레일 nav와 이름이 같으면 DashboardShell이 개발 경고를 냅니다.
- WAI-ARIA APG Landmark Regions — nav가 여럿이면 고유 이름, 보이는 제목이 있으면 aria-labelledby.
- 1. 머리(56px, 고정): 제목(h2 기본, headingLevel)과 오른쪽 actions(아이콘 버튼 최대 2개, 넘치면 개발 경고). 접기 토글은 두지 않습니다. 토글은 셸 상단 바 시작에 하나만 둡니다(SideNav와 같은 원칙). 2. 주 동작 행(선택, 고정): primaryAction 객체는 버튼 모양이 아니라 목록 행과 같은 해부(아이콘 + 라벨, 40px)의 링크입니다. 해당 화면이면 current: true로 aria-current="page", 무채색 채움, 굵기를 받습니다. 노드를 직접 넘길 수도 있지만 행 해부는 제품 책임이 됩니다. 3.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `IconButton` | 대표 시나리오에서 조합 |
| `DashboardGrid` | 대표 시나리오에서 조합 |
| `DashboardShell` | 대표 시나리오에서 조합 |
| `DockPanel` | 대표 시나리오에서 조합 |
| `PageHeader` | 대표 시나리오에서 조합 |
| `PrimaryDetail` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--_lds-shell-panel-pressed-foreground`
- `--body1-line`
- `--body1-size`
- `--component-shell-panel-active-hover-surface`
- `--component-shell-panel-active-surface`
- `--component-shell-panel-divider`
- `--component-shell-panel-foreground`
- `--component-shell-panel-header-height`
- `--component-shell-panel-hover-foreground`
- `--component-shell-panel-hover-surface`
- `--component-shell-panel-pressed-surface`
- `--component-shell-panel-row-height`
- `--component-shell-panel-surface`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--label1-line`
- `--label1-size`
- `--radius-lg`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/layout/ShellPanel.jsx`
- `components/layout/ShellPanel.d.ts`
- `components/layout/ShellPanel.prompt.md`
- `stories/LayoutShellPanel.stories.jsx`

## Sources

- ShellPanel prompt contract: `components/layout/ShellPanel.prompt.md`
- Storybook implementation evidence: `stories/LayoutShellPanel.stories.jsx`
- [Atlassian navigation system layout](https://atlassian.design/components/navigation-system/layout/usage)
- [Carbon UI shell left panel usage](https://carbondesignsystem.com/components/UI-shell-left-panel/usage/)
- [Fluent 2 Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
- [WAI-ARIA APG Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
