**Divider** separates layout regions or inline groups using the WDS Layout/Divider primitive.

```jsx
<Divider />
<Divider variant="thick" />
<span>A</span><Divider vertical /><span>B</span>
```

- Use `variant="normal"` for hairline separation and `variant="thick"` for stronger section breaks.
- Use `vertical` only inside horizontal groups where the parent controls height.
- Use `label` for "or" style separators between equivalent actions.
