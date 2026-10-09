"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkYWFKCTJZcjs = require('./chunk-YWFKCTJZ.cjs');

// components/navigation/NavRail.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var NAV_RAIL_DOCKED_MAX_ITEMS = 7;
var NAV_RAIL_APPEARANCES = {
  default: {
    surface: "var(--color-semantic-background-elevated-normal)",
    divider: "var(--color-semantic-line-solid-normal)",
    foreground: "var(--color-semantic-label-normal)",
    mutedForeground: "var(--color-semantic-label-alternative)",
    hoverForeground: "var(--color-semantic-label-alternative)",
    hoverSurface: "var(--color-semantic-primary-surface-normal)",
    activeSurface: "var(--color-semantic-primary-surface-strong)",
    activeHoverSurface: "var(--color-semantic-primary-surface-strong)",
    pressedSurface: "var(--color-semantic-primary-surface-strong)",
    focusIndicator: "var(--color-semantic-focus-indicator)"
  },
  neutral: {
    surface: "var(--component-nav-rail-neutral-surface)",
    divider: "var(--component-nav-rail-neutral-divider)",
    foreground: "var(--component-nav-rail-neutral-foreground)",
    mutedForeground: "var(--component-nav-rail-neutral-muted-foreground)",
    hoverForeground: "var(--component-nav-rail-neutral-hover-foreground)",
    hoverSurface: "var(--component-nav-rail-neutral-hover-surface)",
    activeSurface: "var(--component-nav-rail-neutral-active-surface)",
    activeHoverSurface: "var(--component-nav-rail-neutral-active-hover-surface)",
    pressedSurface: "var(--component-nav-rail-neutral-pressed-surface)",
    focusIndicator: "var(--component-nav-rail-neutral-focus-indicator)"
  }
};
var NAV_RAIL_LIST_STYLES = `
  .lk-nav-rail [data-nav-rail-value]:active:not(:disabled){background:var(--_lds-nav-rail-pressed-surface)!important;color:var(--_lds-nav-rail-pressed-foreground)!important}
  .lk-nav-rail [data-nav-rail-value]:focus-visible{outline-color:var(--_lds-nav-rail-focus-indicator)!important;outline-offset:-2px!important}
  .lk-nav-rail__list::-webkit-scrollbar{display:none}
  @media(forced-colors:active){.lk-nav-rail [data-nav-rail-value][data-state="active"]{background:Highlight!important;color:HighlightText!important;background:SelectedItem!important;color:SelectedItemText!important}}
  @media(prefers-reduced-motion:reduce){.lk-nav-rail [data-nav-rail-value]{transition:none!important}}
`;
function isDevelopment() {
  const env = typeof globalThis.process !== "undefined" ? globalThis.process.env : void 0;
  return !(env && env.NODE_ENV === "production");
}
function DockedCaptionTooltip({ label, labelRef, children }) {
  const [open, setOpen] = _react2.default.useState(false);
  if (label == null) return children;
  const requestOpen = (next) => {
    const node = labelRef.current;
    setOpen(Boolean(next && node && node.scrollWidth > node.clientWidth + 1));
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkYWFKCTJZcjs.Tooltip, { content: label, placement: "right", size: "small", open, onOpenChange: requestOpen, style: { display: "flex", width: "100%", justifyContent: "center" }, children });
}
function NavRail({
  items = [],
  value,
  defaultValue,
  onChange,
  renderLink,
  surface = "floating",
  appearance = "default",
  header,
  footer,
  getItemCurrent,
  className,
  style,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue != null ? defaultValue : items[0] && items[0].value);
  const [hoveredValue, setHoveredValue] = _react2.default.useState(null);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const resolvedSurface = surface === "docked" || surface === "drawer" ? surface : "floating";
  const resolvedAppearance = appearance === "neutral" ? "neutral" : "default";
  const tokens = NAV_RAIL_APPEARANCES[resolvedAppearance];
  const docked = resolvedSurface === "docked";
  const drawer = resolvedSurface === "drawer";
  const labelNodes = _react2.default.useRef(/* @__PURE__ */ new Map());
  _react2.default.useEffect(() => {
    if (!docked || items.length <= NAV_RAIL_DOCKED_MAX_ITEMS || !isDevelopment()) return;
    console.warn(`NavRail: a docked rail holds 3-${NAV_RAIL_DOCKED_MAX_ITEMS} area destinations and must not scroll at a 600px document height; received ${items.length}. Move the rest into the contextual panel or body tabs.`);
  }, [docked, items.length]);
  const currentFor = (item, active) => typeof getItemCurrent === "function" ? getItemCurrent(item, { active }) || void 0 : active ? "page" : void 0;
  if (resolvedSurface === "floating") {
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "nav", { "aria-label": "\uC8FC \uD0D0\uC0C9", className, style: { display: "inline-flex", flexDirection: "column", width: "fit-content", maxWidth: "100%", boxSizing: "border-box", gap: "var(--space-1-5)", padding: "var(--space-2-5)", background: "var(--color-semantic-background-elevated-normal)", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-xl)", ...style }, ...rest, children: items.map((o) => {
      const active = o.value === val;
      const disabled = !!o.disabled;
      const accessibleLabel = o.ariaLabel || (typeof o.label === "string" ? o.label : void 0);
      const content = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
        o.icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { display: "inline-flex", flexShrink: 0 }, children: o.icon }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: "100%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)" }, children: o.label })
      ] });
      const itemStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-1-5)",
        width: 68,
        height: 60,
        padding: 0,
        boxSizing: "border-box",
        border: "none",
        borderRadius: "var(--radius-lg)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        textDecoration: "none",
        textAlign: "center",
        background: active ? "var(--color-semantic-primary-surface-strong)" : hoveredValue === o.value && !disabled ? "var(--color-semantic-primary-surface-normal)" : "transparent",
        color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
        transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
      };
      const activate = (event) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        pick(o.value);
        _optionalChain([o, 'access', _ => _.onClick, 'optionalCall', _2 => _2(event)]);
      };
      if (o.href != null) {
        const linkProps = {
          href: disabled ? void 0 : o.href,
          target: o.target,
          rel: o.rel,
          "aria-label": o.ariaLabel,
          "aria-current": currentFor(o, active),
          "aria-disabled": disabled || void 0,
          tabIndex: disabled ? -1 : void 0,
          title: accessibleLabel,
          onClick: activate,
          onMouseEnter: () => setHoveredValue(o.value),
          onMouseLeave: () => setHoveredValue(null),
          style: itemStyle,
          children: content
        };
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react2.default.Fragment, { children: renderLink ? renderLink(o, linkProps) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { ...linkProps }) }, o.value);
      }
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": o.ariaLabel, "aria-current": currentFor(o, active), disabled, onClick: activate, onMouseEnter: () => setHoveredValue(o.value), onMouseLeave: () => setHoveredValue(null), title: accessibleLabel, style: itemStyle, children: content }, o.value);
    }) });
  }
  const renderItem = (o) => {
    const active = o.value === val;
    const disabled = !!o.disabled;
    const hovered = hoveredValue === o.value && !disabled;
    const accessibleLabel = o.ariaLabel || (typeof o.label === "string" ? o.label : void 0);
    const labelRef = { get current() {
      return labelNodes.current.get(o.value) || null;
    } };
    const itemStyle = {
      "--_lds-nav-rail-pressed-foreground": active ? tokens.foreground : tokens.hoverForeground,
      position: "relative",
      display: "flex",
      flexDirection: drawer ? "row" : "column",
      alignItems: "center",
      justifyContent: drawer ? "flex-start" : "center",
      gap: drawer ? "var(--space-3)" : "var(--space-1)",
      width: drawer ? "100%" : "var(--component-nav-rail-docked-item-size)",
      minHeight: drawer ? "var(--control-h-md)" : "var(--component-nav-rail-docked-item-size)",
      height: drawer ? void 0 : "var(--component-nav-rail-docked-item-size)",
      padding: drawer ? "0 var(--space-3)" : "0 var(--space-0-5)",
      boxSizing: "border-box",
      border: "none",
      borderRadius: "var(--radius-lg)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      textDecoration: "none",
      textAlign: drawer ? "start" : "center",
      fontFamily: "var(--font-sans)",
      background: active ? hovered ? tokens.activeHoverSurface : tokens.activeSurface : hovered ? tokens.hoverSurface : "transparent",
      color: active ? tokens.foreground : hovered ? tokens.hoverForeground : tokens.mutedForeground,
      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
    };
    const content = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
      o.icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "icon", "aria-hidden": "true", style: { display: "inline-flex", flexShrink: 0 }, children: o.icon }),
      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "span",
        {
          "data-slot": "label",
          ref: (node) => {
            if (node) labelNodes.current.set(o.value, node);
            else labelNodes.current.delete(o.value);
          },
          style: {
            display: "block",
            width: drawer ? void 0 : "100%",
            flex: drawer ? "1 1 auto" : void 0,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: drawer ? "var(--label1-size)" : "var(--caption2-size)",
            lineHeight: drawer ? "var(--label1-line)" : "var(--caption2-line)",
            fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)"
          },
          children: o.label
        }
      )
    ] });
    const activate = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      pick(o.value);
      _optionalChain([o, 'access', _3 => _3.onClick, 'optionalCall', _4 => _4(event)]);
    };
    const common = {
      "data-nav-rail-value": o.value,
      "data-state": active ? "active" : "inactive",
      "aria-label": o.ariaLabel,
      "aria-current": currentFor(o, active),
      onClick: activate,
      onMouseEnter: () => setHoveredValue(o.value),
      onMouseLeave: () => setHoveredValue(null),
      style: itemStyle,
      children: content
    };
    let control;
    if (o.href != null) {
      const linkProps = {
        ...common,
        href: disabled ? void 0 : o.href,
        target: o.target,
        rel: o.rel,
        "aria-disabled": disabled || void 0,
        tabIndex: disabled ? -1 : void 0
      };
      control = renderLink ? renderLink(o, linkProps) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { ...linkProps });
    } else {
      control = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", disabled, ...common });
    }
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "li", { style: { display: "flex", justifyContent: "center", minWidth: 0 }, children: docked ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DockedCaptionTooltip, { label: accessibleLabel, labelRef, children: control }) : control }, o.value);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "nav",
    {
      "aria-label": "\uC8FC \uD0D0\uC0C9",
      "data-surface": resolvedSurface,
      "data-appearance": resolvedAppearance,
      className: ["lk-nav-rail", className].filter(Boolean).join(" "),
      style: {
        "--_lds-nav-rail-pressed-surface": tokens.pressedSurface,
        "--_lds-nav-rail-focus-indicator": tokens.focusIndicator,
        display: "flex",
        flexDirection: "column",
        width: docked ? "var(--component-nav-rail-docked-width)" : "100%",
        height: docked ? "100%" : void 0,
        minHeight: 0,
        boxSizing: "border-box",
        background: docked ? tokens.surface : void 0,
        borderInlineEnd: docked ? `1px solid ${tokens.divider}` : void 0,
        color: tokens.foreground,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: NAV_RAIL_LIST_STYLES }),
        docked && header != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "header", style: { display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, minHeight: "var(--component-nav-rail-docked-slot-height)" }, children: header }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "ul",
          {
            "data-slot": "list",
            className: "lk-nav-rail__list",
            "data-scrollbar-exception": "collapsed-navigation-rail",
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: drawer ? "stretch" : "center",
              gap: docked ? "var(--component-nav-rail-docked-item-gap)" : "var(--space-0-5)",
              flex: docked ? "1 1 auto" : void 0,
              minHeight: 0,
              margin: 0,
              padding: docked ? "var(--component-nav-rail-docked-padding-block) 0" : "var(--space-2)",
              listStyle: "none",
              // Within the 600px document-height budget seven items never scroll;
              // below it the list scrolls with a hidden scrollbar (WCAG 1.4.10 reflow).
              overflowX: "hidden",
              overflowY: docked ? "auto" : void 0,
              scrollbarWidth: docked ? "none" : void 0
            },
            children: items.map(renderItem)
          }
        ),
        docked && footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "footer", style: { display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, minHeight: "var(--component-nav-rail-docked-slot-height)" }, children: footer })
      ]
    }
  );
}



exports.NavRail = NavRail;
//# sourceMappingURL=chunk-7MXSHACP.cjs.map