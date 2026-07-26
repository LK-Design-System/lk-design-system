import { userEvent, waitFor } from 'storybook/test';
import { Icon, ToggleButton } from '../src/index.js';
import { ToggleButtonCard as ToggleButtonCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Selection and Input/Toggle Button',
  tags: ['autodocs'],
  component: ToggleButton,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-selection-and-input-toggle-button--toggle-button-overview',
      eyebrow: 'Product / Toggle Button',
      title: '토글 버튼은 하나의 기능이 켜졌는지 버튼 자체에 유지합니다',
      description:
        '레이어 표시·미리보기처럼 즉시 실행 후 pressed 상태가 계속 남는 독립 기능에 적합합니다. 여러 보기 중 하나를 고르는 전환에는 Toggle Button 대신 Segmented Control을 사용하세요.',
    },
    docs: {
      description: {
        component:
          '버튼의 action affordance와 aria-pressed 이진 상태를 결합한 LK Product Extension ToggleButton입니다.',
      },
    },
  },
};

export default meta;

export const ToggleButtonOverview = {
  name: '개요',
  parameters: storyDescription(
    '레이어 옵션은 켜져 있고 미리보기는 꺼져 있는 두 독립 토글을 비교합니다. 각 버튼의 아이콘·label·pressed 상태가 다른 버튼과 무관하게 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', maxWidth: 560 }}>
      <ToggleButton defaultPressed icon={<Icon name="layers" size={17} />}>옵션</ToggleButton>
      <ToggleButton icon={<Icon name="eye" size={17} />}>미리보기</ToggleButton>
    </main>
  ),
};

export const InteractionAndSizeContract = {
  name: '상호작용 · 크기와 지속 상태',
  parameters: storyDescription(
    '독립 토글 행동의 32·40·48px 크기, hover·pressed·비활성 상태를 비교하는 상황입니다. 순간 눌림 피드백과 클릭 뒤 유지되는 aria-pressed 상태가 구분되고 aria-disabled는 초점은 유지하되 토글되지 않아야 합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 680 }}>
      <section style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        {['sm', 'md', 'lg'].map((size) => (
          <ToggleButton key={size} size={size} data-contract={`size-${size}`} icon={<Icon name="layers" size={17} aria-hidden="true" />}>
            {size} 레이어
          </ToggleButton>
        ))}
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
        <ToggleButton data-contract="interactive" icon={<Icon name="eye" size={17} aria-hidden="true" />}>미리보기</ToggleButton>
        <ToggleButton data-contract="aria-disabled" aria-disabled="true" icon={<Icon name="pin" size={17} aria-hidden="true" />}>권한 필요</ToggleButton>
        <ToggleButton disabled icon={<Icon name="star" size={17} aria-hidden="true" />}>비활성</ToggleButton>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const interactive = canvasElement.querySelector('[data-contract="interactive"]');
    const ariaDisabled = canvasElement.querySelector('[data-contract="aria-disabled"]');
    if (!interactive || !ariaDisabled) throw new Error('ToggleButton contract targets are required.');
    if (interactive.getAttribute('aria-pressed') !== 'false') throw new Error('ToggleButton must expose its initial pressed state.');

    const restBackground = getComputedStyle(interactive).backgroundColor;
    await userEvent.hover(interactive);
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === restBackground) throw new Error('ToggleButton hover feedback is missing.');
    });
    const hoverBackground = getComputedStyle(interactive).backgroundColor;
    interactive.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === hoverBackground) throw new Error('ToggleButton pressed feedback must differ from hover.');
    });
    interactive.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await userEvent.click(interactive);
    if (interactive.getAttribute('aria-pressed') !== 'true') throw new Error('ToggleButton must retain its toggled state.');

    const expectedHeights = { sm: 32, md: 40, lg: 48 };
    for (const [size, expectedHeight] of Object.entries(expectedHeights)) {
      const button = canvasElement.querySelector(`[data-contract="size-${size}"]`);
      if (!button || Math.abs(button.getBoundingClientRect().height - expectedHeight) > 0.5) {
        throw new Error(`${size} ToggleButton must use the ${expectedHeight}px Button scale.`);
      }
    }
    ariaDisabled.focus();
    if (canvasElement.ownerDocument.activeElement !== ariaDisabled) throw new Error('aria-disabled ToggleButton must remain focusable.');
    await userEvent.click(ariaDisabled);
    if (ariaDisabled.getAttribute('aria-pressed') !== 'false') throw new Error('aria-disabled ToggleButton must not toggle.');
  },
};

export const ToggleButtonCard = {
  ...ToggleButtonCardStory,
  name: 'ToggleButton card parity',
  tags: ['!dev', 'visual-parity'],
};
