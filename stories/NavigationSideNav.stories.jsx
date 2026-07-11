import React from 'react';
import { userEvent } from 'storybook/test';
import { Icon, Lockup, SideNav, UserMenu } from '../src/index.js';

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
    docs: {
      description: {
        component:
          'SideNav는 WDS 대응이 없는 LK Product Extension입니다. 데스크톱 앱 셸의 넓은 라벨형 탐색, 계층 disclosure, 선택·비활성 상태, 접힘 레일과 오버레이 동작을 제공합니다. 고정 아이콘 레일은 NavRail, 모바일 탐색은 BottomNav를 사용합니다.',
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

export const OverlayPeek = {
  name: '오버레이 호버와 Escape 복귀',
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
