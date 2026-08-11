"use client";
import {
  Tooltip
} from "./chunk-TZ2M4GIM.js";
import {
  useLightDismiss
} from "./chunk-ZAPKTAQH.js";
import {
  componentVars,
  partClassName,
  partStyle,
  useMergedRefs
} from "./chunk-A2U7YIGP.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/navigation/SideNav.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var Chevron = ({ open }) => /* @__PURE__ */ jsx(Icon, { "data-sidenav-motion": "chevron", name: "chevron-down-small", size: 14, "aria-hidden": "true", style: { flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" } });
var LIST_ITEM_STYLE = { display: "flex", flexDirection: "column", gap: "var(--space-0-5)", minWidth: 0 };
var SIDE_NAV_APPEARANCES = {
  default: {
    surface: "var(--color-semantic-background-elevated-normal)",
    backgroundImage: void 0,
    divider: "var(--color-semantic-line-solid-normal)",
    foreground: "var(--color-semantic-label-normal)",
    mutedForeground: "var(--color-semantic-label-alternative)",
    subtleForeground: "var(--color-semantic-label-alternative)",
    hoverForeground: "var(--color-semantic-label-alternative)",
    activeForeground: "var(--color-semantic-accent-blue-text)",
    activeProxyForeground: "var(--color-semantic-accent-blue-text)",
    hoverSurface: "var(--color-semantic-fill-normal)",
    activeSurface: "transparent",
    activeHoverSurface: "var(--color-semantic-fill-normal)",
    pressedSurface: "var(--color-semantic-fill-strong)",
    badgeSurface: "var(--color-semantic-primary-surface-strong)",
    badgeForeground: "var(--color-semantic-label-normal)",
    badgeActiveSurface: "var(--color-semantic-primary-normal)",
    badgeActiveForeground: "var(--color-semantic-background-elevated-normal)",
    badgeDot: "var(--color-semantic-primary-normal)",
    focusIndicator: "var(--color-semantic-focus-indicator)"
  },
  brand: {
    surface: "var(--component-side-nav-brand-surface)",
    backgroundImage: void 0,
    divider: "var(--component-side-nav-brand-divider)",
    foreground: "var(--component-side-nav-brand-foreground)",
    mutedForeground: "var(--component-side-nav-brand-muted-foreground)",
    subtleForeground: "var(--component-side-nav-brand-subtle-foreground)",
    hoverForeground: "var(--component-side-nav-brand-hover-foreground)",
    activeForeground: "var(--component-side-nav-brand-active-foreground)",
    activeProxyForeground: "var(--component-side-nav-brand-active-foreground)",
    hoverSurface: "var(--component-side-nav-brand-hover-surface)",
    activeSurface: "transparent",
    activeHoverSurface: "var(--component-side-nav-brand-active-hover-surface)",
    pressedSurface: "var(--component-side-nav-brand-pressed-surface)",
    badgeSurface: "var(--component-side-nav-brand-badge-surface)",
    badgeForeground: "var(--component-side-nav-brand-badge-foreground)",
    badgeActiveSurface: "var(--component-side-nav-brand-badge-active-surface)",
    badgeActiveForeground: "var(--component-side-nav-brand-active-foreground)",
    badgeDot: "var(--component-side-nav-brand-active-foreground)",
    focusIndicator: "var(--component-side-nav-brand-focus-indicator)"
  }
};
function cssLength(value) {
  return typeof value === "number" ? `${value}px` : value;
}
function RailItemTooltip({ label, collapsed, enabled = true, children }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (!enabled || !collapsed) setOpen(false);
  }, [collapsed, enabled]);
  if (!enabled || label == null) return children;
  return /* @__PURE__ */ jsx(Tooltip, { content: label, placement: "right", size: "small", open: collapsed ? open : false, onOpenChange: setOpen, style: { width: "100%" }, children });
}
var SideNav = React.forwardRef(function SideNav2({
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
  appearance = "default",
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsedWidth = 64,
  overlay = false,
  autoExpandActiveGroup = true,
  multiple = true,
  renderLink,
  className,
  style,
  classNames,
  styles,
  vars,
  onBlur,
  onFocus,
  onClick,
  onMouseEnter,
  onMouseLeave,
  "aria-label": ariaLabel = "\uC0AC\uC774\uB4DC \uD0D0\uC0C9",
  ...rest
}, forwardedRef) {
  const resolvedAppearance = appearance === "brand" ? "brand" : "default";
  const appearanceTokens = SIDE_NAV_APPEARANCES[resolvedAppearance];
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
  const previousMotionCollapsedRef = React.useRef(col);
  const [collapseMotionStarted, setCollapseMotionStarted] = React.useState(false);
  React.useLayoutEffect(() => {
    if (previousMotionCollapsedRef.current === col) return;
    previousMotionCollapsedRef.current = col;
    setCollapseMotionStarted(true);
  }, [col]);
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
  const mergedNavRef = useMergedRefs(navRef, forwardedRef);
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
    if (!autoExpandActiveGroup) return {};
    const activeParent = items.find((item) => item && !item.heading && item.children?.some((child) => child.value === val));
    return activeParent ? { [activeParent.value]: true } : {};
  });
  const openGroup = (groupValue) => setOpen((current) => multiple ? { ...current, [groupValue]: true } : { [groupValue]: true });
  const toggleGroup = (groupValue) => setOpen((current) => {
    if (current[groupValue]) return { ...current, [groupValue]: false };
    return multiple ? { ...current, [groupValue]: true } : { [groupValue]: true };
  });
  React.useEffect(() => {
    if (!autoExpandActiveGroup) return;
    const activeParent = items.find((item) => item && !item.heading && item.children?.some((child) => child.value === val));
    if (!activeParent) return;
    setOpen((current) => current[activeParent.value] ? current : multiple ? { ...current, [activeParent.value]: true } : { [activeParent.value]: true });
  }, [autoExpandActiveGroup, items, multiple, val]);
  React.useEffect(() => {
    if (multiple) return;
    setOpen((current) => {
      const opened = Object.keys(current).filter((key) => current[key]);
      if (opened.length <= 1) return current;
      const activeParent = items.find((item) => item && !item.heading && item.children?.some((child) => child.value === val));
      const keep = activeParent && current[activeParent.value] ? activeParent.value : opened[0];
      return keep ? { [keep]: true } : {};
    });
  }, [items, multiple, val]);
  React.useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    const activeElement = document.activeElement;
    const activeChild = navRef.current?.contains(activeElement) ? activeElement?.closest?.("[data-sidenav-parent]") : null;
    const parentValue = activeChild?.dataset.sidenavParent;
    if (!parentValue || !col && open[parentValue]) return;
    const parentControl = Array.from(navRef.current?.querySelectorAll("[data-sidenav-value]") || []).find((candidate) => candidate.dataset.sidenavValue === parentValue && !candidate.dataset.sidenavParent);
    parentControl?.focus();
  }, [col, open]);
  const [hovKey, setHovKey] = React.useState(null);
  const hoverProps = (k) => ({ onMouseEnter: () => setHovKey(k), onMouseLeave: () => setHovKey(null) });
  const row = (active, disabled, extra, hovered) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: col ? 0 : "var(--space-3)",
    // Width may animate between rail and panel, but vertical hit targets stay
    // fixed so pointer/focus positions do not drift during an overlay peek.
    width: "100%",
    minHeight: "var(--lds-side-nav-item-height, 44px)",
    padding: "var(--space-2-5) var(--space-3)",
    boxSizing: "border-box",
    border: "none",
    borderRadius: "var(--lds-side-nav-item-radius, var(--radius-lg))",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    textAlign: "left",
    textDecoration: "none",
    fontFamily: "var(--font-sans)",
    fontSize: "var(--label1-size)",
    lineHeight: "var(--label1-line)",
    // Hover is `fill-normal`, not `fill-alternative`. On the elevated surface a
    // navigation panel actually sits on, `fill-alternative` is a 5% neutral —
    // below the perception floor on a 44px row, so the largest hit targets in the
    // shell read as inert. Persistent selection stays fill-free and uses ink.
    background: active ? hovered && !disabled ? appearanceTokens.activeHoverSurface : appearanceTokens.activeSurface : hovered && !disabled ? appearanceTokens.hoverSurface : "transparent",
    color: active ? appearanceTokens.activeForeground : hovered && !disabled ? appearanceTokens.hoverForeground : appearanceTokens.mutedForeground,
    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), column-gap var(--dur-base) var(--ease-out)",
    ...extra,
    ...partStyle(styles, "item")
  });
  const labelSpan = (active, children) => /* @__PURE__ */ jsx("span", { "data-slot": "label", className: partClassName(classNames, "label") || void 0, style: { flex: 1, minWidth: 0, fontSize: "var(--label1-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...partStyle(styles, "label") }, children });
  const pill = (active, badge) => /* @__PURE__ */ jsx("span", { "data-slot": "badge", className: partClassName(classNames, "badge") || void 0, style: { flexShrink: 0, minWidth: 18, height: 18, padding: "0 6px", boxSizing: "border-box", borderRadius: "var(--radius-pill)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", lineHeight: "18px", textAlign: "center", background: active ? appearanceTokens.badgeActiveSurface : appearanceTokens.badgeSurface, color: active ? appearanceTokens.badgeActiveForeground : appearanceTokens.badgeForeground, ...partStyle(styles, "badge") }, children: badge });
  const expandedContent = (children) => /* @__PURE__ */ jsx(
    "span",
    {
      "data-sidenav-motion": "content",
      "data-state": col ? "hidden" : "visible",
      "aria-hidden": col ? true : void 0,
      style: {
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        flex: "1 1 auto",
        minWidth: 0,
        maxWidth: col ? 0 : "100%",
        overflow: "hidden",
        opacity: col ? 0 : 1,
        transform: col ? "translateX(var(--_lds-side-nav-motion-offset))" : "translateX(0)",
        visibility: col ? "hidden" : "visible",
        pointerEvents: col ? "none" : void 0,
        transition: col ? "max-width var(--dur-base) var(--ease-out), opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), visibility 0s linear var(--dur-fast)" : "max-width var(--dur-base) var(--ease-out), opacity var(--dur-fast) var(--ease-out) calc(var(--dur-fast) / 3), transform var(--dur-fast) var(--ease-out) calc(var(--dur-fast) / 3), visibility 0s linear"
      },
      children
    }
  );
  const badgeDot = () => /* @__PURE__ */ jsx(
    "span",
    {
      "data-slot": "badge",
      "data-sidenav-motion": "badge-dot",
      "data-state": col ? "visible" : "hidden",
      className: partClassName(classNames, "badge") || void 0,
      "aria-hidden": "true",
      style: {
        position: "absolute",
        top: 7,
        right: 7,
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: appearanceTokens.badgeDot,
        opacity: col ? 1 : 0,
        visibility: col ? "visible" : "hidden",
        transition: col ? "opacity var(--dur-fast) var(--ease-out), visibility 0s linear" : "opacity var(--dur-fast) var(--ease-out), visibility 0s linear var(--dur-fast)",
        ...partStyle(styles, "badge")
      }
    }
  );
  const renderLeafControl = (item, { active, parentValue, ariaLabel: ariaLabel2, title, content, itemStyle, hiddenFromInteraction = false }) => {
    const disabled = !!item.disabled;
    const activate = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      pick(item.value);
      if (!parentValue && !multiple) setOpen({});
      item.onClick?.(event);
    };
    const commonProps = {
      "data-slot": "item",
      "data-sidenav-motion": "item",
      "data-sidenav-value": item.value,
      "data-sidenav-parent": parentValue,
      "data-state": active ? "active" : "inactive",
      "data-disabled": disabled ? "true" : void 0,
      "aria-label": ariaLabel2,
      "aria-current": active ? "page" : void 0,
      title,
      tabIndex: hiddenFromInteraction ? -1 : void 0,
      onClick: activate,
      ...hoverProps(item.value),
      className: partClassName(classNames, "item", item.className) || void 0,
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
        tabIndex: disabled || hiddenFromInteraction ? -1 : void 0
      };
      return renderLink ? renderLink(item, linkProps) : /* @__PURE__ */ jsx("a", { ...linkProps });
    }
    return /* @__PURE__ */ jsx("button", { type: "button", disabled, ...commonProps });
  };
  const brand = col ? headerCollapsed != null ? headerCollapsed : header : header;
  const resolvedFooter = typeof footer === "function" ? footer({ collapsed: col, expanded: !col, overlay }) : footer;
  const resolvedSurface = surface === "docked" ? "docked" : "floating";
  const docked = resolvedSurface === "docked";
  const resolvedWidth = cssLength(width);
  const resolvedCollapsedWidth = cssLength(collapsedWidth);
  const shell = { "--_lds-side-nav-pressed-surface": appearanceTokens.pressedSurface, "--_lds-side-nav-focus-indicator": appearanceTokens.focusIndicator, "--_lds-side-nav-motion-offset": "calc(-1 * var(--space-1))", position: "relative", display: "flex", flexDirection: "column", width: col ? `var(--lds-side-nav-collapsed-width, ${resolvedCollapsedWidth})` : `var(--lds-side-nav-width, ${resolvedWidth})`, boxSizing: "border-box", color: resolvedAppearance === "brand" ? appearanceTokens.foreground : void 0, backgroundColor: appearanceTokens.surface, backgroundImage: appearanceTokens.backgroundImage, border: docked ? "none" : `1px solid ${appearanceTokens.divider}`, borderInlineEnd: docked ? `1px solid ${appearanceTokens.divider}` : void 0, borderRadius: docked ? 0 : "var(--lds-side-nav-radius, var(--radius-xl))", boxShadow: docked ? "none" : void 0, padding: "var(--lds-side-nav-padding, var(--space-2-5))", transition: "width var(--dur-base, 200ms) var(--ease-out), box-shadow var(--dur-base, 200ms) var(--ease-out)" };
  const swapAnimation = collapseMotionStarted ? `${col ? "lk-sidenav-compact-content-enter" : "lk-sidenav-expanded-content-enter"} var(--dur-fast) var(--ease-out)` : void 0;
  const sideNavStyles = `
    @keyframes lk-sidenav-expanded-content-enter{from{opacity:0;transform:translateX(var(--_lds-side-nav-motion-offset))}to{opacity:1;transform:translateX(0)}}
    @keyframes lk-sidenav-compact-content-enter{from{opacity:0}to{opacity:1}}
    [data-sidenav-value]:active:not(:disabled){background:var(--_lds-side-nav-pressed-surface)!important}
    [data-sidenav-value]:focus-visible{outline-color:var(--_lds-side-nav-focus-indicator)!important}
    [data-collapsed="true"] .lk-sidenav__scroll::-webkit-scrollbar{display:none}
    .lk-sidenav__surface:dir(rtl){--_lds-side-nav-motion-offset:var(--space-1)}
    @media(prefers-reduced-motion:reduce){.lk-sidenav__surface,.lk-sidenav__surface [data-sidenav-motion]{transition-duration:0s!important;transition-delay:0s!important;animation-duration:0s!important;animation-delay:0s!important}}
  `;
  const brandRegionStyle = { position: "relative", display: "flex", flexDirection: col ? "column" : "row", alignItems: "center", justifyContent: col || brandAlign === "center" ? "center" : "flex-start", gap: "var(--space-1-5)", minHeight: 24, padding: "14px 10px 18px", overflow: "hidden" };
  const panelContent = /* @__PURE__ */ jsxs("div", { id: panelId, "data-slot": "panel", className: partClassName(classNames, "panel", "lk-sidenav__panel-content") || void 0, "data-collapsed": col ? "true" : "false", style: { display: "flex", flexDirection: "column", flex: "1 1 auto", minHeight: 0, ...partStyle(styles, "panel") }, children: [
    /* @__PURE__ */ jsx("style", { children: sideNavStyles }),
    brand != null && /* @__PURE__ */ jsx("div", { "data-slot": "brand", className: partClassName(classNames, "brand", "lk-sidenav__brand") || void 0, style: { ...brandRegionStyle, ...partStyle(styles, "brand") }, children: /* @__PURE__ */ jsx("div", { "data-sidenav-motion": "swap", "data-state": col ? "compact" : "expanded", style: { display: "flex", minWidth: 0, animation: swapAnimation }, children: brand }) }),
    /* @__PURE__ */ jsx("ul", { "data-slot": "list", className: partClassName(classNames, "list", "lk-scroll-surface", "lk-sidenav__scroll") || void 0, "data-scrollbar": "compact", "data-scroll-gutter": col ? "auto" : "stable", "data-scrollbar-exception": "collapsed-navigation-rail", style: { display: "flex", flexDirection: "column", gap: "var(--space-0-5)", flex: "1 1 auto", minHeight: 0, margin: 0, padding: 0, listStyle: "none", overflowX: "hidden", overflowY: "auto", scrollbarWidth: col ? "none" : void 0, ...partStyle(styles, "list") }, children: items.map((o, i) => {
      if (o.heading) return /* @__PURE__ */ jsx("li", { style: LIST_ITEM_STYLE, children: /* @__PURE__ */ jsx("div", { "data-sidenav-motion": "swap", "data-state": col ? "compact" : "expanded", style: { animation: swapAnimation }, children: col ? /* @__PURE__ */ jsx("div", { "data-slot": "heading", className: partClassName(classNames, "heading") || void 0, "aria-hidden": "true", style: { height: 1, flexShrink: 0, background: appearanceTokens.divider, margin: i === 0 ? "2px 12px 6px" : "10px 12px 6px", ...partStyle(styles, "heading") } }) : /* @__PURE__ */ jsx("div", { "data-slot": "heading", className: partClassName(classNames, "heading") || void 0, style: { fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", letterSpacing: "1px", textTransform: "uppercase", color: appearanceTokens.subtleForeground, padding: i === 0 ? "4px 12px 6px" : "14px 12px 6px", ...partStyle(styles, "heading") }, children: o.heading }) }) }, "h" + i);
      const kids = o.children || [];
      const title = typeof o.label === "string" ? o.label : void 0;
      const accessibleLabel = o.ariaLabel || title;
      if (kids.length > 0) {
        const isOpen = !!open[o.value];
        const childActive = kids.some((c) => c.value === val);
        const collapsedActiveProxy = col && childActive;
        const hasChildIcons = kids.some((c) => c.icon != null);
        const childrenExposed = !col && isOpen;
        const onParent = () => {
          if (col) {
            setCol(false);
            openGroup(o.value);
          } else {
            toggleGroup(o.value);
          }
        };
        return /* @__PURE__ */ jsxs("li", { style: LIST_ITEM_STYLE, children: [
          /* @__PURE__ */ jsx(RailItemTooltip, { label: accessibleLabel, collapsed: col, enabled: !overlay, children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              "data-slot": "item",
              "data-sidenav-motion": "item",
              "data-state": childActive ? "active-descendant" : "inactive",
              "data-disabled": o.disabled ? "true" : void 0,
              className: partClassName(classNames, "item", o.className) || void 0,
              "data-sidenav-value": o.value,
              "aria-label": col || o.ariaLabel ? accessibleLabel : void 0,
              "aria-expanded": col ? void 0 : isOpen,
              disabled: o.disabled,
              onClick: onParent,
              title: col ? void 0 : accessibleLabel,
              ...hoverProps(o.value),
              style: row(false, o.disabled, { color: collapsedActiveProxy ? appearanceTokens.activeProxyForeground : childActive ? appearanceTokens.foreground : appearanceTokens.mutedForeground }, hovKey === o.value),
              children: [
                o.icon != null && /* @__PURE__ */ jsx("span", { "data-slot": "icon", className: partClassName(classNames, "icon") || void 0, "aria-hidden": "true", style: { flexShrink: 0, display: "inline-flex", ...partStyle(styles, "icon") }, children: o.icon }),
                expandedContent(
                  /* @__PURE__ */ jsxs(React.Fragment, { children: [
                    labelSpan(childActive, o.label),
                    /* @__PURE__ */ jsx(Chevron, { open: isOpen })
                  ] })
                )
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              "data-sidenav-motion": "children",
              "data-sidenav-group": o.value,
              "data-state": childrenExposed ? "open" : "closed",
              "aria-hidden": childrenExposed ? void 0 : true,
              inert: childrenExposed ? void 0 : true,
              style: {
                display: "grid",
                gridTemplateRows: childrenExposed ? "1fr" : "0fr",
                minWidth: 0,
                opacity: childrenExposed ? 1 : 0,
                transform: childrenExposed ? "translateY(0)" : "translateY(calc(-1 * var(--space-1)))",
                pointerEvents: childrenExposed ? void 0 : "none",
                transition: "grid-template-rows var(--dur-base) var(--ease-out), opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)"
              },
              children: /* @__PURE__ */ jsx("div", { style: { minHeight: 0, overflow: "hidden" }, children: /* @__PURE__ */ jsx("ul", { "data-slot": "childList", className: partClassName(classNames, "childList") || void 0, style: { display: "flex", flexDirection: "column", gap: "var(--space-0-5)", margin: "0 0 4px", padding: 0, paddingInlineStart: "var(--space-3)", boxSizing: "border-box", listStyle: "none", ...partStyle(styles, "childList") }, children: kids.map((c) => {
                const ca = c.value === val;
                const childTitle = typeof c.label === "string" ? c.label : c.ariaLabel;
                return /* @__PURE__ */ jsx("li", { style: LIST_ITEM_STYLE, children: renderLeafControl(c, {
                  active: ca,
                  parentValue: o.value,
                  ariaLabel: c.ariaLabel,
                  title: childTitle,
                  hiddenFromInteraction: !childrenExposed,
                  itemStyle: row(ca, c.disabled, { minHeight: "var(--lds-side-nav-child-item-height, 36px)", padding: hasChildIcons ? "8px 12px 8px 16px" : "8px 12px 8px 42px", gap: hasChildIcons ? "var(--space-2)" : void 0 }, hovKey === c.value),
                  content: /* @__PURE__ */ jsxs(React.Fragment, { children: [
                    hasChildIcons && /* @__PURE__ */ jsx("span", { "data-slot": "icon", className: partClassName(classNames, "icon") || void 0, "data-sidenav-child-icon": true, "aria-hidden": "true", style: { width: "var(--space-4-5)", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", ...partStyle(styles, "icon") }, children: c.icon }),
                    /* @__PURE__ */ jsx("span", { "data-slot": "label", className: partClassName(classNames, "label") || void 0, style: { flex: 1, minWidth: 0, fontSize: "var(--label2-size)", lineHeight: "var(--label2-line)", fontWeight: ca ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...partStyle(styles, "label") }, children: c.label }),
                    c.badge != null && pill(ca, c.badge)
                  ] })
                }) }, c.value);
              }) }) })
            }
          )
        ] }, o.value);
      }
      const active = o.value === val;
      return /* @__PURE__ */ jsx("li", { style: LIST_ITEM_STYLE, children: /* @__PURE__ */ jsx(RailItemTooltip, { label: accessibleLabel, collapsed: col, enabled: !overlay, children: renderLeafControl(o, {
        active,
        ariaLabel: col || o.ariaLabel ? accessibleLabel : void 0,
        title: col ? void 0 : accessibleLabel,
        itemStyle: row(active, o.disabled, null, hovKey === o.value),
        content: /* @__PURE__ */ jsxs(React.Fragment, { children: [
          o.icon != null && /* @__PURE__ */ jsx("span", { "data-slot": "icon", className: partClassName(classNames, "icon") || void 0, "aria-hidden": "true", style: { flexShrink: 0, display: "inline-flex", ...partStyle(styles, "icon") }, children: o.icon }),
          expandedContent(
            /* @__PURE__ */ jsxs(React.Fragment, { children: [
              labelSpan(active, o.label),
              o.badge != null && pill(active, o.badge)
            ] })
          ),
          o.badge != null && badgeDot()
        ] })
      }) }) }, o.value);
    }) }),
    /* @__PURE__ */ jsx("div", { "data-slot": "footer", className: partClassName(classNames, "footer") || void 0, style: { marginTop: "auto", paddingTop: footerGap, ...partStyle(styles, "footer") }, children: resolvedFooter != null && /* @__PURE__ */ jsx("div", { style: { paddingTop: "var(--space-2-5)", marginLeft: "var(--space-0-5)", marginRight: "var(--space-0-5)", borderTop: `1px solid ${appearanceTokens.divider}` }, children: /* @__PURE__ */ jsx("div", { "data-sidenav-motion": "swap", "data-state": col ? "compact" : "expanded", style: { minWidth: 0, animation: swapAnimation }, children: resolvedFooter }) }) })
  ] });
  return /* @__PURE__ */ jsx(
    "nav",
    {
      ref: mergedNavRef,
      ...rest,
      "aria-label": ariaLabel,
      onClick: onClick || overlay && col ? (e) => {
        onClick?.(e);
        if (!e.defaultPrevented && overlay && col && !e.target.closest("[data-sidenav-value], button")) setCol(false);
      } : void 0,
      onMouseEnter: onMouseEnter || overlay ? (e) => {
        onMouseEnter?.(e);
        if (!e.defaultPrevented && overlay) {
          pointerInside.current = true;
          peek(true);
        }
      } : void 0,
      onMouseLeave: onMouseLeave || overlay ? (e) => {
        onMouseLeave?.(e);
        if (!e.defaultPrevented && overlay) {
          pointerInside.current = false;
          peek(false);
        }
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
      "data-slot": "root",
      "data-state": col ? "collapsed" : "expanded",
      "data-overlay": overlay ? "true" : void 0,
      "data-appearance": resolvedAppearance,
      className: partClassName(classNames, "root", "lk-sidenav", !overlay && "lk-sidenav__surface", className) || void 0,
      style: overlay ? { ...componentVars(vars, "--lds-side-nav-"), position: "relative", width: `var(--lds-side-nav-collapsed-width, ${resolvedCollapsedWidth})`, flexShrink: 0, ...partStyle(styles, "root"), ...style } : { ...componentVars(vars, "--lds-side-nav-"), ...shell, ...partStyle(styles, "root"), ...style },
      "data-surface": resolvedSurface,
      children: overlay ? (
        /* The elevation shadow only makes sense where the expanded panel actually covers content,
           so clip it to the inline-end overhang on both surfaces instead of blooming on all sides. */
        /* @__PURE__ */ jsx("div", { "data-slot": "overlaySurface", className: partClassName(classNames, "overlaySurface", "lk-sidenav__surface") || void 0, style: { ...shell, position: "absolute", top: 0, left: 0, height: "100%", zIndex: col ? 1 : 40, boxShadow: col ? "none" : "var(--shadow-lg)", clipPath: col ? void 0 : "inset(0 -120px 0 0)", ...partStyle(styles, "overlaySurface") }, children: panelContent })
      ) : panelContent
    }
  );
});

export {
  SideNav
};
//# sourceMappingURL=chunk-27C6JQHY.js.map