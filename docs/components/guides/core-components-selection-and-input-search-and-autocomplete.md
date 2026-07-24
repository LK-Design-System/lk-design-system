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

- 자유 검색어를 전송할 때는 SearchField, 입력 중 단일 후보를 제안할 때는 AutoComplete, 정해진 후보 여러 개를 고를 때는 Combobox를 사용하세요. 간단한 고정 목록은 Select가 더 적합합니다.
- 지우기 후 포커스 복귀 — 지우기 버튼은 값이 비면 언마운트되므로, 활성화 시 포커스를 입력으로 되돌립니다. 그렇지 않으면 포커스가 로 떨어져 키보드 사용자가 필드를 잃습니다(Carbon Search 관례).
- - Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as 로봇 검색 지우기, and is disabled with the field. - readOnly preserves focus and text selection but removes the clear action and….
- Search and Autocomplete가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- Search and Autocomplete가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | SearchField의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Helper | helper 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Error | error 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Empty Label | emptyLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Result Count Label | 일치 항목 수의 polite 안내 문구. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Helper | helper 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `options` | `AutoCompleteOption[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onSelect` | `(value: string) = void` | No | 선택된 옵션의 값과 함께 호출. |
| `label` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `helper` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `error` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `invalid` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `status` | `'normal' \| 'positive' \| 'negative'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `required` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `readOnly` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `placeholder` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `emptyLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `autoHighlight` | `boolean` | No | 입력할 때 첫 후보를 자동으로 활성 옵션으로 지정할지 여부. 기본값 false는 APG list-autocomplete의 수동 선택(manual selection)으로, 사용자가 방향키로 이동하기 전에는 aria-activedescendant가 비어 있고 Enter가 제안을 확정하지 않습니다. true면 이전(적극적) 동작으로 되돌립니다. |
| `resultCountLabel` | `(count: number) = string` | No | 일치 항목 수의 polite 안내 문구. |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `style` | `React.CSSProperties` | No | 제어와 팝업을 감싸는 기존 컨테이너 스타일. |
| `fieldStyle` | `React.CSSProperties` | No | label/helper/error를 포함한 전체 필드 스타일. |
| `options` | `ComboboxOption[]` | Yes | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string[]) = void` | No | 공개 타입 계약에 정의된 속성입니다. |

## States

| State | Contract |
| --- | --- |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| invalid | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| status | 공개 타입 계약에 정의된 속성입니다. 타입 계약: 'normal' \| 'positive' \| 'negative' |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| readOnly | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| emptyLabel | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |

## Behavior and interaction

- Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as 로봇 검색 지우기, and is disabled with the field.
- readOnly preserves focus and text selection but removes the clear action and editable hover affordance.
- 지우기 후 포커스 복귀 — 지우기 버튼은 값이 비면 언마운트되므로, 활성화 시 포커스를 입력으로 되돌립니다. 그렇지 않으면 포커스가 로 떨어져 키보드 사용자가 필드를 잃습니다(Carbon Search 관례).
- 네이티브 지우기 어포던스 제거 — type="search"는 WebKit에서 자체 ✕ 글리프를 그려 커스텀 지우기 버튼과 두 개가 됩니다. 눈에 보이지만 이름이 없는 쪽이 하나 더 생기므로 ::-webkit-search-cancel-button 계열을 리셋합니다.
- Reference basis: Carbon Search, GOV.UK Text input, WCAG 2.2 3.2.1 On Focus.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as 로봇 검색 지우기, and is disabled with the field. |
| 명시 규칙 2 | Reference basis: Carbon Search, GOV.UK Text input, WCAG 2.2 3.2.1 On Focus. |
| 명시 규칙 3 | - Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as 로봇 검색 지우기, and is disabled with the field. - readOnly preserves focus and text selection but removes the clear action and… |
| --caption1-size | {"fontSize":"12px","lineHeight":"16px","letterSpacing":"0.0252em"} |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as 로봇 검색 지우기, and is disabled with the field.
- readOnly preserves focus and text selection but removes the clear action and editable hover affordance.
- 네이티브 지우기 어포던스 제거 — type="search"는 WebKit에서 자체 ✕ 글리프를 그려 커스텀 지우기 버튼과 두 개가 됩니다. 눈에 보이지만 이름이 없는 쪽이 하나 더 생기므로 ::-webkit-search-cancel-button 계열을 리셋합니다.
- Reference basis: Carbon Search, GOV.UK Text input, WCAG 2.2 3.2.1 On Focus.

## Accessibility

- Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as 로봇 검색 지우기, and is disabled with the field.
- readOnly preserves focus and text selection but removes the clear action and editable hover affordance.
- 지우기 후 포커스 복귀 — 지우기 버튼은 값이 비면 언마운트되므로, 활성화 시 포커스를 입력으로 되돌립니다. 그렇지 않으면 포커스가 로 떨어져 키보드 사용자가 필드를 잃습니다(Carbon Search 관례).
- Reference basis: Carbon Search, GOV.UK Text input, WCAG 2.2 3.2.1 On Focus.
- value / defaultValue / onChange — 제어/비제어. onSearch — Enter. size sm · md. 시그널 잉크 포커스 링.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 지우기 후 포커스 복귀 — 지우기 버튼은 값이 비면 언마운트되므로, 활성화 시 포커스를 입력으로 되돌립니다. 그렇지 않으면 포커스가 로 떨어져 키보드 사용자가 필드를 잃습니다(Carbon Search 관례). |
| Don't | Search and Autocomplete가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | - Keep a visible label whenever the surrounding context does not already name the search. Enter submits the current query; Escape clears it. The clear action is 32px, has a contextual name such as 로봇 검색 지우기, and is disabled with the field. - readOnly preserves focus and text selection but removes the clear action and…. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 SearchField의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AutoComplete` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `Combobox` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `TagInput` | 같은 페이지가 소유하는 공개 primitive 또는 조합 요소입니다. |
| `FormField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Input` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Select` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Textarea` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

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
- `--component-input-font-size`
- `--component-input-gap`
- `--component-input-height`
- `--component-input-icon-color`
- `--component-input-letter-spacing`
- `--component-input-line-height`
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
- `--radius-5`
- `--radius-input`
- `--radius-lg`
- `--radius-md`
- `--radius-pill`
- `--radius-xl`
- `--shadow-md`
- `--space-1`
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

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- SearchField prompt contract: `components/forms/SearchField.prompt.md`
- Storybook implementation evidence: `stories/FormSearchAutocomplete.stories.jsx`
- [Carbon Search](https://carbondesignsystem.com/components/search/usage/)
- [GOV.UK Text input](https://design-system.service.gov.uk/components/text-input/)
- [WCAG 2.2 3.2.1 On Focus](https://www.w3.org/TR/WCAG22/#on-focus)
