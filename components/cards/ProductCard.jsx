import React from 'react';

/**
 * LK ROBOTICS — ProductCard
 * The signature dark product tile. The product photo occupies the TOP ~68% of
 * the card and dissolves into the navy stage via a mask fade that COMPLETES
 * BEFORE the content starts — eyebrow, product code and description always sit
 * on pure navy, never on the photo. No in-card CTA by default: in a
 * homogeneous product grid the card-as-link convention is the affordance
 * (promote the action to a section-level "전 제품 보기" link). Hover: image
 * zoom + deeper shadow only — the card itself stays put.
 */
const PC_FADE = 'linear-gradient(180deg, var(--color-semantic-static-black) 46%, transparent 96%)';

export function ProductCard({
  id,
  category,
  description,
  image,
  imagePosition = '50% 30%',
  href = '#',
  cta,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        aspectRatio: '4 / 5',
        background: 'linear-gradient(180deg, var(--color-semantic-brand-stage-from) 0%, var(--color-semantic-brand-stage-to) 100%)',
        border: '1px solid var(--border-hairline-dark)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-xl)' : 'var(--shadow-sm)',
        transition: 'box-shadow var(--dur-base) var(--ease-out)',
        textDecoration: 'none',
        ...style,
      }}
      {...rest}
    >
      {image && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '68%', pointerEvents: 'none',
            WebkitMaskImage: PC_FADE, maskImage: PC_FADE,
          }}
        >
          <img
            src={image}
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition, display: 'block',
              transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 600ms var(--ease-out)',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 34%, var(--scrim-dark) 88%)' }} />
        </div>
      )}
      <div style={{ position: 'relative', padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {category && <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--color-semantic-primary-normal)' }}>{category}</span>}
          <h3 style={{ margin: 0, fontSize: 'var(--fs-h5)', lineHeight: 'var(--lh-h5)', fontWeight: 800, letterSpacing: 'var(--ls-h5)', color: 'var(--color-semantic-inverse-label)', whiteSpace: 'nowrap' }}>{id}</h3>
        </div>
        {description && <p style={{ margin: 0, fontSize: 14, lineHeight: 1.62, color: 'var(--color-semantic-inverse-label)', wordBreak: 'keep-all' }}>{description}</p>}
        {cta && (
          <span style={{
            alignSelf: 'flex-end', marginTop: 4, whiteSpace: 'nowrap',
            fontSize: 12.5, fontWeight: 'var(--fw-bold)', letterSpacing: 0,
            color: hover ? 'var(--color-semantic-inverse-label)' : 'var(--color-semantic-inverse-label-neutral-soft)',
            textDecoration: hover ? 'underline' : 'none', textUnderlineOffset: 3,
            transition: 'color var(--dur-fast) var(--ease-out)',
          }}>{cta}</span>
        )}
      </div>
    </a>
  );
}
