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

function waitForWidthTransition() {
  return new Promise((resolve) => setTimeout(resolve, 260));
}

function SideNavFixture({ initialCollapsed = false, overlay = false }) {
  const [value, setValue] = React.useState('missions-live');
  const [collapsed, setCollapsed] = React.useState(initialCollapsed);

  return (
    <div
      data-testid={overlay ? 'overlay-fixture' : 'side-nav-fixture'}
      style={overlay
        ? {
            display: 'grid',
            gridTemplateColumns: '64px minmax(0, 1fr)',
            width: 420,
            maxWidth: '100%',
            minHeight: 540,
            position: 'relative',
          }
        : { width: 'max-content', maxWidth: '100%' }}
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
        collapsible={!overlay}
        overlay={overlay}
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
      {overlay && (
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
      )}
    </div>
  );
}

export const HierarchyAndSelection = {
  name: '계층 탐색과 선택 상태',
  render: () => <SideNavFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const missions = nav?.querySelector('button[title="미션"]');
    const initialActive = nav?.querySelector('button[aria-current="page"]');
    const disabled = nav?.querySelector('button[title="권한 관리"]');

    if (!nav || !missions || initialActive?.textContent?.trim() !== '실행 중4' || !disabled?.disabled) {
      throw new Error('SideNav must expose its named navigation region, active child, and disabled item.');
    }
    if (missions.getAttribute('aria-expanded') !== 'true') {
      throw new Error('The group containing the active child must start expanded.');
    }

    await userEvent.click(missions);
    if (missions.getAttribute('aria-expanded') !== 'false' || nav.textContent?.includes('대기 작업')) {
      throw new Error('Activating an expanded group must collapse its child navigation.');
    }

    await userEvent.click(missions);
    const queued = Array.from(nav.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('대기 작업'));
    if (!queued) throw new Error('Expanding a group must restore its child navigation.');
    await userEvent.click(queued);
    if (queued.getAttribute('aria-current') !== 'page') {
      throw new Error('Selecting a child must move the current-page state to that item.');
    }

    for (const action of nav.querySelectorAll('button')) {
      const target = action.getBoundingClientRect();
      if (target.width < 28 || target.height < 28) {
        throw new Error('SideNav actions must preserve at least the component 28px target floor.');
      }
    }

    const live = Array.from(nav.querySelectorAll('button'))
      .find((button) => button.textContent?.includes('실행 중'));
    if (live) await userEvent.click(live);
  },
};

export const CollapsedRail = {
  name: '접힘 레일과 명시적 토글',
  render: () => <SideNavFixture initialCollapsed />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const expand = nav?.querySelector('button[aria-label="펼치기"]');
    if (!nav || !expand || Math.round(nav.getBoundingClientRect().width) !== 64) {
      throw new Error('The collapsed SideNav must render as the configured 64px rail.');
    }
    for (const label of ['운영 개요', '미션', '로봇', '이벤트', '권한 관리']) {
      if (!nav.querySelector(`button[title="${label}"]`)) {
        throw new Error(`The collapsed rail must retain the item name: ${label}`);
      }
    }

    await userEvent.click(expand);
    await waitForWidthTransition();
    const collapse = nav.querySelector('button[aria-label="접기"]');
    if (!collapse || Math.round(nav.getBoundingClientRect().width) !== 252) {
      throw new Error('The explicit toggle must restore the configured expanded width.');
    }
    await userEvent.click(collapse);
    await waitForWidthTransition();
    if (Math.round(nav.getBoundingClientRect().width) !== 64 || nav.scrollWidth > nav.clientWidth + 1) {
      throw new Error('Collapsing again must restore the rail without horizontal overflow.');
    }
  },
};

export const OverlayPeek = {
  name: '오버레이 호버와 Escape 복귀',
  render: () => <SideNavFixture initialCollapsed overlay />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const panel = nav?.firstElementChild;
    if (!nav || !panel || Math.round(panel.getBoundingClientRect().width) !== 64) {
      throw new Error('Overlay SideNav must reserve only the collapsed rail width initially.');
    }

    await userEvent.hover(nav);
    await waitForWidthTransition();
    if (Math.round(panel.getBoundingClientRect().width) !== 252) {
      throw new Error('Hovering the overlay rail must reveal the full SideNav panel.');
    }

    nav.querySelector('button')?.focus();
    await userEvent.keyboard('{Escape}');
    await waitForWidthTransition();
    if (Math.round(panel.getBoundingClientRect().width) !== 64) {
      throw new Error('Escape must return an expanded overlay SideNav to its rail state.');
    }
  },
};
