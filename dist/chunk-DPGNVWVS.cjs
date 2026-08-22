"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkKYDCOGHRcjs = require('./chunk-KYDCOGHR.cjs');






var _chunkZRHSDRSMcjs = require('./chunk-ZRHSDRSM.cjs');

// components/overlay/HoverCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function HoverCard({
  trigger,
  children,
  align = "left",
  width = 280,
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 120,
  closeDelay = 120,
  style,
  panelStyle,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}) {
  const [visible, setVisible] = _chunkZRHSDRSMcjs.useControllableOpen.call(void 0, { open, defaultOpen, onOpenChange });
  const timerRef = _react2.default.useRef(null);
  const rootRef = _react2.default.useRef(null);
  const panelRef = _react2.default.useRef(null);
  const panelId = _react2.default.useId();
  const getTrigger = _react2.default.useCallback(() => _chunkZRHSDRSMcjs.findOverlayTrigger.call(void 0, rootRef.current), []);
  const position = _chunkZRHSDRSMcjs.useFloatingPosition.call(void 0, {
    open: visible,
    anchorRef: rootRef,
    panelRef,
    placement: "bottom"
  });
  _chunkZRHSDRSMcjs.useLightDismiss.call(void 0, {
    open: visible,
    rootRef,
    getTrigger,
    onDismiss: () => setVisible(false),
    outsidePress: false
  });
  _react2.default.useEffect(() => () => clearTimeout(timerRef.current), []);
  const schedule = (next, delay) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(next), delay);
  };
  const show = (event) => {
    _optionalChain([onMouseEnter, 'optionalCall', _ => _(event)]);
    schedule(true, openDelay);
  };
  const hide = (event) => {
    _optionalChain([onMouseLeave, 'optionalCall', _2 => _2(event)]);
    schedule(false, closeDelay);
  };
  const showOnFocus = (event) => {
    _optionalChain([onFocus, 'optionalCall', _3 => _3(event)]);
    clearTimeout(timerRef.current);
    setVisible(true);
  };
  const hideOnBlur = (event) => {
    _optionalChain([onBlur, 'optionalCall', _4 => _4(event)]);
    if (!event.currentTarget.contains(event.relatedTarget)) schedule(false, closeDelay);
  };
  const renderedTrigger = _react2.default.isValidElement(trigger) && trigger.type !== _react2.default.Fragment ? _react2.default.cloneElement(trigger, {
    "data-anchored-overlay-trigger": "",
    "aria-describedby": _chunkZRHSDRSMcjs.appendAriaReference.call(void 0, trigger.props["aria-describedby"], panelId)
  }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    "span",
    {
      "data-anchored-overlay-trigger": "",
      "aria-describedby": panelId,
      tabIndex: 0,
      children: trigger
    }
  );
  const verticalStyle = position.placement === "top" ? { top: "auto", bottom: "calc(100% + 8px)" } : { top: "calc(100% + 8px)", bottom: "auto" };
  const horizontalStyle = align === "right" ? { left: "auto", right: 0 } : { left: 0, right: "auto" };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "span",
    {
      ref: rootRef,
      style: { position: "relative", display: "inline-flex", ...style },
      ...rest,
      onMouseEnter: show,
      onMouseLeave: hide,
      onFocus: showOnFocus,
      onBlur: hideOnBlur,
      children: [
        renderedTrigger,
        visible && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "div",
          {
            ref: panelRef,
            className: "lk-scroll-surface",
            "data-scrollbar": "compact",
            "data-scroll-gutter": "stable",
            id: panelId,
            role: "tooltip",
            "data-placement": position.placement,
            style: {
              ..._chunkKYDCOGHRcjs.anchoredPanelStyle.call(void 0, width),
              ...verticalStyle,
              ...horizontalStyle,
              maxHeight: _nullishCoalesce(position.maxHeight, () => ( void 0)),
              overflowY: "auto",
              scrollbarGutter: "stable",
              translate: `${position.shiftX}px ${position.shiftY}px`,
              ...panelStyle
            },
            children
          }
        )
      ]
    }
  );
}



exports.HoverCard = HoverCard;
//# sourceMappingURL=chunk-DPGNVWVS.cjs.map