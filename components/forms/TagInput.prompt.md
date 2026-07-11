**TagInput** — 입력한 항목을 제거 가능한 칩으로 바꾸는 필드.

```jsx
<TagInput defaultValue={['자율주행']} onChange={setTags} placeholder="기술 입력 후 Enter" />
```

- **value / defaultValue / onChange** — string[]. Enter로 추가; 빈 상태에서 Backspace로 마지막 항목 제거; ✕ 클릭으로 제거.
- 타입 스케일 정합: 태그 칩 13.5px → `--label2-size`(13px)로 스냅했습니다. 14px 입력 텍스트보다 한 단계 아래를 유지해 칩/입력 위계가 살아 있습니다.
