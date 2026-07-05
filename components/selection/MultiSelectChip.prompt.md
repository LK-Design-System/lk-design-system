**MultiSelectChip** — 여러 패싯 선택용 토글 칩(핵심 기술, 적용 산업). 선택되면 리딩 체크가 슬라이드되며 시안 워시로 채워집니다.

```jsx
<MultiSelectChip defaultSelected>자율주행</MultiSelectChip>
<MultiSelectChip selected={sel} onChange={setSel}>비전 AI</MultiSelectChip>
```

- **selected / defaultSelected / onChange(next)** — 제어/비제어.
- 필 모양, 38px. 선택 가능한 세트는 `flex`/`gap` 랩으로 배치하세요. 단일 선택 패싯에는 `FilterChip`을 쓰세요.
