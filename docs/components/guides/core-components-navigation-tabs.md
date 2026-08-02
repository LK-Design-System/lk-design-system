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

- Use for section or route switching. Use Category for chip-like topic navigation.

### 사용하지 않음

- item.active는 비제어 모드에서 초기 선택을 시드할 때만 사용됩니다(defaultValue가 없을 때). 렌더 시점에 선택 상태를 강제하지 않으므로 두 탭이 동시에 선택되는 일이 없습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| trailingIconButton | trailingIconButton axis. @default false |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | Yes |  |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string, item: Exclude) = void` | No |  |
| `full` | `boolean` | No | Legacy fill prop. Prefer resize="fill". @default false |
| `resize` | `"hug" \| "fill"` | No | resize axis. @default "hug" |
| `size` | `"small" \| "sm" \| "medium" \| "md" \| "large" \| "lg"` | No | size axis. @default "medium" |
| `padding` | `boolean \| number \| string` | No | Inline padding. true preserves the legacy 8px value; a number or CSS length sets an explicit inset. @default false |
| `trailingIconButton` | `boolean \| React.ReactNode` | No | trailingIconButton axis. @default false |
| `scroll` | `"auto" \| boolean` | No | scroll axis. @default "auto" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | WDS axes: resize (hug/fill), size, padding, trailingIconButton, and horizontal scroll. padding={true} preserves the legacy 8px inset; pass a number or CSS length such as padding="var(--space-6)" to align tabs with adjacent card content. |
| 명시 규칙 2 | The 2px active indicator is drawn inside the tab box (bottom: 0). Scrollable tabs suppress cross-axis overflow only after the full indicator is inside, so the tablist cannot create a vertical scrollbar from its own indicator and the indicator is not clipped to 1px. |
| 명시 규칙 3 | 탭↔패널 연결: 각 탭은 useId() 기반 id를 자동으로 가지며, item.tabId로 재정의할 수 있습니다. item.panelId를 넘기면 탭에 aria-controls로 연결됩니다. 소비 측은 패널을 role="tabpanel", id={panelId}, aria-labelledby={탭 id}, tabIndex={0}으로 표시하세요. |
| --body2-size | 15px |
| --color-semantic-focus-indicator | light: #2F6FB0; dark: #7FB0DE |

## Responsive

- When used as CanvasEditorShell.responsiveNavigation, tabs switch only the narrow-screen region (canvas, layers, panel). Workspace modes that change tools and document behavior remain in subheader.

## Accessibility

- The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the WAI-ARIA Tabs pattern. 선택 탭이 비활성화되면 첫 번째 활성 탭이 Tab 스톱이 됩니다.
- Tabs - WDS underline tab navigation for switching page sections.

## Related components

| Component | Relationship |
| --- | --- |
| `Category` | 대표 시나리오에서 조합 |
| `PageIndicator` | 대표 시나리오에서 조합 |
| `Pagination` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Tabs items={[{ value: 'all', label: 'All' }, { value: 'open', label: 'Open' }]} defaultValue="all" />
<Tabs resize="fill" size="large" padding="var(--space-6)" trailingIconButton items={items} />
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
- `--space-2`

### Source contracts

- `components/navigation/Tabs.jsx`
- `components/navigation/Tabs.d.ts`
- `components/navigation/Tabs.prompt.md`
- `stories/NavigationTabs.stories.jsx`

## Sources

- Tabs prompt contract: `components/navigation/Tabs.prompt.md`
- Storybook implementation evidence: `stories/NavigationTabs.stories.jsx`
- [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
