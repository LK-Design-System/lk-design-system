**SearchField** — 앞에 돋보기, 지우기 어포던스가 있는 검색 입력.

## Interaction and reference basis

- Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as `로봇 검색 지우기`, and is disabled with the field.
- `readOnly` preserves focus and text selection but removes the clear action and editable hover affordance.
- Reference basis: [Carbon Search](https://carbondesignsystem.com/components/search/usage/) and [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/).

```jsx
<SearchField placeholder="제품·산업 검색" onSearch={run} />
<SearchField value={q} onChange={setQ} size="sm" />
```

- **value / defaultValue / onChange** — 제어/비제어. **onSearch** — Enter. **size** `sm · md`. 시그널 잉크 포커스 링.

- 필드·상태 prop: **status**(`normal`/`positive`/`negative`) · **invalid**(오류 강조 토글) · **helper**(보조 설명) · **error**(오류 메시지) · **fieldStyle**(전체 필드 컨테이너 스타일) · **clearLabel**(지우기 버튼의 스크린리더 레이블).
