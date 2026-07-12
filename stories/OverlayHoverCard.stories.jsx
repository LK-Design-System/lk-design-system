import { userEvent, waitFor } from 'storybook/test';
import { Button, HoverCard } from '../src/index.js';
import { HoverCardCard as HoverCardCardStory } from './Overlay.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Overlay/Hover Card',
  component: HoverCard,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-overlay-hover-card--hover-card-overview',
      eyebrow: 'Product / Hover Card',
      title: '사용자가 링크나 항목을 열기 전에 짧은 미리보기를 확인합니다',
      description:
        '포인터를 둔 대상의 제목·상태·요약처럼 비필수 미리보기를 잠시 보여 줄 때 적합합니다. 반드시 읽거나 조작해야 하는 콘텐츠에는 Hover Card 대신 Popover 또는 별도 상세 화면을 사용하세요.',
    },
    docs: {
      description: {
        component: 'hover 진입과 이탈에 맞춰 대상의 비필수 미리보기를 여는 LK Product HoverCard입니다.',
      },
    },
  },
};

export default meta;

export const HoverCardOverview = {
  name: '개요',
  parameters: storyDescription(
    '문서 항목을 열기 전에 제목·진행률·상태를 포인터로 미리 보는 상황입니다. 짧은 hover 지연이 실수로 열리는 현상을 줄이고 대상에서 벗어나면 카드가 닫히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ minHeight: 220, display: 'flex', alignItems: 'start', maxWidth: 560 }}>
      <HoverCard trigger={<Button variant="ghost">문서 A 미리보기</Button>} width={300}>
        <strong>문서 A</strong>
        <p style={{ margin: '6px 0 0', color: 'var(--color-semantic-label-neutral)' }}>검토 86% · 초안 상태 · 2분 전 수정</p>
      </HoverCard>
    </main>
  ),
};

export const HoverCardInteractionContract = {
  name: '상호작용 · 호버·초점·Escape',
  parameters: storyDescription(
    '화면 오른쪽 아래의 focusable trigger에서 Hover Card를 열어 키보드 focus와 pointer hover가 같은 미리보기를 제공하고, Escape로 닫은 뒤 trigger 초점과 화면 경계를 유지하는지 확인합니다.',
  ),
  render: () => (
    <main style={{ position: 'fixed', right: 4, bottom: 4 }}>
      <HoverCard
        trigger={<Button variant="outlined" color="assistive">장치 A 미리보기</Button>}
        width={300}
        openDelay={0}
        closeDelay={0}
      >
        <strong>장치 A</strong>
        <p style={{ margin: '6px 0 0' }}>온라인 · 마지막 점검 2분 전 · 배터리 86%</p>
      </HoverCard>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = [...canvasElement.querySelectorAll('button')].find((button) => button.textContent?.includes('장치 A'));
    if (!trigger) throw new Error('HoverCard contract story requires its trigger.');
    trigger.focus();
    const card = await waitFor(() => {
      const current = canvasElement.querySelector('[role="tooltip"]');
      if (!current) throw new Error('Keyboard focus must open HoverCard.');
      return current;
    });
    if (!trigger.getAttribute('aria-describedby')?.split(/\s+/).includes(card.id)) {
      throw new Error('HoverCard trigger must reference its preview.');
    }
    await waitFor(() => {
      const rect = card.getBoundingClientRect();
      if (rect.left < 0 || rect.right > ownerDocument.defaultView.innerWidth || rect.top < 0 || rect.bottom > ownerDocument.defaultView.innerHeight) {
        throw new Error('HoverCard must remain inside the viewport.');
      }
      if (card.dataset.placement !== 'top') throw new Error('A bottom-edge HoverCard must flip above its trigger.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (canvasElement.querySelector('[role="tooltip"]')) throw new Error('Escape must close HoverCard.');
      if (ownerDocument.activeElement !== trigger) throw new Error('Escape must preserve the HoverCard trigger focus.');
    });
    await userEvent.hover(trigger);
    await waitFor(() => {
      if (!canvasElement.querySelector('[role="tooltip"]')) throw new Error('Pointer hover must reopen HoverCard.');
    });
  },
};

export const HoverCardCard = { ...HoverCardCardStory, name: 'HoverCard card parity', tags: ['!dev', 'visual-parity'] };
