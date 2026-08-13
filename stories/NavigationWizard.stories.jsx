import { Wizard } from '../src/index.js';
import { userEvent } from 'storybook/test';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/Wizard',
  tags: ['autodocs'],
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

/* Play-controlled resolver for the async-guard fixture below — resolving via a
 * story button keeps the pending window deterministic (no timers to race). */
let approveAsyncGuard;

export const GuardedTransition = {
  name: '전환 guard와 pending',
  tags: ['!dev'],
  parameters: storyDescription(
    'onBeforeStepChange가 false를 반환하면 현재 단계와 입력값이 유지되고, promise를 반환하면 settle까지 이전·다음이 비활성화됩니다. 위저드가 시작한 전환 후에는 단계 콘텐츠 영역으로 focus가 이동합니다. footer 함수는 내비게이션 컨텍스트를 받아 기본 의미를 유지한 채 표현만 바꿉니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
      <section data-testid="wizard-sync-guard">
        <Wizard
          steps={['작성', '검토', '게시']}
          onBeforeStepChange={(next, current) => {
            if (next < current) return true;
            const agree = document.querySelector('[data-testid="agree"]');
            return Boolean(agree?.checked);
          }}
        >
          {(step) => (
            <label style={{ display: 'inline-flex', gap: 'var(--space-2)', fontSize: 'var(--body2-size)' }}>
              <input type="checkbox" data-testid="agree" /> {step}단계 입력을 확인했습니다
            </label>
          )}
        </Wizard>
      </section>
      <section data-testid="wizard-async-guard">
        <Wizard
          steps={['작성', '검토', '게시']}
          onBeforeStepChange={() => new Promise((resolve) => { approveAsyncGuard = resolve; })}
        />
        <button type="button" data-testid="approve-transition" style={{ minHeight: 44, padding: '0 16px', marginTop: 'var(--space-3)' }} onClick={() => approveAsyncGuard && approveAsyncGuard(true)}>전환 승인</button>
      </section>
      <section data-testid="wizard-context-footer">
        <Wizard
          steps={['작성', '검토', '게시']}
          onComplete={() => {}}
          footer={(ctx) => (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
              <button type="button" data-testid="ctx-back" style={{ minHeight: 44, padding: '0 16px' }} onClick={ctx.back} disabled={ctx.isFirst || ctx.pending}>뒤로</button>
              <span data-testid="ctx-position" style={{ alignSelf: 'center' }}>{ctx.current + 1}/{ctx.count}</span>
              <button type="button" data-testid="ctx-next" style={{ minHeight: 44, padding: '0 16px' }} onClick={ctx.next} disabled={ctx.pending}>
                {ctx.nextIsComplete ? '제출' : '계속'}
              </button>
            </div>
          )}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const waitFor = async (predicate, message) => {
      const deadline = Date.now() + 3000;
      while (!predicate()) {
        if (Date.now() > deadline) throw new Error(message);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };
    const syncSection = canvasElement.querySelector('[data-testid="wizard-sync-guard"]');
    const currentLabel = (section) => section.querySelector('li[aria-current="step"]')?.textContent || '';
    const [, syncNext] = syncSection.querySelectorAll('button');
    syncNext.focus();
    await userEvent.keyboard('{Enter}');
    if (!currentLabel(syncSection).includes('작성')) {
      throw new Error('A guard returning false must keep the current step.');
    }
    const agree = syncSection.querySelector('[data-testid="agree"]');
    await userEvent.click(agree);
    await userEvent.click(syncNext);
    if (!currentLabel(syncSection).includes('검토')) {
      throw new Error('A passing guard must let the transition commit.');
    }
    const liveRegion = syncSection.querySelector('[aria-live="polite"]');
    await waitFor(
      () => document.activeElement === liveRegion,
      'After a wizard-initiated transition, focus must move to the step content region.',
    );

    const asyncSection = canvasElement.querySelector('[data-testid="wizard-async-guard"]');
    const [asyncPrev, asyncNext] = asyncSection.querySelectorAll('button');
    await userEvent.click(asyncNext);
    await waitFor(
      () => asyncNext.disabled && asyncPrev.disabled,
      'While an async guard is pending, back and next must be blocked.',
    );
    if (asyncSection.querySelector('[aria-live="polite"]')?.getAttribute('aria-busy') !== 'true') {
      throw new Error('The step content region must expose aria-busy while a guard is pending.');
    }
    if (currentLabel(asyncSection).includes('검토')) {
      throw new Error('The transition must not commit before the guard settles.');
    }
    await userEvent.click(asyncSection.querySelector('[data-testid="approve-transition"]'));
    await waitFor(
      () => currentLabel(asyncSection).includes('검토'),
      'A guard resolving true must commit the transition after settling.',
    );
    await waitFor(
      () => !asyncNext.disabled,
      'Controls must re-enable once the guard settles.',
    );

    const ctxSection = canvasElement.querySelector('[data-testid="wizard-context-footer"]');
    const ctxBack = ctxSection.querySelector('[data-testid="ctx-back"]');
    const ctxNext = ctxSection.querySelector('[data-testid="ctx-next"]');
    if (!ctxBack.disabled) throw new Error('The footer context must report isFirst on the first step.');
    await userEvent.click(ctxNext);
    await userEvent.click(ctxNext);
    if (!currentLabel(ctxSection).includes('게시')) {
      throw new Error('footer context next() must drive the same guarded navigation.');
    }
    if (ctxNext.textContent !== '제출') {
      throw new Error('The footer context must expose nextIsComplete on the last step.');
    }
    if (ctxSection.querySelector('[data-testid="ctx-position"]')?.textContent !== '3/3') {
      throw new Error('The footer context must expose current and count.');
    }
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
