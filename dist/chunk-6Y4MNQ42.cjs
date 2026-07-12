"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/data/Sparkline.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Sparkline({ data = [], width = 120, height = 32, color = "var(--color-semantic-primary-normal)", fill = true, strokeWidth = 2, style, ...rest }) {
  const {
    description,
    summary,
    emptyLabel = "\uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.",
    formatValue = (value) => `${value}`,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    role = "img",
    ...svgProps
  } = rest;
  const values = data.map(Number).filter(Number.isFinite);
  const hasData = values.length > 0;
  const min = hasData ? Math.min(...values) : 0;
  const max = hasData ? Math.max(...values) : 0;
  const range = max - min || 1;
  const pts = values.map((value, index) => [index / (values.length - 1 || 1) * width, height - (value - min) / range * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  const automaticSummary = hasData ? `${values.length}\uAC1C \uAC12. \uC2DC\uC791 ${formatValue(values[0])}, \uCD5C\uC800 ${formatValue(min)}, \uCD5C\uACE0 ${formatValue(max)}, \uB9C8\uC9C0\uB9C9 ${formatValue(values[values.length - 1])}.` : emptyLabel;
  const resolvedSummary = _nullishCoalesce(summary, () => ( automaticSummary));
  const rawId = _react2.default.useId();
  const titleId = `${rawId}-title`;
  const descriptionId = `${rawId}-description`;
  const describedBy = [ariaDescribedBy, descriptionId].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "svg",
    {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
      role,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabel ? void 0 : titleId,
      "aria-describedby": describedBy,
      "data-chart-type": "sparkline",
      style: { display: "block", maxWidth: "100%", height: "auto", aspectRatio: `${width} / ${height}`, ...style },
      ...svgProps,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "title", { id: titleId, children: ariaLabel || "\uCD94\uC138 \uCC28\uD2B8" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "desc", { id: descriptionId, "data-chart-summary": true, children: [description, resolvedSummary].filter(Boolean).join(" ") }),
        !hasData && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "text",
          {
            "data-chart-empty": true,
            x: width / 2,
            y: height / 2,
            textAnchor: "middle",
            dominantBaseline: "middle",
            fill: "var(--color-semantic-label-alternative)",
            fontSize: Math.min(12, Math.max(9, height * 0.28)),
            fontWeight: "var(--fw-medium)",
            children: emptyLabel
          }
        ),
        hasData && fill && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { "aria-hidden": "true", d: area, fill: color, opacity: "0.12" }),
        hasData && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "path", { "aria-hidden": "true", d: line, fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" })
      ]
    }
  );
}



exports.Sparkline = Sparkline;
//# sourceMappingURL=chunk-6Y4MNQ42.cjs.map