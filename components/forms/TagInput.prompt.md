**TagInput** — 입력한 항목을 제거 가능한 칩으로 바꾸는 필드.

```jsx
<TagInput defaultValue={['자율주행']} onChange={setTags} placeholder="기술 입력 후 Enter" />
```

- **value / defaultValue / onChange** — string[]. Enter로 추가; 빈 상태에서 Backspace로 마지막 항목 제거; ✕ 클릭으로 제거.
