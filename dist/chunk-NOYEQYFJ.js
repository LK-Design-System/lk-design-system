"use client";
import {
  useMenuKeyboard
} from "./chunk-P42HESKE.js";

// components/internal/useSubmenuBranch.jsx
import React from "react";
import { createPortal } from "react-dom";
import { jsx } from "react/jsx-runtime";
function useSubmenuBranch({ disabled = false } = {}) {
  const [open, setOpen] = React.useState(false);
  const [subPos, setSubPos] = React.useState(null);
  const triggerRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const hoverTimer = React.useRef(null);
  const { menuRef, requestItemFocus, handleMenuKeyDown } = useMenuKeyboard({
    open,
    onClose: () => setOpen(false),
    getTrigger: () => triggerRef.current
  });
  const clearTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  };
  React.useEffect(() => () => clearTimer(), []);
  React.useLayoutEffect(() => {
    if (!open) {
      setSubPos(null);
      return;
    }
    const anchor = triggerRef.current?.getBoundingClientRect();
    const view = triggerRef.current?.ownerDocument?.defaultView;
    if (!anchor || !view) return;
    const parentPanel = triggerRef.current?.closest('[role="menu"]')?.parentElement;
    const parentRect = parentPanel?.getBoundingClientRect() ?? anchor;
    const panelWidth = panelRef.current?.offsetWidth || 200;
    const panelHeight = panelRef.current?.offsetHeight || 0;
    const gap = 4;
    const openLeft = view.innerWidth - parentRect.right < panelWidth + gap + 8 && parentRect.left > panelWidth + gap + 8;
    let top = anchor.top - 6;
    if (panelHeight && top + panelHeight > view.innerHeight - 8) {
      top = Math.max(8, view.innerHeight - 8 - panelHeight);
    }
    setSubPos({ top, left: openLeft ? parentRect.left - panelWidth - gap : parentRect.right + gap });
  }, [open]);
  const openSub = (focusFirst) => {
    if (focusFirst) requestItemFocus("first");
    setOpen(true);
  };
  const closeSub = ({ restoreFocus } = {}) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus({ preventScroll: true });
  };
  const scheduleOpen = () => {
    if (disabled) return;
    clearTimer();
    hoverTimer.current = setTimeout(() => setOpen(true), 120);
  };
  const scheduleClose = () => {
    clearTimer();
    hoverTimer.current = setTimeout(() => setOpen(false), 180);
  };
  const containerHandlers = { onMouseEnter: scheduleOpen, onMouseLeave: scheduleClose };
  const triggerHandlers = {
    onClick: () => {
      if (disabled) return;
      if (open) closeSub();
      else openSub(false);
    },
    onKeyDown: (event) => {
      if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openSub(true);
      }
    }
  };
  const menuKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      closeSub({ restoreFocus: true });
      return;
    }
    handleMenuKeyDown(event);
  };
  const renderPanel = (children, panelStyle) => {
    const target = triggerRef.current?.ownerDocument?.body || (typeof document !== "undefined" ? document.body : null);
    if (!open || !target) return null;
    return createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          ref: panelRef,
          "data-menu-portal": "",
          onMouseEnter: clearTimer,
          onMouseLeave: scheduleClose,
          style: {
            position: "fixed",
            top: subPos?.top ?? -9999,
            left: subPos?.left ?? -9999,
            zIndex: 41,
            width: "max-content",
            minWidth: 200,
            maxWidth: "calc(100vw - var(--space-8))",
            visibility: subPos ? "visible" : "hidden",
            ...panelStyle
          },
          children
        }
      ),
      target
    );
  };
  return { open, triggerRef, menuRef, containerHandlers, triggerHandlers, menuKeyDown, renderPanel };
}

export {
  useSubmenuBranch
};
//# sourceMappingURL=chunk-NOYEQYFJ.js.map