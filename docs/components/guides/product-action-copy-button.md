# Copy Button

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Action |
| Owner | `CopyButton` |
| Storybook | `LDS Product/Action/Copy Button` |
| Source | `../component-content.json#product-action-copy-button` |

ID·토큰·URL처럼 그대로 옮겨 써야 하는 짧은 값을 클립보드에 복사할 때 적합합니다. 화면 상태를 바꾸는 작업이나 파일 전체를 전달할 때는 Copy Button 대신 Button 또는 Export Action을 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| children | 대기 라벨. @default "복사" |
| copiedLabel | 복사 성공 라벨. 라이브 리전으로도 같은 문구가 알림됩니다. @default "복사됨" |
| errorLabel | 복사 실패 라벨(권한 거부·비보안 컨텍스트·Clipboard API 미지원). 실패는 성공으로 표시하지 않으며, 라이브 리전으로도 같은 문구가 알림됩니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `string` | Yes | 클립보드에 복사되는 텍스트. |
| `children` | `React.ReactNode` | No | 대기 라벨. @default "복사" |
| `copiedLabel` | `React.ReactNode` | No | 복사 성공 라벨. 라이브 리전으로도 같은 문구가 알림됩니다. @default "복사됨" |
| `errorLabel` | `React.ReactNode` | No | 복사 실패 라벨(권한 거부·비보안 컨텍스트·Clipboard API 미지원). 실패는 성공으로 표시하지 않으며, 라이브 리전으로도 같은 문구가 알림됩니다. |
| `size` | `'sm' \| 'md'` | No |  |

## States

| State | Contract |
| --- | --- |
| errorLabel | 복사 실패 라벨(권한 거부·비보안 컨텍스트·Clipboard API 미지원). 실패는 성공으로 표시하지 않으며, 라이브 리전으로도 같은 문구가 알림됩니다. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 36/44px 높이는 Button 높이 스케일(32/40/48) 이전의 지오메트리로, 시각 변화를 막기 위해 그대로 유지합니다. |
| 명시 규칙 2 | CopyButton — value를 클립보드에 복사하고 결과(성공 또는 실패)를 약 1.4초 동안 같은 자리에서 알립니다. |
| --color-semantic-label-normal | light: #171718; dark: #F7F7F7 |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |
| --color-semantic-primary-surface-strong | light: color-mix(in srgb, var(--color-semantic-primary-normal) 14%, transparent); dark: color-mix(in srgb, var(--color-semantic-primary-normal) 20%, transparent) |

## Content and writing

- value — 복사할 텍스트. children — 대기 라벨(기본 복사). size sm · md.
- copiedLabel — 성공 라벨(기본 복사됨). errorLabel — 실패 라벨(기본 복사 실패).
- 클립보드 쓰기가 실패하면 실패로 표시합니다. 권한 거부, 비보안 컨텍스트(navigator.clipboard 미지원), writeText reject는 모두 실패이며 errorLabel + 경고 아이콘 + negative 서피스로 바뀝니다. 실패를 삼키고 copiedLabel을 보여 주지 않습니다.
- 상태 리셋 타이머는 언마운트와 재클릭 때 정리되므로 연타해도 피드백이 조기에 사라지거나 언마운트 후 setState가 발생하지 않습니다. 현재 상태는 data-copy-status(idle · copied · error)로 노출됩니다.

## Accessibility

- 버튼 안에 상시 마운트된 시각적 숨김 role="status" aria-live="polite" 영역이 있고, 성공/실패 문구를 그 영역에 씁니다. 결과와 함께 새로 마운트되는 라이브 리전은 대부분의 스크린 리더가 읽지 않으므로 라벨 스왑만으로 통지를 대신하지 않습니다(ToastStack과 같은 방식). 같은 문구를 연속으로 알릴 때는 영역을 비웠다가 다시 채워 변경을 관찰 가능하게 만듭니다.
- 아이콘은 aria-hidden이고 이름은 항상 버튼 텍스트가 담당합니다. 소비자 onClick은 복사 동작을 덮어쓰지 않고 함께 호출됩니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ButtonGroup` | 대표 시나리오에서 조합 |
| `SpeedDial` | 대표 시나리오에서 조합 |
| `SplitButton` | 대표 시나리오에서 조합 |
| `SocialButton` | 대표 시나리오에서 조합 |

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
- `--space-2`

### Source contracts

- `components/buttons/CopyButton.jsx`
- `components/buttons/CopyButton.d.ts`
- `components/buttons/CopyButton.prompt.md`
- `stories/ActionCopyButton.stories.jsx`

## Sources

- CopyButton prompt contract: `components/buttons/CopyButton.prompt.md`
- Storybook implementation evidence: `stories/ActionCopyButton.stories.jsx`
