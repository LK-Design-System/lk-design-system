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
| variant | navigation variant. compact ignores siblingCount and pins a 7-item constant window with first/last pages always reachable; block lists every page of the current fixed block (blockSize pages) with double-chevron block jumps; minimize shows only the current page. |
| firstPageLabel | First-page command accessible name (showFirstLast). @default "first page" |
| lastPageLabel | Last-page command accessible name (showFirstLast). @default "last page" |
| navigationLabel | nav landmark accessible name. @default "pagination" |
| previousPageLabel | Previous-page command accessible name. @default "previous page" |
| nextPageLabel | Next-page command accessible name. @default "next page" |
| previousBlockLabel | Previous-block command accessible name (variant="block"). @default "previous pages" |

## Properties

| Name | Type | Required | Contract |
| --- | --- | --- | --- |
| `page` | `number` | No | Current page, 1-based. @default 1 |
| `count` | `number` | No | Total pages. @default 1 |
| `onChange` | `(page: number) = void` | No |  |
| `siblingCount` | `number` | No | Number of sibling pages around the current page. Only applies to variant="extended", which renders a constant-length window (2 siblingCount + 5 items including first/last pages and ellipsis slots) so page numbers never shift position between clicks; every page is listed without ellipses while count is within one page of the window, so an ellipsis never hides fewer than two pages. The compact variant ignores it and pins a 7-item window; block and minimize ignore it entirely. |
| `variant` | `"extended" \| "compact" \| "block" \| "minimize"` | No | navigation variant. compact ignores siblingCount and pins a 7-item constant window with first/last pages always reachable; block lists every page of the current fixed block (blockSize pages) with double-chevron block jumps; minimize shows only the current page. |
| `blockSize` | `number` | No | Pages per fixed block. Only applies to variant="block". |
| `leadingContent` | `React.ReactNode` | No |  |
| `trailingContent` | `React.ReactNode` | No |  |
| `pageSize` | `number` | No |  |
| `pageSizeOptions` | `number[]` | No |  |
| `onPageSizeChange` | `(pageSize: number) = void` | No |  |
| `showPageJump` | `boolean` | No | Opt-in quick-jump number input. Only worth its footprint on large page counts where walking the number list is slow. @default false |
| `pageJumpLabel` | `React.ReactNode` | No |  |
| `showCounter` | `boolean` | No | Opt-in n / total counter. Use where the total page count is not already on screen (block, minimize); extended/compact always render the last page number, so a counter there duplicates it. |
| `showFirstLast` | `boolean` | No | Opt-in « / » first/last-page jump commands framing the single chevrons (« ‹ 1 2 3 › »). Applies to every variant except block, whose double chevrons already jump by block. @default false |
| `firstPageLabel` | `string` | No | First-page command accessible name (showFirstLast). @default "first page" |
| `lastPageLabel` | `string` | No | Last-page command accessible name (showFirstLast). @default "last page" |
| `navigationLabel` | `string` | No | nav landmark accessible name. @default "pagination" |
| `previousPageLabel` | `string` | No | Previous-page command accessible name. @default "previous page" |
| `nextPageLabel` | `string` | No | Next-page command accessible name. @default "next page" |
| `previousBlockLabel` | `string` | No | Previous-block command accessible name (variant="block"). @default "previous pages" |
| `nextBlockLabel` | `string` | No | Next-block command accessible name (variant="block"). @default "next pages" |
| `pageSizeLabel` | `string` | No | Page-size select accessible name. @default "items per page" |

## States

| State | Contract |
| --- | --- |
| variant | navigation variant. compact ignores siblingCount and pins a 7-item constant window with first/last pages always reachable; block lists every page of the current fixed block (blockSize pages) with double-chevron block jumps; minimize shows only the current page. |

## Behavior and interaction

- The page-jump input is controlled by the current page: previous/next commands and external page changes immediately synchronize its displayed value.

## 정량 규칙

| Subject | Rule |
| --- | --- |
| 명시 규칙 1 | extended and compact render a constant-length window (11 items by default for extended via siblingCount=3; 7 items pinned for compact) with the first and last pages always reachable. |
| 명시 규칙 2 | block lists every page of the current fixed block (blockSize, default 10) fully clickable; numbers never move while the user stays inside a block. Single chevrons move one page, double chevrons jump to the first page of the adjacent block. |
| 명시 규칙 3 | showFirstLast adds « / » first/last-page jumps framing the single chevrons (« ‹ 1 2 3 › ») on every variant except block, whose double chevrons already jump by block. First/last pages are always reachable through the number list in extended/compact, so this is an opt-in convenience for long lists (cf. |
| --body2-size | 15px |
| --color-semantic-background-elevated-normal | light: #FFFFFF; dark: #212225 |

## Responsive

- Use variant="extended" for data tables, compact for narrow surfaces, block for board/list surfaces that follow the Korean fixed-block convention, and minimize when only the current page is needed.
- showCounter and showPageJump are opt-in refinements, not defaults. The n / total counter only earns its place where the total page count is not already on screen — block (the current block hides the last page) and minimize — since extended/compact always render the last page number; stacking a counter next to a full…
- Localize the landmark and compact icon/select commands with navigationLabel, previousPageLabel, nextPageLabel, previousBlockLabel, nextBlockLabel, firstPageLabel, lastPageLabel, and pageSizeLabel; pageJumpLabel labels the visible jump field.

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
<Pagination variant="block" page={13} count={42} onChange={setPage} />
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
