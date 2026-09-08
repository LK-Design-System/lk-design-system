"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/viz/DotMatrixPreview.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var DOT_SIZE = 6;
var DOT_GAP = 1;
function normalizeHex(color) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(_nullishCoalesce(color, () => ( ""))).trim());
  return match ? match[1].toLowerCase() : "ffffff";
}
function channel(hex, offset, ratio) {
  return Math.round(parseInt(hex.slice(offset, offset + 2), 16) * ratio);
}
function isLit(bitmap, pixels, index) {
  if (pixels) return Boolean(pixels[index]);
  if (!bitmap) return false;
  const byte = bitmap[index >> 3];
  return byte != null && (byte & 1 << 7 - (index & 7)) !== 0;
}
function countLitPixels({ columns, rows, bitmap, pixels }) {
  let count = 0;
  for (let index = 0; index < columns * rows; index += 1) if (isLit(bitmap, pixels, index)) count += 1;
  return count;
}
var DotMatrixPreview = _react2.default.forwardRef(function DotMatrixPreview2({
  columns = 128,
  rows = 32,
  bitmap,
  pixels,
  color = "#ffffff",
  brightness = 255,
  label,
  description,
  status,
  dotShape = "square",
  emptyLabel = "\uAEBC\uC9C4 \uD654\uBA74",
  style,
  ...rest
}, ref) {
  const canvasRef = _react2.default.useRef(null);
  const hex = normalizeHex(color);
  const ratio = Math.min(1, Math.max(0, Number(brightness) / 255));
  const litCount = _react2.default.useMemo(() => countLitPixels({ columns, rows, bitmap, pixels }), [columns, rows, bitmap, pixels]);
  const isEmpty = litCount === 0;
  _react2.default.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = columns * DOT_SIZE;
    const height = rows * DOT_SIZE;
    ctx.fillStyle = "#08090c";
    ctx.fillRect(0, 0, width, height);
    const on = `rgb(${channel(hex, 0, ratio)}, ${channel(hex, 2, ratio)}, ${channel(hex, 4, ratio)})`;
    const off = "rgba(255, 255, 255, 0.06)";
    const size = DOT_SIZE - DOT_GAP;
    const radius = size / 2;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const lit = isLit(bitmap, pixels, y * columns + x);
        ctx.fillStyle = lit ? on : off;
        const px = x * DOT_SIZE;
        const py = y * DOT_SIZE;
        if (dotShape === "round") {
          ctx.beginPath();
          ctx.arc(px + radius, py + radius, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(px, py, size, size);
        }
      }
    }
  }, [columns, rows, bitmap, pixels, hex, ratio, dotShape]);
  const summary = isEmpty ? emptyLabel : _nullishCoalesce(description, () => ( `${litCount}\uAC1C \uD53D\uC140 \uCF1C\uC9D0`));
  const percent = Math.round(ratio * 100);
  const accessibleName = `${label}${description && !isEmpty ? `: ${description}` : isEmpty ? `: ${emptyLabel}` : ""}, \uBC1D\uAE30 ${percent}%`;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "figure",
    {
      ref,
      "data-dot-matrix-preview": "",
      "data-empty": isEmpty || void 0,
      style: {
        display: "grid",
        gap: "var(--space-2)",
        margin: 0,
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        color: "var(--color-semantic-label-normal)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "figcaption", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2) var(--space-3)", flexWrap: "wrap", minWidth: 0 }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-semibold)", color: "var(--color-semantic-label-strong)", minWidth: 0, overflowWrap: "anywhere" }, children: label }),
          status != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0 }, children: status })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            "data-slot": "panel",
            style: {
              padding: "var(--space-2)",
              background: "#08090c",
              border: "1px solid var(--color-semantic-line-solid-_strong, var(--color-semantic-line-solid-normal))",
              borderRadius: "var(--radius-md)",
              minWidth: 0
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "canvas",
              {
                ref: canvasRef,
                width: columns * DOT_SIZE,
                height: rows * DOT_SIZE,
                role: "img",
                "aria-label": accessibleName,
                "data-lit-pixels": litCount,
                style: { display: "block", width: "100%", height: "auto", aspectRatio: `${columns} / ${rows}`, imageRendering: "pixelated" },
                children: accessibleName
              }
            )
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            "data-slot": "summary",
            style: {
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "var(--space-2) var(--space-3)",
              flexWrap: "wrap",
              minWidth: 0,
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)",
              color: "var(--color-semantic-label-alternative)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflowWrap: "anywhere" }, children: summary }),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { flexShrink: 0, fontVariantNumeric: "tabular-nums" }, children: [
                columns,
                "\xD7",
                rows,
                " \xB7 \uBC1D\uAE30 ",
                percent,
                "%"
              ] })
            ]
          }
        )
      ]
    }
  );
});



exports.DotMatrixPreview = DotMatrixPreview;
//# sourceMappingURL=chunk-LHKHS2P3.cjs.map