# Bookmark

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Action |
| Owner | `Bookmark` |
| Storybook | `LDS Product/Action/Bookmark` |
| Source | `../component-content.json#product-action-bookmark` |

카드·목록·문서의 trailing action에서 한 항목을 저장하거나 저장 해제할 때 적합합니다. 일회성 실행이나 여러 항목의 폼 선택에는 Bookmark 대신 Button 또는 Checkbox를 사용하세요.

## 사용 판단

### 사용

- 카드·목록·문서의 trailing action에서 한 항목을 저장하거나 저장 해제할 때 적합합니다. 일회성 실행이나 여러 항목의 폼 선택에는 Bookmark 대신 Button 또는 Checkbox를 사용하세요.
- Bookmark가 소유하는 Action 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다.
- 제품별 구현 대신 공개 Bookmark API와 semantic token으로 일관성을 유지해야 할 때 사용합니다.

### 사용하지 않음

- label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다.
- APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다.
- - active / defaultActive / onChange(next) — 제어/비제어. size — 글리프 px. disabled — 비활성. - label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다. - ListCell / Card의 트레일링 어포던스로 잘 어울립니다.
- - APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다. - 기본 이름은 한국어입니다. 영어 소문자 "bookmark"처럼 대상을 특정하지 못하는 범용 라벨은 쓰지 않습니다. - 눌림 축소(scale 0.86)는 React 상태이며 포인터와 Enter/Space에 동일하게 적용됩니다(현재 값은 data-pressed). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠….

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Bookmark의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Label | 저장 대상의 이름. 접근 이름이 "{label} 북마크"가 됩니다(미지정 시 북마크). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `active` | `boolean` | No | 제어되는 저장 상태. |
| `defaultActive` | `boolean` | No | 비제어 초기 상태. @default false |
| `onChange` | `(next: boolean) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `size` | `number` | No | 글리프 크기(px). @default 24 |
| `disabled` | `boolean` | No | 비활성(흐림, 상호작용 불가). @default false |
| `label` | `string` | No | 저장 대상의 이름. 접근 이름이 "{label} 북마크"가 됩니다(미지정 시 북마크). |

## States

| State | Contract |
| --- | --- |
| active | 제어되는 저장 상태. 타입 계약: boolean |
| defaultActive | 비제어 초기 상태. @default false 타입 계약: boolean |
| disabled | 비활성(흐림, 상호작용 불가). @default false 타입 계약: boolean |

## Behavior and interaction

- active / defaultActive / onChange(next) — 제어/비제어. size — 글리프 px. disabled — 비활성.
- APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다.
- 눌림 축소(scale 0.86)는 React 상태이며 포인터와 Enter/Space에 동일하게 적용됩니다(현재 값은 data-pressed). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠지지 않습니다.
- - active / defaultActive / onChange(next) — 제어/비제어. size — 글리프 px. disabled — 비활성. - label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다. - ListCell / Card의 트레일링 어포던스로 잘 어울립니다.
- - APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다. - 기본 이름은 한국어입니다. 영어 소문자 "bookmark"처럼 대상을 특정하지 못하는 범용 라벨은 쓰지 않습니다. - 눌림 축소(scale 0.86)는 React 상태이며 포인터와 Enter/Space에 동일하게 적용됩니다(현재 값은 data-pressed). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠….

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 눌림 축소(scale 0.86)는 React 상태이며 포인터와 Enter/Space에 동일하게 적용됩니다(현재 값은 data-pressed). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠지지 않습니다. |
| 명시 규칙 2 | - APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다. - 기본 이름은 한국어입니다. 영어 소문자 "bookmark"처럼 대상을 특정하지 못하는 범용 라벨은 쓰지 않습니다. - 눌림 축소(scale 0.86)는 React 상태이며 포인터와 Enter/Space에 동일하게 적용됩니다(현재 값은 data-pressed). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠… |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |

## Responsive

- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.
- 고정 폭보다 부모 containment와 wrapping을 우선하고, 제품이 필요할 때 명시적으로 compact 표현을 선택합니다.

## Content and writing

- label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다.
- APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다.
- 기본 이름은 한국어입니다. 영어 소문자 "bookmark"처럼 대상을 특정하지 못하는 범용 라벨은 쓰지 않습니다.
- - active / defaultActive / onChange(next) — 제어/비제어. size — 글리프 px. disabled — 비활성. - label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다. - ListCell / Card의 트레일링 어포던스로 잘 어울립니다.

## Accessibility

- label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다.
- APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다.
- 눌림 축소(scale 0.86)는 React 상태이며 포인터와 Enter/Space에 동일하게 적용됩니다(현재 값은 data-pressed). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠지지 않습니다.
- - active / defaultActive / onChange(next) — 제어/비제어. size — 글리프 px. disabled — 비활성. - label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다. - ListCell / Card의 트레일링 어포던스로 잘 어울립니다.
- - APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다. - 기본 이름은 한국어입니다. 영어 소문자 "bookmark"처럼 대상을 특정하지 못하는 범용 라벨은 쓰지 않습니다. - 눌림 축소(scale 0.86)는 React 상태이며 포인터와 Enter/Space에 동일하게 적용됩니다(현재 값은 data-pressed). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠….

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Bookmark가 소유하는 Action 의미와 상태를 여러 제품 화면에서 동일하게 재사용할 때 사용합니다. |
| Don't | label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다. |
| Do | 제품별 구현 대신 공개 Bookmark API와 semantic token으로 일관성을 유지해야 할 때 사용합니다. |
| Don't | APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Bookmark의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Bubble` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Bookmark label="야간 순찰 경로" defaultActive />
<Bookmark label="점검 보고서" active={saved} onChange={setSaved} size={20} />
```

## Tokens and API

### Tokens

- `--color-semantic-label-assistive`
- `--color-semantic-primary-normal`
- `--dur-fast`
- `--ease-out`

### Source contracts

- `components/content/Bookmark.jsx`
- `components/content/Bookmark.d.ts`
- `components/content/Bookmark.prompt.md`
- `stories/ActionBookmark.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Bookmark prompt contract: `components/content/Bookmark.prompt.md`
- Storybook implementation evidence: `stories/ActionBookmark.stories.jsx`
