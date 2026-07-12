import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { useDialogFocus } from './dialog-focus.js';

/**
 * LK ROBOTICS — CommandPalette
 * A ⌘K-style modal with a search field and a filtered command list. Controlled
 * via `open`; Esc / scrim close. Each command runs `onSelect` on click.
 */
export function CommandPalette({
  open = false,
  onClose,
  commands = [],
  placeholder = '명령 검색…',
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = '명령 팔레트',
  style,
  ...rest
}) {
  const [q, setQ] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef(null);
  const listboxId = React.useId();
  const optionIdBase = React.useId();
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef: initialFocusRef ?? inputRef,
    returnFocusRef,
    restoreFocus,
  });
  React.useEffect(() => {
    if (!open) return undefined;
    setQ('');
    setActiveIndex(0);
    return undefined;
  }, [open]);
  const filtered = q ? commands.filter((c) => String(c.label).toLowerCase().includes(q.toLowerCase())) : commands;
  React.useEffect(() => {
    setActiveIndex((current) => Math.max(0, Math.min(current, filtered.length - 1)));
  }, [filtered.length]);
  if (!open) return null;

  const selectCommand = (command) => {
    onClose?.();
    command?.onSelect?.();
  };
  const onInputKeyDown = (event) => {
    if (filtered.length === 0) return;
    let nextIndex;
    if (event.key === 'ArrowDown') nextIndex = (activeIndex + 1) % filtered.length;
    if (event.key === 'ArrowUp') nextIndex = (activeIndex - 1 + filtered.length) % filtered.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = filtered.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      setActiveIndex(nextIndex);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      selectCommand(filtered[activeIndex]);
    }
  };

  return (
    <div role="presentation" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))' }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={ariaLabel} tabIndex={-1} style={{ width: '100%', maxWidth: 560, background: 'var(--color-semantic-background-elevated-normal)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
          <Icon name="search" size={20} color="var(--color-semantic-label-assistive)" aria-hidden="true" />
          <input ref={inputRef} role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls={listboxId} aria-activedescendant={filtered.length > 0 ? `${optionIdBase}-${activeIndex}` : undefined} value={q} onChange={(e) => { setQ(e.target.value); setActiveIndex(0); }} onKeyDown={onInputKeyDown} placeholder={placeholder} aria-label={typeof placeholder === 'string' ? placeholder : '명령 검색'} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 'var(--headline2-size)', color: 'var(--color-semantic-label-normal)' }} />
        </div>
        <div id={listboxId} role="listbox" aria-label="명령" style={{ maxHeight: 340, overflowY: 'auto', padding: 8 }}>
          {filtered.length === 0
            ? <div role="status" style={{ padding: 28, textAlign: 'center', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label1-size)' }}>결과 없음</div>
            : filtered.map((c, i) => (
              <button key={i} id={`${optionIdBase}-${i}`} type="button" role="option" aria-selected={activeIndex === i} tabIndex={-1} onClick={() => selectCommand(c)} onMouseEnter={() => setActiveIndex(i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', border: 'none', background: activeIndex === i ? 'var(--color-semantic-fill-normal)' : 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-medium)', color: 'var(--color-semantic-label-normal)' }}>
                {c.icon && <span style={{ color: 'var(--color-semantic-primary-normal)', display: 'inline-flex' }}>{c.icon}</span>}
                <span style={{ flex: 1 }}>{c.label}</span>
                {c.shortcut && <span style={{ fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-assistive)', fontWeight: 'var(--fw-semibold)' }}>{c.shortcut}</span>}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
