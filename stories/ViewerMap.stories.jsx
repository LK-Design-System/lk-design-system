import React from 'react';
import { Map2DCanvas } from '../src/index.js';
import { Map2DCanvasCard as Map2DCanvasCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Viewer/2D Map',
  component: Map2DCanvas,
  parameters: {
    docs: {
      description: {
        component: '점유 격자, 경로, 로봇 위치 같은 2D 공간 콘텐츠를 담는 renderer-independent 팬/줌 viewport입니다.',
      },
    },
  },
};

export default meta;

function MapRoutePreview() {
  return (
    <svg width="440" height="280" viewBox="0 0 440 280" style={{ display: 'block', width: 'min(440px, calc(100cqw - 32px))', height: 'auto' }} role="img" aria-label="지도 경로 예시">
      <rect x="30" y="26" width="380" height="228" fill="var(--viewer-surface)" stroke="var(--viewer-foreground)" strokeWidth="3" opacity="0.9" />
      <path d="M30 150 H150 M150 26 V150 M250 150 V254 M250 200 H410" fill="none" stroke="var(--viewer-foreground)" strokeWidth="3" opacity="0.6" />
      <polyline points="80,210 80,110 200,110 200,70 340,70" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.9" />
      {[80, 200, 340].map((x, index) => (
        <circle key={x} cx={x} cy={[210, 110, 70][index]} r="4" fill="var(--color-semantic-primary-normal)" />
      ))}
      <g transform="translate(80,210)">
        <circle r="9" fill="var(--color-semantic-primary-normal)" />
        <path d="M0 -9 L5 3 L0 0 L-5 3 Z" fill="var(--color-semantic-static-white)" transform="rotate(30)" />
      </g>
    </svg>
  );
}

function WorldOriginPreview() {
  return (
    <div style={{ transform: 'translate(-180px, -120px)' }}>
      <svg width="360" height="240" viewBox="-180 -120 360 240" style={{ display: 'block' }} role="img" aria-label="중앙 세계 좌표 지도 예시">
        <rect x="-156" y="-96" width="312" height="192" rx="8" fill="var(--viewer-surface)" stroke="var(--viewer-border)" />
        <path d="M-132 54 C-62 -36 48 64 132 -46" fill="none" stroke="var(--color-semantic-primary-normal)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="0" cy="0" r="7" fill="var(--color-semantic-status-positive)" />
        <path d="M-12 0 H12 M0 -12 V12" stroke="var(--viewer-foreground)" strokeWidth="2" />
      </svg>
    </div>
  );
}

function InteractiveMapFixture() {
  const [viewport, setViewport] = React.useState({ x: 24, y: 24, z: 1 });
  return (
    <Map2DCanvas
      data-testid="interaction-map"
      label="키보드와 포인터 줌 검증 지도"
      viewport={viewport}
      defaultViewport={{ x: 24, y: 24, z: 1 }}
      onViewportChange={setViewport}
      onFit={() => setViewport({ x: 16, y: 16, z: 0.8 })}
      style={{ width: 520, maxWidth: '100%', height: 320 }}
    >
      <div style={{ position: 'relative' }}>
        <MapRoutePreview />
        <output
          data-testid="viewport-state"
          style={{
            position: 'absolute',
            left: 34,
            top: 34,
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--viewer-foreground)',
            background: 'var(--viewer-surface)',
            border: '1px solid var(--viewer-border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--caption1-size)',
          }}
        >
          {JSON.stringify(viewport)}
        </output>
        <label style={{ position: 'absolute', left: 34, top: 220, display: 'grid', gap: 3, width: 120, color: 'var(--viewer-muted)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-semibold)' }}>
          지도 투명도
          <input type="range" min="0" max="100" defaultValue="70" style={{ width: '100%' }} />
        </label>
      </div>
    </Map2DCanvas>
  );
}

function readViewport(canvasElement) {
  const text = canvasElement.querySelector('[data-testid="viewport-state"]')?.textContent;
  if (!text) throw new Error('Map viewport state output is missing.');
  return JSON.parse(text);
}

function waitForRender() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

export const MapCanvasOverview = {
  name: 'Light · Dark 지도 캔버스',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 960 }}>
      <section aria-labelledby="map-light-label" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong id="map-light-label" style={{ fontSize: 'var(--body2-size)' }}>Light · 기본값</strong>
        <Map2DCanvas label="Light 2D 지도" defaultViewport={{ x: 16, y: 28, z: 1 }} style={{ height: 320 }}>
          <MapRoutePreview />
        </Map2DCanvas>
      </section>
      <section aria-labelledby="map-dark-label" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong id="map-dark-label" style={{ fontSize: 'var(--body2-size)' }}>Dark</strong>
        <Map2DCanvas label="Dark 2D 지도" appearance="dark" defaultViewport={{ x: 16, y: 28, z: 1 }} style={{ height: 320 }}>
          <MapRoutePreview />
        </Map2DCanvas>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const appearances = Array.from(canvasElement.querySelectorAll('[data-lds-viewer-frame]'))
      .map((frame) => frame.dataset.viewerAppearance);
    if (appearances.join(',') !== 'light,dark') {
      throw new Error(`Map2DCanvas must expose equivalent light/dark appearances: ${appearances.join(',')}`);
    }
  },
};

export const OriginAndNavigationStates = {
  name: '중앙 원점 · 탐색 비활성',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 840 }}>
      <Map2DCanvas contentOrigin="center" label="중앙 세계 좌표 지도" style={{ height: 300 }}>
        <WorldOriginPreview />
      </Map2DCanvas>
      <Map2DCanvas
        label="검토 전용 지도"
        panEnabled={false}
        wheelZoom={false}
        keyboard={false}
        controls={false}
        status="팬 · 휠 줌 꺼짐"
        defaultViewport={{ x: 16, y: 16, z: 0.72 }}
        style={{ height: 300 }}
      >
        <MapRoutePreview />
      </Map2DCanvas>
    </main>
  ),
};

export const KeyboardAndPointerContract = {
  name: '키보드 · 포인터 기준 줌',
  render: () => <InteractiveMapFixture />,
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector('[data-testid="interaction-map"]');
    if (!map) throw new Error('Interaction map is missing.');
    const view = canvasElement.ownerDocument.defaultView;

    map.focus();
    map.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await waitForRender();
    const afterMapKey = readViewport(canvasElement);
    if (afterMapKey.x !== 6 || afterMapKey.y !== 24) {
      throw new Error(`Viewport arrow key did not pan by the expected step: ${JSON.stringify(afterMapKey)}`);
    }

    const zoomIn = canvasElement.querySelector('button[aria-label="확대"]');
    const zoomOut = canvasElement.querySelector('button[aria-label="축소"]');
    if (!zoomIn || !zoomOut) throw new Error('Map zoom controls are missing.');
    zoomIn.focus();
    zoomIn.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }));
    await waitForRender();
    const afterToolbarKey = readViewport(canvasElement);
    if (afterToolbarKey.x !== afterMapKey.x || afterToolbarKey.y !== afterMapKey.y || afterToolbarKey.z !== afterMapKey.z) {
      throw new Error('A toolbar arrow key leaked into map panning.');
    }
    if (canvasElement.ownerDocument.activeElement !== zoomOut) {
      throw new Error('Vertical ViewerToolbar did not move focus to the next enabled control.');
    }

    const opacitySlider = canvasElement.querySelector('input[type="range"]');
    const beforeSliderInput = readViewport(canvasElement);
    opacitySlider.focus();
    opacitySlider.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    opacitySlider.dispatchEvent(new view.WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true }));
    await waitForRender();
    const afterSliderInput = readViewport(canvasElement);
    if (JSON.stringify(beforeSliderInput) !== JSON.stringify(afterSliderInput)) {
      throw new Error('A nested form control leaked keyboard or wheel input into map navigation.');
    }

    const beforeWheel = readViewport(canvasElement);
    const rect = map.getBoundingClientRect();
    // WheelEvent client coordinates are integer-quantized by browsers, so use
    // the same integer focal point for dispatch and invariant comparison.
    const focal = { x: Math.round(rect.width * 0.72), y: Math.round(rect.height * 0.44) };
    map.dispatchEvent(new view.WheelEvent('wheel', {
      deltaY: -120,
      clientX: rect.left + focal.x,
      clientY: rect.top + focal.y,
      bubbles: true,
      cancelable: true,
    }));
    await waitForRender();
    const afterWheel = readViewport(canvasElement);
    if (afterWheel.z <= beforeWheel.z) throw new Error('Wheel zoom did not increase the map scale.');

    const beforeContentPoint = {
      x: (focal.x - beforeWheel.x) / beforeWheel.z,
      y: (focal.y - beforeWheel.y) / beforeWheel.z,
    };
    const afterContentPoint = {
      x: (focal.x - afterWheel.x) / afterWheel.z,
      y: (focal.y - afterWheel.y) / afterWheel.z,
    };
    if (Math.abs(beforeContentPoint.x - afterContentPoint.x) > 0.02 || Math.abs(beforeContentPoint.y - afterContentPoint.y) > 0.02) {
      throw new Error('Wheel zoom did not preserve the content point under the pointer.');
    }

    const fit = canvasElement.querySelector('button[aria-label="전체 보기"]');
    if (!fit) throw new Error('The optional fit command is missing.');
    fit.click();
    await waitForRender();
    const fittedViewport = readViewport(canvasElement);
    if (fittedViewport.x !== 16 || fittedViewport.y !== 16 || fittedViewport.z !== 0.8) {
      throw new Error(`Fit command did not delegate to the application: ${JSON.stringify(fittedViewport)}`);
    }

    map.focus();
    map.dispatchEvent(new view.KeyboardEvent('keydown', { key: '0', bubbles: true, cancelable: true }));
    await waitForRender();
    const resetViewport = readViewport(canvasElement);
    if (resetViewport.x !== 24 || resetViewport.y !== 24 || resetViewport.z !== 1) {
      throw new Error(`Reset did not restore defaultViewport: ${JSON.stringify(resetViewport)}`);
    }
  },
};

export const NarrowWidth = {
  name: '320px 좁은 지도',
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <Map2DCanvas defaultViewport={{ x: 16, y: 16, z: 1 }} style={{ height: 280 }}>
        <MapRoutePreview />
      </Map2DCanvas>
    </div>
  ),
};

export const Map2DCanvasCard = { ...Map2DCanvasCardStory, name: 'Map2DCanvas card parity', tags: ['!dev', 'visual-parity'] };
