"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVHQHPPYQcjs = require('./chunk-VHQHPPYQ.cjs');

// components/selection/ChoiceCard.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var radiusMap = {
  sm: "var(--radius-frame-sm)",
  md: "var(--radius-frame-md)",
  lg: "var(--radius-frame-lg)",
  xl: "var(--radius-frame-xl)"
};
var paddingMap = {
  sm: "var(--space-3)",
  md: "var(--space-4)",
  lg: "var(--space-5)",
  xl: "var(--space-6)"
};
var shadowMap = {
  none: "none",
  xs: "var(--shadow-xs)",
  sm: "var(--shadow-sm)",
  md: "var(--shadow-md)",
  lg: "var(--shadow-lg)"
};
function joinIds(...ids) {
  const merged = ids.filter(Boolean).join(" ").trim();
  return merged || void 0;
}
function ChoiceCard({
  children,
  selected = false,
  disabled = false,
  multiple = false,
  onSelect,
  name,
  inputValue,
  inputProps = {},
  title,
  description,
  icon,
  presentation = "choice",
  status = "normal",
  interaction,
  radius = "md",
  padding = "md",
  shadow,
  showIndicator = true,
  style,
  tabIndex,
  role,
  "aria-label": ariaLabel,
  onClick,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
  onKeyDown,
  ...rootProps
}) {
  const autoId = _react2.default.useId();
  const inputId = _nullishCoalesce(inputProps.id, () => ( `choice-card-${autoId}`));
  const [hovered, setHovered] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const isFrame = presentation === "frame";
  const nativeChoice = typeof onSelect === "function" && (role == null || role === "radio" || role === "checkbox");
  const customInteractive = !nativeChoice && !disabled && (onSelect || onClick);
  const resolvedRole = nativeChoice ? void 0 : _nullishCoalesce(role, () => ( (customInteractive ? multiple ? "checkbox" : "radio" : void 0)));
  const resolvedShadow = _nullishCoalesce(shadow, () => ( (isFrame ? "xs" : "none")));
  const activeHover = hovered || interaction === "hovered";
  const activeFocus = focused || interaction === "focused";
  const interactive = nativeChoice || customInteractive;
  const Root = nativeChoice ? "label" : "div";
  const showsText = !isFrame;
  const titleId = showsText && title != null ? `${inputId}-title` : void 0;
  const descriptionId = showsText && description != null ? `${inputId}-description` : void 0;
  const explicitName = _nullishCoalesce(ariaLabel, () => ( inputProps["aria-label"]));
  const choiceBorder = disabled ? "var(--color-semantic-line-normal-neutral)" : selected ? "var(--color-semantic-primary-normal)" : activeHover && !disabled ? "var(--color-semantic-line-solid-normal)" : "var(--color-semantic-line-normal-normal)";
  const frameBorder = disabled ? "var(--color-semantic-line-normal-normal)" : status === "negative" ? "var(--color-semantic-status-negative)" : selected || activeFocus ? "var(--color-semantic-primary-normal)" : activeHover ? "var(--color-semantic-line-solid-normal)" : "var(--color-semantic-line-normal-normal)";
  const frameInset = selected || activeFocus || status === "negative" ? 2 : 1;
  const frameShadow = [
    shadowMap[resolvedShadow] && shadowMap[resolvedShadow] !== "none" ? shadowMap[resolvedShadow] : null,
    `inset 0 0 0 ${frameInset}px ${frameBorder}`,
    activeFocus && !disabled ? "0 0 0 4px var(--color-semantic-focus-ring)" : null
  ].filter(Boolean).join(", ");
  const choiceShadow = [
    `inset 0 0 0 ${selected ? 1.5 : 1}px ${choiceBorder}`,
    activeFocus && !disabled ? "0 0 0 4px var(--color-semantic-focus-ring)" : null
  ].filter(Boolean).join(", ");
  const toggleCustom = () => {
    if (!disabled && onSelect) onSelect(multiple ? !selected : true);
  };
  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    _optionalChain([onClick, 'optionalCall', _ => _(event)]);
    if (!nativeChoice && !event.defaultPrevented) toggleCustom();
  };
  const handleKeyDown = (event) => {
    _optionalChain([onKeyDown, 'optionalCall', _2 => _2(event)]);
    if (event.defaultPrevented || disabled || nativeChoice) return;
    if ((event.key === "Enter" || event.key === " ") && onSelect) {
      event.preventDefault();
      toggleCustom();
    }
  };
  const frameStyle = {
    position: "relative",
    display: "block",
    padding: _nullishCoalesce(paddingMap[padding], () => ( paddingMap.md)),
    borderRadius: _nullishCoalesce(radiusMap[radius], () => ( radiusMap.md)),
    background: disabled ? "var(--color-semantic-fill-normal)" : selected ? "var(--color-semantic-primary-surface-strong)" : "var(--color-semantic-background-elevated-normal)",
    boxShadow: frameShadow,
    color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
    cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
    outline: "none",
    transition: "background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
    ...style
  };
  const choiceStyle = {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: "var(--radius-xl)",
    background: disabled ? "var(--color-semantic-fill-normal)" : selected ? "var(--color-semantic-primary-surface-normal)" : "var(--color-semantic-background-elevated-normal)",
    color: disabled ? "var(--color-semantic-label-disable)" : void 0,
    boxShadow: choiceShadow,
    cursor: disabled ? "not-allowed" : interactive ? "pointer" : "default",
    transition: "box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
    outline: "none",
    ...style
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    Root,
    {
      ...rootProps,
      htmlFor: nativeChoice ? inputId : void 0,
      role: resolvedRole,
      "aria-checked": resolvedRole === "checkbox" || resolvedRole === "radio" ? selected : void 0,
      "aria-selected": resolvedRole && ["option", "tab", "row", "gridcell", "treeitem"].includes(resolvedRole) ? selected || void 0 : void 0,
      "aria-disabled": !nativeChoice && disabled ? true : void 0,
      "aria-label": !nativeChoice ? ariaLabel : void 0,
      "aria-labelledby": !nativeChoice && resolvedRole ? _nullishCoalesce(rootProps["aria-labelledby"], () => ( (ariaLabel ? void 0 : titleId))) : rootProps["aria-labelledby"],
      "aria-describedby": !nativeChoice && resolvedRole ? joinIds(rootProps["aria-describedby"], descriptionId) : rootProps["aria-describedby"],
      "data-presentation": presentation,
      "data-selected": selected ? "" : void 0,
      "data-disabled": disabled ? "" : void 0,
      "data-status": isFrame ? status : void 0,
      "data-interaction": activeFocus ? "focused" : activeHover ? "hovered" : "normal",
      tabIndex: nativeChoice ? void 0 : disabled ? -1 : _nullishCoalesce(tabIndex, () => ( (customInteractive || resolvedRole ? 0 : void 0))),
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      onFocus: (event) => {
        if (!nativeChoice) setFocused(true);
        _optionalChain([onFocus, 'optionalCall', _3 => _3(event)]);
      },
      onBlur: (event) => {
        if (!nativeChoice) setFocused(false);
        _optionalChain([onBlur, 'optionalCall', _4 => _4(event)]);
      },
      onMouseEnter: (event) => {
        setHovered(true);
        _optionalChain([onMouseEnter, 'optionalCall', _5 => _5(event)]);
      },
      onMouseLeave: (event) => {
        setHovered(false);
        _optionalChain([onMouseLeave, 'optionalCall', _6 => _6(event)]);
      },
      style: isFrame ? frameStyle : choiceStyle,
      children: [
        nativeChoice && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "input",
          {
            ...inputProps,
            id: inputId,
            type: multiple ? "checkbox" : "radio",
            name: _nullishCoalesce(name, () => ( inputProps.name)),
            value: _nullishCoalesce(inputValue, () => ( inputProps.value)),
            checked: selected,
            disabled,
            tabIndex: _nullishCoalesce(tabIndex, () => ( inputProps.tabIndex)),
            "aria-label": explicitName,
            "aria-labelledby": explicitName ? void 0 : _nullishCoalesce(inputProps["aria-labelledby"], () => ( titleId)),
            "aria-describedby": joinIds(inputProps["aria-describedby"], descriptionId),
            onChange: (event) => {
              _optionalChain([inputProps, 'access', _7 => _7.onChange, 'optionalCall', _8 => _8(event)]);
              if (!event.defaultPrevented) onSelect(multiple ? event.target.checked : true);
            },
            onFocus: (event) => {
              setFocused(true);
              _optionalChain([inputProps, 'access', _9 => _9.onFocus, 'optionalCall', _10 => _10(event)]);
            },
            onBlur: (event) => {
              setFocused(false);
              _optionalChain([inputProps, 'access', _11 => _11.onBlur, 'optionalCall', _12 => _12(event)]);
            },
            style: {
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0,
              ...inputProps.style
            }
          }
        ),
        !isFrame && icon != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            style: {
              flexShrink: 0,
              color: disabled ? "var(--color-semantic-label-disable)" : selected ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-neutral)",
              display: "inline-flex"
            },
            children: icon
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { style: isFrame ? void 0 : { flex: 1, minWidth: 0 }, children: [
          !isFrame && title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: titleId, style: { fontSize: "var(--body2-size)", fontWeight: "var(--fw-bold)", letterSpacing: 0, color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-strong)", wordBreak: "keep-all" }, children: title }),
          !isFrame && description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: descriptionId, style: { marginTop: "var(--space-1)", fontSize: "var(--label2-size)", lineHeight: 1.55, color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)", wordBreak: "keep-all" }, children: description }),
          children
        ] }),
        !isFrame && showIndicator && /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          "span",
          {
            "aria-hidden": "true",
            "data-choice-indicator": "",
            style: {
              flexShrink: 0,
              width: 20,
              height: 20,
              borderRadius: multiple ? "var(--radius-sm)" : "50%",
              background: disabled ? selected ? "var(--color-semantic-fill-normal)" : "transparent" : selected ? "var(--color-semantic-primary-normal)" : "transparent",
              boxShadow: disabled || !selected ? "inset 0 0 0 1.5px var(--color-semantic-line-normal-neutral)" : "none",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-static-white)",
              transition: "background var(--dur-fast) var(--ease-out)"
            },
            children: selected && (multiple ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVHQHPPYQcjs.Icon, { name: "check", size: 12, "aria-hidden": "true" }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 12, height: 12, borderRadius: "50%", background: "currentColor" } }))
          }
        )
      ]
    }
  );
}



exports.ChoiceCard = ChoiceCard;
//# sourceMappingURL=chunk-IADMQRQW.cjs.map