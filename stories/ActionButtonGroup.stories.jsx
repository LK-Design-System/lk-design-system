import React from 'react';
import { userEvent } from 'storybook/test';
import { ButtonGroup } from '../src/index.js';
import { ButtonIconButtonSocialButtonCard as ButtonIconButtonSocialButtonCardStory } from './ButtonsExtended.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/Button Group',
  component: ButtonGroup,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-action-button-group--button-groups',
      eyebrow: 'Core / Button Group',
      title: '사용자가 연결된 선택지에서 현재 보기나 모드를 빠르게 전환합니다',
      description:
        '같은 맥락에서 하나 또는 여러 개의 짧은 토글 옵션을 맞닿은 버튼으로 제공할 때 적합합니다. 페이지 이동이나 긴 폼 선택에는 Button Group 대신 Tabs, Radio Group 또는 Select를 사용하세요.',
    },
    docs: {
      description: {
        component:
          '버튼 그룹은 연결된 토글 버튼의 선택 상태와 변경을 소유하는 Core 컴포넌트입니다. 이 페이지에 숨겨 둔 버튼·아이콘 버튼·소셜 버튼 계열의 시각 회귀 자료는 기존 검증을 잃지 않기 위한 보조 증거이며, 해당 컴포넌트의 소유권이나 사용 지침을 뜻하지 않습니다.',
      },
    },
  },
};

export default meta;

function ButtonGroupDemo() {
  const [view, setView] = React.useState('목록');

  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 640 }}>
      <ButtonGroup options={['목록', '카드', '지도']} value={view} onChange={setView} />
      <p aria-live="polite" style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }}>
        현재 보기: <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{view}</strong>
      </p>
    </main>
  );
}

export const ButtonGroups = {
  name: '개요',
  parameters: storyDescription(
    '동일한 데이터의 목록·카드·지도 보기를 즉시 바꾸는 상황입니다. 선택 상태가 aria-pressed와 시각적 강조로 함께 전달되고 변경 결과가 바로 반영되는지 확인하세요.',
  ),
  render: () => <ButtonGroupDemo />,
};

export const SelectionContracts = {
  name: '상호작용 · 단일·복수 선택',
  parameters: storyDescription(
    '서로 배타적인 보기 전환과 여러 표시 옵션을 각각 검증하는 상황입니다. 단일 선택은 Segmented Control의 radio 규칙과 방향키 이동을 공유하고, 복수 선택은 각 버튼의 pressed 상태를 독립적으로 바꾸며 비활성 옵션은 건너뜁니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <ButtonGroup
        data-contract="single"
        aria-label="결과 보기"
        options={['목록', '카드', { value: '지도', label: '지도', disabled: true }]}
        defaultValue="목록"
      />
      <ButtonGroup
        data-contract="multiple"
        aria-label="표시 옵션"
        multiple
        options={[
          { value: 'label', label: '레이블' },
          { value: 'grid', label: '그리드', disabled: true },
          { value: 'guide', label: '가이드' },
        ]}
        defaultValue={['label']}
      />
      <section style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        {['sm', 'md', 'lg'].map((size) => (
          <ButtonGroup
            key={size}
            data-contract={`size-${size}`}
            aria-label={`${size} 정렬 옵션`}
            multiple
            size={size}
            options={['왼쪽', '가운데']}
          />
        ))}
        <ButtonGroup aria-label="비활성 보기" options={['목록', '카드']} disabled />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const single = canvasElement.querySelector('[data-contract="single"]');
    const multiple = canvasElement.querySelector('[data-contract="multiple"]');
    if (!single || !multiple) throw new Error('ButtonGroup contract targets are required.');
    if (single.getAttribute('role') !== 'radiogroup') throw new Error('Single ButtonGroup must compose the SegmentedControl radio contract.');
    const radios = Array.from(single.querySelectorAll('[role="radio"]'));
    radios[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    if (radios[1].getAttribute('aria-checked') !== 'true') throw new Error('Single ButtonGroup must support roving radio selection.');

    if (multiple.getAttribute('role') !== 'group' || multiple.getAttribute('aria-label') !== '표시 옵션') {
      throw new Error('Multiple ButtonGroup needs a named group contract.');
    }
    const toggles = Array.from(multiple.querySelectorAll('button'));
    if (toggles[0].getAttribute('aria-pressed') !== 'true') throw new Error('Default multiple selection is missing.');
    await userEvent.click(toggles[0]);
    if (toggles[0].getAttribute('aria-pressed') !== 'false') throw new Error('Multiple ButtonGroup must toggle independently.');
    if (!toggles[1].disabled) throw new Error('Disabled ButtonGroup options must remain unavailable.');

    const expectedHeights = { sm: 32, md: 40, lg: 48 };
    for (const [size, expectedHeight] of Object.entries(expectedHeights)) {
      const button = canvasElement.querySelector(`[data-contract="size-${size}"] button`);
      if (!button || Math.abs(button.getBoundingClientRect().height - expectedHeight) > 0.5) {
        throw new Error(`${size} ButtonGroup must use the ${expectedHeight}px Button scale.`);
      }
    }
  },
};

export const ButtonIconButtonSocialButtonCard = {
  ...ButtonIconButtonSocialButtonCardStory,
  name: 'Button · IconButton · SocialButton family parity',
  tags: ['!dev', 'visual-parity'],
};
