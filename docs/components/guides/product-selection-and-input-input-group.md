# Input Group

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Selection and Input |
| Owner | `InputGroup` |
| Storybook | `LDS Product/Selection and Input/Input Group` |
| Source | `../component-content.json#product-selection-and-input-input-group` |

통화, 단위, 프로토콜처럼 사용자가 바꾸지 않는 문맥이 값 해석에 필수적일 때 적합합니다. 단순한 안내 텍스트는 이 컴포넌트 대신 Input 설명으로 제공하세요.

## 사용 판단

### 사용

- 통화, 단위, 프로토콜처럼 사용자가 바꾸지 않는 문맥이 값 해석에 필수적일 때 적합합니다. 단순한 안내 텍스트는 이 컴포넌트 대신 Input 설명으로 제공하세요.
- 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할 필요가 없습니다.
- - Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale. - 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할….
- Input Group가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.

### 사용하지 않음

- 애드온 노드는 자기 접근성 의미를 스스로 소유합니다. 컴포넌트가 노드 애드온을 일괄 aria-hidden 처리하지 않으므로 순수 장식 아이콘은 소비자가 직접 aria-hidden을 겁니다(레포의 Icon은 이름을 주지 않으면 스스로 숨깁니다).
- - Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale. - 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할….
- Input Group가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | InputGroup의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Prefix | prefix 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Suffix | suffix 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Label | label 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Helper | helper 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Error | error 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Input Props | inputProps 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `prefix` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `suffix` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `value` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `defaultValue` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onChange` | `(value: string) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `label` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `helper` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `error` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `invalid` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `status` | `'normal' \| 'positive' \| 'negative'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `required` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `placeholder` | `string` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `'sm' \| 'md' \| 'small' \| 'medium'` | No | 공개 타입 계약에 정의된 속성입니다. |
| `disabled` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `readOnly` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `inputProps` | `React.InputHTMLAttributes` | No | 공개 타입 계약에 정의된 속성입니다. |
| `fieldStyle` | `React.CSSProperties` | No | Styles for the label/control/message stack. |
| `style` | `React.CSSProperties` | No | Styles for the grouped control shell. |

## States

| State | Contract |
| --- | --- |
| error | 공개 타입 계약에 정의된 속성입니다. 타입 계약: React.ReactNode |
| invalid | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| status | 공개 타입 계약에 정의된 속성입니다. 타입 계약: 'normal' \| 'positive' \| 'negative' |
| disabled | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |
| readOnly | 공개 타입 계약에 정의된 속성입니다. 타입 계약: boolean |

## Behavior and interaction

- Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale.
- readOnly remains focusable and selectable. Consumer and generated description ids are merged on the input.
- prefix / suffix — 애드온 노드. value / defaultValue / onChange — 텍스트. inputProps — 네이티브 input 패스스루. inputProps.onChange/onFocus/onBlur는 폐기되지 않고 컴포넌트 내부 처리보다 먼저 호출됩니다(값 커밋은 그대로 이어집니다). inputProps['aria-describedby']는 생성된 설명 id와 병합됩니다.
- 필드·상태 prop: status(normal/positive/negative) · invalid(오류 강조 토글) · fieldStyle(label·helper·error를 포함한 전체 필드 컨테이너 스타일).
- - Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale. - 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale. |
| 명시 규칙 2 | - Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale. - 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할… |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale.
- 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할 필요가 없습니다.
- 애드온 노드는 자기 접근성 의미를 스스로 소유합니다. 컴포넌트가 노드 애드온을 일괄 aria-hidden 처리하지 않으므로 순수 장식 아이콘은 소비자가 직접 aria-hidden을 겁니다(레포의 Icon은 이름을 주지 않으면 스스로 숨깁니다).
- readOnly remains focusable and selectable. Consumer and generated description ids are merged on the input.

## Accessibility

- Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale.
- 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할 필요가 없습니다.
- 애드온 노드는 자기 접근성 의미를 스스로 소유합니다. 컴포넌트가 노드 애드온을 일괄 aria-hidden 처리하지 않으므로 순수 장식 아이콘은 소비자가 직접 aria-hidden을 겁니다(레포의 Icon은 이름을 주지 않으면 스스로 숨깁니다).
- readOnly remains focusable and selectable. Consumer and generated description ids are merged on the input.
- prefix / suffix — 애드온 노드. value / defaultValue / onChange — 텍스트. inputProps — 네이티브 input 패스스루. inputProps.onChange/onFocus/onBlur는 폐기되지 않고 컴포넌트 내부 처리보다 먼저 호출됩니다(값 커밋은 그대로 이어집니다). inputProps['aria-describedby']는 생성된 설명 id와 병합됩니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할 필요가 없습니다. |
| Don't | 애드온 노드는 자기 접근성 의미를 스스로 소유합니다. 컴포넌트가 노드 애드온을 일괄 aria-hidden 처리하지 않으므로 순수 장식 아이콘은 소비자가 직접 aria-hidden을 겁니다(레포의 Icon은 이름을 주지 않으면 스스로 숨깁니다). |
| Do | - Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale. - 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할…. |
| Don't | - Prefix and suffix are fixed context, not part of the editable value. The whole group shares one label, border, focus ring, helper/error relationship, and 32px/48px field scale. - 애드온은 값 해석에 필수인 문맥이므로 input의 aria-describedby에 연결합니다. 단위·프로토콜(ms, %, https://)이 form 모드 SR 사용자에게도 들리게 하려는 것이며, 소비자가 label/hint에 단위를 중복 기재할…. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 InputGroup의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `PasswordInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<InputGroup prefix="ID" suffix="개" placeholder="12" />
<InputGroup suffix="%" defaultValue="72" />
```

## Tokens and API

### Tokens

- `--color-semantic-fill-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-disable`
- `--component-input-border-color`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-font-size`
- `--component-input-height`
- `--component-input-letter-spacing`
- `--component-input-line-height`
- `--component-input-padding-x`
- `--component-input-radius`
- `--component-input-text-color`
- `--control-h-sm`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-semibold`
- `--space-2`

### Source contracts

- `components/forms/InputGroup.jsx`
- `components/forms/InputGroup.d.ts`
- `components/forms/InputGroup.prompt.md`
- `stories/FormInputGroup.stories.jsx`

## Migration

- prefix / suffix — 애드온 노드. value / defaultValue / onChange — 텍스트. inputProps — 네이티브 input 패스스루. inputProps.onChange/onFocus/onBlur는 폐기되지 않고 컴포넌트 내부 처리보다 먼저 호출됩니다(값 커밋은 그대로 이어집니다). inputProps['aria-describedby']는 생성된 설명 id와 병합됩니다.
- - prefix / suffix — 애드온 노드. value / defaultValue / onChange — 텍스트. inputProps — 네이티브 input 패스스루. inputProps.onChange/onFocus/onBlur는 폐기되지 않고 컴포넌트 내부 처리보다 먼저 호출됩니다(값 커밋은 그대로 이어집니다). inputProps['aria-describedby']는 생성된 설명 id와 병합됩니다.
- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- InputGroup prompt contract: `components/forms/InputGroup.prompt.md`
- Storybook implementation evidence: `stories/FormInputGroup.stories.jsx`
- [GOV.UK Text input prefixes and suffixes](https://design-system.service.gov.uk/components/text-input/#prefixes-and-suffixes)
- [Carbon Text input](https://carbondesignsystem.com/components/text-input/usage/)
