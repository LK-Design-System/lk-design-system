import React from 'react';
import { Button } from '@lk-robotics/lds-core/components/buttons/Button';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

/**
 * LK ROBOTICS — CopyButton
 * Copies `value` to the clipboard and flips to a check + "복사됨" for ~1.4s. A
 * cool-gray flat button by default — composed from Button (variant="flat") so
 * the rest fill/transition come from the button tokens. Geometry and typography
 * are explicit style overrides: the 36/44 heights predate the Button height
 * scale (32/40/48) and are preserved exactly. Candidate for future
 * normalization onto the token scale (needs design sign-off).
 */
export function CopyButton({ value, children = '복사', copiedLabel = '복사됨', size = 'md', style, ...rest }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(String(value)); } catch (e) { /* no-op */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <Button
      variant="flat"
      size={size}
      onClick={copy}
      style={{
        // Overrides that intentionally diverge from the Button md/sm recipe —
        // kept to avoid any visual change; normalize in a future pass.
        gap: 7,
        height: size === 'sm' ? 36 : 44,
        padding: '0 14px',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--label1-size)',
        lineHeight: 'normal',
        fontWeight: 'var(--fw-bold)',
        letterSpacing: 0,
        color: copied ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-normal)',
        ...(copied ? { background: 'var(--color-semantic-primary-surface-strong)' } : null),
        ...style,
      }}
      {...rest}
    >
      {copied
        ? <Icon name="check" size={16} aria-hidden="true" />
        : <Icon name="copy" size={16} aria-hidden="true" />}
      {copied ? copiedLabel : children}
    </Button>
  );
}
