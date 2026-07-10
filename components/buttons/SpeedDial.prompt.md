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
