**Pagination** - WDS numbered page navigation with chevrons and optional slots.

```jsx
<Pagination page={page} count={12} onChange={setPage} />
<Pagination variant="compact" page={5} count={23} />
<Pagination variant="block" page={13} count={42} onChange={setPage} />
<Pagination pageSize={10} showPageJump showCounter page={1} count={10} />
```

- Use `variant="extended"` for data tables, `compact` for narrow surfaces, `block` for board/list surfaces that follow the Korean fixed-block convention, and `minimize` when only the current page is needed.
- `extended` and `compact` render a constant-length window (11 items by default for extended via `siblingCount=3`; 7 items pinned for compact) with the first and last pages always reachable. The window length never changes with position, so page numbers do not shift under the pointer between clicks; when `count` is within one page of the window every page is listed with no ellipsis, so an ellipsis never appears just to hide one or two trailing pages. LDS decision grounded in KRDS Pagination (max 11 items, 7 on narrow screens; first/last always reachable — https://www.krds.go.kr/html/site/component/component_03_06.html) and the pagination UX pattern guidance on stable, predictable page targets (https://uxpatterns.dev/patterns/navigation/pagination). The pre-2026-08 sliding window (siblingCount=1, variable 5–9 items) ellipsized even 8–10 page sets and re-centered on every click; it was replaced for this reason.
- `block` lists every page of the current fixed block (`blockSize`, default 10) fully clickable; numbers never move while the user stays inside a block. Single chevrons move one page, double chevrons jump to the first page of the adjacent block. This mirrors the dominant Korean portal/board convention (fixed 10-page blocks) while keeping KRDS's "first/last always reachable" requirement via block jumps.
- Use `PageIndicator` for dot or counter-only page position.
- `showCounter` and `showPageJump` are opt-in refinements, not defaults. The `n / total` counter only earns its place where the total page count is not already on screen — `block` (the current block hides the last page) and `minimize` — since `extended`/`compact` always render the last page number; stacking a counter next to a full number list duplicates information (cf. Ant Design's `showTotal`, which adds the *item* total instead). The page-jump input follows the enterprise quick-jumper pattern and is only worth its footprint on large page counts where walking the number list is slow; omit it for small sets.
- The page-jump input is controlled by the current `page`: previous/next commands and external page changes immediately synchronize its displayed value.
- `showFirstLast` adds `«` / `»` first/last-page jumps framing the single chevrons (`« ‹ 1 2 3 › »`) on every variant except `block`, whose double chevrons already jump by block. First/last pages are always reachable through the number list in `extended`/`compact`, so this is an opt-in convenience for long lists (cf. MUI `showFirstButton`/`showLastButton`; KRDS lists first/last commands as optional elements).
- Localize the landmark and compact icon/select commands with `navigationLabel`, `previousPageLabel`, `nextPageLabel`, `previousBlockLabel`, `nextBlockLabel`, `firstPageLabel`, `lastPageLabel`, and `pageSizeLabel`; `pageJumpLabel` labels the visible jump field.
