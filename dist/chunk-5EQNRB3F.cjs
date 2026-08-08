"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }"use client";


var _chunk5TKPT3UKcjs = require('./chunk-5TKPT3UK.cjs');




var _chunkGWMGPLNWcjs = require('./chunk-GWMGPLNW.cjs');

// components/forms/FieldAction.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var CONTROL_HEIGHTS = {
  sm: "var(--control-h-sm)",
  md: "var(--control-h-md)",
  lg: "var(--control-h-lg)"
};
function normalizeSize(size) {
  return {
    small: "sm",
    medium: "md",
    large: "lg"
  }[size] || size;
}
var FieldAction = _react2.default.forwardRef(function FieldAction2({
  as = "div",
  field,
  action,
  size = "md",
  label,
  helper,
  error,
  required = false,
  htmlFor,
  className,
  style,
  classNames,
  styles,
  vars,
  ...rest
}, forwardedRef) {
  const normalizedSize = normalizeSize(size);
  const controlHeight = CONTROL_HEIGHTS[normalizedSize] || CONTROL_HEIGHTS.md;
  const Comp = as;
  const fieldNode = _react2.default.isValidElement(field) ? _react2.default.cloneElement(field, {
    size: normalizedSize,
    style: {
      width: "100%",
      minWidth: 0,
      ...field.props.style
    }
  }) : field;
  const actionNode = _react2.default.isValidElement(action) ? _react2.default.cloneElement(action, {
    size: normalizedSize,
    style: {
      ...action.props.style,
      height: controlHeight
    }
  }) : action;
  return /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
    Comp,
    {
      ...rest,
      ref: forwardedRef,
      "data-slot": "root",
      "data-size": normalizedSize,
      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "root", "lk-field-action", className) || void 0,
      style: {
        ..._chunkGWMGPLNWcjs.componentVars.call(void 0, vars, "--lds-field-action-"),
        width: "100%",
        minWidth: 0,
        containerType: "inline-size",
        ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "root"),
        ...style
      },
      children: [
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "style", { children: `@container (max-width: 360px) {
          .lk-field-action__row {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .lk-field-action__action,
          .lk-field-action__action > .lk-btn {
            width: 100% !important;
          }
        }` }),
        /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
          _chunk5TKPT3UKcjs.FormField,
          {
            "data-slot": "fieldStack",
            className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "fieldStack") || void 0,
            style: _chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "fieldStack"),
            label,
            helper,
            error,
            required,
            htmlFor,
            children: /* @__PURE__ */ _jsxruntime.jsxs.call(void 0,
              "div",
              {
                "data-slot": "row",
                className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "row", "lk-field-action__row") || void 0,
                style: {
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) max-content",
                  alignItems: "start",
                  gap: "var(--lds-field-action-gap, var(--space-2))",
                  minWidth: 0,
                  ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "row")
                },
                children: [
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "div", { "data-slot": "field", className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "field", "lk-field-action__field") || void 0, style: { minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "field") }, children: fieldNode }),
                  /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
                    "div",
                    {
                      "data-slot": "action",
                      className: _chunkGWMGPLNWcjs.partClassName.call(void 0, classNames, "action", "lk-field-action__action") || void 0,
                      style: { display: "inline-flex", alignItems: "flex-start", minWidth: 0, ..._chunkGWMGPLNWcjs.partStyle.call(void 0, styles, "action") },
                      children: actionNode
                    }
                  )
                ]
              }
            )
          }
        )
      ]
    }
  );
});



exports.FieldAction = FieldAction;
//# sourceMappingURL=chunk-5EQNRB3F.cjs.map