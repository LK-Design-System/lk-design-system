"use client";

// components/selection/WheelPicker.jsx
import React from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var SCROLL_SETTLE_MS = 120;
var TYPEAHEAD_RESET_MS = 700;
function normalizeOption(option) {
  if (option && typeof option === "object") {
    return {
      ...option,
      label: option.label ?? String(option.value)
    };
  }
  return { value: option, label: String(option) };
}
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function getVisibleRows(visible) {
  const count = Math.max(3, Math.floor(Number(visible) || 5));
  return count % 2 === 0 ? count + 1 : count;
}
function getItemHeight(itemHeight) {
  return Math.max(28, Math.floor(Number(itemHeight) || 36));
}
function getOptionId(listId, index) {
  return `${listId}-option-${index}`;
}
function getWheelVisual(index, activeIndex, pad) {
  const offset = index - activeIndex;
  const distance = Math.min(Math.abs(offset), pad + 1);
  const angle = clamp(offset * -18, -56, 56);
  const scale = distance === 0 ? 1.08 : Math.max(0.78, 0.98 - distance * 0.08);
  return {
    distance,
    transform: `rotateX(${angle}deg) scale(${scale})`
  };
}
function getWheelTypeStyle(distance) {
  if (distance === 0) {
    return {
      fontSize: "var(--headline1-size)",
      lineHeight: "var(--headline1-line)",
      fontWeight: "var(--fw-bold)"
    };
  }
  if (distance === 1) {
    return {
      fontSize: "var(--body1-size)",
      lineHeight: "var(--body1-line)",
      fontWeight: "var(--fw-semibold)"
    };
  }
  return {
    fontSize: "var(--label1-size)",
    lineHeight: "var(--label1-line)",
    fontWeight: "var(--fw-medium)"
  };
}
function findNearestEnabled(options, index, direction = 1) {
  if (!options.length) return -1;
  const bounded = clamp(index, 0, options.length - 1);
  if (!options[bounded]?.disabled) return bounded;
  for (let offset = 1; offset < options.length; offset += 1) {
    const forward = bounded + offset * direction;
    if (forward >= 0 && forward < options.length && !options[forward].disabled) return forward;
    const backward = bounded - offset * direction;
    if (backward >= 0 && backward < options.length && !options[backward].disabled) return backward;
  }
  return -1;
}
function optionSearchText(option) {
  return typeof option.label === "string" || typeof option.label === "number" ? String(option.label) : String(option.value);
}
function findByPrefix(options, query, startIndex) {
  const count = options.length;
  for (let offset = 0; offset < count; offset += 1) {
    const index = ((startIndex + offset) % count + count) % count;
    const option = options[index];
    if (option.disabled) continue;
    if (optionSearchText(option).toLowerCase().startsWith(query)) return index;
  }
  return -1;
}
function WheelPicker({
  options = [],
  value,
  defaultValue,
  onChange,
  itemHeight = 36,
  visible = 5,
  width = 128,
  label = "\uD720 \uC120\uD0DD",
  emptyLabel = "\uC120\uD0DD \uD56D\uBAA9 \uC5C6\uC74C",
  disabled = false,
  disable = false,
  readOnly = false,
  style,
  ...rest
}) {
  const opts = React.useMemo(() => options.map(normalizeOption), [options]);
  const controlled = value !== void 0;
  const firstEnabledIndex = findNearestEnabled(opts, 0, 1);
  const [internal, setInternal] = React.useState(() => {
    if (defaultValue != null) return defaultValue;
    return firstEnabledIndex >= 0 ? opts[firstEnabledIndex]?.value : void 0;
  });
  const [focused, setFocused] = React.useState(false);
  const current = controlled ? value : internal;
  const selectedIndex = opts.findIndex((option) => option.value === current);
  const activeIndex = selectedIndex >= 0 ? selectedIndex : firstEnabledIndex;
  const listRef = React.useRef(null);
  const scrollSettleTimer = React.useRef(null);
  const programmaticScroll = React.useRef(false);
  const typeahead = React.useRef({ query: "", at: 0 });
  const listId = React.useId();
  const rows = getVisibleRows(visible);
  const rowHeight = getItemHeight(itemHeight);
  const pad = Math.floor(rows / 2);
  const inactive = disabled || disable;
  const locked = inactive || readOnly;
  const hasOptions = opts.length > 0;
  const activeOptionId = activeIndex >= 0 ? getOptionId(listId, activeIndex) : void 0;
  const surfaceColor = inactive ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)";
  const focusShadow = focused && !inactive ? "0 0 0 4px var(--color-semantic-focus-ring)" : null;
  React.useEffect(() => {
    if (controlled || selectedIndex >= 0 || firstEnabledIndex < 0) return;
    setInternal(opts[firstEnabledIndex].value);
  }, [controlled, firstEnabledIndex, opts, selectedIndex]);
  React.useEffect(() => {
    if (!listRef.current || activeIndex < 0) return;
    const target = activeIndex * rowHeight;
    if (Math.abs(listRef.current.scrollTop - target) < 1) return;
    programmaticScroll.current = true;
    listRef.current.scrollTop = target;
  }, [activeIndex, rowHeight]);
  React.useEffect(() => () => {
    if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
  }, []);
  const pickIndex = (index) => {
    if (locked) return;
    const nextIndex = findNearestEnabled(opts, index, index >= activeIndex ? 1 : -1);
    if (nextIndex < 0) return;
    const option = opts[nextIndex];
    if (option.value === current && selectedIndex === nextIndex) return;
    if (!controlled) setInternal(option.value);
    onChange && onChange(option.value, option);
  };
  const pickValue = (option, index) => {
    if (locked || option.disabled) return;
    pickIndex(index);
  };
  const handleScroll = () => {
    if (locked || !listRef.current) return;
    if (programmaticScroll.current) {
      programmaticScroll.current = false;
      return;
    }
    const list = listRef.current;
    if (scrollSettleTimer.current) clearTimeout(scrollSettleTimer.current);
    scrollSettleTimer.current = setTimeout(() => {
      scrollSettleTimer.current = null;
      pickIndex(Math.round(list.scrollTop / rowHeight));
    }, SCROLL_SETTLE_MS);
  };
  const handleTypeahead = (event) => {
    const now = Date.now();
    const continuing = now - typeahead.current.at < TYPEAHEAD_RESET_MS;
    if (event.key === " " && !continuing) return false;
    const query = `${continuing ? typeahead.current.query : ""}${event.key.toLowerCase()}`;
    typeahead.current = { query, at: now };
    const repeated = query.length > 1 && [...query].every((character) => character === query[0]);
    const search = repeated ? query[0] : query;
    const matched = findByPrefix(opts, search, search.length > 1 ? activeIndex : activeIndex + 1);
    if (matched < 0) return false;
    pickIndex(matched);
    return true;
  };
  const handleKeyDown = (event) => {
    if (locked || activeIndex < 0) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      pickIndex(activeIndex - 1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      pickIndex(activeIndex + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      pickIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      pickIndex(opts.length - 1);
    } else if (event.key === "PageUp") {
      event.preventDefault();
      pickIndex(activeIndex - pad);
    } else if (event.key === "PageDown") {
      event.preventDefault();
      pickIndex(activeIndex + pad);
    } else if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      if (handleTypeahead(event)) event.preventDefault();
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-disabled": inactive ? "true" : void 0,
      "data-readonly": readOnly ? "true" : void 0,
      style: {
        position: "relative",
        width,
        height: rowHeight * rows,
        overflow: "hidden",
        borderRadius: "var(--radius-md)",
        border: "1px solid transparent",
        background: surfaceColor,
        fontFamily: "var(--font-sans)",
        opacity: inactive ? 0.65 : 1,
        boxShadow: focusShadow ?? "none",
        transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        boxSizing: "border-box",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsxs(
        "ul",
        {
          ref: listRef,
          "data-scrollbar-exception": "wheel-picker-selection-plane",
          role: "listbox",
          "aria-label": label,
          "aria-activedescendant": activeOptionId,
          "aria-disabled": inactive || void 0,
          "aria-readonly": readOnly || void 0,
          tabIndex: inactive ? -1 : 0,
          onScroll: handleScroll,
          onKeyDown: handleKeyDown,
          onFocus: () => setFocused(true),
          onBlur: () => setFocused(false),
          style: {
            position: "relative",
            zIndex: 1,
            listStyle: "none",
            margin: 0,
            padding: `${pad * rowHeight}px 0`,
            height: "100%",
            overflowY: locked ? "hidden" : "auto",
            // The wheel only ever scrolls vertically, but leaving the other axis
            // at its default made the browser compute it to `auto` — the spec
            // promotes a visible axis when its partner is clipped — and the rows
            // are a few pixels wider than the track. That turned a locked wheel
            // into a horizontally scrollable region with no way to reach it.
            overflowX: "hidden",
            scrollSnapType: locked ? "none" : "y mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            outline: "none",
            boxSizing: "border-box",
            perspective: rowHeight * rows * 1.6,
            perspectiveOrigin: "50% 50%"
          },
          children: [
            !hasOptions && /* @__PURE__ */ jsx(
              "li",
              {
                role: "option",
                "aria-disabled": "true",
                "aria-selected": "false",
                style: {
                  height: rowHeight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 var(--space-3)",
                  boxSizing: "border-box",
                  color: "var(--color-semantic-label-assistive)",
                  fontSize: "var(--label2-size)",
                  lineHeight: "var(--label2-line)",
                  fontWeight: "var(--fw-medium)",
                  textAlign: "center",
                  wordBreak: "keep-all"
                },
                children: emptyLabel
              }
            ),
            opts.map((option, index) => {
              const visual = getWheelVisual(index, activeIndex, pad);
              const typeStyle = getWheelTypeStyle(visual.distance);
              const selected = index === selectedIndex;
              const highlighted = index === activeIndex;
              const optionDisabled = Boolean(option.disabled);
              return /* @__PURE__ */ jsx(
                "li",
                {
                  id: getOptionId(listId, index),
                  role: "option",
                  "aria-selected": selected,
                  "aria-disabled": optionDisabled || void 0,
                  onClick: () => pickValue(option, index),
                  style: {
                    height: rowHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 var(--space-3)",
                    boxSizing: "border-box",
                    scrollSnapAlign: "center",
                    cursor: locked || optionDisabled ? "default" : "pointer",
                    fontSize: typeStyle.fontSize,
                    lineHeight: typeStyle.lineHeight,
                    fontWeight: typeStyle.fontWeight,
                    letterSpacing: 0,
                    color: optionDisabled ? "var(--color-semantic-label-disable)" : highlighted ? "var(--color-semantic-label-strong)" : "var(--color-semantic-label-neutral)",
                    opacity: optionDisabled ? 0.45 : 1,
                    transform: visual.transform,
                    transformOrigin: "center center",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                    userSelect: "none"
                  },
                  children: /* @__PURE__ */ jsx(
                    "span",
                    {
                      style: {
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      children: option.label
                    }
                  )
                },
                option.value
              );
            })
          ]
        }
      )
    }
  );
}

export {
  WheelPicker
};
//# sourceMappingURL=chunk-BWVLCWFI.js.map