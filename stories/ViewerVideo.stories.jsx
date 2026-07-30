import React from 'react';
import { Button, Icon, Slider, VideoStreamTile, ViewerToolbar, ViewerToolbarButton } from '../src/index.js';
import { VideoStreamTileCard as VideoStreamTileCardStory } from './ProductEditorAndViz.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';
import warehouseVideoFrame from './fixtures/video-stream-warehouse-frame.png';

const meta = {
  title: 'LDS Product/Viewer/Video Stream',
  tags: ['autodocs'],
  component: VideoStreamTile,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-viewer-video-stream--video-stream-overview',
      eyebrow: 'Product / Video Stream',
      title: '영상 스트림은 실시간 피드와 신호 상태·복구 동작을 함께 보여줍니다',
      description:
        '운영자가 카메라 영상을 보면서 연결 상태와 뷰포트 도구를 즉시 판단해야 할 때 적합합니다. 정지 이미지나 공간 경로를 탐색하는 화면에는 Video Stream 대신 Image 또는 2D Map을 사용하세요.',
    },
    docs: {
      description: {
        component: '영상 소스를 담는 공통 viewer frame preset입니다. 앱이 video/WebRTC 렌더러와 전송을 소유하고, 컴포넌트는 source·freshness·가용성 상태와 viewport-local 도구를 일관되게 배치합니다.',
      },
    },
  },
};

export default meta;

function FeedPlaceholder({ children, imageSrc, imageAlt }) {
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={imageAlt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'repeating-linear-gradient(135deg, var(--component-viewer-surface) 0 10px, var(--component-viewer-surface-elevated) 10px 20px)',
      }}
    >
      {/* 한글 산문에는 mono와 양수 자간을 쓰지 않는다. 모노스페이스는 한글 글리프가
          없어 음절마다 등폭 어드밴스를 받아 자간이 벌어져 보이고, 1.2px 트래킹은
          대문자 라틴 오버라인용 장치다. 기술적인 인상은 크기·굵기·색으로 낸다. */}
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 'var(--fw-bold)', color: 'var(--component-viewer-muted)' }}>{children}</span>
    </div>
  );
}

function useVideoVolumeStyles() {
  React.useEffect(() => {
    const documentRef = globalThis.document;
    if (!documentRef || documentRef.getElementById('lk-video-volume-control-css')) return;
    const styleElement = documentRef.createElement('style');
    styleElement.id = 'lk-video-volume-control-css';
    styleElement.textContent = `
/* 접힌 폭은 안에 든 아이콘 버튼(28px)과 같아야 한다. 32px이면 접힌 상태에서
   볼륨 오른쪽에만 4px이 남아 아이콘 중심 간격이 34/30으로 어긋난다. */
.lk-video-volume{display:flex;align-items:center;width:28px;height:28px;overflow:hidden;transition:width 160ms ease}
.lk-video-volume[data-expanded="true"]{width:132px;overflow:visible}
.lk-video-volume__rail{position:relative;display:flex;align-items:center;width:0;min-width:0;opacity:0;visibility:hidden;pointer-events:none;transition:width 160ms ease,opacity 120ms ease;padding-right:0}
.lk-video-volume[data-expanded="true"] .lk-video-volume__rail{width:104px;opacity:1;visibility:visible;pointer-events:auto;padding-right:8px}
.lk-video-volume__slider{width:92px;min-width:92px}
input.lk-slider.lk-video-volume__range{width:92px!important;height:4px!important;min-width:0!important;background:linear-gradient(to right,var(--color-semantic-primary-normal) 0%,var(--color-semantic-primary-normal) var(--video-volume-percent),color-mix(in srgb,var(--component-viewer-foreground) 24%,transparent) var(--video-volume-percent),color-mix(in srgb,var(--component-viewer-foreground) 24%,transparent) 100%)!important}
input.lk-slider.lk-video-volume__range::-webkit-slider-thumb{width:12px;height:12px;border:2px solid var(--component-viewer-surface-elevated);background:var(--component-viewer-foreground);box-shadow:none}
input.lk-slider.lk-video-volume__range::-moz-range-thumb{width:10px;height:10px;border:2px solid var(--component-viewer-surface-elevated);background:var(--component-viewer-foreground);box-shadow:none}
@media (prefers-reduced-motion:reduce){.lk-video-volume,.lk-video-volume__rail{transition:none}}
`;
    documentRef.head.appendChild(styleElement);
  }, []);
}

function VideoVolumeControl({ label, volume, onVolumeChange }) {
  useVideoVolumeStyles();
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const controlRef = React.useRef(null);
  const previousVolumeRef = React.useRef(volume > 0 ? volume : 72);
  const expanded = hovered || focused;

  React.useEffect(() => {
    if (volume > 0) previousVolumeRef.current = volume;
  }, [volume]);

  const toggleMuted = () => {
    onVolumeChange(volume === 0 ? previousVolumeRef.current : 0);
  };

  const focusSlider = () => {
    const slider = controlRef.current?.querySelector('input[type="range"]');
    slider?.focus();
    if (globalThis.document?.activeElement !== slider) {
      globalThis.requestAnimationFrame?.(() => slider?.focus());
    }
  };

  const handleButtonKeyDown = (event) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    event.stopPropagation();
    setFocused(true);
    focusSlider();
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    controlRef.current?.querySelector('button')?.focus();
  };

  return (
    <div
      ref={controlRef}
      className="lk-video-volume"
      data-expanded={expanded ? 'true' : 'false'}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setFocused(false);
      }}
      onKeyDown={handleKeyDown}
    >
      <ViewerToolbarButton
        label={volume === 0 ? '볼륨 음소거됨' : `볼륨 ${volume}%`}
        data-lk-toolbar-key="volume"
        aria-expanded={expanded}
        onClick={toggleMuted}
        onKeyDown={handleButtonKeyDown}
      >
        <Icon name={volume === 0 ? 'volume-x' : 'volume-2'} size={17} />
      </ViewerToolbarButton>
      <div className="lk-video-volume__rail" aria-hidden={!expanded}>
        <Slider
          value={volume}
          min={0}
          max={100}
          step={1}
          onChange={onVolumeChange}
          aria-label={`${label} 볼륨`}
          aria-valuetext={`${volume}%`}
          aria-hidden={!expanded}
          tabIndex={-1}
          className="lk-slider lk-video-volume__range"
          style={{ width: 92, minWidth: 92, '--video-volume-percent': `${volume}%` }}
        />
      </div>
    </div>
  );
}

function VideoDemo({
  state = 'live',
  label = '주 영상',
  aspectRatio = '16 / 9',
  metadata = null,
  stateAction,
  frameSrc,
  frameAlt,
}) {
  const [volume, setVolume] = React.useState(72);
  const [snapshotCount, setSnapshotCount] = React.useState(0);
  const [fullscreenRequested, setFullscreenRequested] = React.useState(false);
  const resolvedMetadata = metadata == null
    ? null
    : `${snapshotCount > 0 ? `스냅샷 ${snapshotCount}장 · ` : ''}${fullscreenRequested ? '전체 화면 · ' : ''}${metadata}`;

  return (
    <VideoStreamTile
      label={label}
      state={state}
      aspectRatio={aspectRatio}
      metadata={resolvedMetadata}
      stateAction={stateAction}
      toolbar={(
        <ViewerToolbar orientation="horizontal" appearance="on-dark" label="영상 도구">
          <VideoVolumeControl label={label} volume={volume} onVolumeChange={setVolume} />
          <ViewerToolbarButton label="스냅샷" onClick={() => setSnapshotCount((value) => value + 1)}>
            <Icon name="camera" size={17} />
          </ViewerToolbarButton>
          <ViewerToolbarButton label={fullscreenRequested ? '전체 화면 종료' : '전체 화면'} onClick={() => setFullscreenRequested((value) => !value)}>
            <Icon name="maximize" size={17} />
          </ViewerToolbarButton>
        </ViewerToolbar>
      )}
    >
      <FeedPlaceholder imageSrc={frameSrc} imageAlt={frameAlt}>
        {state === 'live' ? '영상 렌더러 영역' : '마지막 프레임'}
      </FeedPlaceholder>
    </VideoStreamTile>
  );
}

function RetryFixture() {
  const [state, setState] = React.useState('no-signal');
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <VideoDemo
        state={state}
        label="주 영상"
        stateAction={<Button data-testid="video-retry" size="sm" onClick={() => setState('live')}>다시 연결</Button>}
      />
    </div>
  );
}

export const VideoStreamOverview = {
  name: '개요',
  parameters: storyDescription(
    '주 영상과 세 개의 보조 영상 슬롯을 live·loading·disconnected 상태로 함께 보는 운영 상황입니다. 정상 타일은 소스와 LIVE만 상시 표시하고 로컬 도구는 hover·focus 때 나타나 영상 판단을 방해하지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 920, minWidth: 0 }}>
      <VideoDemo
        frameSrc={warehouseVideoFrame}
        frameAlt="자동화 창고 통로를 주행하는 AMR의 운영 카메라 예시 프레임"
      />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 'var(--space-3)', minWidth: 0 }}>
        <VideoDemo label="보조 영상 A" state="live" />
        <VideoDemo label="보조 영상 B" state="loading" />
        <VideoDemo label="보조 영상 C" state="disconnected" />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const liveFrame = canvasElement.querySelector('[data-viewer-state="live"]');
    const identity = liveFrame?.querySelector('[data-viewer-identity]');
    const toolbar = liveFrame?.querySelector('[data-viewer-toolbar]');
    const status = liveFrame?.querySelector('[data-viewer-status]');
    if (!liveFrame || !identity || !toolbar) {
      throw new Error('VideoStreamTile must expose source and media controls through ViewerFrame.');
    }
    if (status) {
      throw new Error('Healthy video tiles must not expose passive resolution or FPS metadata by default.');
    }
    if (liveFrame.dataset.viewerChrome !== 'overlay' || liveFrame.dataset.viewerToolbarVisibility !== 'interaction') {
      throw new Error('VideoStreamTile must use compact overlay chrome and interaction-revealed controls.');
    }
    // 배치 규약: 좌상단 정체성 · 우상단 라이브 · 우하단 재생 도구.
    const identityRect = identity.getBoundingClientRect();
    const toolbarRect = toolbar.getBoundingClientRect();
    if (identityRect.left >= toolbarRect.left) {
      throw new Error('VideoStreamTile must keep the source identity left of the media controls.');
    }
    if (toolbarRect.top <= identityRect.bottom) {
      throw new Error('VideoStreamTile must place media controls at the bottom, not on the identity row.');
    }
    const liveness = liveFrame.querySelector('[data-viewer-liveness]');
    if (!liveness) {
      throw new Error('A live tile must expose the top-right liveness slot.');
    }
    if (liveness.getBoundingClientRect().left <= identityRect.right) {
      throw new Error('Liveness must sit opposite the source identity, not beside it.');
    }
    const command = toolbar.querySelector('button:not([aria-pressed])');
    const commandStyle = command && canvasElement.ownerDocument.defaultView.getComputedStyle(command);
    const shelfStyle = canvasElement.ownerDocument.defaultView.getComputedStyle(toolbar);
    if (!commandStyle || !['transparent', 'rgba(0, 0, 0, 0)'].includes(commandStyle.backgroundColor)) {
      throw new Error('Viewer toolbar commands must stay transparent until interaction.');
    }
    if (shelfStyle.boxShadow !== 'none') {
      throw new Error('Viewer control shelf must remain a single flat layer without shadow.');
    }
    const volumeControl = liveFrame.querySelector('.lk-video-volume');
    const volumeTrigger = volumeControl?.querySelector('button[data-lk-toolbar-key="volume"]');
    const volumeSlider = volumeControl?.querySelector('input[type="range"]');
    if (!volumeTrigger || !volumeTrigger.getAttribute('aria-label')?.includes('72%')) {
      throw new Error('Video volume trigger must expose its current value.');
    }
    if (!volumeControl || !volumeSlider || volumeControl.dataset.expanded !== 'false' || volumeSlider.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Video volume rail must remain compact until pointer or keyboard interaction.');
    }
    volumeTrigger.focus();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (liveFrame.dataset.viewerToolbarVisible !== 'true') {
      throw new Error('Focusing a video control must reveal the local toolbar.');
    }
    if (volumeControl.dataset.expanded !== 'true' || volumeSlider.getAttribute('aria-hidden') !== 'false') {
      throw new Error('Video volume rail must expand within the toolbar on focus.');
    }
    volumeTrigger.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (!volumeTrigger.getAttribute('aria-label')?.includes('음소거됨')) {
      throw new Error('The volume button must toggle mute and expose the muted state.');
    }
    volumeTrigger.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (!volumeTrigger.getAttribute('aria-label')?.includes('72%')) {
      throw new Error('Unmuting must restore the previous non-zero volume.');
    }
    const valueSetter = Object.getOwnPropertyDescriptor(
      canvasElement.ownerDocument.defaultView.HTMLInputElement.prototype,
      'value',
    )?.set;
    valueSetter?.call(volumeSlider, '35');
    volumeSlider.dispatchEvent(new Event('input', { bubbles: true }));
    volumeSlider.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (!volumeTrigger.getAttribute('aria-label')?.includes('35%')) {
      throw new Error('The inline volume rail must update the trigger value.');
    }
    valueSetter?.call(volumeSlider, '72');
    volumeSlider.dispatchEvent(new Event('input', { bubbles: true }));
    volumeSlider.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 30));
    volumeTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (canvasElement.ownerDocument.activeElement !== volumeSlider) {
      throw new Error('ArrowDown from the volume button must move focus to the slider.');
    }
    volumeSlider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 30));
    volumeTrigger.blur();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (volumeControl.dataset.expanded !== 'false') {
      throw new Error('The volume rail must collapse after keyboard focus leaves the control.');
    }
    if (liveFrame.dataset.viewerToolbarVisible !== 'false') {
      throw new Error('The local toolbar must hide again after pointer and focus leave the video tile.');
    }
  },
};

const STREAM_STATES = [
  'idle',
  'no-source',
  'loading',
  'connecting',
  'ready',
  'live',
  'degraded',
  'stale',
  'frozen',
  'paused',
  'unavailable',
  'disconnected',
  'no-signal',
  'error',
];

const RETAINED_FRAME_STATES = new Set(['degraded', 'stale', 'frozen', 'paused']);
const STREAM_STATE_METADATA = {
  stale: '8초 전',
  frozen: '8초 전',
};

export const CommonStateContract = {
  name: '영상 상태 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    'idle부터 live·stale·no-signal·error까지 영상 소스의 공통 상태를 전부 비교합니다. 차단 상태에서는 도구와 콘텐츠가 입력에서 제외되고 유지 상태에서는 마지막 영상 맥락이 계속 노출되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(230px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 1120, minWidth: 0 }}>
      {STREAM_STATES.map((state) => (
        <VideoDemo
          key={state}
          label={state.toUpperCase()}
          state={state}
          metadata={STREAM_STATE_METADATA[state] ?? null}
          frameSrc={RETAINED_FRAME_STATES.has(state) ? warehouseVideoFrame : undefined}
          frameAlt={RETAINED_FRAME_STATES.has(state) ? `${state} 상태에서 유지 중인 자동화 창고 AMR 카메라 프레임` : undefined}
        />
      ))}
    </main>
  ),
  play: async ({ canvasElement }) => {
    const blockingStates = new Set(['idle', 'no-source', 'loading', 'connecting', 'unavailable', 'disconnected', 'no-signal', 'error']);
    for (const frame of canvasElement.querySelectorAll('[data-lds-viewer-frame]')) {
      const isBlocking = blockingStates.has(frame.dataset.viewerState);
      const toolbar = frame.querySelector('[data-viewer-toolbar]');
      if (isBlocking && toolbar && !toolbar.hasAttribute('inert')) {
        throw new Error(`${frame.dataset.viewerState}: hidden video toolbar must be inert`);
      }
      if (!isBlocking && !frame.querySelector('[data-viewer-content]:not([aria-hidden="true"])')) {
        throw new Error(`${frame.dataset.viewerState}: retained content must remain exposed`);
      }
    }
    const staleFrame = canvasElement.querySelector('[data-viewer-state="stale"]');
    const staleEdgeState = staleFrame?.querySelector('[data-viewer-edge-state]');
    if (!staleEdgeState?.textContent?.includes('데이터 지연') || !staleEdgeState.textContent.includes('8초 전')) {
      throw new Error('A stale video tile must group delayed truth and last-received time in one edge surface.');
    }
    if (staleFrame.querySelector('[data-viewer-status]')) {
      throw new Error('Delayed metadata must not be duplicated as normal video metadata.');
    }
    for (const state of ['degraded', 'paused']) {
      const frame = canvasElement.querySelector(`[data-viewer-state="${state}"]`);
      if (frame?.querySelector('[data-viewer-edge-metadata]')) {
        throw new Error(`${state}: last-received metadata must not be implied by this state.`);
      }
    }
    const expectedOpacity = {
      degraded: '0.9',
      stale: '0.76',
      frozen: '0.76',
      paused: '1',
    };
    for (const [state, opacity] of Object.entries(expectedOpacity)) {
      const content = canvasElement
        .querySelector(`[data-viewer-state="${state}"]`)
        ?.querySelector('[data-viewer-content]');
      if (!content || getComputedStyle(content).opacity !== opacity) {
        throw new Error(`${state}: retained frame opacity must be ${opacity}.`);
      }
    }
    for (const state of ['idle', 'loading', 'disconnected', 'no-signal', 'error']) {
      const iconSurface = canvasElement
        .querySelector(`[data-viewer-state="${state}"]`)
        ?.querySelector('[data-viewer-blocking-icon]');
      const iconStyles = iconSurface ? getComputedStyle(iconSurface) : null;
      if (!iconStyles || iconStyles.borderTopStyle !== 'none' || iconStyles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        throw new Error(`${state}: blocking glyph must not look like a circular action button.`);
      }
    }
    const disconnectedIcon = canvasElement
      .querySelector('[data-viewer-state="disconnected"] [data-viewer-state-icon]')
      ?.getAttribute('data-viewer-state-icon');
    const noSignalIcon = canvasElement
      .querySelector('[data-viewer-state="no-signal"] [data-viewer-state-icon]')
      ?.getAttribute('data-viewer-state-icon');
    if (disconnectedIcon !== 'circle-close' || noSignalIcon !== 'signal') {
      throw new Error('Disconnected and no-signal must use distinct, state-specific glyphs.');
    }
  },
};

export const DarkTheme = {
  name: '변형·상태 · 실사 프레임',
  parameters: {
    ...storyDescription(
      '실제 운영 카메라에 가까운 밝고 어두운 장면 위에서 정상 live 스트림을 표시합니다. 소스와 LIVE만 상시 남고 영상 도구는 hover·focus 때 나타나는지 확인하세요.',
    ),
    backgrounds: { default: 'Dark' },
  },
  render: () => (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <VideoDemo
        state="live"
        frameSrc={warehouseVideoFrame}
        frameAlt="자동화 창고 통로를 주행하는 AMR의 운영 카메라 예시 프레임"
      />
    </div>
  ),
};

export const NarrowWidth = {
  name: '반응형 · 좁은 폭',
  parameters: storyDescription(
    '320px 폭에서 긴 카메라 소스 이름과 degraded 상태를 표시합니다. 소스 정체와 상태가 줄임 뒤에도 구분되고 영상 비율과 로컬 도구가 가로 overflow 없이 유지되는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <VideoDemo label="매우 긴 원격 영상 소스 이름" state="degraded" />
    </div>
  ),
};

export const RecoveryAction = {
  name: '변형·상태 · 신호 없음 · 다시 연결',
  parameters: storyDescription(
    '카메라 신호가 끊긴 뒤 운영자가 다시 연결을 요청하는 복구 상황입니다. no-signal 상태와 복구 동작이 중앙에서 분명히 보이고 성공 후 차단 상태가 사라져 live 콘텐츠로 돌아오는지 확인하세요.',
  ),
  render: () => <RetryFixture />,
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-lds-viewer-frame]');
    const retry = canvasElement.querySelector('[data-testid="video-retry"]');
    if (frame?.dataset.viewerState !== 'no-signal' || !retry) {
      throw new Error('No-signal recovery state is not exposed.');
    }
    retry.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (frame.dataset.viewerState !== 'live' || frame.querySelector('[data-viewer-blocking-state]')) {
      throw new Error('Retry action did not restore the live stream state.');
    }
  },
};

export const VideoStreamTileCard = { ...VideoStreamTileCardStory, name: 'VideoStreamTile card parity', tags: ['!dev', 'visual-parity'] };
