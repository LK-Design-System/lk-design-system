import React from "react";
import { Icon } from "../icon/Icon.jsx";

const toLen = (v) => (typeof v === "number" ? v + "px" : v);

const ALIGN = {
  "top-left": { top: 8, left: 8 },
  "top-right": { top: 8, right: 8 },
  "bottom-left": { bottom: 8, left: 8 },
  "bottom-right": { bottom: 8, right: 8 },
  center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
};

const THUMBNAIL_RATIOS = {
  "1/1": "var(--ratio-1-1)",
  "5/4": "var(--ratio-5-4)",
  "4/3": "var(--ratio-4-3)",
  "3/2": "var(--ratio-3-2)",
  "16/10": "var(--ratio-16-10)",
  "1.618/1": "var(--ratio-golden)",
  "16/9": "var(--ratio-16-9)",
  "2/1": "var(--ratio-2-1)",
  "21/9": "var(--ratio-21-9)",
  "4/5": "var(--ratio-4-5)",
  "3/4": "var(--ratio-3-4)",
  "2/3": "var(--ratio-2-3)",
  "10/16": "var(--ratio-10-16)",
  "1/1.618": "var(--ratio-golden-vertical)",
  "9/16": "var(--ratio-9-16)",
  "1/2": "var(--ratio-1-2)",
  "9/21": "var(--ratio-9-21)",
};

function resolveRatio(ratio) {
  if (typeof ratio === "number") return String(ratio);
  if (typeof ratio === "string")
    return THUMBNAIL_RATIOS[ratio] || ratio.replace("/", " / ");
  return "var(--ratio-1-1)";
}

/**
 * LK ROBOTICS — Thumbnail
 * thumbnail media tile: fixed ratio, optional radius, optional border, and
 * an overlay slot. Missing images render a neutral placeholder glyph.
 */
export function Thumbnail({
  src,
  alt = "",
  ratio = "1/1",
  radius = true,
  border = false,
  fit = "cover",
  overlay,
  overlayAlign = "top-left",
  placeholder = true,
  placeholderIcon = "image",
  style,
  children,
  ...rest
}) {
  const r =
    radius === true
      ? "var(--radius-md)"
      : radius === false
        ? "0"
        : toLen(radius);
  const borderStyle =
    border === true ? "1px solid var(--border-subtle)" : border || "0";
  const pos = ALIGN[overlayAlign] || ALIGN["top-left"];
  const hasOverlay = overlay || children;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: resolveRatio(ratio),
        overflow: "hidden",
        borderRadius: r,
        border: borderStyle,
        boxSizing: "border-box",
        background: "var(--fill-normal)",
        color: "var(--label-assistive)",
        ...style,
      }}
      {...rest}
    >
      {src && (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: fit,
            display: "block",
          }}
        />
      )}
      {!src && placeholder && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
          }}
        >
          <Icon name={placeholderIcon} size={Math.min(32, Math.max(18, 24))} />
        </span>
      )}
      {hasOverlay && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            gap: 6,
            alignItems: "center",
            ...pos,
          }}
        >
          {overlay}
          {children}
        </div>
      )}
    </div>
  );
}
