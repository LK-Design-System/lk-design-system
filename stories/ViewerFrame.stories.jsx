import React from 'react';
import { Button, Icon, ViewerFrame, ViewerToolbar, ViewerToolbarButton } from '../src/index.js';

const meta = {
  title: 'LDS Robotics/Viewer/Frame',
  component: ViewerFrame,
  parameters: {
    docs: {
      description: {
        component: 'Map·3D·Video가 공유하는 LK Robotics viewport frame입니다. 콘텐츠 가용성에 따라 중앙 blocking state와 콘텐츠를 유지하는 edge state를 구분합니다.',
      },
    },
  },
};

export default meta;

function Preview({ appearance = 'dark' }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        color: 'var(--viewer-muted)',
        background: appearance === 'dark'
          ? 'radial-gradient(circle at 50% 30%, var(--viewer-surface-elevated), var(--viewer-surface))'
          : 'linear-gradient(var(--viewer-border) 1px, transparent 1px), linear-gradient(90deg, var(--viewer-border) 1px, transparent 1px)',
        backgroundSize: appearance === 'dark' ? undefined : '24px 24px',
        fontSize: 'var(--caption1-size)',
        fontWeight: 'var(--fw-semibold)',
      }}
    >
      renderer slot
    </div>
  );
}

function LocalToolbar({ appearance }) {
  const [zoom, setZoom] = React.useState(100);
  return (
    <ViewerToolbar orientation="horizontal" appearance={appearance === 'dark' ? 'on-dark' : 'surface'} label="보기 도구">
      <ViewerToolbarButton label="확대" onClick={() => setZoom((value) => Math.min(200, value + 10))}><Icon name="plus" size={16} /></ViewerToolbarButton>
      <ViewerToolbarButton label="축소" onClick={() => setZoom((value) => Math.max(50, value - 10))}><Icon name="minus" size={16} /></ViewerToolbarButton>
      <ViewerToolbarButton label="보기 초기화" onClick={() => setZoom(100)}><Icon name="reset" size={16} /></ViewerToolbarButton>
      <output aria-live="polite" style={{ color: 'var(--viewer-muted)', fontSize: 11, fontVariantNumeric: 'tabular-nums' }}>{zoom}%</output>
    </ViewerToolbar>
  );
}

function BlockingFocusFixture() {
  const [state, setState] = React.useState('ready');
  const [aligned, setAligned] = React.useState(false);
  return (
    <ViewerFrame
      label="포커스 전환 검증 뷰포트"
      source="AMR-07"
      state={state}
      stateAction={<Button data-testid="viewer-retry" size="sm" onClick={() => setState('ready')}>다시 시도</Button>}
      toolbar={(
        <ViewerToolbar orientation="horizontal" appearance="on-dark" label="프레임 동작">
          <ViewerToolbarButton label="중앙 정렬" kind="toggle" pressed={aligned} onPressedChange={setAligned}>
            <Icon name="crosshair" size={16} />
          </ViewerToolbarButton>
          <ViewerToolbarButton data-testid="viewer-load" label="소스 다시 불러오기" onClick={() => setState('loading')}>
            <Icon name="refresh" size={16} />
          </ViewerToolbarButton>
        </ViewerToolbar>
      )}
      style={{ height: 240 }}
    >
      <Preview />
    </ViewerFrame>
  );
}

export const StatePlacement = {
  name: 'Blocking · Edge · Ready',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 960 }}>
      <ViewerFrame label="준비된 뷰포트" source="AMR-07" state="ready" status="38 FPS" toolbar={<LocalToolbar appearance="dark" />} style={{ height: 240 }}>
        <Preview />
      </ViewerFrame>
      <ViewerFrame label="지연된 뷰포트" source="AMR-07" state="stale" status="마지막 수신 8초 전" toolbar={<LocalToolbar appearance="dark" />} style={{ height: 240 }}>
        <Preview />
      </ViewerFrame>
      <ViewerFrame label="불러오는 뷰포트" source="AMR-07" state="loading" toolbar={<LocalToolbar appearance="dark" />} style={{ height: 240 }}>
        <Preview />
      </ViewerFrame>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const frames = Array.from(canvasElement.querySelectorAll('[data-lds-viewer-frame]'));
    const loading = frames.find((frame) => frame.dataset.viewerState === 'loading');
    const stale = frames.find((frame) => frame.dataset.viewerState === 'stale');
    if (!loading?.querySelector('[data-viewer-content][inert][aria-hidden="true"]')) {
      throw new Error('Loading must block and hide renderer content.');
    }
    if (!loading?.querySelector('[data-viewer-blocking-state]')) {
      throw new Error('Loading must use the central blocking state.');
    }
    if (!stale?.querySelector('[data-viewer-edge-state]') || stale.querySelector('[data-viewer-blocking-state]')) {
      throw new Error('Stale must preserve content and use the edge state.');
    }
  },
};

export const LightMapFrame = {
  name: 'Light map appearance',
  render: () => (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <ViewerFrame
        appearance="light"
        label="2D 지도 뷰포트"
        source="floor_1.pgm"
        status="125%"
        toolbar={<LocalToolbar appearance="light" />}
        toolbarPlacement="bottom-right"
        style={{ height: 320 }}
      >
        <Preview appearance="light" />
      </ViewerFrame>
    </div>
  ),
};

export const BlockingFocusTransition = {
  name: 'Blocking 전환 포커스 복구',
  render: () => <div style={{ width: '100%', maxWidth: 520 }}><BlockingFocusFixture /></div>,
  play: async ({ canvasElement }) => {
    const load = canvasElement.querySelector('[data-testid="viewer-load"]');
    if (!load) throw new Error('Blocking transition trigger is missing.');
    load.focus();
    load.click();
    await new Promise((resolve) => setTimeout(resolve, 30));

    const frame = canvasElement.querySelector('[data-lds-viewer-frame]');
    const retry = canvasElement.querySelector('[data-testid="viewer-retry"]');
    if (frame?.dataset.viewerState !== 'loading') throw new Error('Viewer did not enter loading state.');
    if (canvasElement.ownerDocument.activeElement !== retry) {
      throw new Error('Focus must move from newly blocked content to the recovery action.');
    }
    if (!frame.querySelector('[data-viewer-blocking-source]')) {
      throw new Error('Blocking state must retain visible source identity.');
    }

    retry.click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    if (frame.dataset.viewerState !== 'ready') throw new Error('Recovery action did not restore the ready state.');
    if (canvasElement.ownerDocument.activeElement !== load) {
      throw new Error('Focus must return to the restored viewport toolbar after recovery.');
    }
  },
};
