import React from 'react';

/**
 * LK ROBOTICS — BottomNav
 * Mobile bottom tab bar: an even row of icon + label tabs on white with a
 * hairline top. The active tab takes the signal ink. Pass `items` as
 * `{ value, label, icon }` (icon is a node, e.g. <Icon name="home" />).
 * Controlled (`value`) or uncontrolled (`defaultValue`).
 */
export function BottomNav({ items = [], value, defaultValue, onChange, renderLink, style, ...rest }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue != null ? defaultValue : (items[0] && items[0].value));
  const val = isControlled ? value : internal;
  const pick = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };
  return (
    <nav style={{ display: 'flex', alignItems: 'stretch', width: '100%', maxWidth: '100%', minWidth: 0, overflow: 'hidden', background: 'var(--color-semantic-background-elevated-normal)', borderTop: '1px solid var(--color-semantic-line-solid-normal)', ...style }} {...rest}>
      {items.map((o) => {
        const active = o.value === val;
        const disabled = !!o.disabled;
        const accessibleLabel = o.ariaLabel || (typeof o.label === 'string' ? o.label : undefined);
        const content = (
          <React.Fragment>
            {o.icon != null && <span aria-hidden="true" style={{ display: 'inline-flex', flexShrink: 0 }}>{o.icon}</span>}
            <span style={{ width: '100%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)', fontSize: 'var(--caption2-size)', fontWeight: active ? 'var(--fw-bold)' : 'var(--fw-medium)', letterSpacing: 0 }}>{o.label}</span>
          </React.Fragment>
        );
        const itemStyle = {
          flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          padding: '9px 4px', minHeight: 58, boxSizing: 'border-box', border: 'none', background: 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, textDecoration: 'none', textAlign: 'center',
          color: active ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-alternative)',
          transition: 'color var(--dur-fast) var(--ease-out)',
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
