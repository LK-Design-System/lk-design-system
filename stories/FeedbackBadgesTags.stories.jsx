import {
  Badge,
  Icon,
  IconButton,
  PushBadge,
  Tag,
} from '../src/index.js';
import {
  BadgeCard as BadgeCardStory,
  PushBadgeCard as PushBadgeCardStory,
  TagCard as TagCardStory,
} from './Feedback.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Feedback/Badges and Tags',
  parameters: {
    docs: {
      description: {
        component: '숫자, 상태, 라벨을 작게 표시하는 Badge, PushBadge, Tag 패턴입니다.',
      },
    },
  },
};

export default meta;

export const BadgeTagPatterns = {
  name: '배지와 태그',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Badge>12</Badge>
        <Badge tone="amber">점검</Badge>
        <Badge tone="red" dot>장애</Badge>
        <Tag>ROBOTICS</Tag>
        <Tag tone="amber" solid>주의</Tag>
      </section>

      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <PushBadge count={7}>
          <IconButton variant="ghost" label="알림"><Icon name="bell" /></IconButton>
        </PushBadge>
      </section>
    </main>
  ),
};

export const BadgeCard = { ...BadgeCardStory, name: 'Badge card parity', tags: ['!dev', 'visual-parity'] };
export const PushBadgeCard = { ...PushBadgeCardStory, name: 'PushBadge card parity', tags: ['!dev', 'visual-parity'] };
export const TagCard = { ...TagCardStory, name: 'Tag card parity', tags: ['!dev', 'visual-parity'] };
