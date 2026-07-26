import { userEvent, waitFor } from 'storybook/test';
import { SpeedDial, Icon } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Action/Speed Dial',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-product-action-speed-dial--speed-dials',
      eyebrow: 'Product / Speed Dial',
      title: '스피드 다이얼은 한 지점에서 관련 보조 작업을 펼칩니다',
      description:
        '지도·에디터의 고정 코너에서 2~5개의 문맥 작업을 빠르게 꺼낼 때 적합합니다. 항상 보여야 하는 핵심 CTA나 항목이 많은 명령에는 Speed Dial 대신 Button 또는 Menu를 사용하세요.',
    },
    docs: {
      description: {
        component: '열리면 라벨 툴 액션이 펼쳐지는 FAB 스피드다이얼 SpeedDial 패턴입니다. 맵·에디터의 코너 도구 묶음에 씁니다.',
      },
    },
  },
};

export default meta;

export const SpeedDials = {
  name: '개요',
  parameters: storyDescription(
    '열린 Speed Dial에서 일반 작업과 위험 작업의 라벨·아이콘 우선순위를 비교합니다. 코너 고정 위치에서도 작업명이 읽히고 삭제 동작이 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ minHeight: 280, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 'var(--space-4)', maxWidth: 420, border: '1px dashed var(--color-semantic-line-normal-neutral)', borderRadius: 'var(--radius-lg)' }}>
      <SpeedDial
        defaultOpen
        actions={[
          { icon: <Icon name="plus" size={18} />, label: '웨이포인트 추가' },
          { icon: <Icon name="pin" size={18} />, label: '존 지정' },
          { icon: <Icon name="trash" size={18} />, label: '선택 삭제', danger: true },
        ]}
      />
    </main>
  ),
};

export const SpeedDialFocusContract = {
  name: '스피드 다이얼 초점과 순서 계약',
  tags: ['!dev'],
  render: () => (
    <main style={{ minHeight: 280, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: 'var(--space-4)', maxWidth: 420 }}>
      <SpeedDial
        data-contract="dial"
        label="지도 작업"
        actions={[
          { icon: <Icon name="plus" size={18} />, label: '웨이포인트 추가' },
          { icon: <Icon name="pin" size={18} />, label: '존 지정' },
        ]}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const dial = canvasElement.querySelector('[data-contract="dial"]');
    const trigger = dial?.querySelector('button[aria-expanded]');
    if (!dial || !trigger) throw new Error('SpeedDial contract targets are required.');

    if (trigger.getAttribute('aria-expanded') !== 'false') throw new Error('닫힌 스피드 다이얼은 aria-expanded=false여야 합니다.');
    if (trigger.hasAttribute('aria-controls')) throw new Error('닫혀 있을 때는 존재하지 않는 id를 aria-controls로 가리키면 안 됩니다.');
    if (trigger.getAttribute('aria-label') !== '지도 작업') throw new Error('트리거에는 한국어 접근 이름이 필요합니다.');

    await userEvent.click(trigger);
    const list = await waitFor(() => {
      const opened = dial.querySelector('ul');
      if (!opened) throw new Error('트리거는 액션 목록을 열어야 합니다.');
      return opened;
    });
    if (trigger.getAttribute('aria-controls') !== list.id) throw new Error('열린 트리거는 액션 목록을 aria-controls로 가리켜야 합니다.');

    // 논리 순서(트리거 → 액션)와 시각 배치(액션이 위)가 함께 성립해야 합니다.
    // eslint-disable-next-line no-bitwise
    const listFollowsTrigger = trigger.compareDocumentPosition(list) & Node.DOCUMENT_POSITION_FOLLOWING;
    if (!listFollowsTrigger) throw new Error('DOM 순서는 트리거 → 액션 목록이어야 합니다.');
    if (list.getBoundingClientRect().bottom > trigger.getBoundingClientRect().top + 1) {
      throw new Error('액션 목록은 트리거 위로 펼쳐져야 합니다.');
    }

    const actionButtons = Array.from(list.querySelectorAll('button'));
    if (actionButtons.length !== 2) throw new Error('두 개의 액션 버튼이 필요합니다.');
    if (actionButtons[0].getAttribute('aria-labelledby') == null && !actionButtons[0].getAttribute('aria-label')) {
      throw new Error('액션 버튼에는 접근 이름이 필요합니다.');
    }
    trigger.focus();
    await userEvent.tab();
    if (doc.activeElement !== actionButtons[0]) throw new Error('트리거 다음 Tab은 첫 액션으로 가야 합니다.');

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (dial.querySelector('ul')) throw new Error('Escape는 액션 목록을 닫아야 합니다.');
      if (doc.activeElement !== trigger) throw new Error('닫힐 때 초점을 트리거로 복원해야 합니다.');
    });

    await userEvent.click(trigger);
    const reopened = await waitFor(() => {
      const opened = dial.querySelector('ul');
      if (!opened) throw new Error('스피드 다이얼을 다시 열 수 있어야 합니다.');
      return opened;
    });
    await userEvent.click(reopened.querySelectorAll('button')[1]);
    await waitFor(() => {
      if (dial.querySelector('ul')) throw new Error('액션 실행 후 목록이 닫혀야 합니다.');
      if (doc.activeElement !== trigger) throw new Error('액션 실행 후에도 초점을 트리거로 복원해야 합니다.');
    });

    // Restore the story's named state (closed, nothing focused).
    trigger.blur();
  },
};
