**DatePicker** — `Calendar` 팝오버를 여는 날짜 필드.

```jsx
<DatePicker placeholder="실사 희망일" onChange={setDate} />
<DatePicker defaultValue="2026-07-03" />
```

- **value / defaultValue / onChange(date)** — 제어/비제어(Date, ISO 문자열 또는 빈 값). **disabled / aria-label** — trigger 상태와 accessible name. 선택 값은 trigger 이름에도 포함됩니다. 바깥 클릭·선택·Escape 시 닫히며 선택 뒤 trigger로 focus가 돌아옵니다.
- **isDateDisabled(date) / minDate / maxDate** — 예약 불가일·휴무일·범위 밖 날짜를 선택 불가로 표시합니다. Calendar 팝오버로 그대로 전달되어 비활성 날짜는 흐리게·취소선으로 표시되고 선택만 차단됩니다(포커스 이동은 허용). 실사 희망일·예약 가능일 흐름에서 특정 날짜를 막는 용도입니다.
- **full** — 날짜 범위나 툴바처럼 부모 폭에 맞춰야 하는 조합에서 trigger의 고정 최소 폭을 제거하고 가용 폭을 채웁니다.
- **invalid** — 상위 폼이나 `DateRangeField`가 판정한 검증 실패를 trigger에 싣습니다. Input·Select·Textarea와 같은 우선순위로 negative border를 적용하고 `aria-invalid`를 trigger button(=초점 요소)에 붙입니다. 오류 문구 자체는 소유하지 않으므로 상위가 `aria-describedby`로 메시지 id를 전달하면 그대로 trigger에 연결됩니다. `role="group"`은 ARIA 1.2에서 `aria-invalid`를 지원하지 않으므로 group이 아니라 이 필드가 오류를 전달합니다.
- trigger는 `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`로 Calendar popup과 연결하고 LDS Input focus ring을 사용합니다.
- Calendar popup의 월 탐색은 Calendar 계약을 그대로 상속합니다. 값이 있어도 이전/다음 달, PageUp/PageDown, Shift+PageUp/PageDown이 정상 동작합니다.
- calendar affordance는 공통 `Icon` registry를 사용하며 trigger의 accessible name과 중복되지 않도록 장식적으로 숨깁니다.

## External research basis

- [WAI-ARIA Date Picker Dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)의 popup naming, 초기 날짜 focus, Escape, 선택 후 focus return 계약을 따릅니다.
- [WAI-ARIA Dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)을 기준으로 Calendar popup을 이름 있는 dialog로 노출합니다. 완전한 modal focus trap은 사용하지 않는 non-modal field popup이며, 대신 초점이 필드 밖으로 나가면 popup을 닫아 열린 dialog가 잔류하지 않게 합니다(창 전환처럼 relatedTarget이 없는 blur는 제외).

## Portal popup(2026-10-15)

Calendar popup은 Core Popover의 owner-document Portal·위치 flip/clamp·outside/Escape·focus 엔진을 재사용합니다. 부모 툴바나 컨테이너의 overflow:hidden에 잘리지 않도록 inline absolute panel을 제거했습니다. Calendar가 단일 border/radius/padding을 소유하고 Popover panel은 겹치는 border/padding을 제거합니다. normal 폭은 기존 Calendar의334px 외곽 폭, narrow에서는 viewport 안으로 줄어듭니다. 기존 value/onChange(Date), disabled, min/max/isDateDisabled, invalid, 이름, 선택/Escape focus 복원, Tab-out 닫기 계약은 유지합니다. Portal 내부 focus는 trigger의 DOM 바깥이므로 Calendar 내부 이동을 외부 blur로 오인하지 않습니다. 새 공개 prop이나 consumer private CSS override는 없습니다.

[W3C picker dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)의 이름·선택·Escape 복귀와 [React Aria Popover](https://react-aria.adobe.com/Popover)의 Portal/positioning 경계 분리를 참고했습니다. 실제 surface/상호작용은 기존 LDS Core Popover와 Calendar가 소유합니다. FormDateTime PortalClipping story는64px overflow:hidden 부모, bounds·disabled·선택·Escape·외부 클릭을 검증합니다.
