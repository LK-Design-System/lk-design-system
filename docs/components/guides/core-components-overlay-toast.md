# Toast

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `Toast` |
| Storybook | `LDS Core/Components/Overlay/Toast` |
| Source | `../component-content.json#core-components-overlay-toast` |

저장·게시·업로드처럼 사용자가 이미 시작한 작업의 성공, 주의, 실패 결과를 화면 가장자리에서 잠시 알릴 때 적합합니다. 반드시 읽고 결정해야 하는 내용에는 Alert를, 계속 보존해야 하는 상태에는 Banner를 사용하고 핵심 업무 정보를 Toast에만 의존하지 마세요.

## Anatomy

| Part | Contract |
| --- | --- |
| tone | tone. Legacy info/success/warning/error aliases are supported. @default "normal" |
| closeLabel | 닫기 버튼의 접근성 레이블. @default "닫기" |
| leadingIcon | leadingIcon axis. @default true |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `tone` | `\| "normal" \| "positive" \| "cautionary" \| "negative" \| "info" \| "success" \| "warning" \| "error"` | No | tone. Legacy info/success/warning/error aliases are supported. @default "normal" |
| `variant` | `"normal" \| "positive" \| "cautionary" \| "negative"` | No | Alias for the tone axis. |
| `children` | `React.ReactNode` | No |  |
| `action` | `React.ReactNode` | No |  |
| `onAction` | `() = void` | No |  |
| `onClose` | `() = void` | No |  |
| `closeLabel` | `string` | No | 닫기 버튼의 접근성 레이블. @default "닫기" |
| `leadingIcon` | `boolean` | No | leadingIcon axis. @default true |
| `icon` | `React.ReactNode` | No |  |
| `duration` | `number \| boolean \| null` | No | 자동 닫힘까지의 시간. true는 정책값 7000ms, 숫자는 ms, null/false는 자동 닫힘 없음. onClose가 있어야 동작하며 포인터 hover와 내부 초점 동안 남은 시간을 보존한 채 일시정지합니다. action이 있는 Toast는 WCAG 2.2.1(Timing Adjustable)에 따라 이 값을 무시하고 자동으로 닫히지 않습니다. @default null (자동 닫힘 없음) |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left' \| 'bottom-center'` | No | 모서리 / 가장자리. @default "bottom-right" |
| `gap` | `number` | No |  |
| `liveRegion` | `boolean` | No | 스택이 살아 있는 동안 유지되는 polite/assertive 라이브 영역 한 쌍을 렌더링하고, 하위 Toast가 자기 메시지를 그쪽으로 announce하게 합니다. 끄면 각 Toast가 스스로 라이브 영역이 됩니다(삽입과 동시에 생기는 라이브 영역은 announce 신뢰도가 낮습니다). |
| `children` | `React.ReactNode` | No |  |

## States

| State | Contract |
| --- | --- |
| tone | tone. Legacy info/success/warning/error aliases are supported. @default "normal" |
| variant | Alias for the tone axis. |

## Behavior and interaction

- duration 기본값은 null(자동 닫힘 없음)입니다. 자동으로 사라지는 것은 콘텐츠 소실이므로 명시적 opt-in으로 두고, 정책을 적용할 화면이 값을 밝히도록 합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 메시지는 body2 3짝(size·line·spacing) 토큰을 씁니다. 아이콘-메시지 gap 10px은 Toast 고유 메트릭으로, Snackbar(12px)와 표면별로 구분됩니다. |
| 명시 규칙 2 | 화면 배치는 ToastStack(bottom-right 등 5개 position)으로 감쌉니다. |
| 명시 규칙 3 | 추가 행동이 없는 성공·정보 Toast의 정책값은 7초이며 duration(축약형 true)이 이 값을 씁니다. 포인터가 Toast 위에 있거나 Toast 내부에 키보드 초점이 있는 동안에는 타이머가 남은 시간을 보존한 채 일시정지하고, 떠나면 남은 시간부터 재개합니다(hover가 읽는 시간을 되감지 않습니다). |
| 명시 규칙 4 | action이 있는 Toast는 duration을 줘도 자동으로 닫히지 않습니다. WCAG 2.2.1(Timing Adjustable)에 따라 사용자가 조작해야 하는 표면에는 시간 제한을 두지 않습니다. 컴포넌트가 이 규칙을 강제하므로 제품이 실수로 시간 제한을 걸 수 없습니다. 오류 복구·진행 상태도 같은 이유로 유지합니다. |
| --body2-line | 22px |

## Content and writing

- Use for short, temporary feedback. Use Snackbar when a heading, description, action, or close affordance is needed.
- 중요한 정보와 유일한 복구 경로를 Toast에만 두지 않습니다. queue·재노출 기록은 제품이 소유하고, Toast는 메시지·상태·동작 표면과 자신의 타이머만 소유합니다.
- Fluent 2 Toast는 행동 없는 확인 Toast의 7초 timeout과 hover pause, 행동이 필요한 메시지의 persistent/conditional dismiss를 구분합니다. LDS도 이 지속시간 문법을 따릅니다.
- Toast - transient WDS feedback message on a dark surface.

## Accessibility

- WDS axes: variant/tone (normal, positive, cautionary, negative) and leadingIcon. 별칭 info/success/warning/error도 정규화되어 동작합니다. closeLabel은 닫기 접근성 레이블(기본 "닫기").
- 자동 닫힘은 컴포넌트가 소유합니다. duration(ms)과 onClose를 함께 주면 Toast가 직접 타이머를 돌립니다. 제품이 setTimeout과 hover/focus 핸들러를 손으로 배선하지 않습니다.
- ToastStack 안에서 렌더링되면 Toast는 스스로 라이브 영역이 되지 않습니다. 내용과 함께 삽입된 role="status"는 스크린 리더가 announce하지 않는 경우가 많기 때문에, ToastStack이 열려 있는 동안 계속 존재하는 polite/assertive 라이브 영역 한 쌍을 두고 Toast는 자기 메시지 텍스트를 그쪽으로 밀어 넣습니다(Material·Polaris 관례).
- ToastStack 없이 단독으로 쓰면 기존처럼 Toast 자신이 role="status"/alert를 갖습니다(하위 호환).

## Related components

| Component | Relationship |
| --- | --- |
| `ToastStack` | 같은 페이지가 소유 |
| `Button` | 대표 시나리오에서 조합 |
| `Alert` | 대표 시나리오에서 조합 |
| `ConfirmDialog` | 대표 시나리오에서 조합 |
| `Dimmer` | 대표 시나리오에서 조합 |
| `DropdownMenu` | 대표 시나리오에서 조합 |
| `Modal` | 대표 시나리오에서 조합 |
| `Snackbar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Toast tone="positive">Saved.</Toast>
<Toast tone="cautionary" leadingIcon={false}>Check the required fields.</Toast>
```

### 추가 조합 2

```jsx
{/* duration 축약형: 정책값 7초 */}
  <Toast variant="positive" duration onClose={dismiss}>저장되었습니다.</Toast>
  {/* 명시적 ms */}
  <Toast variant="normal" duration={4000} onClose={dismiss}>임시 저장되었습니다.</Toast>
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--body2-spacing`
- `--color-semantic-inverse-label`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--component-transient-feedback-bg`
- `--component-transient-feedback-blur`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--label2-size`
- `--radius-lg`
- `--shadow-lg`
- `--space-2-5`

### Source contracts

- `components/overlay/Toast.jsx`
- `components/overlay/Toast.d.ts`
- `components/overlay/Toast.prompt.md`
- `components/overlay/ToastStack.jsx`
- `components/overlay/ToastStack.d.ts`
- `components/overlay/ToastStack.prompt.md`
- `stories/OverlayToast.stories.jsx`

## Sources

- Toast prompt contract: `components/overlay/Toast.prompt.md`
- Storybook implementation evidence: `stories/OverlayToast.stories.jsx`
- [Fluent 2 Toast](https://fluent2.microsoft.design/components/web/react/core/toast/usage)
