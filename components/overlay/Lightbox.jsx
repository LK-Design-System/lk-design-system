import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { useDialogFocus } from './dialog-focus.js';

const SR_ONLY_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

function lbArrow(side, blocked) {
  return { position: 'absolute', [side]: 12, top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--material-control-dimmer)', color: 'var(--color-semantic-inverse-label)', cursor: blocked ? 'default' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
}

/** Localised default for the slide position, used visibly and as the announcement. */
function defaultPositionLabel(position, total) {
  return `이미지 ${position} / ${total}`;
}

/**
 * LK ROBOTICS — Lightbox
 * A fullscreen image viewer over a near-black scrim, with prev/next and close.
 * `images` are URLs or `{ src, alt }`. Controlled via `open` + `index`;
 * Arrow keys / Esc supported.
 */
export function Lightbox({
  open = false,
  images = [],
  index = 0,
  onClose,
  onIndexChange,
  initialFocusRef,
  returnFocusRef,
  restoreFocus = true,
  ariaLabel = '이미지 뷰어',
  closeLabel = '닫기',
  previousLabel = '이전 이미지',
  nextLabel = '다음 이미지',
  positionLabel = defaultPositionLabel,
  style,
  ...rest
}) {
  const [i, setI] = React.useState(index);
  const closeFocusRef = React.useRef(null);
  const { dialogRef, zIndex } = useDialogFocus({
    open,
    onDismiss: onClose,
    initialFocusRef: initialFocusRef ?? closeFocusRef,
    returnFocusRef,
    restoreFocus,
  });
  React.useEffect(() => { setI(index); }, [index]);
  const go = React.useCallback((d) => { setI((prev) => { const n = (prev + d + images.length) % images.length; onIndexChange && onIndexChange(n); return n; }); }, [images.length, onIndexChange]);
  if (!open) return null;
  const src = images[i];
  const url = typeof src === 'string' ? src : (src && src.src);
  const count = images.length;
  const position = count > 0 ? String(positionLabel(i + 1, count)) : '';
  // Only an `{ src, alt }` entry can declare intent — including the deliberate
  // decorative `alt=""`. A bare URL has no way to say it, and the image is the
  // dialog's only content, so it falls back to the localised position label
  // instead of being announced as decoration (WCAG 1.1.1).
  const hasExplicitAlt = src != null && typeof src === 'object' && typeof src.alt === 'string';
  return <LightboxStage key="stage" url={url} alt={hasExplicitAlt ? src.alt : position} position={position} count={count} go={go} onClose={onClose} closeLabel={closeLabel} previousLabel={previousLabel} nextLabel={nextLabel} closeFocusRef={closeFocusRef} dialogRef={dialogRef} zIndex={zIndex} ariaLabel={ariaLabel} style={style} rest={rest} />;
}

function LightboxStage({ url, alt, position, count, go, onClose, closeLabel, previousLabel, nextLabel, closeFocusRef, dialogRef, zIndex, ariaLabel, style, rest }) {
  const [loaded, setLoaded] = React.useState(false);
  const imgRef = React.useRef(null);
  React.useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [url]);
  const multiple = count > 1;
  // Moving costs a decode, and the incoming frame must not race the outgoing
  // one — but the controls stay mounted and focusable while it lands, because a
  // control that disappears under the caret drops focus to <body> (WCAG 2.4.3).
  const step = (delta) => { if (loaded && multiple) go(delta); };
  const onKeyDown = (event) => {
    if (event.defaultPrevented || !multiple) return;
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    step(event.key === 'ArrowRight' ? 1 : -1);
  };
  // The announcement is the position plus whatever the image itself says, so a
  // slide change is reported even though the img alt swap alone is silent.
  const describedAlt = typeof alt === 'string' ? alt.trim() : '';
  const announcement = describedAlt && describedAlt !== position ? `${position}, ${describedAlt}` : position;
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={ariaLabel} aria-busy={loaded ? undefined : 'true'} tabIndex={-1} onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--component-dialog-scrim)', backdropFilter: 'blur(var(--component-dialog-scrim-blur))', ...style }} {...rest} onKeyDown={(event) => { rest?.onKeyDown?.(event); onKeyDown(event); }}>
      <button ref={closeFocusRef} type="button" aria-label={closeLabel} onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'var(--color-semantic-inverse-fill-normal)', color: 'var(--color-semantic-inverse-label)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="close" size={22} aria-hidden="true" /></button>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: loaded ? 0 : 280, minHeight: loaded ? 0 : 200 }}>
        <img ref={imgRef} src={url} alt={alt} onLoad={() => setLoaded(true)} style={{ display: 'block', maxWidth: '86vw', maxHeight: '86vh', borderRadius: 'var(--radius-lg)', boxShadow: loaded ? 'var(--shadow-xl)' : 'none', opacity: loaded ? 1 : 0, transition: 'opacity .18s ease' }} />
        {!loaded && <span aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', display: 'inline-flex' }}><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-inverse-icon-muted)" strokeWidth="2.4" strokeLinecap="round"><path d="M12 2a10 10 0 1 0 10 10"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" /></path></svg></span>}
        {multiple && <button type="button" data-lightbox-previous aria-label={previousLabel} aria-disabled={loaded ? undefined : 'true'} onClick={() => step(-1)} style={lbArrow('left', !loaded)}><Icon name="chevron-left" size={26} aria-hidden="true" /></button>}
        {multiple && <button type="button" data-lightbox-next aria-label={nextLabel} aria-disabled={loaded ? undefined : 'true'} onClick={() => step(1)} style={lbArrow('right', !loaded)}><Icon name="chevron-right" size={26} aria-hidden="true" /></button>}
      </div>
      {/* The visible counter is decoration: the live region below and the image's
          own alt already carry the position to assistive technology. */}
      {multiple && <span aria-hidden="true" data-lightbox-position style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--material-control-dimmer)', color: 'var(--color-semantic-inverse-label)', fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)' }}>{position}</span>}
      {/* Mounted for the whole open lifetime and only its text is replaced: a
          status node inserted together with its message is not announced. */}
      <div data-lightbox-live role="status" aria-live="polite" aria-atomic="true" style={SR_ONLY_STYLE}>{multiple ? announcement : ''}</div>
    </div>
  );
}
