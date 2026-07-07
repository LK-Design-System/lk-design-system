import React from 'react';
import { CircularProgress, Meter, ProgressBar } from '../src/index.js';
import { CircularProgressCard as CircularProgressCardStory, ProgressBarCard as ProgressBarCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/5 Loading/Progress',
  parameters: {
    docs: {
      description: {
        component: 'Progress indicators for determinate, indeterminate, labelled, and threshold-based loading states.',
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
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-card)',
      }}
    >
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

export const ProgressIndicators = {
  name: 'Progress indicators',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 820 }}>
      <DemoCard title="Circular progress">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <CircularProgress value={72} label="Report progress" showValue />
          <CircularProgress value={100} label="Complete" tone="positive" size={44} />
          <CircularProgress value={34} label="Cautionary progress" tone="cautionary" size={44} />
          <CircularProgress label="Processing" indeterminate size={44} />
          <CircularProgress value={14} label="Negative progress" tone="negative" size={44} showValue />
        </div>
      </DemoCard>

      <DemoCard title="Linear progress">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <ProgressBar label="Progress" value={64} showValue />
          <ProgressBar label="File upload" value={38} tone="positive" showValue />
          <ProgressBar label="Processing" indeterminate />
          <ProgressBar label="Compact" value={52} size="sm" />
          <ProgressBar label="Large" value={82} size="lg" tone="cautionary" showValue />
        </div>
      </DemoCard>

      <DemoCard title="Meter extension boundary">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Meter label="Completion" value={47} max={100} thresholds={{ low: 20, high: 50 }} />
          <Meter label="Risk score" value={82} max={100} />
        </div>
      </DemoCard>
    </main>
  ),
};

export const CircularProgressCard = { ...CircularProgressCardStory, name: 'CircularProgress card parity', tags: ['!dev', 'visual-parity'] };
export const ProgressBarCard = { ...ProgressBarCardStory, name: 'ProgressBar card parity', tags: ['!dev', 'visual-parity'] };
