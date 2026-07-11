**MetricCard** — KPI 타일(라벨 · 큰 값 · 증감 · 캡션).

```jsx
<MetricCard label="가동률" value="98.2%" delta={2.4} caption="지난 30일 대비" />
<MetricCard label="현장" value="24" icon={<Icon name="location" />} />
```

- **label / value / caption** — 콘텐츠. **delta** — 숫자 → 자동 화살표와 함께 "+N%"(상승 스틸그린, 하락 브릭레드), 또는 노드. **icon** — 우상단 글리프.
- 타입 스케일 정합: 값 숫자 34px → `--title1-size`(32px)로 스냅했습니다(−2px, 의도된 변경). 라벨(caption1)·델타(label2)·캡션(label2)과 함께 전 사이트가 토큰 스케일 위에 있으며, 값의 lineHeight 1과 letterSpacing 0은 유지했습니다.
