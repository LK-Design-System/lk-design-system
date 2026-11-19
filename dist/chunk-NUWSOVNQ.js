"use client";
import {
  VIEWER_OVERLAY_SURFACE
} from "./chunk-OQ6XG6EU.js";
import {
  Spinner
} from "./chunk-6ZLQ2VTH.js";
import {
  IconButton
} from "./chunk-XGWWAYSQ.js";
import {
  Icon
} from "./chunk-2ABKRX7D.js";

// components/viz/VideoPlaybackControls.jsx
import React2 from "react";

// packages/core/dist/chunk-5YYTHQDT.js
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
function useSliderStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-slider-css")) return;
    const el = document.createElement("style");
    el.id = "lk-slider-css";
    el.textContent = `
input.lk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;margin-top:0;}
input.lk-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:var(--color-semantic-background-elevated-normal);border:2px solid var(--color-semantic-primary-normal);box-shadow:var(--shadow-control);cursor:pointer;}
input.lk-slider:disabled::-webkit-slider-thumb{border-color:var(--color-semantic-interaction-inactive);cursor:not-allowed;}`;
    document.head.appendChild(el);
  }, []);
}
function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, onChange, disabled = false, showValue = false, style, "aria-label": ariaLabel, ...rest }) {
  useSliderStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = isControlled ? value : internal;
  const set = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const pct = (val - min) / (max - min) * 100;
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3-5)", ...style }, children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        className: "lk-slider",
        type: "range",
        "aria-label": ariaLabel ?? "\uAC12 \uC870\uC808",
        min,
        max,
        step,
        value: val,
        disabled,
        onChange: (e) => set(Number(e.target.value)),
        style: {
          flex: 1,
          WebkitAppearance: "none",
          appearance: "none",
          height: 6,
          borderRadius: "var(--radius-pill)",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          background: `linear-gradient(to right, var(--color-semantic-primary-normal) 0%, var(--color-semantic-primary-normal) ${pct}%, var(--color-semantic-fill-strong) ${pct}%, var(--color-semantic-fill-strong) 100%)`
        },
        ...rest
      }
    ),
    showValue && /* @__PURE__ */ jsx("span", { style: { minWidth: 36, textAlign: "right", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: val })
  ] });
}

// components/viz/VideoPlaybackControls.jsx
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var useClientLayoutEffect = typeof window === "undefined" ? React2.useEffect : React2.useLayoutEffect;
function timeText(value) {
  if (!Number.isFinite(value) || value < 0) return "\u2014";
  const seconds = Math.floor(value);
  const hours = Math.floor(seconds / 3600);
  return `${hours ? `${hours}:` : ""}${String(Math.floor(seconds / 60) % 60).padStart(hours ? 2 : 1, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
function spokenTime(value) {
  if (!Number.isFinite(value) || value < 0) return "\uC2DC\uAC04 \uBBF8\uD655\uC778";
  const seconds = Math.floor(value);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return `${hours ? `${hours}\uC2DC\uAC04 ` : ""}${minutes ? `${minutes}\uBD84 ` : ""}${seconds % 60}\uCD08`;
}
var SURFACES = {
  minimal: { background: "transparent", border: "none", borderRadius: 0 },
  surface: {
    background: "var(--color-semantic-background-elevated-normal)",
    border: "var(--border-thin) solid var(--color-semantic-line-solid-normal)",
    borderRadius: "var(--radius-md)"
  },
  "on-dark": {
    background: VIEWER_OVERLAY_SURFACE.strong.surface,
    border: VIEWER_OVERLAY_SURFACE.strong.border,
    borderRadius: "var(--radius-md)",
    backdropFilter: VIEWER_OVERLAY_SURFACE.strong.blur
  }
};
function VideoPlaybackControls({
  currentTime = 0,
  duration,
  playing = false,
  muted = false,
  fullscreen = false,
  loading = false,
  disabled = false,
  seekDisabled = false,
  onPlayingChange,
  onSeek,
  onMutedChange,
  onFullscreenChange,
  appearance = "on-dark",
  variant = "standalone",
  label = "\uC601\uC0C1 \uC7AC\uC0DD \uC870\uC791",
  style,
  className,
  ...rootProps
}) {
  const [preview, setPreview] = React2.useState(null);
  const [compactClock, setCompactClock] = React2.useState(false);
  const rootRef = React2.useRef(null);
  const drag = React2.useRef(null);
  const callbacks = React2.useRef({ onSeek, disabled, seekDisabled, duration });
  callbacks.current = { onSeek, disabled, seekDisabled, duration };
  const hasDuration = Number.isFinite(duration) && duration > 0;
  const canSeek = hasDuration && !disabled && !seekDisabled && typeof onSeek === "function";
  const elapsed = Math.max(0, Number.isFinite(currentTime) ? currentTime : 0);
  const position = hasDuration ? Math.min(duration, elapsed) : elapsed;
  const shownTime = preview ?? position;
  const resolvedAppearance = SURFACES[appearance] ? appearance : "on-dark";
  const onDark = resolvedAppearance === "on-dark";
  const commandStyle = { flex: "0 0 auto", width: 28, height: 28, padding: 0 };
  useClientLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const update = () => setCompactClock(node.getBoundingClientRect().width < 380);
    update();
    const Observer = node.ownerDocument.defaultView?.ResizeObserver;
    const observer = Observer ? new Observer(update) : null;
    observer?.observe(node);
    return () => observer?.disconnect();
  }, []);
  React2.useEffect(() => {
    const finish = (event) => {
      const active = drag.current;
      if (!active || event.pointerId !== active.pointerId) return;
      drag.current = null;
      setPreview(null);
      const state = callbacks.current;
      if (!state.disabled && !state.seekDisabled && Number.isFinite(state.duration) && state.duration > 0) {
        state.onSeek?.(Math.max(0, Math.min(state.duration, active.value)));
      }
    };
    const cancel = (event) => {
      if (event.type === "pointercancel" && event.pointerId !== drag.current?.pointerId) return;
      drag.current = null;
      setPreview(null);
    };
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("blur", cancel);
    return () => {
      drag.current = null;
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("blur", cancel);
    };
  }, []);
  React2.useEffect(() => {
    if (!canSeek) {
      drag.current = null;
      setPreview(null);
    }
  }, [canSeek]);
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      ...rootProps,
      ref: rootRef,
      role: "group",
      "aria-label": label,
      "aria-busy": loading || void 0,
      "data-theme": onDark ? "dark" : rootProps["data-theme"],
      "data-video-playback-appearance": resolvedAppearance,
      "data-video-playback-variant": variant,
      className: ["lk-video-playback-controls", className].filter(Boolean).join(" "),
      style: {
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: "28px minmax(0, 1fr) auto auto auto",
        alignItems: "center",
        gap: "var(--space-1)",
        padding: "var(--space-1)",
        color: onDark ? VIEWER_OVERLAY_SURFACE.strong.ink : "var(--color-semantic-label-normal)",
        "--viewer-foreground": onDark ? VIEWER_OVERLAY_SURFACE.strong.ink : "var(--color-semantic-label-normal)",
        ...SURFACES[resolvedAppearance],
        ...variant === "embedded" ? { border: 0, borderRadius: 0, boxShadow: "none" } : null,
        ...style
      },
      children: [
        /* @__PURE__ */ jsx2(
          IconButton,
          {
            variant: "plain",
            size: 28,
            round: false,
            label: playing ? "\uC601\uC0C1 \uC77C\uC2DC \uC815\uC9C0" : "\uC601\uC0C1 \uC7AC\uC0DD",
            disabled: disabled || !onPlayingChange,
            onClick: () => onPlayingChange?.(!playing),
            style: commandStyle,
            children: loading ? /* @__PURE__ */ jsx2(Spinner, { size: 16, color: "currentColor", "aria-hidden": "true" }) : /* @__PURE__ */ jsx2(Icon, { name: playing ? "pause" : "play", size: 16 })
          }
        ),
        /* @__PURE__ */ jsx2(
          Slider,
          {
            "aria-label": "\uC601\uC0C1 \uC7AC\uC0DD \uC704\uCE58",
            "aria-valuetext": hasDuration ? `${spokenTime(shownTime)}, \uC804\uCCB4 ${spokenTime(duration)}` : `\uD604\uC7AC ${spokenTime(shownTime)}, \uC804\uCCB4 \uC2DC\uAC04 \uBBF8\uD655\uC778, \uD0D0\uC0C9 \uBD88\uAC00`,
            min: 0,
            max: hasDuration ? duration : 1,
            step: 0.1,
            value: hasDuration ? shownTime : 0,
            disabled: !canSeek,
            style: { width: "100%", minWidth: 0, paddingBlock: "var(--space-2)" },
            onPointerDown: (event) => {
              if (canSeek && event.isPrimary && event.button === 0) drag.current = { pointerId: event.pointerId, value: position };
            },
            onLostPointerCapture: () => {
              drag.current = null;
              setPreview(null);
            },
            onBlur: () => {
              drag.current = null;
              setPreview(null);
            },
            onChange: (value) => {
              if (!canSeek) return;
              const next = Math.max(0, Math.min(duration, value));
              if (drag.current != null) {
                drag.current.value = next;
                setPreview(next);
              } else onSeek(next);
            }
          }
        ),
        /* @__PURE__ */ jsxs2("span", { "data-video-playback-time": "", "aria-hidden": "true", title: `${timeText(shownTime)} / ${timeText(hasDuration ? duration : null)}`, style: {
          minWidth: 0,
          maxWidth: "100%",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--caption1-size)",
          lineHeight: "var(--caption1-line)",
          fontVariantNumeric: "tabular-nums"
        }, children: [
          timeText(shownTime),
          !compactClock && /* @__PURE__ */ jsxs2(Fragment, { children: [
            " / ",
            timeText(hasDuration ? duration : null)
          ] })
        ] }),
        onMutedChange && /* @__PURE__ */ jsx2(
          IconButton,
          {
            variant: "plain",
            size: 28,
            round: false,
            label: muted ? "\uC74C\uC18C\uAC70 \uD574\uC81C" : "\uC74C\uC18C\uAC70",
            disabled,
            onClick: () => onMutedChange(!muted),
            style: commandStyle,
            children: /* @__PURE__ */ jsx2(Icon, { name: muted ? "volume-x" : "volume-2", size: 16 })
          }
        ),
        onFullscreenChange && /* @__PURE__ */ jsx2(
          IconButton,
          {
            variant: "plain",
            size: 28,
            round: false,
            label: fullscreen ? "\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC" : "\uC804\uCCB4 \uD654\uBA74",
            disabled,
            onClick: () => onFullscreenChange(!fullscreen),
            style: commandStyle,
            children: /* @__PURE__ */ jsx2(Icon, { name: "maximize", size: 16 })
          }
        )
      ]
    }
  );
}

export {
  VideoPlaybackControls
};
//# sourceMappingURL=chunk-NUWSOVNQ.js.map