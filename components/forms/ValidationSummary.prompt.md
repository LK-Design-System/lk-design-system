**ValidationSummary**는 제출을 막는 form-level 오류를 요약하고 원래 field 또는 field group으로 돌아가는 경로를 제공합니다. LDS Product extension이며 WDS component parity를 주장하지 않습니다. 차단 오류가 하나도 없으면 렌더하지 않으며, warning-only와 성공 확인은 `Callout` 또는 `Notification`이 소유합니다.

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

## Content and severity contract

- Error Summary의 주 대상은 사용자가 현재 form에서 수정할 수 있고 저장·제출을 막는 `error`입니다. 서비스 장애, 권한 부족처럼 form 값을 고쳐 해결할 수 없는 문제는 `Callout`, `Banner`, 또는 해당 product error surface를 사용합니다.
- `warning`은 이미 발생한 오류가 아니라 앞으로 문제가 될 가능성이나 검토 필요 상태입니다. 같은 submit에서 사용자가 고칠 수 있고 실제 field 복귀 경로가 있을 때만 차단 오류 뒤의 별도 warning 구역에 둡니다. warning-only 결과는 `Callout tone="cautionary"` 또는 `Notification`을 사용합니다.
- mixed 상태는 오류를 먼저, warning을 나중에 표시합니다. Error Summary의 제목과 blocking 설명은 error count를 기준으로 하고 warning count를 오류처럼 합산하지 않습니다. 입력 배열이 warning만 포함하면 ValidationSummary는 렌더하지 않습니다.
- 각 issue의 `message`는 사용자가 무엇을 고쳐야 하는지 직접 말하는 짧은 문장이어야 합니다. 같은 문장을 해당 field의 inline error에도 그대로 사용해 summary와 field가 다르게 말하지 않게 합니다.
- valid 상태에서는 ValidationSummary를 unmount합니다. 저장·제출 완료를 별도로 확인해야 하면 `Notification tone="positive"` 또는 완료 surface를 사용합니다.

## Link, focus, and announcement contract

- 모든 issue의 `href`는 필수이며 실제 field, 첫 radio/checkbox, 또는 field group의 focus target을 가리킵니다. 오류 문장 자체가 native anchor가 되어야 하며 반복되는 generic `이동` 링크를 주 정보로 사용하지 않습니다.
- client-side navigation이 필요하면 `onIssueActivate(issue, event)`를 사용하고 제품이 같은 target으로 focus와 scroll을 이동시킵니다. 대체 focus 이동을 실제로 수행할 때만 `event.preventDefault()`를 호출해 anchor fallback을 보존합니다.
- action의 accessible name은 기본적으로 `label: message`로 만들어 link 목록이나 control 탐색에서도 목적지가 독립적으로 이해되게 합니다. `message`가 이미 label을 포함하면 반복하지 않습니다. 복합 ReactNode처럼 평문을 만들 수 없을 때는 `actionAriaLabel`을 명시합니다.
- 실패한 submit 뒤에는 제품이 summary로 keyboard focus를 이동시켜야 합니다. 사용자가 issue link를 선택하면 제품은 연결된 field로 focus와 scroll을 이동합니다. 컴포넌트는 임의의 field를 추론하거나 mount 시 자동 focus하지 않습니다.
- root는 기본 `tabIndex={-1}`이고 visible description을 `aria-describedby`로 연결합니다. submit 실패 뒤 제품이 ref로 focus를 옮기면 제목과 다음 행동 설명을 함께 인지할 수 있습니다.
- `announce`는 focus를 그대로 둔 채 동적으로 갱신된 오류 개수만 알려야 할 때 사용하는 opt-in assertive alert입니다. submit 뒤 summary로 focus를 이동하는 일반 흐름에서는 `announce={false}`를 유지해 같은 결과가 두 번 낭독되지 않게 합니다.
- summary link의 focus indicator와 문장 전체는 좁은 폭에서도 보여야 합니다. 아이콘만 남기거나 action label을 시각적으로 숨겨 목적을 모호하게 만들지 않습니다.
- field에는 같은 `message`, `aria-invalid="true"`, 그 메시지를 가리키는 `aria-describedby`가 함께 있어야 합니다. summary만으로 field-level validation을 대체하지 않습니다.

## LDS visual adaptation

- 공식 Error Summary가 icon을 요구하는 것은 아닙니다. LDS는 빠른 severity 식별을 위해 error summary와 warning 구역 heading에 공통 `Icon` registry와 `statusToneStyle`의 leading icon을 한 번씩 사용하는 Product extension을 허용합니다.
- issue마다 큰 원형 status icon을 반복하거나 새 전용 glyph를 만들지 않습니다. 색만으로 의미를 전달하지 않도록 section heading의 icon, 명시적인 오류·주의 문구, count를 함께 사용합니다.
- GOV.UK Error Summary의 두꺼운 error border는 LDS에서 `statusToneStyle`의 hairline `border`와 `surface` 토큰으로 번역합니다. 카드 외곽선은 최고 심각도(error 우선)의 status border를, 각 severity 구역 heading band는 해당 tone의 surface/border를 사용해 카드 레벨에서 상태가 먼저 읽히게 합니다.
- severity heading band는 `status-presentation.js`의 `embeddedBandStyle`을 소비합니다 — Banner `variant="embedded"`와 동일한 패널 결합형 밴드 문법(상·하단 tone hairline 유지, 좌우 테두리·radius 제거; Primer Banner `flush`와 동형: `border-left/right: none; border-radius: 0`)입니다. 밴드가 자기 상·하단 hairline을 소유하므로 밴드와 맞닿는 중립 구분선(header 하단선, 그룹 간 구분선)은 그 자리에서 생략해 1px 선이 겹치지 않게 합니다.
- issue 목록 본문은 중립 목록 surface와 divider를 유지합니다. error와 warning을 각각 중첩 카드나 여러 개의 Callout으로 만들지 않습니다.
- summary는 form 컬럼 폭 안에서 사용합니다(권장 max-width 640px 수준). 항목이 두 줄 텍스트뿐인 요약을 전폭 컨테이너에 늘어놓지 않습니다.
- `description`은 결과와 다음 행동만 말합니다. severity 구역 heading이 이미 count를 표시하므로 description에 오류·주의 개수를 반복하지 않습니다.

## Product workflow coverage

- **LK Web Viz** — `not applicable`. pinned source `LK-ROBOTICS/lk_web_viz@a984def117c05acd213f494cbb8a42e990595505`의 현재 canvas/editor workflow에는 form-level validation summary 소비 근거가 없습니다. 지도·편집기 상태를 오류 요약으로 재분류하지 않습니다.
- **LK Control Full Daedeok** — `supported by composition`. pinned source `LK-ROBOTICS/lkrobotics-control-full-daedeok@93802fc2aa5d29f930380ae58d51dcb68322b5e7`의 command modal, procedure 관리 화면, schedule form에서 blocking validation을 field controls와 함께 조합할 수 있습니다. eligibility, command schema, persistence와 실행은 제품 소유입니다.
- **LK Context Hub** — `supported by composition`. pinned source `LK-ROBOTICS/lk_context_hub@de124084b7e50049350a46f92c4ea4476269c58c`의 Scope Manager에서 staged scope 변경의 field-level validation과 함께 사용할 수 있습니다. scope schema, mutation과 business validation은 제품 소유입니다.
- source pin과 workflow 판정의 authority는 `docs/references/product-frontends/COVERAGE_AUDIT.json`의 WF-03/WF-04/WF-05/WF-13입니다. 이번 변경은 기존 coverage classification을 넓히지 않고 실제 field return path만 강화합니다.

## External research basis

- [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/)는 form-level summary와 field inline error를 함께 제공하고 같은 오류 문장을 원래 질문으로 연결하며 submit 후 summary로 focus를 이동합니다.
- [NHS Error message](https://service-manual.nhs.uk/design-system/components/error-message)는 각 오류를 page 상단 summary와 field 옆에 함께 두고 summary link가 관련 field로 focus를 옮기게 합니다.
- [PatternFly Form](https://www.patternfly.org/components/forms/form/design-guidelines/)은 submit validation에서 form 상단 summary를 field-level error의 보조 수단으로 사용합니다.
- [PatternFly Alert](https://www.patternfly.org/components/alert/design-guidelines/)은 여러 severity가 있을 때 가장 심각한 문제부터 배치합니다.
- [Atlassian Error messages](https://atlassian.design/foundations/content/designing-messages/error-messages)는 이미 발생한 error와 미래 문제를 예고하는 warning을 구분합니다.
- [W3C ARIA21](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21)는 field의 `aria-invalid`와 오류 메시지 `aria-describedby` 연결을 설명합니다.
- [WAI-ARIA Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)은 alert가 keyboard focus 자체를 이동시키지 않아야 한다고 설명합니다. 따라서 focus-led summary와 live count announcement를 기본적으로 중복하지 않습니다.
