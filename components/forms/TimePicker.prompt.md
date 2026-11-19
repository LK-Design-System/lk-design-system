**TimePicker** — keyboard와 platform picker를 보존하는 native 시 + 분(+ 선택적 초) select(24시간)입니다.

```jsx
<TimePicker defaultValue="14:30" minuteStep={10} onChange={setTime} />
```

- **value / defaultValue / onChange** — 기본 `precision="minute"`에서는 "HH:MM", `precision="second"`에서는 "HH:MM:SS". 초 정밀도에서 누락된 초는 00으로 표현하고 초는 정수 0~59로 제한합니다. `secondStep`은 기본1, 1~60으로 정규화하고 step 밖 controlled 초 option을 보존합니다. `secondLabel`은 초 select 이름(기본 "초")입니다. 날짜·timezone·KST 직렬화는 제품 소유이며 컴포넌트는 시간 단위만 반환합니다. **minuteStep** — 1~60 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. **hourLabel / minuteLabel** — 두 select의 accessible name. **size** — `sm|md`. **disabled** — 모든 단위 select를 함께 잠급니다.
- 단위 select는 `role="group"`으로 묶이고 기본 이름은 `시간 선택`입니다. 어느 시각인지 구분이 필요하면 `aria-label`로 덮어써서(예: `시작 시간`) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. `시`/`분`만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다.
- 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다.

## External research basis

- [Apple Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다.
- [WAI-ARIA Authoring Practices: Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)의 native semantics 우선 원칙에 따라 이 단순 numeric selector에는 custom listbox를 만들지 않습니다.

## 초 정밀도 확장(2026-10-15)

기존 minute-only 호출·기본5분·두 native select를 유지합니다. 초 단위가 필요한 녹화 조회는 `precision="second" minuteStep={1}`을 명시합니다. 시·분·초 select는 같은 TimeSelect chrome, 76px 최소 폭, Input 높이·포커스·비활성 문법을 재사용하고 새 listbox/아이콘/색을 만들지 않습니다. 기본 minute와 second의 차이는 필요한 단위 select 하나뿐입니다. 320px에서 세 select를 한 줄로 유지하며 기존 시·분 값 변경은 초를 보존합니다. `FormTimePicker`의 초 단위·간격/비활성 story가 이를 검증합니다.

[MDN time value format](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time#time_value_format)은 24시간 HH:mm / HH:mm:ss 구분을 명시합니다. [W3C APG native semantics 우선 원칙](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)에 따라 기존 native select의 keyboard/type-ahead/mobile picker를 유지합니다. 정밀도 때문에 custom popup을 추가하지 않습니다.

공용 계약은 시간 입력만 소유합니다. Full Daedeok `ScheduleForm`의 native time 입력은 기본 minute API로 조합 가능하며 기존 의미를 유지합니다. LK Portal의 확인한 archived playback seam은 시각 입력을 노출하지 않아 이 확장은 not applicable입니다. LK Web Viz frontend에도 직접 시간 입력 seam이 없어 not applicable입니다. 세 제품 source revision·blob은 `time-picker-second-precision-20261015` coverage record에 보존하고 해당 제품 소스는 수정하지 않습니다.

## 단일 필드와 범위(2026-10-15)

`presentation="units"`가 기존 기본이고 각 단위 변경을 즉시 전달합니다. `presentation="field"`는 HH:MM(:SS)와 clock 아이콘을 한 trigger에 모읍니다. Core Popover에서 기존 native 단위를 draft로 고르고 **확인**에서만 onChange를 한 번 호출합니다. 취소·바깥 클릭·Escape는 draft를 버리고 trigger로 focus를 복원합니다. 팝업의 native select는 같은 field chrome을 유지하고 320px viewport에서 panel의 가용 폭에 맞춰 줄어듭니다. 새 custom listbox나 외부 dependency는 없습니다.

`minTime/maxTime`은 HH:MM 또는 HH:MM:SS의 **같은 날 inclusive 범위**입니다. 범위 밖 option을 disabled로 노출하고 시·분 변경이 경계에 걸리면 유효 범위로 clamp합니다. 분 정밀도는 lower를 올림·upper를 내림해 범위를 넓히지 않습니다. invalid/뒤집힌 경계와 표현 불가 범위는 선택 불가이며, 자정 넘김을 추측하지 않습니다. 날짜·실제 데이터 유무·소수부·query·timezone은 제품이 소유합니다.

근거: [Ant Design TimePicker](https://ant.design/components/time-picker/)의 single input→popup, needConfirm, disabled-time 단위는 입력 밀도를 낮추고 확정과 draft를 구분하는 참고 사례입니다. 외부 시각·치수·라이브러리는 복제하지 않았습니다. [W3C picker dialog example](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)의 확인/취소와 Escape focus 복귀 계약을 참고하되 LDS Core Popover는 비모달이며 modal trap을 주장하지 않습니다. 기존 Core DatePicker의 field typography·Input token과 Core Popover/Button/TimeSelect를 재사용합니다.

## 불연속 시간 범위(2026-10-15)

LK Product Extension의 추가 입력 축 `allowedTimeRanges`는 `{start, end}` 배열이며 각 값은 같은 날의 HH:MM 또는 HH:MM:SS **inclusive** 시각입니다. 생략하면 기존 min/max만 적용하고, 빈 배열·잘못된 구간은 선택을 잠급니다. 각 구간을 min/max와 교차한 뒤 현재 정밀도로 lower 올림·upper 내림합니다. 따라서 `08:30:01–08:30:59`는 초 정밀도에서 선택할 수 있지만 분 정밀도에서는 선택할 수 없습니다. 자정을 넘는 구간이나 날짜·시간대·녹화 endpoint는 추측하지 않고 소비자가 날짜별 시각 구간으로 변환합니다.

기존 field·native 시/분/초·Core Popover·Button의 시각 문법을 유지합니다. 해당 시 또는 분 안에 유효한 값이 있을 때만 그 단위를 활성화하고, 초는 실제 허용 여부를 그대로 native `option.disabled`로 전달합니다. 시·분 변경은 선택한 단위 안의 가장 가까운 유효 시각을 draft로 정하며 공백으로 commit하지 않습니다. 범위가 바뀌어도 field의 확인 전에는 onChange를 호출하지 않습니다. 확인·취소·Escape·focus 복귀 계약은 같습니다.

외부 근거는 [Ant Design TimePicker의 disabledHours/disabledMinutes/disabledSeconds](https://ant.design/components/time-picker/#disabledtime)와 [WHATWG option disabled](https://html.spec.whatwg.org/multipage/form-elements.html#attr-option-disabled)입니다. 상위 단위는 하위 단위의 가용성을 반영하되, disabled 항목을 숨겨 공백을 감추지 않고 native 의미를 유지한다는 결론만 채택했습니다. 새로운 listbox·스타일·색·토큰은 추가하지 않습니다. 범위 간 이동, 시작·종료 순서, 검색 제출, 소수 초 보존, 자료의 진실은 제품 소유입니다.

Full Daedeok의 확인한 ScheduleForm minute API는 그대로 조합 가능하며 이 제품에 불연속 구간을 새로 부여하지 않습니다. 확인한 Portal archived video seam과 maintenance-only Web Viz Dashboard에는 직접 시각 선택 seam이 없어 해당 확장은 not applicable입니다. `time-picker-allowed-ranges-20261015` coverage record에 실제 frontend source pin과 분리된 판단을 남깁니다. 설치0.4.9·릴리스 산출물은 변경하지 않는 unpublished source preview입니다.
