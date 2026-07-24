import React from 'react';

/* Material/Fluent convention: the hover affordance belongs to keyboard focus as
   well, but a pointer press must not leave it behind. `:focus-visible` is
   unsupported in some test DOMs — fall back to showing the affordance. */
function isFocusVisible(node) {
  if (!node || typeof node.matches !== 'function') return true;
  try {
    return node.matches(':focus-visible');
  } catch {
    return true;
  }
}

/**
 * LK ROBOTICS — ProductCard
 * The signature dark product tile. The product photo occupies the TOP ~68% of
 * the card and dissolves into the navy stage via a mask fade that COMPLETES
 * BEFORE the content starts — eyebrow, product code and description always sit
 * on pure navy, never on the photo. No in-card CTA by default: in a
 * homogeneous product grid the card-as-link convention is the affordance
 * (promote the action to a section-level "전 제품 보기" link). Hover: image
 * zoom + deeper shadow only — the card itself stays put.
 *
 * Accessibility — mirrors the Core `Card` contract locally: the product code is
 * a real heading whose level is caller-controlled (`headingLevel`, WCAG 1.3.1),
 * the whole-card link takes the product code as its accessible name instead of
 * the full tile prose, and keyboard focus reproduces the hover affordance (the
 * ring itself comes from the global `tokens/focus.css` policy). The card is one
 * link, so it must never contain another focusable element.
 */
// Fade starts late (58%) so the product stays visible deep into the card, and
// completes at 97% of the photo zone — just above the content block, keeping
// the "text on pure navy" contract with a safety margin for narrow cards.
const PC_FADE = 'linear-gradient(180deg, var(--color-semantic-static-black) 58%, transparent 97%)';
// Stage grade: a navy gradient tint (transparent at top, stage-to 28% at the
// photo's foot) pulls warm-toned photography into the cold stage hue exactly
// where photo meets navy, without veiling the upper photo. Layered above a
// softened legibility scrim (55%).
const PC_GRADE = [
  'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-semantic-brand-stage-to) 5%, transparent) 50%, color-mix(in srgb, var(--color-semantic-brand-stage-to) 28%, transparent) 100%)',
  'linear-gradient(180deg, transparent 34%, color-mix(in srgb, var(--scrim-dark) 55%, transparent) 88%)',
].join(', ');

export function ProductCard({
  id,
  category,
  description,
  image,
  imagePosition = '50% 30%',
  href = '#',
  cta,
  headingLevel = 3,
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
  const resolvedLabel = ariaLabel ?? (typeof id === 'string' ? id : undefined);
  return (
    <a
      href={href}
      aria-label={resolvedLabel}
      onMouseEnter={() => setPointerHover(true)}
      onMouseLeave={() => setPointerHover(false)}
      onFocus={(event) => { setFocusVisible(isFocusVisible(event.currentTarget)); onFocus && onFocus(event); }}
      onBlur={(event) => { setFocusVisible(false); onBlur && onBlur(event); }}
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
          {/* The photo is a decorative stage element (the wrapper is
              aria-hidden and the product code names the card), so it stays
              alt="". lazy/decoding keep product grids cheap; the card's 4/5
              aspect-ratio reserves layout and a failed image degrades to the
              navy stage showing through. */}
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: imagePosition, display: 'block',
              filter: 'brightness(1.06)',
              transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 600ms var(--ease-out)',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: PC_GRADE }} />
        </div>
      )}
      <div style={{ position: 'relative', padding: '16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* inverse-primary: the stage is theme-invariant navy, so the accent
              must clear AA against it (primary-normal lands at 3.9:1). */}
          {category && <span style={{ fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--color-semantic-inverse-primary)' }}>{category}</span>}
          <HeadingTag style={{ margin: 0, fontSize: 'var(--fs-h5)', lineHeight: 'var(--lh-h5)', fontWeight: 'var(--fw-extra)', letterSpacing: 'var(--ls-h5)', color: 'var(--color-semantic-inverse-label)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{id}</HeadingTag>
        </div>
        {/* 2-line clamp keeps the content block inside the bottom stage zone so
            long copy never grows up into the photo fade. */}
        {description && <p style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-reading-line)', color: 'var(--color-semantic-inverse-label)', wordBreak: 'keep-all', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{description}</p>}
        {cta && (
          <span style={{
            alignSelf: 'flex-end', marginTop: 4, whiteSpace: 'nowrap',
            fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0,
            color: hover ? 'var(--color-semantic-inverse-label)' : 'var(--color-semantic-inverse-label-neutral-soft)',
            textDecoration: hover ? 'underline' : 'none', textUnderlineOffset: 3,
            transition: 'color var(--dur-fast) var(--ease-out)',
          }}>{cta}</span>
        )}
      </div>
    </a>
  );
}
