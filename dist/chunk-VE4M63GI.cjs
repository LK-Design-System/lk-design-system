"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/selection/IconPicker.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var sizeMap = {
  sm: { tile: 36, iconBox: 18, radius: "var(--radius-sm)" },
  md: { tile: 44, iconBox: 20, radius: "var(--radius-md)" },
  lg: { tile: 52, iconBox: 24, radius: "var(--radius-lg)" }
};
function optionLabel(option) {
  return option.label || option.value;
}
function normalizeIndex(index, total) {
  return (index % total + total) % total;
}
function findEnabledFrom(options, startIndex, direction = 1) {
  if (options.length === 0) return -1;
  let index = normalizeIndex(startIndex, options.length);
  for (let pass = 0; pass < options.length; pass += 1) {
    if (!_optionalChain([options, 'access', _ => _[index], 'optionalAccess', _2 => _2.disabled])) return index;
    index = normalizeIndex(index + direction, options.length);
  }
  return -1;
}
function lastEnabledIndex(options) {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!_optionalChain([options, 'access', _3 => _3[index], 'optionalAccess', _4 => _4.disabled])) return index;
  }
  return -1;
}
function IconPicker({
  options = [],
  value,
  defaultValue,
  onChange,
  columns = 6,
  size = "md",
  label = "\uC544\uC774\uCF58 \uC120\uD0DD",
  disabled = false,
  emptyLabel = "\uC120\uD0DD\uD560 \uC544\uC774\uCF58\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  style,
  ...rest
}) {
  const normalizedSize = sizeMap[size] ? size : "md";
  const { tile, iconBox, radius } = sizeMap[normalizedSize];
  const columnCount = Math.max(1, Number.isFinite(columns) ? Math.trunc(columns) : 6);
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const current = isControlled ? value : internal;
  const optionRefs = _react2.default.useRef([]);
  const selectedIndex = options.findIndex((option) => option.value === current);
  const selectedEnabledIndex = selectedIndex >= 0 && !_optionalChain([options, 'access', _5 => _5[selectedIndex], 'optionalAccess', _6 => _6.disabled]) ? selectedIndex : -1;
  const firstEnabledIndex = findEnabledFrom(options, 0);
  const tabStopIndex = selectedEnabledIndex >= 0 ? selectedEnabledIndex : firstEnabledIndex;
  const [focusIndex, setFocusIndex] = _react2.default.useState(tabStopIndex);
  const [focusedIndex, setFocusedIndex] = _react2.default.useState(-1);
  const [hoveredIndex, setHoveredIndex] = _react2.default.useState(-1);
  const rovingIndex = focusIndex >= 0 && !_optionalChain([options, 'access', _7 => _7[focusIndex], 'optionalAccess', _8 => _8.disabled]) ? focusIndex : tabStopIndex;
  _react2.default.useEffect(() => {
    setFocusIndex(tabStopIndex);
  }, [tabStopIndex]);
  const pick = (option) => {
    if (disabled || !option || option.disabled) return;
    if (!isControlled) setInternal(option.value);
    if (onChange) onChange(option.value);
  };
  const focusAndPick = (index) => {
    const option = options[index];
    if (!option || option.disabled) return;
    setFocusIndex(index);
    pick(option);
    window.requestAnimationFrame(() => _optionalChain([optionRefs, 'access', _9 => _9.current, 'access', _10 => _10[index], 'optionalAccess', _11 => _11.focus, 'call', _12 => _12()]));
  };
  const rowNeighbourIndex = (index, direction) => {
    for (let candidate = index + direction * columnCount; candidate >= 0 && candidate < options.length; candidate += direction * columnCount) {
      if (!_optionalChain([options, 'access', _13 => _13[candidate], 'optionalAccess', _14 => _14.disabled])) return candidate;
    }
    return -1;
  };
  const handleKeyDown = (event, index) => {
    if (disabled || _optionalChain([options, 'access', _15 => _15[index], 'optionalAccess', _16 => _16.disabled])) return;
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      focusAndPick(findEnabledFrom(options, index + direction, direction));
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      focusAndPick(rowNeighbourIndex(index, event.key === "ArrowDown" ? 1 : -1));
      return;
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusAndPick(firstEnabledIndex);
      return;
    }
    if (event.key === "End") {
      event.preventDefault();
      focusAndPick(lastEnabledIndex(options));
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      role: "radiogroup",
      "aria-label": label,
      "aria-disabled": disabled ? "true" : void 0,
      style: {
        display: "grid",
        gridTemplateColumns: options.length > 0 ? `repeat(${columnCount}, ${tile}px)` : `minmax(${tile * 3}px, 1fr)`,
        gap: "var(--space-2)",
        width: "fit-content",
        maxWidth: "100%",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: options.length === 0 ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        "div",
        {
          style: {
            minHeight: tile,
            display: "grid",
            placeItems: "center",
            padding: "0 var(--space-3)",
            border: "1px solid var(--color-semantic-line-normal-normal)",
            borderRadius: radius,
            background: "var(--color-semantic-fill-normal)",
            /* 빈 상태 문구는 장식이 아니라 유일한 정보이므로 assistive(1.7:1)가
               아니라 본문 대비를 만족하는 토큰을 쓴다 (WCAG 1.4.3). */
            color: "var(--color-semantic-label-alternative)",
            fontSize: "var(--caption1-size)",
            lineHeight: "var(--caption1-line)",
            fontWeight: "var(--fw-medium)",
            letterSpacing: 0,
            boxSizing: "border-box"
          },
          children: emptyLabel
        }
      ) : options.map((option, index) => {
        const selected = option.value === current;
        const optionDisabled = disabled || !!option.disabled;
        const labelText = optionLabel(option);
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "button",
          {
            ref: (node) => {
              optionRefs.current[index] = node;
            },
            type: "button",
            role: "radio",
            "aria-checked": selected,
            "aria-label": labelText,
            title: labelText,
            disabled: optionDisabled,
            tabIndex: optionDisabled ? -1 : index === rovingIndex ? 0 : -1,
            "data-selected": selected ? "" : void 0,
            onClick: () => pick(option),
            onFocus: () => {
              if (!optionDisabled) {
                setFocusIndex(index);
                setFocusedIndex(index);
              }
            },
            onBlur: () => setFocusedIndex(-1),
            onMouseEnter: () => {
              if (!optionDisabled) setHoveredIndex(index);
            },
            onMouseLeave: () => setHoveredIndex(-1),
            onKeyDown: (event) => handleKeyDown(event, index),
            style: {
              width: tile,
              height: tile,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              border: `1px solid ${selected && !optionDisabled ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-line-normal-normal)"}`,
              borderRadius: radius,
              background: optionDisabled ? "var(--color-semantic-fill-normal)" : selected ? "var(--color-semantic-primary-surface-strong)" : hoveredIndex === index ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)",
              color: optionDisabled ? "var(--color-semantic-label-disable)" : selected ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-neutral)",
              cursor: optionDisabled ? "not-allowed" : "pointer",
              outline: "none",
              boxShadow: focusedIndex === index && !optionDisabled ? "0 0 0 4px var(--color-semantic-focus-ring)" : "none",
              fontFamily: "var(--font-sans)",
              boxSizing: "border-box",
              transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
              "span",
              {
                "aria-hidden": "true",
                style: {
                  width: iconBox,
                  height: iconBox,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: option.icon
              }
            )
          },
          option.value
        );
      })
    }
  );
}



exports.IconPicker = IconPicker;
//# sourceMappingURL=chunk-VE4M63GI.cjs.map