**BatteryGauge** — 배터리 잔량 표시(셸 + 레벨색 fill + %). 로봇/설비 상태 행에서 ConnectionBadge와 함께 씁니다.

```jsx
<BatteryGauge value={86} />
<BatteryGauge value={12} size="sm" />
<BatteryGauge value={47} showLabel={false} />
```

- **value** `0–100` · **showLabel** · **size** `sm · md`. 색은 잔량을 따릅니다: ≤20% red · ≤50% amber · else green.
