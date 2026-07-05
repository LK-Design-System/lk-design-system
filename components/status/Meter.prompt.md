**Meter** — 임계값(옵션)이 있는 라벨 값 바(배터리, 신호 강도).

```jsx
<Meter label="배터리" value={82} thresholds={{ low: 20, high: 50 }} />
```

- **value / max** — 레벨. **thresholds** — `{ low, high }` 퍼센트 → 레드 / 앰버 / 스틸그린. **label / showValue**. 작업 진행에는 `ProgressBar`를 쓰세요.
