"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkEBCBZ7WPcjs = require('./chunk-EBCBZ7WP.cjs');


var _chunkS7GFPUQYcjs = require('./chunk-S7GFPUQY.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/navigation/SideNav.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var Chevron = ({ open }) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "chevron-down-small", size: 14, "aria-hidden": "true", style: { flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" } });
function SideNav({
  items = [],
  value,
  defaultValue,
  onChange,
  header,
  headerCollapsed,
  footer,
  width = 240,
  surface = "floating",
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsedWidth = 64,
  overlay = false,
  renderLink,
  className,
  style,
  onBlur,
  onFocus,
  ...rest
}) {
  const isControlled = value !== void 0;
  const flat = [];
  items.forEach((i) => {
    if (i && !i.heading && i.value != null) {
      flat.push(i);
      (i.children || []).forEach((c) => flat.push(c));
    }
  });
  const [internal, setInternal] = _react2.default.useState(defaultValue != null ? defaultValue : flat[0] && flat[0].value);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const colControlled = collapsed !== void 0;
  const [colInternal, setColInternal] = _react2.default.useState(defaultCollapsed || overlay);
  const col = colControlled ? collapsed : colInternal;
  const setCol = (c) => {
    if (!colControlled) setColInternal(c);
    onCollapsedChange && onCollapsedChange(c);
  };
  const generatedPanelId = _react2.default.useId().replace(/:/g, "");
  const panelId = `lk-sidenav-panel-${generatedPanelId}`;
  const navRef = _react2.default.useRef(null);
  const hasPopover = () => !!(navRef.current && navRef.current.querySelector('[role="menu"]'));
  const peekT = _react2.default.useRef(null);
  const pointerInside = _react2.default.useRef(false);
  const restoringFocus = _react2.default.useRef(false);
  const collapseAndRestoreFocus = () => {
    clearTimeout(peekT.current);
    const activeElement = document.activeElement;
    const activeControl = _optionalChain([navRef, 'access', _ => _.current, 'optionalAccess', _2 => _2.contains, 'call', _3 => _3(activeElement)]) ? _optionalChain([activeElement, 'optionalAccess', _4 => _4.closest, 'optionalCall', _5 => _5("[data-sidenav-value]")]) : null;
    const restoreValue = _optionalChain([activeControl, 'optionalAccess', _6 => _6.dataset, 'access', _7 => _7.sidenavParent]) || _optionalChain([activeControl, 'optionalAccess', _8 => _8.dataset, 'access', _9 => _9.sidenavValue]);
    restoringFocus.current = !!activeControl;
    setCol(true);
    if (!activeControl) return;
    requestAnimationFrame(() => {
      const candidates = Array.from(_optionalChain([navRef, 'access', _10 => _10.current, 'optionalAccess', _11 => _11.querySelectorAll, 'call', _12 => _12("[data-sidenav-value]")]) || []);
      const matchingButton = restoreValue ? candidates.find((button) => button.dataset.sidenavValue === restoreValue) : null;
      const target = matchingButton || (activeControl.isConnected ? activeControl : null) || _optionalChain([navRef, 'access', _13 => _13.current, 'optionalAccess', _14 => _14.querySelector, 'call', _15 => _15('.lk-sidenav__scroll [data-sidenav-value]:not(:disabled):not([aria-disabled="true"])')]);
      _optionalChain([target, 'optionalAccess', _16 => _16.focus, 'call', _17 => _17()]);
      requestAnimationFrame(() => {
        restoringFocus.current = false;
      });
    });
  };
  const peek = (expand) => {
    clearTimeout(peekT.current);
    peekT.current = setTimeout(() => {
      if (!expand && (hasPopover() || _optionalChain([navRef, 'access', _18 => _18.current, 'optionalAccess', _19 => _19.contains, 'call', _20 => _20(document.activeElement)]))) return;
      setCol(!expand);
    }, expand ? 160 : 480);
  };
  _react2.default.useEffect(() => () => clearTimeout(peekT.current), []);
  _react2.default.useEffect(() => {
    if (!overlay || col) return void 0;
    const down = (e) => {
      if (hasPopover()) return;
      if (navRef.current && !navRef.current.contains(e.target)) setCol(true);
    };
    const key = (e) => {
      if (e.key !== "Escape" || hasPopover()) return;
      e.preventDefault();
      collapseAndRestoreFocus();
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  });
  const [open, setOpen] = _react2.default.useState(() => {
    const o = {};
    items.forEach((i) => {
      if (i && i.children && i.children.some((c) => c.value === val)) o[i.value] = true;
    });
    return o;
  });
  _react2.default.useEffect(() => {
    const activeParent = items.find((item) => item && !item.heading && _optionalChain([item, 'access', _21 => _21.children, 'optionalAccess', _22 => _22.some, 'call', _23 => _23((child) => child.value === val)]));
    if (!activeParent) return;
    setOpen((current) => current[activeParent.value] ? current : { ...current, [activeParent.value]: true });
  }, [items, val]);
  const [hovKey, setHovKey] = _react2.default.useState(null);
  const hoverProps = (k) => ({ onMouseEnter: () => setHovKey(k), onMouseLeave: () => setHovKey(null) });
  const row = (active, disabled, extra, hovered) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: col ? "center" : "flex-start",
    gap: 11,
    width: "100%",
    minHeight: col ? void 0 : 44,
    padding: col ? "11px 0" : "10px 12px",
    boxSizing: "border-box",
    border: "none",
    borderRadius: "var(--radius-lg)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    textAlign: "left",
    textDecoration: "none",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--label1-size)",
    lineHeight: "var(--label1-line)",
    background: active ? "var(--color-semantic-primary-surface-strong)" : hovered && !disabled ? "var(--color-semantic-primary-surface-normal)" : "transparent",
    color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
    ...extra
  });
  const labelSpan = (active, children) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, minWidth: 0, fontSize: "var(--label1-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children });
  const pill = (active, badge) => /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flexShrink: 0, minWidth: 18, height: 18, padding: "0 6px", boxSizing: "border-box", borderRadius: "var(--radius-pill)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", lineHeight: "18px", textAlign: "center", background: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-surface-strong)", color: active ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-label-normal)" }, children: badge });
  const dot = /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--color-semantic-primary-normal)" } });
  const renderLeafControl = (item, { active, parentValue, ariaLabel, title, content, itemStyle }) => {
    const disabled = !!item.disabled;
    const activate = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      pick(item.value);
      _optionalChain([item, 'access', _24 => _24.onClick, 'optionalCall', _25 => _25(event)]);
    };
    const commonProps = {
      "data-sidenav-value": item.value,
      "data-sidenav-parent": parentValue,
      "aria-label": ariaLabel,
      "aria-current": active ? "page" : void 0,
      title,
      onClick: activate,
      ...hoverProps(item.value),
      style: itemStyle,
      children: content
    };
    if (item.href != null) {
      const linkProps = {
        ...commonProps,
        href: disabled ? void 0 : item.href,
        target: item.target,
        rel: item.rel,
        "aria-disabled": disabled || void 0,
        tabIndex: disabled ? -1 : void 0
      };
      return renderLink ? renderLink(item, linkProps) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "a", { ...linkProps });
    }
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", disabled, ...commonProps });
  };
  const brand = col ? headerCollapsed != null ? headerCollapsed : header : header;
  const resolvedSurface = surface === "docked" ? "docked" : "floating";
  const docked = resolvedSurface === "docked";
  const persistentCollapse = collapsible && !overlay;
  const inlineCollapse = collapsible && overlay;
  const collapseLabel = col ? "\uC0AC\uC774\uB4DC\uBC14 \uD3BC\uCE58\uAE30" : "\uC0AC\uC774\uB4DC\uBC14 \uC811\uAE30";
  const shell = { position: "relative", display: "flex", flexDirection: "column", width: col ? collapsedWidth : width, boxSizing: "border-box", background: "var(--color-semantic-background-elevated-normal)", border: docked ? "none" : "1px solid var(--color-semantic-line-solid-normal)", borderInlineEnd: docked ? "1px solid var(--color-semantic-line-solid-normal)" : void 0, borderRadius: docked ? 0 : "var(--radius-xl)", boxShadow: docked ? "none" : void 0, padding: 10, transition: "width var(--dur-base, 200ms) var(--ease-out), box-shadow var(--dur-base, 200ms) var(--ease-out)" };
  const sideNavStyles = `.lk-sidenav__scroll{scrollbar-width:none;-ms-overflow-style:none}.lk-sidenav__scroll::-webkit-scrollbar{display:none;width:0;height:0}.lk-sidenav__collapse-control{position:absolute;inset-block-start:10px;inset-inline-end:0;z-index:2;display:inline-flex;line-height:0}@media(prefers-reduced-motion:reduce){.lk-sidenav__surface,.lk-sidenav__collapse-control,.lk-sidenav__collapse-control .lk-iconbtn,.lk-sidenav__collapse-control svg{transition-duration:0s!important;animation-duration:0s!important}}`;
  const persistentCollapseControl = persistentCollapse ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-sidenav__collapse-control", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkEBCBZ7WPcjs.Tooltip, { content: collapseLabel, placement: "right", size: "small", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _chunkS7GFPUQYcjs.IconButton,
    {
      className: "lk-sidenav__collapse-button",
      "data-sidenav-collapse-toggle": "",
      variant: "ghost",
      size: 36,
      round: false,
      label: collapseLabel,
      title: collapseLabel,
      "aria-expanded": !col,
      "aria-controls": panelId,
      onClick: () => setCol(!col),
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: col ? "chevron-right" : "chevron-left", size: 16, "aria-hidden": "true" })
    }
  ) }) }) : null;
  const inlineCollapseControl = inlineCollapse ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      type: "button",
      "data-sidenav-collapse-toggle": "",
      onClick: () => setCol(!col),
      title: collapseLabel,
      "aria-label": collapseLabel,
      style: { position: col ? "static" : "absolute", right: col ? "auto" : 2, top: col ? "auto" : 12, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, padding: 0, border: "none", borderRadius: "var(--radius-8)", background: "transparent", color: "var(--color-semantic-label-neutral)", cursor: "pointer" },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "left-side", size: 16, "aria-hidden": "true", style: { transform: col ? "rotate(180deg)" : "none" } })
    }
  ) : null;
  const brandRegionStyle = persistentCollapse ? { position: "relative", display: "flex", alignItems: "center", justifyContent: col ? "center" : "flex-start", gap: 8, width: "calc(100% + 20px)", minHeight: 36, marginInline: -10, padding: col ? "54px 4px 14px" : "10px 44px 14px 4px", boxSizing: "border-box" } : { position: "relative", display: "flex", flexDirection: col ? "column" : "row", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 24, padding: col ? "14px 10px 10px" : "14px 10px 18px" };
  const panelContent = /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { id: panelId, className: "lk-sidenav__panel-content", "data-collapsed": col ? "true" : "false", style: { display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0 }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: sideNavStyles }),
    (brand != null || collapsible) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { className: "lk-sidenav__brand", style: brandRegionStyle, children: [
      brand,
      inlineCollapseControl
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-sidenav__scroll", style: { display: "flex", flexDirection: "column", gap: 2, flex: "1 1 auto", minHeight: 0, overflowX: "hidden", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }, children: items.map((o, i) => {
      if (o.heading) return col ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { height: 1, flexShrink: 0, background: "var(--color-semantic-line-solid-normal)", margin: i === 0 ? "2px 12px 6px" : "10px 12px 6px" } }, "h" + i) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-semantic-label-alternative)", padding: i === 0 ? "4px 12px 6px" : "14px 12px 6px" }, children: o.heading }, "h" + i);
      const kids = o.children || [];
      const title = typeof o.label === "string" ? o.label : void 0;
      const accessibleLabel = o.ariaLabel || title;
      if (kids.length > 0) {
        const isOpen = !!open[o.value];
        const childActive = kids.some((c) => c.value === val);
        const onParent = () => {
          if (col) {
            setCol(false);
            setOpen((s) => ({ ...s, [o.value]: true }));
          } else {
            setOpen((s) => ({ ...s, [o.value]: !s[o.value] }));
          }
        };
        return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
            "button",
            {
              type: "button",
              "data-sidenav-value": o.value,
              "aria-label": col || o.ariaLabel ? accessibleLabel : void 0,
              "aria-expanded": col ? void 0 : isOpen,
              disabled: o.disabled,
              onClick: onParent,
              title: accessibleLabel,
              ...hoverProps(o.value),
              style: row(false, o.disabled, { color: childActive ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)" }, hovKey === o.value),
              children: [
                o.icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { flexShrink: 0, display: "inline-flex" }, children: o.icon }),
                !col && labelSpan(childActive, o.label),
                !col && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Chevron, { open: isOpen }),
                col && childActive && dot
              ]
            }
          ),
          !col && isOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", flexDirection: "column", gap: 2, margin: "0 0 4px" }, children: kids.map((c) => {
            const ca = c.value === val;
            const childTitle = typeof c.label === "string" ? c.label : c.ariaLabel;
            return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react2.default.Fragment, { children: renderLeafControl(c, {
              active: ca,
              parentValue: o.value,
              ariaLabel: c.ariaLabel,
              title: childTitle,
              itemStyle: row(ca, c.disabled, { padding: "8px 12px 8px 42px" }, hovKey === c.value),
              content: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, minWidth: 0, fontSize: "var(--label2-size)", fontWeight: ca ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: c.label }),
                c.badge != null && pill(ca, c.badge)
              ] })
            }) }, c.value);
          }) })
        ] }, o.value);
      }
      const active = o.value === val;
      return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _react2.default.Fragment, { children: renderLeafControl(o, {
        active,
        ariaLabel: col || o.ariaLabel ? accessibleLabel : void 0,
        title: accessibleLabel,
        itemStyle: row(active, o.disabled, null, hovKey === o.value),
        content: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
          o.icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { flexShrink: 0, display: "inline-flex" }, children: o.icon }),
          !col && labelSpan(active, o.label),
          !col && o.badge != null && pill(active, o.badge),
          col && o.badge != null && dot
        ] })
      }) }, o.value);
    }) }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { marginTop: "auto", paddingTop: 8 }, children: footer != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { paddingTop: 10, marginLeft: 2, marginRight: 2, borderTop: "1px solid var(--color-semantic-line-solid-normal)" }, children: footer }) })
  ] });
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "nav",
    {
      ref: navRef,
      onClick: overlay && col ? (e) => {
        if (!e.target.closest("[data-sidenav-value], button")) setCol(false);
      } : void 0,
      onMouseEnter: overlay ? () => {
        pointerInside.current = true;
        peek(true);
      } : void 0,
      onMouseLeave: overlay ? () => {
        pointerInside.current = false;
        peek(false);
      } : void 0,
      onFocus: overlay ? (e) => {
        _optionalChain([onFocus, 'optionalCall', _26 => _26(e)]);
        if (col && !restoringFocus.current && !e.currentTarget.contains(e.relatedTarget)) {
          clearTimeout(peekT.current);
          setCol(false);
        }
      } : onFocus,
      onBlur: overlay ? (e) => {
        _optionalChain([onBlur, 'optionalCall', _27 => _27(e)]);
        if (!pointerInside.current && !e.currentTarget.contains(e.relatedTarget)) peek(false);
      } : onBlur,
      className: ["lk-sidenav", !overlay && "lk-sidenav__surface", className].filter(Boolean).join(" "),
      style: overlay ? { position: "relative", width: collapsedWidth, flexShrink: 0, ...style } : { ...shell, ...style },
      ...rest,
      "data-surface": resolvedSurface,
      children: overlay ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-sidenav__surface", style: { ...shell, position: "absolute", top: 0, left: 0, height: "100%", zIndex: col ? 1 : 40, boxShadow: col ? "none" : "var(--shadow-lg)", clipPath: col || !docked ? void 0 : "inset(0 -120px 0 0)" }, children: panelContent }) : /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _react2.default.Fragment, { children: [
        panelContent,
        persistentCollapseControl
      ] })
    }
  );
}



exports.SideNav = SideNav;
//# sourceMappingURL=chunk-YPIGOTKQ.cjs.map