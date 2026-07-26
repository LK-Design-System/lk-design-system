"use client";

// components/navigation/TopBar.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var TopBarToneContext = React.createContext("light");
var TOP_BAR_STYLES = `
  [data-top-bar-menu-item] {
    background: transparent;
  }
  [data-top-bar-menu-item][aria-current] {
    background: var(--component-topbar-menu-item-selected-bg, var(--color-semantic-fill-alternative));
  }
  [data-top-bar-menu-item]:hover,
  [data-top-bar-menu-item]:focus {
    background: var(--component-topbar-menu-item-hover-bg, var(--color-semantic-fill-normal));
  }
  @media(prefers-reduced-motion:reduce) {
    [data-top-bar-active-indicator],
    [data-top-bar-menu-chevron] {
      transition: none !important;
    }
  }
`;
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
var TOP_BAR_MENU_POINTER_GRACE_MS = 160;
function requestFrame(element, callback) {
  const view = element?.ownerDocument?.defaultView;
  if (typeof view?.requestAnimationFrame === "function") return view.requestAnimationFrame(callback);
  return setTimeout(callback, 0);
}
function isPopoverOpen(element) {
  try {
    return element?.matches(":popover-open") ?? false;
  } catch {
    return false;
  }
}
function useTopBarMenuLayer({ open, anchorRef, panelRef }) {
  const [position, setPosition] = React.useState({
    top: 0,
    left: 0,
    maxHeight: null,
    placement: "bottom"
  });
  useSafeLayoutEffect(() => {
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return void 0;
    if (!open) {
      if (isPopoverOpen(panel)) panel.hidePopover?.();
      return void 0;
    }
    if (typeof panel.showPopover === "function" && !isPopoverOpen(panel)) {
      try {
        panel.showPopover();
      } catch {
      }
    }
    const view = anchor.ownerDocument?.defaultView ?? window;
    const viewportPadding = 16;
    const menuGap = 4;
    let frame;
    const update = () => {
      const currentAnchor = anchorRef.current;
      const currentPanel = panelRef.current;
      if (!currentAnchor || !currentPanel) return;
      const anchorRect = currentAnchor.getBoundingClientRect();
      const panelRect = currentPanel.getBoundingClientRect();
      const panelWidth = Math.min(panelRect.width, Math.max(0, view.innerWidth - viewportPadding * 2));
      const roomBelow = view.innerHeight - anchorRect.bottom - menuGap - viewportPadding;
      const roomAbove = anchorRect.top - menuGap - viewportPadding;
      const placement = roomBelow < panelRect.height && roomAbove > roomBelow ? "top" : "bottom";
      const availableHeight = Math.max(0, placement === "top" ? roomAbove : roomBelow);
      const top = placement === "top" ? Math.max(viewportPadding, anchorRect.top - menuGap - Math.min(panelRect.height, availableHeight)) : anchorRect.bottom + menuGap;
      const centeredLeft = anchorRect.left + (anchorRect.width - panelWidth) / 2;
      const maxLeft = Math.max(viewportPadding, view.innerWidth - viewportPadding - panelWidth);
      const left = Math.min(Math.max(viewportPadding, centeredLeft), maxLeft);
      setPosition((previous) => {
        const next = { top, left, maxHeight: availableHeight, placement };
        return previous.top === next.top && previous.left === next.left && previous.maxHeight === next.maxHeight && previous.placement === next.placement ? previous : next;
      });
    };
    const schedule = () => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(update);
    };
    update();
    view.addEventListener("resize", schedule);
    view.addEventListener("scroll", schedule, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(anchor);
    observer?.observe(panel);
    return () => {
      view.cancelAnimationFrame(frame);
      view.removeEventListener("resize", schedule);
      view.removeEventListener("scroll", schedule, true);
      observer?.disconnect();
      if (isPopoverOpen(panel)) panel.hidePopover?.();
    };
  }, [anchorRef, open, panelRef]);
  return position;
}
function TopBar({ brand, children, actions, navigationLabel = "\uC8FC \uD0D0\uC0C9", navAlign = "start", sticky = false, bordered = true, dark = false, height = 64, style, ...rest }) {
  const tone = dark ? "dark" : "light";
  return /* @__PURE__ */ jsxs(
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
        overflow: "visible",
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
        /* @__PURE__ */ jsx("style", { children: TOP_BAR_STYLES }),
        brand != null && /* @__PURE__ */ jsx("div", { "data-top-bar-brand": true, style: { display: "flex", alignItems: "center", flexShrink: 0, minWidth: 0 }, children: brand }),
        children != null ? /* @__PURE__ */ jsx(TopBarToneContext.Provider, { value: tone, children: /* @__PURE__ */ jsx("nav", { "aria-label": navigationLabel, "data-top-bar-nav": true, "data-scrollbar-exception": "single-row-global-navigation", style: { display: "flex", alignItems: "center", alignSelf: "stretch", flex: "1 1 auto", minWidth: 0, overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", justifyContent: navAlign === "center" ? "safe center" : "flex-start" }, children: /* @__PURE__ */ jsx("ul", { style: { display: "flex", alignItems: "center", alignSelf: "stretch", gap: 4, margin: 0, padding: 0, listStyle: "none" }, children: React.Children.map(children, (child) => child == null || typeof child === "boolean" ? child : /* @__PURE__ */ jsx("li", { style: { display: "flex", alignSelf: "stretch", gap: 4, minWidth: 0 }, children: child })) }) }) }) : /* @__PURE__ */ jsx("div", { style: { flex: 1 } }),
        actions != null && /* @__PURE__ */ jsx("div", { "data-top-bar-actions": true, "data-scrollbar-exception": "single-row-global-actions", style: { minWidth: 0, maxWidth: "100%", flex: "0 1 auto", overflowX: "auto", overflowY: "hidden", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }, children: /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2-5)", width: "max-content", minWidth: "100%" }, children: actions }) })
      ]
    }
  );
}
function TopBarNavItem({
  children,
  active = false,
  href,
  menuItems,
  menuTheme = "light",
  menuTriggerLabel,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onKeyDown,
  ...rest
}) {
  const tone = React.useContext(TopBarToneContext);
  const onDark = tone === "dark";
  const [hover, setHover] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [clickOpen, setClickOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const wrapperRef = React.useRef(null);
  const primaryRef = React.useRef(null);
  const menuTriggerRef = React.useRef(null);
  const menuRef = React.useRef(null);
  const menuItemRefs = React.useRef([]);
  const pointerLeaveTimer = React.useRef(null);
  const triggerId = React.useId();
  const menuId = React.useId();
  const hasMenu = !!menuItems?.length;
  const open = hasMenu && !dismissed && (hover || focusWithin || clickOpen);
  const menuPosition = useTopBarMenuLayer({ open, anchorRef: wrapperRef, panelRef: menuRef });
  const activeOrHover = active || hover || focusWithin || clickOpen;
  const PrimaryComp = href ? "a" : "button";
  const clearPointerLeave = () => {
    clearTimeout(pointerLeaveTimer.current);
  };
  const revealFromPointer = () => {
    clearPointerLeave();
    setDismissed(false);
    setHover(true);
  };
  const schedulePointerLeave = () => {
    clearPointerLeave();
    pointerLeaveTimer.current = setTimeout(() => setHover(false), TOP_BAR_MENU_POINTER_GRACE_MS);
  };
  const currentMenuItems = () => menuItemRefs.current.filter((item) => item?.isConnected && menuRef.current?.contains(item));
  const restoreMenuTriggerFocus = () => {
    const target = menuTriggerRef.current || primaryRef.current;
    target?.focus({ preventScroll: true });
  };
  const dismissMenu = ({ restoreFocus = false } = {}) => {
    clearPointerLeave();
    setHover(false);
    setFocusWithin(false);
    setClickOpen(false);
    setDismissed(true);
    if (restoreFocus) {
      requestFrame(wrapperRef.current, restoreMenuTriggerFocus);
    }
  };
  const openMenuAndFocus = (edge = "first") => {
    clearPointerLeave();
    setDismissed(false);
    setClickOpen(true);
    requestFrame(wrapperRef.current, () => {
      const items = currentMenuItems();
      const target = edge === "last" ? items[items.length - 1] : items[0];
      target?.focus({ preventScroll: true });
    });
  };
  React.useEffect(() => () => clearPointerLeave(), []);
  React.useEffect(() => {
    if (!open) return void 0;
    const ownerDocument = wrapperRef.current?.ownerDocument;
    if (!ownerDocument) return void 0;
    const handleOutsidePointer = (event) => {
      if (wrapperRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) return;
      dismissMenu();
    };
    ownerDocument.addEventListener("pointerdown", handleOutsidePointer, true);
    return () => ownerDocument.removeEventListener("pointerdown", handleOutsidePointer, true);
  }, [open]);
  const handleMenuKeyboard = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || !hasMenu) return;
    const items = currentMenuItems();
    const itemIndex = items.indexOf(event.target);
    const onDisclosure = event.target === menuTriggerRef.current || event.target === primaryRef.current;
    if (event.key === "Escape" && open) {
      event.preventDefault();
      dismissMenu({ restoreFocus: true });
      return;
    }
    if (onDisclosure && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      openMenuAndFocus(event.key === "ArrowUp" ? "last" : "first");
      return;
    }
    if (itemIndex < 0) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const offset = event.key === "ArrowDown" ? 1 : -1;
      items[(itemIndex + offset + items.length) % items.length]?.focus({ preventScroll: true });
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      items[event.key === "Home" ? 0 : items.length - 1]?.focus({ preventScroll: true });
    }
  };
  const handlePrimaryClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || !hasMenu || href) return;
    if (clickOpen) dismissMenu({ restoreFocus: true });
    else openMenuAndFocus("first");
  };
  const handleDisclosureClick = () => {
    if (clickOpen) dismissMenu({ restoreFocus: true });
    else openMenuAndFocus("first");
  };
  const resolvedMenuTriggerLabel = menuTriggerLabel || (typeof children === "string" || typeof children === "number" ? `${children} \uD558\uC704 \uBA54\uB274` : "\uD558\uC704 \uBA54\uB274");
  const fg = active ? onDark ? "var(--color-semantic-static-white)" : "var(--color-semantic-primary-normal)" : activeOrHover ? onDark ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-strong)" : onDark ? "var(--color-semantic-inverse-label-neutral-soft)" : "var(--color-semantic-label-alternative)";
  return /* @__PURE__ */ jsxs(
    "span",
    {
      ref: wrapperRef,
      "data-top-bar-nav-item": true,
      style: { position: "relative", display: "inline-flex", alignSelf: "stretch", ...style },
      onMouseEnter: (event) => {
        onMouseEnter?.(event);
        if (!event.defaultPrevented) revealFromPointer();
      },
      onMouseLeave: (event) => {
        onMouseLeave?.(event);
        if (!event.defaultPrevented) schedulePointerLeave();
      },
      onFocus: (event) => {
        onFocus?.(event);
        if (event.defaultPrevented) return;
        if (!event.currentTarget.contains(event.relatedTarget)) setDismissed(false);
        setFocusWithin(true);
      },
      onBlur: (event) => {
        onBlur?.(event);
        if (event.defaultPrevented) return;
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
          setClickOpen(false);
          setDismissed(false);
        }
      },
      onKeyDown: handleMenuKeyboard,
      ...rest,
      children: [
        /* @__PURE__ */ jsxs(
          PrimaryComp,
          {
            ref: (node) => {
              primaryRef.current = node;
              if (!href && hasMenu) menuTriggerRef.current = node;
            },
            id: !href && hasMenu ? triggerId : void 0,
            "data-top-bar-primary": true,
            href,
            type: href ? void 0 : "button",
            "aria-current": active ? "page" : void 0,
            "aria-expanded": !href && hasMenu ? open : void 0,
            "aria-controls": !href && hasMenu ? menuId : void 0,
            onClick: handlePrimaryClick,
            style: {
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "stretch",
              padding: href && hasMenu ? "0 4px 0 14px" : "0 14px",
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
              /* @__PURE__ */ jsx(
                "span",
                {
                  "data-top-bar-active-indicator": true,
                  "aria-hidden": "true",
                  style: {
                    position: "absolute",
                    left: 14,
                    right: href && hasMenu ? 4 : 14,
                    bottom: "calc(50% - var(--body2-size))",
                    height: 2,
                    borderRadius: "2px 2px 0 0",
                    background: onDark ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-primary-normal)",
                    transform: active ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "left center",
                    transition: "transform var(--dur-base) var(--ease-out)"
                  }
                }
              )
            ]
          }
        ),
        href && hasMenu ? /* @__PURE__ */ jsx(
          "button",
          {
            ref: menuTriggerRef,
            id: triggerId,
            "data-top-bar-menu-trigger": true,
            type: "button",
            "aria-label": resolvedMenuTriggerLabel,
            "aria-expanded": open,
            "aria-controls": menuId,
            onClick: handleDisclosureClick,
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "flex-start",
              alignSelf: "stretch",
              width: 28,
              minWidth: 28,
              padding: 0,
              border: "none",
              background: "transparent",
              color: fg,
              cursor: "pointer"
            },
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                "data-top-bar-menu-chevron": true,
                width: "14",
                height: "14",
                viewBox: "0 0 14 14",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                "aria-hidden": "true",
                style: {
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transformOrigin: "center",
                  transition: "transform var(--dur-fast) var(--ease-out)"
                },
                children: /* @__PURE__ */ jsx("path", { d: "m3.5 5.25 3.5 3.5 3.5-3.5" })
              }
            )
          }
        ) : null,
        menuItems?.length ? /* @__PURE__ */ jsx(
          "ul",
          {
            ref: menuRef,
            id: menuId,
            "data-top-bar-menu": true,
            "aria-labelledby": triggerId,
            popover: "manual",
            "data-theme": menuTheme,
            className: `theme-${menuTheme}`,
            style: {
              position: "fixed",
              inset: "auto",
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 60,
              minWidth: "min(var(--component-topbar-menu-min-width, 176px), calc(100vw - var(--space-8)))",
              maxWidth: "min(var(--component-topbar-menu-max-width, 320px), calc(100vw - var(--space-8)))",
              maxHeight: menuPosition.maxHeight ?? void 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--component-topbar-menu-gap, var(--space-1))",
              padding: "var(--component-topbar-menu-padding, var(--space-2))",
              margin: 0,
              listStyle: "none",
              boxSizing: "border-box",
              overflowY: menuPosition.maxHeight != null ? "auto" : void 0,
              background: "var(--color-semantic-background-elevated-normal)",
              border: "1px solid var(--color-semantic-line-normal-normal)",
              borderRadius: "var(--component-topbar-menu-radius, var(--radius-14))",
              boxShadow: "var(--shadow-md)",
              opacity: open ? 1 : 0,
              visibility: open ? "visible" : "hidden",
              pointerEvents: open ? "auto" : "none",
              transform: open ? "translateY(0)" : `translateY(${menuPosition.placement === "top" ? "-4px" : "4px"})`,
              transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), visibility 0s linear"
            },
            onMouseEnter: revealFromPointer,
            onMouseLeave: schedulePointerLeave,
            children: menuItems.map((item, index) => {
              const ItemComp = item.href ? "a" : "button";
              return /* @__PURE__ */ jsx("li", { style: { display: "block" }, children: /* @__PURE__ */ jsx(
                ItemComp,
                {
                  ref: (node) => {
                    menuItemRefs.current[index] = node;
                  },
                  "data-top-bar-menu-item": true,
                  href: item.href,
                  type: item.href ? void 0 : "button",
                  "aria-current": item.current === true ? "page" : item.current || void 0,
                  onClick: (event) => {
                    dismissMenu();
                    item.onClick?.(event);
                  },
                  style: {
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    minHeight: "var(--component-topbar-menu-item-min-height, calc(var(--space-10) + var(--space-1)))",
                    padding: "var(--component-topbar-menu-item-padding-y, calc(var(--space-2) + var(--space-0-5))) var(--component-topbar-menu-item-padding-x, var(--space-3))",
                    boxSizing: "border-box",
                    border: "none",
                    borderRadius: "var(--component-topbar-menu-item-radius, var(--radius-10))",
                    color: "var(--color-semantic-label-normal)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--label1-size)",
                    fontWeight: 600,
                    lineHeight: "var(--label1-line)",
                    textAlign: "left",
                    textDecoration: "none"
                  },
                  children: item.label
                }
              ) }, `${item.href ?? ""}:${index}`);
            })
          }
        ) : null
      ]
    }
  );
}

export {
  TopBar,
  TopBarNavItem
};
//# sourceMappingURL=chunk-7DL735PF.js.map