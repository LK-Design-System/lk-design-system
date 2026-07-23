**ToastStack** — 모서리에 `Toast` 자식을 쌓는 고정 뷰포트.

```jsx
<ToastStack position="bottom-right">
  {toasts.map((t) => <Toast key={t.id} tone={t.tone} onClose={() => dismiss(t.id)}>{t.msg}</Toast>)}
</ToastStack>
```

- **position** — `bottom-right · bottom-left · top-right · top-left · bottom-center`. **gap** — 토스트 간 px.
- ToastStack은 위치·간격과 **라이브 영역 호스팅**을 소유합니다. 자동 해제 시간(`duration`)과 hover/focus
  일시정지, action 포함 Toast의 유지 규칙은 `Toast`가 소유하며 기준은 `Toast.prompt.md`를 따릅니다.
- **liveRegion**(기본 `true`) — 스택이 살아 있는 동안 비어 있는 polite/assertive 라이브 영역 한 쌍을
  계속 mount해 두고, 하위 `Toast`는 자기 메시지 텍스트를 그쪽으로 밀어 넣습니다. 내용과 함께 삽입된
  `role="status"`는 announce되지 않는 경우가 많다는 문제를 피하기 위한 Material·Polaris 관례입니다.
  `negative` Toast는 assertive, 나머지는 polite 영역을 씁니다.
- 동시에 많은 알림을 쌓아 핵심 작업을 가리지 않도록 제품은 보이는 Toast 수를 제한하고 나머지는
  queue에 보존합니다. 중요한 기록은 알림 센터나 영구 상태 표면에서도 다시 찾을 수 있어야 합니다.
