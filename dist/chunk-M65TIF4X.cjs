"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkHWQJTCMZcjs = require('./chunk-HWQJTCMZ.cjs');


var _chunk677EM4M2cjs = require('./chunk-677EM4M2.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/content/LogViewer.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var LEVELS = {
  debug: { c: "var(--color-semantic-label-assistive)", log: "var(--color-semantic-inverse-label-neutral-soft)", label: "DEBUG" },
  info: { c: "var(--color-semantic-primary-normal)", log: "var(--color-semantic-accent-background-light-blue)", label: "INFO" },
  warn: { c: "var(--color-semantic-status-cautionary)", log: "var(--color-semantic-status-cautionary)", label: "WARN" },
  error: { c: "var(--color-semantic-status-negative)", log: "var(--color-semantic-status-negative)", label: "ERROR" }
};
var ORDER = ["debug", "info", "warn", "error"];
var STREAM_STATUS = {
  connecting: { tone: "cautionary", pulse: true, label: "\uC5F0\uACB0 \uC911" },
  online: { tone: "online", pulse: false, label: "\uC628\uB77C\uC778" },
  reconnecting: { tone: "cautionary", pulse: true, label: "\uC7AC\uC5F0\uACB0 \uC911" },
  weak: { tone: "cautionary", pulse: false, label: "\uC2E0\uD638 \uC57D\uD568" },
  stale: { tone: "cautionary", pulse: true, label: "\uB370\uC774\uD130 \uC9C0\uC5F0" },
  error: { tone: "negative", pulse: false, label: "\uC5F0\uACB0 \uC624\uB958" },
  offline: { tone: "offline", pulse: false, label: "\uC624\uD504\uB77C\uC778" }
};
var DENSITY = {
  compact: { fontSize: "var(--caption2-size)", lineHeight: "var(--caption2-line)", rowMinHeight: 18, panelPadding: "8px 10px", time: "60px", level: "48px", source: "minmax(44px, 80px)", copy: "24px" },
  comfortable: { fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", rowMinHeight: 20, panelPadding: "10px 12px", time: "64px", level: "52px", source: "minmax(54px, 96px)", copy: "28px" }
};
function nodeText(value) {
  if (value == null || typeof value === "boolean") return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.map(nodeText).filter(Boolean).join(" ");
  if (_react2.default.isValidElement(value)) return nodeText(value.props.children);
  return "";
}
function formatLine(line) {
  const cfg = LEVELS[line.level] || LEVELS.info;
  return [line.time, cfg.label, line.source, line.text].map(nodeText).filter(Boolean).join(" ");
}
function IconButton({ label, icon, active = false, disabled = false, rail = false, children, onClick }) {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "button",
    {
      type: "button",
      "aria-label": label,
      title: label,
      "aria-pressed": active || void 0,
      disabled,
      onClick,
      style: {
        position: "relative",
        width: 28,
        height: 28,
        border: "1px solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-sm)",
        background: active ? "var(--color-semantic-inverse-background)" : "var(--color-semantic-background-elevated-normal)",
        color: active ? "var(--color-semantic-inverse-label)" : "var(--color-semantic-label-neutral)",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.45 : 1,
        fontFamily: "inherit",
        padding: 0
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: icon, size: 15, "aria-hidden": "true" }),
        rail && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { position: "absolute", left: 8, right: 8, bottom: 6, height: 1.5, borderRadius: "var(--radius-pill)", background: "currentColor" } }),
        children
      ]
    }
  );
}
function LogViewer({
  lines = [],
  filter = true,
  search = true,
  tools = true,
  copyable = true,
  autoScroll = true,
  height = 260,
  density = "comfortable",
  wrap = false,
  virtualized = true,
  overscan = 8,
  initialQuery = "",
  streamStatus,
  lastUpdatedAt,
  droppedCount = 0,
  announceNewLines = true,
  "aria-label": ariaLabel = "\uB85C\uADF8 \uC2A4\uD2B8\uB9BC",
  onExport,
  onClear,
  onCopyLine,
  style,
  ...rest
}) {
  const [active, setActive] = _react2.default.useState(() => new Set(ORDER));
  const [query, setQuery] = _react2.default.useState(initialQuery);
  const [paused, setPaused] = _react2.default.useState(false);
  const [pausedLines, setPausedLines] = _react2.default.useState([]);
  const [clearedUntil, setClearedUntil] = _react2.default.useState(0);
  const [copiedIndex, setCopiedIndex] = _react2.default.useState(null);
  const [scrollTop, setScrollTop] = _react2.default.useState(0);
  const [viewportHeight, setViewportHeight] = _react2.default.useState(height);
  const [tailLocked, setTailLocked] = _react2.default.useState(true);
  const [unreadCount, setUnreadCount] = _react2.default.useState(0);
  const [announcement, setAnnouncement] = _react2.default.useState("");
  const boxRef = _react2.default.useRef(null);
  const rowFocusRef = _react2.default.useRef(null);
  const previousLineCountRef = _react2.default.useRef(lines.length);
  const metrics = DENSITY[density] || DENSITY.comfortable;
  const normalizedQuery = query.trim().toLowerCase();
  const matchesFilters = _react2.default.useCallback((line) => {
    const level = line.level || "info";
    if (!active.has(level)) return false;
    if (!normalizedQuery) return true;
    return formatLine(line).toLowerCase().includes(normalizedQuery);
  }, [active, normalizedQuery]);
  const currentLines = _react2.default.useMemo(() => lines.slice(clearedUntil), [lines, clearedUntil]);
  const sourceLines = paused ? pausedLines : currentLines;
  const shown = _react2.default.useMemo(() => sourceLines.filter(matchesFilters), [matchesFilters, sourceLines]);
  const pausedCount = paused ? Math.max(0, currentLines.length - pausedLines.length) : 0;
  const latestCount = paused ? pausedCount : unreadCount;
  const copyColumn = copyable ? ` ${metrics.copy}` : "";
  const gridTemplateColumns = `${metrics.time} ${metrics.level} ${metrics.source} minmax(0, 1fr)${copyColumn}`;
  const rowHeight = metrics.rowMinHeight;
  const safeOverscan = Math.max(0, overscan);
  const virtualActive = virtualized && !wrap && shown.length * rowHeight > viewportHeight + safeOverscan * rowHeight * 2;
  const virtualStart = virtualActive ? Math.max(0, Math.floor(scrollTop / rowHeight) - safeOverscan) : 0;
  const virtualEnd = virtualActive ? Math.min(shown.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + safeOverscan) : shown.length;
  const visibleLines = virtualActive ? shown.slice(virtualStart, virtualEnd) : shown;
  const topSpacer = virtualStart * rowHeight;
  const bottomSpacer = (shown.length - virtualEnd) * rowHeight;
  const updateScrollState = _react2.default.useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const nextTop = box.scrollTop;
    const nextHeight = box.clientHeight || height;
    const atTail = box.scrollHeight - nextTop - nextHeight <= Math.max(rowHeight * 2, 32);
    setScrollTop(nextTop);
    setViewportHeight(nextHeight);
    setTailLocked(atTail);
    if (atTail) setUnreadCount(0);
  }, [height, rowHeight]);
  const scrollToLatest = _react2.default.useCallback(() => {
    const box = boxRef.current;
    if (box) {
      box.scrollTop = box.scrollHeight;
      setScrollTop(box.scrollTop);
      setViewportHeight(box.clientHeight || height);
    }
    setTailLocked(true);
    setUnreadCount(0);
  }, [height]);
  _react2.default.useEffect(() => {
    if (clearedUntil > lines.length) setClearedUntil(0);
  }, [clearedUntil, lines.length]);
  const following = !paused && tailLocked;
  _react2.default.useEffect(() => {
    const previous = previousLineCountRef.current;
    const added = Math.max(0, lines.length - previous);
    previousLineCountRef.current = lines.length;
    if (lines.length < previous) setUnreadCount(0);
    if (added === 0) return;
    if (!following) {
      setUnreadCount((count) => Math.min(999, count + added));
      return;
    }
    if (!announceNewLines) return;
    const arrivals = lines.slice(lines.length - added).filter(matchesFilters);
    if (arrivals.length === 0) return;
    const latest = formatLine(arrivals[arrivals.length - 1]);
    setAnnouncement(arrivals.length === 1 ? latest : `\uC0C8 \uB85C\uADF8 ${arrivals.length}\uC904, \uB9C8\uC9C0\uB9C9 ${latest}`);
  }, [lines, announceNewLines, following, matchesFilters]);
  const prevStreamStatus = _react2.default.useRef(streamStatus);
  _react2.default.useEffect(() => {
    if (prevStreamStatus.current === streamStatus) return;
    prevStreamStatus.current = streamStatus;
    const label = streamStatus != null ? (STREAM_STATUS[streamStatus] || STREAM_STATUS.online).label : null;
    if (label) setAnnouncement(`\uC2A4\uD2B8\uB9BC \uC0C1\uD0DC: ${label}`);
  }, [streamStatus]);
  _react2.default.useEffect(() => {
    if (!paused && autoScroll && tailLocked) {
      window.requestAnimationFrame(scrollToLatest);
    }
  }, [lines.length, shown.length, autoScroll, paused, tailLocked, scrollToLatest]);
  _react2.default.useLayoutEffect(() => {
    updateScrollState();
  }, [height, density, virtualActive, shown.length, updateScrollState]);
  _react2.default.useLayoutEffect(() => {
    const focused = rowFocusRef.current;
    const box = boxRef.current;
    if (!focused || !box || typeof document === "undefined") return;
    if (document.contains(focused)) return;
    rowFocusRef.current = null;
    if (document.activeElement == null || document.activeElement === document.body) {
      box.focus({ preventScroll: true });
    }
  });
  const toggle = (lvl) => setActive((s) => {
    const n = new Set(s);
    n.has(lvl) ? n.delete(lvl) : n.add(lvl);
    return n;
  });
  const jumpToLatest = () => {
    setPaused(false);
    setPausedLines([]);
    window.requestAnimationFrame(scrollToLatest);
  };
  const togglePause = () => {
    if (paused) {
      jumpToLatest();
    } else {
      setPausedLines(currentLines);
      setPaused(true);
    }
  };
  const clearVisible = () => {
    setClearedUntil(lines.length);
    setPaused(false);
    setPausedLines([]);
    setCopiedIndex(null);
    setTailLocked(true);
    setUnreadCount(0);
    previousLineCountRef.current = lines.length;
    onClear && onClear();
  };
  const copyLine = async (line, index) => {
    const text = formatLine(line);
    onCopyLine && onCopyLine(line, text);
    try {
      await _optionalChain([navigator, 'access', _ => _.clipboard, 'optionalAccess', _2 => _2.writeText, 'call', _3 => _3(text)]);
      setCopiedIndex(index);
      setAnnouncement(`\uB85C\uADF8 \uB77C\uC778 \uBCF5\uC0AC\uB428: ${text}`);
      window.setTimeout(() => setCopiedIndex((value) => value === index ? null : value), 1200);
    } catch (e2) {
      setCopiedIndex(null);
      setAnnouncement("\uB85C\uADF8 \uB77C\uC778\uC744 \uBCF5\uC0AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: "var(--space-2)", width: "100%", maxWidth: "100%", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    (streamStatus != null || lastUpdatedAt != null || droppedCount > 0) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-3)", flexWrap: "wrap", color: "var(--color-semantic-label-neutral)", fontSize: "var(--caption1-size)" }, children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }, children: [
        streamStatus != null && (() => {
          const cfg = STREAM_STATUS[streamStatus] || STREAM_STATUS.online;
          return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkHWQJTCMZcjs.StatusIndicator, { tone: cfg.tone, pulse: cfg.pulse, "data-status": streamStatus, children: cfg.label });
        })(),
        lastUpdatedAt != null && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { children: [
          "\uB9C8\uC9C0\uB9C9 \uC218\uC2E0 ",
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "strong", { children: lastUpdatedAt })
        ] })
      ] }),
      droppedCount > 0 && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { color: "var(--color-semantic-status-cautionary)", fontWeight: "var(--fw-semibold)" }, children: [
        "\uB204\uB77D ",
        droppedCount,
        "\uC904"
      ] })
    ] }),
    (filter || search || tools) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
      filter && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "flex", gap: "var(--space-1-5)", flexWrap: "wrap", flex: "1 1 220px" }, children: ORDER.map((lvl) => {
        const on = active.has(lvl);
        return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "button",
          {
            type: "button",
            onClick: () => toggle(lvl),
            "aria-pressed": on,
            style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1-5)", height: 24, padding: "0 9px", borderRadius: "var(--radius-pill)", border: `1px solid ${on ? LEVELS[lvl].c : "var(--color-semantic-line-normal-normal)"}`, background: on ? "var(--color-semantic-primary-surface-normal)" : "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: "var(--caption2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: on ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-assistive)" },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { width: 6, height: 6, borderRadius: "50%", background: LEVELS[lvl].c } }),
              LEVELS[lvl].label
            ]
          },
          lvl
        );
      }) }),
      search && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "label", { style: { flex: "1 1 180px", maxWidth: 260, minWidth: 160, height: 28, display: "inline-flex", alignItems: "center", gap: "var(--space-2)", padding: "0 9px", boxSizing: "border-box", border: "1px solid var(--color-semantic-line-normal-normal)", borderRadius: "var(--radius-sm)", background: "var(--color-semantic-background-elevated-normal)", color: "var(--color-semantic-label-assistive)" }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "search", size: 14, "aria-hidden": "true" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "input",
          {
            value: query,
            onChange: (e) => setQuery(e.target.value),
            "aria-label": "\uB85C\uADF8 \uAC80\uC0C9",
            placeholder: "\uAC80\uC0C9",
            style: { minWidth: 0, flex: 1, alignSelf: "stretch", border: "none", outline: "none", background: "transparent", color: "var(--color-semantic-label-normal)", fontFamily: "inherit", fontSize: "var(--caption1-size)", fontWeight: "var(--fw-semibold)" }
          }
        ),
        query && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "button", { type: "button", "aria-label": "\uAC80\uC0C9\uC5B4 \uC9C0\uC6B0\uAE30", onClick: () => setQuery(""), style: { width: 18, height: 18, border: "none", background: "transparent", color: "var(--color-semantic-label-assistive)", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "close", size: 12, "aria-hidden": "true" }) })
      ] }),
      tools && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { role: "group", "aria-label": "\uB85C\uADF8 \uB3C4\uAD6C", style: { display: "inline-flex", gap: "var(--space-1-5)", flex: "0 0 auto" }, children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, IconButton, { label: paused ? "\uB85C\uADF8 tail \uC7AC\uAC1C" : "\uB85C\uADF8 tail \uC77C\uC2DC\uC815\uC9C0", icon: paused ? "play" : "pause", active: paused, onClick: togglePause }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, IconButton, { label: latestCount > 0 ? `\uCD5C\uC2E0 \uB85C\uADF8\uB85C \uC774\uB3D9, \uC0C8 \uB85C\uADF8 ${latestCount > 99 ? "99+" : latestCount}\uC904` : "\uCD5C\uC2E0 \uB85C\uADF8\uB85C \uC774\uB3D9", icon: "arrow-down", rail: true, onClick: jumpToLatest, children: latestCount > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { position: "absolute", top: -5, right: -5, minWidth: 16, height: 16, padding: "0 4px", boxSizing: "border-box", borderRadius: "var(--radius-pill)", background: "var(--color-semantic-status-negative)", color: "var(--color-semantic-static-white)", fontSize: "var(--caption2-size)", lineHeight: "16px", fontWeight: "var(--fw-bold)" }, children: latestCount > 99 ? "99+" : `+${latestCount}` }) }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, IconButton, { label: "\uD45C\uC2DC \uB85C\uADF8 \uC9C0\uC6B0\uAE30", icon: "trash", disabled: currentLines.length === 0, onClick: clearVisible }),
        onExport && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, IconButton, { label: "\uB85C\uADF8 \uB0B4\uBCF4\uB0B4\uAE30", icon: "download", disabled: shown.length === 0, onClick: () => onExport(shown) })
      ] })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk677EM4M2cjs.VisuallyHidden, { role: "status", "aria-live": "polite", "aria-atomic": "true", children: announcement }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { ref: boxRef, className: "lk-scroll-surface", "data-scrollbar": "auto", "data-scroll-gutter": "stable", role: "log", "aria-live": "off", "aria-label": ariaLabel, tabIndex: 0, onScroll: updateScrollState, style: { height, overflow: "auto", scrollbarGutter: "stable", padding: metrics.panelPadding, borderRadius: "var(--radius-md)", background: "var(--color-semantic-inverse-background)", border: "1px solid var(--color-semantic-inverse-line-normal)", fontFamily: "var(--font-mono)", fontSize: metrics.fontSize, lineHeight: metrics.lineHeight }, children: [
      shown.length === 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { minHeight: "100%", display: "grid", placeItems: "center", color: "var(--color-semantic-inverse-label-neutral-soft)", fontFamily: "var(--font-sans)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)" }, children: normalizedQuery ? "\uAC80\uC0C9 \uACB0\uACFC \uC5C6\uC74C" : "\uB85C\uADF8 \uC5C6\uC74C" }),
      virtualActive && topSpacer > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "aria-hidden": "true", style: { height: topSpacer } }),
      visibleLines.map((line, visibleIndex) => {
        const index = virtualStart + visibleIndex;
        const cfg = LEVELS[line.level] || LEVELS.info;
        const copied = copiedIndex === index;
        return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gridTemplateColumns, columnGap: "var(--space-2-5)", alignItems: "baseline", minHeight: metrics.rowMinHeight, height: virtualActive ? rowHeight : void 0, overflow: virtualActive ? "hidden" : void 0, whiteSpace: virtualActive || !wrap ? "nowrap" : "pre-wrap", wordBreak: virtualActive || !wrap ? "normal" : "break-word" }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-inverse-label-neutral-soft)", fontVariantNumeric: "tabular-nums" }, children: line.time }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: cfg.log, fontWeight: "var(--fw-bold)" }, children: cfg.label }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-inverse-label-neutral-soft)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: line.source }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { color: "var(--color-semantic-inverse-label)", minWidth: 0, overflow: virtualActive || !wrap ? "hidden" : "visible", textOverflow: virtualActive || !wrap ? "ellipsis" : "clip" }, children: line.text }),
          copyable && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "button",
            {
              type: "button",
              "aria-label": "\uB85C\uADF8 \uB77C\uC778 \uBCF5\uC0AC",
              title: "\uB85C\uADF8 \uB77C\uC778 \uBCF5\uC0AC",
              onFocus: (event) => {
                rowFocusRef.current = event.target;
              },
              onBlur: (event) => {
                const node = event.target;
                if (rowFocusRef.current === node && node.isConnected) rowFocusRef.current = null;
              },
              onClick: () => copyLine(line, index),
              style: { width: 24, height: 24, border: "none", borderRadius: "var(--radius-sm)", background: copied ? "var(--color-semantic-inverse-fill-strong)" : "transparent", color: copied ? "var(--color-semantic-status-positive)" : "var(--color-semantic-inverse-label-neutral-soft)", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", alignSelf: "center" },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: copied ? "circle-check" : "copy", size: 14, "aria-hidden": "true" })
            }
          )
        ] }, index);
      }),
      virtualActive && bottomSpacer > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "aria-hidden": "true", style: { height: bottomSpacer } })
    ] })
  ] });
}



exports.LogViewer = LogViewer;
//# sourceMappingURL=chunk-M65TIF4X.cjs.map