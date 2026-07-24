import React from 'react';

// useLayoutEffect warns during SSR; fall back to useEffect on the server so the
// measurement pass only runs in the browser (SearchField/Prose precedent).
const useSafeLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/**
 * LK ROBOTICS — ExpandableText
 * Inline prose that clamps to a fixed number of lines and reveals the rest
 * behind a "더 보기 / 접기" toggle — a feed post body, a long description, a
 * comment. This is a general text utility, not a feed-only part.
 *
 * Accessibility — the FULL text always lives in the DOM; the clamp is purely a
 * visual `-webkit-line-clamp` cut, so a screen reader reads the whole passage
 * whether or not it is visually expanded. The toggle is a real `button` that
 * owns `aria-expanded` and `aria-controls` pointing at the text region, so
 * assistive tech announces the collapsed/expanded state and its target. The
 * toggle only appears when the content actually overflows the clamp — short
 * text renders no control. Overflow is measured from `scrollHeight` against
 * `line-height × lines`, which is stable in both the collapsed and expanded
 * states (so a `defaultExpanded` passage can still be collapsed).
 */
export function ExpandableText({
  children,
  lines = 3,
  moreLabel = '더 보기',
  lessLabel = '접기',
  expanded: controlledExpanded,
  defaultExpanded = false,
  onToggle,
  as: Tag = 'div',
  style,
  textStyle,
  ...rest
}) {
  const isControlled = controlledExpanded !== undefined;
  const [internal, setInternal] = React.useState(defaultExpanded);
  const expanded = isControlled ? controlledExpanded : internal;

  const textRef = React.useRef(null);
  const [overflowing, setOverflowing] = React.useState(false);
  const reactId = React.useId();
  const regionId = `lk-expandable-${reactId}`;

  useSafeLayoutEffect(() => {
    const el = textRef.current;
    if (!el || typeof window === 'undefined') return undefined;
    const measure = () => {
      const cs = window.getComputedStyle(el);
      let lineHeight = parseFloat(cs.lineHeight);
      if (!Number.isFinite(lineHeight)) lineHeight = (parseFloat(cs.fontSize) || 16) * 1.5;
      // scrollHeight reports the full content height even while the clamp hides
      // the overflow, so this holds in both collapsed and expanded states.
      setOverflowing(el.scrollHeight - lineHeight * lines > 1);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, lines]);

  const toggle = () => {
    const next = !expanded;
    if (!isControlled) setInternal(next);
    onToggle && onToggle(next);
  };

  const clampStyle = expanded
    ? null
    : { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: lines, overflow: 'hidden' };

  return (
    <div style={style} {...rest}>
      <Tag
        ref={textRef}
        id={regionId}
        style={{
          margin: 0,
          color: 'var(--color-semantic-label-normal)',
          fontSize: 'var(--body1-size)',
          lineHeight: 'var(--body1-line)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'keep-all',
          overflowWrap: 'anywhere',
          ...clampStyle,
          ...textStyle,
        }}
      >
        {children}
      </Tag>
      {overflowing && (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-controls={regionId}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            // Meet the 24px minimum target size (WCAG 2.5.8); the negative left
            // margin keeps the label visually flush with the body text.
            minHeight: 24,
            marginTop: 'var(--space-1)',
            marginLeft: 'calc(-1 * var(--space-2))',
            padding: 'var(--space-1) var(--space-2)',
            border: 0,
            background: 'none',
            font: 'inherit',
            fontSize: 'var(--caption1-size)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--color-semantic-label-alternative)',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          {expanded ? lessLabel : moreLabel}
        </button>
      )}
    </div>
  );
}
