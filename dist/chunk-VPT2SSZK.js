"use client";
import {
  useDialogFocus
} from "./chunk-43HQYUXE.js";
import {
  ComponentDensityScope,
  useResolvedDensity
} from "./chunk-EEL7ELPX.js";
import {
  IconButton
} from "./chunk-EFNOOM3R.js";
import {
  OverlayPortal
} from "./chunk-Z5XUQZMO.js";
import {
  Icon
} from "./chunk-IKUN5X7H.js";

// components/overlay/Drawer.jsx
import React from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var DRAWER_APPEARANCES = {
  default: {
    surface: "var(--color-semantic-background-elevated-normal)",
    divider: "var(--color-semantic-line-solid-normal)",
    title: "var(--color-semantic-label-normal)",
    body: "var(--color-semantic-label-neutral)",
    closeVariant: "plain"
  },
  brand: {
    surface: "var(--color-semantic-brand-surface)",
    divider: "var(--color-semantic-brand-on-surface-border)",
    title: "var(--color-semantic-brand-on-surface)",
    body: "var(--color-semantic-brand-on-surface-muted)",
    closeVariant: "on-dark"
  }
};
var INERT_VALUE = Number.parseInt(React.version, 10) >= 19 ? true : "true";
var inertWhen = (isInert) => isInert ? INERT_VALUE : void 0;
var useSafeLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
var DRAWER_MOTION_STYLES = `
@media(prefers-reduced-motion:reduce){
  [data-lds-drawer-motion]{transition-duration:0s!important;transition-delay:0s!important}
}`;
function isAvailableReturnTarget(element) {
  if (!element?.isConnected || typeof element.focus !== "function") return false;
  if (element.matches?.(":disabled")) return false;
  if (element.closest?.('[hidden], [inert], [aria-hidden="true"]')) return false;
  const view = element.ownerDocument?.defaultView;
  const computed = view?.getComputedStyle?.(element);
  return computed?.display !== "none" && computed?.visibility !== "hidden";
}
function timeToMilliseconds(value) {
  const trimmed = value.trim();
  if (trimmed.endsWith("ms")) return Number.parseFloat(trimmed) || 0;
  if (trimmed.endsWith("s")) return (Number.parseFloat(trimmed) || 0) * 1e3;
  return 0;
}
function transitionTimeout(element, propertyName) {
  const view = element?.ownerDocument?.defaultView;
  if (!view) return 0;
  const computed = view.getComputedStyle(element);
  const properties = computed.transitionProperty.split(",").map((value) => value.trim());
  const durations = computed.transitionDuration.split(",").map(timeToMilliseconds);
  const delays = computed.transitionDelay.split(",").map(timeToMilliseconds);
  const count = Math.max(properties.length, durations.length, delays.length);
  let timeout = 0;
  for (let index = 0; index < count; index += 1) {
    const property = properties[index % properties.length];
    if (property !== propertyName && property !== "all") continue;
    timeout = Math.max(
      timeout,
      durations[index % durations.length] + delays[index % delays.length]
    );
  }
  return timeout;
}
function Drawer({
  open = false,
  side = "right",
  width = 380,
  appearance = "default",
  density = "comfortable",
  title,
  subtitle,
  children,
  footer,
  onClose,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = "\uC11C\uB78D \uD328\uB110",
  closeLabel = "\uB2EB\uAE30",
  closeButtonVariant,
  withinPortal = true,
  portalTarget,
  zIndex,
  bodyStyle,
  style,
  onTransitionEnd,
  ...rest
}) {
  const tones = DRAWER_APPEARANCES[appearance] || DRAWER_APPEARANCES.default;
  const [present, setPresent] = React.useState(open);
  const mounted = open || present;
  const [shown, setShown] = React.useState(false);
  const openRef = React.useRef(open);
  openRef.current = open;
  const titleId = React.useId();
  const subtitleId = React.useId();
  const portalRef = React.useRef(null);
  const portalAnchorRef = React.useRef(null);
  if (open && !portalAnchorRef.current && typeof document !== "undefined") {
    portalAnchorRef.current = returnFocusRef?.current ?? document.activeElement;
  }
  const { dialogRef, zIndex: resolvedZIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex
  });
  const wasOpenRef = React.useRef(false);
  useSafeLayoutEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = open;
    if (open || !wasOpen || !restoreFocus) return;
    const ownerDocument = dialogRef.current?.ownerDocument ?? document;
    const activeElement = ownerDocument.activeElement;
    const focusWasExplicitlyMoved = activeElement && activeElement !== ownerDocument.body && !dialogRef.current?.contains(activeElement);
    const returnTarget = returnFocusRef?.current ?? portalAnchorRef.current;
    if (!focusWasExplicitlyMoved && isAvailableReturnTarget(returnTarget)) {
      returnTarget.focus({ preventScroll: true });
    }
  }, [open, restoreFocus, returnFocusRef]);
  React.useEffect(() => {
    if (open) {
      if (!present) {
        setPresent(true);
        return void 0;
      }
      const view2 = dialogRef.current?.ownerDocument?.defaultView ?? window;
      const id = view2.requestAnimationFrame(() => setShown(true));
      return () => view2.cancelAnimationFrame(id);
    }
    setShown(false);
    if (!present) return void 0;
    const dialog = dialogRef.current;
    const view = dialog?.ownerDocument?.defaultView ?? window;
    const duration = transitionTimeout(dialog, "transform");
    if (duration <= 0) {
      setPresent(false);
      return void 0;
    }
    const timeout = view.setTimeout(() => {
      if (!openRef.current) setPresent(false);
    }, Math.ceil(duration) + 50);
    return () => view.clearTimeout(timeout);
  }, [open, present]);
  React.useEffect(() => {
    if (!open && !present) portalAnchorRef.current = null;
  }, [open, present]);
  if (!mounted) return null;
  const isRight = side === "right";
  const isCompact = density === "compact";
  const resolvedDensity = isCompact ? "compact" : "comfortable";
  const resolvedCloseButtonVariant = closeButtonVariant || tones.closeVariant;
  const hidden = isRight ? "translateX(100%)" : "translateX(-100%)";
  const handleTransitionEnd = (event) => {
    onTransitionEnd?.(event);
    if (!openRef.current && event.target === event.currentTarget && event.propertyName === "transform") {
      setPresent(false);
    }
  };
  return /* @__PURE__ */ jsx(OverlayPortal, { open: mounted, withinPortal, portalTarget, anchorRef: portalAnchorRef, portalRef, layer: "modal", children: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: DRAWER_MOTION_STYLES }),
    /* @__PURE__ */ jsx(
      "div",
      {
        role: "presentation",
        "data-lds-drawer-motion": "",
        onClick: (e) => {
          if (e.target === e.currentTarget && open && closeOnScrim && onClose) onClose();
        },
        style: { position: "fixed", inset: 0, zIndex: resolvedZIndex, background: "var(--component-dialog-scrim)", backdropFilter: "blur(var(--component-dialog-scrim-blur))", opacity: shown ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)" },
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            ref: dialogRef,
            role: "dialog",
            "aria-labelledby": title != null ? titleId : void 0,
            "aria-describedby": subtitle != null ? subtitleId : void 0,
            "aria-label": title == null ? ariaLabel : void 0,
            tabIndex: -1,
            onTransitionEnd: handleTransitionEnd,
            style: { position: "absolute", top: 0, bottom: 0, [isRight ? "right" : "left"]: 0, width, maxWidth: "92vw", display: "flex", flexDirection: "column", background: tones.surface, boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : hidden, transition: "transform var(--dur-slow) var(--ease-out)", ...style },
            ...rest,
            "data-lds-drawer-motion": "",
            "aria-modal": open ? "true" : void 0,
            "aria-hidden": open ? void 0 : true,
            inert: inertWhen(!open),
            "data-density": resolvedDensity,
            children: [
              (title != null || subtitle != null || onClose) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: isCompact ? "var(--component-drawer-header-padding-compact, var(--space-4) var(--space-5))" : "var(--component-drawer-header-padding-comfortable, var(--space-5) var(--space-6))", borderBottom: `1px solid ${tones.divider}` }, children: [
                /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0, display: "grid", gap: "var(--space-1)" }, children: [
                  title != null && /* @__PURE__ */ jsx("div", { id: titleId, style: { fontSize: "var(--headline1-size)", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: tones.title, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: title }),
                  subtitle != null && /* @__PURE__ */ jsx("div", { id: subtitleId, style: { color: tones.body, fontSize: "var(--label1-size)", lineHeight: "var(--label1-reading-line)", overflowWrap: "anywhere" }, children: subtitle })
                ] }),
                onClose && /* @__PURE__ */ jsx(
                  IconButton,
                  {
                    size: "sm",
                    variant: resolvedCloseButtonVariant,
                    label: closeLabel,
                    onClick: open ? onClose : void 0,
                    style: { "--viewer-foreground": tones.title },
                    children: /* @__PURE__ */ jsx(Icon, { name: "close", size: 20, "aria-hidden": "true" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "lk-scroll-surface", "data-scrollbar": "auto", "data-scroll-gutter": "stable", style: { flex: 1, padding: isCompact ? "var(--component-drawer-body-padding-compact, var(--space-4) var(--space-5))" : "var(--component-drawer-body-padding-comfortable, var(--space-5) var(--space-6))", overflow: "auto", scrollbarGutter: "stable", fontSize: isCompact ? "var(--label1-size)" : "var(--body2-size)", lineHeight: isCompact ? "var(--label1-line)" : 1.7, letterSpacing: isCompact ? "var(--label1-spacing)" : void 0, color: tones.body, wordBreak: "keep-all", ...bodyStyle }, children: /* @__PURE__ */ jsx(ComponentDensityScope, { density: resolvedDensity, children }) }),
              footer != null && /* @__PURE__ */ jsx("div", { style: { padding: isCompact ? "var(--component-drawer-footer-padding-compact, var(--space-3) var(--space-5))" : "var(--component-drawer-footer-padding-comfortable, var(--space-4) var(--space-6))", borderTop: `1px solid ${tones.divider}`, display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }, children: footer })
            ]
          }
        )
      }
    )
  ] }) });
}
function DrawerSection({
  title,
  description,
  headingLevel = 3,
  actions,
  divider = false,
  children,
  headerStyle,
  contentStyle,
  style,
  ...rest
}) {
  const density = useResolvedDensity(void 0, "comfortable");
  const compact = density === "compact";
  const titleId = React.useId();
  const Heading = `h${headingLevel}`;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      ...rest,
      "aria-labelledby": titleId,
      "data-density": density,
      style: {
        minWidth: 0,
        borderTop: divider ? "1px solid var(--color-semantic-line-solid-alternative)" : void 0,
        paddingTop: divider ? compact ? "var(--space-4)" : "var(--space-6)" : void 0,
        ...style
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)", marginBottom: compact ? "var(--space-2)" : "var(--space-3)", ...headerStyle }, children: [
          /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ jsx(Heading, { id: titleId, style: { margin: 0, fontSize: "var(--body2-size)", lineHeight: "var(--body2-line)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--color-semantic-label-strong)", wordBreak: "keep-all" }, children: title }),
            description != null && /* @__PURE__ */ jsx("div", { style: { marginTop: "var(--space-1)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", color: "var(--color-semantic-label-alternative)", wordBreak: "keep-all" }, children: description })
          ] }),
          actions != null && /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0 }, children: actions })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { minWidth: 0, ...contentStyle }, children })
      ]
    }
  );
}

export {
  Drawer,
  DrawerSection
};
//# sourceMappingURL=chunk-VPT2SSZK.js.map