"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');


var _chunk3BBCS67Wcjs = require('./chunk-3BBCS67W.cjs');

// components/communication/MessageFeed.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var useIsomorphicLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var BOTTOM_THRESHOLD = 8;
function isAtBottom(viewport) {
  return viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= BOTTOM_THRESHOLD;
}
function requestFrame(callback) {
  if (typeof window === "undefined" || typeof window.requestAnimationFrame !== "function") {
    callback();
    return null;
  }
  return window.requestAnimationFrame(callback);
}
function cancelFrame(frame) {
  if (frame != null && typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(frame);
  }
}
function MessageFeed({
  ariaLabel = "\uBA54\uC2DC\uC9C0 \uB0B4\uC5ED",
  children,
  empty,
  maxHeight = 400,
  busy = false,
  hasPrevious = false,
  loadingPrevious = false,
  onLoadPrevious,
  loadPreviousLabel = "\uC774\uC804 \uBA54\uC2DC\uC9C0 \uBD88\uB7EC\uC624\uAE30",
  following = true,
  onFollowingChange,
  unreadCount = 0,
  jumpToLatestLabel = "\uCD5C\uC2E0 \uBA54\uC2DC\uC9C0\uB85C \uC774\uB3D9",
  onJumpToLatest,
  liveStatus,
  style,
  ...rest
}) {
  const generatedId = _react2.default.useId();
  const viewportId = `lk-message-feed-${String(generatedId).replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const viewportRef = _react2.default.useRef(null);
  const contentRef = _react2.default.useRef(null);
  const historyAnchorRef = _react2.default.useRef(null);
  const historySettlingRef = _react2.default.useRef(false);
  const programmaticScrollRef = _react2.default.useRef(false);
  const programmaticFrameRef = _react2.default.useRef(null);
  const settlingFrameRef = _react2.default.useRef(null);
  const followingRef = _react2.default.useRef(following);
  const lastRequestedFollowingRef = _react2.default.useRef(following);
  const [retainJumpFocus, setRetainJumpFocus] = _react2.default.useState(false);
  const [historyLiveSuppressed, setHistoryLiveSuppressed] = _react2.default.useState(false);
  if (followingRef.current !== following) {
    followingRef.current = following;
    lastRequestedFollowingRef.current = following;
  }
  const releaseProgrammaticScroll = _react2.default.useCallback(() => {
    cancelFrame(programmaticFrameRef.current);
    programmaticFrameRef.current = requestFrame(() => {
      programmaticFrameRef.current = requestFrame(() => {
        programmaticScrollRef.current = false;
        programmaticFrameRef.current = null;
      });
    });
  }, []);
  const markHistorySettled = _react2.default.useCallback(() => {
    historySettlingRef.current = true;
    cancelFrame(settlingFrameRef.current);
    settlingFrameRef.current = requestFrame(() => {
      settlingFrameRef.current = requestFrame(() => {
        historySettlingRef.current = false;
        settlingFrameRef.current = null;
        setHistoryLiveSuppressed(false);
      });
    });
  }, []);
  const scrollToBottom = _react2.default.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    programmaticScrollRef.current = true;
    viewport.scrollTop = viewport.scrollHeight;
    releaseProgrammaticScroll();
  }, [releaseProgrammaticScroll]);
  _react2.default.useEffect(() => () => {
    cancelFrame(programmaticFrameRef.current);
    cancelFrame(settlingFrameRef.current);
  }, []);
  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const anchor = historyAnchorRef.current;
    if (anchor) {
      if (loadingPrevious) anchor.sawLoading = true;
      const heightDelta = viewport.scrollHeight - anchor.scrollHeight;
      const childrenChanged = anchor.children !== children;
      const loadingFinished = anchor.sawLoading && !loadingPrevious;
      if (heightDelta !== 0 || loadingFinished || childrenChanged && !loadingPrevious) {
        programmaticScrollRef.current = true;
        viewport.scrollTop = Math.max(0, anchor.scrollTop + heightDelta);
        historyAnchorRef.current = null;
        releaseProgrammaticScroll();
        markHistorySettled();
      }
      return;
    }
    if (following) scrollToBottom();
  }, [children, following, loadingPrevious, markHistorySettled, maxHeight, releaseProgrammaticScroll, scrollToBottom]);
  _react2.default.useEffect(() => {
    const content = contentRef.current;
    const Observer = typeof globalThis === "undefined" ? void 0 : globalThis.ResizeObserver;
    if (!content || typeof Observer !== "function") return void 0;
    const observer = new Observer(() => {
      if (historyAnchorRef.current || historySettlingRef.current) return;
      if (followingRef.current) scrollToBottom();
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToBottom]);
  const handleScroll = (event) => {
    if (programmaticScrollRef.current) return;
    const nextFollowing = isAtBottom(event.currentTarget);
    if (nextFollowing === followingRef.current) {
      lastRequestedFollowingRef.current = nextFollowing;
      return;
    }
    if (nextFollowing === lastRequestedFollowingRef.current) return;
    lastRequestedFollowingRef.current = nextFollowing;
    _optionalChain([onFollowingChange, 'optionalCall', _ => _(nextFollowing, "user-scroll")]);
  };
  const handleLoadPrevious = () => {
    const viewport = viewportRef.current;
    if (!viewport || !onLoadPrevious || loadingPrevious) return;
    setHistoryLiveSuppressed(true);
    historyAnchorRef.current = {
      scrollHeight: viewport.scrollHeight,
      scrollTop: viewport.scrollTop,
      children,
      sawLoading: false
    };
    onLoadPrevious();
  };
  const handleJumpToLatest = (event) => {
    const button = event.currentTarget;
    setRetainJumpFocus(true);
    scrollToBottom();
    button.focus({ preventScroll: true });
    _optionalChain([onFollowingChange, 'optionalCall', _2 => _2(true, "jump-to-latest")]);
    _optionalChain([onJumpToLatest, 'optionalCall', _3 => _3()]);
  };
  const messageCount = _react2.default.Children.count(children);
  const emptyContent = empty === void 0 ? "\uBA54\uC2DC\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." : empty;
  const normalizedUnreadCount = Math.max(0, Math.floor(Number(unreadCount) || 0));
  const showJump = !following || normalizedUnreadCount > 0 || retainJumpFocus;
  const jumpAccessibleLabel = normalizedUnreadCount > 0 ? `${jumpToLatestLabel}, \uC77D\uC9C0 \uC54A\uC740 \uBA54\uC2DC\uC9C0 ${normalizedUnreadCount}\uAC1C` : jumpToLatestLabel;
  const isBusy = busy || loadingPrevious;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "section",
    {
      ...rest,
      "data-message-feed": true,
      "data-following": following ? "true" : "false",
      style: {
        display: "grid",
        gap: "var(--space-2)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        fontFamily: "var(--font-sans)",
        ...style
      },
      children: [
        hasPrevious && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            "data-message-feed-history-control": true,
            style: { display: "flex", justifyContent: "center", minWidth: 0 },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunk3BBCS67Wcjs.Button,
              {
                type: "button",
                size: "sm",
                variant: "ghost",
                "aria-controls": viewportId,
                disabled: !onLoadPrevious,
                loading: loadingPrevious,
                loadingLabel: `${loadPreviousLabel} \uC911`,
                onClick: handleLoadPrevious,
                children: loadPreviousLabel
              }
            )
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            id: viewportId,
            ref: viewportRef,
            "data-message-feed-viewport": true,
            "data-history-live-suppressed": historyLiveSuppressed ? "true" : void 0,
            role: "log",
            "aria-label": ariaLabel,
            "aria-live": historyLiveSuppressed ? "off" : "polite",
            "aria-relevant": "additions",
            "aria-atomic": "false",
            "aria-busy": isBusy ? "true" : void 0,
            tabIndex: 0,
            onScroll: handleScroll,
            style: {
              boxSizing: "border-box",
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              maxHeight,
              overflowX: "hidden",
              overflowY: "auto",
              overscrollBehavior: "contain",
              scrollbarGutter: "stable",
              padding: "var(--space-4)",
              border: "var(--component-card-border)",
              borderRadius: "var(--component-card-radius)",
              background: "var(--color-semantic-background-elevated-normal)",
              boxShadow: "var(--component-card-shadow-sm)",
              color: "var(--color-semantic-label-normal)",
              outlineOffset: 2
            },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              "div",
              {
                ref: contentRef,
                "data-message-feed-content": true,
                style: { display: "grid", gap: "var(--space-3)", minWidth: 0 },
                children: messageCount > 0 ? children : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "div",
                  {
                    "data-message-feed-empty": true,
                    style: {
                      display: "grid",
                      minHeight: 120,
                      placeItems: "center",
                      minWidth: 0,
                      padding: "var(--space-4)",
                      color: "var(--color-semantic-label-alternative)",
                      fontSize: "var(--body2-size)",
                      lineHeight: "var(--body2-line)",
                      textAlign: "center",
                      overflowWrap: "anywhere"
                    },
                    children: emptyContent
                  }
                )
              }
            )
          }
        ),
        showJump && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "div",
          {
            "data-message-feed-jump-control": true,
            style: { display: "flex", justifyContent: "center", minWidth: 0 },
            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunk3BBCS67Wcjs.Button,
              {
                type: "button",
                size: "sm",
                variant: "secondary",
                "aria-controls": viewportId,
                "aria-label": jumpAccessibleLabel,
                "data-message-feed-jump": true,
                onClick: handleJumpToLatest,
                onBlur: () => setRetainJumpFocus(false),
                children: normalizedUnreadCount > 0 ? `${jumpToLatestLabel} \xB7 ${normalizedUnreadCount}` : jumpToLatestLabel
              }
            )
          }
        ),
        liveStatus != null && liveStatus !== "" && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunk677EM4M2cjs.VisuallyHidden,
          {
            as: "div",
            "data-message-feed-live-status": true,
            role: "status",
            "aria-live": "polite",
            "aria-atomic": "true",
            children: liveStatus
          }
        )
      ]
    }
  );
}



exports.MessageFeed = MessageFeed;
//# sourceMappingURL=chunk-4AARENR3.cjs.map