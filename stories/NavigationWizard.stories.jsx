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
    const indicator = canvasElement.querySelector('ol');
    if (!indicator) throw new Error('The wizard indicator must reuse the Steps ordered list.');
    const currentStep = indicator.querySelector('li[aria-current="step"]');
    if (!currentStep || !currentStep.textContent.includes('검토')) {
      throw new Error('The wizard indicator must mark the current step with aria-current="step".');
    }
    const [previous, next] = canvasElement.querySelectorAll('button');
    next?.focus();
    await userEvent.keyboard('{Enter}');
    if (!next?.disabled) throw new Error('Next must advance to the final step and become disabled.');
    if (indicator.querySelector('li[aria-current="step"]')?.textContent.includes('검토')) {
      throw new Error('aria-current="step" must follow the active step.');
    }
    previous?.focus();
    await userEvent.keyboard('{Enter}');
    if (next?.disabled) throw new Error('Previous must return to the prior step and re-enable Next.');
  },
};

export const CompletionContract = {
  name: '완료 액션과 커스텀 푸터',
  tags: ['!dev'],
  parameters: storyDescription(
    'onComplete가 있으면 마지막 단계의 다음 버튼이 완료 버튼이 되고, footer 노드를 넘기면 내장 컨트롤 대신 커스텀 푸터가 렌더됩니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
      <section data-testid="wizard-complete">
        <Wizard
          steps={['작성', '검토', '게시']}
          defaultCurrent={2}
          onComplete={() => {
            const flag = document.querySelector('[data-testid="complete-flag"]');
            if (flag) flag.textContent = 'completed';
          }}
        />
        <output data-testid="complete-flag" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }} />
      </section>
      <section data-testid="wizard-custom-footer">
        <Wizard steps={['작성', '검토', '게시']} defaultCurrent={0} footer={<div data-testid="custom-footer">커스텀 푸터</div>} />
      </section>
      <section data-testid="wizard-no-footer">
        <Wizard steps={['작성', '검토', '게시']} defaultCurrent={0} footer={null} />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const completeSection = canvasElement.querySelector('[data-testid="wizard-complete"]');
    const buttons = completeSection.querySelectorAll('button');
    const completeButton = Array.from(buttons).find((b) => b.textContent === '완료');
    if (!completeButton || completeButton.disabled) {
      throw new Error('With onComplete, the last-step next button must become an enabled 완료 action.');
    }
    completeButton.focus();
    await userEvent.keyboard('{Enter}');
    const flag = canvasElement.querySelector('[data-testid="complete-flag"]');
    if (flag?.textContent !== 'completed') throw new Error('The 완료 button must fire onComplete.');

    const customSection = canvasElement.querySelector('[data-testid="wizard-custom-footer"]');
    if (!customSection.querySelector('[data-testid="custom-footer"]')) {
      throw new Error('A footer node must render as the custom footer.');
    }
    if (customSection.querySelector('button')) {
      throw new Error('A custom footer must replace the built-in 이전/다음 controls.');
    }

    const bareSection = canvasElement.querySelector('[data-testid="wizard-no-footer"]');
    if (bareSection.querySelector('button')) {
      throw new Error('footer={null} must hide the built-in controls.');
    }
  },
};
