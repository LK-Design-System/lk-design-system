import React from 'react';
import { VideoStreamTile } from '../src/index.js';
import { VideoStreamTileCard as VideoStreamTileCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Viewer/Video Stream',
  parameters: {
    docs: {
      description: {
        component: 'RTSP, WebRTC, 녹화 영상처럼 앱이 제공하는 영상 렌더링을 담는 스트림 타일입니다.',
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
        background: 'repeating-linear-gradient(135deg, var(--inverse-fill-normal) 0 10px, var(--inverse-line-normal) 10px 20px)',
      }}
    >
      <span style={{ fontFamily: monoFont, fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: 'var(--inverse-label-assistive)' }}>{children}</span>
    </div>
  );
}

export const VideoStreamOverview = {
  name: '영상 스트림 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 920 }}>
      <VideoStreamTile label="AMR-07 전면 카메라" status="live">
        <FeedPlaceholder>RTSP · 1280x720</FeedPlaceholder>
      </VideoStreamTile>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
        <VideoStreamTile label="RGB" status="live"><FeedPlaceholder>라이브</FeedPlaceholder></VideoStreamTile>
        <VideoStreamTile label="IR" status="loading"><FeedPlaceholder>로딩 중</FeedPlaceholder></VideoStreamTile>
        <VideoStreamTile label="EO-1" status="disconnected"><FeedPlaceholder>오프라인</FeedPlaceholder></VideoStreamTile>
      </section>
    </main>
  ),
};

export const VideoStreamTileCard = { ...VideoStreamTileCardStory, name: 'VideoStreamTile card parity', tags: ['!dev', 'visual-parity'] };
