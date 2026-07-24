# Validation Summary

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `ValidationSummary` |
| Storybook | `LDS Product/Selection and Input/Validation Summary` |
| Source | `../component-content.json#product-selection-and-input-validation-summary` |

긴 폼을 제출한 뒤 여러 오류·주의를 우선순위대로 고치게 할 때 적합합니다. 필드 하나의 즉시 오류에는 Validation Summary를 추가하지 말고 해당 필드의 inline error를 사용하세요.

## 사용 판단

### 사용

- 긴 폼을 제출한 뒤 여러 오류·주의를 우선순위대로 고치게 할 때 적합합니다. 필드 하나의 즉시 오류에는 Validation Summary를 추가하지 말고 해당 필드의 inline error를 사용하세요.
- Error Summary의 주 대상은 사용자가 현재 form에서 수정할 수 있고 저장·제출을 막는 error입니다. 서비스 장애, 권한 부족처럼 form 값을 고쳐 해결할 수 없는 문제는 Callout, Banner, 또는 해당 product error surface를 사용합니다.
- client-side navigation이 필요하면 onIssueActivate(issue)를 사용하고 제품이 같은 focus target으로 이동시킵니다. 복합 label이나 별도 action 이름이 필요한 호환 사례에는 actionAriaLabel을 제공합니다.
- Validation Summary가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- warning은 이미 발생한 오류가 아니라 앞으로 문제가 될 가능성이나 검토 필요 상태입니다. 오류와 같은 목록에 교차 배치하지 않고 별도 warning 구역으로 분리하며, warning-only 상태는 저장을 막지 않는다는 설명과 cautionary tone을 사용합니다.
- mixed 상태는 오류를 먼저, warning을 나중에 표시합니다. Error Summary의 제목과 blocking 설명은 error count를 기준으로 하고 warning count를 오류처럼 합산하지 않습니다.
- 각 issue의 message는 사용자가 무엇을 고쳐야 하는지 직접 말하는 짧은 문장이어야 합니다. 같은 문장을 해당 field의 inline error에도 그대로 사용해 summary와 field가 다르게 말하지 않게 합니다.
- valid 상태는 오류 요약이 아니라 완료 확인입니다. 지속적인 성공 banner로 확대하지 않고 다음 행동 가능 여부를 짧게 확인합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | ValidationSummary의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Title | title 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Description | description 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Action Label | actionLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | No | 공개 타입 계약에 정의된 속성입니다. |
| `description` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `issues` | `ValidationIssue[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `emptyMessage` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onIssueActivate` | `(issue: ValidationIssue) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `actionLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `announce` | `boolean` | No | Announces only the short aggregate result, not the interactive summary body. |
| `tabIndex` | `number` | No | Defaults to -1 when at least one error exists so submit handlers can focus the summary. |

## States

| State | Contract |
| --- | --- |
| emptyMessage | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| 변형·상태 · 오류 전용 요약 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 상호작용 · 오류 링크와 키보드 초점 | interaction 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |
| 반응형 · 좁은 폭과 긴 문구 | responsive 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Error Summary의 주 대상은 사용자가 현재 form에서 수정할 수 있고 저장·제출을 막는 error입니다. 서비스 장애, 권한 부족처럼 form 값을 고쳐 해결할 수 없는 문제는 Callout, Banner, 또는 해당 product error surface를 사용합니다.
- warning은 이미 발생한 오류가 아니라 앞으로 문제가 될 가능성이나 검토 필요 상태입니다. 오류와 같은 목록에 교차 배치하지 않고 별도 warning 구역으로 분리하며, warning-only 상태는 저장을 막지 않는다는 설명과 cautionary tone을 사용합니다.
- mixed 상태는 오류를 먼저, warning을 나중에 표시합니다. Error Summary의 제목과 blocking 설명은 error count를 기준으로 하고 warning count를 오류처럼 합산하지 않습니다.
- valid 상태는 오류 요약이 아니라 완료 확인입니다. 지속적인 성공 banner로 확대하지 않고 다음 행동 가능 여부를 짧게 확인합니다.
- href는 issue를 소유한 실제 field, 첫 radio/checkbox, 또는 field group의 focus target을 가리킵니다. 오류 문장 자체가 링크가 되어야 하며 반복되는 generic 이동 링크를 주 정보로 사용하지 않습니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | root의 tabIndex는 오류가 하나라도 있을 때만 -1로 자동 설정됩니다. warning-only 요약처럼 저장을 막지 않는 결과는 기본적으로 Tab 순서에도, 프로그래밍 focus 대상에도 들어가지 않습니다. warning 결과에도 submit 후 focus를 옮겨야 하는 흐름이라면 제품이 tabIndex={-1}을 명시적으로 넘겨 ref focus 대상을 만드세요 — 불필요한 focus 이동을 기본값으로 만들지 않기 위한 opt-in입니다. |
| 명시 규칙 2 | severity heading band는 status-presentation.js의 embeddedBandStyle을 소비합니다 — Banner variant="embedded"와 동일한 패널 결합형 밴드 문법(상·하단 tone hairline 유지, 좌우 테두리·radius 제거; Primer Banner flush와 동형: border-left/right: none; border-radius: 0)입니다. 밴드가 자기 상·하단 hairline을 소유하므로 밴드와 맞닿는 중립 구분선(header 하단선, 그룹 간 구분선)은 그 자리에서 생략해 1px 선이 겹치지… |
| 명시 규칙 3 | summary는 form 컬럼 폭 안에서 사용합니다(권장 max-width 640px 수준). 항목이 두 줄 텍스트뿐인 요약을 전폭 컨테이너에 늘어놓지 않습니다. |
| 명시 규칙 4 | WCAG 2.2 Status Messages은 focus를 강제로 옮기지 않아도 새 결과를 알리는 live status 요구를 설명합니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Responsive

- summary link의 focus indicator와 문장 전체는 좁은 폭에서도 보여야 합니다. 아이콘만 남기거나 action label을 시각적으로 숨겨 목적을 모호하게 만들지 않습니다.
- summary는 form 컬럼 폭 안에서 사용합니다(권장 max-width 640px 수준). 항목이 두 줄 텍스트뿐인 요약을 전폭 컨테이너에 늘어놓지 않습니다.
- - href는 issue를 소유한 실제 field, 첫 radio/checkbox, 또는 field group의 focus target을 가리킵니다. 오류 문장 자체가 링크가 되어야 하며 반복되는 generic 이동 링크를 주 정보로 사용하지 않습니다. - client-side navigation이 필요하면 onIssueActivate(issue)를 사용하고 제품이 같은 focus target으로 이동시킵니다. 복합 label이나 별도 action 이름이 필요한 호환 사례에는 actionAriaLabel을 제공합니다. - 실패한 submit 뒤에는 제품이 summa….
- - 공식 Error Summary가 icon을 요구하는 것은 아닙니다. LDS는 빠른 severity 식별을 위해 error summary와 warning 구역 heading에 공통 Icon registry와 statusToneStyle의 leading icon을 한 번씩 사용하는 Product extension을 허용합니다. - issue마다 큰 원형 status icon을 반복하거나 새 전용 glyph를 만들지 않습니다. 색만으로 의미를 전달하지 않도록 section heading의 icon, 명시적인 오류·주의 문구, count를 함께 사용합니다. - GOV.….

## Content and writing

- warning은 이미 발생한 오류가 아니라 앞으로 문제가 될 가능성이나 검토 필요 상태입니다. 오류와 같은 목록에 교차 배치하지 않고 별도 warning 구역으로 분리하며, warning-only 상태는 저장을 막지 않는다는 설명과 cautionary tone을 사용합니다.
- mixed 상태는 오류를 먼저, warning을 나중에 표시합니다. Error Summary의 제목과 blocking 설명은 error count를 기준으로 하고 warning count를 오류처럼 합산하지 않습니다.
- 각 issue의 message는 사용자가 무엇을 고쳐야 하는지 직접 말하는 짧은 문장이어야 합니다. 같은 문장을 해당 field의 inline error에도 그대로 사용해 summary와 field가 다르게 말하지 않게 합니다.
- client-side navigation이 필요하면 onIssueActivate(issue)를 사용하고 제품이 같은 focus target으로 이동시킵니다. 복합 label이나 별도 action 이름이 필요한 호환 사례에는 actionAriaLabel을 제공합니다.

## Accessibility

- href는 issue를 소유한 실제 field, 첫 radio/checkbox, 또는 field group의 focus target을 가리킵니다. 오류 문장 자체가 링크가 되어야 하며 반복되는 generic 이동 링크를 주 정보로 사용하지 않습니다.
- client-side navigation이 필요하면 onIssueActivate(issue)를 사용하고 제품이 같은 focus target으로 이동시킵니다. 복합 label이나 별도 action 이름이 필요한 호환 사례에는 actionAriaLabel을 제공합니다.
- 실패한 submit 뒤에는 제품이 summary로 keyboard focus를 이동시켜야 합니다. 사용자가 issue link를 선택하면 제품은 연결된 field로 focus와 scroll을 이동합니다. 컴포넌트는 임의의 field를 추론하거나 mount 시 자동 focus하지 않습니다.
- root의 tabIndex는 오류가 하나라도 있을 때만 -1로 자동 설정됩니다. warning-only 요약처럼 저장을 막지 않는 결과는 기본적으로 Tab 순서에도, 프로그래밍 focus 대상에도 들어가지 않습니다. warning 결과에도 submit 후 focus를 옮겨야 하는 흐름이라면 제품이 tabIndex={-1}을 명시적으로 넘겨 ref focus 대상을 만드세요 — 불필요한 focus 이동을 기본값으로 만들지 않기 위한 opt-in입니다.
- announce는 submit 결과처럼 새로 나타난 결과를 알릴 때만 사용합니다. Error Summary는 assertive alert, warning-only와 valid 결과는 polite status이지만, live announcement가 위 focus 이동 계약을 대체하지 않습니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Error Summary의 주 대상은 사용자가 현재 form에서 수정할 수 있고 저장·제출을 막는 error입니다. 서비스 장애, 권한 부족처럼 form 값을 고쳐 해결할 수 없는 문제는 Callout, Banner, 또는 해당 product error surface를 사용합니다. |
| Don't | warning은 이미 발생한 오류가 아니라 앞으로 문제가 될 가능성이나 검토 필요 상태입니다. 오류와 같은 목록에 교차 배치하지 않고 별도 warning 구역으로 분리하며, warning-only 상태는 저장을 막지 않는다는 설명과 cautionary tone을 사용합니다. |
| Do | client-side navigation이 필요하면 onIssueActivate(issue)를 사용하고 제품이 같은 focus target으로 이동시킵니다. 복합 label이나 별도 action 이름이 필요한 호환 사례에는 actionAriaLabel을 제공합니다. |
| Don't | mixed 상태는 오류를 먼저, warning을 나중에 표시합니다. Error Summary의 제목과 blocking 설명은 error count를 기준으로 하고 warning count를 오류처럼 합산하지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 ValidationSummary의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `ColorSwatch` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DatePicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `DateRangeField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUpload` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FileUploadQueue` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `IconPicker` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `NumberField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `PinInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<ValidationSummary
  title="저장할 수 없습니다"
  description="아래 오류를 수정한 뒤 다시 저장하세요."
  issues={[
    {
      id: 'upload-target',
      label: 'Evidence 업로드',
      message: '업로드할 collection을 선택하세요.',
      severity: 'error',
      href: '#step-upload-target',
    },
  ]}
/>
```

## Tokens and API

### Tokens

- `--body1-line`
- `--body1-size`
- `--body1-spacing`
- `--caption1-line`
- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-label-strong`
- `--color-semantic-line-normal-alternative`
- `--color-semantic-line-normal-normal`
- `--font-sans`
- `--fw-bold`
- `--fw-medium`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--label1-spacing`
- `--radius-lg`
- `--space-1`
- `--space-2`
- `--space-3`
- `--space-4`

### Source contracts

- `components/forms/ValidationSummary.jsx`
- `components/forms/ValidationSummary.d.ts`
- `components/forms/ValidationSummary.prompt.md`
- `stories/FormValidationSummary.stories.jsx`

## Migration

- client-side navigation이 필요하면 onIssueActivate(issue)를 사용하고 제품이 같은 focus target으로 이동시킵니다. 복합 label이나 별도 action 이름이 필요한 호환 사례에는 actionAriaLabel을 제공합니다.
- - href는 issue를 소유한 실제 field, 첫 radio/checkbox, 또는 field group의 focus target을 가리킵니다. 오류 문장 자체가 링크가 되어야 하며 반복되는 generic 이동 링크를 주 정보로 사용하지 않습니다. - client-side navigation이 필요하면 onIssueActivate(issue)를 사용하고 제품이 같은 focus target으로 이동시킵니다. 복합 label이나 별도 action 이름이 필요한 호환 사례에는 actionAriaLabel을 제공합니다. - 실패한 submit 뒤에는 제품이 summa….
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- ValidationSummary prompt contract: `components/forms/ValidationSummary.prompt.md`
- Storybook implementation evidence: `stories/FormValidationSummary.stories.jsx`
- [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/)
- [PatternFly Form](https://www.patternfly.org/components/forms/form/design-guidelines/)
- [PatternFly Alert](https://www.patternfly.org/components/alert/design-guidelines/)
- [Atlassian Error messages](https://atlassian.design/foundations/content/designing-messages/error-messages)
- [WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)
