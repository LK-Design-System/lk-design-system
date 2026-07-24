import React from 'react';
import { ToggleIcon } from '@lk-robotics/lds-core/components/buttons/ToggleIcon';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';

const ANNOTATION_TONE = {
  signal: 'var(--color-semantic-primary-normal)',
  positive: 'var(--color-semantic-status-positive)',
  cautionary: 'var(--color-semantic-status-cautionary)',
  negative: 'var(--color-semantic-status-negative)',
  // Compatibility aliases; prefer LDS status tone names above.
  warning: 'var(--color-semantic-status-cautionary)',
  danger: 'var(--color-semantic-status-negative)',
  neutral: 'var(--color-semantic-label-neutral)',
};

// Text on a solid tone fill. The status hues stay mid-bright in both themes, where static black
// keeps AA contrast; neutral flips light/dark per theme, so it follows the inverse label instead.
function toneLabelColor(tone) {
  return tone === 'neutral'
    ? 'var(--color-semantic-inverse-label)'
    : 'var(--color-semantic-static-black)';
}

function fraction(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function percent(value) {
  return `${fraction(value) * 100}%`;
}

// Approximate rendered height of a region label (one caption line plus padding), used to test
// whether the strip a label would occupy is clipped by the frame or covered by another region.
const REGION_LABEL_BAND_HEIGHT = 28;

function regionRect(region) {
  const left = fraction(region.x);
  const top = fraction(region.y);
  return { left, top, right: Math.min(1, left + fraction(region.width)), bottom: Math.min(1, top + fraction(region.height)) };
}

function rectsOverlap(a, b) {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

// Region labels sit outside the box like detection-tool tags so they never occlude the annotated
// content: above the top edge by default, inside the box when the frame leaves no room above, and
// below the bottom edge when another region covers the top strip (overlapping boxes are common —
// part inside whole). Best effort: inside-top when every strip is taken.
function regionLabelPlacement(region, index, regions, overlay, frameHeight) {
  if (!overlay.height || !frameHeight) return 'outside-top';
  const band = REGION_LABEL_BAND_HEIGHT / overlay.height;
  const rect = regionRect(region);
  const others = regions.filter((_, i) => i !== index).map(regionRect);
  if (overlay.top + rect.top * overlay.height < REGION_LABEL_BAND_HEIGHT) return 'inside-top';
  const topStrip = { left: rect.left, right: rect.right, top: rect.top - band, bottom: rect.top };
  if (!others.some((other) => rectsOverlap(topStrip, other))) return 'outside-top';
  const bottomStrip = { left: rect.left, right: rect.right, top: rect.bottom, bottom: rect.bottom + band };
  if (overlay.top + rect.bottom * overlay.height + REGION_LABEL_BAND_HEIGHT <= frameHeight
    && !others.some((other) => rectsOverlap(bottomStrip, other))) return 'outside-bottom';
  return 'inside-top';
}

const REGION_LABEL_POSITION = {
  // The tag sits flush against the box outline, detection-tool style: sharing the box's fill
  // color and touching its stroke is what visually binds the label to its region.
  'outside-top': { left: 'calc(-1 * var(--border-thick))', bottom: 'calc(100% + var(--border-thick))', borderRadius: 'var(--radius-xs) var(--radius-xs) 0 0' },
  'outside-bottom': { left: 'calc(-1 * var(--border-thick))', top: 'calc(100% + var(--border-thick))', borderRadius: '0 0 var(--radius-xs) var(--radius-xs)' },
  'inside-top': { left: 0, top: 0, borderRadius: '0 0 var(--radius-xs) 0' },
};

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

function annotationLabel(annotation, fallback) {
  return annotation.label ?? fallback;
}

function pointLabelPosition(point) {
  const x = Math.max(0, Math.min(1, Number(point.x) || 0));
  const y = Math.max(0, Math.min(1, Number(point.y) || 0));
  const horizontal = x > 0.65
    ? { right: 'calc(100% + var(--space-1))' }
    : { left: 'calc(100% + var(--space-1))' };

  if (y < 0.12) return { ...horizontal, top: '100%', marginTop: 'var(--space-1)' };
  if (y > 0.88) return { ...horizontal, bottom: '100%', marginBottom: 'var(--space-1)' };
  return { ...horizontal, top: '50%', transform: 'translateY(-50%)' };
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
  errorMessage = '이미지를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
  summaryLabel = '이미지 주석 요약',
  aspectRatio = '16 / 9',
  objectFit = 'contain',
  labelDisplay = 'auto',
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
  const overlayId = React.useId();
  const detailsId = React.useId();
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
    <figure
      data-label-display={labelDisplay}
      style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', minWidth: 0, margin: 0, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <style>
        {`.lk-annotated-image__point-label {
          display: inline-flex;
        }
        @container (max-width: 420px) {
          .lk-annotated-image__label-text[data-collapse="true"],
          .lk-annotated-image__point-label[data-collapse="true"] {
            display: none;
          }
        }`}
      </style>
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
          containerType: 'inline-size',
        }}
      >
        {src && (
          <img
            src={src}
            alt={alt}
            aria-details={annotations > 0 ? detailsId : undefined}
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
            variant="on-dark"
            pressed={visible}
            onChange={setVisible}
            label="주석 표시"
            title={visible ? '주석 숨기기' : '주석 보기'}
            aria-controls={overlayId}
            style={{ position: 'absolute', zIndex: 2, top: 'var(--space-3)', right: 'var(--space-3)', boxShadow: 'var(--shadow-md)' }}
          >
            <Icon name={visible ? 'eye' : 'eye-slash'} size={16} aria-hidden="true" />
          </ToggleIcon>
        )}

        {imageState === 'loaded' && annotations > 0 && (
          <div
            id={overlayId}
            aria-hidden="true"
            hidden={!visible}
            style={{ position: 'absolute', left: overlayBox.left, top: overlayBox.top, width: overlayBox.width, height: overlayBox.height, pointerEvents: 'none' }}
          >
            {regions.map((region, index) => {
              const color = ANNOTATION_TONE[region.tone] ?? ANNOTATION_TONE.signal;
              const label = annotationLabel(region, `영역 ${index + 1}`);
              const marker = index + 1;
              const placement = regionLabelPlacement(region, index, regions, overlayBox, frameSize.height);
              return (
                <span key={region.id ?? index} style={{ position: 'absolute', left: percent(region.x), top: percent(region.y), width: percent(region.width), height: percent(region.height), boxSizing: 'border-box', border: `var(--border-thick) solid ${color}`, borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ position: 'absolute', ...REGION_LABEL_POSITION[placement], display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', maxWidth: placement === 'inside-top' ? 'min(12.5rem, 100%)' : '12.5rem', padding: 'var(--space-1) var(--space-2)', overflow: 'hidden', boxSizing: 'border-box', background: color, color: toneLabelColor(region.tone ?? 'signal'), fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)' }}>
                    <span style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{marker}</span>
                    <span
                      className="lk-annotated-image__label-text"
                      data-collapse={labelDisplay === 'auto' ? 'true' : undefined}
                      style={{ display: labelDisplay === 'index' ? 'none' : undefined, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {label}{region.score != null ? ` ${Math.round(region.score * 100)}%` : ''}
                    </span>
                  </span>
                </span>
              );
            })}
            {points.map((point, index) => {
              const color = ANNOTATION_TONE[point.tone] ?? ANNOTATION_TONE.cautionary;
              const marker = regions.length + index + 1;
              const pointText = annotationLabel(point, point.value != null ? <>{point.value}{point.unit}</> : `지점 ${index + 1}`);
              return (
                <span key={point.id ?? index} style={{ position: 'absolute', left: percent(point.x), top: percent(point.y), width: percent((point.radius ?? 0.03) * 2), minWidth: 18, aspectRatio: '1', transform: 'translate(-50%, -50%)', display: 'grid', placeItems: 'center', border: `var(--border-thick) solid ${color}`, borderRadius: '50%', background: 'color-mix(in srgb, var(--color-semantic-inverse-background) 82%, transparent)', color: 'var(--color-semantic-inverse-label)', fontSize: 'var(--caption2-size)', lineHeight: 1, fontWeight: 'var(--fw-bold)', fontVariantNumeric: 'tabular-nums' }}>
                  {marker}
                  {labelDisplay !== 'index' && <span className="lk-annotated-image__point-label" data-collapse={labelDisplay === 'auto' ? 'true' : undefined} style={{ position: 'absolute', ...pointLabelPosition(point), alignItems: 'center', maxWidth: '10rem', padding: 'var(--space-1) var(--space-2)', overflow: 'hidden', borderRadius: 'var(--radius-xs)', background: color, color: toneLabelColor(point.tone ?? 'cautionary'), fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-bold)' }}>
                    <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pointText}
                    </span>
                  </span>}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {(caption != null || annotations > 0) && (
        <figcaption style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          {caption != null && <span>{caption}</span>}
          {annotations > 0 && (
            <details id={detailsId} style={{ marginLeft: 'auto' }}>
              <summary style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', cursor: 'pointer' }}>{summaryLabel} ({annotations})</summary>
              <ol style={{ margin: 'var(--space-2) 0 0', paddingLeft: 'var(--space-5)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
                {regions.map((region, index) => <li key={region.id ?? index}>영역 · {annotationLabel(region, `영역 ${index + 1}`)}{region.score != null ? `, 신뢰도 ${Math.round(region.score * 100)}%` : ''}</li>)}
                {points.map((point, index) => <li key={point.id ?? index}>지점 · {annotationLabel(point, `지점 ${index + 1}`)}{point.value != null && <>, {point.value}{point.unit}</>}</li>)}
              </ol>
            </details>
          )}
        </figcaption>
      )}
    </figure>
  );
}
