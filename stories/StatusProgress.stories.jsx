import React from 'react';
import { CircularProgress, Meter, ProgressBar } from '../src/index.js';
import { CircularProgressCard as CircularProgressCardStory, ProgressBarCard as ProgressBarCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Loading/Progress',
  parameters: {
    docs: {
      description: {
        component: 'determinate, indeterminate, 라벨, 임계값 기반 로딩 상태를 표현하는 진행 표시 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

function DemoCard({ title, children }) {
  return (
    <section
      style={{
        display: 'grid',
        gap: 'var(--space-3)',
        padding: 16,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-elevated-normal)',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const ProgressIndicators = {
  name: 'Progress indicators',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 820 }}>
      <DemoCard title="원형 진행 표시">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <CircularProgress value={72} label="리포트 진행률" showValue />
          <CircularProgress value={100} label="완료" tone="positive" size={44} />
          <CircularProgress value={34} label="주의 진행률" tone="cautionary" size={44} />
          <CircularProgress label="처리 중" indeterminate size={44} />
          <CircularProgress value={14} label="오류 진행률" tone="negative" size={44} showValue />
        </div>
      </DemoCard>

      <DemoCard title="선형 진행 표시">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <ProgressBar label="진행률" value={64} showValue />
          <ProgressBar label="펌웨어 업로드" value={38} tone="positive" showValue />
          <ProgressBar label="처리 중" indeterminate />
          <ProgressBar label="컴팩트" value={52} size="sm" />
          <ProgressBar label="라지" value={82} size="lg" tone="cautionary" showValue />
        </div>
      </DemoCard>

      <DemoCard title="Meter 확장 컴포넌트">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Meter label="완료율" value={47} max={100} thresholds={{ low: 20, high: 50 }} />
          <Meter label="위험 점수" value={82} max={100} />
        </div>
      </DemoCard>
    </main>
  ),
};

export const CircularProgressCard = { ...CircularProgressCardStory, name: 'CircularProgress card parity', tags: ['!dev', 'visual-parity'] };
export const ProgressBarCard = { ...ProgressBarCardStory, name: 'ProgressBar card parity', tags: ['!dev', 'visual-parity'] };
