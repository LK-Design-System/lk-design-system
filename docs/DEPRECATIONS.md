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
| `disable?: boolean;` | `components/buttons/Button.d.ts` | Use `disabled`. @default false |
| `arrow?: boolean;` | `components/buttons/TextButton.d.ts` | Kept as a no-op compatibility prop. |
| `placement?: "top" \| "bottom" \| "left" \| "right";` | `components/content/Tooltip.d.ts` | Use `position`. |
| `viewActions?: CanvasEditorCommandBarAction[];` | `components/editor/CanvasEditorCommandBar.d.ts` | Kept for source compatibility. Move these actions beside the viewport. |
| `viewLabel?: string;` | `components/editor/CanvasEditorCommandBar.d.ts` | Viewport zoom/fit/camera controls belong in a viewport-local toolbar. |
| `children?: React.ReactNode;` | `components/editor/ViewportStatusBar.d.ts` | Compatibility slot for passive trailing status only. Prefer items/message. |
| `disable?: boolean;` | `components/forms/Input.d.ts` | Use `disabled`. |
| `fieldStyle?: React.CSSProperties;` | `components/forms/SearchField.d.ts` | Use root `style`. |
| `disable?: boolean;` | `components/forms/Select.d.ts` | Use `disabled`. |
| `negative?: boolean;` | `components/forms/Select.d.ts` | Use `invalid` or `status="negative"`. |
| `disable?: boolean;` | `components/forms/Textarea.d.ts` | Use `disabled`. |
| `severityLabel?: React.ReactNode;` | `components/forms/ValidationSummary.d.ts` | Severity is presented once by the error or warning group heading. |
| `full?: boolean;` | `components/navigation/Tabs.d.ts` | Use `resize="fill"`. @default false |
| `disable?: boolean;` | `components/overlay/DropdownMenu.d.ts` | Use `disabled`. |
| `disable?: boolean;` | `components/selection/SegmentedControl.d.ts` | Use `disabled`. |
| `empty?: React.ReactNode;` | `components/viz/Scene3DFrame.d.ts` | Use state="no-source" and stateLabel. |
| `loading?: boolean;` | `components/viz/Scene3DFrame.d.ts` | Use state="loading". |
| `active?: boolean;` | `components/viz/ViewerToolbar.d.ts` | `kind="toggle" pressed={...}`를 사용하세요. 이전 active 사용은 호환을 위해 toggle로 해석됩니다. |
