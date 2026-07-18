"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";




var _chunkETVYZPQLcjs = require('./chunk-ETVYZPQL.cjs');


var _chunkGKSI3QZ5cjs = require('./chunk-GKSI3QZ5.cjs');












var _chunkYXXTXTP5cjs = require('./chunk-YXXTXTP5.cjs');




var _chunk4KWJ7MLTcjs = require('./chunk-4KWJ7MLT.cjs');

// components/robotics/RouteOverlay.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var STATUS_LABEL = {
  planned: "\uACC4\uD68D\uB428",
  active: "\uC774\uB3D9 \uC911",
  waiting: "\uB300\uAE30 \uC911",
  blocked: "\uCC28\uB2E8\uB428",
  rerouting: "\uACBD\uB85C \uC7AC\uACC4\uC0B0 \uC911",
  completed: "\uC644\uB8CC\uB428"
};
var STATUS_GLYPH_KIND = {
  planned: "planned",
  active: "active",
  waiting: "waiting",
  blocked: "blocked",
  rerouting: "rerouting",
  completed: "completed"
};
var PHASE_LABEL = {
  completed: "\uD1B5\uACFC \uC644\uB8CC",
  current: "\uD604\uC7AC \uAD6C\uAC04",
  upcoming: "\uC608\uC815 \uAD6C\uAC04"
};
var CONDITION_LABEL = {
  normal: "\uC815\uC0C1",
  waiting: "\uB300\uAE30",
  blocked: "\uCC28\uB2E8",
  conflict: "\uCDA9\uB3CC"
};
var CONDITION_GLYPH_KIND = {
  waiting: "waiting",
  blocked: "blocked",
  conflict: "conflict"
};
var MARKER_GAP_PX = 4;
var MARKER_ROW_CLEARANCE_PX = 8;
var LABEL_ROW_GAP_PX = 12;
var STATE_BADGE_FOOTPRINT_PX = _chunkYXXTXTP5cjs.NAV_STATE_BADGE.radius + _chunkYXXTXTP5cjs.NAV_STATE_BADGE.strokeWidth / 2;
var MARKER_RADIUS_PX = {
  condition: 8.75,
  status: STATE_BADGE_FOOTPRINT_PX,
  invalid: 8.75,
  stale: 8.75
};
function finitePoint(point) {
  return point && Number.isFinite(point.x) && Number.isFinite(point.y);
}
function pathFromPoints(points) {
  if (points.length < 2) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}
function markerTransform(point, inverseScale, screenSlot) {
  const anchor = `translate(${point.x} ${point.y}) scale(${inverseScale})`;
  return screenSlot ? `${anchor} translate(${screenSlot.x} ${screenSlot.y})` : anchor;
}
function badgeNormalSlot(point) {
  const radians = (_nullishCoalesce(point.angle, () => ( 0))) * Math.PI / 180;
  let x = Math.sin(radians);
  let y = -Math.cos(radians);
  if (y > 0 || Math.abs(y) < 1e-4 && x > 0) {
    x *= -1;
    y *= -1;
  }
  return { x: x * _chunkYXXTXTP5cjs.NAV_STATE_BADGE.pathNormalOffset, y: y * _chunkYXXTXTP5cjs.NAV_STATE_BADGE.pathNormalOffset };
}
function BadgeShadow(props) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "circle",
    {
      ...props,
      "data-marker-shadow": "",
      cy: _chunkYXXTXTP5cjs.NAV_MARKER_SHADOW.chipOffsetY,
      r: _chunkYXXTXTP5cjs.NAV_STATE_BADGE.radius + _chunkYXXTXTP5cjs.NAV_STATE_BADGE.strokeWidth / 2,
      fill: _chunkYXXTXTP5cjs.NAV_MARKER_SHADOW.fill,
      opacity: _chunkYXXTXTP5cjs.NAV_MARKER_SHADOW.opacity,
      pointerEvents: "none"
    }
  );
}
function BadgeLeaderTick({ slot, tone, hook }) {
  const reach = _chunkYXXTXTP5cjs.NAV_BADGE_LEADER.length / _chunkYXXTXTP5cjs.NAV_STATE_BADGE.pathNormalOffset;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "line",
    {
      ...hook,
      x1: "0",
      y1: "0",
      x2: -slot.x * reach,
      y2: -slot.y * reach,
      stroke: tone,
      strokeWidth: _chunkYXXTXTP5cjs.NAV_BADGE_LEADER.strokeWidth,
      strokeLinecap: "round",
      vectorEffect: "non-scaling-stroke",
      pointerEvents: "none"
    }
  );
}
function markerCollisionLayout(markers, scale, fixedMarkers = []) {
  const candidates = [...markers, ...fixedMarkers];
  if (candidates.length < 2) return void 0;
  const collisionParticipants = /* @__PURE__ */ new Set();
  const collidingMovableIndexes = /* @__PURE__ */ new Set();
  for (let first = 0; first < candidates.length; first += 1) {
    for (let second = first + 1; second < candidates.length; second += 1) {
      const a = candidates[first];
      const b = candidates[second];
      const naturalDistance = Math.hypot(
        a.point.x - b.point.x,
        a.point.y - b.point.y
      ) * scale;
      if (naturalDistance < a.radius + b.radius + MARKER_GAP_PX) {
        collisionParticipants.add(first);
        collisionParticipants.add(second);
        if (first < markers.length) collidingMovableIndexes.add(first);
        if (second < markers.length) collidingMovableIndexes.add(second);
      }
    }
  }
  if (collidingMovableIndexes.size === 0) return void 0;
  const collisionMarkers = [...collisionParticipants].map((index) => candidates[index]);
  const reference = collisionMarkers.reduce((point, marker) => ({
    x: point.x + marker.point.x / collisionMarkers.length,
    y: point.y + marker.point.y / collisionMarkers.length
  }), { x: 0, y: 0 });
  const maxRadius = Math.max(...markers.map((marker) => marker.radius));
  const totalWidth = markers.reduce((width, marker) => width + marker.radius * 2, 0) + MARKER_GAP_PX * (markers.length - 1);
  const rowY = -(maxRadius + MARKER_ROW_CLEARANCE_PX);
  const slots = {};
  let cursor = -totalWidth / 2;
  markers.forEach((marker) => {
    const centerX = cursor + marker.radius;
    slots[marker.name] = {
      x: (reference.x - marker.point.x) * scale + centerX,
      y: (reference.y - marker.point.y) * scale + rowY
    };
    cursor += marker.radius * 2 + MARKER_GAP_PX;
  });
  return {
    reference,
    slots,
    totalWidth,
    labelY: rowY - maxRadius - LABEL_ROW_GAP_PX
  };
}
function labelScreenSlot(point, layout, scale) {
  if (!layout) return void 0;
  return {
    x: (layout.reference.x - point.x) * scale,
    y: (layout.reference.y - point.y) * scale + layout.labelY
  };
}
function pointAlong(points, ratio) {
  if (points.length === 0) return { x: 0, y: 0, angle: 0 };
  if (points.length === 1) return { ...points[0], angle: 0 };
  const lengths = [];
  let total = 0;
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    lengths.push(length);
    total += length;
  }
  if (total === 0) return { ...points[0], angle: 0 };
  let remaining = total * Math.max(0, Math.min(1, ratio));
  for (let index = 0; index < lengths.length; index += 1) {
    const length = lengths[index];
    const start = points[index];
    const end = points[index + 1];
    if (remaining <= length || index === lengths.length - 1) {
      const localRatio = length === 0 ? 0 : remaining / length;
      return {
        x: start.x + (end.x - start.x) * localRatio,
        y: start.y + (end.y - start.y) * localRatio,
        angle: Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI
      };
    }
    remaining -= length;
  }
  return { ...points[points.length - 1], angle: 0 };
}
function normalizedProgress(route) {
  if (!_optionalChain([route, 'optionalAccess', _ => _.progress])) return void 0;
  return {
    segmentId: route.progress.segmentId,
    fraction: Math.max(0, Math.min(1, Number(route.progress.fraction) || 0)),
    position: finitePoint(route.progress.position) ? route.progress.position : void 0
  };
}
function statusTone(status) {
  if (status === "waiting" || status === "rerouting") return "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))";
  if (status === "blocked") return "var(--viewer-danger, var(--color-semantic-status-negative-foreground))";
  if (status === "completed") return "var(--viewer-positive, var(--color-semantic-status-positive-foreground))";
  if (status === "active") return "var(--viewer-accent, var(--color-semantic-primary-normal))";
  return "var(--viewer-muted, var(--color-semantic-label-alternative))";
}
function segmentTone(segment, invalid) {
  if (invalid || segment.condition === "blocked" || segment.condition === "conflict") {
    return "var(--viewer-danger, var(--color-semantic-status-negative-foreground))";
  }
  if (segment.condition === "waiting") return "var(--viewer-warning, var(--color-semantic-status-cautionary-foreground))";
  if (segment.phase === "completed") return "var(--viewer-positive, var(--color-semantic-status-positive-foreground))";
  if (segment.phase === "current") return "var(--viewer-accent, var(--color-semantic-primary-normal))";
  return "var(--viewer-muted, var(--color-semantic-label-alternative))";
}
function segmentDash(segment) {
  if (segment.condition === "waiting") return "10 3 2 3";
  if (segment.condition === "blocked") return "1 5";
  if (segment.condition === "conflict") return "5 3 1 3";
  if (segment.phase === "completed") return "7 4";
  if (segment.phase === "upcoming") return "2 6";
  return void 0;
}
function routeAccessibleName(route, progress, selected, focused, disabled, invalid, stale) {
  const parts = [
    _nullishCoalesce(route.label, () => ( `\uACBD\uB85C ${route.id}`)),
    _nullishCoalesce(STATUS_LABEL[route.status], () => ( route.status))
  ];
  if (progress) parts.push(`\uD604\uC7AC \uAD6C\uAC04 ${Math.round(progress.fraction * 100)}%`);
  if (selected) parts.push("\uC120\uD0DD\uB428");
  if (focused) parts.push("\uD3EC\uCEE4\uC2A4\uB428");
  if (disabled) parts.push("\uC120\uD0DD\uD560 \uC218 \uC5C6\uC74C");
  if (invalid) parts.push("\uB370\uC774\uD130 \uC624\uB958");
  if (stale) parts.push("\uC624\uB798\uB41C \uB370\uC774\uD130");
  return parts.join(", ");
}
function RouteOverlay({
  route,
  activeMapId,
  selectedSegmentId,
  viewportScale = 1,
  selected = false,
  focused = false,
  disabled = false,
  invalid = false,
  stale = false,
  showLabel = true,
  onActivate,
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  tabIndex,
  onFocus,
  onBlur,
  onKeyDown,
  onPointerDown,
  onMouseDown,
  style,
  ...rest
}) {
  const [focusedSegment, setFocusedSegment] = _react2.default.useState(null);
  const [hasRootFocus, setHasRootFocus] = _react2.default.useState(false);
  const obstacle = _chunk4KWJ7MLTcjs.useNavigationObstacles.call(void 0, );
  const progressHeadId = `lk-route-progress-${_react2.default.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const scale = Number.isFinite(viewportScale) && viewportScale > 0 ? viewportScale : 1;
  const inverseScale = 1 / scale;
  const interactive = typeof onActivate === "function";
  const hiddenFromAccessibility = ariaHidden === true || ariaHidden === "true";
  const pointerOnly = interactive && hiddenFromAccessibility;
  const visibleSegments = (_nullishCoalesce(_optionalChain([route, 'optionalAccess', _2 => _2.segments]), () => ( []))).filter((segment) => segment.mapId === activeMapId && (_nullishCoalesce(segment.points, () => ( []))).filter(finitePoint).length >= 2);
  const routeProgress = normalizedProgress(route);
  const progressSegment = routeProgress ? visibleSegments.find((segment) => segment.id === routeProgress.segmentId) : void 0;
  const progress = progressSegment ? routeProgress : void 0;
  const baseAccessibleName = _nullishCoalesce(ariaLabel, () => ( routeAccessibleName(route, progress, selected, focused, disabled, invalid, stale)));
  if (visibleSegments.length === 0) return null;
  const activate = (segmentId, event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    _optionalChain([onActivate, 'optionalCall', _3 => _3({ routeId: route.id, segmentId }, event)]);
  };
  const handleKeyDown = (segmentId, event) => {
    if (!pointerOnly) setFocusedSegment(segmentId);
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    if (!interactive || disabled || event.repeat || pointerOnly) return;
    activate(segmentId, event);
  };
  const handleRootKeyDown = (event) => {
    if (!interactive && !hiddenFromAccessibility) setHasRootFocus(true);
    _optionalChain([onKeyDown, 'optionalCall', _4 => _4(event)]);
  };
  const handlePointerDown = (event) => {
    if (pointerOnly) event.preventDefault();
    _optionalChain([onPointerDown, 'optionalCall', _5 => _5(event)]);
  };
  const handleMouseDown = (event) => {
    if (pointerOnly) event.preventDefault();
    _optionalChain([onMouseDown, 'optionalCall', _6 => _6(event)]);
  };
  const statusSegment = _nullishCoalesce(_nullishCoalesce(progressSegment, () => ( visibleSegments.find((segment) => segment.phase === "current"))), () => ( visibleSegments[0]));
  const statusPoints = _nullishCoalesce(_optionalChain([statusSegment, 'optionalAccess', _7 => _7.points, 'optionalAccess', _8 => _8.filter, 'call', _9 => _9(finitePoint)]), () => ( []));
  const progressGeometry = progressSegment ? _chunkETVYZPQLcjs.routeProgressGeometry.call(void 0, statusPoints, progress.fraction, progress.position, scale) : void 0;
  const progressPoint = _optionalChain([progressGeometry, 'optionalAccess', _10 => _10.point]);
  const progressHeadVisible = Boolean(_optionalChain([progressGeometry, 'optionalAccess', _11 => _11.headVisible]));
  const progressPrefixPath = progressGeometry ? pathFromPoints(progressGeometry.prefixPoints) : "";
  const progressFuturePath = progressGeometry ? pathFromPoints(progressGeometry.suffixPoints) : "";
  const routeStatusPoint = pointAlong(statusPoints, 0.18);
  const statusCondition = ["normal", "waiting", "blocked", "conflict"].includes(_optionalChain([statusSegment, 'optionalAccess', _12 => _12.condition])) ? statusSegment.condition : "normal";
  const statusMidpoint = pointAlong(statusPoints, 0.5);
  const routeStateMarkers = [
    invalid ? {
      state: "invalid",
      glyphKind: "invalid",
      point: pointAlong(statusPoints, 0.82),
      tone: "var(--viewer-danger, var(--color-semantic-status-negative-foreground))"
    } : null,
    stale ? {
      state: "stale",
      glyphKind: "stale",
      point: pointAlong(statusPoints, invalid ? 0.9 : 0.82),
      tone: "var(--viewer-muted, var(--color-semantic-label-alternative))"
    } : null
  ].filter(Boolean);
  const naturalMarkers = statusPoints.length >= 2 ? [
    CONDITION_GLYPH_KIND[statusCondition] ? { name: "condition", point: statusMidpoint, radius: MARKER_RADIUS_PX.condition } : null,
    { name: "status", point: routeStatusPoint, radius: MARKER_RADIUS_PX.status },
    ...routeStateMarkers.map((item) => ({
      name: item.state,
      point: item.point,
      radius: MARKER_RADIUS_PX[item.state]
    }))
  ].filter(Boolean) : [];
  const fixedProgressMarkers = progressHeadVisible ? [{
    name: "progress",
    point: progressPoint,
    radius: _chunkYXXTXTP5cjs.NAV_PROGRESS_HEAD.collisionRadius
  }] : [];
  const markerLayout = markerCollisionLayout(naturalMarkers, scale, fixedProgressMarkers);
  const routeMarkerSlot = (name) => _optionalChain([markerLayout, 'optionalAccess', _13 => _13.slots, 'access', _14 => _14[name]]);
  const markerForeground = "var(--viewer-foreground, var(--color-semantic-label-strong))";
  const surface = "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "g",
    {
      ...rest,
      "data-lk-route-overlay": "",
      "data-route-id": _optionalChain([route, 'optionalAccess', _15 => _15.id]),
      "data-active-map-id": activeMapId,
      "data-route-status": _optionalChain([route, 'optionalAccess', _16 => _16.status]),
      "data-visible-segment-count": visibleSegments.length,
      "data-viewport-scale": scale,
      "data-progress-segment-id": _optionalChain([progress, 'optionalAccess', _17 => _17.segmentId]),
      "data-progress-fraction": _optionalChain([progress, 'optionalAccess', _18 => _18.fraction]),
      "data-progress-position-mismatch": _optionalChain([progressGeometry, 'optionalAccess', _19 => _19.positionMismatch]) ? "true" : void 0,
      "data-route-marker-layout": markerLayout ? "screen-slots" : "path-anchored",
      "data-route-marker-row-width": _optionalChain([markerLayout, 'optionalAccess', _20 => _20.totalWidth]),
      "data-pointer-only": pointerOnly ? "true" : void 0,
      "data-selected": selected ? "true" : "false",
      "data-focused": !hiddenFromAccessibility && (focused || hasRootFocus || focusedSegment != null) ? "true" : "false",
      "data-disabled": disabled ? "true" : "false",
      "data-invalid": invalid ? "true" : "false",
      "data-stale": stale ? "true" : "false",
      role: hiddenFromAccessibility ? void 0 : interactive ? "group" : "img",
      tabIndex: hiddenFromAccessibility ? void 0 : !interactive ? tabIndex : void 0,
      focusable: hiddenFromAccessibility ? "false" : !interactive && tabIndex != null ? "true" : void 0,
      "aria-hidden": hiddenFromAccessibility || void 0,
      "aria-label": hiddenFromAccessibility ? void 0 : baseAccessibleName,
      "aria-disabled": hiddenFromAccessibility ? void 0 : interactive && disabled ? true : void 0,
      "aria-invalid": hiddenFromAccessibility ? void 0 : invalid || void 0,
      onKeyDown: !interactive && !hiddenFromAccessibility || onKeyDown ? handleRootKeyDown : void 0,
      onPointerDown: pointerOnly || onPointerDown ? handlePointerDown : void 0,
      onMouseDown: pointerOnly || onMouseDown ? handleMouseDown : void 0,
      onFocus: !interactive && !hiddenFromAccessibility ? (event) => {
        setHasRootFocus(_chunkYXXTXTP5cjs.isFocusVisibleTarget.call(void 0, event.currentTarget));
        _optionalChain([onFocus, 'optionalCall', _21 => _21(event)]);
      } : void 0,
      onBlur: !interactive && !hiddenFromAccessibility ? (event) => {
        setHasRootFocus(false);
        _optionalChain([onBlur, 'optionalCall', _22 => _22(event)]);
      } : void 0,
      style: { opacity: _chunkYXXTXTP5cjs.navStateOpacity.call(void 0, disabled, stale), outline: "none", ...style },
      children: [
        visibleSegments.map((segment) => {
          const points = (_nullishCoalesce(segment.points, () => ( []))).filter(finitePoint);
          const pathData = pathFromPoints(points);
          const midpoint = pointAlong(points, 0.5);
          const segmentSelected = selected || segment.id === selectedSegmentId;
          const segmentFocused = !pointerOnly && (focused || hasRootFocus || focusedSegment === segment.id);
          const condition = ["normal", "waiting", "blocked", "conflict"].includes(segment.condition) ? segment.condition : "normal";
          const phase = ["completed", "current", "upcoming"].includes(segment.phase) ? segment.phase : "upcoming";
          const normalizedSegment = { ...segment, condition, phase };
          const tone = segmentTone(normalizedSegment, invalid);
          const dash = segmentDash(normalizedSegment);
          const isProgressSegment = segment.id === _optionalChain([progressSegment, 'optionalAccess', _23 => _23.id]) && Boolean(progressGeometry);
          const segmentBodyPath = isProgressSegment && progressHeadVisible ? progressFuturePath : pathData;
          const conditionGlyphKind = CONDITION_GLYPH_KIND[condition];
          const conditionSlot = segment.id === _optionalChain([statusSegment, 'optionalAccess', _24 => _24.id]) ? routeMarkerSlot("condition") : void 0;
          const segmentLabelSlot = segment.id === _optionalChain([statusSegment, 'optionalAccess', _25 => _25.id]) ? labelScreenSlot(midpoint, markerLayout, scale) : void 0;
          const segmentName = [
            _nullishCoalesce(segment.label, () => ( `\uAD6C\uAC04 ${segment.id}`)),
            PHASE_LABEL[phase],
            CONDITION_LABEL[condition],
            _optionalChain([segment, 'access', _26 => _26.laneIds, 'optionalAccess', _27 => _27.length]) ? `graph lane ${segment.laneIds.length}\uAC1C` : null,
            segment.entryTransitionId ? `\uC9C4\uC785 \uC804\uD658 ${segment.entryTransitionId}` : null,
            segment.exitTransitionId ? `\uC774\uD0C8 \uC804\uD658 ${segment.exitTransitionId}` : null
          ].filter(Boolean).join(", ");
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "g",
            {
              "data-route-segment": "",
              "data-segment-id": segment.id,
              "data-map-id": segment.mapId,
              "data-phase": phase,
              "data-condition": condition,
              "data-selected": segmentSelected ? "true" : "false",
              "data-focused": segmentFocused ? "true" : "false",
              "data-disabled": disabled ? "true" : "false",
              "data-invalid": invalid ? "true" : "false",
              "data-stale": stale ? "true" : "false",
              role: pointerOnly ? void 0 : interactive ? "button" : void 0,
              tabIndex: pointerOnly ? void 0 : interactive ? disabled ? -1 : _nullishCoalesce(tabIndex, () => ( 0)) : void 0,
              focusable: pointerOnly ? "false" : interactive ? "true" : void 0,
              "aria-label": !pointerOnly && interactive ? `${baseAccessibleName}, ${segmentName}` : void 0,
              "aria-pressed": !pointerOnly && interactive ? segmentSelected : void 0,
              "aria-disabled": !pointerOnly && interactive && disabled ? true : void 0,
              "aria-invalid": !hiddenFromAccessibility && invalid ? true : void 0,
              onClick: interactive ? (event) => activate(segment.id, event) : void 0,
              onKeyDown: interactive && !pointerOnly ? (event) => handleKeyDown(segment.id, event) : void 0,
              onFocus: !pointerOnly ? (event) => {
                setFocusedSegment(_chunkYXXTXTP5cjs.isFocusVisibleTarget.call(void 0, event.currentTarget) ? segment.id : null);
                _optionalChain([onFocus, 'optionalCall', _28 => _28(event)]);
              } : void 0,
              onBlur: !pointerOnly ? (event) => {
                setFocusedSegment((current) => current === segment.id ? null : current);
                _optionalChain([onBlur, 'optionalCall', _29 => _29(event)]);
              } : void 0,
              style: { cursor: interactive && !disabled ? "pointer" : disabled ? "not-allowed" : "default" },
              children: [
                segmentFocused && pathData && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "path",
                  {
                    "data-route-focus-ring": "",
                    d: pathData,
                    fill: "none",
                    stroke: "var(--color-semantic-focus-indicator)",
                    strokeWidth: _chunkYXXTXTP5cjs.NAV_FOCUS.routeHaloWidth,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke",
                    pointerEvents: "none"
                  }
                ),
                segmentSelected && pathData && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "path",
                  {
                    "data-route-selection-halo": "",
                    d: pathData,
                    fill: "none",
                    stroke: "var(--viewer-accent, var(--color-semantic-primary-normal))",
                    strokeWidth: _chunkYXXTXTP5cjs.NAV_SELECTION.routeHaloWidth,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    opacity: _chunkYXXTXTP5cjs.NAV_SELECTION.haloOpacity,
                    vectorEffect: "non-scaling-stroke",
                    pointerEvents: "none"
                  }
                ),
                segmentBodyPath && !segmentSelected && !segmentFocused && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "path",
                  {
                    "data-route-casing": "",
                    d: segmentBodyPath,
                    fill: "none",
                    stroke: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                    strokeWidth: "6.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke",
                    pointerEvents: "none"
                  }
                ),
                segmentBodyPath && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "path",
                  {
                    "data-route-path": "",
                    d: segmentBodyPath,
                    fill: "none",
                    stroke: tone,
                    strokeWidth: isProgressSegment ? 3 : phase === "current" || segmentSelected ? 4 : 3,
                    strokeDasharray: dash,
                    opacity: isProgressSegment ? _chunkYXXTXTP5cjs.NAV_PROGRESS_HEAD.futureOpacity : void 0,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    vectorEffect: "non-scaling-stroke",
                    pointerEvents: "none"
                  }
                ),
                isProgressSegment && progressHeadVisible && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  _chunkETVYZPQLcjs.NavigationProgressHeadDefs,
                  {
                    idPrefix: progressHeadId,
                    tone,
                    surface,
                    inverseScale,
                    tipSetbackPx: progressGeometry.tipSetbackPx
                  }
                ),
                isProgressSegment && progressPrefixPath && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "path",
                    {
                      "data-route-progress-casing": "",
                      d: progressPrefixPath,
                      fill: "none",
                      stroke: surface,
                      strokeWidth: _chunkYXXTXTP5cjs.NAV_PROGRESS_HEAD.route.casingWidth,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      vectorEffect: "non-scaling-stroke",
                      pointerEvents: "none"
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "path",
                    {
                      "data-route-progress-past": "",
                      "data-route-progress-marker": progressHeadVisible ? "" : void 0,
                      "data-navigation-progress-head": progressHeadVisible ? "route" : void 0,
                      "data-head-rendering": progressHeadVisible ? "marker-end" : void 0,
                      "data-current-segment-id": progressHeadVisible ? progressSegment.id : void 0,
                      "data-route-anchor-x": progressHeadVisible ? progressPoint.x : void 0,
                      "data-route-anchor-y": progressHeadVisible ? progressPoint.y : void 0,
                      d: progressPrefixPath,
                      fill: "none",
                      stroke: tone,
                      strokeWidth: _chunkYXXTXTP5cjs.NAV_PROGRESS_HEAD.route.coreWidth,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      vectorEffect: "non-scaling-stroke",
                      markerEnd: progressHeadVisible ? `url(#${progressHeadId}-head)` : void 0,
                      pointerEvents: "none"
                    }
                  )
                ] }),
                pathData && interactive && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "path",
                    {
                      "data-route-hit-target": "",
                      "data-screen-target-size": _chunkYXXTXTP5cjs.NAV_HIT.screenTargetSize,
                      d: pathData,
                      fill: "none",
                      stroke: "transparent",
                      strokeWidth: "24",
                      vectorEffect: "non-scaling-stroke",
                      pointerEvents: "stroke"
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "circle",
                    {
                      "data-route-hit-target-core": "",
                      "data-screen-target-size": _chunkYXXTXTP5cjs.NAV_HIT.screenTargetSize,
                      cx: midpoint.x,
                      cy: midpoint.y,
                      r: _chunkYXXTXTP5cjs.NAV_HIT.radius * inverseScale,
                      fill: "transparent",
                      pointerEvents: "all"
                    }
                  )
                ] }),
                conditionGlyphKind && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  "g",
                  {
                    "data-route-condition-glyph": condition,
                    "data-route-screen-slot": conditionSlot ? "condition" : void 0,
                    "data-route-anchor-x": midpoint.x,
                    "data-route-anchor-y": midpoint.y,
                    transform: markerTransform(midpoint, inverseScale, _nullishCoalesce(conditionSlot, () => ( badgeNormalSlot(midpoint)))),
                    "aria-hidden": "true",
                    pointerEvents: "none",
                    children: [
                      !conditionSlot && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        BadgeLeaderTick,
                        {
                          slot: badgeNormalSlot(midpoint),
                          tone,
                          hook: { "data-route-badge-leader": "condition" }
                        }
                      ),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BadgeShadow, { "data-route-badge-shadow": "condition" }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        "circle",
                        {
                          ...obstacle(`route:${route.id}:condition:${segment.id}`),
                          "data-route-marker-badge": "condition",
                          "data-navigation-marker-circle": "",
                          r: _chunkYXXTXTP5cjs.NAV_STATE_BADGE.radius,
                          fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                          stroke: tone,
                          strokeWidth: _chunkYXXTXTP5cjs.NAV_STATE_BADGE.strokeWidth,
                          vectorEffect: "non-scaling-stroke"
                        }
                      ),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGKSI3QZ5cjs.NavigationStateGlyph, { kind: conditionGlyphKind, size: 10, color: markerForeground })
                    ]
                  }
                ),
                [
                  segment.entryTransitionId && points[0] ? { kind: "entry", id: segment.entryTransitionId, point: points[0] } : null,
                  segment.exitTransitionId && points[points.length - 1] ? { kind: "exit", id: segment.exitTransitionId, point: points[points.length - 1] } : null
                ].filter(Boolean).map((transition) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                  "g",
                  {
                    "data-route-transition": transition.kind,
                    "data-transition-id": transition.id,
                    transform: `translate(${transition.point.x} ${transition.point.y}) scale(${inverseScale})`,
                    "aria-hidden": "true",
                    pointerEvents: "none",
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BadgeShadow, { "data-route-transition-shadow": transition.kind }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        "circle",
                        {
                          ...obstacle(`route:${route.id}:transition:${segment.id}:${transition.kind}`),
                          r: "7",
                          fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                          stroke: "var(--viewer-muted, var(--color-semantic-label-neutral))",
                          strokeWidth: "1.5",
                          vectorEffect: "non-scaling-stroke"
                        }
                      ),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                        "text",
                        {
                          x: "0",
                          y: "0.5",
                          textAnchor: "middle",
                          dominantBaseline: "central",
                          fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                          stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
                          strokeWidth: "2.5",
                          paintOrder: "stroke",
                          strokeLinejoin: "round",
                          vectorEffect: "non-scaling-stroke",
                          style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)" },
                          children: "T"
                        }
                      )
                    ]
                  },
                  transition.kind
                )),
                showLabel && segment.label && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  _chunk4KWJ7MLTcjs.NavigationAnnotationBlock,
                  {
                    id: `route:${route.id}:segment:${segment.id}:label`,
                    kind: "route-segment-label",
                    anchor: midpoint,
                    nudgeDirection: "up",
                    priority: _chunk4KWJ7MLTcjs.annotationPriority.call(void 0, {
                      selected: segmentSelected,
                      focused: segmentFocused,
                      alarm: invalid || condition === "blocked" || condition === "conflict",
                      emphasized: phase === "current"
                    }),
                    children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      "text",
                      {
                        "data-route-segment-label": "",
                        "data-route-screen-row": segmentLabelSlot ? "label" : void 0,
                        "data-route-label-anchor-x": midpoint.x,
                        "data-route-label-anchor-y": midpoint.y,
                        x: "0",
                        y: segmentLabelSlot ? 0 : conditionGlyphKind ? -30 : -12,
                        textAnchor: "middle",
                        transform: markerTransform(midpoint, inverseScale, segmentLabelSlot),
                        fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                        stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
                        strokeWidth: _chunkYXXTXTP5cjs.NAV_LABEL_HALO.primary,
                        paintOrder: "stroke",
                        strokeLinejoin: "round",
                        vectorEffect: "non-scaling-stroke",
                        style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-bold)" },
                        "aria-hidden": "true",
                        pointerEvents: "none",
                        children: segment.label
                      }
                    )
                  }
                )
              ]
            },
            segment.id
          );
        }),
        statusPoints.length >= 2 && routeStateMarkers.map((item) => {
          const point = item.point;
          const stateSlot = routeMarkerSlot(item.state);
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "g",
            {
              "data-route-overlay-state": item.state,
              "data-route-screen-slot": stateSlot ? item.state : void 0,
              "data-route-anchor-x": point.x,
              "data-route-anchor-y": point.y,
              transform: markerTransform(point, inverseScale, _nullishCoalesce(stateSlot, () => ( badgeNormalSlot(point)))),
              "aria-hidden": "true",
              pointerEvents: "none",
              children: [
                !stateSlot && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  BadgeLeaderTick,
                  {
                    slot: badgeNormalSlot(point),
                    tone: item.tone,
                    hook: { "data-route-badge-leader": item.state }
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BadgeShadow, { "data-route-badge-shadow": item.state }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "circle",
                  {
                    ...obstacle(`route:${route.id}:state:${item.state}`),
                    "data-route-marker-badge": item.state,
                    "data-navigation-marker-circle": "",
                    r: _chunkYXXTXTP5cjs.NAV_STATE_BADGE.radius,
                    fill: "var(--viewer-surface-elevated, var(--color-semantic-background-elevated-normal))",
                    stroke: item.tone,
                    strokeWidth: _chunkYXXTXTP5cjs.NAV_STATE_BADGE.strokeWidth,
                    strokeDasharray: item.state === "stale" ? _chunkYXXTXTP5cjs.NAV_DASH.staleRing : void 0,
                    vectorEffect: "non-scaling-stroke"
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGKSI3QZ5cjs.NavigationStateGlyph, { kind: item.glyphKind, size: 10, color: markerForeground })
              ]
            },
            item.state
          );
        }),
        progressHeadVisible && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkETVYZPQLcjs.ProgressHeadObstacle,
          {
            obstacle,
            id: `route:${route.id}:progress-head`,
            point: progressPoint,
            angle: progressGeometry.angle,
            inverseScale,
            dataPrefix: "route"
          }
        ),
        statusSegment && statusPoints.length >= 2 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "g",
          {
            "data-route-status-marker": "",
            "data-route-screen-slot": routeMarkerSlot("status") ? "status" : void 0,
            "data-route-anchor-x": routeStatusPoint.x,
            "data-route-anchor-y": routeStatusPoint.y,
            transform: markerTransform(routeStatusPoint, inverseScale, _nullishCoalesce(routeMarkerSlot("status"), () => ( badgeNormalSlot(routeStatusPoint)))),
            "aria-hidden": "true",
            pointerEvents: "none",
            children: [
              !routeMarkerSlot("status") && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                BadgeLeaderTick,
                {
                  slot: badgeNormalSlot(routeStatusPoint),
                  tone: statusTone(route.status),
                  hook: { "data-route-badge-leader": "status" }
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, BadgeShadow, { "data-route-badge-shadow": "status" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "circle",
                {
                  ...obstacle(`route:${route.id}:status`),
                  "data-route-marker-badge": "status",
                  "data-navigation-marker-circle": "",
                  r: _chunkYXXTXTP5cjs.NAV_STATE_BADGE.radius,
                  fill: surface,
                  stroke: statusTone(route.status),
                  strokeWidth: _chunkYXXTXTP5cjs.NAV_STATE_BADGE.strokeWidth,
                  vectorEffect: "non-scaling-stroke"
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                _chunkGKSI3QZ5cjs.NavigationStateGlyph,
                {
                  kind: _nullishCoalesce(STATUS_GLYPH_KIND[route.status], () => ( "unknown")),
                  size: 10,
                  color: markerForeground
                }
              )
            ]
          }
        ),
        showLabel && progressPoint && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunk4KWJ7MLTcjs.NavigationAnnotationBlock,
          {
            id: `route:${route.id}:progress:label`,
            kind: "route-progress-label",
            anchor: progressPoint,
            nudgeDirection: "down",
            priority: _chunk4KWJ7MLTcjs.annotationPriority.call(void 0, {
              selected,
              focused: focused || hasRootFocus || focusedSegment != null,
              alarm: invalid,
              emphasized: route.status === "active"
            }),
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              "text",
              {
                "data-route-progress-label": "",
                "data-route-label-anchor-x": progressPoint.x,
                "data-route-label-anchor-y": progressPoint.y,
                x: "0",
                y: "24",
                textAnchor: "middle",
                transform: markerTransform(progressPoint, inverseScale),
                fill: "var(--viewer-foreground, var(--color-semantic-label-strong))",
                stroke: "var(--viewer-surface, var(--color-semantic-background-normal-normal))",
                strokeWidth: _chunkYXXTXTP5cjs.NAV_LABEL_HALO.caption,
                paintOrder: "stroke",
                strokeLinejoin: "round",
                vectorEffect: "non-scaling-stroke",
                style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)" },
                "aria-hidden": "true",
                pointerEvents: "none",
                children: [
                  "\uD604\uC7AC ",
                  Math.round(progress.fraction * 100),
                  "%"
                ]
              }
            )
          }
        )
      ]
    }
  );
}



exports.RouteOverlay = RouteOverlay;
//# sourceMappingURL=chunk-I7AI42KC.cjs.map