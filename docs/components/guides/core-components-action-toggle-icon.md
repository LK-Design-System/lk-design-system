# Toggle Icon

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `ToggleIcon` |
| Storybook | `LDS Core/Components/Action/Toggle Icon` |
| Source | `../component-content.json#core-components-action-toggle-icon` |

미리보기 표시, 즐겨찾기, 고정처럼 같은 제어를 다시 눌러 상태를 해제하는 이진 선택에 적합합니다. 즉시 실행 후 끝나는 행동은 Icon Button을, 텍스트 레이블이 필요한 설정은 Switch나 Toggle Button을 사용하세요.

## 사용 판단

### 사용

- 미리보기 표시, 즐겨찾기, 고정처럼 같은 제어를 다시 눌러 상태를 해제하는 이진 선택에 적합합니다. 즉시 실행 후 끝나는 행동은 Icon Button을, 텍스트 레이블이 필요한 설정은 Switch나 Toggle Button을 사용하세요.
- Always provide label; the visible content is icon-only.
- variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다.
- Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text.

### 사용하지 않음

- For one-shot icon actions, use IconButton instead.
- - Always provide label; the visible content is icon-only. - variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다. - Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text. - For one-shot ico….
- Toggle Icon가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ToggleIcon의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | Accessible label for the icon-only control. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `pressed` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultPressed` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(next: boolean) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `string` | Yes | Accessible label for the icon-only control. |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `variant` | `'default' \| 'plain' \| 'on-dark'` | No | Visual treatment for standalone, grouped-surface, or dark-viewer use. @default "default" |
| `disable` | `boolean` | No | Disable alias retained for WDS compatibility. |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| pressed | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| defaultPressed | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| variant | Visual treatment for standalone, grouped-surface, or dark-viewer use. @default "default" 타입 계약: 'default' \| 'plain' \| 'on-dark' |
| 상호작용 · 지속 상태 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다.
- Native disabled removes the control from focus. aria-disabled="true" keeps it discoverable while applying the same unavailable styling and blocking activation; use that distinction only when a composite widget deliberately keeps unavailable choices in Arrow-key navigation.
- hover/pressed는 tone만 변경하고 aria-pressed의 persistent state와 구분합니다.
- WAI-ARIA Button Pattern처럼 label을 상태에 따라 바꾸지 않고 aria-pressed만 갱신합니다. WDS의 Active/Inactive 역할은 유지하며 boxed surface와 plain/on-dark는 승인된 LK 변형입니다.
- - Always provide label; the visible content is icon-only. - variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다. - Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text. - For one-shot ico….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --border-thin | 1px |
| --color-semantic-fill-alternative | light: rgba(112, 115, 124, 0.05); dark: rgba(112, 115, 124, 0.12) |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Responsive

- variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다.
- - Always provide label; the visible content is icon-only. - variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다. - Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text. - For one-shot ico….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Always provide label; the visible content is icon-only.
- Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text.
- WAI-ARIA Button Pattern처럼 label을 상태에 따라 바꾸지 않고 aria-pressed만 갱신합니다. WDS의 Active/Inactive 역할은 유지하며 boxed surface와 plain/on-dark는 승인된 LK 변형입니다.
- - Always provide label; the visible content is icon-only. - variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다. - Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text. - For one-shot ico….

## Accessibility

- variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다.
- Native disabled removes the control from focus. aria-disabled="true" keeps it discoverable while applying the same unavailable styling and blocking activation; use that distinction only when a composite widget deliberately keeps unavailable choices in Arrow-key navigation.
- hover/pressed는 tone만 변경하고 aria-pressed의 persistent state와 구분합니다.
- WAI-ARIA Button Pattern처럼 label을 상태에 따라 바꾸지 않고 aria-pressed만 갱신합니다. WDS의 Active/Inactive 역할은 유지하며 boxed surface와 plain/on-dark는 승인된 LK 변형입니다.
- - Always provide label; the visible content is icon-only. - variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다. - Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text. - For one-shot ico….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Always provide label; the visible content is icon-only. |
| Don't | For one-shot icon actions, use IconButton instead. |
| Do | variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다. |
| Don't | - Always provide label; the visible content is icon-only. - variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다. - Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text. - For one-shot ico…. |

## Exceptions

- Native disabled removes the control from focus. aria-disabled="true" keeps it discoverable while applying the same unavailable styling and blocking activation; use that distinction only when a composite widget deliberately keeps unavailable choices in Arrow-key navigation.
- - Always provide label; the visible content is icon-only. - variant="plain"은 grouped light toolbar, variant="on-dark"는 dark viewport 위 조합에 사용합니다. pressed semantics와 disabled/focus 계약은 variant와 무관하게 같습니다. - Use ToggleIcon for icon-only state actions and ToggleButton when the control has visible text. - For one-shot ico….
- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ToggleIcon의 범용 API에 넣지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ActionArea` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Fab` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TextButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ToggleIcon label="Show route" defaultPressed>
  <Icon name="eye" size={18} />
</ToggleIcon>
```

## Tokens and API

### Tokens

- `--border-thin`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-label-disable`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-neutral`
- `--color-semantic-static-white`
- `--component-button-transition`
- `--component-toggle-icon-bg`
- `--component-toggle-icon-bg-active`
- `--component-toggle-icon-border`
- `--component-toggle-icon-fg`
- `--component-toggle-icon-fg-active`
- `--component-toggle-icon-radius`
- `--component-toggle-icon-size-md`
- `--component-toggle-icon-size-sm`
- `--viewer-foreground`

### Source contracts

- `components/buttons/ToggleIcon.jsx`
- `components/buttons/ToggleIcon.d.ts`
- `components/buttons/ToggleIcon.prompt.md`
- `stories/ActionToggleIcon.stories.jsx`

## Migration

- disable — disabled의 호환 별칭입니다.
- - disable — disabled의 호환 별칭입니다.
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ToggleIcon prompt contract: `components/buttons/ToggleIcon.prompt.md`
- Storybook implementation evidence: `stories/ActionToggleIcon.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
