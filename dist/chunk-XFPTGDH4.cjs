"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');

// components/data/NetworkGraph.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SHAPE = {
  /* 열 간격은 카드 폭 + 관계 라벨이 들어갈 통로다. 220이면 통로가 52px뿐이라
     라벨이 놓일 자리가 아예 없어 노드 위로 밀려났다. 플로우 에디터가 열을
     넉넉히 띄우는 이유가 이것이다. */
  card: { width: 168, height: 52, columnGap: 300, rowGap: 92 },
  dot: { width: 96, height: 96, columnGap: 150, rowGap: 92 }
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
    const columnHeight = (inColumn.length - 1) * metrics.rowGap;
    const top = ((tallest - 1) * metrics.rowGap - columnHeight) / 2;
    inColumn.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x: columnIndex * metrics.columnGap,
        y: top + rowIndex * metrics.rowGap
      });
    });
  });
  return positions;
}
function edgePath(from, to, metrics) {
  if (!from || !to) return null;
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
    const bow2 = Math.min(28, distance / 6);
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
function pointOnCurve({ start, control, end }, t) {
  const inverse = 1 - t;
  return {
    x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
    y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y
  };
}
function boxesHit(a, b) {
  return !(a.x + a.width / 2 <= b.x - b.width / 2 || b.x + b.width / 2 <= a.x - a.width / 2 || a.y + a.height / 2 <= b.y - b.height / 2 || b.y + b.height / 2 <= a.y - a.height / 2);
}
var LABEL_CANDIDATE_T = [0.5, 0.38, 0.62, 0.28, 0.72];
var LABEL_CANDIDATE_OFFSET = [0, 18, -18, 34, -34, 52, -52];
function curveTangent({ start, control, end }, t) {
  const x = 2 * (1 - t) * (control.x - start.x) + 2 * t * (end.x - control.x);
  const y = 2 * (1 - t) * (control.y - start.y) + 2 * t * (end.y - control.y);
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}
function placeEdgeLabels(entries, obstacles) {
  const placed = [...obstacles];
  return entries.map((entry) => {
    if (!entry.curve || !entry.text) return { ...entry, label: null };
    const width = entry.text.length * 6.2 + 6;
    const height = 16;
    for (const t of LABEL_CANDIDATE_T) {
      const base = pointOnCurve(entry.curve, t);
      const tangent = curveTangent(entry.curve, t);
      for (const offset of LABEL_CANDIDATE_OFFSET) {
        const point = {
          x: base.x - tangent.y * offset,
          y: base.y + tangent.x * offset
        };
        const box = { x: point.x, y: point.y - 6, width, height };
        if (!placed.some((other) => boxesHit(box, other))) {
          placed.push(box);
          return { ...entry, label: point };
        }
      }
    }
    const fallback = pointOnCurve(entry.curve, LABEL_CANDIDATE_T[0]);
    return { ...entry, label: fallback };
  });
}
function NetworkGraph({
  nodes = [],
  edges = [],
  layout = "layered",
  nodeShape = "card",
  showEdgeLabels = true,
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
  const positions = _react2.default.useMemo(
    () => layoutNodes(nodes, layout, metrics),
    [layout, metrics, nodes]
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
    const values = [...positions.values()];
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
  }, [metrics, positions]);
  const laidOutEdges = _react2.default.useMemo(() => {
    const entries = edges.map((edge) => ({
      edge,
      curve: edgePath(anchors.get(edge.from), anchors.get(edge.to), {
        ...metrics,
        shape: nodeShape
      }),
      text: showEdgeLabels ? `${nodeText(edge.label)}${edge.count > 1 ? ` ${edge.count}` : ""}`.trim() : ""
    }));
    const obstacles = nodes.flatMap((node) => {
      const point = anchors.get(node.id);
      if (!point) return [];
      if (!isDot) {
        return [{ x: point.x, y: point.y, width: metrics.width, height: metrics.height }];
      }
      const nameWidth = (nodeText(node.label) || node.id).length * 6.8 + 8;
      const captionWidth = nodeText(node.caption).length * 6.2 + 8;
      return [
        { x: point.x, y: point.y, width: point.radius * 2, height: point.radius * 2 },
        { x: point.x, y: point.y + point.radius + 11, width: nameWidth, height: 16 },
        ...captionWidth > 8 ? [{ x: point.x, y: point.y + point.radius + 26, width: captionWidth, height: 14 }] : []
      ];
    });
    return placeEdgeLabels(entries, obstacles);
  }, [anchors, edges, isDot, metrics, nodeShape, nodes, showEdgeLabels]);
  const hasData = nodes.length > 0;
  const automaticSummary = hasData ? `\uB300\uC0C1 ${nodes.length}\uAC1C, \uAD00\uACC4 ${edges.length}\uAC1C. ${nodes.map((node) => nodeText(node.label) || node.id).join(", ")}` : nodeText(emptyLabel);
  const resolvedSummary = _nullishCoalesce(summary, () => ( automaticSummary));
  const [focusedId, setFocusedId] = _react2.default.useState(null);
  const activeId = focusedId && nodeById.has(focusedId) ? focusedId : _optionalChain([nodes, 'access', _ => _[0], 'optionalAccess', _2 => _2.id]);
  const moveFocus = _react2.default.useCallback(
    (fromId, delta) => {
      const order = nodes.map((node) => node.id);
      const index = order.indexOf(fromId);
      if (index < 0) return;
      const next = order[(index + delta + order.length) % order.length];
      setFocusedId(next);
      const element = document.getElementById(`${rawId}-node-${stableHash(String(next))}`);
      _optionalChain([element, 'optionalAccess', _3 => _3.focus, 'call', _4 => _4()]);
    },
    [nodes, rawId]
  );
  function nodeKeyDown(event, node) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      _optionalChain([onSelectNode, 'optionalCall', _5 => _5(node)]);
      return;
    }
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(node.id, 1);
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(node.id, -1);
      return;
    }
    if (onToggleNode && (event.key === "+" || event.key === "-")) {
      event.preventDefault();
      onToggleNode(node);
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
            role: "group",
            "aria-label": label || "\uAD00\uACC4\uB3C4",
            "aria-describedby": [description != null && descriptionId, resolvedSummary != null && summaryId].filter(Boolean).join(" ") || void 0,
            viewBox: `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`,
            style: { display: "block", width: "100%", height: "100%", overflow: "visible" },
            children: [
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
                  d: `M ${curve.start.x} ${curve.start.y} Q ${curve.control.x} ${curve.control.y} ${curve.end.x} ${curve.end.y}`,
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
                const domId = `${rawId}-node-${stableHash(String(node.id))}`;
                const radius = radiusOf(node);
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                  "g",
                  {
                    id: domId,
                    "data-network-node": node.id,
                    "data-state": _nullishCoalesce(node.state, () => ( "normal")),
                    "data-selected": selected ? "true" : void 0,
                    role: "button",
                    tabIndex: node.id === activeId ? 0 : -1,
                    "aria-label": [
                      labelText,
                      captionText,
                      node.collapsedCount > 0 ? `\uC811\uD78C \uC5F0\uACB0 ${node.collapsedCount}\uAC1C` : null
                    ].filter(Boolean).join(", "),
                    "aria-pressed": selected ? "true" : void 0,
                    "aria-expanded": onToggleNode && node.collapsedCount != null ? node.collapsedCount === 0 ? "true" : "false" : void 0,
                    transform: `translate(${position.x} ${position.y})`,
                    style: { cursor: onSelectNode ? "pointer" : "default", opacity: tone.opacity },
                    onFocus: () => setFocusedId(node.id),
                    onClick: () => _optionalChain([onSelectNode, 'optionalCall', _6 => _6(node)]),
                    onDoubleClick: () => _optionalChain([onToggleNode, 'optionalCall', _7 => _7(node)]),
                    onKeyDown: (event) => nodeKeyDown(event, node),
                    children: [
                      isDot ? (
                        /* 노드-링크 관행: 색이 찬 원 + 바깥 라벨. 라벨을 밖에 두면
                           원이 작아질 수 있고, 원이 작아야 노드가 많아져도 연결
                           구조가 보인다. 선택은 테두리 링으로 표시한다 — 채움색은
                           이미 범주가 쓰고 있다. */
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
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
                                pointerEvents: "none"
                              },
                              children: labelText
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
                                pointerEvents: "none"
                              },
                              children: captionText
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
                              children: labelText
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
                              children: captionText
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
                      node.collapsedCount > 0 && (() => {
                        const cue = isDot ? { x: -radius * 0.72, y: -radius * 0.72 } : { x: -metrics.width / 2 + 8, y: -metrics.height / 2 };
                        const cueText = `+${node.collapsedCount}`;
                        const cueWidth = cueText.length * 7 + 8;
                        return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { "data-network-collapse-cue": true, "aria-hidden": "true", children: [
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
                              strokeWidth: 1
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
                        ] });
                      })()
                    ]
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
//# sourceMappingURL=chunk-XFPTGDH4.cjs.map