import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Popover } from '../src/index.js';
import { PopoverCard as PopoverCardStory } from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Overlay/Popover',
  tags: ['autodocs'],
  component: Popover,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-overlay-popover--popover-overview',
      eyebrow: 'Product / Popover',
      title: '사용자가 현재 대상의 보조 정보와 작은 설정을 제자리에서 확인합니다',
      description:
        '클릭한 trigger 주변에서 설명·미니 폼·피커처럼 자유로운 콘텐츠를 잠시 다룰 때 적합합니다. 명령 목록이나 작업을 막는 복잡한 흐름에는 Popover 대신 Dropdown Menu 또는 Modal을 사용하세요.',
    },
    docs: {
      description: {
        component: '클릭 trigger에 임의의 보조 콘텐츠를 정렬해 여는 LK Product Popover입니다.',
      },
    },
  },
};

export default meta;

export const PopoverOverview = {
  name: '개요',
  parameters: storyDescription(
    '현재 화면을 떠나지 않고 운영 설정의 설명과 값을 확인하는 상황입니다. trigger와 패널의 관계가 분명하고 바깥을 클릭하면 예측 가능하게 닫히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ minHeight: 220, display: 'flex', alignItems: 'start', gap: 'var(--space-4)', flexWrap: 'wrap', maxWidth: 760 }}>
      <Popover trigger={<Button variant="ghost">운영 설정</Button>} width={280}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong>운영 설정</strong>
          <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>앵커 기준으로 열리는 보조 패널입니다.</span>
        </div>
      </Popover>
      <Popover trigger={<Button variant="ghost">오른쪽 정렬 정보</Button>} align="right" width={240}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong>선택 항목</strong>
          <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>최근 수정 2분 전</span>
        </div>
      </Popover>
    </main>
  ),
};

function PopoverContractFixture() {
  const [open, setOpen] = React.useState(false);
  return (
    <main style={{ position: 'fixed', right: 4, bottom: 4 }}>
      <Popover
        trigger={<Button variant="outlined" color="assistive">협폭 설정</Button>}
        width={280}
        open={open}
        onOpenChange={setOpen}
        ariaLabel="협폭 운영 설정"
      >
        <label style={{ display: 'grid', gap: 'var(--space-2)' }}>
          운영 반경
          <input aria-label="운영 반경" defaultValue="30m" />
        </label>
      </Popover>
    </main>
  );
}

export const PopoverInteractionContract = {
  name: '상호작용 · 초점·Escape·화면 경계',
  parameters: storyDescription(
    '화면 오른쪽 아래 trigger에서 제어형 Popover를 열어 trigger ARIA, 내부 Tab 순서, Escape 초점 복원, viewport 안쪽 flip·clamp를 확인합니다.',
  ),
  render: () => <PopoverContractFixture />,
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.includes('협폭 설정'));
    if (!trigger) throw new Error('Popover contract story requires its trigger.');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    const panel = await waitFor(() => {
      const current = canvasElement.querySelector('[role="dialog"][aria-label="협폭 운영 설정"]');
      if (!current) throw new Error('Popover must open a named non-modal dialog.');
      return current;
    });
    if (trigger.getAttribute('aria-expanded') !== 'true' || trigger.getAttribute('aria-controls') !== panel.id) {
      throw new Error('Popover trigger must expose expanded and controls state.');
    }
    await userEvent.tab();
    if (ownerDocument.activeElement?.getAttribute('aria-label') !== '운영 반경') {
      throw new Error('Tab must move from the Popover trigger into its content.');
    }
    await waitFor(() => {
      const rect = panel.getBoundingClientRect();
      if (rect.left < 0 || rect.right > ownerDocument.defaultView.innerWidth || rect.top < 0 || rect.bottom > ownerDocument.defaultView.innerHeight) {
        throw new Error('Popover must remain inside the viewport.');
      }
      if (panel.dataset.placement !== 'top') throw new Error('A bottom-edge Popover must flip above its trigger.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="dialog"]')) throw new Error('Escape must close Popover.');
      if (ownerDocument.activeElement !== trigger) throw new Error('Escape must restore the Popover trigger.');
    });
  },
};

export const PopoverCard = { ...PopoverCardStory, name: 'Popover card parity', tags: ['!dev', 'visual-parity'] };
