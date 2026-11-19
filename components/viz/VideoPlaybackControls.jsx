import React from 'react';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { IconButton } from '@lk-design-system/lds-core/components/buttons/IconButton';
import { Slider } from '@lk-design-system/lds-core/components/forms/Slider';
import { Spinner } from '@lk-design-system/lds-core/components/status/Spinner';
import { VIEWER_OVERLAY_SURFACE } from './_viewerOverlaySurface.js';

const useClientLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function timeText(value) {
  if (!Number.isFinite(value) || value < 0) return '—';
  const seconds = Math.floor(value);
  const hours = Math.floor(seconds / 3600);
  return `${hours ? `${hours}:` : ''}${String(Math.floor(seconds / 60) % 60).padStart(hours ? 2 : 1, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

function spokenTime(value) {
  if (!Number.isFinite(value) || value < 0) return '시간 미확인';
  const seconds = Math.floor(value);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds / 60) % 60;
  return `${hours ? `${hours}시간 ` : ''}${minutes ? `${minutes}분 ` : ''}${seconds % 60}초`;
}

const SURFACES = {
  minimal: { background: 'transparent', border: 'none', borderRadius: 0 },
  surface: {
    background: 'var(--color-semantic-background-elevated-normal)',
    border: 'var(--border-thin) solid var(--color-semantic-line-solid-normal)',
    borderRadius: 'var(--radius-md)',
  },
  'on-dark': {
    background: VIEWER_OVERLAY_SURFACE.strong.surface,
    border: VIEWER_OVERLAY_SURFACE.strong.border,
    borderRadius: 'var(--radius-md)',
    backdropFilter: VIEWER_OVERLAY_SURFACE.strong.blur,
  },
};

/** Controlled playback presentation. The consumer owns the media element. */
export function VideoPlaybackControls({
  currentTime = 0,
  duration,
  playing = false,
  muted = false,
  fullscreen = false,
  loading = false,
  disabled = false,
  seekDisabled = false,
  onPlayingChange,
  onSeek,
  onMutedChange,
  onFullscreenChange,
  appearance = 'on-dark',
  variant = 'standalone',
  label = '영상 재생 조작',
  style,
  className,
  ...rootProps
}) {
  const [preview, setPreview] = React.useState(null);
  const [compactClock, setCompactClock] = React.useState(false);
  const rootRef = React.useRef(null);
  const drag = React.useRef(null);
  const callbacks = React.useRef({ onSeek, disabled, seekDisabled, duration });
  callbacks.current = { onSeek, disabled, seekDisabled, duration };
  const hasDuration = Number.isFinite(duration) && duration > 0;
  const canSeek = hasDuration && !disabled && !seekDisabled && typeof onSeek === 'function';
  const elapsed = Math.max(0, Number.isFinite(currentTime) ? currentTime : 0);
  const position = hasDuration ? Math.min(duration, elapsed) : elapsed;
  const shownTime = preview ?? position;
  const resolvedAppearance = SURFACES[appearance] ? appearance : 'on-dark';
  const onDark = resolvedAppearance === 'on-dark';
  const commandStyle = { flex: '0 0 auto', width: 28, height: 28, padding: 0 };

  useClientLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const update = () => setCompactClock(node.getBoundingClientRect().width < 380);
    update();
    const Observer = node.ownerDocument.defaultView?.ResizeObserver;
    const observer = Observer ? new Observer(update) : null;
    observer?.observe(node);
    return () => observer?.disconnect();
  }, []);

  React.useEffect(() => {
    const finish = (event) => {
      const active = drag.current;
      if (!active || event.pointerId !== active.pointerId) return;
      drag.current = null;
      setPreview(null);
      const state = callbacks.current;
      if (!state.disabled && !state.seekDisabled && Number.isFinite(state.duration) && state.duration > 0) {
        state.onSeek?.(Math.max(0, Math.min(state.duration, active.value)));
      }
    };
    const cancel = (event) => {
      if (event.type === 'pointercancel' && event.pointerId !== drag.current?.pointerId) return;
      drag.current = null; setPreview(null);
    };
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('blur', cancel);
    return () => {
      drag.current = null;
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('blur', cancel);
    };
  }, []);
  React.useEffect(() => {
    if (!canSeek) { drag.current = null; setPreview(null); }
  }, [canSeek]);

  return (
    <div
      {...rootProps}
      ref={rootRef}
      role="group"
      aria-label={label}
      aria-busy={loading || undefined}
      data-theme={onDark ? 'dark' : rootProps['data-theme']}
      data-video-playback-appearance={resolvedAppearance}
      data-video-playback-variant={variant}
      className={['lk-video-playback-controls', className].filter(Boolean).join(' ')}
      style={{
        width: '100%', minWidth: 0, boxSizing: 'border-box',
        display: 'grid', gridTemplateColumns: '28px minmax(0, 1fr) auto auto auto',
        alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-1)',
        color: onDark ? VIEWER_OVERLAY_SURFACE.strong.ink : 'var(--color-semantic-label-normal)',
        '--viewer-foreground': onDark ? VIEWER_OVERLAY_SURFACE.strong.ink : 'var(--color-semantic-label-normal)',
        ...SURFACES[resolvedAppearance],
        ...(variant === 'embedded' ? { border: 0, borderRadius: 0, boxShadow: 'none' } : null),
        ...style,
      }}
    >
      <IconButton
        variant="plain" size={28} round={false}
        label={playing ? '영상 일시 정지' : '영상 재생'} disabled={disabled || !onPlayingChange}
        onClick={() => onPlayingChange?.(!playing)} style={commandStyle}
      >
        {loading ? <Spinner size={16} color="currentColor" aria-hidden="true" /> : <Icon name={playing ? 'pause' : 'play'} size={16} />}
      </IconButton>
      <Slider
        aria-label="영상 재생 위치"
        aria-valuetext={hasDuration ? `${spokenTime(shownTime)}, 전체 ${spokenTime(duration)}` : `현재 ${spokenTime(shownTime)}, 전체 시간 미확인, 탐색 불가`}
        min={0} max={hasDuration ? duration : 1} step={0.1}
        value={hasDuration ? shownTime : 0} disabled={!canSeek}
        style={{ width: '100%', minWidth: 0, paddingBlock: 'var(--space-2)' }}
        onPointerDown={(event) => { if (canSeek && event.isPrimary && event.button === 0) drag.current = { pointerId: event.pointerId, value: position }; }}
        onLostPointerCapture={() => { drag.current = null; setPreview(null); }}
        onBlur={() => { drag.current = null; setPreview(null); }}
        onChange={(value) => {
          if (!canSeek) return;
          const next = Math.max(0, Math.min(duration, value));
          if (drag.current != null) { drag.current.value = next; setPreview(next); }
          else onSeek(next);
        }}
      />
        <span data-video-playback-time="" aria-hidden="true" title={`${timeText(shownTime)} / ${timeText(hasDuration ? duration : null)}`} style={{
          minWidth: 0, maxWidth: '100%', whiteSpace: 'nowrap',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)',
          fontVariantNumeric: 'tabular-nums',
        }}>{timeText(shownTime)}{!compactClock && <> / {timeText(hasDuration ? duration : null)}</>}</span>
        {onMutedChange && <IconButton
          variant="plain" size={28} round={false}
          label={muted ? '음소거 해제' : '음소거'} disabled={disabled}
          onClick={() => onMutedChange(!muted)} style={commandStyle}
        ><Icon name={muted ? 'volume-x' : 'volume-2'} size={16} /></IconButton>}
        {onFullscreenChange && <IconButton
          variant="plain" size={28} round={false}
          label={fullscreen ? '전체 화면 종료' : '전체 화면'} disabled={disabled}
          onClick={() => onFullscreenChange(!fullscreen)} style={commandStyle}
        ><Icon name="maximize" size={16} /></IconButton>}
    </div>
  );
}
