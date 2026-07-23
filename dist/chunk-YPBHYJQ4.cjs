"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";






var _chunkJRW2QDVCcjs = require('./chunk-JRW2QDVC.cjs');

// components/content/Tooltip.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var POS = {
  top: { bottom: "100%", left: "50%" },
  bottom: { top: "100%", left: "50%" },
  left: { right: "100%", top: "50%" },
  right: { left: "100%", top: "50%" }
};
function normalizeAlign(align) {
  return align === "left" ? "leading" : align === "right" ? "trailing" : align;
}
function bubbleOffset(placement, align) {
  const normalizedAlign = normalizeAlign(align);
  if (placement === "top" || placement === "bottom") {
    const y = placement === "top" ? "-8px" : "8px";
    if (normalizedAlign === "leading") {
      return { left: 0, transform: `translateX(0) translateY(${y})` };
    }
    if (normalizedAlign === "trailing") {
      return {
        left: "auto",
        right: 0,
        transform: `translateX(0) translateY(${y})`
      };
    }
    return { transform: `translateX(-50%) translateY(${y})` };
  }
  const x = placement === "left" ? "-8px" : "8px";
  if (normalizedAlign === "top" || normalizedAlign === "leading") {
    return { top: 0, transform: `translateY(0) translateX(${x})` };
  }
  if (normalizedAlign === "bottom" || normalizedAlign === "trailing") {
    return {
      top: "auto",
      bottom: 0,
      transform: `translateY(0) translateX(${x})`
    };
  }
  return { transform: `translateY(-50%) translateX(${x})` };
}
var START_ALIGNS = /* @__PURE__ */ new Set(["leading", "top"]);
var END_ALIGNS = /* @__PURE__ */ new Set(["trailing", "bottom"]);
function offsetValue(value, delta) {
  if (!delta) return value;
  if (typeof value === "number") return value + delta;
  const operator = delta < 0 ? "-" : "+";
  return `calc(${value} ${operator} ${Math.abs(delta)}px)`;
}
function arrowMainAxis(normalizedAlign, target, axis, floatingShift = 0, bubble = null, radius = 0, arrowHalf = 0) {
  const size = target ? axis === "x" ? target.w : target.h : null;
  const bubbleSize = bubble ? axis === "x" ? bubble.w : bubble.h : null;
  const half = axis === "x" ? "translateX" : "translateY";
  const startEdge = axis === "x" ? "left" : "top";
  const endEdge = axis === "x" ? "right" : "bottom";
  const isStart = START_ALIGNS.has(normalizedAlign);
  const isEnd = END_ALIGNS.has(normalizedAlign);
  if (bubbleSize == null) {
    if (size == null || !isStart && !isEnd) {
      return {
        edge: startEdge,
        value: offsetValue("50%", -floatingShift),
        shift: `${half}(-50%)`
      };
    }
    if (isStart) {
      return {
        edge: startEdge,
        value: offsetValue(size / 2, -floatingShift),
        shift: `${half}(-50%)`
      };
    }
    return {
      edge: endEdge,
      value: offsetValue(size / 2, floatingShift),
      shift: `${half}(50%)`
    };
  }
  let fromStart;
  if (size == null || !isStart && !isEnd) fromStart = bubbleSize / 2 - floatingShift;
  else if (isStart) fromStart = size / 2 - floatingShift;
  else fromStart = bubbleSize - (size / 2 + floatingShift);
  const edgeMin = arrowHalf;
  const edgeMax = bubbleSize - arrowHalf;
  const cornerMin = radius + arrowHalf;
  const cornerMax = bubbleSize - radius - arrowHalf;
  const cornerBoundIsUsable = cornerMax - cornerMin >= arrowHalf;
  const min = cornerBoundIsUsable ? cornerMin : edgeMin;
  const max = cornerBoundIsUsable ? cornerMax : edgeMax;
  const clamped = min > max ? bubbleSize / 2 : Math.min(Math.max(fromStart, min), max);
  return { edge: startEdge, value: clamped, shift: `${half}(-50%)` };
}
function arrowStyle(placement, arrowHalf, arrowHeight, normalizedAlign, target, floatingShift, bubble, radius) {
  const bg = "var(--color-semantic-inverse-background)";
  if (placement === "top" || placement === "bottom") {
    const a2 = arrowMainAxis(normalizedAlign, target, "x", floatingShift, bubble, radius, arrowHalf);
    const base2 = {
      width: arrowHalf * 2,
      height: arrowHeight,
      background: bg,
      transform: a2.shift,
      [a2.edge]: a2.value
    };
    return placement === "bottom" ? { ...base2, bottom: "calc(100% - 1px)", clipPath: "polygon(0 100%, 50% 0, 100% 100%)" } : { ...base2, top: "calc(100% - 1px)", clipPath: "polygon(0 0, 50% 100%, 100% 0)" };
  }
  const a = arrowMainAxis(normalizedAlign, target, "y", floatingShift, bubble, radius, arrowHalf);
  const base = {
    width: arrowHeight,
    height: arrowHalf * 2,
    background: bg,
    transform: a.shift,
    [a.edge]: a.value
  };
  return placement === "left" ? { ...base, left: "calc(100% - 1px)", clipPath: "polygon(0 0, 100% 50%, 0 100%)" } : { ...base, right: "calc(100% - 1px)", clipPath: "polygon(100% 0, 0 50%, 100% 100%)" };
}
var DEFAULT_DELAY = { open: 250, close: 0 };
function normalizeDelay(delay) {
  if (delay == null) return DEFAULT_DELAY;
  if (typeof delay === "number") return { open: delay, close: 0 };
  return {
    open: _nullishCoalesce(delay.open, () => ( DEFAULT_DELAY.open)),
    close: _nullishCoalesce(delay.close, () => ( DEFAULT_DELAY.close))
  };
}
function Tooltip({
  content,
  placement,
  position,
  size = "medium",
  align = "center",
  shortcut,
  arrow = true,
  delay,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}) {
  const [visible, setVisible] = _chunkJRW2QDVCcjs.useControllableOpen.call(void 0, { open, defaultOpen, onOpenChange });
  const requestedPlace = position || placement || "top";
  const wrapperRef = _react2.default.useRef(null);
  const bubbleRef = _react2.default.useRef(null);
  const tooltipId = _react2.default.useId();
  const getTrigger = _react2.default.useCallback(() => _chunkJRW2QDVCcjs.findOverlayTrigger.call(void 0, wrapperRef.current), []);
  const floating = _chunkJRW2QDVCcjs.useFloatingPosition.call(void 0, {
    open: visible,
    anchorRef: wrapperRef,
    panelRef: bubbleRef,
    placement: requestedPlace
  });
  const place = floating.placement;
  const pos = POS[place] || POS.top;
  const compact = size === "small" || size === "sm";
  const arrowHalf = compact ? 7 : 10;
  const arrowHeight = compact ? 6 : 8;
  const normalizedAlign = normalizeAlign(align);
  const bubbleVerticalPadding = compact ? 10 : 16;
  const contentMaxHeight = floating.maxHeight != null ? Math.max(0, floating.maxHeight - bubbleVerticalPadding) : void 0;
  const bubbleRadius = compact ? 6 : 8;
  const [target, setTarget] = _react2.default.useState(null);
  const [bubbleBox, setBubbleBox] = _react2.default.useState(null);
  const edgeAligned = START_ALIGNS.has(normalizedAlign) || END_ALIGNS.has(normalizedAlign);
  _react2.default.useLayoutEffect(() => {
    if (!arrow || !wrapperRef.current) return;
    const node = _nullishCoalesce(getTrigger(), () => ( wrapperRef.current));
    const sameBox = (prev, r) => prev && prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height };
    const measure = () => {
      if (edgeAligned) setTarget((prev) => sameBox(prev, node.getBoundingClientRect()));
      const bubbleNode = bubbleRef.current;
      if (bubbleNode) setBubbleBox((prev) => sameBox(prev, bubbleNode.getBoundingClientRect()));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    if (bubbleRef.current) ro.observe(bubbleRef.current);
    return () => ro.disconnect();
  }, [arrow, edgeAligned, getTrigger, place, size, visible]);
  const delays = normalizeDelay(delay);
  const timerRef = _react2.default.useRef(null);
  const clearTimer = _react2.default.useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  _react2.default.useEffect(() => clearTimer, [clearTimer]);
  const schedule = _react2.default.useCallback(
    (next, ms) => {
      clearTimer();
      if (!ms) {
        setVisible(next);
        return;
      }
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setVisible(next);
      }, ms);
    },
    [clearTimer, setVisible]
  );
  _chunkJRW2QDVCcjs.useLightDismiss.call(void 0, {
    open: visible,
    rootRef: wrapperRef,
    getTrigger,
    onDismiss: () => {
      clearTimer();
      setVisible(false);
    },
    outsidePress: false
  });
  const showTooltip = (event) => {
    _optionalChain([onMouseEnter, 'optionalCall', _ => _(event)]);
    schedule(true, delays.open);
  };
  const hideTooltip = (event) => {
    _optionalChain([onMouseLeave, 'optionalCall', _2 => _2(event)]);
    schedule(false, delays.close);
  };
  const showOnFocus = (event) => {
    _optionalChain([onFocus, 'optionalCall', _3 => _3(event)]);
    clearTimer();
    setVisible(true);
  };
  const hideOnBlur = (event) => {
    _optionalChain([onBlur, 'optionalCall', _4 => _4(event)]);
    if (!event.currentTarget.contains(event.relatedTarget)) {
      clearTimer();
      setVisible(false);
    }
  };
  const validTrigger = _react2.default.isValidElement(children) && children.type !== _react2.default.Fragment;
  const renderedChildren = validTrigger ? _react2.default.cloneElement(children, {
    "data-anchored-overlay-trigger": "",
    "aria-describedby": _chunkJRW2QDVCcjs.appendAriaReference.call(void 0, children.props["aria-describedby"], tooltipId)
  }) : children;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "span",
    {
      ref: wrapperRef,
      ...rest,
      "data-anchored-overlay-trigger": validTrigger ? void 0 : "",
      "aria-describedby": validTrigger ? void 0 : tooltipId,
      tabIndex: rest.tabIndex,
      style: { position: "relative", display: "inline-flex", ...style },
      onMouseEnter: showTooltip,
      onMouseLeave: hideTooltip,
      onFocus: showOnFocus,
      onBlur: hideOnBlur,
      children: [
        renderedChildren,
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "span",
          {
            ref: bubbleRef,
            id: tooltipId,
            role: "tooltip",
            "aria-hidden": visible ? false : void 0,
            "data-placement": place,
            style: {
              position: "absolute",
              ...pos,
              ...bubbleOffset(place, align),
              translate: `${floating.shiftX}px ${floating.shiftY}px`,
              zIndex: 40,
              pointerEvents: "auto",
              display: "inline-flex",
              alignItems: "center",
              padding: compact ? "5px 8px" : "8px 12px",
              background: "var(--color-semantic-inverse-background)",
              color: "var(--color-semantic-inverse-label)",
              fontFamily: "var(--font-sans)",
              fontSize: compact ? 11.5 : "var(--label1-size)",
              fontWeight: "var(--fw-semibold)",
              letterSpacing: 0,
              lineHeight: compact ? 1.35 : "var(--label1-line)",
              borderRadius: compact ? 6 : 8,
              boxSizing: "border-box",
              width: "max-content",
              maxWidth: "min(20rem, calc(100vw - var(--space-8)))",
              overflow: "visible",
              whiteSpace: "normal",
              overflowWrap: "anywhere",
              boxShadow: "var(--shadow-md)",
              visibility: visible ? "visible" : "hidden",
              opacity: visible ? 1 : 0,
              transition: "opacity var(--dur-fast) var(--ease-out)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "span",
                {
                  "data-lds-tooltip-content": true,
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: compact ? 6 : 8,
                    minWidth: 0,
                    maxHeight: contentMaxHeight,
                    overflowY: contentMaxHeight != null ? "auto" : void 0,
                    overflowX: contentMaxHeight != null ? "hidden" : void 0
                  },
                  children: [
                    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: content }),
                    shortcut != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                      "span",
                      {
                        style: {
                          color: "var(--color-semantic-inverse-label-alternative-soft)",
                          fontWeight: "var(--fw-bold)"
                        },
                        children: shortcut
                      }
                    )
                  ]
                }
              ),
              arrow && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    position: "absolute",
                    display: "block",
                    pointerEvents: "none",
                    ...arrowStyle(
                      place,
                      arrowHalf,
                      arrowHeight,
                      normalizedAlign,
                      target,
                      place === "top" || place === "bottom" ? floating.shiftX : floating.shiftY,
                      bubbleBox,
                      bubbleRadius
                    )
                  }
                }
              )
            ]
          }
        )
      ]
    }
  );
}



exports.Tooltip = Tooltip;
//# sourceMappingURL=chunk-YPBHYJQ4.cjs.map