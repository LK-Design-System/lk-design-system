**Sparkline** — 현재 KPI 옆에서 짧은 수치 추세를 보여주는 축 없는 인라인 차트. Classification: **LDS Product Data Extension**.

```jsx
<Sparkline
  aria-label="최근 7일 처리량 추세"
  description="일별 처리량입니다."
  data={[3, 5, 4, 8, 6, 9, 12]}
/>
```

- **data / width / height / color / fill / strokeWidth** — compact trend의 수치와 시각 축입니다. finite 값만 그립니다.
- **description / summary / emptyLabel / formatValue** — SVG의 설명, 자동 `개수·시작·최저·최고·마지막` 요약 override, 보이는 빈 문구, 요약 수치 formatter입니다.
- 제품 맥락이 있는 `aria-label`을 제공하세요. 생략 시 fallback 이름은 `추세 차트`입니다.
- 빈 배열은 빈 SVG가 아니라 `emptyLabel` 텍스트를 렌더하고 같은 정보를 `<desc>`에 제공합니다.

## Internal LDS comparison and retained deltas

- `LineChart`의 responsive SVG, named image, `<desc>` 패턴을 따르되 axis/legend/reference line 없이 inline 추세에만 집중합니다.
- `MetricCard`의 tabular current value를 대체하지 않습니다. Sparkline은 과거 흐름만 보조하며 현재 값·기간·baseline은 MetricCard가 소유합니다.
- 기존 primary stroke, soft fill, 2px inset을 유지하고 좁은 부모에서 비례 축소되도록 max-width만 보강했습니다.

## External references and design conclusions

- [PatternFly dashboard guidelines](https://www.patternfly.org/patterns/dashboard/design-guidelines/)는 trend card가 current value와 prior values over a period를 함께 보여주고 sparkline을 흔히 사용한다고 설명합니다. current value·period·action은 MetricCard에, trend rendering만 Sparkline에 둡니다.
- [Carbon chart anatomy](https://v10.carbondesignsystem.com/data-visualization/chart-anatomy/)의 descriptive title/label 원칙을 축 없는 sparkline에도 적용해 accessible name과 수치 요약을 요구합니다.
- [Carbon accessibility for developers](https://carbondesignsystem.com/guidelines/accessibility/developers/)의 meaningful description/data alternative 원칙에 따라 선 모양만 발표하지 않고 시작·범위·마지막 값을 텍스트로 제공합니다.

필수 범위는 accessible identity, deterministic trend summary, visible empty state, responsive inline rendering입니다. tooltip, hover point, axis, selection, forecasting은 `LineChart` 또는 제품 chart engine에 남깁니다.
