import { Steps } from '../src/index.js';
import { StepsCard as StepsCardStory } from './NavigationFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/Steps',
  tags: ['autodocs'],
  component: Steps,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-steps--step-progress',
      eyebrow: 'Product / Steps',
      title: '단계 표시는 순서가 있는 작업에서 현재 위치를 알려줍니다',
      description:
        '작성·검토·게시처럼 정해진 순서와 현재 단계만 보여줄 때 적합합니다. 단계별 콘텐츠와 이전·다음 제어까지 함께 소유해야 하면 Steps 대신 Wizard를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Steps는 순서가 있는 워크플로의 진행 상태를 가로 단계로 표시하는 LK Product Extension입니다. 콘텐츠와 이전/다음 제어까지 필요하면 위저드 패턴을 사용합니다.',
      },
    },
  },
};

export default meta;

export const StepProgress = {
  name: '개요',
  parameters: storyDescription(
    '작성·검토·게시 중 검토 단계에 있는 진행 상태입니다. 완료·현재·예정 단계가 순서와 텍스트를 통해 함께 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Steps steps={['작성', '검토', '게시']} current={1} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector('ol');
    if (!list) throw new Error('Steps must render as an ordered list.');
    const items = list.querySelectorAll('li');
    if (items.length !== 3) throw new Error('Steps must render one list item per step.');
    const current = list.querySelector('li[aria-current="step"]');
    if (!current || !current.textContent.includes('검토')) {
      throw new Error('The current step list item must carry aria-current="step".');
    }
    const stateTexts = ['완료', '현재 단계', '예정'];
    items.forEach((item, i) => {
      if (!item.textContent.includes(stateTexts[i])) {
        throw new Error(`Step ${i} must expose the visually-hidden state text "${stateTexts[i]}".`);
      }
    });
    const upcomingNumber = items[2]?.querySelector('span');
    if (upcomingNumber?.style.color !== 'var(--color-semantic-label-alternative)') {
      throw new Error('Upcoming step numerals must use the readable alternative-label foreground.');
    }
  },
};

export const LabelPolicy = {
  name: '좁은 화면 label 정책',
  tags: ['!dev'],
  parameters: storyDescription(
    '긴 한국어 단계명이 320px에 맞지 않을 때 라벨을 줄이는 대신 labelPolicy로 표시 범위를 줄입니다. current-only는 현재 단계 라벨만, none은 라벨 전부를 시각적으로 숨기며, 어떤 정책에서도 sr-only 라벨과 상태 텍스트는 유지됩니다.',
  ),
  render: () => {
    const longSteps = ['보고서 유형 선택', '활동 기록 다중 선택', '선택 내용 확인'];
    return (
      <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 320 }}>
        <section data-testid="steps-current-only">
          <Steps steps={longSteps} current={1} labelPolicy="current-only" />
        </section>
        <section data-testid="steps-none">
          <Steps steps={longSteps} current={1} labelPolicy="none" />
        </section>
      </main>
    );
  },
  play: async ({ canvasElement }) => {
    const currentOnly = canvasElement.querySelector('[data-testid="steps-current-only"]');
    const items = currentOnly.querySelectorAll('li');
    const labelSpan = (item) => item.querySelector('span > span:last-of-type')?.parentElement;
    if (labelSpan(items[1])?.style.position === 'absolute') {
      throw new Error('current-only must keep the current step label visible.');
    }
    for (const index of [0, 2]) {
      if (labelSpan(items[index])?.style.position !== 'absolute') {
        throw new Error('current-only must visually hide non-current step labels.');
      }
      if (!items[index].textContent.includes('선택')) {
        throw new Error('A hidden label must stay in the accessibility tree as sr-only text.');
      }
    }
    if (!currentOnly.querySelector('li[aria-current="step"]')) {
      throw new Error('labelPolicy must not change the aria-current contract.');
    }
    const none = canvasElement.querySelector('[data-testid="steps-none"]');
    none.querySelectorAll('li').forEach((item, index) => {
      if (labelSpan(item)?.style.position !== 'absolute') {
        throw new Error(`labelPolicy="none" must visually hide the label of step ${index}.`);
      }
      if (!item.textContent.trim()) {
        throw new Error('Hidden labels must keep sr-only text for assistive tech.');
      }
    });
  },
};

export const StepsCard = { ...StepsCardStory, name: 'Steps card parity', tags: ['!dev', 'visual-parity'] };
