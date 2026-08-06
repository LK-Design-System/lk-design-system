"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";

// components/navigation/FloorSelector.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var APPEARANCE = {
  light: {
    // 채움만으로는 흰 배경에서 1.1:1이라 컨트롤 경계가 사라지고 라벨만 떠 보인다.
    // 헤어라인이 세그먼트 컨트롤이라는 그룹 어피던스를 만든다.
    panel: "var(--color-semantic-fill-normal)",
    panelBorder: "var(--border-thin) solid var(--color-semantic-line-normal-normal)",
    idle: "var(--color-semantic-label-neutral)"
  },
  dark: {
    panel: "var(--component-viewer-surface-elevated)",
    panelBorder: "var(--border-thin) solid var(--component-viewer-border)",
    idle: "var(--component-viewer-muted)"
  }
};
var SIZE = {
  md: { item: 44, gap: 2, pad: 4, font: "var(--label1-size)" },
  sm: { item: 28, gap: 2, pad: 3, font: "var(--caption1-size)" }
};
function FloorSelector({ floors = [], value, defaultValue, onChange, appearance = "light", size = "sm", style, ...rest }) {
  const skin = _nullishCoalesce(APPEARANCE[appearance], () => ( APPEARANCE.light));
  const dim = _nullishCoalesce(SIZE[size], () => ( SIZE.md));
  const controlled = value !== void 0;
  const norm = floors.map((f) => typeof f === "string" ? { value: f, label: f } : f);
  const [internal, setInternal] = _react2.default.useState(defaultValue != null ? defaultValue : norm[0] && norm[0].value);
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
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: "radiogroup", "aria-label": "\uCE35 \uC120\uD0DD", "data-floor-selector-size": size, onKeyDown: handleKeyDown, style: {
    display: "inline-flex",
    flexDirection: "column",
    gap: dim.gap,
    padding: dim.pad,
    background: skin.panel,
    border: skin.panelBorder,
    borderRadius: "var(--radius-md)",
    boxShadow: "none",
    fontFamily: "var(--font-sans)",
    ...style
  }, ...rest, children: norm.map((f, index) => {
    const on = f.value === cur;
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "button",
      {
        type: "button",
        role: "radio",
        "aria-checked": on,
        "data-value": f.value,
        tabIndex: index === tabStopIndex ? 0 : -1,
        onClick: () => pick(f.value),
        style: {
          minWidth: dim.item,
          height: dim.item,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: "var(--radius-8)",
          cursor: "pointer",
          fontFamily: "inherit",
          fontSize: dim.font,
          fontWeight: on ? "var(--fw-semibold)" : "var(--fw-medium)",
          background: on ? "var(--color-semantic-primary-normal)" : "transparent",
          color: on ? "var(--color-semantic-static-white)" : skin.idle,
          transition: "background var(--dur-fast) var(--ease-out)"
        },
        children: f.label
      },
      f.value
    );
  }) });
}



exports.FloorSelector = FloorSelector;
//# sourceMappingURL=chunk-LDLWTTTR.cjs.map