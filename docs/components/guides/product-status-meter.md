# Meter

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Status |
| Owner | `Meter` |
| Storybook | `LDS Product/Status/Meter` |
| Source | `../component-content.json#product-status-meter` |

수위·품질·위험 점수처럼 최소·최대 경계가 있는 현재 측정값을 비교할 때 적합합니다. 업로드나 처리 작업의 완료율에는 Meter 대신 ProgressBar 또는 CircularProgress를 사용하세요.

## 사용 판단

### 사용

- 수위·품질·위험 점수처럼 최소·최대 경계가 있는 현재 측정값을 비교할 때 적합합니다. 업로드나 처리 작업의 완료율에는 Meter 대신 ProgressBar 또는 CircularProgress를 사용하세요.
- Meter가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Meter API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- 접근성 role — 알려진 범위 안의 측정값이므로 role="meter"로 노출됩니다. role="progressbar"는 작업의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 ProgressBar를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다.
- 값 발화 — aria-valuenow / aria-valuemin / aria-valuemax는 caller의 value·max 단위를 그대로 씁니다(퍼센트로 환산하지 않음). 기본 aria-valuetext는 보이는 캡션과 같은 value/max 문자열이라 max !== 100에서도 표기와 발화가 어긋나지 않습니다. aria-valuetext를 직접 넘기면 그대로 우선합니다.
- thresholdLabels — 임계 구간은 색상만으로 전달하지 않습니다(WCAG 1.4.1). 구간에 해당하는 낱말이 값 옆에 함께 렌더되고 aria-valuetext에도 붙습니다. 기본값은 { negative: '위험', cautionary: '주의', positive: '양호' }이며, 수위·품질처럼 도메인 어휘가 다르면 필요한 키만 덮어씁니다. showValue={false}여도 임계 구간이 있으면 캡션 줄은 유지됩니다.
- 이름 — 문자열이 아닌 label(ReactNode)도 보이는 라벨에 aria-labelledby로 연결되므로 무명 meter가 생기지 않습니다. label도 aria-label도 없으면 측정값이 기본 이름입니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Meter의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Threshold Labels | 임계 구간을 색 대신 전달하는 문구를 재정의합니다(WCAG 1.4.1). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `value` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `max` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `thresholds` | `{ low: number; high: number }` | No | 퍼센트 임계값: ≤low 레드, ≤high 앰버, 그 외 그린. |
| `thresholdLabels` | `MeterThresholdLabels` | No | 임계 구간을 색 대신 전달하는 문구를 재정의합니다(WCAG 1.4.1). |
| `size` | `'sm' \| 'md'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `showValue` | `boolean` | No | "value/max" 표시. @default true |

## States

| State | Contract |
| --- | --- |
| Default | 별도 상태 머신을 만들지 않으며 전달된 콘텐츠와 semantic token으로 기본 표현을 구성합니다. |

## Behavior and interaction

- 값 발화 — aria-valuenow / aria-valuemin / aria-valuemax는 caller의 value·max 단위를 그대로 씁니다(퍼센트로 환산하지 않음). 기본 aria-valuetext는 보이는 캡션과 같은 value/max 문자열이라 max !== 100에서도 표기와 발화가 어긋나지 않습니다. aria-valuetext를 직접 넘기면 그대로 우선합니다.
- 이름 — 문자열이 아닌 label(ReactNode)도 보이는 라벨에 aria-labelledby로 연결되므로 무명 meter가 생기지 않습니다. label도 aria-label도 없으면 측정값이 기본 이름입니다.
- - value / max — 레벨. thresholds — { low, high } 퍼센트 → 레드 / 앰버 / 스틸그린. label / showValue. 작업 진행에는 ProgressBar를 쓰세요. - 접근성 role — 알려진 범위 안의 측정값이므로 role="meter"로 노출됩니다. role="progressbar"는 작업의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 ProgressBar를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다. - 값 발화 — aria-valuenow / aria-valuemin….
- Meter의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 접근성 role — 알려진 범위 안의 측정값이므로 role="meter"로 노출됩니다. role="progressbar"는 작업의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 ProgressBar를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다. |
| 명시 규칙 2 | 값 발화 — aria-valuenow / aria-valuemin / aria-valuemax는 caller의 value·max 단위를 그대로 씁니다(퍼센트로 환산하지 않음). 기본 aria-valuetext는 보이는 캡션과 같은 value/max 문자열이라 max !== 100에서도 표기와 발화가 어긋나지 않습니다. aria-valuetext를 직접 넘기면 그대로 우선합니다. |
| 명시 규칙 3 | thresholdLabels — 임계 구간은 색상만으로 전달하지 않습니다(WCAG 1.4.1). 구간에 해당하는 낱말이 값 옆에 함께 렌더되고 aria-valuetext에도 붙습니다. 기본값은 { negative: '위험', cautionary: '주의', positive: '양호' }이며, 수위·품질처럼 도메인 어휘가 다르면 필요한 키만 덮어씁니다. showValue={false}여도 임계 구간이 있으면 캡션 줄은 유지됩니다. |
| 명시 규칙 4 | - value / max — 레벨. thresholds — { low, high } 퍼센트 → 레드 / 앰버 / 스틸그린. label / showValue. 작업 진행에는 ProgressBar를 쓰세요. - 접근성 role — 알려진 범위 안의 측정값이므로 role="meter"로 노출됩니다. role="progressbar"는 작업의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 ProgressBar를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다. - 값 발화 — aria-valuenow / aria-valuemin… |
| --color-semantic-fill-strong | light: rgba(112, 115, 124, 0.16); dark: rgba(112, 115, 124, 0.28) |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- value / max — 레벨. thresholds — { low, high } 퍼센트 → 레드 / 앰버 / 스틸그린. label / showValue. 작업 진행에는 ProgressBar를 쓰세요.
- 값 발화 — aria-valuenow / aria-valuemin / aria-valuemax는 caller의 value·max 단위를 그대로 씁니다(퍼센트로 환산하지 않음). 기본 aria-valuetext는 보이는 캡션과 같은 value/max 문자열이라 max !== 100에서도 표기와 발화가 어긋나지 않습니다. aria-valuetext를 직접 넘기면 그대로 우선합니다.
- thresholdLabels — 임계 구간은 색상만으로 전달하지 않습니다(WCAG 1.4.1). 구간에 해당하는 낱말이 값 옆에 함께 렌더되고 aria-valuetext에도 붙습니다. 기본값은 { negative: '위험', cautionary: '주의', positive: '양호' }이며, 수위·품질처럼 도메인 어휘가 다르면 필요한 키만 덮어씁니다. showValue={false}여도 임계 구간이 있으면 캡션 줄은 유지됩니다.
- 이름 — 문자열이 아닌 label(ReactNode)도 보이는 라벨에 aria-labelledby로 연결되므로 무명 meter가 생기지 않습니다. label도 aria-label도 없으면 측정값이 기본 이름입니다.

## Accessibility

- 접근성 role — 알려진 범위 안의 측정값이므로 role="meter"로 노출됩니다. role="progressbar"는 작업의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 ProgressBar를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다.
- 값 발화 — aria-valuenow / aria-valuemin / aria-valuemax는 caller의 value·max 단위를 그대로 씁니다(퍼센트로 환산하지 않음). 기본 aria-valuetext는 보이는 캡션과 같은 value/max 문자열이라 max !== 100에서도 표기와 발화가 어긋나지 않습니다. aria-valuetext를 직접 넘기면 그대로 우선합니다.
- thresholdLabels — 임계 구간은 색상만으로 전달하지 않습니다(WCAG 1.4.1). 구간에 해당하는 낱말이 값 옆에 함께 렌더되고 aria-valuetext에도 붙습니다. 기본값은 { negative: '위험', cautionary: '주의', positive: '양호' }이며, 수위·품질처럼 도메인 어휘가 다르면 필요한 키만 덮어씁니다. showValue={false}여도 임계 구간이 있으면 캡션 줄은 유지됩니다.
- 이름 — 문자열이 아닌 label(ReactNode)도 보이는 라벨에 aria-labelledby로 연결되므로 무명 meter가 생기지 않습니다. label도 aria-label도 없으면 측정값이 기본 이름입니다.
- - value / max — 레벨. thresholds — { low, high } 퍼센트 → 레드 / 앰버 / 스틸그린. label / showValue. 작업 진행에는 ProgressBar를 쓰세요. - 접근성 role — 알려진 범위 안의 측정값이므로 role="meter"로 노출됩니다. role="progressbar"는 작업의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 ProgressBar를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다. - 값 발화 — aria-valuenow / aria-valuemin….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Meter가 소유하는 Status 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | 접근성 role — 알려진 범위 안의 측정값이므로 role="meter"로 노출됩니다. role="progressbar"는 작업의 진척도를 뜻하므로 쓰지 않습니다. 이 때문에 Meter는 ProgressBar를 합성하지 않고 같은 트랙 형상(sm 6px / md 10px)을 직접 렌더합니다. |
| Do | 제품별 구현 대신 공개 Meter API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 값 발화 — aria-valuenow / aria-valuemin / aria-valuemax는 caller의 value·max 단위를 그대로 씁니다(퍼센트로 환산하지 않음). 기본 aria-valuetext는 보이는 캡션과 같은 value/max 문자열이라 max !== 100에서도 표기와 발화가 어긋나지 않습니다. aria-valuetext를 직접 넘기면 그대로 우선합니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Meter의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `CircularProgress` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `ProgressBar` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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

### Source contracts

- `components/status/Meter.jsx`
- `components/status/Meter.d.ts`
- `components/status/Meter.prompt.md`
- `stories/ProductMeter.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Meter prompt contract: `components/status/Meter.prompt.md`
- Storybook implementation evidence: `stories/ProductMeter.stories.jsx`
