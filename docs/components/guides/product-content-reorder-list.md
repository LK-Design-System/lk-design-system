# Reorder List

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Product / Content |
| Owner | `ReorderList` |
| Storybook | `LDS Product/Content/Reorder List` |
| Source | `../component-content.json#product-content-reorder-list` |

대시보드 패널이나 표시 항목처럼 동등한 목록의 순서를 직접 바꿀 때 적합합니다. 단계형 절차나 부모·자식 구조에는 ReorderList 대신 Steps 또는 Tree를 사용하세요.

## 사용 판단

### 사용

- 작업 단계·웨이포인트 저작처럼 번호가 의미인 시퀀스는 StepList를 사용합니다.

## Anatomy

| Part | Contract |
| --- | --- |
| emptyLabel | 항목이 없을 때 표시할 문구. |
| getItemLabel | label이 ReactNode일 때 접근성 라벨을 별도로 지정합니다. |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `items` | `ReorderItem[]` | No |  |
| `onReorder` | `(nextIds: string[], meta: ReorderMeta) = void` | No | 새 id 순서와 이동 메타 정보를 전달합니다. 생략하면 목록은 읽기 전용이며 drag/keyboard/button 이동이 비활성화됩니다. |
| `density` | `'comfortable' \| 'compact'` | No | 행 밀도. @default "comfortable" |
| `showIndex` | `boolean` | No | 순번 열을 표시합니다. @default false |
| `showMoveButtons` | `boolean` | No | 위/아래 이동 버튼을 표시합니다. @default true |
| `disabled` | `boolean` | No | 전체 정렬 조작을 비활성화합니다. @default false |
| `emptyLabel` | `React.ReactNode` | No | 항목이 없을 때 표시할 문구. |
| `getItemLabel` | `(item: ReorderItem, index: number) = string` | No | label이 ReactNode일 때 접근성 라벨을 별도로 지정합니다. |

## States

| State | Contract |
| --- | --- |
| disabled | 전체 정렬 조작을 비활성화합니다. @default false |
| emptyLabel | 항목이 없을 때 표시할 문구. |

## Behavior and interaction

- ReorderList — 대시보드 위젯, 규칙, 큐처럼 같은 레벨의 항목 순서를 바꾸는 범용 sortable list primitive입니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | 끝단에서 포커스를 잃지 않습니다. 항목을 맨 위·맨 아래로 옮기면 방금 누른 이동 버튼이 더 이상 쓸 수 없게 되는데, 이때 native disabled로 바꾸면 포커스가 로 떨어져 키보드 사용자가 위치를 잃습니다. 대신 aria-disabled를 써서 버튼은 포커스를 유지한 채 이동만 거부합니다(APG focusable disabled control 관례). 시각 처리(흐린 배경·not-allowed 커서)는 동일합니다. |
| 명시 규칙 2 | 이동 수단은 세 가지가 모두 있어야 합니다: 드래그, 문맥명이 붙은 위/아래 버튼("{항목} 위로 이동"), 그리고 행에서 Alt+↑/↓(WCAG 2.5.7 — 드래그 대체 수단). |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-fill-alternative | light: rgba(112, 115, 124, 0.05); dark: rgba(112, 115, 124, 0.12) |
| --color-semantic-fill-normal | light: rgba(112, 115, 124, 0.08); dark: rgba(112, 115, 124, 0.22) |

## Content and writing

- items {id,label,detail,trailing,disabled}[].

## Accessibility

- onReorder가 없으면 조작 가능한 no-op 상태를 만들지 않고 행 drag, keyboard 이동, 이동 버튼을 읽기 전용으로 전환합니다. trailing control은 독립적으로 계속 사용할 수 있습니다.
- density comfortable|compact · showIndex(순번 열) · showMoveButtons(위/아래 버튼) · disabled(전체 잠금) · emptyLabel(빈 목록 문구) · getItemLabel(item, index)(label이 ReactNode일 때 접근성 라벨).
- Compare against common reorderable-list expectations before changing it: drag reorder, button fallback, keyboard reorder, disabled rows, empty state, live movement announcement, stable item ids, and clear drop indicator.
- 이동 결과는 role="status" polite 영역이 "{항목} N/M 위치로 이동"으로 공지하고, 조작법은 숨김 안내문을 aria-describedby로 각 행에 연결해 알립니다. 각 행은 aria-posinset/aria-setsize로 위치와 전체 개수를 노출합니다.
- role prop은 ul 기본 시맨틱을 대체할 때만 쓰고, 목록 의미를 잃는 값(예: presentation)은 주지 마세요. 목록 이름은 aria-label로 지정합니다(기본 "정렬 가능한 목록").

## Related components

| Component | Relationship |
| --- | --- |
| `ConnectionRow` | 대표 시나리오에서 조합 |
| `ContentEditor` | 대표 시나리오에서 조합 |
| `ExpandableText` | 대표 시나리오에서 조합 |
| `LogViewer` | 대표 시나리오에서 조합 |
| `ReactionBar` | 대표 시나리오에서 조합 |
| `RecordHeader` | 대표 시나리오에서 조합 |
| `SourceDisclosure` | 대표 시나리오에서 조합 |
| `StatList` | 대표 시나리오에서 조합 |

## Examples

### 기본 조합

```jsx
<ReorderList items={panels} onReorder={setOrder} />
<ReorderList items={panels} showIndex density="compact" showMoveButtons={false} onReorder={setOrder} />
```

## Tokens and API

### Tokens

- `--color-semantic-background-elevated-normal`
- `--color-semantic-fill-alternative`
- `--color-semantic-fill-normal`
- `--color-semantic-focus-indicator`
- `--color-semantic-label-assistive`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-normal-normal`
- `--color-semantic-primary-normal`
- `--color-semantic-primary-surface-normal`
- `--dur-fast`
- `--ease-out`
- `--font-sans`
- `--fw-medium`
- `--fw-semibold`
- `--label1-line`
- `--label1-size`
- `--label2-line`
- `--label2-size`
- `--radius-md`
- `--radius-sm`
- `--space-0-5`
- `--space-1-5`
- `--space-2-5`

### Source contracts

- `components/content/ReorderList.jsx`
- `components/content/ReorderList.d.ts`
- `components/content/ReorderList.prompt.md`
- `stories/ContentReorderList.stories.jsx`

## Sources

- ReorderList prompt contract: `components/content/ReorderList.prompt.md`
- Storybook implementation evidence: `stories/ContentReorderList.stories.jsx`
