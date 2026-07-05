**CheckboxGroup** — 다중 선택 체크박스 세트; 값은 선택된 값들의 배열.

```jsx
<CheckboxGroup defaultValue={['auto']} onChange={setCaps} options={[
  { value: 'auto', label: '자율주행' },
  { value: 'vision', label: '비전 AI' },
  { value: 'gas', label: '가스 센싱' },
]} />
```

- **options** — 문자열 또는 `{ value, label, description, disabled }`. **value / defaultValue / onChange** — 배열. **direction** `row · column`.
