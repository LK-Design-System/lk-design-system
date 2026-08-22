# History Toolbar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Editor |
| Owner | `HistoryToolbar` |
| Storybook | `LDS Product/Editor/History Toolbar` |
| Source | `../component-content.json#product-editor-history-toolbar` |

운영자가 편집 이력을 되돌리거나 다시 적용하고 문서를 초기화해야 할 때 적합합니다. 일반 탐색 기록이나 서버 버전 목록에는 History Toolbar 대신 별도 History 패턴을 사용하세요.

## 사용 판단

### 사용

- HistoryToolbar - Undo, redo, and optional document-reset controls for editors.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Toolbar accessible name. @default "편집 이력" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `string` | No | Toolbar accessible name. @default "편집 이력" |
| `canUndo` | `boolean` | No | 실행 취소 가능 여부. 실제 handler가 없으면 항상 비활성입니다. @default false |
| `canRedo` | `boolean` | No | 다시 실행 가능 여부. 실제 handler가 없으면 항상 비활성입니다. @default false |
| `onUndo` | `() = void` | No |  |
| `onRedo` | `() = void` | No |  |
| `undoKeyShortcuts` | `string` | No | Set only when the owning editor implements this undo shortcut globally. |
| `redoKeyShortcuts` | `string` | No | Set only when the owning editor implements this redo shortcut globally. |
| `onReset` | `() = void` | No | 함수가 있으면 별도 그룹의 변경사항 초기화 버튼을 표시합니다. |
| `size` | `'sm' \| 'md'` | No | Shared LDS editor control density. sm=32px, md=40px. @default "sm" |

## Behavior and interaction

- canUndo/canRedo express history state, while a real handler guarantees operability. A missing handler always disables the corresponding command.
- Owner: LDS Product / Workspace. Its WDS provenance is product-extension. Application-specific history timelines, branching histories, autosave, and conflict recovery stay outside the LDS component contract.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size="sm" uses the 32px LDS IconButton; size="md" uses 40px. |
| --space-1 | 4px |

## Responsive

- This component owns edit history only. View reset belongs in a viewport-local viewer toolbar.

## Content and writing

- Figma: Navigating UI3 supports keeping global edit history in the stable editor chrome while contextual view and selection controls remain local.

## Accessibility

- Arrow keys, Home, and End move the single roving tab stop. Set undoKeyShortcuts/redoKeyShortcuts only when the owning editor really implements those shortcuts globally; the values are then exposed through aria-keyshortcuts.
- Dynamic availability, focus memory, and Arrow/Home/End behavior use the same private roving-focus engine as EditorToolbar, ViewerToolbar, and CanvasEditorCommandBar; do not reimplement index-based focus state in individual toolbars.
- Consumer onKeyDown and onFocusCapture handlers are composed before the internal roving behavior. Calling preventDefault() intentionally cancels the internal key/focus update without replacing the handler itself.
- label (default 편집 이력) is the toolbar's accessible name; screen-reader users identify the group by it, so override it only with a name that still means edit history. The individual command names (실행 취소, 다시 실행, 변경사항 초기화) are fixed.
- WAI-ARIA APG: Toolbar Pattern supplies the named-toolbar and roving-focus keyboard contract.

## Exceptions

- Reset is rendered only when onReset is a function and is separated from reversible undo/redo commands.

## Related components

| Component | Relationship |
| --- | --- |
| `CanvasEditorCommandBar` | 대표 시나리오에서 조합 |
| `CanvasEditorShell` | 대표 시나리오에서 조합 |
| `EditorToolbar` | 대표 시나리오에서 조합 |
| `LayerPanel` | 대표 시나리오에서 조합 |
| `SelectionInspector` | 대표 시나리오에서 조합 |
| `ViewportStatusBar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<HistoryToolbar
  canUndo={undoStack.length > 0}
  canRedo={redoStack.length > 0}
  onUndo={undo}
  onRedo={redo}
  onReset={resetDocumentChanges}
  size="sm"
/>
```

## Tokens and API

### Tokens

- `--font-sans`
- `--space-1`

### Source contracts

- `components/editor/HistoryToolbar.jsx`
- `components/editor/HistoryToolbar.d.ts`
- `components/editor/HistoryToolbar.prompt.md`
- `stories/EditorHistoryToolbar.stories.jsx`

## Sources

- HistoryToolbar prompt contract: `components/editor/HistoryToolbar.prompt.md`
- Storybook implementation evidence: `stories/EditorHistoryToolbar.stories.jsx`
- [WAI-ARIA APG: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/)
- [Figma: Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)
