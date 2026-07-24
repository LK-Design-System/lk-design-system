# Textarea

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Selection and Input |
| Owner | `Textarea` |
| Storybook | `LDS Core/Components/Selection and Input/Textarea` |
| Source | `../component-content.json#core-components-selection-and-input-textarea` |

검토 메모·설명처럼 줄바꿈과 충분한 작성 공간이 필요한 값에 적합합니다. 이름·검색어처럼 한 줄 값에는 Textarea 대신 Input을 사용하세요.

## 사용 판단

### 사용

- 검토 메모·설명처럼 줄바꿈과 충분한 작성 공간이 필요한 값에 적합합니다. 이름·검색어처럼 한 줄 값에는 Textarea 대신 Input을 사용하세요.
- Textarea가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Textarea API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- Textarea가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Textarea의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 박스 위에 렌더되는 필드 라벨. |
| Helper | 박스 아래 보조 설명. |
| Error | 박스 아래 오류 설명. |
| Interaction | interaction 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `label` | `React.ReactNode` | No | 박스 위에 렌더되는 필드 라벨. |
| `helper` | `React.ReactNode` | No | 박스 아래 보조 설명. |
| `error` | `React.ReactNode` | No | 박스 아래 오류 설명. |
| `required` | `boolean` | No | 라벨에 레드 별표 추가. @default false |
| `invalid` | `boolean` | No | 검증 오류용 레드 링. @default false |
| `status` | `"normal" \| "positive" \| "negative"` | No | 상태 링과 메시지 톤. @default "normal" |
| `size` | `"sm" \| "md" \| "lg" \| "small" \| "medium" \| "large"` | No | 최소 높이 프리셋. @default "md" |
| `interaction` | `"normal" \| "inactive" \| "hovered" \| "focused" \| "active" \| "active-focused"` | No | 공개 타입 계약에 정의된 속성입니다. |
| `active` | `boolean` | No | active visual state alias. |
| `focus` | `boolean` | No | focus visual state alias. |
| `disable` | `boolean` | No | disabled alias. |
| `resize` | `"normal" \| "fixed" \| "limit"` | No | resize axis. |
| `rows` | `number` | No | 처음 보이는 줄 수. @default 5 |
| `style` | `React.CSSProperties` | No | 래퍼 스타일. |

## States

| State | Contract |
| --- | --- |
| error | 박스 아래 오류 설명. 타입 계약: React.ReactNode |
| invalid | 검증 오류용 레드 링. @default false 타입 계약: boolean |
| status | 상태 링과 메시지 톤. @default "normal" 타입 계약: "normal" \| "positive" \| "negative" |
| interaction | 공개 타입 계약에 정의된 속성입니다. 타입 계약: "normal" \| "inactive" \| "hovered" \| "focused" \| "active" \| "active-focused" |
| active | active visual state alias. 타입 계약: boolean |

## Behavior and interaction

- Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ.
- - Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ. - Reference basis: GOV.UK Textarea and Carbon Text area.
- Textarea의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.
- 상태 변화 중에도 accessible name, focus 위치와 레이아웃 기준점을 예고 없이 잃지 않습니다.
- 제품 데이터와 side effect는 callback으로 위임하고 Textarea는 표시·입력 상태만 소유합니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |
| --color-semantic-label-disable | light: rgba(55, 56, 60, 0.52); dark: rgba(174, 176, 182, 0.52) |
| --component-input-font-size | var(--body1-size) |
| --component-input-letter-spacing | var(--body1-spacing) |

## Responsive

- Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ.
- - Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ. - Reference basis: GOV.UK Textarea and Carbon Text area.
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ.
- Reference basis: GOV.UK Textarea and Carbon Text area.
- Textarea — Input의 박스·포커스 헤일로와 맞춘 여러 줄 필드; 세로 리사이즈 가능.
- - Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ. - Reference basis: GOV.UK Textarea and Carbon Text area.

## Accessibility

- Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ.
- - Textarea shares Input's label, required mark, helper/error typography, described-by merge, read-only fill, border, focus ring, and positive/negative status icon. Only multiline height and resize behavior differ. - Reference basis: GOV.UK Textarea and Carbon Text area.
- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Textarea가 소유하는 Selection and Input 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | Textarea가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | 제품별 구현 대신 공개 Textarea API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Textarea의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `AutoComplete` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Combobox` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `FormField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Input` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `SearchField` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Select` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `TagInput` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Textarea label="문의 내용" required rows={5} placeholder="문의하실 내용을 입력해 주세요." />
```

## Tokens and API

### Tokens

- `--color-semantic-label-assistive`
- `--color-semantic-label-disable`
- `--component-input-border-width`
- `--component-input-focus-shadow`
- `--component-input-font-size`
- `--component-input-letter-spacing`
- `--component-input-line-height`
- `--component-input-radius`
- `--component-input-stack-gap`
- `--component-input-text-color`
- `--dur-base`
- `--ease-out`
- `--font-sans`
- `--space-10`
- `--space-3`

### Source contracts

- `components/forms/Textarea.jsx`
- `components/forms/Textarea.d.ts`
- `components/forms/Textarea.prompt.md`
- `stories/FormTextarea.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Textarea prompt contract: `components/forms/Textarea.prompt.md`
- Storybook implementation evidence: `stories/FormTextarea.stories.jsx`
- [GOV.UK Textarea](https://design-system.service.gov.uk/components/textarea/)
- [Carbon Text area](https://carbondesignsystem.com/components/text-area/usage/)
- [SEED Textarea benchmark](https://seed-design.io/components/text-input)
