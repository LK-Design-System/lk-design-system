import React from 'react';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

function navBtnStyle(side) {
  return { position: 'absolute', top: '50%', [side]: 12, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'var(--scrim-dark)', color: 'var(--color-semantic-static-white)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', zIndex: 2 };
}

/**
 * LK ROBOTICS — Carousel
 * A horizontal slide viewport with dot indicators and (optional) arrows. Pass
 * `slides` as an array of nodes (images, cards). Wraps around at the ends.
 */
export function Carousel({ slides = [], showDots = true, showArrows = true, style, ...rest }) {
  const [i, setI] = React.useState(0);
  const n = slides.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-2xl)', ...style }} {...rest}>
      <div style={{ display: 'flex', transform: `translateX(-${i * 100}%)`, transition: 'transform var(--dur-slow) var(--ease-out)' }}>
        {slides.map((s, idx) => <div key={idx} style={{ flex: '0 0 100%', minWidth: '100%' }}>{s}</div>)}
      </div>
      {showArrows && n > 1 && (
        <React.Fragment>
          <button type="button" aria-label="previous" onClick={() => go(-1)} style={navBtnStyle('left')}><Icon name="chevron-left" size={20} aria-hidden="true" /></button>
          <button type="button" aria-label="next" onClick={() => go(1)} style={navBtnStyle('right')}><Icon name="chevron-right" size={20} aria-hidden="true" /></button>
        </React.Fragment>
      )}
      {showDots && n > 1 && (
        <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 2 }}>
          {slides.map((_, idx) => (
            <button key={idx} type="button" aria-label={`slide ${idx + 1}`} onClick={() => setI(idx)} style={{ width: idx === i ? 22 : 8, height: 8, borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer', padding: 0, background: idx === i ? 'var(--color-semantic-background-elevated-normal)' : 'var(--color-semantic-inverse-label-alternative-soft)', transition: 'width var(--dur-base) var(--ease-out)' }} />
          ))}
        </div>
      )}
    </div>
  );
}
