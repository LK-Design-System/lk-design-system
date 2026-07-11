**Button** is the WDS Action/Button primitive for primary, secondary, and
supporting actions. LDS keeps WDS action roles but maps visual values through
LK theme tokens.

```jsx
<Button variant="primary">Request quote</Button>
<Button variant="signal" size="lg">View product</Button>
<Button variant="danger">Emergency stop request</Button>
<Button variant="ghost">Details</Button>
<Button variant="on-dark">Learn more</Button>
<Button loading loadingLabel="Saving">Saving</Button>
<Button as="a" href="contact.html" variant="primary" full>Contact</Button>
```

- **variant**: `primary`, `secondary`, `signal`, `dark`, `flat`, `ghost`,
  `on-dark`. `danger` is an explicit LDS safety extension, not a WDS parity axis.
- **size**: `sm`, `md`, `lg`.
- **full**: fills the container width.
- **loading**: prevents repeated activation, renders a spinner, and sets
  `aria-busy`; use **loadingLabel** for screen-reader context.
- **as="a"** renders a link CTA while preserving Button styling.
- **arrow** is deprecated and remains as a no-op compatibility prop.
- Use `IconButton` for icon-only one-shot actions and `ToggleIcon` for
  icon-only persistent state actions.
