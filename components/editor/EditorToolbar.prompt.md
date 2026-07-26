**EditorToolbar** — single-select, high-frequency canvas tool group for LK Robotics editors.

Classification: **LK Robotics Extension**. Use it for mutually exclusive editing modes such as select, route, region, marker, erase, or pan. Document commands belong in `CanvasEditorCommandBar`; viewport navigation and zoom controls belong in `ViewerToolbar` inside the viewport.

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

## Contract

- `items` accept `{ value, icon, label, shortcut, ariaKeyShortcuts, disabled, disabledReason }`; selection is controlled with `value` or uncontrolled with `defaultValue`.
- Activating the already selected mode re-emits that value through `onChange`; it never toggles a required editor mode off.
- The toolbar exposes one roving Tab stop. Orientation-appropriate Arrow keys move focus across its items, Home/End move to the boundaries, and native button activation changes an enabled tool.
- `ariaKeyShortcuts` is emitted when supplied. A string `shortcut` is also used as the ARIA shortcut value by default; visual-only React nodes are not.
- Tooltips open away from the rail by default: `right` for the vertical orientation, `bottom` for the horizontal one. Set `tooltipPosition` only when that default would collide with adjacent chrome (e.g. a right-docked rail should flip to `left`); it applies to every item, including disabled-reason tooltips.
- Each control composes the shared `ToggleIcon` foundation: 16px glyph, LDS small icon-control dimension (`--component-toggle-icon-size-sm`, currently 32px), shared radius/hover/focus/disabled treatment, and a quiet primary tint for the selected mode. Do not add an Editor-only edge marker; the selected surface and icon color are sufficient.
- Adjacent controls use the same `--space-1` gap as `ViewerToolbar`, `HistoryToolbar`, and command groups. Compactness comes from the shared 32px control, not an Editor-only 2px rhythm.
- `EditorToolbar` and `ViewerToolbar` share the private roving-focus engine, but not a public API: Editor items are mutually exclusive modes, while Viewer items remain independent commands or toggles.
- An individually disabled tool remains reachable with Arrow navigation so its `aria-disabled` state and reason can be discovered, but it cannot activate. A globally disabled toolbar leaves no item in the Tab sequence and exposes a string `disabledReason` on the toolbar itself. Do not hide unavailable tools when their presence explains the editor capability model.
- `CanvasEditorShell.tools` owns the rail surface, divider, and padding. `EditorToolbar` must not add a second card, border, or shadow.

## Research and local adaptation

- [WAI-ARIA APG: Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) established one Tab stop, orientation-aware Arrow navigation, Home/End support, and named controls.
- [Adobe Spectrum Action Group](https://spectrum.adobe.com/page/action-group/) reinforced keeping one density, size, selection model, and complete interaction-state grammar across related tool groups.
- [Apple HIG: Toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars) reinforced stable logical grouping and consistent placement while keeping contextual tools distinct from navigation and document commands.
- [Figma: Navigating UI3](https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3) reinforced keeping high-frequency editing controls stable while panels remain secondary and collapsible.
- [WCAG 2.2: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) established the minimum pointer-target floor. The 32px LDS small control exceeds that floor while matching the existing `IconButton` family.

The implementation follows those interaction expectations while using LDS tokens and the existing 32px small control convention. It intentionally omits product-specific command routing, shortcut conflict resolution, and persistent tool preferences.

Visual delta decision: Editor and Viewer toolbars share control size, icon size, gap, focus ring, disabled treatment, and roving-focus engine. Editor retains required single-selection and discoverable `aria-disabled` modes; Viewer retains independent commands/toggles and optional on-dark/surface appearances. Those role-driven differences must not introduce different radii or control dimensions.
