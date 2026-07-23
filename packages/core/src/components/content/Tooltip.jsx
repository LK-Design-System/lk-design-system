import React from "react";
import {
  appendAriaReference,
  findOverlayTrigger,
  useControllableOpen,
  useFloatingPosition,
  useLightDismiss,
} from "../overlay/anchored-overlay.js";

const POS = {
  top: { bottom: "100%", left: "50%" },
  bottom: { top: "100%", left: "50%" },
  left: { right: "100%", top: "50%" },
  right: { left: "100%", top: "50%" },
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
        transform: `translateX(0) translateY(${y})`,
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
      transform: `translateY(0) translateX(${x})`,
    };
  }
  return { transform: `translateY(-50%) translateX(${x})` };
}

// Position the arrow so it points AT the target. For center alignment the bubble
// is centred on the target, so the arrow sits at the bubble's own centre. For
// edge (leading/trailing) alignment the bubble is anchored to a target edge and
// extends past it, so the arrow is offset back toward the anchored edge by half
// the target's measured size — keeping it over the target centre instead of
// drifting to the bubble centre. `target` is the measured {w, h} of the trigger
// (null until measured → falls back to bubble-centred).
const START_ALIGNS = new Set(["leading", "top"]);
const END_ALIGNS = new Set(["trailing", "bottom"]);

function offsetValue(value, delta) {
  if (!delta) return value;
  if (typeof value === "number") return value + delta;
  const operator = delta < 0 ? "-" : "+";
  return `calc(${value} ${operator} ${Math.abs(delta)}px)`;
}

function arrowMainAxis(
  normalizedAlign,
  target,
  axis,
  floatingShift = 0,
  bubble = null,
  radius = 0,
  arrowHalf = 0,
) {
  const size = target ? (axis === "x" ? target.w : target.h) : null;
  const bubbleSize = bubble ? (axis === "x" ? bubble.w : bubble.h) : null;
  const half = axis === "x" ? "translateX" : "translateY";
  const startEdge = axis === "x" ? "left" : "top";
  const endEdge = axis === "x" ? "right" : "bottom";
  const isStart = START_ALIGNS.has(normalizedAlign);
  const isEnd = END_ALIGNS.has(normalizedAlign);

  // Until the bubble has been measured there is nothing to clamp against, so
  // keep the percentage form and let the first measured frame correct it.
  if (bubbleSize == null) {
    if (size == null || (!isStart && !isEnd)) {
      return {
        edge: startEdge,
        value: offsetValue("50%", -floatingShift),
        shift: `${half}(-50%)`,
      };
    }
    if (isStart) {
      return {
        edge: startEdge,
        value: offsetValue(size / 2, -floatingShift),
        shift: `${half}(-50%)`,
      };
    }
    return {
      edge: endEdge,
      value: offsetValue(size / 2, floatingShift),
      shift: `${half}(50%)`,
    };
  }

  // Restate every alignment as one distance from the start edge, then clamp it
  // to the bubble's flat span. A trigger taller than the bubble would otherwise
  // push the arrow past a rounded corner and leave it detached in mid-air, so
  // staying attached wins over pointing exactly at the trigger centre — the
  // same trade Floating UI's arrow middleware makes with its padding option.
  let fromStart;
  if (size == null || (!isStart && !isEnd)) fromStart = bubbleSize / 2 - floatingShift;
  else if (isStart) fromStart = size / 2 - floatingShift;
  else fromStart = bubbleSize - (size / 2 + floatingShift);

  // Two bounds, in priority order. The edge bound is absolute: the arrow's base
  // may never leave the bubble, or it reads as a detached wedge. The corner
  // bound additionally keeps the base off the rounded corners, but a bubble
  // barely taller than its own corners has no room for it — collapsing to the
  // bubble centre there would stop the arrow pointing at the trigger at all, so
  // the corner bound only applies while it leaves the arrow somewhere to move.
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

function arrowStyle(
  placement,
  arrowHalf,
  arrowHeight,
  normalizedAlign,
  target,
  floatingShift,
  bubble,
  radius,
) {
  const bg = "var(--color-semantic-inverse-background)";
  if (placement === "top" || placement === "bottom") {
    const a = arrowMainAxis(normalizedAlign, target, "x", floatingShift, bubble, radius, arrowHalf);
    const base = {
      width: arrowHalf * 2,
      height: arrowHeight,
      background: bg,
      transform: a.shift,
      [a.edge]: a.value,
    };
    return placement === "bottom"
      ? { ...base, bottom: "calc(100% - 1px)", clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }
      : { ...base, top: "calc(100% - 1px)", clipPath: "polygon(0 0, 50% 100%, 100% 0)" };
  }

  const a = arrowMainAxis(normalizedAlign, target, "y", floatingShift, bubble, radius, arrowHalf);
  const base = {
    width: arrowHeight,
    height: arrowHalf * 2,
    background: bg,
    transform: a.shift,
    [a.edge]: a.value,
  };
  return placement === "left"
    ? { ...base, left: "calc(100% - 1px)", clipPath: "polygon(0 0, 100% 50%, 0 100%)" }
    : { ...base, right: "calc(100% - 1px)", clipPath: "polygon(100% 0, 0 50%, 100% 100%)" };
}

/* Fluent 2 / Material convention: a pointer that merely crosses a trigger on the
   way somewhere else should not flash a tooltip, so hover gets an enter delay.
   Keyboard focus is deliberate and stays immediate (APG). */
const DEFAULT_DELAY = { open: 250, close: 0 };

function normalizeDelay(delay) {
  if (delay == null) return DEFAULT_DELAY;
  if (typeof delay === "number") return { open: delay, close: 0 };
  return {
    open: delay.open ?? DEFAULT_DELAY.open,
    close: delay.close ?? DEFAULT_DELAY.close,
  };
}

/**
 * LDS Core - Tooltip
 * tooltip with placement, size, arrow alignment, and optional shortcut. The
 * arrow always points at the trigger: for edge-aligned bubbles it is offset
 * back over the target centre rather than drifting to the bubble centre.
 */
export function Tooltip({
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
  const wrapperRef = React.useRef(null);
  const bubbleRef = React.useRef(null);
  const tooltipId = React.useId();
  const getTrigger = React.useCallback(() => findOverlayTrigger(wrapperRef.current), []);
  const floating = useFloatingPosition({
    open: visible,
    anchorRef: wrapperRef,
    panelRef: bubbleRef,
    placement: requestedPlace,
  });
  const place = floating.placement;
  const pos = POS[place] || POS.top;
  const compact = size === "small" || size === "sm";
  const arrowHalf = compact ? 7 : 10;
  const arrowHeight = compact ? 6 : 8;
  const normalizedAlign = normalizeAlign(align);
  /* The arrow is absolutely positioned inside the bubble and deliberately hangs
     past its edge (`top: calc(100% - 1px)` etc.). Any non-visible `overflow` on
     the bubble therefore turns that intended overhang into scrollable content
     and paints a real scrollbar. So the bubble stays `overflow: visible` and the
     scroll clamp for long content lives on an inner content wrapper instead. */
  const bubbleVerticalPadding = compact ? 10 : 16;
  const contentMaxHeight = floating.maxHeight != null
    ? Math.max(0, floating.maxHeight - bubbleVerticalPadding)
    : undefined;

  const bubbleRadius = compact ? 6 : 8;
  const [target, setTarget] = React.useState(null);
  // The bubble is measured too: clamping the arrow to the bubble's flat span
  // needs the bubble's own extent, not just the trigger's.
  const [bubbleBox, setBubbleBox] = React.useState(null);
  const edgeAligned = START_ALIGNS.has(normalizedAlign) || END_ALIGNS.has(normalizedAlign);
  React.useLayoutEffect(() => {
    if (!arrow || !wrapperRef.current) return;
    const node = getTrigger() ?? wrapperRef.current;
    const sameBox = (prev, r) =>
      prev && prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height };
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
  const timerRef = React.useRef(null);
  const clearTimer = React.useCallback(() => {
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  React.useEffect(() => clearTimer, [clearTimer]);
  const schedule = React.useCallback(
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
    [clearTimer, setVisible],
  );

  useLightDismiss({
    open: visible,
    rootRef: wrapperRef,
    getTrigger,
    onDismiss: () => {
      clearTimer();
      setVisible(false);
    },
    outsidePress: false,
  });

  const showTooltip = (event) => {
    onMouseEnter?.(event);
    schedule(true, delays.open);
  };
  const hideTooltip = (event) => {
    onMouseLeave?.(event);
    schedule(false, delays.close);
  };
  // Keyboard focus is intentional — show immediately, no enter delay (APG).
  const showOnFocus = (event) => {
    onFocus?.(event);
    clearTimer();
    setVisible(true);
  };
  const hideOnBlur = (event) => {
    onBlur?.(event);
    if (!event.currentTarget.contains(event.relatedTarget)) {
      clearTimer();
      setVisible(false);
    }
  };
  const validTrigger = React.isValidElement(children) && children.type !== React.Fragment;
  const renderedChildren = validTrigger
    ? React.cloneElement(children, {
        'data-anchored-overlay-trigger': '',
        'aria-describedby': appendAriaReference(children.props['aria-describedby'], tooltipId),
      })
    : children;

  return (
    <span
      ref={wrapperRef}
      {...rest}
      data-anchored-overlay-trigger={validTrigger ? undefined : ''}
      aria-describedby={validTrigger ? undefined : tooltipId}
      /* Never force the wrapper into the tab order. A bare string/fragment child
         is non-interactive content, and APG (plus this component's own rule)
         says a tooltip trigger must be a focusable control the author owns —
         auto-tabbing the wrapper pulled plain text into keyboard navigation. */
      tabIndex={rest.tabIndex}
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showOnFocus}
      onBlur={hideOnBlur}
    >
      {renderedChildren}
      <span
        ref={bubbleRef}
        id={tooltipId}
        role="tooltip"
        aria-hidden={visible ? false : undefined}
        data-placement={place}
        style={{
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
          transition: "opacity var(--dur-fast) var(--ease-out)",
        }}
      >
        {/* Scroll container for long content. Kept separate from the bubble so
            the arrow's intended overhang never becomes scrollable overflow. */}
        <span
          data-lds-tooltip-content
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: compact ? 6 : 8,
            minWidth: 0,
            maxHeight: contentMaxHeight,
            overflowY: contentMaxHeight != null ? "auto" : undefined,
            overflowX: contentMaxHeight != null ? "hidden" : undefined,
          }}
        >
          <span>{content}</span>
          {shortcut != null && (
            <span
              style={{
                color: "var(--color-semantic-inverse-label-alternative-soft)",
                fontWeight: "var(--fw-bold)",
              }}
            >
              {shortcut}
            </span>
          )}
        </span>
        {arrow && (
          <span
            aria-hidden="true"
            style={{
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
                bubbleRadius,
              ),
            }}
          />
        )}
      </span>
    </span>
  );
}
