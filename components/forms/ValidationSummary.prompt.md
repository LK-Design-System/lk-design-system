**ValidationSummary**는 제출을 막는 form-level 오류를 요약하고 원래 field 또는 field group으로 돌아가는 경로를 제공합니다. LDS Product extension이며 WDS component parity를 주장하지 않습니다.

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

## Content and severity contract

- Error Summary의 주 대상은 사용자가 현재 form에서 수정할 수 있고 저장·제출을 막는 `error`입니다. 서비스 장애, 권한 부족처럼 form 값을 고쳐 해결할 수 없는 문제는 `Callout`, `Banner`, 또는 해당 product error surface를 사용합니다.
- `warning`은 이미 발생한 오류가 아니라 앞으로 문제가 될 가능성이나 검토 필요 상태입니다. 오류와 같은 목록에 교차 배치하지 않고 별도 warning 구역으로 분리하며, warning-only 상태는 저장을 막지 않는다는 설명과 cautionary tone을 사용합니다.
- mixed 상태는 오류를 먼저, warning을 나중에 표시합니다. Error Summary의 제목과 blocking 설명은 error count를 기준으로 하고 warning count를 오류처럼 합산하지 않습니다.
- 각 issue의 `message`는 사용자가 무엇을 고쳐야 하는지 직접 말하는 짧은 문장이어야 합니다. 같은 문장을 해당 field의 inline error에도 그대로 사용해 summary와 field가 다르게 말하지 않게 합니다.
- valid 상태는 오류 요약이 아니라 완료 확인입니다. 지속적인 성공 banner로 확대하지 않고 다음 행동 가능 여부를 짧게 확인합니다.

## Link, focus, and announcement contract

- `href`는 issue를 소유한 실제 field, 첫 radio/checkbox, 또는 field group의 focus target을 가리킵니다. 오류 문장 자체가 링크가 되어야 하며 반복되는 generic `이동` 링크를 주 정보로 사용하지 않습니다.
- client-side navigation이 필요하면 `onIssueActivate(issue)`를 사용하고 제품이 같은 focus target으로 이동시킵니다. 복합 label이나 별도 action 이름이 필요한 호환 사례에는 `actionAriaLabel`을 제공합니다.
- 실패한 submit 뒤에는 제품이 summary로 keyboard focus를 이동시켜야 합니다. 사용자가 issue link를 선택하면 제품은 연결된 field로 focus와 scroll을 이동합니다. 컴포넌트는 임의의 field를 추론하거나 mount 시 자동 focus하지 않습니다.
- `announce`는 submit 결과처럼 새로 나타난 결과를 알릴 때만 사용합니다. Error Summary는 assertive alert, warning-only와 valid 결과는 polite status이지만, live announcement가 위 focus 이동 계약을 대체하지 않습니다.
- summary link의 focus indicator와 문장 전체는 좁은 폭에서도 보여야 합니다. 아이콘만 남기거나 action label을 시각적으로 숨겨 목적을 모호하게 만들지 않습니다.

## LDS visual adaptation

- 공식 Error Summary가 icon을 요구하는 것은 아닙니다. LDS는 빠른 severity 식별을 위해 error summary와 warning 구역 heading에 공통 `Icon` registry와 `statusToneStyle`의 leading icon을 한 번씩 사용하는 Product extension을 허용합니다.
- issue마다 큰 원형 status icon을 반복하거나 새 전용 glyph를 만들지 않습니다. 색만으로 의미를 전달하지 않도록 section heading의 icon, 명시적인 오류·주의 문구, count를 함께 사용합니다.
- GOV.UK Error Summary의 두꺼운 error border는 LDS에서 `statusToneStyle`의 hairline `border`와 `surface` 토큰으로 번역합니다. 카드 외곽선은 최고 심각도(error 우선)의 status border를, 각 severity 구역 heading band는 해당 tone의 surface/border를 사용해 카드 레벨에서 상태가 먼저 읽히게 합니다.
- issue 목록 본문은 중립 목록 surface와 divider를 유지합니다. error와 warning을 각각 중첩 카드나 여러 개의 Callout으로 만들지 않습니다.
- summary는 form 컬럼 폭 안에서 사용합니다(권장 max-width 640px 수준). 항목이 두 줄 텍스트뿐인 요약을 전폭 컨테이너에 늘어놓지 않습니다.
- `description`은 결과와 다음 행동만 말합니다. severity 구역 heading이 이미 count를 표시하므로 description에 오류·주의 개수를 반복하지 않습니다.

## External research basis

- [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/)는 form-level summary와 field inline error를 함께 제공하고 같은 오류 문장을 원래 질문으로 연결하며 submit 후 summary로 focus를 이동합니다.
- [PatternFly Form](https://www.patternfly.org/components/forms/form/design-guidelines/)은 submit validation에서 form 상단 summary를 field-level error의 보조 수단으로 사용합니다.
- [PatternFly Alert](https://www.patternfly.org/components/alert/design-guidelines/)은 여러 severity가 있을 때 가장 심각한 문제부터 배치합니다.
- [Atlassian Error messages](https://atlassian.design/foundations/content/designing-messages/error-messages)는 이미 발생한 error와 미래 문제를 예고하는 warning을 구분합니다.
- [WCAG 2.2 Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html)은 focus를 강제로 옮기지 않아도 새 결과를 알리는 live status 요구를 설명합니다.
