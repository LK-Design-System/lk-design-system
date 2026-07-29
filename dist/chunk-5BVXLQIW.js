"use client";

// components/navigation/FloorSelector.jsx
import React from "react";
import { jsx } from "react/jsx-runtime";
function FloorSelector({ floors = [], value, defaultValue, onChange, style, ...rest }) {
  const controlled = value !== void 0;
  const norm = floors.map((f) => typeof f === "string" ? { value: f, label: f } : f);
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : norm[0] && norm[0].value);
  const cur = controlled ? value : internal;
  const pick = (v) => {
    if (!controlled) setInternal(v);
    onChange && onChange(v);
  };
  const values = norm.map((f) => f.value);
  const selectedIndex = values.indexOf(cur);
  const tabStopIndex = selectedIndex >= 0 ? selectedIndex : 0;
  const focusRadio = (container, index) => {
    const radios = container.querySelectorAll('[role="radio"]');
    const target = radios[index];
    if (!target) return;
    pick(target.getAttribute("data-value"));
    target.focus();
  };
  const handleKeyDown = (event) => {
    const count = norm.length;
    if (count === 0) return;
    const container = event.currentTarget;
    const radios = Array.from(container.querySelectorAll('[role="radio"]'));
    const currentIndex = radios.indexOf(event.target.closest('[role="radio"]'));
    if (currentIndex < 0) return;
    let next;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (currentIndex + 1) % count;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (currentIndex - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    focusRadio(container, next);
  };
  return /* @__PURE__ */ jsx("div", { role: "radiogroup", "aria-label": "\uCE35 \uC120\uD0DD", onKeyDown: handleKeyDown, style: {
    display: "inline-flex",
    flexDirection: "column",
    gap: 2,
    padding: 2,
    background: "var(--color-semantic-fill-normal)",
    border: 0,
    borderRadius: "var(--radius-10)",
    boxShadow: "none",
    fontFamily: "var(--font-sans)",
    ...style
  }, ...rest, children: norm.map((f, index) => {
    const on = f.value === cur;
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": on,
        "data-value": f.value,
        tabIndex: index === tabStopIndex ? 0 : -1,
        onClick: () => pick(f.value),
        style: {
          minWidth: 44,
          height: 36,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: "var(--radius-8)",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: "var(--label1-size)",
          fontWeight: on ? "var(--fw-semibold)" : "var(--fw-medium)",
          background: on ? "var(--color-semantic-primary-normal)" : "transparent",
          color: on ? "var(--color-semantic-static-white)" : "var(--color-semantic-label-neutral)",
          transition: "background var(--dur-fast) var(--ease-out)"
        },
        children: f.label
      },
      f.value
    );
  }) });
}

export {
  FloorSelector
};
//# sourceMappingURL=chunk-5BVXLQIW.js.map