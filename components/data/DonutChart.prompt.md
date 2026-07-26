**DonutChart** — 비음수 세그먼트의 전체 대비 비율과 실제 합계를 보여주는 링 차트. Classification: **LDS Product Data Extension**.

```jsx
<DonutChart
  aria-label="운영 상태 비율"
  description="정상, 검토, 중지 장비의 구성을 보여줍니다."
  segments={[
    { id: 'healthy', value: 12, label: '정상' },
    { id: 'review', value: 7, label: '검토' },
    { id: 'stopped', value: 5, label: '중지' },
  ]}
/>
```

- **segments** — `{ id?, value, label, accessibleLabel?, color? }[]`. 음수와 비수치 값은 원형 비율에서 0으로 취급합니다.
- **size / thickness / showTotal / centerLabel / legend** — 링, big number, 보이는 범례 축입니다. 긴 label과 범례는 좁은 폭에서 감싸집니다.
- **description / summary / emptyLabel** — root `role="img"`의 설명, 자동 합계·수치·비율 요약 override, 빈 배열의 가운데 문구입니다.
- 합계가 0이면 1을 대체 합계로 만들지 않습니다. 색 세그먼트는 그리지 않고 가운데 `0`, 범례 `0%`, 텍스트 `합계 0`을 유지합니다.
- 빈 배열과 0합계는 구분합니다. 빈 배열은 `emptyLabel`, 0합계는 실제 세그먼트 이름·0 값이 포함된 요약을 제공합니다.

## Internal LDS comparison and retained deltas

- `Legend`의 swatch+label+value 위계를 유지하되 Donut 내부 범례는 차트의 자동 텍스트 요약과 중복 발표되지 않도록 decorative 처리합니다.
- `LineChart`와 같은 named image/description 계약을 채택하고, 원형 차트의 big number와 비율 범례만 고유 anatomy로 유지합니다.
- host `Card`가 surface와 action을 소유합니다. DonutChart에 별도 card chrome이나 nested surface를 추가하지 않습니다.
- 기존 palette, ring thickness, centered total을 유지하고 zero-sum의 거짓 `1`과 narrow overflow만 제거했습니다.

## External references and design conclusions

- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)는 circular chart의 title, label, tooltip, legend, graph frame, big number를 구분하며 작은 slice의 정보가 사라질 때 데이터 대안이 필요하다고 설명합니다. LDS는 모든 세그먼트를 결정적 텍스트 요약에 포함합니다.
- [Carbon accessibility for developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)의 의미 있는 텍스트 대안 원칙에 따라 색·호 길이만으로 값을 전달하지 않습니다.
- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)는 proportional utilization에 bar/donut을 사용하고 card title과 선택적 action을 별도 anatomy로 둡니다. 해당 chrome은 MetricCard/Card 조합에 남깁니다.

필수 범위는 실제 합계, accessible identity/summary, visible empty state, zero-sum 안정성입니다. slice interaction, tooltip, selection, tiny-slice callout, full data table은 chart engine 또는 제품 조합에 남깁니다.
