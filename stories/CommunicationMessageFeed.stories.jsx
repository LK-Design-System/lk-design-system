import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, ConversationMessage, MessageFeed, Spinner } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Communication/Message Feed',
  component: MessageFeed,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-communication-message-feed--overview',
      eyebrow: 'Product / Communication',
      title: '대화 기록은 chrome 없이 이어지고 새 메시지가 읽던 위치를 빼앗지 않습니다',
      description:
        '장문 AI 응답과 짧은 사용자 발화를 시간순으로 읽고 과거 내용을 이어 불러올 때 사용합니다. Feed는 application panel이나 messenger canvas가 아니라 투명한 named log와 history/follow behavior만 제공합니다. 정적이거나 시간순이 아닌 목록에는 적합하지 않으니 일반 List·Table을 사용하세요.',
    },
    docs: {
      description: {
        component:
          '접근 가능한 transparent log, history prepend anchoring, controlled bottom-follow와 latest action을 제공하는 LK Product Extension입니다.',
      },
    },
  },
};

export default meta;

function FeedMessage({ id, authorRole, author, time, lifecycle, children, ...rest }) {
  const resolvedLifecycle = lifecycle ?? (
    authorRole === 'user'
      ? { kind: 'delivery', state: 'sent' }
      : authorRole === 'assistant'
        ? { kind: 'response', state: 'complete' }
        : { kind: 'static' }
  );

  return (
    <ConversationMessage
      {...rest}
      data-message-key={id}
      authorRole={authorRole}
      author={author}
      timestamp={time}
      lifecycle={resolvedLifecycle}
    >
      {children}
    </ConversationMessage>
  );
}

function messageData(prefix, count, start = 1) {
  return Array.from({ length: count }, (_, index) => {
    const number = start + index;
    const authorRole = number % 4 === 0 ? 'human-agent' : number % 2 === 0 ? 'assistant' : 'user';
    return {
      id: `${prefix}-${number}`,
      authorRole,
      author: authorRole === 'human-agent' ? '지원 담당자' : authorRole === 'assistant' ? 'AI Assistant' : '김서윤',
      time: `10:${String(number % 60).padStart(2, '0')}`,
      text: authorRole === 'assistant'
        ? `응답 ${number}: 요청한 문서를 읽고 핵심 결정 사항과 다음 행동을 문장으로 정리했습니다.`
        : `메시지 ${number}: 이 항목을 더 간단하게 설명해 주세요.`,
    };
  });
}

function MessageRows({ messages }) {
  return messages.map(({ text, ...message }) => (
    <FeedMessage key={message.id} {...message}>
      {text}
    </FeedMessage>
  ));
}

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '약 760px에서 assistant document, user solid primary bubble, system 중앙 pill 칩과 human-agent neutral fill bubble을 transparent named log 안에 시간순으로 배치합니다. Feed가 child를 card로 다시 감싸거나 자체 messenger background를 만들지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 760 }}>
      <MessageFeed ariaLabel="AI 문서 대화" following viewportMinHeight={360} maxHeight={360}>
        <FeedMessage id="overview-assistant" authorRole="assistant" author="AI Assistant" time="10:21">
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <p style={{ margin: 0 }}>업로드한 문서의 결정 사항을 두 범주로 정리했습니다.</p>
            <ul style={{ margin: 0, paddingInlineStart: 'var(--space-5)' }}>
              <li>이번 주에 완료할 항목 3개</li>
              <li>추가 확인이 필요한 항목 1개</li>
            </ul>
          </div>
        </FeedMessage>
        <FeedMessage id="overview-user" authorRole="user" author="김서윤" time="10:22">
          추가 확인 항목만 자세히 알려 주세요.
        </FeedMessage>
        <FeedMessage id="overview-system" authorRole="system" author="대화 시스템" time="10:22">
          상담원이 대화에 참여했습니다.
        </FeedMessage>
        <FeedMessage id="overview-agent" authorRole="human-agent" author="지원 담당자 · 박지훈" time="10:23">
          문서의 날짜와 담당자 이름을 함께 확인하겠습니다.
        </FeedMessage>
      </MessageFeed>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const log = canvasElement.querySelector('[role="log"]');
    if (!log || log.getAttribute('aria-label') !== 'AI 문서 대화') {
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
    if (canvasElement.querySelector('[role="feed"]') || log.querySelector('article[tabindex]')) {
      throw new Error('MessageFeed must not introduce feed semantics or roving article focus.');
    }
    const messages = Array.from(log.querySelectorAll('.lk-conversation-message'));
    if (messages.map((message) => message.dataset.messagePresentation).join(',') !== 'document,bubble,system,bubble') {
      throw new Error('The feed must preserve child-owned message presentations.');
    }
    const style = getComputedStyle(log);
    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' || style.boxShadow !== 'none' || style.borderTopWidth !== '0px') {
      throw new Error('MessageFeed must remain transparent and chrome-free.');
    }
    if (log.hasAttribute('data-message-feed-surface')) {
      throw new Error('MessageFeed must not expose a product surface axis.');
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
    <main data-history-harness style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 720 }}>
      <MessageFeed
        ariaLabel="기록 위치 복원 예제"
        following={false}
        hasPrevious={hasPrevious}
        loadingPrevious={loading}
        onLoadPrevious={loadPrevious}
        maxHeight={280}
        liveStatus={loading ? '이전 메시지를 불러오는 중입니다.' : undefined}
      >
        <MessageRows messages={messages} />
      </MessageFeed>
      <section data-no-result-history style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label1-size)' }}>새 기록이 없는 요청</strong>
        <MessageFeed
          ariaLabel="무결과 기록 요청 예제"
          following={false}
          hasPrevious
          onLoadPrevious={() => new Promise((resolve) => window.setTimeout(resolve, 40))}
          maxHeight={120}
        >
          <FeedMessage authorRole="assistant" author="AI Assistant">현재 기록이 가장 오래된 메시지입니다.</FeedMessage>
        </MessageFeed>
      </section>
    </main>
  );
}

export const HistoryAnchoring = {
  name: '상호작용 · 이전 메시지 위치 유지',
  parameters: storyDescription(
    '대화 중간을 읽다가 이전 기록을 불러옵니다. 과거 message가 위에 추가되어도 기존 anchor의 viewport 내 위치를 유지하고, prepend된 기록을 새 message로 발표하지 않아야 합니다.',
  ),
  render: () => <HistoryHarness />,
  play: async ({ canvasElement }) => {
    const log = canvasElement.querySelector('[role="log"]');
    const loadButton = canvasElement.querySelector('[data-message-feed-history-control] button');
    const anchor = canvasElement.querySelector('[data-message-key="current-24"]');
    if (!log || !loadButton || !anchor) throw new Error('History anchoring fixture is incomplete.');
    if (!(loadButton.compareDocumentPosition(log) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('The previous-history action must precede the log.');
    }

    log.scrollTop = Math.min(120, Math.max(0, log.scrollHeight - log.clientHeight - 64));
    log.dispatchEvent(new Event('scroll', { bubbles: true }));
    const beforeTop = anchor.getBoundingClientRect().top - log.getBoundingClientRect().top;
    const beforeHeight = log.scrollHeight;
    const beforeScrollTop = log.scrollTop;

    await userEvent.click(loadButton);
    await waitFor(() => {
      if (log.getAttribute('aria-busy') !== 'true') throw new Error('History loading must mark the log busy.');
      if (log.getAttribute('aria-live') !== 'off' || log.dataset.historyLiveSuppressed !== 'true') {
        throw new Error('History prepend must temporarily suppress announcements.');
      }
    });
    await waitFor(() => {
      if (!canvasElement.querySelector('[data-message-key="older-13"]')) throw new Error('Older messages were not prepended.');
      if (log.hasAttribute('aria-busy')) throw new Error('History loading did not finish.');
    });
    await waitFor(() => {
      const afterAnchor = canvasElement.querySelector('[data-message-key="current-24"]');
      const expectedTop = beforeScrollTop + (log.scrollHeight - beforeHeight);
      if (Math.abs(log.scrollTop - expectedTop) > 2) {
        throw new Error('Prepending history must restore scrollTop by the content-height delta.');
      }
      const afterTop = afterAnchor?.getBoundingClientRect().top - log.getBoundingClientRect().top;
      if (afterTop == null || Math.abs(afterTop - beforeTop) > 2) {
        throw new Error('The visible anchor must stay at the same viewport position.');
      }
    });
    await waitFor(() => {
      if (log.getAttribute('aria-live') !== 'polite' || log.dataset.historyLiveSuppressed) {
        throw new Error('The log must restore polite announcements after anchoring.');
      }
    });
    const noResult = canvasElement.querySelector('[data-no-result-history]');
    const noResultLog = noResult?.querySelector('[role="log"]');
    const noResultButton = noResult?.querySelector('[data-message-feed-history-control] button');
    if (!noResultLog || !noResultButton) throw new Error('The no-result history fixture is incomplete.');
    await userEvent.click(noResultButton);
    await waitFor(() => {
      if (noResultLog.getAttribute('aria-live') !== 'polite' || noResultLog.dataset.historyLiveSuppressed) {
        throw new Error('A completed history request with no new rows must restore polite announcements.');
      }
    });
  },
};

function isNearBottom(viewport) {
  return viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= 8;
}

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
        authorRole: 'assistant',
        author: 'AI Assistant',
        time: '10:42',
        text: '사용자가 이전 기록을 읽는 동안 새 장문 응답이 도착했습니다.',
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
      <div><Button size="sm" variant="ghost" data-add-message onClick={addMessage}>새 응답 추가</Button></div>
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
        maxHeight={260}
      >
        <MessageRows messages={messages} />
      </MessageFeed>
    </main>
  );
}

export const FollowAndUnread = {
  name: '상호작용 · 읽기 위치와 새 메시지',
  parameters: storyDescription(
    '사용자가 위쪽 기록을 읽는 동안 새 response가 도착해도 자동으로 bottom으로 끌어내리지 않습니다. latest action으로만 controlled following을 다시 시작합니다.',
  ),
  render: () => <FollowHarness />,
  play: async ({ canvasElement }) => {
    const harness = canvasElement.querySelector('[data-follow-harness]');
    const log = canvasElement.querySelector('[role="log"]');
    const addButton = canvasElement.querySelector('[data-add-message]');
    if (!harness || !log || !addButton) throw new Error('Follow fixture is incomplete.');
    await waitFor(() => {
      if (log.scrollHeight <= log.clientHeight || !isNearBottom(log)) throw new Error('Initial follow must reach the bottom.');
    });
    await waitFor(() => {
      log.scrollTop = 0;
      log.dispatchEvent(new Event('scroll', { bubbles: true }));
      if (harness.dataset.following !== 'false' || harness.dataset.followingReason !== 'user-scroll') {
        throw new Error('User scrolling away must disable following.');
      }
    });
    const beforeAppendTop = log.scrollTop;
    await userEvent.click(addButton);
    await waitFor(() => {
      if (!canvasElement.querySelector('[data-message-key="follow-13"]')) throw new Error('The new response was not appended.');
    });
    if (Math.abs(log.scrollTop - beforeAppendTop) > 1) {
      throw new Error('Appending while following=false must preserve scrollTop.');
    }
    const jumpButton = canvasElement.querySelector('[data-message-feed-jump]');
    if (!jumpButton) throw new Error('Unread content must expose the latest-message action.');
    jumpButton.focus();
    await userEvent.click(jumpButton);
    await waitFor(() => {
      if (harness.dataset.following !== 'true'
        || harness.dataset.followingReason !== 'jump-to-latest'
        || harness.dataset.jumpCount !== '1'
        || !isNearBottom(log)
        || document.activeElement !== jumpButton) {
        throw new Error('The latest action must restore bottom-follow, callback state, and focus.');
      }
    });
  },
};

export const EmptyAndBusy = {
  name: '변형·상태 · 빈 목록과 불러오는 중',
  parameters: storyDescription(
    '아직 대화가 없을 때와 초기 history를 불러오는 중일 때를 비교합니다. empty content는 log 안에, phase announcement는 log 밖에 둡니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'var(--space-5)', width: '100%', maxWidth: 760 }}>
      <section data-empty-example aria-label="빈 대화">
        <MessageFeed ariaLabel="빈 AI 대화" following empty="아직 시작된 대화가 없습니다." maxHeight={220}>
          {[null, false, undefined]}
        </MessageFeed>
      </section>
      <section data-busy-example aria-label="불러오는 대화">
        <MessageFeed
          ariaLabel="불러오는 AI 대화"
          following
          busy
          empty={(
            <span style={{ display: 'inline-grid', justifyItems: 'center', gap: 'var(--space-2)' }}>
              <Spinner size={20} aria-hidden="true" />
              <span>대화 기록을 준비하고 있습니다.</span>
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

export const DarkTheme = {
  name: '변형·상태 · 다크 테마',
  parameters: storyDescription(
    '같은 transparent log와 document/bubble reading flow를 dark semantic scope에서 확인합니다. 별도 inverse prop, soft canvas 또는 console surface를 만들지 않습니다.',
  ),
  render: () => (
    <main
      data-theme="dark"
      data-dark-feed
      style={{ width: '100%', maxWidth: 720, padding: 'var(--space-5)', boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <MessageFeed ariaLabel="다크 AI 대화" following viewportMinHeight={300} maxHeight={300}>
        <MessageRows messages={messageData('dark', 5)} />
      </MessageFeed>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-dark-feed]');
    const log = fixture?.querySelector('[role="log"]');
    const messages = log ? Array.from(log.querySelectorAll('.lk-conversation-message')) : [];
    if (!fixture || !log || messages.length !== 5) throw new Error('The dark feed fixture is incomplete.');
    if (getComputedStyle(log).backgroundColor !== 'rgba(0, 0, 0, 0)' || getComputedStyle(log).boxShadow !== 'none') {
      throw new Error('Dark MessageFeed must stay transparent and chrome-free.');
    }
    if (fixture.scrollWidth > fixture.clientWidth + 1 || log.scrollWidth > log.clientWidth + 1) {
      throw new Error('The dark feed must not create horizontal overflow.');
    }
  },
};

export const Narrow320 = {
  name: '반응형 · 320px',
  parameters: storyDescription(
    '320px에서 history action, 긴 assistant document와 user bubble, latest action을 함께 확인합니다. action이 message를 덮지 않고 세로 reading order를 유지해야 합니다.',
  ),
  render: () => (
    <main data-narrow-feed style={{ width: 320, maxWidth: '100%' }}>
      <MessageFeed
        ariaLabel="좁은 AI 대화"
        following={false}
        hasPrevious
        onLoadPrevious={() => {}}
        unreadCount={18}
        viewportMinHeight={300}
        maxHeight={300}
      >
        <FeedMessage id="narrow-1" authorRole="assistant" author="AI Assistant with a long display name" time="10:31">
          긴 주소 https://example.com/reports/quarterly-planning/very-long-reference-path-without-shortening 를 포함한 문서형 답변입니다.
        </FeedMessage>
        <FeedMessage id="narrow-2" authorRole="user" author="김서윤" time="10:32">
          원본 주소를 유지하고 결론만 간단히 알려 주세요.
        </FeedMessage>
      </MessageFeed>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-narrow-feed]');
    const previous = wrapper?.querySelector('[data-message-feed-history-control]');
    const log = wrapper?.querySelector('[role="log"]');
    const latest = wrapper?.querySelector('[data-message-feed-jump-control]');
    if (!wrapper || !previous || !log || !latest) {
      throw new Error('The narrow feed must include history, log, and latest controls.');
    }
    if (!(previous.compareDocumentPosition(log) & Node.DOCUMENT_POSITION_FOLLOWING)
      || !(log.compareDocumentPosition(latest) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Narrow DOM order must be history → log → latest.');
    }
    if (wrapper.scrollWidth > wrapper.clientWidth + 1 || log.scrollWidth > log.clientWidth + 1) {
      throw new Error('MessageFeed must not create horizontal overflow at 320px.');
    }
    const presentations = Array.from(log.querySelectorAll('.lk-conversation-message'))
      .map((message) => message.dataset.messagePresentation);
    if (presentations.join(',') !== 'document,bubble') {
      throw new Error('The narrow feed must preserve assistant document and user bubble presentations.');
    }
  },
};
