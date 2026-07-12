import {
  EquipmentStatusCard,
  Icon,
} from '../src/index.js';
import { EquipmentStatusCardCard as EquipmentStatusCardCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Status/Equipment State',
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
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          '상승 중 엘리베이터와 재연결 중 게이트웨이를 봅니다. 진행 방향과 신호 약함이 색과 라벨로 동시에 읽히는지, 재연결 상태가 정상과 구분되는지 확인하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 560 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Robotics / Equipment State
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          설비 상태 카드는 주변 인프라의 가용성을 알립니다
        </h1>
        <p style={{ margin: 0, maxWidth: 720, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          도킹·게이트웨이·엘리베이터처럼 로봇 운영에 필요한 주변 설비의 연결과 진행 상태를 표시할 때 적합합니다.
          방향과 링 라벨로 진행 중인 동작을, 칩으로 신호·정상 여부를 함께 보여 주세요. 로봇 자체의 상태에는 Robot
          State 카드를 대신 쓰세요.
        </p>
      </header>
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
