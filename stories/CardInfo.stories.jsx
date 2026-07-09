import {
  FeatureCard,
  Icon,
} from '../src/index.js';
import {
  FeatureCardCard as FeatureCardCardStory,
} from './CardsExtended.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Feature Card',
  parameters: {
    docs: {
      description: {
        component: '제품 기능을 아이콘·제목·설명으로 카드 안에서 설명하는 FeatureCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const FeatureCards = {
  name: '기능 카드',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <FeatureCard boxed tone="signal" icon={<Icon name="layers" size={22} />} title="정보 위계 정리">
          제목, 본문, 액션의 우선순위를 컴포넌트 안에서 일관되게 유지합니다.
        </FeatureCard>
        <FeatureCard boxed tone="amber" icon={<Icon name="triangle-exclamation" size={22} />} title="위험 상태 알림">
          경고와 조치가 필요한 이벤트를 차분한 상태 색상으로 분리합니다.
        </FeatureCard>
      </section>
    </main>
  ),
};

export const FeatureCardCard = { ...FeatureCardCardStory, name: 'FeatureCard card parity', tags: ['!dev', 'visual-parity'] };
