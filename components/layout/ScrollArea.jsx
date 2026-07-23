import React from 'react';

function useScrollStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById('lk-scrollarea-css')) return;
    const el = document.createElement('style');
    el.id = 'lk-scrollarea-css';
    el.textContent = '.lk-scrollarea{scrollbar-width:thin;scrollbar-color:var(--color-semantic-interaction-inactive) transparent;}.lk-scrollarea::-webkit-scrollbar{width:7px;height:7px;}.lk-scrollarea::-webkit-scrollbar-thumb{background:var(--color-semantic-interaction-inactive);border-radius:99px;}.lk-scrollarea::-webkit-scrollbar-thumb:hover{background:var(--color-semantic-label-alternative);}.lk-scrollarea::-webkit-scrollbar-track{background:transparent;}.lk-scrollarea:focus-visible{outline:2px solid var(--color-semantic-focus-indicator);outline-offset:2px;}';
    document.head.appendChild(el);
  }, []);
}

/**
 * LK ROBOTICS — ScrollArea
 * A scroll container with a slim, cool-gray custom scrollbar. Cap it with
 * `maxHeight` (px or CSS).
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
  style,
  ...rest
}) {
  useScrollStyles();
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
      ref={nodeRef}
      className="lk-scrollarea"
      role={rest.role ?? (isFocusable && named ? 'region' : undefined)}
      aria-label={rest['aria-label'] ?? label}
      aria-labelledby={rest['aria-labelledby'] ?? labelledBy}
      tabIndex={rest.tabIndex ?? (isFocusable ? 0 : undefined)}
      style={{ maxHeight, overflow: 'auto', ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}
