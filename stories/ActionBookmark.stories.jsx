import { userEvent, waitFor } from 'storybook/test';
import { Bookmark } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Bookmark',
  component: Bookmark,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-bookmark--bookmark-states',
      eyebrow: 'Product / Bookmark',
      title: '사용자가 다시 찾을 항목의 저장 상태를 즉시 전환합니다',
      description:
        '카드·목록·문서의 trailing action에서 한 항목을 저장하거나 저장 해제할 때 적합합니다. 일회성 실행이나 여러 항목의 폼 선택에는 Bookmark 대신 Button 또는 Checkbox를 사용하세요.',
    },
    docs: {
      description: {
        component: '아웃라인과 채움 상태로 저장 여부를 나타내는 제어·비제어 LK Product Bookmark 토글입니다.',
      },
    },
  },
};

export default meta;

function StateSample({ label, children }) {
  return (
    <section style={{ minWidth: 120, display: 'grid', justifyItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
      {children}
      <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>{label}</span>
    </section>
  );
}

export const BookmarkStates = {
  name: '개요',
  parameters: storyDescription(
    '목록 항목의 미저장·저장·비활성 상태를 나란히 비교하는 상황입니다. 채움 외에도 pressed와 disabled 의미가 보조 기술에 전달되고, 이름이 저장 대상을 특정하며 각 상태의 target 크기가 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-4)', flexWrap: 'wrap', maxWidth: 560 }}>
      <StateSample label="저장 안 됨"><Bookmark label="야간 순찰 경로" /></StateSample>
      <StateSample label="저장됨"><Bookmark label="점검 보고서" defaultActive /></StateSample>
      <StateSample label="사용 불가"><Bookmark label="보관된 지도" defaultActive disabled /></StateSample>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const [unsaved, saved, unavailable] = Array.from(canvasElement.querySelectorAll('button'));
    if (!unsaved || !saved || !unavailable) throw new Error('Bookmark contract targets are required.');

    if (unsaved.getAttribute('aria-label') !== '야간 순찰 경로 북마크') {
      throw new Error('북마크 이름은 저장 대상을 특정하는 한국어여야 합니다.');
    }
    if (unsaved.getAttribute('aria-pressed') !== 'false' || saved.getAttribute('aria-pressed') !== 'true') {
      throw new Error('저장 여부는 aria-pressed로 전달되어야 합니다.');
    }
    if (!unavailable.disabled) throw new Error('사용 불가 상태는 native disabled를 유지해야 합니다.');

    // Enter/Space도 포인터와 같은 눌림 피드백을 받아야 합니다.
    unsaved.focus();
    unsaved.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await waitFor(() => {
      if (unsaved.dataset.pressed !== 'true') throw new Error('키보드 활성화에도 눌림 피드백이 있어야 합니다.');
    });
    unsaved.dispatchEvent(new KeyboardEvent('keyup', { key: ' ', bubbles: true }));
    await waitFor(() => {
      if (unsaved.dataset.pressed !== 'false') throw new Error('키를 떼면 눌림 피드백이 해제되어야 합니다.');
    });

    // 토글해도 이름은 그대로, 상태만 바뀌어야 합니다(APG toggle button).
    await userEvent.click(unsaved);
    await waitFor(() => {
      if (unsaved.getAttribute('aria-pressed') !== 'true') throw new Error('클릭은 저장 상태를 전환해야 합니다.');
      if (unsaved.getAttribute('aria-label') !== '야간 순찰 경로 북마크') throw new Error('토글해도 접근 이름은 바뀌지 않아야 합니다.');
    });

    // Restore the story's named state.
    await userEvent.click(unsaved);
    await waitFor(() => {
      if (unsaved.getAttribute('aria-pressed') !== 'false') throw new Error('원래 상태로 돌아와야 합니다.');
    });
    unsaved.blur();
  },
};
