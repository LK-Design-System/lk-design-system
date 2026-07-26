import React from 'react';
import { Icon } from '../icon/Icon.jsx';

const FOCUS_INPUT = Symbol('tag-input-field');

/**
 * LK ROBOTICS — TagInput
 * A field that turns typed entries into removable chips (핵심 기술, 태그). Enter
 * adds; Backspace on an empty field removes the last. Value is a string[].
 *
 * Accessibility — every delete button carries a contextual Korean name
 * (`태그 삭제`) instead of a bare "remove", and removing a chip unmounts its
 * button, so focus is moved forward to the next chip's delete button (or to the
 * text input when the removed chip was the last one) rather than falling back
 * to `<body>` (WCAG 2.2 3.2.1 On Focus / 2.4.3 Focus Order).
 */
export function TagInput({
  value,
  defaultValue = [],
  onChange,
  placeholder = '입력 후 Enter',
  disabled = false,
  removeLabel = (tag) => `${tag} 삭제`,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const tags = isControlled ? value : internal;
  const [draft, setDraft] = React.useState('');
  const inputRef = React.useRef(null);
  const removeRefs = React.useRef(new Map());
  const pendingFocus = React.useRef(null);
  const set = (next) => { if (!isControlled) setInternal(next); onChange && onChange(next); };
  const add = (t) => { const v = t.trim(); if (v && !tags.includes(v)) set([...tags, v]); setDraft(''); };
  const remove = (t) => {
    const index = tags.indexOf(t);
    if (index < 0) return;
    const next = tags.filter((x) => x !== t);
    // The next chip takes over the focus slot; the input takes it when the
    // removed chip was the trailing one.
    pendingFocus.current = next[index] ?? FOCUS_INPUT;
    set(next);
  };

  React.useEffect(() => {
    const target = pendingFocus.current;
    if (target == null) return;
    pendingFocus.current = null;
    if (target === FOCUS_INPUT) inputRef.current?.focus();
    else removeRefs.current.get(target)?.focus();
  }, [tags]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', minHeight: 50, padding: '8px 10px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-input)', background: 'var(--color-semantic-background-elevated-normal)', opacity: disabled ? 0.45 : 1, ...style }} {...rest}>
      {tags.map((t) => (
        <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-0-5)', height: 28, padding: '0 2px 0 11px', background: 'var(--color-semantic-primary-surface-strong)', color: 'var(--color-semantic-label-normal)', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)' }}>
          {t}
          <button
            type="button"
            aria-label={removeLabel(t)}
            disabled={disabled}
            ref={(node) => { if (node) removeRefs.current.set(t, node); else removeRefs.current.delete(t); }}
            onClick={() => remove(t)}
            /* 24x24 hit area (WCAG 2.5.8) around a 12px glyph. The chip's gap
               and inline-end padding shrink by the same 8px the button grew, so
               the glyph stays exactly where it was and the chip keeps its size. */
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flexShrink: 0, border: 'none', background: 'transparent', cursor: 'pointer', color: 'currentColor', padding: 0 }}
          >
            <Icon name="close" size={12} aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft} disabled={disabled} placeholder={tags.length ? '' : placeholder}
        aria-label={ariaLabel ?? (typeof placeholder === 'string' ? placeholder : '태그 입력')}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(draft); } else if (e.key === 'Backspace' && !draft && tags.length) remove(tags[tags.length - 1]); }}
        style={{ flex: 1, minWidth: 90, height: 28, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', color: 'var(--color-semantic-label-normal)' }}
      />
    </div>
  );
}
