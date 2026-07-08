import { TopicTree } from '../src/index.js';
import { TopicTreeCard as TopicTreeCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Robotics/Topic Tree',
  parameters: {
    docs: {
      description: {
        component: 'ROS 토픽, 네임스페이스, 구독 상태를 계층으로 확인하는 TopicTree 패턴입니다.',
      },
    },
  },
};

export default meta;

const topicNodes = [
  {
    name: '/fleet',
    type: 'namespace',
    children: [
      { name: '/amr_07/status', type: 'lk_msgs/RobotStatus', hz: 5, subscribable: true, subscribed: true },
      { name: '/amr_07/scan', type: 'sensor_msgs/LaserScan', hz: 12, subscribable: true },
      { name: '/dock_03/battery', type: 'std_msgs/Float32', hz: 1, subscribable: true },
    ],
  },
];

export const TopicTreePattern = {
  name: '토픽 트리',
  render: () => (
    <main style={{ maxWidth: 520, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)', padding: 'var(--space-2)' }}>
      <TopicTree nodes={topicNodes} />
    </main>
  ),
};

export const TopicTreeCard = { ...TopicTreeCardStory, name: 'TopicTree card parity', tags: ['!dev', 'visual-parity'] };

