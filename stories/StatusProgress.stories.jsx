import React from 'react';
import { CircularProgress, Meter, ProgressBar } from '../src/index.js';
import { CircularProgressCard as CircularProgressCardStory, ProgressBarCard as ProgressBarCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/5 Loading/Progress',
  parameters: {
    docs: {
      description: {
        component: '작업 진행, 완료율, 품질처럼 수치 범위를 표시하는 상태 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const ProgressIndicators = {
  name: '진행률 표시',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
        <CircularProgress value={72} showValue />
        <CircularProgress value={100} tone="positive" size={44} />
        <CircularProgress value={34} tone="cautionary" size={44} />
        <CircularProgress value={14} tone="negative" size={44} showValue />
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <ProgressBar label="진행률" value={64} showValue />
        <ProgressBar label="파일 업로드" value={38} tone="positive" showValue />
        <ProgressBar label="처리 중" indeterminate />
        <Meter label="완료율" value={47} max={100} thresholds={{ low: 20, high: 50 }} />
        <Meter label="품질 점수" value={82} max={100} />
      </section>
    </main>
  ),
};

export const CircularProgressCard = { ...CircularProgressCardStory, name: 'CircularProgress card parity', tags: ['!dev', 'visual-parity'] };
export const ProgressBarCard = { ...ProgressBarCardStory, name: 'ProgressBar card parity', tags: ['!dev', 'visual-parity'] };
