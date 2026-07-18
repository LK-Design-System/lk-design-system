import React from 'react';
import { NAV_PROGRESS_HEAD } from './_navigationVocabulary.js';

const POINT_EPSILON = 0.000001;
const POSITION_JOIN_TOLERANCE_PX = 2;

function pointDistanceSquared(first, second) {
  const dx = first.x - second.x;
  const dy = first.y - second.y;
  return dx * dx + dy * dy;
}

function appendDistinct(points, point) {
  const last = points[points.length - 1];
  if (!last || pointDistanceSquared(last, point) > POINT_EPSILON * POINT_EPSILON) {
    points.push(point);
  }
}

function segmentMetrics(points) {
  return points.slice(0, -1).map((start, index) => {
    const end = points[index + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    return { index, start, end, dx, dy, length };
  });
}

function pointAtFraction(points, fraction) {
  const metrics = segmentMetrics(points);
  const totalLength = metrics.reduce((sum, segment) => sum + segment.length, 0);
  if (totalLength <= POINT_EPSILON) return undefined;
  const ratio = Math.max(0, Math.min(1, Number(fraction) || 0));
  let traveled = totalLength * ratio;
  let distance = 0;
  const nonZero = metrics.filter((segment) => segment.length > POINT_EPSILON);
  for (let index = 0; index < nonZero.length; index += 1) {
    const segment = nonZero[index];
    if (traveled <= segment.length || index === nonZero.length - 1) {
      const localRatio = Math.max(0, Math.min(1, traveled / segment.length));
      return {
        point: {
          x: segment.start.x + segment.dx * localRatio,
          y: segment.start.y + segment.dy * localRatio,
        },
        segment,
        distance: distance + segment.length * localRatio,
      };
    }
    traveled -= segment.length;
    distance += segment.length;
  }
  return undefined;
}

function prefixThrough(points, segmentIndex, endPoint) {
  const prefix = [];
  points.slice(0, segmentIndex + 1).forEach((point) => appendDistinct(prefix, point));
  appendDistinct(prefix, endPoint);
  return prefix;
}

/**
 * Drops `trimDistance` (path-arc-length units) off the END of a polyline.
 * Returns [] when the polyline is shorter than the trim. Used to stop the
 * painted shaft short of the head tip so its round cap hides inside the
 * triangle body (the marker's refX shift puts the tip back on the anchor).
 */
function trimEnd(points, trimDistance) {
  const metrics = segmentMetrics(points);
  const totalLength = metrics.reduce((sum, segment) => sum + segment.length, 0);
  const keepLength = totalLength - trimDistance;
  if (keepLength <= POINT_EPSILON) return [];
  const trimmed = [];
  let accumulated = 0;
  for (const segment of metrics) {
    if (segment.length <= POINT_EPSILON) continue;
    if (trimmed.length === 0) trimmed.push(segment.start);
    const segmentEnd = accumulated + segment.length;
    if (segmentEnd >= keepLength) {
      const local = (keepLength - accumulated) / segment.length;
      appendDistinct(trimmed, {
        x: segment.start.x + segment.dx * local,
        y: segment.start.y + segment.dy * local,
      });
      break;
    }
    appendDistinct(trimmed, segment.end);
    accumulated = segmentEnd;
  }
  return trimmed.length >= 2 ? trimmed : [];
}

function polylineLength(points) {
  return segmentMetrics(points).reduce((sum, segment) => sum + segment.length, 0);
}

/**
 * Trims the shaft back so its round cap hides inside the head, but never more
 * than half the elapsed line — on a short segment (or a zoomed-out map) the
 * full tipSetback would eat the whole prefix and the head would vanish. Returns
 * the painted prefix plus the CSS px actually pulled back, so the marker's refX
 * shift can match and keep the tip on the anchor.
 */
function applyTipSetback(fullPrefix, setbackDistance, scale) {
  if (fullPrefix.length < 2) return { paintedPrefix: fullPrefix, tipSetbackPx: 0 };
  const effective = Math.min(setbackDistance, polylineLength(fullPrefix) * 0.5);
  const trimmed = trimEnd(fullPrefix, effective);
  if (trimmed.length < 2) return { paintedPrefix: fullPrefix, tipSetbackPx: 0 };
  return { paintedPrefix: trimmed, tipSetbackPx: effective * scale };
}

/**
 * Remaining path from `startDistance` (path-arc-length units) to the end.
 * Returns [] when nothing meaningful remains. This is what puts the visual
 * gap between the progress-head tip and the resuming future line.
 */
function suffixFrom(points, startDistance) {
  const metrics = segmentMetrics(points);
  let accumulated = 0;
  const suffix = [];
  for (const segment of metrics) {
    const segmentEnd = accumulated + segment.length;
    if (segmentEnd > startDistance && segment.length > POINT_EPSILON) {
      if (suffix.length === 0) {
        const local = Math.max(0, startDistance - accumulated) / segment.length;
        suffix.push({
          x: segment.start.x + segment.dx * local,
          y: segment.start.y + segment.dy * local,
        });
      }
      appendDistinct(suffix, segment.end);
    }
    accumulated = segmentEnd;
  }
  return suffix.length >= 2 ? suffix : [];
}

/**
 * Resolves a source-owned Route fraction and an optional visually joined exact
 * position. The head only exists once there is real elapsed line (two distinct
 * prefix points) — there is no synthetic carrier stub at fraction 0. The
 * future line resumes `NAV_PROGRESS_HEAD.futureGap` CSS px past the tip.
 * `suppressHead` keeps the strong/recessed progress split but yields the tip
 * to whatever composition occupies it (a RobotMarker on the same position):
 * no marker, no shaft setback, no future gap.
 */
export function routeProgressGeometry(points, fraction, explicitPosition, viewportScale = 1, { suppressHead = false } = {}) {
  const fractionResult = pointAtFraction(points, fraction);
  if (!fractionResult) return undefined;
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const gapDistance = NAV_PROGRESS_HEAD.futureGap / scale;
  const setbackDistance = NAV_PROGRESS_HEAD.tipSetback / scale;
  const angle = Math.atan2(fractionResult.segment.dy, fractionResult.segment.dx) * 180 / Math.PI;

  if (explicitPosition) {
    const positionMismatch = Math.sqrt(pointDistanceSquared(explicitPosition, fractionResult.point)) * scale
      > POSITION_JOIN_TOLERANCE_PX;
    if (positionMismatch) {
      return {
        point: fractionResult.point,
        angle: undefined,
        prefixPoints: prefixThrough(points, fractionResult.segment.index, fractionResult.point),
        suffixPoints: [],
        headVisible: false,
        positionMismatch: true,
      };
    }
    const fullPrefix = prefixThrough(points, fractionResult.segment.index, explicitPosition);
    const headVisible = fullPrefix.length >= 2 && !suppressHead;
    const { paintedPrefix, tipSetbackPx } = headVisible
      ? applyTipSetback(fullPrefix, setbackDistance, scale)
      : { paintedPrefix: fullPrefix, tipSetbackPx: 0 };
    return {
      point: explicitPosition,
      angle,
      prefixPoints: paintedPrefix,
      suffixPoints: suffixFrom(points, fractionResult.distance + (headVisible ? gapDistance : 0)),
      headVisible,
      tipSetbackPx,
      positionMismatch: false,
    };
  }

  const fullPrefix = prefixThrough(points, fractionResult.segment.index, fractionResult.point);
  const headVisible = fullPrefix.length >= 2 && !suppressHead;
  const { paintedPrefix, tipSetbackPx } = headVisible
    ? applyTipSetback(fullPrefix, setbackDistance, scale)
    : { paintedPrefix: fullPrefix, tipSetbackPx: 0 };
  return {
    point: fractionResult.point,
    angle,
    prefixPoints: paintedPrefix,
    suffixPoints: suffixFrom(points, fractionResult.distance + (headVisible ? gapDistance : 0)),
    headVisible,
    tipSetbackPx,
    positionMismatch: false,
  };
}

/**
 * Resolves a finite Trajectory sample without inferring progress from time.
 * Same head rules as the route geometry: no head until real elapsed line
 * exists, and the future line resumes after the shared gap. `suppressHead`
 * keeps the strong/recessed split but yields the tip to the composition
 * (a RobotMarker on the current sample): no marker, no setback, no gap.
 */
export function trajectoryProgressGeometry(points, pointIndex, viewportScale = 1, { suppressHead = false } = {}) {
  if (!Number.isInteger(pointIndex) || pointIndex < 0 || pointIndex >= points.length) return undefined;
  const point = points[pointIndex];
  const fullPrefix = [];
  points.slice(0, pointIndex + 1).forEach((item) => appendDistinct(fullPrefix, item));
  const incoming = [...segmentMetrics(points.slice(0, pointIndex + 1))]
    .reverse()
    .find((segment) => segment.length > POINT_EPSILON);
  const outgoing = segmentMetrics(points.slice(pointIndex))
    .find((segment) => segment.length > POINT_EPSILON);
  const tangent = incoming ?? outgoing;
  if (!tangent) return undefined;
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const tipDistance = polylineLength(fullPrefix);
  const headVisible = fullPrefix.length >= 2 && !suppressHead;
  const { paintedPrefix, tipSetbackPx } = headVisible
    ? applyTipSetback(fullPrefix, NAV_PROGRESS_HEAD.tipSetback / scale, scale)
    : { paintedPrefix: fullPrefix, tipSetbackPx: 0 };
  return {
    point,
    angle: Math.atan2(tangent.dy, tangent.dx) * 180 / Math.PI,
    prefixPoints: paintedPrefix,
    suffixPoints: suffixFrom(points, tipDistance + (headVisible ? NAV_PROGRESS_HEAD.futureGap / scale : 0)),
    headVisible,
    tipSetbackPx,
  };
}

/**
 * Single solid-triangle progress-head marker. The triangle is filled with the
 * line tone and outlined once in viewer surface, so the head separates from
 * busy map content without a second casing marker definition.
 */
export function NavigationProgressHeadDefs({
  idPrefix,
  tone,
  surface,
  inverseScale,
  tipSetbackPx = NAV_PROGRESS_HEAD.tipSetback,
}) {
  return React.createElement('defs', { 'aria-hidden': 'true' },
    React.createElement('marker', {
      id: `${idPrefix}-head`,
      viewBox: NAV_PROGRESS_HEAD.viewBox,
      // refX sits behind the tip by the ACTUAL setback the shaft was trimmed
      // by (clamped on short segments), so the tip paints exactly on the anchor
      // while the shaft's round cap stays hidden inside the triangle body.
      refX: NAV_PROGRESS_HEAD.refX - tipSetbackPx,
      refY: NAV_PROGRESS_HEAD.refY,
      markerWidth: NAV_PROGRESS_HEAD.width * inverseScale,
      markerHeight: NAV_PROGRESS_HEAD.height * inverseScale,
      markerUnits: 'userSpaceOnUse',
      orient: 'auto',
      overflow: 'visible',
    }, React.createElement('path', {
      'data-navigation-progress-head-definition': 'head',
      d: NAV_PROGRESS_HEAD.path,
      fill: tone,
      stroke: surface,
      strokeWidth: NAV_PROGRESS_HEAD.outlineWidth,
      strokeLinejoin: 'round',
    })));
}

export function ProgressHeadObstacle({ obstacle, id, point, angle, inverseScale, dataPrefix }) {
  const bounds = NAV_PROGRESS_HEAD.obstacle;
  return React.createElement('g', {
    'data-navigation-progress-head-obstacle': '',
    'data-progress-head-angle': angle,
    'data-route-anchor-x': dataPrefix === 'route' ? point.x : undefined,
    'data-route-anchor-y': dataPrefix === 'route' ? point.y : undefined,
    'data-trajectory-anchor-x': dataPrefix === 'trajectory' ? point.x : undefined,
    'data-trajectory-anchor-y': dataPrefix === 'trajectory' ? point.y : undefined,
    transform: `translate(${point.x} ${point.y}) rotate(${angle}) scale(${inverseScale})`,
    'aria-hidden': 'true',
    pointerEvents: 'none',
  }, React.createElement('rect', {
    ...obstacle(id),
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    fill: 'transparent',
    opacity: 0,
  }));
}
