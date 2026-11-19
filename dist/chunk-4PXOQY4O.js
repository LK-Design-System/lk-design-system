"use client";
import {
  insertOverlayEntry,
  isDescendantOverlayPortal,
  useOverlayInteraction,
  useOverlayLayerRegistration,
  useOverlayRuntime
} from "./chunk-EAOCCS6A.js";
import {
  Icon
} from "./chunk-2ABKRX7D.js";

// components/overlay/Lightbox.jsx
import React2 from "react";

// packages/core/dist/chunk-USIK4IAF.js
import React from "react";
var FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"])',
  'area[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'summary:not([tabindex="-1"])',
  'iframe:not([tabindex="-1"])',
  'audio[controls]:not([tabindex="-1"])',
  'video[controls]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])'
].join(", ");
var overlayStack = [];
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
var scrollLockDepth = 0;
var releaseScrollLock = null;
function lockBodyScroll(ownerDocument) {
  scrollLockDepth += 1;
  if (scrollLockDepth > 1) return;
  const view = ownerDocument.defaultView ?? window;
  const body = ownerDocument.body;
  if (!body || !view) return;
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;
  const scrollbarWidth = view.innerWidth - ownerDocument.documentElement.clientWidth;
  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    const currentPadding = Number.parseFloat(view.getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
  }
  releaseScrollLock = () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  };
}
function unlockBodyScroll() {
  if (scrollLockDepth === 0) return;
  scrollLockDepth -= 1;
  if (scrollLockDepth > 0) return;
  releaseScrollLock?.();
  releaseScrollLock = null;
}
function isAvailable(element) {
  if (!element?.isConnected || typeof element.focus !== "function") return false;
  if (element.matches?.(":disabled")) return false;
  if (element.closest?.('[hidden], [inert], [aria-hidden="true"]')) return false;
  const view = element.ownerDocument?.defaultView;
  const style = view?.getComputedStyle?.(element);
  return style?.display !== "none" && style?.visibility !== "hidden";
}
function getFocusableElements(dialog) {
  return Array.from(dialog?.querySelectorAll(FOCUSABLE_SELECTOR) ?? []).filter((element) => element.tabIndex >= 0 && isAvailable(element));
}
function focusDialogStart(dialog, initialFocusRef) {
  if (!dialog) return;
  const requested = initialFocusRef?.current;
  const target = requested && dialog.contains(requested) && isAvailable(requested) ? requested : getFocusableElements(dialog)[0] ?? dialog;
  target.focus({ preventScroll: true });
}
function isTopOverlay(entry) {
  return overlayStack.at(-1) === entry;
}
var inertLocks = /* @__PURE__ */ new WeakMap();
function inertBackground(portalNode) {
  const container = portalNode?.parentElement;
  if (!container) return () => {
  };
  const siblings = Array.from(container.children).filter((element) => element !== portalNode && !isDescendantOverlayPortal(element, portalNode));
  siblings.forEach((element) => {
    const existing = inertLocks.get(element);
    if (existing) existing.depth += 1;
    else inertLocks.set(element, { depth: 1, inert: element.hasAttribute("inert") });
    element.setAttribute("inert", "");
  });
  return () => siblings.forEach((element) => {
    const existing = inertLocks.get(element);
    if (!existing || --existing.depth > 0) return;
    inertLocks.delete(element);
    if (!element.isConnected) return;
    if (existing.inert) element.setAttribute("inert", "");
    else element.removeAttribute("inert");
  });
}
function useDialogFocus({
  open,
  onDismiss,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  lockScroll = true,
  inert = true,
  portalRef,
  zIndex
}) {
  open = useOverlayInteraction(open);
  const dialogRef = React.useRef(null);
  const { zIndexBase } = useOverlayRuntime();
  const { zIndex: resolvedZIndex, isTopmost, ancestorOwners } = useOverlayLayerRegistration({ open, zIndex, zIndexBase, ownerRef: portalRef });
  const optionsRef = React.useRef(null);
  optionsRef.current = {
    onDismiss,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    lockScroll,
    inert,
    portalRef
  };
  useSafeLayoutEffect(() => {
    if (!open) return void 0;
    const dialog = dialogRef.current;
    const ownerDocument = dialog?.ownerDocument ?? document;
    const view = ownerDocument.defaultView ?? window;
    const previouslyFocused = ownerDocument.activeElement;
    const entry = { dialogRef, ancestorOwners };
    insertOverlayEntry(overlayStack, entry, portalRef);
    const scrollLocked = optionsRef.current.lockScroll;
    if (scrollLocked) lockBodyScroll(ownerDocument);
    const restoreBackground = optionsRef.current.inert ? inertBackground(optionsRef.current.portalRef?.current) : () => {
    };
    const focusFrame = view.requestAnimationFrame(() => {
      const activeElement = ownerDocument.activeElement;
      const needsInitialFocus = activeElement === ownerDocument.body || !isAvailable(activeElement);
      if (isTopmost() || isTopOverlay(entry) && needsInitialFocus) {
        focusDialogStart(dialogRef.current, optionsRef.current.initialFocusRef);
      }
    });
    const onKeyDown = (event) => {
      if (!isTopmost() || event.defaultPrevented) return;
      if (event.key === "Escape") {
        if (optionsRef.current.onDismiss) {
          event.preventDefault();
          optionsRef.current.onDismiss();
        }
        return;
      }
      if (event.key !== "Tab") return;
      const currentDialog = dialogRef.current;
      const focusables = getFocusableElements(currentDialog);
      if (focusables.length === 0) {
        event.preventDefault();
        currentDialog?.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables.at(-1);
      const activeElement = ownerDocument.activeElement;
      const activeIndex = focusables.indexOf(activeElement);
      if (event.shiftKey && (activeElement === first || activeIndex === -1)) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (activeElement === last || activeIndex === -1)) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };
    const onFocusIn = (event) => {
      const currentDialog = dialogRef.current;
      if (isTopmost() && currentDialog && !currentDialog.contains(event.target)) {
        focusDialogStart(currentDialog, optionsRef.current.initialFocusRef);
      }
    };
    ownerDocument.addEventListener("keydown", onKeyDown);
    ownerDocument.addEventListener("focusin", onFocusIn);
    return () => {
      view.cancelAnimationFrame(focusFrame);
      ownerDocument.removeEventListener("keydown", onKeyDown);
      ownerDocument.removeEventListener("focusin", onFocusIn);
      if (scrollLocked) unlockBodyScroll();
      restoreBackground();
      const wasTopOverlay = isTopOverlay(entry);
      const entryIndex = overlayStack.indexOf(entry);
      if (entryIndex >= 0) overlayStack.splice(entryIndex, 1);
      if (!wasTopOverlay) return;
      const nextOverlay = overlayStack.at(-1);
      const requestedReturn = optionsRef.current.returnFocusRef?.current;
      const returnTarget = isAvailable(requestedReturn) ? requestedReturn : previouslyFocused;
      if (nextOverlay && isAvailable(returnTarget) && nextOverlay.dialogRef.current?.contains(returnTarget)) {
        returnTarget.focus({ preventScroll: true });
      } else if (nextOverlay) {
        focusDialogStart(nextOverlay.dialogRef.current, null);
      } else if (optionsRef.current.restoreFocus && isAvailable(returnTarget)) {
        returnTarget.focus({ preventScroll: true });
      }
    };
  }, [open]);
  return { dialogRef, zIndex: resolvedZIndex };
}

// components/overlay/Lightbox.jsx
import { jsx, jsxs } from "react/jsx-runtime";
var SR_ONLY_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
  border: 0
};
function lbArrow(side, blocked) {
  return { position: "absolute", [side]: 12, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "none", background: "var(--material-control-dimmer)", color: "var(--color-semantic-inverse-label)", cursor: blocked ? "default" : "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" };
}
function defaultPositionLabel(position, total) {
  return `\uC774\uBBF8\uC9C0 ${position} / ${total}`;
}
function Lightbox({
  open = false,
  images = [],
  index = 0,
  onClose,
  onIndexChange,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uC774\uBBF8\uC9C0 \uBDF0\uC5B4",
  closeLabel = "\uB2EB\uAE30",
  previousLabel = "\uC774\uC804 \uC774\uBBF8\uC9C0",
  nextLabel = "\uB2E4\uC74C \uC774\uBBF8\uC9C0",
  positionLabel = defaultPositionLabel,
  imageSizing = "natural",
  style,
  ...rest
}) {
  const [i, setI] = React2.useState(index);
  const closeFocusRef = React2.useRef(null);
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef: initialFocusRef ?? closeFocusRef,
    returnFocusRef,
    restoreFocus
  });
  React2.useEffect(() => {
    setI(index);
  }, [index]);
  const go = React2.useCallback((d) => {
    setI((prev) => {
      const n = (prev + d + images.length) % images.length;
      onIndexChange && onIndexChange(n);
      return n;
    });
  }, [images.length, onIndexChange]);
  if (!open) return null;
  const src = images[i];
  const url = typeof src === "string" ? src : src && src.src;
  const count = images.length;
  const position = count > 0 ? String(positionLabel(i + 1, count)) : "";
  const hasExplicitAlt = src != null && typeof src === "object" && typeof src.alt === "string";
  return /* @__PURE__ */ jsx(LightboxStage, { url, alt: hasExplicitAlt ? src.alt : position, position, count, go, onClose, closeLabel, previousLabel, nextLabel, closeFocusRef, dialogRef, zIndex, ariaLabel, imageSizing, style, rest }, "stage");
}
function LightboxStage({ url, alt, position, count, go, onClose, closeLabel, previousLabel, nextLabel, closeFocusRef, dialogRef, zIndex, ariaLabel, imageSizing, style, rest }) {
  const [loaded, setLoaded] = React2.useState(false);
  const [measurement, setMeasurement] = React2.useState(null);
  const imgRef = React2.useRef(null);
  const decoded = (image) => {
    if (image.naturalWidth > 0 && image.naturalHeight > 0) {
      setMeasurement({ url, ratio: image.naturalWidth / image.naturalHeight });
      setLoaded(true);
    }
  };
  React2.useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) decoded(el);
  }, [url]);
  const multiple = count > 1;
  const fittedRatio = measurement?.url === url ? measurement.ratio : null;
  const step = (delta) => {
    if (loaded && multiple) go(delta);
  };
  const onKeyDown = (event) => {
    if (event.defaultPrevented || !multiple) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  };
  const describedAlt = typeof alt === "string" ? alt.trim() : "";
  const announcement = describedAlt && describedAlt !== position ? `${position}, ${describedAlt}` : position;
  return /* @__PURE__ */ jsxs("div", { ref: dialogRef, role: "dialog", "aria-modal": "true", "aria-label": ariaLabel, "aria-busy": loaded ? void 0 : "true", tabIndex: -1, onClick: (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  }, style: { position: "fixed", inset: 0, zIndex, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", ...style }, ...rest, onKeyDown: (event) => {
    rest?.onKeyDown?.(event);
    onKeyDown(event);
  }, children: [
    /* @__PURE__ */ jsx("button", { ref: closeFocusRef, type: "button", "aria-label": closeLabel, onClick: onClose, style: { position: "absolute", top: 20, right: 20, width: 44, height: 44, borderRadius: "50%", border: "none", background: "var(--color-semantic-inverse-fill-normal)", color: "var(--color-semantic-inverse-label)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 22, "aria-hidden": "true" }) }),
    /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: loaded ? 0 : 280, minHeight: loaded ? 0 : 200 }, children: [
      /* @__PURE__ */ jsx("img", { ref: imgRef, src: url, alt, onLoad: (event) => decoded(event.currentTarget), style: { display: "block", width: imageSizing === "contain" && fittedRatio != null ? `min(86vw, calc(86vh * ${fittedRatio}))` : void 0, height: imageSizing === "contain" ? "auto" : void 0, maxWidth: "86vw", maxHeight: "86vh", borderRadius: "var(--radius-lg)", boxShadow: loaded ? "var(--shadow-xl)" : "none", opacity: loaded ? 1 : 0, transition: "opacity .18s ease" } }),
      !loaded && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", display: "inline-flex" }, children: /* @__PURE__ */ jsx("svg", { width: "34", height: "34", viewBox: "0 0 24 24", fill: "none", stroke: "var(--color-semantic-inverse-icon-muted)", strokeWidth: "2.4", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 1 0 10 10", children: /* @__PURE__ */ jsx("animateTransform", { attributeName: "transform", type: "rotate", from: "0 12 12", to: "360 12 12", dur: "0.8s", repeatCount: "indefinite" }) }) }) }),
      multiple && /* @__PURE__ */ jsx("button", { type: "button", "data-lightbox-previous": true, "aria-label": previousLabel, "aria-disabled": loaded ? void 0 : "true", onClick: () => step(-1), style: lbArrow("left", !loaded), children: /* @__PURE__ */ jsx(Icon, { name: "chevron-left", size: 26, "aria-hidden": "true" }) }),
      multiple && /* @__PURE__ */ jsx("button", { type: "button", "data-lightbox-next": true, "aria-label": nextLabel, "aria-disabled": loaded ? void 0 : "true", onClick: () => step(1), style: lbArrow("right", !loaded), children: /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 26, "aria-hidden": "true" }) })
    ] }),
    multiple && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", "data-lightbox-position": true, style: { position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", padding: "4px 12px", borderRadius: "var(--radius-pill)", background: "var(--material-control-dimmer)", color: "var(--color-semantic-inverse-label)", fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)" }, children: position }),
    /* @__PURE__ */ jsx("div", { "data-lightbox-live": true, role: "status", "aria-live": "polite", "aria-atomic": "true", style: SR_ONLY_STYLE, children: multiple ? announcement : "" })
  ] });
}

export {
  Lightbox
};
//# sourceMappingURL=chunk-4PXOQY4O.js.map