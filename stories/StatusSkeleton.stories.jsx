import React from 'react';
import { Skeleton } from '../src/index.js';
import { SkeletonCard as SkeletonCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Skeleton',
  parameters: {
    docs: {
      description: {
        component:
          'Skeleton은 콘텐츠가 도착하기 전 레이아웃의 자리를 잡아 두는 로딩 플레이스홀더입니다. WDS Loading의 Skeleton 리소스에 대응합니다. 실제 콘텐츠의 모양(텍스트 줄, 카드, 아바타)을 흉내 내야 할 때 사용하고, 짧은 비결정적 대기에는 순환형 로딩 표시를 쓰세요.',
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

export const SkeletonOverview = {
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          '텍스트 길이·정렬, 사각형/원형 변형, 인버스 서피스를 봅니다. 스켈레톤 형태가 실제로 대체할 콘텐츠의 크기·정렬과 일치하는지, 인버스 배경에서도 대비가 유지되는지 확인하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 900 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Status / Skeleton
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Skeleton은 도착할 콘텐츠의 자리를 먼저 잡습니다
        </h1>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          레이아웃 이동 없이 로딩을 표현해야 할 때 적합합니다. 완료 시점을 알 수 없는 짧은 대기에는 Spinner를,
          진행률을 알 수 있으면 Progress를 대신 쓰세요.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <DemoCard title="텍스트 스켈레톤 길이와 정렬">
          <div style={{ display: 'grid', gap: 14 }}>
            <Skeleton variant="text" length="100%" lines={1} />
            <Skeleton variant="text" length="75%" lines={1} align="center" />
            <Skeleton variant="text" length="50%" lines={1} align="trailing" />
            <Skeleton variant="text" length="25%" lines={1} animate={false} />
          </div>
        </DemoCard>

        <DemoCard title="사각형 스켈레톤 커스터마이징">
          <Skeleton variant="rect" width="100%" height={116} radius={12} color="var(--color-semantic-primary-surface-strong)" opacity={0.95} />
          <Skeleton variant="text" lines={2} width="82%" style={{ marginTop: 2 }} />
        </DemoCard>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <DemoCard title="원형 스켈레톤 커스터마이징">
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <Skeleton variant="circle" width={44} color="var(--color-semantic-fill-strong)" />
            <div style={{ flex: 1 }}>
              <Skeleton variant="text" lines={2} />
            </div>
          </div>
        </DemoCard>

        <DemoCard title="인버스 서피스">
          <div style={{ padding: 16, borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-inverse-background)' }}>
            <Skeleton variant="text" lines={2} color="white" />
          </div>
        </DemoCard>
      </section>
    </main>
  ),
};

export const SkeletonCard = { ...SkeletonCardStory, name: 'Skeleton card parity', tags: ['!dev', 'visual-parity'] };
