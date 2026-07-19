import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

/**
 * LDS Product Action — SpeedDial
 * A floating action button that fans out labelled tool actions on open. The
 * trigger rotates; `actions` ([{icon, label, onClick, danger}]) stack upward
 * with their labels. Controlled (`open`) or uncontrolled. Extends Fab for the
 * "one primary + a few contextual tools" corner cluster.
 */
export function SpeedDial({ icon, actions = [], open, defaultOpen = false, onOpenChange, label = '작업', style, ...rest }) {
  const controlled = open !== undefined;
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = controlled ? open : internal;
  const setOpen = (v) => { if (!controlled) setInternal(v); onOpenChange && onOpenChange(v); };
  const dialId = React.useId();

  return (
    <div onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false); }} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {isOpen && (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10, justifyItems: 'end' }}>
          {actions.map((a, i) => {
            const actionLabel = a.ariaLabel || (typeof a.label === 'string' ? a.label : undefined);
            const actionId = `${dialId}-action-${i}`;
            return (
              <li key={actionLabel ?? i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <span id={actionId} style={{ padding: '4px 9px', borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-inverse-background)', color: 'var(--color-semantic-inverse-label)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-semibold)', boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>{a.label}</span>
                <button type="button" aria-label={actionLabel} aria-labelledby={actionLabel ? undefined : actionId} onClick={() => { a.onClick && a.onClick(); setOpen(false); }}
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
      <button type="button" aria-label={label} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}
        style={{ width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)',
          background: 'var(--color-semantic-primary-normal)', color: 'var(--component-button-primary-fg)',
          transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}>
        {icon || <Icon name="plus" size={24} aria-hidden="true" />}
      </button>
    </div>
  );
}
