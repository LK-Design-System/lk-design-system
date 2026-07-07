**Tabs** - WDS underline tab navigation for switching page sections.

```jsx
<Tabs items={[{ value: 'all', label: 'All' }, { value: 'open', label: 'Open' }]} defaultValue="all" />
<Tabs resize="fill" size="large" padding trailingIconButton items={items} />
```

- Use for section or route switching. Use `Category` for chip-like topic navigation.
- WDS axes: `resize` (`hug`/`fill`), `size`, `padding`, `trailingIconButton`, and horizontal `scroll`.
