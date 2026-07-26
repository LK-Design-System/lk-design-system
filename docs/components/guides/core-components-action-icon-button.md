# Icon Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `IconButton` |
| Storybook | `LDS Core/Components/Action/Icon Button` |
| Source | `../component-content.json#core-components-action-icon-button` |

툴바의 검색·설정·닫기처럼 의미가 익숙하고 짧은 레이블을 시각적으로 숨겨야 하는 행동에 적합합니다. 의미가 모호하거나 중요한 결정에는 텍스트가 보이는 Button을, 켬·끔 상태를 유지하는 행동에는 Toggle Icon을 사용하세요.

## 사용 판단

### 사용

- round: circular by default (WDS icon buttons are always circular); pass round={false} for the rounded-square look.

### 사용하지 않음

- Use ToggleIcon instead when the icon-only control has persistent on/off state.
- hover/pressed는 tone만 변경하고 lift·scale·shadow를 추가하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | Required accessible label for the icon-only control. |
| children | Icon glyph or inline SVG content. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `variant` | `"soft" \| "solid" \| "signal" \| "ghost" \| "plain" \| "on-dark"` | No | Visual action variant mapped through LK theme tokens. @default "soft" |
| `size` | `number \| "custom" \| "small" \| "sm" \| "medium" \| "md"` | No | Square control size in px or size key. @default "medium" |
| `alternative` | `boolean` | No | alternative inverse treatment. @default false |
| `round` | `boolean` | No | Circular control (WDS default). Pass false to opt into the rounded-square look. @default true |
| `disable` | `boolean` | No | Disable alias. @default false |
| `label` | `string` | Yes | Required accessible label for the icon-only control. |
| `children` | `React.ReactNode` | No | Icon glyph or inline SVG content. |

## States

| State | Contract |
| --- | --- |
| variant | Visual action variant mapped through LK theme tokens. @default "soft" |

## Behavior and interaction

- IconButton is the WDS Action/Icon Button primitive for icon-only actions such as navigation arrows, close, search, and tool commands.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size: pixel size or size key, default medium (40). |
| --border-thin | 1px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-brand-ink | light: #0E1329; dark: #E7EAF2 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Accessibility

- Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요.
- Native disabled removes the command from focus. aria-disabled="true" keeps it programmatically discoverable while applying unavailable styling and blocking activation; composite widgets decide whether it stays in their Arrow-key navigation model.
- WAI-ARIA Button Pattern의 accessible name, Enter/Space, unavailable semantics를 따릅니다. WDS의 원형 Icon Button을 기본으로 유지하고 round={false}는 명시적인 LDS 확장입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ActionArea` | 대표 시나리오에서 조합 |
| `Button` | 대표 시나리오에서 조합 |
| `Fab` | 대표 시나리오에서 조합 |
| `TextButton` | 대표 시나리오에서 조합 |
| `ToggleIcon` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<IconButton variant="soft" label="Previous">{chevronLeft}</IconButton>
<IconButton variant="signal" label="Back to top">{arrowUp}</IconButton>
<IconButton variant="soft" round={false} label="Open settings">{gear}</IconButton>
<IconButton variant="on-dark" label="Next">{chevronRight}</IconButton>
```

## Tokens and API

### Tokens

- `--border-thin`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-brand-ink`
- `--color-semantic-fill-normal`
- `--color-semantic-inverse-label`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-secondary-normal`
- `--color-semantic-secondary-surface`
- `--color-semantic-static-white`
- `--component-button-transition`
- `--radius-md`
- `--radius-pill`
- `--viewer-foreground`

### Source contracts

- `components/buttons/IconButton.jsx`
- `components/buttons/IconButton.d.ts`
- `components/buttons/IconButton.prompt.md`
- `stories/ActionIconButton.stories.jsx`

## Sources

- IconButton prompt contract: `components/buttons/IconButton.prompt.md`
- Storybook implementation evidence: `stories/ActionIconButton.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
