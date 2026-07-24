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

- **series** `{id?,name,accessibleLabel?,color,dashed,points:[{x,y}]}[]` · **width/height** · **xTicks/yTicks** · **xDomain/yDomain** · **includeZero** · **showGrid/showLegend/showPoints** · **referenceLines** `{y,label,color?,dashed?}[]` · **emptyLabel** · **formatX/formatY**.
- 제품 데이터 차트는 `yDomain`/`yTicks`와 locale-aware `formatY`를 명시합니다. LDS의 자동
  tick은 구조 preview용 균등 분할 fallback이며 분석 화면의 nice-tick 정책을 추론하지 않습니다.
- **description / summary** — 차트 맥락 설명과 자동 텍스트 요약 override입니다. 기본 요약은 각 시리즈의 유효 point 수, 시작, 최저, 최고, 마지막 값을 입력 순서대로 제공합니다. 복합 범례 이름은 `accessibleLabel`로 요약 이름을 고정합니다.
- `referenceLines`는 자동 요약에도 포함됩니다. y domain 안에 그려진 기준선만 대상이며 `기준선 N개.` 뒤에 각 선의 이름·값과 그 선을 넘긴 시리즈 이름(없으면 `초과한 시리즈 없음`)이 이어집니다. 임계선은 `role="img"` SVG 안 텍스트로만 존재하면 보조기술에 전혀 닿지 않으므로, 임계 이탈 판단을 시각 표시에만 맡기지 않습니다. `summary`를 직접 넘기면 기준선 문장도 그 값으로 대체되므로 필요한 내용을 직접 포함시키세요.
- 다중 시리즈를 **색상만으로 구분하지 않습니다**(WCAG 1.4.1). 텍스트 요약이 1차 대안이고, 시각적으로도 시리즈가 셋 이상이거나 색각 이상 사용자를 고려해야 하면 `dashed`(선 패턴)나 `showPoints`(마커)를 함께 켜서 색 외 단서를 남기세요.
- Compare against common line chart expectations before changing it: bounded domains, axis ticks and labels, grid option, multiple series, legend handoff, reference lines, empty state, responsive SVG, and predictable formatting hooks.
- Layer: LDS Product Data extension. This is a lightweight presentational chart pattern, not a full analytics/charting engine or WDS component-set parity claim.
- 기본은 responsive SVG입니다. `width`/`height`는 viewBox 기준 크기이며, 실제 렌더는 부모 너비 안에서 줄어듭니다.
- `Legend`를 재사용합니다. 범례용 선 swatch는 `shape="line"`과 `dashed`로 표현하고, point marker는 데이터 밀도가 낮거나 샘플 강조가 필요할 때만 켭니다.
- 색상은 semantic token 또는 series `color`로만 지정합니다. raw hex/rgb를 story source of truth로 올리지 않습니다.
- 데이터가 없으면 축과 보이는 `emptyLabel`을 유지하며 같은 문구를 텍스트 요약으로 제공합니다. loading/error/zoom/tooltip/crosshair가 필요한 분석용 차트는 별도 composed product pattern으로 둡니다.

## Internal LDS comparison and retained deltas

- `BarChart`, `DonutChart`, `Sparkline`과 같은 named image, 맥락 설명, 결정적 텍스트 요약, 보이는 empty-state 계약을 사용합니다.
- `Legend`의 시리즈 이름은 시각 범례를 담당하고, 자동 요약은 색과 선 모양 없이도 값의 범위와 추이를 이해할 수 있게 합니다.
- host `Card`/`ChartFrame`이 title, surface, action, refresh를 소유합니다. LineChart에는 별도 카드 chrome을 추가하지 않습니다.

## External references and design conclusions

- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)는 title, axes, labels, legend가 함께 데이터 의미를 전달해야 한다고 정의합니다. LDS는 축과 범례를 유지하면서 screen-reader용 시리즈 요약을 추가합니다.
- [Carbon accessibility for developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)의 meaningful description/data alternative 원칙에 따라 선 모양과 색만 발표하지 않고 시작·범위·마지막 값을 텍스트로 제공합니다.
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)는 trend card에서 current value와 시간 범위, prior values의 관계를 명확히 하도록 안내합니다. 기간·current KPI·action은 `MetricCard`/`ChartFrame`에 남기고 LineChart는 다중 시리즈 추이만 소유합니다.
