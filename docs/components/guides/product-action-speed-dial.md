# Speed Dial

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Action |
| Owner | `SpeedDial` |
| Storybook | `LDS Product/Action/Speed Dial` |
| Source | `../component-content.json#product-action-speed-dial` |

지도·에디터의 고정 코너에서 25개의 문맥 작업을 빠르게 꺼낼 때 적합합니다. 항상 보여야 하는 핵심 CTA나 항목이 많은 명령에는 Speed Dial 대신 Button 또는 Menu를 사용하세요.

## 사용 판단

### 사용

- 지도·에디터의 고정 코너에서 25개의 문맥 작업을 빠르게 꺼낼 때 적합합니다. 항상 보여야 하는 핵심 CTA나 항목이 많은 명령에는 Speed Dial 대신 Button 또는 Menu를 사용하세요.
- Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for non-text labels.
- - icon · actions {icon,label,onClick,danger}[] · open / defaultOpen · onOpenChange · label. - Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for no….
- Speed Dial가 소유하는 Action 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Keep it as an Action component. Do not add map/editor business logic, waypoint state, permission checks, or confirmation flows here; compose those around the action callbacks.
- Use the LDS Icon registry for default or story icons. Use semantic/component tokens for action surfaces; avoid introducing one-off SVGs or app-specific colors.
- 닫힐 때 초점을 트리거로 복원합니다. Escape와 액션 실행은 목록을 언마운트하므로, 복원이 없으면 초점이 로 떨어집니다(다음 프레임에 복원해 언마운트 이후에 초점을 옮깁니다). 바깥 클릭으로 닫을 때는 포인터 사용자의 초점을 빼앗지 않도록 복원하지 않습니다.
- - icon · actions {icon,label,onClick,danger}[] · open / defaultOpen · onOpenChange · label. - Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for no….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | SpeedDial의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Icon | 트리거 아이콘(기본 +). |
| Actions | actions 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Label | 트리거 aria-label. @default "작업" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | No | 트리거 아이콘(기본 +). |
| `actions` | `SpeedDialAction[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `open` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultOpen` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onOpenChange` | `(open: boolean) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `string` | No | 트리거 aria-label. @default "작업" |

## States

| State | Contract |
| --- | --- |
| open | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| defaultOpen | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| onOpenChange | 공개 타입 계약에 정의된 속성입니다. 타입 계약: (open: boolean) = void |

## Behavior and interaction

- icon · actions {icon,label,onClick,danger}[] · open / defaultOpen · onOpenChange · label.
- Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for non-text labels.
- 트리거는 aria-expanded를 갖고, 열려 있는 동안에만 액션 목록 id를 aria-controls로 가리킵니다(닫히면 대상 id가 없으므로 속성도 없앱니다).
- DOM 순서는 트리거 → 액션 목록입니다. 위로 펼쳐지는 시각 배치는 flex-direction: column-reverse가 만들고, 읽기 순서와 Tab 순서는 논리 순서를 따릅니다. 목록을 트리거 앞에 두면 트리거에서 Tab을 눌렀을 때 액션이 통째로 건너뛰어집니다.
- 닫힐 때 초점을 트리거로 복원합니다. Escape와 액션 실행은 목록을 언마운트하므로, 복원이 없으면 초점이 로 떨어집니다(다음 프레임에 복원해 언마운트 이후에 초점을 옮깁니다). 바깥 클릭으로 닫을 때는 포인터 사용자의 초점을 빼앗지 않도록 복원하지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- icon · actions {icon,label,onClick,danger}[] · open / defaultOpen · onOpenChange · label.
- Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for non-text labels.
- Escape는 열려 있을 때만 처리하고 그때만 전파를 멈춥니다. 액션 이름은 문자열 label을 aria-labelledby로 연결하고, 문자열이 아니면 ariaLabel로 지정합니다.
- SpeedDial — 열리면 라벨 툴 액션이 펼쳐지는 FAB 스피드다이얼. Fab 확장.

## Accessibility

- Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for non-text labels.
- 트리거는 aria-expanded를 갖고, 열려 있는 동안에만 액션 목록 id를 aria-controls로 가리킵니다(닫히면 대상 id가 없으므로 속성도 없앱니다).
- DOM 순서는 트리거 → 액션 목록입니다. 위로 펼쳐지는 시각 배치는 flex-direction: column-reverse가 만들고, 읽기 순서와 Tab 순서는 논리 순서를 따릅니다. 목록을 트리거 앞에 두면 트리거에서 Tab을 눌렀을 때 액션이 통째로 건너뛰어집니다.
- 닫힐 때 초점을 트리거로 복원합니다. Escape와 액션 실행은 목록을 언마운트하므로, 복원이 없으면 초점이 로 떨어집니다(다음 프레임에 복원해 언마운트 이후에 초점을 옮깁니다). 바깥 클릭으로 닫을 때는 포인터 사용자의 초점을 빼앗지 않도록 복원하지 않습니다.
- Escape는 열려 있을 때만 처리하고 그때만 전파를 멈춥니다. 액션 이름은 문자열 label을 aria-labelledby로 연결하고, 문자열이 아니면 ariaLabel로 지정합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for non-text labels. |
| Don't | Keep it as an Action component. Do not add map/editor business logic, waypoint state, permission checks, or confirmation flows here; compose those around the action callbacks. |
| Do | - icon · actions {icon,label,onClick,danger}[] · open / defaultOpen · onOpenChange · label. - Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for no…. |
| Don't | Use the LDS Icon registry for default or story icons. Use semantic/component tokens for action surfaces; avoid introducing one-off SVGs or app-specific colors. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 SpeedDial의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ButtonGroup` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `CopyButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Link` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SplitButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SocialButton` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<SpeedDial actions={[
  { icon: <Icon name="plus" />, label: '웨이포인트', onClick: addWp },
  { icon: <Icon name="trash" />, label: '삭제', danger: true, onClick: del },
]} />
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-inverse-background`
- `--color-semantic-inverse-label`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-static-white`
- `--color-semantic-status-negative`
- `--component-button-primary-fg`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`
- `--radius-sm`
- `--shadow-lg`
- `--shadow-md`
- `--shadow-sm`

### Source contracts

- `components/buttons/SpeedDial.jsx`
- `components/buttons/SpeedDial.d.ts`
- `components/buttons/SpeedDial.prompt.md`
- `stories/ActionSpeedDial.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- SpeedDial prompt contract: `components/buttons/SpeedDial.prompt.md`
- Storybook implementation evidence: `stories/ActionSpeedDial.stories.jsx`
