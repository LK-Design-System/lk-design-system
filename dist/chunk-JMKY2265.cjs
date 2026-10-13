"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";





var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');

// components/selection/SegmentedControl.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var SEGMENTED_MOTION_STYLES = `
@media(prefers-reduced-motion:reduce){
  [data-lds-segmented-motion]{transition-duration:0s!important;transition-delay:0s!important}
}`;
function hasSegmentPaintOverride(style) {
  return Object.keys(_nullishCoalesce(style, () => ( {}))).some((property) => /^(background|border|mask|--)/.test(property) || ["boxShadow", "opacity", "filter", "backdropFilter", "mixBlendMode", "clipPath", "visibility"].includes(property));
}
function normalizeSegmentOption(option) {
  return typeof option === "string" ? { value: option, label: option, disabled: false } : {
    ...option,
    disabled: Boolean(option.disabled || option.disable || option.interaction === "inactive")
  };
}
var SegmentedControl = _react2.default.forwardRef(function SegmentedControl2({
  options = [],
  value,
  defaultValue,
  onChange,
  variant = "solid",
  size = "md",
  interaction,
  full = false,
  resize,
  disabled = false,
  disable = false,
  className,
  style,
  classNames,
  styles,
  vars,
  "aria-label": ariaLabel = "\uBCF4\uAE30 \uC120\uD0DD",
  ...groupProps
}, forwardedRef) {
  const normalizedOptions = options.map(normalizeSegmentOption);
  const enabledIndices = normalizedOptions.map((option, index) => option.disabled ? -1 : index).filter((index) => index >= 0);
  const fallbackValue = _nullishCoalesce(defaultValue, () => ( _optionalChain([normalizedOptions, 'access', _ => _[enabledIndices[0]], 'optionalAccess', _2 => _2.value])));
  const isControlled = value !== void 0;
  const [internalValue, setInternalValue] = _react2.default.useState(fallbackValue);
  const currentValue = isControlled ? value : internalValue;
  const disabledState = disabled || disable || interaction === "inactive";
  const rootRef = _react2.default.useRef(null);
  const mergedRootRef = _chunkGWMGPLNWcjs.useMergedRefs.call(void 0, rootRef, forwardedRef);
  const buttonRefs = _react2.default.useRef([]);
  const [surface, setSurface] = _react2.default.useState(null);
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size === "large" ? "lg" : size;
  const height = normalizedSize === "sm" ? 32 : normalizedSize === "lg" ? 48 : 40;
  const fontSize = normalizedSize === "sm" ? "var(--label1-size)" : normalizedSize === "lg" ? "var(--headline2-size)" : "var(--body1-size)";
  const trackRadius = normalizedSize === "sm" ? "var(--radius-8)" : normalizedSize === "lg" ? "var(--radius-md)" : "var(--radius-10)";
  const segmentRadius = normalizedSize === "sm" ? "var(--radius-sm)" : normalizedSize === "lg" ? "var(--radius-10)" : "var(--radius-8)";
  const trackPadding = normalizedSize === "lg" ? 3 : 2;
  const outlined = variant === "outlined";
  const fill = full || resize === "fill";
  const selectedIndex = normalizedOptions.findIndex((option) => option.value === currentValue && !option.disabled);
  const rovingIndex = selectedIndex >= 0 ? selectedIndex : _nullishCoalesce(enabledIndices[0], () => ( -1));
  const surfaceIndex = normalizedOptions.findIndex((option) => option.value === currentValue);
  const selectedOption = normalizedOptions[surfaceIndex];
  const surfaceDisabled = disabledState || _optionalChain([selectedOption, 'optionalAccess', _3 => _3.disabled]);
  const sharedSelection = !outlined && !hasSegmentPaintOverride(_chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "segment")) && !_optionalChain([classNames, 'optionalAccess', _4 => _4.segment]) && !hasSegmentPaintOverride(_optionalChain([selectedOption, 'optionalAccess', _5 => _5.style])) && !_optionalChain([selectedOption, 'optionalAccess', _6 => _6.className]);
  const measureSurface = _react2.default.useCallback(() => {
    const selected = buttonRefs.current[surfaceIndex];
    const next = sharedSelection && selected ? {
      x: selected.offsetLeft,
      y: selected.offsetTop,
      width: selected.offsetWidth,
      height: selected.offsetHeight
    } : null;
    setSurface((previous) => {
      if (previous === null && next === null) return previous;
      if (previous && next && Object.keys(next).every((key) => previous[key] === next[key])) return previous;
      return next;
    });
  }, [sharedSelection, surfaceIndex]);
  useSafeLayoutEffect(measureSurface);
  useSafeLayoutEffect(() => {
    if (!sharedSelection) return void 0;
    const root = rootRef.current;
    const view = _optionalChain([root, 'optionalAccess', _7 => _7.ownerDocument, 'optionalAccess', _8 => _8.defaultView]);
    const Observer = _optionalChain([view, 'optionalAccess', _9 => _9.ResizeObserver]);
    const observer = Observer ? new Observer(measureSurface) : null;
    if (root) _optionalChain([observer, 'optionalAccess', _10 => _10.observe, 'call', _11 => _11(root)]);
    buttonRefs.current.forEach((button) => {
      if (button) _optionalChain([observer, 'optionalAccess', _12 => _12.observe, 'call', _13 => _13(button)]);
    });
    const DirectionObserver = _optionalChain([view, 'optionalAccess', _14 => _14.MutationObserver]);
    const directionObserver = DirectionObserver ? new DirectionObserver(measureSurface) : null;
    for (let ancestor = root; ancestor; ancestor = ancestor.parentElement) {
      _optionalChain([directionObserver, 'optionalAccess', _15 => _15.observe, 'call', _16 => _16(ancestor, { attributes: true, attributeFilter: ["dir", "class", "style"] })]);
    }
    _optionalChain([view, 'optionalAccess', _17 => _17.addEventListener, 'call', _18 => _18("resize", measureSurface)]);
    return () => {
      _optionalChain([observer, 'optionalAccess', _19 => _19.disconnect, 'call', _20 => _20()]);
      _optionalChain([directionObserver, 'optionalAccess', _21 => _21.disconnect, 'call', _22 => _22()]);
      _optionalChain([view, 'optionalAccess', _23 => _23.removeEventListener, 'call', _24 => _24("resize", measureSurface)]);
    };
  }, [measureSurface, sharedSelection, options]);
  const pick = (index, { focus = false } = {}) => {
    const option = normalizedOptions[index];
    if (!option || disabledState || option.disabled) return;
    if (option.value !== currentValue) {
      if (!isControlled) setInternalValue(option.value);
      _optionalChain([onChange, 'optionalCall', _25 => _25(option.value)]);
    }
    if (focus) _optionalChain([buttonRefs, 'access', _26 => _26.current, 'access', _27 => _27[index], 'optionalAccess', _28 => _28.focus, 'call', _29 => _29()]);
  };
  const move = (currentIndex, direction) => {
    if (!enabledIndices.length) return;
    const currentEnabledIndex = enabledIndices.indexOf(currentIndex);
    const base = currentEnabledIndex >= 0 ? currentEnabledIndex : 0;
    const next = (base + direction + enabledIndices.length) % enabledIndices.length;
    pick(enabledIndices[next], { focus: true });
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ...groupProps,
      ref: mergedRootRef,
      "data-slot": "root",
      "data-size": normalizedSize,
      "data-variant": outlined ? "outlined" : "solid",
      "data-disabled": disabledState ? "true" : void 0,
      role: "radiogroup",
      "aria-label": ariaLabel,
      "aria-disabled": disabledState || void 0,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
      style: {
        ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-segmented-control-"),
        position: "relative",
        isolation: "isolate",
        display: "inline-flex",
        width: fill ? "100%" : void 0,
        maxWidth: "100%",
        height: `var(--lds-segmented-control-height, ${height}px)`,
        boxSizing: "border-box",
        justifySelf: fill ? void 0 : "start",
        padding: outlined ? 0 : `var(--lds-segmented-control-padding, ${trackPadding}px)`,
        gap: outlined ? 0 : "var(--lds-segmented-control-gap, 2px)",
        background: outlined ? "var(--color-semantic-background-elevated-normal)" : "var(--color-semantic-fill-normal)",
        border: outlined ? "1px solid var(--color-semantic-line-solid-normal)" : "none",
        borderRadius: `var(--lds-segmented-control-radius, ${trackRadius})`,
        overflow: "hidden",
        ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"),
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: SEGMENTED_MOTION_STYLES }),
        sharedSelection && surface && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            "data-lds-segmented-surface": "",
            "data-lds-segmented-motion": "",
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              pointerEvents: "none",
              zIndex: 0,
              width: surface.width,
              height: surface.height,
              transform: `translate(${surface.x}px, ${surface.y}px)`,
              borderRadius: `var(--lds-segmented-control-segment-radius, ${segmentRadius})`,
              background: surfaceDisabled ? "var(--color-semantic-fill-strong)" : "var(--color-semantic-background-elevated-normal)",
              boxShadow: surfaceDisabled ? "none" : "var(--shadow-xs)",
              transition: "transform var(--dur-base) var(--ease-out), width var(--dur-base) var(--ease-out), height var(--dur-base) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
            }
          }
        ),
        normalizedOptions.map((option, index) => {
          const optionInteraction = option.interaction || interaction;
          const selected = option.value === currentValue;
          const optionDisabled = disabledState || option.disabled;
          const active = selected || optionInteraction === "active" || optionInteraction === "active-focused";
          const activeHover = !optionDisabled && optionInteraction === "hovered";
          const activeFocus = !optionDisabled && (optionInteraction === "focused" || optionInteraction === "active-focused");
          const sharedSurface = sharedSelection && selected && surface !== null;
          return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            "button",
            {
              ref: (node) => {
                buttonRefs.current[index] = node;
              },
              "data-slot": "segment",
              "data-lds-segmented-motion": "",
              "data-state": selected ? "checked" : "unchecked",
              type: "button",
              role: "radio",
              "aria-checked": selected,
              "aria-disabled": optionDisabled || void 0,
              "data-selected": selected ? "true" : "false",
              "data-disabled": optionDisabled ? "true" : "false",
              className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "segment", option.className) || void 0,
              tabIndex: !optionDisabled && index === rovingIndex ? 0 : -1,
              disabled: optionDisabled,
              onClick: () => pick(index),
              onKeyDown: (event) => {
                if (event.defaultPrevented || optionDisabled) return;
                const rtl = _optionalChain([rootRef, 'access', _30 => _30.current, 'optionalAccess', _31 => _31.ownerDocument, 'optionalAccess', _32 => _32.defaultView, 'optionalAccess', _33 => _33.getComputedStyle, 'call', _34 => _34(rootRef.current), 'access', _35 => _35.direction]) === "rtl";
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  move(index, event.key === "ArrowRight" && rtl ? -1 : 1);
                } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  move(index, event.key === "ArrowLeft" && rtl ? 1 : -1);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  pick(enabledIndices[0], { focus: true });
                } else if (event.key === "End") {
                  event.preventDefault();
                  pick(enabledIndices[enabledIndices.length - 1], { focus: true });
                }
              },
              style: {
                flex: fill ? 1 : void 0,
                position: "relative",
                zIndex: 1,
                minWidth: 0,
                height: "100%",
                minHeight: 0,
                boxSizing: "border-box",
                padding: "0 9px",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                cursor: optionDisabled ? "not-allowed" : "pointer",
                fontFamily: "var(--font-sans)",
                fontSize,
                fontWeight: active ? "var(--fw-semibold)" : "var(--fw-medium)",
                letterSpacing: 0,
                color: optionDisabled ? "var(--color-semantic-label-disable)" : active ? "var(--color-semantic-label-normal)" : activeFocus ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
                background: sharedSurface ? "transparent" : optionDisabled ? active ? "var(--color-semantic-fill-strong)" : "transparent" : active ? outlined ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)" : activeHover || activeFocus ? "var(--color-semantic-fill-normal)" : "transparent",
                borderRadius: outlined ? 0 : `var(--lds-segmented-control-segment-radius, ${segmentRadius})`,
                borderLeft: outlined && index > 0 ? "1px solid var(--color-semantic-line-solid-normal)" : "none",
                boxShadow: [
                  active && !outlined && !optionDisabled && !sharedSurface ? "var(--shadow-xs)" : null,
                  activeFocus ? "0 0 0 4px var(--color-semantic-focus-ring)" : null
                ].filter(Boolean).join(", ") || "none",
                transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
                whiteSpace: "nowrap",
                ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "segment"),
                ...option.style
              },
              children: [
                option.icon && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "icon", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "icon") || void 0, "aria-hidden": "true", style: { display: "inline-flex", flex: "0 0 auto", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "icon") }, children: option.icon }),
                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "label", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "label") || void 0, style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "label") }, children: option.label }),
                option.count != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                  "span",
                  {
                    "data-slot": "count",
                    "data-segment-count": "true",
                    className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "count") || void 0,
                    style: {
                      minWidth: "1.25em",
                      flexShrink: 0,
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: "var(--fw-bold)",
                      color: active ? "currentColor" : "var(--color-semantic-label-alternative)",
                      ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "count")
                    },
                    children: option.count
                  }
                )
              ]
            },
            option.value
          );
        })
      ]
    }
  );
});



exports.SegmentedControl = SegmentedControl;
//# sourceMappingURL=chunk-JMKY2265.cjs.map