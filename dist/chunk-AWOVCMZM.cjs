"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }"use client";


var _chunkKUMT7S4Kcjs = require('./chunk-KUMT7S4K.cjs');


var _chunkMROKAQIXcjs = require('./chunk-MROKAQIX.cjs');


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');


var _chunkA53UKC2Rcjs = require('./chunk-A53UKC2R.cjs');


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/data/ResourceState.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var STATE_PRESENTATION = {
  ready: {
    title: null,
    description: null,
    tone: "info",
    icon: "circle-info"
  },
  loading: {
    title: "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4",
    description: "\uCD5C\uC2E0 \uC815\uBCF4\uB97C \uC900\uBE44\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    tone: "info",
    icon: "hourglass"
  },
  refreshing: {
    title: "\uB370\uC774\uD130\uB97C \uC0C8\uB85C \uACE0\uCE58\uB294 \uC911\uC785\uB2C8\uB2E4",
    description: "\uD604\uC7AC \uB0B4\uC6A9\uC744 \uC720\uC9C0\uD55C \uCC44 \uCD5C\uC2E0 \uC815\uBCF4\uB97C \uD655\uC778\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    tone: "info",
    icon: "refresh"
  },
  empty: {
    title: "\uD45C\uC2DC\uD560 \uB370\uC774\uD130\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4",
    description: "\uC870\uAC74\uC744 \uBCC0\uACBD\uD558\uAC70\uB098 \uC0C8 \uD56D\uBAA9\uC744 \uCD94\uAC00\uD574 \uBCF4\uC138\uC694.",
    tone: "info",
    icon: "inbox"
  },
  error: {
    title: "\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4",
    description: "\uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574 \uC8FC\uC138\uC694.",
    tone: "error",
    icon: "circle-close-fill"
  },
  stale: {
    title: "\uCD5C\uC2E0 \uC0C1\uD0DC\uAC00 \uC544\uB2CC \uB370\uC774\uD130\uC785\uB2C8\uB2E4",
    description: "\uB9C8\uC9C0\uB9C9\uC73C\uB85C \uD655\uC778\uB41C \uC815\uBCF4\uB97C \uD45C\uC2DC\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    tone: "warning",
    icon: "clock"
  },
  offline: {
    title: "\uC624\uD504\uB77C\uC778 \uC0C1\uD0DC\uC785\uB2C8\uB2E4",
    description: "\uB9C8\uC9C0\uB9C9\uC73C\uB85C \uD655\uC778\uB41C \uC815\uBCF4\uB97C \uD45C\uC2DC\uD558\uACE0 \uC788\uC2B5\uB2C8\uB2E4.",
    tone: "warning",
    icon: "signal"
  },
  restricted: {
    title: "\uB370\uC774\uD130\uB97C \uBCFC \uAD8C\uD55C\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",
    description: "\uC811\uADFC \uAD8C\uD55C\uC744 \uD655\uC778\uD558\uAC70\uB098 \uAD00\uB9AC\uC790\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694.",
    tone: "warning",
    icon: "lock"
  }
};
var PRESERVED_DATA_STATES = /* @__PURE__ */ new Set(["refreshing", "error", "stale", "offline"]);
var BLOCKING_STATES = /* @__PURE__ */ new Set(["empty", "restricted"]);
var ASSERTIVE_BLOCKING_STATES = /* @__PURE__ */ new Set(["error", "offline"]);
function DefaultLoadingContent() {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      "data-resource-state-skeleton": true,
      style: {
        display: "grid",
        gap: "var(--space-4)",
        minWidth: 0,
        padding: "var(--space-6) var(--space-5)"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkA53UKC2Rcjs.Skeleton, { variant: "text", width: "42%", height: 16 }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkA53UKC2Rcjs.Skeleton, { variant: "text", width: "100%", lines: 3 }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkA53UKC2Rcjs.Skeleton, { variant: "rect", width: "100%", height: 104 })
      ]
    }
  );
}
function ResourceState({
  state = "ready",
  title,
  description,
  action,
  lastUpdated,
  lastUpdatedLabel = "\uB9C8\uC9C0\uB9C9 \uC5C5\uB370\uC774\uD2B8",
  loadingContent,
  messageVariant = "embedded",
  children,
  style,
  ...rest
}) {
  const resolvedState = STATE_PRESENTATION[state] ? state : "ready";
  const presentation = STATE_PRESENTATION[resolvedState];
  const resolvedTitle = _nullishCoalesce(title, () => ( presentation.title));
  const resolvedDescription = _nullishCoalesce(description, () => ( presentation.description));
  const hasContent = _react2.default.Children.count(children) > 0;
  const isLoading = resolvedState === "loading" || resolvedState === "refreshing" && !hasContent;
  const isBlocking = BLOCKING_STATES.has(resolvedState) || !hasContent && !isLoading && resolvedState !== "ready";
  const preservesContent = hasContent && PRESERVED_DATA_STATES.has(resolvedState);
  const assertive = isBlocking && ASSERTIVE_BLOCKING_STATES.has(resolvedState);
  const statusRole = assertive ? "alert" : "status";
  const statusLive = statusRole === "alert" ? "assertive" : "polite";
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "section",
    {
      "data-resource-state": resolvedState,
      "data-resource-state-blocking": isBlocking ? "true" : "false",
      "data-preserves-content": preservesContent ? "true" : "false",
      "aria-busy": isLoading || resolvedState === "refreshing" ? "true" : void 0,
      style: {
        display: "grid",
        gap: messageVariant === "standalone" ? "var(--space-4)" : 0,
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        preservesContent && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkKUMT7S4Kcjs.Banner,
          {
            role: statusRole,
            "aria-live": statusLive,
            tone: presentation.tone,
            variant: messageVariant,
            title: resolvedTitle,
            action,
            style: { minWidth: 0 },
            children: resolvedDescription
          }
        ),
        isLoading && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "status", "aria-live": "polite", style: { minWidth: 0 }, children: [
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { children: [
            resolvedTitle,
            resolvedDescription ? `. ${resolvedDescription}` : ""
          ] }),
          _nullishCoalesce(loadingContent, () => ( /* @__PURE__ */ _jsxruntime.jsx.call(void 0, DefaultLoadingContent, {})))
        ] }),
        isBlocking && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { role: statusRole, "aria-live": statusLive, style: { minWidth: 0 }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkMROKAQIXcjs.EmptyState,
          {
            icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: presentation.icon, size: 26, "aria-hidden": "true" }),
            title: resolvedTitle,
            description: resolvedDescription,
            action
          }
        ) }),
        !isLoading && !isBlocking && children,
        !isLoading && !isBlocking && lastUpdated != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            "data-resource-state-freshness": true,
            style: {
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              minWidth: 0,
              padding: messageVariant === "embedded" ? "var(--space-3) var(--space-5)" : "var(--space-2) 0 0",
              borderTop: messageVariant === "embedded" ? "1px solid var(--color-semantic-line-normal-normal)" : "none",
              color: "var(--color-semantic-label-alternative)",
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "history", size: 16, "aria-hidden": "true", style: { flexShrink: 0 } }),
              /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { minWidth: 0, overflowWrap: "anywhere" }, children: [
                lastUpdatedLabel,
                ": ",
                lastUpdated
              ] })
            ]
          }
        )
      ]
    }
  );
}



exports.ResourceState = ResourceState;
//# sourceMappingURL=chunk-AWOVCMZM.cjs.map