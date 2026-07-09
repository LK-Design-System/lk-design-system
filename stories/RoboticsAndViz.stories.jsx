import {
  RobotStatusCard,
} from '../src/index.js';
import {
  RobotStatusCardCard as RobotStatusCardCardStory,
} from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Robotics/Robot State',
  parameters: {
    docs: {
      description: {
        component: '로봇의 연결, 배터리, 모드, 선택 상태를 한 행으로 보여주는 RobotStatusCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const RobotState = {
  name: '로봇 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 920, minWidth: 0 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <RobotStatusCard name="AMR-07" status="online" battery={86} mode="순찰" selected />
        <RobotStatusCard name="Forklift-B2" status="reconnecting" battery={47} mode="수동" />
        <RobotStatusCard name="Docking-03" status="offline" battery={12} mode="충전" />
      </section>
    </main>
  ),
};

export const RobotStatusCardCard = { ...RobotStatusCardCardStory, name: 'RobotStatusCard card parity', tags: ['!dev', 'visual-parity'] };
