# Adaptive Navigation

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Navigation |
| Owner | `NavRail` |
| Storybook | `LDS Product/Navigation/Adaptive Navigation` |
| Source | `../component-content.json#product-navigation-adaptive-navigation` |

데스크톱 레일과 모바일 하단에서 같은 35개 최상위 목적지를 유지할 때 적합합니다. 깊은 계층에는 Side Nav를, 페이지 안 섹션 이동에는 Anchor를 사용하세요.

## 사용 판단

### 사용

- 데스크톱 레일과 모바일 하단에서 같은 35개 최상위 목적지를 유지할 때 적합합니다. 깊은 계층에는 Side Nav를, 페이지 안 섹션 이동에는 Anchor를 사용하세요.
- BottomNav와 동일한 icon+caption, primary ink, aria-current="page"를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다.
- SideNav의 섹션 heading, 계층 indent, badge, disclosure, panel shadow는 쓰지 않습니다. 평면 목적지 3–5개만 보여주기 때문입니다.
- Fluent Nav usage — 주 목적지는 실제 link로 제공하고 짧고 스캔 가능한 이름을 사용하며 좁은 화면에서는 다른 표면으로 전환합니다.

### 사용하지 않음

- items — { value, label, ariaLabel?, icon, href?, disabled? }. href가 있으면 native anchor, 없으면 기존 선택 button입니다. value / defaultValue / onChange. 활성은 시안 워시 + 시그널 잉크. 모바일에는 BottomNav를 쓰세요.
- Classification: LK Product Extension. 동등한 중요도의 평면형 주요 목적지 3–5개에 사용하고, 같은 목적지 집합의 모바일 표현은 BottomNav로 전환합니다. 계층형 SideNav와 동시에 주 탐색으로 사용하지 않습니다.
- - items — { value, label, ariaLabel?, icon, href?, disabled? }. href가 있으면 native anchor, 없으면 기존 선택 button입니다. value / defaultValue / onChange. 활성은 시안 워시 + 시그널 잉크. 모바일에는 BottomNav를 쓰세요. - renderLink — router 통합 시 renderLink={(item, { href, ...props }) = }로 native anchor만 치환합니다. - 긴 label은 68px 레일 안에서 한 줄 ellipsis로 줄이고….
- Adaptive Navigation가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | NavRail의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Render Link | href 항목을 router link로 치환하는 렌더 훅. 기본은 native anchor입니다. |
| Render Link | href 항목을 router link로 치환하는 렌더 훅. 기본은 native anchor입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `BottomNavItem[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `renderLink` | `(item: BottomNavItem, props: React.AnchorHTMLAttributes) = React.ReactElement` | No | href 항목을 router link로 치환하는 렌더 훅. 기본은 native anchor입니다. |
| `items` | `NavRailItem[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `renderLink` | `(item: NavRailItem, props: React.AnchorHTMLAttributes) = React.ReactElement` | No | href 항목을 router link로 치환하는 렌더 훅. 기본은 native anchor입니다. |

## States

| State | Contract |
| --- | --- |
| 반응형 · 데스크톱 레일과 모바일 하단 탐색 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- items — { value, label, ariaLabel?, icon, href?, disabled? }. href가 있으면 native anchor, 없으면 기존 선택 button입니다. value / defaultValue / onChange. 활성은 시안 워시 + 시그널 잉크. 모바일에는 BottomNav를 쓰세요.
- BottomNav와 동일한 icon+caption, primary ink, aria-current="page"를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다.
- - items — { value, label, ariaLabel?, icon, href?, disabled? }. href가 있으면 native anchor, 없으면 기존 선택 button입니다. value / defaultValue / onChange. 활성은 시안 워시 + 시그널 잉크. 모바일에는 BottomNav를 쓰세요. - renderLink — router 통합 시 renderLink={(item, { href, ...props }) = }로 native anchor만 치환합니다. - 긴 label은 68px 레일 안에서 한 줄 ellipsis로 줄이고….
- - BottomNav와 동일한 icon+caption, primary ink, aria-current="page"를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다. - SideNav의 섹션 heading, 계층 indent, badge, disclosure, panel shadow는 쓰지 않습니다. 평면 목적지 3–5개만 보여주기 때문입니다. - anchor와 button의 padding, radius, fill, color, disabled o….
- NavRail의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 긴 label은 68px 레일 안에서 한 줄 ellipsis로 줄이고 title/ariaLabel로 전체 이름을 유지합니다. 아이콘은 장식으로 처리합니다. |
| 명시 규칙 2 | BottomNav와 동일한 icon+caption, primary ink, aria-current="page"를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다. |
| 명시 규칙 3 | SideNav의 섹션 heading, 계층 indent, badge, disclosure, panel shadow는 쓰지 않습니다. 평면 목적지 3–5개만 보여주기 때문입니다. |
| 명시 규칙 4 | Classification: LK Product Extension. 동등한 중요도의 평면형 주요 목적지 3–5개에 사용하고, 같은 목적지 집합의 모바일 표현은 BottomNav로 전환합니다. 계층형 SideNav와 동시에 주 탐색으로 사용하지 않습니다. |
| --caption2-size | 11px |

## Responsive

- items — { value, label, ariaLabel?, icon, href?, disabled? }. href가 있으면 native anchor, 없으면 기존 선택 button입니다. value / defaultValue / onChange. 활성은 시안 워시 + 시그널 잉크. 모바일에는 BottomNav를 쓰세요.
- Fluent Nav usage — 주 목적지는 실제 link로 제공하고 짧고 스캔 가능한 이름을 사용하며 좁은 화면에서는 다른 표면으로 전환합니다.
- NavRail — 세로 아이콘+라벨 내비게이션 레일(데스크톱 사이드 내비).
- Classification: LK Product Extension. 동등한 중요도의 평면형 주요 목적지 3–5개에 사용하고, 같은 목적지 집합의 모바일 표현은 BottomNav로 전환합니다. 계층형 SideNav와 동시에 주 탐색으로 사용하지 않습니다.

## Content and writing

- items — { value, label, ariaLabel?, icon, href?, disabled? }. href가 있으면 native anchor, 없으면 기존 선택 button입니다. value / defaultValue / onChange. 활성은 시안 워시 + 시그널 잉크. 모바일에는 BottomNav를 쓰세요.
- 긴 label은 68px 레일 안에서 한 줄 ellipsis로 줄이고 title/ariaLabel로 전체 이름을 유지합니다. 아이콘은 장식으로 처리합니다.
- Fluent Nav usage — 주 목적지는 실제 link로 제공하고 짧고 스캔 가능한 이름을 사용하며 좁은 화면에서는 다른 표면으로 전환합니다.
- WAI-ARIA landmark regions — landmark와 aria-current="page"를 유지합니다. nav의 기본 aria-label은 '주 탐색'이며 소비자가 전달한 aria-label이 우선합니다.

## Accessibility

- BottomNav와 동일한 icon+caption, primary ink, aria-current="page"를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다.
- WAI-ARIA landmark regions — landmark와 aria-current="page"를 유지합니다. nav의 기본 aria-label은 '주 탐색'이며 소비자가 전달한 aria-label이 우선합니다.
- - BottomNav와 동일한 icon+caption, primary ink, aria-current="page"를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다. - SideNav의 섹션 heading, 계층 indent, badge, disclosure, panel shadow는 쓰지 않습니다. 평면 목적지 3–5개만 보여주기 때문입니다. - anchor와 button의 padding, radius, fill, color, disabled o….
- - Fluent Nav usage — 주 목적지는 실제 link로 제공하고 짧고 스캔 가능한 이름을 사용하며 좁은 화면에서는 다른 표면으로 전환합니다. - Carbon UI shell usage — shell 탐색과 global utility를 분리합니다. NavRail은 제품 내부의 평면 주 탐색만 담당합니다. - WAI-ARIA landmark regions — landmark와 aria-current="page"를 유지합니다. nav의 기본 aria-label은 '주 탐색'이며 소비자가 전달한 aria-label이 우선합니다.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | BottomNav와 동일한 icon+caption, primary ink, aria-current="page"를 사용하고 control 면적만 세로 68×60과 가로 균등 분할로 달라집니다. 이 차이는 orientation과 pointer target 배치에 따른 기능 차이입니다. |
| Don't | items — { value, label, ariaLabel?, icon, href?, disabled? }. href가 있으면 native anchor, 없으면 기존 선택 button입니다. value / defaultValue / onChange. 활성은 시안 워시 + 시그널 잉크. 모바일에는 BottomNav를 쓰세요. |
| Do | SideNav의 섹션 heading, 계층 indent, badge, disclosure, panel shadow는 쓰지 않습니다. 평면 목적지 3–5개만 보여주기 때문입니다. |
| Don't | Classification: LK Product Extension. 동등한 중요도의 평면형 주요 목적지 3–5개에 사용하고, 같은 목적지 집합의 모바일 표현은 BottomNav로 전환합니다. 계층형 SideNav와 동시에 주 탐색으로 사용하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 NavRail의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BottomNav` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Anchor` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Breadcrumb` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Footer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SideNav` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Steps` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toolbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<NavRail defaultValue="docs" onChange={setTab} items={[
  { value: 'docs', label: '문서', href: '/docs', icon: <Icon name="document" size={22} /> },
  { value: 'components', label: '컴포넌트', href: '/components', icon: <Icon name="layers" size={22} /> },
  { value: 'alerts', label: '알림', href: '/alerts', icon: <Icon name="bell" size={22} /> },
]} />
```

## Tokens and API

### Tokens

- `--caption2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-surface-normal`
- `--color-semantic-primary-surface-strong`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--radius-lg`
- `--radius-xl`

### Source contracts

- `components/navigation/BottomNav.jsx`
- `components/navigation/BottomNav.d.ts`
- `components/navigation/BottomNav.prompt.md`
- `components/navigation/NavRail.jsx`
- `components/navigation/NavRail.d.ts`
- `components/navigation/NavRail.prompt.md`
- `stories/NavigationAdaptive.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- NavRail prompt contract: `components/navigation/NavRail.prompt.md`
- Storybook implementation evidence: `stories/NavigationAdaptive.stories.jsx`
- [Fluent Nav usage](https://fluent2.microsoft.design/components/web/react/core/nav/usage)
- [Carbon UI shell usage](https://carbondesignsystem.com/components/UI-shell-header/usage/)
- [WAI-ARIA landmark regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
