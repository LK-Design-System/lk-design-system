# Bookmark

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Action |
| Owner | `Bookmark` |
| Storybook | `LDS Product/Action/Bookmark` |
| Source | `../component-content.json#product-action-bookmark` |

카드·목록·문서의 trailing action에서 한 항목을 저장하거나 저장 해제할 때 적합합니다. 일회성 실행이나 여러 항목의 폼 선택에는 Bookmark 대신 Button 또는 Checkbox를 사용하세요.

## Anatomy

| Part | Contract |
| --- | --- |
| label | 저장 대상의 이름. 접근 이름이 "{label} 북마크"가 됩니다(미지정 시 북마크). |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `active` | `boolean` | No | 제어되는 저장 상태. |
| `defaultActive` | `boolean` | No | 비제어 초기 상태. @default false |
| `onChange` | `(next: boolean) = void` | No |  |
| `size` | `number` | No | 글리프 크기(px). @default 24 |
| `disabled` | `boolean` | No | 비활성(흐림, 상호작용 불가). @default false |
| `label` | `string` | No | 저장 대상의 이름. 접근 이름이 "{label} 북마크"가 됩니다(미지정 시 북마크). |

## States

| State | Contract |
| --- | --- |
| active | 제어되는 저장 상태. |
| defaultActive | 비제어 초기 상태. @default false |
| disabled | 비활성(흐림, 상호작용 불가). @default false |

## Behavior and interaction

- active / defaultActive / onChange(next) — 제어/비제어. size — 글리프 px. disabled — 비활성.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 눌림 축소(scale 0.86)는 React 상태이며 포인터와 Enter/Space에 동일하게 적용됩니다(현재 값은 data-pressed). DOM style을 직접 만지지 않으므로 포커스를 잃거나 키보드에서 피드백이 빠지지 않습니다. |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |
| --color-semantic-primary-normal | light: #3878B3; dark: #5390C9 |

## Content and writing

- 기본 이름은 한국어입니다. 영어 소문자 "bookmark"처럼 대상을 특정하지 못하는 범용 라벨은 쓰지 않습니다.

## Accessibility

- label — 저장 대상의 이름. 접근 이름은 "{label} 북마크"가 되고, 지정하지 않으면 북마크입니다. 목록에서 여러 개를 쓸 때는 항목마다 지정해 같은 이름이 반복되지 않게 하세요. aria-label을 직접 주면 그 값이 우선합니다.
- APG toggle button입니다. 이름은 상태에 따라 바뀌지 않고(저장↔저장 해제로 스왑하지 않음), 저장 여부는 aria-pressed만 전달합니다. 아이콘은 aria-hidden이라 채움은 시각 신호로만 쓰입니다.

## Related components

| Component | Relationship |
| --- | --- |
| `Bubble` | 대표 시나리오에서 조합 |

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

## Sources

- Bookmark prompt contract: `components/content/Bookmark.prompt.md`
- Storybook implementation evidence: `stories/ActionBookmark.stories.jsx`
