"use client";
import {
  Icon
} from "./chunk-LMQSX5BW.js";

// components/buttons/Link.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function Link({ children, href, tone = "signal", underline = "hover", external = false, style, onMouseEnter, onMouseLeave, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const color = tone === "neutral" ? "var(--color-semantic-label-neutral)" : tone === "inherit" ? "inherit" : "var(--color-semantic-primary-normal)";
  const showUnderline = underline === "always" || underline === "hover" && hover;
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      target: external ? "_blank" : void 0,
      rel: external ? "noopener noreferrer" : void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        color,
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        textDecoration: showUnderline ? "underline" : "none",
        textUnderlineOffset: "2px",
        cursor: "pointer",
        ...style
      },
      ...rest,
      children: [
        children,
        external && /* @__PURE__ */ jsx(Icon, { name: "external-link", size: 13, "aria-hidden": "true" })
      ]
    }
  );
}

export {
  Link
};
//# sourceMappingURL=chunk-GVC6Q4AW.js.map