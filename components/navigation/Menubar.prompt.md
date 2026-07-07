**Menubar** - WDS horizontal menu bar for grouped commands.

```jsx
<Menubar menus={[{ label: 'File', items: [{ label: 'New' }, { label: 'Open', shortcut: '⌘O' }] }]} />
```

- Use for command groups. Menu items support normal, radio, checkbox, disabled, danger, divider, description, and shortcut states.
- WDS axes: `variant`, `menuActionArea`, and scroll via `maxHeight`.
