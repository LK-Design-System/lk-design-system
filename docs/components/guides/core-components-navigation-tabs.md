# Tabs

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Navigation |
| Owner | `Tabs` |
| Storybook | `LDS Core/Components/Navigation/Tabs` |
| Source | `../component-content.json#core-components-navigation-tabs` |

페이지를 떠나지 않고 관련 콘텐츠 패널을 하나씩 전환하며 선택 상태를 유지해야 할 때 적합합니다. 서로 다른 목적지로 이동하는 전역 내비게이션에는 링크나 메뉴를, 순서가 있는 업무 절차에는 Stepper를 사용하세요.

## 사용 판단

### 사용

- 페이지를 떠나지 않고 관련 콘텐츠 패널을 하나씩 전환하며 선택 상태를 유지해야 할 때 적합합니다. 서로 다른 목적지로 이동하는 전역 내비게이션에는 링크나 메뉴를, 순서가 있는 업무 절차에는 Stepper를 사용하세요.
- Use for section or route switching. Use Category for chip-like topic navigation.
- 탭↔패널 연결: 각 탭은 useId() 기반 id를 자동으로 가지며, item.tabId로 재정의할 수 있습니다. item.panelId를 넘기면 탭에 aria-controls로 연결됩니다. 소비 측은 패널을 role="tabpanel", id={panelId}, aria-labelledby={탭 id}, tabIndex={0}으로 표시하세요.
- When used as CanvasEditorShell.responsiveNavigation, tabs switch only the narrow-screen region (canvas, layers, panel). Workspace modes that change tools and document behavior remain in subheader.

### 사용하지 않음

- item.active는 비제어 모드에서 초기 선택을 시드할 때만 사용됩니다(defaultValue가 없을 때). 렌더 시점에 선택 상태를 강제하지 않으므로 두 탭이 동시에 선택되는 일이 없습니다.
- - Use for section or route switching. Use Category for chip-like topic navigation. - WDS axes: resize (hug/fill), size, padding, trailingIconButton, and horizontal scroll. - The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs patt….
- Tabs가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Tabs의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Trailing Icon Button | trailingIconButton axis. @default false |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string, item: Exclude) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `full` | `boolean` | No | Legacy fill prop. Prefer resize="fill". @default false |
| `resize` | `"hug" \| "fill"` | No | resize axis. @default "hug" |
| `size` | `"small" \| "sm" \| "medium" \| "md" \| "large" \| "lg"` | No | size axis. @default "medium" |
| `padding` | `boolean` | No | padding axis. @default false |
| `trailingIconButton` | `boolean \| React.ReactNode` | No | trailingIconButton axis. @default false |
| `scroll` | `"auto" \| boolean` | No | scroll axis. @default "auto" |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- WDS axes: resize (hug/fill), size, padding, trailingIconButton, and horizontal scroll.
- The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs pattern. 선택 탭이 비활성화되면 첫 번째 활성 탭이 Tab 스톱이 됩니다.
- 탭↔패널 연결: 각 탭은 useId() 기반 id를 자동으로 가지며, item.tabId로 재정의할 수 있습니다. item.panelId를 넘기면 탭에 aria-controls로 연결됩니다. 소비 측은 패널을 role="tabpanel", id={panelId}, aria-labelledby={탭 id}, tabIndex={0}으로 표시하세요.
- item.active는 비제어 모드에서 초기 선택을 시드할 때만 사용됩니다(defaultValue가 없을 때). 렌더 시점에 선택 상태를 강제하지 않으므로 두 탭이 동시에 선택되는 일이 없습니다.
- When used as CanvasEditorShell.responsiveNavigation, tabs switch only the narrow-screen region (canvas, layers, panel). Workspace modes that change tools and document behavior remain in subheader.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 탭↔패널 연결: 각 탭은 useId() 기반 id를 자동으로 가지며, item.tabId로 재정의할 수 있습니다. item.panelId를 넘기면 탭에 aria-controls로 연결됩니다. 소비 측은 패널을 role="tabpanel", id={panelId}, aria-labelledby={탭 id}, tabIndex={0}으로 표시하세요. |
| 명시 규칙 2 | - Use for section or route switching. Use Category for chip-like topic navigation. - WDS axes: resize (hug/fill), size, padding, trailingIconButton, and horizontal scroll. - The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs patt… |
| --body2-size | 15px |
| --color-semantic-focus-indicator | light: #2F6FB0; dark: #7FB0DE |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |

## Responsive

- When used as CanvasEditorShell.responsiveNavigation, tabs switch only the narrow-screen region (canvas, layers, panel). Workspace modes that change tools and document behavior remain in subheader.
- - Use for section or route switching. Use Category for chip-like topic navigation. - WDS axes: resize (hug/fill), size, padding, trailingIconButton, and horizontal scroll. - The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs patt….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 탭↔패널 연결: 각 탭은 useId() 기반 id를 자동으로 가지며, item.tabId로 재정의할 수 있습니다. item.panelId를 넘기면 탭에 aria-controls로 연결됩니다. 소비 측은 패널을 role="tabpanel", id={panelId}, aria-labelledby={탭 id}, tabIndex={0}으로 표시하세요.
- - Use for section or route switching. Use Category for chip-like topic navigation. - WDS axes: resize (hug/fill), size, padding, trailingIconButton, and horizontal scroll. - The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs patt….
- 사용자에게 보이는 Tabs 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs pattern. 선택 탭이 비활성화되면 첫 번째 활성 탭이 Tab 스톱이 됩니다.
- 탭↔패널 연결: 각 탭은 useId() 기반 id를 자동으로 가지며, item.tabId로 재정의할 수 있습니다. item.panelId를 넘기면 탭에 aria-controls로 연결됩니다. 소비 측은 패널을 role="tabpanel", id={panelId}, aria-labelledby={탭 id}, tabIndex={0}으로 표시하세요.
- Tabs - WDS underline tab navigation for switching page sections.
- - Use for section or route switching. Use Category for chip-like topic navigation. - WDS axes: resize (hug/fill), size, padding, trailingIconButton, and horizontal scroll. - The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs patt….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use for section or route switching. Use Category for chip-like topic navigation. |
| Don't | item.active는 비제어 모드에서 초기 선택을 시드할 때만 사용됩니다(defaultValue가 없을 때). 렌더 시점에 선택 상태를 강제하지 않으므로 두 탭이 동시에 선택되는 일이 없습니다. |
| Do | 탭↔패널 연결: 각 탭은 useId() 기반 id를 자동으로 가지며, item.tabId로 재정의할 수 있습니다. item.panelId를 넘기면 탭에 aria-controls로 연결됩니다. 소비 측은 패널을 role="tabpanel", id={panelId}, aria-labelledby={탭 id}, tabIndex={0}으로 표시하세요. |
| Don't | - Use for section or route switching. Use Category for chip-like topic navigation. - WDS axes: resize (hug/fill), size, padding, trailingIconButton, and horizontal scroll. - The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs patt…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Tabs의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Category` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PageIndicator` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Pagination` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Tabs items={[{ value: 'all', label: 'All' }, { value: 'open', label: 'Open' }]} defaultValue="all" />
<Tabs resize="fill" size="large" padding trailingIconButton items={items} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`
- `--headline2-size`
- `--radius-sm`

### Source contracts

- `components/navigation/Tabs.jsx`
- `components/navigation/Tabs.d.ts`
- `components/navigation/Tabs.prompt.md`
- `stories/NavigationTabs.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Tabs prompt contract: `components/navigation/Tabs.prompt.md`
- Storybook implementation evidence: `stories/NavigationTabs.stories.jsx`
- [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [SEED Tabs benchmark](https://seed-design.io/components/tabs)
