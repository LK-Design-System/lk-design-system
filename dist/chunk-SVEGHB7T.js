"use client";

// components/navigation/BottomNav.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function BottomNav({ items = [], value, defaultValue, onChange, renderLink, style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : items[0] && items[0].value);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx("nav", { "aria-label": "\uC8FC \uD0D0\uC0C9", style: { display: "flex", alignItems: "stretch", width: "100%", maxWidth: "100%", minWidth: 0, overflow: "hidden", background: "var(--color-semantic-background-elevated-normal)", borderTop: "1px solid var(--color-semantic-line-solid-normal)", ...style }, ...rest, children: items.map((o) => {
    const active = o.value === val;
    const disabled = !!o.disabled;
    const accessibleLabel = o.ariaLabel || (typeof o.label === "string" ? o.label : void 0);
    const content = /* @__PURE__ */ jsxs(React.Fragment, { children: [
      o.icon != null && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { display: "inline-flex", flexShrink: 0 }, children: o.icon }),
      /* @__PURE__ */ jsx("span", { style: { width: "100%", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-sans)", fontSize: "var(--caption2-size)", fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0 }, children: o.label })
    ] });
    const itemStyle = {
      flex: "1 1 0",
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      padding: "9px 4px",
      minHeight: 58,
      boxSizing: "border-box",
      border: "none",
      background: "transparent",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1,
      textDecoration: "none",
      textAlign: "center",
      color: active ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
      transition: "color var(--dur-fast) var(--ease-out)"
    };
    const activate = (event) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      pick(o.value);
      o.onClick?.(event);
    };
    if (o.href != null) {
      const linkProps = {
        href: disabled ? void 0 : o.href,
        target: o.target,
        rel: o.rel,
        "aria-label": o.ariaLabel,
        "aria-current": active ? "page" : void 0,
        "aria-disabled": disabled || void 0,
        tabIndex: disabled ? -1 : void 0,
        title: accessibleLabel,
        onClick: activate,
        style: itemStyle,
        children: content
      };
      return /* @__PURE__ */ jsx(React.Fragment, { children: renderLink ? renderLink(o, linkProps) : /* @__PURE__ */ jsx("a", { ...linkProps }) }, o.value);
    }
    return /* @__PURE__ */ jsx("button", { type: "button", "aria-label": o.ariaLabel, "aria-current": active ? "page" : void 0, disabled, onClick: activate, title: accessibleLabel, style: itemStyle, children: content }, o.value);
  }) });
}

export {
  BottomNav
};
//# sourceMappingURL=chunk-SVEGHB7T.js.map