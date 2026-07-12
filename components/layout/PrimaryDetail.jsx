import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { Drawer } from '../overlay/Drawer.jsx';

/**
 * LK Product Extension — PrimaryDetail
 * Keeps list/content selection product-owned while providing one consistent
 * inline detail region or focus-managed overlay presentation.
 */
export function PrimaryDetail({
  primary,
  detail,
  detailOpen = false,
  mode = 'inline',
  primaryLabel = '기본 콘텐츠',
  detailLabel = '상세 정보',
  detailTitle,
  detailWidth = 360,
  detailFooter,
  onDetailClose,
  closeLabel = '상세 닫기',
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  primaryStyle,
  detailStyle,
  detailBodyStyle,
  style,
  ...rest
}) {
  const resolvedMode = mode === 'overlay' ? 'overlay' : 'inline';
  const titleId = React.useId();
  const detailName = typeof detailTitle === 'string' ? detailTitle : detailLabel;
  const capturedReturnFocusRef = React.useRef(null);
  React.useLayoutEffect(() => {
    if (detailOpen && returnFocusRef?.current) {
      capturedReturnFocusRef.current = returnFocusRef.current;
    }
  }, [detailOpen, returnFocusRef]);
  const focusReturnTarget = () => {
    const run = () => (capturedReturnFocusRef.current ?? returnFocusRef?.current)?.focus?.();
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(run);
    else setTimeout(run, 0);
  };
  const closeInline = () => {
    onDetailClose?.();
    focusReturnTarget();
  };

  return (
    <div
      data-primary-detail-mode={resolvedMode}
      data-detail-open={detailOpen ? 'true' : 'false'}
      style={{
        display: 'grid',
        gridTemplateColumns: resolvedMode === 'inline' && detailOpen
          ? `minmax(0, 1fr) minmax(280px, ${typeof detailWidth === 'number' ? `${detailWidth}px` : detailWidth})`
          : 'minmax(0, 1fr)',
        minWidth: 0,
        minHeight: 0,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <section aria-label={primaryLabel} style={{ minWidth: 0, minHeight: 0, ...primaryStyle }}>
        {primary}
      </section>

      {resolvedMode === 'inline' && detailOpen && (
        <aside
          role="region"
          aria-label={detailTitle == null ? detailLabel : undefined}
          aria-labelledby={detailTitle == null ? undefined : titleId}
          style={{
            display: 'grid',
            gridTemplateRows: `${detailTitle != null || onDetailClose ? 'auto ' : ''}minmax(0, 1fr)${detailFooter != null ? ' auto' : ''}`,
            minWidth: 0,
            minHeight: 0,
            overflow: 'hidden',
            borderLeft: '1px solid var(--color-semantic-line-normal-normal)',
            background: 'var(--color-semantic-background-elevated-normal)',
            ...detailStyle,
          }}
        >
          {(detailTitle != null || onDetailClose) && (
            <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', minWidth: 0, minHeight: 52, padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-semantic-line-normal-normal)', boxSizing: 'border-box' }}>
              {detailTitle != null && (
                <div id={titleId} style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)', lineHeight: 'var(--body1-line)', fontWeight: 'var(--fw-bold)' }}>
                  {detailTitle}
                </div>
              )}
              {onDetailClose && (
                <button
                  type="button"
                  aria-label={closeLabel}
                  onClick={closeInline}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, padding: 0, marginLeft: 'auto', flexShrink: 0, border: 'none', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--color-semantic-label-neutral)', cursor: 'pointer' }}
                >
                  <Icon name="close" size={18} aria-hidden="true" />
                </button>
              )}
            </header>
          )}
          <div style={{ minWidth: 0, minHeight: 0, overflow: 'auto', padding: 'var(--space-4)', ...detailBodyStyle }}>
            {detail}
          </div>
          {detailFooter != null && (
            <footer style={{ padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--color-semantic-line-normal-normal)' }}>
              {detailFooter}
            </footer>
          )}
        </aside>
      )}

      {resolvedMode === 'overlay' && (
        <Drawer
          open={detailOpen}
          side="right"
          width={typeof detailWidth === 'number' ? detailWidth : 380}
          title={detailTitle}
          ariaLabel={detailName}
          closeLabel={closeLabel}
          footer={detailFooter}
          onClose={onDetailClose}
          initialFocusRef={initialFocusRef}
          returnFocusRef={capturedReturnFocusRef}
          restoreFocus={restoreFocus}
          style={detailStyle}
        >
          <div style={{ minWidth: 0, ...detailBodyStyle }}>{detail}</div>
        </Drawer>
      )}
    </div>
  );
}
