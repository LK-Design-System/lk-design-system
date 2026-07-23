import React from 'react';

/**
 * LK ROBOTICS — Bubble
 * A callout with a tail that points at its subject — coach marks, map
 * annotations, persistent explanations. `navy` (solid) or `light` (white +
 * hairline). Tail on any side.
 *
 * Not a chat message. `tone` is surface styling only: it carries no speaker
 * meaning, so using navy/light to tell two speakers apart would encode identity
 * in colour alone (WCAG 1.4.1). Conversations belong to `ConversationMessage`
 * inside a `MessageFeed`, which keep author name/role as text.
 */
export function Bubble({ children, tone = 'navy', tail = 'bottom', style, ...rest }) {
  const dark = tone === 'navy';
  const bg = dark ? 'var(--color-semantic-inverse-background)' : 'var(--color-semantic-background-elevated-normal)';
  const fg = dark ? 'var(--color-semantic-static-white)' : 'var(--color-semantic-label-normal)';
  const bd = dark ? 'none' : '1px solid var(--color-semantic-line-solid-normal)';
  const tailBase = { position: 'absolute', width: 12, height: 12, background: bg, transform: 'rotate(45deg)' };
  const tails = {
    bottom: { ...tailBase, bottom: -6, left: '50%', marginLeft: -6, borderRight: bd, borderBottom: bd },
    top: { ...tailBase, top: -6, left: '50%', marginLeft: -6, borderLeft: bd, borderTop: bd },
    left: { ...tailBase, left: -6, top: '50%', marginTop: -6, borderLeft: bd, borderBottom: bd },
    right: { ...tailBase, right: -6, top: '50%', marginTop: -6, borderRight: bd, borderTop: bd },
  };
  return (
    <div
      style={{
        position: 'relative', display: 'inline-block', maxWidth: 280, padding: '12px 15px',
        background: bg, color: fg, border: bd, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)',
        fontFamily: 'var(--font-sans)', fontSize: 'var(--label1-size)', lineHeight: 1.6, letterSpacing: 0, wordBreak: 'keep-all', ...style,
      }}
      {...rest}
    >
      {children}
      <span style={tails[tail] || tails.bottom} />
    </div>
  );
}
