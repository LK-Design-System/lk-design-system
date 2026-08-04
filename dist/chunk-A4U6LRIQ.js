"use client";
import {
  Radio
} from "./chunk-5NPQXXLW.js";

// components/forms/RadioGroup.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function RadioGroup({ options = [], value, defaultValue, onChange, name, direction = "column", style, ...rest }) {
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const autoId = React.useId();
  const gname = name || autoId;
  return /* @__PURE__ */ jsx("div", { role: "radiogroup", style: { display: "flex", flexDirection: direction === "row" ? "row" : "column", gap: direction === "row" ? 20 : 14, flexWrap: "wrap", ...style }, ...rest, children: norm.map((o) => {
    const on = o.value === val;
    return /* @__PURE__ */ jsx(
      Radio,
      {
        name: gname,
        value: o.value,
        checked: on,
        disabled: o.disabled,
        onChange: () => pick(o.value),
        style: { alignItems: "flex-start" },
        label: /* @__PURE__ */ jsxs("span", { children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-semibold)", letterSpacing: 0, color: "var(--color-semantic-label-normal)" }, children: o.label }),
          o.description != null && /* @__PURE__ */ jsx("span", { style: { display: "block", marginTop: "var(--space-0-5)", fontSize: "var(--label2-size)", color: "var(--color-semantic-label-alternative)" }, children: o.description })
        ] })
      },
      o.value
    );
  }) });
}

export {
  RadioGroup
};
//# sourceMappingURL=chunk-A4U6LRIQ.js.map