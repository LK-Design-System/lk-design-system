import React from 'react';
import { Skeleton, Spinner } from '../src/index.js';
import { SkeletonCard as SkeletonCardStory, SpinnerCard as SpinnerCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/5 Loading/Loading State',
  parameters: {
    docs: {
      description: {
        component: 'Loading primitives aligned with Loading, Circular loading, and Skeleton resources.',
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

export const LoadingStates = {
  name: 'Loading states',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 900 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <DemoCard title="Wanted loading and circular loading">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <Spinner variant="wanted" size={44} />
            <Spinner variant="wanted" size={54} label="Loading" />
            <Spinner size={30} />
            <Spinner size={44} label="Generating report" />
          </div>
        </DemoCard>

        <DemoCard title="Text skeleton length and alignment">
          <div style={{ display: 'grid', gap: 14 }}>
            <Skeleton variant="text" length="100%" lines={1} />
            <Skeleton variant="text" length="75%" lines={1} align="center" />
            <Skeleton variant="text" length="50%" lines={1} align="trailing" />
            <Skeleton variant="text" length="25%" lines={1} animate={false} />
          </div>
        </DemoCard>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <DemoCard title="Rectangle customization">
          <Skeleton variant="rect" width="100%" height={116} radius={12} color="var(--lk-accent-tint-2)" opacity={0.95} />
          <Skeleton variant="text" lines={2} width="82%" style={{ marginTop: 2 }} />
        </DemoCard>

        <DemoCard title="Circle customization">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Skeleton variant="circle" width={44} color="var(--fill-strong)" />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" lines={2} />
            </div>
          </div>
        </DemoCard>
      </section>

      <DemoCard title="Inverse surface">
        <div style={{ padding: 16, borderRadius: 'var(--radius-lg)', background: 'var(--surface-inverse)' }}>
          <Skeleton variant="text" lines={2} color="white" />
        </div>
      </DemoCard>
    </main>
  ),
};

export const SkeletonCard = { ...SkeletonCardStory, name: 'Skeleton card parity', tags: ['!dev', 'visual-parity'] };
export const SpinnerCard = { ...SpinnerCardStory, name: 'Spinner card parity', tags: ['!dev', 'visual-parity'] };
