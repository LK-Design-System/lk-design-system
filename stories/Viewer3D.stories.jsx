import React from 'react';
import { Icon, Scene3DFrame, ViewerToolbar, ViewerToolbarButton } from '../src/index.js';
import { Scene3DFrameCard as Scene3DFrameCardStory } from './ProductEditorAndViz.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Viewer/3D Viewport Frame',
  id: 'lds-product-viewer-3d-scene',
  tags: ['autodocs'],
  component: Scene3DFrame,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-viewer-3d-scene--scene-3-d-overview',
      eyebrow: 'Product / 3D Viewport Frame',
      title: '3D 뷰포트 프레임은 렌더러 출력과 장면 상태·도구의 경계를 정리합니다',
      description:
        '애플리케이션이나 LDS3D가 제공하는 WebGL 장면에 공통 상태·HUD·카메라 도구를 배치할 때 적합합니다. Scene3DFrame은 실제 3D 렌더링·좌표계·피킹을 구현하지 않습니다.',
    },
    docs: {
      description: {
        component: '3D 렌더러를 담는 공통 viewer frame preset입니다. 장면을 우선하고 카메라 도구, 최소 HUD, 가용성·freshness 상태만 프레임에 둡니다.',
      },
    },
  },
};

export default meta;

function RendererSlotPreview({ overlayVisible = true }) {
  return (
    <div
      role="img"
      aria-label="3D 렌더러 슬롯 예시"
      data-renderer-slot=""
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'var(--component-viewer-surface)',
        color: 'var(--component-viewer-muted)',
      }}
    >
      {overlayVisible && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.3,
            backgroundImage:
              'linear-gradient(var(--component-viewer-border) 1px, transparent 1px), linear-gradient(90deg, var(--component-viewer-border) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      )}
      <div style={{ position: 'relative', display: 'grid', gap: 6, justifyItems: 'center', textAlign: 'center' }}>
        <strong style={{ color: 'var(--component-viewer-foreground)', fontSize: 'var(--body2-size)' }}>3D 렌더러 영역</strong>
        <span style={{ fontSize: 'var(--caption1-size)' }}>WebGL 출력은 애플리케이션 또는 LDS3D가 제공합니다.</span>
      </div>
    </div>
  );
}

function SceneDemo({ appearance = 'dark', state = 'ready', stateLabel, stateDescription, height = 420, title = '장면 A', label }) {
  const [overlayVisible, setOverlayVisible] = React.useState(true);
  const [camera, setCamera] = React.useState('원근');

  return (
    <Scene3DFrame
      label={label ?? `${title} 3D 뷰포트`}
      title={title}
      appearance={appearance}
      state={state}
      stateLabel={stateLabel}
      stateDescription={stateDescription}
      status={`${camera} · 좌표계 world · 60 FPS`}
      toolbar={(
        <ViewerToolbar orientation="horizontal" appearance={appearance === 'dark' ? 'on-dark' : 'minimal'} label="3D 카메라 도구">
          <ViewerToolbarButton label="홈 뷰" onClick={() => setCamera('홈')}><Icon name="home" size={16} /></ViewerToolbarButton>
          <ViewerToolbarButton label="카메라 전환" onClick={() => setCamera((value) => value === '원근' ? '상단' : '원근')}><Icon name="camera" size={16} /></ViewerToolbarButton>
          <ViewerToolbarButton label="보조 오버레이 표시" kind="toggle" pressed={overlayVisible} onPressedChange={setOverlayVisible}><Icon name="layers" size={16} /></ViewerToolbarButton>
        </ViewerToolbar>
      )}
      style={{ height }}
    >
      <RendererSlotPreview overlayVisible={overlayVisible} />
    </Scene3DFrame>
  );
}

export const Scene3DOverview = {
  name: '개요',
  parameters: storyDescription(
    '중립적인 renderer 슬롯과 최소 카메라 도구를 함께 보는 기본 3D viewport frame입니다. 상단은 장면 이름과 로컬 도구만 한 줄로 유지하고, 수동 진단 정보는 하단 HUD에 둡니다. 실제 WebGL 장면과 공간 의미는 LDS3D 또는 애플리케이션이 소유합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 840, minWidth: 0 }}>
      <SceneDemo />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-lds-viewer-frame]');
    const identity = frame?.querySelector('[data-viewer-identity]');
    const toolbar = frame?.querySelector('[data-viewer-toolbar]');
    const status = frame?.querySelector('[data-viewer-status]');
    if (!frame || !identity || !toolbar || !status) {
      throw new Error('Scene3DFrame must expose source, camera controls, and renderer status through ViewerFrame.');
    }
    // 배치 규약: 정체성은 좌상단, 뷰포트 조작은 우하단. 상단은 읽는 자리로 비운다.
    const identityRect = identity.getBoundingClientRect();
    const toolbarRect = toolbar.getBoundingClientRect();
    if (identityRect.left >= toolbarRect.left) {
      throw new Error('Scene3DFrame must keep the source identity left of the camera controls.');
    }
    if (toolbarRect.top <= identityRect.bottom) {
      throw new Error('Scene3DFrame must place camera controls at the bottom, not on the identity row.');
    }
  },
};

const STATE_CASES = [
  { state: 'idle', title: 'IDLE' },
  { state: 'no-source', title: 'NO SOURCE' },
  { state: 'loading', title: 'LOADING' },
  { state: 'connecting', title: 'CONNECTING' },
  { state: 'ready', title: 'READY' },
  { state: 'live', title: 'LIVE' },
  { state: 'degraded', title: 'DEGRADED' },
  { state: 'stale', title: 'STALE' },
  { state: 'frozen', title: 'FROZEN' },
  { state: 'paused', title: 'PAUSED' },
  { state: 'unavailable', title: 'UNAVAILABLE' },
  { state: 'disconnected', title: 'DISCONNECTED' },
  { state: 'no-signal', title: 'NO SIGNAL' },
  { state: 'error', title: 'ERROR' },
];

export const CommonStateContract = {
  name: '3D 상태 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    '연결 준비부터 live·stale·오류까지 3D 소스의 공통 상태를 전부 비교합니다. 차단 상태에서는 장면과 도구가 inert 처리되고 사용 가능한 상태에서는 콘텐츠 맥락이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 1120, minWidth: 0 }}>
      {STATE_CASES.map(({ state, title }) => (
        <SceneDemo key={state} state={state} title={title} height={220} />
      ))}
    </main>
  ),
  play: async ({ canvasElement }) => {
    const blockingStates = new Set(['idle', 'no-source', 'loading', 'connecting', 'unavailable', 'disconnected', 'no-signal', 'error']);
    const frames = Array.from(canvasElement.querySelectorAll('[data-lds-viewer-frame]'));
    for (const frame of frames) {
      const isBlocking = blockingStates.has(frame.dataset.viewerState);
      const content = frame.querySelector('[data-viewer-content]');
      const toolbar = frame.querySelector('[data-viewer-toolbar]');
      if (isBlocking && (!content?.hasAttribute('inert') || content.getAttribute('aria-hidden') !== 'true')) {
        throw new Error(`${frame.dataset.viewerState}: blocking content must be inert and aria-hidden`);
      }
      if (isBlocking && toolbar && (!toolbar.hasAttribute('inert') || toolbar.getAttribute('aria-hidden') !== 'true')) {
        throw new Error(`${frame.dataset.viewerState}: blocking toolbar must be inert and aria-hidden`);
      }
      if (!isBlocking && frame.querySelector('[data-viewer-blocking-state]')) {
        throw new Error(`${frame.dataset.viewerState}: usable content must not have a blocking overlay`);
      }
    }
  },
};

export const AppearanceVariants = {
  name: '변형·상태 · 밝은·어두운 외형',
  parameters: storyDescription(
    '동일한 renderer 슬롯을 dark와 light appearance에서 비교합니다. 도구·상태 문구·placeholder의 대비와 정보 위계가 두 배경에서 동등한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 960 }}>
      <section aria-labelledby="scene-dark-label" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong id="scene-dark-label" style={{ fontSize: 'var(--body2-size)' }}>Dark · 기본값</strong>
        <SceneDemo appearance="dark" state="ready" height={320} label="Dark 3D 뷰포트" />
      </section>
      <section aria-labelledby="scene-light-label" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong id="scene-light-label" style={{ fontSize: 'var(--body2-size)' }}>Light</strong>
        <SceneDemo appearance="light" state="ready" height={320} label="Light 3D 뷰포트" />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const appearances = Array.from(canvasElement.querySelectorAll('[data-lds-viewer-frame]'))
      .map((frame) => frame.dataset.viewerAppearance);
    if (appearances.join(',') !== 'dark,light') {
      throw new Error(`Scene3DFrame must expose equivalent dark/light appearances: ${appearances.join(',')}`);
    }
  },
};

export const NarrowWidth = {
  name: '반응형 · 좁은 3D 화면',
  parameters: storyDescription(
    '320px 폭에서 긴 소스 이름과 stale 상태를 함께 표시하는 상황입니다. 상태 정보와 장면이 겹치지 않고 긴 제목이 도구를 밀어내거나 가로 overflow를 만들지 않는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <SceneDemo state="stale" height={300} title="매우 긴 공간 장면 소스 이름" />
    </div>
  ),
};

export const Scene3DFrameCard = { ...Scene3DFrameCardStory, name: 'Scene3DFrame card parity', tags: ['!dev', 'visual-parity'] };
