**FilterChip** — 패싯 필터용 라운드 필(산업, 제품군, 지역). 기본은 헤어라인; 활성 시 14% 시안 워시 + 시그널 잉크 텍스트/보더로 채워집니다.

```jsx
<FilterChip active>시설관리</FilterChip>
<FilterChip count={3}>제품군</FilterChip>
<FilterChip caret expanded={open} onClick={() => setOpen(!open)}>산업 전체</FilterChip>
```

- **active** — 선택 상태. **count** — 끝의 숫자. **caret** — 메뉴를 여는 필터용 드롭다운 어포던스. **expanded** — disclosure 칩의 팝업 열림 상태. **haspopup** — 여는 팝업 종류(`menu` 기본).
- 필 모양(`--radius-pill`), 높이 38px. 사각 키워드 토큰은 `Chip`, 체크가 있는 다중 선택은 `MultiSelectChip`을 쓰세요.

## 접근성 계약

- **두 가지 역할을 섞지 않습니다.** `caret`이 없는 칩은 패싯을 켜고 끄는 토글이라 `aria-pressed`를 소유합니다. `caret` 칩은 값을 토글하지 않고 메뉴를 여는 disclosure라서 `aria-haspopup` + `aria-expanded`를 소유하고 `aria-pressed`는 노출하지 않습니다. 두 속성을 함께 두면 팝업만 연 컨트롤이 "선택됨/눌림"으로 읽힙니다.
- **단일 선택 패싯에는 쓰지 않습니다.** `FilterChip`은 서로 독립적인 on/off 토글 버튼이며 그룹/라디오 의미가 없습니다. 상호 배타적인 선택에는 `ChoiceCard`(radiogroup) 또는 `Select`를 쓰세요. 근거는 `MultiSelectChip.prompt.md`의 "단일 선택 패싯 가이드"를 참조하세요.
- 근거: [WAI-ARIA APG Disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/), [WAI-ARIA APG Button pattern — toggle buttons](https://www.w3.org/WAI/ARIA/apg/patterns/button/).
