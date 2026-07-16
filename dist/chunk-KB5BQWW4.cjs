"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/robotics/_navigationAnnotations.js
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var NavigationAnnotationContext = _react2.default.createContext(null);
var useIsomorphicLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var INERT_RESOLUTION = Object.freeze({ tx: 0, ty: 0, dyPx: 0, hidden: false });
var noopSubscribe = () => () => {
};
function annotationPriority({ selected, focused, alarm, emphasized } = {}) {
  return (selected ? 400 : 0) + (focused ? 300 : 0) + (alarm ? 200 : 0) + (emphasized ? 100 : 0);
}
var KIND_WEIGHT = {
  "region-label": 0,
  "lane-label": 1,
  "route-segment-label": 2,
  "route-progress-label": 2,
  "trajectory-label": 3,
  "waypoint-label": 4,
  "facility-label": 5
};
function solveAnnotationLayout(labels, obstacleRects, options = {}) {
  const gap = Number.isFinite(options.labelGapPx) ? options.labelGapPx : 4;
  const maxNudge = Number.isFinite(options.maxLabelDisplacementPx) ? options.maxLabelDisplacementPx : 56;
  const order = [...labels].sort((a, b) => b.meta.priority - a.meta.priority || b.meta.weight - a.meta.weight || String(a.meta.id).localeCompare(String(b.meta.id)));
  const placed = obstacleRects.map((rect) => ({
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom
  }));
  const out = /* @__PURE__ */ new Map();
  for (const label of order) {
    const rect = label.rect;
    const height = rect.height;
    const naturalTop = rect.top;
    const blockers = placed.filter((candidate) => candidate.left < rect.right && candidate.right > rect.left);
    const forbidden = blockers.map((blocker) => [blocker.top - gap - height, blocker.bottom + gap]);
    const isFree = (top) => forbidden.every(([lo, hi]) => top <= lo + 1e-6 || top >= hi - 1e-6);
    const direction = _nullishCoalesce(label.meta.nudgeDirection, () => ( "any"));
    let chosenTop;
    if (isFree(naturalTop)) {
      chosenTop = naturalTop;
    } else {
      let best;
      for (const [lo, hi] of forbidden) {
        for (const candidate of [lo, hi]) {
          const dy = candidate - naturalTop;
          if (direction === "up" && dy > 1e-6) continue;
          if (direction === "down" && dy < -1e-6) continue;
          if (Math.abs(dy) > maxNudge) continue;
          if (!isFree(candidate)) continue;
          if (best === void 0) {
            best = candidate;
            continue;
          }
          const bestDy = best - naturalTop;
          if (Math.abs(dy) < Math.abs(bestDy) - 1e-6) best = candidate;
          else if (Math.abs(Math.abs(dy) - Math.abs(bestDy)) <= 1e-6 && dy < bestDy) best = candidate;
        }
      }
      chosenTop = best;
    }
    if (chosenTop === void 0) {
      out.set(label.key, { dyPx: 0, hidden: true });
      continue;
    }
    out.set(label.key, { dyPx: chosenTop - naturalTop, hidden: false });
    placed.push({ left: rect.left, top: chosenTop, right: rect.right, bottom: chosenTop + height });
  }
  return out;
}
function resolutionEquals(a, b) {
  return a.hidden === b.hidden && Math.abs(a.dyPx - b.dyPx) <= 0.5;
}
function createAnnotationStore() {
  const labels = /* @__PURE__ */ new Map();
  const obstacles = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  let published = /* @__PURE__ */ new Map();
  let options = { labelGapPx: 4, maxLabelDisplacementPx: 56, host: null };
  let frame = 0;
  const emit = () => {
    listeners.forEach((listener) => listener());
  };
  const updateHostAttributes = () => {
    const host = options.host;
    if (!host) return;
    let displaced = 0;
    let suppressed = 0;
    published.forEach((resolution) => {
      if (resolution.hidden) suppressed += 1;
      else if (Math.abs(resolution.dyPx) > 0.5) displaced += 1;
    });
    host.setAttribute("data-annotation-label-count", String(labels.size));
    host.setAttribute("data-annotation-obstacle-count", String(obstacles.size));
    host.setAttribute("data-annotation-displaced-count", String(displaced));
    host.setAttribute("data-annotation-suppressed-count", String(suppressed));
  };
  const flush = () => {
    if (frame && typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    const measured = [];
    labels.forEach((entry, key) => {
      const el = entry.el;
      if (!el || !el.isConnected || typeof el.getScreenCTM !== "function") return;
      const ctm = el.getScreenCTM();
      const rect = el.getBoundingClientRect();
      if (!ctm || !(rect.width > 0) || !(rect.height > 0)) return;
      const applied = entry.applied;
      let left = rect.left;
      let top = rect.top;
      if (applied && (applied.tx || applied.ty)) {
        left -= ctm.a * applied.tx + ctm.c * applied.ty;
        top -= ctm.b * applied.tx + ctm.d * applied.ty;
      }
      measured.push({
        key,
        meta: entry.meta,
        ctm,
        rect: {
          left,
          top,
          right: left + rect.width,
          bottom: top + rect.height,
          width: rect.width,
          height: rect.height
        }
      });
    });
    const obstacleRects = [];
    obstacles.forEach((el) => {
      if (!el || !el.isConnected) return;
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) obstacleRects.push(rect);
    });
    const solved = solveAnnotationLayout(measured, obstacleRects, options);
    const next = /* @__PURE__ */ new Map();
    let changed = published.size !== measured.length;
    measured.forEach(({ key, ctm }) => {
      const target = _nullishCoalesce(solved.get(key), () => ( { dyPx: 0, hidden: false }));
      const previous = published.get(key);
      if (previous && resolutionEquals(previous, target)) {
        next.set(key, previous);
        return;
      }
      changed = true;
      const det = ctm.a * ctm.d - ctm.b * ctm.c;
      const dyPx = target.hidden ? 0 : target.dyPx;
      next.set(key, {
        tx: det ? -ctm.c * dyPx / det : 0,
        ty: det ? ctm.a * dyPx / det : dyPx,
        dyPx,
        hidden: target.hidden
      });
    });
    if (changed) {
      published = next;
      emit();
    }
    updateHostAttributes();
  };
  const schedule = () => {
    if (typeof requestAnimationFrame !== "function") return;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      flush();
    });
  };
  return {
    registerLabel(key, el, meta, applied) {
      labels.set(key, { el, meta, applied });
      schedule();
    },
    unregisterLabel(key) {
      if (labels.delete(key)) schedule();
    },
    registerObstacle(key, el) {
      obstacles.set(key, el);
      schedule();
    },
    unregisterObstacle(key) {
      if (obstacles.delete(key)) schedule();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getResolution(key) {
      return _nullishCoalesce(published.get(key), () => ( INERT_RESOLUTION));
    },
    setOptions(nextOptions) {
      options = { ...options, ...nextOptions };
    },
    schedule,
    flush
  };
}
function NavigationAnnotationBlock({
  id,
  kind,
  anchor,
  priority = 0,
  nudgeDirection = "any",
  children
}) {
  const store = _react2.default.useContext(NavigationAnnotationContext);
  const key = _react2.default.useId();
  const ref = _react2.default.useRef(null);
  const resolution = _react2.default.useSyncExternalStore(
    store ? store.subscribe : noopSubscribe,
    store ? () => store.getResolution(key) : () => INERT_RESOLUTION,
    () => INERT_RESOLUTION
  );
  useIsomorphicLayoutEffect(() => {
    if (!store || !ref.current) return void 0;
    store.registerLabel(key, ref.current, {
      id,
      kind,
      priority,
      nudgeDirection,
      weight: _nullishCoalesce(KIND_WEIGHT[kind], () => ( 0))
    }, resolution);
    return () => store.unregisterLabel(key);
  });
  const displaced = !resolution.hidden && Math.abs(resolution.dyPx) > 0.5;
  return _react2.default.createElement("g", {
    ref,
    "data-navigation-annotation": "label",
    "data-annotation-kind": kind,
    "data-annotation-id": id,
    "data-annotation-anchor-x": _optionalChain([anchor, 'optionalAccess', _2 => _2.x]),
    "data-annotation-anchor-y": _optionalChain([anchor, 'optionalAccess', _3 => _3.y]),
    "data-annotation-priority": priority,
    "data-annotation-displaced": displaced ? "true" : void 0,
    "data-annotation-dy": displaced ? Math.round(resolution.dyPx * 100) / 100 : void 0,
    "data-annotation-suppressed": resolution.hidden ? "true" : void 0,
    transform: displaced ? `translate(${resolution.tx} ${resolution.ty})` : void 0,
    visibility: resolution.hidden ? "hidden" : void 0,
    pointerEvents: "none"
  }, children);
}
function useNavigationObstacles() {
  const store = _react2.default.useContext(NavigationAnnotationContext);
  const base = _react2.default.useId();
  const callbacks = _react2.default.useRef(/* @__PURE__ */ new Map());
  _react2.default.useEffect(() => () => {
    if (!store) return;
    callbacks.current.forEach((_, slot) => store.unregisterObstacle(`${base}:${slot}`));
    callbacks.current.clear();
  }, [store, base]);
  if (!store) return () => ({});
  return (slot) => {
    let refCallback = callbacks.current.get(slot);
    if (!refCallback) {
      const key = `${base}:${slot}`;
      refCallback = (el) => {
        if (el) store.registerObstacle(key, el);
        else store.unregisterObstacle(key);
      };
      callbacks.current.set(slot, refCallback);
    }
    return { ref: refCallback, "data-annotation-obstacle": slot };
  };
}








exports.NavigationAnnotationContext = NavigationAnnotationContext; exports.useIsomorphicLayoutEffect = useIsomorphicLayoutEffect; exports.annotationPriority = annotationPriority; exports.createAnnotationStore = createAnnotationStore; exports.NavigationAnnotationBlock = NavigationAnnotationBlock; exports.useNavigationObstacles = useNavigationObstacles;
//# sourceMappingURL=chunk-KB5BQWW4.cjs.map