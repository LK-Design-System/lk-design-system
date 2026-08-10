## Primitive composition and keyboard contract

- The group composes the public `Radio` primitive; it must not redraw a second radio glyph, focus ring, or disabled treatment.
- Native radios share one `name`, so Tab enters the group, arrow keys move and select, and Space selects the focused option. Provide `aria-label` or `aria-labelledby` on the group when no visible group label exists.

References: [WAI-ARIA APG Radio Group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/), [WAI form control grouping](https://www.w3.org/WAI/tutorials/forms/grouping/).

**RadioGroup** — 단일 선택 라디오 세트(켜지면 시그널 잉크 점).

```jsx
<RadioGroup defaultValue="now" onChange={setKind} options={[
  { value: 'now', label: '즉시 적용', description: '선택한 항목에 바로 반영' },
  { value: 'schedule', label: '예약 적용' },
]} />
```

- **options** — 문자열 또는 `{ value, label, description, disabled }`. **value / defaultValue / onChange** — 제어/비제어. **direction** `row · column`.
- `size`는 자식 Radio와 행 간격을 함께 정렬합니다. 생략하면 일반 표면은 `md`, bounded compact component scope는 `sm`이며 명시값이 우선합니다.
