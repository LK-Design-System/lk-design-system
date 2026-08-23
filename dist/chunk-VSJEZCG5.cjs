"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunk7OXVB7WXcjs = require('./chunk-7OXVB7WX.cjs');

// components/selection/Stepper.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Stepper({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  largeStep,
  onChange,
  size = "md",
  disabled = false,
  label,
  decrementLabel,
  incrementLabel,
  valueText,
  repeatDelay = 400,
  repeatInterval = 80,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const val = isControlled ? value : internal;
  const valRef = _react2.default.useRef(val);
  valRef.current = val;
  const commit = (next) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped === valRef.current) return;
    valRef.current = clamped;
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };
  const stepBy = (delta) => commit(valRef.current + delta);
  const repeat = _react2.default.useRef({ delay: null, tick: null });
  const stopRepeat = _react2.default.useCallback(() => {
    clearTimeout(repeat.current.delay);
    clearInterval(repeat.current.tick);
    repeat.current.delay = null;
    repeat.current.tick = null;
  }, []);
  _react2.default.useEffect(() => stopRepeat, [stopRepeat]);
  _react2.default.useEffect(() => {
    if (disabled) stopRepeat();
  }, [disabled, stopRepeat]);
  const startRepeat = (delta, isBlocked) => {
    stopRepeat();
    repeat.current.delay = setTimeout(() => {
      repeat.current.tick = setInterval(() => {
        if (isBlocked()) {
          stopRepeat();
          return;
        }
        stepBy(delta);
      }, repeatInterval);
    }, repeatDelay);
  };
  const groupName = _nullishCoalesce(_nullishCoalesce(label, () => ( ariaLabel)), () => ( "\uC218\uB7C9"));
  const nameForButtons = typeof groupName === "string" ? groupName : "\uC218\uB7C9";
  const h = size === "sm" ? 36 : 44;
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);
  const pointerActivated = _react2.default.useRef(false);
  const renderStepBtn = (kind) => {
    const isMinus = kind === "minus";
    const atBound = isMinus ? val <= min : val >= max;
    const off = disabled || atBound;
    const delta = isMinus ? -step : step;
    const blocked = () => isMinus ? valRef.current <= min : valRef.current >= max;
    const activate = () => {
      if (off) return;
      stepBy(delta);
    };
    return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "button",
      {
        type: "button",
        "aria-disabled": off || void 0,
        "aria-label": _nullishCoalesce((isMinus ? decrementLabel : incrementLabel), () => ( `${nameForButtons} ${isMinus ? "\uAC10\uC18C" : "\uC99D\uAC00"}`)),
        onPointerDown: (e) => {
          if (e.button !== 0 || off) return;
          pointerActivated.current = true;
          activate();
          startRepeat(delta, blocked);
        },
        onPointerUp: stopRepeat,
        onPointerLeave: stopRepeat,
        onPointerCancel: () => {
          pointerActivated.current = false;
          stopRepeat();
        },
        onKeyDown: (e) => {
          if (e.key === "Enter" || e.key === " ") pointerActivated.current = false;
        },
        onBlur: stopRepeat,
        onClick: () => {
          if (pointerActivated.current) {
            pointerActivated.current = false;
            return;
          }
          activate();
        },
        onMouseEnter: (e) => {
          if (!off) e.currentTarget.style.background = "var(--color-semantic-fill-normal)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        },
        style: {
          width: h,
          height: h,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          cursor: off ? "not-allowed" : "pointer",
          color: off ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
          borderRadius: "var(--radius-md)",
          transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
        },
        children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk7OXVB7WXcjs.Icon, { name: isMinus ? "minus" : "plus", size: 18, "aria-hidden": "true" })
      },
      kind
    );
  };
  const [valueFocused, setValueFocused] = _react2.default.useState(false);
  const page = _nullishCoalesce(largeStep, () => ( step * 10));
  const handleValueKeyDown = (event) => {
    if (disabled) return;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        stepBy(step);
        break;
      case "ArrowDown":
        event.preventDefault();
        stepBy(-step);
        break;
      case "PageUp":
        event.preventDefault();
        stepBy(page);
        break;
      case "PageDown":
        event.preventDefault();
        stepBy(-page);
        break;
      case "Home":
        if (hasMin) {
          event.preventDefault();
          commit(min);
        }
        break;
      case "End":
        if (hasMax) {
          event.preventDefault();
          commit(max);
        }
        break;
      default:
        break;
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      role: "group",
      "aria-label": typeof groupName === "string" && !ariaLabelledBy ? groupName : void 0,
      "aria-labelledby": ariaLabelledBy,
      "aria-disabled": disabled || void 0,
      style: {
        display: "inline-flex",
        alignItems: "center",
        height: h,
        width: "fit-content",
        border: "1px solid var(--color-semantic-line-solid-normal)",
        borderRadius: "var(--radius-md)",
        background: "var(--color-semantic-background-elevated-normal)",
        opacity: disabled ? 0.45 : 1,
        ...style
      },
      ...rest,
      children: [
        renderStepBtn("minus"),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            role: "spinbutton",
            tabIndex: disabled ? -1 : 0,
            "aria-label": typeof groupName === "string" && !ariaLabelledBy ? groupName : void 0,
            "aria-labelledby": ariaLabelledBy,
            "aria-valuenow": val,
            "aria-valuemin": hasMin ? min : void 0,
            "aria-valuemax": hasMax ? max : void 0,
            "aria-valuetext": valueText ? valueText(val) : void 0,
            "aria-disabled": disabled || void 0,
            "aria-live": valueFocused ? "off" : "polite",
            onKeyDown: handleValueKeyDown,
            onFocus: () => setValueFocused(true),
            onBlur: () => setValueFocused(false),
            style: {
              minWidth: 40,
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: size === "sm" ? 15 : 16,
              fontWeight: "var(--fw-bold)",
              letterSpacing: 0,
              color: "var(--color-semantic-label-normal)",
              fontVariantNumeric: "tabular-nums",
              borderRadius: "var(--radius-sm)"
            },
            children: val
          }
        ),
        renderStepBtn("plus")
      ]
    }
  );
}



exports.Stepper = Stepper;
//# sourceMappingURL=chunk-VSJEZCG5.cjs.map