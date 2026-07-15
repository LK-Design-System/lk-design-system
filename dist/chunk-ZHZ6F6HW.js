"use client";
import {
  VisuallyHidden
} from "./chunk-LSN3BTKD.js";
import {
  IconButton
} from "./chunk-ODAJPEYM.js";
import {
  Icon
} from "./chunk-LMQSX5BW.js";
import {
  Button
} from "./chunk-7WDUT67E.js";

// components/communication/MessageFeed.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
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
  viewportMinHeight,
  busy = false,
  hasPrevious = false,
  loadingPrevious = false,
  onLoadPrevious,
  loadPreviousLabel = "\uC774\uC804 \uBA54\uC2DC\uC9C0 \uBD88\uB7EC\uC624\uAE30",
  following,
  onFollowingChange,
  unreadCount = 0,
  jumpToLatestLabel = "\uCD5C\uC2E0 \uBA54\uC2DC\uC9C0\uB85C \uC774\uB3D9",
  onJumpToLatest,
  liveStatus,
  style,
  ...rest
}) {
  const generatedId = React.useId();
  const viewportId = `lk-message-feed-${String(generatedId).replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const viewportRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const historyAnchorRef = React.useRef(null);
  const historySettlingRef = React.useRef(false);
  const programmaticScrollRef = React.useRef(false);
  const programmaticFrameRef = React.useRef(null);
  const settlingFrameRef = React.useRef(null);
  const requestFallbackFrameRef = React.useRef(null);
  const followingRef = React.useRef(following);
  const loadingPreviousRef = React.useRef(loadingPrevious);
  const lastRequestedFollowingRef = React.useRef(following);
  const [retainJumpFocus, setRetainJumpFocus] = React.useState(false);
  const [historyLiveSuppressed, setHistoryLiveSuppressed] = React.useState(false);
  if (followingRef.current !== following) {
    followingRef.current = following;
    lastRequestedFollowingRef.current = following;
  }
  loadingPreviousRef.current = loadingPrevious;
  const releaseProgrammaticScroll = React.useCallback(() => {
    cancelFrame(programmaticFrameRef.current);
    programmaticFrameRef.current = requestFrame(() => {
      programmaticFrameRef.current = requestFrame(() => {
        programmaticScrollRef.current = false;
        programmaticFrameRef.current = null;
      });
    });
  }, []);
  const markHistorySettled = React.useCallback(() => {
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
  const finishHistoryRequest = React.useCallback((anchor) => {
    const viewport = viewportRef.current;
    if (!viewport || historyAnchorRef.current !== anchor) return;
    const heightDelta = viewport.scrollHeight - anchor.scrollHeight;
    programmaticScrollRef.current = true;
    viewport.scrollTop = Math.max(0, anchor.scrollTop + heightDelta);
    historyAnchorRef.current = null;
    releaseProgrammaticScroll();
    markHistorySettled();
  }, [markHistorySettled, releaseProgrammaticScroll]);
  const scheduleNoSignalHistoryFallback = React.useCallback((anchor) => {
    cancelFrame(requestFallbackFrameRef.current);
    requestFallbackFrameRef.current = requestFrame(() => {
      requestFallbackFrameRef.current = requestFrame(() => {
        requestFallbackFrameRef.current = null;
        if (historyAnchorRef.current === anchor && !anchor.sawLoading && !loadingPreviousRef.current) {
          finishHistoryRequest(anchor);
        }
      });
    });
  }, [finishHistoryRequest]);
  const scrollToBottom = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    programmaticScrollRef.current = true;
    viewport.scrollTop = viewport.scrollHeight;
    releaseProgrammaticScroll();
  }, [releaseProgrammaticScroll]);
  React.useEffect(() => () => {
    cancelFrame(programmaticFrameRef.current);
    cancelFrame(settlingFrameRef.current);
    cancelFrame(requestFallbackFrameRef.current);
  }, []);
  React.useEffect(() => {
    if (!hasPrevious && historyAnchorRef.current) {
      finishHistoryRequest(historyAnchorRef.current);
    }
  }, [finishHistoryRequest, hasPrevious]);
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
        finishHistoryRequest(anchor);
      }
      return;
    }
    if (following) scrollToBottom();
  }, [children, finishHistoryRequest, following, loadingPrevious, maxHeight, scrollToBottom, viewportMinHeight]);
  React.useEffect(() => {
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
    onFollowingChange?.(nextFollowing, "user-scroll");
  };
  const handleLoadPrevious = () => {
    const viewport = viewportRef.current;
    if (!viewport || !onLoadPrevious || loadingPrevious) return;
    setHistoryLiveSuppressed(true);
    const anchor = {
      scrollHeight: viewport.scrollHeight,
      scrollTop: viewport.scrollTop,
      children,
      sawLoading: false
    };
    historyAnchorRef.current = anchor;
    let request;
    try {
      request = onLoadPrevious();
    } catch (error) {
      finishHistoryRequest(anchor);
      throw error;
    }
    if (request && typeof request.then === "function") {
      const settleReturnedRequest = () => {
        if (historyAnchorRef.current === anchor && !loadingPreviousRef.current) {
          finishHistoryRequest(anchor);
        }
      };
      Promise.resolve(request).then(settleReturnedRequest, settleReturnedRequest);
    } else {
      scheduleNoSignalHistoryFallback(anchor);
    }
  };
  const handleJumpToLatest = (event) => {
    const button = event.currentTarget;
    setRetainJumpFocus(true);
    scrollToBottom();
    button.focus({ preventScroll: true });
    onFollowingChange?.(true, "jump-to-latest");
    onJumpToLatest?.();
  };
  const messageCount = React.Children.toArray(children).length;
  const emptyContent = empty === void 0 ? "\uBA54\uC2DC\uC9C0\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4." : empty;
  const normalizedUnreadCount = Math.max(0, Math.floor(Number(unreadCount) || 0));
  const showJump = !following || normalizedUnreadCount > 0 || retainJumpFocus;
  const jumpAccessibleLabel = normalizedUnreadCount > 0 ? `${jumpToLatestLabel}, \uC77D\uC9C0 \uC54A\uC740 \uBA54\uC2DC\uC9C0 ${normalizedUnreadCount}\uAC1C` : jumpToLatestLabel;
  const isBusy = busy || loadingPrevious;
  return /* @__PURE__ */ jsxs(
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
        hasPrevious && /* @__PURE__ */ jsx(
          "div",
          {
            "data-message-feed-history-control": true,
            style: { display: "flex", justifyContent: "center", minWidth: 0 },
            children: /* @__PURE__ */ jsx(
              Button,
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
        /* @__PURE__ */ jsx(
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
              minHeight: viewportMinHeight,
              overflowX: "hidden",
              overflowY: "auto",
              overscrollBehavior: "contain",
              scrollbarGutter: "stable",
              padding: "var(--space-3) var(--space-2)",
              border: 0,
              borderRadius: 0,
              background: "transparent",
              boxShadow: "none",
              color: "var(--color-semantic-label-normal)",
              outlineOffset: "var(--space-1)"
            },
            children: /* @__PURE__ */ jsx(
              "div",
              {
                ref: contentRef,
                "data-message-feed-content": true,
                style: {
                  display: "grid",
                  gap: "var(--space-6)",
                  width: "min(48rem, 100%)",
                  minWidth: 0,
                  marginInline: "auto"
                },
                children: messageCount > 0 ? children : /* @__PURE__ */ jsx(
                  "div",
                  {
                    "data-message-feed-empty": true,
                    style: {
                      display: "grid",
                      minHeight: "var(--space-20)",
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
        showJump && /* @__PURE__ */ jsx(
          "div",
          {
            "data-message-feed-jump-control": true,
            style: { display: "flex", justifyContent: "center", minWidth: 0 },
            children: /* @__PURE__ */ jsxs("span", { style: { position: "relative", display: "inline-flex" }, children: [
              /* @__PURE__ */ jsx(
                IconButton,
                {
                  type: "button",
                  size: "medium",
                  variant: "soft",
                  "aria-controls": viewportId,
                  label: jumpAccessibleLabel,
                  "data-message-feed-jump": true,
                  onClick: handleJumpToLatest,
                  onBlur: () => setRetainJumpFocus(false),
                  children: /* @__PURE__ */ jsx(Icon, { name: "arrow-down", size: 18, "aria-hidden": "true" })
                }
              ),
              normalizedUnreadCount > 0 && /* @__PURE__ */ jsx(
                "span",
                {
                  "aria-hidden": "true",
                  "data-message-feed-unread": true,
                  style: {
                    position: "absolute",
                    top: "calc(var(--space-1) * -1)",
                    right: "calc(var(--space-1) * -1)",
                    minWidth: "var(--space-4)",
                    height: "var(--space-4)",
                    padding: "0 var(--space-1)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    background: "var(--color-semantic-primary-normal)",
                    color: "var(--color-semantic-static-white)",
                    border: "var(--border-thin) solid var(--color-semantic-background-normal-normal)",
                    borderRadius: "var(--radius-pill)",
                    fontSize: "var(--caption2-size)",
                    lineHeight: 1,
                    fontWeight: "var(--fw-bold)",
                    fontVariantNumeric: "tabular-nums"
                  },
                  children: normalizedUnreadCount > 99 ? "99+" : normalizedUnreadCount
                }
              )
            ] })
          }
        ),
        liveStatus != null && liveStatus !== "" && /* @__PURE__ */ jsx(
          VisuallyHidden,
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

export {
  MessageFeed
};
//# sourceMappingURL=chunk-ZHZ6F6HW.js.map