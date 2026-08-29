import React from 'react';
import { IconButton } from '@lk-design-system/lds-core/components/buttons/IconButton';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { ComponentDensityScope, useResolvedDensity } from '@lk-design-system/lds-core/density';
import { useDialogFocus } from '@lk-design-system/lds-core/platform';
import { OverlayPortal } from '@lk-design-system/lds-core/platform';

/**
 * LDS Product Extension — Drawer
 * A side panel that slides in over a navy scrim (filters, detail, settings).
 * `side` right/left; header (title + close), scrollable body, optional footer.
 * Controlled via `open`; Esc / scrim-click close.
 *
 * `appearance="brand"` paints the whole panel — chrome included — on the navy
 * brand surface. A mobile shell that carries a dark masthead and a brand SideNav
 * otherwise breaks its surface twice (navy masthead → white drawer title bar →
 * navy nav panel), and the host cannot reach the title or close button to fix it.
 * The container colour is the Drawer's to own, the same way M3's modal drawer
 * sheet exposes `drawerContainerColor`/`drawerContentColor` on the component.
 */
const DRAWER_APPEARANCES = {
  default: {
    surface: 'var(--color-semantic-background-elevated-normal)',
    divider: 'var(--color-semantic-line-solid-normal)',
    title: 'var(--color-semantic-label-normal)',
    body: 'var(--color-semantic-label-neutral)',
    closeVariant: 'plain',
  },
  brand: {
    surface: 'var(--color-semantic-brand-surface)',
    divider: 'var(--color-semantic-brand-on-surface-border)',
    title: 'var(--color-semantic-brand-on-surface)',
    body: 'var(--color-semantic-brand-on-surface-muted)',
    closeVariant: 'on-dark',
  },
};

export function Drawer({
  open = false,
  side = 'right',
  width = 380,
  appearance = 'default',
  density = 'comfortable',
  title,
  subtitle,
  children,
  footer,
  onClose,
  closeOnScrim = true,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = '서랍 패널',
  closeLabel = '닫기',
  closeButtonVariant,
  withinPortal = true,
  portalTarget,
  zIndex,
  bodyStyle,
  style,
  ...rest
}) {
  const tones = DRAWER_APPEARANCES[appearance] || DRAWER_APPEARANCES.default;
  const [shown, setShown] = React.useState(false);
  const titleId = React.useId();
  const subtitleId = React.useId();
  const portalRef = React.useRef(null);
  const portalAnchorRef = React.useRef(null);
  if (open && !portalAnchorRef.current && typeof document !== 'undefined') {
    portalAnchorRef.current = returnFocusRef?.current ?? document.activeElement;
  }
  if (!open) portalAnchorRef.current = null;
  const { dialogRef, zIndex: resolvedZIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef,
    returnFocusRef,
    restoreFocus,
    portalRef,
    inert: withinPortal,
    zIndex,
  });
  React.useEffect(() => {
    if (open) { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }
    setShown(false); return undefined;
  }, [open]);
  if (!open) return null;
  const isRight = side === 'right';
  const isCompact = density === 'compact';
  const resolvedDensity = isCompact ? 'compact' : 'comfortable';
  const resolvedCloseButtonVariant = closeButtonVariant || tones.closeVariant;
  const hidden = isRight ? 'translateX(100%)' : 'translateX(-100%)';
  return (
    <OverlayPortal open={open} withinPortal={withinPortal} portalTarget={portalTarget} anchorRef={portalAnchorRef} portalRef={portalRef} layer="modal">
    <div
      role="presentation"
      onClick={closeOnScrim ? (e) => { if (e.target === e.currentTarget && onClose) onClose(); } : undefined}
      style={{ position: 'fixed', inset: 0, zIndex: resolvedZIndex, background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))', opacity: shown ? 1 : 0, transition: 'opacity var(--dur-base) var(--ease-out)' }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-describedby={subtitle != null ? subtitleId : undefined}
        aria-label={title == null ? ariaLabel : undefined}
        tabIndex={-1}
        style={{ position: 'absolute', top: 0, bottom: 0, [isRight ? 'right' : 'left']: 0, width, maxWidth: '92vw', display: 'flex', flexDirection: 'column', background: tones.surface, boxShadow: 'var(--shadow-xl)', fontFamily: 'var(--font-sans)', transform: shown ? 'none' : hidden, transition: 'transform var(--dur-slow) var(--ease-out)', ...style }}
        {...rest}
        data-density={resolvedDensity}
      >
        {(title != null || subtitle != null || onClose) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)', padding: isCompact ? 'var(--component-drawer-header-padding-compact, var(--space-4) var(--space-5))' : 'var(--component-drawer-header-padding-comfortable, var(--space-5) var(--space-6))', borderBottom: `1px solid ${tones.divider}` }}>
            <div style={{ flex: 1, minWidth: 0, display: 'grid', gap: 'var(--space-1)' }}>
              {title != null && <div id={titleId} style={{ fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, color: tones.title, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>}
              {subtitle != null && <div id={subtitleId} style={{ color: tones.body, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-reading-line)', overflowWrap: 'anywhere' }}>{subtitle}</div>}
            </div>
            {onClose && (
              <IconButton
                size="sm"
                variant={resolvedCloseButtonVariant}
                label={closeLabel}
                onClick={onClose}
                style={{ '--viewer-foreground': tones.title }}
              >
                <Icon name="close" size={20} aria-hidden="true" />
              </IconButton>
            )}
          </div>
        )}
        <div className="lk-scroll-surface" data-scrollbar="auto" data-scroll-gutter="stable" style={{ flex: 1, padding: isCompact ? 'var(--component-drawer-body-padding-compact, var(--space-4) var(--space-5))' : 'var(--component-drawer-body-padding-comfortable, var(--space-5) var(--space-6))', overflow: 'auto', scrollbarGutter: 'stable', fontSize: isCompact ? 'var(--label1-size)' : 'var(--body2-size)', lineHeight: isCompact ? 'var(--label1-line)' : 1.7, letterSpacing: isCompact ? 'var(--label1-spacing)' : undefined, color: tones.body, wordBreak: 'keep-all', ...bodyStyle }}>
          <ComponentDensityScope density={resolvedDensity}>{children}</ComponentDensityScope>
        </div>
        {footer != null && <div style={{ padding: isCompact ? 'var(--component-drawer-footer-padding-compact, var(--space-3) var(--space-5))' : 'var(--component-drawer-footer-padding-comfortable, var(--space-4) var(--space-6))', borderTop: `1px solid ${tones.divider}`, display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>{footer}</div>}
      </div>
    </div>
    </OverlayPortal>
  );
}

/**
 * A semantic subsection inside Drawer body content. It owns the compact title,
 * description, divider, and section-to-content rhythm so products do not
 * recreate that hierarchy with local heading and spacing utilities.
 */
export function DrawerSection({
  title,
  description,
  headingLevel = 3,
  actions,
  divider = false,
  children,
  headerStyle,
  contentStyle,
  style,
  ...rest
}) {
  const density = useResolvedDensity(undefined, 'comfortable');
  const compact = density === 'compact';
  const titleId = React.useId();
  const Heading = `h${headingLevel}`;

  return (
    <section
      {...rest}
      aria-labelledby={titleId}
      data-density={density}
      style={{
        minWidth: 0,
        borderTop: divider ? '1px solid var(--color-semantic-line-solid-alternative)' : undefined,
        paddingTop: divider ? (compact ? 'var(--space-4)' : 'var(--space-6)') : undefined,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', marginBottom: compact ? 'var(--space-2)' : 'var(--space-3)', ...headerStyle }}>
        <div style={{ minWidth: 0 }}>
          <Heading id={titleId} style={{ margin: 0, fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: 'var(--color-semantic-label-strong)', wordBreak: 'keep-all' }}>
            {title}
          </Heading>
          {description != null && (
            <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: 'var(--color-semantic-label-alternative)', wordBreak: 'keep-all' }}>
              {description}
            </div>
          )}
        </div>
        {actions != null && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>{actions}</div>}
      </div>
      <div style={{ minWidth: 0, ...contentStyle }}>{children}</div>
    </section>
  );
}
