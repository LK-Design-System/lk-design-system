import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Snackbar } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Overlay/Snackbar',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-overlay-snackbar--snackbar-patterns',
      eyebrow: 'Core / Overlay',
      title: 'Snackbar는 흐름을 막지 않고 짧은 결과와 다음 행동을 알립니다',
      description:
        '사용자 동작 직후 잠시 나타나 결과를 설명하고 보기·다시 시도 같은 하나의 후속 행동을 제공할 때 적합합니다. 여러 알림을 화면 가장자리에 쌓으려면 Toast를, 계속 남아야 하는 상태나 절차 안내에는 Banner나 Callout을 사용하세요.',
    },
    docs: {
      description: {
        component: 'Snackbar 원본에 맞춘 heading, description, icon, close button, action 축의 일시적 피드백 패턴입니다.',
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

export const SnackbarPatterns = {
  name: '개요',
  parameters: storyDescription(
    '제목·설명·아이콘·닫기·후속 행동을 조합한 Snackbar를 비교합니다. 메시지가 짧고 자립적으로 이해되며 행동이 하나로 제한되고 닫기 유무와 관계없이 핵심 결과가 전달되는지 확인하세요. 닫기 버튼은 실제 `onClose`가 있을 때만 렌더링됩니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <Section title="Snackbar의 heading, description, icon, close button, action 축">
        <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <Snackbar heading="초안이 저장되었습니다" action="보기" onAction={() => {}} />
          <Snackbar description="리포트는 활동 이력에서 복원할 수 있습니다." leadingIcon />
          <Snackbar heading="초대를 보냈습니다" description="구성원에게 곧 이메일이 발송됩니다." leadingIcon closeButton onClose={() => {}} />
          <Snackbar tone="negative" description="네트워크 연결이 불안정합니다." leadingIcon action="다시 시도" onAction={() => {}} onClose={() => {}} />
        </div>
      </Section>
    </main>
  ),
};

function SnackbarContractFixture() {
  const [log, setLog] = React.useState('동작 전');
  const [closed, setClosed] = React.useState(false);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start', maxWidth: 680 }}>
      <div data-testid="polite-snackbar">
        <Snackbar
          heading="초안이 저장되었습니다"
          description="활동 이력에서 언제든 되돌릴 수 있습니다."
          leadingIcon
          action="보기"
          onAction={() => setLog('보기 실행')}
        />
      </div>
      <div data-testid="urgent-snackbar">
        <Snackbar
          tone="negative"
          description="네트워크 연결이 불안정합니다."
          leadingIcon
          action="다시 시도"
          onAction={() => setLog('재시도 실행')}
        />
      </div>
      {/* 핸들러가 없는 닫기 축: 죽은 컨트롤을 만들지 않고 아무것도 렌더링하지 않습니다. */}
      <div data-testid="handlerless-snackbar">
        <Snackbar description="닫기 핸들러가 없는 Snackbar입니다." closeButton />
      </div>
      <div data-testid="closable-snackbar">
        {!closed && <Snackbar description="닫기 핸들러가 있는 Snackbar입니다." closeButton onClose={() => setClosed(true)} />}
      </div>
      <p data-testid="snackbar-log" aria-live="polite" style={{ margin: 0 }}>{log}</p>
    </main>
  );
}

export const SnackbarSeverityAndActions = {
  name: '상호작용 · 심각도 낭독과 동작 도달',
  parameters: storyDescription(
    'Snackbar의 severity 축이 announce 강도를 정하고, 후속 행동과 닫기가 키보드로 도달 가능한지 확인하는 계약입니다. 오류 메시지는 Toast와 같은 규칙으로 assertive하게 알리고, 핸들러 없는 닫기 축은 죽은 버튼을 만들지 않아야 합니다.',
  ),
  render: () => <SnackbarContractFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const surfaceIn = (testId) => canvasElement.querySelector(`[data-testid="${testId}"] > div`);

    // 1) severity → role / politeness, matching Toast.
    const polite = surfaceIn('polite-snackbar');
    const urgent = surfaceIn('urgent-snackbar');
    if (polite?.getAttribute('role') !== 'status' || polite.getAttribute('aria-live') !== 'polite') {
      throw new Error('A non-negative Snackbar must announce politely with role="status".');
    }
    if (urgent?.getAttribute('role') !== 'alert' || urgent.getAttribute('aria-live') !== 'assertive') {
      throw new Error('A negative Snackbar must announce assertively with role="alert", like Toast.');
    }

    // 2) A close axis without a handler must not render a dead control.
    const handlerless = canvasElement.querySelector('[data-testid="handlerless-snackbar"]');
    if (handlerless.querySelector('button[aria-label="닫기"]')) {
      throw new Error('closeButton without onClose must not render a dead close control.');
    }
    const closable = canvasElement.querySelector('[data-testid="closable-snackbar"]');
    const closeControl = closable.querySelector('button[aria-label="닫기"]');
    if (!closeControl) throw new Error('closeButton with onClose must render the close control.');

    // 3) Actions are keyboard reachable and actually wired.
    const actionButton = urgent.querySelector('button');
    actionButton.focus();
    if (ownerDocument.activeElement !== actionButton) throw new Error('The Snackbar action must be keyboard focusable.');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      if (canvasElement.querySelector('[data-testid="snackbar-log"]')?.textContent !== '재시도 실행') {
        throw new Error('The Snackbar action must call onAction.');
      }
    });

    // 4) The close control is wired too.
    await userEvent.click(closeControl);
    await waitFor(() => {
      if (canvasElement.querySelector('[data-testid="closable-snackbar"] > div')) {
        throw new Error('The Snackbar close control must call onClose.');
      }
    });
  },
};
