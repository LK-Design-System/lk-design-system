**TelemetryGauge** — 270° 라디얼 게이지. 배터리·속도·신호 등 텔레메트리 값을 중앙 숫자 + 단위로 표시하고, `tone` 또는 퍼센트 `thresholds`로 색을 정합니다.

```jsx
<TelemetryGauge value={82} unit="%" label="배터리" thresholds={{ low: 20, high: 50 }} />
<TelemetryGauge value={1.4} max={2} unit="m/s" label="속도" tone="signal" size={100} />
```

- **value / min / max / unit** · **thresholds** `{ low, high }`(%) · **tone** `signal · positive · cautionary · negative` · **size / thickness**.
