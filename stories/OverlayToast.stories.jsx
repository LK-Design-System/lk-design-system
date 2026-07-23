import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Toast, ToastStack } from '../src/index.js';
import {
  ToastCard as ToastCardStory,
  ToastStackCard as ToastStackCardStory,
} from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Toast',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-toast--toast-notifications',
      eyebrow: 'Core / Overlay',
      title: 'Toast는 작업을 방해하지 않고 일시적인 상태 변화를 알려줍니다',
      description:
        '저장·게시·업로드처럼 사용자가 이미 시작한 작업의 성공, 주의, 실패 결과를 화면 가장자리에서 잠시 알릴 때 적합합니다. 반드시 읽고 결정해야 하는 내용에는 Alert를, 계속 보존해야 하는 상태에는 Banner를 사용하고 핵심 업무 정보를 Toast에만 의존하지 마세요.',
    },
    docs: {
      description: {
        component: 'Toast 원본에 맞춘 심각도, 아이콘, 액션 축의 일시적 피드백 패턴입니다.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

/* The auto-dismiss policy value is 7초; the fixture shortens it so the timing
   contract can be demonstrated and asserted without a 7 second wait. */
const DEMO_DURATION = 1500;

function DurationPolicyDemo() {
  const [visible, setVisible] = React.useState(true);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start', maxWidth: 680 }}>
      <Button
        data-testid="toast-replay"
        variant="outlined"
        color="assistive"
        onClick={() => setVisible(true)}
      >
        자동 닫힘 Toast 다시 표시
      </Button>
      <div data-testid="auto-slot" style={{ minHeight: 46 }}>
        {visible && (
          <Toast
            data-testid="auto-toast"
            variant="positive"
            duration={DEMO_DURATION}
            onClose={() => setVisible(false)}
          >
            저장되었습니다. 포인터나 초점이 머무는 동안 자동 닫힘이 멈춥니다.
          </Toast>
        )}
      </div>
      <Toast data-testid="actionable-toast" variant="cautionary" duration={DEMO_DURATION} action="검토" onAction={() => {}} onClose={() => {}}>
        검토할 항목이 있어 이 Toast는 자동으로 닫히지 않습니다.
      </Toast>
    </main>
  );
}

const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

export const ToastNotifications = {
  name: '개요',
  parameters: storyDescription(
    'normal·positive·cautionary·negative 심각도와 행동, 닫기, 아이콘 유무를 비교합니다. 색상만으로 상태를 구분하지 않고 메시지와 아이콘이 의미를 보완하며 선택적 행동이 짧고 명확한지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <Section title="Toast 심각도와 아이콘 축">
        <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
          <Toast variant="normal">임시 저장되었습니다.</Toast>
          {/* action 문구는 언제나 실제 핸들러와 함께 둡니다(무동작 버튼 금지). */}
          <Toast variant="positive" action="실행 취소" onAction={() => {}}>변경 사항이 게시되었습니다.</Toast>
          <Toast variant="cautionary">일부 필드는 검토가 필요합니다.</Toast>
          <Toast variant="negative" onClose={() => {}}>업로드에 실패했습니다.</Toast>
          <Toast variant="positive" leadingIcon={false}>리딩 아이콘을 끈 상태입니다.</Toast>
        </div>
      </Section>
    </main>
  ),
};

export const StackAndPlacement = {
  name: '사용법 · 쌓임 순서와 화면 배치',
  parameters: storyDescription(
    '여러 Toast를 화면 오른쪽 아래에 시간순으로 쌓는 배치 계약입니다. 메시지 간 gap과 가장자리 정렬은 ToastStack이 소유하고 queue 순서·dismiss 상태는 제품이 소유하는지 확인하세요.',
  ),
  render: () => (
    <main
      style={{
        position: 'relative',
        width: 'min(680px, 100%)',
        height: 320,
        overflow: 'hidden',
        border: '1px dashed var(--color-semantic-line-normal-neutral)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-normal-alternative)',
      }}
    >
      <ToastStack position="bottom-right" style={{ position: 'absolute' }}>
        <Toast variant="positive">변경 사항이 저장되었습니다.</Toast>
        <Toast variant="cautionary" action="검토" onAction={() => {}}>확인이 필요한 항목이 있습니다.</Toast>
        <Toast variant="negative" onClose={() => {}}>업로드에 실패했습니다.</Toast>
      </ToastStack>
    </main>
  ),
  play: async ({ canvasElement }) => {
    // The stack owns persistent live regions; hosted toasts announce into them
    // instead of each being a live region inserted together with its own text.
    const polite = canvasElement.querySelector('[data-toast-live="polite"]');
    const assertive = canvasElement.querySelector('[data-toast-live="assertive"]');
    if (!polite || !assertive) throw new Error('ToastStack must mount persistent polite and assertive live regions.');
    if (polite.getAttribute('aria-live') !== 'polite' || assertive.getAttribute('aria-live') !== 'assertive') {
      throw new Error('ToastStack live regions must declare their politeness.');
    }

    const strayLiveRegions = [...canvasElement.querySelectorAll('[aria-live]')]
      .filter((node) => node !== polite && node !== assertive);
    if (strayLiveRegions.length > 0) {
      throw new Error('A hosted Toast must not duplicate the stack live region.');
    }

    await waitFor(() => {
      if (!polite.textContent?.trim()) throw new Error('Polite toasts must announce through the stack live region.');
      if (!assertive.textContent?.includes('업로드에 실패했습니다')) {
        throw new Error('A negative Toast must announce through the assertive region.');
      }
    });
  },
};

export const DurationPolicy = {
  name: '시나리오 · 지속시간과 일시정지',
  parameters: storyDescription(
    '행동 없는 성공 Toast는 `duration` 뒤 스스로 닫히고 hover·focus 동안 남은 시간을 보존한 채 멈추며, 행동이 있는 주의 Toast는 duration을 줘도 사용자가 처리할 때까지 유지되는 상황입니다(WCAG 2.2.1). 정책값은 7초이지만 이 예시는 타이밍을 관찰할 수 있도록 1.5초로 줄였습니다.',
  ),
  render: () => <DurationPolicyDemo />,
  play: async ({ canvasElement }) => {
    const autoToast = () => canvasElement.querySelector('[data-testid="auto-toast"]');
    const replay = canvasElement.querySelector('[data-testid="toast-replay"]');
    const actionable = canvasElement.querySelector('[data-testid="actionable-toast"]');
    if (!autoToast() || !replay || !actionable) throw new Error('The duration fixture requires both toasts and a replay control.');

    // 1) Hover pauses the timer: well past the duration, the toast is still up.
    await userEvent.hover(autoToast());
    await waitFor(() => {
      if (!autoToast()?.hasAttribute('data-toast-paused')) throw new Error('Hovering a Toast must pause its auto-dismiss timer.');
    });
    await wait(DEMO_DURATION + 600);
    if (!autoToast()) throw new Error('A hovered Toast must not auto-dismiss.');

    // 2) Leaving resumes it, and the toast closes on its own.
    await userEvent.unhover(autoToast());
    await waitFor(() => {
      if (autoToast()) throw new Error('Toast must auto-dismiss once the pointer leaves.');
    }, { timeout: DEMO_DURATION * 3 });

    // 3) Keyboard focus inside the toast pauses it just like hover.
    await userEvent.click(replay);
    await waitFor(() => {
      if (!autoToast()) throw new Error('The replay control must bring the Toast back.');
    });
    autoToast().querySelector('button')?.focus();
    await waitFor(() => {
      if (!autoToast()?.hasAttribute('data-toast-paused')) throw new Error('Focus inside a Toast must pause its auto-dismiss timer.');
    });
    await wait(DEMO_DURATION + 600);
    if (!autoToast()) throw new Error('A Toast holding keyboard focus must not auto-dismiss.');

    // 4) WCAG 2.2.1: an actionable toast refuses auto-dismiss outright.
    if (!canvasElement.querySelector('[data-testid="actionable-toast"]')) {
      throw new Error('A Toast with an action must never auto-dismiss, even with a duration.');
    }
    if (actionable.hasAttribute('data-toast-paused')) {
      throw new Error('An actionable Toast has no timer to pause.');
    }
  },
};

export const ToastCard = { ...ToastCardStory, name: 'Toast card parity', tags: ['!dev', 'visual-parity'] };
export const ToastStackCard = { ...ToastStackCardStory, name: 'ToastStack card parity', tags: ['!dev', 'visual-parity'] };
