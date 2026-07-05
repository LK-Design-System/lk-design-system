**DonutChart** — 세그먼트로 만드는 링 차트. 가운데 합계 + 범례.

```jsx
<DonutChart segments={[
  { value: 12, label: '순찰' }, { value: 7, label: '청소' }, { value: 5, label: '운반' },
]} />
```

- **segments** — `{ value, label, color }`. **size / thickness / showTotal / centerLabel / legend**. 기본은 뮤트 쿨 팔레트.
