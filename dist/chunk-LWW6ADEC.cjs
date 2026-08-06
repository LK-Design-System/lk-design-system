"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }"use client";


var _chunkF4O2CAUIcjs = require('./chunk-F4O2CAUI.cjs');

// components/selection/LdsProvider.jsx
var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _jsxruntime = require('react/jsx-runtime');
var MODES = /* @__PURE__ */ new Set(["light", "dark", "auto"]);
var useSafeLayoutEffect = typeof window === "undefined" ? _react2.default.useEffect : _react2.default.useLayoutEffect;
var LdsRuntimeContext = _react2.default.createContext({
  colorScheme: "light",
  setColorScheme: () => {
  },
  direction: "ltr",
  locale: void 0
});
function createLocalStorageManager({ key = "lk-theme" } = {}) {
  return {
    get(defaultValue = "light") {
      try {
        const value = localStorage.getItem(key);
        return MODES.has(value) ? value : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    set(value) {
      try {
        localStorage.setItem(key, value);
      } catch (e2) {
      }
    },
    subscribe(callback) {
      if (typeof window === "undefined") return () => {
      };
      const listener = (event) => {
        if (event.key === key && MODES.has(event.newValue)) callback(event.newValue);
      };
      window.addEventListener("storage", listener);
      return () => window.removeEventListener("storage", listener);
    }
  };
}
function resolveTarget(target) {
  if (target === null || typeof document === "undefined") return null;
  if (_optionalChain([target, 'optionalAccess', _ => _.nodeType])) return target;
  if (typeof target === "string") return document.querySelector(target);
  return document.documentElement;
}
function useLdsRuntime() {
  return _react2.default.useContext(LdsRuntimeContext);
}
function LdsProvider({
  children,
  colorScheme,
  defaultColorScheme = "light",
  onColorSchemeChange,
  storageManager,
  storageKey = "lk-theme",
  persist = true,
  target,
  direction = "ltr",
  locale,
  portalTarget = null,
  zIndexBase = 100
}) {
  const manager = _react2.default.useMemo(
    () => _nullishCoalesce(storageManager, () => ( createLocalStorageManager({ key: storageKey }))),
    [storageKey, storageManager]
  );
  const controlled = colorScheme !== void 0;
  const [internalColorScheme, setInternalColorScheme] = _react2.default.useState(() => persist ? manager.get(defaultColorScheme) : defaultColorScheme);
  const resolvedColorScheme = MODES.has(colorScheme) ? colorScheme : internalColorScheme;
  const runtimeTarget = resolveTarget(target);
  const setColorScheme = _react2.default.useCallback((nextValue) => {
    const next = typeof nextValue === "function" ? nextValue(resolvedColorScheme) : nextValue;
    if (!MODES.has(next) || next === resolvedColorScheme) return;
    if (!controlled) setInternalColorScheme(next);
    if (persist) manager.set(next);
    _optionalChain([onColorSchemeChange, 'optionalCall', _2 => _2(next)]);
  }, [controlled, manager, onColorSchemeChange, persist, resolvedColorScheme]);
  _react2.default.useEffect(() => {
    if (!persist || !manager.subscribe) return void 0;
    return manager.subscribe((next) => {
      if (!controlled) setInternalColorScheme(next);
      _optionalChain([onColorSchemeChange, 'optionalCall', _3 => _3(next)]);
    });
  }, [controlled, manager, onColorSchemeChange, persist]);
  useSafeLayoutEffect(() => {
    const element = resolveTarget(target);
    if (!element) return void 0;
    const previous = {
      theme: element.getAttribute("data-theme"),
      direction: element.getAttribute("dir"),
      locale: element.getAttribute("lang")
    };
    element.setAttribute("data-theme", resolvedColorScheme);
    element.setAttribute("dir", direction);
    if (locale) element.setAttribute("lang", locale);
    return () => {
      if (previous.theme == null) element.removeAttribute("data-theme");
      else element.setAttribute("data-theme", previous.theme);
      if (previous.direction == null) element.removeAttribute("dir");
      else element.setAttribute("dir", previous.direction);
      if (locale) {
        if (previous.locale == null) element.removeAttribute("lang");
        else element.setAttribute("lang", previous.locale);
      }
    };
  }, [direction, locale, resolvedColorScheme, target]);
  const value = _react2.default.useMemo(() => ({
    colorScheme: resolvedColorScheme,
    setColorScheme,
    direction,
    locale
  }), [direction, locale, resolvedColorScheme, setColorScheme]);
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, LdsRuntimeContext.Provider, { value, children: /* @__PURE__ */ _jsxruntime.jsx.call(void 0,
    _chunkF4O2CAUIcjs.OverlayRuntimeProvider,
    {
      portalTarget,
      scopeTarget: runtimeTarget,
      zIndexBase,
      direction,
      colorScheme: resolvedColorScheme,
      children
    }
  ) });
}
function LdsColorSchemeScript({
  storageKey = "lk-theme",
  defaultColorScheme = "light",
  nonce
}) {
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultColorScheme);
  const code = `(function(){try{var v=localStorage.getItem(${key});if(v!=="light"&&v!=="dark"&&v!=="auto")v=${fallback};document.documentElement.setAttribute("data-theme",v);}catch(e){document.documentElement.setAttribute("data-theme",${fallback});}})();`;
  return /* @__PURE__ */ _jsxruntime.jsx.call(void 0, "script", { nonce, suppressHydrationWarning: true, dangerouslySetInnerHTML: { __html: code } });
}







exports.LdsRuntimeContext = LdsRuntimeContext; exports.createLocalStorageManager = createLocalStorageManager; exports.useLdsRuntime = useLdsRuntime; exports.LdsProvider = LdsProvider; exports.LdsColorSchemeScript = LdsColorSchemeScript;
//# sourceMappingURL=chunk-LWW6ADEC.cjs.map