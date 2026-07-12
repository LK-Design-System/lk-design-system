"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/data/Carousel.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function navBtnStyle(side) {
  return { position: "absolute", top: "50%", [side]: 12, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "var(--scrim-dark)", color: "var(--color-semantic-static-white)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", zIndex: 2 };
}
function Carousel({ slides = [], showDots = true, showArrows = true, style, ...rest }) {
  const [i, setI] = React.useState(0);
  const n = slides.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", overflow: "hidden", borderRadius: "var(--radius-2xl)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx("div", { style: { display: "flex", transform: `translateX(-${i * 100}%)`, transition: "transform var(--dur-slow) var(--ease-out)" }, children: slides.map((s, idx) => /* @__PURE__ */ jsx("div", { style: { flex: "0 0 100%", minWidth: "100%" }, children: s }, idx)) }),
    showArrows && n > 1 && /* @__PURE__ */ jsxs(React.Fragment, { children: [
      /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "previous", onClick: () => go(-1), style: navBtnStyle("left"), children: /* @__PURE__ */ jsx(Icon, { name: "chevron-left", size: 20, "aria-hidden": "true" }) }),
      /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "next", onClick: () => go(1), style: navBtnStyle("right"), children: /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 20, "aria-hidden": "true" }) })
    ] }),
    showDots && n > 1 && /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8, zIndex: 2 }, children: slides.map((_, idx) => /* @__PURE__ */ jsx("button", { type: "button", "aria-label": `slide ${idx + 1}`, onClick: () => setI(idx), style: { width: idx === i ? 22 : 8, height: 8, borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer", padding: 0, background: idx === i ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-inverse-label-alternative-soft)", transition: "width var(--dur-base) var(--ease-out)" } }, idx)) })
  ] });
}

export {
  Carousel
};
//# sourceMappingURL=chunk-V2D77FQL.js.map