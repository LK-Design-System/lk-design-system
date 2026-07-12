"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkGNN6TXRPcjs = require('./chunk-GNN6TXRP.cjs');


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');

// components/data/LineChart.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var PALETTE = [
  "var(--color-semantic-data-viz-series-1)",
  "var(--color-semantic-data-viz-series-2)",
  "var(--color-semantic-data-viz-series-3)",
  "var(--color-semantic-data-viz-series-4)",
  "var(--color-semantic-data-viz-series-5)"
];
function isFiniteNumber(value) {
  return Number.isFinite(Number(value));
}
function normalizeSeries(series) {
  return series.map((item, index) => ({
    ...item,
    id: _nullishCoalesce(_nullishCoalesce(item.id, () => ( item.name)), () => ( index)),
    points: (item.points || []).filter((point) => isFiniteNumber(point.x) && isFiniteNumber(point.y)).map((point) => ({ x: Number(point.x), y: Number(point.y) }))
  }));
}
function resolveDomain(values, explicitDomain, fallback, includeZero = false) {
  if (Array.isArray(explicitDomain) && explicitDomain.length === 2) {
    const [min2, max2] = explicitDomain;
    if (isFiniteNumber(min2) && isFiniteNumber(max2) && Number(min2) !== Number(max2)) {
      return [Number(min2), Number(max2)];
    }
  }
  if (!values.length) return fallback;
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (includeZero) {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  if (min === max) {
    const delta = Math.abs(min) || 1;
    return [min - delta * 0.5, max + delta * 0.5];
  }
  return [min, max];
}
function buildTicks(min, max, count) {
  const safeCount = Math.max(1, Math.floor(count));
  if (safeCount === 1) return [min];
  return Array.from({ length: safeCount }, (_, index) => min + (max - min) * index / (safeCount - 1));
}
function resolveTickValues(min, max, ticks, fallbackCount) {
  if (Array.isArray(ticks)) {
    const values = ticks.filter(isFiniteNumber).map(Number);
    return values.length ? values : buildTicks(min, max, fallbackCount);
  }
  return buildTicks(min, max, _nullishCoalesce(ticks, () => ( fallbackCount)));
}
function linePath(points, sx, sy) {
  return points.map((point, index) => `${index === 0 ? "M" : "L"}${sx(point.x).toFixed(2)} ${sy(point.y).toFixed(2)}`).join(" ");
}
function defaultFormatY(value) {
  return Math.abs(value) >= 100 ? Math.round(value) : Math.round(value * 100) / 100;
}
function defaultFormatX(value) {
  return `${value}`;
}
function nodeText(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).filter(Boolean).join(" ");
  if (_react2.default.isValidElement(node)) return nodeText(node.props.children);
  return "";
}
function joinIds(...ids) {
  return ids.filter(Boolean).join(" ") || void 0;
}
function formattedText(formatter, value) {
  return nodeText(formatter(value)) || `${value}`;
}
function LineChart({
  series = [],
  width = 520,
  height = 240,
  xLabel,
  yLabel,
  xTicks = 2,
  yTicks = 4,
  xDomain,
  yDomain,
  includeZero = true,
  showGrid = true,
  showLegend = true,
  showPoints = false,
  referenceLines = [],
  emptyLabel = "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
  formatX,
  formatY,
  description,
  summary,
  style,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...rest
}) {
  const normalized = normalizeSeries(series);
  const allPoints = normalized.flatMap((item) => item.points);
  const chartWidth = Math.max(160, Number(width) || 520);
  const chartHeight = Math.max(120, Number(height) || 240);
  const pad = { top: 14, right: 22, bottom: xLabel ? 38 : 30, left: 46 };
  const innerWidth = Math.max(1, chartWidth - pad.left - pad.right);
  const innerHeight = Math.max(1, chartHeight - pad.top - pad.bottom);
  const [xMin, xMax] = resolveDomain(allPoints.map((point) => point.x), xDomain, [0, 1]);
  const [yMin, yMax] = resolveDomain(allPoints.map((point) => point.y), yDomain, [0, 1], includeZero);
  const xTickValues = resolveTickValues(xMin, xMax, xTicks, 2);
  const yTickValues = buildTicks(yMin, yMax, Math.max(2, yTicks + 1));
  const sx = (x) => pad.left + (x - xMin) / (xMax - xMin) * innerWidth;
  const sy = (y) => pad.top + innerHeight - (y - yMin) / (yMax - yMin) * innerHeight;
  const fx = formatX || defaultFormatX;
  const fy = formatY || defaultFormatY;
  const hasData = allPoints.length > 0;
  const rawId = _react2.default.useId();
  const clipId = `line-chart-${rawId.replace(/:/g, "")}-clip`;
  const descriptionId = `${rawId}-description`;
  const summaryId = `${rawId}-summary`;
  const chartLabel = ariaLabel || (yLabel ? `${yLabel} \uB77C\uC778 \uCC28\uD2B8` : "\uB77C\uC778 \uCC28\uD2B8");
  const emptyText = nodeText(emptyLabel) || "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.";
  const automaticSummary = hasData ? normalized.map((item, index) => {
    const label = item.accessibleLabel || nodeText(item.name) || `\uC2DC\uB9AC\uC988 ${index + 1}`;
    if (!item.points.length) return `${label}: ${emptyText}.`;
    const first = item.points[0];
    const last = item.points[item.points.length - 1];
    const minimum = item.points.reduce((current, point) => point.y < current.y ? point : current, first);
    const maximum = item.points.reduce((current, point) => point.y > current.y ? point : current, first);
    return `${label}: ${item.points.length}\uAC1C \uC810. \uC2DC\uC791 ${formattedText(fx, first.x)}\uC5D0\uC11C ${formattedText(fy, first.y)}, \uCD5C\uC800 ${formattedText(fy, minimum.y)}, \uCD5C\uACE0 ${formattedText(fy, maximum.y)}, \uB9C8\uC9C0\uB9C9 ${formattedText(fx, last.x)}\uC5D0\uC11C ${formattedText(fy, last.y)}.`;
  }).join(" ") : emptyText;
  const resolvedSummary = _nullishCoalesce(summary, () => ( automaticSummary));
  const legendItems = normalized.map((item, index) => ({
    id: item.id,
    label: _nullishCoalesce(item.name, () => ( `\uC2DC\uB9AC\uC988 ${index + 1}`)),
    color: item.color || PALETTE[index % PALETTE.length],
    shape: "line",
    dashed: item.dashed,
    disabled: item.points.length === 0
  }));
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "grid",
        gap: "var(--space-3)",
        width: "100%",
        maxWidth: chartWidth,
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { id: descriptionId, children: description }),
        resolvedSummary != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { id: summaryId, "data-chart-summary": true, children: resolvedSummary }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "svg",
          {
            viewBox: `0 0 ${chartWidth} ${chartHeight}`,
            role: "img",
            "aria-label": chartLabel,
            "aria-describedby": joinIds(ariaDescribedBy, description != null && descriptionId, resolvedSummary != null && summaryId),
            "data-chart-type": "line",
            style: {
              display: "block",
              width: "100%",
              height: "auto",
              aspectRatio: `${chartWidth} / ${chartHeight}`,
              overflow: "visible"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "defs", { children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "clipPath", { id: clipId, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "rect", { x: pad.left, y: pad.top, width: innerWidth, height: innerHeight }) }) }),
              showGrid && yTickValues.map((tick) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "line",
                {
                  x1: pad.left,
                  y1: sy(tick),
                  x2: pad.left + innerWidth,
                  y2: sy(tick),
                  stroke: "var(--color-semantic-line-normal-alternative)",
                  strokeWidth: "1"
                },
                `grid-${tick}`
              )),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "line",
                {
                  x1: pad.left,
                  y1: pad.top,
                  x2: pad.left,
                  y2: pad.top + innerHeight,
                  stroke: "var(--color-semantic-line-normal-normal)",
                  strokeWidth: "1"
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "line",
                {
                  x1: pad.left,
                  y1: pad.top + innerHeight,
                  x2: pad.left + innerWidth,
                  y2: pad.top + innerHeight,
                  stroke: "var(--color-semantic-line-normal-normal)",
                  strokeWidth: "1"
                }
              ),
              yTickValues.map((tick) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "text",
                {
                  x: pad.left - 8,
                  y: sy(tick) + 3,
                  textAnchor: "end",
                  fontSize: "10",
                  fill: "var(--color-semantic-label-assistive)",
                  style: { fontVariantNumeric: "tabular-nums" },
                  children: fy(tick)
                },
                `y-${tick}`
              )),
              xTickValues.map((tick, index) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "text",
                {
                  x: sx(tick),
                  y: pad.top + innerHeight + 16,
                  textAnchor: index === 0 ? "start" : index === xTickValues.length - 1 ? "end" : "middle",
                  fontSize: "10",
                  fill: "var(--color-semantic-label-assistive)",
                  style: { fontVariantNumeric: "tabular-nums" },
                  children: fx(tick)
                },
                `x-${tick}`
              )),
              yLabel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "text",
                {
                  x: 14,
                  y: pad.top + innerHeight / 2,
                  transform: `rotate(-90 14 ${pad.top + innerHeight / 2})`,
                  textAnchor: "middle",
                  fontSize: "10",
                  fontWeight: "var(--fw-semibold)",
                  fill: "var(--color-semantic-label-alternative)",
                  children: yLabel
                }
              ),
              referenceLines.filter((line) => isFiniteNumber(line.y) && Number(line.y) >= yMin && Number(line.y) <= yMax).map((line, index) => {
                const y = sy(Number(line.y));
                const color = line.color || "var(--color-semantic-data-viz-series-5)";
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "line",
                    {
                      x1: pad.left,
                      y1: y,
                      x2: pad.left + innerWidth,
                      y2: y,
                      stroke: color,
                      strokeWidth: "1.5",
                      strokeDasharray: line.dashed === false ? void 0 : "4 4"
                    }
                  ),
                  line.label != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "text",
                    {
                      x: pad.left + innerWidth - 4,
                      y: y - 5,
                      textAnchor: "end",
                      fontSize: "10",
                      fontWeight: "var(--fw-semibold)",
                      fill: color,
                      children: line.label
                    }
                  )
                ] }, _nullishCoalesce(_nullishCoalesce(line.id, () => ( line.label)), () => ( index)));
              }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "g", { clipPath: `url(#${clipId})`, children: normalized.map((item, index) => {
                const color = item.color || PALETTE[index % PALETTE.length];
                const path = linePath(item.points, sx, sy);
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "g", { children: [
                  item.points.length > 1 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "path",
                    {
                      d: path,
                      fill: "none",
                      stroke: color,
                      strokeWidth: "2",
                      strokeLinejoin: "round",
                      strokeLinecap: "round",
                      strokeDasharray: item.dashed ? "5 4" : void 0
                    }
                  ),
                  (showPoints || item.points.length === 1) && item.points.map((point, pointIndex) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "circle",
                    {
                      cx: sx(point.x),
                      cy: sy(point.y),
                      r: "3",
                      fill: "var(--color-semantic-background-elevated-normal)",
                      stroke: color,
                      strokeWidth: "2"
                    },
                    `${item.id}-${pointIndex}`
                  ))
                ] }, item.id);
              }) }),
              !hasData && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "text",
                {
                  "data-chart-empty": true,
                  x: pad.left + innerWidth / 2,
                  y: pad.top + innerHeight / 2,
                  textAnchor: "middle",
                  dominantBaseline: "middle",
                  fontSize: "12",
                  fontWeight: "var(--fw-medium)",
                  fill: "var(--color-semantic-label-assistive)",
                  children: emptyLabel
                }
              )
            ]
          }
        ),
        showLegend && normalized.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkGNN6TXRPcjs.Legend,
          {
            items: legendItems,
            size: "sm",
            "aria-label": "\uB77C\uC778 \uCC28\uD2B8 \uBC94\uB840",
            style: { paddingLeft: pad.left, maxWidth: "100%" }
          }
        ),
        xLabel && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            style: {
              textAlign: "center",
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)",
              color: "var(--color-semantic-label-alternative)"
            },
            children: xLabel
          }
        )
      ]
    }
  );
}



exports.LineChart = LineChart;
//# sourceMappingURL=chunk-3MRCEATS.cjs.map