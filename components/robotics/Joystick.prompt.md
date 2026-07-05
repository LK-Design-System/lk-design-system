**Joystick** — 텔레옵용 가상 조이스틱. 포인터로 노브를 끌면 정규화 `{x, y}`(−1~1, y는 위가 양수)를 `onChange`로 흘리고, 놓으면 중앙 복귀(`sticky`면 유지).

```jsx
<Joystick size={180} label="주행" onChange={(v) => drive(v.x, v.y)} onEnd={stop} />
```

- **size** px · **sticky** 스냅백 해제 · **disabled** · **label**. 무거운 로봇 제어 로직은 앱에서 `onChange` 값으로 처리하세요.
