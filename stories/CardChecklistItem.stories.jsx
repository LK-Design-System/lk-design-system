import { ChecklistItem } from '../src/index.js';
import { ChecklistItemCard as ChecklistItemCardStory } from './CardsExtended.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Checklist Item',
  parameters: {
    docs: {
      description: {
        component: '할 일과 완료·제외 상태를 한 줄로 표시하는 ChecklistItem 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ChecklistItems = {
  name: '체크리스트 항목',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 560 }}>
      <ChecklistItem>상태 라벨 표시</ChecklistItem>
      <ChecklistItem>권한별 액션 분리</ChecklistItem>
      <ChecklistItem cross muted>임의 색상 사용</ChecklistItem>
    </main>
  ),
};

export const ChecklistItemCard = { ...ChecklistItemCardStory, name: 'ChecklistItem card parity', tags: ['!dev', 'visual-parity'] };
