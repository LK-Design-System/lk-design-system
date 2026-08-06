"use client";
import {
  PageIndicator
} from "./chunk-C2SGY23J.js";
import {
  Icon
} from "./chunk-ON44Y65B.js";

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
var controlRailStyle = {
  position: "absolute",
  left: "50%",
  bottom: "var(--space-2)",
  transform: "translateX(-50%)",
  height: 32,
  maxWidth: "calc(100% - var(--space-4))",
  padding: "0 var(--space-2)",
  borderRadius: "var(--radius-pill)",
  background: "var(--scrim-dark)",
  color: "var(--color-semantic-static-white)",
  backdropFilter: "blur(4px)",
  overflow: "visible",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2
};
var rotationBtnStyle = { flex: "0 0 auto", width: 44, height: 44, padding: 0, borderRadius: "50%", border: "none", background: "transparent", color: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" };
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
    "@media (prefers-reduced-motion: reduce){[data-lds-carousel-track]{transition:none!important}}"
  );
  const n = slides.length;
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoPlay);
  const [held, setHeld] = React.useState(false);
  const rotationPointerWasPlaying = React.useRef(false);
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
        setPlaying(false);
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
        (autoPlay || showDots) && n > 1 && /* @__PURE__ */ jsxs(
          "div",
          {
            "data-carousel-controls": true,
            style: controlRailStyle,
            children: [
              autoPlay ? /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "data-carousel-rotation": playing ? "playing" : "paused",
                  "aria-label": playing ? pauseLabel : playLabel,
                  onPointerDown: () => {
                    rotationPointerWasPlaying.current = playing;
                  },
                  onClick: (event) => {
                    const previous = event.detail > 0 ? rotationPointerWasPlaying.current : playing;
                    const next = !previous;
                    setPlaying(next);
                    if (next) setHeld(false);
                  },
                  style: rotationBtnStyle,
                  children: /* @__PURE__ */ jsx(Icon, { name: playing ? "pause" : "play", size: 16, "aria-hidden": "true" })
                }
              ) : null,
              showDots ? /* @__PURE__ */ jsx(
                PageIndicator,
                {
                  variant: "dot",
                  presentation: "media",
                  page: i + 1,
                  count: n,
                  onChange: (page) => goTo(page - 1),
                  getItemLabel: (page) => slideName(page - 1),
                  groupLabel: `${label} \uC2AC\uB77C\uC774\uB4DC \uC120\uD0DD`
                }
              ) : null
            ]
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
        ] })
      ]
    }
  );
}

export {
  Carousel
};
//# sourceMappingURL=chunk-P4BG5MZ4.js.map