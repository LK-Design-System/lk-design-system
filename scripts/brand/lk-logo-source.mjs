/**
 * Canonical non-font geometry for the LK ROBOTICS logo.
 *
 * `LK_MARK_PATHS` is the approved custom LK symbol. The ROBOTICS wordmark and
 * Korean corporate descriptor are intentionally absent: the brand generator
 * constructs both from the pinned fonts in lk-logo-construction.json.
 */

export const LK_MARK_GEOMETRY_VERSION = '1.0';

export const LK_MARK_PATHS = Object.freeze([
  {
    d: 'm 0,0 v -42.031 h 28.142 l -7.307,8.749 H 9.11 L 9.11,0 Z',
    transform: 'matrix(1.3333333 0 0 -1.3333333 346.60933 153.18987)',
  },
  {
    d: 'm 0,0 h -10.446 l -18.057,-22.549 16.508,-19.483 h 11.798 l -16.76,19.483 z',
    transform: 'matrix(1.3333333 0 0 -1.3333333 407.364 153.31)',
  },
]);

export const LOGO_GEOMETRY = Object.freeze({
  markBounds: Object.freeze({
    x: 346.60933,
    y: 153.18987,
    width: 60.75467,
    height: 56.1628,
  }),
  standardSquare: Object.freeze({ x: 297.4293, y: 114.3693, size: 158.74 }),
  corporateSquare: Object.freeze({ x: 77.0213, y: 114.3693, size: 158.74 }),
  corporateOffset: Object.freeze({ x: -220.40813, y: -9.3408 }),
});
