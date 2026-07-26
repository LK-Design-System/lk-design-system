import React from 'react';

/**
 * LK ROBOTICS — ScrollArea
 * A native scroll container with shared LDS visibility, gutter and keyboard
 * contracts. `scrollbar="auto"` preserves the platform scrollbar; use
 * `scrollbar="compact"` only when the available space is constrained.
 *
 * Accessibility — WCAG 2.1.1 / W3C `scrollable-region-focusable`: a region that
 * actually overflows must be reachable and operable with the keyboard, so it is
 * given `tabIndex={0}` + `role="region"` + an accessible name. Overflow is
 * measured (`focusable="auto"`, the default) so a container that fits its
 * content is NOT added to the tab order — a non-scrolling stop would be a
 * keyboard trap of noise, not an affordance. Supply `label` (or `labelledBy`)
 * whenever the region can scroll; without a name `role="region"` is dropped and
 * a dev warning is logged.
 */
export function ScrollArea({
  children,
  maxHeight = 280,
  label,
  labelledBy,
  focusable = 'auto',
  scrollbar = 'auto',
  gutter = 'stable',
  className,
  style,
  ...rest
}) {
  const nodeRef = React.useRef(null);
  const [overflows, setOverflows] = React.useState(false);

  React.useEffect(() => {
    if (focusable !== 'auto') return undefined;
    const node = nodeRef.current;
    if (!node) return undefined;
    const measure = () => {
      const next =
        node.scrollHeight - node.clientHeight > 1 ||
        node.scrollWidth - node.clientWidth > 1;
      setOverflows((prev) => (prev === next ? prev : next));
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    for (const child of Array.from(node.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [focusable, children, maxHeight]);

  const isFocusable = focusable === 'auto' ? overflows : !!focusable;
  const named = label != null || labelledBy != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;

  React.useEffect(() => {
    if (!isFocusable || named || rest.role != null) return;
    const env = typeof globalThis.process !== 'undefined' ? globalThis.process.env : undefined;
    if (env && env.NODE_ENV === 'production') return;
    // eslint-disable-next-line no-console
    console.warn(
      'ScrollArea: a scrollable region is keyboard focusable and needs an accessible name — pass `label` (or `labelledBy`).',
    );
  }, [isFocusable, named, rest.role]);

  return (
    <div
      {...rest}
      ref={nodeRef}
      className={['lk-scroll-surface', 'lk-scrollarea', className].filter(Boolean).join(' ')}
      data-scrollbar={scrollbar}
      data-scroll-gutter={gutter}
      role={rest.role ?? (isFocusable && named ? 'region' : undefined)}
      aria-label={rest['aria-label'] ?? label}
      aria-labelledby={rest['aria-labelledby'] ?? labelledBy}
      tabIndex={rest.tabIndex ?? (isFocusable ? 0 : undefined)}
      style={{
        maxHeight,
        overflow: 'auto',
        scrollbarGutter: gutter === 'stable' ? 'stable' : 'auto',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
