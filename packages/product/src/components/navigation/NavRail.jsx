import React from 'react';

/**
 * LK ROBOTICS — NavRail
 * A vertical icon+label navigation rail (desktop side nav). The active item
 * takes the cyan wash + signal ink. Pass `items` as `{ value, label, icon }`.
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function NavRail({ items = [], value, defaultValue, onChange, renderLink, style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (items[0] && items[0].value));
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  return (
    <nav aria-label="주 탐색" style={{ display: 'inline-flex', flexDirection: 'column', width: 'fit-content', maxWidth: '100%', boxSizing: 'border-box', gap: 6, padding: 10, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-xl)', ...style }} {...rest}>
      {items.map((o) => {
        const active = o.value === val;
        const disabled = !!o.disabled;
        const accessibleLabel = o.ariaLabel || (typeof o.label === 'string' ? o.label : undefined);
        const content = (
          <React.Fragment>
            {o.icon != null && <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0 }}>{o.icon}</span>}
            <span style={{ width: '100%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)', fontSize: 'var(--caption2-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)' }}>{o.label}</span>
          </React.Fragment>
        );
        const itemStyle = {
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
          width: 68, height: 60, padding: 0, boxSizing: 'border-box', border: 'none', borderRadius: 'var(--radius-lg)',
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, textDecoration: 'none', textAlign: 'center',
          background: active ? 'var(--color-semantic-primary-surface-strong)' : 'transparent',
          color: active ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)',
          transition: 'background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)',
        };
        const activate = (event) => {
          if (disabled) {
            event.preventDefault();
            return;
          }
          pick(o.value);
          o.onClick?.(event);
        };

        if (o.href != null) {
          const linkProps = {
            href: disabled ? undefined : o.href,
            target: o.target,
            rel: o.rel,
            'aria-label': o.ariaLabel,
            'aria-current': active ? 'page' : undefined,
            'aria-disabled': disabled || undefined,
            tabIndex: disabled ? -1 : undefined,
            title: accessibleLabel,
            onClick: activate,
            style: itemStyle,
            children: content,
          };
          return (
            <React.Fragment key={o.value}>
              {renderLink ? renderLink(o, linkProps) : <a {...linkProps} />}
            </React.Fragment>
          );
        }

        return (
          <button key={o.value} type="button" aria-label={o.ariaLabel} aria-current={active ? 'page' : undefined} disabled={disabled} onClick={activate} title={accessibleLabel} style={itemStyle}>
            {content}
          </button>
        );
      })}
    </nav>
  );
}
