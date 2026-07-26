"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunkBTD2XVJWcjs = require('./chunk-BTD2XVJW.cjs');


var _chunkKY7U47KCcjs = require('./chunk-KY7U47KC.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/data/VisibilityManager.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function textLabel(node, fallback) {
  return typeof node === "string" || typeof node === "number" ? String(node) : fallback;
}
function LockedLabel() {
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "span",
    {
      title: "\uD45C\uC2DC \uC124\uC815 \uACE0\uC815",
      "aria-hidden": "true",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: 22,
        padding: "0 7px",
        flexShrink: 0,
        boxSizing: "border-box",
        border: "1px solid var(--color-semantic-line-normal-normal)",
        borderRadius: "var(--radius-pill)",
        background: "var(--color-semantic-fill-normal)",
        color: "var(--color-semantic-label-neutral)",
        fontSize: "var(--caption1-size)",
        lineHeight: "var(--caption1-line)",
        fontWeight: "var(--fw-semibold)",
        whiteSpace: "nowrap"
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "lock", size: 12, "aria-hidden": "true" }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { children: "\uACE0\uC815" })
      ]
    }
  );
}
function VisibilityManager({
  items = [],
  onVisibilityChange,
  onOrderChange,
  title = "\uD45C\uC2DC \uBC0F \uC21C\uC11C",
  description,
  resetAction,
  density = "compact",
  disabled = false,
  emptyLabel = "\uAD00\uB9AC\uD560 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  listLabel = "\uD45C\uC2DC \uBC0F \uC21C\uC11C\uB97C \uAD00\uB9AC\uD560 \uD56D\uBAA9",
  className,
  style,
  role = "group",
  "aria-label": ariaLabel,
  ...rest
}) {
  const titleId = _react2.default.useId();
  const visibilityDisabled = disabled || typeof onVisibilityChange !== "function";
  const orderDisabled = disabled || typeof onOrderChange !== "function";
  const mappedItems = items.map((item, index) => {
    const accessibleText = item.accessibleLabel || textLabel(item.label, `${index + 1}\uBC88\uC9F8 \uD56D\uBAA9`);
    const visibleText = item.visible ? "\uD45C\uC2DC\uB428" : "\uC228\uAE40";
    const lockedText = item.locked ? ", \uD45C\uC2DC \uC124\uC815 \uACE0\uC815" : "";
    return {
      id: item.id,
      label: item.label,
      detail: item.description,
      accessibleText: `${accessibleText}, ${visibleText}${lockedText}`,
      disabled,
      trailing: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
        "span",
        {
          draggable: false,
          onDragStart: (event) => event.preventDefault(),
          onMouseDown: (event) => event.stopPropagation(),
          style: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            minWidth: 0,
            maxWidth: "100%"
          },
          children: [
            item.locked && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LockedLabel, {}),
            /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
              _chunkKY7U47KCcjs.Checkbox,
              {
                checked: Boolean(item.visible),
                disabled: visibilityDisabled || item.locked,
                "aria-label": item.locked ? `${accessibleText} \uD45C\uC2DC \uC124\uC815 \uACE0\uC815\uB428` : `${accessibleText} \uD45C\uC2DC`,
                onChange: (nextVisible) => {
                  if (!visibilityDisabled && !item.locked) {
                    onVisibilityChange(item.id, nextVisible);
                  }
                },
                tight: true
              }
            )
          ]
        }
      )
    };
  });
  const hasHeader = title != null || description != null || resetAction != null;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      className: ["lk-visibility-manager", className].filter(Boolean).join(" "),
      "data-visibility-manager": "",
      role,
      "aria-label": ariaLabel,
      "aria-labelledby": !ariaLabel && title != null ? titleId : void 0,
      style: {
        display: "grid",
        gap: "var(--space-2-5)",
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        hasHeader && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "div",
          {
            style: {
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
              minWidth: 0
            },
            children: [
              (title != null || description != null) && /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, "span", { style: { display: "grid", gap: "var(--space-1)", flex: "1 1 180px", minWidth: 0 }, children: [
                title != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "span",
                  {
                    id: titleId,
                    style: {
                      minWidth: 0,
                      color: "var(--color-semantic-label-strong)",
                      fontSize: "var(--label1-size)",
                      lineHeight: "var(--label1-line)",
                      fontWeight: "var(--fw-bold)",
                      letterSpacing: 0
                    },
                    children: title
                  }
                ),
                description != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                  "span",
                  {
                    style: {
                      minWidth: 0,
                      color: "var(--color-semantic-label-neutral)",
                      fontSize: "var(--label2-size)",
                      lineHeight: "var(--label2-reading-line)",
                      fontWeight: "var(--fw-medium)",
                      overflowWrap: "anywhere"
                    },
                    children: description
                  }
                )
              ] }),
              resetAction != null && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { style: { display: "inline-flex", flex: "0 0 auto", maxWidth: "100%" }, children: resetAction })
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          _chunkBTD2XVJWcjs.ReorderList,
          {
            items: mappedItems,
            onReorder: onOrderChange,
            density,
            showMoveButtons: !orderDisabled,
            disabled,
            emptyLabel,
            getItemLabel: (item) => item.accessibleText,
            "aria-label": listLabel
          }
        )
      ]
    }
  );
}



exports.VisibilityManager = VisibilityManager;
//# sourceMappingURL=chunk-YMQTJQFV.cjs.map