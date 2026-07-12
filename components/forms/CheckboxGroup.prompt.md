## Primitive composition and keyboard contract

- The group composes the public `Checkbox` primitive; it must inherit the same mark, focus ring, and disabled tokens instead of drawing another checkbox.
- Space toggles the focused checkbox. Associate a visible group label with `aria-labelledby`, or provide `aria-label` when the group has no visible heading.

References: [WAI-ARIA APG Checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/), [WAI form control grouping](https://www.w3.org/WAI/tutorials/forms/grouping/).

**CheckboxGroup** — 다중 선택 체크박스 세트; 값은 선택된 값들의 배열.

```jsx
<CheckboxGroup defaultValue={['auto']} onChange={setCaps} options={[
  { value: 'auto', label: '자율주행' },
  { value: 'vision', label: '비전 AI' },
  { value: 'gas', label: '가스 센싱' },
]} />
```

- **options** — 문자열 또는 `{ value, label, description, disabled }`. **value / defaultValue / onChange** — 배열. **direction** `row · column`.
