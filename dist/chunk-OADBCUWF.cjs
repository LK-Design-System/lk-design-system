"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');

// components/data/NetworkGraph.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SHAPE = {
  /* 열 간격은 카드 폭 + 관계 라벨이 들어갈 통로다. 220이면 통로가 52px뿐이라
     라벨이 놓일 자리가 아예 없어 노드 위로 밀려났다. 플로우 에디터가 열을
     넉넉히 띄우는 이유가 이것이다. */
  card: { width: 168, height: 52, columnPitch: 300, rowPitch: 92 },
  dot: { width: 96, height: 96, columnPitch: 150, rowPitch: 92 }
};
var DOT_RADIUS = 16;
var DOT_RADIUS_MAX = 30;
var NODE_STATE_STYLE = {
  normal: { opacity: 1, strokeDasharray: void 0 },
  muted: { opacity: 0.45, strokeDasharray: void 0 },
  degraded: { opacity: 1, strokeDasharray: "6 3" },
  blocked: { opacity: 1, strokeDasharray: "2 3" },
  disabled: { opacity: 0.3, strokeDasharray: "2 3" }
};
var EDGE_STATE_STYLE = {
  normal: { opacity: 1, dash: void 0, width: 1.5 },
  live: { opacity: 1, dash: void 0, width: 2.5 },
  degraded: { opacity: 0.9, dash: "6 4", width: 2 },
  blocked: { opacity: 0.9, dash: "2 4", width: 2 },
  idle: { opacity: 0.5, dash: "4 4", width: 1.5 },
  disabled: { opacity: 0.3, dash: "2 4", width: 1 }
};
var LABEL_FONT_SIZE = 13;
var CAPTION_FONT_SIZE = 12;
var NARROW_RATIO = 0.55;
var DOT_LABEL_MAX_WIDTH = 168;
var CUE_MIN_TARGET = 24;
var SUMMARY_NAME_LIMIT = 10;
var LINE_HEIGHT_RATIO = 1.35;
function lineHeight(fontSize) {
  return fontSize * LINE_HEIGHT_RATIO;
}
function isWideGlyph(code) {
  return code >= 4352 && code <= 4447 || code >= 11904 && code <= 42191 || code >= 44032 && code <= 55203 || code >= 63744 && code <= 64255 || code >= 65072 && code <= 65135 || code >= 65280 && code <= 65376;
}
function estimateTextWidth(text, fontSize) {
  if (!text) return 0;
  let width = 0;
  for (let index = 0; index < text.length; index += 1) {
    width += isWideGlyph(text.charCodeAt(index)) ? fontSize : fontSize * NARROW_RATIO;
  }
  return width;
}
function fitText(text, maxWidth, fontSize) {
  if (!text || estimateTextWidth(text, fontSize) <= maxWidth) return text;
  const room = maxWidth - estimateTextWidth("\u2026", fontSize);
  let width = 0;
  let cut = 0;
  while (cut < text.length) {
    const step = isWideGlyph(text.charCodeAt(cut)) ? fontSize : fontSize * NARROW_RATIO;
    if (width + step > room) break;
    width += step;
    cut += 1;
  }
  return cut === 0 ? "\u2026" : `${text.slice(0, cut).trimEnd()}\u2026`;
}
function nodeText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).filter(Boolean).join(" ");
  if (_react2.default.isValidElement(node)) return nodeText(node.props.children);
  return "";
}
function stableHash(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 1e5;
  }
  return hash;
}
function resolveColumns(nodes) {
  const explicit = nodes.some((node) => Number.isInteger(node.column));
  if (explicit) {
    return nodes.map((node) => Number.isInteger(node.column) ? node.column : 0);
  }
  return nodes.map((node) => node.root ? 0 : Math.max(1, Number(node.depth) || 1));
}
function layoutNodes(nodes, layout, metrics) {
  if (!nodes.length) return /* @__PURE__ */ new Map();
  if (layout === "manual") {
    return new Map(
      nodes.map((node) => [node.id, { x: Number(node.x) || 0, y: Number(node.y) || 0 }])
    );
  }
  const columns = resolveColumns(nodes);
  const byColumn = /* @__PURE__ */ new Map();
  nodes.forEach((node, index) => {
    const column = columns[index];
    byColumn.set(column, [..._nullishCoalesce(byColumn.get(column), () => ( [])), node]);
  });
  const positions = /* @__PURE__ */ new Map();
  const orderedColumns = [...byColumn.keys()].sort((left, right) => left - right);
  const tallest = Math.max(
    ...orderedColumns.map((column) => byColumn.get(column).length),
    1
  );
  orderedColumns.forEach((column, columnIndex) => {
    const inColumn = [...byColumn.get(column)].sort((left, right) => {
      const group = String(_nullishCoalesce(left.group, () => ( ""))).localeCompare(String(_nullishCoalesce(right.group, () => ( ""))));
      return group !== 0 ? group : String(left.id).localeCompare(String(right.id));
    });
    const columnHeight = (inColumn.length - 1) * metrics.rowPitch;
    const top = ((tallest - 1) * metrics.rowPitch - columnHeight) / 2;
    inColumn.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x: columnIndex * metrics.columnPitch,
        y: top + rowIndex * metrics.rowPitch
      });
    });
  });
  return positions;
}
function edgePath(from, to, metrics) {
  if (!from || !to) return null;
  if (from === to || from.x === to.x && from.y === to.y) {
    const radius = _nullishCoalesce(from.radius, () => ( (metrics.shape === "dot" ? DOT_RADIUS : metrics.height / 2)));
    const turn = (_nullishCoalesce(metrics.selfIndex, () => ( 0))) * (Math.PI / 3);
    const spread = Math.PI / 7;
    const base = -Math.PI / 2 + turn;
    const exit = base - spread;
    const enter = base + spread;
    const reach = radius * 4.2;
    return {
      start: { x: from.x + Math.cos(exit) * radius, y: from.y + Math.sin(exit) * radius },
      control: { x: from.x + Math.cos(exit) * reach, y: from.y + Math.sin(exit) * reach },
      controlOut: { x: from.x + Math.cos(enter) * reach, y: from.y + Math.sin(enter) * reach },
      end: { x: from.x + Math.cos(enter) * radius, y: from.y + Math.sin(enter) * radius }
    };
  }
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (metrics.shape === "dot") {
    const distance = Math.hypot(dx, dy) || 1;
    const unitX = dx / distance;
    const unitY = dy / distance;
    const startX = from.x + unitX * (_nullishCoalesce(from.radius, () => ( DOT_RADIUS)));
    const startY2 = from.y + unitY * (_nullishCoalesce(from.radius, () => ( DOT_RADIUS)));
    const endX = to.x - unitX * (_nullishCoalesce(to.radius, () => ( DOT_RADIUS)));
    const endY2 = to.y - unitY * (_nullishCoalesce(to.radius, () => ( DOT_RADIUS)));
    const bow2 = metrics.parallel ? Math.min(28, distance / 6) : 0;
    const controlX2 = (startX + endX) / 2 - unitY * bow2;
    const controlY2 = (startY2 + endY2) / 2 + unitX * bow2;
    return { start: { x: startX, y: startY2 }, control: { x: controlX2, y: controlY2 }, end: { x: endX, y: endY2 } };
  }
  const halfWidth = metrics.width / 2;
  const halfHeight = metrics.height / 2;
  const horizontal = Math.abs(dx) > metrics.width * 0.75;
  if (horizontal) {
    const direction2 = Math.sign(dx);
    const startX = from.x + direction2 * halfWidth;
    const endX = to.x - direction2 * halfWidth;
    const controlX2 = (startX + endX) / 2;
    const controlY2 = (from.y + to.y) / 2;
    return { start: { x: startX, y: from.y }, control: { x: controlX2, y: controlY2 }, end: { x: endX, y: to.y } };
  }
  const direction = Math.sign(dy) || 1;
  const startY = from.y + direction * halfHeight;
  const endY = to.y - direction * halfHeight;
  const bow = Math.max(48, Math.abs(endY - startY) / 2);
  const controlX = (from.x + to.x) / 2 + bow;
  const controlY = (startY + endY) / 2;
  return { start: { x: from.x, y: startY }, control: { x: controlX, y: controlY }, end: { x: to.x, y: endY } };
}
var FORCE_TICKS = 150;
var FORCE_TICKS_PER_FRAME = 1;
var FORCE_LINK_LENGTH = 132;
var FORCE_CHARGE = 9e3;
var FORCE_LINK_K = 0.06;
var FORCE_CENTER_K = 0.012;
var FORCE_DAMPING = 0.82;
var FORCE_COLLIDE_PADDING = 16;
var FORCE_BIRTH_RADIUS = 46;
function forceJitter(id, axis) {
  return (stableHash(`${id}:${axis}`) % 1e3 / 1e3 - 0.5) * 8;
}
function createForceBodies(nodes, base, radiusOf, footprintOf) {
  return nodes.map((node) => {
    const point = _nullishCoalesce(base.get(node.id), () => ( { x: 0, y: 0 }));
    return {
      id: node.id,
      x: point.x + forceJitter(node.id, "x"),
      y: point.y + forceJitter(node.id, "y"),
      vx: 0,
      vy: 0,
      r: footprintOf ? footprintOf(node) : radiusOf(node) || DOT_RADIUS,
      fx: null,
      fy: null
    };
  });
}
function createForceLinks(edges, bodies) {
  const byId = new Map(bodies.map((body) => [body.id, body]));
  return edges.map((edge) => ({ a: byId.get(edge.from), b: byId.get(edge.to) })).filter((link) => link.a && link.b && link.a !== link.b);
}
function forceTick(bodies, links) {
  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const a = bodies[i];
      const b = bodies[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let squared = dx * dx + dy * dy;
      if (squared < 1) {
        const angle = stableHash(`${a.id}:${b.id}`) % 360;
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        squared = 1;
      }
      const distance = Math.sqrt(squared);
      const ux = dx / distance;
      const uy = dy / distance;
      const repulsion = Math.min(FORCE_CHARGE / squared, 60);
      a.vx -= ux * repulsion;
      a.vy -= uy * repulsion;
      b.vx += ux * repulsion;
      b.vy += uy * repulsion;
      const overlap = a.r + b.r + FORCE_COLLIDE_PADDING - distance;
      if (overlap > 0) {
        a.vx -= ux * overlap * 0.5;
        a.vy -= uy * overlap * 0.5;
        b.vx += ux * overlap * 0.5;
        b.vy += uy * overlap * 0.5;
      }
    }
  }
  for (const link of links) {
    const dx = link.b.x - link.a.x;
    const dy = link.b.y - link.a.y;
    const distance = Math.hypot(dx, dy) || 1;
    const pull = FORCE_LINK_K * (distance - FORCE_LINK_LENGTH);
    const ux = dx / distance;
    const uy = dy / distance;
    link.a.vx += ux * pull;
    link.a.vy += uy * pull;
    link.b.vx -= ux * pull;
    link.b.vy -= uy * pull;
  }
  for (const body of bodies) {
    if (body.fx != null) {
      body.x = body.fx;
      body.y = body.fy;
      body.vx = 0;
      body.vy = 0;
      continue;
    }
    body.vx -= body.x * FORCE_CENTER_K;
    body.vy -= body.y * FORCE_CENTER_K;
    body.vx *= FORCE_DAMPING;
    body.vy *= FORCE_DAMPING;
    body.x += body.vx;
    body.y += body.vy;
  }
}
function settledForcePositions(nodes, edges, base, radiusOf, footprintOf) {
  const bodies = createForceBodies(nodes, base, radiusOf, footprintOf);
  const links = createForceLinks(edges, bodies);
  for (let tick = 0; tick < FORCE_TICKS; tick += 1) forceTick(bodies, links);
  return new Map(bodies.map((body) => [body.id, { x: body.x, y: body.y }]));
}
function pointOnCurve(curve, t) {
  const { start, control, controlOut, end } = curve;
  const inverse = 1 - t;
  if (controlOut) {
    const a = inverse * inverse * inverse;
    const b = 3 * inverse * inverse * t;
    const c = 3 * inverse * t * t;
    const d = t * t * t;
    return {
      x: a * start.x + b * control.x + c * controlOut.x + d * end.x,
      y: a * start.y + b * control.y + c * controlOut.y + d * end.y
    };
  }
  return {
    x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
    y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y
  };
}
function boxOverlapArea(a, b) {
  const x = Math.min(a.x + a.width / 2, b.x + b.width / 2) - Math.max(a.x - a.width / 2, b.x - b.width / 2);
  const y = Math.min(a.y + a.height / 2, b.y + b.height / 2) - Math.max(a.y - a.height / 2, b.y - b.height / 2);
  return x > 0 && y > 0 ? x * y : 0;
}
var LABEL_CANDIDATE_T = [0.5, 0.38, 0.62, 0.28, 0.72];
var LABEL_CANDIDATE_OFFSET = [0, 18, -18, 34, -34, 52, -52];
function curveTangent(curve, t) {
  const { start, control, controlOut, end } = curve;
  let x;
  let y;
  if (controlOut) {
    const inverse = 1 - t;
    x = 3 * inverse * inverse * (control.x - start.x) + 6 * inverse * t * (controlOut.x - control.x) + 3 * t * t * (end.x - controlOut.x);
    y = 3 * inverse * inverse * (control.y - start.y) + 6 * inverse * t * (controlOut.y - control.y) + 3 * t * t * (end.y - controlOut.y);
  } else {
    x = 2 * (1 - t) * (control.x - start.x) + 2 * t * (end.x - control.x);
    y = 2 * (1 - t) * (control.y - start.y) + 2 * t * (end.y - control.y);
  }
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}
function placeEdgeLabels(entries, obstacles) {
  const placed = [...obstacles];
  return entries.map((entry) => {
    if (!entry.curve || !entry.text) return { ...entry, label: null };
    const width = estimateTextWidth(entry.text, CAPTION_FONT_SIZE) + 6;
    const height = 16;
    let best = null;
    for (const t of LABEL_CANDIDATE_T) {
      const base = pointOnCurve(entry.curve, t);
      const tangent = curveTangent(entry.curve, t);
      for (const offset of LABEL_CANDIDATE_OFFSET) {
        const point = {
          x: base.x - tangent.y * offset,
          y: base.y + tangent.x * offset
        };
        const box = { x: point.x, y: point.y - 6, width, height };
        const cost = placed.reduce((sum, other) => sum + boxOverlapArea(box, other), 0);
        if (cost === 0) {
          placed.push(box);
          return { ...entry, label: point };
        }
        if (!best || cost < best.cost) best = { cost, point, box };
      }
    }
    if (best) {
      placed.push(best.box);
      return { ...entry, label: best.point };
    }
    return { ...entry, label: pointOnCurve(entry.curve, LABEL_CANDIDATE_T[0]) };
  });
}
function NetworkGraph({
  nodes: nodesInput = [],
  edges: edgesInput = [],
  layout = "layered",
  nodeShape = "card",
  showEdgeLabels = true,
  motion = "auto",
  nodeColor = "var(--color-semantic-primary-normal)",
  edgeColor = "var(--color-semantic-line-solid-normal)",
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
  onToggleNode,
  label,
  description,
  summary,
  emptyLabel = "\uD45C\uC2DC\uD560 \uAD00\uACC4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  height = 480,
  style,
  ...rest
}) {
  const rawId = _react2.default.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const descriptionId = `${rawId}-description`;
  const summaryId = `${rawId}-summary`;
  const metrics = _nullishCoalesce(SHAPE[nodeShape], () => ( SHAPE.card));
  const isDot = nodeShape === "dot";
  const isForce = layout === "force";
  const nodes = _react2.default.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    return nodesInput.filter((node) => {
      if (seen.has(node.id)) return false;
      seen.add(node.id);
      return true;
    });
  }, [nodesInput]);
  const edges = _react2.default.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    return edgesInput.filter((edge) => {
      if (seen.has(edge.id)) return false;
      seen.add(edge.id);
      return true;
    });
  }, [edgesInput]);
  const gridPositions = _react2.default.useMemo(
    () => layoutNodes(nodes, isForce ? "layered" : layout, metrics),
    [isForce, layout, metrics, nodes]
  );
  const nodeById = _react2.default.useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes]
  );
  const radiusOf = _react2.default.useCallback(
    (node) => {
      if (!isDot) return 0;
      const values = nodes.map((item) => Number(item.size) || 0);
      const max = Math.max(...values, 0);
      if (!max) return DOT_RADIUS;
      const ratio = Math.sqrt(Math.max(0, Number(node.size) || 0) / max);
      return DOT_RADIUS + (DOT_RADIUS_MAX - DOT_RADIUS) * ratio;
    },
    [isDot, nodes]
  );
  const labelRoomFor = _react2.default.useCallback(
    () => isDot ? DOT_LABEL_MAX_WIDTH : metrics.width - 32,
    [isDot, metrics.width]
  );
  const fittedLabelWidth = _react2.default.useCallback(
    (node) => estimateTextWidth(
      fitText(nodeText(node.label) || node.id, labelRoomFor(), LABEL_FONT_SIZE),
      LABEL_FONT_SIZE
    ),
    [labelRoomFor]
  );
  const fittedCaptionWidth = _react2.default.useCallback(
    (node) => estimateTextWidth(
      fitText(nodeText(node.caption), labelRoomFor(), CAPTION_FONT_SIZE),
      CAPTION_FONT_SIZE
    ),
    [labelRoomFor]
  );
  const footprintOf = _react2.default.useCallback(
    (node) => {
      if (!isDot) return Math.hypot(metrics.width, metrics.height) / 2;
      const radius = radiusOf(node) || DOT_RADIUS;
      const nameWidth = fittedLabelWidth(node);
      const captionWidth = fittedCaptionWidth(node);
      const below = radius + (nodeText(node.caption) ? 35 : 20);
      return Math.max(radius, below, nameWidth / 2, captionWidth / 2);
    },
    [fittedCaptionWidth, fittedLabelWidth, isDot, metrics.height, metrics.width, radiusOf]
  );
  const settledPositions = _react2.default.useMemo(
    () => isForce ? settledForcePositions(nodes, edges, gridPositions, radiusOf, footprintOf) : null,
    [edges, footprintOf, gridPositions, isForce, nodes, radiusOf]
  );
  const [livePositions, setLivePositions] = _react2.default.useState(null);
  const [reduceMotion, setReduceMotion] = _react2.default.useState(() => typeof window === "undefined" || !window.matchMedia ? true : window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const simRef = _react2.default.useRef(null);
  _react2.default.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return void 0;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (event) => setReduceMotion(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  const motionAllowed = isForce && motion !== "none" && !reduceMotion;
  const lastPositionsRef = _react2.default.useRef(null);
  _react2.default.useEffect(() => {
    if (!isForce) {
      simRef.current = null;
      setLivePositions(null);
      return void 0;
    }
    const previous = lastPositionsRef.current;
    const seeds = /* @__PURE__ */ new Map();
    nodes.forEach((node) => {
      const kept = _optionalChain([previous, 'optionalAccess', _ => _.get, 'call', _2 => _2(node.id)]);
      if (kept) seeds.set(node.id, kept);
    });
    nodes.forEach((node) => {
      if (seeds.has(node.id)) return;
      const link = edges.find((edge) => edge.from === node.id && seeds.has(edge.to) || edge.to === node.id && seeds.has(edge.from));
      const anchorId = link ? link.from === node.id ? link.to : link.from : null;
      const anchor = anchorId && seeds.get(anchorId);
      if (!anchor) {
        seeds.set(node.id, gridPositions.get(node.id) || { x: 0, y: 0 });
        return;
      }
      const angle = stableHash(node.id) % 360 * (Math.PI / 180);
      seeds.set(node.id, {
        x: anchor.x + Math.cos(angle) * FORCE_BIRTH_RADIUS,
        y: anchor.y + Math.sin(angle) * FORCE_BIRTH_RADIUS
      });
    });
    const bodies = createForceBodies(nodes, seeds, radiusOf, footprintOf);
    const links = createForceLinks(edges, bodies);
    simRef.current = { bodies, links, byId: new Map(bodies.map((b) => [b.id, b])) };
    if (!motionAllowed) {
      bodies.forEach((body) => {
        const settled = _optionalChain([settledPositions, 'optionalAccess', _3 => _3.get, 'call', _4 => _4(body.id)]);
        if (!settled) return;
        body.x = settled.x;
        body.y = settled.y;
        body.vx = 0;
        body.vy = 0;
      });
      setLivePositions(null);
      return void 0;
    }
    let frame = 0;
    let ticked = 0;
    const step = () => {
      for (let i = 0; i < FORCE_TICKS_PER_FRAME && ticked < FORCE_TICKS; i += 1, ticked += 1) {
        forceTick(bodies, links);
      }
      setLivePositions(new Map(bodies.map((b) => [b.id, { x: b.x, y: b.y }])));
      if (ticked < FORCE_TICKS) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [edges, footprintOf, gridPositions, isForce, motionAllowed, nodes, radiusOf, settledPositions]);
  const svgRef = _react2.default.useRef(null);
  const dragRef = _react2.default.useRef(null);
  const suppressClickRef = _react2.default.useRef(false);
  const toGraphPoint = _react2.default.useCallback((event) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  }, []);
  const dragTicker = _react2.default.useCallback(() => {
    const sim = simRef.current;
    if (!sim || !dragRef.current) return;
    forceTick(sim.bodies, sim.links);
    setLivePositions(new Map(sim.bodies.map((b) => [b.id, { x: b.x, y: b.y }])));
    dragRef.current.frame = window.requestAnimationFrame(dragTicker);
  }, []);
  const nodePointerDown = _react2.default.useCallback((event, node) => {
    if (!isForce || !motionAllowed || !simRef.current) return;
    const start = toGraphPoint(event);
    if (!start) return;
    dragRef.current = { id: node.id, start, moved: false, frame: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [isForce, motionAllowed, toGraphPoint]);
  const nodePointerMove = _react2.default.useCallback((event) => {
    const drag = dragRef.current;
    const sim = simRef.current;
    if (!drag || !sim) return;
    const point = toGraphPoint(event);
    if (!point) return;
    if (!drag.moved) {
      if (Math.hypot(point.x - drag.start.x, point.y - drag.start.y) < 4) return;
      drag.moved = true;
      suppressClickRef.current = true;
      drag.frame = window.requestAnimationFrame(dragTicker);
    }
    const body = sim.byId.get(drag.id);
    if (body) {
      body.fx = point.x;
      body.fy = point.y;
    }
  }, [dragTicker, toGraphPoint]);
  const nodePointerUp = _react2.default.useCallback(() => {
    const drag = dragRef.current;
    const sim = simRef.current;
    if (!drag) return;
    window.cancelAnimationFrame(drag.frame);
    dragRef.current = null;
    if (sim) {
      const body = sim.byId.get(drag.id);
      if (body) {
        body.fx = null;
        body.fy = null;
      }
      if (drag.moved) {
        let cooled = 0;
        const cool = () => {
          if (!simRef.current || dragRef.current) return;
          forceTick(sim.bodies, sim.links);
          setLivePositions(new Map(sim.bodies.map((b) => [b.id, { x: b.x, y: b.y }])));
          cooled += 1;
          if (cooled < 150) window.requestAnimationFrame(cool);
        };
        window.requestAnimationFrame(cool);
      }
    }
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  }, []);
  const positions = isForce ? _nullishCoalesce(livePositions, () => ( (motionAllowed ? gridPositions : settledPositions))) : gridPositions;
  _react2.default.useEffect(() => {
    lastPositionsRef.current = positions;
  });
  const mountedRef = _react2.default.useRef(false);
  const previousIdsRef = _react2.default.useRef(/* @__PURE__ */ new Set());
  const enteringIds = _react2.default.useMemo(() => {
    const entering = /* @__PURE__ */ new Set();
    if (mountedRef.current) {
      nodes.forEach((node) => {
        if (!previousIdsRef.current.has(node.id)) entering.add(node.id);
      });
    }
    return entering;
  }, [nodes]);
  _react2.default.useEffect(() => {
    mountedRef.current = true;
    previousIdsRef.current = new Set(nodes.map((node) => node.id));
  }, [nodes]);
  const anchors = _react2.default.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    nodes.forEach((node) => {
      const point = positions.get(node.id);
      if (point) map.set(node.id, { ...point, radius: radiusOf(node) });
    });
    return map;
  }, [nodes, positions, radiusOf]);
  const edgeColors = _react2.default.useMemo(
    () => [...new Set(edges.map((edge) => edge.color || edgeColor))].sort(),
    [edgeColor, edges]
  );
  const markerId = _react2.default.useCallback(
    (color) => `lds-network-arrow-${rawId}-${stableHash(color)}`,
    [rawId]
  );
  const bounds = _react2.default.useMemo(() => {
    const frame = isForce ? settledPositions : positions;
    const values = [..._nullishCoalesce(_optionalChain([frame, 'optionalAccess', _5 => _5.values, 'call', _6 => _6()]), () => ( []))];
    if (!values.length) return { minX: 0, minY: 0, width: metrics.width, height: metrics.height };
    const xs = values.map((point) => point.x);
    const ys = values.map((point) => point.y);
    const padding = metrics.width;
    return {
      minX: Math.min(...xs) - padding,
      minY: Math.min(...ys) - metrics.height,
      width: Math.max(...xs) - Math.min(...xs) + padding * 2,
      height: Math.max(...ys) - Math.min(...ys) + metrics.height * 2
    };
  }, [isForce, metrics, positions, settledPositions]);
  const laidOutEdges = _react2.default.useMemo(() => {
    const pairCounts = /* @__PURE__ */ new Map();
    edges.forEach((edge) => {
      const key = [edge.from, edge.to].sort().join("\u2192");
      pairCounts.set(key, (_nullishCoalesce(pairCounts.get(key), () => ( 0))) + 1);
    });
    const selfSeen = /* @__PURE__ */ new Map();
    const entries = edges.map((edge) => ({
      edge,
      curve: edgePath(anchors.get(edge.from), anchors.get(edge.to), {
        ...metrics,
        shape: nodeShape,
        parallel: (_nullishCoalesce(pairCounts.get([edge.from, edge.to].sort().join("\u2192")), () => ( 0))) > 1,
        selfIndex: edge.from === edge.to ? (() => {
          const seen = _nullishCoalesce(selfSeen.get(edge.from), () => ( 0));
          selfSeen.set(edge.from, seen + 1);
          return seen;
        })() : 0
      }),
      text: showEdgeLabels ? `${nodeText(edge.label)}${edge.count > 1 ? ` ${edge.count}` : ""}`.trim() : ""
    }));
    const obstacles = nodes.flatMap((node) => {
      const point = anchors.get(node.id);
      if (!point) return [];
      if (!isDot) {
        return [{ x: point.x, y: point.y, width: metrics.width, height: metrics.height }];
      }
      const nameWidth = fittedLabelWidth(node) + 8;
      const captionWidth = fittedCaptionWidth(node) + 8;
      return [
        { x: point.x, y: point.y, width: point.radius * 2, height: point.radius * 2 },
        { x: point.x, y: point.y + point.radius + 12, width: nameWidth, height: lineHeight(LABEL_FONT_SIZE) },
        ...captionWidth > 8 ? [{ x: point.x, y: point.y + point.radius + 28, width: captionWidth, height: lineHeight(CAPTION_FONT_SIZE) }] : []
      ];
    });
    return placeEdgeLabels(entries, obstacles);
  }, [anchors, edges, fittedCaptionWidth, fittedLabelWidth, isDot, metrics, nodeShape, nodes, showEdgeLabels]);
  const hasData = nodes.length > 0;
  const automaticSummary = hasData ? (() => {
    const names = nodes.map((node) => nodeText(node.label) || node.id);
    const shown = names.slice(0, SUMMARY_NAME_LIMIT);
    const rest2 = names.length - shown.length;
    const listed = rest2 > 0 ? `${shown.join(", ")} \uC678 ${rest2}\uAC1C` : shown.join(", ");
    return `\uB300\uC0C1 ${nodes.length}\uAC1C, \uAD00\uACC4 ${edges.length}\uAC1C. ${listed}`;
  })() : nodeText(emptyLabel);
  const resolvedSummary = _nullishCoalesce(summary, () => ( automaticSummary));
  const [focusedKey, setFocusedKey] = _react2.default.useState(null);
  const isRootNode = _react2.default.useCallback(
    (node) => isDot && node.root === true,
    [isDot]
  );
  const hasCue = _react2.default.useCallback(
    (node) => (
      /*
        큐는 `dot`에만 그린다. 「접힌 이웃을 사방으로 펼친다」는 노드-링크의
        개념이고, 플로우 에디터에서 접히는 것은 이웃이 아니라 «한 노드 안의
        서브그래프»다(n8n 서브워크플로 · Node-RED subflow · Blender node group ·
        Unreal collapsed graph). 열리는 방향도 다르다 — 사방이 아니라 안으로
        들어가거나 그 자리에서 아래로 펼쳐진다. 같은 기호로 다른 개념을
        말하면 둘 다 잘못 읽히므로, 플로우 쪽 서브그래프는 요구가 확인된 뒤
        별도 개념으로 설계한다.
      */
      isDot && Boolean(onToggleNode) && (node.expanded === true || node.collapsedCount > 0)
    ),
    [isDot, onToggleNode]
  );
  const isExpanded = _react2.default.useCallback((node) => node.expanded === true, []);
  const focusOrder = _react2.default.useMemo(() => {
    const row = Math.max(1, metrics.rowPitch / 2);
    const settled = _nullishCoalesce(settledPositions, () => ( gridPositions));
    const ordered = [...nodes].sort((left, right) => {
      const a = settled.get(left.id);
      const b = settled.get(right.id);
      if (!a || !b) return 0;
      const rowDelta = Math.round(a.y / row) - Math.round(b.y / row);
      if (rowDelta !== 0) return rowDelta;
      if (a.x !== b.x) return a.x - b.x;
      return String(left.id).localeCompare(String(right.id));
    });
    const order = [];
    ordered.forEach((node) => {
      order.push({ key: `node:${node.id}`, node, kind: "node" });
      if (hasCue(node)) order.push({ key: `cue:${node.id}`, node, kind: "cue" });
    });
    return order;
  }, [gridPositions, hasCue, metrics.rowPitch, nodes, settledPositions]);
  const activeKey = focusOrder.some((stop) => stop.key === focusedKey) ? focusedKey : _optionalChain([focusOrder, 'access', _7 => _7[0], 'optionalAccess', _8 => _8.key]);
  const stopDomId = _react2.default.useCallback(
    (key) => `${rawId}-stop-${stableHash(key)}`,
    [rawId]
  );
  const moveFocus = _react2.default.useCallback(
    (fromKey, delta) => {
      const index = focusOrder.findIndex((stop) => stop.key === fromKey);
      if (index < 0) return;
      const next = focusOrder[(index + delta + focusOrder.length) % focusOrder.length];
      setFocusedKey(next.key);
      _optionalChain([document, 'access', _9 => _9.getElementById, 'call', _10 => _10(stopDomId(next.key)), 'optionalAccess', _11 => _11.focus, 'call', _12 => _12()]);
    },
    [focusOrder, stopDomId]
  );
  function stopKeyDown(event, stop) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (stop.kind === "cue") _optionalChain([onToggleNode, 'optionalCall', _13 => _13(stop.node)]);
      else _optionalChain([onSelectNode, 'optionalCall', _14 => _14(stop.node)]);
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(stop.key, 1);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(stop.key, -1);
    }
  }
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      "data-chart-type": "network",
      style: { minWidth: 0, height, fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { id: descriptionId, children: description }),
        resolvedSummary != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { id: summaryId, "data-chart-summary": true, children: resolvedSummary }),
        !hasData ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "data-chart-empty": true,
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--label2-size)",
              lineHeight: "var(--label2-line)"
            },
            children: emptyLabel
          }
        ) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "svg",
          {
            ref: svgRef,
            role: "group",
            "aria-label": label || "\uAD00\uACC4\uB3C4",
            "aria-describedby": [description != null && descriptionId, resolvedSummary != null && summaryId].filter(Boolean).join(" ") || void 0,
            viewBox: `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`,
            style: { display: "block", width: "100%", height: "100%", overflow: "visible" },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: "@keyframes ldsNetworkEnter { from { opacity: 0; transform: scale(0.72); } }" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "defs", { children: edgeColors.map((color) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "marker",
                {
                  id: markerId(color),
                  viewBox: "0 0 8 8",
                  markerWidth: "8",
                  markerHeight: "8",
                  refX: "7",
                  refY: "4",
                  orient: "auto",
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { d: "M0,0 L8,4 L0,8 Z", fill: color })
                },
                color
              )) }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { "data-network-edges": true, children: laidOutEdges.map(({ edge, curve, text, label: labelPoint }) => {
                if (!curve) return null;
                const path = {
                  // 제어점이 둘이면 고리(3차), 하나면 보통의 관계(2차).
                  d: curve.controlOut ? `M ${curve.start.x} ${curve.start.y} C ${curve.control.x} ${curve.control.y} ${curve.controlOut.x} ${curve.controlOut.y} ${curve.end.x} ${curve.end.y}` : `M ${curve.start.x} ${curve.start.y} Q ${curve.control.x} ${curve.control.y} ${curve.end.x} ${curve.end.y}`,
                  label: labelPoint
                };
                const color = edge.color || edgeColor;
                const tone = _nullishCoalesce(EDGE_STATE_STYLE[edge.state], () => ( EDGE_STATE_STYLE.normal));
                const selected = selectedEdgeId === edge.id;
                const labelText = text;
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { "data-network-edge": edge.id, "data-state": _nullishCoalesce(edge.state, () => ( "normal")), children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "path",
                    {
                      d: path.d,
                      fill: "none",
                      stroke: color,
                      strokeWidth: selected ? tone.width + 1.5 : tone.width,
                      strokeDasharray: tone.dash,
                      opacity: tone.opacity,
                      markerEnd: edge.directed === false ? void 0 : `url(#${markerId(color)})`
                    }
                  ),
                  onSelectEdge && /* 곡선은 누르기 어려우므로 투명한 넓은 선을 겹쳐 표적을
                     넓힌다. 이름은 아래 접근 가능한 요소가 갖는다. */
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "path",
                    {
                      d: path.d,
                      fill: "none",
                      stroke: "transparent",
                      strokeWidth: 16,
                      style: { cursor: "pointer" },
                      role: "button",
                      tabIndex: -1,
                      "aria-label": labelText || "\uAD00\uACC4",
                      onClick: () => onSelectEdge(edge)
                    }
                  ),
                  labelText && path.label && /* 자리는 위 `placeEdgeLabels`가 다른 라벨·노드를 모두 보고
                     정한다. 그래도 마지막 후보까지 막히면 겹친 채로 놓이므로,
                     배경색 테두리를 글자 «뒤»로 깔아(`paint-order`) 그 경우의
                     가독성을 지킨다. */
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "text",
                    {
                      x: path.label.x,
                      y: path.label.y - 6,
                      textAnchor: "middle",
                      style: {
                        fontSize: "var(--caption1-size)",
                        fill: "var(--color-semantic-label-alternative)",
                        paintOrder: "stroke",
                        stroke: "var(--color-semantic-background-elevated-normal)",
                        strokeWidth: 3,
                        strokeLinejoin: "round",
                        pointerEvents: "none"
                      },
                      children: labelText
                    }
                  )
                ] }, edge.id);
              }) }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { "data-network-nodes": true, children: nodes.map((node) => {
                const position = positions.get(node.id);
                if (!position) return null;
                const color = node.color || nodeColor;
                const tone = _nullishCoalesce(NODE_STATE_STYLE[node.state], () => ( NODE_STATE_STYLE.normal));
                const selected = selectedNodeId === node.id;
                const labelText = nodeText(node.label) || node.id;
                const captionText = nodeText(node.caption);
                const nodeStop = { key: `node:${node.id}`, node, kind: "node" };
                const radius = radiusOf(node);
                const labelRoom = isDot ? DOT_LABEL_MAX_WIDTH : metrics.width - 32;
                const shownLabel = fitText(labelText, labelRoom, LABEL_FONT_SIZE);
                const shownCaption = fitText(captionText, labelRoom, CAPTION_FONT_SIZE);
                const truncated = shownLabel !== labelText || shownCaption !== captionText;
                return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "g",
                  {
                    id: stopDomId(nodeStop.key),
                    "data-network-node": node.id,
                    "data-state": _nullishCoalesce(node.state, () => ( "normal")),
                    "data-selected": selected ? "true" : void 0,
                    role: "button",
                    tabIndex: nodeStop.key === activeKey ? 0 : -1,
                    "aria-label": [
                      labelText,
                      captionText,
                      /* 뿌리는 링으로도 보이지만 그것만으로는 눈으로 보는
                         사람에게만 전해진다. 「여기서 시작했다」는 탐색의
                         사실이므로 이름에도 넣는다. */
                      isRootNode(node) ? "\uD0D0\uC0C9 \uC2DC\uC791\uC810" : null,
                      // 큐가 없는 장르에서는 이 안내도 없다 — 갈 곳 없는 사실이다.
                      hasCue(node) && node.collapsedCount > 0 ? `\uC811\uD78C \uC5F0\uACB0 ${node.collapsedCount}\uAC1C` : null,
                      hasCue(node) && isExpanded(node) ? "\uC5F0\uACB0 \uD3BC\uCE68" : null
                    ].filter(Boolean).join(", "),
                    "aria-pressed": selected ? "true" : void 0,
                    transform: `translate(${position.x} ${position.y})`,
                    style: {
                      cursor: onSelectNode ? "pointer" : "default",
                      opacity: tone.opacity,
                      touchAction: isForce ? "none" : void 0
                    },
                    onFocus: () => setFocusedKey(nodeStop.key),
                    onClick: () => {
                      if (suppressClickRef.current) return;
                      _optionalChain([onSelectNode, 'optionalCall', _15 => _15(node)]);
                    },
                    onDoubleClick: () => {
                      if (hasCue(node)) _optionalChain([onToggleNode, 'optionalCall', _16 => _16(node)]);
                    },
                    onPointerDown: (event) => nodePointerDown(event, node),
                    onPointerMove: nodePointerMove,
                    onPointerUp: nodePointerUp,
                    onPointerCancel: nodePointerUp,
                    onKeyDown: (event) => stopKeyDown(event, nodeStop),
                    children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                      "g",
                      {
                        style: enteringIds.has(node.id) && !reduceMotion && motion !== "none" ? { animation: "ldsNetworkEnter 520ms cubic-bezier(0.22, 1, 0.36, 1)" } : void 0,
                        children: [
                          truncated && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "title", { children: [labelText, captionText].filter(Boolean).join(", ") }),
                          isDot ? (
                            /* 노드-링크 관행: 색이 찬 원 + 바깥 라벨. 라벨을 밖에 두면
                               원이 작아질 수 있고, 원이 작아야 노드가 많아져도 연결
                               구조가 보인다. 선택은 테두리 링으로 표시한다 — 채움색은
                               이미 범주가 쓰고 있다. */
                            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                              isRootNode(node) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "circle",
                                {
                                  "data-network-root-ring": "true",
                                  r: radius + 9,
                                  fill: "none",
                                  stroke: color,
                                  strokeWidth: 1.5,
                                  strokeDasharray: "4 4",
                                  opacity: 0.75
                                }
                              ),
                              selected && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "circle",
                                {
                                  r: radius + 5,
                                  fill: "none",
                                  stroke: color,
                                  strokeWidth: 2,
                                  opacity: 0.4
                                }
                              ),
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "circle",
                                {
                                  "data-network-node-body": "dot",
                                  r: radius,
                                  fill: color,
                                  stroke: "var(--color-semantic-background-elevated-normal)",
                                  strokeWidth: 2,
                                  strokeDasharray: tone.strokeDasharray
                                }
                              ),
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "text",
                                {
                                  y: radius + 16,
                                  textAnchor: "middle",
                                  style: {
                                    fontSize: "var(--label2-size)",
                                    fontWeight: "var(--fw-bold)",
                                    fill: "var(--color-semantic-label-strong)",
                                    paintOrder: "stroke",
                                    stroke: "var(--color-semantic-background-elevated-normal)",
                                    strokeWidth: 4,
                                    strokeLinejoin: "round",
                                    pointerEvents: "none"
                                  },
                                  children: shownLabel
                                }
                              ),
                              captionText && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "text",
                                {
                                  y: radius + 31,
                                  textAnchor: "middle",
                                  style: {
                                    fontSize: "var(--caption1-size)",
                                    fill: "var(--color-semantic-label-alternative)",
                                    paintOrder: "stroke",
                                    stroke: "var(--color-semantic-background-elevated-normal)",
                                    strokeWidth: 3,
                                    strokeLinejoin: "round",
                                    pointerEvents: "none"
                                  },
                                  children: shownCaption
                                }
                              )
                            ] })
                          ) : (
                            /* 플로우 에디터 관행: 이름을 담는 카드 + 좌우 포트. 포트가
                               있어야 연결이 어디로 들고 나는지 읽히고, 흐름이 한 방향
                               으로 정렬된다. */
                            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "rect",
                                {
                                  x: -metrics.width / 2,
                                  y: -metrics.height / 2,
                                  width: metrics.width,
                                  height: metrics.height,
                                  rx: "var(--radius-md)",
                                  fill: "var(--color-semantic-background-elevated-normal)",
                                  stroke: color,
                                  strokeWidth: selected ? 2.5 : 1.5,
                                  strokeDasharray: tone.strokeDasharray
                                }
                              ),
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "text",
                                {
                                  x: -metrics.width / 2 + 16,
                                  y: captionText ? -2 : 5,
                                  style: {
                                    fontSize: "var(--label2-size)",
                                    fontWeight: "var(--fw-bold)",
                                    fill: "var(--color-semantic-label-strong)",
                                    pointerEvents: "none"
                                  },
                                  children: shownLabel
                                }
                              ),
                              captionText && // 이름과 같은 왼쪽 기준선. 두 줄은 한 덩어리로 읽혀야 한다.
                              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "text",
                                {
                                  x: -metrics.width / 2 + 16,
                                  y: 13,
                                  style: {
                                    fontSize: "var(--caption1-size)",
                                    fill: "var(--color-semantic-label-alternative)",
                                    pointerEvents: "none"
                                  },
                                  children: shownCaption
                                }
                              ),
                              [-1, 1].map((side) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                "circle",
                                {
                                  "data-network-port": side < 0 ? "in" : "out",
                                  cx: side * metrics.width / 2,
                                  cy: 0,
                                  r: 4,
                                  fill: "var(--color-semantic-background-elevated-normal)",
                                  stroke: color,
                                  strokeWidth: 1.5
                                },
                                side
                              ))
                            ] })
                          ),
                          hasCue(node) && (() => {
                            const expanded = isExpanded(node);
                            const cue = isDot ? { x: -radius * 0.72, y: -radius * 0.72 } : { x: -metrics.width / 2 + 8, y: -metrics.height / 2 };
                            const cueText = expanded ? "\u2212" : `+${node.collapsedCount}`;
                            const cueWidth = Math.max(18, cueText.length * 7 + 8);
                            const cueStop = { key: `cue:${node.id}`, node, kind: "cue" };
                            return (
                              /*
                                노드로 이벤트가 흐르면 클릭이 «선택»이 되고 pointerdown이
                                드래그를 시작하므로 여기서 끊는다.
                              */
                              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                                "g",
                                {
                                  "data-network-collapse-cue": true,
                                  id: stopDomId(cueStop.key),
                                  role: "button",
                                  tabIndex: cueStop.key === activeKey ? 0 : -1,
                                  "aria-label": expanded ? `${labelText}\uC758 \uD3BC\uCE5C \uC5F0\uACB0 \uC811\uAE30` : `${labelText}\uC758 \uC811\uD78C \uC5F0\uACB0 ${node.collapsedCount}\uAC1C \uD3BC\uCE58\uAE30`,
                                  "aria-expanded": expanded ? "true" : "false",
                                  style: { cursor: onToggleNode ? "pointer" : void 0 },
                                  onFocus: () => setFocusedKey(cueStop.key),
                                  onKeyDown: (event) => {
                                    event.stopPropagation();
                                    stopKeyDown(event, cueStop);
                                  },
                                  onClick: (event) => {
                                    if (!onToggleNode) return;
                                    event.stopPropagation();
                                    onToggleNode(node);
                                  },
                                  onDoubleClick: (event) => event.stopPropagation(),
                                  onPointerDown: (event) => event.stopPropagation(),
                                  children: [
                                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                      "rect",
                                      {
                                        "data-network-cue-target": true,
                                        x: cue.x - Math.max(cueWidth, CUE_MIN_TARGET) / 2,
                                        y: cue.y - CUE_MIN_TARGET / 2,
                                        width: Math.max(cueWidth, CUE_MIN_TARGET),
                                        height: CUE_MIN_TARGET,
                                        fill: "transparent"
                                      }
                                    ),
                                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                      "rect",
                                      {
                                        x: cue.x - cueWidth / 2,
                                        y: cue.y - 9,
                                        width: cueWidth,
                                        height: 18,
                                        rx: 9,
                                        fill: "var(--color-semantic-background-normal-alternative)",
                                        stroke: color,
                                        strokeWidth: 1,
                                        pointerEvents: "none"
                                      }
                                    ),
                                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                                      "text",
                                      {
                                        x: cue.x,
                                        y: cue.y + 4,
                                        textAnchor: "middle",
                                        style: {
                                          fontSize: "var(--caption1-size)",
                                          fontWeight: "var(--fw-bold)",
                                          fill: "var(--color-semantic-label-neutral)",
                                          pointerEvents: "none"
                                        },
                                        children: cueText
                                      }
                                    )
                                  ]
                                }
                              )
                            );
                          })()
                        ]
                      }
                    )
                  },
                  node.id
                );
              }) })
            ]
          }
        )
      ]
    }
  );
}



exports.NetworkGraph = NetworkGraph;
//# sourceMappingURL=chunk-OADBCUWF.cjs.map