**CircularProgress** — 값이 정해진 링 게이지(배터리, 가동률).

```jsx
<CircularProgress value={72} showValue />
<CircularProgress value={4} max={5} tone="positive" size={40} />
```

- **value / max** — 채움. **size / thickness** — 지오메트리. **tone** `signal · positive · cautionary · negative`. **showValue** — 가운데 퍼센트. 선형 바에는 `ProgressBar`를 쓰세요.
