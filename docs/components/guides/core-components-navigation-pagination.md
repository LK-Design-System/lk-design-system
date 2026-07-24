# Pagination

| Field | Value |
| --- | --- |
| Type | Component decision guide |
| Layer | Core / Navigation |
| Owner | `Pagination` |
| Storybook | `LDS Core/Components/Navigation/Pagination` |
| Source | `../component-content.json#core-components-navigation-pagination` |

검색 결과나 표처럼 전체 개수와 현재 페이지를 알고 앞·뒤 또는 특정 페이지로 이동해야 할 때 적합합니다. 소량의 연속 콘텐츠에서 위치만 알려주려면 Page Indicator를, 더 불러오기 방식의 피드에는 별도 로딩 패턴을 사용하세요.

## 사용 판단

### 사용

- 검색 결과나 표처럼 전체 개수와 현재 페이지를 알고 앞·뒤 또는 특정 페이지로 이동해야 할 때 적합합니다. 소량의 연속 콘텐츠에서 위치만 알려주려면 Page Indicator를, 더 불러오기 방식의 피드에는 별도 로딩 패턴을 사용하세요.
- Use variant="extended" for data tables, compact for narrow surfaces, and minimize when only the current page is needed.
- Use PageIndicator for dot or counter-only page position.
- - Use variant="extended" for data tables, compact for narrow surfaces, and minimize when only the current page is needed. - Use PageIndicator for dot or counter-only page position. - The page-jump input is controlled by the current page: previous/next commands and external page changes immediately synchronize its disp….

### 사용하지 않음

- Pagination가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다.
- 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다.
- 표현이 비슷하다는 이유만으로 상태 의미가 다른 sibling 컴포넌트를 서로 대체하지 않습니다.

## Anatomy

| Part | Contract |
| --- | --- |
| Root | Pagination의 semantic role, layout containment와 전달받은 DOM 속성을 소유합니다. |
| Variant | navigation variant. compact ignores siblingCount and omits the first/last page jump (no leading 1 / trailing count shortcuts or ellipses); minimize shows only the current page. @default "extended" |
| Leading Content | leadingContent 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Trailing Content | trailingContent 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Page Jump Label | pageJumpLabel 속성으로 제공되는 공개 슬롯 또는 표시 영역입니다. |
| Navigation Label | nav landmark accessible name. @default "pagination" |
| Previous Page Label | Previous-page command accessible name. @default "previous page" |
| Next Page Label | Next-page command accessible name. @default "next page" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `page` | `number` | No | Current page, 1-based. @default 1 |
| `count` | `number` | No | Total pages. @default 1 |
| `onChange` | `(page: number) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `siblingCount` | `number` | No | Number of sibling pages around the current page. Only applies to variant="extended"; the compact variant ignores it and always shows a fixed window of up to two pages on each side of the current page. |
| `variant` | `"extended" \| "compact" \| "minimize"` | No | navigation variant. compact ignores siblingCount and omits the first/last page jump (no leading 1 / trailing count shortcuts or ellipses); minimize shows only the current page. @default "extended" |
| `leadingContent` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `trailingContent` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `pageSize` | `number` | No | 공개 타입 계약에 정의된 속성입니다. |
| `pageSizeOptions` | `number[]` | No | 공개 타입 계약에 정의된 속성입니다. |
| `onPageSizeChange` | `(pageSize: number) = void` | No | 공개 타입 계약에 정의된 속성입니다. |
| `showPageJump` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `pageJumpLabel` | `React.ReactNode` | No | 공개 타입 계약에 정의된 속성입니다. |
| `showCounter` | `boolean` | No | 공개 타입 계약에 정의된 속성입니다. |
| `navigationLabel` | `string` | No | nav landmark accessible name. @default "pagination" |
| `previousPageLabel` | `string` | No | Previous-page command accessible name. @default "previous page" |
| `nextPageLabel` | `string` | No | Next-page command accessible name. @default "next page" |
| `pageSizeLabel` | `string` | No | Page-size select accessible name. @default "items per page" |

## States

| State | Contract |
| --- | --- |
| variant | navigation variant. compact ignores siblingCount and omits the first/last page jump (no leading 1 / trailing count shortcuts or ellipses); minimize shows only the current page. @default "extended" 타입 계약: "extended" \| "compact" \| "minimize" |
| 변형·상태 · 이동 방식과 제어 영역 | variants-states 공개 스토리에서 렌더링 및 상호작용 증거를 유지합니다. |

## Behavior and interaction

- Use variant="extended" for data tables, compact for narrow surfaces, and minimize when only the current page is needed.
- The page-jump input is controlled by the current page: previous/next commands and external page changes immediately synchronize its displayed value.
- Localize the landmark and compact icon/select commands with navigationLabel, previousPageLabel, nextPageLabel, and pageSizeLabel; pageJumpLabel labels the visible jump field.
- - Use variant="extended" for data tables, compact for narrow surfaces, and minimize when only the current page is needed. - Use PageIndicator for dot or counter-only page position. - The page-jump input is controlled by the current page: previous/next commands and external page changes immediately synchronize its disp….
- Pagination의 controlled/uncontrolled 경계와 callback 순서는 공개 타입 계약을 따릅니다.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |
| --color-semantic-label-alternative | light: rgba(55, 56, 60, 0.74); dark: rgba(174, 176, 182, 0.74) |
| --color-semantic-label-assistive | light: rgba(55, 56, 60, 0.28); dark: rgba(174, 176, 182, 0.28) |

## Responsive

- Use variant="extended" for data tables, compact for narrow surfaces, and minimize when only the current page is needed.
- Localize the landmark and compact icon/select commands with navigationLabel, previousPageLabel, nextPageLabel, and pageSizeLabel; pageJumpLabel labels the visible jump field.
- - Use variant="extended" for data tables, compact for narrow surfaces, and minimize when only the current page is needed. - Use PageIndicator for dot or counter-only page position. - The page-jump input is controlled by the current page: previous/next commands and external page changes immediately synchronize its disp….
- 320px 좁은 폭과 200% 텍스트 확대에서 페이지 가로 overflow 없이 의미 순서를 유지합니다.

## Content and writing

- Localize the landmark and compact icon/select commands with navigationLabel, previousPageLabel, nextPageLabel, and pageSizeLabel; pageJumpLabel labels the visible jump field.
- - Use variant="extended" for data tables, compact for narrow surfaces, and minimize when only the current page is needed. - Use PageIndicator for dot or counter-only page position. - The page-jump input is controlled by the current page: previous/next commands and external page changes immediately synchronize its disp….
- 사용자에게 보이는 Pagination 문자열은 제품 번역 계층에서 제공하고 행동 또는 상태를 구체적으로 설명합니다.
- 아이콘이나 색상만으로 의미를 대신하지 않고 필요한 label, title 또는 status text를 함께 제공합니다.

## Accessibility

- native semantic을 우선하며 사용자에게 보이는 이름과 접근 가능한 이름이 같은 목적을 설명하게 합니다.
- 키보드 focus 순서, focus-visible 표시와 상태 ARIA가 시각 상태와 동시에 갱신되는지 공개 스토리에서 검증합니다.
- 색상, 모양 또는 아이콘 하나만으로 상태를 구분하지 않고 이름·텍스트·semantic state를 함께 제공합니다.

## Do / Don't

| Kind | Guidance |
| --- | --- |
| Do | Use variant="extended" for data tables, compact for narrow surfaces, and minimize when only the current page is needed. |
| Don't | Pagination가 소유하지 않는 라우팅, 권한, 데이터 요청, 제품 임계값을 컴포넌트 내부에 넣지 않습니다. |
| Do | Use PageIndicator for dot or counter-only page position. |
| Don't | 동일한 목적을 더 단순한 native 요소나 기존 LDS primitive로 해결할 수 있으면 새 조합을 만들지 않습니다. |

## Exceptions

- 제품 정책을 포함해야 하는 예외는 wrapper 또는 제품 저장소에서 조합하고 Pagination의 범용 API에 넣지 않습니다.
- 접근성 또는 안전 계약을 약화하는 예외는 허용하지 않으며 필요한 차이는 prompt와 Storybook 증거에 기록합니다.

## Related components

| Component | Relationship |
| --- | --- |
| `PageIndicator` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Category` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |
| `Tabs` | 대표 시나리오에서 함께 조합되며 각 컴포넌트의 상태 소유권을 유지합니다. |

## Examples

### 기본 조합

```jsx
<Pagination page={page} count={12} onChange={setPage} />
<Pagination variant="compact" page={5} count={23} />
<Pagination pageSize={10} showPageJump showCounter page={1} count={10} />
```

## Tokens and API

### Tokens

- `--body2-size`
- `--color-semantic-background-elevated-normal`
- `--color-semantic-label-alternative`
- `--color-semantic-label-assistive`
- `--color-semantic-label-disable`
- `--color-semantic-label-neutral`
- `--color-semantic-label-normal`
- `--color-semantic-line-solid-normal`
- `--font-sans`
- `--fw-regular`
- `--fw-semibold`
- `--label2-size`
- `--radius-8`
- `--radius-md`

### Source contracts

- `components/navigation/Pagination.jsx`
- `components/navigation/Pagination.d.ts`
- `components/navigation/Pagination.prompt.md`
- `stories/NavigationCompact.stories.jsx`

## Migration

- 현재 prompt와 타입 계약에 기록되지 않은 legacy alias는 새 코드에서 도입하지 않습니다.
- 대체 컴포넌트가 생기면 기존 API의 제거 버전, 대응 prop과 자동·수동 전환 절차를 이 페이지에 기록합니다.

## Sources

- Pagination prompt contract: `components/navigation/Pagination.prompt.md`
- Storybook implementation evidence: `stories/NavigationCompact.stories.jsx`
