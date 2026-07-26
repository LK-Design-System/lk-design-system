import React from 'react';
import { Button, EmptyState, Icon } from '../src/index.js';
import { EmptyStateCard as EmptyStateCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Empty State',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-status-empty-state--empty-states',
      eyebrow: 'Core / Status',
      title: 'Empty State는 콘텐츠가 없는 이유와 사용자가 할 수 있는 다음 행동을 설명합니다',
      description:
        '첫 사용, 검색 결과 없음, 권한 제한처럼 정상적으로 표시할 콘텐츠가 없고 회복 또는 시작 방법을 안내해야 할 때 적합합니다. 데이터를 불러오는 중에는 Loading을, 실패 원인과 재시도가 필요한 경우에는 Error 상태를 사용하고 단순히 공간을 채우기 위한 장식으로 쓰지 마세요.',
    },
    docs: {
      description: {
        component: '검색 결과 없음, 아직 데이터 없음, 권한 제한처럼 콘텐츠가 없는 상태를 설명하는 패턴입니다.',
      },
    },
  },
};

export default meta;

export const EmptyStates = {
  name: '개요',
  parameters: storyDescription(
    '검색 결과 없음과 아직 로그가 없는 첫 사용 상태를 비교합니다. 제목이 빈 이유를 명확히 설명하고 설명 문구와 필터 초기화·항목 만들기 행동이 각 상황의 현실적인 다음 단계로 이어지는지 확인하세요.',
  ),
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
          action={<Button variant="solid" color="primary">항목 만들기</Button>}
        />
      </div>
    </main>
  ),
};

export const EmptyStateCard = { ...EmptyStateCardStory, name: 'EmptyState card parity', tags: ['!dev', 'visual-parity'] };
