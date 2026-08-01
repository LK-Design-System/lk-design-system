import React from 'react';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { ContentBadge } from '@lk-design-system/lds-core/components/content/ContentBadge';

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
 * LK ROBOTICS — ListingCard
 * A listing / catalog card for entries a user browses and enters — an event,
 * a course, a recruitment posting, a resource. Cover image, a title, one or
 * more icon-prefixed meta rows (period, location, classification), and a
 * lifecycle status badge (진행중 / 신청 마감). Renders as one link.
 *
 * This is deliberately NOT `NewsCard`: NewsCard is an article/press card whose
 * `date` is a publish date and `source` is a byline. A listing's date is an
 * enrolment/run PERIOD and its badge is a lifecycle STATUS — folding those into
 * NewsCard would make one component mean two things.
 *
 * Accessibility — the whole card is one link named by its title. The status is
 * decision-critical for a listing (open vs closed), so it folds into the
 * accessible name after the title (`제목. 신청 마감`); an informative cover's
 * `imageAlt` folds in the same way. Meta rows are supplementary visible context.
 * The card must never contain another focusable element.
 */
export function ListingCard({
  image,
  imageAlt = '',
  title,
  meta = [],
  status,
  statusTone = 'neutral',
  headingLevel = 3,
  href = '#',
  style,
  onFocus,
  onBlur,
  'aria-label': ariaLabel,
  ...rest
}) {
  const [pointerHover, setPointerHover] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const hover = pointerHover || focusVisible;
  const HeadingTag = headingLevel === false || headingLevel == null ? 'div' : `h${headingLevel}`;

  // The link's aria-label wins over descendant content, so the title, an
  // informative cover alt, and the lifecycle status are composed into one name.
  const titleName = typeof title === 'string' ? title : null;
  const altName = typeof imageAlt === 'string' && imageAlt.trim() ? imageAlt.trim() : null;
  const statusName = typeof status === 'string' && status.trim() ? status.trim() : null;
  const resolvedLabel = ariaLabel
    ?? (titleName ? [titleName, altName, statusName].filter(Boolean).join('. ') : undefined);

  const rows = Array.isArray(meta) ? meta.filter(Boolean) : [];

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
          cover degrades to a neutral panel. loading/decoding keep long grids
          cheap. */}
      {image && (
        <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--color-semantic-background-normal-alternative)' }}>
          <img src={image} alt={imageAlt} loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hover ? 'scale(1.03)' : 'scale(1)', transition: 'transform 520ms var(--ease-out)' }} />
        </div>
      )}
      <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
        {title && (
          <HeadingTag style={{ margin: 0, fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, lineHeight: 1.36, color: 'var(--color-semantic-label-strong)', wordBreak: 'keep-all', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>
            {title}
          </HeadingTag>
        )}
        {rows.length > 0 && (
          <div style={{ display: 'grid', gap: 'var(--space-1)', marginTop: 'var(--space-1)' }}>
            {rows.map((row, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: 'var(--color-semantic-label-alternative)' }}>
                {row.icon && <Icon name={row.icon} size={14} aria-hidden="true" style={{ flexShrink: 0 }} />}
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.label}</span>
              </div>
            ))}
          </div>
        )}
        {status != null && status !== '' && (
          <div style={{ marginTop: 'var(--space-2)' }}>
            {typeof status === 'string'
              ? <ContentBadge tone={statusTone} variant="soft" size="small">{status}</ContentBadge>
              : status}
          </div>
        )}
      </div>
    </a>
  );
}
