import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

/**
 * LDS Product Action — SpeedDial
 * A floating action button that fans out labelled tool actions on open. The
 * trigger rotates; `actions` ([{icon, label, onClick, danger}]) stack upward
 * with their labels. Controlled (`open`) or uncontrolled. Extends Fab for the
 * "one primary + a few contextual tools" corner cluster.
 *
 * Disclosure contract (WAI-ARIA APG) — the trigger owns `aria-expanded` /
 * `aria-controls` and the action list is rendered **after** it in the DOM, so
 * reading order and Tab order both run trigger → actions. The upward visual
 * stack comes from `flex-direction: column-reverse`, not from reversing the
 * DOM: the previous DOM-order trick made Tab skip every action. Closing through
 * Escape or through an action returns focus to the trigger (as SplitButton's
 * `closeMenu({ restoreFocus: true })` does) so keyboard focus is never dropped
 * on `<body>`; an outside click closes without stealing focus.
 */
export function SpeedDial({ icon, actions = [], open, defaultOpen = false, onOpenChange, label = '작업', style, onKeyDown, ...rest }) {
  const controlled = open !== undefined;
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = controlled ? open : internal;
  const dialId = React.useId();
  const listId = `${dialId}-actions`;
  const rootRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  const setOpen = (v) => { if (!controlled) setInternal(v); onOpenChange && onOpenChange(v); };

  const close = ({ restoreFocus = false } = {}) => {
    setOpen(false);
    if (!restoreFocus) return;
    // The focused action button is about to be unmounted, which would drop
    // focus to <body>. Restore on the next frame, after the list is gone.
    const run = () => triggerRef.current && triggerRef.current.focus();
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    else setTimeout(run, 0);
  };

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const onDocumentPointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocumentPointer);
    return () => document.removeEventListener('mousedown', onDocumentPointer);
  }, [isOpen]);

  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || event.key !== 'Escape' || !isOpen) return;
    event.stopPropagation();
    close({ restoreFocus: true });
  };

  return (
    <div
      ref={rootRef}
      onKeyDown={handleKeyDown}
      style={{ display: 'inline-flex', flexDirection: 'column-reverse', alignItems: 'flex-end', gap: 12, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <button ref={triggerRef} type="button" aria-label={label} aria-expanded={isOpen} aria-controls={isOpen ? listId : undefined}
        onClick={() => (isOpen ? close() : setOpen(true))}
        style={{ width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)',
          background: 'var(--color-semantic-primary-normal)', color: 'var(--component-button-primary-fg)',
          transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}>
        {icon || <Icon name="plus" size={24} aria-hidden="true" />}
      </button>
      {isOpen && (
        <ul id={listId} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10, justifyItems: 'end' }}>
          {actions.map((a, i) => {
            const actionLabel = a.ariaLabel || (typeof a.label === 'string' ? a.label : undefined);
            const actionId = `${dialId}-action-${i}`;
            return (
              <li key={actionLabel ?? i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span id={actionId} style={{ padding: '4px 9px', borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-inverse-background)', color: 'var(--color-semantic-inverse-label)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-semibold)', boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>{a.label}</span>
                <button type="button" aria-label={actionLabel} aria-labelledby={actionLabel ? undefined : actionId} onClick={() => { a.onClick && a.onClick(); close({ restoreFocus: true }); }}
                  style={{ width: 40, height: 40, borderRadius: '50%', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)',
                    background: a.danger ? 'var(--color-semantic-status-negative)' : 'var(--color-semantic-background-elevated-normal)',
                    color: a.danger ? 'var(--color-semantic-static-white)' : 'var(--color-semantic-label-normal)', border: a.danger ? 'none' : '1px solid var(--color-semantic-line-normal-normal)' }}>
                  {a.icon}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
