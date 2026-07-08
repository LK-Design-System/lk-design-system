import React from 'react';
import { Button, EmptyState, Icon } from '../src/index.js';
import { EmptyStateCard as EmptyStateCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Feedback/Empty State',
  parameters: {
    docs: {
      description: {
        component: '검색 결과 없음, 아직 데이터 없음, 권한 제한처럼 콘텐츠가 없는 상태를 설명하는 패턴입니다.',
      },
    },
  },
};

export default meta;

export const EmptyStates = {
  name: '빈 상태',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)', maxWidth: 860 }}>
      <div style={{ border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <EmptyState
          icon={<Icon name="search" size={26} />}
          title="검색 결과가 없습니다"
          description="다른 조건으로 다시 검색해 보세요."
          action={<Button variant="flat">필터 초기화</Button>}
        />
      </div>
      <div style={{ border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
        <EmptyState
          icon={<Icon name="document" size={26} />}
          title="아직 로그가 없습니다"
          description="항목을 만들면 변경 로그가 이 영역에 표시됩니다."
          action={<Button variant="secondary">항목 만들기</Button>}
        />
      </div>
    </main>
  ),
};

export const EmptyStateCard = { ...EmptyStateCardStory, name: 'EmptyState card parity', tags: ['!dev', 'visual-parity'] };
