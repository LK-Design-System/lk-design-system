import React from 'react';
import { ConnectionBadge, Icon, Scene3DFrame, ViewerToolbar, ViewerToolbarButton } from '../src/index.js';
import { Scene3DFrameCard as Scene3DFrameCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LK Robotics Extension/Viewer/3D Frame',
  parameters: {
    docs: {
      description: {
        component: 'Three.js, point cloud, digital twin처럼 3D 렌더링을 담는 어두운 뷰어 프레임입니다.',
      },
    },
  },
};

export default meta;

function PointCloudPreview() {
  const points = Array.from({ length: 90 }, (_, index) => {
    const x = (index * 37) % 100;
    const y = (index * 61) % 100;
    return { x, y, r: 0.7 + (index % 5) * 0.22, accent: index % 9 === 0 };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 20%, var(--lk-accent-tint-2), transparent 60%)' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="포인트 클라우드 예시">
        {points.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r={point.r} fill={point.accent ? 'var(--lk-accent)' : 'var(--text-on-inverse)'} opacity={point.accent ? 0.72 : 0.34} />
        ))}
      </svg>
    </div>
  );
}

export const Scene3DOverview = {
  name: '3D 프레임',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 840 }}>
      <Scene3DFrame
        title="POINT CLOUD"
        badges={<ConnectionBadge status="online" size="sm" />}
        toolbar={(
          <ViewerToolbar orientation="horizontal">
            <ViewerToolbarButton label="초기화"><Icon name="home" size={16} /></ViewerToolbarButton>
            <ViewerToolbarButton label="레이어" active><Icon name="filter" size={16} /></ViewerToolbarButton>
          </ViewerToolbar>
        )}
        style={{ height: 420 }}
      >
        <PointCloudPreview />
      </Scene3DFrame>
    </main>
  ),
};

export const Scene3DFrameCard = { ...Scene3DFrameCardStory, name: 'Scene3DFrame card parity', tags: ['!dev', 'visual-parity'] };
