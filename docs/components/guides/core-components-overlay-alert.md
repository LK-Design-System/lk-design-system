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

- 진행을 멈추고 경고나 간단한 선택에 응답해야만 다음 단계로 갈 수 있을 때 적합합니다. 긴 설명이나 입력이 필요한 작업에는 Modal을, 흐름을 막지 않는 완료·오류 알림에는 Toast나 Snackbar를 사용하세요.
- Use platform="ios", android, or web to match the target surface.
- tone="danger" remains as a backward-compatible alias for variant="negative".
- variant(색상 축)에 따라 role을 바꾸지 않습니다. 같은 컴포넌트가 색에 따라 다르게 announce되면 보조기기 사용자의 예측 가능성이 깨지기 때문입니다.

### 사용하지 않음

- Modal·ConfirmDialog와 같은 공용 modal focus 계약을 사용합니다. 열릴 때 secondary 액션을 우선하고(없으면 primary), Tab/Shift+Tab은 Alert 안에서 순환하며 Escape와 닫힘 후 trigger focus 복원을 지원합니다. initialFocusRef·returnFocusRef로 제품 흐름이 초점을 재정의할 수 있습니다.
- - Use platform="ios", android, or web to match the target surface. - WDS axes: platform, variant="normal|negative|assistive", heading, and primary/secondary actions. - tone="danger" remains as a backward-compatible alias for variant="negative". - 기본 액션 레이블은 한국어입니다: primary 기본값 "확인"(primaryLabel/confirmLabel로 재정의), sec….
- Alert가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Alert의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Children | children 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Description | description 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Tone | Backward-compatible severity alias. |
| Confirm Label | primary 액션 레이블. @default "확인" |
| Cancel Label | cancelLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Primary Label | primaryLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `open` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `title` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `heading` | `boolean` | No | heading axis. @default true |
| `children` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `description` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `platform` | `"ios" \| "android" \| "web"` | No | platform axis. @default "web" |
| `tone` | `\| "default" \| "danger" \| "negative" \| "normal" \| "assistive" \| "info" \| "error"` | No | Backward-compatible severity alias. |
| `variant` | `"normal" \| "assistive" \| "negative"` | No | variant axis. @default "normal" |
| `confirmLabel` | `React.ReactNode` | No | primary 액션 레이블. @default "확인" |
| `cancelLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `primaryLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `secondaryLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onConfirm` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onCancel` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onClose` | `() = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `actions` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `closeOnScrim` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `initialFocusRef` | `React.RefObject` | No | 열릴 때 우선 초점을 받을 Alert 내부 요소. 기본값은 secondary 또는 primary 액션입니다. |
| `returnFocusRef` | `React.RefObject` | No | 닫힌 뒤 자동으로 캡처한 trigger 대신 초점을 돌려보낼 요소. |
| `restoreFocus` | `boolean` | No | 닫힌 뒤 trigger 또는 returnFocusRef로 초점을 복원합니다. @default true |
| `ariaLabel` | `string` | No | 보이는 title이 없을 때 사용할 접근 가능한 이름. @default "알림" |

## States

| State | Contract |
| --- | --- |
| open | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| tone | Backward-compatible severity alias. 타입 계약: \| "default" \| "danger" \| "negative" \| "normal" \| "assistive" \| "info" \| "error" |
| variant | variant axis. @default "normal" 타입 계약: "normal" \| "assistive" \| "negative" |
| 변형·상태 · 플랫폼별 형태 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 키보드 탐색과 초점 복원 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Modal·ConfirmDialog와 같은 공용 modal focus 계약을 사용합니다. 열릴 때 secondary 액션을 우선하고(없으면 primary), Tab/Shift+Tab은 Alert 안에서 순환하며 Escape와 닫힘 후 trigger focus 복원을 지원합니다. initialFocusRef·returnFocusRef로 제품 흐름이 초점을 재정의할 수 있습니다.
- alertdialog는 초점이 들어올 때 aria-labelledby(제목)와 aria-describedby(본문)를 함께 읽도록 보장합니다. 그래서 본문(description/children)은 항상 aria-describedby로 연결됩니다.
- WAI-ARIA Modal Dialog Pattern — 파괴적 결정에서는 덜 파괴적인 액션을 초기 초점으로 고려하고, modal 내부 Tab 순환과 Escape·trigger 복원을 요구합니다. Alert의 기본 secondary 우선 정책에 반영했습니다.
- React Aria Modal — modal overlay가 focus containment와 복원을 소유하도록 안내합니다. Alert만 독자 document key listener를 두지 않고 LDS의 useDialogFocus를 공유합니다.
- - Use platform="ios", android, or web to match the target surface. - WDS axes: platform, variant="normal|negative|assistive", heading, and primary/secondary actions. - tone="danger" remains as a backward-compatible alias for variant="negative". - 기본 액션 레이블은 한국어입니다: primary 기본값 "확인"(primaryLabel/confirmLabel로 재정의), sec….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- 기본 액션 레이블은 한국어입니다: primary 기본값 "확인"(primaryLabel/confirmLabel로 재정의), secondary는 지정할 때만 렌더링합니다.
- alertdialog는 초점이 들어올 때 aria-labelledby(제목)와 aria-describedby(본문)를 함께 읽도록 보장합니다. 그래서 본문(description/children)은 항상 aria-describedby로 연결됩니다.
- 응답이 필요 없는 비차단 메시지는 Alert가 아니라 Toast·Snackbar·Banner를 쓰세요. 응답이 필요한 일반 콘텐츠 작업은 Modal(role="dialog"), 되돌릴 수 없는 확인은 ConfirmDialog입니다.
- - Use platform="ios", android, or web to match the target surface. - WDS axes: platform, variant="normal|negative|assistive", heading, and primary/secondary actions. - tone="danger" remains as a backward-compatible alias for variant="negative". - 기본 액션 레이블은 한국어입니다: primary 기본값 "확인"(primaryLabel/confirmLabel로 재정의), sec….

## Accessibility

- Modal·ConfirmDialog와 같은 공용 modal focus 계약을 사용합니다. 열릴 때 secondary 액션을 우선하고(없으면 primary), Tab/Shift+Tab은 Alert 안에서 순환하며 Escape와 닫힘 후 trigger focus 복원을 지원합니다. initialFocusRef·returnFocusRef로 제품 흐름이 초점을 재정의할 수 있습니다.
- Alert는 언제나 흐름을 멈추고 응답(confirm, 또는 confirm + cancel)을 받는 표면입니다. 이는 APG Alert Dialog 패턴 그 자체이므로 variant와 무관하게 무조건 role="alertdialog"를 씁니다.
- alertdialog는 초점이 들어올 때 aria-labelledby(제목)와 aria-describedby(본문)를 함께 읽도록 보장합니다. 그래서 본문(description/children)은 항상 aria-describedby로 연결됩니다.
- 응답이 필요 없는 비차단 메시지는 Alert가 아니라 Toast·Snackbar·Banner를 쓰세요. 응답이 필요한 일반 콘텐츠 작업은 Modal(role="dialog"), 되돌릴 수 없는 확인은 ConfirmDialog입니다.
- WAI-ARIA Modal Dialog Pattern — 파괴적 결정에서는 덜 파괴적인 액션을 초기 초점으로 고려하고, modal 내부 Tab 순환과 Escape·trigger 복원을 요구합니다. Alert의 기본 secondary 우선 정책에 반영했습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use platform="ios", android, or web to match the target surface. |
| Don't | Modal·ConfirmDialog와 같은 공용 modal focus 계약을 사용합니다. 열릴 때 secondary 액션을 우선하고(없으면 primary), Tab/Shift+Tab은 Alert 안에서 순환하며 Escape와 닫힘 후 trigger focus 복원을 지원합니다. initialFocusRef·returnFocusRef로 제품 흐름이 초점을 재정의할 수 있습니다. |
| Do | tone="danger" remains as a backward-compatible alias for variant="negative". |
| Don't | - Use platform="ios", android, or web to match the target surface. - WDS axes: platform, variant="normal\|negative\|assistive", heading, and primary/secondary actions. - tone="danger" remains as a backward-compatible alias for variant="negative". - 기본 액션 레이블은 한국어입니다: primary 기본값 "확인"(primaryLabel/confirmLabel로 재정의), sec…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Alert의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Button` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ConfirmDialog` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Dimmer` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DropdownMenu` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Modal` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Snackbar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Toast` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ToastStack` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- - Use platform="ios", android, or web to match the target surface. - WDS axes: platform, variant="normal|negative|assistive", heading, and primary/secondary actions. - tone="danger" remains as a backward-compatible alias for variant="negative". - 기본 액션 레이블은 한국어입니다: primary 기본값 "확인"(primaryLabel/confirmLabel로 재정의), sec….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Alert prompt contract: `components/overlay/Alert.prompt.md`
- Storybook implementation evidence: `stories/OverlayConfirmAlert.stories.jsx`
- [Alert Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
- [WAI-ARIA Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [React Aria Modal](https://react-aria.adobe.com/Modal)
