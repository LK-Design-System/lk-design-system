import React from 'react';
import { VisuallyHidden } from '../layout/VisuallyHidden.jsx';

function defaultCountLabel(count, max) {
  return count > max ? `읽지 않음 ${max}건 이상` : `읽지 않음 ${count}건`;
}

/* Fold the badge text into the wrapped control's accessible name (Material /
   Atlassian convention) so "알림" becomes "알림 읽지 않음 7건". IconButton and
   Fab expose their name through `label`; anything else uses `aria-label`. */
function withFoldedName(children, extra) {
  if (!extra || !React.isValidElement(children)) return null;
  const props = children.props || {};
  if (typeof props['aria-label'] === 'string' && props['aria-label']) {
    return React.cloneElement(children, { 'aria-label': `${props['aria-label']} ${extra}` });
  }
  if (typeof props.label === 'string' && props.label) {
    return React.cloneElement(children, { label: `${props.label} ${extra}` });
  }
  return null;
}

/**
 * LK ROBOTICS — PushBadge
 * A notification overlay pinned to the top-right of its child (an icon /
 * avatar). `dot` shows a bare status dot; a `count` shows a number (clamped at
 * `max`). White ring so it reads on any surface.
 *
 * Accessibility: the coloured overlay is decorative (`aria-hidden`). The count
 * reaches assistive tech through `label` — folded into the wrapped control's
 * accessible name when that control already has one ("알림" → "알림 읽지 않음
 * 7건"), otherwise emitted as visually hidden text next to it.
 */
export function PushBadge({ children, count, dot = false, max = 99, tone = 'negative', label, style, ...rest }) {
  const c = tone === 'signal' ? 'var(--color-semantic-primary-normal)' : tone === 'navy' ? 'var(--color-semantic-brand-surface)' : 'var(--color-semantic-status-negative-text)';
  const show = dot || (count != null && count > 0);
  const visualLabel = count > max ? `${max}+` : count;
  /* A bare dot carries no value, so it stays silent unless the consumer names
     it. A count always gets a default name. */
  const accessibleLabel = label !== undefined
    ? label
    : (!dot && show ? defaultCountLabel(count, max) : null);
  const announce = show && accessibleLabel != null && accessibleLabel !== false && accessibleLabel !== '';
  const folded = announce ? withFoldedName(children, accessibleLabel) : null;

  return (
    <span style={{ position: 'relative', display: 'inline-flex', ...style }} {...rest}>
      {folded ?? children}
      {announce && folded == null && <VisuallyHidden>{accessibleLabel}</VisuallyHidden>}
      {show && (dot ? (
        <span aria-hidden="true" style={{ position: 'absolute', top: -1, right: -1, width: 9, height: 9, borderRadius: '50%', background: c, border: '2px solid var(--color-semantic-background-elevated-normal)', boxSizing: 'content-box' }} />
      ) : (
        <span aria-hidden="true" style={{ position: 'absolute', top: -7, right: -9, minWidth: 18, height: 18, padding: '0 5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: c, color: 'var(--color-semantic-static-white)', borderRadius: 'var(--radius-pill)', border: '2px solid var(--color-semantic-background-elevated-normal)', boxSizing: 'content-box', fontFamily: 'var(--font-sans)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{visualLabel}</span>
      ))}
    </span>
  );
}
