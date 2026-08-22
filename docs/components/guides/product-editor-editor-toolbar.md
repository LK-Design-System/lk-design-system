# Editor Toolbar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Editor |
| Owner | `EditorToolbar` |
| Storybook | `LDS Product/Editor/Editor Toolbar` |
| Source | `../component-content.json#product-editor-editor-toolbar` |

선택·영역·확대·이동처럼 서로 배타적인 편집 모드를 전환할 때 적합합니다. 저장이나 삭제 같은 즉시 실행 명령에는 Editor Toolbar 대신 Command Bar 또는 Button을 사용하세요.

## 사용 판단

### 사용하지 않음

- CanvasEditorShell.tools owns the rail surface, divider, and padding. EditorToolbar must not add a second card, border, or shadow.

## Anatomy

| Part | Contract |
| --- | --- |
| label | toolbar 접근성 라벨. @default "편집 도구" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `readonly EditorTool[]` | Yes | 툴 목록 — { value, icon, label }. |
| `value` | `string` | No | 제어되는 선택 툴. |
| `defaultValue` | `string` | No | 비제어 초기 툴(기본 첫 항목). |
| `onChange` | `(value: string) = void` | No |  |
| `orientation` | `'vertical' \| 'horizontal'` | No |  |
| `label` | `string` | No | toolbar 접근성 라벨. @default "편집 도구" |
| `disabled` | `boolean` | No | 전체 툴바 비활성화. |
| `disabledReason` | `string` | No | 전체 비활성 사유. item의 disabledReason이 우선합니다. |
| `tooltipPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | No | 툴팁 위치. 기본값은 세로 right, 가로 bottom. |

## States

| State | Contract |
| --- | --- |
| items | 툴 목록 — { value, icon, label }. |
| disabled | 전체 툴바 비활성화. |
| disabledReason | 전체 비활성 사유. item의 disabledReason이 우선합니다. |

## Behavior and interaction

- Activating the already selected mode re-emits that value through onChange; it never toggles a required editor mode off.
- Adobe Spectrum Action Group reinforced keeping one density, size, selection model, and complete interaction-state grammar across related tool groups.
- Figma: Navigating UI3 reinforced keeping high-frequency editing controls stable while panels remain secondary and collapsible.
- EditorToolbar — single-select, high-frequency canvas tool group for reusable Product editors.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Each control composes the shared ToggleIcon foundation: 16px glyph, LDS small icon-control dimension (--component-toggle-icon-size-sm, currently 32px), shared radius/hover/focus/disabled treatment, and a quiet primary tint for the selected mode. |
| 명시 규칙 2 | Adjacent controls use the same --space-1 gap as ViewerToolbar, HistoryToolbar, and command groups. Compactness comes from the shared 32px control, not an Editor-only 2px rhythm. |
| 명시 규칙 3 | WCAG 2.2: Target Size (Minimum) established the minimum pointer-target floor. The 32px LDS small control exceeds that floor while matching the existing IconButton family. |
| 명시 규칙 4 | The implementation follows those interaction expectations while using LDS tokens and the existing 32px small control convention. It intentionally omits product-specific command routing, shortcut conflict resolution, and persistent tool preferences. |
| --color-semantic-inverse-label-alternative-soft | light: rgba(255, 255, 255, 0.50); dark: rgba(255, 255, 255, 0.50) |

## Responsive

- Owner: LDS Product / Workspace. Its WDS provenance is product-extension. Use it for mutually exclusive editing modes such as select, route, region, marker, erase, or pan. Document commands belong in CanvasEditorCommandBar; viewport navigation and zoom controls belong in ViewerToolbar inside the viewport.

## Content and writing

- items accept { value, icon, label, shortcut, ariaKeyShortcuts, disabled, disabledReason }; selection is controlled with value or uncontrolled with defaultValue.
- Apple HIG: Toolbars reinforced stable logical grouping and consistent placement while keeping contextual tools distinct from navigation and document commands.

## Accessibility

- The toolbar exposes one roving Tab stop. Orientation-appropriate Arrow keys move focus across its items, Home/End move to the boundaries, and native button activation changes an enabled tool.
- ariaKeyShortcuts is emitted when supplied. A string shortcut is also used as the ARIA shortcut value by default; visual-only React nodes are not.
- EditorToolbar and ViewerToolbar share the private roving-focus engine, but not a public API: Editor items are mutually exclusive modes, while Viewer items remain independent commands or toggles.
- An individually disabled tool remains reachable with Arrow navigation so its aria-disabled state and reason can be discovered, but it cannot activate. A globally disabled toolbar leaves no item in the Tab sequence and exposes a string disabledReason on the toolbar itself.
- WAI-ARIA APG: Toolbar Pattern established one Tab stop, orientation-aware Arrow navigation, Home/End support, and named controls.

## Exceptions

- Tooltips open away from the rail by default: right for the vertical orientation, bottom for the horizontal one. Set tooltipPosition only when that default would collide with adjacent chrome (e.g. a right-docked rail should flip to left); it applies to every item, including disabled-reason tooltips.

## Related components

| Component | Relationship |
| --- | --- |
| `CanvasEditorCommandBar` | 대표 시나리오에서 조합 |
| `CanvasEditorShell` | 대표 시나리오에서 조합 |
| `HistoryToolbar` | 대표 시나리오에서 조합 |
| `LayerPanel` | 대표 시나리오에서 조합 |
| `SelectionInspector` | 대표 시나리오에서 조합 |
| `ViewportStatusBar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<EditorToolbar
  value={tool}
  onChange={setTool}
  items={[
    { value: 'select', icon: <Icon name="crosshair" size={16} />, label: 'Select', shortcut: 'V' },
    { value: 'route', icon: <Icon name="route" size={16} />, label: 'Route', shortcut: 'R' },
    { value: 'region', icon: <Icon name="zone" size={16} />, label: 'Region', disabled: locked },
  ]}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-inverse-label-alternative-soft`
- `--fw-medium`
- `--space-1`

### Source contracts

- `components/editor/EditorToolbar.jsx`
- `components/editor/EditorToolbar.d.ts`
- `components/editor/EditorToolbar.prompt.md`
- `stories/EditorToolbar.stories.jsx`

## Sources

- EditorToolbar prompt contract: `components/editor/EditorToolbar.prompt.md`
- Storybook implementation evidence: `stories/EditorToolbar.stories.jsx`
- [WAI-ARIA APG: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/)
- [Apple HIG: Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)
- [Figma: Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)
- [WCAG 2.2: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
