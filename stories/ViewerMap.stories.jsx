import React from 'react';
import { Map2DCanvas } from '../src/index.js';
import { Map2DCanvasCard as Map2DCanvasCardStory } from './ProductEditorAndViz.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Viewer/2D Map',
  tags: ['autodocs'],
  component: Map2DCanvas,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-viewer-2d-map--map-canvas-overview',
      eyebrow: 'Product / 2D Map',
      title: '2D 지도는 공간 맥락을 유지한 채 다양한 지도 표면을 탐색하게 합니다',
      description:
        '운영자가 점유 격자·평면도·공간 오버레이를 한 평면에서 팬과 줌으로 살펴볼 때 적합합니다. 로봇의 경로·궤적·현재 위치는 Map2DCanvas가 직접 그리지 않고 LDS Robotics Navigation 레이어를 조합하세요.',
    },
    docs: {
      description: {
        component: '점유 격자, 평면도, 공간 오버레이 같은 2D 콘텐츠를 담는 renderer-independent 팬/줌 viewport입니다.',
      },
    },
  },
};

export default meta;

function MapSurfacePreview() {
  return (
    <svg
      width="440"
      height="280"
      viewBox="0 0 440 280"
      data-map-surface-preview=""
      data-map-content-kind="neutral-structure"
      style={{ display: 'block', width: 'min(440px, calc(100cqw - 32px))', height: 'auto' }}
      role="img"
      aria-label="중립 2D 지도 표면 예시"
    >
      <rect x="30" y="26" width="380" height="228" rx="4" fill="var(--viewer-surface)" stroke="var(--viewer-border)" strokeWidth="2" />
      <rect x="52" y="48" width="124" height="78" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
      <rect x="198" y="48" width="190" height="78" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
      <rect x="52" y="152" width="148" height="80" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
      <rect x="224" y="152" width="164" height="80" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
      <rect x="42" y="132" width="356" height="14" rx="3" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" opacity="0.72" />
      <path d="M176 87 H198 M200 192 H224 M116 126 V152 M306 126 V152" fill="none" stroke="var(--viewer-foreground)" strokeWidth="5" opacity="0.32" />
    </svg>
  );
}

function WorldOriginPreview() {
  return (
    <div style={{ transform: 'translate(-180px, -120px)' }}>
      <svg width="360" height="240" viewBox="-180 -120 360 240" style={{ display: 'block' }} role="img" aria-label="중앙 원점 2D 표면 예시">
        <rect x="-156" y="-96" width="312" height="192" rx="8" fill="var(--viewer-surface)" stroke="var(--viewer-border)" />
        <rect x="-124" y="-66" width="98" height="52" rx="4" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
        <rect x="26" y="14" width="98" height="52" rx="4" fill="var(--viewer-surface-elevated)" stroke="var(--viewer-border)" />
        <path d="M-132 0 H132 M0 -76 V76" fill="none" stroke="var(--viewer-muted)" strokeWidth="1.5" strokeDasharray="4 5" />
        <path d="M-10 0 H10 M0 -10 V10" stroke="var(--viewer-foreground)" strokeWidth="2" />
        <circle cx="0" cy="0" r="4" fill="var(--viewer-foreground)" />
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
      source="검증 지도"
      viewport={viewport}
      defaultViewport={{ x: 24, y: 24, z: 1 }}
      onViewportChange={setViewport}
      onFit={() => setViewport({ x: 16, y: 16, z: 0.8 })}
      style={{ width: 520, maxWidth: '100%', height: 320 }}
    >
      <div style={{ position: 'relative' }}>
        <MapSurfacePreview />
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
        <label style={{ position: 'absolute', left: 34, top: 220, display: 'grid', gap: 4, width: 120, color: 'var(--viewer-muted)', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-semibold)' }}>
          지도 투명도
          {/* Height is set because a native range renders ~16px tall, under the
              24px target minimum. This fixture exists to prove input isolation,
              and it should not be the one control in the sweep that fails a
              size rule it is not about. */}
          <input type="range" min="0" max="100" defaultValue="70" style={{ width: '100%', height: 24 }} />
        </label>
      </div>
    </Map2DCanvas>
  );
}

function PublicInteractiveMapExample() {
  const [viewport, setViewport] = React.useState({ x: 24, y: 24, z: 1 });
  return (
    <Map2DCanvas
      data-testid="public-interaction-map"
      label="키보드와 포인터 줌 지도"
      source="검증 지도"
      viewport={viewport}
      defaultViewport={{ x: 24, y: 24, z: 1 }}
      onViewportChange={setViewport}
      onFit={() => setViewport({ x: 16, y: 16, z: 0.8 })}
      style={{ width: 520, maxWidth: '100%', height: 320 }}
    >
      <MapSurfacePreview />
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
  name: '개요',
  parameters: storyDescription(
    '같은 중립 지도 표면을 밝은 지도와 어두운 지도에서 나란히 비교합니다. appearance가 달라도 구조 지도와 프레임 도구의 정보 우선순위와 대비가 동등한지 확인하세요. Route·Trajectory·RobotPose는 LDS Robotics Navigation 레이어가 소유합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(340px, 100%), 1fr))', gap: 'var(--space-4)', width: '100%', maxWidth: 960 }}>
      <section aria-labelledby="map-light-label" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong id="map-light-label" style={{ fontSize: 'var(--body2-size)' }}>Light · 기본값</strong>
        <Map2DCanvas label="Light 2D 지도" source="지도 소스 A" defaultViewport={{ x: 16, y: 28, z: 1 }} style={{ height: 320 }}>
          <MapSurfacePreview />
        </Map2DCanvas>
      </section>
      <section aria-labelledby="map-dark-label" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong id="map-dark-label" style={{ fontSize: 'var(--body2-size)' }}>Dark</strong>
        <Map2DCanvas label="Dark 2D 지도" source="지도 소스 B" appearance="dark" defaultViewport={{ x: 16, y: 28, z: 1 }} style={{ height: 320 }}>
          <MapSurfacePreview />
        </Map2DCanvas>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const frames = Array.from(canvasElement.querySelectorAll('[data-lds-viewer-frame]'));
    const appearances = frames
      .map((frame) => frame.dataset.viewerAppearance);
    if (appearances.join(',') !== 'light,dark') {
      throw new Error(`Map2DCanvas must expose equivalent light/dark appearances: ${appearances.join(',')}`);
    }
    const previews = Array.from(canvasElement.querySelectorAll('[data-map-surface-preview]'));
    if (previews.length !== 2 || previews.some((preview) => preview.dataset.mapContentKind !== 'neutral-structure')) {
      throw new Error('Map2DCanvas overview must render the same neutral map structure in both appearances.');
    }
    if (previews[0].innerHTML !== previews[1].innerHTML) {
      throw new Error('Map2DCanvas light and dark previews must share identical neutral geometry.');
    }
    if (/(route|trajectory|waypoint|robot|primary|status)/i.test(previews.map((preview) => preview.outerHTML).join(''))) {
      throw new Error('LDS Product Map2DCanvas examples must not invent LDS Robotics navigation semantics.');
    }
    for (const frame of frames) {
      const identity = frame.querySelector('[data-viewer-identity]');
      const toolbar = frame.querySelector('[data-viewer-toolbar]');
      const status = frame.querySelector('[data-viewer-status]');
      if (!identity || !toolbar || !status) {
        throw new Error('Map2DCanvas must expose source, local controls, and zoom status through ViewerFrame.');
      }
      const frameRect = frame.getBoundingClientRect();
      const identityRect = identity.getBoundingClientRect();
      const toolbarRect = toolbar.getBoundingClientRect();
      const statusRect = status.getBoundingClientRect();
      // 배치 규약: 좌상단 정체성 · 좌하단 판독값 · 우하단 조작.
      if (identityRect.left >= toolbarRect.left) {
        throw new Error('Map2DCanvas must keep the source identity left of the local controls.');
      }
      if (toolbarRect.top <= identityRect.bottom) {
        throw new Error('Map2DCanvas must place local controls at the bottom, not on the identity row.');
      }
      if (frameRect.right - toolbarRect.right > 20 || frameRect.bottom - toolbarRect.bottom > 20) {
        throw new Error('Map2DCanvas local controls must sit at the bottom-right edge.');
      }
      if (statusRect.left - frameRect.left > 20 || frameRect.bottom - statusRect.bottom > 20) {
        throw new Error('Map2DCanvas zoom status must remain at the bottom-left edge.');
      }
    }
  },
};

export const CenterOriginContract = {
  name: '기술 계약 · 중앙 원점',
  tags: ['!dev'],
  parameters: storyDescription(
    '세계 좌표 원점을 viewport 중앙에 두는 renderer 전용 기술 계약입니다. 현재 LDS Robotics 좌표계는 이 옵션 대신 NavigationCoordinateBoundary와 명시적인 svgOrigin을 사용하므로 공개 사용 예시로 제시하지 않습니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 420 }}>
      <Map2DCanvas contentOrigin="center" label="중앙 세계 좌표 지도" source="세계 좌표 지도" style={{ height: 300 }}>
        <WorldOriginPreview />
      </Map2DCanvas>
    </main>
  ),
};

export const DisabledNavigationContract = {
  name: '기술 계약 · 탐색 비활성',
  tags: ['!dev'],
  parameters: storyDescription(
    '읽기 전용 또는 정적 시각 회귀 fixture에서 팬·휠 줌·키보드 탐색·내부 제어를 모두 끄는 기술 계약입니다. 제품의 의미 상태가 아니라 입력 정책이므로 공개 변형으로 제시하지 않습니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 420 }}>
      <Map2DCanvas
        label="검토 전용 지도"
        source="검토 전용 지도"
        panEnabled={false}
        wheelZoom={false}
        keyboard={false}
        controls={false}
        status="팬 · 휠 줌 꺼짐"
        defaultViewport={{ x: 16, y: 16, z: 0.72 }}
        style={{ height: 300 }}
      >
        <MapSurfacePreview />
      </Map2DCanvas>
    </main>
  ),
  play: async ({ canvasElement }) => {
    if (canvasElement.querySelector('[role="toolbar"]')) {
      throw new Error('A navigation-disabled Map2DCanvas must not render its local controls.');
    }
  },
};

export const KeyboardAndPointerContract = {
  name: '상호작용 · 키보드·포인터 줌',
  parameters: storyDescription(
    '운영자가 키보드로 팬하고 포인터 위치를 기준으로 휠 줌하는 상황입니다. 지도 위에는 실제 탐색 도구만 두고, 좌표 디버그 출력이나 입력 격리용 테스트 제어는 공개 예시에 노출하지 않습니다.',
  ),
  render: () => <PublicInteractiveMapExample />,
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector('[data-testid="public-interaction-map"]');
    const toolbar = canvasElement.querySelector('[role="toolbar"]');
    if (!map || !toolbar) throw new Error('The public Map2DCanvas interaction example is incomplete.');
    if (canvasElement.querySelector('[data-testid="viewport-state"], input[type="range"]')) {
      throw new Error('Public Map2DCanvas examples must not expose technical diagnostics or input-isolation fixtures.');
    }
  },
};

export const InputIsolationContract = {
  name: '기술 계약 · 중첩 입력 격리',
  tags: ['!dev'],
  parameters: storyDescription(
    '좌표 디버그 출력과 중첩 range input을 사용해 키보드·휠 입력이 지도 탐색으로 새지 않는지 자동 검증하는 숨김 기술 계약입니다. 제품 UI 예시가 아니므로 공개 탐색에서는 제외합니다.',
  ),
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
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 패널 안에 2D 지도를 배치하는 좁은 화면 상황입니다. 지도 콘텐츠와 뷰포트 제어가 잘리거나 가로 overflow를 만들지 않고 최소 탐색 공간을 유지하는지 확인하세요.',
  ),
  render: () => (
    <div data-testid="narrow-map-frame" style={{ width: 320, maxWidth: '100%' }}>
      <Map2DCanvas source="매우 긴 2D 지도 소스 이름" defaultViewport={{ x: 16, y: 16, z: 1 }} style={{ height: 280 }}>
        <MapSurfacePreview />
      </Map2DCanvas>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-testid="narrow-map-frame"]');
    const preview = canvasElement.querySelector('[data-map-surface-preview]');
    if (!frame || !preview) throw new Error('Map2DCanvas 320px neutral-map fixture is incomplete.');
    if (frame.scrollWidth > frame.clientWidth) {
      throw new Error(`Map2DCanvas neutral preview overflowed 320px: ${frame.scrollWidth}/${frame.clientWidth}.`);
    }
  },
};

export const Map2DCanvasCard = { ...Map2DCanvasCardStory, name: 'Map2DCanvas card parity', tags: ['!dev', 'visual-parity'] };
