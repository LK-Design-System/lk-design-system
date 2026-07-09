**PropertyField** — 파라미터 행: 라벨 + 컨트롤 + dirty일 때만 활성화되는 개별 Apply(설정·튜닝 패널).

```jsx
<PropertyField label="max_vel" type="number" unit="m/s" value={0.8} onApply={apply} />
<PropertyField label="자동 복구" type="toggle" value={true} onApply={apply} />
```

- **label** · **hint** · **value** · **type** `number·text·toggle` · **min/max/step** · **unit** · **onApply(value)**. Enter로도 적용.
