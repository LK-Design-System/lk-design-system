"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk2NP74HUDcjs = require('./chunk-2NP74HUD.cjs');


var _chunkEWU3IXB2cjs = require('./chunk-EWU3IXB2.cjs');


var _chunkP65KUIKJcjs = require('./chunk-P65KUIKJ.cjs');


var _chunkCJUHIK6Xcjs = require('./chunk-CJUHIK6X.cjs');

// components/viz/VideoPlaybackControls.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);

// packages/core/dist/chunk-5YYTHQDT.js

var _jsxruntime = require('react/jsx-runtime');
function useSliderStyles() {
  _react2.default.useEffect(() => {
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
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const val = isControlled ? value : internal;
  const set = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const pct = (val - min) / (max - min) * 100;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-3-5)", ...style }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "input",
      {
        className: "lk-slider",
        type: "range",
        "aria-label": _nullishCoalesce(ariaLabel, () => ( "\uAC12 \uC870\uC808")),
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
    showValue && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 36, textAlign: "right", fontFamily: "var(--font-sans)", fontSize: "var(--label1-size)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-neutral)", fontVariantNumeric: "tabular-nums" }, children: val })
  ] });
}

// components/viz/VideoPlaybackControls.jsx

var SEEK_TARGET_STYLES = `
  .lk-video-playback-controls [data-video-playback-seek] {
    height: var(--space-6) !important;
    background-size: 100% var(--space-1-5) !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
  }
`;
var useClientLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
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
    background: _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.surface,
    border: _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.border,
    borderRadius: "var(--radius-md)",
    backdropFilter: _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.blur
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
  const [preview, setPreview] = _react2.default.useState(null);
  const [compactClock, setCompactClock] = _react2.default.useState(false);
  const rootRef = _react2.default.useRef(null);
  const drag = _react2.default.useRef(null);
  const callbacks = _react2.default.useRef({ onSeek, disabled, seekDisabled, duration });
  callbacks.current = { onSeek, disabled, seekDisabled, duration };
  const hasDuration = Number.isFinite(duration) && duration > 0;
  const canSeek = hasDuration && !disabled && !seekDisabled && typeof onSeek === "function";
  const elapsed = Math.max(0, Number.isFinite(currentTime) ? currentTime : 0);
  const position = hasDuration ? Math.min(duration, elapsed) : elapsed;
  const shownTime = _nullishCoalesce(preview, () => ( position));
  const resolvedAppearance = SURFACES[appearance] ? appearance : "on-dark";
  const onDark = resolvedAppearance === "on-dark";
  const commandStyle = { flex: "0 0 auto", width: 28, height: 28, padding: 0 };
  useClientLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const update = () => setCompactClock(node.getBoundingClientRect().width < 380);
    update();
    const Observer = _optionalChain([node, 'access', _ => _.ownerDocument, 'access', _2 => _2.defaultView, 'optionalAccess', _3 => _3.ResizeObserver]);
    const observer = Observer ? new Observer(update) : null;
    _optionalChain([observer, 'optionalAccess', _4 => _4.observe, 'call', _5 => _5(node)]);
    return () => _optionalChain([observer, 'optionalAccess', _6 => _6.disconnect, 'call', _7 => _7()]);
  }, []);
  _react2.default.useEffect(() => {
    const finish = (event) => {
      const active = drag.current;
      if (!active || event.pointerId !== active.pointerId) return;
      drag.current = null;
      setPreview(null);
      const state = callbacks.current;
      if (!state.disabled && !state.seekDisabled && Number.isFinite(state.duration) && state.duration > 0) {
        _optionalChain([state, 'access', _8 => _8.onSeek, 'optionalCall', _9 => _9(Math.max(0, Math.min(state.duration, active.value)))]);
      }
    };
    const cancel = (event) => {
      if (event.type === "pointercancel" && event.pointerId !== _optionalChain([drag, 'access', _10 => _10.current, 'optionalAccess', _11 => _11.pointerId])) return;
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
  _react2.default.useEffect(() => {
    if (!canSeek) {
      drag.current = null;
      setPreview(null);
    }
  }, [canSeek]);
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
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
        color: onDark ? _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.ink : "var(--color-semantic-label-normal)",
        "--viewer-foreground": onDark ? _chunk2NP74HUDcjs.VIEWER_OVERLAY_SURFACE.strong.ink : "var(--color-semantic-label-normal)",
        ...SURFACES[resolvedAppearance],
        ...variant === "embedded" ? { border: 0, borderRadius: 0, boxShadow: "none" } : null,
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: SEEK_TARGET_STYLES }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkP65KUIKJcjs.IconButton,
          {
            variant: "plain",
            size: 28,
            round: false,
            label: playing ? "\uC601\uC0C1 \uC77C\uC2DC \uC815\uC9C0" : "\uC601\uC0C1 \uC7AC\uC0DD",
            disabled: disabled || !onPlayingChange,
            onClick: () => _optionalChain([onPlayingChange, 'optionalCall', _12 => _12(!playing)]),
            style: commandStyle,
            children: loading ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkEWU3IXB2cjs.Spinner, { size: 16, color: "currentColor", "aria-hidden": "true" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCJUHIK6Xcjs.Icon, { name: playing ? "pause" : "play", size: 16 })
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          Slider,
          {
            "data-video-playback-seek": "",
            "aria-label": "\uC601\uC0C1 \uC7AC\uC0DD \uC704\uCE58",
            "aria-valuetext": hasDuration ? `${spokenTime(shownTime)}, \uC804\uCCB4 ${spokenTime(duration)}` : `\uD604\uC7AC ${spokenTime(shownTime)}, \uC804\uCCB4 \uC2DC\uAC04 \uBBF8\uD655\uC778, \uD0D0\uC0C9 \uBD88\uAC00`,
            min: 0,
            max: hasDuration ? duration : 1,
            step: 0.1,
            value: hasDuration ? shownTime : 0,
            disabled: !canSeek,
            style: { width: "100%", minWidth: 0 },
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
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "data-video-playback-time": "", "aria-hidden": "true", title: `${timeText(shownTime)} / ${timeText(hasDuration ? duration : null)}`, style: {
          minWidth: 0,
          maxWidth: "100%",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--caption1-size)",
          lineHeight: "var(--caption1-line)",
          fontVariantNumeric: "tabular-nums"
        }, children: [
          timeText(shownTime),
          !compactClock && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
            " / ",
            timeText(hasDuration ? duration : null)
          ] })
        ] }),
        onMutedChange && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkP65KUIKJcjs.IconButton,
          {
            variant: "plain",
            size: 28,
            round: false,
            label: muted ? "\uC74C\uC18C\uAC70 \uD574\uC81C" : "\uC74C\uC18C\uAC70",
            disabled,
            onClick: () => onMutedChange(!muted),
            style: commandStyle,
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCJUHIK6Xcjs.Icon, { name: muted ? "volume-x" : "volume-2", size: 16 })
          }
        ),
        onFullscreenChange && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunkP65KUIKJcjs.IconButton,
          {
            variant: "plain",
            size: 28,
            round: false,
            label: fullscreen ? "\uC804\uCCB4 \uD654\uBA74 \uC885\uB8CC" : "\uC804\uCCB4 \uD654\uBA74",
            disabled,
            onClick: () => onFullscreenChange(!fullscreen),
            style: commandStyle,
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkCJUHIK6Xcjs.Icon, { name: "maximize", size: 16 })
          }
        )
      ]
    }
  );
}



exports.VideoPlaybackControls = VideoPlaybackControls;
//# sourceMappingURL=chunk-BRJX2HID.cjs.map