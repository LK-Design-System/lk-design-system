**SearchField** — 앞에 돋보기, 지우기 어포던스가 있는 검색 입력.

## 단일 focus 표시 (R11, 2026-10-09)

Input과 MessageComposer의 필드 소유 focus를 비교했습니다. 외곽 border와
외곽 control의 semantic focus-indicator outline으로 위치를 표시합니다. 내부 search input의
전역 outline만 제외하고 clear button의 keyboard outline은 보존합니다. forced-colors는 외곽 Highlight outline입니다.
text input은 클릭으로도 `:focus-visible`에 해당할 수 있으므로 입력 방식만으로 outline 유무를 단정하지 않습니다.
Portal처럼 CSS를 `@layer`로 가져오면 layered `!important`가 runtime의 unlayered 규칙보다 우선합니다.
따라서 내부 input 예외도 `tokens/focus.css`에 함께 두어 같은 layer에서 처리합니다.
`SearchSingleFocus`는 실제 focus CSS를 layer로 가져온 상태, 지우기 버튼의 표시와 포커스 복귀,
일반 Input의 표시 보존을 검증합니다.
전역 focus token과 다른 필드는 바꾸지 않습니다.
[MDN cascade layers](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/important#cascade_layers)의
important 우선순위를 확인했습니다.
[WCAG Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html)과
[WAI-ARIA Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)의 visible keyboard focus 원칙을 검토했습니다.
[소스 검토 기록](../../docs/handoff/2026-10-09-portal-density-source-review.md) 참조.

## Public surface and ref

- `ref` points to the native search input; use `rootRef` for the complete field stack.
- `className` and `style` customize the root. `controlClassName`/`controlStyle` target the bordered shell and `inputClassName`/`inputStyle` target the native input.
- Stable parts are `root`, `label`, `control`, `startIcon`, `input`, `statusIcon`, `clearButton`, and `message`. Only documented `--lds-search-field-*` geometry variables are accepted.

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
