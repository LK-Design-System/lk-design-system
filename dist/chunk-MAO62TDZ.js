"use client";
import {
  Tooltip
} from "./chunk-7KQZI6QO.js";
import {
  useLightDismiss
} from "./chunk-PCHCMWOA.js";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/navigation/SideNav.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Chevron = ({ open }) => /* @__PURE__ */ jsx(Icon, { name: "chevron-down-small", size: 14, "aria-hidden": "true", style: { flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" } });
var LIST_ITEM_STYLE = { display: "flex", flexDirection: "column", gap: "var(--space-0-5)", minWidth: 0 };
function RailItemTooltip({ label, collapsed, enabled = true, children }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!enabled || !collapsed) setOpen(false);
  }, [collapsed, enabled]);
  if (!enabled || label == null) return children;
  return /* @__PURE__ */ jsx(Tooltip, { content: label, placement: "right", size: "small", open: collapsed ? open : false, onOpenChange: setOpen, style: { width: "100%" }, children });
}
function SideNav({
  items = [],
  value,
  defaultValue,
  onChange,
  header,
  headerCollapsed,
  footer,
  width = 240,
  brandAlign = "center",
  footerGap = "var(--space-2)",
  surface = "floating",
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsedWidth = 64,
  overlay = false,
  autoExpandActiveGroup = true,
  renderLink,
  className,
  style,
  onBlur,
  onFocus,
  "aria-label": ariaLabel = "\uC0AC\uC774\uB4DC \uD0D0\uC0C9",
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
  const persistentCollapsedRef = React.useRef(defaultCollapsed);
  const previousOverlayRef = React.useRef(overlay);
  const [colInternal, setColInternal] = React.useState(defaultCollapsed || overlay);
  const col = colControlled ? collapsed : colInternal;
  const setCol = (c) => {
    if (!colControlled) {
      setColInternal(c);
      if (!overlay) persistentCollapsedRef.current = c;
    }
    onCollapsedChange && onCollapsedChange(c);
  };
  const generatedPanelId = React.useId().replace(/:/g, "");
  const panelId = `lk-sidenav-panel-${generatedPanelId}`;
  const navRef = React.useRef(null);
  const hasPopover = () => !!(navRef.current && navRef.current.querySelector('[role="menu"]'));
  const peekT = React.useRef(null);
  const pointerInside = React.useRef(false);
  const restoringFocus = React.useRef(false);
  React.useEffect(() => {
    const previousOverlay = previousOverlayRef.current;
    previousOverlayRef.current = overlay;
    if (colControlled || previousOverlay === overlay) return;
    clearTimeout(peekT.current);
    setColInternal(overlay ? true : persistentCollapsedRef.current);
  }, [colControlled, overlay]);
  const collapseAndRestoreFocus = () => {
    clearTimeout(peekT.current);
    const activeElement = document.activeElement;
    const activeControl = navRef.current?.contains(activeElement) ? activeElement?.closest?.("[data-sidenav-value]") : null;
    const restoreValue = activeControl?.dataset.sidenavParent || activeControl?.dataset.sidenavValue;
    restoringFocus.current = !!activeControl;
    setCol(true);
    if (!activeControl) return;
    requestAnimationFrame(() => {
      const candidates = Array.from(navRef.current?.querySelectorAll("[data-sidenav-value]") || []);
      const matchingButton = restoreValue ? candidates.find((button) => button.dataset.sidenavValue === restoreValue) : null;
      const target = matchingButton || (activeControl.isConnected ? activeControl : null) || navRef.current?.querySelector('.lk-sidenav__scroll [data-sidenav-value]:not(:disabled):not([aria-disabled="true"])');
      target?.focus();
      requestAnimationFrame(() => {
        restoringFocus.current = false;
      });
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
  useLightDismiss({
    open: overlay && !col,
    rootRef: navRef,
    shouldDismiss: () => !hasPopover(),
    onDismiss: (reason) => {
      if (reason === "escape") collapseAndRestoreFocus();
      else setCol(true);
    }
  });
  const [open, setOpen] = React.useState(() => {
    const o = {};
    if (autoExpandActiveGroup) {
      items.forEach((i) => {
        if (i && i.children && i.children.some((c) => c.value === val)) o[i.value] = true;
      });
    }
    return o;
  });
  React.useEffect(() => {
    if (!autoExpandActiveGroup) return;
    const activeParent = items.find((item) => item && !item.heading && item.children?.some((child) => child.value === val));
    if (!activeParent) return;
    setOpen((current) => current[activeParent.value] ? current : { ...current, [activeParent.value]: true });
  }, [autoExpandActiveGroup, items, val]);
  const [hovKey, setHovKey] = React.useState(null);
  const hoverProps = (k) => ({ onMouseEnter: () => setHovKey(k), onMouseLeave: () => setHovKey(null) });
  const row = (active, disabled, extra, hovered) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: col ? "center" : "flex-start",
    gap: "var(--space-3)",
    // Width may animate between rail and panel, but vertical hit targets stay
    // fixed so pointer/focus positions do not drift during an overlay peek.
    width: "100%",
    minHeight: 44,
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
    background: active ? "var(--color-semantic-primary-surface-strong)" : hovered && !disabled ? "var(--color-semantic-fill-alternative)" : "transparent",
    color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
    ...extra
  });
  const labelSpan = (active, children) => /* @__PURE__ */ jsx("span", { style: { flex: 1, minWidth: 0, fontSize: "var(--label1-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children });
  const pill = (active, badge) => /* @__PURE__ */ jsx("span", { style: { flexShrink: 0, minWidth: 18, height: 18, padding: "0 6px", boxSizing: "border-box", borderRadius: "var(--radius-pill)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", lineHeight: "18px", textAlign: "center", background: active ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-surface-strong)", color: active ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-label-normal)" }, children: badge });
  const dot = /* @__PURE__ */ jsx("span", { style: { position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--color-semantic-primary-normal)" } });
  const renderLeafControl = (item, { active, parentValue, ariaLabel: ariaLabel2, title, content, itemStyle }) => {
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
      "aria-label": ariaLabel2,
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
  const resolvedFooter = typeof footer === "function" ? footer({ collapsed: col, expanded: !col, overlay }) : footer;
  const resolvedSurface = surface === "docked" ? "docked" : "floating";
  const docked = resolvedSurface === "docked";
  const shell = { position: "relative", display: "flex", flexDirection: "column", width: col ? collapsedWidth : width, boxSizing: "border-box", background: "var(--color-semantic-background-elevated-normal)", border: docked ? "none" : "1px solid var(--color-semantic-line-solid-normal)", borderInlineEnd: docked ? "1px solid var(--color-semantic-line-solid-normal)" : void 0, borderRadius: docked ? 0 : "var(--radius-xl)", boxShadow: docked ? "none" : void 0, padding: "var(--space-2-5)", transition: "width var(--dur-base, 200ms) var(--ease-out), box-shadow var(--dur-base, 200ms) var(--ease-out)" };
  const sideNavStyles = `
    [data-sidenav-value]:active:not(:disabled){background:var(--color-semantic-fill-normal)!important}
    [data-collapsed="true"] .lk-sidenav__scroll::-webkit-scrollbar{display:none}
    @media(prefers-reduced-motion:reduce){.lk-sidenav__surface{transition-duration:0s!important;animation-duration:0s!important}}
  `;
  const brandRegionStyle = { position: "relative", display: "flex", flexDirection: col ? "column" : "row", alignItems: "center", justifyContent: col || brandAlign === "center" ? "center" : "flex-start", gap: "var(--space-1-5)", minHeight: 24, padding: "14px 10px 18px" };
  const panelContent = /* @__PURE__ */ jsxs("div", { id: panelId, className: "lk-sidenav__panel-content", "data-collapsed": col ? "true" : "false", style: { display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0 }, children: [
    /* @__PURE__ */ jsx("style", { children: sideNavStyles }),
    brand != null && /* @__PURE__ */ jsx("div", { className: "lk-sidenav__brand", style: brandRegionStyle, children: brand }),
    /* @__PURE__ */ jsx("ul", { className: "lk-scroll-surface lk-sidenav__scroll", "data-scrollbar": "compact", "data-scroll-gutter": col ? "auto" : "stable", "data-scrollbar-exception": "collapsed-navigation-rail", style: { display: "flex", flexDirection: "column", gap: "var(--space-0-5)", flex: "1 1 auto", minHeight: 0, margin: 0, padding: 0, listStyle: "none", overflowX: "hidden", overflowY: "auto", scrollbarWidth: col ? "none" : void 0 }, children: items.map((o, i) => {
      if (o.heading) return col ? /* @__PURE__ */ jsx("li", { style: LIST_ITEM_STYLE, children: /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: { height: 1, flexShrink: 0, background: "var(--color-semantic-line-solid-normal)", margin: i === 0 ? "2px 12px 6px" : "10px 12px 6px" } }) }, "h" + i) : /* @__PURE__ */ jsx("li", { style: LIST_ITEM_STYLE, children: /* @__PURE__ */ jsx("div", { style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", letterSpacing: "1px", textTransform: "uppercase", color: "var(--color-semantic-label-alternative)", padding: i === 0 ? "4px 12px 6px" : "14px 12px 6px" }, children: o.heading }) }, "h" + i);
      const kids = o.children || [];
      const title = typeof o.label === "string" ? o.label : void 0;
      const accessibleLabel = o.ariaLabel || title;
      if (kids.length > 0) {
        const isOpen = !!open[o.value];
        const childActive = kids.some((c) => c.value === val);
        const hasChildIcons = kids.some((c) => c.icon != null);
        const onParent = () => {
          if (col) {
            setCol(false);
            setOpen((s) => ({ ...s, [o.value]: true }));
          } else {
            setOpen((s) => ({ ...s, [o.value]: !s[o.value] }));
          }
        };
        return /* @__PURE__ */ jsxs("li", { style: LIST_ITEM_STYLE, children: [
          /* @__PURE__ */ jsx(RailItemTooltip, { label: accessibleLabel, collapsed: col, enabled: !overlay, children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              "data-sidenav-value": o.value,
              "aria-label": col || o.ariaLabel ? accessibleLabel : void 0,
              "aria-expanded": col ? void 0 : isOpen,
              disabled: o.disabled,
              onClick: onParent,
              title: col ? void 0 : accessibleLabel,
              ...hoverProps(o.value),
              style: row(false, o.disabled, { color: childActive ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)" }, hovKey === o.value),
              children: [
                o.icon != null && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flexShrink: 0, display: "inline-flex" }, children: o.icon }),
                !col && labelSpan(childActive, o.label),
                !col && /* @__PURE__ */ jsx(Chevron, { open: isOpen })
              ]
            }
          ) }),
          !col && isOpen && /* @__PURE__ */ jsx("ul", { style: { display: "flex", flexDirection: "column", gap: "var(--space-0-5)", margin: "0 0 4px", padding: 0, listStyle: "none" }, children: kids.map((c) => {
            const ca = c.value === val;
            const childTitle = typeof c.label === "string" ? c.label : c.ariaLabel;
            return /* @__PURE__ */ jsx("li", { style: LIST_ITEM_STYLE, children: renderLeafControl(c, {
              active: ca,
              parentValue: o.value,
              ariaLabel: c.ariaLabel,
              title: childTitle,
              itemStyle: row(ca, c.disabled, { padding: hasChildIcons ? "8px 12px 8px 24px" : "8px 12px 8px 42px", gap: hasChildIcons ? "var(--space-2)" : void 0 }, hovKey === c.value),
              content: /* @__PURE__ */ jsxs(React.Fragment, { children: [
                hasChildIcons && /* @__PURE__ */ jsx("span", { "data-sidenav-child-icon": true, "aria-hidden": "true", style: { width: "var(--space-4-5)", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: c.icon }),
                /* @__PURE__ */ jsx("span", { style: { flex: 1, minWidth: 0, fontSize: "var(--label2-size)", fontWeight: ca ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: c.label }),
                c.badge != null && pill(ca, c.badge)
              ] })
            }) }, c.value);
          }) })
        ] }, o.value);
      }
      const active = o.value === val;
      return /* @__PURE__ */ jsx("li", { style: LIST_ITEM_STYLE, children: /* @__PURE__ */ jsx(RailItemTooltip, { label: accessibleLabel, collapsed: col, enabled: !overlay, children: renderLeafControl(o, {
        active,
        ariaLabel: col || o.ariaLabel ? accessibleLabel : void 0,
        title: col ? void 0 : accessibleLabel,
        itemStyle: row(active, o.disabled, null, hovKey === o.value),
        content: /* @__PURE__ */ jsxs(React.Fragment, { children: [
          o.icon != null && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { flexShrink: 0, display: "inline-flex" }, children: o.icon }),
          !col && labelSpan(active, o.label),
          !col && o.badge != null && pill(active, o.badge),
          col && o.badge != null && dot
        ] })
      }) }) }, o.value);
    }) }),
    /* @__PURE__ */ jsx("div", { style: { marginTop: "auto", paddingTop: footerGap }, children: resolvedFooter != null && /* @__PURE__ */ jsx("div", { style: { paddingTop: "var(--space-2-5)", marginLeft: "var(--space-0-5)", marginRight: "var(--space-0-5)", borderTop: "1px solid var(--color-semantic-line-solid-normal)" }, children: resolvedFooter }) })
  ] });
  return /* @__PURE__ */ jsx(
    "nav",
    {
      ref: navRef,
      "aria-label": ariaLabel,
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
        onFocus?.(e);
        if (col && !restoringFocus.current && !e.currentTarget.contains(e.relatedTarget)) {
          clearTimeout(peekT.current);
          setCol(false);
        }
      } : onFocus,
      onBlur: overlay ? (e) => {
        onBlur?.(e);
        if (!pointerInside.current && !e.currentTarget.contains(e.relatedTarget)) peek(false);
      } : onBlur,
      className: ["lk-sidenav", !overlay && "lk-sidenav__surface", className].filter(Boolean).join(" "),
      style: overlay ? { position: "relative", width: collapsedWidth, flexShrink: 0, ...style } : { ...shell, ...style },
      ...rest,
      "data-surface": resolvedSurface,
      children: overlay ? (
        /* The elevation shadow only makes sense where the expanded panel actually covers content,
           so clip it to the inline-end overhang on both surfaces instead of blooming on all sides. */
        /* @__PURE__ */ jsx("div", { className: "lk-sidenav__surface", style: { ...shell, position: "absolute", top: 0, left: 0, height: "100%", zIndex: col ? 1 : 40, boxShadow: col ? "none" : "var(--shadow-lg)", clipPath: col ? void 0 : "inset(0 -120px 0 0)" }, children: panelContent })
      ) : panelContent
    }
  );
}

export {
  SideNav
};
//# sourceMappingURL=chunk-MAO62TDZ.js.map