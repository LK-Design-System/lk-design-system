import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { TextButton } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Action/Text Button',
  tags: ['autodocs'],
  component: TextButton,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-action-text-button--text-button-states',
      eyebrow: 'Core / Action / Text Button',
      title: '낮은 강조의 보조 행동을 읽기 흐름 안에 둡니다',
      description:
        '더보기, 취소처럼 표면을 만들지 않고도 의미가 분명한 보조 행동에 적합합니다. 제출·저장처럼 주요 결과를 만드는 행동에는 Button을, 다른 위치로 이동하는 탐색에는 Link를 사용하세요.',
    },
    docs: {
      description: {
        component: '배경 없이 텍스트로 실행되는 TextButton입니다. color·disabled·loading 상태를 제공합니다.',
      },
    },
  },
};

export default meta;

export const TextButtonStates = {
  name: '개요',
  parameters: storyDescription(
    '본문이나 액션 묶음 안에서 낮은 강조의 텍스트 행동을 제공하는 상황입니다. 기본·보조·위험 색상과 로딩·비활성 상태가 행동 의미를 바꾸지 않고 실행 가능 여부를 명확히 전달하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', maxWidth: 640 }}>
      <TextButton>텍스트 액션</TextButton>
      <TextButton color="primary">더보기</TextButton>
      <TextButton color="assistive">취소</TextButton>
      <TextButton tone="danger">삭제</TextButton>
      <TextButton loading loadingLabel="불러오는 중">불러오기</TextButton>
      <TextButton disabled>비활성</TextButton>
    </main>
  ),
};

function TextButtonContractDemo() {
  const [activations, setActivations] = React.useState(0);
  return (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 640 }}>
      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <TextButton data-contract="interactive" onClick={() => setActivations((count) => count + 1)}>더보기</TextButton>
        <TextButton data-contract="width-reference">저장</TextButton>
        <TextButton data-contract="loading" loading loadingLabel="저장 중">저장</TextButton>
        <TextButton data-contract="aria-disabled" aria-disabled="true" onClick={() => setActivations((count) => count + 1)}>권한 필요</TextButton>
        <TextButton disabled>비활성</TextButton>
      </section>
      <output data-contract="activations" aria-live="polite">실행 횟수: {activations}</output>
    </main>
  );
}

export const InteractionAndLoadingContract = {
  name: '상호작용 · 로딩과 비활성',
  parameters: storyDescription(
    '낮은 강조의 텍스트 행동이 hover·pressed·loading·비활성으로 바뀌는 흐름을 검증하는 상황입니다. 로딩 중에는 원래 폭을 유지하며 하나의 처리 중 이름을 제공하고, aria-disabled 행동은 초점은 받되 실행되지 않아야 합니다.',
  ),
  render: () => <TextButtonContractDemo />,
  play: async ({ canvasElement }) => {
    const interactive = canvasElement.querySelector('[data-contract="interactive"]');
    const widthReference = canvasElement.querySelector('[data-contract="width-reference"]');
    const loading = canvasElement.querySelector('[data-contract="loading"]');
    const ariaDisabled = canvasElement.querySelector('[data-contract="aria-disabled"]');
    const activations = canvasElement.querySelector('[data-contract="activations"]');
    if (!interactive || !widthReference || !loading || !ariaDisabled || !activations) {
      throw new Error('TextButton contract targets are required.');
    }

    const restOpacity = getComputedStyle(interactive).opacity;
    await userEvent.hover(interactive);
    await waitFor(() => {
      if (getComputedStyle(interactive).opacity === restOpacity) throw new Error('TextButton hover feedback is missing.');
    });
    const hoverOpacity = getComputedStyle(interactive).opacity;
    interactive.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await waitFor(() => {
      if (getComputedStyle(interactive).opacity === hoverOpacity) throw new Error('TextButton pressed feedback must differ from hover.');
    });
    interactive.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    const widthDelta = Math.abs(widthReference.getBoundingClientRect().width - loading.getBoundingClientRect().width);
    if (widthDelta > 0.5) throw new Error(`TextButton loading changed width by ${widthDelta}px.`);
    if (loading.getAttribute('aria-label') !== '저장 중' || loading.getAttribute('aria-busy') !== 'true') {
      throw new Error('Loading TextButton needs one busy accessible name.');
    }
    ariaDisabled.focus();
    if (canvasElement.ownerDocument.activeElement !== ariaDisabled) throw new Error('aria-disabled TextButton must remain focusable.');
    await userEvent.click(ariaDisabled);
    if (activations.textContent?.trim() !== '실행 횟수: 0') throw new Error('aria-disabled TextButton must block activation.');
  },
};
