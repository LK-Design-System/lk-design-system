# Selection Inspector

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Editor |
| Owner | `SelectionInspector` |
| Storybook | `LDS Product/Editor/Selection Inspector` |
| Source | `../component-content.json#product-editor-selection-inspector` |

운영자가 캔버스에서 고른 객체의 상태·속성·객체 범위 작업을 확인할 때 적합합니다. 전역 설정이나 선택과 무관한 폼에는 Selection Inspector 대신 일반 Form 또는 Settings 패널을 사용하세요.

## 사용 판단

### 사용하지 않음

- Use selectionCount for multi-selection and field.mixed for properties that do not share one value. Mixed values render as —; do not invent a representative value.
- TaskCreateScreen has no selected-object inspection decision, so SelectionInspector is not applicable to that workflow. Keep the task form and step list product-owned instead of forcing any canvas workflow into this component.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `item` | `SelectionInspectorItem \| null` | No |  |
| `selectionCount` | `number` | No | 다중 선택 개수. 2 이상이면 공통 속성 inspector 제목으로 표시합니다. |
| `title` | `React.ReactNode` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |
| `sections` | `SelectionInspectorSection[]` | No |  |
| `actions` | `React.ReactNode` | No |  |
| `onClearSelection` | `React.MouseEventHandler` | No |  |
| `clearSelectionLabel` | `React.ReactNode` | No |  |
| `clearSelectionAriaLabel` | `string` | No |  |
| `children` | `React.ReactNode` | No |  |

## Behavior and interaction

- Keep selection identity and status fixed at the top, make property groups independently collapsible, and keep object-scoped actions in the sticky actions area.
- Figma right properties panel and selection guidance support a selection-bound right panel and one shared canvas/tree selection model.
- The resulting LDS contract covers no selection, one selection, multi/mixed selection, status, read-only/locked content supplied by consumers, and object actions. Domain-specific property schemas remain Product/Robotics composition.
- SelectionInspector - Selection-bound identity and properties region.
- Use it for a selected canvas or scene object such as a waypoint, route segment, zone, map annotation, crop volume, or bounding box. Keep it separate from layer/display selection.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 숫자 0, boolean false, 빈 문자열은 누락으로 취급하지 않습니다. boolean은 문자열로, 빈 문자열은 —로 표시하며 valueNode에도 같은 원칙을 적용합니다. |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-strong | light: #000000; dark: #FFFFFF |
| --color-semantic-line-normal-alternative | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Content and writing

- With no item and no selectionCount, the inspector shows emptyLabel (default 선택한 객체가 없습니다.) as a status region. Keep it a short instruction about selecting on the canvas, not a workflow message.
- SelectionInspector is a named region rather than a second nested complementary landmark. CanvasEditorShell/DockPanel owns the docked or overlay panel landmark and resize/collapse behavior.
- Field and object status use the canonical signal / positive / cautionary / negative vocabulary. warning and danger are compatibility aliases, not names for new usage.
- Unity Inspector supports a contextual property surface that follows the selected object.

## Accessibility

- Keep reversible commit actions at the trailing edge. A destructive object action uses the danger button grammar, is separated from the primary commit action with flexible space, and opens ConfirmDialog before execution. Do not disguise deletion as a neutral assistive action beside Apply.
- Standard field value is a string/number/boolean and unit is a string. Surrounding whitespace is removed; %, ‰, and plane-angle ° attach, while SI·compound units and °C/°F keep one literal space in both visible and accessible DOM text.
- For editable or composed properties, use the explicit valueNode escape or section children. valueNode bypasses automatic unit formatting, so the consumer owns its complete visible and accessible text. The inspector itself does not invent a second form-control language.
- Use onClearSelection when the workflow supports clearing the current canvas selection. Keep the clear action in the inspector header.
- In pinned lkwebviz coverage, SelectionInspector can satisfy only the selected-object part of the right properties/settings region. Active tab/tool state, PGM settings and product forms remain separate product-owned composition; the source does not define this component's anatomy or style.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `ConfirmDialog` | 대표 시나리오에서 조합 |
| `CanvasEditorCommandBar` | 대표 시나리오에서 조합 |
| `CanvasEditorShell` | 대표 시나리오에서 조합 |
| `EditorToolbar` | 대표 시나리오에서 조합 |
| `HistoryToolbar` | 대표 시나리오에서 조합 |
| `LayerPanel` | 대표 시나리오에서 조합 |
| `ViewportStatusBar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<SelectionInspector
  item={{ label: 'Zone A-03', kind: 'Polygon', status: 'verified', statusTone: 'online' }}
  sections={[{ title: 'Geometry', fields: [{ label: 'Area', value: 24.8, unit: 'm2' }] }]}
  onClearSelection={clearSelection}
/>
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-alternative`
- `--color-semantic-line-normal-normal`
- `--color-semantic-status-cautionary-text`
- `--color-semantic-status-negative-text`
- `--control-h-md`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--headline2-line`
- `--headline2-size`
- `--label2-line`
- `--label2-size`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/editor/SelectionInspector.jsx`
- `components/editor/SelectionInspector.d.ts`
- `components/editor/SelectionInspector.prompt.md`
- `stories/EditorSelectionInspector.stories.jsx`

## Sources

- SelectionInspector prompt contract: `components/editor/SelectionInspector.prompt.md`
- Storybook implementation evidence: `stories/EditorSelectionInspector.stories.jsx`
- [Figma right properties panel](https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-inspect-right-sidebar-)
- [selection guidance](https://help.figma.com/hc/en-us/articles/360040449873-Select-layers-and-objects)
- [Unity Inspector](https://docs.unity3d.com/es/current/Manual/UsingTheInspector.html)
- [Adobe Spectrum Action Bar](https://spectrum.adobe.com/page/action-bar/)
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
