**SelectionInspector** - Selection-bound identity and properties region.

Use it for a selected canvas or scene object such as a waypoint, route segment, zone, map annotation, crop volume, or bounding box. Keep it separate from layer/display selection.

```jsx
<SelectionInspector
  item={{ label: 'Zone A-03', kind: 'Polygon', status: 'verified', statusTone: 'online' }}
  sections={[{ title: 'Geometry', fields: [{ label: 'Area', value: 24.8, unit: 'm2' }] }]}
  onClearSelection={clearSelection}
/>
```

- `item` is not a layer. Layer/display state belongs to `LayerPanel.activeLayerId`.
- Keep selection identity and status fixed at the top, make property groups independently collapsible, and keep object-scoped actions in the sticky `actions` area.
- Keep reversible commit actions at the trailing edge. A destructive object action uses the danger button grammar, is separated from the primary commit action with flexible space, and opens `ConfirmDialog` before execution. Do not disguise deletion as a neutral assistive action beside Apply.
- Use `selectionCount` for multi-selection and `field.mixed` for properties that do not share one value. Mixed values render as `—`; do not invent a representative value.
- Standard field `value` is a string/number/boolean and `unit` is a string. Surrounding whitespace is removed; `%`, `‰`, and plane-angle `°` attach, while SI·compound units and `°C`/`°F` keep one literal space in both visible and accessible DOM text.
- For editable or composed properties, use the explicit `valueNode` escape or section `children`. `valueNode` bypasses automatic unit formatting, so the consumer owns its complete visible and accessible text. The inspector itself does not invent a second form-control language.
- Use `onClearSelection` when the workflow supports clearing the current canvas selection. Keep the clear action in the inspector header.
- `SelectionInspector` is a named region rather than a second nested complementary landmark. `CanvasEditorShell`/`DockPanel` owns the docked or overlay panel landmark and resize/collapse behavior.
- When mirroring the original `lk_web_viz` map editor, treat `SelectionInspector` as only one part of the right properties/settings sidebar. The original sidebar also covers active tab/tool state, PGM settings, selected object forms, and no-selection states.
- If the workflow is task/mission authoring from original `TaskCreateScreen`, a left task form and step list may be more faithful than a selected-object inspector.
- 숫자 `0`, boolean `false`, 빈 문자열은 누락으로 취급하지 않습니다. boolean은 문자열로, 빈 문자열은 `—`로 표시하며 `valueNode`에도 같은 원칙을 적용합니다.
- Field and object status use the canonical `signal / positive / cautionary / negative` vocabulary. `warning` and `danger` are compatibility aliases, not names for new usage.

Research basis (LK Robotics extension, not WDS parity):

- [Figma right properties panel](https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-inspect-right-sidebar-) and [selection guidance](https://help.figma.com/hc/en-us/articles/360040449873-Select-layers-and-objects) support a selection-bound right panel and one shared canvas/tree selection model.
- [Unity Inspector](https://docs.unity3d.com/es/current/Manual/UsingTheInspector.html) supports a contextual property surface that follows the selected object.
- [Adobe Spectrum Action Bar](https://spectrum.adobe.com/page/action-bar/) keeps contextual actions grouped while preserving a safe zone between selection identity and actions; LDS uses the same separation principle inside the inspector footer.
- [WAI-ARIA APG Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) defines the focus, Escape, and return-focus contract for the destructive confirmation.
- The resulting LDS contract covers no selection, one selection, multi/mixed selection, status, read-only/locked content supplied by consumers, and object actions. Domain-specific property schemas remain Product/Robotics composition.
