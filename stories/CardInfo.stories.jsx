import {
  FeatureCard,
  Icon,
} from '../src/index.js';
import {
  FeatureCardCard as FeatureCardCardStory,
} from './CardsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Feature Card',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-feature-card--feature-cards',
      eyebrow: 'Product / Feature Card',
      title: '사용자가 제품 기능의 목적과 차이를 짧은 설명으로 비교합니다',
      description:
        '서로 다른 기능의 가치와 성격을 아이콘·제목·설명으로 소개할 때 적합합니다. 실시간 상태나 여러 행의 속성 비교에는 FeatureCard 대신 Status Card 또는 구조화된 표를 사용하세요.',
    },
    docs: {
      description: {
        component: '제품 기능을 아이콘·제목·설명으로 카드 안에서 설명하는 FeatureCard 패턴입니다.',
      },
    },
  },
};

export default meta;

export const FeatureCards = {
  name: '개요',
  parameters: storyDescription(
    '서로 다른 제품 기능을 카드 묶음으로 소개하는 상황입니다. 아이콘과 tone이 설명을 보조하면서도 제목과 본문만으로 기능 차이를 이해할 수 있는지 확인하세요.',
  ),
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
