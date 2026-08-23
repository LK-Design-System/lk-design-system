# User Menu

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `UserMenu` |
| Storybook | `LDS Product/Navigation/User Menu` |
| Source | `../component-content.json#product-navigation-user-menu` |

사이드바 푸터에서 현재 사용자·상태·프로필·로그아웃을 묶을 때 적합합니다. 상단 전역 명령이나 제품 탐색에는 User Menu 대신 Top Bar나 Side Nav를 사용하세요.

## 사용 판단

### 사용

- UserMenu는 한 컴포넌트가 서로 다른 두 표면에 걸쳐 있습니다. trigger는 호스트 사이드바 footer 위(=SideNav appearance="brand"면 네이비 다크 셸), 팝업 패널은 언제나 자신의 밝은 elevated 표면입니다. 따라서 각 표면이 독립적으로 대비를 만족해야 합니다.

### 사용하지 않음

- Classification: LK Product Extension. 대시보드에서 SideNav 푸터에 배치하는 계정 액션이며, 위로 열리는 구조이므로 TopBar의 계정 메뉴나 전역 내비게이션으로 사용하지 않습니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `name` | `React.ReactNode` | Yes | 사용자 이름 — 접힌 상태에선 툴팁, 아바타 이니셜 폴백에도 사용. |
| `detail` | `React.ReactNode` | No | 이름 아래 보조 줄(역할·이메일). |
| `src` | `string` | No | 아바타 이미지 URL. 생략하면 이니셜 폴백. |
| `status` | `'online' \| 'busy' \| 'offline'` | No | 아바타 상태 점. |
| `items` | `UserMenuItem[]` | No | 위로 열리는 계정 메뉴 항목. |
| `collapsed` | `boolean` | No | SideNav 접힘 상태와 동기화 — 아바타만 표시. @default false |
| `viewportPadding` | `number` | No | Viewport inset in pixels used to clamp the upward menu. @default 12 |

## States

| State | Contract |
| --- | --- |
| status | 아바타 상태 점. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 항목 13.5px → --label2-size(13px), 상세 11.5px → --caption1-size(12px)로 스냅했습니다. 이름(13px bold)과의 위계는 굵기·색으로 유지됩니다. |
| 명시 규칙 2 | Menu shell은 Dropdown Menu와 같은 elevated surface, r16, 8px/20px padding, shadow-md를 사용합니다. |
| 명시 규칙 3 | 호스트는 --color-semantic-label-를 재매핑하지 않습니다. 팝업은 trigger와 같은 DOM 스코프의 자손이므로 그 반전을 그대로 상속받아, 밝은 패널 위에 흰 글자(대비 1:1)를 그리게 됩니다. 다크 표면에 얹을 때는 위 --component-user-menu- 토큰만 재정의하세요. |
| 명시 규칙 4 | danger 잉크는 상태 색상(--color-semantic-status-negative, 흰 배경에서 3.44:1로 AA 미달)이 아니라 DropdownMenu와 같은 on-light 텍스트 토큰을 씁니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- SideNav footer라는 위치 근거 때문에 Dropdown Menu와 달리 위쪽을 선호합니다. 공간이 부족하면 아래로 flip하고 좌우 viewport를 clamp하지만, 이 배치 차이는 계정 메뉴의 고정 위치 때문에 유지합니다.

## Content and writing

- 사이드바 푸터용 계정 행. 아바타 + 이름/역할 + 셰브론이 트리거이고, 계정 메뉴가 위로 열립니다. SideNav의 collapsed와 같은 값을 넘기면 접힌 레일에서 아바타만 남습니다.
- | 요소 | 토큰 | 기본 대비 | brand footer 대비 | | --- | --- | --- | --- | | trigger 이름 | --component-user-menu-label → label-normal | 17.9:1 | 18.5:1 (white on #05132B) | | trigger 상세·셰브론 | --component-user-menu-detail·-indicator | — | 7.5:1 | | trigger 열림 배경 | --component-user-menu-open-surface | primary-surface-normal | brand…

## Accessibility

- 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를 닫고 다음 문서 순서로 이동합니다. 항목 하이라이트는 hover와 키보드 focus에서 동일하게 적용되어 초점 위치가 시각적으로 드러납니다. collapsed(아바타 전용) trigger도 같은 키보드 계약으로 열립니다.
- WAI-ARIA Menu Button Pattern — trigger의 aria-haspopup·aria-expanded와 열림 시 메뉴 항목 초점 이동을 적용했습니다.
- React Aria Menu — menu item은 텍스트·장식 아이콘만 포함하고 방향키 탐색을 제공하며 disabled item은 탐색·활성화에서 제외합니다.
- Implementation note: viewportPadding controls the inline popover viewport clamp inset in pixels. The default 12 keeps docked SideNav footer menus aligned with their account trigger. Pointer opening keeps focus on the trigger; keyboard opening enters the first command so the two surfaces do not compete for emphasis.

## Related components

| Component | Relationship |
| --- | --- |
| `SideNav` | 대표 시나리오에서 조합 |
| `Anchor` | 대표 시나리오에서 조합 |
| `BottomNav` | 대표 시나리오에서 조합 |
| `Breadcrumb` | 대표 시나리오에서 조합 |
| `Footer` | 대표 시나리오에서 조합 |
| `LanguageSwitcher` | 대표 시나리오에서 조합 |
| `NavRail` | 대표 시나리오에서 조합 |
| `Steps` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-assistive`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-surface-normal`
- `--color-semantic-status-negative-text`
- `--component-menu-item-hover-bg`
- `--component-menu-padding-x`
- `--component-menu-padding-y`
- `--component-menu-radius`
- `--component-user-menu-detail`
- `--component-user-menu-indicator`
- `--component-user-menu-label`
- `--component-user-menu-open-surface`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--label2-size`
- `--radius-8`
- `--radius-lg`
- `--shadow-md`
- `--space-0-5`
- `--space-2-5`
- `--space-8`

### Source contracts

- `components/navigation/UserMenu.jsx`
- `components/navigation/UserMenu.d.ts`
- `components/navigation/UserMenu.prompt.md`
- `stories/NavigationUserMenu.stories.jsx`

## Sources

- UserMenu prompt contract: `components/navigation/UserMenu.prompt.md`
- Storybook implementation evidence: `stories/NavigationUserMenu.stories.jsx`
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [React Aria Menu](https://react-aria.adobe.com/Menu)
