"use client";
import {
  useSubmenuBranch
} from "./chunk-DOLKVCRR.js";
import {
  useMenuKeyboard
} from "./chunk-OPIN7X2Q.js";
import {
  Button
} from "./chunk-WQ42MZRF.js";
import {
  useFloatingPosition
} from "./chunk-SFKCQB3X.js";
import {
  Icon
} from "./chunk-DW4HVC6S.js";

// components/navigation/Menubar.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var MENUBAR_PANEL_STYLE = {
  background: "var(--color-semantic-background-elevated-normal)",
  border: "1px solid var(--color-semantic-line-solid-normal)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-md)",
  padding: "var(--space-1-5)",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column"
};
var ACTION_CONTROL_SELECTOR = [
  "button:not(:disabled)",
  "a[href]",
  "input:not(:disabled)",
  "select:not(:disabled)",
  "textarea:not(:disabled)",
  '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])'
].join(",");
var MENU_ITEM_SELECTOR = [
  '[role="menuitem"]',
  '[role="menuitemradio"]',
  '[role="menuitemcheckbox"]'
].join(",");
var MENU_MARK_SIZE = 14;
var MENU_RADIO_DOT_SIZE = 6;
function focusableActionControls(region) {
  return Array.from(region?.querySelectorAll(ACTION_CONTROL_SELECTOR) ?? []);
}
function availableMenuItems(menu) {
  return Array.from(menu?.querySelectorAll(MENU_ITEM_SELECTOR) ?? []).filter(
    (item) => !item.disabled && item.getAttribute("aria-disabled") !== "true"
  );
}
function constrainedMaxHeight(requested, available) {
  if (available == null) return requested;
  if (requested == null) return available;
  if (typeof requested === "number") return Math.min(requested, available);
  return `min(${requested}, ${available}px)`;
}
function MenuItemMark({ variant, checked, disabled }) {
  if (!variant || variant === "normal") return null;
  const activeColor = disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-primary-normal)";
  if (variant === "radio") {
    return /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        style: {
          width: MENU_MARK_SIZE,
          height: MENU_MARK_SIZE,
          borderRadius: "50%",
          border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        },
        children: checked && /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              width: MENU_RADIO_DOT_SIZE,
              height: MENU_RADIO_DOT_SIZE,
              borderRadius: "50%",
              background: activeColor
            }
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      style: {
        width: MENU_MARK_SIZE,
        height: MENU_MARK_SIZE,
        borderRadius: "var(--radius-5)",
        border: `1.5px solid ${checked ? activeColor : "var(--color-semantic-line-solid-normal)"}`,
        background: checked ? activeColor : "transparent",
        color: disabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-inverse-label)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      },
      children: checked && /* @__PURE__ */ jsx(Icon, { name: "check", size: 11, "aria-hidden": "true" })
    }
  );
}
function MenuItem({ item, variant, close, trailing, haspopup, expanded, buttonRef, onTriggerClick, onTriggerKeyDown, activeOverride }) {
  const [hover, setHover] = React.useState(false);
  const checked = Boolean(item.checked);
  const disabled = Boolean(item.disabled || item.disable);
  const isTrigger = Boolean(haspopup);
  const active = hover && !disabled || Boolean(activeOverride);
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref: buttonRef,
      type: "button",
      role: variant === "normal" ? "menuitem" : variant === "radio" ? "menuitemradio" : "menuitemcheckbox",
      "aria-checked": variant === "normal" ? void 0 : checked,
      "aria-haspopup": haspopup,
      "aria-expanded": expanded,
      tabIndex: -1,
      disabled,
      onClick: isTrigger ? onTriggerClick : () => {
        if (disabled) return;
        item.onClick?.();
        close();
      },
      onKeyDown: onTriggerKeyDown,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        width: "100%",
        display: "flex",
        alignItems: item.description ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: 12,
        minHeight: item.description ? 44 : 34,
        padding: "7px 10px",
        border: "none",
        background: active ? "var(--color-semantic-fill-normal)" : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-md)",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label1-size)",
        color: item.danger ? "var(--color-semantic-status-negative-text)" : disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
        opacity: disabled ? 0.45 : 1
      },
      children: [
        /* @__PURE__ */ jsxs(
          "span",
          {
            style: {
              display: "inline-flex",
              alignItems: item.description ? "flex-start" : "center",
              gap: 8,
              minWidth: 0
            },
            children: [
              variant !== "normal" && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", marginTop: item.description ? 2 : 0 }, children: /* @__PURE__ */ jsx(MenuItemMark, { variant, checked, disabled }) }),
              item.icon,
              /* @__PURE__ */ jsxs("span", { style: { display: "grid", gap: "var(--space-0-5)", minWidth: 0 }, children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontWeight: checked ? "var(--fw-bold)" : "var(--fw-medium)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    },
                    children: item.label
                  }
                ),
                item.description && /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--caption1-size)", color: "var(--color-semantic-label-alternative)" }, children: item.description })
              ] })
            ]
          }
        ),
        trailing || (item.shortcut ? /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontSize: "var(--caption1-size)",
              color: "var(--color-semantic-label-assistive)",
              flexShrink: 0
            },
            children: item.shortcut
          }
        ) : null)
      ]
    }
  );
}
var MENUBAR_CHEVRON = /* @__PURE__ */ jsx(Icon, { name: "chevron-right-small", size: 16, "aria-hidden": "true", style: { flexShrink: 0, color: "var(--color-semantic-label-alternative)" } });
function MenubarDrillHeader({ title, onBack }) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "menuitem",
      "data-menubar-drill-back": "",
      tabIndex: -1,
      "aria-label": `\uB4A4\uB85C (${typeof title === "string" ? title : "\uC0C1\uC704 \uBA54\uB274"})`,
      onClick: onBack,
      onKeyDown: (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          onBack();
        }
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "7px 10px",
        marginBottom: 4,
        border: "none",
        borderBottom: "1px solid var(--color-semantic-line-solid-normal)",
        background: "transparent",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--label2-size)",
        fontWeight: "var(--fw-bold)",
        color: "var(--color-semantic-label-neutral)"
      },
      children: [
        /* @__PURE__ */ jsx(Icon, { name: "chevron-left-small", size: 16, "aria-hidden": "true" }),
        /* @__PURE__ */ jsx("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: title })
      ]
    }
  );
}
function MenubarBranch({ item, variant, close }) {
  const disabled = Boolean(item.disabled || item.disable);
  const sub = useSubmenuBranch({ disabled });
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, onMouseEnter: sub.containerHandlers.onMouseEnter, onMouseLeave: sub.containerHandlers.onMouseLeave, children: [
    /* @__PURE__ */ jsx(
      MenuItem,
      {
        item,
        variant,
        close,
        buttonRef: sub.triggerRef,
        haspopup: "menu",
        expanded: sub.open,
        activeOverride: sub.open,
        trailing: MENUBAR_CHEVRON,
        onTriggerClick: sub.triggerHandlers.onClick,
        onTriggerKeyDown: sub.triggerHandlers.onKeyDown
      }
    ),
    sub.renderPanel(
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: sub.menuRef,
          role: "menu",
          "aria-label": typeof item.label === "string" ? item.label : void 0,
          onKeyDown: sub.menuKeyDown,
          style: { minHeight: 0 },
          children: renderMenubarItems(item.items || [], { variant, close })
        }
      ),
      MENUBAR_PANEL_STYLE
    )
  ] });
}
function renderGroupedMenuItems(items, renderItem, resolveVariant) {
  const rendered = [];
  let radioRun = [];
  const flushRadioRun = () => {
    if (!radioRun.length) return;
    rendered.push(
      /* @__PURE__ */ jsx("div", { role: "group", children: radioRun }, `radio-group-${radioRun[0].key}`)
    );
    radioRun = [];
  };
  items.forEach((item, index) => {
    const node = renderItem(item, index);
    if (!item.divider && resolveVariant(item) === "radio") {
      radioRun.push(node);
    } else {
      flushRadioRun();
      rendered.push(node);
    }
  });
  flushRadioRun();
  return rendered;
}
function renderMenubarDrillItems(items, ctx) {
  return renderGroupedMenuItems(
    items,
    (item, index) => {
      if (item.divider) {
        return /* @__PURE__ */ jsx(
          "div",
          {
            role: "separator",
            style: { height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px" }
          },
          index
        );
      }
      if (item.items && item.items.length) {
        return /* @__PURE__ */ jsx(
          MenuItem,
          {
            item,
            variant: item.variant || ctx.variant,
            close: ctx.close,
            haspopup: "menu",
            expanded: false,
            trailing: MENUBAR_CHEVRON,
            onTriggerClick: () => ctx.drillIn(item),
            onTriggerKeyDown: (event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                ctx.drillIn(item);
              }
            }
          },
          index
        );
      }
      return /* @__PURE__ */ jsx(MenuItem, { item, variant: item.variant || ctx.variant, close: ctx.close }, index);
    },
    (item) => item.variant || ctx.variant
  );
}
function renderMenubarItems(items, ctx) {
  return renderGroupedMenuItems(
    items,
    (item, index) => {
      if (item.divider) {
        return /* @__PURE__ */ jsx(
          "div",
          {
            role: "separator",
            style: { height: 1, background: "var(--color-semantic-line-solid-normal)", margin: "6px 4px" }
          },
          index
        );
      }
      if (item.items && item.items.length) {
        return /* @__PURE__ */ jsx(MenubarBranch, { item, variant: item.variant || ctx.variant, close: ctx.close }, index);
      }
      return /* @__PURE__ */ jsx(MenuItem, { item, variant: item.variant || ctx.variant, close: ctx.close }, index);
    },
    (item) => item.variant || ctx.variant
  );
}
function Menubar({
  menus = [],
  variant = "normal",
  submenuMode = "flyout",
  menuActionArea = false,
  onApply,
  onCancel,
  applyLabel = "\uC801\uC6A9",
  cancelLabel = "\uCDE8\uC18C",
  maxHeight,
  ariaLabel = "\uBA85\uB839 \uBA54\uB274",
  style,
  ...rest
}) {
  const drill = submenuMode === "drill";
  const [open, setOpen] = React.useState(-1);
  const [activeTop, setActiveTop] = React.useState(0);
  const [drillPath, setDrillPath] = React.useState([]);
  const ref = React.useRef(null);
  const triggerRefs = React.useRef([]);
  const floatingAnchorRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const actionAreaRef = React.useRef(null);
  const menuIdBase = React.useId();
  React.useEffect(() => {
    setDrillPath([]);
  }, [open]);
  const drillLevel = drillPath.length ? drillPath[drillPath.length - 1] : null;
  const drillIn = (item) => setDrillPath((path) => [...path, item]);
  const drillBack = () => setDrillPath((path) => path.slice(0, -1));
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = useMenuKeyboard({
    open: open >= 0,
    onClose: () => setOpen(-1),
    getTrigger: () => triggerRefs.current[open],
    menuKey: open
  });
  const drillDepthRef = React.useRef(0);
  React.useEffect(() => {
    if (!drill) return void 0;
    if (open < 0) {
      drillDepthRef.current = 0;
      return void 0;
    }
    const previousDepth = drillDepthRef.current;
    drillDepthRef.current = drillPath.length;
    if (previousDepth === drillPath.length) return void 0;
    const view = ref.current?.ownerDocument?.defaultView ?? window;
    const frame = view.requestAnimationFrame(() => {
      const items = availableMenuItems(menuRef.current);
      const target = items.find((item) => !item.hasAttribute("data-menubar-drill-back")) ?? items[0];
      target?.focus({ preventScroll: true });
    });
    return () => view.cancelAnimationFrame(frame);
  }, [drill, open, drillPath, menuRef]);
  const position = useFloatingPosition({
    open: open >= 0,
    anchorRef: floatingAnchorRef,
    panelRef,
    placement: "bottom",
    offset: 6
  });
  React.useEffect(() => {
    if (open < 0) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest?.("[data-menu-portal]")) {
        setOpen(-1);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const focusTop = (index) => {
    if (menus.length === 0) return;
    const nextIndex = (index + menus.length) % menus.length;
    setActiveTop(nextIndex);
    triggerRefs.current[nextIndex]?.focus({ preventScroll: true });
  };
  const openMenu = (index, position2 = "first") => {
    floatingAnchorRef.current = triggerRefs.current[index];
    setActiveTop(index);
    requestItemFocus(position2);
    setOpen(index);
  };
  const handleTopKeyDown = (event, index) => {
    let nextIndex;
    if (event.key === "ArrowRight") nextIndex = index + 1;
    if (event.key === "ArrowLeft") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = menus.length - 1;
    if (nextIndex !== void 0) {
      event.preventDefault();
      const normalized = (nextIndex + menus.length) % menus.length;
      if (open >= 0) openMenu(normalized, "first");
      else focusTop(normalized);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu(index, "first");
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(index, "last");
    } else if (event.key === "Escape" && open >= 0) {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    }
  };
  const handleSubmenuKeyDown = (event) => {
    if (event.defaultPrevented) return;
    if (drill && event.key === "ArrowLeft" && drillPath.length > 0) {
      event.preventDefault();
      drillBack();
      return;
    }
    if (event.key === "Tab" && !event.shiftKey) {
      const actionControl = actionAreaRef.current?.querySelector('button, [href], [tabindex]:not([tabindex="-1"])');
      if (actionControl) {
        event.preventDefault();
        actionControl.focus({ preventScroll: true });
        return;
      }
    }
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (open + direction + menus.length) % menus.length;
      openMenu(nextIndex, "first");
      return;
    }
    handleMenuKeyDown(event);
  };
  const handleActionAreaKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
    } else {
      const controls = focusableActionControls(actionAreaRef.current);
      const currentControl = event.target.closest?.(ACTION_CONTROL_SELECTOR);
      const currentIndex = controls.indexOf(currentControl);
      const returnToMenu = event.key === "ArrowUp" || event.key === "Tab" && event.shiftKey && currentIndex === 0;
      const lastItem = availableMenuItems(menuRef.current).at(-1);
      if (returnToMenu && lastItem) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
        return;
      }
      if (event.key === "Tab" && !event.shiftKey && currentIndex === controls.length - 1) {
        const view = event.currentTarget.ownerDocument.defaultView ?? window;
        view.setTimeout(() => setOpen(-1), 0);
      }
    }
  };
  const finishAction = (callback) => {
    callback?.();
    closeMenu({ restoreFocus: true });
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      role: "menubar",
      "aria-label": ariaLabel,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-0-5)",
        padding: 4,
        background: "var(--color-semantic-background-elevated-normal)",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-md)",
        ...style
      },
      ...rest,
      children: menus.map((menu, index) => {
        const applyAction = menu.onApply ? () => menu.onApply() : onApply ? () => onApply(menu, index) : null;
        const cancelAction = menu.onCancel ? () => menu.onCancel() : onCancel ? () => onCancel(menu, index) : null;
        const actionAreaRequested = menu.menuActionArea || menuActionArea;
        const showActionArea = Boolean(menu.action || actionAreaRequested && (applyAction || cancelAction));
        const panelMaxHeight = constrainedMaxHeight(menu.maxHeight || maxHeight, position.maxHeight);
        return /* @__PURE__ */ jsxs("div", { role: "none", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              ref: (node) => {
                triggerRefs.current[index] = node;
              },
              type: "button",
              role: "menuitem",
              id: `${menuIdBase}-trigger-${index}`,
              "aria-haspopup": "menu",
              "aria-expanded": open === index,
              "aria-controls": open === index ? `${menuIdBase}-${index}` : void 0,
              tabIndex: activeTop === index ? 0 : -1,
              onFocus: () => setActiveTop(index),
              onKeyDown: (event) => handleTopKeyDown(event, index),
              onPointerEnter: () => {
                if (open >= 0 && open !== index) openMenu(index, "first");
              },
              onClick: () => {
                if (open === index) setOpen(-1);
                else openMenu(index, "first");
              },
              style: {
                height: 34,
                padding: "0 12px",
                border: "none",
                borderRadius: "var(--radius-sm)",
                background: open === index ? "var(--color-semantic-fill-normal)" : "transparent",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--label1-size)",
                fontWeight: "var(--fw-semibold)",
                color: "var(--color-semantic-label-normal)"
              },
              children: menu.label
            }
          ),
          open === index && /* @__PURE__ */ jsxs(
            "div",
            {
              ref: panelRef,
              "data-placement": position.placement,
              style: {
                position: "absolute",
                top: position.placement === "bottom" ? "calc(100% + 6px)" : "auto",
                bottom: position.placement === "top" ? "calc(100% + 6px)" : "auto",
                left: 0,
                translate: `${position.shiftX}px ${position.shiftY}px`,
                zIndex: 40,
                width: "max-content",
                minWidth: "min(184px, calc(100vw - var(--space-8)))",
                maxWidth: "calc(100vw - var(--space-8))",
                maxHeight: panelMaxHeight ?? void 0,
                overflow: panelMaxHeight != null ? "hidden" : void 0,
                background: "var(--color-semantic-background-elevated-normal)",
                border: "1px solid var(--color-semantic-line-solid-normal)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                padding: "var(--space-1-5)",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    ref: menuRef,
                    id: `${menuIdBase}-${index}`,
                    role: "menu",
                    "aria-labelledby": `${menuIdBase}-trigger-${index}`,
                    onKeyDown: handleSubmenuKeyDown,
                    style: { minHeight: 0, overflowY: panelMaxHeight != null ? "auto" : void 0 },
                    children: drill ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      drillLevel && /* @__PURE__ */ jsx(MenubarDrillHeader, { title: drillLevel.label, onBack: drillBack }),
                      renderMenubarDrillItems((drillLevel ? drillLevel.items : menu.items) || [], {
                        variant: menu.variant || variant,
                        close: () => closeMenu({ restoreFocus: true }),
                        drillIn
                      })
                    ] }) : renderMenubarItems(menu.items || [], {
                      variant: menu.variant || variant,
                      close: () => closeMenu({ restoreFocus: true })
                    })
                  }
                ),
                showActionArea && /* @__PURE__ */ jsx(
                  "div",
                  {
                    ref: actionAreaRef,
                    role: "group",
                    "aria-label": "\uBA54\uB274 \uC791\uC5C5",
                    onKeyDown: handleActionAreaKeyDown,
                    style: {
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "var(--space-2)",
                      padding: "8px 4px 2px",
                      borderTop: "1px solid var(--color-semantic-line-solid-normal)",
                      marginTop: 4,
                      flexShrink: 0
                    },
                    children: menu.action || /* @__PURE__ */ jsxs(Fragment, { children: [
                      cancelAction && /* @__PURE__ */ jsx(Button, { variant: "outlined", color: "assistive", size: "sm", onClick: () => finishAction(cancelAction), children: menu.cancelLabel ?? cancelLabel }),
                      applyAction && /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => finishAction(applyAction), children: menu.applyLabel ?? applyLabel })
                    ] })
                  }
                )
              ]
            }
          )
        ] }, index);
      })
    }
  );
}

export {
  Menubar
};
//# sourceMappingURL=chunk-R3JIJVMX.js.map