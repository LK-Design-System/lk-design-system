import React from 'react';
import { Map2DCanvas } from '../src/index.js';
import { Map2DCanvasCard as Map2DCanvasCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Viewer/2D Map',
  parameters: {
    docs: {
      description: {
        component: '점유 격자, 경로, 로봇 위치 같은 2D 지도 렌더링을 담는 팬/줌 캔버스입니다.',
      },
    },
  },
};

export default meta;

function MapRoutePreview() {
  return (
    <svg width="440" height="280" viewBox="0 0 440 280" style={{ display: 'block' }} aria-label="지도 경로 예시">
      <rect x="30" y="26" width="380" height="228" fill="none" stroke="var(--label-normal)" strokeWidth="3" opacity="0.85" />
      <path d="M30 150 H150 M150 26 V150 M250 150 V254 M250 200 H410" fill="none" stroke="var(--label-normal)" strokeWidth="3" opacity="0.6" />
      <polyline points="80,210 80,110 200,110 200,70 340,70" fill="none" stroke="var(--accent-text)" strokeWidth="2.5" strokeDasharray="6 6" opacity="0.9" />
      {[80, 200, 340].map((x, index) => (
        <circle key={x} cx={x} cy={[210, 110, 70][index]} r="4" fill="var(--accent-text)" />
      ))}
      <g transform="translate(80,210)">
        <circle r="9" fill="var(--lk-accent-ink)" />
        <path d="M0 -9 L5 3 L0 0 L-5 3 Z" fill="var(--text-on-inverse)" transform="rotate(30)" />
      </g>
    </svg>
  );
}

export const MapCanvasOverview = {
  name: '2D 지도 캔버스',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 840 }}>
      <Map2DCanvas style={{ height: 360 }}>
        <MapRoutePreview />
      </Map2DCanvas>
    </main>
  ),
};

export const Map2DCanvasCard = { ...Map2DCanvasCardStory, name: 'Map2DCanvas card parity', tags: ['!dev', 'visual-parity'] };
