import React from 'react';
import { OverlayRuntimeProvider } from '../overlay/overlay-platform.js';

const MODES = new Set(['light', 'dark', 'auto']);
const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

export const LdsRuntimeContext = React.createContext({
  colorScheme: 'light',
  setColorScheme: () => {},
  direction: 'ltr',
  locale: undefined,
});

export function createLocalStorageManager({ key = 'lk-theme' } = {}) {
  return {
    get(defaultValue = 'light') {
      try {
        const value = localStorage.getItem(key);
        return MODES.has(value) ? value : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    set(value) {
      try { localStorage.setItem(key, value); } catch {}
    },
    subscribe(callback) {
      if (typeof window === 'undefined') return () => {};
      const listener = (event) => {
        if (event.key === key && MODES.has(event.newValue)) callback(event.newValue);
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
  };
}

function resolveTarget(target) {
  if (target === null || typeof document === 'undefined') return null;
  if (target?.nodeType) return target;
  if (typeof target === 'string') return document.querySelector(target);
  return document.documentElement;
}

export function useLdsRuntime() {
  return React.useContext(LdsRuntimeContext);
}

export function LdsProvider({
  children,
  colorScheme,
  defaultColorScheme = 'light',
  onColorSchemeChange,
  storageManager,
  storageKey = 'lk-theme',
  persist = true,
  target,
  direction = 'ltr',
  locale,
  portalTarget = null,
  zIndexBase = 100,
}) {
  const manager = React.useMemo(
    () => storageManager ?? createLocalStorageManager({ key: storageKey }),
    [storageKey, storageManager],
  );
  const controlled = colorScheme !== undefined;
  const [internalColorScheme, setInternalColorScheme] = React.useState(() => (
    persist ? manager.get(defaultColorScheme) : defaultColorScheme
  ));
  const resolvedColorScheme = MODES.has(colorScheme) ? colorScheme : internalColorScheme;
  const runtimeTarget = resolveTarget(target);

  const setColorScheme = React.useCallback((nextValue) => {
    const next = typeof nextValue === 'function' ? nextValue(resolvedColorScheme) : nextValue;
    if (!MODES.has(next) || next === resolvedColorScheme) return;
    if (!controlled) setInternalColorScheme(next);
    if (persist) manager.set(next);
    onColorSchemeChange?.(next);
  }, [controlled, manager, onColorSchemeChange, persist, resolvedColorScheme]);

  React.useEffect(() => {
    if (!persist || !manager.subscribe) return undefined;
    return manager.subscribe((next) => {
      if (!controlled) setInternalColorScheme(next);
      onColorSchemeChange?.(next);
    });
  }, [controlled, manager, onColorSchemeChange, persist]);

  useSafeLayoutEffect(() => {
    const element = resolveTarget(target);
    if (!element) return undefined;
    const previous = {
      theme: element.getAttribute('data-theme'),
      direction: element.getAttribute('dir'),
      locale: element.getAttribute('lang'),
    };
    element.setAttribute('data-theme', resolvedColorScheme);
    element.setAttribute('dir', direction);
    if (locale) element.setAttribute('lang', locale);
    return () => {
      if (previous.theme == null) element.removeAttribute('data-theme');
      else element.setAttribute('data-theme', previous.theme);
      if (previous.direction == null) element.removeAttribute('dir');
      else element.setAttribute('dir', previous.direction);
      if (locale) {
        if (previous.locale == null) element.removeAttribute('lang');
        else element.setAttribute('lang', previous.locale);
      }
    };
  }, [direction, locale, resolvedColorScheme, target]);

  const value = React.useMemo(() => ({
    colorScheme: resolvedColorScheme,
    setColorScheme,
    direction,
    locale,
  }), [direction, locale, resolvedColorScheme, setColorScheme]);

  return (
    <LdsRuntimeContext.Provider value={value}>
      <OverlayRuntimeProvider
        portalTarget={portalTarget}
        scopeTarget={runtimeTarget}
        zIndexBase={zIndexBase}
        direction={direction}
        colorScheme={resolvedColorScheme}
      >
        {children}
      </OverlayRuntimeProvider>
    </LdsRuntimeContext.Provider>
  );
}

export function LdsColorSchemeScript({
  storageKey = 'lk-theme',
  defaultColorScheme = 'light',
  nonce,
}) {
  const key = JSON.stringify(storageKey);
  const fallback = JSON.stringify(defaultColorScheme);
  const code = `(function(){try{var v=localStorage.getItem(${key});if(v!=="light"&&v!=="dark"&&v!=="auto")v=${fallback};document.documentElement.setAttribute("data-theme",v);}catch(e){document.documentElement.setAttribute("data-theme",${fallback});}})();`;
  return <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: code }} />;
}
