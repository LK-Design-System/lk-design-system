"use client";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/navigation/Footer.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_CONTACT = [
  { label: "\uB300\uD45C\uC804\uD654", value: "02-3159-2865" },
  { label: "\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638", value: "391-81-03300" }
];
var DEFAULT_LOCATIONS = [
  { label: "\uBCF8\uC0AC", value: "\uB300\uC804\uAD11\uC5ED\uC2DC \uC720\uC131\uAD6C \uD14C\uD06C\uB1783\uB85C 65, \uD55C\uC2E0\uC5D0\uC2A4\uBA54\uCE74 633\uD638" },
  { label: "R&D \uC13C\uD130", value: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uB9C8\uD3EC\uAD6C \uBC31\uBC94\uB85C31\uAE38 21, \uC11C\uC6B8\uCC3D\uC5C5\uD5C8\uBE0C \uBCC4\uAD00 306\uD638" },
  { label: "\uACF5\uC7A5", value: "\uACBD\uAE30\uB3C4 \uACE0\uC591\uC2DC \uB355\uC591\uAD6C \uAF43\uB9C8\uC744\uB85C 38, DMC \uC2A4\uD0C0\uBE44\uC988 7st \uD574\uB9C1\uD134\uD0C0\uC6CC 613\uD638" }
];
var DEFAULT_COPYRIGHT = "Copyright \u24D2 2024 - 2026 LK ROBOTICS Inc. All rights reserved.";
var plainList = { listStyle: "none", margin: 0, padding: 0 };
var linkColumnGap = 11;
function BackToTopButton() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: toTop,
      "aria-label": "\uB9E8 \uC704\uB85C",
      style: {
        position: "fixed",
        right: 28,
        bottom: 28,
        zIndex: 60,
        width: 50,
        height: 50,
        borderRadius: "var(--radius-pill)",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-normal)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow-md)",
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(8px)",
        pointerEvents: show ? "auto" : "none",
        transition: "opacity 180ms var(--ease-out), transform 180ms var(--ease-out)"
      },
      children: /* @__PURE__ */ jsx(Icon, { name: "chevron-up", size: 22, "aria-hidden": "true" })
    }
  );
}
function Footer({
  contact = DEFAULT_CONTACT,
  locations = DEFAULT_LOCATIONS,
  copyright = DEFAULT_COPYRIGHT,
  brand,
  columns = [],
  links = [],
  compact = false,
  backToTop = false,
  maxWidth = 1280,
  style,
  ...rest
}) {
  const [hov, setHov] = React.useState(null);
  const linkEl = (key, l, base, hover, size, weight) => {
    const typography = { fontFamily: "var(--font-sans)", fontSize: size, fontWeight: weight || "var(--fw-medium)", lineHeight: 1.5, letterSpacing: 0, whiteSpace: "nowrap", wordBreak: "keep-all" };
    if (l.href == null) {
      return /* @__PURE__ */ jsx("span", { style: { ...typography, color: base }, children: l.label }, key);
    }
    return /* @__PURE__ */ jsx(
      "a",
      {
        href: l.href,
        onMouseEnter: () => setHov(key),
        onMouseLeave: () => setHov(null),
        style: { ...typography, textDecoration: "none", color: hov === key ? hover : base, transition: "color 160ms ease" },
        children: l.label
      },
      key
    );
  };
  if (compact) {
    return /* @__PURE__ */ jsxs("footer", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px 24px", flexWrap: "wrap", padding: "14px 2px", borderTop: "1px solid var(--color-semantic-line-normal-normal)", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
      /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--caption1-size)", letterSpacing: 0, color: "var(--color-semantic-label-alternative)" }, children: copyright }),
      links.length > 0 && /* @__PURE__ */ jsx("ul", { style: { ...plainList, display: "flex", alignItems: "center", gap: "var(--space-4-5)" }, children: links.map((l, i) => /* @__PURE__ */ jsx("li", { style: { display: "inline-flex" }, children: linkEl("c" + i, l, "var(--color-semantic-label-alternative)", "var(--color-semantic-label-normal)", "var(--caption1-size)") }, i)) })
    ] });
  }
  const entryRow = (items) => /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px 14px" }, children: items.map((it, i) => /* @__PURE__ */ jsxs("span", { style: { whiteSpace: "nowrap" }, children: [
    /* @__PURE__ */ jsx("span", { style: { color: "var(--color-semantic-inverse-label-neutral-soft)", fontWeight: 700 }, children: it.label }),
    " ",
    it.value
  ] }, i)) });
  return /* @__PURE__ */ jsxs("footer", { style: { background: "var(--color-semantic-inverse-background)", padding: "32px 0 40px", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    backToTop && /* @__PURE__ */ jsx(BackToTopButton, {}),
    /* @__PURE__ */ jsxs("div", { style: { maxWidth, margin: "0 auto", padding: "0 32px", boxSizing: "border-box" }, children: [
      (brand != null || columns.length > 0) && /* @__PURE__ */ jsxs(React.Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "32px 48px", paddingTop: 20 }, children: [
          brand != null && /* @__PURE__ */ jsx("div", { style: { flex: "1 1 240px", minWidth: 220 }, children: brand }),
          columns.map((col, ci) => /* @__PURE__ */ jsxs("nav", { "aria-label": typeof col.heading === "string" ? col.heading : void 0, style: { display: "flex", flexDirection: "column", gap: linkColumnGap, minWidth: 108 }, children: [
            col.heading != null && /* @__PURE__ */ jsx("span", { role: "heading", "aria-level": 3, style: { fontSize: "var(--body2-size)", fontWeight: 800, letterSpacing: 0, lineHeight: 1.5, color: "var(--color-semantic-inverse-label)", marginBottom: "var(--space-0-5)", wordBreak: "keep-all" }, children: col.heading }),
            (col.links || []).length > 0 && /* @__PURE__ */ jsx("ul", { style: { ...plainList, display: "flex", flexDirection: "column", gap: linkColumnGap }, children: (col.links || []).map((l, li) => /* @__PURE__ */ jsx("li", { style: { display: "flex" }, children: linkEl(ci + "-" + li, l, "var(--color-semantic-inverse-label-alternative-soft)", "var(--color-semantic-inverse-label-strong-soft)", "var(--label2-size)") }, li)) })
          ] }, ci))
        ] }),
        /* @__PURE__ */ jsx("div", { style: { height: 1, background: "var(--color-semantic-inverse-line-normal)", margin: "32px 0 24px" } })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, fontSize: "var(--label2-size)", lineHeight: 1.6, color: "var(--color-semantic-inverse-label-neutral-soft)", wordBreak: "keep-all" }, children: [
        contact.length > 0 && entryRow(contact),
        locations.length > 0 && entryRow(locations),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: "var(--space-4-5)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 20px", color: "var(--color-semantic-inverse-label-alternative-soft)" }, children: [
          copyright,
          links.length > 0 && /* @__PURE__ */ jsx("ul", { style: { ...plainList, display: "flex", alignItems: "center", gap: 16 }, children: links.map((l, i) => /* @__PURE__ */ jsx("li", { style: { display: "inline-flex" }, children: linkEl("p" + i, l, "var(--color-semantic-inverse-label-alternative-soft)", "var(--color-semantic-inverse-label-strong-soft)", "var(--caption1-size)") }, i)) })
        ] })
      ] })
    ] })
  ] });
}

export {
  Footer
};
//# sourceMappingURL=chunk-ORQVCDJ3.js.map