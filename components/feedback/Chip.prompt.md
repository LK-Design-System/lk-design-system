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
- Selected text uses the current theme's normal label foreground. The tinted
  surface, accent border, and pressed/selected semantics carry selection, so
  selection does not depend on blue text alone.
- Use **disabled** for an unavailable action chip.
- Use **leading** for icon content and **thumbnail** for compact media content.
- Use **as="a"** with **href** for linked chips.
- Keep filtering and multi-select state in selection components when the chip
  is acting as an input control rather than a simple action/tag.
- Chip is for interactive/selectable keywords. Use `Tag` for uppercase display
  eyebrow pills and `ContentBadge` for non-interactive informational content
  labels.

## Contrast and state evidence

- [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)
  sets a 4.5:1 threshold for normal-size text.
- [Carbon Button usage](https://carbondesignsystem.com/components/button/usage/)
  keeps hierarchy in the component treatment and states perceivable. LDS
  applies that conclusion to compact selected controls without copying Carbon
  styling.
- The filled surface, border, check/pressed semantics, and weight preserve the
  selected state without color. No additional marker or variant is introduced.
