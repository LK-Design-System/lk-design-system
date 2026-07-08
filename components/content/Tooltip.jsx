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

function arrowStyle(placement, arrowHalf, arrowHeight) {
  const bg = "var(--color-semantic-inverse-background)";
  if (placement === "bottom") {
    return {
      bottom: "calc(100% - 1px)",
      left: "50%",
      width: arrowHalf * 2,
      height: arrowHeight,
      transform: "translateX(-50%)",
      background: bg,
      clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
    };
  }
  if (placement === "left") {
    return {
      left: "calc(100% - 1px)",
      top: "50%",
      width: arrowHeight,
      height: arrowHalf * 2,
      transform: "translateY(-50%)",
      background: bg,
      clipPath: "polygon(0 0, 100% 50%, 0 100%)",
    };
  }
  if (placement === "right") {
    return {
      right: "calc(100% - 1px)",
      top: "50%",
      width: arrowHeight,
      height: arrowHalf * 2,
      transform: "translateY(-50%)",
      background: bg,
      clipPath: "polygon(100% 0, 0 50%, 100% 100%)",
    };
  }
  return {
    top: "calc(100% - 1px)",
    left: "50%",
    width: arrowHalf * 2,
    height: arrowHeight,
    transform: "translateX(-50%)",
    background: bg,
    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
  };
}

/**
 * LDS Core - Tooltip
 * tooltip with placement, size, arrow alignment, and optional shortcut.
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

  return (
    <span
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
              ...arrowStyle(place, arrowHalf, arrowHeight),
            }}
          />
        )}
      </span>
    </span>
  );
}
