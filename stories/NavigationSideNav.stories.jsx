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

/* 폭 전환은 peek 지연 160ms + width transition 200ms를 거치므로, 병렬
   검증처럼 부하가 걸린 환경에서도 견디도록 여유 있게 기다린다. */
async function waitForWidth(element, expectedWidth, timeoutMs = 2400) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (Math.abs(element.getBoundingClientRect().width - expectedWidth) < 1) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out waiting for the SideNav width to become ${expectedWidth}px.`);
}

function SideNavFixture() {
  const [value, setValue] = React.useState('missions-live');
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <div
      data-testid="overlay-fixture"
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
    </div>
  );
}

export const OverlayPeek = {
  name: '오버레이 호버와 Escape 복귀',
  render: () => <SideNavFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const panel = nav?.firstElementChild;
    if (!nav || !panel || Math.round(panel.getBoundingClientRect().width) !== 64) {
      throw new Error('Overlay SideNav must reserve only the collapsed rail width initially.');
    }

    await userEvent.hover(nav);
    await waitForWidth(panel, 252);
    if (Math.round(panel.getBoundingClientRect().width) !== 252) {
      throw new Error('Hovering the overlay rail must reveal the full SideNav panel.');
    }

    const missions = nav.querySelector('button[title="미션"]');
    const initialActive = nav.querySelector('button[aria-current="page"]');
    const disabled = nav.querySelector('button[title="권한 관리"]');
    const longItem = nav.querySelector('button[title="다중 로봇 장비 상태와 원격 점검 로그"]');
    const longLabel = Array.from(longItem?.querySelectorAll('span') ?? [])
      .find((span) => span.textContent?.includes('다중 로봇 장비 상태와 원격 점검 로그'));
    if (!missions || missions.getAttribute('aria-expanded') !== 'true' || initialActive?.textContent?.trim() !== '실행 중4' || !disabled?.disabled) {
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
    /* userEvent.keyboard는 이 환경에서 간헐적으로 document keydown 리스너에
       도달하지 않아, 실제 키 입력과 동일한 KeyboardEvent를 직접 전달한다. */
    queued.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForWidth(panel, 64);
    if (Math.round(panel.getBoundingClientRect().width) !== 64) {
      throw new Error('Escape must return an expanded overlay SideNav to its rail state.');
    }
    if (canvasElement.ownerDocument.activeElement?.dataset.sidenavValue !== 'missions') {
      throw new Error('Collapsing an overlay must restore child focus to its persistent parent item.');
    }
  },
};
