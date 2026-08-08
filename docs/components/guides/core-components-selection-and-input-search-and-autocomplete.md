# Search and Autocomplete

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `SearchField` |
| Storybook | `LDS Core/Components/Selection and Input/Search and Autocomplete` |
| Source | `../component-content.json#core-components-selection-and-input-search-and-autocomplete` |

자유 검색어를 전송할 때는 SearchField, 입력 중 단일 후보를 제안할 때는 AutoComplete, 정해진 후보 여러 개를 고를 때는 Combobox를 사용하세요. 간단한 고정 목록은 Select가 더 적합합니다.

## 사용 판단

### 사용

- ref points to the native search input; use rootRef for the complete field stack.

## Anatomy

| Part | Contract |
| --- | --- |
| resultCountLabel | 일치 항목 수의 polite 안내 문구. |
| startIcon | 컨트롤 앞에 놓는 아이콘. AutoComplete는 겉모습이 Input과 같아, 값이 채워져 있으면 그 칸에서 목록을 뒤질 수 있다는 사실이 화면에 남지 않는다(placeholder는 빈 칸에만 보인다). 여러 입력이 나란히 선 화면에서 찾는 칸과 적는 칸을 가르려면 표시가 필요하다. SearchField의 startIcon 파트와 같은 자리이며, 기본값은 없다 — 켜는 쪽을 소비자가 정한다. |
| clearLabel | Accessible clear-action name. Defaults to a contextual 지우기. |
| controlClassName | Input control-shell class. |
| controlStyle | Input control-shell style. |
| inputClassName | Native input class. |
| inputStyle | Native input style. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `AutoCompleteOption[]` | Yes |  |
| `value` | `string` | No |  |
| `defaultValue` | `string` | No |  |
| `onChange` | `(value: string) = void` | No |  |
| `onSelect` | `(value: string) = void` | No | 선택된 옵션의 값과 함께 호출. |
| `label` | `React.ReactNode` | No |  |
| `helper` | `React.ReactNode` | No |  |
| `error` | `React.ReactNode` | No |  |
| `invalid` | `boolean` | No |  |
| `status` | `'normal' \| 'positive' \| 'negative'` | No |  |
| `required` | `boolean` | No |  |
| `disabled` | `boolean` | No |  |
| `readOnly` | `boolean` | No |  |
| `placeholder` | `string` | No |  |
| `emptyLabel` | `React.ReactNode` | No |  |
| `autoHighlight` | `boolean` | No | 입력할 때 첫 후보를 자동으로 활성 옵션으로 지정할지 여부. 기본값 false는 APG list-autocomplete의 수동 선택(manual selection)으로, 사용자가 방향키로 이동하기 전에는 aria-activedescendant가 비어 있고 Enter가 제안을 확정하지 않습니다. true면 이전(적극적) 동작으로 되돌립니다. |
| `resultCountLabel` | `(count: number) = string` | No | 일치 항목 수의 polite 안내 문구. |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | No |  |
| `startIcon` | `React.ReactNode` | No | 컨트롤 앞에 놓는 아이콘. AutoComplete는 겉모습이 Input과 같아, 값이 채워져 있으면 그 칸에서 목록을 뒤질 수 있다는 사실이 화면에 남지 않는다(placeholder는 빈 칸에만 보인다). 여러 입력이 나란히 선 화면에서 찾는 칸과 적는 칸을 가르려면 표시가 필요하다. SearchField의 startIcon 파트와 같은 자리이며, 기본값은 없다 — 켜는 쪽을 소비자가 정한다. |
| `style` | `React.CSSProperties` | No | 제어와 팝업을 감싸는 기존 컨테이너 스타일. |
| `fieldStyle` | `React.CSSProperties` | No | label/helper/error를 포함한 전체 필드 스타일. |
| `options` | `ComboboxOption[]` | Yes |  |
| `value` | `string[]` | No |  |
| `defaultValue` | `string[]` | No |  |

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as 로봇 검색 지우기, and is disabled with the field. |
| 명시 규칙 2 | Reference basis: Carbon Search, GOV.UK Text input, WCAG 2.2 3.2.1 On Focus. |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-background-normal-alternative | light: #F7F7F8; dark: #0F0F10 |

## Content and writing

- className and style customize the root. controlClassName/controlStyle target the bordered shell and inputClassName/inputStyle target the native input.
- Stable parts are root, label, control, startIcon, input, statusIcon, clearButton, and message. Only documented --lds-search-field- geometry variables are accepted.
- 네이티브 지우기 어포던스 제거 — type="search"는 WebKit에서 자체 ✕ 글리프를 그려 커스텀 지우기 버튼과 두 개가 됩니다. 눈에 보이지만 이름이 없는 쪽이 하나 더 생기므로 ::-webkit-search-cancel-button 계열을 리셋합니다.
- 필드·상태 prop: status(normal/positive/negative) · invalid(오류 강조 토글) · helper(보조 설명) · error(오류 메시지) · fieldStyle(전체 필드 컨테이너 스타일) · clearLabel(지우기 버튼의 스크린리더 레이블).

## Accessibility

- readOnly preserves focus and text selection but removes the clear action and editable hover affordance.
- 지우기 후 포커스 복귀 — 지우기 버튼은 값이 비면 언마운트되므로, 활성화 시 포커스를 입력으로 되돌립니다. 그렇지 않으면 포커스가 로 떨어져 키보드 사용자가 필드를 잃습니다(Carbon Search 관례).
- value / defaultValue / onChange — 제어/비제어. onSearch — Enter. size sm · md. 시그널 잉크 포커스 링.

## Related components

| Component | Relationship |
| --- | --- |
| `AutoComplete` | 같은 페이지가 소유 |
| `Combobox` | 같은 페이지가 소유 |
| `TagInput` | 같은 페이지가 소유 |
| `Icon` | 대표 시나리오에서 조합 |
| `FormField` | 대표 시나리오에서 조합 |
| `Input` | 대표 시나리오에서 조합 |
| `Select` | 대표 시나리오에서 조합 |
| `Textarea` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<SearchField placeholder="제품·산업 검색" onSearch={run} />
<SearchField value={q} onChange={setQ} size="sm" />
```

## Tokens and API

### Tokens

- `--caption1-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-background-normal-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-strong`
- `--color-semantic-static-white`
- `--component-button-transition`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-gap`
- `--component-input-height`
- `--component-input-icon-color`
- `--component-input-padding-x`
- `--component-input-radius`
- `--component-input-text-color`
- `--control-h-sm`
- `--dur-base`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`
- `--label1-size`
- `--label2-size`
- `--lds-search-field-gap`
- `--lds-search-field-height`
- `--lds-search-field-padding-inline`
- `--lds-search-field-radius`
- `--radius-5`
- `--radius-input`
- `--radius-lg`
- `--radius-md`
- `--radius-pill`
- `--radius-xl`
- `--shadow-md`
- `--space-0-5`
- `--space-1`
- `--space-1-5`
- `--space-2`
- `--space-4`

### Source contracts

- `components/forms/AutoComplete.jsx`
- `components/forms/AutoComplete.d.ts`
- `components/forms/AutoComplete.prompt.md`
- `components/forms/Combobox.jsx`
- `components/forms/Combobox.d.ts`
- `components/forms/Combobox.prompt.md`
- `components/forms/SearchField.jsx`
- `components/forms/SearchField.d.ts`
- `components/forms/SearchField.prompt.md`
- `components/forms/TagInput.jsx`
- `components/forms/TagInput.d.ts`
- `components/forms/TagInput.prompt.md`
- `stories/FormSearchAutocomplete.stories.jsx`

## Sources

- SearchField prompt contract: `components/forms/SearchField.prompt.md`
- Storybook implementation evidence: `stories/FormSearchAutocomplete.stories.jsx`
- [Carbon Search](https://carbondesignsystem.com/components/search/usage/)
- [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/)
- [WCAG 2.2 3.2.1 On Focus](https://www.w3.org/TR/WCAG22/#on-focus)
