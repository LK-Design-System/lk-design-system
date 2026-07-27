# Battery Gauge

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `BatteryGauge` |
| Storybook | `LDS Product/Status/Battery Gauge` |
| Source | `../component-content.json#product-status-battery-gauge` |

배터리를 사용하는 장비의 잔량을 한눈에 판단할 때 적합합니다. 색은 잔량 구간을 보조하지만 % 숫자를 항상 함께 보여 주며, 시간에 따른 전력 추이에는 차트를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| showLabel | % 라벨 표시. @default true |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No | 배터리 잔량(0–100). @default 0 |
| `tone` | `'neutral' \| 'signal' \| 'positive' \| 'cautionary' \| 'negative'` | No | 제품이 결정한 의미 상태. 생략하면 호환성을 위해 기존 20/50 잔량 임계값을 적용합니다. |
| `showLabel` | `boolean` | No | % 라벨 표시. @default true |
| `size` | `'sm' \| 'md'` | No |  |

## States

| State | Contract |
| --- | --- |
| tone | 제품이 결정한 의미 상태. 생략하면 호환성을 위해 기존 20/50 잔량 임계값을 적용합니다. |

## Behavior and interaction

- BatteryGauge — 배터리 잔량 표시(셸 + 레벨색 fill + %). 로봇/설비 상태 행에서 ConnectionBadge와 함께 씁니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | value 0–100 · tone neutral · signal · positive · cautionary · negative · showLabel · size sm · md. |
| 명시 규칙 2 | 제품의 도메인 규칙이 있다면 tone으로 의미 상태를 명시합니다. 생략하면 이전 API와의 호환을 위해 잔량 기준(≤20% negative · ≤50% cautionary · else positive)을 적용합니다. |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-neutral | light: rgba(46, 47, 51, 0.88); dark: rgba(194, 196, 200, 0.88) |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |

## Related components

| Component | Relationship |
| --- | --- |
| `ConnectionBadge` | 대표 시나리오에서 조합 |
| `EquipmentStatusCard` | 대표 시나리오에서 조합 |
| `TelemetryGauge` | 대표 시나리오에서 조합 |
| `TelemetryValue` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<BatteryGauge value={86} />
<BatteryGauge value={12} size="sm" />
<BatteryGauge value={47} showLabel={false} />
<BatteryGauge value={47} tone="cautionary" />
```

## Tokens and API

### Tokens

- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-cautionary-text`
- `--color-semantic-status-info-text`
- `--color-semantic-status-negative`
- `--color-semantic-status-negative-text`
- `--color-semantic-status-positive`
- `--color-semantic-status-positive-text`
- `--font-sans`
- `--fw-bold`

### Source contracts

- `components/robotics/BatteryGauge.jsx`
- `components/robotics/BatteryGauge.d.ts`
- `components/robotics/BatteryGauge.prompt.md`
- `stories/RoboticsBatteryGauge.stories.jsx`

## Sources

- BatteryGauge prompt contract: `components/robotics/BatteryGauge.prompt.md`
- Storybook implementation evidence: `stories/RoboticsBatteryGauge.stories.jsx`
