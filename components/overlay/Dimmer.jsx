import React from 'react';

const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * LK ROBOTICS — Dimmer
 * A scrim overlay that fills its nearest positioned ancestor (set the parent
 * `position: relative`). Use to dim a card/panel behind a spinner or message.
 * Controlled via `open`.
 *
 * The scrim is not only a visual cover: while it is open every sibling inside
 * the same positioned ancestor is marked `inert`, so the covered controls leave
 * the tab order and the accessibility tree instead of keeping an invisible
 * focus behind the scrim. Same precedent as MessageComposer / Accordion.
 */
export function Dimmer({
  open = false,
  children,
  onClick,
  blur = false,
  blockInteraction = true,
  busy = true,
  style,
  ...rest
}) {
  const scrimRef = React.useRef(null);

  useSafeLayoutEffect(() => {
    if (!open) return undefined;
    const scrim = scrimRef.current;
    const region = scrim?.parentElement;
    if (!region) return undefined;

    const inerted = [];
    if (blockInteraction) {
      Array.from(region.children).forEach((child) => {
        if (child === scrim || child.hasAttribute('inert')) return;
        child.setAttribute('inert', '');
        inerted.push(child);
      });
    }

    // The blocked region — not the scrim — is the thing that is processing, so
    // aria-busy belongs on it.
    const hadBusy = region.hasAttribute('aria-busy');
    const previousBusy = region.getAttribute('aria-busy');
    if (busy) region.setAttribute('aria-busy', 'true');

    return () => {
      inerted.forEach((child) => child.removeAttribute('inert'));
      if (!busy) return;
      if (hadBusy) region.setAttribute('aria-busy', previousBusy);
      else region.removeAttribute('aria-busy');
    };
  }, [open, blockInteraction, busy]);

  if (!open) return null;
  return (
    <div
      ref={scrimRef}
      onClick={onClick}
      style={{
        position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--component-dialog-scrim)', color: 'var(--color-semantic-inverse-label)', backdropFilter: blur ? 'blur(var(--component-dialog-scrim-blur))' : 'none', borderRadius: 'inherit', ...style,
      }}
      {...rest}
    >
      <span
        data-dimmer-content=""
        role={busy ? 'status' : undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-semantic-inverse-background)',
          color: 'var(--color-semantic-inverse-label)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {children}
      </span>
    </div>
  );
}
