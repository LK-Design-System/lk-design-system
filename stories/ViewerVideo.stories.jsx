import React from 'react';
import { Button, Icon, VideoStreamTile, ViewerToolbar, ViewerToolbarButton } from '../src/index.js';
import { VideoStreamTileCard as VideoStreamTileCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Viewer/Video Stream',
  component: VideoStreamTile,
  parameters: {
    docs: {
      description: {
        component: '영상 소스를 담는 공통 viewer frame preset입니다. 앱이 video/WebRTC 렌더러와 전송을 소유하고, 컴포넌트는 source·freshness·가용성 상태와 viewport-local 도구를 일관되게 배치합니다.',
      },
    },
  },
};

export default meta;

const monoFont = 'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)';

function FeedPlaceholder({ children }) {
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
      <span style={{ fontFamily: monoFont, fontSize: 11, fontWeight: 'var(--fw-bold)', letterSpacing: 1.2, color: 'var(--component-viewer-muted)' }}>{children}</span>
    </div>
  );
}

function VideoDemo({ state = 'live', label = 'AMR-07 · FRONT', aspectRatio = '16 / 9', metadata = '1080p · 30 FPS', stateAction }) {
  const [muted, setMuted] = React.useState(false);
  const [snapshotCount, setSnapshotCount] = React.useState(0);
  const [fullscreenRequested, setFullscreenRequested] = React.useState(false);

  return (
    <VideoStreamTile
      label={label}
      state={state}
      aspectRatio={aspectRatio}
      metadata={`${snapshotCount > 0 ? `스냅샷 ${snapshotCount}장 · ` : ''}${fullscreenRequested ? '전체 화면 · ' : ''}${metadata}`}
      stateAction={stateAction}
      toolbar={(
        <ViewerToolbar orientation="horizontal" appearance="on-dark" label="영상 도구">
          <ViewerToolbarButton label={muted ? '음소거 해제' : '음소거'} kind="toggle" pressed={muted} onPressedChange={setMuted}>
            <Icon name={muted ? 'volume-x' : 'volume-2'} size={17} />
          </ViewerToolbarButton>
          <ViewerToolbarButton label="스냅샷" onClick={() => setSnapshotCount((value) => value + 1)}>
            <Icon name="camera" size={17} />
          </ViewerToolbarButton>
          <ViewerToolbarButton label={fullscreenRequested ? '전체 화면 종료' : '전체 화면'} onClick={() => setFullscreenRequested((value) => !value)}>
            <Icon name="maximize" size={17} />
          </ViewerToolbarButton>
        </ViewerToolbar>
      )}
    >
      <FeedPlaceholder>{state === 'live' ? 'LIVE · RTSP' : 'LAST FRAME'}</FeedPlaceholder>
    </VideoStreamTile>
  );
}

function RetryFixture() {
  const [state, setState] = React.useState('no-signal');
  return (
    <div style={{ width: '100%', maxWidth: 520 }}>
      <VideoDemo
        state={state}
        label="AMR-07 · FRONT"
        stateAction={<Button data-testid="video-retry" size="sm" onClick={() => setState('live')}>다시 연결</Button>}
      />
    </div>
  );
}

export const VideoStreamOverview = {
  name: '영상 스트림',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 920, minWidth: 0 }}>
      <VideoDemo />
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 'var(--space-3)', minWidth: 0 }}>
        <VideoDemo label="RGB" state="live" />
        <VideoDemo label="IR" state="loading" />
        <VideoDemo label="EO-1" state="disconnected" />
      </section>
    </main>
  ),
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

export const CommonStateContract = {
  name: '영상 상태 계약',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(230px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 1120, minWidth: 0 }}>
      {STREAM_STATES.map((state) => (
        <VideoDemo key={state} label={state.toUpperCase()} state={state} metadata="마지막 수신 8초 전" />
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
  },
};

export const DarkTheme = {
  name: '다크 테마에서도 유지되는 stream',
  parameters: { backgrounds: { default: 'Dark' } },
  render: () => (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <VideoDemo state="stale" />
    </div>
  ),
};

export const NarrowWidth = {
  name: '좁은 영상 타일',
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <VideoDemo label="AMR-07 · LONG FRONT CAMERA SOURCE" state="degraded" />
    </div>
  ),
};

export const RecoveryAction = {
  name: '신호 없음 · 다시 연결',
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
