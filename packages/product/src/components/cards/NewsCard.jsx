import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

/**
 * LK ROBOTICS — NewsCard
 * An article/press card — optional cover image, an UPPERCASE category kicker,
 * a headline, an excerpt, and a source · date footer. Hairline surface that
 * lifts on hover. Renders as a link to the article.
 */
export function NewsCard({ image, category, title, excerpt, source, date, cta, href = '#', style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const ArrowR = (
    <Icon name="arrow-right" size={15} aria-hidden="true" />
  );
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
      {image && (
        <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--color-semantic-background-normal-alternative)' }}>
          <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hover ? 'scale(1.03)' : 'scale(1)', transition: 'transform 520ms var(--ease-out)' }} />
        </div>
      )}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 9, flex: 1 }}>
        {category && <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)' }}>{category}</span>}
        {title && <h3 style={{ margin: 0, fontSize: 'var(--headline1-size)', fontWeight: 'var(--fw-extra)', letterSpacing: 0, lineHeight: 1.36, color: 'var(--color-semantic-label-strong)', wordBreak: 'keep-all' }}>{title}</h3>}
        {excerpt && <p style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 1.62, color: 'var(--color-semantic-label-neutral)', wordBreak: 'keep-all' }}>{excerpt}</p>}
        {(source || date || cta) && (
          <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-alternative)' }}>
            {source && <span style={{ fontWeight: 600 }}>{source}</span>}
            {source && date && <span aria-hidden="true">·</span>}
            {date && <span style={{ fontVariantNumeric: 'tabular-nums' }}>{date}</span>}
            {cta && <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontWeight: 700, color: 'var(--color-semantic-primary-normal)', whiteSpace: 'nowrap' }}>{cta}<span style={{ display: 'inline-flex', transform: hover ? 'translateX(2px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }}>{ArrowR}</span></span>}
          </div>
        )}
      </div>
    </a>
  );
}
