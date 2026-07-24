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

- 사이드바 푸터에서 현재 사용자·상태·프로필·로그아웃을 묶을 때 적합합니다. 상단 전역 명령이나 제품 탐색에는 User Menu 대신 Top Bar나 Side Nav를 사용하세요.
- 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를 닫고 다음 문서 순서로 이동합니다. 항목 하이라이트는 hover와 키보드 focus에서 동일하게 적용되어 초점 위치가 시각적으로 드러납니다. collapsed(아바타 전용) trigger도 같은 키보드 계약으로 열립니다.
- Menu shell은 Dropdown Menu와 같은 elevated surface, r16, 8px/20px padding, shadow-md를 사용합니다.
- React Aria Menu — menu item은 텍스트·장식 아이콘만 포함하고 방향키 탐색을 제공하며 disabled item은 탐색·활성화에서 제외합니다.

### 사용하지 않음

- Classification: LK Product Extension. 대시보드에서 SideNav 푸터에 배치하는 계정 액션이며, 위로 열리는 구조이므로 TopBar의 계정 메뉴나 전역 내비게이션으로 사용하지 않습니다.
- User Menu가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | UserMenu의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `name` | `React.ReactNode` | Yes | 사용자 이름 — 접힌 상태에선 툴팁, 아바타 이니셜 폴백에도 사용. |
| `detail` | `React.ReactNode` | No | 이름 아래 보조 줄(역할·이메일). |
| `src` | `string` | No | 아바타 이미지 URL. 생략하면 이니셜 폴백. |
| `status` | `'online' \| 'busy' \| 'offline'` | No | 아바타 상태 점. |
| `items` | `UserMenuItem[]` | No | 위로 열리는 계정 메뉴 항목. |
| `collapsed` | `boolean` | No | SideNav 접힘 상태와 동기화 — 아바타만 표시. @default false |

## States

| State | Contract |
| --- | --- |
| status | 아바타 상태 점. 타입 계약: 'online' \| 'busy' \| 'offline' |

## Behavior and interaction

- 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를 닫고 다음 문서 순서로 이동합니다. 항목 하이라이트는 hover와 키보드 focus에서 동일하게 적용되어 초점 위치가 시각적으로 드러납니다. collapsed(아바타 전용) trigger도 같은 키보드 계약으로 열립니다.
- WAI-ARIA Menu Button Pattern — trigger의 aria-haspopup·aria-expanded와 열림 시 메뉴 항목 초점 이동을 적용했습니다.
- Classification: LK Product Extension. 대시보드에서 SideNav 푸터에 배치하는 계정 액션이며, 위로 열리는 구조이므로 TopBar의 계정 메뉴나 전역 내비게이션으로 사용하지 않습니다.
- 사이드바 푸터용 계정 행. 아바타 + 이름/역할 + 셰브론이 트리거이고, 계정 메뉴가 위로 열립니다. SideNav의 collapsed와 같은 값을 넘기면 접힌 레일에서 아바타만 남습니다.
- - 타입 스케일 정합: 항목 13.5px → --label2-size(13px), 상세 11.5px → --caption1-size(12px)로 스냅했습니다. 이름(13px bold)과의 위계는 굵기·색으로 유지됩니다. - 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타입 스케일 정합: 항목 13.5px → --label2-size(13px), 상세 11.5px → --caption1-size(12px)로 스냅했습니다. 이름(13px bold)과의 위계는 굵기·색으로 유지됩니다. |
| 명시 규칙 2 | Menu shell은 Dropdown Menu와 같은 elevated surface, r16, 8px/20px padding, shadow-md를 사용합니다. |
| 명시 규칙 3 | - 타입 스케일 정합: 항목 13.5px → --label2-size(13px), 상세 11.5px → --caption1-size(12px)로 스냅했습니다. 이름(13px bold)과의 위계는 굵기·색으로 유지됩니다. - 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를… |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- SideNav footer라는 위치 근거 때문에 Dropdown Menu와 달리 위쪽을 선호합니다. 공간이 부족하면 아래로 flip하고 좌우 viewport를 clamp하지만, 이 배치 차이는 계정 메뉴의 고정 위치 때문에 유지합니다.
- - 타입 스케일 정합: 항목 13.5px → --label2-size(13px), 상세 11.5px → --caption1-size(12px)로 스냅했습니다. 이름(13px bold)과의 위계는 굵기·색으로 유지됩니다. - 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 타입 스케일 정합: 항목 13.5px → --label2-size(13px), 상세 11.5px → --caption1-size(12px)로 스냅했습니다. 이름(13px bold)과의 위계는 굵기·색으로 유지됩니다.
- 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를 닫고 다음 문서 순서로 이동합니다. 항목 하이라이트는 hover와 키보드 focus에서 동일하게 적용되어 초점 위치가 시각적으로 드러납니다. collapsed(아바타 전용) trigger도 같은 키보드 계약으로 열립니다.
- React Aria Menu — menu item은 텍스트·장식 아이콘만 포함하고 방향키 탐색을 제공하며 disabled item은 탐색·활성화에서 제외합니다.
- 사이드바 푸터용 계정 행. 아바타 + 이름/역할 + 셰브론이 트리거이고, 계정 메뉴가 위로 열립니다. SideNav의 collapsed와 같은 값을 넘기면 접힌 레일에서 아바타만 남습니다.

## Accessibility

- 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를 닫고 다음 문서 순서로 이동합니다. 항목 하이라이트는 hover와 키보드 focus에서 동일하게 적용되어 초점 위치가 시각적으로 드러납니다. collapsed(아바타 전용) trigger도 같은 키보드 계약으로 열립니다.
- WAI-ARIA Menu Button Pattern — trigger의 aria-haspopup·aria-expanded와 열림 시 메뉴 항목 초점 이동을 적용했습니다.
- React Aria Menu — menu item은 텍스트·장식 아이콘만 포함하고 방향키 탐색을 제공하며 disabled item은 탐색·활성화에서 제외합니다.
- - 타입 스케일 정합: 항목 13.5px → --label2-size(13px), 상세 11.5px → --caption1-size(12px)로 스냅했습니다. 이름(13px bold)과의 위계는 굵기·색으로 유지됩니다. - 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를….
- - WAI-ARIA Menu Button Pattern — trigger의 aria-haspopup·aria-expanded와 열림 시 메뉴 항목 초점 이동을 적용했습니다. - React Aria Menu — menu item은 텍스트·장식 아이콘만 포함하고 방향키 탐색을 제공하며 disabled item은 탐색·활성화에서 제외합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 키보드 계약: Enter/Space/Arrow Down은 첫 항목, Arrow Up은 마지막 항목으로 열립니다. 열린 메뉴에서는 Arrow Up/Down, Home/End, 문자 탐색을 지원하고 Escape는 닫은 뒤 계정 trigger로 초점을 복원합니다. menu는 trigger id를 aria-labelledby로 참조하고 Tab은 메뉴를 닫고 다음 문서 순서로 이동합니다. 항목 하이라이트는 hover와 키보드 focus에서 동일하게 적용되어 초점 위치가 시각적으로 드러납니다. collapsed(아바타 전용) trigger도 같은 키보드 계약으로 열립니다. |
| Don't | Classification: LK Product Extension. 대시보드에서 SideNav 푸터에 배치하는 계정 액션이며, 위로 열리는 구조이므로 TopBar의 계정 메뉴나 전역 내비게이션으로 사용하지 않습니다. |
| Do | Menu shell은 Dropdown Menu와 같은 elevated surface, r16, 8px/20px padding, shadow-md를 사용합니다. |
| Don't | User Menu가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 UserMenu의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Anchor` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `BottomNav` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Breadcrumb` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Footer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NavRail` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SideNav` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Steps` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--color-semantic-status-negative`
- `--component-menu-item-hover-bg`
- `--component-menu-padding-x`
- `--component-menu-padding-y`
- `--component-menu-radius`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--label2-size`
- `--radius-8`
- `--radius-lg`
- `--shadow-md`
- `--space-8`

### Source contracts

- `components/navigation/UserMenu.jsx`
- `components/navigation/UserMenu.d.ts`
- `components/navigation/UserMenu.prompt.md`
- `stories/NavigationUserMenu.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- UserMenu prompt contract: `components/navigation/UserMenu.prompt.md`
- Storybook implementation evidence: `stories/NavigationUserMenu.stories.jsx`
- [WAI-ARIA Menu Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)
- [React Aria Menu](https://react-aria.adobe.com/Menu)
