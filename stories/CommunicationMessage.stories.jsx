import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Avatar,
  Chip,
  ConversationMessage,
  Icon,
  IconButton,
  MessageComposer,
  MessageFeed,
  SourceDisclosure,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Communication/Message',
  tags: ['autodocs'],
  component: ConversationMessage,
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['inbound', 'outbound'],
      description: '참여자 메시지의 시각적 배치를 재정의합니다. system 역할에는 적용되지 않습니다.',
      table: { type: { summary: "'inbound' | 'outbound'" } },
    },
    authorRole: {
      control: 'select',
      options: ['user', 'assistant', 'human-agent', 'system'],
      description: '작성자 역할이며 기본 presentation, direction, 접근 가능한 역할명을 결정합니다.',
      table: { defaultValue: { summary: 'assistant' }, type: { summary: "'user' | 'assistant' | 'human-agent' | 'system'" } },
    },
    presentation: {
      control: 'inline-radio',
      options: ['document', 'bubble'],
      description: '참여자 본문의 표현 방식입니다. 역할이나 신뢰도는 바꾸지 않습니다.',
      table: { type: { summary: "'document' | 'bubble'" } },
    },
    groupPosition: {
      control: 'inline-radio',
      options: ['single', 'first', 'middle', 'last'],
      description: '같은 작성자의 연속 메시지에서 identity 반복과 bubble 모서리 연결을 조정합니다.',
      table: { defaultValue: { summary: 'single' }, type: { summary: "'single' | 'first' | 'middle' | 'last'" } },
    },
    lifecycle: {
      control: 'object',
      description: '제품이 소유한 전송 또는 AI 응답 상태를 표현합니다. 컴포넌트는 상태 전이를 추론하지 않습니다.',
      table: { defaultValue: { summary: "{ kind: 'static' }" }, type: { summary: 'MessageLifecycle' } },
    },
    author: {
      control: 'text',
      description: '화면에 표시할 작성자 이름입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    authorLabel: {
      control: 'text',
      description: '비문자 author를 위한 접근 가능한 작성자 이름입니다.',
      table: { type: { summary: 'string' } },
    },
    roleBadgeLabel: {
      control: 'text',
      description: '이름 옆 장식 역할 배지를 재정의합니다. null이면 배지를 숨깁니다.',
      table: { type: { summary: 'ReactNode | null' } },
    },
    avatar: {
      control: false,
      description: '참여자 identity에 조합할 Avatar 등의 시각 요소입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    timestamp: {
      control: 'text',
      description: '사용자에게 표시할 전송 또는 응답 시각입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    dateTime: {
      control: 'text',
      description: 'timestamp에 대응하는 machine-readable 날짜·시각 값입니다.',
      table: { type: { summary: 'string' } },
    },
    statusLabel: {
      control: 'text',
      description: '기본 lifecycle 문구를 덮어씁니다. null이면 상태 문구를 숨깁니다.',
      table: { type: { summary: 'ReactNode | null' } },
    },
    attachments: {
      control: false,
      description: '본문 다음에 배치할 완료된 첨부 표현 또는 attachment 컴포넌트 slot입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    sources: {
      control: false,
      description: '출처와 provenance를 표현하는 SourceDisclosure 등의 slot입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    inlineSources: {
      control: 'boolean',
      description: 'sources를 별도 행 대신 메시지 액션 그룹과 같은 footer의 형제로 배치합니다.',
      table: { defaultValue: { summary: false }, type: { summary: 'boolean' } },
    },
    actions: {
      control: false,
      description: '제품이 직접 조합하는 추가 메시지 동작 ReactNode slot입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    messageActions: {
      control: 'object',
      description: '접근 가능한 label을 가진 icon-only quick action 목록입니다. 제품이 실행, disabled와 선택형 action의 pressed 상태를 소유합니다.',
      table: { type: { summary: 'Array<{ key, icon, label, disabled?, pressed?, onClick? }>' } },
    },
    error: {
      control: 'text',
      description: '실패한 메시지 본문에 경고 glyph와 함께 표시할 오류 내용입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    onRetry: {
      control: false,
      description: 'failed lifecycle에서만 재시도 아이콘을 노출하는 요청 callback입니다.',
      table: { type: { summary: '() => void' } },
    },
    retryLabel: {
      control: 'text',
      description: '재시도 아이콘 버튼의 접근 가능한 이름입니다.',
      table: { defaultValue: { summary: '메시지 다시 보내기' }, type: { summary: 'ReactNode' } },
    },
    children: {
      control: false,
      description: '메시지의 주 본문 콘텐츠입니다.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      control: 'text',
      description: '최상위 article에 추가할 class 이름입니다.',
      table: { type: { summary: 'string' } },
    },
    style: {
      control: 'object',
      description: '최상위 article에 병합할 인라인 스타일입니다.',
      table: { type: { summary: 'CSSProperties' } },
    },
    'aria-label': {
      control: 'text',
      description: 'article의 직접 접근 가능한 이름입니다. 지정하면 기본 author 기반 labelledby를 대체합니다.',
      table: { type: { summary: 'string' } },
    },
    'aria-labelledby': {
      control: 'text',
      description: 'article의 접근 가능한 이름을 제공하는 요소 ID 목록입니다.',
      table: { type: { summary: 'string' } },
    },
  },
  parameters: {
    controls: { disable: true },
    storyGuide: {
      storyId: 'lds-product-communication-message--message-overview',
      eyebrow: 'Product / Communication',
      title: '긴 답변과 짧은 발화를 읽기 흐름에 맞춰 구분합니다',
      description:
        'AI 응답, 사용자 발화, 상담원과 시스템 알림이 한 대화에 섞일 때 사용합니다. 긴 응답의 목록·코드·출처는 읽기 흐름으로, 짧은 발화는 화자별 말풍선으로 구분합니다. 대화 맥락이 없는 안내나 폼 오류에는 사용하지 말고 Callout·FormField를 사용하세요.',
    },
    docs: {
      description: {
        component:
          'assistant=borderless document, user=solid primary bubble, human-agent=neutral fill bubble, system=중앙 neutral pill 칩을 기본으로 하며 attachment·source·action은 ReactNode slot으로 조합하는 LK Product Extension입니다.',
      },
    },
  },
};

export default meta;

const assistantAvatar = <Avatar name="AI Assistant" size="small" />;
const userAvatar = <Avatar name="김서윤" size="small" />;

// Consumed through EvidenceBlock, which renders the collapsible "출처" toggle +
// popover — so only id/label/href are used. Provenance fields (kind, location,
// availability) render in the card mode and are demonstrated in
// ContentSourceDisclosure's own stories, not here.
const answerSources = [
  { id: 'meeting-notes', label: '주간 회의록 · 2026-07-12', href: 'https://example.com/meeting-notes' },
  { id: 'decision-log', label: '결정 사항 정리 문서', href: 'https://example.com/decision-log' },
  { id: 'owner-plan', label: '담당자 배정표', href: 'https://example.com/owner-plan' },
];

// One consistent source treatment across every message story: the collapsed
// "출처" toggle that opens the source list in a Popover. Products pair it with
// inlineSources on messages that have an action bar so it joins the footer row.
function EvidenceBlock() {
  return <SourceDisclosure title="출처" collapsible sources={answerSources} />;
}

function AttachmentChip({ children = 'weekly-meeting-notes.pdf' }) {
  return (
    <Chip size="sm" variant="outlined" leading={<Icon name="attachment" size={14} />}>
      {children}
    </Chip>
  );
}

// Message quick-actions read as icon-only controls (the AI-chat convention),
// not text buttons; the accessible name lives on IconButton's `label`.
function CopyAction() {
  return (
    <IconButton label="복사" size="small" round={false} variant="plain">
      <Icon name="copy" size={16} />
    </IconButton>
  );
}

function CondenseAction() {
  return (
    <IconButton label="간단히 보기" size="small" round={false} variant="plain">
      <Icon name="list" size={16} />
    </IconButton>
  );
}

function AddFileAction(props) {
  return (
    <IconButton label="파일 추가" size="small" round={false} variant="plain" {...props}>
      <Icon name="attachment" size={16} />
    </IconButton>
  );
}

function AssistantAnswer() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <p style={{ margin: 0 }}>
        회의록에서 이번 주에 결정해야 할 내용을 세 가지로 정리했습니다.
      </p>
      <section aria-labelledby="answer-summary-title" style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h2 id="answer-summary-title" style={{ margin: 0, fontSize: 'var(--headline1-size)', lineHeight: 'var(--headline1-line)' }}>
          우선순위
        </h2>
        <ol style={{ margin: 0, paddingInlineStart: 'var(--space-5)' }}>
          <li>금요일까지 사용자 인터뷰 질문지를 확정합니다.</li>
          <li>다음 배포 범위를 한 페이지로 정리합니다.</li>
          <li>담당자와 검토 일정을 캘린더에 반영합니다.</li>
        </ol>
      </section>
      <p style={{ margin: 0 }}>
        원하시면 이 내용을 담당자별 체크리스트로 다시 바꿔 드릴 수 있습니다.
      </p>
    </div>
  );
}

function assertNoPerMessageLiveRegions(root) {
  const invalid = Array.from(root.querySelectorAll('.lk-conversation-message')).find((message) => (
    message.hasAttribute('aria-live')
    || message.getAttribute('role') === 'log'
    || message.querySelector('[aria-live], [role="log"], [role="status"], [role="alert"]')
  ));
  if (invalid) throw new Error('ConversationMessage must not create a per-message live region.');
}

function OverviewFixture(messageArgs) {
  return (
    <main data-message-overview style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <ConversationMessage
        {...messageArgs}
        avatar={assistantAvatar}
        sources={<EvidenceBlock />}
        actions={(
          <>
            <CopyAction />
            <CondenseAction />
          </>
        )}
      >
        <AssistantAnswer />
      </ConversationMessage>

      <ConversationMessage
        authorRole="user"
        author="김서윤"
        avatar={userAvatar}
        timestamp="오전 10:26"
        dateTime="2026-07-12T10:26:00+09:00"
        lifecycle={{ kind: 'delivery', state: 'read' }}
      >
        담당자별 체크리스트로 바꿔 주세요.
      </ConversationMessage>

      <ConversationMessage authorRole="system" author="대화 시스템">
        상담원이 대화에 참여했습니다.
      </ConversationMessage>

      <ConversationMessage
        authorRole="human-agent"
        author="지원 담당자 · 박지훈"
        avatar={<Avatar name="박지훈" size="small" />}
        timestamp="오전 10:27"
        dateTime="2026-07-12T10:27:00+09:00"
      >
        일정 확인이 필요하면 제가 이어서 도와드릴게요.
      </ConversationMessage>
    </main>
  );
}

export const MessageOverview = {
  name: '개요',
  parameters: {
    ...storyDescription(
      '약 760px 읽기 폭에서 assistant 장문 document, user solid primary bubble, system 중앙 pill 칩과 optional human-agent neutral fill bubble을 비교합니다. source는 SourceDisclosure, action은 별도 ReactNode slot으로 조합하며 제품 panel이나 고정 sidebar를 만들지 않습니다. Controls는 첫 번째 assistant message의 실제 props에 연결됩니다.',
    ),
    controls: { disable: false },
  },
  args: {
    authorRole: 'assistant',
    author: 'AI Assistant',
    timestamp: '오전 10:24',
    dateTime: '2026-07-12T10:24:00+09:00',
    lifecycle: { kind: 'response', state: 'complete' },
    groupPosition: 'single',
    inlineSources: true,
  },
  render: (args) => <OverviewFixture {...args} />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-message-overview]');
    const messages = fixture ? Array.from(fixture.querySelectorAll('.lk-conversation-message')) : [];
    if (!fixture || messages.length !== 4) throw new Error('The representative message flow is incomplete.');
    if (messages.map((message) => message.dataset.messagePresentation).join(',') !== 'document,bubble,system,bubble') {
      throw new Error('Role defaults must resolve to document, bubble, system, and bubble.');
    }
    if (messages.map((message) => message.dataset.direction).join(',') !== 'inbound,outbound,system,inbound') {
      throw new Error('Role defaults must preserve participant placement.');
    }
    const documentBody = messages[0].querySelector('[data-message-part="body"]');
    const userBody = messages[1].querySelector('[data-message-part="body"]');
    if (!documentBody || !userBody || documentBody.style.background !== 'transparent') {
      throw new Error('The assistant answer must use a chrome-free document body.');
    }
    if (userBody.style.background === 'transparent' || userBody.getBoundingClientRect().width >= fixture.getBoundingClientRect().width - 1) {
      throw new Error('The user request must remain a compact primary bubble.');
    }
    if (!messages[0].querySelector('.lk-source-disclosure') || !messages[0].querySelector('[data-message-part="actions"]')) {
      throw new Error('The rich assistant document must compose source and action slots.');
    }
    if (messages[2].querySelector('[data-message-avatar]')) {
      throw new Error('System messages must not render an avatar.');
    }
    assertNoPerMessageLiveRegions(fixture);
  },
};

const deliveryStates = ['queued', 'sending', 'sent', 'read', 'failed', 'cancelled'];
const responseStates = ['pending', 'streaming', 'stopping', 'complete', 'cancelled', 'failed'];

function LifecycleFixture() {
  const [lastRequest, setLastRequest] = React.useState('없음');
  return (
    <main style={{ display: 'grid', gap: 'var(--space-8)', width: '100%', maxWidth: 980 }}>
      <section aria-labelledby="delivery-title" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="delivery-title" style={{ margin: 0, fontSize: 'var(--heading2-size)' }}>사용자 전송 상태</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 'var(--space-4)' }}>
          {deliveryStates.map((state) => (
            <ConversationMessage
              key={state}
              data-lifecycle-example={`delivery-${state}`}
              authorRole="user"
              author="사용자"
              timestamp="오후 2:30"
              dateTime="2026-07-12T14:30:00+09:00"
              lifecycle={{ kind: 'delivery', state }}
              attachments={state === 'sending' ? <AttachmentChip>draft-summary.pdf</AttachmentChip> : undefined}
              onRetry={state === 'failed' ? () => setLastRequest('delivery-retry') : undefined}
              retryLabel="전송 다시 시도"
            >
              전송 상태가 {state}인 짧은 사용자 메시지입니다.
            </ConversationMessage>
          ))}
        </div>
      </section>

      <section aria-labelledby="response-title" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="response-title" style={{ margin: 0, fontSize: 'var(--heading2-size)' }}>AI 응답 상태</h2>
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
          {responseStates.map((state) => (
            <ConversationMessage
              key={state}
              data-lifecycle-example={`response-${state}`}
              authorRole="assistant"
              author="AI Assistant"
              lifecycle={{ kind: 'response', state }}
              sources={state === 'streaming' ? <EvidenceBlock /> : undefined}
              onRetry={state === 'failed' ? () => setLastRequest('response-retry') : undefined}
              retryLabel="응답 다시 시도"
            >
              {state === 'streaming' ? '긴 답변의 첫 단락을 작성하고 있습니다.' : `응답 상태가 ${state}인 document입니다.`}
            </ConversationMessage>
          ))}
        </div>
      </section>
      <output hidden data-lifecycle-output>{lastRequest}</output>
    </main>
  );
}

export const LifecycleStates = {
  name: '상호작용 · 전송과 응답 생명주기',
  parameters: storyDescription(
    'delivery와 response lifecycle을 분리합니다. assistant의 pending·streaming·stopping만 busy이고 message에는 stop action을 만들지 않습니다. 실패에서만 retry가 나타나며 callback 뒤 상태 전이는 제품이 갱신합니다.',
  ),
  render: () => <LifecycleFixture />,
  play: async ({ canvasElement }) => {
    const messages = Array.from(canvasElement.querySelectorAll('[data-lifecycle-example]'));
    for (const message of messages) {
      const shouldBeBusy = message.dataset.lifecycleKind === 'response'
        && ['pending', 'streaming', 'stopping'].includes(message.dataset.lifecycleState);
      if ((message.getAttribute('aria-busy') === 'true') !== shouldBeBusy) {
        throw new Error(`aria-busy does not match ${message.dataset.lifecycleKind}:${message.dataset.lifecycleState}.`);
      }
    }
    const steady = [
      canvasElement.querySelector('[data-lifecycle-example="delivery-sent"]'),
      canvasElement.querySelector('[data-lifecycle-example="response-complete"]'),
    ];
    if (steady.some((message) => message?.querySelector('[data-message-part="status"]'))) {
      throw new Error('Sent and complete steady states must not add a redundant status marker.');
    }
    const retryButtons = Array.from(canvasElement.querySelectorAll('[data-lifecycle-example] [data-message-retry]'));
    if (retryButtons.length !== 2) throw new Error('Only failed delivery and response states may expose retry.');
    await userEvent.click(retryButtons[1]);
    if (canvasElement.querySelector('[data-lifecycle-output]')?.textContent !== 'response-retry') {
      throw new Error('Retry must forward a request without inferring a lifecycle transition.');
    }
    const streaming = canvasElement.querySelector('[data-lifecycle-example="response-streaming"]');
    const streamingParts = streaming
      ? Array.from(streaming.querySelectorAll('[data-message-part="content"] > [data-message-part]')).map((part) => part.dataset.messagePart)
      : [];
    if (streamingParts.join(',') !== 'body,status,sources') {
      throw new Error(`Active response order must be body → status → sources; received ${streamingParts.join(' → ')}.`);
    }
    // The only control allowed on a streaming message is the collapsed 출처
    // toggle; response cancellation still belongs to MessageComposer, not here.
    const streamingButtons = streaming ? Array.from(streaming.querySelectorAll('button')) : [];
    if (streamingButtons.some((button) => !button.classList.contains('lk-source-disclosure__toggle'))) {
      throw new Error('Response cancellation belongs to MessageComposer, not the message article.');
    }
    assertNoPerMessageLiveRegions(canvasElement);
  },
};

export const GroupedMessagesAndSlots = {
  name: '사용법 · 그룹과 조합 영역',
  parameters: storyDescription(
    '같은 사용자의 연속 bubble은 identity 반복을 줄이고, 뒤따르는 assistant document는 attachment·SourceDisclosure·action을 독립 slot으로 조합합니다. slot content를 하나의 중첩 card로 다시 감싸지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 760 }}>
      <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
        {['first', 'middle', 'last'].map((position, index) => (
          <ConversationMessage
            key={position}
            data-group-message={position}
            authorRole="user"
            author="김서윤"
            avatar={index === 0 ? userAvatar : undefined}
            groupPosition={position}
          >
            {['회의록을 요약해 주세요.', '결정 사항과 미결 사항을 나눠 주세요.', '담당자 이름도 유지해 주세요.'][index]}
          </ConversationMessage>
        ))}
      </div>
      <ConversationMessage
        data-slot-message
        authorRole="assistant"
        author="AI Assistant"
        avatar={assistantAvatar}
        attachments={<AttachmentChip />}
        inlineSources
        sources={<EvidenceBlock />}
        actions={<CopyAction />}
      >
        요청한 기준으로 회의록을 다시 구성했습니다.
      </ConversationMessage>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const grouped = ['first', 'middle', 'last'].map((position) => canvasElement.querySelector(`[data-group-message="${position}"]`));
    if (grouped.some((message) => !message)) throw new Error('The grouped user run is incomplete.');
    if (!grouped[0].querySelector('[data-message-avatar]') || grouped[1].querySelector('[data-message-avatar]') || grouped[2].querySelector('[data-message-avatar]')) {
      throw new Error('Only the first grouped message may render its avatar.');
    }
    for (const message of grouped.slice(1)) {
      const identity = message.querySelector('[data-message-part="identity"]');
      if (identity?.dataset.visuallyHidden !== 'true' || !identity.textContent?.includes('김서윤')) {
        throw new Error('Middle and last messages must retain an accessible hidden identity.');
      }
    }
    const groupedContentLefts = grouped.map((message) => message.querySelector('[data-message-part="content"]')?.getBoundingClientRect().left);
    if (groupedContentLefts.some((left) => left == null)
      || groupedContentLefts.some((left) => Math.abs(left - groupedContentLefts[0]) > 1)) {
      throw new Error('Grouped messages must preserve one content column when only the first item receives the avatar prop.');
    }
    const assistant = canvasElement.querySelector('[data-slot-message]');
    const parts = assistant
      ? Array.from(assistant.querySelectorAll('[data-message-part="content"] > [data-message-part]')).map((part) => part.dataset.messagePart)
      : [];
    if (parts.join(',') !== 'body,attachments,footer') {
      throw new Error(`Composition slots must follow body → attachments → footer(actions+source); received ${parts.join(' → ')}.`);
    }
    const slotFooter = assistant?.querySelector('[data-message-part="footer"]');
    if (!slotFooter?.querySelector('[data-message-part="actions"][role="group"]')
      || !slotFooter.querySelector('[data-message-part="sources"] .lk-source-disclosure')) {
      throw new Error('The footer must compose the action group and the collapsible 출처 toggle together.');
    }
  },
};

const initialComposition = [
  {
    id: 'initial-user',
    authorRole: 'user',
    author: '김서윤',
    avatar: userAvatar,
    body: '업로드한 회의록에서 이번 주 결정 사항을 찾아 주세요.',
    lifecycle: { kind: 'delivery', state: 'sent' },
  },
  {
    id: 'initial-assistant',
    authorRole: 'assistant',
    author: 'AI Assistant',
    avatar: assistantAvatar,
    body: <AssistantAnswer />,
    lifecycle: { kind: 'response', state: 'complete' },
    sources: <EvidenceBlock />,
  },
  {
    id: 'initial-system',
    authorRole: 'system',
    author: '대화 시스템',
    body: '응답 기준이 업로드된 문서로 설정되었습니다.',
    lifecycle: { kind: 'static' },
  },
];

function CompositionFixture() {
  const [value, setValue] = React.useState('담당자별 체크리스트도 만들어 주세요.');
  const [entries, setEntries] = React.useState(initialComposition);

  const submit = (submitted) => {
    const body = submitted.trim();
    if (!body) return;
    setEntries((current) => [
      ...current,
      {
        id: `local-${current.length + 1}`,
        authorRole: 'user',
        author: '김서윤',
        avatar: userAvatar,
        body,
        lifecycle: { kind: 'delivery', state: 'sent' },
      },
    ]);
    setValue('');
  };

  return (
    <main data-composition style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 760, minWidth: 0 }}>
      <MessageFeed ariaLabel="AI 문서 대화" following viewportMinHeight={360} maxHeight={440}>
        {entries.map((entry) => (
          <ConversationMessage
            key={entry.id}
            data-composition-message={entry.id}
            authorRole={entry.authorRole}
            author={entry.author}
            avatar={entry.avatar}
            lifecycle={entry.lifecycle}
            sources={entry.sources}
          >
            {entry.body}
          </ConversationMessage>
        ))}
      </MessageFeed>
      <MessageComposer
        value={value}
        onValueChange={setValue}
        onSubmit={submit}
        inputLabel="AI 대화 입력"
        placeholder="다음 질문을 입력하세요."
        leadingActions={<AddFileAction />}
      />
    </main>
  );
}

export const ConversationComposition = {
  name: '사용법 · 피드·메시지·작성기 구성',
  parameters: storyDescription(
    'ConversationMessage, MessageFeed, MessageComposer와 SourceDisclosure를 일반 AI conversation column으로 조합합니다. 완성 화면이나 고정 panel이 아니며, transparent feed 뒤에 elevated composer 하나만 배치합니다.',
  ),
  render: () => <CompositionFixture />,
  play: async ({ canvasElement }) => {
    const composition = canvasElement.querySelector('[data-composition]');
    const log = composition?.querySelector('[role="log"]');
    const composer = composition?.querySelector('.lk-message-composer');
    if (!composition || !log || !composer) throw new Error('The conversation composition is incomplete.');
    if (log.contains(composer) || !(log.compareDocumentPosition(composer) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('The composer must follow the log as an independent form.');
    }
    if (getComputedStyle(log).backgroundColor !== 'rgba(0, 0, 0, 0)' || getComputedStyle(log).boxShadow !== 'none') {
      throw new Error('MessageFeed must remain a transparent chrome-free log.');
    }
    const renderedMessages = Array.from(log.querySelectorAll('.lk-conversation-message'));
    if (renderedMessages.map((message) => message.dataset.messagePresentation).join(',') !== 'bubble,document,system') {
      throw new Error('The composition must preserve the general-assistant presentation hierarchy.');
    }
    if (!composition.querySelector('[data-composition-message="initial-assistant"] .lk-source-disclosure')) {
      throw new Error('The assistant source slot must compose SourceDisclosure explicitly.');
    }
    const input = composer.querySelector('[data-composer-input]');
    const submit = composer.querySelector('button[type="submit"]');
    if (!input || !submit) throw new Error('The controlled composer is missing.');
    await userEvent.click(submit);
    const appended = await waitFor(() => {
      const message = composition.querySelector('[data-composition-message="local-4"]');
      if (!message) throw new Error('Submitting must append the local user echo.');
      return message;
    });
    if (appended.dataset.messagePresentation !== 'bubble' || appended.dataset.direction !== 'outbound' || input.value !== '') {
      throw new Error('The product fixture must append a user bubble and clear its controlled draft.');
    }
  },
};

const narrowSources = [
  {
    id: 'long-source',
    label: 'Quarterly-product-planning-notes-with-a-very-long-file-name-and-revision-history.pdf',
    kind: '업로드 문서',
    location: '이 대화의 첨부 파일',
    availability: 'available',
    href: 'https://example.com/files/quarterly-product-planning-notes-with-a-very-long-file-name',
  },
];

export const NarrowLongContent = {
  name: '반응형 · 320px 긴 콘텐츠',
  parameters: storyDescription(
    '320px에서 긴 assistant document, code, URL, SourceDisclosure와 user bubble을 함께 확인합니다. document는 bubble 안에 갇히지 않고 code처럼 필요한 영역만 자체 overflow를 가집니다.',
  ),
  render: () => (
    <main data-narrow-message style={{ display: 'grid', gap: 'var(--space-5)', width: 320, maxWidth: '100%' }}>
      <ConversationMessage
        authorRole="assistant"
        author="AI Research and Writing Assistant"
        authorLabel="AI 연구·작성 어시스턴트"
        avatar={assistantAvatar}
        lifecycle={{ kind: 'response', state: 'streaming' }}
        sources={<SourceDisclosure title="출처" collapsible sources={narrowSources} />}
      >
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <p style={{ margin: 0 }}>아래 예시는 긴 식별자를 생략하지 않고 보여 줍니다.</p>
          <pre tabIndex={0} aria-label="요약 코드" style={{ maxWidth: '100%', margin: 0, padding: 'var(--space-3)', overflow: 'auto', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-fill-normal)', fontSize: 'var(--caption1-size)' }}><code>summaries.filter((item) =&gt; item.reviewStatus === 'needs-human-confirmation')</code></pre>
          <a href="https://example.com/reports/a-very-long-general-assistant-reference-path-without-shortening" style={{ maxWidth: '100%', color: 'var(--color-semantic-primary-normal)', overflowWrap: 'anywhere' }}>
            https://example.com/reports/a-very-long-general-assistant-reference-path-without-shortening
          </a>
        </div>
      </ConversationMessage>
      <ConversationMessage authorRole="user" author="A user with a deliberately long display name">
        원본 식별자를 유지하고 핵심 결론만 두 문장으로 정리해 주세요.
      </ConversationMessage>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-narrow-message]');
    if (!fixture) throw new Error('The narrow message fixture is missing.');
    if (fixture.scrollWidth > fixture.clientWidth + 1) {
      throw new Error('ConversationMessage must not create horizontal overflow at 320px.');
    }
    const messages = Array.from(fixture.querySelectorAll('.lk-conversation-message'));
    if (messages.map((message) => message.dataset.messagePresentation).join(',') !== 'document,bubble') {
      throw new Error('Narrow content must preserve document and bubble presentations.');
    }
    const pre = fixture.querySelector('pre');
    if (!pre || getComputedStyle(pre).overflowX !== 'auto') {
      throw new Error('Long code must remain in its own horizontal scroll container.');
    }
    const source = fixture.querySelector('.lk-source-disclosure');
    if (!source || source.getBoundingClientRect().right > fixture.getBoundingClientRect().right + 1) {
      throw new Error('SourceDisclosure must remain inside the narrow document column.');
    }
  },
};

export const DarkTheme = {
  name: '변형·상태 · 다크 배경',
  parameters: storyDescription(
    'dark semantic scope에서 assistant document, user solid primary bubble, human-agent neutral fill bubble와 system 중앙 pill 칩을 비교합니다. 별도 inverse prop 없이 semantic token만으로 위계와 대비가 유지되어야 합니다.',
  ),
  render: () => (
    <main
      data-theme="dark"
      data-dark-messages
      style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760, padding: 'var(--space-5)', boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)' }}
    >
      <ConversationMessage authorRole="assistant" author="AI Assistant" avatar={assistantAvatar}>
        <AssistantAnswer />
      </ConversationMessage>
      <ConversationMessage authorRole="user" author="김서윤" avatar={userAvatar} lifecycle={{ kind: 'delivery', state: 'sending' }}>
        체크리스트를 Markdown으로 만들어 주세요.
      </ConversationMessage>
      <ConversationMessage authorRole="human-agent" author="지원 담당자 · 박지훈">
        검토가 필요한 항목은 제가 확인하겠습니다.
      </ConversationMessage>
      <ConversationMessage authorRole="system" author="대화 시스템">
        상담원이 대화에 참여했습니다.
      </ConversationMessage>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-dark-messages]');
    const messages = fixture ? Array.from(fixture.querySelectorAll('.lk-conversation-message')) : [];
    if (!fixture || messages.map((message) => message.dataset.messagePresentation).join(',') !== 'document,bubble,bubble,system') {
      throw new Error('Dark theme must retain the general-assistant hierarchy.');
    }
    const documentBody = fixture.querySelector('[data-message-presentation="document"] [data-message-part="body"]');
    const bubbles = fixture.querySelectorAll('[data-message-presentation="bubble"] [data-message-part="body"]');
    if (!documentBody || bubbles.length !== 2 || documentBody.style.background !== 'transparent') {
      throw new Error('Dark assistant documents must remain chrome-free beside message bubbles.');
    }
    if (fixture.scrollWidth > fixture.clientWidth + 1) throw new Error('Dark messages must not overflow their column.');
  },
};

export const MessageFamilyVisualParity = {
  ...DarkTheme,
  name: 'Conversation message family visual parity',
  tags: ['!dev', 'visual-parity'],
};

// 완성된 AI 응답의 canonical action recipe. Transport와 lifecycle truth는 제품이
// 소유하고 ConversationMessage는 전달받은 action, disabled, error 상태만 표현합니다.
function MessageActionGlyph({ name, size = 16 }) {
  return <Icon name={name} size={size} aria-hidden="true" />;
}

function MessageActionBarFixture() {
  const [actionLog, setActionLog] = React.useState([]);
  const [feedback, setFeedback] = React.useState(null);
  const recordAction = (action) => setActionLog((current) => [...current, action]);
  const answerActions = [
    { key: 'copy', icon: <MessageActionGlyph name="copy" />, label: '응답 복사', onClick: () => recordAction('copy') },
    { key: 'regenerate', icon: <MessageActionGlyph name="refresh" />, label: '응답 다시 생성', onClick: () => recordAction('regenerate') },
    {
      key: 'positive-feedback',
      icon: <MessageActionGlyph name="like" />,
      label: '좋은 응답으로 평가',
      pressed: feedback === 'positive',
      onClick: () => {
        recordAction('positive-feedback');
        setFeedback('positive');
      },
    },
    {
      key: 'negative-feedback',
      icon: <MessageActionGlyph name="dislike" />,
      label: '좋지 않은 응답으로 평가',
      pressed: feedback === 'negative',
      onClick: () => {
        recordAction('negative-feedback');
        setFeedback('negative');
      },
    },
  ];
  return (
    <main data-icon-action-bar style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <ConversationMessage
        data-action-message="complete"
        authorRole="assistant"
        author="AI Assistant"
        avatar={assistantAvatar}
        timestamp="오전 10:24"
        dateTime="2026-07-12T10:24:00+09:00"
        lifecycle={{ kind: 'response', state: 'complete' }}
        inlineSources
        sources={<EvidenceBlock />}
        messageActions={answerActions}
      >
        <AssistantAnswer />
      </ConversationMessage>

      <ConversationMessage
        data-action-message="busy"
        authorRole="assistant"
        author="AI Assistant"
        avatar={assistantAvatar}
        lifecycle={{ kind: 'response', state: 'streaming' }}
        messageActions={answerActions.map((action) => ({
          ...action,
          onClick: undefined,
          disabled: true,
          pressed: action.pressed === undefined ? undefined : false,
        }))}
      >
        응답을 생성하고 있습니다. 완료되면 복사, 재생성, 평가 동작을 사용할 수 있습니다.
      </ConversationMessage>

      <ConversationMessage
        data-action-message="failed"
        authorRole="assistant"
        author="AI Assistant"
        avatar={assistantAvatar}
        lifecycle={{ kind: 'response', state: 'failed' }}
        error="네트워크 문제로 응답이 중단됐어요."
        onRetry={() => recordAction('retry')}
        retryLabel="응답 다시 시도"
      />

      <output hidden data-action-log>{actionLog.join(',')}</output>
    </main>
  );
}

export const MessageActionBar = {
  name: '사용법 · 응답 액션과 피드백',
  parameters: storyDescription(
    '완료된 AI 응답에는 출처와 함께 응답 복사·응답 다시 생성·긍정 평가·부정 평가를 canonical icon action으로 제공합니다. 각 버튼은 동작 대상을 포함한 접근 가능한 이름을 가지며, 생성 중에는 결과 대상 동작을 비활성화하고 실패 시에는 불완전한 결과의 액션 대신 오류와 응답 다시 시도만 제공합니다. 실행, 피드백 저장, 재생성 transport와 lifecycle 전이는 제품이 소유합니다.',
  ),
  render: () => <MessageActionBarFixture />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-icon-action-bar]');
    const complete = fixture?.querySelector('[data-action-message="complete"]');
    const busy = fixture?.querySelector('[data-action-message="busy"]');
    const failed = fixture?.querySelector('[data-action-message="failed"]');
    if (!complete || !busy || !failed) throw new Error('AI 응답 액션 상태 예시가 불완전합니다.');

    const completeActions = Array.from(complete.querySelectorAll('[data-message-action]'));
    const completeLabels = completeActions.map((button) => button.getAttribute('aria-label'));
    if (completeLabels.join(',') !== '응답 복사,응답 다시 생성,좋은 응답으로 평가,좋지 않은 응답으로 평가') {
      throw new Error(`정상 액션바 구성이 다릅니다: ${completeLabels.join(',')}`);
    }
    if (complete.querySelector('[data-message-error]')) throw new Error('정상 응답은 오류 표현을 만들지 않아야 합니다.');
    const footer = complete.querySelector('[data-message-part="footer"]');
    const actionGroup = footer?.querySelector('[data-message-part="actions"][role="group"]');
    const sourceToggle = footer?.querySelector('[data-message-part="sources"] .lk-source-disclosure__toggle');
    if (!actionGroup || !sourceToggle || actionGroup.contains(sourceToggle)) {
      throw new Error('canonical AI footer는 액션 그룹과 인라인 출처를 형제로 구성해야 합니다.');
    }
    if (
      completeActions[2].getAttribute('aria-pressed') !== 'false'
      || completeActions[3].getAttribute('aria-pressed') !== 'false'
    ) {
      throw new Error('평가 action은 제품이 전달한 초기 미선택 상태를 aria-pressed로 노출해야 합니다.');
    }
    await userEvent.click(completeActions[0]);
    await userEvent.click(completeActions[1]);
    await userEvent.click(completeActions[2]);
    await waitFor(() => {
      if (
        complete.querySelector('[data-message-action="positive-feedback"]')?.getAttribute('aria-pressed') !== 'true'
        || complete.querySelector('[data-message-action="negative-feedback"]')?.getAttribute('aria-pressed') !== 'false'
      ) throw new Error('긍정 평가는 선택 상태를 aria-pressed로 반영해야 합니다.');
    });
    await userEvent.click(completeActions[3]);
    await waitFor(() => {
      const log = fixture.querySelector('[data-action-log]')?.textContent;
      if (log !== 'copy,regenerate,positive-feedback,negative-feedback') {
        throw new Error(`AI 액션 callback 전달 순서가 다릅니다: ${log}`);
      }
      if (
        complete.querySelector('[data-message-action="positive-feedback"]')?.getAttribute('aria-pressed') !== 'false'
        || complete.querySelector('[data-message-action="negative-feedback"]')?.getAttribute('aria-pressed') !== 'true'
      ) throw new Error('부정 평가는 반대 평가를 해제하고 선택 상태를 aria-pressed로 반영해야 합니다.');
      const positiveFeedback = complete.querySelector('[data-message-action="positive-feedback"]');
      const negativeFeedback = complete.querySelector('[data-message-action="negative-feedback"]');
      if (
        positiveFeedback?.dataset.selected !== 'false'
        || negativeFeedback?.dataset.selected !== 'true'
        || window.getComputedStyle(positiveFeedback).backgroundColor === window.getComputedStyle(negativeFeedback).backgroundColor
      ) throw new Error('선택된 평가는 미선택 평가와 구분되는 persistent selected surface를 가져야 합니다.');
    });

    if (busy.getAttribute('aria-busy') !== 'true') throw new Error('streaming 응답은 aria-busy여야 합니다.');
    const busyActions = Array.from(busy.querySelectorAll('[data-message-action]'));
    if (
      busyActions.length !== 4
      || busyActions.some((button) => !button.disabled)
      || busyActions.slice(2).some((button) => button.getAttribute('aria-pressed') !== 'false')
    ) {
      throw new Error('생성 중에는 결과를 대상으로 하는 네 가지 AI 액션이 모두 비활성화돼야 합니다.');
    }

    if (!failed.querySelector('[data-message-error]')) throw new Error('실패 응답은 본문에 오류 표현을 가져야 합니다.');
    if (failed.querySelector('[data-message-part="status"]')) throw new Error('error가 있으면 중복 상태 뱃지를 만들지 않아야 합니다.');
    const retry = failed.querySelector('[data-message-retry]');
    if (!retry) throw new Error('실패 응답은 retry 아이콘을 자동 노출해야 합니다.');
    const failedLabels = Array.from(failed.querySelectorAll('[data-message-part="actions"] button')).map((b) => b.getAttribute('aria-label'));
    if (failedLabels.join(',') !== '응답 다시 시도') {
      throw new Error(`실패 액션바 구성이 다릅니다: ${failedLabels.join(',')}`);
    }
    await userEvent.click(retry);
    if (!fixture.querySelector('[data-action-log]').textContent.endsWith(',retry')) {
      throw new Error('retry는 다음 lifecycle을 추론하지 않고 요청만 전달해야 합니다.');
    }

    assertNoPerMessageLiveRegions(fixture);
  },
};

// ChatGPT식 footer를 단독으로 보여 주는 초점 스토리. 같은 "출처" 토글 처리를
// Overview·Grouped·ActionBar 등 다른 message 스토리도 공유합니다.
function InlineSourceFooterFixture() {
  const [lastAction, setLastAction] = React.useState('없음');
  const [feedback, setFeedback] = React.useState(null);
  const answerActions = [
    { key: 'copy', icon: <MessageActionGlyph name="copy" />, label: '응답 복사', onClick: () => setLastAction('copy') },
    { key: 'regenerate', icon: <MessageActionGlyph name="refresh" />, label: '응답 다시 생성', onClick: () => setLastAction('regenerate') },
    {
      key: 'positive-feedback',
      icon: <MessageActionGlyph name="like" />,
      label: '좋은 응답으로 평가',
      pressed: feedback === 'positive',
      onClick: () => {
        setLastAction('positive-feedback');
        setFeedback('positive');
      },
    },
    {
      key: 'negative-feedback',
      icon: <MessageActionGlyph name="dislike" />,
      label: '좋지 않은 응답으로 평가',
      pressed: feedback === 'negative',
      onClick: () => {
        setLastAction('negative-feedback');
        setFeedback('negative');
      },
    },
  ];
  return (
    <main data-inline-source style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 760 }}>
      <ConversationMessage
        data-inline-source-message
        authorRole="assistant"
        author="AI Assistant"
        avatar={assistantAvatar}
        timestamp="오전 10:24"
        dateTime="2026-07-12T10:24:00+09:00"
        lifecycle={{ kind: 'response', state: 'complete' }}
        inlineSources
        sources={<SourceDisclosure title="출처" collapsible sources={answerSources} />}
        messageActions={answerActions}
      >
        <AssistantAnswer />
      </ConversationMessage>
      <output hidden data-inline-source-log>{lastAction}</output>
    </main>
  );
}

export const InlineSourceFooter = {
  name: '변형·상태 · 인라인 출처 토글',
  parameters: storyDescription(
    'inlineSources로 접힌 "출처" 토글을 canonical 복사·재생성·긍정/부정 평가 아이콘과 같은 footer 행에 나란히 둡니다(ChatGPT식). 출처는 메시지 동작 그룹의 형제로 남아 액션이 아닌 provenance로 announce되고, 누르면 출처 목록이 앵커드 Popover(드롭다운)로 떠서 열려 본문 레이아웃을 밀지 않으며 바깥 클릭·Esc로 닫힙니다. 출처를 항상 노출해야 하는 고신뢰 답변에는 inlineSources 없이 기본 출처 행을 유지하세요.',
  ),
  render: () => <InlineSourceFooterFixture />,
  play: async ({ canvasElement }) => {
    const message = canvasElement.querySelector('[data-inline-source-message]');
    if (!message) throw new Error('인라인 출처 예시가 없습니다.');
    const footer = message.querySelector('[data-message-part="footer"]');
    if (!footer) throw new Error('inlineSources는 action bar와 출처를 하나의 footer 행에 조합해야 합니다.');
    const actions = footer.querySelector('[data-message-part="actions"][role="group"]');
    const sources = footer.querySelector('[data-message-part="sources"]');
    const collapsible = sources?.querySelector('.lk-source-disclosure--collapsible');
    const toggle = collapsible?.querySelector('button.lk-source-disclosure__toggle');
    if (!actions || !sources || !toggle) {
      throw new Error('footer는 action group과 collapsible 출처 토글을 함께 조합해야 합니다.');
    }
    const actionLabels = Array.from(actions.querySelectorAll('[data-message-action]'))
      .map((action) => action.getAttribute('aria-label'));
    if (actionLabels.join(',') !== '응답 복사,응답 다시 생성,좋은 응답으로 평가,좋지 않은 응답으로 평가') {
      throw new Error(`인라인 출처 예시도 canonical AI action 순서를 유지해야 합니다: ${actionLabels.join(',')}`);
    }
    // 출처는 메시지 동작 그룹의 형제여야 하며 그룹 안에 들어가면 안 됩니다.
    if (actions.contains(toggle)) {
      throw new Error('출처 토글은 메시지 동작 그룹 밖의 형제로 남아야 합니다.');
    }
    if (toggle.querySelector('a, button')) {
      throw new Error('출처 토글에는 중첩 인터랙티브가 없어야 합니다.');
    }
    if (toggle.getAttribute('aria-haspopup') !== 'dialog') {
      throw new Error('출처 토글은 dialog 팝업을 여는 컨트롤이어야 합니다.');
    }
    if (!toggle.textContent?.includes('출처')) {
      throw new Error('접힌 토글은 "출처" 라벨을 보여야 합니다.');
    }
    if (toggle.getAttribute('aria-expanded') !== 'false' || collapsible.querySelector('[role="dialog"]')) {
      throw new Error('inlineSources 출처는 기본적으로 닫혀 있어야 합니다.');
    }
    // sources가 본문 위 별도 행으로 중복 렌더되면 안 되고, footer가 마지막 content 파트여야 합니다.
    const parts = Array.from(message.querySelectorAll('[data-message-part="content"] > [data-message-part]'))
      .map((part) => part.dataset.messagePart);
    if (parts[0] !== 'body' || parts[parts.length - 1] !== 'footer' || parts.includes('sources')) {
      throw new Error(`inlineSources는 sources를 마지막 footer 행으로 이동해야 합니다: ${parts.join(' → ')}`);
    }
    // 팝오버는 떠서 열려 레이아웃을 밀지 않아야 합니다: 토글 위치와 article 높이가 유지됩니다.
    const toggleTopClosed = Math.round(toggle.getBoundingClientRect().top);
    const messageHeightClosed = Math.round(message.getBoundingClientRect().height);
    await userEvent.click(toggle);
    const panelId = toggle.getAttribute('aria-controls');
    const panel = panelId ? canvasElement.ownerDocument.getElementById(panelId) : null;
    if (!panel || toggle.getAttribute('aria-expanded') !== 'true') {
      throw new Error('토글 활성화는 출처 팝오버를 열어야 합니다.');
    }
    if (Math.abs(Math.round(toggle.getBoundingClientRect().top) - toggleTopClosed) > 1) {
      throw new Error('출처 토글은 팝오버를 열어도 같은 위치에 남아야 합니다.');
    }
    if (Math.abs(Math.round(message.getBoundingClientRect().height) - messageHeightClosed) > 1) {
      throw new Error('플로팅 팝오버는 메시지 레이아웃(높이)을 밀지 않아야 합니다.');
    }
    const rows = Array.from(panel.querySelectorAll('.lk-source-disclosure__row'));
    if (rows.length !== 3) throw new Error('열린 팝오버는 source당 행 하나를 보여야 합니다.');
    if (rows.some((row) => row.tagName !== 'A' || row.getAttribute('target') !== '_blank')) {
      throw new Error('href 출처 행은 새 탭 링크여야 합니다.');
    }
    await userEvent.keyboard('{Escape}');
    if ((panelId && canvasElement.ownerDocument.getElementById(panelId)) || toggle.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Escape는 출처 팝오버를 닫아야 합니다.');
    }
    assertNoPerMessageLiveRegions(canvasElement);
  },
};
