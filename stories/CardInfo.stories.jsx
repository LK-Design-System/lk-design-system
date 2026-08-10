import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
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
  component: FeatureCard,
  tags: ['autodocs'],
  args: {
    density: 'comfortable',
  },
  argTypes: {
    density: {
      control: 'inline-radio',
      options: ['comfortable', 'compact'],
    },
  },
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
        <FeatureCard
          headingLevel={2} boxed tone="signal" icon={<Icon name="layers" size={22} />} title="정보 위계 정리">
          제목, 본문, 액션의 우선순위를 컴포넌트 안에서 일관되게 유지합니다.
        </FeatureCard>
        <FeatureCard
          headingLevel={2} boxed tone="amber" icon={<Icon name="triangle-exclamation" size={22} />} title="위험 상태 알림">
          경고와 조치가 필요한 이벤트를 차분한 상태 색상으로 분리합니다.
        </FeatureCard>
        <FeatureCard
          headingLevel={2} boxed tone="navy" icon={<Icon name="robot" size={22} />} title="브랜드 기능 식별">
          공식 네이비 타일로 LK ROBOTICS 고유 기능을 식별합니다.
        </FeatureCard>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    // The canvas page title owns the h1, so these demo cards title themselves at h2.
    const headings = Array.from(canvasElement.querySelectorAll('h2'));
    if (headings.length !== 3) {
      throw new Error('FeatureCard 제목은 실제 heading으로 렌더되어야 합니다(WCAG 1.3.1).');
    }
    if (canvasElement.querySelector('[role="button"], button, a')) {
      throw new Error('onClick 없는 기능 셀은 인터랙티브 요소를 만들지 않아야 합니다.');
    }
  },
};

function FeatureCardDensityPair({ mode }) {
  const narrow = mode === 'narrow';
  return (
    <section
      aria-label={`${narrow ? '좁은 폭' : '일반 폭'} 기능 카드 밀도 비교`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 'var(--space-3)',
        width: narrow ? 'min(320px, 100%)' : '100%',
        maxWidth: narrow ? undefined : 720,
      }}
    >
      {['comfortable', 'compact'].map((density) => (
        <FeatureCard
          key={density}
          data-density-contract={`${mode}-${density}`}
          density={density}
          headingLevel={2}
          boxed
          tone="signal"
          icon={<Icon name="layers" size={20} />}
          title={`${density === 'compact' ? '조밀형' : '기본형'} 기능`}
          style={{ width: '100%', minWidth: 0, boxSizing: 'border-box' }}
        >
          밀도는 공간과 아이콘 크기만 조정하며 제목과 본문 크기는 유지합니다.
        </FeatureCard>
      ))}
    </section>
  );
}

export const DensityCompatibility = {
  name: '반응형 · 기본형과 조밀형 밀도',
  parameters: storyDescription(
    'boxed FeatureCard의 comfortable·compact를 일반 폭과 320px 좁은 폭에서 나란히 비교합니다. compact는 spacing ramp와 아이콘 크기만 조정하고 typography를 유지합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <FeatureCardDensityPair mode="normal" />
      <FeatureCardDensityPair mode="narrow" />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const expectations = [
      ['normal-comfortable', 'comfortable', '32px', '16px', '52px', '8px'],
      ['normal-compact', 'compact', '16px', '12px', '40px', '4px'],
      ['narrow-comfortable', 'comfortable', '32px', '16px', '52px', '8px'],
      ['narrow-compact', 'compact', '16px', '12px', '40px', '4px'],
    ];
    for (const [contract, density, padding, outerGap, iconSize, textGap] of expectations) {
      const card = canvasElement.querySelector(`[data-density-contract="${contract}"]`);
      const icon = card?.firstElementChild;
      const content = card?.lastElementChild;
      if (!(card instanceof HTMLElement) || !(icon instanceof HTMLElement) || !(content instanceof HTMLElement)) {
        throw new Error(`FeatureCard density fixture is incomplete: ${contract}`);
      }
      const cardStyle = getComputedStyle(card);
      if (card.dataset.density !== density || cardStyle.paddingTop !== padding || cardStyle.gap !== outerGap || getComputedStyle(icon).width !== iconSize || getComputedStyle(content).gap !== textGap) {
        throw new Error(`FeatureCard ${contract} must resolve the documented density dimensions.`);
      }
    }
    for (const mode of ['normal', 'narrow']) {
      const comfortableTitle = canvasElement.querySelector(`[data-density-contract="${mode}-comfortable"] h2`);
      const compactTitle = canvasElement.querySelector(`[data-density-contract="${mode}-compact"] h2`);
      if (!comfortableTitle || !compactTitle || getComputedStyle(comfortableTitle).fontSize !== getComputedStyle(compactTitle).fontSize) {
        throw new Error(`FeatureCard density must not reduce the ${mode} title scale.`);
      }
    }
  },
};

function ActivatableFeatureCard() {
  const [count, setCount] = React.useState(0);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 420 }}>
      <FeatureCard
        boxed
        data-contract="activatable"
        headingLevel={2}
        tone="signal"
        icon={<Icon name="layers" size={22} />}
        title="카드 전체가 행동"
        onClick={() => setCount((value) => value + 1)}
      >
        onClick을 주면 카드 루트가 버튼이 되고 Enter/Space로 활성화됩니다.
      </FeatureCard>
      <p data-contract="count" style={{ margin: 0 }}>{count}</p>
    </div>
  );
}

export const FeatureCardActivationContract = {
  name: 'FeatureCard 활성화 계약',
  tags: ['!dev'],
  render: () => <ActivatableFeatureCard
                  headingLevel={2} />,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-contract="activatable"]');
    const count = canvasElement.querySelector('[data-contract="count"]');
    if (!card || !count) throw new Error('활성화 계약 픽스처가 필요합니다.');
    if (card.getAttribute('role') !== 'button' || card.getAttribute('tabindex') !== '0') {
      throw new Error('클릭 대상 카드는 role="button" + tabIndex=0이어야 합니다(WCAG 2.1.1).');
    }
    if (!card.querySelector('h2')) {
      throw new Error('headingLevel은 제목의 heading 레벨을 제어해야 합니다.');
    }
    if (card.querySelector('a, button, input, [tabindex]')) {
      throw new Error('활성화 가능한 카드 안에는 포커스 가능한 요소를 두면 안 됩니다.');
    }
    card.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (count.textContent !== '1') throw new Error('Enter로 카드를 활성화할 수 있어야 합니다.');
    });
    await userEvent.keyboard(' ');
    await waitFor(() => {
      if (count.textContent !== '2') throw new Error('Space로 카드를 활성화할 수 있어야 합니다.');
    });
    card.blur();
  },
};

export const FeatureCardCard = { ...FeatureCardCardStory, name: 'FeatureCard card parity', tags: ['!dev', 'visual-parity'] };
