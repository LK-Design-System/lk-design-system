import { ConnectionBadge } from '../src/index.js';
import { ConnectionBadgeCard as ConnectionBadgeCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Status/Connection Badge',
  parameters: {
    docs: {
      description: {
        component: 'MQTT·rosbridge 링크의 연결 상태를 신호 막대와 라벨로 보여주는 ConnectionBadge 패턴입니다. ready는 다른 제어 게이트와 조합되기 전의 연결 전제조건을 신호색으로 나타내며, 막대 수와 텍스트 라벨이 색과 함께 상태를 구분합니다.',
      },
    },
  },
};

export default meta;

export const ConnectionBadges = {
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          'online부터 offline까지 8개 상태를 나란히 봅니다. 색약 사용자도 막대 수·라벨로 상태를 구분할 수 있는지, ready와 online이 혼동되지 않는지 확인하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 720 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          Robotics / Connection Badge
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          연결 배지는 링크 상태를 제어 전제조건으로 보여 줍니다
        </h1>
        <p style={{ margin: 0, maxWidth: 640, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          MQTT·rosbridge 링크가 제어를 허용할 상태인지 판단할 때 적합합니다. ready는 연결 전제조건 충족을,
          weak·stale·reconnecting은 신뢰할 수 없는 링크를 뜻하며, 신호 막대 수와 텍스트 라벨이 색과 함께 상태를
          구분합니다. 개별 토픽의 지연 수치에는 이 배지 대신 텔레메트리를 쓰세요.
        </p>
      </header>
      <section style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <ConnectionBadge status="online" />
        <ConnectionBadge status="connecting" />
        <ConnectionBadge status="ready" />
        <ConnectionBadge status="weak" />
        <ConnectionBadge status="reconnecting" />
        <ConnectionBadge status="stale" />
        <ConnectionBadge status="error" />
        <ConnectionBadge status="offline" />
      </section>
    </main>
  ),
};

export const ConnectionBadgeCard = { ...ConnectionBadgeCardStory, name: 'ConnectionBadge card parity', tags: ['!dev', 'visual-parity'] };
