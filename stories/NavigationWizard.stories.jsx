import React from 'react';
import { Button, DescriptionList, FormField, Input, TextButton, Wizard } from '../src/index.js';
import { fireEvent, userEvent } from 'storybook/test';
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
    '작성·검토·게시 흐름의 읽기 순서는 인디케이터 → 단계 heading → 본문 → 푸터입니다. 각 단계 본문은 그 단계의 결과를 말하는 heading으로 시작하고, 이전·다음 제어로 현재 단계를 바꾸면 마지막 단계에서 다음이 비활성화됩니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <Wizard steps={['작성', '검토', '게시']} defaultCurrent={1}>
        {(step) => {
          const bodies = [
            {
              heading: '보고서 작성',
              body: (
                <FormField label="제목">
                  <Input placeholder="입력해 주세요." defaultValue="8월 정기 보고서" />
                </FormField>
              ),
            },
            {
              heading: '내용 검토',
              body: (
                <DescriptionList
                  items={[
                    { term: '제목', description: '8월 정기 보고서' },
                    { term: '기간', description: '2026-08-01 ~ 2026-08-13' },
                  ]}
                />
              ),
            },
            {
              heading: '게시',
              body: (
                <p style={{ margin: 0, fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}>
                  게시하면 구성원에게 공유됩니다.
                </p>
              ),
            },
          ];
          const { heading, body } = bodies[step];
          return (
            <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <h2 style={{ margin: 0, fontSize: 'var(--heading1-size)', lineHeight: 'var(--heading1-line)', letterSpacing: 'var(--heading1-spacing)', color: 'var(--color-semantic-label-normal)' }}>{heading}</h2>
              {body}
            </section>
          );
        }}
      </Wizard>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const indicator = canvasElement.querySelector('ol');
    if (!indicator) throw new Error('The wizard indicator must reuse the Steps ordered list.');
    const currentStep = indicator.querySelector('li[aria-current="step"]');
    if (!currentStep || !currentStep.textContent.includes('검토')) {
      throw new Error('The wizard indicator must mark the current step with aria-current="step".');
    }
    const content = canvasElement.querySelector('[aria-live="polite"]');
    const heading = content?.querySelector('h2');
    if (!heading || heading.textContent !== '내용 검토') {
      throw new Error('Step content must begin with the step heading inside the live content region.');
    }
    const footer = canvasElement.querySelector('button')?.closest('div');
    if (!(indicator.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Reading order must stay indicator → step content → footer.');
    }
    const [previous, next] = canvasElement.querySelectorAll('button');
    if (!(previous.compareDocumentPosition(next) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Tab order must reach 이전 before 다음/완료.');
    }
    const field = content.querySelector('input');
    if (field && !(field.compareDocumentPosition(previous) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Tab order must reach the step content before the footer controls.');
    }
    next?.focus();
    await userEvent.keyboard('{Enter}');
    if (!next?.disabled) throw new Error('Next must advance to the final step and become disabled.');
    if (content.querySelector('h2')?.textContent !== '게시') {
      throw new Error('The step heading must follow the active step.');
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
        <Button variant="outlined" color="assistive" data-testid="approve-transition" style={{ marginTop: 'var(--space-3)' }} onClick={() => approveAsyncGuard && approveAsyncGuard(true)}>전환 승인</Button>
      </section>
      <section data-testid="wizard-context-footer">
        <Wizard
          steps={['작성', '검토', '게시']}
          onComplete={() => {}}
          footer={(ctx) => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'var(--space-6)' }}>
              <Button variant="outlined" color="assistive" data-testid="ctx-back" onClick={ctx.back} disabled={ctx.isFirst || ctx.pending}>뒤로</Button>
              <span data-testid="ctx-position" style={{ fontSize: 'var(--label1-size)', color: 'var(--color-semantic-label-alternative)' }}>{ctx.current + 1}/{ctx.count}</span>
              <Button variant="solid" color="primary" data-testid="ctx-next" onClick={ctx.next} disabled={ctx.pending}>
                {ctx.nextIsComplete ? '제출' : '계속'}
              </Button>
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
    if (!ctxNext.textContent.includes('제출')) {
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

/* 제출 전 확인 단계에서 특정 답을 고치러 원래 단계로 돌아가는 경로. 위저드가
   시작하지 않은 전환(제품이 `current`를 직접 바꾸는 변경 액션)에는 위저드가
   focus를 옮기지 않으므로, 복귀 focus는 제품이 소유한다는 계약을 고정한다.
   값 표현 계약은 DescriptionList 쪽 스토리가, 규칙은
   docs/CHECK_ANSWERS_PATTERN.md가 소유한다. */
function ReviewReturnDemo() {
  const steps = ['유형', '기간', '확인'];
  const [current, setCurrent] = React.useState(2);
  const [type, setType] = React.useState('주간 운영 보고서');
  const headingRef = React.useRef(null);
  const [pendingFocus, setPendingFocus] = React.useState(false);

  React.useEffect(() => {
    if (!pendingFocus) return;
    setPendingFocus(false);
    headingRef.current?.focus();
  }, [current, pendingFocus]);

  const changeAnswer = (index) => {
    setCurrent(index);
    setPendingFocus(true);
  };

  return (
    <Wizard
      steps={steps}
      current={current}
      onStepChange={setCurrent}
      footer={(ctx) => (ctx.isLast ? null : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
          <Button variant="solid" color="primary" data-testid="back-to-review" onClick={() => changeAnswer(2)}>
            확인으로 돌아가기
          </Button>
        </div>
      ))}
    >
      {(step) => (
        <section style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <h2
            ref={headingRef}
            tabIndex={-1}
            data-step-heading={step}
            style={{ margin: 0, fontSize: 'var(--heading1-size)', lineHeight: 'var(--heading1-line)', outline: 'none' }}
          >
            {['보고서 유형 선택', '대상 기간 선택', '선택 내용 확인'][step]}
          </h2>
          {step === 0 && (
            <FormField label="보고서 유형">
              <Input data-testid="type-input" value={type} onChange={(event) => setType(event.target.value)} />
            </FormField>
          )}
          {step === 1 && <p style={{ margin: 0 }}>2026-08-01 ~ 2026-08-13</p>}
          {step === 2 && (
            <DescriptionList
              items={[
                {
                  term: '보고서 유형',
                  description: (
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                      <span data-testid="review-type">{type}</span>
                      <TextButton size="sm" data-testid="change-type" onClick={() => changeAnswer(0)}>보고서 유형 변경</TextButton>
                    </span>
                  ),
                },
                {
                  term: '대상 기간',
                  description: (
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
                      <span>2026-08-01 ~ 2026-08-13</span>
                      <TextButton size="sm" data-testid="change-period" onClick={() => changeAnswer(1)}>대상 기간 변경</TextButton>
                    </span>
                  ),
                },
              ]}
            />
          )}
        </section>
      )}
    </Wizard>
  );
}

export const ReviewChangeReturn = {
  name: '확인 단계에서 원래 단계로 복귀',
  tags: ['!dev'],
  parameters: storyDescription(
    '확인 단계의 변경 액션이 해당 답을 입력한 단계로 돌아가고, 그 단계의 heading으로 focus가 이어집니다. 되돌아온 뒤에도 입력값이 유지되고, 수정한 값이 확인 단계에 반영되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <ReviewReturnDemo />
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
    const currentLabel = () => canvasElement.querySelector('li[aria-current="step"]')?.textContent || '';

    if (!currentLabel().includes('확인')) throw new Error('The demo must start on the review step.');
    const original = canvasElement.querySelector('[data-testid="review-type"]')?.textContent;

    await userEvent.click(canvasElement.querySelector('[data-testid="change-type"]'));
    await waitFor(() => currentLabel().includes('유형'), 'A change action must return to the step that owns the answer.');
    await waitFor(
      () => document.activeElement === canvasElement.querySelector('[data-step-heading="0"]'),
      'After a change action the product must move focus to that step heading.',
    );

    const input = canvasElement.querySelector('[data-testid="type-input"]');
    if (input?.value !== original) throw new Error('Returning to a step must preserve the value already entered.');
    /* 한글은 userEvent.type의 조합 입력을 거치지 않으므로 값 변경만 직접 발생시킨다. */
    fireEvent.change(input, { target: { value: '월간 운영 보고서' } });
    await waitFor(() => input.value === '월간 운영 보고서', 'The edited answer must land in the controlled input.');

    await userEvent.click(canvasElement.querySelector('[data-testid="back-to-review"]'));
    await waitFor(() => currentLabel().includes('확인'), 'Finishing an edit must return to the review step.');
    await waitFor(
      () => document.activeElement === canvasElement.querySelector('[data-step-heading="2"]'),
      'Returning to review must move focus to the review heading.',
    );
    if (canvasElement.querySelector('[data-testid="review-type"]')?.textContent !== '월간 운영 보고서') {
      throw new Error('The review step must show the edited answer.');
    }
  },
};
