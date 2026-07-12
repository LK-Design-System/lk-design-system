"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/navigation/SideNav.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Chevron = ({ open }) => /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: 14, "aria-hidden": "true", style: { flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" } });
function SideNav({
  items = [],
  value,
  defaultValue,
  onChange,
  header,
  headerCollapsed,
  footer,
  width = 240,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsedWidth = 64,
  overlay = false,
  renderLink,
  style,
  onBlur,
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
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : flat[0] && flat[0].value);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const colControlled = collapsed !== void 0;
  const [colInternal, setColInternal] = React.useState(defaultCollapsed || overlay);
  const col = colControlled ? collapsed : colInternal;
  const setCol = (c) => {
    if (!colControlled) setColInternal(c);
    onCollapsedChange && onCollapsedChange(c);
  };
  const navRef = React.useRef(null);
  const hasPopover = () => !!(navRef.current && navRef.current.querySelector('[role="menu"]'));
  const peekT = React.useRef(null);
  const pointerInside = React.useRef(false);
  const collapseAndRestoreFocus = () => {
    clearTimeout(peekT.current);
    const activeElement = document.activeElement;
    const activeControl = navRef.current?.contains(activeElement) ? activeElement?.closest?.("[data-sidenav-value]") : null;
    const restoreValue = activeControl?.dataset.sidenavParent || activeControl?.dataset.sidenavValue;
    setCol(true);
    if (!activeControl) return;
    requestAnimationFrame(() => {
      const candidates = Array.from(navRef.current?.querySelectorAll("[data-sidenav-value]") || []);
      const matchingButton = restoreValue ? candidates.find((button) => button.dataset.sidenavValue === restoreValue) : null;
      const target = matchingButton || (activeControl.isConnected ? activeControl : null) || navRef.current?.querySelector('.lk-sidenav__scroll [data-sidenav-value]:not(:disabled):not([aria-disabled="true"])');
      target?.focus();
    });
  };
  const peek = (expand) => {
    clearTimeout(peekT.current);
    peekT.current = setTimeout(() => {
      if (!expand && (hasPopover() || navRef.current?.contains(document.activeElement))) return;
      setCol(!expand);
    }, expand ? 160 : 480);
  };
  React.useEffect(() => () => clearTimeout(peekT.current), []);
  React.useEffect(() => {
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
  const [open, setOpen] = React.useState(() => {
    const o = {};
    items.forEach((i) => {
      if (i && i.children && i.children.some((c) => c.value === val)) o[i.value] = true;
    });
    return o;
  });
  const [hovKey, setHovKey] = React.useState(null);
  const hoverProps = (k) => ({ onMouseEnter: () => setHovKey(k), onMouseLeave: () => setHovKey(null) });
  const row = (active, disabled, extra, hovered) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: col ? "center" : "flex-start",
    gap: 11,
    width: "100%",
    padding: col ? "11px 0" : "10px 12px",
    boxSizing: "border-box",
    border: "none",
    borderRadius: "var(--radius-lg)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    textAlign: "left",
    textDecoration: "none",
    fontFamily: "var(--font-sans)",
    background: active ? "var(--color-semantic-primary-surface-strong)" : hovered && !disabled ? "var(--color-semantic-primary-surface-normal)" : "transparent",
    color: active ? "var(--color-semantic-primary-heavy)" : "var(--color-semantic-label-alternative)",
    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
    ...extra
  });
  const labelSpan = (active, children) => /* @__PURE__ */ jsx("span", { style: { flex: 1, minWidth: 0, fontSize: "var(--label1-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children });
  const pill = (active, badge) => /* @__PURE__ */ jsx("span", { style: { flexShrink: 0, minWidth: 18, height: 18, padding: "0 6px", boxSizing: "border-box", borderRadius: "var(--radius-pill)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", lineHeight: "18px", textAlign: "center", background: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-surface-strong)", color: active ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-primary-heavy)" }, children: badge });
  const dot = /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--color-semantic-primary-normal)" } });
  const renderLeafControl = (item, { active, parentValue, ariaLabel, title, content, itemStyle }) => {
    const disabled = !!item.disabled;
    const activate = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      pick(item.value);
      item.onClick?.(event);
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
      return renderLink ? renderLink(item, linkProps) : /* @__PURE__ */ jsx("a", { ...linkProps });
    }
    return /* @__PURE__ */ jsx("button", { type: "button", disabled, ...commonProps });
  };
  const brand = col ? headerCollapsed != null ? headerCollapsed : header : header;
  const shell = { display: "flex", flexDirection: "column", width: col ? collapsedWidth : width, boxSizing: "border-box", background: "var(--color-semantic-background-elevated-normal)", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-xl)", padding: 10, transition: "width var(--dur-base, 200ms) var(--ease-out), box-shadow var(--dur-base, 200ms) var(--ease-out)" };
  const inner = /* @__PURE__ */ jsxs(React.Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `.lk-sidenav__scroll{scrollbar-width:none;-ms-overflow-style:none}.lk-sidenav__scroll::-webkit-scrollbar{display:none;width:0;height:0}` }),
    (brand != null || collapsible) && /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "flex", flexDirection: col ? "column" : "row", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 24, padding: col ? "14px 10px 10px" : "14px 10px 18px" }, children: [
      brand,
      collapsible && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => setCol(!col),
          title: col ? "\uD3BC\uCE58\uAE30" : "\uC811\uAE30",
          "aria-label": col ? "\uD3BC\uCE58\uAE30" : "\uC811\uAE30",
          style: { position: col ? "static" : "absolute", right: col ? "auto" : 2, top: col ? "auto" : 12, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, padding: 0, border: "none", borderRadius: "var(--radius-8)", background: "transparent", color: "var(--color-semantic-label-neutral)", cursor: "pointer" },
          children: /* @__PURE__ */ jsx(Icon, { name: "left-side", size: 16, "aria-hidden": "true", style: { transform: col ? "rotate(180deg)" : "none" } })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "lk-sidenav__scroll", style: { display: "flex", flexDirection: "column", gap: 2, flex: "1 1 auto", minHeight: 0, overflowX: "hidden", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" }, children: items.map((o, i) => {
      if (o.heading) return col ? /* @__PURE__ */ jsx("div", { style: { height: 1, flexShrink: 0, background: "var(--color-semantic-line-solid-normal)", margin: i === 0 ? "2px 12px 6px" : "10px 12px 6px" } }, "h" + i) : /* @__PURE__ */ jsx("div", { style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-semantic-label-alternative)", padding: i === 0 ? "4px 12px 6px" : "14px 12px 6px" }, children: o.heading }, "h" + i);
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
        return /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsxs(
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
              style: row(false, o.disabled, { color: childActive ? "var(--color-semantic-primary-heavy)" : "var(--color-semantic-label-alternative)" }, hovKey === o.value),
              children: [
                o.icon != null && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flexShrink: 0, display: "inline-flex" }, children: o.icon }),
                !col && labelSpan(childActive, o.label),
                !col && /* @__PURE__ */ jsx(Chevron, { open: isOpen }),
                col && childActive && dot
              ]
            }
          ),
          !col && isOpen && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 2, margin: "0 0 4px" }, children: kids.map((c) => {
            const ca = c.value === val;
            const childTitle = typeof c.label === "string" ? c.label : c.ariaLabel;
            return /* @__PURE__ */ jsx(React.Fragment, { children: renderLeafControl(c, {
              active: ca,
              parentValue: o.value,
              ariaLabel: c.ariaLabel,
              title: childTitle,
              itemStyle: row(ca, c.disabled, { padding: "8px 12px 8px 42px" }, hovKey === c.value),
              content: /* @__PURE__ */ jsxs(React.Fragment, { children: [
                /* @__PURE__ */ jsx("span", { style: { flex: 1, minWidth: 0, fontSize: "var(--label2-size)", fontWeight: ca ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: c.label }),
                c.badge != null && pill(ca, c.badge)
              ] })
            }) }, c.value);
          }) })
        ] }, o.value);
      }
      const active = o.value === val;
      return /* @__PURE__ */ jsx(React.Fragment, { children: renderLeafControl(o, {
        active,
        ariaLabel: col || o.ariaLabel ? accessibleLabel : void 0,
        title: accessibleLabel,
        itemStyle: row(active, o.disabled, null, hovKey === o.value),
        content: /* @__PURE__ */ jsxs(React.Fragment, { children: [
          o.icon != null && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flexShrink: 0, display: "inline-flex" }, children: o.icon }),
          !col && labelSpan(active, o.label),
          !col && o.badge != null && pill(active, o.badge),
          col && o.badge != null && dot
        ] })
      }) }, o.value);
    }) }),
    /* @__PURE__ */ jsx("div", { style: { marginTop: "auto", paddingTop: 8 }, children: footer != null && /* @__PURE__ */ jsx("div", { style: { paddingTop: 10, marginLeft: 2, marginRight: 2, borderTop: "1px solid var(--color-semantic-line-solid-normal)" }, children: footer }) })
  ] });
  return /* @__PURE__ */ jsx(
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
      onBlur: overlay ? (e) => {
        onBlur?.(e);
        if (!pointerInside.current && !e.currentTarget.contains(e.relatedTarget)) peek(false);
      } : onBlur,
      style: overlay ? { position: "relative", width: collapsedWidth, flexShrink: 0, ...style } : { ...shell, ...style },
      ...rest,
      children: overlay ? /* @__PURE__ */ jsx("div", { style: { ...shell, position: "absolute", top: 0, left: 0, height: "100%", zIndex: col ? 1 : 40, boxShadow: col ? "none" : "var(--shadow-lg)" }, children: inner }) : inner
    }
  );
}

export {
  SideNav
};
//# sourceMappingURL=chunk-4CMPGLH5.js.map