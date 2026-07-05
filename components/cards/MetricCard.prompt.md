**MetricCard** — KPI 타일(라벨 · 큰 값 · 증감 · 캡션).

```jsx
<MetricCard label="가동률" value="98.2%" delta={2.4} caption="지난 30일 대비" />
<MetricCard label="현장" value="24" icon={<Icon name="location" />} />
```

- **label / value / caption** — 콘텐츠. **delta** — 숫자 → 자동 화살표와 함께 "+N%"(상승 스틸그린, 하락 브릭레드), 또는 노드. **icon** — 우상단 글리프.
