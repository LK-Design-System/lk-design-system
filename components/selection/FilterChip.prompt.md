**FilterChip** — 패싯 필터용 라운드 필(산업, 제품군, 지역). 기본은 헤어라인; 활성 시 14% 시안 워시 + 시그널 잉크 텍스트/보더로 채워집니다.

```jsx
<FilterChip active>시설관리</FilterChip>
<FilterChip count={3}>제품군</FilterChip>
<FilterChip caret>산업 전체</FilterChip>
```

- **active** — 선택 상태. **count** — 끝의 숫자. **caret** — 메뉴를 여는 필터용 드롭다운 어포던스.
- 필 모양(`--radius-pill`), 높이 38px. 사각 키워드 토큰은 `Chip`, 체크가 있는 다중 선택은 `MultiSelectChip`을 쓰세요.
