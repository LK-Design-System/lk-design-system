import React from "react";

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

function arrowMainAxis(normalizedAlign, target, axis) {
  const size = target ? (axis === "x" ? target.w : target.h) : null;
  const half = axis === "x" ? "translateX" : "translateY";
  const startEdge = axis === "x" ? "left" : "top";
  const endEdge = axis === "x" ? "right" : "bottom";
  const isStart = START_ALIGNS.has(normalizedAlign);
  const isEnd = END_ALIGNS.has(normalizedAlign);
  if (size == null || (!isStart && !isEnd)) {
    return { edge: startEdge, value: "50%", shift: `${half}(-50%)` };
  }
  if (isStart) return { edge: startEdge, value: size / 2, shift: `${half}(-50%)` };
  return { edge: endEdge, value: size / 2, shift: `${half}(50%)` };
}

function arrowStyle(placement, arrowHalf, arrowHeight, normalizedAlign, target) {
  const bg = "var(--color-semantic-inverse-background)";
  if (placement === "top" || placement === "bottom") {
    const a = arrowMainAxis(normalizedAlign, target, "x");
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

  const a = arrowMainAxis(normalizedAlign, target, "y");
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
  open,
  defaultOpen = false,
  children,
  style,
  ...rest
}) {
  const [show, setShow] = React.useState(defaultOpen);
  const visible = open ?? show;
  const place = position || placement || "top";
  const pos = POS[place] || POS.top;
  const compact = size === "small" || size === "sm";
  const arrowHalf = compact ? 7 : 10;
  const arrowHeight = compact ? 6 : 8;
  const normalizedAlign = normalizeAlign(align);

  const wrapperRef = React.useRef(null);
  const [target, setTarget] = React.useState(null);
  const edgeAligned = START_ALIGNS.has(normalizedAlign) || END_ALIGNS.has(normalizedAlign);
  React.useLayoutEffect(() => {
    if (!arrow || !edgeAligned || !wrapperRef.current) return;
    const node = wrapperRef.current;
    const measure = () => {
      const r = node.getBoundingClientRect();
      setTarget((prev) =>
        prev && prev.w === r.width && prev.h === r.height ? prev : { w: r.width, h: r.height }
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [arrow, edgeAligned, place, size]);

  return (
    <span
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      {...rest}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: "absolute",
          ...pos,
          ...bubbleOffset(place, align),
          zIndex: 40,
          pointerEvents: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: compact ? 6 : 8,
          padding: compact ? "5px 8px" : "8px 12px",
          background: "var(--color-semantic-inverse-background)",
          color: "var(--color-semantic-inverse-label)",
          fontFamily: "var(--font-sans)",
          fontSize: compact ? 11.5 : "var(--label1-size)",
          fontWeight: "var(--fw-semibold)",
          letterSpacing: 0,
          lineHeight: compact ? 1.35 : "var(--label1-line)",
          borderRadius: compact ? 6 : 8,
          whiteSpace: "nowrap",
          boxShadow: "var(--shadow-md)",
          opacity: visible ? 1 : 0,
          transition: "opacity var(--dur-fast) var(--ease-out)",
        }}
      >
        <span>{content}</span>
        {shortcut != null && (
          <span
            style={{
              color: "var(--inverse-label-alternative)",
              fontWeight: "var(--fw-bold)",
            }}
          >
            {shortcut}
          </span>
        )}
        {arrow && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              display: "block",
              pointerEvents: "none",
              ...arrowStyle(place, arrowHalf, arrowHeight, normalizedAlign, target),
            }}
          />
        )}
      </span>
    </span>
  );
}
