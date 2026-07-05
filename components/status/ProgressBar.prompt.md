**ProgressBar** — 시그널 잉크로 채워지는 필 트랙.

```jsx
<ProgressBar value={68} label="업로드" showValue />
<ProgressBar indeterminate />
<ProgressBar value={3} max={5} tone="positive" size="lg" />
```

- **value / max** — 결정형 채움. **indeterminate** — 미끄러지는 세그먼트. **tone** `signal · positive · cautionary · negative`. **size** `sm · md · lg`. **label / showValue** — 캡션 행.
