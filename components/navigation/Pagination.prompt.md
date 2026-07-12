**Pagination** - WDS numbered page navigation with chevrons and optional slots.

```jsx
<Pagination page={page} count={12} onChange={setPage} />
<Pagination variant="compact" page={5} count={23} />
<Pagination pageSize={10} showPageJump showCounter page={1} count={10} />
```

- Use `variant="extended"` for data tables, `compact` for narrow surfaces, and `minimize` when only the current page is needed.
- Use `PageIndicator` for dot or counter-only page position.
- The page-jump input is controlled by the current `page`: previous/next commands and external page changes immediately synchronize its displayed value.
- Localize the landmark and compact icon/select commands with `navigationLabel`, `previousPageLabel`, `nextPageLabel`, and `pageSizeLabel`; `pageJumpLabel` labels the visible jump field.
