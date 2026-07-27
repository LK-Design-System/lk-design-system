**BatteryGauge** — 배터리 잔량 표시(셸 + 레벨색 fill + %). 로봇/설비 상태 행에서 ConnectionBadge와 함께 씁니다.

```jsx
<BatteryGauge value={86} />
<BatteryGauge value={12} size="sm" />
<BatteryGauge value={47} showLabel={false} />
<BatteryGauge value={47} tone="cautionary" />
```

- **value** `0–100` · **tone** `neutral · signal · positive · cautionary · negative` · **showLabel** · **size** `sm · md`.
- 제품의 도메인 규칙이 있다면 `tone`으로 의미 상태를 명시합니다. 생략하면 이전 API와의 호환을 위해 잔량 기준(≤20% negative · ≤50% cautionary · else positive)을 적용합니다.
