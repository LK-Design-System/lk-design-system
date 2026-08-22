**Toolbar** — 그룹화된 컨트롤(아이콘 버튼, 토글)을 위한 가로 컨테이너.

container gap/padding은 expression-profile token을 사용합니다. `ops`는 chrome만 좁히고
자식 control의 명시적 size, roving Tab stop, 방향키 축과 semantic role은 바꾸지 않습니다.

```jsx
<Toolbar>
  <IconButton variant="ghost" label="undo"><Icon name="arrow-left" /></IconButton>
  <Divider vertical />
  <ToggleButton icon={<Icon name="location" size={18} />} />
</Toolbar>
```

## Keyboard contract

- `orientation` selects the ArrowLeft/ArrowRight or ArrowUp/ArrowDown navigation
  axis. Home and End move to the first and last available item.
- `itemSelector` scopes the toolbar-owned controls. Nested toolbars are excluded
  from the outer sequence.
- `preferredItemKey` selects the initial roving Tab stop by
  `data-lk-toolbar-key`; otherwise the first available item is used.
- `includeAriaDisabledItems` keeps `aria-disabled` controls in the Arrow-key
  sequence when a product needs them to remain discoverable. Native disabled
  controls are always skipped.
- `stopNavigationPropagation` prevents handled toolbar navigation keys from
  reaching a surrounding editor or viewport shortcut layer.
- The toolbar exposes exactly one enabled `tabIndex={0}` item and repairs focus
  when children are inserted, removed, disabled, or reordered.

- 그룹은 `<Divider vertical />`로 구분하세요. 헤어라인 + 부드러운 엘리베이션.
