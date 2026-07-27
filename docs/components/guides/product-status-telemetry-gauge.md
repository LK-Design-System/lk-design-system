# Telemetry Gauge

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `TelemetryGauge` |
| Storybook | `LDS Product/Status/Telemetry Gauge` |
| Source | `../component-content.json#product-status-telemetry-gauge` |

운영자가 배터리·속도·온도처럼 최소·최대 범위가 있는 측정값의 수준과 severity를 빠르게 판단할 때 적합합니다. 범위보다 정확한 값·수집 시각·freshness가 중요하다면 Telemetry Gauge 대신 Telemetry Value를 사용하세요.

## 사용 판단

### 사용

- Meter와 마찬가지로 알려진 범위의 현재량만 표현합니다. 로딩·완료 진행은 ProgressBar, 제품별 임계값 schema와 알람 정책은 애플리케이션 책임으로 남깁니다.
- HTML meter element: 의미 있는 유한 범위의 scalar 값에만 meter를 사용하고 값은 범위 안으로 제한합니다.

### 사용하지 않음

- TelemetryGauge — 알려진 최소·최대 범위 안의 텔레메트리 값을 표시하는 270° radial meter입니다. LK Robotics Extension으로 분류하며, 작업 진행률이나 로딩에는 사용하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 보이는 라벨. 없으면 aria-label을 제공하세요. |
| statusLabel | tone과 함께 보이는 상태 문구. 미지정 시 tone의 기본 한국어 문구를 사용합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No |  |
| `min` | `number` | No |  |
| `max` | `number` | No |  |
| `unit` | `string` | No | 중앙 값 lockup의 문자열 단위. 주변 공백을 제거한 뒤 공용 결합 규칙을 적용합니다. |
| `label` | `React.ReactNode` | No | 보이는 라벨. 없으면 aria-label을 제공하세요. |
| `size` | `number` | No | 지름(px). @default 120 |
| `thickness` | `number` | No | 링 두께(px). @default 10 |
| `thresholds` | `TelemetryThresholds` | No | Compatibility threshold inference. New product code should resolve domain severity and pass tone; when used, direction is mandatory. |
| `tone` | `TelemetryTone` | No | 제품이 판정한 현재 severity. thresholds보다 우선합니다. |
| `statusLabel` | `React.ReactNode` | No | tone과 함께 보이는 상태 문구. 미지정 시 tone의 기본 한국어 문구를 사용합니다. |
| `precision` | `number` | No | 표시 소수 자릿수. 생략하면 원래 수치의 의미 있는 자릿수를 보존합니다. |
| `formatter` | `(value: number, context: TelemetryGaugeFormatContext) = string \| number` | No | 중앙 값 사용자 포맷. valueText는 별도로 제공할 수 있습니다. |
| `valueText` | `string` | No | 보조기술이 읽을 사람 친화적 값 텍스트. |

## States

| State | Contract |
| --- | --- |
| tone | 제품이 판정한 현재 severity. thresholds보다 우선합니다. |
| statusLabel | tone과 함께 보이는 상태 문구. 미지정 시 tone의 기본 한국어 문구를 사용합니다. |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | value / min / max / unit은 meter 범위와 값을 정의합니다. unit은 문자열이며 앞뒤 공백을 제거합니다. 기본 표시는 String(value)를 사용해 1.4를 1로 반올림하지 않습니다. |
| 명시 규칙 2 | size(지름 px, 기본 120)와 thickness(링 두께 px, 기본 10)는 밀도 조정용 크기 축입니다. 중앙 값·단위 typography는 size에 비례해 함께 조정되므로 대시보드 격자에 맞춰 지름만 바꾸면 됩니다. 두께는 arc의 비텍스트 대비 면적을 좌우하므로 지름을 크게 키울 때 외에는 기본값을 유지합니다. |
| 명시 규칙 3 | WCAG 2.2 Use of Color: severity 색을 단독 정보로 사용하지 않고 보이는 상태 텍스트를 병기합니다. |
| 명시 규칙 4 | Microsoft Style Guide: percent와 NIST Guide to the SI, 7.2를 함께 적용해 UI 비율 기호와 SI·복합 단위의 결합 규칙을 명시했습니다. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Content and writing

- meter arc는 light/dark surface 모두에서 비텍스트 그래픽 대비를 확보하는 semantic status text role을 사용하고, 상태 의미는 별도 text badge로도 제공합니다.
- 제품 도메인이 severity를 판정해 tone과 구체적인 statusLabel을 전달하는 방식을 우선합니다. 상태는 색과 함께 텍스트 badge로 항상 표시됩니다.
- Adobe Spectrum Meter: 보이는 label과 value label을 기본 anatomy로 유지합니다. 시각 스타일은 복제하지 않고 LDS typography·spacing·status token에 맞췄습니다.

## Accessibility

- 중앙의 보이는 lockup과 기본 aria-valuetext는 같은 결합 함수를 사용합니다. %, ‰, 평면각 °는 값에 붙이고 SI·복합 단위와 °C·°F는 한 칸 띄웁니다.
- precision은 소비자가 명시적으로 고정 소수 자릿수를 원할 때만 사용합니다. formatter는 string/number를 반환하며 주변 공백을 정규화한 결과가 화면과 기본 aria-valuetext에 함께 반영됩니다. 도메인 문구가 더 필요할 때 valueText로 명시합니다.
- 보이는 label이 meter의 accessible name이 됩니다. 라벨이 없으면 aria-label을 제공해야 합니다.
- meter는 읽기 전용이므로 키보드 상호작용과 live announcement가 없습니다. 측정값을 매 갱신마다 aria-live로 읽지 않습니다.
- WAI-ARIA APG Meter Pattern: role="meter", name, aria-valuemin/max/now, 필요 시 aria-valuetext를 제공하고 진행률과 구분했습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BatteryGauge` | 대표 시나리오에서 조합 |
| `ConnectionBadge` | 대표 시나리오에서 조합 |
| `EquipmentStatusCard` | 대표 시나리오에서 조합 |
| `TelemetryValue` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<TelemetryGauge value={1.4} max={2} unit="m/s" label="속도" tone="signal" />
<TelemetryGauge value={18} unit="%" label="배터리" tone="negative" statusLabel="충전 필요" />
<TelemetryGauge value={0.8467} max={1} label="신뢰도" precision={2} valueText="신뢰도 84.67%" />
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-fill-strong`
- `--color-semantic-label-neutral`
- `--color-semantic-label-strong`
- `--color-semantic-status-cautionary-text`
- `--color-semantic-status-info-text`
- `--color-semantic-status-negative-text`
- `--color-semantic-status-positive-text`
- `--dur-base`
- `--dur-slow`
- `--ease-out`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--fw-semibold`
- `--space-2`

### Source contracts

- `components/viz/TelemetryGauge.jsx`
- `components/viz/TelemetryGauge.d.ts`
- `components/viz/TelemetryGauge.prompt.md`
- `stories/RoboticsTelemetryGauge.stories.jsx`

## Migration

- thresholds는 기존 사용처 호환용입니다. 새 사용처에서는 direction: "higher-is-better" | "lower-is-better"를 반드시 명시하며, 가능하면 제품에서 threshold를 계산하고 tone을 전달하세요.

## Sources

- TelemetryGauge prompt contract: `components/viz/TelemetryGauge.prompt.md`
- Storybook implementation evidence: `stories/RoboticsTelemetryGauge.stories.jsx`
- [WAI-ARIA APG Meter Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/)
- [HTML meter element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter)
- [Adobe Spectrum Meter](https://spectrum.adobe.com/page/meter/)
- [WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [Microsoft Style Guide: percent](https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/p/percent-percentage)
- [NIST Guide to the SI, 7.2](https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-7-rules-and-style-conventions-expressing-values)
