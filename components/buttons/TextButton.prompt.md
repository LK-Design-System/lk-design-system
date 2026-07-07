**TextButton** is the WDS Action/Text Button primitive for low-emphasis text
actions. Use it for inline links, card footers, secondary dismissals, and
compact "more" actions.

```jsx
<TextButton>View all</TextButton>
<TextButton tone="neutral" underline>Cancel</TextButton>
<TextButton loading loadingLabel="Loading more">Loading</TextButton>
<TextButton as="a" href="/products">View products</TextButton>
```

- **tone**: `signal`, `neutral`, `danger`.
- **size**: `sm`, `md`, `lg`.
- **underline** gives link-style emphasis; **as="a"** renders a link.
- **loading** prevents repeated activation, renders a spinner, and sets
  `aria-busy`; use **loadingLabel** for screen-reader context.
- **arrow** is deprecated and remains as a no-op compatibility prop.
- Use `Button` for filled CTAs and `IconButton` for icon-only actions.
