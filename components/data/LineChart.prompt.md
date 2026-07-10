**LineChart** — 학습 곡선, 성능 지표, 텔레메트리 추이를 시간/step 축으로 보여주는 다중 시리즈 SVG 라인 차트. 새 charting engine이 아니라 `Legend`와 semantic token을 조합한 Product/Data pattern입니다.

```jsx
<LineChart
  yLabel="mAP"
  xLabel="epoch"
  series={[
    { name: 'train', points: pts1 },
    { name: 'val', dashed: true, points: pts2 },
  ]}
/>
```

- **series** `{id?,name,color,dashed,points:[{x,y}]}[]` · **width/height** · **xTicks/yTicks** · **xDomain/yDomain** · **includeZero** · **showGrid/showLegend/showPoints** · **referenceLines** `{y,label,color?,dashed?}[]` · **emptyLabel** · **formatX/formatY**.
- Compare against common line chart expectations before changing it: bounded domains, axis ticks and labels, grid option, multiple series, legend handoff, reference lines, empty state, responsive SVG, and predictable formatting hooks.
- Layer: LDS Product Data extension. This is a lightweight presentational chart pattern, not a full analytics/charting engine or WDS component-set parity claim.
- 기본은 responsive SVG입니다. `width`/`height`는 viewBox 기준 크기이며, 실제 렌더는 부모 너비 안에서 줄어듭니다.
- `Legend`를 재사용합니다. 범례용 선 swatch는 `shape="line"`과 `dashed`로 표현하고, point marker는 데이터 밀도가 낮거나 샘플 강조가 필요할 때만 켭니다.
- 색상은 semantic token 또는 series `color`로만 지정합니다. raw hex/rgb를 story source of truth로 올리지 않습니다.
- 데이터가 없으면 축과 빈 상태 텍스트를 유지합니다. loading/error/zoom/tooltip/crosshair가 필요한 분석용 차트는 별도 composed product pattern으로 둡니다.
