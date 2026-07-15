import React from 'react';

// Facility badge glyphs — door, lift, dock — painted as a knockout fill (white
// on the state-colored badge) inside the FacilityTransition marker.
//
// Sourced from Material Symbols (Google, Apache License 2.0): the rounded fill
// variants `door_sliding`, `elevator`, and `home` (home = the AGV's return/dock
// station). Each icon's native viewBox is `0 -960 960 960`; the shared FIT
// transform recenters the icon (its center is 480,-480) onto the badge origin
// and scales the 960u artwork down to the ~22px badge slot. See
// docs/references/ATTRIBUTIONS.md for the full license notice.
//
// Internal (underscore-prefixed) shared module — NOT part of the public API.
const h = React.createElement;

// Material Symbols rounded fill paths, verbatim (viewBox 0 -960 960 960).
const PATHS = {
  door: 'M393.5-459.5Q404-470 404-484t-10.5-24.5Q383-519 369-519t-24.5 10.5Q334-498 334-484t10.5 24.5Q355-449 369-449t24.5-10.5Zm223 0Q627-470 627-484t-10.5-24.5Q606-519 592-519t-24.5 10.5Q557-498 557-484t10.5 24.5Q578-449 592-449t24.5-10.5ZM150-120q-13 0-21.5-8.5T120-150q0-13 8.5-21.5T150-180h16v-600q0-25 17.5-42.5T226-840h239v660h30v-660h239q25 0 42.5 17.5T794-780v600h16q13 0 21.5 8.5T840-150q0 13-8.5 21.5T810-120H150Z',
  lift: 'M280-400v140q0 13 8.5 21.5T310-230h60q13 0 21.5-8.5T400-260v-140h10q13 0 21.5-8.5T440-430v-80q0-33-23.5-56.5T360-590h-40q-33 0-56.5 23.5T240-510v80q0 13 8.5 21.5T270-400h10Zm99.5-240.5Q396-657 396-680t-16.5-39.5Q363-736 340-736t-39.5 16.5Q284-703 284-680t16.5 39.5Q317-624 340-624t39.5-16.5ZM542-530h146q9 0 13.5-7.5T701-553l-73-117q-5-7-13-7t-13 7l-73 117q-5 8-.5 15.5T542-530Zm86 240 73-117q5-8 .5-15.5T688-430H542q-9 0-13.5 7.5t.5 15.5l73 117q5 7 13 7t13-7ZM180-120q-24 0-42-18t-18-42v-600q0-23 18-41.5t42-18.5h600q23 0 41.5 18.5T840-780v600q0 24-18.5 42T780-120H180Z',
  dock: 'M160-180v-390q0-14.25 6.38-27 6.37-12.75 17.62-21l260-195q15.68-12 35.84-12Q500-825 516-813l260 195q11.25 8.25 17.63 21 6.37 12.75 6.37 27v390q0 24.75-17.62 42.37Q764.75-120 740-120H590q-12.75 0-21.37-8.63Q560-137.25 560-150v-220q0-12.75-8.62-21.38Q542.75-400 530-400H430q-12.75 0-21.37 8.62Q400-382.75 400-370v220q0 12.75-8.62 21.37Q382.75-120 370-120H220q-24.75 0-42.37-17.63Q160-155.25 160-180Z',
};

// Recenter (icon center 480,-480 → origin) then scale 960u down to the badge.
const FIT = 'scale(0.019) translate(-480 480)';

export function FacilityGlyph({ kind, color }) {
  const d = PATHS[kind] ?? PATHS.dock;
  return h('g', { fill: color, pointerEvents: 'none', transform: FIT }, h('path', { d }));
}

export default FacilityGlyph;
