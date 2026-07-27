# Viewport Status Bar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Editor |
| Owner | `ViewportStatusBar` |
| Storybook | `LDS Product/Editor/Viewport Status Bar` |
| Source | `../component-content.json#product-editor-viewport-status-bar` |

운영자가 캔버스를 조작하는 동안 좌표·줌·선택 수·렌더링 상태를 지속해서 확인해야 할 때 적합합니다. 즉시 대응해야 하는 오류나 전역 시스템 상태에는 Status Bar 대신 Alert 또는 상태 배너를 사용하세요.

## 사용 판단

### 사용하지 않음

- items are persistent passive readouts. They are deliberately not a live region, so cursor, camera, and FPS updates do not continuously interrupt screen-reader users.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Persistent readout group accessible name. @default "뷰포트 상태" |
| messageToneLabel | Visible semantic text paired with messageTone. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `string` | No | Persistent readout group accessible name. @default "뷰포트 상태" |
| `items` | `ViewportStatusItem[]` | No | Persistent, non-live viewport readouts. |
| `message` | `React.ReactNode` | No | Optional transient viewport-local message, announced politely. |
| `messageTone` | `'default' \| 'signal' \| 'positive' \| 'cautionary' \| 'negative' \| 'warning' \| 'danger'` | No | Semantic tone for the transient message. @default "default" |
| `messageToneLabel` | `React.ReactNode` | No | Visible semantic text paired with messageTone. |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| items | Persistent, non-live viewport readouts. |
| messageTone | Semantic tone for the transient message. @default "default" |
| messageToneLabel | Visible semantic text paired with messageTone. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-label-strong | light: #000000; dark: #FFFFFF |

## Responsive

- message is for a short viewport-local outcome or hint and uses a polite, atomic status live region. Persistent connection or document state belongs in the owning shell/header instead.
- messageTone (default default) keeps a plain-text message unless the outcome is genuinely semantic; any non-default tone wraps the message in a status badge with a visible tone word (messageToneLabel, or the standard 활성/정상/주의/위험 default), so tone is never color-only. Do not use a toned message for routine confirmations.
- Keep this bar passive. History, save, reset, viewport controls, and destructive actions belong in their respective command surfaces. children remains only as a deprecated passive-status compatibility slot.
- Blender Manual: Status Bar places contextual shortcuts, messages, and scene statistics in a compact bottom region. LDS separates a transient message from persistent telemetry while keeping both local to the viewport.

## Content and writing

- Use mono for coordinates, camera values, and frequently changing numeric telemetry. Toned values always include a visible semantic label; customize it with toneLabel/messageToneLabel.

## Accessibility

- The bar never wraps. It uses spacing instead of independent divider nodes, preventing orphaned separators when space contracts.
- Item value is string | number and unit is a string; surrounding whitespace is normalized. Value/unit DOM text follows TelemetryValue: %, ‰, and plane-angle ° attach to the number, while SI·compound units and °C/°F keep one literal space.

## Related components

| Component | Relationship |
| --- | --- |
| `CanvasEditorCommandBar` | 대표 시나리오에서 조합 |
| `CanvasEditorShell` | 대표 시나리오에서 조합 |
| `EditorToolbar` | 대표 시나리오에서 조합 |
| `HistoryToolbar` | 대표 시나리오에서 조합 |
| `LayerPanel` | 대표 시나리오에서 조합 |
| `SelectionInspector` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

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

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--font-mono`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--space-1`
- `--space-2`
- `--space-4`

### Source contracts

- `components/editor/ViewportStatusBar.jsx`
- `components/editor/ViewportStatusBar.d.ts`
- `components/editor/ViewportStatusBar.prompt.md`
- `stories/EditorViewportStatusBar.stories.jsx`

## Migration

- New code uses the system status vocabulary signal / positive / cautionary / negative. warning and danger remain compatibility aliases only, so Editor/Viewer status surfaces do not invent a second tone language.

## Sources

- ViewportStatusBar prompt contract: `components/editor/ViewportStatusBar.prompt.md`
- Storybook implementation evidence: `stories/EditorViewportStatusBar.stories.jsx`
- [Blender Manual: Status Bar](https://docs.blender.org/manual/fi/5.0/interface/window_system/status_bar.html)
- [Unity Manual: Learning the Interface](https://docs.unity3d.com/kr/530/Manual/LearningtheInterface.html)
