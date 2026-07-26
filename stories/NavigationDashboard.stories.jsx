import React from 'react';
import { userEvent } from 'storybook/test';
import { BottomNav, Icon, IconButton, Lockup, SideNav, TopBar } from '../src/index.js';
import { DashboardShell } from '../components/layout/DashboardShell.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

// Use when choosing how a dashboard shell composes its primary navigation: fixed panel, hover peek rail, or opt-in collapse.
// Avoid when the surface is not an application shell; single navigation components own their behavior on their component pages.

const preventNavigation = (event) => event.preventDefault();

async function waitForWidth(element, expectedWidth, timeoutMs = 5000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (Math.abs(element.getBoundingClientRect().width - expectedWidth) < 1) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out waiting for the dashboard navigation width to become ${expectedWidth}px.`);
}

const destinations = [
  { heading: '작업 공간' },
  { value: 'overview', label: '운영 현황', href: '#overview', icon: <Icon name="home" size={18} />, onClick: preventNavigation },
  { value: 'resources', label: '리소스', href: '#resources', icon: <Icon name="layers" size={18} />, onClick: preventNavigation },
  { value: 'activity', label: '활동 기록', href: '#activity', icon: <Icon name="history" size={18} />, onClick: preventNavigation },
];

const narrowDestinations = [
  { value: 'overview', label: '현황', href: '#overview', icon: <Icon name="home" size={20} />, onClick: preventNavigation },
  { value: 'resources', label: '리소스', href: '#resources', icon: <Icon name="layers" size={20} />, onClick: preventNavigation },
  { value: 'activity', label: '기록', href: '#activity', icon: <Icon name="history" size={20} />, onClick: preventNavigation },
];

const DASHBOARD_NAVIGATION_BREAKPOINTS = {
  narrow: 768,
  full: 992,
};

function BrandIdentity() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 'var(--space-2)', width: '100%', minWidth: 0 }}>
      <Lockup variant="inline" height={20} />
      <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 1.1 }}>
        OPERATIONS
      </span>
    </div>
  );
}

function HeaderFixture() {
  return (
    <TopBar
      height={60}
      brand={(
        <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label1-size)' }}>
          대덕 운영 워크스페이스
        </strong>
      )}
      actions={(
        <React.Fragment>
          <IconButton variant="plain" label="전역 검색" size={36}><Icon name="search" size={18} aria-hidden="true" /></IconButton>
          <IconButton variant="plain" label="도움말" size={36}><Icon name="circle-question" size={18} aria-hidden="true" /></IconButton>
        </React.Fragment>
      )}
    />
  );
}

function NavigationFixture({ overlay = false }) {
  return (
    <SideNav
      aria-label="제품 주 탐색"
      surface="docked"
      items={destinations}
      defaultValue="overview"
      width={244}
      overlay={overlay}
      collapsedWidth={overlay ? 64 : undefined}
      header={<BrandIdentity />}
      headerCollapsed={<Lockup variant="mark" height={21} decorative />}
      style={{ height: '100%', minHeight: 0 }}
    />
  );
}

function ContentPlaceholder() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)', padding: 'var(--space-6)', boxSizing: 'border-box' }}>
      {['본문 표면 A', '본문 표면 B'].map((label) => (
        <div
          key={label}
          style={{
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px dashed var(--color-semantic-line-solid-normal)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-semantic-label-alternative)',
            fontSize: 'var(--label1-size)',
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}

function DashboardNavigationFixture({ overlay = false, layout = 'wide', withBottomNav = false }) {
  return (
    <DashboardShell
      layout={layout}
      topology="side-first"
      header={<HeaderFixture />}
      navigation={<NavigationFixture overlay={overlay} />}
      narrowNavigation={withBottomNav ? <BottomNav items={narrowDestinations} defaultValue="overview" /> : undefined}
      style={{ minHeight: 560 }}
    >
      <ContentPlaceholder />
    </DashboardShell>
  );
}

function AdaptiveDashboardNavigationFixture() {
  const containerRef = React.useRef(null);
  const [mode, setMode] = React.useState('wide');

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const updateMode = () => {
      const width = container.getBoundingClientRect().width;
      let nextMode = 'wide';
      if (width < DASHBOARD_NAVIGATION_BREAKPOINTS.narrow) nextMode = 'narrow';
      else if (width < DASHBOARD_NAVIGATION_BREAKPOINTS.full) nextMode = 'rail';
      setMode((currentMode) => (currentMode === nextMode ? currentMode : nextMode));
    };

    updateMode();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateMode);
    observer?.observe(container);
    window.addEventListener('resize', updateMode);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateMode);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-dashboard-navigation-mode={mode}
      style={{ width: '100%', minWidth: 0 }}
    >
      <DashboardNavigationFixture
        key={mode}
        layout={mode === 'narrow' ? 'narrow' : 'wide'}
        overlay={mode === 'rail'}
        withBottomNav={mode === 'narrow'}
      />
    </div>
  );
}

const meta = {
  title: 'LDS Product/Navigation/Dashboard Navigation',
  tags: ['autodocs'],
  id: 'lds-product-navigation-dashboard-navigation',
  component: DashboardShell,
  parameters: {
    layout: 'fullscreen',
    storyGuide: {
      storyId: 'lds-product-navigation-dashboard-navigation--overview',
      eyebrow: 'Product / Navigation / Dashboard Navigation',
      title: '대시보드의 주 탐색은 화면 폭과 목적지 깊이에 맞춥니다',
      description:
        '탐색 전환이 잦고 본문 최소 폭이 남는 넓은 화면에서는 고정 폭 사이드 탐색을 사용합니다. 가용 폭이 줄면 호버 확장 레일로 본문 폭을 돌려주고, 좁은 화면에서는 같은 최상위 목적지를 하단 탐색으로 전환합니다. 셸 전체는 Dashboard Shell, 개별 동작은 각 탐색 컴포넌트가 소유합니다.',
    },
    docs: {
      description: {
        component: '대시보드 셸에서 주 탐색을 어떻게 구성할지 결정하는 안내 페이지입니다. 본문 최소 폭이 확보되면 고정 폭 사이드 탐색을, 중간 폭에서는 호버 확장 레일을, 좁은 화면에서는 하단 탐색을 사용합니다. 사용자가 직접 폭을 회수해야 하는 제품에는 상단 바 접기 토글을 선택할 수 있습니다. 개별 탐색 부품의 상세 동작은 사이드 탐색·상단 바·적응형 탐색 페이지를 참조하세요.',
      },
    },
  },
};

export default meta;

export const Overview = {
  name: '개요',
  parameters: storyDescription(
    '가용 폭을 직접 측정하는 대표 구성입니다. 992px 이상에서는 244px 고정 Side Nav, 768–991px에서는 64px 호버 확장 레일, 768px 미만에서는 Bottom Nav로 전환합니다. 본문은 탐색 결정을 검증하기 위한 중립 placeholder입니다.',
  ),
  render: () => <AdaptiveDashboardNavigationFixture />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-dashboard-navigation-mode]');
    const shell = fixture?.querySelector('[data-topology="side-first"]');
    const wideRegion = shell?.querySelector('.lk-dashboard-shell__navigation');
    const narrowRegion = shell?.querySelector('.lk-dashboard-shell__narrow-navigation');
    const navigation = wideRegion?.querySelector('nav[data-surface="docked"]');
    const current = shell?.querySelector('a[aria-current="page"]');
    const mode = fixture?.getAttribute('data-dashboard-navigation-mode');
    if (!fixture || !shell || !wideRegion || !current || !['wide', 'rail', 'narrow'].includes(mode)) {
      throw new Error('The representative dashboard navigation must resolve an adaptive mode with a current native link.');
    }
    if (mode === 'wide' && (!navigation
      || navigation.querySelector('button[data-sidenav-collapse-toggle]')
      || Math.abs(navigation.getBoundingClientRect().width - 244) >= 1)) {
      throw new Error('The wide dashboard navigation must keep a fixed 244px panel without a collapse control.');
    }
    if (mode === 'rail') {
      if (!navigation
        || navigation.classList.contains('lk-sidenav__surface')
        || Math.abs(navigation.getBoundingClientRect().width - 64) >= 1) {
        throw new Error('The medium dashboard navigation must reserve only a 64px hover-expandable rail.');
      }
    }
    if (mode === 'narrow' && (!narrowRegion
      || getComputedStyle(wideRegion).display !== 'none'
      || getComputedStyle(narrowRegion).display === 'none'
      || narrowRegion.querySelectorAll('a[href]').length !== narrowDestinations.length)) {
      throw new Error('The narrow dashboard navigation must replace the side panel with the bottom destinations.');
    }
    if (shell.scrollWidth > shell.clientWidth + 1) {
      throw new Error('Adaptive dashboard navigation must not create horizontal overflow.');
    }
  },
};

export const OverlayPeekRail = {
  name: '변형·상태 · 호버 확장 레일',
  parameters: storyDescription(
    '공간이 제한된 데스크톱을 위한 선택 구성입니다. 탐색이 64px 아이콘 레일 폭으로 고정되고, 호버·키보드 초점에서만 전체 패널이 본문과 헤더 위로 떠서 데이터 표면에 폭을 돌려줍니다. 펼침이 본문을 밀어내지 않고 이탈 시 레일로 복귀하는지 확인하세요.',
  ),
  render: () => <DashboardNavigationFixture overlay />,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('[data-layout="wide"][data-topology="side-first"]');
    const main = shell?.querySelector('main.lk-dashboard-shell__main');
    const navigation = shell?.querySelector('.lk-dashboard-shell__navigation nav');
    const surface = navigation?.firstElementChild;
    if (!shell || !main || !navigation || !surface || navigation.querySelector('button[data-sidenav-collapse-toggle]')) {
      throw new Error('The overlay peek navigation must reserve a rail without a persistent collapse control.');
    }
    await waitForWidth(surface, 64);
    if (Math.round(navigation.getBoundingClientRect().width) !== 64) {
      throw new Error('The overlay peek rail must reserve a fixed 64px navigation column.');
    }
    const railItems = Array.from(navigation.querySelectorAll('[data-sidenav-value]'));
    if (!railItems.length
      || railItems.some((item) => item.hasAttribute('aria-describedby'))
      || navigation.querySelector('[role="tooltip"]')) {
      throw new Error('Overlay peek items must expand the rail instead of exposing competing tooltip labels.');
    }
    const mainLeftBefore = Math.round(main.getBoundingClientRect().left);
    navigation.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, relatedTarget: canvasElement.ownerDocument.body }));
    await waitForWidth(surface, 244);
    if (Math.round(navigation.getBoundingClientRect().width) !== 64
      || Math.round(main.getBoundingClientRect().left) !== mainLeftBefore) {
      throw new Error('Overlay peek expansion must float over content without reflowing the main landmark.');
    }
    const headerElement = canvasElement.querySelector('.lk-dashboard-shell__header header');
    const headerRect = headerElement.getBoundingClientRect();
    const overlapProbe = canvasElement.ownerDocument.elementFromPoint(
      Math.round(surface.getBoundingClientRect().right - 20),
      Math.round(headerRect.top + headerRect.height / 2),
    );
    if (!overlapProbe || !surface.contains(overlapProbe)) {
      throw new Error('The expanded overlay panel must stack above the shell header instead of sliding underneath it.');
    }
    navigation.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true, relatedTarget: canvasElement.ownerDocument.body }));
    await waitForWidth(surface, 64);
  },
};

function TopBarToggleFixture() {
  const [collapsed, setCollapsed] = React.useState(false);
  return (
    <DashboardShell
      layout="wide"
      topology="side-first"
      header={(
        <TopBar
          height={60}
          brand={(
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
              <IconButton
                data-testid="topbar-collapse-toggle"
                variant="plain"
                size={36}
                label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
                title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
                aria-expanded={!collapsed}
                aria-controls="dashboard-primary-navigation"
                onClick={() => setCollapsed((value) => !value)}
                style={{ marginInlineStart: -8 }}
              >
                <Icon name="left-side" size={18} aria-hidden="true" style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} />
              </IconButton>
              <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label1-size)' }}>
                대덕 운영 워크스페이스
              </strong>
            </div>
          )}
          actions={(
            <React.Fragment>
              <IconButton variant="plain" label="전역 검색" size={36}><Icon name="search" size={18} aria-hidden="true" /></IconButton>
              <IconButton variant="plain" label="도움말" size={36}><Icon name="circle-question" size={18} aria-hidden="true" /></IconButton>
            </React.Fragment>
          )}
        />
      )}
      navigation={(
        <SideNav
          id="dashboard-primary-navigation"
          aria-label="제품 주 탐색"
          surface="docked"
          items={destinations}
          defaultValue="overview"
          width={244}
          collapsedWidth={64}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          header={<BrandIdentity />}
          headerCollapsed={<Lockup variant="mark" height={21} decorative />}
          style={{ height: '100%', minHeight: 0 }}
        />
      )}
      style={{ minHeight: 560 }}
    >
      <ContentPlaceholder />
    </DashboardShell>
  );
}

export const TopBarToggle = {
  name: '변형·상태 · 탑바 접기 토글',
  parameters: storyDescription(
    '명시적 접기가 필요할 때의 선택 구성입니다. 접기 토글은 사이드 패널 밖, 본문 상단 바의 시작 부분(워크스페이스 제목 앞)에 두고, 사이드 탐색은 브랜드를 유지한 채 제어 프롭으로만 접힘 상태를 따릅니다. 접힌 뒤에도 토글이 레일 바로 옆 상단 바에 남아 복귀 수단이 사라지지 않아야 합니다.',
  ),
  render: () => <TopBarToggleFixture />,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('[data-layout="wide"][data-topology="side-first"]');
    const headerRegion = shell?.querySelector('.lk-dashboard-shell__header');
    const navigation = shell?.querySelector('.lk-dashboard-shell__navigation nav');
    const toggle = headerRegion?.querySelector('[data-testid="topbar-collapse-toggle"]');
    if (!shell || !navigation || !toggle) {
      throw new Error('The top bar toggle composition must render the toggle inside the header region.');
    }
    if (navigation.querySelector('button[data-sidenav-collapse-toggle]')
      || navigation.contains(toggle)
      || toggle.getAttribute('aria-label') !== '사이드바 접기') {
      throw new Error('The collapse toggle must live in the top bar, never inside the side panel.');
    }
    if (!navigation.id || toggle.getAttribute('aria-controls') !== navigation.id) {
      throw new Error('The top bar toggle must reference the SideNav panel it controls through aria-controls.');
    }
    await waitForWidth(navigation, 244);
    await userEvent.click(toggle);
    await waitForWidth(navigation, 64);
    if (toggle.getAttribute('aria-label') !== '사이드바 펼치기'
      || Math.abs(toggle.getBoundingClientRect().left - navigation.getBoundingClientRect().right) > 40
      || shell.scrollWidth > shell.clientWidth + 1) {
      throw new Error('Collapsing from the top bar must keep the toggle beside the rail without horizontal overflow.');
    }
    await userEvent.click(toggle);
    await waitForWidth(navigation, 244);
    if (toggle.getAttribute('aria-label') !== '사이드바 접기') {
      throw new Error('Expanding from the top bar must restore the toggle label and the full panel.');
    }
    await userEvent.click(toggle);
    await waitForWidth(navigation, 64);
    toggle.blur();
  },
};

export const Narrow320 = {
  name: '반응형 · 320px 전환 결정',
  parameters: storyDescription(
    '좁은 화면에서 대시보드 주 탐색은 사이드 패널을 유지하지 않고 하단 탐색으로 전환합니다. 고정·호버 레일·접기 중 무엇을 골랐든 320px에서는 같은 결정으로 수렴하는지, 사이드 탐색과 접기 컨트롤이 남지 않는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 320, maxWidth: '100%', margin: '0 auto' }}>
      <DashboardNavigationFixture
        layout="narrow"
        withBottomNav
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('[data-layout="narrow"][data-topology="side-first"]');
    const wideRegion = shell?.querySelector('.lk-dashboard-shell__navigation');
    const narrowRegion = shell?.querySelector('.lk-dashboard-shell__narrow-navigation');
    if (!shell || !wideRegion || !narrowRegion) {
      throw new Error('The narrow dashboard navigation decision must render the shell with both navigation regions declared.');
    }
    if (getComputedStyle(wideRegion).display !== 'none' || getComputedStyle(narrowRegion).display === 'none') {
      throw new Error('At 320px the side panel must yield to the bottom navigation surface.');
    }
    if (narrowRegion.querySelectorAll('a[href]').length !== narrowDestinations.length
      || narrowRegion.querySelector('button[data-sidenav-collapse-toggle]')) {
      throw new Error('The narrow navigation must keep native links without inheriting the desktop collapse control.');
    }
    if (shell.scrollWidth > shell.clientWidth + 1) {
      throw new Error('The 320px dashboard navigation must not create horizontal overflow.');
    }
  },
};
