# Deprecations

| Field | Value |
| --- | --- |
| Type | Generated register |
| Status | Generated · do not edit rows by hand |
| Owner | Component owners |
| Source | public declarations marked `@deprecated` |
| Generator | `npm run report:deprecations` |

This generated register is the release-facing inventory of public compatibility contracts marked with `@deprecated`. Update the declaration comment first, then run `npm run report:deprecations`.

| Declaration | Source | Migration |
| --- | --- | --- |
| `arrow?: boolean;` | `components/buttons/Button.d.ts` | Kept as a no-op compatibility prop. |
| `arrow?: boolean;` | `components/buttons/TextButton.d.ts` | Kept as a no-op compatibility prop. |
| `viewActions?: CanvasEditorCommandBarAction[];` | `components/editor/CanvasEditorCommandBar.d.ts` | Kept for source compatibility. Move these actions beside the viewport. |
| `viewLabel?: string;` | `components/editor/CanvasEditorCommandBar.d.ts` | Viewport zoom/fit/camera controls belong in a viewport-local toolbar. |
| `children?: React.ReactNode;` | `components/editor/ViewportStatusBar.d.ts` | Compatibility slot for passive trailing status only. Prefer items/message. |
| `actionLabel?: React.ReactNode;` | `components/forms/ValidationSummary.d.ts` | Kept only as a fallback when both message and label are absent. |
| `actionLabel?: React.ReactNode;` | `components/forms/ValidationSummary.d.ts` | Kept only as a fallback when issue message and label are absent. |
| `severityLabel?: React.ReactNode;` | `components/forms/ValidationSummary.d.ts` | Severity is presented once by the error or warning group heading. |
| `onEmergencyStopRequest?: () => void;` | `components/robotics/ManualControlSession.d.ts` | onStopRequest를 사용하세요. callback-only 하위 호환 별칭이며 onArmedChange(false)를 반영해야 합니다. |
| `empty?: React.ReactNode;` | `components/viz/Scene3DFrame.d.ts` | Use state="no-source" and stateLabel. |
| `loading?: boolean;` | `components/viz/Scene3DFrame.d.ts` | Use state="loading". |
| `active?: boolean;` | `components/viz/ViewerToolbar.d.ts` | `kind="toggle" pressed={...}`를 사용하세요. 이전 active 사용은 호환을 위해 toggle로 해석됩니다. |
