"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkLSFIK54Ocjs = require('./chunk-LSFIK54O.cjs');


var _chunkKUMT7S4Kcjs = require('./chunk-KUMT7S4K.cjs');


var _chunk3ECMDGKZcjs = require('./chunk-3ECMDGKZ.cjs');


var _chunk3BBCS67Wcjs = require('./chunk-3BBCS67W.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/robotics/ManualControlSession.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var LINK_LABELS = {
  ready: "\uC5F0\uACB0 \uC900\uBE44\uB428",
  stale: "\uC5F0\uACB0 \uC815\uBCF4 \uC624\uB798\uB428",
  lost: "\uC5F0\uACB0 \uB04A\uAE40"
};
var AUTHORITY_LABELS = {
  checking: "\uAD8C\uD55C \uD655\uC778 \uC911",
  granted: "\uAD8C\uD55C \uBD80\uC5EC\uB428",
  denied: "\uAD8C\uD55C \uAC70\uBD80\uB428",
  revoked: "\uAD8C\uD55C \uD68C\uC218\uB428"
};
var LINK_CONNECTION_STATUS = {
  ready: "ready",
  stale: "stale",
  lost: "offline"
};
var CONTROL_MODE_LABELS = {
  pointer: "\uD3EC\uC778\uD130",
  keyboard: "\uD0A4\uBCF4\uB4DC",
  hybrid: "\uD3EC\uC778\uD130 + \uD0A4\uBCF4\uB4DC"
};
var GUARD_STATUS = {
  "link-unavailable": {
    tone: "negative",
    title: "\uC81C\uC5B4 \uC5F0\uACB0 \uC5C6\uC74C",
    message: "\uC5F0\uACB0\uC774 \uBCF5\uAD6C\uB418\uBA74 \uC218\uB3D9 \uC81C\uC5B4\uB97C \uB2E4\uC2DC \uC900\uBE44\uD558\uC138\uC694."
  },
  "authority-unavailable": {
    tone: "negative",
    title: "\uC81C\uC5B4 \uAD8C\uD55C \uC5C6\uC74C",
    message: "\uC11C\uBC84\uC5D0\uC11C \uC774 \uC138\uC158\uC5D0 \uC81C\uC5B4 \uAD8C\uD55C\uC744 \uBD80\uC5EC\uD558\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4."
  },
  disarmed: {
    tone: "signal",
    title: "\uC218\uB3D9 \uC81C\uC5B4 \uC7A0\uAE40 \u2014 \uC544\uB798\uC5D0\uC11C \uC218\uB3D9 \uC81C\uC5B4\uB97C \uC900\uBE44\uD558\uC138\uC694",
    message: null
  },
  "deadman-released": {
    tone: "cautionary",
    title: "\uC678\uBD80 \uD65C\uC131\uD654 \uC785\uB825 \uB300\uAE30",
    message: "\uC5F0\uACB0\uB41C \uD65C\uC131\uD654 \uC7A5\uCE58\uB97C \uACC4\uC18D \uC720\uC9C0\uD558\uB294 \uB3D9\uC548\uB9CC \uC81C\uC5B4 \uBA85\uB839\uC744 \uBCF4\uB0BC \uC218 \uC788\uC2B5\uB2C8\uB2E4."
  },
  "focus-lost": {
    tone: "cautionary",
    title: "\uC81C\uC5B4 \uD3EC\uCEE4\uC2A4 \uD574\uC81C",
    message: "\uC81C\uC5B4 \uC601\uC5ED\uC744 \uB2E4\uC2DC \uC120\uD0DD\uD574 \uD3EC\uCEE4\uC2A4\uB97C \uBCF5\uAD6C\uD558\uC138\uC694."
  }
};
var STALE_LINK_STATUS = {
  tone: "cautionary",
  title: "\uC5F0\uACB0 \uC0C1\uD0DC \uC810\uAC80 \uD544\uC694",
  message: "\uCD5C\uC2E0 \uC5F0\uACB0 \uC0C1\uD0DC\uAC00 \uD655\uC778\uB420 \uB54C\uAE4C\uC9C0 \uC81C\uC5B4 \uBA85\uB839\uC744 \uBCF4\uB0B4\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4."
};
var CHECKING_AUTHORITY_STATUS = {
  tone: "cautionary",
  title: "\uC81C\uC5B4 \uAD8C\uD55C \uD655\uC778 \uC911",
  message: "\uAD8C\uD55C \uD655\uC778\uC774 \uB05D\uB0A0 \uB54C\uAE4C\uC9C0 \uC218\uB3D9 \uC81C\uC5B4\uB97C \uC900\uBE44\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."
};
var READY_STATUS = {
  tone: "positive",
  title: "\uC218\uB3D9 \uC81C\uC5B4 \uAC00\uB2A5",
  message: null
};
var REARM_STATUS = {
  tone: "cautionary",
  title: "\uC218\uB3D9 \uC81C\uC5B4 \uC7AC\uD65C\uC131\uD654 \uD544\uC694",
  message: "\uC815\uC9C0 \uC694\uCCAD \uC774\uD6C4\uC5D0\uB294 \uC218\uB3D9 \uC81C\uC5B4\uB97C \uD574\uC81C\uD55C \uB4A4 \uB2E4\uC2DC \uC900\uBE44\uD558\uC138\uC694."
};
var STOP_REQUEST_STATUS = {
  requesting: {
    tone: "signal",
    title: "\uC6B4\uD589 \uC815\uC9C0 \uC694\uCCAD \uC804\uC1A1 \uC911",
    message: "\uB85C\uBD07\uC774 \uC694\uCCAD\uC744 \uC218\uC2E0\uD588\uB294\uC9C0 \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4."
  },
  acknowledged: {
    tone: "cautionary",
    title: "\uC6B4\uD589 \uC815\uC9C0 \uC694\uCCAD \uC218\uC2E0\uB428",
    message: "\uC694\uCCAD\uC740 \uC218\uC2E0\uB410\uC9C0\uB9CC \uC2E4\uC81C \uC815\uC9C0\uB294 \uC544\uC9C1 \uD655\uC778\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4."
  },
  stopped: {
    tone: "positive",
    title: "\uC6B4\uD589 \uC815\uC9C0 \uD655\uC778\uB428",
    message: null
  },
  failed: {
    tone: "negative",
    title: "\uC6B4\uD589 \uC815\uC9C0 \uC694\uCCAD \uC2E4\uD328",
    message: "\uB85C\uBD07\uC758 \uC2E4\uC81C \uC0C1\uD0DC\uB97C \uD655\uC778\uD55C \uB4A4 \uB2E4\uC2DC \uC694\uCCAD\uD558\uC138\uC694."
  }
};
var STOP_BUTTON_LABELS = {
  requesting: "\uC815\uC9C0 \uC694\uCCAD \uC804\uC1A1 \uC911",
  acknowledged: "\uC815\uC9C0 \uC694\uCCAD \uC218\uC2E0\uB428",
  stopped: "\uC6B4\uD589 \uC815\uC9C0 \uD655\uC778\uB428",
  failed: "\uC6B4\uD589 \uC815\uC9C0 \uB2E4\uC2DC \uC694\uCCAD"
};
function releaseReason({ linkReady, authorityGranted, armed, deadmanRequired, deadmanActive, focusSatisfied, windowActive }) {
  if (!linkReady) return "link-unavailable";
  if (!authorityGranted) return "authority-unavailable";
  if (!armed) return "disarmed";
  if (deadmanRequired && !deadmanActive) return "deadman-released";
  if (!windowActive || !focusSatisfied) return "focus-lost";
  return null;
}
function guardStatus(reason, { linkState, authority }) {
  if (reason === "link-unavailable" && linkState === "stale") return STALE_LINK_STATUS;
  if (reason === "authority-unavailable" && authority === "checking") return CHECKING_AUTHORITY_STATUS;
  return reason == null ? READY_STATUS : GUARD_STATUS[reason] || GUARD_STATUS.disarmed;
}
function statusTone(value, positiveValue) {
  if (value === positiveValue) return "signal";
  if (value === "checking" || value === "stale") return "cautionary";
  return "negative";
}
function normalizeStopRequestState(value) {
  return value === "requesting" || value === "acknowledged" || value === "stopped" || value === "failed" ? value : "idle";
}
function ManualControlSession({
  title = "\uC218\uB3D9 \uC81C\uC5B4 \uC138\uC158",
  headingLevel = 2,
  linkState = "lost",
  authority = "checking",
  armed = false,
  deadmanRequired = true,
  deadmanActive = false,
  controlMode = "pointer",
  focusRequired = false,
  sessionMeta,
  deadmanControl,
  stopRequestState,
  stopRequestMessage,
  stopRequestLabel = "\uC6B4\uD589 \uC815\uC9C0 \uC694\uCCAD",
  onArmedChange,
  onSafetyReleaseRequest,
  onStopRequest,
  onEmergencyStopRequest,
  onFocusChange,
  children,
  onFocus,
  onBlur,
  style,
  ...rest
}) {
  const [focused, setFocused] = _react2.default.useState(false);
  const [windowActive, setWindowActive] = _react2.default.useState(true);
  const [stopRequestedLocally, setStopRequestedLocally] = _react2.default.useState(false);
  const [stopRearmRequired, setStopRearmRequired] = _react2.default.useState(false);
  const controlsRef = _react2.default.useRef(null);
  const generatedId = _react2.default.useId().replace(/:/g, "");
  const titleId = `manual-control-title-${generatedId}`;
  const statusId = `manual-control-status-${generatedId}`;
  const normalizedHeadingLevel = Math.min(6, Math.max(2, Number(headingLevel) || 2));
  const Heading = `h${normalizedHeadingLevel}`;
  const stopStateControlled = stopRequestState !== void 0;
  const normalizedStopState = normalizeStopRequestState(stopRequestState);
  const displayStopState = stopRequestedLocally && (normalizedStopState === "idle" || normalizedStopState === "failed") ? "requesting" : normalizedStopState;
  const stopCycleActive = displayStopState !== "idle";
  const stopBlockActive = stopCycleActive || stopRearmRequired;
  const stopCallback = onStopRequest || onEmergencyStopRequest;
  const linkReady = linkState === "ready";
  const authorityGranted = authority === "granted";
  const focusSatisfied = !focusRequired || controlMode === "pointer" || focused;
  const baseReason = releaseReason({ linkReady, authorityGranted, armed, deadmanRequired, deadmanActive, focusSatisfied, windowActive });
  const reason = stopBlockActive ? "stop-requested" : baseReason;
  const interactionEnabled = reason == null;
  const baseGuard = guardStatus(baseReason, { linkState, authority });
  const stopGuard = STOP_REQUEST_STATUS[displayStopState];
  const guard = stopGuard ? { ...stopGuard, message: _nullishCoalesce(stopRequestMessage, () => ( stopGuard.message)) } : stopRearmRequired ? REARM_STATUS : baseGuard;
  const latestEnabled = _react2.default.useRef(interactionEnabled);
  const previousEnabled = _react2.default.useRef(interactionEnabled);
  const previousStopState = _react2.default.useRef(normalizedStopState);
  const releaseRequest = _react2.default.useRef(onSafetyReleaseRequest);
  const armedChange = _react2.default.useRef(onArmedChange);
  _react2.default.useEffect(() => {
    latestEnabled.current = interactionEnabled;
    releaseRequest.current = onSafetyReleaseRequest;
    armedChange.current = onArmedChange;
  });
  _react2.default.useEffect(() => {
    if (previousEnabled.current && !interactionEnabled && reason != null) {
      _optionalChain([releaseRequest, 'access', _ => _.current, 'optionalCall', _2 => _2(reason)]);
      if (reason === "link-unavailable" || reason === "authority-unavailable" || reason === "focus-lost" || reason === "stop-requested") {
        _optionalChain([armedChange, 'access', _3 => _3.current, 'optionalCall', _4 => _4(false)]);
      }
    }
    previousEnabled.current = interactionEnabled;
  }, [interactionEnabled, reason]);
  _react2.default.useEffect(() => {
    if ((previousStopState.current !== "idle" || !stopStateControlled && !armed) && normalizedStopState === "idle" && stopRequestedLocally) {
      setStopRequestedLocally(false);
    } else if (normalizedStopState !== "idle" && stopRequestedLocally) {
      setStopRequestedLocally(false);
    }
    previousStopState.current = normalizedStopState;
  }, [armed, normalizedStopState, stopRequestedLocally, stopStateControlled]);
  _react2.default.useEffect(() => {
    if (normalizedStopState !== "idle") {
      setStopRearmRequired(true);
    } else if (stopRearmRequired && !armed) {
      setStopRearmRequired(false);
    }
  }, [armed, normalizedStopState, stopRearmRequired]);
  _react2.default.useEffect(() => {
    const handleWindowBlur = () => setWindowActive(false);
    const handleWindowFocus = () => setWindowActive(true);
    const handleVisibility = () => setWindowActive(document.visibilityState === "visible");
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);
  _react2.default.useEffect(() => () => {
    if (latestEnabled.current) _optionalChain([releaseRequest, 'access', _5 => _5.current, 'optionalCall', _6 => _6("unmount")]);
  }, []);
  _react2.default.useEffect(() => {
    if (!interactionEnabled && _optionalChain([controlsRef, 'access', _7 => _7.current, 'optionalAccess', _8 => _8.contains, 'call', _9 => _9(document.activeElement)])) {
      _optionalChain([document, 'access', _10 => _10.activeElement, 'optionalAccess', _11 => _11.blur, 'call', _12 => _12()]);
    }
  }, [interactionEnabled]);
  const setFocusState = (next) => {
    setFocused(next);
    _optionalChain([onFocusChange, 'optionalCall', _13 => _13(next)]);
  };
  const blockReason = interactionEnabled ? null : guard.message || guard.title;
  const renderedControls = typeof children === "function" ? children({ interactionEnabled, blockReason, focused, controlMode, stopRequestState: displayStopState }) : children;
  const canRequestArm = linkReady && authorityGranted && !stopBlockActive;
  const stopRequestDisabled = typeof stopCallback !== "function" || displayStopState === "requesting" || displayStopState === "acknowledged" || displayStopState === "stopped";
  const requestStop = () => {
    if (stopRequestDisabled) return;
    setStopRequestedLocally(true);
    setStopRearmRequired(true);
    if (interactionEnabled) {
      previousEnabled.current = false;
      latestEnabled.current = false;
      _optionalChain([releaseRequest, 'access', _14 => _14.current, 'optionalCall', _15 => _15("stop-requested")]);
    }
    _optionalChain([armedChange, 'access', _16 => _16.current, 'optionalCall', _17 => _17(false)]);
    _optionalChain([stopCallback, 'optionalCall', _18 => _18()]);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "section",
    {
      "aria-labelledby": titleId,
      tabIndex: focusRequired && controlMode !== "pointer" ? 0 : void 0,
      onFocus: (event) => {
        setFocusState(true);
        _optionalChain([onFocus, 'optionalCall', _19 => _19(event)]);
      },
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusState(false);
        _optionalChain([onBlur, 'optionalCall', _20 => _20(event)]);
      },
      style: {
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        overflow: "hidden",
        border: "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        background: "var(--color-semantic-background-elevated-normal)",
        boxShadow: focused && controlMode !== "pointer" ? "0 0 0 4px var(--color-semantic-focus-ring)" : "var(--component-card-shadow-sm)",
        fontFamily: "var(--font-sans)",
        outline: "none",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "header", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap", padding: "var(--space-4) var(--space-5)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-1)", minWidth: 0, flex: "1 1 180px" }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, Heading, { id: titleId, style: { margin: 0, color: "var(--color-semantic-label-strong)", fontSize: "var(--body1-size)", lineHeight: "var(--body1-line)", fontWeight: "var(--fw-bold)", overflowWrap: "anywhere" }, children: title }),
            sessionMeta != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-semibold)", overflowWrap: "anywhere" }, children: sessionMeta })
          ] }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-3)", flex: "10 1 350px", minWidth: 0, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "aria-label": "\uC81C\uC5B4 \uC804\uC81C\uC870\uAC74", style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", minWidth: 0, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkLSFIK54Ocjs.ConnectionBadge, { status: LINK_CONNECTION_STATUS[linkState] || "offline", label: LINK_LABELS[linkState], size: "sm" }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk3ECMDGKZcjs.StatusBadge, { tone: statusTone(authority, "granted"), children: AUTHORITY_LABELS[authority] })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", alignItems: "center", paddingLeft: "var(--space-3)", borderLeft: "1px solid var(--color-semantic-line-normal-normal)" }, children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              _chunk3BBCS67Wcjs.Button,
              {
                variant: "danger",
                size: "md",
                disabled: stopRequestDisabled,
                "aria-label": STOP_BUTTON_LABELS[displayStopState] || stopRequestLabel,
                "aria-busy": displayStopState === "requesting" || void 0,
                "aria-controls": statusId,
                onClick: requestStop,
                children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "circle-block", size: 18, "aria-hidden": "true" }),
                  STOP_BUTTON_LABELS[displayStopState] || stopRequestLabel
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkKUMT7S4Kcjs.Banner,
          {
            id: statusId,
            variant: "embedded",
            tone: guard.tone,
            title: guard.title,
            children: guard.message
          }
        ),
        renderedControls != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            ref: controlsRef,
            "aria-label": "\uC81C\uC5B4 \uC785\uB825",
            "aria-disabled": !interactionEnabled,
            inert: !interactionEnabled ? true : void 0,
            "data-interaction-enabled": interactionEnabled ? "true" : "false",
            onClickCapture: (event) => {
              if (!interactionEnabled) {
                event.preventDefault();
                event.stopPropagation();
              }
            },
            onKeyDownCapture: (event) => {
              if (!interactionEnabled) {
                event.preventDefault();
                event.stopPropagation();
              }
            },
            style: { display: "flex", minHeight: 240, alignItems: "center", justifyContent: "center", padding: "var(--space-5)", pointerEvents: interactionEnabled ? "auto" : "none" },
            children: renderedControls
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "footer", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", padding: "var(--space-3) var(--space-5)", borderTop: "1px solid var(--color-semantic-line-normal-alternative)", background: "var(--color-semantic-fill-normal)" }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", color: "var(--color-semantic-label-neutral)", fontSize: "var(--label1-size)", lineHeight: "var(--label1-line)", fontWeight: "var(--fw-semibold)" }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "joystick", size: 16, "aria-hidden": "true" }),
            "\uC785\uB825 \uBC29\uC2DD \xB7 ",
            CONTROL_MODE_LABELS[controlMode] || controlMode
          ] }),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "var(--space-2)", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunk3BBCS67Wcjs.Button,
              {
                variant: armed ? "outlined" : "primary",
                color: armed ? "assistive" : "primary",
                "aria-pressed": armed,
                disabled: typeof onArmedChange !== "function" || !armed && !canRequestArm,
                onClick: () => _optionalChain([onArmedChange, 'optionalCall', _21 => _21(!armed)]),
                children: armed ? "\uC218\uB3D9 \uC81C\uC5B4 \uD574\uC81C" : "\uC218\uB3D9 \uC81C\uC5B4 \uC900\uBE44"
              }
            ),
            armed && deadmanRequired && !stopBlockActive && deadmanControl != null && deadmanControl
          ] })
        ] })
      ]
    }
  );
}



exports.ManualControlSession = ManualControlSession;
//# sourceMappingURL=chunk-7FO4HFSH.cjs.map