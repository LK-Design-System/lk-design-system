import {
  ContentBadge,
  StatusBadge,
} from '../src/index.js';
import { ContentBadgeStatusBadgeCard as ContentBadgeStatusBadgeCardStory } from './Content.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/4 Content/Badges',
  parameters: {
    docs: {
      description: {
        component: '문장이나 콘텐츠 블록 안에서 상태와 맥락을 짧게 표시하는 ContentBadge, StatusBadge 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ContentBadges = {
  name: '콘텐츠 배지',
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap', maxWidth: 720 }}>
      <ContentBadge>검증됨</ContentBadge>
      <ContentBadge tone="positive">운영 가능</ContentBadge>
      <ContentBadge tone="warning">주의</ContentBadge>
      <ContentBadge tone="negative" variant="outline">제한</ContentBadge>
      <StatusBadge tone="online" pulse>실시간 연결</StatusBadge>
    </main>
  ),
};

export const ContentBadgeStatusBadgeCard = { ...ContentBadgeStatusBadgeCardStory, name: 'ContentBadge · StatusBadge card parity', tags: ['!dev', 'visual-parity'] };

