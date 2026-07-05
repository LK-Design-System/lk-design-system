**HistoryToolbar** — 에디터용 실행 취소 / 다시 실행 / 초기화 컨트롤. 히스토리 상태(`canUndo`/`canRedo`)에 연결하고, `count`로 깊이를 표시합니다.

```jsx
<HistoryToolbar canUndo={undo.length > 0} canRedo={redo.length > 0}
  onUndo={undoFn} onRedo={redoFn} onReset={resetFn} count={undo.length} />
```

- **canUndo / canRedo**로 버튼 활성화, **onReset** 있으면 초기화 버튼 노출, **count**로 단계 수 표시. `useHistory` 같은 앱 훅과 함께.
