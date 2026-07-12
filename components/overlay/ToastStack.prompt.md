**ToastStack** — 모서리에 `Toast` 자식을 쌓는 고정 뷰포트.

```jsx
<ToastStack position="bottom-right">
  {toasts.map((t) => <Toast key={t.id} tone={t.tone} onClose={() => dismiss(t.id)}>{t.msg}</Toast>)}
</ToastStack>
```

- **position** — `bottom-right · bottom-left · top-right · top-left · bottom-center`. **gap** — 토스트 간 px.
- ToastStack은 위치와 간격만 소유합니다. 7초 자동 해제, hover/focus 일시정지, action 포함 Toast의
  수동 해제는 제품 queue에서 관리하며 자세한 기준은 `Toast.prompt.md`를 따릅니다.
- 동시에 많은 알림을 쌓아 핵심 작업을 가리지 않도록 제품은 보이는 Toast 수를 제한하고 나머지는
  queue에 보존합니다. 중요한 기록은 알림 센터나 영구 상태 표면에서도 다시 찾을 수 있어야 합니다.
