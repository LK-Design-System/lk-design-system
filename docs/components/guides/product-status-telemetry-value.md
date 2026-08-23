# Telemetry Value

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `TelemetryValue` |
| Storybook | `LDS Product/Status/Telemetry Value` |
| Source | `../component-content.json#product-status-telemetry-value` |

운영자가 센서의 정확한 값·단위·상태·freshness·수집 시각을 좁은 공간에서 확인해야 할 때 적합합니다. 최소·최대 범위 안의 상대적 수준을 빠르게 판단해야 한다면 Telemetry Value 대신 Telemetry Gauge를 사용하세요.

## 사용 판단

### 사용하지 않음

- 값과 단위는 항상 고대비 중립 전경색으로 표시합니다. tone은 숫자 색을 바꾸지 않고 보이는 StatusBadge를 추가하므로 의미가 색에만 의존하지 않습니다.
- threshold 계산, 단위 변환, locale/precision 정책, 알람 이력은 애플리케이션 책임이며 TelemetryValue가 추론하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| statusLabel | tone과 함께 보이는 상태 문구. 미지정 시 tone의 기본 한국어 문구를 사용합니다. |
| staleLabel | stale 상태 badge 라벨. @default "지연" |
| helper | timestamp와 함께 표시할 보조 문구. |
| align | 정렬. @default "start" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 수치 라벨. |
| `value` | `string \| number` | Yes | 표시할 scalar 값. 주변 공백은 정규화합니다. 값이 없을 때 쓰는 dash placeholder("—"/"-")는 display weight·strong ink 없이 렌더링됩니다. |
| `unit` | `string` | No | 문자열 단위. %/‰/평면각 °는 붙고, SI·복합 단위는 한 칸 띄웁니다. |
| `tone` | `'neutral' \| 'signal' \| 'positive' \| 'cautionary' \| 'negative'` | No | 값의 의미 상태. 값 자체의 전경색은 바꾸지 않습니다. @default "neutral" |
| `statusLabel` | `React.ReactNode` | No | tone과 함께 보이는 상태 문구. 미지정 시 tone의 기본 한국어 문구를 사용합니다. |
| `timestamp` | `React.ReactNode` | No | 갱신 시각. helper가 있어도 함께 표시됩니다. |
| `stale` | `boolean` | No | stale 상태. @default false |
| `staleLabel` | `React.ReactNode` | No | stale 상태 badge 라벨. @default "지연" |
| `showStaleBadge` | `boolean` | No | stale badge 표시 여부. 외부에 동등한 텍스트 상태가 있을 때만 끄세요. @default true |
| `helper` | `React.ReactNode` | No | timestamp와 함께 표시할 보조 문구. |
| `align` | `'start' \| 'end'` | No | 정렬. @default "start" |
| `orientation` | `'vertical' \| 'horizontal'` | No | 배치. "vertical"은 라벨 위·값 아래의 KPI 타일, "horizontal"은 라벨과 값을 한 줄에 두고 값 타이포를 supporting-text 단계로 낮춘 요약 띠용 변형입니다. 값·단위·tone·stale 의미 계약은 동일합니다. @default "vertical" |
| `size` | `'sm' \| 'md'` | No | 밀도. @default "md" |

## States

| State | Contract |
| --- | --- |
| tone | 값의 의미 상태. 값 자체의 전경색은 바꾸지 않습니다. @default "neutral" |
| statusLabel | tone과 함께 보이는 상태 문구. 미지정 시 tone의 기본 한국어 문구를 사용합니다. |
| stale | stale 상태. @default false |
| staleLabel | stale 상태 badge 라벨. @default "지연" |
| showStaleBadge | stale badge 표시 여부. 외부에 동등한 텍스트 상태가 있을 때만 끄세요. @default true |

## Behavior and interaction

- 수치 갱신 자체는 live region으로 알리지 않습니다. 연결 끊김·임계값 진입 같은 의미 있는 전환은 상위 상태 컴포넌트가 알립니다.
- 확인한 형제: TelemetryGauge, StatusBadge, ConnectionBadge, MetricCard, Table 및 docs/ROBOTICSPATTERNS.md.
- 원형 범위 표시는 TelemetryGauge, 연결 상태는 ConnectionBadge, 표의 정렬·열 책임은 Table에 둡니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | horizontal은 값 타이포를 display 단계에서 supporting-text 단계로 낮춥니다(md → --label1-size, sm → --label2-size, 단위는 --caption1-size/--caption2-size). 배터리 게이지·연결 배지·상태 칩처럼 한 줄 2024px 이웃과 나란히 놓이는 자리에서 40px 두 단으로 튀지 않게 하기 위한 것입니다. 값 자체를 강조해야 하는 자리라면 vertical을 유지하세요. |
| 명시 규칙 2 | 작은 폭에서 값·단위·badge·metadata가 줄바꿈되며, 컴포넌트 자체가 고정 최소 너비를 만들지 않습니다. |
| 명시 규칙 3 | 타입 스케일 정합: metadata 행 11.5px → --caption2-size(11px)로 스냅했습니다. 12px label(caption1)보다 한 단계 아래를 유지해 위계를 지킵니다. 값 숫자는 sm 18px → --headline1-size(18px), md 21px → --heading2-size(20px, −1px 의도된 변경)로 스냅했으며 fw-extra 굵기가 프로미넌스를 유지합니다. |
| 명시 규칙 4 | WCAG 2.2 Use of Color: 상태색에는 항상 보이는 텍스트 단서를 함께 제공합니다. |
| --caption1-line | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |

## Responsive

- NIST Guide to the SI, 7.2: SI·복합 단위와 °C는 값과 공백으로 분리하고 평면각 °만 붙입니다. LDS는 compact UI에서도 이 구분을 유지하며 %와 ‰는 제품 표기 관례 예외로 붙입니다.
- TelemetryValue — 값, 단위, 의미 상태, freshness, timestamp를 함께 읽는 compact telemetry readout입니다. Owner는 LDS Product / Operations이고 WDS provenance는 product-extension이며, 표 셀, viewport HUD 주변, 좁은 진단 패널에 사용합니다.

## Content and writing

- value는 string | number, unit은 문자열 계약입니다. 두 값의 앞뒤 공백을 제거한 뒤 %, ‰, 평면각 °는 값에 붙이고, °C, °F, ms, Hz, m/s, N·m, dBm 같은 SI·복합 단위는 한 칸 띄웁니다. 표시 DOM과 보조기술이 읽는 텍스트는 같은 literal separator를 공유합니다.
- statusLabel을 생략하면 signal / positive / cautionary / negative의 기본 한국어 상태 문구를 사용합니다. 제품에서는 가능한 한 신호 약함, 상한 초과처럼 도메인에 맞는 문구를 전달하세요.
- stale은 현재값처럼 오해하지 않도록 값을 약화하고 기본 지연 badge를 표시합니다. staleLabel은 그 badge 문구만 교체하므로 수신 지연처럼 freshness를 설명하는 표현만 허용됩니다 — 의미 상태 문구는 tone/statusLabel 축에 남습니다. 별도 상태 컬럼이 동등한 텍스트를 제공할 때만 showStaleBadge={false}를 사용합니다.
- 값이 없을 때의 dash placeholder(—, –, -)는 display 굵기와 strong ink 없이 렌더링되고 root에 data-empty="true"가 붙습니다. 타입 단계는 유지하므로 타일이 나란히 놓여도 baseline이 어긋나지 않습니다. 값이 없는 지표가 실제 값보다 시선을 더 끄는 상태를 막기 위한 규칙입니다.

## Accessibility

- 임의 ReactNode를 수치나 단위 자리에 넣지 않습니다. 그래픽·복합 콘텐츠가 필요하면 readout 바깥에서 조합하고 그 노드가 자체 접근성 텍스트를 소유하게 하세요.
- align(기본 start)은 readout 전체의 정렬 축입니다. 표의 숫자 컬럼이나 카드 우측 정렬처럼 소유 레이아웃이 끝 정렬을 요구할 때 end를 사용하며, 줄바꿈 순서와 접근성 텍스트는 바뀌지 않습니다.
- orientation(기본 vertical)은 배치만 바꿉니다. vertical은 라벨 위·값 아래로 쌓는 KPI 타일이고, horizontal은 라벨과 값을 한 줄에 두는 요약 띠 변형입니다. value/unit/tone/stale/statusLabel의 의미 계약, DOM 순서, 접근성 텍스트는 두 배치에서 동일합니다.
- WCAG 2.2 Contrast Minimum: 작은 label·unit·timestamp는 faint assistive token 대신 AA 대비를 목표로 하는 neutral text token을 사용합니다.
- WAI-ARIA APG Meter Pattern: 읽기 전용 meter의 키보드 상호작용은 없으며, scalar range semantics는 TelemetryGauge에만 둡니다. 범위가 없는 임의 readout에 meter 역할을 부여하지 않습니다.

## Related components

| Component | Relationship |
| --- | --- |
| `BatteryGauge` | 대표 시나리오에서 조합 |
| `ConnectionBadge` | 대표 시나리오에서 조합 |
| `EquipmentStatusCard` | 대표 시나리오에서 조합 |
| `TelemetryGauge` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<TelemetryValue
  label="RSSI"
  value="-71"
  unit="dBm"
  tone="cautionary"
  statusLabel="신호 약함"
  helper="마지막 패킷 4초 전"
  timestamp="10:42:18 KST"
/>
```

## Tokens and API

### Tokens

- `--caption1-line`
- `--caption1-size`
- `--caption2-size`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--font-sans`
- `--fw-bold`
- `--fw-extra`
- `--heading2-size`
- `--headline1-size`
- `--label1-line`
- `--label1-size`
- `--label2-line`
- `--label2-size`
- `--space-0-5`
- `--space-1`
- `--space-1-5`
- `--space-2`

### Source contracts

- `components/viz/TelemetryValue.jsx`
- `components/viz/TelemetryValue.d.ts`
- `components/viz/TelemetryValue.prompt.md`
- `stories/RoboticsTelemetryValue.stories.jsx`

## Sources

- TelemetryValue prompt contract: `components/viz/TelemetryValue.prompt.md`
- Storybook implementation evidence: `stories/RoboticsTelemetryValue.stories.jsx`
- [WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [WCAG 2.2 Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WAI-ARIA APG Meter Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/meter/)
- [Microsoft Style Guide: percent](https://learn.microsoft.com/en-us/style-guide/a-z-word-list-term-collections/p/percent-percentage)
- [PatternFly Description list design guidelines](https://www.patternfly.org/components/description-list/design-guidelines)
- [Cloudscape Key-value pairs](https://cloudscape.design/components/key-value-pairs/)
- [NIST Guide to the SI, 7.2](https://www.nist.gov/pml/special-publication-811/nist-guide-si-chapter-7-rules-and-style-conventions-expressing-values)
