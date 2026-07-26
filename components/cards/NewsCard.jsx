import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/* Material/Fluent convention: the lift affordance belongs to keyboard focus as
   well as hover, but a pointer press must not leave it behind. `:focus-visible`
   is unsupported in some test DOMs — fall back to showing the affordance. */
function isFocusVisible(node) {
  if (!node || typeof node.matches !== 'function') return true;
  try {
    return node.matches(':focus-visible');
  } catch {
    return true;
  }
}

/**
 * LK ROBOTICS — NewsCard
 * An article/press card — optional cover image, an UPPERCASE category kicker,
 * a headline, an excerpt, and a source · date footer. Hairline surface that
 * lifts on hover. Renders as a link to the article.
 *
 * Accessibility — mirrors the Core `Card` contract locally: the headline is a
 * real heading whose level is caller-controlled (`headingLevel`, WCAG 1.3.1),
 * the whole-card link takes the headline as its accessible name instead of the
 * full card prose, and keyboard focus reproduces the hover affordance (the
 * focus ring itself comes from the global `tokens/focus.css` policy). The card
 * is one link, so it must never contain another focusable element.
 */
export function NewsCard({ image, imageAlt = '', category, title, excerpt, source, date, dateTime, cta, href = '#', headingLevel = 3, style, onFocus, onBlur, 'aria-label': ariaLabel, ...rest }) {
  const [pointerHover, setPointerHover] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const hover = pointerHover || focusVisible;
  const HeadingTag = headingLevel === false || headingLevel == null ? 'div' : `h${headingLevel}`;
  // The link's aria-label wins over descendant content, so a non-empty imageAlt
  // (an informative cover) would otherwise never be announced. Fold it into the
  // name after the headline; a decorative cover (imageAlt="") leaves the name as
  // the headline alone.
  const titleName = typeof title === 'string' ? title : null;
  const altName = typeof imageAlt === 'string' && imageAlt.trim() ? imageAlt.trim() : null;
  const resolvedLabel = ariaLabel ?? (titleName ? (altName ? `${titleName}. ${altName}` : titleName) : undefined);
  const ArrowR = (
    <Icon name="arrow-right" size={15} aria-hidden="true" />
  );
  return (
    <a
      href={href}
      aria-label={resolvedLabel}
      onMouseEnter={() => setPointerHover(true)}
      onMouseLeave={() => setPointerHover(false)}
      onFocus={(event) => { setFocusVisible(isFocusVisible(event.currentTarget)); onFocus && onFocus(event); }}
      onBlur={(event) => { setFocusVisible(false); onBlur && onBlur(event); }}
      style={{
        display: 'flex', flexDirection: 'column', background: 'var(--component-card-bg)',
        border: 'var(--component-card-border)', borderRadius: 'var(--component-card-radius)', overflow: 'hidden',
        textDecoration: 'none', boxShadow: hover ? 'var(--shadow-md)' : 'var(--shadow-xs)',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {/* The wrapper reserves the 16:9 box before the image loads (no layout
          shift) and its background shows through if the image fails, so a broken
          cover degrades to a neutral panel instead of a broken-image glyph.
          loading/decoding keep long card lists cheap. */}
      {image && (
        <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--color-semantic-background-normal-alternative)' }}>
          <img src={image} alt={imageAlt} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hover ? 'scale(1.03)' : 'scale(1)', transition: 'transform 520ms var(--ease-out)' }} />
        </div>
      )}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {category && <span style={{ fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)' }}>{category}</span>}
        {title && <HeadingTag style={{ margin: 0, fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, lineHeight: 1.36, color: 'var(--color-semantic-label-strong)', wordBreak: 'keep-all' }}>{title}</HeadingTag>}
        {excerpt && <p style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 1.62, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{excerpt}</p>}
        {(source || date || cta) && (
          <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-alternative)' }}>
            {source && <span style={{ fontWeight: 600 }}>{source}</span>}
            {source && date && <span aria-hidden="true">·</span>}
            {date && (dateTime
              ? <time dateTime={dateTime} style={{ fontVariantNumeric: 'tabular-nums' }}>{date}</time>
              : <span style={{ fontVariantNumeric: 'tabular-nums' }}>{date}</span>)}
            {cta && <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1-5)', fontWeight: 700, color: 'var(--color-semantic-primary-normal)', whiteSpace: 'nowrap' }}>{cta}<span style={{ display: 'inline-flex', transform: hover ? 'translateX(2px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }}>{ArrowR}</span></span>}
          </div>
        )}
      </div>
    </a>
  );
}
