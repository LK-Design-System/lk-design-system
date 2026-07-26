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

### 사용하지 않음

- Keep it as an Action component. Do not add map/editor business logic, waypoint state, permission checks, or confirmation flows here; compose those around the action callbacks.
- Use the LDS Icon registry for default or story icons. Use semantic/component tokens for action surfaces; avoid introducing one-off SVGs or app-specific colors.

## Anatomy

| Part | Contract |
| --- | --- |
| icon | 트리거 아이콘(기본 +). |
| label | 트리거 aria-label. @default "작업" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | No | 트리거 아이콘(기본 +). |
| `actions` | `SpeedDialAction[]` | No |  |
| `open` | `boolean` | No |  |
| `defaultOpen` | `boolean` | No |  |
| `onOpenChange` | `(open: boolean) = void` | No |  |
| `label` | `string` | No | 트리거 aria-label. @default "작업" |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-inverse-background | light: #1B1C1E; dark: #FFFFFF |
| --color-semantic-inverse-label | light: #FFFFFF; dark: #171719 |

## Content and writing

- icon · actions {icon,label,onClick,danger}[] · open / defaultOpen · onOpenChange · label.
- SpeedDial — 열리면 라벨 툴 액션이 펼쳐지는 FAB 스피드다이얼. Fab 확장.

## Accessibility

- Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for non-text labels.
- 트리거는 aria-expanded를 갖고, 열려 있는 동안에만 액션 목록 id를 aria-controls로 가리킵니다(닫히면 대상 id가 없으므로 속성도 없앱니다).
- DOM 순서는 트리거 → 액션 목록입니다. 위로 펼쳐지는 시각 배치는 flex-direction: column-reverse가 만들고, 읽기 순서와 Tab 순서는 논리 순서를 따릅니다. 목록을 트리거 앞에 두면 트리거에서 Tab을 눌렀을 때 액션이 통째로 건너뛰어집니다.
- 닫힐 때 초점을 트리거로 복원합니다. Escape와 액션 실행은 목록을 언마운트하므로, 복원이 없으면 초점이 로 떨어집니다(다음 프레임에 복원해 언마운트 이후에 초점을 옮깁니다). 바깥 클릭으로 닫을 때는 포인터 사용자의 초점을 빼앗지 않도록 복원하지 않습니다.
- Escape는 열려 있을 때만 처리하고 그때만 전파를 멈춥니다. 액션 이름은 문자열 label을 aria-labelledby로 연결하고, 문자열이 아니면 ariaLabel로 지정합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Icon` | 대표 시나리오에서 조합 |
| `ButtonGroup` | 대표 시나리오에서 조합 |
| `CopyButton` | 대표 시나리오에서 조합 |
| `Link` | 대표 시나리오에서 조합 |
| `SplitButton` | 대표 시나리오에서 조합 |
| `SocialButton` | 대표 시나리오에서 조합 |

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
- `--space-2-5`

### Source contracts

- `components/buttons/SpeedDial.jsx`
- `components/buttons/SpeedDial.d.ts`
- `components/buttons/SpeedDial.prompt.md`
- `stories/ActionSpeedDial.stories.jsx`

## Sources

- SpeedDial prompt contract: `components/buttons/SpeedDial.prompt.md`
- Storybook implementation evidence: `stories/ActionSpeedDial.stories.jsx`
