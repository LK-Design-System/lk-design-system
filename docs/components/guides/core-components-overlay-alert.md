# Alert

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Overlay |
| Owner | `Alert` |
| Storybook | `LDS Core/Components/Overlay/Alert` |
| Source | `../component-content.json#core-components-overlay-alert` |

진행을 멈추고 경고나 간단한 선택에 응답해야만 다음 단계로 갈 수 있을 때 적합합니다. 긴 설명이나 입력이 필요한 작업에는 Modal을, 흐름을 막지 않는 완료·오류 알림에는 Toast나 Snackbar를 사용하세요.

## 사용 판단

### 사용

- Use platform="ios", android, or web to match the target surface.
- variant(색상 축)에 따라 role을 바꾸지 않습니다. 같은 컴포넌트가 색에 따라 다르게 announce되면 보조기기 사용자의 예측 가능성이 깨지기 때문입니다.
- Alert - WDS modal feedback alert for urgent or important decisions.

## Anatomy

| Part | Contract |
| --- | --- |
| tone | Backward-compatible severity alias. |
| confirmLabel | primary 액션 레이블. @default "확인" |
| ariaLabel | 보이는 title이 없을 때 사용할 접근 가능한 이름. @default "알림" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No |  |
| `title` | `React.ReactNode` | No |  |
| `heading` | `boolean` | No | heading axis. @default true |
| `children` | `React.ReactNode` | No |  |
| `description` | `React.ReactNode` | No |  |
| `platform` | `"ios" \| "android" \| "web"` | No | platform axis. @default "web" |
| `tone` | `\| "default" \| "danger" \| "negative" \| "normal" \| "assistive" \| "info" \| "error"` | No | Backward-compatible severity alias. |
| `variant` | `"normal" \| "assistive" \| "negative"` | No | variant axis. @default "normal" |
| `confirmLabel` | `React.ReactNode` | No | primary 액션 레이블. @default "확인" |
| `cancelLabel` | `React.ReactNode` | No |  |
| `primaryLabel` | `React.ReactNode` | No |  |
| `secondaryLabel` | `React.ReactNode` | No |  |
| `onConfirm` | `() = void` | No |  |
| `onCancel` | `() = void` | No |  |
| `onClose` | `() = void` | No |  |
| `actions` | `React.ReactNode` | No |  |
| `closeOnScrim` | `boolean` | No |  |
| `initialFocusRef` | `React.RefObject` | No | 열릴 때 우선 초점을 받을 Alert 내부 요소. 기본값은 secondary 또는 primary 액션입니다. |
| `returnFocusRef` | `React.RefObject` | No | 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. |
| `restoreFocus` | `boolean` | No | 닫힌 뒤 trigger 또는 returnFocusRef로 초점을 복원합니다. @default true |
| `ariaLabel` | `string` | No | 보이는 title이 없을 때 사용할 접근 가능한 이름. @default "알림" |

## States

| State | Contract |
| --- | --- |
| tone | Backward-compatible severity alias. |
| variant | variant axis. @default "normal" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Content and writing

- 기본 액션 레이블은 한국어입니다: primary 기본값 "확인"(primaryLabel/confirmLabel로 재정의), secondary는 지정할 때만 렌더링합니다.

## Accessibility

- Modal·ConfirmDialog와 같은 공용 modal focus 계약을 사용합니다. 열릴 때 secondary 액션을 우선하고(없으면 primary), Tab/Shift+Tab은 Alert 안에서 순환하며 Escape와 닫힘 후 trigger focus 복원을 지원합니다. initialFocusRef·returnFocusRef로 제품 흐름이 초점을 재정의할 수 있습니다.
- Alert는 언제나 흐름을 멈추고 응답(confirm, 또는 confirm + cancel)을 받는 표면입니다. 이는 APG Alert Dialog 패턴 그 자체이므로 variant와 무관하게 무조건 role="alertdialog"를 씁니다.
- alertdialog는 초점이 들어올 때 aria-labelledby(제목)와 aria-describedby(본문)를 함께 읽도록 보장합니다. 그래서 본문(description/children)은 항상 aria-describedby로 연결됩니다.
- 응답이 필요 없는 비차단 메시지는 Alert가 아니라 Toast·Snackbar·Banner를 쓰세요. 응답이 필요한 일반 콘텐츠 작업은 Modal(role="dialog"), 되돌릴 수 없는 확인은 ConfirmDialog입니다.
- WAI-ARIA Modal Dialog Pattern — 파괴적 결정에서는 덜 파괴적인 액션을 초기 초점으로 고려하고, modal 내부 Tab 순환과 Escape·trigger 복원을 요구합니다. Alert의 기본 secondary 우선 정책에 반영했습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 조합 |
| `ConfirmDialog` | 대표 시나리오에서 조합 |
| `Dimmer` | 대표 시나리오에서 조합 |
| `DropdownMenu` | 대표 시나리오에서 조합 |
| `Modal` | 대표 시나리오에서 조합 |
| `Snackbar` | 대표 시나리오에서 조합 |
| `Toast` | 대표 시나리오에서 조합 |
| `ToastStack` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Alert open platform="web" title="세션이 만료되었습니다" primaryLabel="다시 로그인" secondaryLabel="나중에" variant="negative">
  작업을 계속하려면 다시 로그인해 주세요.
</Alert>
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-normal`
- `--color-semantic-inverse-label`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-status-negative-text`
- `--component-dialog-scrim`
- `--component-dialog-scrim-blur`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--fw-semibold`
- `--heading2-size`
- `--headline1-size`
- `--radius-md`
- `--radius-pill`
- `--shadow-xl`

### Source contracts

- `components/overlay/Alert.jsx`
- `components/overlay/Alert.d.ts`
- `components/overlay/Alert.prompt.md`
- `stories/OverlayConfirmAlert.stories.jsx`

## Migration

- tone="danger" remains as a backward-compatible alias for variant="negative".

## Sources

- Alert prompt contract: `components/overlay/Alert.prompt.md`
- Storybook implementation evidence: `stories/OverlayConfirmAlert.stories.jsx`
- [Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Aria Modal](https://react-aria.adobe.com/Modal)
