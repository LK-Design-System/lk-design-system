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
- Use **selected** (or its **active** alias) for a pinned or selected state, and
  **pressed** to state the `aria-pressed` value explicitly when it differs from
  the visual selection.
- **selectedLabel** is the visually hidden text appended to a *non-interactive*
  selected chip (default `선택됨`); pass `null` to opt out.
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

## Accessibility contract

- **An `onClick` chip is a real `<button>`.** The element default is now
  `onClick ? "button" : "span"`, so a clickable chip is reachable by Tab and
  activated by Enter/Space instead of being a roleless `<span>` that only
  responds to a mouse. An explicit `as` still wins; `as="a"` + `href` keeps link
  semantics. If a consumer forces a non-button element while still passing
  `onClick`, the chip adds `role="button"`, `tabIndex`, and an Enter/Space
  handler by hand.
- **Toggle chips expose `aria-pressed`.** When a chip is interactive *and* a
  toggle state was supplied (`selected`, `active`, or `pressed`), the button
  carries `aria-pressed`, so selection is announced instead of being carried by
  the tinted surface alone.
- **A non-interactive selected chip cannot own `aria-pressed`** — a `<span>`
  with no role must not claim a pressed state. It appends the visually hidden
  `selectedLabel` (`선택됨`) instead, so the selected state still reaches
  assistive tech without changing the rendered visual.
- Reference basis:
  [WAI-ARIA APG Button pattern — toggle buttons](https://www.w3.org/WAI/ARIA/apg/patterns/button/),
  [WCAG 2.2 1.4.1 Use of Colour](https://www.w3.org/TR/WCAG22/#use-of-color),
  [WCAG 2.2 4.1.2 Name, Role, Value](https://www.w3.org/TR/WCAG22/#name-role-value).

## Contrast and state evidence

- [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum)
  sets a 4.5:1 threshold for normal-size text.
- [Carbon Button usage](https://carbondesignsystem.com/components/button/usage/)
  keeps hierarchy in the component treatment and states perceivable. LDS
  applies that conclusion to compact selected controls without copying Carbon
  styling.
- The filled surface, border, check/pressed semantics, and weight preserve the
  selected state without color. No additional marker or variant is introduced.
