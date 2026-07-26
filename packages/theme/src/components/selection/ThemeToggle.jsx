import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

const ICONS = { light: 'sun', dark: 'moon', auto: 'desktop' };
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
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', height: h, padding: 'var(--space-1)', boxSizing: 'border-box',
        background: 'var(--color-semantic-fill-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-pill)',
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
              background: on ? 'var(--color-semantic-background-elevated-normal)' : 'transparent',
              boxShadow: on ? 'var(--shadow-xs)' : 'none',
              color: on ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-alternative)',
              fontFamily: 'var(--font-sans)', fontSize: fs, fontWeight: 'var(--fw-bold)', letterSpacing: 0,
              transition: 'var(--component-button-transition)',
            }}
          >
            <Icon name={ICONS[v] || 'desktop'} size={isz} aria-hidden="true" />
            {showLabels && <span>{LABELS[v] || v}</span>}
          </button>
        );
      })}
    </div>
  );
}
