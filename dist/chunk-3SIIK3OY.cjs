"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";

// components/robotics/Joystick.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var ZERO_VECTOR = { x: 0, y: 0 };
var ARROW_KEYS = /* @__PURE__ */ new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);
var isStopped = (value) => value.x === 0 && value.y === 0;
var describeCommand = ({ x, y }) => {
  const parts = [];
  if (Math.abs(y) >= 0.01) parts.push(`${y > 0 ? "\uC804\uC9C4" : "\uD6C4\uC9C4"} ${Math.round(Math.abs(y) * 100)}%`);
  if (Math.abs(x) >= 0.01) parts.push(`${x > 0 ? "\uC624\uB978\uCABD" : "\uC67C\uCABD"} ${Math.round(Math.abs(x) * 100)}%`);
  return `\uD604\uC7AC \uBA85\uB839: ${parts.length ? parts.join(" \xB7 ") : "\uC815\uC9C0"}`;
};
function Joystick({
  size = 160,
  onChange,
  onEnd,
  sticky = false,
  disabled = false,
  label = "\uC870\uC774\uC2A4\uD2F1",
  instructions = "\uB204\uB974\uACE0 \uC788\uB294 \uB3D9\uC548 \uC774\uB3D9 \xB7 \uD654\uC0B4\uD45C \uD0A4\uB97C \uB193\uC73C\uBA74 \uC815\uC9C0",
  showValue = true,
  style,
  ...rest
}) {
  const ref = _react2.default.useRef(null);
  const positionRef = _react2.default.useRef(ZERO_VECTOR);
  const commandRef = _react2.default.useRef(ZERO_VECTOR);
  const engagedRef = _react2.default.useRef(false);
  const pointerIdRef = _react2.default.useRef(null);
  const activeKeysRef = _react2.default.useRef(/* @__PURE__ */ new Set());
  const onChangeRef = _react2.default.useRef(onChange);
  const onEndRef = _react2.default.useRef(onEnd);
  const [position, setPosition] = _react2.default.useState(ZERO_VECTOR);
  const [command, setCommand] = _react2.default.useState(ZERO_VECTOR);
  const [active, setActive] = _react2.default.useState(false);
  const [focus, setFocus] = _react2.default.useState(false);
  const labelId = _react2.default.useId();
  const instructionsId = _react2.default.useId();
  const valueId = _react2.default.useId();
  onChangeRef.current = onChange;
  onEndRef.current = onEnd;
  const radius = size / 2;
  const knob = Math.round(size * 0.32);
  const max = Math.max(1, radius - knob / 2 - 4);
  const emitCommand = _react2.default.useCallback((next) => {
    commandRef.current = next;
    setCommand(next);
    _optionalChain([onChangeRef, 'access', _ => _.current, 'optionalCall', _2 => _2({ ...next })]);
  }, []);
  const emitPosition = _react2.default.useCallback((x, y) => {
    const nextPosition = { x, y };
    const nextCommand = {
      x: +(x / max).toFixed(3),
      y: +(-y / max).toFixed(3)
    };
    positionRef.current = nextPosition;
    setPosition(nextPosition);
    emitCommand(nextCommand);
  }, [emitCommand, max]);
  const endInteraction = _react2.default.useCallback((reason) => {
    const hadActiveCommand = engagedRef.current || !isStopped(commandRef.current);
    const preserveVisualPosition = sticky && (reason === "pointer-release" || reason === "keyboard-release");
    positionRef.current = ZERO_VECTOR;
    if (!preserveVisualPosition) setPosition(ZERO_VECTOR);
    if (!hadActiveCommand) return;
    engagedRef.current = false;
    pointerIdRef.current = null;
    activeKeysRef.current.clear();
    setActive(false);
    emitCommand(ZERO_VECTOR);
    _optionalChain([onEndRef, 'access', _3 => _3.current, 'optionalCall', _4 => _4(reason)]);
  }, [emitCommand, sticky]);
  const beginInteraction = () => {
    if (!engagedRef.current) {
      engagedRef.current = true;
      setActive(true);
    }
  };
  const setFromClientPoint = (clientX, clientY) => {
    const element = ref.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    let x = clientX - (bounds.left + radius);
    let y = clientY - (bounds.top + radius);
    const distance = Math.hypot(x, y);
    if (distance > max) {
      x = x / distance * max;
      y = y / distance * max;
    }
    emitPosition(x, y);
  };
  const handlePointerDown = (event) => {
    if (disabled || engagedRef.current || event.isPrimary === false || event.pointerType === "mouse" && event.button !== 0) return;
    pointerIdRef.current = event.pointerId;
    beginInteraction();
    event.currentTarget.focus({ preventScroll: true });
    try {
      _optionalChain([event, 'access', _5 => _5.currentTarget, 'access', _6 => _6.setPointerCapture, 'optionalCall', _7 => _7(event.pointerId)]);
    } catch (e) {
    }
    setFromClientPoint(event.clientX, event.clientY);
  };
  const handlePointerMove = (event) => {
    if (!engagedRef.current || pointerIdRef.current !== event.pointerId) return;
    setFromClientPoint(event.clientX, event.clientY);
  };
  const handlePointerEnd = (reason) => (event) => {
    if (pointerIdRef.current != null && pointerIdRef.current !== event.pointerId) return;
    endInteraction(reason);
  };
  const emitKeyboardVector = () => {
    const keys = activeKeysRef.current;
    const step = max * 0.68;
    let x = ((keys.has("ArrowRight") ? 1 : 0) - (keys.has("ArrowLeft") ? 1 : 0)) * step;
    let y = ((keys.has("ArrowDown") ? 1 : 0) - (keys.has("ArrowUp") ? 1 : 0)) * step;
    const distance = Math.hypot(x, y);
    if (distance > max) {
      x = x / distance * max;
      y = y / distance * max;
    }
    emitPosition(x, y);
  };
  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === " " || event.key === "Escape") {
      event.preventDefault();
      endInteraction("keyboard-cancel");
      return;
    }
    if (!ARROW_KEYS.has(event.key) || pointerIdRef.current != null) return;
    event.preventDefault();
    beginInteraction();
    activeKeysRef.current.add(event.key);
    emitKeyboardVector();
  };
  const handleKeyUp = (event) => {
    if (!ARROW_KEYS.has(event.key)) return;
    if (pointerIdRef.current != null) return;
    event.preventDefault();
    activeKeysRef.current.delete(event.key);
    if (activeKeysRef.current.size === 0) {
      endInteraction("keyboard-release");
      return;
    }
    emitKeyboardVector();
  };
  _react2.default.useEffect(() => {
    if (disabled) endInteraction("disabled");
  }, [disabled, endInteraction]);
  _react2.default.useEffect(() => () => {
    if (!engagedRef.current && isStopped(commandRef.current)) return;
    engagedRef.current = false;
    pointerIdRef.current = null;
    activeKeysRef.current.clear();
    commandRef.current = ZERO_VECTOR;
    _optionalChain([onChangeRef, 'access', _8 => _8.current, 'optionalCall', _9 => _9({ ...ZERO_VECTOR })]);
    _optionalChain([onEndRef, 'access', _10 => _10.current, 'optionalCall', _11 => _11("unmount")]);
  }, []);
  const visibleLabel = _nullishCoalesce(label, () => ( "\uC870\uC774\uC2A4\uD2F1"));
  const describedBy = [instructions != null ? instructionsId : null, showValue ? valueId : null].filter(Boolean).join(" ") || void 0;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      style: {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-2)",
        width: `min(100%, ${Math.max(size, 220)}px)`,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            ref,
            role: "application",
            "aria-labelledby": labelId,
            "aria-describedby": describedBy,
            "aria-disabled": disabled || void 0,
            "aria-keyshortcuts": "ArrowUp ArrowDown ArrowLeft ArrowRight Space Escape",
            tabIndex: disabled ? -1 : 0,
            "data-active": active ? "true" : "false",
            "data-command-x": command.x,
            "data-command-y": command.y,
            "data-position-x": position.x,
            "data-position-y": position.y,
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: handlePointerEnd("pointer-release"),
            onPointerCancel: handlePointerEnd("pointer-cancel"),
            onLostPointerCapture: handlePointerEnd("pointer-capture-lost"),
            onKeyDown: handleKeyDown,
            onKeyUp: handleKeyUp,
            onFocus: () => setFocus(true),
            onBlur: () => {
              setFocus(false);
              endInteraction("blur");
            },
            style: {
              position: "relative",
              flex: "0 0 auto",
              width: size,
              height: size,
              borderRadius: "50%",
              outline: "none",
              background: "var(--color-semantic-fill-normal)",
              border: "1px solid var(--color-semantic-line-normal-normal)",
              boxShadow: focus ? "0 0 0 4px var(--color-semantic-focus-ring)" : "inset var(--shadow-sm)",
              touchAction: "none",
              cursor: disabled ? "not-allowed" : active ? "grabbing" : "grab",
              opacity: disabled ? 0.45 : 1
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { position: "absolute", left: "50%", top: 10, bottom: 10, width: 1, background: "var(--color-semantic-line-normal-neutral)", transform: "translateX(-0.5px)" } }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { "aria-hidden": "true", style: { position: "absolute", top: "50%", left: 10, right: 10, height: 1, background: "var(--color-semantic-line-normal-neutral)", transform: "translateY(-0.5px)" } }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: knob,
                    height: knob,
                    marginLeft: -knob / 2,
                    marginTop: -knob / 2,
                    borderRadius: "50%",
                    background: "var(--color-semantic-primary-normal)",
                    boxShadow: "var(--shadow-control)",
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: active ? "none" : "transform var(--dur-base) var(--ease-out)"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            id: labelId,
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: "var(--label2-size)",
              lineHeight: "var(--label2-line)",
              fontWeight: "var(--fw-semibold)",
              color: "var(--color-semantic-label-strong)",
              textAlign: "center"
            },
            children: visibleLabel
          }
        ),
        showValue && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            id: valueId,
            "data-testid": "joystick-command",
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)",
              fontWeight: "var(--fw-semibold)",
              color: "var(--color-semantic-label-neutral)",
              textAlign: "center"
            },
            children: describeCommand(command)
          }
        ),
        instructions != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            id: instructionsId,
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: "var(--caption1-size)",
              lineHeight: "var(--caption1-line)",
              color: "var(--color-semantic-label-alternative)",
              textAlign: "center"
            },
            children: instructions
          }
        )
      ]
    }
  );
}



exports.Joystick = Joystick;
//# sourceMappingURL=chunk-3SIIK3OY.cjs.map