import React from 'react';

/**
 * LK ROBOTICS — TagInput
 * A field that turns typed entries into removable chips (핵심 기술, 태그). Enter
 * adds; Backspace on an empty field removes the last. Value is a string[].
 */
export function TagInput({ value, defaultValue = [], onChange, placeholder = '입력 후 Enter', disabled = false, style, 'aria-label': ariaLabel, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const tags = isControlled ? value : internal;
  const [draft, setDraft] = React.useState('');
  const set = (next) => { if (!isControlled) setInternal(next); onChange && onChange(next); };
  const add = (t) => { const v = t.trim(); if (v && !tags.includes(v)) set([...tags, v]); setDraft(''); };
  const remove = (t) => set(tags.filter((x) => x !== t));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', minHeight: 50, padding: '8px 10px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-input)', background: 'var(--color-semantic-background-elevated-normal)', opacity: disabled ? 0.5 : 1, ...style }} {...rest}>
      {tags.map((t) => (
        <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 6px 0 11px', background: 'var(--color-semantic-primary-surface-strong)', color: 'var(--color-semantic-primary-heavy)', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 'var(--fw-semibold)' }}>
          {t}
          <button type="button" aria-label="remove" onClick={() => remove(t)} style={{ display: 'inline-flex', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-semantic-primary-heavy)', padding: 2 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </span>
      ))}
      <input
        value={draft} disabled={disabled} placeholder={tags.length ? '' : placeholder}
        aria-label={ariaLabel ?? (typeof placeholder === 'string' ? placeholder : '태그 입력')}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(draft); } else if (e.key === 'Backspace' && !draft && tags.length) remove(tags[tags.length - 1]); }}
        style={{ flex: 1, minWidth: 90, height: 28, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--color-semantic-label-normal)' }}
      />
    </div>
  );
}
