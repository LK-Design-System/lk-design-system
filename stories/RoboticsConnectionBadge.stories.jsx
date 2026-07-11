import { ConnectionBadge } from '../src/index.js';
import { ConnectionBadgeCard as ConnectionBadgeCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Robotics/Connection Badge',
  parameters: {
    docs: {
      description: {
        component: 'MQTT·rosbridge 링크의 연결 상태를 신호 막대와 라벨로 보여주는 ConnectionBadge 패턴입니다. reconnecting은 깜빡이고, 막대 수와 색이 상태를 따릅니다.',
      },
    },
  },
};

export default meta;

export const ConnectionBadges = {
  name: '연결 배지',
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center', maxWidth: 720 }}>
      <ConnectionBadge status="online" />
      <ConnectionBadge status="connecting" />
      <ConnectionBadge status="weak" />
      <ConnectionBadge status="reconnecting" />
      <ConnectionBadge status="stale" />
      <ConnectionBadge status="error" />
      <ConnectionBadge status="offline" />
    </main>
  ),
};

export const ConnectionBadgeCard = { ...ConnectionBadgeCardStory, name: 'ConnectionBadge card parity', tags: ['!dev', 'visual-parity'] };
