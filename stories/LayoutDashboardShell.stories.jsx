import React from 'react';
import { userEvent } from 'storybook/test';
import {
  BarChart,
  BottomNav,
  Button,
  ChartFrame,
  Container,
  Icon,
  IconButton,
  Lockup,
  MetricCard,
  PageHeader,
  SideNav,
  TopBar,
  UserMenu,
} from '../src/index.js';
import { DashboardGrid } from '../components/layout/DashboardGrid.jsx';
import { DashboardShell } from '../components/layout/DashboardShell.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

// Use when a product needs one persistent contract for brand, primary navigation, utilities, and main content.
// Avoid when the surface is an embedded widget or a page fragment that does not own application-level navigation.

const preventNavigation = (event) => event.preventDefault();

function resolveColor(element, value) {
  const probe = element.ownerDocument.createElement('span');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.position = 'absolute';
  probe.style.pointerEvents = 'none';
  probe.style.opacity = '0';
  probe.style.color = value;
  element.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

async function waitForWidth(element, expectedWidth, timeoutMs = 5000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (Math.abs(element.getBoundingClientRect().width - expectedWidth) < 1) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out waiting for the dashboard SideNav width to become ${expectedWidth}px.`);
}

const wideItems = [
  { heading: '작업 공간' },
  { value: 'overview', label: '운영 현황', href: '#overview', icon: <Icon name="home" size={18} />, onClick: preventNavigation },
  {
    value: 'resources',
    label: '리소스',
    icon: <Icon name="layers" size={18} />,
    children: [
      { value: 'resources-all', label: '전체 리소스', href: '#resources', onClick: preventNavigation },
      { value: 'resources-attention', label: '확인 필요', href: '#attention', onClick: preventNavigation },
    ],
  },
  { value: 'activity', label: '활동 기록', href: '#activity', icon: <Icon name="history" size={18} />, onClick: preventNavigation },
];

const narrowItems = [
  { value: 'overview', label: '현황', href: '#overview', icon: <Icon name="home" size={20} />, onClick: preventNavigation },
  { value: 'resources', label: '전체 리소스와 상태 관리', href: '#resources', icon: <Icon name="layers" size={20} />, onClick: preventNavigation },
  { value: 'activity', label: '기록', href: '#activity', icon: <Icon name="history" size={20} />, onClick: preventNavigation },
];

const chartData = [
  { id: '09', label: '09시', value: 12 },
  { id: '11', label: '11시', value: 18 },
  { id: '13', label: '13시', value: 15 },
  { id: '15', label: '15시', value: 23 },
];

const accountItems = [
  { label: '프로필' },
  { label: '환경 설정' },
  { divider: true },
  { label: '로그아웃' },
];

function ProductIdentity() {
  return (
    <div style={{ display: 'grid', justifyItems: 'start', gap: 'var(--space-2)', width: '100%', minWidth: 0 }}>
      <Lockup variant="inline" height={20} />
      <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 1.1 }}>
        OPERATIONS
      </span>
    </div>
  );
}

function HeaderSlot({ compact = false, branded = false }) {
  const context = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
      {(compact || branded) && <Lockup variant={compact ? 'mark' : 'inline'} height={compact ? 22 : 20} />}
      {(compact || branded) && <span aria-hidden="true" style={{ width: 1, height: 18, flexShrink: 0, background: 'var(--color-semantic-line-solid-normal)' }} />}
      <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label1-size)' }}>
        대덕 운영 워크스페이스
      </strong>
    </div>
  );

  return (
    <TopBar
      height={compact ? 56 : 60}
      brand={context}
      actions={(
        <React.Fragment>
          <IconButton variant="ghost" label="전역 검색" size={36}><Icon name="search" size={18} aria-hidden="true" /></IconButton>
          {!compact && <IconButton variant="ghost" label="알림" size={36}><Icon name="bell" size={18} aria-hidden="true" /></IconButton>}
          {!compact && <Button size="sm" variant="ghost">도움말</Button>}
        </React.Fragment>
      )}
    />
  );
}

function NavigationSlot({ docked = true, branded = true }) {
  return (
    <SideNav
      aria-label="제품 주 탐색"
      surface={docked ? 'docked' : 'floating'}
      items={wideItems}
      defaultValue="overview"
      width={244}
      collapsible
      header={branded ? <ProductIdentity /> : undefined}
      headerCollapsed={branded ? <Lockup variant="mark" height={21} decorative /> : undefined}
      footer={(
        <UserMenu
          name="운영 관리자"
          detail="대덕 워크스페이스"
          items={accountItems}
        />
      )}
      style={{ height: '100%', minHeight: 0 }}
    />
  );
}

function ShellContent({ headingLevel = 1 }) {
  return (
    <Container
      size="wide"
      style={{ display: 'grid', gap: 'var(--space-6)', paddingBlock: 'var(--space-6)', boxSizing: 'border-box' }}
    >
      <PageHeader
        headingLevel={headingLevel}
        eyebrow="Workspace overview"
        title="운영 현황"
        description="현재 상태와 주의가 필요한 항목을 먼저 확인하고, 세부 업무로 이동합니다. 이 콘텐츠는 셸의 위계와 반응형 슬롯을 검증하기 위한 중립 fixture입니다."
        actions={<Button size="sm" variant="outlined"><Icon name="refresh" size={16} aria-hidden="true" />새로고침</Button>}
      />

      <DashboardGrid minCardWidth={190} data-testid="shell-dashboard-grid">
        <MetricCard label="진행 중" value="24" unit="건" period="현재" caption="처리 중인 작업" />
        <MetricCard label="확인 필요" value="3" unit="건" period="현재" caption="사용자 판단이 필요한 항목" />
        <MetricCard label="완료율" value="92" unit="%" period="최근 24시간" baseline="90%" />
      </DashboardGrid>

      <section aria-labelledby="dashboard-analysis-title" style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
        <h2
          id="dashboard-analysis-title"
          style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--heading2-spacing)' }}
        >
          처리 흐름
        </h2>
        <ChartFrame
          title="시간대별 처리량"
          description="대표 정보 표면이 반복 지표보다 한 단계 큰 위계로 읽히는지 확인합니다."
          meta="최근 8시간 · 2분 전 업데이트"
          actions={<Button size="sm" variant="ghost">상세 보기</Button>}
        >
          <BarChart
            aria-label="시간대별 처리량"
            description="09시부터 15시까지 완료된 작업 수를 비교합니다."
            data={chartData}
            height={168}
          />
        </ChartFrame>
      </section>
    </Container>
  );
}

function SideFirstShell({ headingLevel = 1 }) {
  return (
    <DashboardShell
      layout="wide"
      topology="side-first"
      header={<HeaderSlot />}
      navigation={<NavigationSlot />}
      narrowNavigation={<BottomNav items={narrowItems} defaultValue="overview" />}
      style={{ minHeight: 680 }}
    >
      <ShellContent headingLevel={headingLevel} />
    </DashboardShell>
  );
}

const meta = {
  title: 'LDS Product/Operations Dashboard/Dashboard Shell',
  id: 'lds-product-layout-dashboard-shell',
  component: DashboardShell,
  parameters: {
    layout: 'fullscreen',
    storyGuide: {
      storyId: 'lds-product-layout-dashboard-shell--normal-width',
      eyebrow: 'Product / Operations Dashboard / Dashboard Shell',
      title: '브랜드·탐색·전역 도구·본문을 제품 셸의 한 계약으로 조합합니다',
      description:
        'side-first와 header-first 토폴로지, docked 탐색, 건너뛰기 링크, 넓은·좁은 화면 탐색 전환을 검증합니다. 본문 fixture는 제품 화면 템플릿이 아니라 실제 LDS 표면의 간격·위계·overflow를 확인하기 위한 최소 조합입니다.',
    },
    docs: {
      description: {
        component: 'DashboardShell은 landmark·skip link·wide/narrow 탐색 전환과 header-first/side-first 토폴로지를 담당하는 LK Product Extension입니다. 라우팅·데이터·권한·완성 화면은 제품이 소유합니다.',
      },
    },
  },
};

export default meta;

function assertShellContract(canvasElement, { layout, topology }) {
  const shell = canvasElement.querySelector(`[data-layout="${layout}"][data-topology="${topology}"]`);
  const skip = shell?.querySelector('.lk-dashboard-shell__skip');
  const header = shell?.querySelector('.lk-dashboard-shell__header > header');
  const main = shell?.querySelector('main.lk-dashboard-shell__main');
  const wideRegion = shell?.querySelector('.lk-dashboard-shell__navigation');
  const narrowRegion = shell?.querySelector('.lk-dashboard-shell__narrow-navigation');
  if (!shell || !skip || !header || !main || !wideRegion || !narrowRegion) {
    throw new Error('DashboardShell must expose its skip link and header/navigation/main slot regions.');
  }
  if (skip.getAttribute('href') !== `#${main.id}` || main.tabIndex !== -1) {
    throw new Error('The skip link must target the focusable main landmark.');
  }
  const shellCss = shell.querySelector('style')?.textContent || '';
  if (!shellCss.includes('color:var(--color-semantic-label-normal)') || !shellCss.includes('data-topology="side-first"')) {
    throw new Error('The shell must retain its theme-safe skip link and topology rules.');
  }
  const wideVisible = getComputedStyle(wideRegion).display !== 'none';
  const narrowVisible = getComputedStyle(narrowRegion).display !== 'none';
  if ((layout === 'wide' && (!wideVisible || narrowVisible)) || (layout === 'narrow' && (wideVisible || !narrowVisible))) {
    throw new Error('Exactly the navigation region for the selected shell layout must be visible.');
  }
  if (shell.scrollWidth > shell.clientWidth + 1 || main.scrollWidth > main.clientWidth + 1) {
    throw new Error('DashboardShell and its main landmark must not overflow horizontally.');
  }
  return { shell, skip, header, main, wideRegion, narrowRegion };
}

export const NormalWidth = {
  name: '개요',
  parameters: storyDescription(
    '전체 높이의 docked Side Nav가 브랜드와 로컬 목적지를 소유하고, Top Bar가 현재 workspace와 전역 utility를 소유하는 구성입니다. 표면이 떠 있는 카드처럼 보이지 않고 본문 위계와 분리되는지 확인하세요.',
  ),
  render: () => <SideFirstShell headingLevel={2} />,
  play: async ({ canvasElement }) => {
    const { shell, skip, header, main, wideRegion } = assertShellContract(canvasElement, { layout: 'wide', topology: 'side-first' });
    const navigation = wideRegion.querySelector('nav[data-surface="docked"]');
    const current = wideRegion.querySelector('a[aria-current="page"]');
    if (!navigation || !current || current.getAttribute('href') !== '#overview') {
      throw new Error('Side-first shell must use docked native-link navigation.');
    }
    if (getComputedStyle(header.parentElement).gridColumnStart !== '2' || getComputedStyle(wideRegion).gridRowStart !== '1') {
      throw new Error('Side-first must reserve the first full-height grid column for navigation.');
    }
    if (!wideRegion.querySelector('svg[aria-label="LK ROBOTICS"]') || canvasElement.textContent.includes('LK Dashboard')) {
      throw new Error('The representative shell must use the real Lockup instead of a text logo.');
    }
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== skip) {
      throw new Error('The skip link must be the first keyboard destination in the shell.');
    }
    const collapse = navigation.querySelector('button[data-sidenav-collapse-toggle]');
    const expandedNavRect = navigation.getBoundingClientRect();
    const expandedControlRect = collapse?.getBoundingClientRect();
    if (!collapse || collapse.getAttribute('aria-label') !== '사이드바 접기'
      || Math.abs(expandedNavRect.width - 244) >= 1
      || expandedControlRect.right > expandedNavRect.right + 0.5
      || expandedControlRect.left < expandedNavRect.left - 0.5
      || expandedControlRect.right > header.getBoundingClientRect().left + 0.5) {
      throw new Error('The wide dashboard must keep a contained 244px SideNav boundary control outside the header and main regions.');
    }
    await userEvent.click(collapse);
    await waitForWidth(navigation, 64);
    const collapsedNavRect = navigation.getBoundingClientRect();
    const collapsedControlRect = collapse.getBoundingClientRect();
    if (collapse.getAttribute('aria-label') !== '사이드바 펼치기'
      || collapsedControlRect.right > collapsedNavRect.right + 0.5
      || collapsedControlRect.left < collapsedNavRect.left - 0.5
      || Math.abs(collapsedNavRect.right - header.getBoundingClientRect().left) > 1
      || shell.scrollWidth > shell.clientWidth + 1
      || main.scrollWidth > main.clientWidth + 1) {
      throw new Error('Collapsing the dashboard SideNav must reflow the shell to a contained 64px rail without horizontal overflow.');
    }
    await userEvent.click(collapse);
    await waitForWidth(navigation, 244);
    collapse.blur();
  },
};

export const DarkSurface = {
  name: '변형·상태 · 다크 표면',
  parameters: {
    ...storyDescription(
      '같은 side-first 셸을 다크 시맨틱 테마에서 검증합니다. 내비게이션·전역 도구·지표 카드·차트 표면이 라이트 전용 색을 남기지 않고 현재 테마의 표면과 전경을 사용해야 합니다.',
    ),
    backgrounds: { default: 'Dark' },
  },
  render: () => (
    <div
      data-theme="dark"
      className="theme-dark"
      style={{ minHeight: '100vh', background: 'var(--color-semantic-background-normal-normal)', color: 'var(--color-semantic-label-normal)' }}
    >
      <SideFirstShell />
    </div>
  ),
  play: async ({ canvasElement }) => {
    assertShellContract(canvasElement, { layout: 'wide', topology: 'side-first' });
    const themeScope = canvasElement.querySelector('[data-theme="dark"]') || canvasElement.closest('[data-theme="dark"]');
    const metric = canvasElement.querySelector('[data-metric-state]');
    const chart = canvasElement.querySelector('[data-chart-frame-state]');
    if (!themeScope || themeScope.getAttribute('data-theme') !== 'dark' || !metric || !chart) {
      throw new Error('The dark dashboard fixture must render its complete shell and data surfaces inside a dark theme scope.');
    }
    const darkMetricSurface = resolveColor(metric, 'var(--component-card-bg)');
    const darkChartSurface = resolveColor(chart, 'var(--component-card-bg)');
    if (getComputedStyle(metric).backgroundColor !== darkMetricSurface || getComputedStyle(chart).backgroundColor !== darkChartSurface) {
      throw new Error('Dashboard data surfaces must use the active semantic theme instead of retaining a light-only background.');
    }
    const cardBackgroundOverride = 'var(--color-semantic-background-normal-alternative)';
    const cardBorderOverride = 'calc(var(--border-thick) + var(--border-thin)) solid var(--color-semantic-primary-normal)';
    metric.style.setProperty('--component-card-bg', cardBackgroundOverride);
    chart.style.setProperty('--component-card-border', cardBorderOverride);
    const chartOverrideStyle = getComputedStyle(chart);
    const expectedMetricOverride = resolveColor(metric, cardBackgroundOverride);
    const expectedChartBorder = resolveColor(chart, 'var(--color-semantic-primary-normal)');
    if (
      getComputedStyle(metric).backgroundColor !== expectedMetricOverride
      || expectedMetricOverride === darkMetricSurface
      || chart.style.getPropertyValue('--component-card-border').trim() !== cardBorderOverride
      || chartOverrideStyle.borderTopColor !== expectedChartBorder
      || Number.parseFloat(chartOverrideStyle.borderTopWidth) < 2.5
    ) {
      throw new Error('Dashboard data surfaces must preserve public component-card token overrides.');
    }
    metric.style.removeProperty('--component-card-bg');
    chart.style.removeProperty('--component-card-border');
    metric.setAttribute('data-theme', 'light');
    metric.classList.add('theme-light');
    const lightMetricSurface = resolveColor(metric, 'var(--component-card-bg)');
    if (getComputedStyle(metric).backgroundColor !== lightMetricSurface || lightMetricSurface === darkMetricSurface) {
      throw new Error('A light theme island inside a dark dashboard must rebind the component-card surface token.');
    }
    metric.removeAttribute('data-theme');
    metric.classList.remove('theme-light');
  },
};

export const HeaderFirst = {
  name: '변형·상태 · 헤더 우선',
  parameters: storyDescription(
    '전폭 Top Bar가 실제 Lockup과 제품 맥락을 소유하고 docked Side Nav는 로컬 목적지만 제공하는 호환 토폴로지입니다. 같은 브랜드와 목적지가 두 영역에 반복되지 않는지 확인하세요.',
  ),
  render: () => (
    <DashboardShell
      layout="wide"
      topology="header-first"
      header={<HeaderSlot branded />}
      navigation={<NavigationSlot branded={false} />}
      narrowNavigation={<BottomNav items={narrowItems} defaultValue="overview" />}
      style={{ minHeight: 620 }}
    >
      <ShellContent />
    </DashboardShell>
  ),
  play: async ({ canvasElement }) => {
    const { header, wideRegion } = assertShellContract(canvasElement, { layout: 'wide', topology: 'header-first' });
    if (getComputedStyle(header.parentElement).gridColumnStart !== '1' || getComputedStyle(header.parentElement).gridColumnEnd !== '-1') {
      throw new Error('Header-first must keep its header across the complete shell width.');
    }
    if (wideRegion.querySelector('svg[aria-label="LK ROBOTICS"]')) {
      throw new Error('Header-first local navigation must not duplicate the TopBar Lockup.');
    }
  },
};

export const Narrow320 = {
  name: '반응형 · 320px 하단 탐색',
  parameters: storyDescription(
    '320px에서 side-first 셸이 단일 열 Top Bar·main·Bottom Nav로 수렴합니다. 좁은 화면에서는 Top Bar가 compact Lockup을 회수하고 긴 탐색 문구와 실제 데이터 표면이 가로 overflow를 만들지 않는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 320, maxWidth: '100%', margin: '0 auto' }}>
      <DashboardShell
        layout="narrow"
        topology="side-first"
        header={<HeaderSlot compact />}
        navigation={<NavigationSlot />}
        narrowNavigation={<BottomNav items={narrowItems} defaultValue="overview" />}
        style={{ minHeight: 760 }}
      >
        <ShellContent />
      </DashboardShell>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const { shell, header, wideRegion, narrowRegion } = assertShellContract(canvasElement, { layout: 'narrow', topology: 'side-first' });
    if (Math.round(shell.getBoundingClientRect().width) !== 320 || getComputedStyle(header.parentElement).gridColumnStart !== '1') {
      throw new Error('The narrow topology contract must render as a 320px single-column shell.');
    }
    const links = narrowRegion.querySelectorAll('a[href]');
    const longLabel = Array.from(narrowRegion.querySelectorAll('span')).find((node) => node.textContent === '전체 리소스와 상태 관리');
    if (links.length !== narrowItems.length || !longLabel || getComputedStyle(longLabel).textOverflow !== 'ellipsis' || longLabel.scrollWidth <= longLabel.clientWidth) {
      throw new Error('Narrow navigation must keep native links and truncate a stressed long label.');
    }
    if (getComputedStyle(narrowRegion).position !== 'sticky' || shell.scrollWidth > shell.clientWidth + 1) {
      throw new Error('Narrow navigation must remain sticky without creating page overflow.');
    }
    if (getComputedStyle(wideRegion).display !== 'none' || narrowRegion.querySelector('[data-sidenav-collapse-toggle]')) {
      throw new Error('The narrow navigation surface must not expose the desktop SideNav collapse control.');
    }
  },
};

export const AutoNavigationFallback = {
  name: '반응형 · 좁은 화면의 대체 탐색',
  parameters: storyDescription(
    '별도 narrowNavigation을 제공하지 않은 자동 header-first 상황입니다. 좁은 상태에서도 기존 탐색이 사라지지 않고 본문 앞의 사용 가능한 fallback으로 남는지 확인하세요.',
  ),
  render: () => (
    <DashboardShell
      header={<HeaderSlot branded />}
      navigation={<NavigationSlot branded={false} />}
      style={{ minHeight: 520 }}
    >
      <ShellContent />
    </DashboardShell>
  ),
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('[data-layout="auto"][data-topology="header-first"]');
    const navigation = shell?.querySelector('.lk-dashboard-shell__navigation');
    if (!shell || !navigation || shell.getAttribute('data-has-narrow-navigation') !== 'false') {
      throw new Error('Auto layout must declare and retain its wide-navigation fallback when narrowNavigation is omitted.');
    }
    const inspectAtViewport = async (width) => {
      const frame = canvasElement.ownerDocument.createElement('iframe');
      frame.title = `${width}px auto-layout contract fixture`;
      Object.assign(frame.style, {
        position: 'fixed',
        inset: '0 auto auto 0',
        width: `${width}px`,
        height: '360px',
        border: '0',
        visibility: 'hidden',
        pointerEvents: 'none',
      });
      canvasElement.ownerDocument.body.appendChild(frame);

      const frameDocument = frame.contentDocument;
      const fixtureShell = shell.cloneNode(true);
      frameDocument.body.appendChild(fixtureShell);
      await new Promise((resolve) => frame.contentWindow.requestAnimationFrame(
        () => frame.contentWindow.requestAnimationFrame(() => resolve()),
      ));

      const fixtureNavigation = fixtureShell.querySelector('.lk-dashboard-shell__navigation');
      const fixtureMain = fixtureShell.querySelector('.lk-dashboard-shell__main');
      if (!fixtureNavigation || !fixtureMain) {
        frame.remove();
        throw new Error(`Could not render the ${width}px auto-layout contract fixture.`);
      }
      const frameStyles = frame.contentWindow.getComputedStyle.bind(frame.contentWindow);
      const result = {
        viewportWidth: frameDocument.documentElement.clientWidth,
        navigationColumn: frameStyles(fixtureNavigation).gridColumnStart,
        navigationRow: frameStyles(fixtureNavigation).gridRowStart,
        mainColumn: frameStyles(fixtureMain).gridColumnStart,
        mainRow: frameStyles(fixtureMain).gridRowStart,
        layout: fixtureShell.dataset.layout,
      };
      frame.remove();
      return result;
    };

    const narrow = await inspectAtViewport(767);
    const wide = await inspectAtViewport(768);
    if (narrow.viewportWidth !== 767
      || narrow.layout !== 'auto'
      || narrow.navigationColumn !== '1'
      || narrow.navigationRow !== '2'
      || narrow.mainColumn !== '1'
      || narrow.mainRow !== '3') {
      throw new Error('At 767px, auto layout must retain fallback navigation before the main region.');
    }
    if (wide.viewportWidth !== 768
      || wide.layout !== 'auto'
      || wide.navigationColumn !== '1'
      || wide.navigationRow !== '2'
      || wide.mainColumn !== '2'
      || wide.mainRow !== '2') {
      throw new Error('At 768px, auto layout must restore the two-column header-first contract.');
    }
  },
};
