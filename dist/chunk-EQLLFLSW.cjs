"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkVGM7HVYYcjs = require('./chunk-VGM7HVYY.cjs');

// components/content/ReorderList.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var DENSITY = {
  comfortable: {
    minHeight: 60,
    padding: "10px 14px",
    paddingX: 14,
    gap: 12,
    titleSize: "var(--label1-size)",
    titleLine: "var(--label1-line)",
    detailSize: "var(--label2-size)",
    detailLine: "var(--label2-line)"
  },
  compact: {
    minHeight: 48,
    padding: "7px 12px",
    paddingX: 12,
    gap: 10,
    titleSize: "var(--label2-size)",
    titleLine: "var(--label2-line)",
    detailSize: 12,
    detailLine: "16px"
  }
};
var HANDLE_COLUMN_WIDTH = 24;
var INDEX_COLUMN_WIDTH = 32;
var TRAILING_DIVIDER_OFFSET = 32;
var hiddenStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0
};
function nodeLabel(node, fallback) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  return fallback;
}
function MoveButton({ direction, label, disabled, onClick }) {
  const icon = direction === "up" ? "arrow-up" : "arrow-down";
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
    "button",
    {
      type: "button",
      "aria-label": label,
      title: label,
      disabled,
      draggable: false,
      onClick: (event) => {
        event.stopPropagation();
        if (!disabled) onClick(event);
      },
      onMouseDown: (event) => event.stopPropagation(),
      style: {
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        border: "1px solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-sm)",
        background: disabled ? "var(--color-semantic-fill-normal)" : "var(--color-semantic-background-elevated-normal)",
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: 1,
        fontFamily: "var(--font-sans)",
        lineHeight: 0,
        WebkitTapHighlightColor: "transparent"
      },
      children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: icon, size: 15, "aria-hidden": "true" })
    }
  );
}
function ReorderList({
  items = [],
  onReorder,
  density = "comfortable",
  showIndex = false,
  showMoveButtons = true,
  disabled = false,
  emptyLabel = "\uC815\uB82C\uD560 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  getItemLabel,
  style,
  role = "list",
  "aria-label": ariaLabel,
  ...rest
}) {
  const [dragId, setDragId] = _react2.default.useState(null);
  const [dropTarget, setDropTarget] = _react2.default.useState(null);
  const [focusId, setFocusId] = _react2.default.useState(null);
  const [hoverId, setHoverId] = _react2.default.useState(null);
  const [announcement, setAnnouncement] = _react2.default.useState("");
  const ids = items.map((item) => item.id);
  const instructionId = _react2.default.useId();
  const liveId = _react2.default.useId();
  const cfg = DENSITY[density] || DENSITY.comfortable;
  const listCanReorder = !disabled && typeof onReorder === "function";
  const getAccessibleLabel = (item, index) => {
    if (getItemLabel) return getItemLabel(item, index);
    return nodeLabel(_optionalChain([item, 'optionalAccess', _ => _.label]), `${index + 1}\uBC88\uC9F8 \uD56D\uBAA9`);
  };
  const move = (from, to, reason) => {
    if (!listCanReorder || from < 0 || from >= ids.length) return false;
    const boundedTo = Math.max(0, Math.min(to, ids.length - 1));
    if (from === boundedTo) return false;
    const activeItem = items[from];
    if (_optionalChain([activeItem, 'optionalAccess', _2 => _2.disabled])) return false;
    const next = ids.slice();
    next.splice(boundedTo, 0, next.splice(from, 1)[0]);
    onReorder && onReorder(next, {
      activeId: activeItem.id,
      from,
      to: boundedTo,
      reason
    });
    setAnnouncement(`${getAccessibleLabel(activeItem, boundedTo)} ${boundedTo + 1}/${ids.length} \uC704\uCE58\uB85C \uC774\uB3D9`);
    return true;
  };
  const handleDrop = (event, item, index) => {
    event.preventDefault();
    if (!listCanReorder || dragId == null || item.disabled) return;
    const from = ids.indexOf(dragId);
    const position = _optionalChain([dropTarget, 'optionalAccess', _3 => _3.id]) === item.id ? dropTarget.position : "before";
    let to = index + (position === "after" ? 1 : 0);
    if (from < to) to -= 1;
    move(from, to, "drag");
    setDragId(null);
    setDropTarget(null);
  };
  const gridColumns = [
    `${HANDLE_COLUMN_WIDTH}px`,
    showIndex ? `${INDEX_COLUMN_WIDTH}px` : null,
    "minmax(0, 1fr)",
    showMoveButtons || items.some((item) => item.trailing != null) ? "auto" : null
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, _jsxruntime.Fragment, { children: [
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: instructionId, style: hiddenStyle, children: "Alt\uC640 \uC704\uCABD \uB610\uB294 \uC544\uB798\uCABD \uD654\uC0B4\uD45C \uD0A4\uB85C \uD56D\uBAA9 \uC21C\uC11C\uB97C \uBC14\uAFC0 \uC218 \uC788\uC2B5\uB2C8\uB2E4." }),
    /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { id: liveId, role: "status", "aria-live": "polite", style: hiddenStyle, children: announcement }),
    /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
      "ul",
      {
        role,
        "aria-label": ariaLabel || "\uC815\uB82C \uAC00\uB2A5\uD55C \uBAA9\uB85D",
        style: {
          listStyle: "none",
          margin: 0,
          padding: 4,
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          overflow: "hidden",
          border: "1px solid var(--color-semantic-line-normal-normal)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-semantic-background-elevated-normal)",
          fontFamily: "var(--font-sans)",
          ...style
        },
        ...rest,
        children: [
          items.length === 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
            "li",
            {
              "aria-disabled": "true",
              style: {
                minHeight: cfg.minHeight,
                display: "flex",
                alignItems: "center",
                padding: cfg.padding,
                borderRadius: "var(--radius-sm)",
                color: "var(--color-semantic-label-neutral)",
                fontSize: cfg.detailSize,
                lineHeight: cfg.detailLine,
                boxSizing: "border-box"
              },
              children: emptyLabel
            }
          ),
          items.map((item, index) => {
            const itemDisabled = disabled || item.disabled;
            const reorderDisabled = itemDisabled || !listCanReorder;
            const label = getAccessibleLabel(item, index);
            const dragging = dragId === item.id;
            const focused = focusId === item.id;
            const hovered = hoverId === item.id;
            const dropBefore = !dragging && _optionalChain([dropTarget, 'optionalAccess', _4 => _4.id]) === item.id && dropTarget.position === "before";
            const dropAfter = !dragging && _optionalChain([dropTarget, 'optionalAccess', _5 => _5.id]) === item.id && dropTarget.position === "after";
            const canMoveUp = !reorderDisabled && index > 0;
            const canMoveDown = !reorderDisabled && index < items.length - 1;
            const hasTrailing = item.trailing != null || showMoveButtons;
            const dividerLeft = cfg.paddingX + HANDLE_COLUMN_WIDTH + cfg.gap + (showIndex ? INDEX_COLUMN_WIDTH + cfg.gap : 0);
            const dividerRight = cfg.paddingX + (hasTrailing ? TRAILING_DIVIDER_OFFSET : 0);
            return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
              "li",
              {
                role: "listitem",
                "aria-roledescription": "\uC815\uB82C \uAC00\uB2A5\uD55C \uD56D\uBAA9",
                "aria-posinset": index + 1,
                "aria-setsize": items.length,
                "aria-disabled": itemDisabled || void 0,
                "aria-describedby": reorderDisabled ? void 0 : `${instructionId} ${liveId}`,
                "aria-label": `${index + 1}/${items.length}. ${label}`,
                tabIndex: reorderDisabled ? -1 : 0,
                draggable: !reorderDisabled,
                onDragStart: (event) => {
                  if (reorderDisabled) return;
                  setDragId(item.id);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", String(item.id));
                },
                onDragEnd: () => {
                  setDragId(null);
                  setDropTarget(null);
                },
                onDragOver: (event) => {
                  if (reorderDisabled || dragId == null) return;
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  const rect = event.currentTarget.getBoundingClientRect();
                  const position = event.clientY > rect.top + rect.height / 2 ? "after" : "before";
                  setDropTarget({ id: item.id, position });
                },
                onDragLeave: (event) => {
                  const nextTarget = event.relatedTarget;
                  if (!nextTarget || !event.currentTarget.contains(nextTarget)) setDropTarget(null);
                },
                onDrop: (event) => handleDrop(event, item, index),
                onKeyDown: (event) => {
                  if (reorderDisabled || !event.altKey) return;
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    move(index, index - 1, "keyboard");
                  }
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    move(index, index + 1, "keyboard");
                  }
                },
                onFocus: () => setFocusId(item.id),
                onBlur: (event) => {
                  const nextTarget = event.relatedTarget;
                  if (!nextTarget || !event.currentTarget.contains(nextTarget)) setFocusId(null);
                },
                onMouseEnter: () => setHoverId(item.id),
                onMouseLeave: () => setHoverId(null),
                style: {
                  position: "relative",
                  margin: 0,
                  opacity: dragging ? 0.58 : 1,
                  outline: "none"
                },
                children: [
                  (dropBefore || dropAfter) && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                    "span",
                    {
                      "aria-hidden": "true",
                      style: {
                        position: "absolute",
                        left: 0,
                        right: 0,
                        [dropBefore ? "top" : "bottom"]: 0,
                        zIndex: 1,
                        height: 2,
                        background: "var(--color-semantic-primary-normal)",
                        boxShadow: "0 0 0 1px var(--color-semantic-primary-surface-normal)",
                        pointerEvents: "none"
                      }
                    }
                  ),
                  /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                    "div",
                    {
                      style: {
                        display: "grid",
                        gridTemplateColumns: gridColumns,
                        alignItems: "center",
                        gap: cfg.gap,
                        minHeight: cfg.minHeight,
                        padding: cfg.padding,
                        position: "relative",
                        boxSizing: "border-box",
                        borderRadius: "var(--radius-sm)",
                        background: itemDisabled ? "transparent" : focused && !reorderDisabled ? "var(--color-semantic-fill-normal)" : hovered || dragging ? "var(--color-semantic-fill-alternative)" : "transparent",
                        boxShadow: focused && !reorderDisabled ? "inset 0 0 0 2px var(--color-semantic-focus-indicator)" : "none",
                        cursor: itemDisabled ? "not-allowed" : reorderDisabled ? "default" : dragging ? "grabbing" : "grab",
                        transition: "background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
                      },
                      children: [
                        index > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                          "span",
                          {
                            "aria-hidden": "true",
                            style: {
                              position: "absolute",
                              left: dividerLeft,
                              right: dividerRight,
                              top: 0,
                              height: 1,
                              background: "var(--color-semantic-line-normal-normal)",
                              opacity: 0.72,
                              pointerEvents: "none"
                            }
                          }
                        ),
                        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                          "span",
                          {
                            "aria-hidden": "true",
                            style: {
                              width: HANDLE_COLUMN_WIDTH,
                              height: 24,
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: itemDisabled || reorderDisabled ? "var(--color-semantic-label-disable)" : focused ? "var(--color-semantic-primary-normal)" : "var(--color-semantic-label-assistive)",
                              cursor: itemDisabled ? "not-allowed" : reorderDisabled ? "default" : dragging ? "grabbing" : "grab"
                            },
                            children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkVGM7HVYYcjs.Icon, { name: "handle", size: 18, "aria-hidden": "true" })
                          }
                        ),
                        showIndex && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                          "span",
                          {
                            "aria-hidden": "true",
                            style: {
                              color: itemDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)",
                              fontSize: cfg.detailSize,
                              lineHeight: cfg.detailLine,
                              fontWeight: "var(--fw-semibold)",
                              fontVariantNumeric: "tabular-nums",
                              letterSpacing: 0
                            },
                            children: index + 1
                          }
                        ),
                        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { minWidth: 0 }, children: [
                          /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                            "span",
                            {
                              style: {
                                display: "block",
                                minWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: itemDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
                                fontSize: cfg.titleSize,
                                lineHeight: cfg.titleLine,
                                fontWeight: "var(--fw-semibold)",
                                letterSpacing: 0
                              },
                              children: item.label
                            }
                          ),
                          item.detail != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                            "span",
                            {
                              style: {
                                display: "block",
                                minWidth: 0,
                                marginTop: 2,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                color: itemDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)",
                                fontSize: cfg.detailSize,
                                lineHeight: cfg.detailLine,
                                fontWeight: "var(--fw-medium)",
                                letterSpacing: 0
                              },
                              children: item.detail
                            }
                          )
                        ] }),
                        (item.trailing != null || showMoveButtons) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
                          "span",
                          {
                            style: {
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                              gap: 6,
                              minWidth: 0,
                              color: itemDisabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)"
                            },
                            children: [
                              item.trailing != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: item.trailing }),
                              showMoveButtons && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "inline-flex", alignItems: "center", gap: 4, flexShrink: 0 }, children: [
                                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                                  MoveButton,
                                  {
                                    direction: "up",
                                    label: `${label} \uC704\uB85C \uC774\uB3D9`,
                                    disabled: !canMoveUp,
                                    onClick: () => move(index, index - 1, "button")
                                  }
                                ),
                                /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                                  MoveButton,
                                  {
                                    direction: "down",
                                    label: `${label} \uC544\uB798\uB85C \uC774\uB3D9`,
                                    disabled: !canMoveDown,
                                    onClick: () => move(index, index + 1, "button")
                                  }
                                )
                              ] })
                            ]
                          }
                        )
                      ]
                    }
                  )
                ]
              },
              item.id
            );
          })
        ]
      }
    )
  ] });
}



exports.ReorderList = ReorderList;
//# sourceMappingURL=chunk-EQLLFLSW.cjs.map