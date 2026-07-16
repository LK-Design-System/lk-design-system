// Direction / orientation vector glyphs shared across the Navigation renderers.
// Internal `_`-prefixed module: geometry-only string constants, imported by the
// renderers but never exported from the public entry.
//
// The filled direction chevron is the compact "direction of travel / heading"
// marker painted on a path — lane mid-direction, route direction, trajectory
// heading. Its area centroid is the local origin — (-2 - 2 + 4) / 3 = 0 — so it
// sits on the path anchor after rotation.
export const NAVIGATION_DIRECTION_PATH = 'M -2 -3.4 L 4 0 L -2 3.4 Z';

// The lane endpoint orientation arrow is an OPEN line + arrowhead marking which
// way a lane faces at its terminus. That is a different role from the filled
// direction chevron (endpoint facing vs travel direction), so it is kept as its
// own glyph and deliberately NOT unified with the chevron.
export const NAVIGATION_ENDPOINT_ARROW = 'M -5 0 H 5 M 2 -3 L 5 0 L 2 3';
