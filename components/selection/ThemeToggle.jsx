import React from 'react';

const ICONS = {
  light: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
  dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  auto: '<rect x="3" y="4" width="18" height="12.5" rx="2"/><path d="M8.5 20.5h7M12 16.5v4"/>',
};
const LABELS = { light: 'Light', dark: 'Dark', auto: 'Auto' };

/**
 * LK ROBOTICS — ThemeToggle
 * A segmented Light / Dark / Auto control that drives the design-system theme.
 * On change it sets `[data-theme]` on a target element (default <html>) and
 * remembers the choice in localStorage, so a page can switch theme in-place.
 * "auto" follows the OS via prefers-color-scheme. Controlled (`value`+`onChange`)
 * or self-managed; pass `target={null}` to only report changes without touching
 * the DOM.
 */
export function ThemeToggle({
  target,
  storageKey = 'lk-theme',
  options = ['light', 'dark', 'auto'],
  value,
  defaultValue = 'light',
  onChange,
  size = 'md',
  showLabels = true,
  persist = true,
  style,
  ...rest
}) {
  const resolveTarget = React.useCallback(() => {
    if (target === null) return null;
    if (target && target.nodeType) return target;
    if (typeof target === 'string') return document.querySelector(target);
    return typeof document !== 'undefined' ? document.documentElement : null;
  }, [target]);

  const [internal, setInternal] = React.useState(() => {
    if (value) return value;
    if (persist) { try { const s = localStorage.getItem(storageKey); if (s && options.indexOf(s) !== -1) return s; } catch (e) {} }
    return defaultValue;
  });
  const cur = value != null ? value : internal;

  const apply = React.useCallback((v) => {
    const el = resolveTarget();
    if (el) el.setAttribute('data-theme', v);
    if (persist) { try { localStorage.setItem(storageKey, v); } catch (e) {} }
  }, [resolveTarget, storageKey, persist]);

  React.useEffect(() => { apply(cur); }, [cur, apply]);

  const pick = (v) => {
    if (v === cur) return;
    if (value == null) setInternal(v);
    else apply(v);
    onChange && onChange(v);
  };

  const h = size === 'sm' ? 32 : 38;
  const fs = size === 'sm' ? 12.5 : 13.5;
  const isz = size === 'sm' ? 15 : 16;

  return (
    <div
      role="radiogroup"
      aria-label="테마"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3, height: h, padding: 3, boxSizing: 'border-box',
        background: 'var(--fill-normal)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-pill)',
        ...style,
      }}
      {...rest}
    >
      {options.map((v) => {
        const on = cur === v;
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={LABELS[v] || v}
            onClick={() => pick(v)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: showLabels ? 7 : 0,
              height: h - 6, paddingInline: showLabels ? 13 : 9, minWidth: showLabels ? 0 : h - 6,
              border: 'none', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
              background: on ? 'var(--surface-card)' : 'transparent',
              boxShadow: on ? 'var(--shadow-xs)' : 'none',
              color: on ? 'var(--accent-text)' : 'var(--label-alternative)',
              fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 'var(--fw-bold)', letterSpacing: '-0.1px',
              transition: 'var(--component-button-transition)',
            }}
          >
            <svg width={isz} height={isz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[v] || '' }} />
            {showLabels && <span>{LABELS[v] || v}</span>}
          </button>
        );
      })}
    </div>
  );
}
