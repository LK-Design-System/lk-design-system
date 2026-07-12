import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Fab, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/FAB',
  component: Fab,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-action-fab--floating-action-button',
      eyebrow: 'Core / FAB',
      title: '사용자가 화면에서 가장 중요한 생성 작업을 어디서든 시작합니다',
      description:
        '목록이나 캔버스 위에서 지속적으로 접근해야 하는 단일 최우선 생성 액션에 적합합니다. 같은 우선순위의 작업이 여러 개이거나 일반 도구 모음에는 FAB 대신 Button, Toolbar 또는 Speed Dial을 사용하세요.',
    },
    docs: {
      description: {
        component: 'FAB는 화면 가장자리에 떠 있는 단일 최우선 액션과 접근 가능한 이름을 제공합니다.',
      },
    },
  },
};

export default meta;

function FabDemo() {
  const [message, setMessage] = React.useState('항목을 선택하거나 새 항목을 추가하세요.');

  return (
    <main
      style={{
        position: 'relative',
        minHeight: 300,
        maxWidth: 720,
        padding: 'var(--space-5)',
        boxSizing: 'border-box',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <p aria-live="polite" style={{ margin: 0, color: 'var(--color-semantic-label-neutral)' }}>
        {message}
      </p>
      <Fab
        label="새 항목 추가"
        variant="signal"
        onClick={() => setMessage('새 항목 작성을 시작했습니다.')}
        style={{ position: 'absolute', right: 'var(--space-5)', bottom: 'var(--space-5)' }}
      >
        <Icon name="plus" size={24} aria-hidden="true" />
      </Fab>
    </main>
  );
}

export const FloatingActionButton = {
  name: '개요',
  parameters: storyDescription(
    '콘텐츠 화면 오른쪽 아래에서 새 항목 생성을 계속 제공하는 상황입니다. 떠 있는 위치가 본문을 과도하게 가리지 않고 아이콘과 접근 가능한 label이 같은 목적을 전달하는지 확인하세요.',
  ),
  render: () => <FabDemo />,
};

function FabStateDemo() {
  const [activations, setActivations] = React.useState(0);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 640 }}>
      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        {['sm', 'md', 'lg'].map((size) => (
          <Fab
            key={size}
            size={size}
            label={`${size} 항목 추가`}
            data-contract={`size-${size}`}
            onClick={() => setActivations((count) => count + 1)}
          >
            <Icon name="plus" size={24} aria-hidden="true" />
          </Fab>
        ))}
        <Fab label="권한이 필요한 항목 추가" data-contract="aria-disabled" aria-disabled="true" onClick={() => setActivations((count) => count + 1)}>
          <Icon name="plus" size={24} aria-hidden="true" />
        </Fab>
        <Fab label="비활성 항목 추가" disabled>
          <Icon name="plus" size={24} aria-hidden="true" />
        </Fab>
      </section>
      <output data-contract="activations" aria-live="polite">실행 횟수: {activations}</output>
    </main>
  );
}

export const InteractionAndDisabledContract = {
  name: '상호작용 · 크기와 비활성',
  parameters: storyDescription(
    'FAB의 48·56·64px 크기와 hover·pressed·비활성 상태를 비교하는 상황입니다. 피드백은 위치를 움직이지 않는 색조 변화로 제공하며, aria-disabled FAB은 초점 순서에는 남지만 실행은 차단되어야 합니다.',
  ),
  render: () => <FabStateDemo />,
  play: async ({ canvasElement }) => {
    const interactive = canvasElement.querySelector('[data-contract="size-md"]');
    const ariaDisabled = canvasElement.querySelector('[data-contract="aria-disabled"]');
    const activations = canvasElement.querySelector('[data-contract="activations"]');
    if (!interactive || !ariaDisabled || !activations) throw new Error('FAB contract targets are required.');

    const restBackground = getComputedStyle(interactive).backgroundColor;
    await userEvent.hover(interactive);
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === restBackground) throw new Error('FAB hover feedback is missing.');
    });
    const hoverBackground = getComputedStyle(interactive).backgroundColor;
    interactive.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await waitFor(() => {
      if (getComputedStyle(interactive).backgroundColor === hoverBackground) throw new Error('FAB pressed feedback must differ from hover.');
    });
    interactive.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    const expectedDiameters = { sm: 48, md: 56, lg: 64 };
    for (const [size, expectedDiameter] of Object.entries(expectedDiameters)) {
      const fab = canvasElement.querySelector(`[data-contract="size-${size}"]`);
      if (!fab || Math.abs(fab.getBoundingClientRect().width - expectedDiameter) > 0.5) {
        throw new Error(`${size} FAB must be ${expectedDiameter}px.`);
      }
    }
    ariaDisabled.focus();
    if (canvasElement.ownerDocument.activeElement !== ariaDisabled) throw new Error('aria-disabled FAB must remain focusable.');
    await userEvent.click(ariaDisabled);
    if (activations.textContent?.trim() !== '실행 횟수: 0') throw new Error('aria-disabled FAB must block activation.');
  },
};
