import { userEvent, waitFor } from 'storybook/test';
import { CopyButton } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Copy Button',
  component: CopyButton,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-copy-button--copy-buttons',
      eyebrow: 'Product / Copy Button',
      title: '사용자가 정확한 식별자와 주소를 실수 없이 다시 사용할 수 있습니다',
      description:
        'ID·토큰·URL처럼 그대로 옮겨 써야 하는 짧은 값을 클립보드에 복사할 때 적합합니다. 화면 상태를 바꾸는 작업이나 파일 전체를 전달할 때는 Copy Button 대신 Button 또는 Export Action을 사용하세요.',
    },
    docs: {
      description: {
        component: '복사 버튼은 지정한 값을 클립보드에 쓰고 짧은 완료 피드백으로 결과를 알리는 Product 액션입니다.',
      },
    },
  },
};

export default meta;

const valueStyle = {
  minWidth: 0,
  overflowWrap: 'anywhere',
  color: 'var(--color-semantic-label-neutral)',
  fontFamily: 'var(--font-mono)',
};

export const CopyButtons = {
  name: '개요',
  parameters: storyDescription(
    '사용자가 항목 ID와 문서 주소를 다른 도구에 정확히 붙여 넣어야 하는 상황입니다. 각 버튼의 대상이 라벨로 구분되고 실행 직후 복사 결과가 같은 자리에서 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 720 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: 'var(--space-3)' }}>
        <code style={valueStyle}>item-2026-0705</code>
        <CopyButton value="item-2026-0705">항목 ID 복사</CopyButton>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: 'var(--space-3)' }}>
        <code style={valueStyle}>https://design.lkrobotics.dev/docs</code>
        <CopyButton value="https://design.lkrobotics.dev/docs">문서 주소 복사</CopyButton>
      </section>
    </main>
  ),
};

export const CopyResultContract = {
  name: '복사 성공과 실패 알림 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', justifyItems: 'start' }}>
      <CopyButton data-contract="copy" value="item-2026-0705">항목 ID 복사</CopyButton>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const view = canvasElement.ownerDocument.defaultView;
    const button = canvasElement.querySelector('[data-contract="copy"]');
    const live = button?.parentElement?.querySelector('[role="status"]');
    if (!button || !live) throw new Error('CopyButton contract targets are required.');

    // The live region must already exist before anything is copied: a status
    // node inserted together with its text is not announced reliably.
    if (live.getAttribute('aria-live') !== 'polite') throw new Error('결과 알림은 상시 polite live region이어야 합니다.');
    if (live.textContent !== '') throw new Error('라이브 리전은 결과 전에는 비어 있어야 합니다.');
    if (button.dataset.copyStatus !== 'idle') throw new Error('초기 상태는 idle이어야 합니다.');

    const navigatorRef = view.navigator;
    const hadOwnClipboard = Object.prototype.hasOwnProperty.call(navigatorRef, 'clipboard');
    const originalClipboard = Object.getOwnPropertyDescriptor(navigatorRef, 'clipboard');
    const stubClipboard = (implementation) => {
      Object.defineProperty(navigatorRef, 'clipboard', { configurable: true, writable: true, value: implementation });
    };
    const restoreClipboard = () => {
      if (hadOwnClipboard && originalClipboard) Object.defineProperty(navigatorRef, 'clipboard', originalClipboard);
      else delete navigatorRef.clipboard;
    };

    try {
      stubClipboard({ writeText: async () => {} });
      await userEvent.click(button);
      await waitFor(() => {
        if (button.dataset.copyStatus !== 'copied') throw new Error('성공한 복사는 copied 상태여야 합니다.');
        if (button.textContent.trim() !== '복사됨') throw new Error('성공 라벨이 표시되어야 합니다.');
        if (live.textContent !== '복사됨') throw new Error('성공은 라이브 리전으로도 전달되어야 합니다.');
      });

      stubClipboard({ writeText: async () => { throw new Error('NotAllowedError'); } });
      await userEvent.click(button);
      await waitFor(() => {
        if (button.dataset.copyStatus !== 'error') throw new Error('실패한 복사를 성공으로 표시하면 안 됩니다.');
        if (button.textContent.trim() !== '복사 실패') throw new Error('실패 라벨이 표시되어야 합니다.');
        if (live.textContent !== '복사 실패') throw new Error('실패도 라이브 리전으로 전달되어야 합니다.');
      });

      // Let the feedback expire first, so the next assertion cannot pass on the
      // leftover error state.
      await waitFor(() => {
        if (button.dataset.copyStatus !== 'idle') throw new Error('피드백은 잠시 뒤 대기 상태로 돌아와야 합니다.');
      }, { timeout: 4000 });

      // navigator.clipboard is absent in non-secure contexts — also a failure.
      stubClipboard(undefined);
      await userEvent.click(button);
      await waitFor(() => {
        if (button.dataset.copyStatus !== 'error') throw new Error('Clipboard API가 없으면 실패로 표시해야 합니다.');
        if (live.textContent !== '복사 실패') throw new Error('같은 문구를 다시 알릴 때도 라이브 리전이 갱신되어야 합니다.');
      }, { timeout: 3000 });
    } finally {
      restoreClipboard();
    }

    // Restore the story's named state: the feedback resets on its own timer.
    await waitFor(() => {
      if (button.dataset.copyStatus !== 'idle') throw new Error('피드백은 잠시 뒤 대기 상태로 돌아와야 합니다.');
      if (button.textContent.trim() !== '항목 ID 복사') throw new Error('대기 라벨로 돌아와야 합니다.');
    }, { timeout: 4000 });
    button.blur();
  },
};
