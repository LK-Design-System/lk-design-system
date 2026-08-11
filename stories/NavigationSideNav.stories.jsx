import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Icon, Lockup, SideNav, UserMenu } from '../src/index.js';
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

const singleOpenNavigationItems = [
  ...navigationItems,
  {
    value: 'reports',
    label: 'Reports',
    icon: <Icon name="layers" size={18} />,
    children: [
      { value: 'reports-overview', label: 'Overview' },
      { value: 'reports-history', label: 'History' },
    ],
  },
];

const accountItems = [
  { label: '프로필' },
  { label: '설정' },
  { divider: true },
  { label: '로그아웃', danger: true },
];

const meta = {
  title: 'LDS Product/Navigation/Side Nav',
  tags: ['autodocs'],
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
          'SideNav는 데스크톱 제품 셸의 계층·그룹·배지·계정 푸터와 오버레이 레일을 담당하는 LK Product 확장입니다. 고정 아이콘 레일과 모바일 하단 내비게이션은 별도 Product Navigation 패턴으로 구분합니다.',
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

async function waitForMotion(element) {
  const animations = element?.getAnimations?.({ subtree: true }) ?? [];
  await Promise.allSettled(animations.map((animation) => animation.finished));
}

function childMotion(nav, groupValue) {
  return nav?.querySelector(`[data-sidenav-motion="children"][data-sidenav-group="${groupValue}"]`);
}

function isClosedChildMotion(nav, groupValue) {
  const motion = childMotion(nav, groupValue);
  const child = nav?.querySelector(`[data-sidenav-parent="${groupValue}"]`);
  return !!motion
    && motion.dataset.state === 'closed'
    && motion.getAttribute('aria-hidden') === 'true'
    && motion.hasAttribute('inert')
    && child?.tabIndex === -1;
}

function externalCollapseContract(canvasElement, nav) {
  const control = canvasElement.querySelector('[data-testid="docked-collapse-toggle"]');
  const panel = nav?.querySelector('.lk-sidenav__panel-content');
  if (!nav || !control || !panel
    || control.closest('nav')
    || control.getAttribute('aria-controls') !== nav.id
    || nav.querySelector('button[data-sidenav-collapse-toggle]')) {
    throw new Error('The shell collapse toggle must live outside the SideNav, reference its id, and the panel must render no internal toggle.');
  }
  return { control, panel };
}

function canvasDocument(node) {
  return node?.ownerDocument || document;
}

function resolveCssColor(node, property, token) {
  const reference = canvasDocument(node).createElement('span');
  const container = node?.parentElement || canvasDocument(node).body;
  reference.style.position = 'fixed';
  reference.style.visibility = 'hidden';
  reference.style.pointerEvents = 'none';
  reference.style[property] = token;
  container.appendChild(reference);
  const value = getComputedStyle(reference)[property];
  reference.remove();
  return value;
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
      { value: 'missions-live', label: '실행 중', icon: <Icon name="bell" size={16} />, href: '#missions-live', onClick: (event) => event.preventDefault() },
      { value: 'missions-queued', label: '아주 긴 대기 작업 목적지와 원격 점검 상세 이름', icon: <Icon name="clock" size={16} />, href: '#missions-queued', onClick: (event) => event.preventDefault() },
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

function DockedSideNavFixture({ defaultCollapsed = false, initialValue = 'overview' } = {}) {
  const [value, setValue] = React.useState(initialValue);
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        <Button
          data-testid="docked-collapse-toggle"
          variant="secondary"
          aria-expanded={!collapsed}
          aria-controls="docked-side-nav-panel"
          onClick={() => setCollapsed((current) => !current)}
        >
          {collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        </Button>
        <Button
          data-testid="activate-docked-child"
          variant="secondary"
          onClick={() => setValue('missions-queued')}
        >
          하위 경로 활성화
        </Button>
      </div>
      <SideNav
        id="docked-side-nav-panel"
        data-testid="docked-side-nav"
        aria-label="고정형 운영 탐색"
        items={navigationItems}
        value={value}
        onChange={setValue}
        surface="docked"
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        width={252}
        collapsedWidth={64}
        brandAlign="start"
        header={<Lockup variant="inline" height={22} />}
        headerCollapsed={<Lockup variant="mark" height={22} />}
        footerGap="var(--space-3)"
        footer={({ collapsed: footerCollapsed }) => (
          <UserMenu
            data-testid="docked-footer-state"
            data-state={footerCollapsed ? 'collapsed' : 'expanded'}
            name="운영자"
            detail="로봇 관리자"
            status="online"
            collapsed={footerCollapsed}
            items={accountItems}
          />
        )}
        style={{ height: 420 }}
      />
    </div>
  );
}

function NavySideNavAccount({ collapsed }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 'var(--space-2-5)',
        minHeight: 44,
        color: 'var(--component-side-nav-brand-foreground)',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          width: 34,
          height: 34,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--component-side-nav-brand-badge-surface)',
          color: 'var(--component-side-nav-brand-badge-foreground)',
          fontSize: 'var(--label2-size)',
          fontWeight: 'var(--fw-bold)',
        }}
      >
        LK
      </span>
      {!collapsed && (
        <span style={{ display: 'grid', gap: 'var(--space-0-5)', minWidth: 0 }}>
          <strong style={{ fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)' }}>운영자</strong>
          <span style={{ color: 'var(--component-side-nav-brand-muted-foreground)', fontSize: 'var(--caption2-size)' }}>
            로봇 관리자
          </span>
        </span>
      )}
    </div>
  );
}

function NavyDockedSideNavFixture() {
  const [value, setValue] = React.useState('overview');
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div style={{ display: 'grid', width: 'min(100%, 1020px)', gap: 'var(--space-3)' }}>
      <main
        data-testid="navy-demo-shell"
        style={{
          display: 'grid',
          gridTemplateColumns: collapsed ? '68px minmax(0, 1fr)' : '268px minmax(0, 1fr)',
          width: '100%',
          height: 560,
          overflow: 'hidden',
          border: '1px solid var(--color-semantic-line-solid-normal)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-semantic-background-elevated-normal)',
          boxShadow: 'var(--shadow-lg)',
          transition: 'grid-template-columns var(--dur-base) var(--ease-out)',
        }}
      >
        <SideNav
          id="navy-docked-side-nav-panel"
          data-testid="navy-docked-side-nav"
          aria-label="브랜드 네이비 운영 탐색"
          items={navigationItems}
          value={value}
          onChange={setValue}
          surface="docked"
          appearance="brand"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          width={268}
          collapsedWidth={68}
          brandAlign="start"
          header={<Lockup variant="inline" tone="white" height={22} />}
          headerCollapsed={<Lockup variant="mark" tone="white" height={22} />}
          footerGap="var(--space-3)"
          footer={({ collapsed: footerCollapsed }) => <NavySideNavAccount collapsed={footerCollapsed} />}
          style={{ height: '100%' }}
        />
        <section
          aria-label="SideNav 외형 작업면"
          style={{
            minWidth: 0,
            overflow: 'hidden',
            background: 'var(--color-semantic-background-normal-normal)',
          }}
        >
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 64,
              padding: '0 var(--space-6)',
              borderBottom: '1px solid var(--color-semantic-line-solid-normal)',
              background: 'var(--color-semantic-background-elevated-normal)',
            }}
          >
            <Button
              data-testid="navy-collapse-toggle"
              variant="secondary"
              aria-expanded={!collapsed}
              aria-controls="navy-docked-side-nav-panel"
              onClick={() => setCollapsed((current) => !current)}
            >
              {collapsed ? '사이드바 펼치기' : '사이드바 접기'}
            </Button>
            <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)' }}>
              LDS · Brand navy
            </span>
          </header>
        </section>
      </main>
    </div>
  );
}

function ControlledCollapseFixture() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [requests, setRequests] = React.useState(0);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <Button
        data-testid="parent-collapse-toggle"
        variant="secondary"
        aria-expanded={!collapsed}
        aria-controls="controlled-side-nav-panel"
        onClick={() => setCollapsed((current) => !current)}
      >
        {collapsed ? '사이드바 펼치기' : '사이드바 접기'}
      </Button>
      <output data-testid="controlled-collapse-output">
        컴포넌트 요청 {requests}회 · 현재 {String(collapsed)}
      </output>
      <SideNav
        id="controlled-side-nav-panel"
        data-testid="controlled-side-nav"
        aria-label="제어형 운영 탐색"
        items={navigationItems}
        defaultValue="overview"
        surface="docked"
        collapsed={collapsed}
        onCollapsedChange={() => setRequests((count) => count + 1)}
        width={252}
        collapsedWidth={64}
        header={<Lockup variant="inline" height={22} />}
        headerCollapsed={<Lockup variant="mark" height={22} />}
        style={{ height: 420 }}
      />
    </div>
  );
}

function CollapsedParentFixture() {
  const [value, setValue] = React.useState('overview');
  const [overlay, setOverlay] = React.useState(false);
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <Button
        data-testid="overlay-mode-toggle"
        variant="secondary"
        onClick={() => setOverlay((current) => !current)}
      >
        {overlay ? '고정 탐색으로 전환' : '겹침 탐색으로 전환'}
      </Button>
      <output data-testid="collapsed-parent-output">선택: {value}</output>
      <SideNav
        data-testid="collapsed-parent-side-nav"
        aria-label="접힌 계층 탐색"
        items={navigationItems}
        value={value}
        onChange={setValue}
        surface="docked"
        defaultCollapsed
        overlay={overlay}
        width={252}
        collapsedWidth={64}
        header={<Lockup variant="inline" height={22} />}
        headerCollapsed={<Lockup variant="mark" height={22} />}
        style={{ height: 420 }}
      />
    </div>
  );
}

function SingleOpenGroupsFixture() {
  return (
    <SideNav
      data-testid="single-open-side-nav"
      aria-label="Single-open navigation"
      items={singleOpenNavigationItems}
      defaultValue="overview"
      multiple={false}
      width={252}
      style={{ height: 420 }}
    />
  );
}

function ManualActiveGroupFixture() {
  return (
    <SideNav
      data-testid="manual-active-group-side-nav"
      aria-label="수동 그룹 탐색"
      items={navigationItems}
      value="missions-live"
      autoExpandActiveGroup={false}
      width={252}
      header={<Lockup variant="inline" height={22} />}
      style={{ height: 420 }}
    />
  );
}

export const LinkDestinations = {
  name: '개요',
  parameters: storyDescription(
    '직접 이동하는 link, 하위 항목을 여는 disclosure, 사용할 수 없는 목적지를 함께 검증합니다. 현재 목적지는 상시 배경 없이 text-safe blue accent label·icon과 굵기로 표시하고, hover·pressed에서만 표면을 사용합니다.',
  ),
  render: () => <SideNavLinkFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('nav[aria-label="링크 목적지 탐색"]');
    const overview = nav?.querySelector('a[href="#overview"]');
    const group = nav?.querySelector('button[aria-expanded]');
    const disabled = nav?.querySelector('a[aria-disabled="true"]');
    if (!nav || nav.dataset.surface !== 'floating' || !overview || !group || !disabled || disabled.hasAttribute('href') || disabled.tabIndex !== -1) {
      throw new Error('SideNav must preserve the floating default, render leaf destinations as anchors, groups as disclosure buttons, and disabled links as non-navigable.');
    }
    const list = nav.querySelector('.lk-sidenav__scroll');
    if (list?.tagName !== 'UL'
      || getComputedStyle(list).listStyleType !== 'none'
      || !overview.closest('li')
      || overview.closest('ul') !== list) {
      throw new Error('SideNav items must render inside a native unstyled ul/li list.');
    }
    const queuedBeforeOpen = nav.querySelector('a[href="#missions-queued"]');
    const nestedMotion = childMotion(nav, 'missions');
    if (!queuedBeforeOpen || !nestedMotion || !isClosedChildMotion(nav, 'missions')) {
      throw new Error('A closed SideNav disclosure must keep its motion surface mounted while removing every child from interaction and current-page semantics.');
    }
    await userEvent.click(group);
    const queued = nav.querySelector('a[href="#missions-queued"]');
    await waitForMotion(nestedMotion);
    const nestedList = queued?.closest('ul');
    if (queued !== queuedBeforeOpen
      || nestedMotion.dataset.state !== 'open'
      || nestedMotion.hasAttribute('inert')
      || !nestedList
      || nestedList === list
      || nestedList.closest('li')?.closest('ul') !== list) {
      throw new Error('SideNav group children must render as a nested list inside the parent list item.');
    }
    const childIcon = queued?.querySelector('[data-sidenav-child-icon]');
    if (!childIcon || childIcon.getAttribute('aria-hidden') !== 'true') {
      throw new Error('SideNav group children must expose an aligned decorative icon slot.');
    }
    const parentLabel = group.querySelector('[data-slot="label"]');
    const queuedLabel = Array.from(queued?.querySelectorAll('span') ?? []).find((node) => node.textContent === '아주 긴 대기 작업 목적지와 원격 점검 상세 이름');
    if (!queued || !queuedLabel || getComputedStyle(queuedLabel).textOverflow !== 'ellipsis' || queuedLabel.scrollWidth <= queuedLabel.clientWidth) {
      throw new Error('Expanded linked children must preserve the long-label truncation contract.');
    }
    const childSurfaceInset = Math.round(queued.getBoundingClientRect().left - group.getBoundingClientRect().left);
    const childLabelInset = Math.round(queuedLabel.getBoundingClientRect().left - parentLabel?.getBoundingClientRect().left);
    const childListInset = Math.round(Number.parseFloat(getComputedStyle(nestedList).paddingInlineStart));
    const iconChildPadding = Math.round(Number.parseFloat(getComputedStyle(queued).paddingInlineStart));
    if (childListInset !== 12
      || iconChildPadding !== 16
      || childSurfaceInset !== 12
      || childLabelInset !== 12
      || Math.round(Number.parseFloat(getComputedStyle(queuedLabel).lineHeight)) !== 18) {
      throw new Error('Icon children must inset both their destination surface and label by 12px while using the label2 line height.');
    }
    await userEvent.unhover(group);
    await waitFor(() => {
      if (getComputedStyle(group).backgroundColor !== 'rgba(0, 0, 0, 0)') {
        throw new Error('An expanded SideNav group must not retain a selected background.');
      }
    });
    queued.focus();
    await userEvent.keyboard('{Enter}');
    if (!canvasElement.querySelector('[data-testid="sidenav-linked-value"]')?.textContent?.includes('missions-queued') || queued.getAttribute('aria-current') !== 'page') {
      throw new Error('Keyboard link activation must update SideNav selection and aria-current.');
    }
    const expectedActiveInk = resolveCssColor(queued, 'color', 'var(--color-semantic-accent-blue-text)');
    await waitFor(() => {
      const currentDestinations = nav.querySelectorAll('[aria-current="page"]');
      const currentStyle = getComputedStyle(queued);
      if (
        currentDestinations.length !== 1
        || group.hasAttribute('aria-current')
        || currentStyle.backgroundColor !== 'rgba(0, 0, 0, 0)'
        || currentStyle.color !== expectedActiveInk
        || getComputedStyle(childIcon).color !== expectedActiveInk
        || Number.parseInt(getComputedStyle(queuedLabel).fontWeight, 10) < 600
      ) {
        throw new Error('Only the current SideNav destination may own text-safe accent ink and bold emphasis without a persistent fill.');
      }
    });
    const selectedRestBackground = getComputedStyle(queued).backgroundColor;
    const expectedActiveHover = resolveCssColor(queued, 'backgroundColor', 'var(--color-semantic-fill-normal)');
    await userEvent.hover(queued);
    await waitFor(() => {
      const activeHoverStyle = getComputedStyle(queued);
      if (activeHoverStyle.backgroundColor !== expectedActiveHover
        || activeHoverStyle.color !== expectedActiveInk) {
        throw new Error('The current destination must retain text-safe accent ink while active-hover adds only the neutral interaction fill.');
      }
    });
    await userEvent.unhover(queued);
    await userEvent.hover(group);
    await waitFor(() => {
      const hoverBackground = getComputedStyle(group).backgroundColor;
      if (hoverBackground === 'rgba(0, 0, 0, 0)' || hoverBackground === selectedRestBackground) {
        throw new Error('Parent hover must remain visible while the current destination stays fill-free at rest.');
      }
    });
    await userEvent.unhover(group);
  },
};

export const DockedSurface = {
  name: '변형·상태 · 셸 고정형 표면',
  parameters: storyDescription(
    '제품 셸에 붙는 docked 표면을 검증합니다. 접기 토글은 셸 상단 바(패널 밖)에 있고 SideNav는 collapsed 제어 프롭으로만 구동되며, 패널 안에는 어떤 토글도 렌더되지 않습니다. 레일과 펼친 패널의 브랜드 영역·행 높이도 같아 전환 중 목적지가 세로로 움직이지 않습니다.',
  ),
  render: () => <DockedSideNavFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="docked-side-nav"]');
    const brand = nav?.querySelector('.lk-sidenav__brand');
    const footerState = nav?.querySelector('[data-testid="docked-footer-state"]');
    const styles = nav ? getComputedStyle(nav) : null;
    const inlineEndWidth = styles?.getPropertyValue('border-inline-end-width');
    if (!nav || nav.dataset.surface !== 'docked' || !styles
      || styles.borderTopWidth !== '0px'
      || styles.borderBottomWidth !== '0px'
      || !(parseFloat(inlineEndWidth) > 0)
      || styles.borderRadius !== '0px'
      || styles.boxShadow !== 'none') {
      throw new Error('Docked SideNav must remove the floating outline, radius, and shadow while retaining one logical end divider.');
    }
    const footerTrigger = footerState?.querySelector('button[aria-haspopup="menu"]');
    if (getComputedStyle(brand).justifyContent !== 'flex-start'
      || footerState?.dataset.state !== 'expanded'
      || !footerTrigger?.textContent?.includes('운영자')
      || !footerTrigger?.textContent?.includes('로봇 관리자')) {
      throw new Error('Expanded SideNav must honor start-aligned branding and receive expanded footer render state.');
    }
    const overview = nav.querySelector('[data-sidenav-value="overview"]');
    const overviewIcon = overview?.querySelector('[data-slot="icon"]');
    const overviewContent = overview?.querySelector('[data-sidenav-motion="content"]');
    const brandMotion = brand?.querySelector('[data-sidenav-motion="swap"]');
    const motionStyles = [...(nav.querySelectorAll('style') ?? [])].map((node) => node.textContent).join('\n');
    if (!overviewIcon || !overviewContent || !brandMotion
      || !motionStyles.includes('prefers-reduced-motion:reduce')
      || !motionStyles.includes('[data-sidenav-motion]')) {
      throw new Error('SideNav collapse motion must expose stable content/brand hooks and a reduced-motion guard for every coordinated transition.');
    }
    const brandStyles = getComputedStyle(brand);
    const brandContentWidth = brand.clientWidth
      - Number.parseFloat(brandStyles.paddingLeft)
      - Number.parseFloat(brandStyles.paddingRight);
    if (Math.abs(brandMotion.getBoundingClientRect().width - brandContentWidth) >= 1) {
      throw new Error('The animated brand swap wrapper must preserve the full header-slot width.');
    }
    const expandedGeometry = {
      brandPaddingBottom: Number.parseFloat(getComputedStyle(brand).paddingBottom),
      rowHeight: overview?.getBoundingClientRect().height,
      iconInlineOffset: overviewIcon.getBoundingClientRect().left - nav.getBoundingClientRect().left,
    };

    const activateChild = canvasElement.querySelector('[data-testid="activate-docked-child"]');
    if (!activateChild) throw new Error('The controlled child-route fixture must expose an external route change.');
    await userEvent.click(activateChild);
    const activeChild = nav.querySelector('[data-sidenav-value="missions-queued"]');
    const activeParent = nav.querySelector('[data-sidenav-value="missions"]');
    if (!activeChild || activeChild.getAttribute('aria-current') !== 'page' || activeParent?.getAttribute('aria-expanded') !== 'true') {
      throw new Error('A controlled child route must reveal its parent group and expose the active destination.');
    }
    const activeChildLabel = activeChild.querySelector('[data-slot="label"]');
    const activeParentLabel = activeParent.querySelector('[data-slot="label"]');
    const childSurfaceInset = Math.round(activeChild.getBoundingClientRect().left - activeParent.getBoundingClientRect().left);
    const childLabelInset = Math.round(activeChildLabel?.getBoundingClientRect().left - activeParentLabel?.getBoundingClientRect().left);
    if (childSurfaceInset !== 12 || childLabelInset !== 12) {
      throw new Error('Icon-free children must retain the same 12px surface and label hierarchy inset as icon children.');
    }

    const { control, panel } = externalCollapseContract(canvasElement, nav);
    if (control.textContent?.trim() !== '사이드바 접기'
      || control.getAttribute('aria-expanded') !== 'true'
      || panel.dataset.collapsed !== 'false') {
      throw new Error('The expanded shell toggle must announce the collapse action and the open panel state.');
    }
    await userEvent.click(control);
    await waitForWidth(nav, 64);
    if (control.textContent?.trim() !== '사이드바 펼치기'
      || control.getAttribute('aria-expanded') !== 'false'
      || panel.dataset.collapsed !== 'true'
      || footerState?.dataset.state !== 'collapsed'
      || footerTrigger?.getAttribute('title') !== '운영자'
      || footerTrigger?.children.length !== 1
      || !footerTrigger?.querySelector('[data-variant="person"]')
      || overview.querySelector('[data-sidenav-motion="content"]') !== overviewContent
      || overviewContent.dataset.state !== 'hidden'
      || overviewContent.getAttribute('aria-hidden') !== 'true'
      || canvasElement.ownerDocument.activeElement !== control) {
      throw new Error('Collapsing from the shell toggle must keep focus on the toggle and flip its announced state.');
    }
    const collapsedGeometry = {
      brandPaddingBottom: Number.parseFloat(getComputedStyle(brand).paddingBottom),
      rowHeight: overview?.getBoundingClientRect().height,
      iconInlineOffset: overviewIcon.getBoundingClientRect().left - nav.getBoundingClientRect().left,
    };
    if (expandedGeometry.brandPaddingBottom !== 18
      || collapsedGeometry.brandPaddingBottom !== 18
      || Math.abs(collapsedGeometry.rowHeight - expandedGeometry.rowHeight) >= 1
      || Math.abs(collapsedGeometry.iconInlineOffset - expandedGeometry.iconInlineOffset) >= 1
      || Math.round(collapsedGeometry.rowHeight) !== 44) {
      throw new Error('Collapsed and expanded SideNav states must preserve brand spacing, a 44px row, and the icon anchor during motion.');
    }
    await userEvent.click(control);
    await waitForWidth(nav, 252);
    if (control.textContent?.trim() !== '사이드바 접기'
      || overview.querySelector('[data-sidenav-motion="content"]') !== overviewContent
      || overviewContent.dataset.state !== 'visible'
      || overviewContent.hasAttribute('aria-hidden')) {
      throw new Error('The expanded visual story must finish in its named state.');
    }
    await userEvent.click(control);
    await userEvent.click(control);
    await userEvent.click(control);
    await waitForWidth(nav, 64);
    if (overview.querySelector('[data-sidenav-motion="content"]') !== overviewContent
      || overviewContent.dataset.state !== 'hidden'
      || overviewContent.getAttribute('aria-hidden') !== 'true') {
      throw new Error('Rapid repeated collapse toggles must settle on the requested state without replacing the item content DOM.');
    }
    await userEvent.click(control);
    await waitForWidth(nav, 252);
    control.blur();
  },
};

export const NavyDockedSurface = {
  name: '변형·상태 · 브랜드 네이비 외형',
  parameters: storyDescription(
    '브랜드 표면 토큰을 실제 appearance="brand" API로 적용한 SideNav입니다. 기존 구조·간격·타이포그래피·접힘 동작은 유지하고, 평면 네이비 셸과 hover·active·focus 상태색만 바꿉니다.',
  ),
  render: () => <NavyDockedSideNavFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="navy-docked-side-nav"]');
    const activeItem = nav?.querySelector('[data-sidenav-value="overview"]');
    const activeIcon = activeItem?.querySelector('[data-slot="icon"]');
    const inactiveItem = nav?.querySelector('[data-sidenav-value="robots"]');
    const control = canvasElement.querySelector('[data-testid="navy-collapse-toggle"]');
    if (!nav || !activeItem || !activeIcon || !inactiveItem || !control) {
      throw new Error('The navy shell demo must render its SideNav, destinations, and external collapse control.');
    }

    const expectedNavy = resolveCssColor(activeItem, 'backgroundColor', 'var(--component-side-nav-brand-surface)');
    const expectedActive = resolveCssColor(activeItem, 'backgroundColor', 'transparent');
    const expectedActiveHover = resolveCssColor(activeItem, 'backgroundColor', 'var(--component-side-nav-brand-active-hover-surface)');
    const expectedText = resolveCssColor(activeItem, 'color', 'var(--component-side-nav-brand-active-foreground)');
    const expectedMuted = resolveCssColor(inactiveItem, 'color', 'var(--component-side-nav-brand-muted-foreground)');
    const activeBackground = getComputedStyle(activeItem).backgroundColor;
    const navStyle = getComputedStyle(nav);
    if (nav.dataset.appearance !== 'brand'
      || nav.querySelectorAll('[aria-current="page"]').length !== 1
      || navStyle.backgroundColor !== expectedNavy
      || navStyle.backgroundImage !== 'none'
      || activeBackground !== expectedActive
      || getComputedStyle(activeItem).color !== expectedText
      || getComputedStyle(activeIcon).color !== expectedText
      || activeItem.getAttribute('aria-current') !== 'page'
      || getComputedStyle(inactiveItem).color !== expectedMuted) {
      throw new Error('The brand appearance must resolve a flat brand surface with no gradient, muted destinations, and accent-ink selection without changing SideNav semantics.');
    }

    const inactiveBackground = getComputedStyle(inactiveItem).backgroundColor;
    const expectedHover = resolveCssColor(inactiveItem, 'backgroundColor', 'var(--component-side-nav-brand-hover-surface)');
    const expectedHoverText = resolveCssColor(inactiveItem, 'color', 'var(--component-side-nav-brand-hover-foreground)');
    if (expectedHover === inactiveBackground) {
      throw new Error('The brand appearance must keep the inactive and hover surfaces distinct.');
    }

    await userEvent.hover(inactiveItem);
    await waitFor(() => {
      if (getComputedStyle(inactiveItem).backgroundColor !== expectedHover
        || getComputedStyle(inactiveItem).color !== expectedHoverText) {
        throw new Error('Hover must raise an inactive destination with the governed brand surface and foreground.');
      }
    });
    await userEvent.unhover(inactiveItem);

    await userEvent.hover(activeItem);
    await waitFor(() => {
      if (getComputedStyle(activeItem).backgroundColor !== expectedActiveHover
        || getComputedStyle(activeItem).color !== expectedText) {
        throw new Error('Hover must add a surface behind the active accent ink without changing its selected foreground.');
      }
    });
    await userEvent.unhover(activeItem);

    await userEvent.click(control);
    await waitForWidth(nav, 68);
    if (control.getAttribute('aria-expanded') !== 'false') {
      throw new Error('The external shell control must announce the collapsed navy rail.');
    }
    await userEvent.click(control);
    await waitForWidth(nav, 268);
    if (nav.dataset.appearance !== 'brand') {
      throw new Error('The brand appearance must persist across collapse and expansion.');
    }
    control.blur();
  },
};

export const DockedCollapsed = {
  name: '변형·상태 · 접힌 아이콘 레일',
  parameters: storyDescription(
    '64px 레일에서 숨겨진 현재 목적지의 부모가 text-safe blue accent 선택 프록시를 맡고, 펼치면 실제 leaf로 강조가 이동합니다. 상시 선택 배경은 만들지 않으며 셸 상단 바의 외부 토글이 상태를 제어합니다.',
  ),
  render: () => <DockedSideNavFixture defaultCollapsed initialValue="missions-queued" />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="docked-side-nav"]');
    await waitForWidth(nav, 64);
    const initial = externalCollapseContract(canvasElement, nav);
    const activeParent = nav.querySelector('[data-sidenav-value="missions"]');
    const hiddenActiveChild = nav.querySelector('[data-sidenav-parent="missions"][data-state="active"]');
    if (initial.control.textContent?.trim() !== '사이드바 펼치기'
      || initial.panel.dataset.collapsed !== 'true'
      || !activeParent
      || !hiddenActiveChild
      || !isClosedChildMotion(nav, 'missions')) {
      throw new Error('The collapsed visual story must retain the active parent while hiding its child rows.');
    }
    const expectedParentBackground = resolveCssColor(activeParent, 'backgroundColor', 'transparent');
    const expectedParentInk = resolveCssColor(activeParent, 'color', 'var(--color-semantic-accent-blue-text)');
    const expectedSelectedBackground = resolveCssColor(activeParent, 'backgroundColor', 'transparent');
    const expectedSelectedInk = resolveCssColor(activeParent, 'color', 'var(--color-semantic-accent-blue-text)');
    const collapsedParentStyle = getComputedStyle(activeParent);
    if (activeParent.dataset.state !== 'active-descendant'
      || activeParent.hasAttribute('aria-current')
      || collapsedParentStyle.backgroundColor !== expectedParentBackground
      || collapsedParentStyle.color !== expectedParentInk) {
      throw new Error('A collapsed active descendant must keep stronger parent ink without adding a selection surface or moving aria-current.');
    }

    const railItem = nav.querySelector('[data-sidenav-value="overview"]');
    if (!railItem || railItem.getAttribute('aria-label') !== '운영 개요' || railItem.hasAttribute('title')) {
      throw new Error('A collapsed rail item must keep its aria-label and drop the pointer-only title attribute.');
    }
    railItem.focus();
    /* 문서가 OS 포커스를 갖지 않은 환경에서는 focus()가 focus 이벤트를 내지 않으므로 직접 전달한다. */
    railItem.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    await waitFor(() => {
      const describedBy = railItem.getAttribute('aria-describedby') || '';
      const railTooltip = describedBy
        .split(/\s+/)
        .map((id) => canvasDocument(nav).getElementById(id))
        .find((node) => node?.getAttribute('role') === 'tooltip');
      if (!railTooltip
        || getComputedStyle(railTooltip).visibility !== 'visible'
        || !railTooltip.textContent.includes('운영 개요')) {
        throw new Error('Keyboard focus on a collapsed rail item must reveal its associated DS tooltip label.');
      }
    });
    railItem.blur();
    railItem.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    await waitFor(() => {
      const describedBy = railItem.getAttribute('aria-describedby') || '';
      const railTooltip = describedBy
        .split(/\s+/)
        .map((id) => canvasDocument(nav).getElementById(id))
        .find((node) => node?.getAttribute('role') === 'tooltip');
      if (railTooltip && getComputedStyle(railTooltip).visibility === 'visible') {
        throw new Error('Leaving a collapsed rail item must dismiss its tooltip.');
      }
    });

    await userEvent.click(initial.control);
    await waitForWidth(nav, 252);
    const expectedExpandedParentInk = resolveCssColor(activeParent, 'color', 'var(--color-semantic-label-normal)');
    await waitFor(() => {
      const activeChild = nav.querySelector('[data-sidenav-value="missions-queued"]');
      const expandedParentStyle = getComputedStyle(activeParent);
      if (activeChild?.getAttribute('aria-current') !== 'page'
        || activeParent.hasAttribute('aria-current')
        || expandedParentStyle.backgroundColor !== 'rgba(0, 0, 0, 0)'
        || expandedParentStyle.color !== expectedExpandedParentInk
        || getComputedStyle(activeChild).backgroundColor !== expectedSelectedBackground
        || getComputedStyle(activeChild).color !== expectedSelectedInk) {
        throw new Error('Expanding the rail must transfer text-safe accent selection ink to the actual current leaf while the parent returns to disclosure styling.');
      }
    });
    await userEvent.click(initial.control);
    await waitForWidth(nav, 64);
    await waitFor(() => {
      if (initial.control.textContent?.trim() !== '사이드바 펼치기'
        || getComputedStyle(activeParent).backgroundColor !== expectedParentBackground
        || activeParent.hasAttribute('aria-current')) {
        throw new Error('The collapsed visual story must finish in its named state.');
      }
    });
    initial.control.blur();
  },
};

export const ControlledCollapse = {
  name: '상호작용 · 제어 상태',
  parameters: storyDescription(
    '제품이 collapsed 상태를 소유할 때 폭은 부모 prop 갱신으로만 바뀌고, persistent 표면의 SideNav는 스스로 onCollapsedChange를 발화하지 않습니다.',
  ),
  render: () => <ControlledCollapseFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="controlled-side-nav"]');
    const toggle = canvasElement.querySelector('[data-testid="parent-collapse-toggle"]');
    const output = canvasElement.querySelector('[data-testid="controlled-collapse-output"]');
    if (!nav || !toggle || !output || toggle.getAttribute('aria-controls') !== nav.id) {
      throw new Error('Controlled collapse fixtures must expose their external toggle and state evidence.');
    }

    const parent = nav.querySelector('[data-sidenav-value="missions"]');
    await userEvent.click(parent);
    if (!output.textContent.includes('컴포넌트 요청 0회')
      || Math.abs(nav.getBoundingClientRect().width - 252) >= 1) {
      throw new Error('Interacting with persistent nav items must never emit collapse requests or change the parent-owned width.');
    }

    await userEvent.click(toggle);
    await waitForWidth(nav, 64);
    if (toggle.getAttribute('aria-expanded') !== 'false'
      || !output.textContent.includes('현재 true')) {
      throw new Error('The parent-owned toggle must be the only driver of the collapsed width.');
    }
    await userEvent.click(toggle);
    await waitForWidth(nav, 252);
    if (!output.textContent.includes('컴포넌트 요청 0회')) {
      throw new Error('Round-tripping the parent toggle must leave the component request count untouched.');
    }
  },
};

export const CollapsedParentExpansion = {
  name: '상호작용 · 접힌 그룹과 겹침 모드 전환',
  parameters: storyDescription(
    '접힌 레일의 그룹 확장과 런타임 overlay 전환을 함께 검증합니다. 비제어 SideNav는 overlay 진입 때 접히고 이탈 때 이전 고정형 접힘 상태를 복원합니다.',
  ),
  render: () => <CollapsedParentFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="collapsed-parent-side-nav"]');
    const parent = nav?.querySelector('[data-sidenav-value="missions"]');
    const output = canvasElement.querySelector('[data-testid="collapsed-parent-output"]');
    const overlayToggle = canvasElement.querySelector('[data-testid="overlay-mode-toggle"]');
    if (!nav || !parent || !output || !overlayToggle || !nav.querySelector('.lk-sidenav__panel-content')) throw new Error('Collapsed hierarchy fixtures must expose their parent, mode control, and selection evidence.');
    parent.focus();
    await userEvent.keyboard('{Enter}');
    await waitForWidth(nav, 252);
    if (parent.getAttribute('aria-expanded') !== 'true'
      || canvasElement.ownerDocument.activeElement !== parent
      || childMotion(nav, 'missions')?.dataset.state !== 'open'
      || !output.textContent.includes('overview')) {
      throw new Error('A rail parent must expand and reveal its group without selecting a leaf or moving focus.');
    }
    await userEvent.click(overlayToggle);
    await waitFor(() => {
      if (nav.querySelector('.lk-sidenav__panel-content')?.dataset.collapsed !== 'true') {
        throw new Error('Entering overlay mode at runtime must collapse an uncontrolled SideNav.');
      }
    });
    if (!isClosedChildMotion(nav, 'missions')) {
      throw new Error('Collapsed overlay mode must hide expanded child rows.');
    }
    await userEvent.click(overlayToggle);
    await waitForWidth(nav, 252);
    if (nav.querySelector('.lk-sidenav__panel-content')?.dataset.collapsed !== 'false'
      || childMotion(nav, 'missions')?.dataset.state !== 'open') {
      throw new Error('Leaving overlay mode must restore the previous persistent expanded state and open group.');
    }
  },
};

export const ManualActiveGroupExpansion = {
  name: '상호작용 · 활성 표시와 그룹 열림 분리',
  parameters: storyDescription(
    'autoExpandActiveGroup=false이면 활성 자식 값과 부모의 현재 경로 문맥을 유지하면서 disclosure 그룹은 닫힌 상태로 시작합니다. 사용자가 그룹을 열면 그때 활성 자식이 aria-current와 text-safe accent 선택 잉크를 소유합니다.',
  ),
  render: () => <ManualActiveGroupFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="manual-active-group-side-nav"]');
    const parent = nav?.querySelector('[data-sidenav-value="missions"]');
    const hiddenActiveChild = nav?.querySelector('[data-sidenav-parent="missions"][data-state="active"]');
    if (!nav || !parent || parent.getAttribute('aria-expanded') !== 'false'
      || !hiddenActiveChild
      || !isClosedChildMotion(nav, 'missions')) {
      throw new Error('Disabling active-group auto expansion must keep the active disclosure closed initially.');
    }

    await userEvent.click(parent);
    const activeChild = nav.querySelector('[data-sidenav-value="missions-live"]');
    if (parent.getAttribute('aria-expanded') !== 'true'
      || activeChild?.getAttribute('aria-current') !== 'page') {
      throw new Error('Opening the disclosure manually must reveal the preserved active child and aria-current state.');
    }
  },
};

export const SingleOpenGroups = {
  name: '시나리오 · 한 번에 하나만 여는 그룹',
  parameters: storyDescription(
    'With multiple={false}, SideNav keeps the disclosure hierarchy compact: selecting another group or top-level destination closes the previously open group.',
  ),
  render: () => <SingleOpenGroupsFixture />,
  play: async ({ canvasElement }) => {
    const nav = canvasElement.querySelector('[data-testid="single-open-side-nav"]');
    const groups = [...(nav?.querySelectorAll('button[aria-expanded]') ?? [])];
    if (!nav || groups.length < 2) throw new Error('The single-open story must expose at least two disclosure groups.');

    await userEvent.click(groups[0]);
    if (groups[0].getAttribute('aria-expanded') !== 'true') {
      throw new Error('The first disclosure group must open when selected.');
    }
    await userEvent.click(groups[1]);
    if (groups[0].getAttribute('aria-expanded') !== 'false'
      || groups[1].getAttribute('aria-expanded') !== 'true'
      || groups.filter((group) => group.getAttribute('aria-expanded') === 'true').length !== 1) {
      throw new Error('A single-open SideNav accordion must close the previous group before opening the next group.');
    }
    await userEvent.click(nav.querySelector('[data-sidenav-value="overview"]'));
    if (groups.some((group) => group.getAttribute('aria-expanded') === 'true')) {
      throw new Error('Selecting a top-level destination must close the open disclosure group.');
    }
  },
};

export const OverlayKeyboardEntry = {
  name: '상호작용 · 겹침형 키보드 진입과 복귀',
  parameters: storyDescription(
    '포인터 없이 접힌 overlay 레일에 초점이 진입하면 전체 패널이 열리고, 초점 이탈이나 Escape 뒤에는 레일과 지속되는 부모 항목으로 안전하게 돌아갑니다.',
  ),
  render: () => <SideNavFixture />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-testid="overlay-fixture"]');
    const nav = canvasElement.querySelector('nav[aria-label="운영 탐색"]');
    const panel = nav?.firstElementChild;
    const firstControl = nav?.querySelector('.lk-sidenav__scroll [data-sidenav-value]:not(:disabled):not([aria-disabled="true"])');
    if (!fixture || !nav || !panel || !firstControl || Math.round(panel.getBoundingClientRect().width) !== 64) {
      throw new Error('Keyboard entry fixture must start with a focusable collapsed overlay rail.');
    }

    firstControl.focus();
    await waitForWidth(panel, 252);
    if (canvasElement.ownerDocument.activeElement !== firstControl) {
      throw new Error('Focus entry must expand the overlay without moving keyboard focus.');
    }

    const activeChild = Array.from(nav.querySelectorAll('[data-sidenav-parent="missions"]'))
      .find((control) => control.getAttribute('aria-current') === 'page');
    if (!activeChild) throw new Error('Keyboard expansion must expose the active child destination.');
    activeChild.focus();
    activeChild.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForWidth(panel, 64);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (canvasElement.ownerDocument.activeElement?.dataset.sidenavValue !== 'missions'
      || Math.abs(panel.getBoundingClientRect().width - 64) >= 1) {
      throw new Error('Escape must collapse without immediately reopening and restore child focus to its persistent parent.');
    }

    fixture.focus();
    firstControl.focus();
    await waitForWidth(panel, 252);
    fixture.focus();
    await waitForWidth(panel, 64);
    if (nav.contains(canvasElement.ownerDocument.activeElement)) {
      throw new Error('Leaving both pointer and focus must collapse the overlay without stealing focus back.');
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
    const longLabel = longItem?.querySelector('[data-slot="label"]');
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

function SideNavSurfaceRefFixture() {
  const ref = React.useRef(null);
  React.useLayoutEffect(() => {
    ref.current?.setAttribute('data-ref-target', 'side-nav-root');
  }, []);
  return (
    <SideNav
      ref={ref}
      aria-label="계약 탐색"
      items={[
        { value: 'overview', label: '운영 개요' },
        { value: 'events', label: '이벤트', badge: 3 },
      ]}
      defaultValue="overview"
      className="contract-side-nav-root"
      classNames={{ item: 'contract-side-nav-item' }}
      styles={{ label: { letterSpacing: '2px' } }}
      vars={{ '--lds-side-nav-width': '260px', '--lds-side-nav-item-height': '48px' }}
    />
  );
}

export const SurfaceRefContract = {
  name: 'Surface and ref contract',
  tags: ['!dev'],
  render: () => <SideNavSurfaceRefFixture />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('[data-ref-target="side-nav-root"]');
    const items = [...(root?.querySelectorAll('[data-slot="item"]') ?? [])];
    const label = items[0]?.querySelector('[data-slot="label"]');
    if (!(root instanceof HTMLElement) || root.tagName !== 'NAV' || root.dataset.slot !== 'root') {
      throw new Error('SideNav ref must target the native nav landmark.');
    }
    if (!root.classList.contains('contract-side-nav-root') || !items.every((item) => item.classList.contains('contract-side-nav-item'))) {
      throw new Error('SideNav root and named item classes must compose independently.');
    }
    if (root.dataset.state !== 'expanded' || getComputedStyle(root).width !== '260px' || getComputedStyle(items[0]).minHeight !== '48px' || getComputedStyle(label).letterSpacing !== '2px') {
      throw new Error('SideNav state, vars, and named-part styles must reach their documented targets.');
    }
  },
};
