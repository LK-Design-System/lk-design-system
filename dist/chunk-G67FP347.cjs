"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkKYDCOGHRcjs = require('./chunk-KYDCOGHR.cjs');






var _chunkE2R2I4Q2cjs = require('./chunk-E2R2I4Q2.cjs');

// components/overlay/Popover.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function Popover({
  trigger,
  children,
  align = "left",
  width = 260,
  open,
  defaultOpen = false,
  onOpenChange,
  ariaLabel = "\uD31D\uC624\uBC84",
  style,
  ...rest
}) {
  const [visible, setVisible] = _chunkE2R2I4Q2cjs.useControllableOpen.call(void 0, { open, defaultOpen, onOpenChange });
  const rootRef = _react2.default.useRef(null);
  const panelRef = _react2.default.useRef(null);
  const panelId = _react2.default.useId();
  const getTrigger = _react2.default.useCallback(() => _chunkE2R2I4Q2cjs.findOverlayTrigger.call(void 0, rootRef.current), []);
  const position = _chunkE2R2I4Q2cjs.useFloatingPosition.call(void 0, {
    open: visible,
    anchorRef: rootRef,
    panelRef,
    placement: "bottom"
  });
  _chunkE2R2I4Q2cjs.useLightDismiss.call(void 0, {
    open: visible,
    rootRef,
    getTrigger,
    onDismiss: () => setVisible(false)
  });
  const toggle = (event) => {
    _optionalChain([trigger, 'optionalAccess', _ => _.props, 'optionalAccess', _2 => _2.onClick, 'optionalCall', _3 => _3(event)]);
    if (!_optionalChain([event, 'optionalAccess', _4 => _4.defaultPrevented])) setVisible((current) => !current);
  };
  const triggerProps = {
    "data-anchored-overlay-trigger": "",
    "aria-haspopup": "dialog",
    "aria-expanded": visible,
    "aria-controls": visible ? _chunkE2R2I4Q2cjs.appendAriaReference.call(void 0, _optionalChain([trigger, 'optionalAccess', _5 => _5.props, 'optionalAccess', _6 => _6["aria-controls"]]), panelId) : _optionalChain([trigger, 'optionalAccess', _7 => _7.props, 'optionalAccess', _8 => _8["aria-controls"]]),
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
  const verticalStyle = position.placement === "top" ? { top: "auto", bottom: "calc(100% + 8px)" } : { top: "calc(100% + 8px)", bottom: "auto" };
  const horizontalStyle = align === "right" ? { left: "auto", right: 0 } : { left: 0, right: "auto" };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { ref: rootRef, style: { position: "relative", display: "inline-block", ...style }, ...rest, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex" }, children: renderedTrigger }),
    visible && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
      "div",
      {
        ref: panelRef,
        className: "lk-scroll-surface",
        "data-scrollbar": "compact",
        "data-scroll-gutter": "stable",
        id: panelId,
        role: "dialog",
        "aria-label": ariaLabel,
        "data-placement": position.placement,
        style: {
          ..._chunkKYDCOGHRcjs.anchoredPanelStyle.call(void 0, width),
          ...verticalStyle,
          ...horizontalStyle,
          maxHeight: _nullishCoalesce(position.maxHeight, () => ( void 0)),
          overflowY: "auto",
          scrollbarGutter: "stable",
          translate: `${position.shiftX}px ${position.shiftY}px`
        },
        children
      }
    )
  ] });
}



exports.Popover = Popover;
//# sourceMappingURL=chunk-G67FP347.cjs.map