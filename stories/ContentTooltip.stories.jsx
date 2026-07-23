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
          <Tooltip open content="Small" position="top" size="small" data-testid="tooltip-small">
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
          <Tooltip open content="Top" position="top" data-testid="tooltip-top"><AnchorBox /></Tooltip>
          <span />
          <Tooltip open content="Left" position="left" data-testid="tooltip-left"><AnchorBox /></Tooltip>
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
  play: async ({ canvasElement }) => {
    /* The arrow is absolutely positioned inside the bubble and deliberately
       hangs past its edge. Any non-visible `overflow` on the bubble therefore
       turns that intended overhang into scrollable content and the platform
       paints a real scrollbar inside every tooltip. The bubble must stay a
       non-scrolling box; the maxHeight clamp for long content lives on the
       inner content wrapper, which is where "no overflow" is measurable
       (CSSOM counts an overhanging descendant in `scrollHeight` even for a
       non-scroll container, so the bubble's own scrollHeight is not the
       invariant — the absence of a scroll box and of a scrollbar gutter is). */
    const cases = [
      ['tooltip-top', 'top'],
      ['tooltip-left', 'left'],
      ['tooltip-small', 'top'],
    ];
    for (const [testId, expectedPlacement] of cases) {
      const wrapper = canvasElement.querySelector(`[data-testid="${testId}"]`);
      if (!wrapper) throw new Error(`Tooltip overflow contract requires the ${testId} target.`);
      const bubble = wrapper.querySelector('[role="tooltip"]');
      if (!bubble) throw new Error(`${testId} must render a tooltip bubble.`);
      if (bubble.dataset.placement !== expectedPlacement) {
        throw new Error(`${testId} resolved to placement "${bubble.dataset.placement}", expected "${expectedPlacement}".`);
      }

      const styles = getComputedStyle(bubble);
      if (styles.overflowX !== 'visible' || styles.overflowY !== 'visible') {
        throw new Error(`${testId}: the tooltip bubble must not clip or scroll (overflow ${styles.overflowX}/${styles.overflowY}); the arrow is meant to hang outside it.`);
      }
      if (bubble.offsetWidth !== bubble.clientWidth || bubble.offsetHeight !== bubble.clientHeight) {
        throw new Error(`${testId}: the tooltip bubble is painting a scrollbar (offset ${bubble.offsetWidth}x${bubble.offsetHeight} vs client ${bubble.clientWidth}x${bubble.clientHeight}).`);
      }
      bubble.scrollTop = 32;
      bubble.scrollLeft = 32;
      if (bubble.scrollTop !== 0 || bubble.scrollLeft !== 0) {
        throw new Error(`${testId}: the tooltip bubble must not be a scroll container.`);
      }

      const content = bubble.querySelector('[data-lds-tooltip-content]');
      if (!content) throw new Error(`${testId} must route its content through the scroll wrapper.`);
      if (content.scrollHeight > content.clientHeight || content.scrollWidth > content.clientWidth) {
        throw new Error(`${testId}: tooltip content overflows its box (${content.scrollWidth}x${content.scrollHeight} in ${content.clientWidth}x${content.clientHeight}).`);
      }

      // The arrow must still hang outside the bubble, pointing at the trigger.
      const arrow = bubble.querySelector(':scope > [aria-hidden="true"]');
      if (!arrow) throw new Error(`${testId} must render its arrow.`);
      const bubbleRect = bubble.getBoundingClientRect();
      const arrowRect = arrow.getBoundingClientRect();
      const overhang = expectedPlacement === 'left'
        ? arrowRect.right - bubbleRect.right
        : arrowRect.bottom - bubbleRect.bottom;
      if (overhang < 1) {
        throw new Error(`${testId}: the arrow must keep overhanging the bubble toward the trigger (overhang ${overhang}px).`);
      }
    }
  },
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

export const TooltipTriggerAndDelay = {
  name: '상호작용 · 트리거 연결과 표시 지연',
  parameters: storyDescription(
    'focusable한 control을 trigger로 쓴 경우와 일반 텍스트를 감싼 경우를 비교합니다. 텍스트를 감싼 래퍼가 탭 순서에 끼어들지 않고, 포인터 hover에는 enter 지연이 걸리지만 키보드 focus는 즉시 열리는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 620, padding: 'var(--space-8) 0' }}>
      <Section title="focusable trigger — 권장">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Tooltip content="장치 연결 정보" delay={{ open: 400 }}>
            <IconButton variant="ghost" label="연결 정보"><Icon name="circle-info" size={20} /></IconButton>
          </Tooltip>
          <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)' }}>
            hover 400ms 후 표시 · focus는 즉시 표시
          </span>
        </div>
      </Section>

      <Section title="비대화형 children — 래퍼는 탭 순서에 들어가지 않습니다">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Tooltip content="이 설명은 포인터로만 도달합니다" data-testid="plain-tooltip">
            평문 라벨
          </Tooltip>
          <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)' }}>
            키보드 사용자에게 필요한 설명이라면 trigger를 실제 control로 바꾸세요
          </span>
        </div>
      </Section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const plainWrapper = canvasElement.querySelector('[data-testid="plain-tooltip"]');
    if (!plainWrapper) throw new Error('Trigger 계약 스토리에는 평문 children 예시가 필요합니다.');
    if (plainWrapper.hasAttribute('tabindex')) {
      throw new Error('비대화형 children을 감싼 래퍼는 자동으로 탭 순서에 들어가면 안 됩니다(APG).');
    }

    const trigger = canvasElement.querySelector('button[aria-label="연결 정보"]');
    const tooltip = trigger.closest('span').querySelector('[role="tooltip"]');
    const view = canvasElement.ownerDocument.defaultView;
    if (view.getComputedStyle(tooltip).visibility !== 'hidden') {
      throw new Error('Tooltip의 초기 상태는 닫혀 있어야 합니다.');
    }
    // 키보드 focus는 지연 없이 즉시 열립니다.
    trigger.focus();
    trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await waitFor(() => {
      if (view.getComputedStyle(tooltip).visibility !== 'visible') {
        throw new Error('키보드 focus는 지연 없이 Tooltip을 열어야 합니다.');
      }
    }, { timeout: 200 });
  },
};

export const TooltipBubbleBookmarkDividerCard = { ...TooltipBubbleBookmarkDividerCardStory, name: 'Tooltip, Bubble, Bookmark, Divider card parity', tags: ['!dev', 'visual-parity'] };
