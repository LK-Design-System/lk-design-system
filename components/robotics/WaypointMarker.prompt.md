# WaypointMarker

Classification: **LK Robotics Extension**. `WaypointMarker` is the SVG reference renderer for one point in a navigation graph. It is not WDS parity and it is not a route, trajectory, region, lift cabin, or application screen.

```jsx
<svg role="group" aria-label="1층 내비게이션 그래프">
  <WaypointMarker
    waypoint={{
      id: 'wp-lift-a',
      label: 'Lift A approach',
      mapId: 'L1',
      position: { x: 120, y: 80 },
      roles: ['holding', 'parking'],
      annotations: [
        { kind: 'lift-approach', label: 'Lift A approach', sourceId: 'lift-a' },
        { kind: 'mutex', label: 'Lift A lobby mutex' },
      ],
      availability: 'available',
    }}
    viewportScale={viewport.z}
    selected={selectedId === 'wp-lift-a'}
    onActivate={setSelectedId}
  />
</svg>
```

## Contract

- `WaypointData` stays serializable and renderer-neutral: identity, map identity, world-space position, independent roles, annotations, and explicit availability only. DOM nodes, canvas handles, callbacks, and product commands do not belong in the data object.
- `roles` is an array because `holding`, `passthrough`, `parking`, and `charger` are independent graph properties. Do not collapse them into a mutually exclusive `kind` or silently choose one role when several are present.
- `annotations` is separate from graph roles. Each item keeps a constrained `kind`, a product-provided `label`, and an optional `sourceId` for traceability. `dock`, `cleaning`, `dispenser`, `ingestor`, `lift-approach`, `door-approach`, `mutex`, and `custom` may affect product workflows, but they do not become new marker variants or new color tokens.
- `availability` is exactly `available | unavailable | unknown` and must come from the source. The marker does not infer runtime availability from roles, annotations, selection, age, or map position.
- The component returns one `<g>` fragment and applies `translate(x y)` from `waypoint.position`. The owning renderer supplies the `<svg>` root, viewBox, world transform, clipping, layers, and coordinate conversion.
- Pass the actual parent `viewportScale`. Marker geometry and labels apply the inverse scale, strokes use `vector-effect="non-scaling-stroke"`, and the transparent activation circle remains 35 CSS px across so a 24×24 CSS px square fits inside the circular target at every zoom with rendering tolerance.
- Pointer click and non-repeating Enter/Space call `onActivate(waypoint.id, event)`. `event.repeat` and `disabled` block activation; disabled preserves context but leaves the Tab order. Disabled opacity is `0.45`, while stale data uses `0.76`; these state opacities — together with the stale dash, label halo, state-badge, and hit-target values — are consumed from the shared internal `_navigationVocabulary` module, so consistency with the other Robotics Navigation renderers is structural rather than a hand-matched promise. `unavailable`, `invalid`, and `stale` remain selectable so operators can inspect the reason.
- `aria-hidden="true"` is pointer-only mode for a map fragment whose named semantic mirror owns keyboard/accessibility. The owning product renderer must provide and synchronize that ordinary DOM list/control; a Storybook example is evidence of the seam, not a consumer implementation. Pointer-only mode preserves visual state and click identity but removes role/name/state ARIA and `tabIndex`, sets `focusable="false"`, cancels mouse-down focus, and rejects keyboard activation.
- Keyboard focus uses the single shape-managed `data-waypoint-focus-indicator`, a diamond shell that traces the point's own silhouette (scaled 1.5x) rather than a circle. The Robotics Navigation opt-out in `tokens/focus.css` suppresses the global rectangular outline so it does not wrap the marker label or duplicate the internal focus shell. The `label2` identity and `caption2` compact role/annotation line start at screen-space `x=15`, leaving at least 3px between their actual bbox and the focus shell in normal, dark, and 320px renderings.
- `availability="unknown"` and `invalid` are independent. When both apply to the same waypoint, registry question geometry occupies the upper-left `(-8,-8)` slot and registry exclamation geometry the lower-left `(-8,+8)` slot in separate shared 7px-radius state badges, so neither state suppresses, overlaps, or touches the right-side label. Both use the common `NavigationStateGlyph` minimum-10px SVG contract, expose `data-navigation-state-glyph`/source, and leave no state `<text>` or font fallback. Their actual painted geometry stays centered within 1px per axis and at least 2px inside the compound circle. Invalid consistently means data error (`!`); close geometry is reserved for closed/blocked semantics. Glyph interiors use appearance-aware viewer foreground while the status hue remains on the marker/badge outline.
- The asset-suitability inventory checked `assets/icons/question.svg`, `exclamation.svg`, and the generated `Icon` registry before changing geometry. Both states reuse those registry paths directly; the component does not introduce a waypoint-only question/exclamation drawing or a font-specific baseline offset.
- The default accessible name is built from the waypoint data and state, including visible controlled/DOM focus. A native `aria-label` overrides that wording. Interactive markers expose button/pressed/disabled semantics; passive markers expose an image role. The marker never creates a live region.
- `showLabel={false}` is for dense maps that provide the same identity and semantic ordering in a named legend/list. Hiding the visual label never removes the accessible name.

## Reading order and color-independent state

The intended reading order is waypoint label → map identity → graph roles → annotations → availability and validation/freshness state. The SVG accessible name follows that sequence, and a product-owned semantic mirror must repeat it as ordinary text and controls when that mirror owns navigation.

Color is supporting evidence only:

- selected fills the waypoint diamond solid with the viewer accent;
- focused adds the shared focus-indicator as a larger diamond shell outside selection;
- stale adds a dashed halo;
- unavailable adds a diagonal slash;
- invalid adds registry exclamation geometry;
- unknown adds registry question geometry;
- graph roles remain visible as `H / T / P / C` text codes beside the label, while annotations use short text codes and a `+N` remainder rather than an invented icon family.

## Visual delta inventory

| Compared sibling | Retained LDS constraint | Intentional delta and reason |
| --- | --- | --- |
| `Map2DCanvas` | viewer surface/foreground/muted roles, renderer ownership, no app workflow | Waypoint is an SVG fragment inside the renderer, not a second framed surface. |
| `LayerPanel` | canonical selected/focused/disabled/invalid/stale vocabulary, focus-indicator token, dense scan order | A spatial marker uses constant screen-space geometry and a transparent hit area; hierarchy controls remain in the panel. |
| `SelectionInspector` | selected object identity precedes status and properties | The map marker exposes only identity and compact semantics. Editable properties and object actions stay in the inspector. |
| existing `Icon` components | established icons are not redrawn | No new domain icon set is introduced. Geometric state marks and literal role codes provide color-independent evidence. |

The marker uses existing viewer and semantic color roles, LDS typography, and the shared focus indicator. Its cast shadow separates the small diamond from map detail, and compound unknown/invalid states use the shared `NAV_STATE_BADGE` geometry rather than a waypoint-only badge. It adds no new token, card, toolbar, motion, or independent status language.

The atom regression capture binds the unselected `wp-holding` marker explicitly and crops the 28px point neighborhood. The diamond, stroke, cast shadow, and surrounding map breathing room remain visible, while the label beginning at screen-space `x=15` stays outside the crop. That isolates the default marker from selected/focused siblings and label drift; this baseline repair changes capture identity only, not marker geometry, tokens, or API.

## Authoritative research and conclusions

- [Open-RMF `Graph::Waypoint` at the reviewed repository revision `39f09e7971c8e666e12c8e9b12199014f631c0bb`](https://github.com/open-rmf/rmf_traffic/blob/39f09e7971c8e666e12c8e9b12199014f631c0bb/rmf_traffic/include/rmf_traffic/agv/Graph.hpp) defines map name and location, then separate setters/getters for holding, passthrough, parking, charger, lift, and mutex properties. LDS therefore keeps map/position explicit and represents graph roles as a composable array rather than a single visual type.
- [Open-RMF Traffic Editor vertex source at the reviewed repository revision `922a66315fb374a8c4640a4f25ad447c4c58b218`](https://github.com/open-rmf/rmf_traffic_editor/blob/922a66315fb374a8c4640a4f25ad447c4c58b218/rmf_traffic_editor/gui/vertex.cpp) provides domain evidence for vertex-level dock/cleaning/dispenser/ingestor and facility metadata. LDS keeps the annotation kind and product-provided identity in a separate channel and does not promote every annotation to a component variant.
- [Nav2 Route Server](https://docs.nav2.org/configuration/packages/configuring-route-server.html) distinguishes a predefined node/edge graph from free-space planning and from a dense `nav_msgs/Path`. `WaypointMarker` belongs only to the navigation-graph layer; planned-route progress and trajectory geometry are intentionally excluded.
- [WCAG 2.2 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) sets a 24 by 24 CSS px target expectation and specifically notes dense digital-map exceptions plus equivalent controls. LDS supplies a 35px circular target that contains the required square with rendering tolerance and still requires the list-based equivalent path for dense or overlapping waypoint sets.
- [WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color) requires information in addition to hue, such as shape or text. Selection fill, focus shell, stale dash, unavailable slash, registry glyphs, role codes, and the product-owned semantic mirror therefore remain visible evidence instead of reducing waypoint state to color.
- [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) requires graphical objects and UI state indicators needed for understanding to contrast at least 3:1 with adjacent colors. `WaypointMarker` keeps dark-viewer question/exclamation geometry on the established viewer foreground role and retains cautionary/negative hue on the surrounding outline, so a light page theme cannot inject low-contrast status geometry into a dark map.
- [Google Maps Advanced Markers](https://developers.google.com/maps/documentation/javascript/reference/advanced-markers) exposes marker anchor offsets, accessible title text, `zIndex`, and collision behavior as explicit contracts; it also warns that mixing explicit and implicit `zIndex` can be unpredictable. LDS keeps identity and a stable local anchor in the marker, while the owning renderer must apply one consistent stacking and accessibility policy across all waypoints.
- [Google Maps marker collision management](https://developers.google.com/maps/documentation/javascript/examples/marker-collision-management) makes required/optional visibility and lower-priority hiding an explicit renderer choice. `WaypointMarker` therefore does not infer collision priority from role, status hue, or DOM order, and a product that suppresses a visual marker must retain an equivalent named path to its information and action.
- [MapLibre Style Spec — symbol layers](https://maplibre.org/maplibre-style-spec/layers/#symbol) makes placement, overlap, ordering, and edge avoidance renderer-level concerns; `symbol-sort-key` and overlap policy determine which colliding symbols are placed. `WaypointMarker` therefore keeps one stable point symbol and accessible identity while the owning map decides collision priority and whether a visual label is suppressed. State slots within one marker are component-owned and must not collide with each other.

## Intentional exclusions

- lane direction, lane closure, speed restrictions, route progress, trajectory, robot pose, region geometry, facility session/door/lift state;
- collision resolution, clustering, label placement, overlap avoidance, coordinate projection, bounds fitting, source freshness calculation, and availability inference — LDS ships `components/robotics/NavigationAnnotationLayer.jsx` as the reference renderer piece for cross-entity label coordination, and a standalone marker rendered without that provider behaves exactly as before;
- editing handles, drag movement, context menus, product commands, and application-level keyboard traversal across a full graph;
- a standalone DOM/SVG root or canvas/Konva-specific public API.

Those concerns belong to later navigation overlays, the owning renderer, `LayerPanel`, `SelectionInspector`, or the product runtime.
