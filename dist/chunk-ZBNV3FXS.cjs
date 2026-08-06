"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');

// components/data/NetworkGraph.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var NODE_WIDTH = 168;
var NODE_HEIGHT = 52;
var COLUMN_GAP = 220;
var ROW_GAP = 84;
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
function layoutNodes(nodes, layout) {
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
    const columnHeight = (inColumn.length - 1) * ROW_GAP;
    const top = ((tallest - 1) * ROW_GAP - columnHeight) / 2;
    inColumn.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x: columnIndex * COLUMN_GAP,
        y: top + rowIndex * ROW_GAP
      });
    });
  });
  return positions;
}
function edgePath(from, to) {
  if (!from || !to) return null;
  const startX = from.x + NODE_WIDTH / 2;
  const startY = from.y;
  const endX = to.x - NODE_WIDTH / 2;
  const endY = to.y;
  const sameColumn = Math.abs(startX - endX) < 1;
  const controlX = sameColumn ? startX + Math.max(48, Math.abs(endY - startY) / 2) : (startX + endX) / 2;
  const controlY = sameColumn ? (startY + endY) / 2 : (startY + endY) / 2;
  return {
    d: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
    label: {
      x: 0.25 * startX + 0.5 * controlX + 0.25 * endX,
      y: 0.25 * startY + 0.5 * controlY + 0.25 * endY
    }
  };
}
function NetworkGraph({
  nodes = [],
  edges = [],
  layout = "layered",
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
  const positions = _react2.default.useMemo(() => layoutNodes(nodes, layout), [layout, nodes]);
  const nodeById = _react2.default.useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes]
  );
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
    if (!values.length) return { minX: 0, minY: 0, width: NODE_WIDTH, height: NODE_HEIGHT };
    const xs = values.map((point) => point.x);
    const ys = values.map((point) => point.y);
    const padding = NODE_WIDTH;
    return {
      minX: Math.min(...xs) - padding,
      minY: Math.min(...ys) - NODE_HEIGHT,
      width: Math.max(...xs) - Math.min(...xs) + padding * 2,
      height: Math.max(...ys) - Math.min(...ys) + NODE_HEIGHT * 2
    };
  }, [positions]);
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
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { "data-network-edges": true, children: edges.map((edge) => {
                const path = edgePath(positions.get(edge.from), positions.get(edge.to));
                if (!path) return null;
                const color = edge.color || edgeColor;
                const tone = _nullishCoalesce(EDGE_STATE_STYLE[edge.state], () => ( EDGE_STATE_STYLE.normal));
                const selected = selectedEdgeId === edge.id;
                const labelText = nodeText(edge.label);
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
                  labelText && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                    "text",
                    {
                      x: path.label.x,
                      y: path.label.y - 6,
                      textAnchor: "middle",
                      style: {
                        fontSize: "var(--caption1-size)",
                        fill: "var(--color-semantic-label-alternative)",
                        pointerEvents: "none"
                      },
                      children: [
                        labelText,
                        edge.count > 1 ? ` ${edge.count}` : ""
                      ]
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
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                  "g",
                  {
                    id: domId,
                    "data-network-node": node.id,
                    "data-state": _nullishCoalesce(node.state, () => ( "normal")),
                    "data-selected": selected ? "true" : void 0,
                    role: "button",
                    tabIndex: node.id === activeId ? 0 : -1,
                    "aria-label": [labelText, captionText].filter(Boolean).join(", "),
                    "aria-pressed": selected ? "true" : void 0,
                    "aria-expanded": onToggleNode && node.collapsedCount != null ? node.collapsedCount === 0 ? "true" : "false" : void 0,
                    transform: `translate(${position.x} ${position.y})`,
                    style: { cursor: onSelectNode ? "pointer" : "default", opacity: tone.opacity },
                    onFocus: () => setFocusedId(node.id),
                    onClick: () => _optionalChain([onSelectNode, 'optionalCall', _6 => _6(node)]),
                    onDoubleClick: () => _optionalChain([onToggleNode, 'optionalCall', _7 => _7(node)]),
                    onKeyDown: (event) => nodeKeyDown(event, node),
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        "rect",
                        {
                          x: -NODE_WIDTH / 2,
                          y: -NODE_HEIGHT / 2,
                          width: NODE_WIDTH,
                          height: NODE_HEIGHT,
                          rx: "var(--radius-md)",
                          fill: "var(--color-semantic-background-elevated-normal)",
                          stroke: color,
                          strokeWidth: selected ? 2.5 : 1.5,
                          strokeDasharray: tone.strokeDasharray
                        }
                      ),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "circle", { cx: -NODE_WIDTH / 2 + 18, cy: 0, r: 5, fill: color }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        "text",
                        {
                          x: -NODE_WIDTH / 2 + 32,
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
                      captionText && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        "text",
                        {
                          x: -NODE_WIDTH / 2 + 32,
                          y: 13,
                          style: {
                            fontSize: "var(--caption1-size)",
                            fill: "var(--color-semantic-label-alternative)",
                            pointerEvents: "none"
                          },
                          children: captionText
                        }
                      ),
                      node.collapsedCount > 0 && /* 접힌 이웃의 개수. 눌러서 펼치는 동작은 노드 자신이
                         갖고(`aria-expanded`), 이 배지는 그 상태의 표시다. */
                      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
                        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          "circle",
                          {
                            cx: NODE_WIDTH / 2 - 14,
                            cy: 0,
                            r: 10,
                            fill: "var(--color-semantic-background-normal-alternative)",
                            stroke: color,
                            strokeWidth: 1
                          }
                        ),
                        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                          "text",
                          {
                            x: NODE_WIDTH / 2 - 14,
                            y: 4,
                            textAnchor: "middle",
                            style: {
                              fontSize: "var(--caption1-size)",
                              fill: "var(--color-semantic-label-neutral)",
                              pointerEvents: "none"
                            },
                            children: node.collapsedCount
                          }
                        )
                      ] })
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
//# sourceMappingURL=chunk-ZBNV3FXS.cjs.map