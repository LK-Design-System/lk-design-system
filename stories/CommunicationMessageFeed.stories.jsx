import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, MessageFeed, Spinner } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Communication/Message Feed',
  component: MessageFeed,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-communication-message-feed--overview',
      eyebrow: 'Product / Communication',
      title: '대화의 새 흐름을 알리면서도 사용자가 읽던 위치는 빼앗지 않습니다',
      description:
        '지원 대화, 운영 메시지, AI 응답처럼 시간순 기록을 읽고 과거 내용을 이어 불러올 때 사용합니다. 한두 줄짜리 상태 알림에는 Message Feed 대신 Banner나 Toast가 적합합니다.',
    },
    docs: {
      description: {
        component:
          '접근 가능한 log, 과거 기록 위치 복원, controlled bottom-follow와 새 메시지 이동 action을 제공하는 LK Product Extension입니다.',
      },
    },
  },
};

export default meta;

function MessageRow({ id, author, time, children }) {
  return (
    <article
      data-message-key={id}
      style={{
        display: 'grid',
        gap: 'var(--space-2)',
        minWidth: 0,
        padding: 'var(--space-3) 0',
        borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)', minWidth: 0 }}>
        <strong style={{ minWidth: 0, color: 'var(--color-semantic-label-strong)', overflowWrap: 'anywhere' }}>{author}</strong>
        <time style={{ flexShrink: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>{time}</time>
      </div>
      <p style={{ margin: 0, minWidth: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.65, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>
        {children}
      </p>
    </article>
  );
}

function messageData(prefix, count, start = 1) {
  return Array.from({ length: count }, (_, index) => {
    const number = start + index;
    return {
      id: `${prefix}-${number}`,
      author: number % 3 === 0 ? '운영 지원' : number % 2 === 0 ? 'LK Assistant' : '김서윤',
      time: `10:${String(number).padStart(2, '0')}`,
      text: `메시지 ${number}입니다. 현재 작업의 진행 상황과 다음 확인 항목을 시간순으로 기록합니다.`,
    };
  });
}

function MessageRows({ messages }) {
  return messages.map((message) => (
    <MessageRow key={message.id} {...message}>
      {message.text}
    </MessageRow>
  ));
}

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '운영 지원 대화를 시간순으로 읽는 기본 예입니다. 스크롤 영역 자체에 이름이 있고 새 메시지만 정중하게 알려 주는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 720 }}>
      <MessageFeed ariaLabel="운영 지원 대화" following maxHeight={360}>
        <MessageRows messages={messageData('overview', 6)} />
      </MessageFeed>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const log = canvasElement.querySelector('[role="log"]');
    if (!log || log.getAttribute('aria-label') !== '운영 지원 대화') {
      throw new Error('MessageFeed must expose a named log viewport.');
    }
    if (
      log.getAttribute('aria-live') !== 'polite'
      || log.getAttribute('aria-relevant') !== 'additions'
      || log.getAttribute('aria-atomic') !== 'false'
      || log.tabIndex !== 0
    ) {
      throw new Error('The log must expose the polite additions-only focus contract.');
    }
    if (canvasElement.querySelector('[role="feed"]')) {
      throw new Error('MessageFeed must not opt into the APG feed focus contract.');
    }
    if (log.querySelector('article[tabindex]')) {
      throw new Error('Message articles must not receive roving tabindex.');
    }
  },
};

function HistoryHarness() {
  const [messages, setMessages] = React.useState(() => messageData('current', 14, 21));
  const [hasPrevious, setHasPrevious] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const loadPrevious = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(() => {
      setMessages((current) => [...messageData('older', 8, 13), ...current]);
      setHasPrevious(false);
      setLoading(false);
    }, 80);
  };

  return (
    <main data-history-harness style={{ width: '100%', maxWidth: 720 }}>
      <MessageFeed
        ariaLabel="기록 위치 복원 예제"
        following={false}
        hasPrevious={hasPrevious}
        loadingPrevious={loading}
        onLoadPrevious={loadPrevious}
        maxHeight={260}
        liveStatus={loading ? '이전 메시지를 불러오는 중입니다.' : undefined}
      >
        <MessageRows messages={messages} />
      </MessageFeed>
    </main>
  );
}

export const HistoryAnchoring = {
  name: '상호작용 · 이전 메시지 위치 유지',
  parameters: storyDescription(
    '대화 중간을 읽다가 이전 메시지를 불러오는 상황입니다. 새 기록이 위에 추가되어도 기존 메시지의 화면상 위치가 움직이지 않아야 합니다.',
  ),
  render: () => <HistoryHarness />,
  play: async ({ canvasElement }) => {
    const log = canvasElement.querySelector('[role="log"]');
    const loadButton = canvasElement.querySelector('[data-message-feed-history-control] button');
    const anchor = canvasElement.querySelector('[data-message-key="current-24"]');
    if (!log || !loadButton || !anchor) throw new Error('History anchoring fixture is incomplete.');
    if (!(loadButton.compareDocumentPosition(log) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('The previous-history action must precede the log in DOM order.');
    }

    log.scrollTop = Math.min(96, Math.max(0, log.scrollHeight - log.clientHeight - 48));
    log.dispatchEvent(new Event('scroll', { bubbles: true }));
    // Measure the anchor position RELATIVE to the log viewport: once history is
    // exhausted the previous-history control unmounts and shifts the whole log in
    // absolute page coordinates, which is unrelated to in-viewport restoration.
    const beforeTop = anchor.getBoundingClientRect().top - log.getBoundingClientRect().top;
    const beforeHeight = log.scrollHeight;
    const beforeScrollTop = log.scrollTop;

    await userEvent.click(loadButton);
    await waitFor(() => {
      if (log.getAttribute('aria-busy') !== 'true') throw new Error('History loading must mark the log busy.');
    });
    await waitFor(() => {
      if (!canvasElement.querySelector('[data-message-key="older-13"]')) throw new Error('Older messages have not been prepended.');
      if (log.hasAttribute('aria-busy')) throw new Error('History loading did not finish.');
    });

    // The scroll-anchor restoration runs in a layout effect after the prepend
    // commits; poll until it settles so headless frame timing cannot race it.
    await waitFor(() => {
      const afterAnchor = canvasElement.querySelector('[data-message-key="current-24"]');
      const heightDelta = log.scrollHeight - beforeHeight;
      if (Math.abs(log.scrollTop - (beforeScrollTop + heightDelta)) > 2) {
        throw new Error('Prepending history must restore scrollTop by the scrollHeight delta.');
      }
      const afterTop = afterAnchor
        ? afterAnchor.getBoundingClientRect().top - log.getBoundingClientRect().top
        : null;
      if (afterTop === null || Math.abs(afterTop - beforeTop) > 2) {
        throw new Error('The previously visible message must stay at the same visual position.');
      }
    });
  },
};

function FollowHarness() {
  const [messages, setMessages] = React.useState(() => messageData('follow', 12));
  const [following, setFollowing] = React.useState(true);
  const [reason, setReason] = React.useState('initial');
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [jumpCount, setJumpCount] = React.useState(0);

  const addMessage = () => {
    setMessages((current) => [
      ...current,
      {
        id: `follow-${current.length + 1}`,
        author: '운영 지원',
        time: '10:42',
        text: '사용자가 이전 기록을 읽는 동안 도착한 새 메시지입니다.',
      },
    ]);
    setUnreadCount((count) => count + 1);
  };

  return (
    <main
      data-follow-harness
      data-following={following ? 'true' : 'false'}
      data-following-reason={reason}
      data-jump-count={jumpCount}
      style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 720 }}
    >
      <div>
        <Button size="sm" variant="ghost" data-add-message onClick={addMessage}>새 메시지 추가</Button>
      </div>
      <MessageFeed
        ariaLabel="새 메시지 follow 예제"
        following={following}
        onFollowingChange={(next, nextReason) => {
          setFollowing(next);
          setReason(nextReason);
        }}
        unreadCount={unreadCount}
        onJumpToLatest={() => {
          setJumpCount((count) => count + 1);
          setUnreadCount(0);
        }}
        maxHeight={240}
      >
        <MessageRows messages={messages} />
      </MessageFeed>
    </main>
  );
}

export const FollowAndUnread = {
  name: '상호작용 · 읽기 위치와 새 메시지',
  parameters: storyDescription(
    '사용자가 위쪽 기록을 읽는 동안 도착한 메시지는 자동으로 화면을 끌어내리지 않습니다. 최신 메시지 action으로만 bottom-follow를 다시 시작합니다.',
  ),
  render: () => <FollowHarness />,
  play: async ({ canvasElement }) => {
    const harness = canvasElement.querySelector('[data-follow-harness]');
    const log = canvasElement.querySelector('[role="log"]');
    const addButton = canvasElement.querySelector('[data-add-message]');
    if (!harness || !log || !addButton) throw new Error('Follow fixture is incomplete.');

    await waitFor(() => {
      if (log.scrollHeight <= log.clientHeight || !isNearBottom(log)) throw new Error('Initial follow did not reach the bottom.');
    });
    // Re-issue the scroll inside waitFor: the initial mount's programmatic
    // scroll-to-bottom suppresses user-scroll handling for a couple of frames,
    // so a single dispatch can be swallowed under headless timing.
    await waitFor(() => {
      log.scrollTop = 0;
      log.dispatchEvent(new Event('scroll', { bubbles: true }));
      if (harness.dataset.following !== 'false' || harness.dataset.followingReason !== 'user-scroll') {
        throw new Error('User scrolling away must disable following with the user-scroll reason.');
      }
    });

    const beforeAppendTop = log.scrollTop;
    await userEvent.click(addButton);
    await waitFor(() => {
      if (!canvasElement.querySelector('[data-message-key="follow-13"]')) throw new Error('The new message was not appended.');
    });
    if (Math.abs(log.scrollTop - beforeAppendTop) > 1) {
      throw new Error('Appending while following=false must preserve scrollTop.');
    }

    const jumpButton = canvasElement.querySelector('[data-message-feed-jump]');
    if (!jumpButton) throw new Error('Unread messages must expose the latest-message action.');
    jumpButton.focus();
    await userEvent.click(jumpButton);
    await waitFor(() => {
      if (
        harness.dataset.following !== 'true'
        || harness.dataset.followingReason !== 'jump-to-latest'
        || harness.dataset.jumpCount !== '1'
      ) {
        throw new Error('The latest action must report its controlled reason and callback.');
      }
      if (!isNearBottom(log)) throw new Error('The latest action must scroll to the bottom.');
      if (document.activeElement !== jumpButton) throw new Error('The latest action must retain button focus.');
    });
  },
};

function isNearBottom(viewport) {
  return viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= 8;
}

export const EmptyAndBusy = {
  name: '변형·상태 · 빈 목록과 불러오는 중',
  parameters: storyDescription(
    '아직 대화가 없을 때와 초기 기록을 불러오는 중일 때의 차이입니다. 빈 문구는 log 안에, 짧은 처리 단계 알림은 log 밖에 둡니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'var(--space-5)', width: '100%', maxWidth: 760 }}>
      <section data-empty-example aria-label="빈 대화">
        <MessageFeed ariaLabel="빈 지원 대화" following empty="아직 시작된 대화가 없습니다." maxHeight={220} />
      </section>
      <section data-busy-example aria-label="불러오는 대화">
        <MessageFeed
          ariaLabel="불러오는 지원 대화"
          following
          busy
          empty={(
            <span style={{ display: 'inline-grid', justifyItems: 'center', gap: 'var(--space-2)' }}>
              <Spinner size={20} aria-hidden="true" />
              <span>메시지를 준비하고 있습니다.</span>
            </span>
          )}
          liveStatus="대화 기록을 불러오는 중입니다."
          maxHeight={220}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const emptyLog = canvasElement.querySelector('[data-empty-example] [role="log"]');
    const busyExample = canvasElement.querySelector('[data-busy-example]');
    const busyLog = busyExample?.querySelector('[role="log"]');
    const phaseStatus = busyExample?.querySelector('[data-message-feed-live-status]');
    if (!emptyLog?.querySelector('[data-message-feed-empty]')) {
      throw new Error('Empty content must remain inside the named log.');
    }
    if (!busyLog || busyLog.getAttribute('aria-busy') !== 'true') {
      throw new Error('Busy conversations must expose aria-busy on the log.');
    }
    if (!phaseStatus || phaseStatus.getAttribute('role') !== 'status' || busyLog.contains(phaseStatus)) {
      throw new Error('Phase announcements must use a separate status region outside the log.');
    }
  },
};

export const Narrow320 = {
  name: '반응형 · 320px',
  parameters: storyDescription(
    '좁은 패널에서 과거 기록, 긴 한글·영문·경로, 새 메시지 action을 함께 확인합니다. action은 기록을 덮지 않고 세로 읽기 순서를 유지합니다.',
  ),
  render: () => (
    <main data-narrow-feed style={{ width: 320, maxWidth: '100%' }}>
      <MessageFeed
        ariaLabel="좁은 지원 대화"
        following={false}
        hasPrevious
        onLoadPrevious={() => {}}
        unreadCount={18}
        maxHeight={280}
      >
        <MessageRow id="narrow-1" author="LK Assistant" time="10:31">
          긴 주소 https://operations.example.com/robots/fleet-alpha/incidents/navigation-timeout 와 C:\operations\missions\2026\07\12\recovery-plan.json 을 함께 공유합니다.
        </MessageRow>
        <MessageRow id="narrow-2" author="운영 지원" time="10:32">
          엘리베이터 탑승 지점과 경사 구역을 다시 확인한 뒤 다음 경로를 안내하겠습니다.
        </MessageRow>
      </MessageFeed>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-narrow-feed]');
    const previousControl = wrapper?.querySelector('[data-message-feed-history-control]');
    const log = wrapper?.querySelector('[role="log"]');
    const jumpControl = wrapper?.querySelector('[data-message-feed-jump-control]');
    if (!wrapper || !previousControl || !log || !jumpControl) {
      throw new Error('The 320px composition must include both actions and the log.');
    }
    if (
      !(previousControl.compareDocumentPosition(log) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(log.compareDocumentPosition(jumpControl) & Node.DOCUMENT_POSITION_FOLLOWING)
    ) {
      throw new Error('Narrow DOM order must be previous action, log, then latest action.');
    }
    if (wrapper.scrollWidth > wrapper.clientWidth + 1 || log.scrollWidth > log.clientWidth + 1) {
      throw new Error('MessageFeed must not create horizontal overflow at 320px.');
    }
    if (wrapper.querySelector('[role="feed"]')) {
      throw new Error('The narrow variant must keep log semantics instead of feed semantics.');
    }
  },
};
