**Chip** is the WDS Action/Chip primitive for compact labels, links, and
selected tags. LDS keeps the action role while mapping hover and selected
visuals through LK theme tokens.

```jsx
<Chip>Autonomy</Chip>
<Chip selected>EO/IR</Chip>
<Chip size="xs">XS</Chip>
<Chip variant="solid">Solid</Chip>
<Chip variant="outlined">Outlined</Chip>
<Chip leading={<Icon name="filter" size={14} />}>Filtered</Chip>
<Chip as="a" href="product.html?p=LKR-CP">LKR-CP</Chip>
```

- **size**: `xs`, `sm`, `md`, `lg`; these map to the WDS
  xsmall/small/medium/large axis.
- **variant**: `default`, `solid`, `outlined`.
- Use **selected** for a pinned or selected state.
- Use **disabled** for an unavailable action chip.
- Use **leading** for icon content and **thumbnail** for compact media content.
- Use **as="a"** with **href** for linked chips.
- Keep filtering and multi-select state in selection components when the chip
  is acting as an input control rather than a simple action/tag.
