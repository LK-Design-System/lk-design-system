# Copy Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Action |
| Owner | `CopyButton` |
| Storybook | `LDS Product/Action/Copy Button` |
| Source | `../component-content.json#product-action-copy-button` |

ID·토큰·URL처럼 그대로 옮겨 써야 하는 짧은 값을 클립보드에 복사할 때 적합합니다. 화면 상태를 바꾸는 작업이나 파일 전체를 전달할 때는 Copy Button 대신 Button 또는 Export Action을 사용하세요.

## 사용 판단

### 사용

- ID·토큰·URL처럼 그대로 옮겨 써야 하는 짧은 값을 클립보드에 복사할 때 적합합니다. 화면 상태를 바꾸는 작업이나 파일 전체를 전달할 때는 Copy Button 대신 Button 또는 Export Action을 사용하세요.
- 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다.
- 36/44px 높이는 Button 높이 스케일(32/40/48) 이전의 지오메트리로, 시각 변화를 막기 위해 그대로 유지합니다.
- Copy Button가 소유하는 Action 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않습니다(ToastStack과 같은 방식). 같은 문구를 연속으로 알릴 때는 영역을 비웠다가 다시 채워 변경을 관찰 가능하게 만듭니다.
- 상태 리셋 타이머는 언마운트와 재클릭 때 정리되므로 연타해도 피드백이 조기에 사라지거나 언마운트 후 setState가 발생하지 않습니다. 현재 상태는 data-copy-status(idle · copied · error)로 노출됩니다.
- - 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다. - 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않….
- Copy Button가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | CopyButton의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Children | 대기 라벨. @default "복사" |
| Copied Label | 복사 성공 라벨. 라이브 리전으로도 같은 문구가 알림됩니다. @default "복사됨" |
| Error Label | 복사 실패 라벨(권한 거부·비보안 컨텍스트·Clipboard API 미지원). 실패는 성공으로 표시하지 않으며, 라이브 리전으로도 같은 문구가 알림됩니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | Yes | 클립보드에 복사되는 텍스트. |
| `children` | `React.ReactNode` | No | 대기 라벨. @default "복사" |
| `copiedLabel` | `React.ReactNode` | No | 복사 성공 라벨. 라이브 리전으로도 같은 문구가 알림됩니다. @default "복사됨" |
| `errorLabel` | `React.ReactNode` | No | 복사 실패 라벨(권한 거부·비보안 컨텍스트·Clipboard API 미지원). 실패는 성공으로 표시하지 않으며, 라이브 리전으로도 같은 문구가 알림됩니다. |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| errorLabel | 복사 실패 라벨(권한 거부·비보안 컨텍스트·Clipboard API 미지원). 실패는 성공으로 표시하지 않으며, 라이브 리전으로도 같은 문구가 알림됩니다. 타입 계약: React.ReactNode |

## Behavior and interaction

- 상태 리셋 타이머는 언마운트와 재클릭 때 정리되므로 연타해도 피드백이 조기에 사라지거나 언마운트 후 setState가 발생하지 않습니다. 현재 상태는 data-copy-status(idle · copied · error)로 노출됩니다.
- 아이콘은 aria-hidden이고 이름은 항상 버튼 텍스트가 담당합니다. 소비자 onClick은 복사 동작을 덮어쓰지 않고 함께 호출됩니다.
- - 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다. - 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않….
- CopyButton의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 36/44px 높이는 Button 높이 스케일(32/40/48) 이전의 지오메트리로, 시각 변화를 막기 위해 그대로 유지합니다. |
| 명시 규칙 2 | CopyButton — value를 클립보드에 복사하고 결과(성공 또는 실패)를 약 1.4초 동안 같은 자리에서 알립니다. |
| 명시 규칙 3 | - 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다. - 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않… |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |

## Responsive

- 36/44px 높이는 Button 높이 스케일(32/40/48) 이전의 지오메트리로, 시각 변화를 막기 위해 그대로 유지합니다.
- - 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다. - 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- value — 복사할 텍스트. children — 대기 라벨(기본 복사). size sm · md.
- copiedLabel — 성공 라벨(기본 복사됨). errorLabel — 실패 라벨(기본 복사 실패).
- 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다.
- 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않습니다(ToastStack과 같은 방식). 같은 문구를 연속으로 알릴 때는 영역을 비웠다가 다시 채워 변경을 관찰 가능하게 만듭니다.

## Accessibility

- 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않습니다(ToastStack과 같은 방식). 같은 문구를 연속으로 알릴 때는 영역을 비웠다가 다시 채워 변경을 관찰 가능하게 만듭니다.
- 아이콘은 aria-hidden이고 이름은 항상 버튼 텍스트가 담당합니다. 소비자 onClick은 복사 동작을 덮어쓰지 않고 함께 호출됩니다.
- - 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다. - 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않….
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다. |
| Don't | 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않습니다(ToastStack과 같은 방식). 같은 문구를 연속으로 알릴 때는 영역을 비웠다가 다시 채워 변경을 관찰 가능하게 만듭니다. |
| Do | 36/44px 높이는 Button 높이 스케일(32/40/48) 이전의 지오메트리로, 시각 변화를 막기 위해 그대로 유지합니다. |
| Don't | 상태 리셋 타이머는 언마운트와 재클릭 때 정리되므로 연타해도 피드백이 조기에 사라지거나 언마운트 후 setState가 발생하지 않습니다. 현재 상태는 data-copy-status(idle · copied · error)로 노출됩니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 CopyButton의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ButtonGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Link` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SpeedDial` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SplitButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SocialButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<CopyButton value="LKR-T1-2026-0001">시리얼 복사</CopyButton>
<CopyButton value={token} copiedLabel="토큰 복사됨" errorLabel="토큰을 복사하지 못했습니다" />
```

## Tokens and API

### Tokens

- `--color-semantic-label-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--color-semantic-status-negative-surface`
- `--color-semantic-status-negative-text`
- `--fw-bold`
- `--label1-size`
- `--radius-md`

### Source contracts

- `components/buttons/CopyButton.jsx`
- `components/buttons/CopyButton.d.ts`
- `components/buttons/CopyButton.prompt.md`
- `stories/ActionCopyButton.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- CopyButton prompt contract: `components/buttons/CopyButton.prompt.md`
- Storybook implementation evidence: `stories/ActionCopyButton.stories.jsx`
