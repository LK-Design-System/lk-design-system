"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/navigation/TopBar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var TopBarToneContext = _react2.default.createContext("light");
function TopBar({ brand, children, actions, navAlign = "start", sticky = false, bordered = true, dark = false, height = 64, style, ...rest }) {
  const tone = dark ? "dark" : "light";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "header",
    {
      style: {
        position: sticky ? "sticky" : "static",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "clamp(8px, 2vw, 20px)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflow: "hidden",
        height,
        paddingInline: "clamp(16px, 4vw, 32px)",
        boxSizing: "border-box",
        background: dark ? "linear-gradient(135deg, var(--color-semantic-brand-canvas-from), var(--color-semantic-brand-canvas-to))" : sticky ? "color-mix(in srgb, var(--color-semantic-background-elevated-normal) 88%, transparent)" : "var(--color-semantic-background-elevated-normal)",
        color: dark ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-normal)",
        borderBottom: bordered ? `1px solid ${dark ? "var(--color-semantic-inverse-fill-normal)" : "var(--color-semantic-line-normal-normal)"}` : "none",
        backdropFilter: sticky ? "saturate(150%) blur(8px)" : "none",
        WebkitBackdropFilter: sticky ? "saturate(150%) blur(8px)" : "none",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        brand != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", flexShrink: 0 }, children: brand }),
        children != null ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, TopBarToneContext.Provider, { value: tone, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "nav", { style: { display: "flex", alignItems: "center", alignSelf: "stretch", gap: 4, flex: "1 1 auto", minWidth: 0, overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", justifyContent: navAlign === "center" ? "safe center" : "flex-start" }, children }) }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { flex: 1 } }),
        actions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }, children: actions })
      ]
    }
  );
}
function TopBarNavItem({ children, active = false, href, menuItems, menuTheme = "light", style, onClick, ...rest }) {
  const tone = _react2.default.useContext(TopBarToneContext);
  const onDark = tone === "dark";
  const [hover, setHover] = _react2.default.useState(false);
  const [focusWithin, setFocusWithin] = _react2.default.useState(false);
  const [clickOpen, setClickOpen] = _react2.default.useState(false);
  const hasMenu = !!_optionalChain([menuItems, 'optionalAccess', _ => _.length]);
  const open = hasMenu && (hover || focusWithin || clickOpen);
  const activeOrHover = active || hover || focusWithin || clickOpen;
  const Comp = href ? "a" : "button";
  const fg = active ? onDark ? "var(--color-semantic-static-white)" : "var(--color-semantic-primary-normal)" : activeOrHover ? onDark ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-strong)" : onDark ? "var(--color-semantic-inverse-label-neutral-soft)" : "var(--color-semantic-label-alternative)";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "span",
    {
      style: { position: "relative", display: "inline-flex", alignSelf: "stretch", ...style },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      onFocus: () => setFocusWithin(true),
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
          setClickOpen(false);
        }
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          Comp,
          {
            href,
            type: href ? void 0 : "button",
            "aria-current": active ? "page" : void 0,
            "aria-haspopup": hasMenu ? "menu" : void 0,
            "aria-expanded": hasMenu ? open : void 0,
            onClick: (event) => {
              if (hasMenu) {
                event.preventDefault();
                setClickOpen((value) => !value);
              }
              onClick && onClick(event);
            },
            onFocus: () => setFocusWithin(true),
            onBlur: (event) => {
              if (!_optionalChain([event, 'access', _2 => _2.currentTarget, 'access', _3 => _3.parentElement, 'optionalAccess', _4 => _4.contains, 'call', _5 => _5(event.relatedTarget)])) {
                setFocusWithin(false);
                setClickOpen(false);
              }
            },
            style: {
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "stretch",
              padding: "0 14px",
              border: "none",
              background: "transparent",
              color: fg,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--body2-size)",
              fontWeight: 700,
              letterSpacing: 0,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "color var(--dur-fast) var(--ease-out)"
            },
            children: [
              children,
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 0,
                    height: 2.5,
                    borderRadius: "2px 2px 0 0",
                    background: onDark ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-normal)",
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform var(--dur-fast) var(--ease-out)"
                  }
                }
              )
            ]
          }
        ),
        _optionalChain([menuItems, 'optionalAccess', _6 => _6.length]) ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            role: "menu",
            "data-theme": menuTheme,
            className: `theme-${menuTheme}`,
            style: {
              position: "absolute",
              top: "100%",
              left: "50%",
              zIndex: 60,
              minWidth: 176,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 8,
              background: "var(--color-semantic-background-elevated-normal)",
              border: "1px solid var(--color-semantic-line-normal-normal)",
              borderRadius: "var(--radius-14)",
              boxShadow: "var(--shadow-md)",
              opacity: open ? 1 : 0,
              visibility: open ? "visible" : "hidden",
              transform: open ? "translate(-50%, 0)" : "translate(-50%, 4px)",
              transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), visibility 0s linear"
            },
            children: menuItems.map((item) => {
              const ItemComp = item.href ? "a" : "button";
              return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                ItemComp,
                {
                  href: item.href,
                  type: item.href ? void 0 : "button",
                  role: "menuitem",
                  onClick: item.onClick,
                  style: {
                    display: "block",
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: "var(--radius-10)",
                    background: "transparent",
                    color: "var(--color-semantic-label-normal)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--label1-size)",
                    fontWeight: 600,
                    textAlign: "left",
                    textDecoration: "none"
                  },
                  onMouseEnter: (event) => {
                    event.currentTarget.style.background = "var(--color-semantic-background-normal-alternative)";
                  },
                  onMouseLeave: (event) => {
                    event.currentTarget.style.background = "transparent";
                  },
                  children: item.label
                },
                item.label
              );
            })
          }
        ) : null
      ]
    }
  );
}




exports.TopBar = TopBar; exports.TopBarNavItem = TopBarNavItem;
//# sourceMappingURL=chunk-33GR6TOB.cjs.map