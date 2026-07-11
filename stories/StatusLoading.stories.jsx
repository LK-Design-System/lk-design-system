import React from 'react';
import { Skeleton, Spinner } from '../src/index.js';
import { SkeletonCard as SkeletonCardStory, SpinnerCard as SpinnerCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Loading State',
  parameters: {
    docs: {
      description: {
        component: 'Loading, Circular loading, Skeleton 리소스에 맞춘 로딩 프리미티브입니다.',
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

export const LoadingStates = {
  name: '로딩 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 900 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <DemoCard title="브랜드 로딩과 서큘러 로딩">
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
              <Spinner variant="brand" size={22} />
              <Spinner variant="brand" size={18} label="불러오는 중" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
              <Spinner size={30} />
              <Spinner size={44} label="리포트 생성 중" />
            </div>
          </div>
        </DemoCard>

        <DemoCard title="텍스트 스켈레톤 길이와 정렬">
          <div style={{ display: 'grid', gap: 14 }}>
            <Skeleton variant="text" length="100%" lines={1} />
            <Skeleton variant="text" length="75%" lines={1} align="center" />
            <Skeleton variant="text" length="50%" lines={1} align="trailing" />
            <Skeleton variant="text" length="25%" lines={1} animate={false} />
          </div>
        </DemoCard>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <DemoCard title="사각형 스켈레톤 커스터마이징">
          <Skeleton variant="rect" width="100%" height={116} radius={12} color="var(--color-semantic-primary-surface-strong)" opacity={0.95} />
          <Skeleton variant="text" lines={2} width="82%" style={{ marginTop: 2 }} />
        </DemoCard>

        <DemoCard title="원형 스켈레톤 커스터마이징">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Skeleton variant="circle" width={44} color="var(--color-semantic-fill-strong)" />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" lines={2} />
            </div>
          </div>
        </DemoCard>
      </section>

      <DemoCard title="인버스 서피스">
        <div style={{ padding: 16, borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-inverse-background)' }}>
          <Skeleton variant="text" lines={2} color="white" />
        </div>
      </DemoCard>
    </main>
  ),
};

export const SkeletonCard = { ...SkeletonCardStory, name: 'Skeleton card parity', tags: ['!dev', 'visual-parity'] };
export const SpinnerCard = { ...SpinnerCardStory, name: 'Spinner card parity', tags: ['!dev', 'visual-parity'] };
