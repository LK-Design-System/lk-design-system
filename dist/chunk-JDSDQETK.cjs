"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkOYYKHFTHcjs = require('./chunk-OYYKHFTH.cjs');


var _chunkI6NJHF3Lcjs = require('./chunk-I6NJHF3L.cjs');


var _chunkF72KSGF7cjs = require('./chunk-F72KSGF7.cjs');

// components/navigation/LanguageSwitcher.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
function LanguageSwitcher({
  locales = [],
  value,
  onChange,
  ariaLabel = "\uC5B8\uC5B4 \uC120\uD0DD",
  align = "right",
  onDark = false,
  disabled = false,
  style,
  ...rest
}) {
  const currentLocale = locales.find((locale) => locale.value === value);
  const hasAvailableAlternative = locales.some(
    (locale) => locale.value !== value && !locale.disabled
  );
  const unavailable = disabled || !currentLocale || !hasAvailableAlternative;
  const items = locales.map((locale) => ({
    icon: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
      "span",
      {
        "aria-hidden": "true",
        "data-language-switcher-indicator": "",
        "data-language-switcher-check": locale.value === value ? "" : void 0,
        style: {
          width: 16,
          height: 16,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: locale.disabled ? "var(--color-semantic-label-disable)" : "var(--color-semantic-primary-normal)"
        },
        children: locale.value === value && /* @__PURE__ */ _jsxruntime.jsx.call(void 0, _chunkF72KSGF7cjs.Icon, { name: "check", size: 16, "aria-hidden": "true" })
      }
    ),
    iconPosition: "end",
    label: /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "span", { lang: _nullishCoalesce(locale.lang, () => ( locale.value)), dir: "auto", children: locale.label }),
    checked: locale.value === value,
    disabled: disabled || locale.disabled,
    onClick: () => {
      if (locale.value === value || locale.disabled) return;
      _optionalChain([onChange, 'optionalCall', _ => _(locale.value, { locale })]);
    }
  }));
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkOYYKHFTHcjs.DropdownMenu,
    {
      "data-language-switcher": "",
      ...rest,
      align,
      variant: "radio",
      items,
      style,
      trigger: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
        _chunkI6NJHF3Lcjs.IconButton,
        {
          "data-language-switcher-trigger": "",
          type: "button",
          size: 36,
          variant: "plain",
          label: ariaLabel,
          title: ariaLabel,
          disabled: unavailable,
          style: onDark ? {
            "--viewer-foreground": "var(--color-semantic-inverse-label)",
            color: unavailable ? "var(--color-semantic-inverse-label-disable-soft)" : "var(--color-semantic-inverse-label)"
          } : void 0,
          children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
            _chunkF72KSGF7cjs.Icon,
            {
              "data-language-switcher-icon": "",
              name: "globe",
              size: 20,
              "aria-hidden": "true"
            }
          )
        }
      )
    }
  );
}



exports.LanguageSwitcher = LanguageSwitcher;
//# sourceMappingURL=chunk-JDSDQETK.cjs.map