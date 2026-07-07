import {
  EquipmentStatusCard,
  Icon,
} from '../src/index.js';
import { EquipmentStatusCardCard as EquipmentStatusCardCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Robotics/Equipment State',
  parameters: {
    docs: {
      description: {
        component: '도킹 스테이션, 게이트웨이, 엘리베이터 같은 주변 설비 상태를 보여주는 EquipmentStatusCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const EquipmentState = {
  name: '설비 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 560 }}>
      <EquipmentStatusCard
        icon={<Icon name="home" />}
        title="화물 엘리베이터 2호기"
        ringLabel="3F"
        ringCaption="상승 중"
        direction="up"
        chips={[{ label: '호출됨', tone: 'signal' }, { label: '정상', tone: 'positive' }]}
      />
      <EquipmentStatusCard
        icon={<Icon name="signal" />}
        title="옥상 게이트웨이"
        ringLabel="재연결"
        connection="reconnecting"
        chips={[{ label: '신호 약함', tone: 'cautionary' }]}
      />
    </main>
  ),
};

export const EquipmentStatusCardCard = { ...EquipmentStatusCardCardStory, name: 'EquipmentStatusCard card parity', tags: ['!dev', 'visual-parity'] };

