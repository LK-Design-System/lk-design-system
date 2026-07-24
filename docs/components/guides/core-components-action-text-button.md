# Text Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Action |
| Owner | `TextButton` |
| Storybook | `LDS Core/Components/Action/Text Button` |
| Source | `../component-content.json#core-components-action-text-button` |

더보기, 취소처럼 표면을 만들지 않고도 의미가 분명한 보조 행동에 적합합니다. 제출·저장처럼 주요 결과를 만드는 행동에는 Button을, 다른 위치로 이동하는 탐색에는 Link를 사용하세요.

## 사용 판단

### 사용

- 더보기, 취소처럼 표면을 만들지 않고도 의미가 분명한 보조 행동에 적합합니다. 제출·저장처럼 주요 결과를 만드는 행동에는 Button을, 다른 위치로 이동하는 탐색에는 Link를 사용하세요.
- loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden.
- Use Button for filled CTAs and IconButton for icon-only actions.
- TextButton is a button-style action with sizes and loading state. Use Link for pure anchor/navigation text with underline control.

### 사용하지 않음

- hover/pressed는 opacity tone만 낮추며 lift·scale·shadow를 사용하지 않습니다.
- arrow is deprecated and remains as a no-op compatibility prop.
- - tone: signal, neutral, danger. - size: sm, md, lg. - underline gives link-style emphasis; as="a" renders a link. - loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden. - lo….
- Text Button가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | TextButton의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Loading Label | Screen-reader label announced with the loading spinner. @default "불러오는 중" |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `"signal" \| "neutral" \| "danger"` | No | Text action tone mapped through LK theme tokens. @default "signal" |
| `color` | `"primary" \| "assistive"` | No | color axis. When set, it takes precedence over tone. |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | No | Aliases map small/medium/large to sm/md/lg. @default "md" |
| `arrow` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `underline` | `boolean` | No | Draw an underline for link-style usage. @default false |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disable` | `boolean` | No | Disable alias. |
| `loading` | `boolean` | No | Show the action loading state and prevent repeated activation. The control stays focusable while loading (aria-disabled + aria-busy rather than native disabled). |
| `loadingLabel` | `string` | No | Screen-reader label announced with the loading spinner. @default "불러오는 중" |
| `as` | `React.ElementType` | No | Render with another element or component, such as "a". @default "button" |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| tone | Text action tone mapped through LK theme tokens. @default "signal" 타입 계약: "signal" \| "neutral" \| "danger" |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| loading | Show the action loading state and prevent repeated activation. The control stays focusable while loading (aria-disabled + aria-busy rather than native disabled). 타입 계약: boolean |
| loadingLabel | Screen-reader label announced with the loading spinner. @default "불러오는 중" 타입 계약: string |
| 상호작용 · 로딩과 비활성 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- loading은 native disabled가 아니라 aria-disabled="true" + aria-busy="true"로 처리해 focus를 유지합니다(Button과 동일한 계약).
- Native disabled removes the action from focus. aria-disabled="true" keeps it discoverable while applying unavailable styling and blocking activation.
- hover/pressed는 opacity tone만 낮추며 lift·scale·shadow를 사용하지 않습니다.
- WAI-ARIA Button Pattern의 keyboard/disabled 계약을 따릅니다. WDS 직접 축은 primary/assistive, small/medium, disable이며 danger, lg, underline, loading, anchor는 LDS 확장입니다.
- - tone: signal, neutral, danger. - size: sm, md, lg. - underline gives link-style emphasis; as="a" renders a link. - loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden. - lo….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body1-size | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --body1-spacing | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Responsive

- loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden.
- TextButton is the WDS Action/Text Button primitive for low-emphasis text actions. Use it for inline links, card footers, secondary dismissals, and compact "more" actions.
- - tone: signal, neutral, danger. - size: sm, md, lg. - underline gives link-style emphasis; as="a" renders a link. - loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden. - lo….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden.
- TextButton is a button-style action with sizes and loading state. Use Link for pure anchor/navigation text with underline control.
- TextButton is the WDS Action/Text Button primitive for low-emphasis text actions. Use it for inline links, card footers, secondary dismissals, and compact "more" actions.
- - tone: signal, neutral, danger. - size: sm, md, lg. - underline gives link-style emphasis; as="a" renders a link. - loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden. - lo….

## Accessibility

- loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden.
- loading은 native disabled가 아니라 aria-disabled="true" + aria-busy="true"로 처리해 focus를 유지합니다(Button과 동일한 계약).
- Native disabled removes the action from focus. aria-disabled="true" keeps it discoverable while applying unavailable styling and blocking activation.
- WAI-ARIA Button Pattern의 keyboard/disabled 계약을 따릅니다. WDS 직접 축은 primary/assistive, small/medium, disable이며 danger, lg, underline, loading, anchor는 LDS 확장입니다.
- - tone: signal, neutral, danger. - size: sm, md, lg. - underline gives link-style emphasis; as="a" renders a link. - loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden. - lo….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden. |
| Don't | hover/pressed는 opacity tone만 낮추며 lift·scale·shadow를 사용하지 않습니다. |
| Do | Use Button for filled CTAs and IconButton for icon-only actions. |
| Don't | arrow is deprecated and remains as a no-op compatibility prop. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 TextButton의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ActionArea` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Fab` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToggleIcon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<TextButton>View all</TextButton>
<TextButton tone="neutral" underline>Cancel</TextButton>
<TextButton loading loadingLabel="Loading more">Loading</TextButton>
<TextButton as="a" href="/products">View products</TextButton>
```

## Tokens and API

### Tokens

- `--body1-size`
- `--body1-spacing`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-status-negative-text`
- `--component-button-text-hover-opacity`
- `--component-button-transition`
- `--font-sans`
- `--fw-semibold`
- `--label1-size`
- `--label1-spacing`

### Source contracts

- `components/buttons/TextButton.jsx`
- `components/buttons/TextButton.d.ts`
- `components/buttons/TextButton.prompt.md`
- `stories/ActionTextButton.stories.jsx`

## Migration

- arrow is deprecated and remains as a no-op compatibility prop.
- - tone: signal, neutral, danger. - size: sm, md, lg. - underline gives link-style emphasis; as="a" renders a link. - loading prevents repeated activation, renders a spinner, and sets aria-busy; use loadingLabel for the single screen-reader name (기본값 불러오는 중). Existing content keeps its width while visually hidden. - lo….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- TextButton prompt contract: `components/buttons/TextButton.prompt.md`
- Storybook implementation evidence: `stories/ActionTextButton.stories.jsx`
- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
