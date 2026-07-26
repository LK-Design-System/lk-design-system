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
 * The signature image-led product tile. The product photo fills the card while
 * a controlled bottom scrim protects the product code, description, and
 * optional category. No in-card CTA by default: in a homogeneous product grid
 * the card-as-link convention is the affordance
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
// A low-strength navy grade keeps mixed photography in the LDS visual family
// without flattening the source image.
const PC_GRADE = [
  'linear-gradient(180deg, color-mix(in srgb, var(--color-semantic-brand-stage-from) 6%, transparent) 0%, color-mix(in srgb, var(--color-semantic-brand-stage-to) 18%, transparent) 100%)',
].join(', ');
// Keep the scrim anchored to the content instead of stretching it over the
// whole card. Its capped depth protects the same text block on landscape,
// square, and portrait cards without veiling the extra portrait image area.
const PC_SCRIM = [
  'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--scrim-dark) 12%, transparent) 28%, color-mix(in srgb, var(--scrim-dark) 72%, transparent) 58%, var(--scrim-dark) 100%)',
].join(', ');

const PC_RATIOS = {
  '16/9': 'var(--ratio-16-9)',
  '3/2': 'var(--ratio-3-2)',
  '4/3': 'var(--ratio-4-3)',
  '1/1': 'var(--ratio-1-1)',
  '4/5': 'var(--ratio-4-5)',
  '3/4': 'var(--ratio-3-4)',
  '2/3': 'var(--ratio-2-3)',
};

function resolveRatio(ratio) {
  if (typeof ratio === 'number') return String(ratio);
  if (typeof ratio === 'string') return PC_RATIOS[ratio] || ratio.replace('/', ' / ');
  return PC_RATIOS['3/2'];
}

export function ProductCard({
  id,
  category,
  description,
  image,
  ratio = '3/2',
  imageFit = 'cover',
  imagePosition = '50% 30%',
  imageSrcSet,
  imageSizes,
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
  const resolvedImageFit = imageFit === 'contain' ? 'contain' : 'cover';
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
        aspectRatio: resolveRatio(ratio),
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
            position: 'absolute', inset: 0, pointerEvents: 'none',
          }}
        >
          {/* The photo is a decorative full-card stage (the wrapper is
              aria-hidden and the product code names the card), so it stays
              alt="". lazy/decoding keep product grids cheap; the selected
              aspect-ratio reserves layout and a failed image degrades to the
              navy fallback showing through. */}
          <img
            src={image}
            srcSet={imageSrcSet}
            sizes={imageSizes}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              width: '100%', height: '100%', boxSizing: 'border-box',
              objectFit: resolvedImageFit, objectPosition: imagePosition, display: 'block',
              padding: resolvedImageFit === 'contain' ? 'var(--space-6)' : 0,
              filter: 'brightness(1.03)',
              transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 600ms var(--ease-out)',
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: PC_GRADE }} />
        </div>
      )}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: 'min(84%, calc(var(--space-32) + var(--space-28)))',
          background: PC_SCRIM, pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {/* Optional category is neutral inverse text: the image-led surface
              should not promote secondary metadata above the product code. */}
          {category && <span style={{ fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--color-semantic-inverse-label-strong-soft)' }}>{category}</span>}
          <HeadingTag style={{ margin: 0, fontSize: 'var(--fs-h5)', lineHeight: 'var(--lh-h5)', fontWeight: 'var(--fw-extra)', letterSpacing: 'var(--ls-h5)', color: 'var(--color-semantic-inverse-label)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{id}</HeadingTag>
        </div>
        {/* 2-line clamp keeps the content block inside the protected scrim zone
            so long copy never grows up into the subject area. */}
        {description && <p style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-reading-line)', color: 'var(--color-semantic-inverse-label-strong-soft)', wordBreak: 'keep-all', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{description}</p>}
        {cta && (
          <span style={{
            alignSelf: 'flex-end', marginTop: 4, whiteSpace: 'nowrap',
            fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0,
            color: hover ? 'var(--color-semantic-inverse-label)' : 'var(--color-semantic-inverse-label-strong-soft)',
            textDecoration: hover ? 'underline' : 'none', textUnderlineOffset: 3,
            transition: 'color var(--dur-fast) var(--ease-out)',
          }}>{cta}</span>
        )}
      </div>
    </a>
  );
}
