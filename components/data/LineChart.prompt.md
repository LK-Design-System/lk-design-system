**LineChart** — 축이 있는 다중 시리즈 라인 차트(loss/지표 곡선, 텔레메트리). data 패밀리의 라인 보완재.

```jsx
<LineChart
  yLabel="mAP"
  series={[
    { name: 'train', points: pts1 },
    { name: 'val', dashed: true, points: pts2 },
  ]}
/>
```

- **series** `{name,color,dashed,points:[{x,y}]}[]` · **width/height** · **yTicks** · **showLegend** · **formatX/formatY**.
