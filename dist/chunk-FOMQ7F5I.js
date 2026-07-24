"use client";
import {
  Icon
} from "./chunk-JNVDI5OO.js";

// components/data/Carousel.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var hiddenStyle = { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 };
function useStyleRule(id, css) {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
function navBtnStyle(side) {
  return { position: "absolute", top: "50%", [side]: 12, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "var(--scrim-dark)", color: "var(--color-semantic-static-white)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", zIndex: 2 };
}
var rotationBtnStyle = { position: "absolute", left: "var(--space-3)", bottom: "var(--space-2)", width: 32, height: 32, borderRadius: "50%", border: "none", background: "var(--scrim-dark)", color: "var(--color-semantic-static-white)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", zIndex: 2 };
var dotBtnStyle = { width: 24, height: 24, padding: 0, border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" };
function Carousel({
  slides = [],
  label = "\uCE90\uB7EC\uC140",
  slideLabels,
  showDots = true,
  showArrows = true,
  autoPlay = false,
  interval = 5e3,
  previousLabel = "\uC774\uC804 \uC2AC\uB77C\uC774\uB4DC",
  nextLabel = "\uB2E4\uC74C \uC2AC\uB77C\uC774\uB4DC",
  playLabel = "\uC790\uB3D9 \uC7AC\uC0DD \uC2DC\uC791",
  pauseLabel = "\uC790\uB3D9 \uC7AC\uC0DD \uC77C\uC2DC\uC815\uC9C0",
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}) {
  useStyleRule(
    "lk-carousel-motion",
    "@media (prefers-reduced-motion: reduce){[data-lds-carousel-track],[data-lds-carousel-dot]{transition:none!important}}"
  );
  const n = slides.length;
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoPlay);
  const [held, setHeld] = React.useState(false);
  const rotating = playing && !held && n > 1;
  React.useEffect(() => {
    setPlaying(autoPlay);
  }, [autoPlay]);
  React.useEffect(() => {
    setI((previous) => n > 0 ? Math.min(previous, n - 1) : 0);
  }, [n]);
  React.useEffect(() => {
    if (!rotating) return void 0;
    const period = Number(interval) > 0 ? Number(interval) : 5e3;
    const timer = setInterval(() => setI((previous) => (previous + 1) % n), period);
    return () => clearInterval(timer);
  }, [rotating, interval, n]);
  const slideName = (index) => {
    const own = slideLabels?.[index];
    const position = `${index + 1} / ${n}`;
    return own ? `${own}, ${position}` : position;
  };
  const goTo = (index) => {
    setPlaying(false);
    setI((index % n + n) % n);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": label,
      onMouseEnter: (event) => {
        onMouseEnter?.(event);
        setHeld(true);
      },
      onMouseLeave: (event) => {
        onMouseLeave?.(event);
        setHeld(false);
      },
      onFocus: (event) => {
        onFocus?.(event);
        setHeld(true);
      },
      onBlur: (event) => {
        onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      },
      style: { position: "relative", overflow: "hidden", borderRadius: "var(--radius-2xl)", ...style },
      ...rest,
      children: [
        /* @__PURE__ */ jsx("span", { "data-carousel-live": true, "aria-live": rotating ? "off" : "polite", "aria-atomic": "true", style: hiddenStyle, children: n > 0 ? slideName(i) : "" }),
        autoPlay && n > 1 && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "data-carousel-rotation": playing ? "playing" : "paused",
            "aria-label": playing ? pauseLabel : playLabel,
            onClick: () => setPlaying((previous) => !previous),
            style: rotationBtnStyle,
            children: /* @__PURE__ */ jsx(Icon, { name: playing ? "pause" : "play", size: 16, "aria-hidden": "true" })
          }
        ),
        /* @__PURE__ */ jsx("div", { "data-lds-carousel-track": true, style: { display: "flex", transform: `translateX(-${i * 100}%)`, transition: "transform var(--dur-slow) var(--ease-out)" }, children: slides.map((slide, idx) => {
          const current = idx === i;
          return /* @__PURE__ */ jsx(
            "div",
            {
              role: "group",
              "aria-roledescription": "slide",
              "aria-label": slideName(idx),
              "aria-hidden": current ? void 0 : true,
              inert: current ? void 0 : true,
              "data-carousel-slide": current ? "current" : "offscreen",
              style: { flex: "0 0 100%", minWidth: "100%" },
              children: slide
            },
            idx
          );
        }) }),
        showArrows && n > 1 && /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsx("button", { type: "button", "aria-label": previousLabel, onClick: () => goTo(i - 1), style: navBtnStyle("left"), children: /* @__PURE__ */ jsx(Icon, { name: "chevron-left", size: 20, "aria-hidden": "true" }) }),
          /* @__PURE__ */ jsx("button", { type: "button", "aria-label": nextLabel, onClick: () => goTo(i + 1), style: navBtnStyle("right"), children: /* @__PURE__ */ jsx(Icon, { name: "chevron-right", size: 20, "aria-hidden": "true" }) })
        ] }),
        showDots && n > 1 && /* @__PURE__ */ jsx("div", { style: { position: "absolute", bottom: "var(--space-2)", left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 2 }, children: slides.map((_, idx) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            "aria-label": slideName(idx),
            "aria-current": idx === i ? "true" : void 0,
            onClick: () => goTo(idx),
            style: dotBtnStyle,
            children: /* @__PURE__ */ jsx(
              "span",
              {
                "data-lds-carousel-dot": true,
                style: { width: idx === i ? 22 : 8, height: 8, borderRadius: "var(--radius-pill)", background: idx === i ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-inverse-label-alternative-soft)", boxShadow: "0 0 0 1px var(--scrim-dark)", transition: "width var(--dur-base) var(--ease-out)" }
              }
            )
          },
          idx
        )) })
      ]
    }
  );
}

export {
  Carousel
};
//# sourceMappingURL=chunk-FOMQ7F5I.js.map