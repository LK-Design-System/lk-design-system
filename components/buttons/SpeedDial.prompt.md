**SpeedDial** — 열리면 라벨 툴 액션이 펼쳐지는 FAB 스피드다이얼. Fab 확장.

```jsx
<SpeedDial actions={[
  { icon: <Icon name="plus" />, label: '웨이포인트', onClick: addWp },
  { icon: <Icon name="trash" />, label: '삭제', danger: true, onClick: del },
]} />
```

- **icon** · **actions** `{icon,label,onClick,danger}[]` · **open / defaultOpen** · **onOpenChange** · **label**.
- Compare against common speed-dial expectations before changing it: one primary FAB trigger, a short stack of contextual actions, visible labels, escape-to-close, controlled/uncontrolled open state, and accessible names for non-text labels.
- Layer: LDS Product extension. Local WDS `.fig` inspection did not find an exact Speed Dial component set, so keep it adjacent to FAB/action controls without claiming WDS variant parity.
- Keep it as an Action component. Do not add map/editor business logic, waypoint state, permission checks, or confirmation flows here; compose those around the action callbacks.
- Use the LDS `Icon` registry for default or story icons. Use semantic/component tokens for action surfaces; avoid introducing one-off SVGs or app-specific colors.

## Disclosure 계약 (초점과 순서)

- 트리거는 `aria-expanded`를 갖고, 열려 있는 동안에만 액션 목록 id를 `aria-controls`로 가리킵니다(닫히면 대상 id가 없으므로 속성도 없앱니다).
- **DOM 순서는 트리거 → 액션 목록**입니다. 위로 펼쳐지는 시각 배치는 `flex-direction: column-reverse`가 만들고, 읽기 순서와 Tab 순서는 논리 순서를 따릅니다. 목록을 트리거 앞에 두면 트리거에서 Tab을 눌렀을 때 액션이 통째로 건너뛰어집니다.
- **닫힐 때 초점을 트리거로 복원합니다.** Escape와 액션 실행은 목록을 언마운트하므로, 복원이 없으면 초점이 `<body>`로 떨어집니다(다음 프레임에 복원해 언마운트 이후에 초점을 옮깁니다). 바깥 클릭으로 닫을 때는 포인터 사용자의 초점을 빼앗지 않도록 복원하지 않습니다.
- Escape는 열려 있을 때만 처리하고 그때만 전파를 멈춥니다. 액션 이름은 문자열 `label`을 `aria-labelledby`로 연결하고, 문자열이 아니면 `ariaLabel`로 지정합니다.
