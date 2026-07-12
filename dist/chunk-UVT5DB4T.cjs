"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/navigation/Tabs.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var SIZE = {
  small: { height: 40, fontSize: "var(--body2-size)", countSize: 13 },
  sm: { height: 40, fontSize: "var(--body2-size)", countSize: 13 },
  medium: { height: 48, fontSize: "var(--headline2-size)", countSize: 15 },
  md: { height: 48, fontSize: "var(--headline2-size)", countSize: 15 },
  large: { height: 56, fontSize: "var(--headline2-size)", countSize: 15 },
  lg: { height: 56, fontSize: "var(--headline2-size)", countSize: 15 }
};
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  full = false,
  resize,
  size = "medium",
  padding = false,
  trailingIconButton = false,
  scroll = "auto",
  style,
  ...rest
}) {
  const listRef = _react2.default.useRef(null);
  const norm = items.map(
    (o) => typeof o === "string" ? { value: o, label: o } : o
  );
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(
    defaultValue != null ? defaultValue : _optionalChain([norm, 'access', _ => _.find, 'call', _2 => _2((item) => !item.disabled), 'optionalAccess', _3 => _3.value])
  );
  const selected = isControlled ? value : internal;
  const s = SIZE[size] || SIZE.medium;
  const fill = resize === "fill" || full;
  const pick = (item) => {
    if (item.disabled) return;
    if (!isControlled) setInternal(item.value);
    _optionalChain([onChange, 'optionalCall', _4 => _4(item.value, item)]);
  };
  const move = (event, item) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const enabledItems = norm.filter((candidate) => !candidate.disabled);
    const currentIndex = enabledItems.findIndex((candidate) => candidate.value === item.value);
    if (currentIndex < 0 || enabledItems.length === 0) return;
    event.preventDefault();
    let nextIndex = currentIndex;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % enabledItems.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = enabledItems.length - 1;
    const nextItem = enabledItems[nextIndex];
    pick(nextItem);
    _optionalChain([Array, 'access', _5 => _5.from, 'call', _6 => _6(_nullishCoalesce(_optionalChain([listRef, 'access', _7 => _7.current, 'optionalAccess', _8 => _8.querySelectorAll, 'call', _9 => _9('[role="tab"]')]), () => ( []))), 'access', _10 => _10.find, 'call', _11 => _11((tab) => tab.dataset.tabValue === String(nextItem.value)), 'optionalAccess', _12 => _12.focus, 'call', _13 => _13()]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      ref: listRef,
      role: "tablist",
      "aria-orientation": "horizontal",
      style: {
        display: "flex",
        alignItems: "stretch",
        gap: fill ? 0 : 24,
        maxWidth: "100%",
        overflowX: scroll === "auto" || scroll === true ? "auto" : "visible",
        paddingInline: padding ? 8 : 0,
        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
        scrollbarWidth: "none",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `
        .lk-tabs__tab:focus-visible {
          outline: none;
          box-shadow: inset 0 0 0 2px var(--color-semantic-focus-indicator);
          border-radius: var(--radius-sm);
          z-index: 1;
        }
      ` }),
        norm.map((item) => {
          const active = item.value === selected || item.active;
          const trailing = _nullishCoalesce(_nullishCoalesce(item.trailingIconButton, () => ( item.trailing)), () => ( trailingIconButton));
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "button",
            {
              className: "lk-tabs__tab",
              type: "button",
              role: "tab",
              "aria-selected": active,
              tabIndex: !item.disabled && active ? 0 : -1,
              "data-tab-value": item.value,
              disabled: item.disabled,
              onClick: () => pick(item),
              onKeyDown: (event) => move(event, item),
              style: {
                flex: fill ? 1 : "0 0 auto",
                minWidth: 0,
                position: "relative",
                height: s.height,
                padding: 0,
                border: "none",
                background: "transparent",
                cursor: item.disabled ? "not-allowed" : "pointer",
                opacity: item.disabled ? 0.45 : 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                fontFamily: "var(--font-sans)",
                fontSize: s.fontSize,
                fontWeight: "var(--fw-semibold)",
                letterSpacing: 0,
                color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
                whiteSpace: "nowrap",
                transition: "color var(--dur-fast) var(--ease-out)",
                outline: "none",
                ...item.style
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis" }, children: item.label }),
                item.count != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "span",
                  {
                    style: {
                      fontSize: s.countSize,
                      fontWeight: "var(--fw-semibold)",
                      color: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-neutral)"
                    },
                    children: item.count
                  }
                ),
                trailing && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "span",
                  {
                    "aria-hidden": "true",
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)"
                    },
                    children: trailing === true ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-right-small", size: 15, "aria-hidden": "true" }) : trailing
                  }
                ),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "span",
                  {
                    "aria-hidden": "true",
                    style: {
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: -1,
                      height: 2,
                      borderRadius: 0,
                      background: active ? "var(--color-semantic-label-normal)" : "transparent",
                      transition: "background var(--dur-fast) var(--ease-out)"
                    }
                  }
                )
              ]
            },
            item.value
          );
        })
      ]
    }
  );
}



exports.Tabs = Tabs;
//# sourceMappingURL=chunk-UVT5DB4T.cjs.map