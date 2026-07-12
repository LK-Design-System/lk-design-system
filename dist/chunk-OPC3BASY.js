"use client";

// components/forms/RangeSlider.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function useRangeStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-rangeslider-css")) return;
    const el = document.createElement("style");
    el.id = "lk-rangeslider-css";
    el.textContent = `
input.lk-rangeslider{position:absolute;top:0;left:0;width:100%;height:24px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;pointer-events:none;}
input.lk-rangeslider::-webkit-slider-runnable-track{background:transparent;height:24px;}
input.lk-rangeslider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;pointer-events:auto;width:20px;height:20px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;margin-top:2px;}
input.lk-rangeslider::-moz-range-track{background:transparent;height:24px;}
input.lk-rangeslider::-moz-range-thumb{pointer-events:auto;width:18px;height:18px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;}`;
    document.head.appendChild(el);
  }, []);
}
function RangeSlider({ value, defaultValue = [20, 80], min = 0, max = 100, step = 1, onChange, showValue = false, style, ...rest }) {
  useRangeStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const [lo, hi] = isControlled ? value : internal;
  const set = (nlo, nhi) => {
    const a = Math.min(nlo, nhi);
    const b = Math.max(nlo, nhi);
    const next = [a, b];
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const pctLo = (lo - min) / (max - min) * 100;
  const pctHi = (hi - min) / (max - min) * 100;
  return /* @__PURE__ */ jsxs("div", { style: { ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs("div", { style: { position: "relative", height: 24 }, children: [
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 9, left: 0, right: 0, height: 6, borderRadius: "var(--radius-pill)", background: "var(--color-semantic-fill-strong)" } }),
      /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: 9, height: 6, borderRadius: "var(--radius-pill)", background: "var(--color-semantic-primary-normal)", left: `${pctLo}%`, right: `${100 - pctHi}%` } }),
      /* @__PURE__ */ jsx("input", { className: "lk-rangeslider", type: "range", min, max, step, value: lo, onChange: (e) => set(Number(e.target.value), hi), "aria-label": "minimum" }),
      /* @__PURE__ */ jsx("input", { className: "lk-rangeslider", type: "range", min, max, step, value: hi, onChange: (e) => set(lo, Number(e.target.value)), "aria-label": "maximum" })
    ] }),
    showValue && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: [
      /* @__PURE__ */ jsx("span", { children: lo }),
      /* @__PURE__ */ jsx("span", { children: hi })
    ] })
  ] });
}

export {
  RangeSlider
};
//# sourceMappingURL=chunk-OPC3BASY.js.map