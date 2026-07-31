"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunk4KUVQPIKcjs = require('./chunk-4KUVQPIK.cjs');


var _chunkX5XHQEI5cjs = require('./chunk-X5XHQEI5.cjs');

// components/forms/FileUpload.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function matchesAccept(file, accept) {
  const rules = String(_nullishCoalesce(accept, () => ( ""))).split(",").map((rule) => rule.trim().toLowerCase()).filter(Boolean);
  if (rules.length === 0) return true;
  const name = String(_nullishCoalesce(_optionalChain([file, 'optionalAccess', _ => _.name]), () => ( ""))).toLowerCase();
  const type = String(_nullishCoalesce(_optionalChain([file, 'optionalAccess', _2 => _2.type]), () => ( ""))).toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}
function FileUpload({
  onFiles,
  onRejectedFiles,
  accept,
  multiple = false,
  capture,
  inputAriaLabel,
  inputAriaDescribedBy,
  inputAriaInvalid,
  hint = "\uD074\uB9AD\uD558\uAC70\uB098 \uD30C\uC77C\uC744 \uB04C\uC5B4\uB2E4 \uB193\uC73C\uC138\uC694",
  disabled = false,
  className,
  style,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...rest
}) {
  const { fieldId: inputId, describedBy } = _chunk4KUVQPIKcjs.useFieldMetadata.call(void 0, { prefix: "file-upload", describedBy: inputAriaDescribedBy });
  const [drag, setDrag] = _react2.default.useState(false);
  const [focused, setFocused] = _react2.default.useState(false);
  const [names, setNames] = _react2.default.useState([]);
  const [rejectedNames, setRejectedNames] = _react2.default.useState([]);
  const handle = (files) => {
    const candidates = Array.from(_nullishCoalesce(files, () => ( [])));
    const limited = multiple ? candidates : candidates.slice(0, 1);
    const overflow = multiple ? [] : candidates.slice(1);
    const accepted = limited.filter((file) => matchesAccept(file, accept));
    const rejected = [
      ...limited.filter((file) => !matchesAccept(file, accept)),
      ...overflow
    ];
    setNames(accepted.map((file) => file.name));
    setRejectedNames(rejected.map((file) => file.name));
    _optionalChain([onFiles, 'optionalCall', _3 => _3(accepted)]);
    if (rejected.length > 0) _optionalChain([onRejectedFiles, 'optionalCall', _4 => _4(rejected)]);
  };
  const statusMessage = [
    names.length > 0 ? `${names.join(", ")}, \uC120\uD0DD\uB428` : "",
    rejectedNames.length > 0 ? `${rejectedNames.join(", ")}, \uD5C8\uC6A9\uB418\uC9C0 \uC54A\uB294 \uD30C\uC77C\uC774\uB77C \uC81C\uC678\uB428` : ""
  ].filter(Boolean).join(". ");
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
    "div",
    {
      ...rest,
      className: ["lk-file-upload", className].filter(Boolean).join(" "),
      "aria-disabled": disabled || void 0,
      "data-drag-active": drag ? "" : void 0,
      "data-focus-visible": focused ? "" : void 0,
      onDragEnter: (event) => {
        event.preventDefault();
        if (!disabled) setDrag(true);
        _optionalChain([onDragEnter, 'optionalCall', _5 => _5(event)]);
      },
      onDragOver: (event) => {
        event.preventDefault();
        if (!disabled) setDrag(true);
        _optionalChain([onDragOver, 'optionalCall', _6 => _6(event)]);
      },
      onDragLeave: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setDrag(false);
        _optionalChain([onDragLeave, 'optionalCall', _7 => _7(event)]);
      },
      onDrop: (event) => {
        event.preventDefault();
        setDrag(false);
        if (!disabled) handle(event.dataTransfer.files);
        _optionalChain([onDrop, 'optionalCall', _8 => _8(event)]);
      },
      style: {
        position: "relative",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        border: `1.5px dashed ${drag || focused ? "var(--component-input-border-color-focus)" : "var(--color-semantic-line-solid-normal)"}`,
        borderRadius: "var(--component-input-radius)",
        background: disabled ? "var(--color-semantic-fill-normal)" : drag ? "var(--color-semantic-primary-surface-normal)" : "var(--component-input-bg)",
        boxShadow: focused ? "var(--component-input-focus-shadow)" : "none",
        color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-neutral)",
        fontFamily: "var(--font-sans)",
        transition: "border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "input",
          {
            id: inputId,
            type: "file",
            accept,
            multiple,
            capture,
            disabled,
            "aria-label": inputAriaLabel,
            "aria-describedby": describedBy,
            "aria-invalid": inputAriaInvalid,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            onChange: (event) => {
              handle(event.currentTarget.files);
              event.currentTarget.value = "";
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
              border: 0
            }
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsxs.call(void 0, 
          "label",
          {
            htmlFor: inputId,
            style: {
              minHeight: 144,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-3)",
              padding: "var(--space-6) var(--space-4)",
              boxSizing: "border-box",
              textAlign: "center",
              cursor: disabled ? "not-allowed" : "pointer"
            },
            children: [
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    display: "inline-flex",
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-md)",
                    background: disabled ? "var(--color-semantic-fill-strong)" : "var(--color-semantic-primary-surface-normal)",
                    color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-primary-normal)",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkX5XHQEI5cjs.Icon, { name: "upload", size: 20, "aria-hidden": "true" })
                }
              ),
              /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "span",
                {
                  style: {
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: names.length > 0 && !disabled ? "var(--color-semantic-label-normal)" : "inherit",
                    fontSize: "var(--label1-size)",
                    lineHeight: "var(--label1-line)",
                    fontWeight: "var(--fw-semibold)",
                    wordBreak: "break-word"
                  },
                  children: hint
                }
              ),
              names.length > 0 && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-label-normal)",
                    fontSize: "var(--caption1-size)",
                    lineHeight: "var(--caption1-line)",
                    fontWeight: "var(--fw-medium)",
                    wordBreak: "break-word"
                  },
                  children: names.join(", ")
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, 
          "span",
          {
            role: "status",
            "aria-live": "polite",
            style: {
              position: "absolute",
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: "hidden",
              clip: "rect(0, 0, 0, 0)",
              whiteSpace: "nowrap",
              border: 0
            },
            children: statusMessage
          }
        )
      ]
    }
  );
}



exports.FileUpload = FileUpload;
//# sourceMappingURL=chunk-CDEZKTW5.cjs.map