# Command Bar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Editor |
| Owner | `CanvasEditorCommandBar` |
| Storybook | `LDS Product/Editor/Command Bar` |
| Source | `../component-content.json#product-editor-command-bar` |

운영자가 저장·내보내기·실행 취소처럼 편집 문서 전체의 수명주기를 다룰 때 적합합니다. 줌·카메라·레이어처럼 현재 뷰포트에만 영향을 주는 동작에는 Viewer Toolbar 또는 해당 로컬 도구를 사용하세요.

## 사용 판단

### 사용하지 않음

- Selection-specific actions belong in SelectionInspector; destructive application workflows do not belong in this design-system primitive.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 전체 document command group 접근성 라벨. |
| documentLabel | documentActions가 있을 때 렌더링되는 문서 명령 툴바 라벨. |
| documentActions | 저장, 내보내기처럼 문서 수명주기에 속하는 명령. |
| historyLabel | 히스토리 툴바 접근성 라벨. |
| children | 저장 버튼처럼 별도 컴포넌트가 필요한 문서 작업 슬롯. |
| extraLabel | 추가 명령 슬롯 접근성 라벨. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `string` | No | 전체 document command group 접근성 라벨. |
| `documentLabel` | `string` | No | documentActions가 있을 때 렌더링되는 문서 명령 툴바 라벨. |
| `documentActions` | `CanvasEditorCommandBarAction[]` | No | 저장, 내보내기처럼 문서 수명주기에 속하는 명령. |
| `viewLabel` | `string` | No |  |
| `viewActions` | `CanvasEditorCommandBarAction[]` | No |  |
| `size` | `'sm' \| 'md'` | No | Document/history icon control density. sm=32px, md=40px. @default "sm" |
| `showHistory` | `boolean` | No | 히스토리 툴바 표시 여부. @default true |
| `historyLabel` | `string` | No | 히스토리 툴바 접근성 라벨. |
| `canUndo` | `boolean` | No | 실행 취소 가능 여부. 실제 handler가 없으면 비활성입니다. @default false |
| `canRedo` | `boolean` | No | 다시 실행 가능 여부. 실제 handler가 없으면 비활성입니다. @default false |
| `onUndo` | `() = void` | No |  |
| `onRedo` | `() = void` | No |  |
| `undoKeyShortcuts` | `string` | No | Set only when the owning editor implements this undo shortcut globally. |
| `redoKeyShortcuts` | `string` | No | Set only when the owning editor implements this redo shortcut globally. |
| `onReset` | `() = void` | No | 함수가 있으면 변경사항 초기화 버튼 표시. |
| `children` | `React.ReactNode` | No | 저장 버튼처럼 별도 컴포넌트가 필요한 문서 작업 슬롯. |
| `extraLabel` | `string` | No | 추가 명령 슬롯 접근성 라벨. |

## Behavior and interaction

- CanvasEditorCommandBar - Stable document-level command group for CanvasEditorShell.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size="sm" uses the 32px LDS IconButton; size="md" uses 40px. |
| --space-1 | 4px |
| --space-2 | 8px |

## Responsive

- viewActions/viewLabel are deprecated compatibility props. They still render to avoid a breaking release, but new and migrated consumers place those actions beside the viewport.
- Figma: Navigating UI3 separates stable interface regions from contextual canvas and selection controls. LDS adapts that hierarchy by keeping document/history work in the shell header and view manipulation near the viewport.
- Apple HIG: Toolbars informed the leading history/document grouping and keeping viewport actions in their own contextual region.
- Use it in the shell toolbar slot for history and document-lifecycle commands. Zoom, fit, camera, orbit, and other view controls stay in a viewport-local toolbar.

## Accessibility

- children is the escape hatch for document work that needs a real component instead of an icon action — a labelled save Button, a status chip. It renders as the trailing group; commands that fit the icon-action shape belong in documentActions.
- Each group carries its own accessible name: historyLabel (default 편집 이력) for the history toolbar, documentLabel (default 문서 명령) for the document-action toolbar, and extraLabel (default 문서 작업) for the children group. Override them per product domain; screen-reader users navigate between groups by these names.
- Named action groups use toolbar semantics and Arrow/Home/End roving focus. Add ariaKeyShortcuts to document actions, or undoKeyShortcuts/redoKeyShortcuts to history, only when the product implements those shortcuts.
- Every built-in action group shares the same private focus engine as the editor and viewer toolbars so dynamic disabled/removed actions cannot create multiple Tab stops or lose the remembered command.
- WAI-ARIA APG: Toolbar Pattern defines a named toolbar, horizontal orientation, and Arrow/Home/End navigation. The built-in action groups follow that keyboard model.

## Exceptions

- The history group is the built-in HistoryToolbar and renders by default; set showHistory={false} only when the owning editor has no undo model at all. Supplying onReset adds a reset-changes command to that group — reserve it for editors where discarding all pending changes is a real, recoverable operation.
- A history command is enabled only when both its can state and handler permit it. A document action without a handler is ignored unless it is explicitly supplied as a disabled state.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `CanvasEditorShell` | 대표 시나리오에서 조합 |
| `EditorToolbar` | 대표 시나리오에서 조합 |
| `HistoryToolbar` | 대표 시나리오에서 조합 |
| `LayerPanel` | 대표 시나리오에서 조합 |
| `SelectionInspector` | 대표 시나리오에서 조합 |
| `ViewportStatusBar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<CanvasEditorCommandBar
  canUndo={undoStack.length > 0}
  canRedo={redoStack.length > 0}
  onUndo={undo}
  onRedo={redo}
  documentActions={[
    { value: 'export', label: '내보내기', icon: 'export', onClick: exportDocument },
  ]}
>
  <Button size="sm" onClick={saveDocument}>저장</Button>
</CanvasEditorCommandBar>
```

## Tokens and API

### Tokens

- `--space-1`
- `--space-2`

### Source contracts

- `components/editor/CanvasEditorCommandBar.jsx`
- `components/editor/CanvasEditorCommandBar.d.ts`
- `components/editor/CanvasEditorCommandBar.prompt.md`
- `stories/EditorCommandBar.stories.jsx`

## Sources

- CanvasEditorCommandBar prompt contract: `components/editor/CanvasEditorCommandBar.prompt.md`
- Storybook implementation evidence: `stories/EditorCommandBar.stories.jsx`
- [Figma: Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3)
- [WAI-ARIA APG: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
- [Apple HIG: Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/)
