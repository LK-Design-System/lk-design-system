**SearchField** — 앞에 돋보기, 지우기 어포던스가 있는 검색 입력.

## Interaction and reference basis

- Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as `로봇 검색 지우기`, and is disabled with the field.
- `readOnly` preserves focus and text selection but removes the clear action and editable hover affordance.
- **지우기 후 포커스 복귀** — 지우기 버튼은 값이 비면 언마운트되므로, 활성화 시 포커스를 입력으로 되돌립니다. 그렇지 않으면 포커스가 `<body>`로 떨어져 키보드 사용자가 필드를 잃습니다(Carbon Search 관례).
- **네이티브 지우기 어포던스 제거** — `type="search"`는 WebKit에서 자체 ✕ 글리프를 그려 커스텀 지우기 버튼과 두 개가 됩니다. 눈에 보이지만 이름이 없는 쪽이 하나 더 생기므로 `::-webkit-search-cancel-button` 계열을 리셋합니다.
- Reference basis: [Carbon Search](https://carbondesignsystem.com/components/search/usage/), [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/), [WCAG 2.2 3.2.1 On Focus](https://www.w3.org/TR/WCAG22/#on-focus).

```jsx
<SearchField placeholder="제품·산업 검색" onSearch={run} />
<SearchField value={q} onChange={setQ} size="sm" />
```

- **value / defaultValue / onChange** — 제어/비제어. **onSearch** — Enter. **size** `sm · md`. 시그널 잉크 포커스 링.

- 필드·상태 prop: **status**(`normal`/`positive`/`negative`) · **invalid**(오류 강조 토글) · **helper**(보조 설명) · **error**(오류 메시지) · **fieldStyle**(전체 필드 컨테이너 스타일) · **clearLabel**(지우기 버튼의 스크린리더 레이블).
