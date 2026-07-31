"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";







var _chunk4KUVQPIKcjs = require('./chunk-4KUVQPIK.cjs');


var _chunkT7L6VXSAcjs = require('./chunk-T7L6VXSA.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/forms/Select.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function normalizeOption(option) {
  return typeof option === "string" ? { value: option, label: option, disabled: false } : { ...option, disabled: Boolean(option.disabled) };
}
function enabledIndices(options) {
  return options.flatMap((option, index) => option.disabled ? [] : [index]);
}
function moveEnabled(options, currentIndex, direction) {
  const enabled = enabledIndices(options);
  if (!enabled.length) return -1;
  if (currentIndex < 0) return direction > 0 ? enabled[0] : enabled[enabled.length - 1];
  if (direction > 0) return _nullishCoalesce(enabled.find((index) => index > currentIndex), () => ( currentIndex));
  return _nullishCoalesce([...enabled].reverse().find((index) => index < currentIndex), () => ( currentIndex));
}
function optionText(option) {
  if (typeof option.label === "string" || typeof option.label === "number") return String(option.label);
  return String(option.value);
}
function nearestEnabled(options, preferredIndex) {
  if (options[preferredIndex] && !options[preferredIndex].disabled) return preferredIndex;
  const after = enabledIndices(options).find((index) => index > preferredIndex);
  if (after != null) return after;
  return _nullishCoalesce([...enabledIndices(options)].reverse().find((index) => index < preferredIndex), () => ( -1));
}
function Select({
  label,
  helper,
  error,
  options,
  value,
  defaultValue,
  placeholder = "\uC120\uD0DD\uD574 \uC8FC\uC138\uC694.",
  onChange,
  required = false,
  invalid = false,
  status = "normal",
  disabled = false,
  readOnly = false,
  disable = false,
  negative = false,
  size = "md",
  defaultOpen = false,
  interaction,
  active = false,
  focus = false,
  overflow,
  platform,
  variant,
  render = "text",
  iconLeft,
  id,
  children,
  style,
  ...rest
}) {
  const norm = _react2.default.useMemo(() => {
    if (options && options.length) return options.map(normalizeOption);
    return _react2.default.Children.toArray(children).filter((c) => c && c.type === "option").map((c) => ({
      value: c.props.value != null ? c.props.value : String(c.props.children),
      label: c.props.children,
      disabled: Boolean(c.props.disabled)
    }));
  }, [options, children]);
  const disabledState = disabled || disable || interaction === "inactive";
  const locked = disabledState || readOnly;
  const isControlled = value !== void 0;
  const [internal, setInternal] = _react2.default.useState(defaultValue);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = _react2.default.useState(() => Boolean(defaultOpen && !locked));
  const [activeIndex, setActiveIndex] = _react2.default.useState(-1);
  const [hover, setHover] = _react2.default.useState(false);
  const ref = _react2.default.useRef(null);
  const triggerRef = _react2.default.useRef(null);
  const optionRefs = _react2.default.useRef([]);
  const autoId = _react2.default.useId();
  const selId = id || `sel-${autoId}`;
  const labelId = `${selId}-label`;
  const listboxId = `${selId}-listbox`;
  const message = _nullishCoalesce(error, () => ( helper));
  const messageId = message != null ? `${selId}-message` : void 0;
  const {
    onClick: onTriggerClick,
    onKeyDown: onTriggerKeyDown,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    ...triggerProps
  } = rest;
  const describedBy = _chunk4KUVQPIKcjs.mergeIds.call(void 0, ariaDescribedBy, messageId);
  _chunkT7L6VXSAcjs.useLightDismiss.call(void 0, {
    open: open && !locked,
    rootRef: ref,
    getTrigger: () => triggerRef.current,
    onDismiss: () => setOpen(false)
  });
  const curr = norm.find((x) => x.value === sel);
  const selectedIndex = norm.findIndex((x) => x.value === sel);
  const normalizedSize = size === "small" ? "sm" : size === "medium" ? "md" : size === "large" ? "lg" : size;
  const h = normalizedSize === "sm" ? "var(--control-h-sm)" : normalizedSize === "lg" ? "var(--control-h-lg)" : "var(--control-h-md)";
  const isInvalid = invalid || negative || status === "negative" || error != null;
  const visualOpen = !locked && (open || interaction === "open");
  const activeFocus = visualOpen || focus || interaction === "focused" || interaction === "active-focused";
  const activeHover = !readOnly && (hover || active || interaction === "hovered" || interaction === "active" || interaction === "active-focused");
  const ring = _chunk4KUVQPIKcjs.fieldBorderColor.call(void 0, { disabled: disabledState, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  _react2.default.useEffect(() => {
    if (!visualOpen) return;
    setActiveIndex((current) => {
      if (norm[current] && !norm[current].disabled) return current;
      const selectedEnabled = nearestEnabled(norm, selectedIndex);
      if (selectedEnabled >= 0) return selectedEnabled;
      return _nullishCoalesce(enabledIndices(norm)[0], () => ( -1));
    });
  }, [norm, selectedIndex, visualOpen]);
  _react2.default.useEffect(() => {
    if (!locked) return;
    setOpen(false);
    setActiveIndex(-1);
  }, [locked]);
  _react2.default.useEffect(() => {
    if (!visualOpen || activeIndex < 0) return;
    _optionalChain([optionRefs, 'access', _ => _.current, 'access', _2 => _2[activeIndex], 'optionalAccess', _3 => _3.scrollIntoView, 'optionalCall', _4 => _4({ block: "nearest" })]);
  }, [activeIndex, visualOpen]);
  const openList = (preferredIndex = selectedIndex >= 0 ? selectedIndex : 0) => {
    if (locked) return;
    setActiveIndex(nearestEnabled(norm, preferredIndex));
    setOpen(true);
  };
  const closeList = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (restoreFocus) _optionalChain([triggerRef, 'access', _5 => _5.current, 'optionalAccess', _6 => _6.focus, 'call', _7 => _7()]);
  };
  const pick = (index) => {
    if (locked) return;
    const option = norm[index];
    if (!option || option.disabled) return;
    if (!isControlled) setInternal(option.value);
    _optionalChain([onChange, 'optionalCall', _8 => _8(option.value)]);
    setActiveIndex(index);
    closeList({ restoreFocus: true });
  };
  const handleTriggerClick = (event) => {
    _optionalChain([onTriggerClick, 'optionalCall', _9 => _9(event)]);
    if (event.defaultPrevented || disabledState || readOnly) return;
    if (open) closeList();
    else openList();
  };
  const typeahead = _react2.default.useRef({ buffer: "", timer: null });
  _react2.default.useEffect(() => () => clearTimeout(typeahead.current.timer), []);
  const runTypeahead = (char) => {
    clearTimeout(typeahead.current.timer);
    typeahead.current.buffer += char.toLowerCase();
    typeahead.current.timer = setTimeout(() => {
      typeahead.current.buffer = "";
    }, 500);
    const buffer = typeahead.current.buffer;
    const cycling = buffer.length > 1 && [...buffer].every((c) => c === buffer[0]);
    const search = cycling ? buffer[0] : buffer;
    const offset = buffer.length > 1 && !cycling ? 0 : 1;
    const from = visualOpen ? activeIndex : selectedIndex;
    const total = norm.length;
    if (!total) return;
    let match = -1;
    for (let i = 0; i < total; i += 1) {
      const index = ((from < 0 ? -1 : from) + offset + i + total) % total;
      const option = norm[index];
      if (!option || option.disabled) continue;
      if (optionText(option).toLowerCase().startsWith(search)) {
        match = index;
        break;
      }
    }
    if (match < 0) return;
    if (visualOpen) setActiveIndex(match);
    else pick(match);
  };
  const handleTriggerKeyDown = (event) => {
    _optionalChain([onTriggerKeyDown, 'optionalCall', _10 => _10(event)]);
    if (event.defaultPrevented || disabledState || readOnly) return;
    const firstEnabled = _nullishCoalesce(enabledIndices(norm)[0], () => ( -1));
    const lastEnabled = _nullishCoalesce(enabledIndices(norm).at(-1), () => ( -1));
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!visualOpen) openList();
        else setActiveIndex((current) => moveEnabled(norm, current, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!visualOpen) openList(selectedIndex >= 0 ? selectedIndex : lastEnabled);
        else setActiveIndex((current) => moveEnabled(norm, current, -1));
        break;
      case "Home":
        event.preventDefault();
        if (!visualOpen) openList(firstEnabled);
        else setActiveIndex(firstEnabled);
        break;
      case "End":
        event.preventDefault();
        if (!visualOpen) openList(lastEnabled);
        else setActiveIndex(lastEnabled);
        break;
      case " ":
        if (typeahead.current.buffer) {
          event.preventDefault();
          runTypeahead(" ");
          break;
        }
        event.preventDefault();
        if (!visualOpen) openList();
        else if (activeIndex >= 0) pick(activeIndex);
        break;
      case "Enter":
        event.preventDefault();
        if (!visualOpen) openList();
        else if (activeIndex >= 0) pick(activeIndex);
        break;
      case "Escape":
        if (visualOpen) {
          event.preventDefault();
          event.stopPropagation();
          closeList({ restoreFocus: true });
        }
        break;
      case "Tab":
        if (visualOpen) closeList();
        break;
      default:
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          runTypeahead(event.key);
        }
        break;
    }
  };
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-readonly": readOnly ? "true" : void 0, style: { display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ...style }, children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk4KUVQPIKcjs.FieldLabel, { id: labelId, htmlFor: selId, label, required }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { ref, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { position: "relative" }, children: [
      /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "button",
        {
          ...triggerProps,
          ref: triggerRef,
          id: selId,
          type: "button",
          role: "combobox",
          disabled: disabledState,
          "aria-haspopup": "listbox",
          "aria-expanded": visualOpen,
          "aria-controls": visualOpen ? listboxId : void 0,
          "aria-activedescendant": visualOpen && activeIndex >= 0 && !_optionalChain([norm, 'access', _11 => _11[activeIndex], 'optionalAccess', _12 => _12.disabled]) ? `${selId}-option-${activeIndex}` : void 0,
          "aria-label": ariaLabel,
          "aria-labelledby": _nullishCoalesce(ariaLabelledBy, () => ( (!ariaLabel && label ? labelId : void 0))),
          "aria-describedby": describedBy,
          "aria-invalid": isInvalid || void 0,
          "aria-required": required || void 0,
          "aria-readonly": readOnly || void 0,
          onClick: handleTriggerClick,
          onKeyDown: handleTriggerKeyDown,
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-2-5)",
            width: "100%",
            height: h,
            padding: "0 var(--component-input-padding-x)",
            boxSizing: "border-box",
            background: _chunk4KUVQPIKcjs.fieldBackground.call(void 0, { disabled: disabledState, readOnly }),
            color: disabledState ? "var(--color-semantic-label-disable)" : curr ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
            border: `var(--component-input-border-width) solid ${ring}`,
            borderRadius: "var(--component-input-radius)",
            boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
            cursor: disabledState ? "not-allowed" : readOnly ? "default" : "pointer",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--component-input-font-size)",
            lineHeight: "var(--component-input-line-height)",
            letterSpacing: "var(--component-input-letter-spacing)",
            textAlign: "left",
            transition: "var(--component-button-transition)"
          },
          children: [
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden" }, children: [
              iconLeft && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", flex: "0 0 auto", color: "var(--color-semantic-label-assistive)" }, children: iconLeft }),
              curr && render === "chip" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", maxWidth: "100%", height: 24, padding: "0 9px", borderRadius: "var(--radius-pill)", background: "var(--color-semantic-primary-surface-strong)", color: "var(--color-semantic-label-normal)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: curr.label }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: curr ? curr.label : placeholder })
            ] }),
            /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--component-input-gap)", flex: "0 0 auto" }, children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk4KUVQPIKcjs.FieldStatusIcon, { invalid: isInvalid, status }),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "chevron-down-small", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { flexShrink: 0, transform: visualOpen ? "rotate(180deg)" : "none", transition: "var(--component-button-transition)" } })
            ] })
          ]
        }
      ),
      visualOpen && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { id: listboxId, role: "listbox", "aria-label": ariaLabel, "aria-labelledby": !ariaLabel && label ? labelId : void 0, style: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: "auto", background: "var(--color-semantic-background-elevated-normal)", border: "1px solid var(--color-semantic-line-solid-normal)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: "var(--space-1-5)", display: "flex", flexDirection: "column", gap: "var(--space-0-5)" }, children: norm.map((o, index) => {
        const on = o.value === sel;
        const isActive = index === activeIndex;
        return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            id: `${selId}-option-${index}`,
            ref: (node) => {
              optionRefs.current[index] = node;
            },
            role: "option",
            "aria-selected": on,
            "aria-disabled": o.disabled || void 0,
            onMouseDown: (event) => event.preventDefault(),
            onClick: () => pick(index),
            onMouseEnter: () => {
              if (!o.disabled) setActiveIndex(index);
            },
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2-5)", padding: "9px 12px", borderRadius: "var(--radius-md)", cursor: o.disabled ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", fontSize: "var(--component-input-font-size)", lineHeight: "var(--component-input-line-height)", color: o.disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)", background: o.disabled && on ? "var(--color-semantic-fill-strong)" : on ? "var(--color-semantic-primary-surface-strong)" : isActive ? "var(--color-semantic-fill-normal)" : "transparent", boxShadow: isActive && !o.disabled ? "inset 0 0 0 2px var(--color-semantic-primary-normal)" : "none", fontWeight: on ? "var(--fw-bold)" : "var(--fw-medium)" },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.label }),
              on && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "check", size: 15, color: o.disabled ? "var(--color-semantic-label-disable)" : void 0, "aria-hidden": "true", style: { flexShrink: 0 } })
            ]
          },
          o.value
        );
      }) })
    ] }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunk4KUVQPIKcjs.FieldMessage, { id: messageId, message, error, status })
  ] });
}



exports.Select = Select;
//# sourceMappingURL=chunk-PHF2KELA.cjs.map