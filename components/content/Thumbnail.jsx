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

/* Overlay text sits directly on unknown imagery, so a photo can slide the
   effective contrast anywhere. A one-sided gradient scrim (the Material/YouTube
   convention) guarantees a dark base under the overlay corner without dimming
   the subject. Uses --material-control-dimmer so light and dark themes share
   one ramp. */
const SCRIM = {
  "top-left": "linear-gradient(to bottom, var(--material-control-dimmer), transparent 46%)",
  "top-right": "linear-gradient(to bottom, var(--material-control-dimmer), transparent 46%)",
  "bottom-left": "linear-gradient(to top, var(--material-control-dimmer), transparent 46%)",
  "bottom-right": "linear-gradient(to top, var(--material-control-dimmer), transparent 46%)",
  center: "radial-gradient(closest-side, var(--material-control-dimmer), transparent)",
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
  border = true,
  fit = "cover",
  overlay,
  overlayAlign = "top-left",
  overlayScrim = "auto",
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
    border === true ? "1px solid var(--color-semantic-line-normal-normal)" : border || "0";
  const pos = ALIGN[overlayAlign] || ALIGN["top-left"];
  const hasOverlay = overlay || children;
  /* "auto" scrims only when real imagery is behind the overlay — a placeholder
     tile is a flat token surface whose contrast is already known. */
  const showScrim = hasOverlay && (overlayScrim === "auto" ? !!src : !!overlayScrim);

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
        background: "var(--color-semantic-fill-normal)",
        color: "var(--color-semantic-label-assistive)",
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
      {showScrim && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: SCRIM[overlayAlign] || SCRIM["top-left"],
          }}
        />
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
