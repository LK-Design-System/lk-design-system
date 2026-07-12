import React from 'react';
import { userEvent } from 'storybook/test';
import { Icon, Lockup, SideNav, UserMenu } from '../src/index.js';
import { SideNavUserMenuCard as SideNavUserMenuCardStory } from './NavigationFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const navigationItems = [
  { heading: '운영' },
  { value: 'overview', label: '운영 개요', icon: <Icon name="home" size={18} /> },
  {
    value: 'missions',
    label: '미션',
    icon: <Icon name="document" size={18} />,
    children: [
      { value: 'missions-live', label: '실행 중', badge: 4 },
      { value: 'missions-queued', label: '대기 작업', badge: 12 },
    ],
  },
  { value: 'robots', label: '로봇', icon: <Icon name="layers" size={18} />, badge: 3 },
  { value: 'diagnostics', label: '다중 로봇 장비 상태와 원격 점검 로그', icon: <Icon name="document" size={18} /> },
  { heading: '관리' },
  { value: 'events', label: '이벤트', icon: <Icon name="bell" size={18} />, badge: 8 },
  { value: 'settings', label: '권한 관리', icon: <Icon name="setting" size={18} />, disabled: true },
];

const accountItems = [
  { label: '프로필' },
  { label: '설정' },
  { divider: true },
  { label: '로그아웃', danger: true },
];

const meta = {
  title: 'LDS Product/Navigation/Side Nav',
  component: SideNav,
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          placeItems: 'start center',
          width: '100%',
          minHeight: 620,
          padding: 'var(--space-6)',
          boxSizing: 'border-box',
          background: 'var(--color-semantic-background-normal-normal)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    storyGuide: {
      storyId: 'lds-product-navigation-side-nav--link-destinations',
      eyebrow: 'Product / Side Nav',
      title: '사이드 내비게이션은 제품의 계층과 지속적인 목적지를 소유합니다',
      description:
        '데스크톱 제품에서 그룹·하위 항목·배지·계정 진입점을 계속 노출할 때 적합합니다. 3~5개의 평면 목적지만 필요하면 Adaptive Navigation을, 페이지 안 이동이면 Anchor를 사용하세요.',
    },
    docs: {
      description: {
        component:
          'SideNav는 WDS 대응이 없는 LK Product Extension입니다. 데스크톱 제품 셸의 계층·그룹·배지·계정 푸터와 오버레이 레일을 담당하며, 고정 아이콘 레일과 모바일 하단 내비게이션은 별도 Product Navigation 패턴으로 구분합니다.',
      },
    },
  },
};

export default meta;

/* 폭 전환은 peek 지연 160ms + width transition 200ms를 거치지만, 병렬 검증의
   CPU 경합에서는 타이머가 크게 밀릴 수 있어 넉넉하게 기다린다. */
async function waitForWidth(element, expectedWidth, timeoutMs = 5000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (Math.abs(element.getBoundingClientRect().width - expectedWidth) < 1) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out waiting for the SideNav width to become ${expectedWidth}px.`);
}

/* SideNav overlay는 160/480ms 타이머로 확장·축소한다. 백그라운드 탭에서는
   Chromium이 타이머를 1초 단위로 스로틀해 단계가 뒤엉키므로(접근성 가드는
   스로틀링을 끄고 실행), 포인터 이벤트는 네이티브 mouseover/mouseout으로
   결정적으로 전달한다. */
function hoverNav(nav) {
  nav.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, relatedTarget: document.body }));
}
function unhoverNav(nav) {
  nav.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, relatedTarget: document.body }));
}

function SideNavFixture() {
  const [value, setValue] = React.useState('missions-live');
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <main
      data-testid="overlay-fixture"
      tabIndex={-1}
      style={{
        display: 'grid',
        gridTemplateColumns: '64px minmax(0, 1fr)',
        width: 420,
        maxWidth: '100%',
        minHeight: 540,
        position: 'relative',
      }}
    >
      <SideNav
        data-testid="side-nav"
        aria-label="운영 탐색"
        items={navigationItems}
        value={value}
        onChange={setValue}
        width={252}
        collapsedWidth={64}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        overlay
        header={<Lockup variant="inline" height={22} />}
        headerCollapsed={<Lockup variant="mark" height={22} />}
        footer={(
          <UserMenu
            name="운영자"
            detail="로봇 관리자"
            status="online"
            collapsed={collapsed}
            items={accountItems}
          />
        )}
        style={{ height: 540 }}
      />
      <div
        aria-hidden="true"
        style={{
          display: 'grid',
          alignContent: 'start',
          gap: 'var(--space-3)',
          minWidth: 0,
          padding: 'var(--space-6)',
          color: 'var(--color-semantic-label-assistive)',
        }}
      >
        <span style={{ width: '42%', height: 12, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-normal)' }} />
        <span style={{ width: '76%', height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-normal)' }} />
        <span style={{ width: '62%', height: 8, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-normal)' }} />
      </div>
    </main>
  );
}

const linkedNavigationItems = [
  { heading: '목적지' },
  { value: 'overview', label: '운영 개요', href: '#overview', icon: <Icon name="home" size={18} />, onClick: (event) => event.preventDefault() },
  {
    value: 'missions',
    label: '미션',
    icon: <Icon name="document" size={18} />,
    children: [
      { value: 'missions-live', label: '실행 중', href: '#missions-live', onClick: (event) => event.preventDefault() },
      { value: 'missions-queued', label: '아주 긴 대기 작업 목적지와 원격 점검 상세 이름', href: '#missions-queued', onClick: (event) => event.preventDefault() },
    ],
  },
  { value: 'disabled', label: '권한 없는 목적지', href: '#disabled', icon: <Icon name="setting" size={18} />, disabled: true },
];

function SideNavLinkFixture() {
  const [value, setValue] = React.useState('overview');
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <SideNav
        aria-label="링크 목적지 탐색"
        items={linkedNavigationItems}
        value={value}
        onChange={setValue}
        width={280}
        style={{ height: 420 }}
      />
      <output data-testid="sidenav-linked-value" style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>선택: {value}</output>
    </div>
  );
}

export const LinkDestinations = {
  name: '개요',
  parameters: storyDescription(
    '직접 이동하는 link, 하위 항목을 여는 disclosure, 사용할 수 없는 목적지를 함께 검증합니다. 각 항목의 의미와 키보드 도달 가능성이 DOM 역할과 일치하는지 확인하세요.',
  ),
  render: () => <SideNavLinkFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav[aria-label="링크 목적지 탐색"]');
    const overview = nav?.querySelector('a[href="#overview"]');
    const group = nav?.querySelector('button[aria-expanded]');
    const disabled = nav?.querySelector('a[aria-disabled="true"]');
    if (!nav || !overview || !group || !disabled || disabled.hasAttribute('href') || disabled.tabIndex !== -1) {
      throw new Error('SideNav must render leaf destinations as anchors, groups as disclosure buttons, and disabled links as non-navigable.');
    }
    await userEvent.click(group);
    const queued = nav.querySelector('a[href="#missions-queued"]');
    const queuedLabel = Array.from(queued?.querySelectorAll('span') ?? []).find((node) => node.textContent === '아주 긴 대기 작업 목적지와 원격 점검 상세 이름');
    if (!queued || !queuedLabel || getComputedStyle(queuedLabel).textOverflow !== 'ellipsis' || queuedLabel.scrollWidth <= queuedLabel.clientWidth) {
      throw new Error('Expanded linked children must preserve the long-label truncation contract.');
    }
    queued.focus();
    await userEvent.keyboard('{Enter}');
    if (!canvasElement.querySelector('[data-testid="sidenav-linked-value"]')?.textContent?.includes('missions-queued') || queued.getAttribute('aria-current') !== 'page') {
      throw new Error('Keyboard link activation must update SideNav selection and aria-current.');
    }
  },
};

export const OverlayPeek = {
  name: '상호작용 · 겹침형 미리보기와 Escape 복귀',
  parameters: storyDescription(
    '접힌 레일이 hover와 focus에서 임시로 펼쳐지고 Escape 뒤 원래 폭과 초점으로 돌아오는 상황입니다. 본문을 밀지 않고 탐색 맥락을 보존하는지 확인하세요.',
  ),
  render: () => <SideNavFixture />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="overlay-fixture"]');
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const panel = nav?.firstElementChild;
    if (!fixture || !nav || !panel || Math.round(panel.getBoundingClientRect().width) !== 64) {
      throw new Error('Overlay SideNav must reserve only the collapsed rail width initially.');
    }

    hoverNav(nav);
    try {
      await waitForWidth(panel, 252);
    } catch {
      /* 병렬 검증 부하에서 hover 이벤트가 간헐적으로 소실되는 플레이크 대비
         1회 재시도. 동작 계약(호버 → 확장) 자체는 그대로 검증된다. */
      unhoverNav(nav);
      hoverNav(nav);
      await waitForWidth(panel, 252);
    }
    if (Math.abs(panel.getBoundingClientRect().width - 252) >= 1) {
      throw new Error('Hovering the overlay rail must reveal the full SideNav panel.');
    }

    const missions = nav.querySelector('button[title="미션"]');
    const initialActive = nav.querySelector('button[aria-current="page"]');
    const disabled = nav.querySelector('button[title="권한 관리"]');
    const longItem = nav.querySelector('button[title="다중 로봇 장비 상태와 원격 점검 로그"]');
    const longLabel = Array.from(longItem?.querySelectorAll('span') ?? [])
      .find((span) => span.textContent?.includes('다중 로봇 장비 상태와 원격 점검 로그'));
    if (!missions || missions.getAttribute('aria-expanded') !== 'true' || !initialActive?.textContent?.includes('실행 중') || !disabled?.disabled) {
      throw new Error('The expanded overlay must expose its hierarchy, active child, and disabled item.');
    }
    if (!longLabel || longLabel.scrollWidth <= longLabel.clientWidth || getComputedStyle(longLabel).textOverflow !== 'ellipsis') {
      throw new Error('Long SideNav labels must truncate inside the expanded overlay.');
    }

    const queued = Array.from(nav.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('대기 작업'));
    if (!queued) throw new Error('The expanded overlay must expose the open group children.');
    await userEvent.click(queued);
    if (queued.getAttribute('aria-current') !== 'page') {
      throw new Error('Selecting an overlay child must move the current-page state to that item.');
    }
    queued.focus();
    fixture.focus();
    await new Promise((resolve) => setTimeout(resolve, 750));
    if (Math.abs(panel.getBoundingClientRect().width - 252) >= 1) {
      throw new Error('Moving focus outside must not collapse the overlay while the pointer remains inside.');
    }

    queued.focus();
    unhoverNav(nav);
    fixture.focus();
    await waitForWidth(panel, 64);
    if (Math.abs(panel.getBoundingClientRect().width - 64) >= 1) {
      throw new Error('Leaving both pointer and focus must return the overlay to its rail state.');
    }

    hoverNav(nav);
    await waitForWidth(panel, 252);
    const focusedChild = Array.from(nav.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('대기 작업'));
    if (!focusedChild) throw new Error('Reopening the overlay must restore its selected child.');
    focusedChild.focus();
    /* 키 입력도 같은 이유로 실제 KeyboardEvent를 직접 전달한다. */
    focusedChild.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForWidth(panel, 64);
    if (Math.abs(panel.getBoundingClientRect().width - 64) >= 1) {
      throw new Error('Escape must return an expanded overlay SideNav to its rail state.');
    }
    if (canvasElement.ownerDocument.activeElement?.dataset.sidenavValue !== 'missions') {
      throw new Error('Collapsing an overlay must restore child focus to its persistent parent item.');
    }

    unhoverNav(nav);
    hoverNav(nav);
    await waitForWidth(panel, 252);
    const accountTrigger = nav.querySelector('button[aria-haspopup="menu"]');
    if (!accountTrigger) throw new Error('The expanded overlay must preserve its footer account action.');
    accountTrigger.focus();
    accountTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForWidth(panel, 64);
    if (canvasElement.ownerDocument.activeElement !== accountTrigger) {
      throw new Error('Collapsing an overlay must keep focus on a persistent footer action.');
    }
  },
};

export const SideNavUserMenuCard = {
  ...SideNavUserMenuCardStory,
  name: 'SideNav and UserMenu card parity',
  tags: ['!dev', 'visual-parity'],
};
