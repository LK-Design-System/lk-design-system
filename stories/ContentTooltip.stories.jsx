import { userEvent, waitFor } from 'storybook/test';
import {
  Icon,
  IconButton,
  Tooltip,
} from '../src/index.js';
import { TooltipBubbleBookmarkDividerCard as TooltipBubbleBookmarkDividerCardStory } from './Content.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Tooltip',
  component: Tooltip,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-tooltip--tooltip-patterns',
      eyebrow: 'Core / Tooltip',
      title: '사용자가 현재 요소의 짧은 보조 설명을 필요할 때 확인합니다',
      description:
        '아이콘이나 축약된 control의 의미를 hover와 focus에서 간결하게 보충할 때 적합합니다. 계속 보여야 하는 주석이나 여러 문장의 상호작용 콘텐츠에는 Tooltip 대신 Bubble 또는 Popover를 사용하세요.',
    },
    docs: {
      description: {
        component: '짧은 보조 설명을 trigger에 연결하고 크기·위치·화살표 정렬·단축키를 표현하는 WDS Tooltip 패턴입니다.',
      },
    },
  },
};

export default meta;

function Section({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 14 }}>
      <h3 style={{ margin: 0, fontSize: 14, lineHeight: 1.35, color: 'var(--color-semantic-label-normal)' }}>{title}</h3>
      {children}
    </section>
  );
}

function AnchorBox({ label = 'target' }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 58,
        height: 58,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-semantic-background-elevated-normal)',
        color: 'var(--color-semantic-label-alternative)',
        fontSize: 11,
      }}
    >
      {label}
    </span>
  );
}

function AlignmentLabel({ children }) {
  return (
    <span style={{ display: 'inline-block', minWidth: 72, textAlign: 'center' }}>
      {children}
    </span>
  );
}

export const TooltipPatterns = {
  name: '개요',
  parameters: storyDescription(
    '아이콘 trigger와 열린 예시를 통해 크기·위치·화살표 정렬·단축키를 비교하는 상황입니다. 보조 설명이 trigger와 연결되고 방향이 바뀌어도 메시지와 화살표가 안정적으로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 900 }}>
      <Section title="기본 사용">
        <div style={{ minHeight: 72, display: 'flex', alignItems: 'center' }}>
          <Tooltip content="자세한 정보">
            <IconButton variant="ghost" label="정보"><Icon name="circle-info" size={20} /></IconButton>
          </Tooltip>
        </div>
      </Section>

      <Section title="크기와 단축키">
        <div style={{ display: 'flex', alignItems: 'center', gap: 78, minHeight: 142, paddingTop: 42, flexWrap: 'wrap' }}>
          <Tooltip open content="도움말 메시지" position="top" size="medium">
            <AnchorBox />
          </Tooltip>
          <Tooltip open content="Small" position="top" size="small">
            <AnchorBox />
          </Tooltip>
          <Tooltip open content="도움말 메시지" shortcut="Cmd C" position="top">
            <AnchorBox />
          </Tooltip>
        </div>
      </Section>

      <Section title="위치">
        <div
          style={{
            width: 520,
            maxWidth: '100%',
            minHeight: 320,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            placeItems: 'center',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-semantic-background-normal-alternative)',
            padding: 24,
          }}
        >
          <span />
          <Tooltip open content="Top" position="top"><AnchorBox /></Tooltip>
          <span />
          <Tooltip open content="Left" position="left"><AnchorBox /></Tooltip>
          <span />
          <Tooltip open content="Right" position="right"><AnchorBox /></Tooltip>
          <span />
          <Tooltip open content="Bottom" position="bottom"><AnchorBox /></Tooltip>
          <span />
        </div>
      </Section>

      <Section title="화살표 세로·가로 정렬">
        <div style={{ display: 'grid', gap: 28 }}>
          <div style={{ display: 'flex', gap: 88, minHeight: 142, paddingTop: 42, alignItems: 'center', flexWrap: 'wrap' }}>
            <Tooltip open content={<AlignmentLabel>Left</AlignmentLabel>} position="top" align="left"><AnchorBox /></Tooltip>
            <Tooltip open content={<AlignmentLabel>Center</AlignmentLabel>} position="top" align="center"><AnchorBox /></Tooltip>
            <Tooltip open content={<AlignmentLabel>Right</AlignmentLabel>} position="top" align="right"><AnchorBox /></Tooltip>
          </div>
          <div style={{ display: 'flex', gap: 96, minHeight: 126, alignItems: 'center', flexWrap: 'wrap' }}>
            <Tooltip open content="Top" position="right" align="top"><AnchorBox /></Tooltip>
            <Tooltip open content="Center" position="right" align="center"><AnchorBox /></Tooltip>
            <Tooltip open content="Bottom" position="right" align="bottom"><AnchorBox /></Tooltip>
          </div>
        </div>
      </Section>
    </main>
  ),
};

export const TooltipInteractionContract = {
  name: '상호작용 · 초점·Escape·협폭 배치',
  parameters: storyDescription(
    '화면 위쪽 오른쪽의 아이콘 trigger에서 긴 한글 Tooltip을 열어 aria-describedby, focus·hover 동등성, Escape 해제, 줄바꿈과 viewport clamp를 확인합니다.',
  ),
  render: () => (
    <main style={{ position: 'fixed', right: 4, top: 4 }}>
      <Tooltip
        content="현재 장치의 연결 상태와 마지막 동기화 시간을 확인합니다"
        position="top"
        align="right"
      >
        <IconButton variant="ghost" label="장치 연결 정보"><Icon name="circle-info" size={20} /></IconButton>
      </Tooltip>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const trigger = canvasElement.querySelector('button[aria-label="장치 연결 정보"]');
    const tooltip = canvasElement.querySelector('[role="tooltip"]');
    if (!trigger || !tooltip) throw new Error('Tooltip contract story requires its trigger and bubble.');
    trigger.focus();
    await waitFor(() => {
      if (ownerDocument.defaultView.getComputedStyle(tooltip).visibility !== 'visible') {
        throw new Error('Keyboard focus must show Tooltip.');
      }
    });
    if (!trigger.getAttribute('aria-describedby')?.split(/\s+/).includes(tooltip.id)) {
      throw new Error('Tooltip trigger must reference its tooltip.');
    }
    await waitFor(() => {
      const rect = tooltip.getBoundingClientRect();
      if (rect.left < 0 || rect.right > ownerDocument.defaultView.innerWidth || rect.top < 0 || rect.bottom > ownerDocument.defaultView.innerHeight) {
        throw new Error('Tooltip must remain inside the viewport.');
      }
      if (tooltip.dataset.placement !== 'bottom') throw new Error('A top-edge Tooltip must flip below its trigger.');
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (ownerDocument.defaultView.getComputedStyle(tooltip).visibility !== 'hidden') {
        throw new Error('Escape must hide Tooltip without moving focus.');
      }
      if (ownerDocument.activeElement !== trigger) throw new Error('Tooltip focus must remain on its trigger.');
    });
    trigger.blur();
    await userEvent.hover(trigger);
    await waitFor(() => {
      if (ownerDocument.defaultView.getComputedStyle(tooltip).visibility !== 'visible') {
        throw new Error('Pointer hover must reopen Tooltip.');
      }
    });
    await userEvent.hover(tooltip);
    if (ownerDocument.defaultView.getComputedStyle(tooltip).visibility !== 'visible') {
      throw new Error('Tooltip must remain visible while the pointer moves over it.');
    }
  },
};

export const TooltipBubbleBookmarkDividerCard = { ...TooltipBubbleBookmarkDividerCardStory, name: 'Tooltip, Bubble, Bookmark, Divider card parity', tags: ['!dev', 'visual-parity'] };
