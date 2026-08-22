**ViewportStatusBar** - Passive, viewport-local readouts in one prioritized line.

```jsx
<ViewportStatusBar
  message="선택 영역을 계산했습니다."
  items={[
    { label: '모드', value: '선택', priority: 'high' },
    { label: '선택', value: 2, priority: 'high' },
    { label: '커서', value: 'x 12.4 / y -3.8', mono: true },
    { label: 'FPS', value: 60, priority: 'low' },
  ]}
/>
```

- `items` are persistent passive readouts. They are deliberately not a live region, so cursor, camera, and FPS updates do not continuously interrupt screen-reader users.
- `message` is for a short viewport-local outcome or hint and uses a polite, atomic `status` live region. Persistent connection or document state belongs in the owning shell/header instead.
- `messageTone` (default `default`) keeps the message as plain text and, only when the outcome is genuinely semantic, adds a separate status badge with a visible tone word (`messageToneLabel`, or the standard 활성/정상/주의/위험 default). Do not add a tone badge to routine confirmations whose sentence already communicates completion.
- `priority="high"` items render first and resist shrinking; `low` items render last and yield first. Source order is preserved within each priority tier.
- The bar never wraps. It uses spacing instead of independent divider nodes, preventing orphaned separators when space contracts.
- Use `mono` for coordinates, camera values, and frequently changing numeric telemetry. A toned item keeps its data value as a plain readout and renders the visible semantic state in a separate `StatusBadge`; customize that state text with `toneLabel`. `messageToneLabel` performs the same role for a transient message.
- New code uses the system status vocabulary `signal / positive / cautionary / negative`. `warning` and `danger` remain compatibility aliases only, so Editor/Viewer status surfaces do not invent a second tone language.
- Item `value` is `string | number` and `unit` is a string; surrounding whitespace is normalized. Value/unit DOM text follows `TelemetryValue`: `%`, `‰`, and plane-angle `°` attach to the number, while SI·compound units and `°C`/`°F` keep one literal space. Arbitrary ReactNode readouts belong in the deprecated trailing `children` escape and must own their accessible text.
- Keep this bar passive. History, save, reset, viewport controls, and destructive actions belong in their respective command surfaces. `children` remains only as a deprecated passive-status compatibility slot.

## Research basis

- [Blender Manual: Status Bar](https://docs.blender.org/manual/fi/5.0/interface/window_system/status_bar.html) places contextual shortcuts, messages, and scene statistics in a compact bottom region. LDS separates a transient message from persistent telemetry while keeping both local to the viewport.
- [Unity Manual: Learning the Interface](https://docs.unity3d.com/kr/530/Manual/LearningtheInterface.html) establishes a dominant scene viewport with stable surrounding editor chrome. LDS therefore omits document actions from the status surface and keeps view-specific readouts subordinate to the viewport.

Owner: **LDS Product / Workspace**. Its WDS provenance is `product-extension`, not WDS parity. Interactive scrubbers, transport controls, global connection health, and application workflow progress are intentionally outside this primitive.
