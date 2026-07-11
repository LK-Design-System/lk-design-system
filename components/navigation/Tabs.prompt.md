**Tabs** - WDS underline tab navigation for switching page sections.

```jsx
<Tabs items={[{ value: 'all', label: 'All' }, { value: 'open', label: 'Open' }]} defaultValue="all" />
<Tabs resize="fill" size="large" padding trailingIconButton items={items} />
```

- Use for section or route switching. Use `Category` for chip-like topic navigation.
- WDS axes: `resize` (`hug`/`fill`), `size`, `padding`, `trailingIconButton`, and horizontal `scroll`.
- The selected tab is the single Tab stop. Left/Right, Home, and End move focus and activate the next enabled tab, following the [WAI-ARIA Tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).
- When used as `CanvasEditorShell.responsiveNavigation`, tabs switch only the narrow-screen region (`canvas`, `layers`, `panel`). Workspace modes that change tools and document behavior remain in `subheader`.
