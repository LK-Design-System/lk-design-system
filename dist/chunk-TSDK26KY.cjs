"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkKYDCOGHRcjs = require('./chunk-KYDCOGHR.cjs');







var _chunk6GVVQEMRcjs = require('./chunk-6GVVQEMR.cjs');





var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');




var _chunk4WXZPYJGcjs = require('./chunk-4WXZPYJG.cjs');

// components/overlay/Popover.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var INERT_VALUE = Number.parseInt(_react2.default.version, 10) >= 19 ? true : "true";
var Popover = _react2.default.forwardRef(function Popover2({
  trigger,
  children,
  align = "left",
  position: requestedPosition = "bottom",
  offset = 8,
  width = 260,
  open,
  defaultOpen = false,
  onOpenChange,
  ariaLabel = "\uD31D\uC624\uBC84",
  withinPortal = true,
  portalTarget,
  collisionBoundary,
  collisionPadding = 16,
  zIndex,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const [visible, setVisible] = _chunk6GVVQEMRcjs.useControllableOpen.call(void 0, { open, defaultOpen, onOpenChange });
  const rootRef = _react2.default.useRef(null);
  const panelRef = _react2.default.useRef(null);
  const panelId = _react2.default.useId();
  const { mounted, shown, onTransitionEnd } = _chunk4WXZPYJGcjs.useOverlayPresence.call(void 0, visible, panelRef);
  const mergedRootRef = _chunkGWMGPLNWcjs.useMergedRefs.call(void 0, rootRef, forwardedRef);
  const getTrigger = _react2.default.useCallback(() => _chunk6GVVQEMRcjs.findOverlayTrigger.call(void 0, rootRef.current), []);
  const position = _chunk6GVVQEMRcjs.useFloatingPosition.call(void 0, {
    open: mounted,
    anchorRef: rootRef,
    panelRef,
    placement: requestedPosition,
    offset,
    viewportPadding: collisionPadding,
    collisionBoundary,
    strategy: withinPortal ? "fixed" : "absolute",
    align
  });
  const layer = _chunk6GVVQEMRcjs.useLightDismiss.call(void 0, {
    open: visible,
    rootRef,
    getTrigger,
    onDismiss: () => setVisible(false),
    insideRefs: [panelRef],
    zIndex
  });
  const boundaryMaxWidth = collisionBoundary != null && position.maxWidth != null ? `${position.maxWidth}px` : null;
  const boundaryMaxHeight = collisionBoundary != null && position.maxHeight != null ? `${position.maxHeight}px` : null;
  const toggle = (event) => {
    _optionalChain([trigger, 'optionalAccess', _ => _.props, 'optionalAccess', _2 => _2.onClick, 'optionalCall', _3 => _3(event)]);
    if (!_optionalChain([event, 'optionalAccess', _4 => _4.defaultPrevented])) setVisible((current) => !current);
  };
  const triggerProps = {
    "data-anchored-overlay-trigger": "",
    "aria-haspopup": "dialog",
    "aria-expanded": visible,
    "aria-controls": visible ? _chunk6GVVQEMRcjs.appendAriaReference.call(void 0, _optionalChain([trigger, 'optionalAccess', _5 => _5.props, 'optionalAccess', _6 => _6["aria-controls"]]), panelId) : _optionalChain([trigger, 'optionalAccess', _7 => _7.props, 'optionalAccess', _8 => _8["aria-controls"]]),
    onClick: toggle
  };
  const renderedTrigger = _react2.default.isValidElement(trigger) && trigger.type !== _react2.default.Fragment ? _react2.default.cloneElement(trigger, triggerProps) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      ...triggerProps,
      role: "button",
      tabIndex: 0,
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle(event);
        }
      },
      children: trigger
    }
  );
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: mergedRootRef,
      "data-slot": "root",
      "data-open": visible ? "true" : void 0,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
      style: { ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-popover-"), position: "relative", display: "inline-block", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"), ...style },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "data-slot": "trigger", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "trigger") || void 0, style: { display: "inline-flex", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "trigger") }, children: renderedTrigger }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _chunk4WXZPYJGcjs.OverlayPortal, { open: mounted, interactionOpen: visible, withinPortal, portalTarget, anchorRef: rootRef, layer: "anchored", children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: _chunk4WXZPYJGcjs.OVERLAY_MOTION_STYLES }),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "div",
            {
              ref: panelRef,
              "data-slot": "panel",
              "data-popover-portal": withinPortal ? "true" : void 0,
              className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "panel", "lk-scroll-surface") || void 0,
              "data-scrollbar": "compact",
              "data-scroll-gutter": "stable",
              id: panelId,
              role: "dialog",
              "aria-label": ariaLabel,
              "aria-hidden": visible ? void 0 : true,
              inert: visible ? void 0 : INERT_VALUE,
              "data-lds-overlay-motion": "",
              "data-placement": position.placement,
              onTransitionEnd,
              style: {
                ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-popover-"),
                ..._chunkKYDCOGHRcjs.anchoredPanelStyle.call(void 0, width),
                width: `var(--lds-popover-width, ${typeof width === "number" ? `${width}px` : width})`,
                ...withinPortal ? { position: "fixed", top: _nullishCoalesce(position.y, () => ( -9999)), left: _nullishCoalesce(position.x, () => ( -9999)), right: "auto", bottom: "auto", translate: "none" } : _chunk6GVVQEMRcjs.inlineFloatingStyle.call(void 0, { placement: position.placement, align, offset, shiftX: position.shiftX, shiftY: position.shiftY }),
                zIndex: layer.zIndex,
                maxHeight: `var(--lds-popover-max-height, ${position.maxHeight == null ? "none" : `${position.maxHeight}px`})`,
                overflowY: "auto",
                scrollbarGutter: "stable",
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : `translateY(${position.placement === "top" ? "var(--space-1)" : "calc(-1 * var(--space-1))"})`,
                transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
                ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "panel"),
                ...boundaryMaxWidth == null ? null : { minWidth: 0, maxWidth: boundaryMaxWidth },
                ...boundaryMaxHeight == null ? null : { minHeight: 0, maxHeight: boundaryMaxHeight, overflow: "auto" },
                ...visible ? {} : { pointerEvents: "none" }
              },
              children
            }
          )
        ] })
      ]
    }
  );
});



exports.Popover = Popover;
//# sourceMappingURL=chunk-TSDK26KY.cjs.map