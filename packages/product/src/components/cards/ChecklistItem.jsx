import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { VisuallyHidden } from '@lk-robotics/lds-core/components/layout/VisuallyHidden';

/**
 * LK ROBOTICS — ChecklistItem
 * Capability / feature row: signal-ink check (or red cross) + label. The
 * brand's most common list style (핵심 기능, 적용 현장).
 *
 * Accessibility — the check/cross glyph, the accent colour and the strike
 * through are decoration only, so the include/exclude state is also published
 * as text (`stateLabel`, visually hidden by default). Never let colour or an
 * icon carry the meaning alone (WCAG 1.4.1 / 1.3.1). The row renders as `li`
 * so a stack of rows is a real list; wrap it in `ul`/`ol` and use `as="div"`
 * only when the row stands alone outside a list.
 */
export function ChecklistItem({
  children,
  cross = false,
  muted = false,
  dark = false,
  as = 'li',
  stateLabel,
  style,
  ...rest
}) {
  const ok = !cross;
  const Row = as;
  const color = ok ? (dark ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-primary-normal)') : 'var(--color-semantic-status-negative)';
  const resolvedStateLabel = stateLabel === undefined ? (ok ? '포함' : '제외') : stateLabel;
  return (
    <Row style={{ display: 'flex', alignItems: 'flex-start', gap: '11px', listStyle: 'none', ...style }} {...rest}>
      <span style={{ display: 'inline-flex', flexShrink: 0, marginTop: 2, color }}>
        {ok ? (
          <Icon name="check" size={18} aria-hidden="true" />
        ) : (
          <Icon name="close" size={16} aria-hidden="true" />
        )}
        {resolvedStateLabel != null && <VisuallyHidden>{resolvedStateLabel}</VisuallyHidden>}
      </span>
      <span style={{
        fontSize: 'var(--body1-size)', fontWeight: 'var(--fw-semibold)', lineHeight: 1.5, letterSpacing: 0,
        color: dark ? 'var(--color-semantic-static-white)' : muted ? 'var(--color-semantic-label-alternative)' : 'var(--color-semantic-label-neutral)',
        opacity: dark && muted ? 0.7 : 1,
        textDecoration: cross ? 'line-through' : 'none',
        wordBreak: 'keep-all',
      }}>
        {children}
      </span>
    </Row>
  );
}
