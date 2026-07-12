import React from 'react';
import { Spinner } from '../src/index.js';
import { SpinnerCard as SpinnerCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Spinner',
  parameters: {
    docs: {
      description: {
        component:
          'Spinner는 완료 시점을 예측할 수 없는 짧은 대기를 나타내는 순환 로딩 표시입니다. WDS Loading의 Circular loading 리소스에 대응합니다. 진행률을 알 수 있으면 진행 표시를, 레이아웃 자리를 잡아야 하면 콘텐츠 윤곽 로딩을 쓰세요.',
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

export const SpinnerOverview = {
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          '크기 변형과 라벨이 있는 스피너를 봅니다. 라벨을 붙였을 때 정렬이 유지되는지, 작은 크기에서도 회전이 자연스러운지 확인하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 900 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Status / Spinner
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          Spinner는 완료 시점을 모르는 짧은 대기에 씁니다
        </h1>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          버튼·오버레이의 순간적 로딩에 적합합니다. 레이아웃 자리를 잡아야 하면 Skeleton을, 진행률을 보여 줄 수
          있으면 Progress를 대신 쓰세요.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <DemoCard title="서큘러 로딩">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
            <Spinner size={30} />
            <Spinner size={44} label="리포트 생성 중" />
          </div>
        </DemoCard>
      </section>
    </main>
  ),
};

export const SpinnerCard = { ...SpinnerCardStory, name: 'Spinner card parity', tags: ['!dev', 'visual-parity'] };
