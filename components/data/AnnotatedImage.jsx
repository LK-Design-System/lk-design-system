import React from 'react';
import { ToggleIcon } from '../buttons/ToggleIcon.jsx';
import { Icon } from '../icon/Icon.jsx';

const ANNOTATION_TONE = {
  signal: 'var(--color-semantic-primary-normal)',
  positive: 'var(--color-semantic-status-positive)',
  warning: 'var(--color-semantic-status-cautionary)',
  danger: 'var(--color-semantic-status-negative)',
  neutral: 'var(--color-semantic-label-neutral)',
};

function percent(value) {
  return `${Math.max(0, Math.min(1, Number(value) || 0)) * 100}%`;
}

function imageContentBox(frame, image, objectFit) {
  if (!frame.width || !frame.height || !image.width || !image.height) {
    return { left: 0, top: 0, width: frame.width, height: frame.height };
  }

  if (objectFit === 'fill') return { left: 0, top: 0, width: frame.width, height: frame.height };

  const containScale = Math.min(frame.width / image.width, frame.height / image.height);
  const scale = objectFit === 'cover'
    ? Math.max(frame.width / image.width, frame.height / image.height)
    : objectFit === 'none'
      ? 1
      : objectFit === 'scale-down'
        ? Math.min(1, containScale)
        : containScale;
  const width = image.width * scale;
  const height = image.height * scale;
  return { left: (frame.width - width) / 2, top: (frame.height - height) / 2, width, height };
}

/** Image renderer for normalized regions and points. Provenance and workflow actions are composed outside. */
export function AnnotatedImage({
  src,
  alt,
  caption,
  regions = [],
  points = [],
  annotationsVisible,
  defaultAnnotationsVisible = true,
  onAnnotationsVisibleChange,
  loadingMessage = '이미지를 불러오는 중입니다.',
  emptyMessage = '표시할 이미지가 없습니다.',
  errorMessage = '이미지를 불러오지 못했습니다.',
  summaryLabel = '이미지 annotation 요약',
  aspectRatio = '16 / 9',
  objectFit = 'contain',
  style,
  ...rest
}) {
  const controlled = annotationsVisible !== undefined;
  const [internalVisible, setInternalVisible] = React.useState(defaultAnnotationsVisible);
  const visible = controlled ? annotationsVisible : internalVisible;
  const [imageState, setImageState] = React.useState(src ? 'loading' : 'empty');
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = React.useState({ width: 0, height: 0 });
  const frameRef = React.useRef(null);
  const annotations = regions.length + points.length;
  const overlayBox = imageContentBox(frameSize, imageSize, objectFit);

  React.useEffect(() => {
    setImageState(src ? 'loading' : 'empty');
    setImageSize({ width: 0, height: 0 });
  }, [src]);

  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const measure = () => setFrameSize({ width: frame.clientWidth, height: frame.clientHeight });
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [aspectRatio, src]);

  const setVisible = (next) => {
    if (!controlled) setInternalVisible(next);
    onAnnotationsVisibleChange?.(next);
  };

  return (
    <figure style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', minWidth: 0, margin: 0, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div
        ref={frameRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: src ? undefined : '12rem',
          aspectRatio: src ? aspectRatio : undefined,
          overflow: 'hidden',
          border: '1px solid var(--color-semantic-line-normal-normal)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-semantic-inverse-background)',
        }}
      >
        {src && (
          <img
            src={src}
            alt={alt}
            onLoad={(event) => {
              setImageSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight });
              setImageState('loaded');
            }}
            onError={() => setImageState('error')}
            style={{ display: 'block', width: '100%', height: '100%', objectFit }}
          />
        )}

        {imageState !== 'loaded' && (
          <div
            role={imageState === 'error' ? 'alert' : 'status'}
            style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 'var(--space-6)', color: 'var(--color-semantic-inverse-label-neutral-soft)', textAlign: 'center', background: 'var(--color-semantic-inverse-background)' }}
          >
            {imageState === 'loading' ? loadingMessage : imageState === 'error' ? errorMessage : emptyMessage}
          </div>
        )}

        {imageState === 'loaded' && annotations > 0 && (
          <ToggleIcon
            size="sm"
            pressed={visible}
            onChange={setVisible}
            label="Annotation 표시"
            title={visible ? 'Annotation 숨기기' : 'Annotation 보기'}
            style={{ position: 'absolute', zIndex: 2, top: 'var(--space-3)', right: 'var(--space-3)', color: 'var(--color-semantic-label-normal)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-solid-normal)', boxShadow: 'var(--shadow-md)' }}
          >
            <Icon name={visible ? 'eye' : 'eye-slash'} size={16} aria-hidden="true" />
          </ToggleIcon>
        )}

        {imageState === 'loaded' && visible && annotations > 0 && (
          <div
            aria-hidden="true"
            style={{ position: 'absolute', left: overlayBox.left, top: overlayBox.top, width: overlayBox.width, height: overlayBox.height, pointerEvents: 'none' }}
          >
            {regions.map((region, index) => {
              const color = ANNOTATION_TONE[region.tone] ?? ANNOTATION_TONE.signal;
              return (
                <span key={region.id ?? index} style={{ position: 'absolute', left: percent(region.x), top: percent(region.y), width: percent(region.width), height: percent(region.height), boxSizing: 'border-box', border: `var(--border-thick) solid ${color}`, borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ position: 'absolute', left: 'calc(-1 * var(--border-thick))', top: 'calc(-1 * var(--space-6))', maxWidth: '12.5rem', padding: 'var(--space-1) var(--space-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', borderLeft: `var(--border-thick) solid ${color}`, borderRadius: 'var(--radius-xs)', background: 'var(--color-semantic-inverse-background)', color: 'var(--color-semantic-inverse-label)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)' }}>
                    {region.label ?? `Region ${index + 1}`}{region.score != null ? ` ${Math.round(region.score * 100)}%` : ''}
                  </span>
                </span>
              );
            })}
            {points.map((point, index) => {
              const color = ANNOTATION_TONE[point.tone] ?? ANNOTATION_TONE.warning;
              const pointText = point.label ?? (point.value != null ? `${point.value}${point.unit ?? ''}` : `Point ${index + 1}`);
              return (
                <span key={point.id ?? index} style={{ position: 'absolute', left: percent(point.x), top: percent(point.y), width: percent((point.radius ?? 0.03) * 2), aspectRatio: '1', transform: 'translate(-50%, -50%)', border: `var(--border-thick) solid ${color}`, borderRadius: '50%', background: 'transparent' }}>
                  <span style={{ position: 'absolute', left: 'calc(100% + var(--space-1))', top: '50%', maxWidth: '10rem', padding: 'var(--space-1) var(--space-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', transform: 'translateY(-50%)', borderLeft: `var(--border-thick) solid ${color}`, borderRadius: 'var(--radius-xs)', background: 'var(--color-semantic-inverse-background)', color: 'var(--color-semantic-inverse-label)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-bold)' }}>
                    {pointText}
                  </span>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {(caption != null || annotations > 0) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {caption != null && <figcaption style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>{caption}</figcaption>}
          {annotations > 0 && (
            <details style={{ marginLeft: 'auto' }}>
              <summary style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', cursor: 'pointer' }}>{summaryLabel} ({annotations})</summary>
              <ul style={{ margin: 'var(--space-2) 0 0', paddingLeft: 'var(--space-5)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>
                {regions.map((region, index) => <li key={region.id ?? index}>{region.label ?? `Region ${index + 1}`}{region.score != null ? `, 신뢰도 ${Math.round(region.score * 100)}%` : ''}</li>)}
                {points.map((point, index) => <li key={point.id ?? index}>{point.label ?? `Point ${index + 1}`}{point.value != null ? `, ${point.value}${point.unit ?? ''}` : ''}</li>)}
              </ul>
            </details>
          )}
        </div>
      )}
    </figure>
  );
}
