**TimePicker** — keyboard와 platform picker를 보존하는 native 시 + 분 select(24시간)입니다.

```jsx
<TimePicker defaultValue="14:30" minuteStep={10} onChange={setTime} />
```

- **value / defaultValue / onChange** — "HH:MM". **minuteStep** — 1~60 범위로 정규화되는 분 간격. 제어 값이 step 밖이면 해당 분 option을 끼워 넣어 값을 잃지 않습니다. **hourLabel / minuteLabel** — 두 select의 accessible name. **size** — `sm|md`. **disabled** — 두 select를 함께 잠급니다.
- 두 select는 `role="group"`으로 묶이고 기본 이름은 `시간 선택`입니다. 어느 시각인지 구분이 필요하면 `aria-label`로 덮어써서(예: `시작 시간`) FormField의 시각 label과 같은 문맥을 프로그램적으로도 제공합니다. `시`/`분`만으로는 어떤 필드의 시각인지 알 수 없기 때문입니다.
- 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다.

## External research basis

- [Apple Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다.
- [WAI-ARIA Authoring Practices: Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)의 native semantics 우선 원칙에 따라 이 단순 numeric selector에는 custom listbox를 만들지 않습니다.
