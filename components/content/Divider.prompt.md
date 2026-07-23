**Divider** separates layout regions or inline groups using the WDS Layout/Divider primitive.

```jsx
<Divider />
<Divider variant="thick" />
<Divider decorative />
<span>A</span><Divider vertical /><span>B</span>
```

- Use `variant="normal"` for hairline separation and `variant="thick"` for stronger section breaks.
- Use `vertical` only inside horizontal groups where the parent controls height.
- Use `label` for "or" style separators between equivalent actions.

## 의미 있는 구분선 vs 장식 선 (`decorative`)

이 페이지의 핵심 축입니다. 선을 넣기 전에 **"이 선이 사라지면 정보가 사라지는가?"** 를 물으세요.

| | 기본 (`decorative` 없음) | `decorative` |
| --- | --- | --- |
| 노출 | `role="separator"` (가로형은 네이티브 `<hr>` 의 암시적 role) | `role="none"` + `aria-hidden` |
| 의미 | "여기서 콘텐츠 주제가 바뀝니다" | 없음 — 순수 시각 리듬 |
| 쓰는 곳 | 문서 섹션 경계, 메뉴의 그룹 경계, 서로 다른 성격의 액션 묶음 사이 | 카드 내부 장식선, 이미 `ul/li`·heading 으로 구조가 잡힌 목록의 행 사이, 반복 리듬용 얇은 선 |

- **목록의 행 구분선은 대부분 장식입니다.** 리스트 시맨틱(`ul/li`)이 이미 경계를 알려주므로, 행마다 `role="separator"` 를 노출하면 스크린리더가 "구분자"를 항목 수만큼 반복해서 읽습니다. `ListCell` 의 `divider` prop 은 이 이유로 이미 `aria-hidden` 인 장식선입니다.
- 가로형 기본 Divider 는 네이티브 `<hr>` 이므로 `role="separator"` 를 **다시 선언하지 않습니다**(중복 role). 세로형은 `<span>` 이라 `role="separator"` + `aria-orientation="vertical"` 을 명시합니다.
- `label` 이 있는 구분선은 `separator` 의 자식이 presentational 이라 라벨 텍스트가 이름으로 읽히지 않습니다. 문자열 `label` 은 `aria-label` 로 함께 노출합니다.
