import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { normalizeStatusTone, statusToneStyle } from './status-presentation.js';

/**
 * LDS Core — OverlayStatusChip
 * Surface-anchored, non-blocking status pill: chrome that floats over an
 * interaction surface (canvas, viewer, control area) to say what state that
 * surface is in, without ever participating in its layout.
 *
 * The gap it fills in the Status family: Banner and Callout are in-flow blocks
 * (inserting one pushes the surface's content), Notification is a transient
 * screen-corner message, Tooltip is hover-born. None of them can label a
 * surface that stays up while inert — a hold-to-run control waiting for its
 * enabling device, a canvas that is saving, a map recomputing a route — where
 * the state can toggle several times a second and any layout shift would move
 * the very controls the operator is holding.
 *
 * Contract: absolutely positioned (top-center by default, caller overrides via
 * `style`), `pointer-events: none` (the chip explains a control, it is not
 * one), `role="status"`, and callers place it OUTSIDE any `inert` subtree so
 * assistive tech keeps reading it while the surface it describes is inert.
 *
 * Quiet by design: `neutral` is for resting states (a released enabling
 * device is routine, not a fault) and carries no status paint. The tone
 * glyphs and colours come from the family's STATUS_TONE_STYLE — this chip is
 * a new anchor for the existing vocabulary, not a second vocabulary.
 */
export function OverlayStatusChip({
  tone = 'neutral',
  icon,
  children,
  style,
  ...rest
}) {
  const normalizedTone = normalizeStatusTone(tone, 'offline');
  const palette = statusToneStyle(normalizedTone);
  const neutral = normalizedTone === 'offline';
  const glyph = icon ?? palette.icon;

  return (
    <span
      data-overlay-status-chip=""
      data-tone={tone}
      role="status"
      style={{
        position: 'absolute',
        top: 'var(--space-4)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        maxWidth: 'calc(100% - var(--space-6))',
        padding: 'var(--space-1) var(--space-3)',
        borderRadius: 999,
        boxSizing: 'border-box',
        background: 'var(--color-semantic-background-elevated-normal)',
        border: '1px solid var(--color-semantic-line-normal-alternative)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--color-semantic-label-neutral)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--label1-size)',
        lineHeight: 'var(--label1-line)',
        /* Never a pointer target: the chip must not steal the press that
           re-enables the control it describes. */
        pointerEvents: 'none',
        ...style,
      }}
      {...rest}
    >
      {glyph != null && (
        <Icon
          name={glyph}
          size={14}
          aria-hidden="true"
          style={{ color: neutral ? undefined : palette.foreground, flex: 'none' }}
        />
      )}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
        {children}
      </span>
    </span>
  );
}
