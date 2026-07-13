import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Avatar, Button, ConversationMessage, MessageFeed, MessageComposer } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Communication/Message',
  component: ConversationMessage,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-communication-message--message-overview',
      eyebrow: 'Product / Communication',
      title: '메시지는 말풍선의 방향보다 보낸 사람과 처리 상태를 먼저 설명합니다',
      description:
        '사용자·AI·상담원·시스템이 한 대화 안에서 본문과 전송·응답 상태를 분명히 구분해야 할 때 사용합니다. 대화 전체의 스크롤, 새 항목 알림과 입력은 Message Feed와 Message Composer가 소유하며, 지도 주석이나 코치 마크에는 Bubble이 적합합니다.',
    },
    docs: {
      description: {
        component:
          '한 건의 대화 항목을 identity → body에서 시작해 response 상태는 evidence보다 먼저, delivery 상태는 payload 뒤에 두고 actions로 마무리하는 LK Product Extension입니다. direction과 authorRole을 서로 추론하지 않으며 개별 메시지는 live region을 만들지 않습니다.',
      },
    },
  },
};

export default meta;

const assistantAvatar = <Avatar name="LK Assistant" size="small" />;
const userAvatar = <Avatar name="김서윤" size="small" />;
const surfaceComparisonContent = '30% 미만 장비만\n보여 주세요.';

function assertNoPerMessageLiveRegions(root) {
  const messages = Array.from(root.querySelectorAll('.lk-conversation-message'));
  const liveMessage = messages.find((message) => (
    message.hasAttribute('aria-live')
    || message.getAttribute('role') === 'log'
    || message.querySelector('[aria-live], [role="log"], [role="status"], [role="alert"]')
  ));
  if (liveMessage) {
    throw new Error('ConversationMessage must not create a per-message live region.');
  }
}

function colorChannels(color) {
  const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!channels || channels.length !== 3) throw new Error(`Could not parse computed color: ${color}`);
  return channels;
}

function colorAlpha(color) {
  const channels = color.match(/[\d.]+/g)?.map(Number) ?? [];
  return channels.length > 3 ? channels[3] : 1;
}

function relativeLuminance(color) {
  const channels = colorChannels(color).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function assertSurfaceContrast(surface, minimum = 4.5) {
  const style = getComputedStyle(surface);
  const foreground = relativeLuminance(style.color);
  const background = relativeLuminance(style.backgroundColor);
  const ratio = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  if (ratio < minimum) {
    throw new Error(`Message surface contrast must be at least ${minimum}:1; received ${ratio.toFixed(2)}:1.`);
  }
}

function OverviewFixture() {
  return (
    <main style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 760 }}>
      <ConversationMessage
        direction="inbound"
        authorRole="assistant"
        author="LK Assistant"
        avatar={assistantAvatar}
        timestamp="오전 10:24"
        dateTime="2026-07-12T10:24:00+09:00"
        lifecycle={{ kind: 'response', state: 'complete' }}
      >
        로봇 3대의 배터리와 현재 작업을 확인했습니다. 충전이 필요한 장비부터 정리해 드릴까요?
      </ConversationMessage>
      <section
        aria-labelledby="message-surface-comparison-title"
        data-surface-comparison=""
        style={{ display: 'grid', gap: 'var(--space-3)' }}
      >
        <h2
          id="message-surface-comparison-title"
          style={{
            margin: 0,
            color: 'var(--color-semantic-label-neutral)',
            fontSize: 'var(--label1-size)',
            lineHeight: 'var(--label1-line)',
            fontWeight: 'var(--fw-semibold)',
          }}
        >
          동일 메시지의 표면 비교
        </h2>
        <div data-surface-example="soft" style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
            Soft · 전체 너비
          </span>
          <ConversationMessage
            direction="outbound"
            authorRole="user"
            author="김서윤"
            avatar={userAvatar}
            timestamp="오전 10:25"
            dateTime="2026-07-12T10:25:00+09:00"
            lifecycle={{ kind: 'delivery', state: 'sent' }}
          >
            {surfaceComparisonContent}
          </ConversationMessage>
        </div>
        <div data-surface-example="solid" style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
            Solid · 내용 너비
          </span>
          <ConversationMessage
            direction="outbound"
            authorRole="user"
            variant="solid"
            author="김서윤"
            avatar={userAvatar}
            timestamp="오전 10:25"
            dateTime="2026-07-12T10:25:00+09:00"
            lifecycle={{ kind: 'delivery', state: 'sent' }}
          >
            {surfaceComparisonContent}
          </ConversationMessage>
        </div>
      </section>
      <ConversationMessage
        direction="system"
        authorRole="system"
        variant="solid"
        author="운영 시스템"
        timestamp="오전 10:25"
        dateTime="2026-07-12T10:25:10+09:00"
      >
        상담원이 대화에 참여했습니다.
      </ConversationMessage>
      <ConversationMessage
        direction="inbound"
        authorRole="human-agent"
        author="운영 지원 · 박지훈"
        avatar={<Avatar name="박지훈" size="small" />}
        timestamp="오전 10:26"
        dateTime="2026-07-12T10:26:00+09:00"
      >
        안녕하세요. 충전 대기열까지 함께 확인하겠습니다.
      </ConversationMessage>
    </main>
  );
}

export const MessageOverview = {
  name: '개요',
  parameters: storyDescription(
    'AI 응답, soft·solid 사용자 전송, 시스템 경계와 상담원 메시지를 한 흐름에서 비교합니다. 같은 user·outbound·content에서 surface 축만 바뀌며, system은 solid를 받아도 avatar나 bubble surface가 생기지 않는지 확인하세요.',
  ),
  render: () => <OverviewFixture />,
  play: async ({ canvasElement }) => {
    const messages = Array.from(canvasElement.querySelectorAll('.lk-conversation-message'));
    if (messages.length !== 5) throw new Error(`Expected five message examples, found ${messages.length}.`);
    if (messages.map((message) => message.dataset.authorRole).join(',') !== 'assistant,user,user,system,human-agent') {
      throw new Error('Message author roles must remain explicit and independent from direction.');
    }
    const userMessages = messages.filter((message) => message.dataset.authorRole === 'user');
    const surfaceComparison = canvasElement.querySelector('[data-surface-comparison]');
    const surfaceLabels = surfaceComparison
      ? Array.from(surfaceComparison.querySelectorAll('[data-surface-example] > span')).map((label) => label.textContent?.trim())
      : [];
    if (surfaceLabels.join(',') !== 'Soft · 전체 너비,Solid · 내용 너비') {
      throw new Error('The repeated surface examples need visible labels so they cannot be mistaken for duplicate chat messages.');
    }
    const softUserSurface = userMessages.find((message) => message.dataset.messageVariant === 'soft')?.querySelector('[data-message-surface]');
    const solidUserSurface = userMessages.find((message) => message.dataset.messageVariant === 'solid')?.querySelector('[data-message-surface]');
    if (!softUserSurface || !solidUserSurface) throw new Error('The soft/solid user surface comparison is incomplete.');
    if (solidUserSurface.textContent !== softUserSurface.textContent) {
      throw new Error('The surface comparison must hold role, direction, and content constant.');
    }
    if (getComputedStyle(solidUserSurface).whiteSpace !== 'pre-wrap'
      || !solidUserSurface.textContent.includes('\n')) {
      throw new Error('The solid plain-text surface must preserve Composer line breaks.');
    }
    if (solidUserSurface.getBoundingClientRect().width >= softUserSurface.getBoundingClientRect().width) {
      throw new Error('A short solid chatbot message must shrink-wrap instead of becoming a full-width slab.');
    }
    assertSurfaceContrast(solidUserSurface);
    const system = messages.find((message) => message.dataset.direction === 'system');
    if (!system || system.querySelector('[data-message-avatar]')) {
      throw new Error('System messages must not render an avatar.');
    }
    const systemSurface = system.querySelector('[data-message-surface]');
    if (!systemSurface
      || systemSurface.dataset.messageSurfaceVariant !== 'system'
      || getComputedStyle(systemSurface).boxShadow !== 'none'
      || colorAlpha(getComputedStyle(systemSurface).backgroundColor) !== 0) {
      throw new Error('System messages must use the neutral line instead of a bubble surface.');
    }
    assertNoPerMessageLiveRegions(canvasElement);
  },
};

const deliveryStates = ['queued', 'sending', 'sent', 'failed', 'cancelled'];
const responseStates = ['pending', 'streaming', 'stopping', 'complete', 'cancelled', 'failed'];
const deliveryExamples = {
  queued: '메시지가 전송 순서를 기다리고 있습니다.',
  sending: '메시지를 전송하고 있습니다.',
  sent: '메시지가 전달되었습니다.',
  failed: '메시지를 전송하지 못했습니다.',
  cancelled: '메시지 전송을 취소했습니다.',
};
const responseExamples = {
  pending: '응답 준비를 시작했습니다.',
  streaming: '요청한 내용을 정리하고 있습니다.',
  stopping: '응답 생성을 중지하고 있습니다.',
  complete: '요청한 안내를 모두 작성했습니다.',
  cancelled: '응답 생성을 취소했습니다.',
  failed: '응답을 만들지 못했습니다.',
};

function LifecycleFixture() {
  const [callback, setCallback] = React.useState('아직 실행되지 않음');

  return (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 980 }}>
      <section aria-labelledby="delivery-lifecycle-title" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="delivery-lifecycle-title" style={{ margin: 0, fontSize: 'var(--body1-size)' }}>전송 상태</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-3)' }}>
          {deliveryStates.map((state) => (
            <ConversationMessage
              key={state}
              direction="outbound"
              authorRole="user"
              author="김서윤"
              data-lifecycle-example={`delivery-${state}`}
              lifecycle={{ kind: 'delivery', state }}
              attachments={state === 'sent' ? <span data-delivery-order-evidence>전송 payload 근거</span> : undefined}
              onRetry={state === 'failed' ? () => {} : undefined}
            >
              {deliveryExamples[state]}
            </ConversationMessage>
          ))}
        </div>
      </section>

      <section aria-labelledby="response-lifecycle-title" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="response-lifecycle-title" style={{ margin: 0, fontSize: 'var(--body1-size)' }}>응답 상태</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-3)' }}>
          {responseStates.map((state) => (
            <ConversationMessage
              key={state}
              direction="inbound"
              authorRole="assistant"
              author="LK Assistant"
              data-lifecycle-example={`response-${state}`}
              lifecycle={{ kind: 'response', state }}
              onRetry={state === 'failed' ? () => {} : undefined}
              onStop={['pending', 'streaming', 'stopping'].includes(state) ? () => {} : undefined}
            >
              {responseExamples[state]}
            </ConversationMessage>
          ))}
        </div>
      </section>

      <section aria-labelledby="callback-title" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="callback-title" style={{ margin: 0, fontSize: 'var(--body1-size)' }}>요청 이후 상태 유지</h2>
        <ConversationMessage
          data-callback-message="stop"
          direction="inbound"
          authorRole="assistant"
          author="LK Assistant"
          lifecycle={{ kind: 'response', state: 'streaming' }}
          onStop={() => setCallback('stop')}
          stopLabel="생성 중단 요청"
        >
          응답을 생성하고 있습니다.
        </ConversationMessage>
        <ConversationMessage
          data-callback-message="retry"
          direction="outbound"
          authorRole="user"
          author="김서윤"
          lifecycle={{ kind: 'delivery', state: 'failed' }}
          onRetry={() => setCallback('retry')}
          retryLabel="전송 다시 요청"
        >
          전송하지 못한 메시지입니다.
        </ConversationMessage>
        <p hidden data-callback-output>
          마지막 콜백: {callback}
        </p>
      </section>
    </main>
  );
}

export const LifecycleStates = {
  name: '상호작용 · 전송과 응답 생명주기',
  parameters: storyDescription(
    'outbound delivery와 inbound response의 상태를 분리해 비교합니다. response의 pending·streaming·stopping만 busy이고 complete는 기본 marker 없이 steady message가 됩니다. 실패에서만 retry, pending·streaming에서만 stop이 나타나며 callback 실행 뒤에도 앱이 새 prop을 주기 전에는 상태가 바뀌지 않습니다.',
  ),
  render: () => <LifecycleFixture />,
  play: async ({ canvasElement }) => {
    const messages = Array.from(canvasElement.querySelectorAll('.lk-conversation-message'));
    for (const message of messages) {
      const shouldBeBusy = message.dataset.lifecycleKind === 'response'
        && ['pending', 'streaming', 'stopping'].includes(message.dataset.lifecycleState);
      if ((message.getAttribute('aria-busy') === 'true') !== shouldBeBusy) {
        throw new Error(`aria-busy does not match ${message.dataset.lifecycleKind}:${message.dataset.lifecycleState}.`);
      }
    }

    const stopping = messages.find((message) => message.dataset.lifecycleState === 'stopping');
    if (stopping?.querySelector('button')) {
      throw new Error('Stopping must remain busy without exposing a duplicate stop action.');
    }
    const nonFailedRetry = messages.find((message) => (
      message.dataset.lifecycleState !== 'failed'
      && Array.from(message.querySelectorAll('button')).some((button) => button.textContent?.includes('다시'))
    ));
    if (nonFailedRetry) throw new Error('Retry controls are reserved for failed lifecycle states.');
    const completeResponse = messages.find((message) => (
      message.dataset.lifecycleKind === 'response' && message.dataset.lifecycleState === 'complete'
    ));
    if (completeResponse?.querySelector('[data-message-part="status"]')) {
      throw new Error('A completed response must become a steady message without a redundant default marker.');
    }
    const sentWithEvidence = canvasElement.querySelector('[data-lifecycle-example="delivery-sent"]');
    const sentParts = sentWithEvidence
      ? Array.from(sentWithEvidence.querySelectorAll(':scope > [data-message-part]')).map((part) => part.dataset.messagePart)
      : [];
    if (sentParts.join(',') !== 'identity,body,attachments,status') {
      throw new Error(`Delivery status must follow its complete payload; received ${sentParts.join(' → ')}.`);
    }

    const stopMessage = canvasElement.querySelector('[data-callback-message="stop"]');
    const stopButton = Array.from(stopMessage.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === '생성 중단 요청');
    if (!stopButton) throw new Error('The active response needs its explicit stop label.');
    await userEvent.click(stopButton);
    if (!canvasElement.querySelector('[data-callback-output]')?.textContent?.includes('stop')) {
      throw new Error('The stop callback was not delivered to the product fixture.');
    }
    if (stopMessage.dataset.lifecycleState !== 'streaming') {
      throw new Error('ConversationMessage must not infer transport completion after onStop.');
    }

    const retryMessage = canvasElement.querySelector('[data-callback-message="retry"]');
    const retryButton = Array.from(retryMessage.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === '전송 다시 요청');
    if (!retryButton) throw new Error('The failed delivery needs its explicit retry label.');
    await userEvent.click(retryButton);
    if (!canvasElement.querySelector('[data-callback-output]')?.textContent?.includes('retry')) {
      throw new Error('The retry callback was not delivered to the product fixture.');
    }
    if (retryMessage.dataset.lifecycleState !== 'failed') {
      throw new Error('ConversationMessage must not infer delivery success after onRetry.');
    }
    assertNoPerMessageLiveRegions(canvasElement);
  },
};

const evidenceSources = [
  {
    id: 'fleet-policy',
    label: 'Fleet charging policy / 2026-Q3',
    kind: '운영 정책',
    location: 'Fleet operations',
    availability: 'available',
    href: 'https://example.com/fleet-policy',
    actionAriaLabel: 'Fleet charging policy / 2026-Q3: 새 창에서 열기',
  },
];

function AttachmentSlot() {
  return (
    <ul aria-label="첨부 파일" style={{ display: 'grid', gap: 'var(--space-2)', margin: 0, padding: 0, listStyle: 'none' }}>
      <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', minWidth: 0, paddingBlock: 'var(--space-2)', borderBlock: '1px solid var(--color-semantic-line-normal-alternative)' }}>
        <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>robot-17-inspection.pdf</span>
        <a href="https://example.com/inspection" style={{ flexShrink: 0, color: 'var(--color-semantic-primary-normal)' }}>열기</a>
      </li>
    </ul>
  );
}

export const GroupedMessagesAndSlots = {
  name: '사용법 · 그룹과 첨부·출처',
  parameters: storyDescription(
    '같은 assistant의 연속 메시지를 first·middle·last로 묶고 첫 항목에 attachment, source, lifecycle과 action을 함께 배치합니다. avatar는 첫 항목에만 보이지만 모든 article에 author identity가 남고, 각 영역의 DOM 순서가 읽기 순서와 일치하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-1)', width: '100%', maxWidth: 760 }}>
      <ConversationMessage
        data-group-message="first"
        direction="inbound"
        authorRole="assistant"
        groupPosition="first"
        author="LK Assistant"
        avatar={assistantAvatar}
        timestamp="오전 11:02"
        dateTime="2026-07-12T11:02:00+09:00"
        lifecycle={{ kind: 'response', state: 'complete' }}
        attachments={<AttachmentSlot />}
        sources={evidenceSources}
        sourcePresentation="compact"
        actions={<Button size="sm" variant="ghost">답변 복사</Button>}
      >
        배터리 30% 미만 장비는 robot-17 한 대입니다.
      </ConversationMessage>
      <ConversationMessage
        data-group-message="middle"
        direction="inbound"
        authorRole="assistant"
        groupPosition="middle"
        author="LK Assistant"
        timestamp="오전 11:02"
        dateTime="2026-07-12T11:02:05+09:00"
      >
        현재 충전 대기열은 비어 있습니다.
      </ConversationMessage>
      <ConversationMessage
        data-group-message="last"
        direction="inbound"
        authorRole="assistant"
        groupPosition="last"
        author="LK Assistant"
        timestamp="오전 11:02"
        dateTime="2026-07-12T11:02:09+09:00"
      >
        점검 문서와 적용한 운영 정책을 함께 첨부했습니다.
      </ConversationMessage>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const first = canvasElement.querySelector('[data-group-message="first"]');
    const middle = canvasElement.querySelector('[data-group-message="middle"]');
    const last = canvasElement.querySelector('[data-group-message="last"]');
    if (!first || !middle || !last) throw new Error('The grouped message run is incomplete.');

    const partOrder = Array.from(first.querySelectorAll(':scope > [data-message-part]'))
      .map((part) => part.dataset.messagePart);
    const expectedOrder = ['identity', 'body', 'attachments', 'sources', 'actions'];
    if (partOrder.join(',') !== expectedOrder.join(',')) {
      throw new Error(`Message DOM order must be ${expectedOrder.join(' → ')}, received ${partOrder.join(' → ')}.`);
    }
    const compactSources = first.querySelector('[data-message-sources-disclosure]');
    const compactSummary = compactSources?.querySelector('summary');
    if (!compactSources || compactSources.open || compactSummary?.textContent?.trim() !== '근거 1개') {
      throw new Error('The compact source disclosure must start closed with its source count.');
    }
    await userEvent.click(compactSummary);
    const sourceLink = compactSources.querySelector('a[href="https://example.com/fleet-policy"]');
    if (!compactSources.open
      || sourceLink?.getAttribute('aria-label') !== 'Fleet charging policy / 2026-Q3: 새 창에서 열기') {
      throw new Error('Expanding compact sources must reveal the original provenance link with a new-window label.');
    }
    await userEvent.click(compactSummary);
    if (first.querySelectorAll('[data-message-avatar]').length !== 1
      || middle.querySelector('[data-message-avatar]')
      || last.querySelector('[data-message-avatar]')) {
      throw new Error('Only first/single grouped messages may render the 32px avatar slot.');
    }
    for (const grouped of [middle, last]) {
      const identity = grouped.querySelector('[data-message-part="identity"]');
      if (identity?.dataset.visuallyHidden !== 'true' || !identity.textContent?.includes('LK Assistant')) {
        throw new Error('Middle/last messages must retain a visually hidden author identity.');
      }
      if (!grouped.getAttribute('aria-labelledby')) {
        throw new Error('Grouped message articles must remain named by their hidden identity.');
      }
    }
    assertNoPerMessageLiveRegions(canvasElement);
  },
};

// ---------------------------------------------------------------------------
// C4 · Composition
//
// A small example of ConversationMessage + MessageFeed + MessageComposer +
// SourceDisclosure working together. This is intentionally NOT a new component:
// there is no ChatWindow export and no simulated backend. Transport, streaming,
// persistence and retrieval stay with the product; the fixture only echoes the
// user's own submission and clears the controlled composer value.
// ---------------------------------------------------------------------------

const compositionSources = [
  {
    id: 'charging-policy',
    label: '충전 우선순위 정책 / 2026-Q3',
    kind: '운영 정책',
    location: 'Fleet operations',
    availability: 'available',
    href: 'https://example.com/charging-policy',
  },
];

const compositionSeed = [
  {
    id: 'seed-user',
    direction: 'outbound',
    authorRole: 'user',
    variant: 'solid',
    author: '김서윤',
    avatar: userAvatar,
    timestamp: '오전 9:58',
    dateTime: '2026-07-12T09:58:00+09:00',
    lifecycle: { kind: 'delivery', state: 'sent' },
    body: '오전 배송 로봇들 상태부터 확인해 주세요.',
  },
  {
    id: 'seed-assistant',
    direction: 'inbound',
    authorRole: 'assistant',
    author: 'LK Assistant',
    avatar: assistantAvatar,
    timestamp: '오전 9:59',
    dateTime: '2026-07-12T09:59:00+09:00',
    lifecycle: { kind: 'response', state: 'complete' },
    sources: compositionSources,
    sourcePresentation: 'compact',
    body: '배송 로봇 4대 중 robot-17 한 대만 충전이 필요합니다. 적용한 충전 우선순위 정책을 함께 표시했습니다.',
  },
  {
    id: 'seed-system',
    direction: 'system',
    authorRole: 'system',
    author: '운영 시스템',
    timestamp: '오전 10:00',
    dateTime: '2026-07-12T10:00:00+09:00',
    body: '상담원이 대화에 참여했습니다.',
  },
];

function CompositionFixture() {
  const [value, setValue] = React.useState('robot-17을 충전 대기열에 넣어 주세요.');
  const [entries, setEntries] = React.useState(compositionSeed);
  const [submitCount, setSubmitCount] = React.useState(0);

  const handleSubmit = (submitted) => {
    const text = String(submitted).trim();
    if (!text) return;
    // Local echo of the user's own message only. The product would own the
    // request lifecycle and any assistant response; we do not fake one here.
    setEntries((current) => [
      ...current,
      {
        id: `sent-${current.length + 1}`,
        direction: 'outbound',
        authorRole: 'user',
        variant: 'solid',
        author: '김서윤',
        avatar: userAvatar,
        timestamp: '오전 10:02',
        dateTime: '2026-07-12T10:02:00+09:00',
        lifecycle: { kind: 'delivery', state: 'sent' },
        body: text,
      },
    ]);
    setValue('');
    setSubmitCount((count) => count + 1);
  };

  return (
    <main data-composition style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 640, minWidth: 0 }}>
      <MessageFeed ariaLabel="충전 운영 대화" maxHeight={440}>
        {entries.map((entry) => (
          <ConversationMessage
            key={entry.id}
            data-composition-message={entry.id}
            direction={entry.direction}
            authorRole={entry.authorRole}
            variant={entry.variant}
            author={entry.author}
            avatar={entry.avatar}
            timestamp={entry.timestamp}
            dateTime={entry.dateTime}
            lifecycle={entry.lifecycle}
            sources={entry.sources}
            sourcePresentation={entry.sourcePresentation}
          >
            {entry.body}
          </ConversationMessage>
        ))}
      </MessageFeed>
      <MessageComposer
        value={value}
        onValueChange={setValue}
        onSubmit={handleSubmit}
        inputLabel="충전 운영 대화 입력"
        placeholder="메시지를 입력하고 보내기를 누르세요."
        submitLabel="메시지 보내기"
        description="전송·응답 처리는 제품이 담당합니다. 이 예시는 입력한 메시지만 로컬로 덧붙입니다."
      />
      <output hidden data-composition-count>
        보낸 메시지 {submitCount}건
      </output>
    </main>
  );
}

export const ConversationComposition = {
  name: '사용법 · 피드·메시지·작성기 구성',
  parameters: storyDescription(
    'ConversationMessage, MessageFeed, MessageComposer, SourceDisclosure를 하나의 작은 대화 예시로 조합합니다. 챗봇 문맥의 사용자 발화는 명시적 solid variant로 강하게 식별하고 assistant 응답은 기본 neutral surface를 유지합니다. 완료된 응답은 중복 marker 없이 본문에서 출처로 이어지고, Feed만 log live-region을 소유합니다. Composer 제출은 값을 지우되 전송 성공이나 응답 생성을 대신 연출하지 않습니다. 이 story는 새로운 ChatWindow 컴포넌트가 아니라 조합 예시입니다.',
  ),
  render: () => <CompositionFixture />,
  play: async ({ canvasElement }) => {
    const composition = canvasElement.querySelector('[data-composition]');
    const log = composition?.querySelector('[role="log"]');
    if (!composition || !log) throw new Error('The composition must place messages inside a MessageFeed log.');

    // The feed owns the single log live region; the individual messages do not.
    const messages = Array.from(log.querySelectorAll('.lk-conversation-message'));
    if (messages.length !== 3) throw new Error(`Expected the three seeded messages, found ${messages.length}.`);
    if (messages.some((message) => message.hasAttribute('aria-live') || message.getAttribute('role') === 'log')) {
      throw new Error('Only the feed may own a live region; individual messages must not.');
    }

    // The assistant message discloses its source through SourceDisclosure.
    const assistant = composition.querySelector('[data-composition-message="seed-assistant"]');
    const assistantParts = assistant
      ? Array.from(assistant.querySelectorAll(':scope > [data-message-part]')).map((part) => part.dataset.messagePart)
      : [];
    const sourceDetails = assistant?.querySelector('[data-message-sources-disclosure]');
    const sourceSummary = sourceDetails?.querySelector('summary');
    if (!assistant?.querySelector('[data-message-part="sources"]') || !sourceDetails || !sourceSummary) {
      throw new Error('The assistant message must compose SourceDisclosure through its sources slot.');
    }
    if (assistantParts.join(',') !== 'identity,body,sources') {
      throw new Error(`A completed sourced response must read identity → body → sources without a detached completion marker; received ${assistantParts.join(' → ')}.`);
    }
    if (sourceDetails.open || sourceSummary.textContent?.trim() !== '근거 1개') {
      throw new Error('The chatbot source presentation must start as a compact, named disclosure.');
    }
    await userEvent.click(sourceSummary);
    const expandedSource = sourceDetails.querySelector('.lk-source-disclosure');
    if (!sourceDetails.open || !expandedSource) {
      throw new Error('The compact source disclosure must reveal the full provenance component on request.');
    }
    const sourceHeading = expandedSource.querySelector('h3');
    if (!sourceHeading
      || expandedSource.getAttribute('aria-labelledby') !== sourceHeading.id
      || getComputedStyle(sourceHeading).position !== 'absolute'
      || sourceHeading.getBoundingClientRect().width !== 1
      || sourceHeading.getBoundingClientRect().height !== 1) {
      throw new Error('The nested source section must keep its accessible name without repeating a visible 출처 heading.');
    }
    await userEvent.click(sourceSummary);
    if (sourceDetails.open) {
      throw new Error('The compact native disclosure must close from its summary trigger.');
    }

    // The composer submit echoes the user's message and clears the value.
    const textarea = composition.querySelector('[data-composer-input]');
    const sendButton = composition.querySelector('.lk-message-composer button[type="submit"]');
    if (!textarea || !sendButton) throw new Error('The composition must include the message composer.');
    await waitFor(() => {
      if (sendButton.disabled) throw new Error('The controlled composer value has not enabled submission yet.');
    });
    await userEvent.click(sendButton);

    const sent = await waitFor(() => {
      const message = composition.querySelector('[data-composition-message="sent-4"]');
      if (!message) throw new Error('Submitting through the composer must append the user message to the feed.');
      return message;
    });
    if (!sent || !sent.textContent?.includes('충전 대기열')) {
      throw new Error('Submitting through the composer must append the user message to the feed.');
    }
    if (sent.dataset.messageVariant !== 'solid') {
      throw new Error('Chatbot user messages must retain the explicit solid identity variant.');
    }
    if (textarea.value !== '') {
      throw new Error('The controlled composer value should be cleared by the product fixture after submit.');
    }
    if (canvasElement.querySelector('[data-composition-count]')?.textContent?.replace(/\s/g, '') !== '보낸메시지1건') {
      throw new Error('The submit callback count did not update.');
    }
    const logRect = log.getBoundingClientRect();
    const clippedMessage = Array.from(log.querySelectorAll('.lk-conversation-message')).find((message) => {
      const rect = message.getBoundingClientRect();
      return rect.top < logRect.top - 1 || rect.bottom > logRect.bottom + 1;
    });
    if (clippedMessage) {
      throw new Error('The representative composition must show complete message boundaries instead of starting on a partially clipped item.');
    }
  },
};

export const NarrowLongContent = {
  name: '반응형 · 320px 긴 콘텐츠',
  parameters: storyDescription(
    '320px에서 긴 한국어, English identifier, code와 URL을 한 대화에 배치합니다. 메시지 column과 source/attachment 영역이 viewport 밖으로 밀리지 않고, code만 필요한 경우 자체 scroll container 안에서 읽히는지 확인하세요.',
  ),
  render: () => (
    <main data-narrow-message-fixture style={{ display: 'grid', gap: 'var(--space-3)', width: 320, maxWidth: '100%' }}>
      <ConversationMessage
        direction="inbound"
        authorRole="assistant"
        author="LK Assistant Operations and Safety Assistant"
        authorLabel="LK 운영·안전 어시스턴트"
        avatar={assistantAvatar}
        timestamp="오후 1:48"
        dateTime="2026-07-12T13:48:00+09:00"
        lifecycle={{ kind: 'response', state: 'streaming' }}
        sources={compositionSources}
        sourcePresentation="compact"
        onStop={() => {}}
      >
        <p style={{ margin: 0 }}>
          엘리베이터탑승지점과경사구역사이의장거리경로식별자를 확인하고 있습니다.
        </p>
        <pre tabIndex={0} aria-label="경로 필터 코드" style={{ maxWidth: '100%', margin: 'var(--space-3) 0 0', padding: 'var(--space-3)', overflow: 'auto', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-inverse-background)', color: 'var(--color-semantic-inverse-label)', fontSize: 'var(--caption1-size)' }}><code>route.waypoints.filter((point) =&gt; point.constraints?.slopePercent &lt;= 8)</code></pre>
        <a href="https://example.com/fleet/routes/very-long-warehouse-route-identifier-without-shortening" style={{ display: 'inline-block', maxWidth: '100%', marginTop: 'var(--space-3)', color: 'var(--color-semantic-primary-normal)', overflowWrap: 'anywhere' }}>
          https://example.com/fleet/routes/very-long-warehouse-route-identifier-without-shortening
        </a>
      </ConversationMessage>
      <ConversationMessage
        direction="outbound"
        authorRole="human-agent"
        variant="solid"
        author="Remote operations specialist with a long display name"
        timestamp="오후 1:49"
        dateTime="2026-07-12T13:49:00+09:00"
        lifecycle={{ kind: 'delivery', state: 'queued' }}
      >
        Please keep the original facility-transition-and-slope-restriction identifier visible for audit review.
      </ConversationMessage>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-narrow-message-fixture]');
    if (!fixture) throw new Error('The 320px fixture is missing.');
    if (fixture.scrollWidth > fixture.clientWidth + 1) {
      throw new Error('ConversationMessage must not create horizontal overflow at 320px.');
    }
    const fixtureRect = fixture.getBoundingClientRect();
    for (const message of fixture.querySelectorAll('.lk-conversation-message')) {
      const rect = message.getBoundingClientRect();
      if (rect.left < fixtureRect.left - 1 || rect.right > fixtureRect.right + 1) {
        throw new Error('A long message escaped the narrow conversation column.');
      }
    }
    const solidOutbound = fixture.querySelector('[data-direction="outbound"][data-message-variant="solid"]');
    if (!solidOutbound) {
      throw new Error('The narrow chatbot example must retain the solid outbound identity surface.');
    }
    const solidSurface = solidOutbound.querySelector('[data-message-surface]');
    if (!solidSurface || solidSurface.getBoundingClientRect().right > fixtureRect.right + 1) {
      throw new Error('The shrink-wrapped solid surface must respect the 320px conversation boundary.');
    }
    const pre = fixture.querySelector('pre');
    if (!pre || getComputedStyle(pre).overflowX !== 'auto') {
      throw new Error('Long code must remain in its own horizontal scroll container.');
    }
    const compactSources = fixture.querySelector('[data-source-presentation="compact"] [data-message-sources-disclosure]');
    if (!compactSources || compactSources.open || compactSources.getBoundingClientRect().right > fixtureRect.right + 1) {
      throw new Error('Compact sources must remain collapsed and inside the 320px conversation boundary.');
    }
    const inboundParts = Array.from(fixture.querySelector('[data-direction="inbound"]').querySelectorAll(':scope > [data-message-part]'))
      .map((part) => part.dataset.messagePart);
    if (inboundParts.join(',') !== 'identity,body,status,sources,actions') {
      throw new Error(`An active response must place status before sources and actions; received ${inboundParts.join(' → ')}.`);
    }
    assertNoPerMessageLiveRegions(canvasElement);
  },
};

export const DarkTheme = {
  name: '변형·상태 · 다크 배경',
  parameters: storyDescription(
    '동일한 inbound·outbound·system 문법을 dark semantic theme 안에서 확인합니다. 별도 inverse prop 없이도 neutral hairline, primary surface, author·timestamp·status의 대비와 system line 계층이 유지되는지 확인하세요.',
  ),
  render: () => (
    <main
      data-theme="dark"
      style={{ display: 'grid', gap: 'var(--space-3)', width: '100%', maxWidth: 760, padding: 'var(--space-5)', boxSizing: 'border-box', borderRadius: 'var(--radius-xl)', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <ConversationMessage
        direction="inbound"
        authorRole="assistant"
        author="LK Assistant"
        avatar={assistantAvatar}
        lifecycle={{ kind: 'response', state: 'complete' }}
      >
        다크 운영 화면에서도 source와 lifecycle은 본문 아래 같은 읽기 순서를 유지합니다.
      </ConversationMessage>
      <ConversationMessage
        direction="outbound"
        authorRole="user"
        variant="solid"
        author="김서윤"
        avatar={userAvatar}
        lifecycle={{ kind: 'delivery', state: 'sending' }}
      >
        현재 상태를 계속 확인해 주세요.
      </ConversationMessage>
      <ConversationMessage direction="system" authorRole="system" author="운영 시스템">
        네트워크가 복구되었습니다.
      </ConversationMessage>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const theme = canvasElement.querySelector('[data-theme="dark"]');
    const messages = theme ? Array.from(theme.querySelectorAll('.lk-conversation-message')) : [];
    if (!theme || messages.length !== 3) throw new Error('The dark message comparison is incomplete.');
    const inbound = theme.querySelector('[data-direction="inbound"] [data-message-surface]');
    const outbound = theme.querySelector('[data-direction="outbound"] [data-message-surface]');
    if (!inbound || !outbound || getComputedStyle(inbound).backgroundColor === getComputedStyle(outbound).backgroundColor) {
      throw new Error('Inbound neutral elevation and outbound primary surface must remain distinct in dark theme.');
    }
    if (outbound.closest('[data-message-variant]')?.dataset.messageVariant !== 'solid') {
      throw new Error('The dark chatbot comparison must retain the solid outbound identity variant.');
    }
    assertSurfaceContrast(outbound);
    assertNoPerMessageLiveRegions(theme);
  },
};

// LifecycleStates and NarrowLongContent are exported inline above (near their
// definitions) so their storyDescription() is detected by the Storybook IA
// description audit; sidebar order is driven by the name-based storySort.

export const MessageFamilyVisualParity = {
  ...DarkTheme,
  name: 'Conversation message family visual parity',
  tags: ['!dev', 'visual-parity'],
};
