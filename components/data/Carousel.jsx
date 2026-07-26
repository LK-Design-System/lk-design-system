import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { PageIndicator } from '../navigation/PageIndicator.jsx';

const hiddenStyle = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 };

/* The track slide is an inline transition, so a plain
   `@media (prefers-reduced-motion: reduce)` rule would lose to it — the
   override has to carry `!important`, same as Skeleton/Spinner/ProgressBar. */
function useStyleRule(id, css) {
  React.useEffect(() => {
    if (typeof document === 'undefined' || document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}

function navBtnStyle(side) {
  return { position: 'absolute', top: '50%', [side]: 12, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'var(--scrim-dark)', color: 'var(--color-semantic-static-white)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', zIndex: 2 };
}

const controlRailStyle = {
  position: 'absolute',
  left: '50%',
  bottom: 'var(--space-2)',
  transform: 'translateX(-50%)',
  height: 32,
  maxWidth: 'calc(100% - var(--space-4))',
  padding: '0 var(--space-2)',
  borderRadius: 'var(--radius-pill)',
  background: 'var(--scrim-dark)',
  color: 'var(--color-semantic-static-white)',
  backdropFilter: 'blur(4px)',
  overflow: 'visible',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2,
};

const rotationBtnStyle = { flex: '0 0 auto', width: 44, height: 44, padding: 0, borderRadius: '50%', border: 'none', background: 'transparent', color: 'inherit', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

/**
 * LK ROBOTICS — Carousel
 * A horizontal slide viewport with dot indicators and (optional) arrows. Pass
 * `slides` as an array of nodes (images, cards). Wraps around at the ends.
 *
 * Follows the WAI-ARIA APG carousel pattern: the root is a named
 * `role="region"` with `aria-roledescription="carousel"`, every slide is a
 * `role="group"` with `aria-roledescription="slide"` and an "N / 전체" name, and
 * the slides that scrolled out of the viewport are `inert` + `aria-hidden` so
 * their links and buttons leave both the tab order and the accessibility tree
 * instead of keeping invisible focus (same treatment as `Dimmer`). Optional
 * `autoPlay` comes with a pause control and stops on hover/focus and on any
 * explicit navigation (WCAG 2.2.2); the slide announcement is `off` while the
 * carousel rotates on its own and `polite` once the reader is in control.
 */
export function Carousel({
  slides = [],
  label = '캐러셀',
  slideLabels,
  showDots = true,
  showArrows = true,
  autoPlay = false,
  interval = 5000,
  previousLabel = '이전 슬라이드',
  nextLabel = '다음 슬라이드',
  playLabel = '자동 재생 시작',
  pauseLabel = '자동 재생 일시정지',
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}) {
  useStyleRule(
    'lk-carousel-motion',
    '@media (prefers-reduced-motion: reduce){[data-lds-carousel-track]{transition:none!important}}',
  );

  const n = slides.length;
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoPlay);
  const [held, setHeld] = React.useState(false);
  const rotationPointerWasPlaying = React.useRef(false);
  const rotating = playing && !held && n > 1;

  React.useEffect(() => { setPlaying(autoPlay); }, [autoPlay]);
  React.useEffect(() => { setI((previous) => (n > 0 ? Math.min(previous, n - 1) : 0)); }, [n]);

  React.useEffect(() => {
    if (!rotating) return undefined;
    const period = Number(interval) > 0 ? Number(interval) : 5000;
    const timer = setInterval(() => setI((previous) => (previous + 1) % n), period);
    return () => clearInterval(timer);
  }, [rotating, interval, n]);

  const slideName = (index) => {
    const own = slideLabels?.[index];
    const position = `${index + 1} / ${n}`;
    return own ? `${own}, ${position}` : position;
  };

  /* Explicit navigation is the reader taking over: APG stops auto rotation as
     soon as a carousel control is activated, and stopping also flips the
     announcement from `off` back to `polite`. */
  const goTo = (index) => {
    setPlaying(false);
    setI(((index % n) + n) % n);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={(event) => { onMouseEnter?.(event); setHeld(true); }}
      onMouseLeave={(event) => { onMouseLeave?.(event); setHeld(false); }}
      onFocus={(event) => {
        onFocus?.(event);
        setPlaying(false);
        setHeld(true);
      }}
      onBlur={(event) => {
        onBlur?.(event);
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', ...style }}
      {...rest}
    >
      <span data-carousel-live aria-live={rotating ? 'off' : 'polite'} aria-atomic="true" style={hiddenStyle}>
        {n > 0 ? slideName(i) : ''}
      </span>

      {(autoPlay || showDots) && n > 1 && (
        <div
          data-carousel-controls
          style={controlRailStyle}
        >
          {autoPlay ? (
            <button
              type="button"
              data-carousel-rotation={playing ? 'playing' : 'paused'}
              aria-label={playing ? pauseLabel : playLabel}
              onPointerDown={() => { rotationPointerWasPlaying.current = playing; }}
              onClick={(event) => {
                const previous = event.detail > 0 ? rotationPointerWasPlaying.current : playing;
                const next = !previous;
                setPlaying(next);
                if (next) setHeld(false);
              }}
              style={rotationBtnStyle}
            >
              <Icon name={playing ? 'pause' : 'play'} size={16} aria-hidden="true" />
            </button>
          ) : null}
          {showDots ? (
            <PageIndicator
              variant="dot"
              presentation="media"
              page={i + 1}
              count={n}
              onChange={(page) => goTo(page - 1)}
              getItemLabel={(page) => slideName(page - 1)}
              groupLabel={`${label} 슬라이드 선택`}
            />
          ) : null}
        </div>
      )}

      <div data-lds-carousel-track style={{ display: 'flex', transform: `translateX(-${i * 100}%)`, transition: 'transform var(--dur-slow) var(--ease-out)' }}>
        {slides.map((slide, idx) => {
          const current = idx === i;
          return (
            <div
              key={idx}
              role="group"
              aria-roledescription="slide"
              aria-label={slideName(idx)}
              aria-hidden={current ? undefined : true}
              inert={current ? undefined : true}
              data-carousel-slide={current ? 'current' : 'offscreen'}
              style={{ flex: '0 0 100%', minWidth: '100%' }}
            >
              {slide}
            </div>
          );
        })}
      </div>

      {showArrows && n > 1 && (
        <React.Fragment>
          <button type="button" aria-label={previousLabel} onClick={() => goTo(i - 1)} style={navBtnStyle('left')}><Icon name="chevron-left" size={20} aria-hidden="true" /></button>
          <button type="button" aria-label={nextLabel} onClick={() => goTo(i + 1)} style={navBtnStyle('right')}><Icon name="chevron-right" size={20} aria-hidden="true" /></button>
        </React.Fragment>
      )}
    </div>
  );
}
