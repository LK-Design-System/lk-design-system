# Snackbar

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `Snackbar` |
| Storybook | `LDS Core/Components/Overlay/Snackbar` |
| Source | `../component-content.json#core-components-overlay-snackbar` |

사용자 동작 직후 잠시 나타나 결과를 설명하고 보기·다시 시도 같은 하나의 후속 행동을 제공할 때 적합합니다. 여러 알림을 화면 가장자리에 쌓으려면 Toast를, 계속 남아야 하는 상태나 절차 안내에는 Banner나 Callout을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| tone | severity 축(Toast와 같은 이름·정규화). negative는 role="alert" + aria-live="assertive"로 announce합니다. Legacy info/success/warning/error 별칭 지원. |
| icon | 기본 glyph를 대체합니다. 생략하면 tone에 맞는 registry glyph를 씁니다. |
| leadingIcon | icon axis. @default false |
| closeLabel | 닫기 버튼의 접근성 레이블. @default "닫기" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `heading` | `React.ReactNode` | No |  |
| `description` | `React.ReactNode` | No |  |
| `children` | `React.ReactNode` | No |  |
| `action` | `React.ReactNode` | No |  |
| `onAction` | `() = void` | No |  |
| `tone` | `\| "normal" \| "positive" \| "cautionary" \| "negative" \| "info" \| "success" \| "warning" \| "error"` | No | severity 축(Toast와 같은 이름·정규화). negative는 role="alert" + aria-live="assertive"로 announce합니다. Legacy info/success/warning/error 별칭 지원. |
| `variant` | `"normal" \| "positive" \| "cautionary" \| "negative"` | No | Alias for the tone axis. |
| `icon` | `React.ReactNode` | No | 기본 glyph를 대체합니다. 생략하면 tone에 맞는 registry glyph를 씁니다. |
| `leadingIcon` | `boolean` | No | icon axis. @default false |
| `closeButton` | `boolean` | No | 닫기 버튼 노출 축. 닫기 버튼은 onClose가 있을 때만 렌더링되며(핸들러 없는 죽은 컨트롤 방지), 이 값을 false로 두면 onClose가 있어도 감춥니다. @default true |
| `onClose` | `() = void` | No |  |
| `closeLabel` | `string` | No | 닫기 버튼의 접근성 레이블. @default "닫기" |
| `width` | `number \| string` | No | snackbar width. @default 384 |

## States

| State | Contract |
| --- | --- |
| tone | severity 축(Toast와 같은 이름·정규화). negative는 role="alert" + aria-live="assertive"로 announce합니다. Legacy info/success/warning/error 별칭 지원. |
| variant | Alias for the tone axis. |

## Behavior and interaction

- closeButton은 onClose가 있을 때만 닫기 버튼을 렌더링합니다. 핸들러 없이 닫기 아이콘만 두면 눌러도 아무 일도 없는 죽은 컨트롤이 되므로, 축은 "노출 여부"만 결정하고 실제 존재 조건은 onClose 입니다. closeButton={false}로 명시적으로 감출 수 있습니다.
- 화면 배치: Snackbar 자체는 표면만 담당합니다. 띄울 때는 ToastStack으로 감싸 배치하세요(bottom-center 권장). 별도의 Snackbar 전용 배치 프리미티브를 만들지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 타이포 단계: heading은 body2, description은 label2, 한 줄 메시지는 Toast의 한 줄과 같은 body2 단계를 씁니다(size·line·spacing 토큰 3짝). |
| 명시 규칙 2 | 내부 간격: 아이콘-콘텐츠 gap 12px, 콘텐츠-액션 32px(gap 12 + margin 20)은 WDS Snackbar 메트릭입니다. Toast의 gap 10px과 다른 것은 표면별 고유 메트릭이며 통일 대상이 아닙니다. |
| --body2-line | 22px |
| --body2-size | 15px |
| --body2-spacing | 0.0096em |

## Content and writing

- Use for short feedback with an optional action. Use Toast for transient status-only messages.
- action도 같은 규칙을 따르세요: action 문구를 주면 반드시 onAction(또는 자체 onClick을 가진 노드)을 함께 제공합니다.
- Snackbar - WDS feedback bar with optional heading, description, icon, action, and close.

## Accessibility

- WDS axes: heading, description, icon, tone, and closeButton. closeLabel은 닫기 버튼의 접근성 레이블입니다(기본 "닫기").
- tone / variant (severity 축) — normal · positive · cautionary · negative(별칭 info/success/warning/error). Toast와 이름·정규화·announce 규칙이 같습니다: negative만 role="alert" + aria-live="assertive", 나머지는 role="status" + aria-live="polite". 재시도 같은 오류 복구 메시지가 정중하게 흘러가 묻히지 않도록 하는 것이 이 축의 목적입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Alert` | 대표 시나리오에서 조합 |
| `ConfirmDialog` | 대표 시나리오에서 조합 |
| `Dimmer` | 대표 시나리오에서 조합 |
| `DropdownMenu` | 대표 시나리오에서 조합 |
| `Modal` | 대표 시나리오에서 조합 |
| `Toast` | 대표 시나리오에서 조합 |
| `ToastStack` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Snackbar heading="Saved" action="Undo" onAction={undo} />
<Snackbar leadingIcon description="Changes were saved." onClose={dismiss} />
<Snackbar tone="negative" leadingIcon description="네트워크 연결이 불안정합니다." action="다시 시도" onAction={retry} />
```

## Tokens and API

### Tokens

- `--body2-line`
- `--body2-size`
- `--body2-spacing`
- `--color-semantic-inverse-label`
- `--color-semantic-inverse-label-strong-soft`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-negative`
- `--color-semantic-status-positive`
- `--component-transient-feedback-bg`
- `--component-transient-feedback-blur`
- `--font-sans`
- `--fw-bold`
- `--fw-semibold`
- `--label2-line`
- `--label2-size`
- `--label2-spacing`
- `--radius-lg`
- `--shadow-lg`
- `--space-1`

### Source contracts

- `components/overlay/Snackbar.jsx`
- `components/overlay/Snackbar.d.ts`
- `components/overlay/Snackbar.prompt.md`
- `stories/OverlaySnackbar.stories.jsx`

## Sources

- Snackbar prompt contract: `components/overlay/Snackbar.prompt.md`
- Storybook implementation evidence: `stories/OverlaySnackbar.stories.jsx`
