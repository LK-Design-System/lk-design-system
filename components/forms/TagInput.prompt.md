**TagInput** — 입력한 항목을 제거 가능한 칩으로 바꾸는 필드.

```jsx
<TagInput defaultValue={['자율주행']} onChange={setTags} placeholder="기술 입력 후 Enter" />
```

- **value / defaultValue / onChange** — string[]. Enter로 추가; 빈 상태에서 Backspace로 마지막 항목 제거; ✕ 클릭으로 제거.
- **removeLabel(tag)** — 삭제 버튼의 접근 가능한 이름. 기본값은 `` `${tag} 삭제` ``.
- 타입 스케일 정합: 태그 칩 13.5px → `--label2-size`(13px)로 스냅했습니다. 14px 입력 텍스트보다 한 단계 아래를 유지해 칩/입력 위계가 살아 있습니다.

## 접근성 계약

- **삭제 버튼 이름은 맥락을 포함합니다.** 이전에는 모든 삭제 버튼이 `aria-label="remove"`(영문, 맥락 없음)였습니다. 칩이 여러 개면 스크린리더 사용자에게 동일한 이름의 버튼이 반복되어 어떤 태그를 지우는지 알 수 없었습니다. 이제 기본값이 `` `${tag} 삭제` ``이며 `removeLabel`로 재정의할 수 있습니다.
- **삭제 후 포커스를 유지합니다.** 삭제 버튼은 칩과 함께 언마운트되므로 그대로 두면 포커스가 `<body>`로 떨어지고 키보드 사용자는 위치를 잃습니다. 삭제 후 포커스는 **다음 칩의 삭제 버튼**으로, 마지막 칩을 지웠다면 **텍스트 입력**으로 이동합니다.
- 근거: [WAI-ARIA APG — Grid pattern의 삭제 후 포커스 이동 지침](https://www.w3.org/WAI/ARIA/apg/patterns/grid/), [Carbon Tag(dismissible) accessibility](https://carbondesignsystem.com/components/tag/accessibility/), [WCAG 2.2 2.4.3 Focus Order](https://www.w3.org/TR/WCAG22/#focus-order).
