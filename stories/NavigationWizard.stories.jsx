import { Wizard } from '../src/index.js';
import { userEvent } from 'storybook/test';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/Wizard',
  component: Wizard,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-wizard--multi-step-flow',
      eyebrow: 'Product / Wizard',
      title: '위저드는 단계 표시와 콘텐츠·이동 제어를 하나의 흐름으로 묶습니다',
      description:
        '입력과 검토가 순서대로 이어지고 이전·다음 동작을 패턴이 소유할 때 적합합니다. 현재 단계만 읽히면 충분한 화면에는 Wizard 대신 Steps를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Wizard는 단계 인디케이터, 콘텐츠, 뒤로/다음 제어를 묶어 순서가 있는 다단계 워크플로를 제어하는 LK Product Extension입니다. 진행 표시만 필요할 때는 단계 표시 패턴을 사용합니다.',
      },
    },
  },
};

export default meta;

export const MultiStepFlow = {
  name: '개요',
  parameters: storyDescription(
    '작성·검토·게시 흐름에서 이전·다음 제어로 현재 단계를 바꿉니다. 마지막 단계에서 다음이 비활성화되고 이전 이동 후 다시 활성화되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Wizard steps={['작성', '검토', '게시']} defaultCurrent={1} />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const [previous, next] = canvasElement.querySelectorAll('button');
    next?.focus();
    await userEvent.keyboard('{Enter}');
    if (!next?.disabled) throw new Error('Next must advance to the final step and become disabled.');
    previous?.focus();
    await userEvent.keyboard('{Enter}');
    if (next?.disabled) throw new Error('Previous must return to the prior step and re-enable Next.');
  },
};
