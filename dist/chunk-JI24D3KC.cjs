"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk23ETEWGRcjs = require('./chunk-23ETEWGR.cjs');

// components/editor/CanvasEditorShell.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function useControllableOpen(value, defaultValue, onChange) {
  const controlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const current = controlled ? value : internal;
  const setCurrent = _react2.default.useCallback((next, reason = "toggle") => {
    if (!controlled) setInternal(next);
    _optionalChain([onChange, 'optionalCall', _ => _(next, reason)]);
  }, [controlled, onChange]);
  return [current, setCurrent];
}
function CanvasEditorDockRegion({
  className,
  side,
  open,
  onOpenChange,
  reasonRef,
  width,
  minWidth,
  maxWidth,
  resizable,
  onWidthChange,
  label,
  style,
  children
}) {
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "div",
    {
      className,
      onKeyDownCapture: (event) => {
        if (event.key === "Escape") reasonRef.current = "escape";
      },
      style: { minWidth: 0, minHeight: 0, zIndex: 2, ...style },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _chunk23ETEWGRcjs.DockPanel,
        {
          side,
          open,
          onOpenChange,
          width,
          minWidth,
          maxWidth,
          resizable,
          onWidthChange,
          bodyPadding: 0,
          bodyStyle: { overflow: "hidden" },
          "aria-label": label,
          style: { width: "100%" },
          children
        }
      )
    }
  );
}
function CanvasEditorShell({
  title,
  description,
  headerStart,
  toolbar,
  subheader,
  responsiveNavigation,
  tools,
  layers,
  children,
  panel,
  panelMode = "docked",
  panelOpen,
  defaultPanelOpen = true,
  onPanelOpenChange,
  layersOpen,
  defaultLayersOpen = true,
  onLayersOpenChange,
  status,
  panelWidth = 280,
  panelMinWidth = 240,
  panelMaxWidth = 420,
  onPanelWidthChange,
  layerPanelWidth = 236,
  layerPanelMinWidth = 200,
  layerPanelMaxWidth = 360,
  onLayerPanelWidthChange,
  resizablePanels = true,
  mobileActiveRegion = "canvas",
  toolsLabel = "\uD3B8\uC9D1 \uB3C4\uAD6C",
  layersLabel = "\uB808\uC774\uC5B4",
  canvasLabel = "\uD3B8\uC9D1 \uCE94\uBC84\uC2A4",
  panelLabel = "\uC18D\uC131 \uD328\uB110",
  statusLabel = "\uD3B8\uC9D1 \uC0C1\uD0DC",
  className,
  style,
  ...rest
}) {
  const shellClass = "lk-canvas-editor-shell";
  const rootClassName = [shellClass, className].filter(Boolean).join(" ");
  const hasTools = tools != null;
  const hasLayers = layers != null;
  const hasPanel = panel != null;
  const isPanelDrawer = panelMode === "drawer";
  const [isPanelOpen, setPanelOpen] = useControllableOpen(
    panelOpen,
    defaultPanelOpen,
    onPanelOpenChange
  );
  const [isLayersOpen, setLayersOpen] = useControllableOpen(
    layersOpen,
    defaultLayersOpen,
    onLayersOpenChange
  );
  const panelReasonRef = _react2.default.useRef("toggle");
  const layersReasonRef = _react2.default.useRef("toggle");
  const hasHeader = title != null || description != null || headerStart != null || toolbar != null;
  const bodyClass = [
    "lk-canvas-editor-shell__body",
    hasTools ? "lk-canvas-editor-shell__body--tools" : "",
    hasLayers ? "lk-canvas-editor-shell__body--layers" : "",
    hasPanel && !isPanelDrawer ? "lk-canvas-editor-shell__body--panel" : "",
    hasPanel && isPanelDrawer ? "lk-canvas-editor-shell__body--drawer" : ""
  ].filter(Boolean).join(" ");
  const handlePanelOpenChange = (open) => {
    const reason = panelReasonRef.current;
    panelReasonRef.current = "toggle";
    setPanelOpen(open, reason);
  };
  const handleLayersOpenChange = (open) => {
    const reason = layersReasonRef.current;
    layersReasonRef.current = "toggle";
    setLayersOpen(open, reason);
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      className: rootClassName,
      style: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 320,
        containerType: "inline-size",
        border: "1px solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--color-semantic-background-elevated-normal)",
        color: "var(--color-semantic-label-normal)",
        fontFamily: "var(--font-sans)",
        "--canvas-editor-panel-width": `${panelWidth}px`,
        ...style
      },
      ...rest,
      children: [
        hasHeader && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "header",
          {
            className: "lk-canvas-editor-shell__header",
            style: {
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              minHeight: 56,
              padding: headerStart != null ? "var(--space-2) var(--space-4) var(--space-2) var(--space-2)" : "var(--space-2) var(--space-4)",
              borderBottom: "1px solid var(--color-semantic-line-normal-normal)",
              boxSizing: "border-box",
              flexShrink: 0
            },
            children: [
              headerStart != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-1)", flexShrink: 0 }, children: headerStart }),
              (title != null || description != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: { display: "grid", gap: 2, minWidth: 0, flex: 1 }, children: [
                title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "h2", { style: { minWidth: 0, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--headline2-size)", lineHeight: "var(--headline2-line)", fontWeight: "var(--fw-bold)", color: "var(--color-semantic-label-strong)", letterSpacing: 0 }, children: title }),
                description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-canvas-editor-shell__header-description", style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", fontWeight: "var(--fw-medium)", color: "var(--color-semantic-label-neutral)", letterSpacing: 0 }, children: description })
              ] }),
              toolbar != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { style: { display: "inline-flex", alignItems: "center", gap: "var(--space-2)", marginLeft: title == null && description == null ? "auto" : 0, flexShrink: 0 }, children: toolbar })
            ]
          }
        ),
        subheader != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-canvas-editor-shell__subheader", style: { flexShrink: 0 }, children: subheader }),
        responsiveNavigation != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { className: "lk-canvas-editor-shell__responsive-navigation", style: { flexShrink: 0 }, children: responsiveNavigation }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
          "div",
          {
            className: bodyClass,
            "data-mobile-region": mobileActiveRegion,
            "data-mobile-has-tools": hasTools ? "true" : "false",
            style: {
              display: "grid",
              gridTemplateColumns: `${hasTools ? "auto " : ""}${hasLayers ? "auto " : ""}minmax(0, 1fr)${hasPanel && !isPanelDrawer ? " auto" : ""}`,
              gridTemplateRows: "minmax(0, 1fr)",
              position: "relative",
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden"
            },
            children: [
              hasTools && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "div",
                {
                  role: "group",
                  "aria-label": toolsLabel,
                  className: "lk-canvas-editor-shell__tools",
                  style: { display: "flex", flexDirection: "column", gap: "var(--space-1)", minHeight: 0, padding: "var(--space-2)", borderRight: "1px solid var(--color-semantic-line-normal-normal)", background: "var(--color-semantic-background-elevated-normal)", boxSizing: "border-box" },
                  children: tools
                }
              ),
              hasLayers && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                CanvasEditorDockRegion,
                {
                  className: "lk-canvas-editor-shell__layers",
                  side: "left",
                  open: isLayersOpen,
                  onOpenChange: handleLayersOpenChange,
                  reasonRef: layersReasonRef,
                  width: layerPanelWidth,
                  minWidth: layerPanelMinWidth,
                  maxWidth: layerPanelMaxWidth,
                  resizable: resizablePanels,
                  onWidthChange: onLayerPanelWidthChange,
                  label: layersLabel,
                  children: layers
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "section",
                {
                  className: "lk-canvas-editor-shell__canvas",
                  "aria-label": canvasLabel,
                  style: { minWidth: 0, minHeight: 0, position: "relative", overflow: "hidden", background: "var(--color-semantic-background-normal-alternative)" },
                  children
                }
              ),
              hasPanel && !isPanelDrawer && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                CanvasEditorDockRegion,
                {
                  className: "lk-canvas-editor-shell__panel lk-canvas-editor-shell__panel--docked",
                  side: "right",
                  open: isPanelOpen,
                  onOpenChange: handlePanelOpenChange,
                  reasonRef: panelReasonRef,
                  width: panelWidth,
                  minWidth: panelMinWidth,
                  maxWidth: panelMaxWidth,
                  resizable: resizablePanels,
                  onWidthChange: onPanelWidthChange,
                  label: panelLabel,
                  children: panel
                }
              ),
              hasPanel && isPanelDrawer && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                CanvasEditorDockRegion,
                {
                  className: "lk-canvas-editor-shell__panel lk-canvas-editor-shell__panel--drawer",
                  side: "right",
                  open: isPanelOpen,
                  onOpenChange: handlePanelOpenChange,
                  reasonRef: panelReasonRef,
                  width: panelWidth,
                  minWidth: panelMinWidth,
                  maxWidth: panelMaxWidth,
                  resizable: resizablePanels,
                  onWidthChange: onPanelWidthChange,
                  label: panelLabel,
                  style: { position: "absolute", inset: "0 0 0 auto", zIndex: 4, width: isPanelOpen ? panelWidth : 0, minWidth: 0, pointerEvents: "auto" },
                  children: panel
                }
              )
            ]
          }
        ),
        status != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            role: "group",
            "aria-label": statusLabel,
            className: "lk-canvas-editor-shell__status",
            style: { display: "flex", alignItems: "center", minWidth: 0, minHeight: 32, padding: "var(--space-1) var(--space-4)", borderTop: "1px solid var(--color-semantic-line-normal-normal)", fontSize: "var(--caption1-size)", lineHeight: "var(--caption1-line)", color: "var(--color-semantic-label-neutral)", background: "var(--color-semantic-background-normal-alternative)", boxSizing: "border-box", flexShrink: 0 },
            children: status
          }
        )
      ]
    }
  );
}



exports.CanvasEditorShell = CanvasEditorShell;
//# sourceMappingURL=chunk-JI24D3KC.cjs.map