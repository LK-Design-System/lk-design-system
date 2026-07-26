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

- Use PageIndicator for dot or counter-only page position.

## Anatomy

| Part | Contract |
| --- | --- |
| variant | navigation variant. compact ignores siblingCount and omits the first/last page jump (no leading 1 / trailing count shortcuts or ellipses); minimize shows only the current page. @default "extended" |
| navigationLabel | nav landmark accessible name. @default "pagination" |
| previousPageLabel | Previous-page command accessible name. @default "previous page" |
| nextPageLabel | Next-page command accessible name. @default "next page" |
| pageSizeLabel | Page-size select accessible name. @default "items per page" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `page` | `number` | No | Current page, 1-based. @default 1 |
| `count` | `number` | No | Total pages. @default 1 |
| `onChange` | `(page: number) = void` | No |  |
| `siblingCount` | `number` | No | Number of sibling pages around the current page. Only applies to variant="extended"; the compact variant ignores it and always shows a fixed window of up to two pages on each side of the current page. |
| `variant` | `"extended" \| "compact" \| "minimize"` | No | navigation variant. compact ignores siblingCount and omits the first/last page jump (no leading 1 / trailing count shortcuts or ellipses); minimize shows only the current page. @default "extended" |
| `leadingContent` | `React.ReactNode` | No |  |
| `trailingContent` | `React.ReactNode` | No |  |
| `pageSize` | `number` | No |  |
| `pageSizeOptions` | `number[]` | No |  |
| `onPageSizeChange` | `(pageSize: number) = void` | No |  |
| `showPageJump` | `boolean` | No |  |
| `pageJumpLabel` | `React.ReactNode` | No |  |
| `showCounter` | `boolean` | No |  |
| `navigationLabel` | `string` | No | nav landmark accessible name. @default "pagination" |
| `previousPageLabel` | `string` | No | Previous-page command accessible name. @default "previous page" |
| `nextPageLabel` | `string` | No | Next-page command accessible name. @default "next page" |
| `pageSizeLabel` | `string` | No | Page-size select accessible name. @default "items per page" |

## States

| State | Contract |
| --- | --- |
| variant | navigation variant. compact ignores siblingCount and omits the first/last page jump (no leading 1 / trailing count shortcuts or ellipses); minimize shows only the current page. @default "extended" |

## Behavior and interaction

- The page-jump input is controlled by the current page: previous/next commands and external page changes immediately synchronize its displayed value.

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

## Related components

| Component | Relationship |
| --- | --- |
| `PageIndicator` | 대표 시나리오에서 조합 |
| `Category` | 대표 시나리오에서 조합 |
| `Tabs` | 대표 시나리오에서 조합 |

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
- `--space-1-5`

### Source contracts

- `components/navigation/Pagination.jsx`
- `components/navigation/Pagination.d.ts`
- `components/navigation/Pagination.prompt.md`
- `stories/NavigationCompact.stories.jsx`

## Sources

- Pagination prompt contract: `components/navigation/Pagination.prompt.md`
- Storybook implementation evidence: `stories/NavigationCompact.stories.jsx`
