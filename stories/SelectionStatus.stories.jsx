import {
  ChoiceCard,
  Icon,
} from '../src/index.js';
import { ChoiceCardCard as ChoiceCardCardStory } from './SelectionStatus.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/3 Selection and Input/Card Selection',
  parameters: {
    docs: {
      description: {
        component: '플랜, 옵션, 항목처럼 큰 선택지를 카드 단위로 비교하고 선택하는 ChoiceCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ChoiceCards = {
  name: '카드 선택',
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', maxWidth: 760 }}>
      <ChoiceCard selected icon={<Icon name="document" />} title="기본 플랜" description="표준 설정으로 시작" />
      <ChoiceCard multiple icon={<Icon name="layers" />} title="고급 옵션" description="추가 설정 포함" />
      <ChoiceCard icon={<Icon name="plus" />} title="새 항목" description="검토 후 게시" />
    </main>
  ),
};

export const ChoiceCardCard = { ...ChoiceCardCardStory, name: 'ChoiceCard card parity', tags: ['!dev', 'visual-parity'] };
