import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { ConversationList } from '../components/communication/ConversationList.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';
import { conversationActions, makeConversationGroups, preventNavigation } from './RailPanel.shared.jsx';

// Use when a product lists a person's conversations or sessions, grouped by date, with a current item and row actions.
// Avoid when the rows are destinations of a fixed hierarchy (SideNav) or an editable record list (ListCell/Table).

const meta = {
  title: 'LDS Product/Communication/Conversation List',
  tags: ['autodocs'],
  component: ConversationList,
  parameters: {
    layout: 'centered',
    storyGuide: {
      storyId: 'lds-product-communication-conversation-list--overview',
      eyebrow: 'Product / Communication / Conversation List',
      title: '대화 목록은 링크 행과 형제 행 동작으로 현재 대화를 찾게 합니다',
      description:
        '날짜 묶음 제목 아래 대화 링크 행이 있고, 행마다 「더 보기」 메뉴 버튼이 링크의 형제로 붙습니다. 상호작용이 중첩되지 않습니다. 현재 대화는 aria-current, 무채색 채움, 굵기로 표시합니다.',
      decisionGuidance: {
        useWhen: 'ShellPanel 스크롤 구역처럼 사람이 만든 긴 대화·세션 목록을 날짜로 묶어 보여 줄 때 씁니다.',
        avoidWhen: '고정 계층 목적지(SideNav), 편집 가능한 레코드 목록(ListCell, Table), 메시지 본문 흐름(MessageFeed)에는 쓰지 않습니다.',
      },
    },
    docs: {
      description: {
        component: 'ConversationList는 LK Product Communication 확장입니다. 묶음 계산과 지역화, 라우트, 이름 바꾸기와 삭제 실행, 페이지 커서는 제품이 소유하고 LDS는 행 해부, 행 동작, 묶음 의미, 상태만 소유합니다.',
      },
    },
  },
};

export default meta;

export const LongTitleSpace = {
  name: '변형·상태 · 긴 제목과 행 동작',
  parameters: {
    ...storyDescription("240px와 320px 목록에서 긴 대화 제목과 행 동작을 함께 보여 주는 상황입니다. 전체 제목을 확인할 수 있고 포인터와 키보드 모두에서 더 보기 버튼에 접근할 수 있는지 확인하세요."),
    layout: 'fullscreen',
  },
  render: () => <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
    {[240, 320].map((width) => <div key={width} style={{ width, maxWidth: '100%' }}>
      <ConversationList aria-label={`최근 대화 ${width}`} groups={makeConversationGroups(4)} currentId="c2" itemActions={conversationActions} renderLink={(item, props) => <a {...props} onClick={preventNavigation} />} />
    </div>)}
  </div>,
  play: async ({ canvasElement }) => {
    const row = canvasElement.querySelector('[data-slot="row"]');
    const link = row.querySelector('a');
    const button = row.querySelector('button');
    if (link.title !== link.textContent) throw new Error('The full plain-text title is available without opening the conversation.');
    await userEvent.hover(row);
    const rect = button.getBoundingClientRect();
    if (rect.width < 24 || rect.height < 24) throw new Error('The menu target stays reachable.');
    await userEvent.click(link);
    await userEvent.tab();
    await Promise.all(
      button.closest('[data-slot="rowAction"]').getAnimations().map((animation) => animation.finished),
    );
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== button) {
        throw new Error('Tab moves from the conversation link to its sibling menu.');
      }
      const actionStyle = getComputedStyle(button.closest('[data-slot="rowAction"]'));
      if (actionStyle.opacity !== '1' || actionStyle.pointerEvents !== 'auto') {
        throw new Error('Keyboard focus reveals the menu.');
      }
    });
  },
};

const renderLink = (item, props) => <a {...props} onClick={preventNavigation} />;

function OverviewFixture() {
  const [log, setLog] = React.useState('');
  return (
    <div data-testid="conversation-overview" data-log={log} style={{ width: 240 }}>
      <ConversationList
        aria-label="대화"
        groups={makeConversationGroups(12)}
        currentId="c2"
        itemActions={conversationActions}
        onItemAction={(actionId, item) => setLog(`${actionId}:${item.id}`)}
        renderLink={renderLink}
      />
    </div>
  );
}

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '대화 12개를 오늘·어제·지난 7일·지난 30일로 묶었습니다. 행 높이는 36px이고 긴 제목은 한 줄로 말줄임합니다. 「더 보기」는 늘 DOM에 있고, 마우스 환경에서는 행에 hover·focus가 있거나 현재 행일 때만 보입니다.',
  ),
  render: () => <OverviewFixture />,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('[data-testid="conversation-overview"]');
    const nav = host?.querySelector('nav');
    const sections = nav?.querySelectorAll('section') ?? [];
    const current = nav?.querySelector('a[aria-current="page"]');
    if (!nav || sections.length !== 4 || !current) throw new Error('The conversation list renders four date groups and one current link.');
    for (const section of sections) {
      const heading = section.querySelector('h3');
      if (!heading || section.getAttribute('aria-labelledby') !== heading.id) throw new Error('Each group section is labelled by its heading.');
    }
    const row = current.closest('li');
    const more = row.querySelector('button[aria-haspopup="menu"]');
    if (!more || more.closest('a') || current.querySelector('button')) throw new Error('The row action is a sibling of the link, never nested.');
    if (more.getAttribute('aria-label') !== `${current.textContent} 더 보기`) throw new Error('The row action is named after its conversation.');
    if (Number(getComputedStyle(current).fontWeight) < 700 || row.dataset.current !== 'true') throw new Error('The current row is bold and filled.');
    const otherRow = nav.querySelectorAll('li')[0];
    const otherAction = otherRow.querySelector('.lk-conversation-list__action');
    if (!otherAction || !otherRow.querySelector('button[aria-haspopup="menu"]')) throw new Error('Every row keeps its action in the DOM.');
    if (Math.abs(row.getBoundingClientRect().height - 36) > 1) throw new Error('Rows are 36px tall.');
    await userEvent.click(more);
    const documentRef = canvasElement.ownerDocument;
    const remove = await waitFor(() => {
      if (!documentRef.querySelector('[role="menu"]')) throw new Error('The row menu opens.');
      const item = [...documentRef.querySelectorAll('[role="menuitem"]')].find((node) => node.textContent.includes('삭제'));
      if (!item) throw new Error('The row menu exposes the delete action.');
      if (documentRef.defaultView?.getComputedStyle(item).pointerEvents === 'none') {
        throw new Error('The row menu must finish anchored positioning before interaction.');
      }
      return item;
    });
    await userEvent.click(remove);
    await waitFor(() => {
      if (host.dataset.log !== 'delete:c2') throw new Error('The menu reports the action id and the conversation.');
    });
  },
};

export const States = {
  name: '변형·상태 · 로딩, 빈 목록, 오류, 더 불러오기',
  parameters: storyDescription(
    '첫 로딩은 Skeleton 행, 빈 목록은 한 줄 문장, 오류는 축약 ResourceState와 다시 시도 동작입니다. 목록 끝에는 무한 스크롤 대신 「더 불러오기」 텍스트 버튼을 둡니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 240px)', gap: 'var(--space-4)', alignItems: 'start' }}>
      <div data-testid="state-loading"><ConversationList aria-label="로딩 중인 대화" groups={[]} loading /></div>
      <div data-testid="state-empty"><ConversationList aria-label="빈 대화" groups={[]} /></div>
      <div data-testid="state-error"><ConversationList aria-label="오류 대화" groups={[]} error="대화 목록을 불러오지 못했습니다." onRetry={() => {}} /></div>
      <div data-testid="state-more"><ConversationList aria-label="더 불러올 대화" groups={makeConversationGroups(4)} hasMore onLoadMore={() => {}} renderLink={renderLink} /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const query = (id, selector) => canvasElement.querySelector(`[data-testid="${id}"] ${selector}`);
    if (!query('state-loading', '[data-slot="loading"]') || query('state-loading', 'nav')?.getAttribute('aria-busy') !== 'true') {
      throw new Error('Loading renders skeleton rows and marks the list busy.');
    }
    if (!query('state-empty', '[data-slot="empty"]')?.textContent.includes('아직 대화가 없습니다')) throw new Error('The empty state is one sentence.');
    const retry = [...canvasElement.querySelectorAll('[data-testid="state-error"] button')].find((button) => button.textContent.includes('다시 시도'));
    if (!retry) throw new Error('The error state offers a retry action.');
    const more = [...canvasElement.querySelectorAll('[data-testid="state-more"] button')].find((button) => button.textContent.includes('더 불러오기'));
    if (!more) throw new Error('The list ends with a load-more text button.');
  },
};

export const NarrowTouch = {
  name: '반응형 · 좁은 폭과 터치',
  parameters: storyDescription(
    '320px 서랍 폭에서도 행은 한 줄을 지키고 「더 보기」는 24px 이상 조작 영역을 유지합니다. 포인터 hover가 없는 터치 환경에서는 「더 보기」가 늘 보입니다.',
  ),
  render: () => (
    <div data-testid="conversation-narrow" style={{ width: 320 }}>
      <ConversationList aria-label="좁은 대화" groups={makeConversationGroups(6)} currentId="c1" itemActions={conversationActions} renderLink={renderLink} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('[data-testid="conversation-narrow"]');
    if (!host || host.scrollWidth > host.clientWidth + 1) throw new Error('The narrow list must not overflow.');
    for (const button of host.querySelectorAll('button[aria-haspopup="menu"]')) {
      const rect = button.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 24) throw new Error('Row actions keep a 24px target.');
    }
    const styleText = host.querySelector('style')?.textContent || '';
    if (!styleText.includes('@media(hover:none)')) throw new Error('Touch environments always show the row action.');
  },
};
