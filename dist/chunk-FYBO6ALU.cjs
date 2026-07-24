"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/content/ReactionBar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function formatCountKo(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return n;
  const abs = Math.abs(n);
  if (abs < 1e3) return String(n);
  const [divisor, unit] = abs < 1e4 ? [1e3, "\uCC9C"] : abs < 1e8 ? [1e4, "\uB9CC"] : [1e8, "\uC5B5"];
  return `${Math.floor(n / divisor * 10) / 10}${unit}`;
}
function Count({ children }) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "span",
    {
      "aria-hidden": "true",
      style: {
        fontSize: "var(--caption1-size)",
        fontWeight: "var(--fw-medium)",
        color: "var(--color-semantic-label-alternative)",
        fontVariantNumeric: "tabular-nums"
      },
      children
    }
  );
}
function ReactionControl({ label, pressed, active, onClick, boxSize, children }) {
  const [hover, setHover] = _react2.default.useState(false);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      type: "button",
      "aria-label": label,
      "aria-pressed": pressed,
      onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      onBlur: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: boxSize,
        height: boxSize,
        padding: 0,
        border: "none",
        background: hover ? "var(--color-semantic-fill-normal)" : "transparent",
        borderRadius: "var(--radius-full)",
        color: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-alternative)",
        cursor: "pointer",
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
      },
      children
    }
  );
}
function ReactionBar({
  like,
  comment,
  share,
  size = "md",
  align = "start",
  formatCount = formatCountKo,
  children,
  style,
  ...rest
}) {
  const iconSize = size === "sm" ? 18 : 20;
  const boxSize = size === "sm" ? 28 : 32;
  const likeControlled = !!like && like.active !== void 0;
  const [likeInternal, setLikeInternal] = _react2.default.useState(_nullishCoalesce(_optionalChain([like, 'optionalAccess', _ => _.defaultActive]), () => ( false)));
  const likeActive = like ? likeControlled ? like.active : likeInternal : false;
  const handleLike = () => {
    const next = !likeActive;
    if (like && !likeControlled) setLikeInternal(next);
    _optionalChain([like, 'optionalAccess', _2 => _2.onToggle, 'optionalCall', _3 => _3(next)]);
  };
  const withCount = (base, count) => count == null ? base : `${base} ${count}\uAC1C`;
  const item = { display: "inline-flex", alignItems: "center", gap: "var(--space-1)" };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      role: "group",
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        justifyContent: align === "between" ? "space-between" : "flex-start",
        ...style
      },
      ...rest,
      children: [
        like && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: item, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            ReactionControl,
            {
              label: withCount(_nullishCoalesce(like.label, () => ( "\uC88B\uC544\uC694")), like.count),
              pressed: likeActive,
              active: likeActive,
              onClick: handleLike,
              boxSize,
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: likeActive ? "heart-fill" : "heart", size: iconSize, "aria-hidden": "true" })
            }
          ),
          like.count != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Count, { children: formatCount(like.count) })
        ] }),
        comment && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: item, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ReactionControl, { label: withCount(_nullishCoalesce(comment.label, () => ( "\uB313\uAE00")), comment.count), onClick: comment.onClick, boxSize, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "message", size: iconSize, "aria-hidden": "true" }) }),
          comment.count != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Count, { children: formatCount(comment.count) })
        ] }),
        share && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: item, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, ReactionControl, { label: withCount(_nullishCoalesce(share.label, () => ( "\uACF5\uC720")), share.count), onClick: share.onClick, boxSize, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "share", size: iconSize, "aria-hidden": "true" }) }),
          share.count != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Count, { children: formatCount(share.count) })
        ] }),
        children
      ]
    }
  );
}



exports.ReactionBar = ReactionBar;
//# sourceMappingURL=chunk-FYBO6ALU.cjs.map