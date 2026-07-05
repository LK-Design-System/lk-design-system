**ToastStack** — 모서리에 `Toast` 자식을 쌓는 고정 뷰포트.

```jsx
<ToastStack position="bottom-right">
  {toasts.map((t) => <Toast key={t.id} tone={t.tone} onClose={() => dismiss(t.id)}>{t.msg}</Toast>)}
</ToastStack>
```

- **position** — `bottom-right · bottom-left · top-right · top-left · bottom-center`. **gap** — 토스트 간 px.
