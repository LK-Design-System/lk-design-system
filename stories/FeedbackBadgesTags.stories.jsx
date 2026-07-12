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
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Badges and Tags',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-status-badges-and-tags--badge-tag-patterns',
      eyebrow: 'Core / Status',
      title: 'Badges와 Tags는 수량, 상태, 분류 정보를 작고 빠르게 읽게 합니다',
      description:
        '목록·아이콘·콘텐츠 옆에서 짧은 수량이나 분류를 보조하고 공간을 적게 써야 할 때 적합합니다. 현재 가동 상태처럼 의미가 정해진 실시간 상태에는 Status Badge를, 사용자가 선택하거나 해제하는 값에는 Chip을 사용하고 긴 문장이나 핵심 안내를 작은 표식에 넣지 마세요.',
    },
    docs: {
      description: {
        component: '숫자, 상태, 라벨을 작게 표시하는 Badge, PushBadge, Tag 패턴입니다. 로컬 WDS 스냅샷의 7 Feedback 섹션은 토스트·스낵바·알럿만 정의하므로 상태 표시 의미에 맞춰 Status 그룹에 둡니다.',
      },
    },
  },
};

export default meta;

export const BadgeTagPatterns = {
  name: '개요',
  parameters: storyDescription(
    '숫자·점·톤 Badge와 분류 Tag, 알림 아이콘 위 PushBadge를 함께 비교합니다. 각 표식이 주변 콘텐츠와 연결되어 읽히고 숫자·텍스트·점만으로도 의미를 구분하며 작은 크기에서도 겹치거나 잘리지 않는지 확인하세요.',
  ),
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
