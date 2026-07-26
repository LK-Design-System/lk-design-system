# Meter

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `Meter` |
| Storybook | `LDS Product/Status/Meter` |
| Source | `../component-content.json#product-status-meter` |

수위·품질·위험 점수처럼 최소·최대 경계가 있는 현재 측정값을 비교할 때 적합합니다. 업로드나 처리 작업의 완료율에는 Meter 대신 ProgressBar 또는 CircularProgress를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| thresholdLabels | 임계 구간을 색 대신 전달하는 문구를 재정의합니다(WCAG 1.4.1). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No |  |
| `max` | `number` | No |  |
| `label` | `React.ReactNode` | No |  |
| `thresholds` | `{ low: number; high: number }` | No | 퍼센트 임계값: ≤low 레드, ≤high 앰버, 그 외 그린. |
| `thresholdLabels` | `MeterThresholdLabels` | No | 임계 구간을 색 대신 전달하는 문구를 재정의합니다(WCAG 1.4.1). |
| `size` | `'sm' \| 'md'` | No |  |
| `showValue` | `boolean` | No | "value/max" 표시. @default true |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 접근성 role — 알려진 범위 안의 측정값이므로 role="meter"로 노출됩니다. role="progressbar"는 작업의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 ProgressBar를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다. |
| 명시 규칙 2 | 값 발화 — aria-valuenow / aria-valuemin / aria-valuemax는 caller의 value·max 단위를 그대로 씁니다(퍼센트로 환산하지 않음). 기본 aria-valuetext는 보이는 캡션과 같은 value/max 문자열이라 max !== 100에서도 표기와 발화가 어긋나지 않습니다. aria-valuetext를 직접 넘기면 그대로 우선합니다. |
| 명시 규칙 3 | thresholdLabels — 임계 구간은 색상만으로 전달하지 않습니다(WCAG 1.4.1). 구간에 해당하는 낱말이 값 옆에 함께 렌더되고 aria-valuetext에도 붙습니다. 기본값은 { negative: '위험', cautionary: '주의', positive: '양호' }이며, 수위·품질처럼 도메인 어휘가 다르면 필요한 키만 덮어씁니다. showValue={false}여도 임계 구간이 있으면 캡션 줄은 유지됩니다. |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |

## Content and writing

- value / max — 레벨. thresholds — { low, high } 퍼센트 → 레드 / 앰버 / 스틸그린. label / showValue. 작업 진행에는 ProgressBar를 쓰세요.
- Meter — 임계값(옵션)이 있는 라벨 값 바(완료율, 품질 점수).

## Accessibility

- 이름 — 문자열이 아닌 label(ReactNode)도 보이는 라벨에 aria-labelledby로 연결되므로 무명 meter가 생기지 않습니다. label도 aria-label도 없으면 측정값이 기본 이름입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `CircularProgress` | 대표 시나리오에서 조합 |
| `ProgressBar` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<Meter label="완료율" value={82} thresholds={{ low: 20, high: 50 }} />
<Meter label="냉각수 수위" value={12} max={40} thresholds={{ low: 20, high: 50 }} thresholdLabels={{ negative: '부족' }} />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-strong`
- `--color-semantic-label-alternative`
- `--color-semantic-label-neutral`
- `--color-semantic-primary-normal`
- `--color-semantic-status-cautionary`
- `--color-semantic-status-cautionary-text`
- `--color-semantic-status-negative`
- `--color-semantic-status-negative-text`
- `--color-semantic-status-positive`
- `--color-semantic-status-positive-text`
- `--dur-base`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`
- `--label2-size`
- `--radius-pill`
- `--space-1-5`

### Source contracts

- `components/status/Meter.jsx`
- `components/status/Meter.d.ts`
- `components/status/Meter.prompt.md`
- `stories/ProductMeter.stories.jsx`

## Sources

- Meter prompt contract: `components/status/Meter.prompt.md`
- Storybook implementation evidence: `stories/ProductMeter.stories.jsx`
