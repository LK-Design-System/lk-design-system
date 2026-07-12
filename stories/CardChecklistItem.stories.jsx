import { ChecklistItem } from '../src/index.js';
import { ChecklistItemCard as ChecklistItemCardStory } from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Checklist Item',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-checklist-item--checklist-items',
      eyebrow: 'Product / Checklist Item',
      title: '사용자가 해야 할 항목과 제외된 항목을 한 줄씩 구분합니다',
      description:
        '작업 기준이나 준비 항목처럼 짧은 목록의 완료·제외 상태를 읽게 할 때 적합합니다. 순서가 있는 절차나 직접 체크해야 하는 입력에는 정적 ChecklistItem 대신 Steps 또는 Checkbox를 사용하세요.',
    },
    docs: {
      description: {
        component: '할 일과 완료·제외 상태를 한 줄로 표시하는 ChecklistItem 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ChecklistItems = {
  name: '개요',
  parameters: storyDescription(
    '작업 기준 목록에서 일반 항목과 제외된 항목을 함께 보여 주는 상황입니다. 취소선과 약한 톤이 상태를 보조하되 텍스트 의미만으로도 차이를 이해할 수 있는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 560 }}>
      <ChecklistItem>상태 라벨 표시</ChecklistItem>
      <ChecklistItem>권한별 액션 분리</ChecklistItem>
      <ChecklistItem cross muted>임의 색상 사용</ChecklistItem>
    </main>
  ),
};

export const ChecklistItemCard = { ...ChecklistItemCardStory, name: 'ChecklistItem card parity', tags: ['!dev', 'visual-parity'] };
