"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkZAM5AMCOcjs = require('./chunk-ZAM5AMCO.cjs');








var _chunkGPBXTTEHcjs = require('./chunk-GPBXTTEH.cjs');




var _chunkZRHSDRSMcjs = require('./chunk-ZRHSDRSM.cjs');





var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');


var _chunkXGKLO45Tcjs = require('./chunk-XGKLO45T.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

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
function selectOptionMetrics(size) {
  const compact = size === "sm";
  return {
    density: compact ? "default" : "comfortable",
    minHeight: compact ? "var(--component-menu-item-min-height)" : "var(--control-h-md)",
    paddingY: compact ? "var(--component-menu-item-padding-y)" : "var(--space-3)",
    // Options read from the shared-menu type ramp (DropdownMenu's default and
    // comfortable densities), not the input ramp the trigger uses.
    fontSize: compact ? "var(--component-menu-item-font-size)" : "var(--body1-size)",
    lineHeight: compact ? "var(--component-menu-item-line-height)" : "var(--body1-line)"
  };
}
var Select = _react2.default.forwardRef(function Select2({
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
  size,
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
  className,
  style,
  triggerClassName,
  triggerStyle,
  classNames,
  styles,
  vars,
  rootRef,
  withinPortal = true,
  portalTarget,
  zIndex,
  position: requestedPosition = "bottom",
  align = "left",
  offset = 6,
  ...rest
}, forwardedRef) {
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
  const [activeModality, setActiveModality] = _react2.default.useState(null);
  const [hover, setHover] = _react2.default.useState(false);
  const ref = _react2.default.useRef(null);
  const triggerRef = _react2.default.useRef(null);
  const mergedTriggerRef = _chunkGWMGPLNWcjs.useMergedRefs.call(void 0, triggerRef, forwardedRef);
  const dropdownRef = _react2.default.useRef(null);
  const widthSizerRef = _react2.default.useRef(null);
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
  const describedBy = _chunkGPBXTTEHcjs.mergeIds.call(void 0, ariaDescribedBy, messageId);
  const overlayLayer = _chunkZRHSDRSMcjs.useLightDismiss.call(void 0, {
    open: open && !locked,
    rootRef: ref,
    getTrigger: () => triggerRef.current,
    onDismiss: () => setOpen(false),
    insideRefs: [dropdownRef],
    zIndex
  });
  const curr = norm.find((x) => x.value === sel);
  const selectedIndex = norm.findIndex((x) => x.value === sel);
  const resolvedSize = _chunkZAM5AMCOcjs.useResolvedControlSize.call(void 0, size);
  const normalizedSize = resolvedSize === "small" ? "sm" : resolvedSize === "medium" ? "md" : resolvedSize === "large" ? "lg" : resolvedSize;
  const h = normalizedSize === "sm" ? "var(--control-h-sm)" : normalizedSize === "lg" ? "var(--control-h-lg)" : "var(--control-h-md)";
  const optionMetrics = selectOptionMetrics(normalizedSize);
  const isInvalid = invalid || negative || status === "negative" || error != null;
  const visualOpen = !locked && (open || interaction === "open");
  const dropdownPosition = _chunkZRHSDRSMcjs.useFloatingPosition.call(void 0, {
    open: visualOpen,
    anchorRef: triggerRef,
    panelRef: dropdownRef,
    placement: requestedPosition,
    offset,
    strategy: withinPortal ? "fixed" : "absolute",
    align
  });
  const activeFocus = visualOpen || focus || interaction === "focused" || interaction === "active-focused";
  const activeHover = !readOnly && (hover || active || interaction === "hovered" || interaction === "active" || interaction === "active-focused");
  const ring = _chunkGPBXTTEHcjs.fieldBorderColor.call(void 0, { disabled: disabledState, readOnly, invalid: isInvalid, status, focused: activeFocus, hovered: activeHover });
  const intrinsicLabels = _react2.default.useMemo(
    () => [placeholder, ...norm.map(optionText)],
    [norm, placeholder]
  );
  const [intrinsicMinWidth, setIntrinsicMinWidth] = _react2.default.useState(null);
  _react2.default.useLayoutEffect(() => {
    const sizer = widthSizerRef.current;
    if (!sizer) return void 0;
    const measure = () => {
      const optionWidths = [...sizer.children].map((node) => node.getBoundingClientRect().width);
      const tokenReserve = Number.parseFloat(getComputedStyle(sizer).getPropertyValue("--space-2")) || 8;
      const nextWidth = Math.ceil(Math.max(0, ...optionWidths) + tokenReserve);
      setIntrinsicMinWidth((current) => current === nextWidth ? current : nextWidth);
    };
    measure();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    _optionalChain([observer, 'optionalAccess', _ => _.observe, 'call', _2 => _2(sizer)]);
    _optionalChain([document, 'access', _3 => _3.fonts, 'optionalAccess', _4 => _4.ready, 'optionalAccess', _5 => _5.then, 'call', _6 => _6(measure)]);
    return () => _optionalChain([observer, 'optionalAccess', _7 => _7.disconnect, 'call', _8 => _8()]);
  }, [intrinsicLabels, normalizedSize, iconLeft]);
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
    setActiveModality(null);
  }, [locked]);
  _react2.default.useEffect(() => {
    if (!visualOpen || activeIndex < 0) return;
    _optionalChain([optionRefs, 'access', _9 => _9.current, 'access', _10 => _10[activeIndex], 'optionalAccess', _11 => _11.scrollIntoView, 'optionalCall', _12 => _12({ block: "nearest" })]);
  }, [activeIndex, visualOpen]);
  const openList = (preferredIndex = selectedIndex >= 0 ? selectedIndex : 0, modality = null) => {
    if (locked) return;
    setActiveIndex(nearestEnabled(norm, preferredIndex));
    setActiveModality(modality);
    setOpen(true);
  };
  const closeList = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    setActiveModality(null);
    if (restoreFocus) _optionalChain([triggerRef, 'access', _13 => _13.current, 'optionalAccess', _14 => _14.focus, 'call', _15 => _15()]);
  };
  const pick = (index) => {
    if (locked) return;
    const option = norm[index];
    if (!option || option.disabled) return;
    if (!isControlled) setInternal(option.value);
    _optionalChain([onChange, 'optionalCall', _16 => _16(option.value)]);
    setActiveIndex(index);
    closeList({ restoreFocus: true });
  };
  const handleTriggerClick = (event) => {
    _optionalChain([onTriggerClick, 'optionalCall', _17 => _17(event)]);
    if (event.defaultPrevented || disabledState || readOnly) return;
    if (open) closeList();
    else openList(selectedIndex >= 0 ? selectedIndex : 0, "pointer");
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
    const offset2 = buffer.length > 1 && !cycling ? 0 : 1;
    const from = visualOpen ? activeIndex : selectedIndex;
    const total = norm.length;
    if (!total) return;
    let match = -1;
    for (let i = 0; i < total; i += 1) {
      const index = ((from < 0 ? -1 : from) + offset2 + i + total) % total;
      const option = norm[index];
      if (!option || option.disabled) continue;
      if (optionText(option).toLowerCase().startsWith(search)) {
        match = index;
        break;
      }
    }
    if (match < 0) return;
    if (visualOpen) {
      setActiveModality("keyboard");
      setActiveIndex(match);
    } else pick(match);
  };
  const handleTriggerKeyDown = (event) => {
    _optionalChain([onTriggerKeyDown, 'optionalCall', _18 => _18(event)]);
    if (event.defaultPrevented || disabledState || readOnly) return;
    const firstEnabled = _nullishCoalesce(enabledIndices(norm)[0], () => ( -1));
    const lastEnabled = _nullishCoalesce(enabledIndices(norm).at(-1), () => ( -1));
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveModality("keyboard");
        if (!visualOpen) openList(selectedIndex >= 0 ? selectedIndex : 0, "keyboard");
        else setActiveIndex((current) => moveEnabled(norm, current, 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveModality("keyboard");
        if (!visualOpen) openList(selectedIndex >= 0 ? selectedIndex : lastEnabled, "keyboard");
        else setActiveIndex((current) => moveEnabled(norm, current, -1));
        break;
      case "Home":
        event.preventDefault();
        setActiveModality("keyboard");
        if (!visualOpen) openList(firstEnabled, "keyboard");
        else setActiveIndex(firstEnabled);
        break;
      case "End":
        event.preventDefault();
        setActiveModality("keyboard");
        if (!visualOpen) openList(lastEnabled, "keyboard");
        else setActiveIndex(lastEnabled);
        break;
      case " ":
        if (typeahead.current.buffer) {
          event.preventDefault();
          runTypeahead(" ");
          break;
        }
        event.preventDefault();
        if (!visualOpen) openList(selectedIndex >= 0 ? selectedIndex : 0, "keyboard");
        else if (activeIndex >= 0) pick(activeIndex);
        break;
      case "Enter":
        event.preventDefault();
        if (!visualOpen) openList(selectedIndex >= 0 ? selectedIndex : 0, "keyboard");
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
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    "div",
    {
      ref: rootRef,
      "data-slot": "root",
      "data-select-root": "",
      "data-open": visualOpen ? "true" : void 0,
      "data-disabled": disabledState ? "true" : void 0,
      "data-readonly": readOnly ? "true" : void 0,
      "data-invalid": isInvalid ? "true" : void 0,
      "data-size": normalizedSize,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", className) || void 0,
      style: { ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-select-"), display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", minWidth: intrinsicMinWidth == null ? "var(--lds-select-min-width, auto)" : `var(--lds-select-min-width, min(100%, ${intrinsicMinWidth}px))`, maxWidth: "100%", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"), ...style },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGPBXTTEHcjs.FieldLabel, { "data-slot": "label", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "label") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "label"), id: labelId, htmlFor: selId, label, required, disabled: disabledState }),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "div", { "data-slot": "control", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "control") || void 0, ref, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), style: { position: "relative", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "control") }, children: [
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "span",
            {
              "aria-hidden": "true",
              "data-select-width-measurement": "",
              style: {
                position: "absolute",
                insetBlockStart: 0,
                insetInlineStart: 0,
                width: 1,
                height: 1,
                overflow: "hidden",
                visibility: "hidden",
                pointerEvents: "none",
                contain: "layout style paint"
              },
              children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                "span",
                {
                  "aria-hidden": "true",
                  "data-select-width-sizer": "",
                  ref: widthSizerRef,
                  style: {
                    display: "inline-grid",
                    width: "max-content",
                    minWidth: "max-content",
                    fontFamily: "var(--font-sans)",
                    ..._chunkGPBXTTEHcjs.fieldTypography.call(void 0, normalizedSize)
                  },
                  children: intrinsicLabels.map((text, index) => /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                    "button",
                    {
                      type: "button",
                      disabled: true,
                      tabIndex: -1,
                      "aria-hidden": "true",
                      style: {
                        gridArea: "1 / 1",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "var(--space-2-5)",
                        width: "max-content",
                        height: h,
                        padding: "0 var(--component-input-padding-x)",
                        boxSizing: "border-box",
                        border: "var(--component-input-border-width) solid transparent",
                        fontFamily: "var(--font-sans)",
                        ..._chunkGPBXTTEHcjs.fieldTypography.call(void 0, normalizedSize),
                        textAlign: "left",
                        whiteSpace: "nowrap"
                      },
                      children: [
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: 8 }, children: [
                          iconLeft && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", flex: "0 0 auto" }, children: iconLeft }),
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: text })
                        ] }),
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: "var(--component-input-gap)", flex: "0 0 auto" }, children: [
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: 16, flex: "0 0 16px" } }),
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { width: "var(--space-4-5)", flex: "0 0 var(--space-4-5)" } })
                        ] })
                      ]
                    },
                    `${index}-${text}`
                  ))
                }
              )
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
            "button",
            {
              ...triggerProps,
              ref: mergedTriggerRef,
              id: selId,
              "data-slot": "trigger",
              "data-open": visualOpen ? "true" : void 0,
              "data-disabled": disabledState ? "true" : void 0,
              "data-readonly": readOnly ? "true" : void 0,
              "data-invalid": isInvalid ? "true" : void 0,
              className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "trigger", triggerClassName) || void 0,
              type: "button",
              role: "combobox",
              disabled: disabledState,
              "aria-haspopup": "listbox",
              "aria-expanded": visualOpen,
              "aria-controls": visualOpen ? listboxId : void 0,
              "aria-activedescendant": visualOpen && activeIndex >= 0 && !_optionalChain([norm, 'access', _19 => _19[activeIndex], 'optionalAccess', _20 => _20.disabled]) ? `${selId}-option-${activeIndex}` : void 0,
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
                minWidth: 0,
                maxWidth: "100%",
                overflow: "hidden",
                height: `var(--lds-select-height, ${h})`,
                padding: "0 var(--component-input-padding-x)",
                boxSizing: "border-box",
                background: _chunkGPBXTTEHcjs.fieldBackground.call(void 0, { disabled: disabledState, readOnly }),
                color: disabledState ? "var(--color-semantic-label-disable)" : curr ? "var(--color-semantic-label-normal)" : "var(--color-semantic-label-alternative)",
                border: `var(--component-input-border-width) solid ${ring}`,
                borderRadius: "var(--component-input-radius)",
                boxShadow: activeFocus && !isInvalid ? "var(--component-input-focus-shadow)" : "none",
                cursor: disabledState ? "not-allowed" : readOnly ? "default" : "pointer",
                fontFamily: "var(--font-sans)",
                ..._chunkGPBXTTEHcjs.fieldTypography.call(void 0, normalizedSize),
                textAlign: "left",
                transition: "var(--component-button-transition)",
                // chip-trigger: 트리거 전체가 보더 없는 단일 알약이다. 값-캡슐(chip)과
                // 달리 인풋 크롬을 겹쳐 그리지 않는다. 포커스 링과 invalid 보더는
                // 필드 계약 그대로 유지한다.
                ...render === "chip-trigger" ? {
                  padding: "0 var(--space-3)",
                  border: `var(--component-input-border-width) solid ${isInvalid || activeFocus ? ring : "transparent"}`,
                  borderRadius: "var(--radius-pill)",
                  background: disabledState ? "var(--color-semantic-fill-alternative)" : "var(--color-semantic-fill-normal)",
                  fontWeight: "var(--fw-semibold)"
                } : null,
                ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "trigger"),
                ...triggerStyle
              },
              children: [
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "data-slot": "value", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "value") || void 0, style: { display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0, overflow: "hidden", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "value") }, children: [
                  iconLeft && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", flex: "0 0 auto", color: "var(--color-semantic-label-assistive)" }, children: iconLeft }),
                  curr && render === "chip" ? /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", maxWidth: "100%", height: 24, padding: "0 9px", borderRadius: "var(--radius-pill)", background: "var(--color-semantic-primary-surface-strong)", color: "var(--color-semantic-label-normal)", fontSize: "var(--label2-size)", fontWeight: "var(--fw-semibold)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: curr.label }) : /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: curr ? curr.label : placeholder })
                ] }),
                /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { "data-slot": "indicators", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "indicators") || void 0, style: { display: "inline-flex", alignItems: "center", gap: "var(--component-input-gap)", flex: "0 0 auto", ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "indicators") }, children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGPBXTTEHcjs.FieldStatusIcon, { invalid: isInvalid, status }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "chevron-down-small", size: 18, color: "var(--color-semantic-label-alternative)", "aria-hidden": "true", style: { flexShrink: 0, transform: visualOpen ? "rotate(180deg)" : "none", transition: "var(--component-button-transition)" } })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkXGKLO45Tcjs.OverlayPortal, { open: visualOpen, withinPortal, portalTarget, anchorRef: triggerRef, layer: "anchored", children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            "div",
            {
              ref: dropdownRef,
              "data-slot": "dropdown",
              "data-select-dropdown-portal": withinPortal ? "true" : void 0,
              className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "dropdown") || void 0,
              id: listboxId,
              role: "listbox",
              "aria-label": ariaLabel,
              "aria-labelledby": !ariaLabel && label ? labelId : void 0,
              "data-placement": dropdownPosition.placement,
              "data-density": optionMetrics.density,
              style: {
                ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-select-"),
                ...withinPortal ? { position: "fixed", top: _nullishCoalesce(dropdownPosition.y, () => ( -9999)), left: _nullishCoalesce(dropdownPosition.x, () => ( -9999)), right: "auto", bottom: "auto", translate: "none" } : _chunkZRHSDRSMcjs.inlineFloatingStyle.call(void 0, { placement: dropdownPosition.placement, align, offset, shiftX: dropdownPosition.shiftX, shiftY: dropdownPosition.shiftY }),
                width: withinPortal ? _optionalChain([triggerRef, 'access', _21 => _21.current, 'optionalAccess', _22 => _22.getBoundingClientRect, 'call', _23 => _23(), 'access', _24 => _24.width]) : void 0,
                opacity: withinPortal && (dropdownPosition.x == null || dropdownPosition.y == null) ? 0 : 1,
                pointerEvents: withinPortal && (dropdownPosition.x == null || dropdownPosition.y == null) ? "none" : "auto",
                zIndex: overlayLayer.zIndex,
                maxHeight: `var(--lds-select-dropdown-max-height, ${dropdownPosition.maxHeight == null ? "260px" : `${Math.min(260, dropdownPosition.maxHeight)}px`})`,
                overflowY: "auto",
                background: "var(--color-semantic-background-elevated-normal)",
                border: "1px solid var(--color-semantic-line-solid-normal)",
                borderRadius: "var(--component-menu-radius)",
                boxShadow: "var(--shadow-md)",
                padding: "var(--component-menu-padding-y) var(--component-menu-padding-x)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--component-menu-gap)",
                ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "dropdown")
              },
              children: norm.map((o, index) => {
                const on = o.value === sel;
                const isActive = index === activeIndex;
                return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
                  "div",
                  {
                    id: `${selId}-option-${index}`,
                    ref: (node) => {
                      optionRefs.current[index] = node;
                    },
                    "data-slot": "option",
                    "data-active": isActive ? "true" : void 0,
                    "data-selected": on ? "true" : void 0,
                    "data-disabled": o.disabled ? "true" : void 0,
                    className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "option") || void 0,
                    role: "option",
                    "aria-selected": on,
                    "aria-disabled": o.disabled || void 0,
                    onMouseDown: (event) => event.preventDefault(),
                    onClick: () => pick(index),
                    onMouseEnter: () => {
                      if (o.disabled) return;
                      setActiveModality("pointer");
                      setActiveIndex(index);
                    },
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "var(--space-2-5)",
                      minHeight: optionMetrics.minHeight,
                      padding: `${optionMetrics.paddingY} var(--component-menu-item-padding-x)`,
                      boxSizing: "border-box",
                      borderRadius: "var(--component-menu-item-radius)",
                      cursor: o.disabled ? "not-allowed" : "pointer",
                      fontFamily: "var(--font-sans)",
                      fontSize: optionMetrics.fontSize,
                      lineHeight: optionMetrics.lineHeight,
                      letterSpacing: 0,
                      color: o.disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
                      background: o.disabled && on ? "var(--color-semantic-fill-strong)" : isActive ? "var(--component-menu-item-hover-bg)" : on ? "var(--component-menu-item-selected-bg)" : "transparent",
                      boxShadow: isActive && !o.disabled && activeModality === "keyboard" ? "inset 0 0 0 2px var(--component-menu-item-active-ring-color)" : "none",
                      fontWeight: on ? "var(--fw-medium)" : "var(--fw-regular)",
                      ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "option")
                    },
                    children: [
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.label }),
                      /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                        "span",
                        {
                          "data-select-option-indicator": "",
                          "aria-hidden": "true",
                          style: { display: "inline-flex", width: 16, height: 16, flex: "0 0 16px", alignItems: "center", justifyContent: "center", opacity: on ? 1 : 0 },
                          children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "check", size: 16, color: o.disabled ? "var(--color-semantic-label-disable)" : "var(--component-menu-item-check-color)", "aria-hidden": "true" })
                        }
                      )
                    ]
                  },
                  o.value
                );
              })
            }
          ) })
        ] }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkGPBXTTEHcjs.FieldMessage, { "data-slot": "message", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "message") || void 0, style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "message"), id: messageId, message, error, status })
      ]
    }
  );
});



exports.Select = Select;
//# sourceMappingURL=chunk-3RKX3MGA.cjs.map