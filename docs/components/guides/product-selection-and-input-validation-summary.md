# Validation Summary

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `ValidationSummary` |
| Storybook | `LDS Product/Selection and Input/Validation Summary` |
| Source | `../component-content.json#product-selection-and-input-validation-summary` |

긴 폼을 제출한 뒤 여러 오류를 우선순위대로 고치게 할 때 적합합니다. 각 요약 문장은 같은 inline error를 가진 실제 field로 연결되어야 하며, 차단 오류가 없는 주의·성공 결과에는 Callout 또는 Notification을 사용하세요.

## 사용 판단

### 사용

- 공식 Error Summary가 icon을 요구하는 것은 아닙니다. LDS는 빠른 severity 식별을 위해 error summary와 warning 구역 heading에 공통 Icon registry와 statusToneStyle의 leading icon을 한 번씩 사용하는 Product extension을 허용합니다.
- PatternFly Form은 submit validation에서 form 상단 summary를 field-level error의 보조 수단으로 사용합니다.

### 사용하지 않음

- WAI-ARIA Alert Pattern은 alert가 keyboard focus 자체를 이동시키지 않아야 한다고 설명합니다. 따라서 focus-led summary와 live count announcement를 기본적으로 중복하지 않습니다.
- ValidationSummary는 제출을 막는 form-level 오류를 요약하고 원래 field 또는 field group으로 돌아가는 경로를 제공합니다. LDS Product extension이며 WDS component parity를 주장하지 않습니다. 차단 오류가 하나도 없으면 렌더하지 않으며, warning-only와 성공 확인은 Callout 또는 Notification이 소유합니다.

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `title` | `React.ReactNode` | No |  |
| `headingLevel` | `2 \| 3 \| 4 \| 5 \| 6` | No |  |
| `description` | `React.ReactNode` | No |  |
| `issues` | `ValidationIssue[]` | Yes | 하나 이상의 blocking error와 선택적인 field-linked warning. error가 없으면 컴포넌트는 렌더되지 않습니다. |
| `onIssueActivate` | `( issue: ValidationIssue, event: React.MouseEvent, ) = void` | No | SPA가 anchor 이동을 가로채 실제 field/step에 focus와 scroll을 적용할 때 사용합니다. event.preventDefault()는 대체 focus 이동을 실제로 수행하는 경우에만 호출하세요. |
| `announce` | `boolean` | No | 짧은 오류 개수만 assertive하게 공지합니다. submit 후 summary로 focus를 이동하는 흐름과 동시에 사용하지 않는 것을 권장합니다. |
| `tabIndex` | `number` | No | 기본값은 -1이며 submit 실패 뒤 ref를 통해 summary로 focus를 이동할 수 있습니다. |

## Behavior and interaction

- Error Summary의 주 대상은 사용자가 현재 form에서 수정할 수 있고 저장·제출을 막는 error입니다. 서비스 장애, 권한 부족처럼 form 값을 고쳐 해결할 수 없는 문제는 Callout, Banner, 또는 해당 product error surface를 사용합니다.
- warning은 이미 발생한 오류가 아니라 앞으로 문제가 될 가능성이나 검토 필요 상태입니다. 같은 submit에서 사용자가 고칠 수 있고 실제 field 복귀 경로가 있을 때만 차단 오류 뒤의 별도 warning 구역에 둡니다. warning-only 결과는 Callout tone="cautionary" 또는 Notification을 사용합니다.
- valid 상태에서는 ValidationSummary를 unmount합니다. 저장·제출 완료를 별도로 확인해야 하면 Notification tone="positive" 또는 완료 surface를 사용합니다.
- GOV.UK Error Summary의 두꺼운 error border는 LDS에서 statusToneStyle의 hairline border와 surface 토큰으로 번역합니다. 카드 외곽선은 최고 심각도(error 우선)의 status border를, 각 severity 구역 heading band는 해당 tone의 surface/border를 사용해 카드 레벨에서 상태가 먼저 읽히게 합니다.
- GOV.UK Error summary는 form-level summary와 field inline error를 함께 제공하고 같은 오류 문장을 원래 질문으로 연결하며 submit 후 summary로 focus를 이동합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | root는 기본 tabIndex={-1}이고 visible description을 aria-describedby로 연결합니다. submit 실패 뒤 제품이 ref로 focus를 옮기면 제목과 다음 행동 설명을 함께 인지할 수 있습니다. |
| 명시 규칙 2 | severity heading band는 status-presentation.js의 embeddedBandStyle을 소비합니다 — Banner variant="embedded"와 동일한 패널 결합형 밴드 문법(상·하단 tone hairline 유지, 좌우 테두리·radius 제거; Primer Banner flush와 동형: border-left/right: none; border-radius: 0)입니다. |
| 명시 규칙 3 | summary는 form 컬럼 폭 안에서 사용합니다(권장 max-width 640px 수준). 항목이 두 줄 텍스트뿐인 요약을 전폭 컨테이너에 늘어놓지 않습니다. |
| 명시 규칙 4 | source pin과 workflow 판정의 authority는 docs/references/product-frontends/COVERAGEAUDIT.json의 WF-03/WF-04/WF-05/WF-13입니다. 이번 변경은 기존 coverage classification을 넓히지 않고 실제 field return path만 강화합니다. |
| --body1-line | {"fontSize":"16px","lineHeight":"24px","letterSpacing":"0.0057em"} |

## Content and writing

- mixed 상태는 오류를 먼저, warning을 나중에 표시합니다. Error Summary의 제목과 blocking 설명은 error count를 기준으로 하고 warning count를 오류처럼 합산하지 않습니다. 입력 배열이 warning만 포함하면 ValidationSummary는 렌더하지 않습니다.
- 각 issue의 message는 사용자가 무엇을 고쳐야 하는지 직접 말하는 짧은 문장이어야 합니다. 같은 문장을 해당 field의 inline error에도 그대로 사용해 summary와 field가 다르게 말하지 않게 합니다.
- field에는 같은 message, aria-invalid="true", 그 메시지를 가리키는 aria-describedby가 함께 있어야 합니다. summary만으로 field-level validation을 대체하지 않습니다.
- issue마다 큰 원형 status icon을 반복하거나 새 전용 glyph를 만들지 않습니다. 색만으로 의미를 전달하지 않도록 section heading의 icon, 명시적인 오류·주의 문구, count를 함께 사용합니다.

## Accessibility

- 모든 issue의 href는 필수이며 실제 field, 첫 radio/checkbox, 또는 field group의 focus target을 가리킵니다. 오류 문장 자체가 native anchor가 되어야 하며 반복되는 generic 이동 링크를 주 정보로 사용하지 않습니다.
- client-side navigation이 필요하면 onIssueActivate(issue, event)를 사용하고 제품이 같은 target으로 focus와 scroll을 이동시킵니다. 대체 focus 이동을 실제로 수행할 때만 event.preventDefault()를 호출해 anchor fallback을 보존합니다.
- action의 accessible name은 기본적으로 label: message로 만들어 link 목록이나 control 탐색에서도 목적지가 독립적으로 이해되게 합니다. message가 이미 label을 포함하면 반복하지 않습니다. 복합 ReactNode처럼 평문을 만들 수 없을 때는 actionAriaLabel을 명시합니다.
- 실패한 submit 뒤에는 제품이 summary로 keyboard focus를 이동시켜야 합니다. 사용자가 issue link를 선택하면 제품은 연결된 field로 focus와 scroll을 이동합니다. 컴포넌트는 임의의 field를 추론하거나 mount 시 자동 focus하지 않습니다.
- announce는 focus를 그대로 둔 채 동적으로 갱신된 오류 개수만 알려야 할 때 사용하는 opt-in assertive alert입니다. submit 뒤 summary로 focus를 이동하는 일반 흐름에서는 announce={false}를 유지해 같은 결과가 두 번 낭독되지 않게 합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Input` | 대표 시나리오에서 조합 |
| `ColorSwatch` | 대표 시나리오에서 조합 |
| `DatePicker` | 대표 시나리오에서 조합 |
| `DateRangeField` | 대표 시나리오에서 조합 |
| `FileUpload` | 대표 시나리오에서 조합 |
| `FileUploadQueue` | 대표 시나리오에서 조합 |
| `IconPicker` | 대표 시나리오에서 조합 |
| `NumberField` | 대표 시나리오에서 조합 |

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
      href: '#evidence-upload-field',
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
- `--font-sans`
- `--fw-bold`
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

## Sources

- ValidationSummary prompt contract: `components/forms/ValidationSummary.prompt.md`
- Storybook implementation evidence: `stories/FormValidationSummary.stories.jsx`
- [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/)
- [NHS Error message](https://service-manual.nhs.uk/design-system/components/error-message)
- [PatternFly Form](https://www.patternfly.org/components/forms/form/design-guidelines/)
- [PatternFly Alert](https://www.patternfly.org/components/alert/design-guidelines/)
- [Atlassian Error messages](https://atlassian.design/foundations/content/designing-messages/error-messages)
- [W3C ARIA21](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21)
- [WAI-ARIA Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
