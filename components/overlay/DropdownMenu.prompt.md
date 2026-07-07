**DropdownMenu** - WDS anchored menu popover.

```jsx
<DropdownMenu trigger={<Button>Open</Button>} items={[{ label: 'Copy' }, { divider: true }, { label: 'Delete', danger: true }]} />
<DropdownMenu variant="checkbox" menuActionArea items={[{ label: 'Option', checked: true }]} />
```

- Use for trigger-bound command menus. Use `Menubar` for a horizontal application menu.
- WDS axes: `variant` (`normal`, `radio`, `checkbox`), `menuActionArea`, and scroll via `maxHeight`.
