// Navigation vector-glyph geometry shared across the Navigation renderers.
// Internal `_`-prefixed module: geometry only, never exported from the public
// entry. THREE distinct glyphs with THREE distinct meanings — one shape per
// meaning, never shared. Keeping all three here (and side by side on the
// Foundation/Vector Glyph page) makes the "one shape per meaning" contract
// visually self-enforcing: a designer sees a folding line, a standalone dart,
// and a round pointed body and can tell direction from progress from robot at
// a glance on one busy corridor.
//
// - NAV_DIRECTION_CHEVRON — static travel direction. The line is cut for a
//   short window and, inside it, the line itself bends into an open V: the
//   chevron is stroked in the SAME tone and width as the lane path, so the
//   mark is literally the line folding into an arrow (transit-map grammar) —
//   no capsule, no badge, nothing floating above the path. LaneOverlay places
//   it once, on the midpoint of the longest straight run.
//
// - NAV_PROGRESS_TRIANGLE — dynamic current progress. A solid filled
//   arrowhead attached with SVG `marker-end` to the end of the elapsed line,
//   so its tip IS the source-owned current position and its orientation
//   follows the incoming path tangent. RouteOverlay / TrajectoryOverlay own
//   the attachment contract through `NAV_PROGRESS_HEAD`.
//
// - NAV_ROBOT_POSE — a robot's live position and heading. A round footprint
//   body with a short heading nose protruding along the bearing: the CIRCLE is
//   the differentiator — neither the chevron nor the progress dart carries a
//   body, so a robot never reads as a path arrow. RobotMarker owns it.

export const NAV_DIRECTION_CHEVRON = Object.freeze({
  // Cut window along the tangent (+x = travel direction), local units around
  // the anchor. The window is erased in viewer-surface color so every line
  // layer beneath (status dash, conflict pattern) clears with it. It spans
  // EXACTLY the V's extent — the incoming line ends where the arms start and
  // the outgoing line resumes at the tip, so the round caps overlap and the
  // stroke reads as one continuous line folding into the arrow (no white gap).
  window: Object.freeze({ from: -6, to: 5, clearWidth: 5 }),
  // The open V that replaces the erased run. Stroked at the usage site in the
  // lane path's own tone and stroke width — the line folds into the arrow.
  path: 'M -6 -6 L 5 0 L -6 6',
});

export const NAV_PROGRESS_TRIANGLE = Object.freeze({
  // Solid concave-back dart, tip at the origin, body extending backward over
  // the elapsed line. Rendered as fill + thin surface outline (strokeLinejoin
  // round), so no second casing marker is needed. Dimensions are sized against
  // NAV_PROGRESS_HEAD.tipSetback: with the shaft trimmed 8px behind the tip,
  // the widest round cap (casing 7 → r 3.5) stays inside the solid body and
  // clear of the concave notch (axis-solid region is [-11.5, 0]).
  path: 'M 0 0 L -14 -7 Q -11.5 0 -14 7 Z',
  viewBox: '-16 -9 18 18',
  refX: 0,
  refY: 0,
  width: 18,
  height: 18,
});

export const NAV_ROBOT_POSE = Object.freeze({
  // Screen-fixed body silhouette, heading = +x. The round footprint body is
  // the differentiator from every path arrow; the heading nose protrudes from
  // the body edge along the bearing and its base chord sits inside the disc so
  // body + nose paint as ONE silhouette (surface casing halo underneath,
  // marker tone on top — the NAV_PIN shadow/silhouette pattern).
  bodyRadius: 8,
  casingWidth: 2,
  // Heading nose: apex 5px past the r=8 edge, base chord inside the disc.
  nosePath: 'M 13 0 L 4 -5.5 L 4 5.5 Z',
  // Focus traces the OWN silhouette scaled out; selection hugs it tighter in.
  focusScale: 1.45,
  selectionRingScale: 1.18,
  // Optional world-space footprint ring (grows with zoom, unlike the body).
  footprintOpacity: 0.14,
});
