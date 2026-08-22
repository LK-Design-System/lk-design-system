import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, ConversationMessage, Divider, MessageFeed, Spinner } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Communication/Message Feed',
  tags: ['autodocs'],
  component: MessageFeed,
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: '포커스 가능한 대화 log의 접근 가능한 이름입니다.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '메시지 내역' } },
    },
    children: {
      control: false,
      description: '시간순 DOM 순서로 배치하는 메시지와 날짜·미읽음 구분선입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    empty: {
      control: false,
      description: 'children이 비어 있을 때 log 안에 표시할 콘텐츠입니다.',
      table: { type: { summary: 'ReactNode' }, defaultValue: { summary: '메시지가 없습니다.' } },
    },
    maxHeight: {
      control: 'text',
      description: '스크롤 viewport의 최대 높이입니다. 숫자 또는 CSS 길이를 받습니다.',
      table: { type: { summary: 'number | string' }, defaultValue: { summary: '400' } },
    },
    viewportMinHeight: {
      control: 'text',
      description: '고정형 대화 영역을 조합할 때 사용하는 viewport 최소 높이입니다.',
      table: { type: { summary: 'number | string' } },
    },
    density: {
      control: 'inline-radio',
      options: ['comfortable', 'compact'],
      description: 'log의 세로 여백과 메시지 사이 간격을 조절합니다. comfortable은 기존 읽기 밀도를 유지하고 compact는 좁은 대화 열의 세로 공간만 줄이며 viewportInset은 바꾸지 않습니다.',
      table: { defaultValue: { summary: 'comfortable' }, type: { summary: "'comfortable' | 'compact'" } },
    },
    busy: {
      control: 'boolean',
      description: '현재 log 콘텐츠를 갱신하는 동안 aria-busy를 설정합니다.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    hasPrevious: {
      control: 'boolean',
      description: 'log 앞에 이전 메시지 불러오기 action을 표시합니다.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    loadingPrevious: {
      control: 'boolean',
      description: '이전 기록 action을 loading 상태로 두고 log를 busy로 표시합니다.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    onLoadPrevious: {
      control: false,
      description: '이전 기록을 요청합니다. Promise를 반환하거나 조회 중 loadingPrevious를 갱신합니다.',
      table: { type: { summary: '() => void | Promise<void>' } },
    },
    loadPreviousLabel: {
      control: 'text',
      description: '이전 메시지 불러오기 action의 현지화된 레이블입니다.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '이전 메시지 불러오기' } },
    },
    following: {
      control: 'boolean',
      description: '새 콘텐츠와 크기 변경을 따라 viewport를 아래에 유지하는 controlled 상태입니다.',
      table: { type: { summary: 'boolean' } },
    },
    onFollowingChange: {
      control: false,
      description: '사용자 스크롤 또는 최신 메시지 action으로 following이 바뀔 때 호출됩니다.',
      table: { type: { summary: '(following, reason) => void' } },
    },
    unreadCount: {
      control: { type: 'number', min: 0, step: 1 },
      description: '최신 메시지 action에 표시하고 접근 가능한 이름에 포함할 제품 소유 미읽음 수입니다.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '0' } },
    },
    jumpToLatestLabel: {
      control: 'text',
      description: '최신 메시지로 이동하는 action의 현지화된 레이블입니다.',
      table: { type: { summary: 'string' }, defaultValue: { summary: '최신 메시지로 이동' } },
    },
    onJumpToLatest: {
      control: false,
      description: '최신 메시지 action이 viewport를 아래로 이동한 뒤 호출됩니다.',
      table: { type: { summary: '() => void' } },
    },
    liveStatus: {
      control: 'text',
      description: '메시지 token과 분리해 알릴 짧은 phase-level 상태입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    style: {
      control: 'object',
      description: 'MessageFeed 바깥 section에 병합할 인라인 스타일입니다.',
      table: { type: { summary: 'CSSProperties' } },
    },
  },
  parameters: {
    layout: 'padded',
    controls: { disable: true },
    storyGuide: {
      storyId: 'lds-product-communication-message-feed--overview',
      eyebrow: 'Product / Communication',
      title: '대화 기록은 읽던 위치를 지키며 이어집니다',
      description:
        '시간순 대화를 읽고 이전 기록을 이어 불러올 때 사용합니다. Feed는 접근 가능한 log, 이전 기록 위치 유지와 새 메시지 따라가기를 맡습니다. 정적 목록이나 시간순이 아닌 정보에는 사용하지 말고 List·Table을 사용하세요.',
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
  parameters: {
    ...storyDescription(
      '약 760px에서 assistant document, user solid primary bubble, system 중앙 pill 칩과 human-agent neutral fill bubble을 transparent named log 안에 시간순으로 배치합니다. Feed가 child를 card로 다시 감싸거나 자체 messenger background를 만들지 않는지 확인하세요. Controls는 이 개요의 실제 log props에 연결됩니다.',
    ),
    controls: { disable: false },
  },
  args: {
    ariaLabel: 'AI 문서 대화',
    following: true,
    viewportMinHeight: 360,
    maxHeight: 360,
    busy: false,
    hasPrevious: false,
    loadingPrevious: false,
    unreadCount: 0,
    loadPreviousLabel: '이전 메시지 불러오기',
    jumpToLatestLabel: '최신 메시지로 이동',
  },
  render: (args) => (
    <main style={{ width: '100%', maxWidth: 760 }}>
      <MessageFeed {...args}>
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

export const CompactDensity = {
  name: '반응형 · 조밀한 밀도',
  parameters: storyDescription(
    '460px의 짧은 대화 기록에서 compact 피드 안쪽 여백과 조밀한 메시지 하나를 확인합니다. 이전 기록과 최신 메시지 동작은 기록 영역 앞뒤의 읽기 순서를 유지하고, 피드는 제품 표면을 추가하지 않습니다.',
  ),
  render: () => (
    <main data-compact-feed style={{ width: 460, maxWidth: '100%', minWidth: 0 }}>
      <MessageFeed
        density="compact"
        ariaLabel="조밀한 메시지 기록"
        following={false}
        hasPrevious
        onLoadPrevious={() => {}}
        unreadCount={2}
        viewportMinHeight={180}
        maxHeight={180}
        viewportInset="compact"
      >
        <FeedMessage density="compact" id="compact-feed-assistant" authorRole="assistant" author="AI 어시스턴트" time="10:31">
          조밀한 피드 여백은 좁은 재사용 대화 열에서도 기록을 쉽게 훑을 수 있게 합니다.
        </FeedMessage>
        <FeedMessage density="compact" id="compact-feed-user" authorRole="user" author="김서윤" time="10:32">
          가로 스크롤 영역 없이 최신 응답을 계속 보이게 해 주세요.
        </FeedMessage>
      </MessageFeed>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-compact-feed]');
    const feed = fixture?.querySelector('[data-message-feed]');
    const log = feed?.querySelector('[role="log"]');
    const actions = fixture ? Array.from(fixture.querySelectorAll('button')) : [];
    if (!fixture || !feed || !log || actions.length !== 2) {
      throw new Error('The compact feed fixture is incomplete.');
    }
    const host = fixture.parentElement;
    const hostStyle = host ? getComputedStyle(host) : null;
    const availableWidth = host
      ? host.clientWidth - (Number.parseFloat(hostStyle.paddingLeft) || 0) - (Number.parseFloat(hostStyle.paddingRight) || 0)
      : 460;
    if (Math.abs(fixture.getBoundingClientRect().width - Math.min(460, availableWidth)) > 1) {
      throw new Error('The compact feed fixture must fill the available container up to 460px.');
    }
    if (feed.dataset.density !== 'compact') {
      throw new Error('MessageFeed must expose data-density="compact".');
    }
    const logStyle = getComputedStyle(log);
    if (logStyle.paddingTop !== '8px' || logStyle.paddingBottom !== '8px') {
      throw new Error(`Compact MessageFeed block inset must resolve to 8px (received ${logStyle.paddingTop}/${logStyle.paddingBottom}).`);
    }
    if (Array.from(log.querySelectorAll('.lk-conversation-message')).some((message) => message.dataset.density !== 'compact')) {
      throw new Error('Compact feed examples must preserve compact child message density.');
    }
    if (fixture.scrollWidth > fixture.clientWidth + 1 || feed.scrollWidth > feed.clientWidth + 1 || log.scrollWidth > log.clientWidth + 1) {
      throw new Error('Compact MessageFeed must not create horizontal overflow.');
    }
    for (let index = 0; index < actions.length; index += 1) {
      const current = actions[index].getBoundingClientRect();
      if (current.width < 24 || current.height < 24) {
        throw new Error('Compact MessageFeed actions must retain a minimum 24px target.');
      }
      for (const candidate of actions.slice(index + 1)) {
        const next = candidate.getBoundingClientRect();
        const overlaps = current.left < next.right - 0.5
          && current.right > next.left + 0.5
          && current.top < next.bottom - 0.5
          && current.bottom > next.top + 0.5;
        if (overlaps) throw new Error('Compact MessageFeed actions must not overlap.');
      }
    }
  },
};

export const ChronologyBoundaries = {
  name: '사용법 · 날짜와 첫 미읽음 구분',
  parameters: storyDescription(
    '날짜가 바뀌는 지점과 첫 미읽음 메시지 앞에 비상호작용 separator를 둡니다. log에 직접 포커스하면 Home·End·Page Up·Page Down으로 viewport를 이동하고, message 안의 action이 포커스를 가질 때는 해당 키를 가로채지 않습니다.',
  ),
  render: () => (
    <main style={{ width: '100%', maxWidth: 720 }}>
      <MessageFeed ariaLabel="구분선과 키보드 탐색 예제" following={false} viewportMinHeight={280} maxHeight={280}>
        <Divider
          data-message-feed-separator="date"
          aria-label="2026년 7월 20일"
          label={<time dateTime="2026-07-20">2026년 7월 20일</time>}
        />
        <MessageRows messages={messageData('boundary-read', 6, 1)} />
        <Divider
          data-message-feed-separator="date"
          aria-label="2026년 7월 21일"
          label={<time dateTime="2026-07-21">오늘</time>}
        />
        <FeedMessage id="boundary-read-today" authorRole="user" author="김서윤" time="09:41">
          어제부터 이어진 결정 사항을 다시 확인해 주세요.
        </FeedMessage>
        <Divider
          data-message-feed-separator="unread"
          aria-label="여기부터 읽지 않은 메시지"
          label="여기부터 읽지 않은 메시지"
        />
        <FeedMessage id="boundary-unread-1" authorRole="assistant" author="AI Assistant" time="09:42">
          <div style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }}>
            <span>첫 번째 미읽음 응답입니다. 이전 날짜의 기록과 이어서 읽을 수 있습니다.</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              data-message-action
            >
              응답 세부 정보
            </Button>
          </div>
        </FeedMessage>
        <MessageRows messages={messageData('boundary-unread', 5, 8)} />
      </MessageFeed>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const log = canvasElement.querySelector('[role="log"]');
    const dateSeparators = Array.from(canvasElement.querySelectorAll('[data-message-feed-separator="date"]'));
    const unreadSeparator = canvasElement.querySelector('[data-message-feed-separator="unread"]');
    const descendantAction = canvasElement.querySelector('[data-message-action]');
    if (!log || dateSeparators.length !== 2 || !unreadSeparator || !descendantAction) {
      throw new Error('The chronology-boundary fixture is incomplete.');
    }
    if (
      dateSeparators.some((separator) => separator.getAttribute('role') !== 'separator' || separator.tabIndex !== -1)
      || unreadSeparator.getAttribute('role') !== 'separator'
      || unreadSeparator.getAttribute('aria-label') !== '여기부터 읽지 않은 메시지'
      || dateSeparators[1].getAttribute('aria-label') !== '2026년 7월 21일'
      || dateSeparators[1].querySelector('time')?.getAttribute('datetime') !== '2026-07-21'
    ) {
      throw new Error('Date and unread boundaries must remain named, non-interactive separators.');
    }
    if (log.getAttribute('aria-keyshortcuts') !== 'Home End PageUp PageDown') {
      throw new Error('The focusable log must document its viewport keyboard shortcuts.');
    }

    log.focus();
    await userEvent.keyboard('{End}');
    if (!isNearBottom(log)) throw new Error('End must move the focused log to its bottom.');
    const bottom = log.scrollTop;
    await userEvent.keyboard('{PageUp}');
    if (!(log.scrollTop < bottom)) throw new Error('Page Up must move the focused log upward.');
    const afterPageUp = log.scrollTop;
    await userEvent.keyboard('{PageDown}');
    if (!(log.scrollTop > afterPageUp)) throw new Error('Page Down must move the focused log downward.');
    await userEvent.keyboard('{Home}');
    if (log.scrollTop !== 0) throw new Error('Home must move the focused log to its top.');

    descendantAction.focus();
    let descendantKey;
    const captureDescendantKey = (event) => {
      descendantKey = event.key;
    };
    descendantAction.addEventListener('keydown', captureDescendantKey, { once: true });
    const KeyboardEventConstructor = canvasElement.ownerDocument.defaultView.KeyboardEvent;
    const keyWasNotCanceled = descendantAction.dispatchEvent(new KeyboardEventConstructor('keydown', {
      key: 'End',
      bubbles: true,
      cancelable: true,
    }));
    if (
      descendantKey !== 'End'
      || !keyWasNotCanceled
      || document.activeElement !== descendantAction
    ) {
      throw new Error('MessageFeed must not intercept navigation keys from focused descendants.');
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
    /* 문구와 함께 삽입된 status node는 기존 live region의 변경이 아니라서 첫 알림이
       누락된다. region은 비어 있는 채로 상시 mount하고 텍스트만 교체해야 한다. */
    const idleStatus = canvasElement.querySelector('[data-empty-example] [data-message-feed-live-status]');
    if (!idleStatus || idleStatus.textContent !== '') {
      throw new Error('The phase status region must stay mounted and empty until a phase message arrives.');
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
        viewportInset="comfortable"
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
    const logStyle = getComputedStyle(log);
    if (logStyle.paddingLeft !== '16px' || logStyle.paddingRight !== '16px') {
      throw new Error(`The comfortable narrow viewport inset must resolve to 16px (received ${logStyle.paddingLeft}/${logStyle.paddingRight}).`);
    }
    const presentations = Array.from(log.querySelectorAll('.lk-conversation-message'))
      .map((message) => message.dataset.messagePresentation);
    if (presentations.join(',') !== 'document,bubble') {
      throw new Error('The narrow feed must preserve assistant document and user bubble presentations.');
    }
  },
};

export const ViewportInsetContract = {
  name: 'Viewport inset contract',
  tags: ['!dev'],
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: 360, maxWidth: '100%' }}>
      <MessageFeed ariaLabel="Compact message feed" following viewportInset="compact" maxHeight={160}>
        <FeedMessage id="inset-compact" authorRole="assistant" author="AI" time="10:41">Compact inset</FeedMessage>
      </MessageFeed>
      <MessageFeed ariaLabel="Comfortable message feed" following viewportInset="comfortable" maxHeight={160}>
        <FeedMessage id="inset-comfortable" authorRole="assistant" author="AI" time="10:42">Comfortable inset</FeedMessage>
      </MessageFeed>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const compact = canvasElement.querySelector('[data-message-feed-viewport-inset="compact"]');
    const comfortable = canvasElement.querySelector('[data-message-feed-viewport-inset="comfortable"]');
    if (!compact || !comfortable) throw new Error('Both MessageFeed viewport inset contracts are required.');

    const compactStyle = getComputedStyle(compact);
    const comfortableStyle = getComputedStyle(comfortable);
    if (compactStyle.paddingLeft !== '8px' || compactStyle.paddingRight !== '8px') {
      throw new Error(`Compact MessageFeed inline inset must resolve to 8px (received ${compactStyle.paddingLeft}/${compactStyle.paddingRight}).`);
    }
    if (comfortableStyle.paddingLeft !== '16px' || comfortableStyle.paddingRight !== '16px') {
      throw new Error(`Comfortable MessageFeed inline inset must resolve to 16px (received ${comfortableStyle.paddingLeft}/${comfortableStyle.paddingRight}).`);
    }
    /* viewportInset은 inline inset만 소유한다. block inset은 density가 소유하며
       기본 density(comfortable)는 읽기 리듬인 24px를 쓴다. 두 fixture가 같은
       block inset을 갖는 것이 이 스토리가 지키는 경계다. */
    if (compactStyle.paddingTop !== comfortableStyle.paddingTop
      || compactStyle.paddingBottom !== comfortableStyle.paddingBottom) {
      throw new Error('viewportInset must not change the block inset; density owns it.');
    }
    [compactStyle, comfortableStyle].forEach((computed) => {
      if (computed.paddingTop !== '24px' || computed.paddingBottom !== '24px') {
        throw new Error(`Comfortable-density MessageFeed block inset must resolve to 24px (received ${computed.paddingTop}/${computed.paddingBottom}).`);
      }
    });
  },
};
