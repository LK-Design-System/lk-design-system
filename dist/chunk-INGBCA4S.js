"use client";
import {
  useMenuKeyboard
} from "./chunk-XL7GJE5S.js";
import {
  useFloatingPosition
} from "./chunk-FVVTUKMD.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";
import {
  Button
} from "./chunk-7WDUT67E.js";

// components/overlay/DropdownMenu.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
function CheckMark({ variant, checked, disabled }) {
  if (!variant || variant === "normal") return null;
  const activeColor = disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-primary-normal)";
  if (variant === "radio") {
    return /* @__PURE__ */ jsx(
      "span",
      {
        "aria-hidden": "true",
        style: {
          width: 14,
          height: 14,
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
              width: 6,
              height: 6,
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
        width: 14,
        height: 14,
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
function normalizeCellPadding(cellPadding) {
  if (cellPadding === 8 || cellPadding === "8px" || cellPadding === "small")
    return "8px";
  return "12px";
}
function MenuItemButton({
  item,
  variant,
  cellPadding,
  verticalPadding,
  onSelect
}) {
  const [hover, setHover] = React.useState(false);
  const cell = normalizeCellPadding(cellPadding);
  const vertical = normalizeCellPadding(verticalPadding ?? cellPadding);
  const denseCell = cell === "8px";
  const denseVertical = vertical === "8px";
  const disabled = Boolean(item.disabled || item.disable);
  const checked = Boolean(item.checked || item.active);
  const active = checked || Boolean(item.active);
  const description = item.description ?? item.captionContent;
  const minHeight = description ? denseVertical ? 62 : 70 : denseVertical ? 40 : 48;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: variant === "normal" ? "menuitem" : variant === "radio" ? "menuitemradio" : "menuitemcheckbox",
      "aria-checked": variant === "normal" ? void 0 : checked,
      "aria-current": variant === "normal" && active ? true : void 0,
      tabIndex: -1,
      disabled,
      onClick: () => {
        if (disabled) return;
        item.onClick?.();
        onSelect?.(item);
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        width: "100%",
        minHeight,
        display: "flex",
        alignItems: description ? "flex-start" : "center",
        gap: 10,
        padding: `${vertical} ${denseCell ? 8 : 10}px`,
        border: "none",
        background: active || hover && !disabled ? "var(--component-menu-item-hover-bg)" : "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        borderRadius: "var(--radius-md)",
        textAlign: "left",
        fontFamily: "var(--font-sans)",
        fontSize: "var(--body1-size)",
        fontWeight: active ? "var(--fw-medium)" : "var(--fw-regular)",
        letterSpacing: 0,
        color: item.danger ? "var(--color-semantic-status-negative-text)" : disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
        opacity: disabled ? 0.45 : 1
      },
      children: [
        item.icon || /* @__PURE__ */ jsx(CheckMark, { variant, checked, disabled }),
        /* @__PURE__ */ jsxs("span", { style: { display: "grid", gap: 4, minWidth: 0, flex: 1 }, children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              },
              children: item.label
            }
          ),
          description && /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                fontSize: "var(--label2-size)",
                color: "var(--color-semantic-label-alternative)",
                fontWeight: "var(--fw-medium)"
              },
              children: description
            }
          )
        ] }),
        item.shortcut && /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontSize: "var(--caption1-size)",
              color: "var(--color-semantic-label-alternative)",
              flexShrink: 0
            },
            children: item.shortcut
          }
        )
      ]
    }
  );
}
function DropdownMenu({
  trigger,
  items = [],
  align = "left",
  variant = "normal",
  cellPadding = "12px",
  verticalPadding,
  menuActionArea = false,
  action,
  onApply,
  onCancel,
  applyLabel = "\uC801\uC6A9",
  cancelLabel = "\uCDE8\uC18C",
  width = 320,
  maxHeight,
  open,
  defaultOpen = false,
  onOpenChange,
  style,
  ...rest
}) {
  const controlled = open !== void 0;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const ref = React.useRef(null);
  const panelRef = React.useRef(null);
  const actionAreaRef = React.useRef(null);
  const menuId = React.useId();
  const generatedTriggerId = React.useId();
  const triggerId = trigger?.props?.id ?? generatedTriggerId;
  const setVisible = (next) => {
    if (!controlled) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const { menuRef, requestItemFocus, closeMenu, handleMenuKeyDown } = useMenuKeyboard({
    open: visible,
    onClose: () => setVisible(false),
    getTrigger: () => ref.current?.querySelector('[aria-haspopup="menu"], button, [role="button"], a[href]')
  });
  const toggleMenu = (event) => {
    trigger?.props?.onClick?.(event);
    if (event?.defaultPrevented) return;
    if (visible) setVisible(false);
    else {
      requestItemFocus("first");
      setVisible(true);
    }
  };
  const handleTriggerKeyDown = (event) => {
    trigger?.props?.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      requestItemFocus("first");
      setVisible(true);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      requestItemFocus("last");
      setVisible(true);
    }
  };
  const renderedTrigger = React.isValidElement(trigger) && trigger.type !== React.Fragment ? React.cloneElement(trigger, {
    id: triggerId,
    "aria-haspopup": "menu",
    "aria-expanded": visible,
    "aria-controls": visible ? menuId : void 0,
    onClick: toggleMenu,
    onKeyDown: handleTriggerKeyDown
  }) : /* @__PURE__ */ jsx(
    "span",
    {
      id: triggerId,
      role: "button",
      tabIndex: 0,
      "aria-haspopup": "menu",
      "aria-expanded": visible,
      "aria-controls": visible ? menuId : void 0,
      onClick: toggleMenu,
      onKeyDown: handleTriggerKeyDown,
      children: trigger
    }
  );
  const position = useFloatingPosition({
    open: visible,
    anchorRef: ref,
    panelRef,
    placement: "bottom"
  });
  const showGeneratedActionArea = menuActionArea && (onApply || onCancel);
  const showActionArea = Boolean(action || showGeneratedActionArea);
  const panelMaxHeight = constrainedMaxHeight(maxHeight, position.maxHeight);
  const handleMenuRegionKeyDown = (event) => {
    if (event.key === "Tab" && !event.shiftKey) {
      const firstAction = focusableActionControls(actionAreaRef.current)[0];
      if (firstAction) {
        event.preventDefault();
        firstAction.focus({ preventScroll: true });
        return;
      }
    }
    handleMenuKeyDown(event);
  };
  const handleActionAreaKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }
    const controls = focusableActionControls(actionAreaRef.current);
    const currentControl = event.target.closest?.(ACTION_CONTROL_SELECTOR);
    const currentIndex = controls.indexOf(currentControl);
    if (event.key === "ArrowUp" || event.key === "Tab" && event.shiftKey && currentIndex === 0) {
      const lastItem = availableMenuItems(menuRef.current).at(-1);
      if (lastItem) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
      }
      return;
    }
    if (event.key === "Tab" && !event.shiftKey && currentIndex === controls.length - 1) {
      const view = event.currentTarget.ownerDocument.defaultView ?? window;
      view.setTimeout(() => setVisible(false), 0);
    }
  };
  const finishAction = (callback) => {
    callback?.();
    closeMenu({ restoreFocus: true });
  };
  React.useEffect(() => {
    if (!visible) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setVisible(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [visible]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      style: { position: "relative", display: "inline-block", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsx(
          "span",
          {
            style: { display: "inline-flex" },
            children: renderedTrigger
          }
        ),
        visible && /* @__PURE__ */ jsxs(
          "div",
          {
            ref: panelRef,
            "data-placement": position.placement,
            style: {
              position: "absolute",
              top: position.placement === "bottom" ? "calc(100% + 8px)" : "auto",
              bottom: position.placement === "top" ? "calc(100% + 8px)" : "auto",
              left: align === "left" ? 0 : "auto",
              right: align === "right" ? 0 : "auto",
              translate: `${position.shiftX}px ${position.shiftY}px`,
              zIndex: 40,
              width,
              minWidth: 0,
              maxWidth: "calc(100vw - var(--space-8))",
              maxHeight: panelMaxHeight ?? void 0,
              overflow: panelMaxHeight != null ? "hidden" : void 0,
              background: "var(--color-semantic-background-elevated-normal)",
              border: "1px solid var(--color-semantic-line-solid-normal)",
              borderRadius: "var(--component-menu-radius)",
              boxShadow: "var(--shadow-md)",
              padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: 4
            },
            children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  ref: menuRef,
                  id: menuId,
                  role: "menu",
                  "aria-labelledby": triggerId,
                  onKeyDown: handleMenuRegionKeyDown,
                  style: { display: "flex", flexDirection: "column", gap: 4, minHeight: 0, overflowY: panelMaxHeight != null ? "auto" : void 0 },
                  children: items.map(
                    (item, index) => item.divider ? /* @__PURE__ */ jsx(
                      "div",
                      {
                        role: "separator",
                        style: {
                          height: 1,
                          background: "var(--color-semantic-line-solid-normal)",
                          margin: "6px 4px"
                        }
                      },
                      index
                    ) : /* @__PURE__ */ jsx(
                      MenuItemButton,
                      {
                        item,
                        variant: item.variant || variant,
                        cellPadding,
                        verticalPadding,
                        onSelect: () => closeMenu({ restoreFocus: true })
                      },
                      index
                    )
                  )
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
                    flexShrink: 0
                  },
                  children: action || /* @__PURE__ */ jsxs(Fragment, { children: [
                    onCancel && /* @__PURE__ */ jsx(Button, { variant: "outlined", color: "assistive", size: "sm", onClick: () => finishAction(onCancel), children: cancelLabel }),
                    onApply && /* @__PURE__ */ jsx(Button, { size: "sm", onClick: () => finishAction(onApply), children: applyLabel })
                  ] })
                }
              )
            ]
          }
        )
      ]
    }
  );
}

export {
  DropdownMenu
};
//# sourceMappingURL=chunk-INGBCA4S.js.map