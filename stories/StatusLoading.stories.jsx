import React from 'react';
import { Skeleton, Spinner } from '../src/index.js';
import { SkeletonCard as SkeletonCardStory, SpinnerCard as SpinnerCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/5 Loading/Loading State',
  parameters: {
    docs: {
      description: {
        component: '콘텐츠가 준비되는 동안 사용하는 스피너와 스켈레톤 로딩 상태입니다.',
      },
    },
  },
};

export default meta;

export const LoadingStates = {
  name: '로딩 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
        <Spinner />
        <Spinner size={18} label="데이터를 불러오는 중" />
        <Spinner size={34} label="맵 생성 중" />
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 16, background: 'var(--surface-card)' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Skeleton variant="circle" width={44} />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" lines={2} />
            </div>
          </div>
        </div>
        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 16, background: 'var(--surface-card)' }}>
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="text" lines={3} style={{ marginTop: 14 }} />
        </div>
      </section>
    </main>
  ),
};

export const SkeletonCard = { ...SkeletonCardStory, name: 'Skeleton card parity', tags: ['!dev', 'visual-parity'] };
export const SpinnerCard = { ...SpinnerCardStory, name: 'Spinner card parity', tags: ['!dev', 'visual-parity'] };
