import React from 'react';

function lbArrow(side) {
  return { position: 'absolute', [side]: 12, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--material-control-dimmer)', color: 'var(--color-semantic-inverse-label)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
}

/**
 * LK ROBOTICS — Lightbox
 * A fullscreen image viewer over a near-black scrim, with prev/next and close.
 * `images` are URLs or `{ src, alt }`. Controlled via `open` + `index`;
 * Arrow keys / Esc supported.
 */
export function Lightbox({ open = false, images = [], index = 0, onClose, onIndexChange, style, ...rest }) {
  const [i, setI] = React.useState(index);
  React.useEffect(() => { setI(index); }, [index]);
  const go = React.useCallback((d) => { setI((prev) => { const n = (prev + d + images.length) % images.length; onIndexChange && onIndexChange(n); return n; }); }, [images.length, onIndexChange]);
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, go]);
  if (!open) return null;
  const src = images[i];
  const url = typeof src === 'string' ? src : (src && src.src);
  return <LightboxStage key="stage" url={url} alt={(src && src.alt) || ''} count={images.length} go={go} onClose={onClose} style={style} rest={rest} />;
}

function LightboxStage({ url, alt, count, go, onClose, style, rest }) {
  const [loaded, setLoaded] = React.useState(false);
  const imgRef = React.useRef(null);
  React.useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [url]);
  return (
    <div role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 130, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--material-dimmer)', ...style }} {...rest}>
      <button type="button" aria-label="닫기" onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--color-semantic-inverse-fill-normal)', color: 'var(--color-semantic-inverse-label)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg></button>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: loaded ? 0 : 280, minHeight: loaded ? 0 : 200 }}>
        <img ref={imgRef} src={url} alt={alt} onLoad={() => setLoaded(true)} style={{ display: 'block', maxWidth: '86vw', maxHeight: '86vh', borderRadius: 'var(--radius-lg)', boxShadow: loaded ? 'var(--shadow-xl)' : 'none', opacity: loaded ? 1 : 0, transition: 'opacity .18s ease' }} />
        {!loaded && <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'inline-flex' }}><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-inverse-icon-muted)" strokeWidth="2.4" strokeLinecap="round"><path d="M12 2a10 10 0 1 0 10 10"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" /></path></svg></span>}
        {loaded && count > 1 && <button type="button" aria-label="previous" onClick={() => go(-1)} style={lbArrow('left')}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg></button>}
        {loaded && count > 1 && <button type="button" aria-label="next" onClick={() => go(1)} style={lbArrow('right')}><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg></button>}
      </div>
    </div>
  );
}
