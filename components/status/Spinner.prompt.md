**Spinner** - loading indicator for unknown-duration work.

```jsx
<Spinner />
<Spinner variant="brand" size={22} />
<Spinner size={18} label="불러오는 중" />
```

- **variant**: `circular` (ring) or `brand` (LK ROBOTICS wordmark on a traveling wave — the LK theme override of the source-system brand loader).
- **size**: circular = ring diameter; brand = wordmark cap height.
- **thickness / color** control the circular ring geometry and active arc.
- **label** adds visible status text and lets assistive tech announce the loading state.
- Use `ProgressBar` or `CircularProgress` when a value or completion percentage is known.
- Motion respects `prefers-reduced-motion`. circular ring과 brand wave 모두 inline
  style로 animation이 붙으므로 reduced-motion 규칙은 `animation:none!important`로
  선언되어 사용자 설정이 항상 이깁니다.
