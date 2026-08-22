"use client";
import {
  useDialogFocus
} from "./chunk-43HQYUXE.js";
import {
  Icon
} from "./chunk-S26PXDE3.js";

// components/overlay/Lightbox.jsx
import React from "react";
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
  style,
  ...rest
}) {
  const [i, setI] = React.useState(index);
  const closeFocusRef = React.useRef(null);
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef: initialFocusRef ?? closeFocusRef,
    returnFocusRef,
    restoreFocus
  });
  React.useEffect(() => {
    setI(index);
  }, [index]);
  const go = React.useCallback((d) => {
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
  return /* @__PURE__ */ jsx(LightboxStage, { url, alt: hasExplicitAlt ? src.alt : position, position, count, go, onClose, closeLabel, previousLabel, nextLabel, closeFocusRef, dialogRef, zIndex, ariaLabel, style, rest }, "stage");
}
function LightboxStage({ url, alt, position, count, go, onClose, closeLabel, previousLabel, nextLabel, closeFocusRef, dialogRef, zIndex, ariaLabel, style, rest }) {
  const [loaded, setLoaded] = React.useState(false);
  const imgRef = React.useRef(null);
  React.useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [url]);
  const multiple = count > 1;
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
      /* @__PURE__ */ jsx("img", { ref: imgRef, src: url, alt, onLoad: () => setLoaded(true), style: { display: "block", maxWidth: "86vw", maxHeight: "86vh", borderRadius: "var(--radius-lg)", boxShadow: loaded ? "var(--shadow-xl)" : "none", opacity: loaded ? 1 : 0, transition: "opacity .18s ease" } }),
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
//# sourceMappingURL=chunk-Q4QSZZRW.js.map