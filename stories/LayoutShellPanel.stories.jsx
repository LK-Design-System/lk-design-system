import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Icon, IconButton } from '../src/index.js';
import { ConversationList } from '../components/communication/ConversationList.jsx';
import { ShellPanel } from '../components/layout/ShellPanel.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';
import { QuestionPanel, conversationActions, makeConversationGroups, preventNavigation } from './RailPanel.shared.jsx';

// Use when an area of a rail-panel shell owns a long personal list (conversations, sessions) next to the area rail.
// Avoid when the area has only two to four sub-destinations; use body tabs instead of a half-empty panel.

const meta = {
  title: 'LDS Product/Layout/Shell Panel',
  tags: ['autodocs'],
  component: ShellPanel,
  parameters: {
    layout: 'centered',
    storyGuide: {
      storyId: 'lds-product-layout-shell-panel--overview',
      eyebrow: 'Product / Layout / Shell Panel',
      title: '레일 옆 맥락 패널은 영역 안의 긴 목록 하나를 소유합니다',
      description:
        'DashboardShell topology="rail-panel"의 둘째 열입니다. 고정 머리(제목과 동작 최대 2개), 목록 행과 같은 해부의 주 동작 행, 짧은 고정 구역, 스크롤 구역 하나로 구성합니다. 접기 토글은 상단 바에 두고 패널 안에는 두지 않습니다.',
      decisionGuidance: {
        useWhen: '질문 영역의 대화 목록처럼 영역 안에 길고 개인적인 목록이 있을 때 레일 옆에 둡니다.',
        avoidWhen: '하위 목적지가 2~4개뿐인 영역, 계층형 디스클로저가 필요한 탐색, 편집 도구 패널에는 쓰지 않습니다. 각각 본문 탭, SideNav, DockPanel을 씁니다.',
      },
    },
    docs: {
      description: {
        component: 'ShellPanel은 rail-panel 셸의 맥락 패널 LK Product Extension입니다. 패널 자체는 랜드마크가 아니고 안의 목록 nav가 패널 제목을 이름으로 씁니다. 목록 데이터, 라우트, 검색 동작은 제품이 소유합니다.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '질문 패널입니다. 머리에 제목과 검색 동작, 그 아래 새 질문 행, 그리고 대화 40개가 든 스크롤 구역 하나가 있습니다. 스크롤 구역이 스크롤될 때만 위쪽 경계선이 보입니다.',
  ),
  render: () => (
    <div style={{ width: 240, height: 600, display: 'flex' }}>
      <QuestionPanel />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const panel = canvasElement.querySelector('[data-testid="question-panel"]');
    const title = panel?.querySelector('h2');
    const nav = panel?.querySelector('nav');
    const regions = panel?.querySelectorAll('[data-scroll-region]') ?? [];
    const primary = panel?.querySelector('[data-slot="primaryAction"]');
    if (!panel || !title || !nav || regions.length !== 1 || !primary) throw new Error('The ShellPanel anatomy is incomplete.');
    if (nav.getAttribute('aria-labelledby') !== title.id || panel.getAttribute('role')) {
      throw new Error('The panel is not a landmark; its list nav is labelled by the panel title.');
    }
    if (panel.querySelectorAll('[data-slot="actions"] button').length > 2) throw new Error('The header holds at most two actions.');
    const region = regions[0];
    if (region.dataset.scrolled !== 'false' || region.scrollHeight <= region.clientHeight) {
      throw new Error('The long list scrolls inside the one region and starts unscrolled.');
    }
    region.scrollTop = 120;
    region.dispatchEvent(new Event('scroll'));
    await waitFor(() => {
      if (region.dataset.scrolled !== 'true') throw new Error('Scrolling reveals the region edge.');
    });
    if (primary.tagName !== 'A' || primary.getAttribute('href') !== '#new') throw new Error('The primary action is a link row.');
  },
};

export const PrimaryActionCurrent = {
  name: '변형·상태 · 새 질문 화면',
  parameters: storyDescription(
    '새 질문 화면에서는 주 동작 행이 현재 화면입니다. 버튼 모양이 아니라 목록 행과 같은 해부이며, aria-current="page", 무채색 채움, 굵기로 표시합니다. 이때 대화 목록에는 현재 항목이 없습니다. 좁은 320px 서랍에서도 같은 행 해부를 씁니다.',
  ),
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
      <div style={{ width: 240, height: 420, display: 'flex' }}><QuestionPanel currentId={null} count={6} /></div>
      <div data-testid="shell-panel-narrow" style={{ width: 320, height: 420, display: 'flex' }}>
        <ShellPanel
          title="질문"
          primaryAction={{ label: '새 질문', icon: <Icon name="plus" size={18} />, href: '#new', onClick: preventNavigation, current: true }}
          scrollRegion={<ConversationList groups={makeConversationGroups(3)} itemActions={conversationActions} renderLink={(item, props) => <a {...props} onClick={preventNavigation} />} />}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const primaries = canvasElement.querySelectorAll('[data-slot="primaryAction"]');
    if (primaries.length !== 2) throw new Error('Both panels render a primary action row.');
    for (const primary of primaries) {
      if (primary.getAttribute('aria-current') !== 'page' || Number(getComputedStyle(primary).fontWeight) < 700) {
        throw new Error('The current primary row exposes aria-current="page" and bold weight.');
      }
    }
    if (canvasElement.querySelector('[data-testid="question-conversations"] [aria-current]')) {
      throw new Error('No conversation is current on the new-question screen.');
    }
    const narrow = canvasElement.querySelector('[data-testid="shell-panel-narrow"]');
    if (narrow.scrollWidth > narrow.clientWidth + 1) throw new Error('The narrow panel must not overflow.');
  },
};

export const HeaderActions = {
  name: '상호작용 · 머리 동작과 키보드 순서',
  parameters: storyDescription(
    '머리 동작은 아이콘 버튼 최대 2개입니다. 키보드 순서는 머리 동작 → 새 질문 → 대화 링크와 형제 더 보기 버튼입니다. 패널을 접는 토글은 상단 바에 있으므로 여기에는 없습니다.',
  ),
  render: () => (
    <div style={{ width: 240, height: 480, display: 'flex' }}>
      <ShellPanel
        title="질문"
        actions={(
          <React.Fragment>
            <IconButton variant="plain" size="sm" round={false} label="대화 검색"><Icon name="search" size={18} aria-hidden="true" /></IconButton>
            <IconButton variant="plain" size="sm" round={false} label="보관함"><Icon name="folder" size={18} aria-hidden="true" /></IconButton>
          </React.Fragment>
        )}
        primaryAction={{ label: '새 질문', icon: <Icon name="plus" size={18} />, href: '#new', onClick: preventNavigation }}
        scrollRegion={<ConversationList groups={makeConversationGroups(8)} currentId="c1" itemActions={conversationActions} renderLink={(item, props) => <a {...props} onClick={preventNavigation} />} />}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const search = canvasElement.querySelector('button[aria-label="대화 검색"]');
    const archive = canvasElement.querySelector('button[aria-label="보관함"]');
    const primary = canvasElement.querySelector('[data-slot="primaryAction"]');
    const firstLink = canvasElement.querySelector('nav a[href]');
    if (!search || !archive || !primary || !firstLink) throw new Error('The keyboard-order fixture is incomplete.');
    search.focus();
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== archive) throw new Error('The second action follows the first.');
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== primary) throw new Error('The primary row follows the header actions.');
    await userEvent.tab();
    const focused = canvasElement.ownerDocument.activeElement;
    if (focused !== firstLink && !focused?.closest('[data-scroll-region]')) throw new Error('The list follows the primary row.');
  },
};

export const WidePanelContract = {
  name: '맥락 패널 288px 계약',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-testid="shell-panel-288" style={{ width: 288, height: 420, display: 'flex' }}>
      <ShellPanel
        title="질문"
        primaryAction={{ label: '새 질문', icon: <Icon name="plus" size={18} />, href: '#new', onClick: preventNavigation }}
        scrollRegion={<ConversationList groups={makeConversationGroups(10)} currentId="c3" itemActions={conversationActions} renderLink={(item, props) => <a {...props} onClick={preventNavigation} />} />}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('[data-testid="shell-panel-288"]');
    const panel = host?.querySelector('.lk-shell-panel');
    if (!panel || Math.abs(panel.getBoundingClientRect().width - 288) > 1 || host.scrollWidth > host.clientWidth + 1) {
      throw new Error('The panel fills the widest documented 288px column without overflow.');
    }
  },
};
