"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkFVL575B5cjs = require('./chunk-FVL575B5.cjs');


var _chunkBQS4EIGJcjs = require('./chunk-BQS4EIGJ.cjs');

// components/editor/EditorToolbar.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// packages/core/dist/chunk-PQASK6TQ.js

var lightDismissStack = [];
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
function samePosition(a, b) {
  return a.placement === b.placement && Math.abs(a.shiftX - b.shiftX) < 0.5 && Math.abs(a.shiftY - b.shiftY) < 0.5 && Math.abs((_nullishCoalesce(a.maxHeight, () => ( 0))) - (_nullishCoalesce(b.maxHeight, () => ( 0)))) < 0.5;
}
function useControllableOpen({ open, defaultOpen = false, onOpenChange }) {
  const controlled = open !== void 0;
  const [internalOpen, setInternalOpen] = _react2.default.useState(defaultOpen);
  const visible = controlled ? open : internalOpen;
  const setVisible = _react2.default.useCallback((nextValue) => {
    const next = typeof nextValue === "function" ? nextValue(visible) : nextValue;
    if (!controlled) setInternalOpen(next);
    if (next !== visible) _optionalChain([onOpenChange, 'optionalCall', _ => _(next)]);
  }, [controlled, onOpenChange, visible]);
  return [visible, setVisible];
}
function useLightDismiss({
  open,
  rootRef,
  getTrigger,
  onDismiss,
  outsidePress = true,
  shouldDismiss
}) {
  const optionsRef = _react2.default.useRef(null);
  optionsRef.current = { getTrigger, onDismiss, outsidePress, shouldDismiss };
  const focusLatchRef = _react2.default.useRef(null);
  const releaseFocusLatch = _react2.default.useCallback(() => {
    const latch = focusLatchRef.current;
    if (!latch) return;
    focusLatchRef.current = null;
    latch.root.removeEventListener("focusin", latch.onFocusIn, true);
    latch.root.removeEventListener("focusout", latch.onFocusOut, true);
  }, []);
  const latchDismissedTrigger = _react2.default.useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    releaseFocusLatch();
    const onFocusIn = (event) => {
      event.stopPropagation();
    };
    const onFocusOut = (event) => {
      if (event.relatedTarget && root.contains(event.relatedTarget)) return;
      releaseFocusLatch();
    };
    root.addEventListener("focusin", onFocusIn, true);
    root.addEventListener("focusout", onFocusOut, true);
    focusLatchRef.current = { root, onFocusIn, onFocusOut };
  }, [releaseFocusLatch, rootRef]);
  _react2.default.useEffect(() => releaseFocusLatch, [releaseFocusLatch]);
  _react2.default.useEffect(() => {
    if (!open) return void 0;
    releaseFocusLatch();
    const root = rootRef.current;
    const ownerDocument = _nullishCoalesce(_optionalChain([root, 'optionalAccess', _2 => _2.ownerDocument]), () => ( document));
    const view = _nullishCoalesce(ownerDocument.defaultView, () => ( window));
    const entry = {};
    lightDismissStack.push(entry);
    const vetoed = (reason, event) => _optionalChain([optionsRef, 'access', _3 => _3.current, 'access', _4 => _4.shouldDismiss, 'optionalCall', _5 => _5(reason, event)]) === false;
    const onPointerDown = (event) => {
      if (!optionsRef.current.outsidePress || _optionalChain([rootRef, 'access', _6 => _6.current, 'optionalAccess', _7 => _7.contains, 'call', _8 => _8(event.target)])) return;
      if (vetoed("outside-press", event)) return;
      _optionalChain([optionsRef, 'access', _9 => _9.current, 'access', _10 => _10.onDismiss, 'optionalCall', _11 => _11("outside-press")]);
    };
    const onKeyDown = (event) => {
      if (lightDismissStack.at(-1) !== entry || event.defaultPrevented || event.key !== "Escape") return;
      if (vetoed("escape", event)) return;
      event.preventDefault();
      const anchor = rootRef.current;
      const trigger = _optionalChain([optionsRef, 'access', _12 => _12.current, 'access', _13 => _13.getTrigger, 'optionalCall', _14 => _14()]);
      const activeElement = ownerDocument.activeElement;
      const ownsFocus = !!anchor && !!activeElement && anchor.contains(activeElement);
      if (ownsFocus) latchDismissedTrigger();
      _optionalChain([optionsRef, 'access', _15 => _15.current, 'access', _16 => _16.onDismiss, 'optionalCall', _17 => _17("escape")]);
      if (!ownsFocus || activeElement === trigger) return;
      view.requestAnimationFrame(() => {
        if (_optionalChain([trigger, 'optionalAccess', _18 => _18.isConnected]) && typeof trigger.focus === "function") {
          trigger.focus({ preventScroll: true });
        }
      });
    };
    if (outsidePress) ownerDocument.addEventListener("pointerdown", onPointerDown);
    ownerDocument.addEventListener("keydown", onKeyDown);
    return () => {
      if (outsidePress) ownerDocument.removeEventListener("pointerdown", onPointerDown);
      ownerDocument.removeEventListener("keydown", onKeyDown);
      const index = lightDismissStack.indexOf(entry);
      if (index >= 0) lightDismissStack.splice(index, 1);
    };
  }, [latchDismissedTrigger, open, outsidePress, releaseFocusLatch, rootRef]);
}
function useFloatingPosition({
  open,
  anchorRef,
  panelRef,
  placement: requestedPlacement = "bottom",
  offset = 8,
  viewportPadding = 16
}) {
  const [position, setPosition] = _react2.default.useState({
    placement: requestedPlacement,
    shiftX: 0,
    shiftY: 0,
    maxHeight: null
  });
  useSafeLayoutEffect(() => {
    if (!open) {
      setPosition((previous) => {
        const next = { placement: requestedPlacement, shiftX: 0, shiftY: 0, maxHeight: null };
        return samePosition(previous, next) ? previous : next;
      });
      return void 0;
    }
    const anchor = anchorRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel) return void 0;
    const view = _nullishCoalesce(_optionalChain([anchor, 'access', _19 => _19.ownerDocument, 'optionalAccess', _20 => _20.defaultView]), () => ( window));
    let frame;
    const update = () => {
      const currentAnchor = anchorRef.current;
      const currentPanel = panelRef.current;
      if (!currentAnchor || !currentPanel) return;
      const anchorRect = currentAnchor.getBoundingClientRect();
      const panelRect = currentPanel.getBoundingClientRect();
      const naturalWidth = Math.min(
        currentPanel.scrollWidth || panelRect.width,
        Math.max(0, view.innerWidth - viewportPadding * 2)
      );
      const naturalHeight = currentPanel.scrollHeight || panelRect.height;
      const spaces = {
        top: anchorRect.top - offset - viewportPadding,
        bottom: view.innerHeight - anchorRect.bottom - offset - viewportPadding,
        left: anchorRect.left - offset - viewportPadding,
        right: view.innerWidth - anchorRect.right - offset - viewportPadding
      };
      const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" };
      const required = requestedPlacement === "left" || requestedPlacement === "right" ? naturalWidth : naturalHeight;
      const nextPlacement = spaces[requestedPlacement] < required && spaces[opposite[requestedPlacement]] > spaces[requestedPlacement] ? opposite[requestedPlacement] : requestedPlacement;
      if (position.placement !== nextPlacement) {
        setPosition({ placement: nextPlacement, shiftX: 0, shiftY: 0, maxHeight: null });
        return;
      }
      const baseLeft = panelRect.left - position.shiftX;
      const baseRight = panelRect.right - position.shiftX;
      const baseTop = panelRect.top - position.shiftY;
      const baseBottom = panelRect.bottom - position.shiftY;
      const anchorIntersectsX = anchorRect.right > viewportPadding && anchorRect.left < view.innerWidth - viewportPadding;
      const anchorIntersectsY = anchorRect.bottom > viewportPadding && anchorRect.top < view.innerHeight - viewportPadding;
      let shiftX = 0;
      let shiftY = 0;
      if (anchorIntersectsX) {
        if (baseLeft < viewportPadding) shiftX = viewportPadding - baseLeft;
        else if (baseRight > view.innerWidth - viewportPadding) shiftX = view.innerWidth - viewportPadding - baseRight;
      }
      if (anchorIntersectsY) {
        if (baseTop < viewportPadding) shiftY = viewportPadding - baseTop;
        else if (baseBottom > view.innerHeight - viewportPadding) shiftY = view.innerHeight - viewportPadding - baseBottom;
      }
      const verticalPlacement = nextPlacement === "top" || nextPlacement === "bottom";
      const availableHeight = verticalPlacement ? Math.max(0, spaces[nextPlacement]) : Math.max(0, view.innerHeight - viewportPadding * 2);
      const next = {
        placement: nextPlacement,
        shiftX,
        shiftY,
        maxHeight: availableHeight
      };
      setPosition((previous) => samePosition(previous, next) ? previous : next);
    };
    const schedule = () => {
      view.cancelAnimationFrame(frame);
      frame = view.requestAnimationFrame(update);
    };
    schedule();
    view.addEventListener("resize", schedule);
    view.addEventListener("scroll", schedule, true);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    _optionalChain([observer, 'optionalAccess', _21 => _21.observe, 'call', _22 => _22(anchor)]);
    _optionalChain([observer, 'optionalAccess', _23 => _23.observe, 'call', _24 => _24(panel)]);
    return () => {
      view.cancelAnimationFrame(frame);
      view.removeEventListener("resize", schedule);
      view.removeEventListener("scroll", schedule, true);
      _optionalChain([observer, 'optionalAccess', _25 => _25.disconnect, 'call', _26 => _26()]);
    };
  }, [anchorRef, offset, open, panelRef, position.placement, position.shiftX, position.shiftY, requestedPlacement, viewportPadding]);
  return position;
}
function appendAriaReference(existing, id) {
  return [...new Set(`${_nullishCoalesce(existing, () => ( ""))} ${id}`.trim().split(/\s+/).filter(Boolean))].join(" ");
}
function findOverlayTrigger(root) {
  return _nullishCoalesce(_optionalChain([root, 'optionalAccess', _27 => _27.querySelector, 'call', _28 => _28('[data-anchored-overlay-trigger], button, [role="button"], a[href], input, select, textarea')]), () => ( null));
}

// packages/core/dist/chunk-SOBGSCI7.js

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
function arrowAxisPosition(normalizedAlign, target, axis, floatingShift = 0, bubble = null, radius = 0, arrowHalf = 0) {
  const size = target ? axis === "x" ? target.w : target.h : null;
  const bubbleSize = bubble ? axis === "x" ? bubble.w : bubble.h : null;
  const isStart = START_ALIGNS.has(normalizedAlign);
  const isEnd = END_ALIGNS.has(normalizedAlign);
  if (bubbleSize == null) return null;
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
  return min > max ? bubbleSize / 2 : Math.min(Math.max(fromStart, min), max);
}
function roundedBubblePath(placement, width, height, radius, arrowPosition, arrowHalf, arrowHeight) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const hasArrow = arrowPosition != null && arrowHalf > 0 && arrowHeight > 0;
  const topArrow = hasArrow && placement === "bottom";
  const rightArrow = hasArrow && placement === "left";
  const bottomArrow = hasArrow && placement === "top";
  const leftArrow = hasArrow && placement === "right";
  const c = _nullishCoalesce(arrowPosition, () => ( 0));
  const commands = [`M ${r} 0`];
  if (topArrow) {
    commands.push(`H ${c - arrowHalf}`, `L ${c} ${-arrowHeight}`, `L ${c + arrowHalf} 0`);
  }
  commands.push(`H ${width - r}`, `Q ${width} 0 ${width} ${r}`);
  if (rightArrow) {
    commands.push(
      `V ${c - arrowHalf}`,
      `L ${width + arrowHeight} ${c}`,
      `L ${width} ${c + arrowHalf}`
    );
  }
  commands.push(`V ${height - r}`, `Q ${width} ${height} ${width - r} ${height}`);
  if (bottomArrow) {
    commands.push(
      `H ${c + arrowHalf}`,
      `L ${c} ${height + arrowHeight}`,
      `L ${c - arrowHalf} ${height}`
    );
  }
  commands.push(`H ${r}`, `Q 0 ${height} 0 ${height - r}`);
  if (leftArrow) {
    commands.push(`V ${c + arrowHalf}`, `L ${-arrowHeight} ${c}`, `L 0 ${c - arrowHalf}`);
  }
  commands.push(`V ${r}`, `Q 0 0 ${r} 0`, "Z");
  return commands.join(" ");
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
  const [visible, setVisible] = useControllableOpen({ open, defaultOpen, onOpenChange });
  const requestedPlace = position || placement || "top";
  const wrapperRef = _react2.default.useRef(null);
  const bubbleRef = _react2.default.useRef(null);
  const tooltipId = _react2.default.useId();
  const getTrigger = _react2.default.useCallback(() => findOverlayTrigger(wrapperRef.current), []);
  const floating = useFloatingPosition({
    open: visible,
    anchorRef: wrapperRef,
    panelRef: bubbleRef,
    placement: requestedPlace
  });
  const place = floating.placement;
  const pos = POS[place] || POS.top;
  const compact = size === "small" || size === "sm";
  const arrowHalf = compact ? 5 : 6;
  const arrowHeight = compact ? 5 : 6;
  const normalizedAlign = normalizeAlign(align);
  const bubbleVerticalPadding = compact ? 10 : 16;
  const contentMaxHeight = floating.maxHeight != null ? Math.max(0, floating.maxHeight - bubbleVerticalPadding) : void 0;
  const bubbleRadius = compact ? 6 : 8;
  const [target, setTarget] = _react2.default.useState(null);
  const [bubbleBox, setBubbleBox] = _react2.default.useState(null);
  const edgeAligned = START_ALIGNS.has(normalizedAlign) || END_ALIGNS.has(normalizedAlign);
  _react2.default.useLayoutEffect(() => {
    if (!wrapperRef.current) return;
    const node = _nullishCoalesce(getTrigger(), () => ( wrapperRef.current));
    const sameBox = (prev, r) => prev && prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height };
    const measure = () => {
      if (arrow && edgeAligned) setTarget((prev) => sameBox(prev, node.getBoundingClientRect()));
      const bubbleNode = bubbleRef.current;
      if (bubbleNode) setBubbleBox((prev) => sameBox(prev, bubbleNode.getBoundingClientRect()));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    if (arrow && edgeAligned) ro.observe(node);
    if (bubbleRef.current) ro.observe(bubbleRef.current);
    return () => ro.disconnect();
  }, [arrow, content, edgeAligned, getTrigger, place, shortcut, size, visible]);
  const arrowPosition = arrow ? arrowAxisPosition(
    normalizedAlign,
    target,
    place === "top" || place === "bottom" ? "x" : "y",
    place === "top" || place === "bottom" ? floating.shiftX : floating.shiftY,
    bubbleBox,
    bubbleRadius,
    arrowHalf
  ) : null;
  const bubblePath = bubbleBox ? roundedBubblePath(
    place,
    bubbleBox.w,
    bubbleBox.h,
    bubbleRadius,
    arrowPosition,
    arrowHalf,
    arrowHeight
  ) : null;
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
  useLightDismiss({
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
    _optionalChain([onMouseEnter, 'optionalCall', _29 => _29(event)]);
    schedule(true, delays.open);
  };
  const hideTooltip = (event) => {
    _optionalChain([onMouseLeave, 'optionalCall', _30 => _30(event)]);
    schedule(false, delays.close);
  };
  const showOnFocus = (event) => {
    _optionalChain([onFocus, 'optionalCall', _31 => _31(event)]);
    clearTimer();
    setVisible(true);
  };
  const hideOnBlur = (event) => {
    _optionalChain([onBlur, 'optionalCall', _32 => _32(event)]);
    if (!event.currentTarget.contains(event.relatedTarget)) {
      clearTimer();
      setVisible(false);
    }
  };
  const validTrigger = _react2.default.isValidElement(children) && children.type !== _react2.default.Fragment;
  const renderedChildren = validTrigger ? _react2.default.cloneElement(children, {
    "data-anchored-overlay-trigger": "",
    "aria-describedby": appendAriaReference(children.props["aria-describedby"], tooltipId)
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
              isolation: "isolate",
              boxShadow: "var(--shadow-md)",
              visibility: visible && bubblePath ? "visible" : "hidden",
              opacity: visible ? 1 : 0,
              transition: "opacity var(--dur-fast) var(--ease-out)"
            },
            children: [
              bubblePath && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "svg",
                {
                  "aria-hidden": "true",
                  focusable: "false",
                  "data-lds-tooltip-surface": "",
                  "data-arrow-axis": _nullishCoalesce(arrowPosition, () => ( void 0)),
                  "data-arrow-height": arrow ? arrowHeight : void 0,
                  width: bubbleBox.w,
                  height: bubbleBox.h,
                  viewBox: `0 0 ${bubbleBox.w} ${bubbleBox.h}`,
                  preserveAspectRatio: "none",
                  style: {
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    overflow: "visible",
                    pointerEvents: "none"
                  },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "path",
                    {
                      d: bubblePath,
                      style: {
                        fill: "var(--color-semantic-inverse-background)"
                      }
                    }
                  )
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                "span",
                {
                  "data-lds-tooltip-content": true,
                  style: {
                    position: "relative",
                    zIndex: 1,
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
              )
            ]
          }
        )
      ]
    }
  );
}

// components/editor/EditorToolbar.jsx

function EditorToolbar({
  items = [],
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
  label = "\uD3B8\uC9D1 \uB3C4\uAD6C",
  disabled = false,
  disabledReason,
  tooltipPosition,
  style,
  className,
  onKeyDown,
  onFocusCapture,
  ...rest
}) {
  const controlled = value !== void 0;
  const first = items[0] && (items[0].value != null ? items[0].value : items[0]);
  const [internal, setInternal] = _react2.default.useState(defaultValue != null ? defaultValue : first);
  const cur = controlled ? value : internal;
  const activeEnabledItem = items.find((item) => {
    const itemValue = item.value != null ? item.value : item;
    return itemValue === cur && !disabled && !item.disabled;
  });
  const firstEnabledItem = items.find((item) => !disabled && !item.disabled);
  const preferredFocusItem = _nullishCoalesce(_nullishCoalesce(activeEnabledItem, () => ( firstEnabledItem)), () => ( (!disabled ? items[0] : void 0)));
  const preferredFocusValue = preferredFocusItem != null ? preferredFocusItem.value != null ? preferredFocusItem.value : preferredFocusItem : void 0;
  const pick = (v, itemDisabled) => {
    if (disabled || itemDisabled) return;
    if (!controlled) setInternal(v);
    onChange && onChange(v);
  };
  const resolvedTooltipPosition = _nullishCoalesce(tooltipPosition, () => ( (orientation === "vertical" ? "right" : "bottom")));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    _chunkBQS4EIGJcjs.Toolbar,
    {
      ...rest,
      className: ["lk-editor-toolbar", className].filter(Boolean).join(" "),
      label,
      orientation,
      itemSelector: "[data-lk-editor-toolbar-item]",
      preferredItemKey: preferredFocusValue,
      includeAriaDisabledItems: true,
      "aria-disabled": disabled || void 0,
      "aria-description": disabled && typeof disabledReason === "string" ? disabledReason : void 0,
      "data-orientation": orientation,
      onKeyDown,
      onFocusCapture,
      style: {
        width: "fit-content",
        maxWidth: "100%",
        boxSizing: "border-box",
        gap: "var(--space-1)",
        padding: 0,
        background: "transparent",
        border: 0,
        borderRadius: 0,
        boxShadow: "none",
        ...style
      },
      children: items.map((it) => {
        const v = it.value != null ? it.value : it;
        const on = v === cur;
        const itemDisabled = disabled || !!it.disabled;
        const itemLabel = it.label || String(v);
        const itemDisabledReason = _nullishCoalesce(it.disabledReason, () => ( disabledReason));
        return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          Tooltip,
          {
            content: itemDisabled && itemDisabledReason != null ? /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: 2 }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: itemLabel }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-inverse-label-alternative-soft)", fontWeight: "var(--fw-medium)" }, children: itemDisabledReason })
            ] }) : itemLabel,
            shortcut: it.shortcut,
            position: resolvedTooltipPosition,
            size: "sm",
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunkFVL575B5cjs.ToggleIcon,
              {
                className: "lk-editor-toolbar__button",
                label: itemLabel,
                size: "sm",
                variant: "plain",
                pressed: on,
                "aria-disabled": itemDisabled || void 0,
                "aria-keyshortcuts": _nullishCoalesce(it.ariaKeyShortcuts, () => ( (typeof it.shortcut === "string" ? it.shortcut : void 0))),
                "aria-description": itemDisabled && typeof itemDisabledReason === "string" ? itemDisabledReason : void 0,
                "data-lk-editor-toolbar-item": "",
                "data-lk-toolbar-key": String(v),
                tabIndex: !disabled && v === preferredFocusValue ? 0 : -1,
                disabled,
                onChange: () => pick(v, itemDisabled),
                style: {
                  flex: "0 0 auto",
                  padding: 0,
                  lineHeight: 0
                },
                children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 16, height: 16, display: "inline-grid", placeItems: "center", flex: "0 0 auto" }, children: it.icon || v })
              }
            )
          },
          v
        );
      })
    }
  );
}



exports.EditorToolbar = EditorToolbar;
//# sourceMappingURL=chunk-TJ4LFW3Y.cjs.map