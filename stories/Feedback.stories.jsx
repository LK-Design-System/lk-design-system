import {
  Avatar,
  AvatarGroup,
} from '../src/index.js';
import {
  AvatarCard as AvatarCardStory,
  AvatarGroupCard as AvatarGroupCardStory,
} from './Feedback.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/4 Content/Avatar',
  parameters: {
    docs: {
      description: {
        component: '사용자, 운영자, 팀 상태를 식별하는 Avatar와 AvatarGroup 패턴입니다.',
      },
    },
  },
};

export default meta;

export const AvatarPatterns = {
  name: '아바타',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <section style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar name="LK" status="online" />
        <Avatar name="운영자" size={40} status="busy" />
        <Avatar name="대전 본사" size={40} status="offline" />
      </section>
      <AvatarGroup
        items={[
          { name: '김운영' },
          { name: '박관리' },
          { name: '이문서' },
          { name: '최품질' },
          { name: '정품질' },
        ]}
      />
    </main>
  ),
};

export const AvatarCard = { ...AvatarCardStory, name: 'Avatar card parity', tags: ['!dev', 'visual-parity'] };
export const AvatarGroupCard = { ...AvatarGroupCardStory, name: 'AvatarGroup card parity', tags: ['!dev', 'visual-parity'] };
