**TimePicker** — keyboard와 platform picker를 보존하는 native 시 + 분 select(24시간)입니다.

```jsx
<TimePicker defaultValue="14:30" minuteStep={10} onChange={setTime} />
```

- **value / defaultValue / onChange** — "HH:MM". **minuteStep** — 1~60 범위로 정규화되는 분 간격. **hourLabel / minuteLabel** — 두 select의 accessible name. **size** — `sm|md`.
- 24개 시와 step 기반 분처럼 단순 numeric option에는 커스텀 listbox를 재구현하지 않습니다. native select가 Arrow/type-ahead/Enter/Escape와 mobile picker를 소유하고 LDS는 field chrome만 적용합니다.

## External research basis

- [Apple Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)는 distinct value 목록과 date/time 입력에 platform picker를 우선하고 keyboard·pointer·touch 입력을 함께 지원합니다.
- [WAI-ARIA Authoring Practices: Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)의 native semantics 우선 원칙에 따라 이 단순 numeric selector에는 custom listbox를 만들지 않습니다.
