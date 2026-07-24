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

- 툴바의 검색·설정·닫기처럼 의미가 익숙하고 짧은 레이블을 시각적으로 숨겨야 하는 행동에 적합합니다. 의미가 모호하거나 중요한 결정에는 텍스트가 보이는 Button을, 켬·끔 상태를 유지하는 행동에는 Toggle Icon을 사용하세요.
- round: circular by default (WDS icon buttons are always circular); pass round={false} for the rounded-square look.
- IconButton is the WDS Action/Icon Button primitive for icon-only actions such as navigation arrows, close, search, and tool commands.
- Icon Button가 소유하는 Action 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요.
- Use ToggleIcon instead when the icon-only control has persistent on/off state.
- hover/pressed는 tone만 변경하고 lift·scale·shadow를 추가하지 않습니다.
- - Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요. - variant: soft, solid, signal, ghost, plain, on-dark. plain은 grouped toolbar처럼 부모 surface가 hover/background를 소유하는 조합용입니다. - size: pix….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | IconButton의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | Required accessible label for the icon-only control. |
| Children | Icon glyph or inline SVG content. |

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
| variant | Visual action variant mapped through LK theme tokens. @default "soft" 타입 계약: "soft" \| "solid" \| "signal" \| "ghost" \| "plain" \| "on-dark" |
| 상호작용 · 아이콘 행동 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Native disabled removes the command from focus. aria-disabled="true" keeps it programmatically discoverable while applying unavailable styling and blocking activation; composite widgets decide whether it stays in their Arrow-key navigation model.
- hover/pressed는 tone만 변경하고 lift·scale·shadow를 추가하지 않습니다.
- WAI-ARIA Button Pattern의 accessible name, Enter/Space, unavailable semantics를 따릅니다. WDS의 원형 Icon Button을 기본으로 유지하고 round={false}는 명시적인 LDS 확장입니다.
- IconButton is the WDS Action/Icon Button primitive for icon-only actions such as navigation arrows, close, search, and tool commands.
- - Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요. - variant: soft, solid, signal, ghost, plain, on-dark. plain은 grouped toolbar처럼 부모 surface가 hover/background를 소유하는 조합용입니다. - size: pix….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | size: pixel size or size key, default medium (40). |
| 명시 규칙 2 | - Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요. - variant: soft, solid, signal, ghost, plain, on-dark. plain은 grouped toolbar처럼 부모 surface가 hover/background를 소유하는 조합용입니다. - size: pix… |
| --border-thin | 1px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-brand-ink | light: #0E1329; dark: #E7EAF2 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요.
- WAI-ARIA Button Pattern의 accessible name, Enter/Space, unavailable semantics를 따릅니다. WDS의 원형 Icon Button을 기본으로 유지하고 round={false}는 명시적인 LDS 확장입니다.
- - Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요. - variant: soft, solid, signal, ghost, plain, on-dark. plain은 grouped toolbar처럼 부모 surface가 hover/background를 소유하는 조합용입니다. - size: pix….
- 사용자에게 보이는 Icon Button 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.

## Accessibility

- Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요.
- Native disabled removes the command from focus. aria-disabled="true" keeps it programmatically discoverable while applying unavailable styling and blocking activation; composite widgets decide whether it stays in their Arrow-key navigation model.
- WAI-ARIA Button Pattern의 accessible name, Enter/Space, unavailable semantics를 따릅니다. WDS의 원형 Icon Button을 기본으로 유지하고 round={false}는 명시적인 LDS 확장입니다.
- - Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요. - variant: soft, solid, signal, ghost, plain, on-dark. plain은 grouped toolbar처럼 부모 surface가 hover/background를 소유하는 조합용입니다. - size: pix….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | round: circular by default (WDS icon buttons are always circular); pass round={false} for the rounded-square look. |
| Don't | Always provide label; it is the accessible name for the icon-only control. 누락하면 development 빌드에서 console 경고가 출력됩니다(production 번들에서는 제거됨). 이름을 외부 노드에서 참조해야 하면 aria-labelledby를 대신 쓰세요. |
| Do | IconButton is the WDS Action/Icon Button primitive for icon-only actions such as navigation arrows, close, search, and tool commands. |
| Don't | Use ToggleIcon instead when the icon-only control has persistent on/off state. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 IconButton의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ActionArea` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Fab` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TextButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToggleIcon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- IconButton prompt contract: `components/buttons/IconButton.prompt.md`
- Storybook implementation evidence: `stories/ActionIconButton.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
