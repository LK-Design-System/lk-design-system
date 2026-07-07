# Icon

Use `Icon` for every product glyph before introducing a new drawing.

## Source

- The base registry is imported from Wanted Design System Community icon exports.
- Normal and navigation icons are normalized to `currentColor`.
- Color brand icons keep their original WDS fills and are exposed with the `color-` prefix.
- LK Robotics-only glyphs remain as a small extension set when WDS has no matching asset.

## Usage

```jsx
import { Icon } from '@lk-robotics/design-system-core';

<Icon name="search" />
<Icon name="route" color="var(--color-primary)" />
<Icon name="color-logo-kakao" size={32} />
```

## Rules

- Check `ICON_NAMES` first. Do not hand-draw an inline SVG for a common action, status, editor, navigation, or brand glyph.
- Use semantic names from the registry instead of inventing local aliases.
- Prefer WDS icons for general UI. Use LK Robotics extension icons only for robotics-specific concepts such as robot, route, waypoint, LiDAR, battery, or joystick.
- Monochrome icons inherit `currentColor`; set color on the parent or with the `color` prop.
- Icon-only controls must provide an accessible label through the wrapping control or `aria-label`.
- New icons must be added to the source icon inventory and regenerated with `scripts/generate-icons.mjs`; do not edit `Icon.jsx` by hand.

## Evidence

- Source assets: `assets/icons/*.svg`
- Inventory: `assets/icons/manifest.json`
- Public registry: `components/icon/Icon.jsx`
- Storybook: `stories/Iconography.stories.jsx`
