import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
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
  NavRail,
  PageHeader,
  RefreshControl,
  SideNav,
  TopBar,
  UserMenu,
} from '../src/index.js';
import { DashboardGrid } from '../components/layout/DashboardGrid.jsx';
import { DashboardShell } from '../components/layout/DashboardShell.jsx';
import { QuestionPanel, RailAccount, RailLogo, railAreas, railAreasMax } from './RailPanel.shared.jsx';
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
      <Lockup variant="inline" adaptive height={20} />
      <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 1.1 }}>
        OPERATIONS
      </span>
    </div>
  );
}

function HeaderSlot({ compact = false, branded = false }) {
  const context = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
      {(compact || branded) && <Lockup variant={compact ? 'mark' : 'inline'} adaptive height={compact ? 22 : 20} />}
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
          <IconButton variant="plain" label="전역 검색" size={36}><Icon name="search" size={18} aria-hidden="true" /></IconButton>
          {!compact && <IconButton variant="plain" label="알림" size={36}><Icon name="bell" size={18} aria-hidden="true" /></IconButton>}
          {!compact && <IconButton variant="plain" label="도움말" size={36}><Icon name="circle-question" size={18} aria-hidden="true" /></IconButton>}
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
      header={branded ? <ProductIdentity /> : undefined}
      headerCollapsed={branded ? <Lockup variant="mark" adaptive height={21} decorative /> : undefined}
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
        eyebrow="워크스페이스 개요"
        title="운영 현황"
        description="현재 상태와 주의가 필요한 항목을 먼저 확인하고, 세부 업무로 이동합니다. 이 콘텐츠는 셸의 위계와 반응형 슬롯을 검증하기 위한 중립 fixture입니다."
        actions={<RefreshControl lastUpdated="오늘 14:32" onRefresh={() => {}} />}
      />

      <DashboardGrid minCardWidth={190} fillLastRow data-testid="shell-dashboard-grid">
        <MetricCard label="진행 중" value="24" unit="건" delta={9.1} changeTone="neutral" period="현재" baseline="어제" caption="처리 중인 작업" />
        <MetricCard label="확인 필요" value="3" unit="건" delta={-25} changeTone="positive" period="현재" baseline="어제" caption="사용자 판단이 필요한 항목" />
        <MetricCard label="완료율" value="92" unit="%" delta={2.2} changeTone="positive" period="최근 24시간" baseline="90%" />
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

function TemporaryNavigationShell() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('overview');
  const triggerRef = React.useRef(null);
  const panelId = 'temporary-navigation-panel';
  const mainId = 'temporary-navigation-main';

  const selectDestination = (nextValue) => {
    setValue(nextValue);
    setOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.getElementById(mainId)?.focus({ preventScroll: true });
    }));
  };

  const header = (
    <TopBar
      height={56}
      brand={<Lockup variant="mark" adaptive height={22} />}
      actions={(
        <IconButton
          ref={triggerRef}
          data-testid="temporary-navigation-trigger"
          variant="plain"
          size={36}
          label="주 탐색 열기"
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" size={18} aria-hidden="true" />
        </IconButton>
      )}
    />
  );

  return (
    <DashboardShell
      data-testid="temporary-navigation-shell"
      data-selected-destination={value}
      layout="narrow"
      topology="side-first"
      header={header}
      navigation={<NavigationSlot />}
      temporaryNavigation={(
        <SideNav
          aria-label="좁은 화면 주 탐색"
          items={wideItems}
          value={value}
          onChange={selectDestination}
          surface="docked"
          width="100%"
          header={<ProductIdentity />}
          style={{ height: '100%', minHeight: 0 }}
        />
      )}
      temporaryNavigationOpen={open}
      onTemporaryNavigationClose={() => setOpen(false)}
      temporaryNavigationId={panelId}
      temporaryNavigationTitle="주 탐색"
      temporaryNavigationAppearance="brand"
      temporaryNavigationCloseButtonVariant="plain"
      temporaryNavigationReturnFocusRef={triggerRef}
      mainId={mainId}
      style={{ minHeight: 720 }}
    >
      <ShellContent />
    </DashboardShell>
  );
}

const meta = {
  title: 'LDS Product/Operations Dashboard/Dashboard Shell',
  tags: ['autodocs'],
  id: 'lds-product-layout-dashboard-shell',
  component: DashboardShell,
  parameters: {
    layout: 'fullscreen',
    storyGuide: {
      storyId: 'lds-product-layout-dashboard-shell--normal-width',
      canonicalGuide: 'product-navigation-dashboard-navigation',
      guideDeltaFields: 'purpose',
      eyebrow: 'Product / Operations Dashboard / Dashboard Shell',
      title: '브랜드·탐색·전역 도구·본문을 제품 셸의 한 계약으로 조합합니다',
      description:
        'side-first와 header-first 토폴로지, docked 탐색, 건너뛰기 링크, 넓은·좁은 화면 탐색 전환을 검증합니다. 본문 fixture는 제품 화면 템플릿이 아니라 실제 LDS 표면의 간격·위계·overflow를 확인하기 위한 최소 조합입니다. 주 탐색 구성(고정·호버 확장 레일·접기)의 선택 기준은 Navigation의 Dashboard Navigation 페이지를 참조하세요.',
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
    '전체 높이의 고정 docked Side Nav가 브랜드와 로컬 목적지를 소유하고, Top Bar가 현재 workspace와 전역 utility를 소유하는 구성입니다. 목적지가 얕은 대시보드는 접기 컨트롤 없이 안정된 244px 탐색 폭을 유지하고, 표면이 떠 있는 카드처럼 보이지 않고 본문 위계와 분리되는지 확인하세요.',
  ),
  render: () => <SideFirstShell headingLevel={2} />,
  play: async ({ canvasElement }) => {
    const { skip, header, wideRegion } = assertShellContract(canvasElement, { layout: 'wide', topology: 'side-first' });
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
    const navRect = navigation.getBoundingClientRect();
    if (navigation.querySelector('button[data-sidenav-collapse-toggle]')
      || Math.abs(navRect.width - 244) >= 1
      || navRect.right > header.getBoundingClientRect().left + 0.5) {
      throw new Error('The representative shallow-navigation dashboard must keep a fixed 244px SideNav without a collapse control.');
    }
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

export const TemporaryNavigation = {
  name: '반응형 · 계층형 임시 탐색',
  parameters: storyDescription(
    '목적지가 많은 좁은 화면에서 SideNav를 modal Drawer로 전환합니다. 제품이 trigger·open state·route selection을 소유하고, DashboardShell은 스크림·focus containment·Escape·초점 복원·body scroll lock·배경 inert를 기존 Drawer 엔진으로 제공합니다.',
  ),
  render: () => <TemporaryNavigationShell />,
  play: async ({ canvasElement }) => {
    const shell = canvasElement.querySelector('[data-testid="temporary-navigation-shell"]');
    const trigger = canvasElement.querySelector('[data-testid="temporary-navigation-trigger"]');
    const headerRegion = shell?.querySelector('.lk-dashboard-shell__header');
    const wideRegion = shell?.querySelector('.lk-dashboard-shell__navigation');
    const main = shell?.querySelector('main');
    if (!shell || !trigger || !headerRegion || !wideRegion || !main
      || shell.dataset.hasTemporaryNavigation !== 'true'
      || getComputedStyle(wideRegion).display !== 'none') {
      throw new Error('A narrow temporary-navigation shell must hide the persistent navigation without stacking it before main.');
    }

    await userEvent.click(trigger);
    const dialog = canvasElement.ownerDocument.querySelector('#temporary-navigation-panel[role="dialog"]');
    if (!dialog || dialog.getAttribute('aria-modal') !== 'true'
      || trigger.getAttribute('aria-controls') !== dialog.id
      || trigger.getAttribute('aria-expanded') !== 'true'
      || !headerRegion.hasAttribute('inert')
      || !wideRegion.hasAttribute('inert')
      || !main.hasAttribute('inert')) {
      throw new Error('Opening temporary navigation must expose a named modal Drawer and inert every shell background region.');
    }
    const close = dialog.querySelector('button[aria-label="탐색 닫기"]');
    if (!close?.classList.contains('lk-iconbtn--plain')
      || getComputedStyle(close).backgroundColor !== 'rgba(0, 0, 0, 0)'
      || getComputedStyle(close).borderTopColor !== 'rgba(0, 0, 0, 0)') {
      throw new Error('Temporary navigation must forward the minimal plain close control to the brand Drawer.');
    }

    await userEvent.keyboard('{Escape}');
    // Drawer stays mounted through its slide-out transition, so wait for the
    // unmount instead of asserting on the next frame.
    await waitFor(() => {
      if (canvasElement.ownerDocument.querySelector('#temporary-navigation-panel')
        || canvasElement.ownerDocument.activeElement !== trigger
        || trigger.getAttribute('aria-expanded') !== 'false') {
        throw new Error('Escape must close temporary navigation and restore focus to its persistent trigger.');
      }
    });

    await userEvent.click(trigger);
    const activity = canvasElement.ownerDocument.querySelector('#temporary-navigation-panel [data-sidenav-value="activity"]');
    if (!activity) throw new Error('The temporary Drawer must preserve the hierarchical SideNav destinations.');
    await userEvent.click(activity);
    await waitFor(() => {
      if (shell.dataset.selectedDestination !== 'activity'
        || canvasElement.ownerDocument.querySelector('#temporary-navigation-panel')
        || canvasElement.ownerDocument.activeElement !== main) {
        throw new Error('Selecting a temporary destination must close the Drawer while the product moves focus to main.');
      }
    });
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

/* ---- topology="rail-panel" --------------------------------------------- */

function RailPanelHeader({ panelOpen, onTogglePanel, toggleRef, panelId, narrow = false, onOpenDrawer, drawerTriggerRef, drawerId, drawerOpen }) {
  return (
    <TopBar
      height={56}
      brand={(
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
          {narrow ? (
            <IconButton
              ref={drawerTriggerRef}
              data-testid="rail-panel-drawer-trigger"
              variant="plain"
              size={36}
              label="주 탐색 열기"
              aria-controls={drawerId}
              aria-expanded={drawerOpen}
              onClick={onOpenDrawer}
            >
              <Icon name="menu" size={18} aria-hidden="true" />
            </IconButton>
          ) : onTogglePanel ? (
            <IconButton
              ref={toggleRef}
              data-testid="rail-panel-toggle"
              variant="plain"
              size={36}
              label={panelOpen ? '패널 접기' : '패널 펼치기'}
              aria-controls={panelId}
              aria-expanded={panelOpen}
              onClick={onTogglePanel}
            >
              <Icon name="menu" size={18} aria-hidden="true" />
            </IconButton>
          ) : null}
          <strong style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 'var(--label1-size)' }}>장비 점검 로그의 이상 징후 요약</strong>
        </div>
      )}
    />
  );
}

function RailPanelBody() {
  return (
    <Container size="wide">
      <div style={{ display: 'grid', gap: 'var(--space-4)', padding: 'var(--space-6) 0' }}>
        <PageHeader title="장비 점검 로그의 이상 징후 요약" description="본문은 main 안에서만 스크롤됩니다. 레일과 패널은 화면 높이에 고정됩니다." />
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index} style={{ margin: 0, color: 'var(--color-semantic-label-normal)', fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)' }}>
            {index + 1}. 점검 로그에서 반복되는 경고 패턴과 다음 행동을 정리한 응답 문단입니다.
          </p>
        ))}
      </div>
    </Container>
  );
}

function RailPanelShell({
  testId,
  items = railAreas,
  area = 'ask',
  withPanel = true,
  defaultPanelOpen = true,
  panelMode = 'auto',
  layout = 'wide',
  height = 640,
  theme,
}) {
  const [panelOpen, setPanelOpen] = React.useState(defaultPanelOpen);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleRef = React.useRef(null);
  const drawerTriggerRef = React.useRef(null);
  const panelId = `${testId}-panel`;
  const drawerId = `${testId}-drawer`;
  const narrow = layout === 'narrow';
  return (
    <div data-theme={theme} style={{ background: 'var(--color-semantic-background-normal-normal)' }}>
      <DashboardShell
        data-testid={testId}
        topology="rail-panel"
        layout={layout}
        panelMode={panelMode}
        header={(
          <RailPanelHeader
            panelOpen={panelOpen}
            onTogglePanel={withPanel ? () => setPanelOpen((open) => !open) : undefined}
            toggleRef={toggleRef}
            panelId={panelId}
            narrow={narrow}
            onOpenDrawer={() => setDrawerOpen(true)}
            drawerTriggerRef={drawerTriggerRef}
            drawerId={drawerId}
            drawerOpen={drawerOpen}
          />
        )}
        navigation={(
          <NavRail
            aria-label="주요 영역"
            surface="docked"
            appearance="neutral"
            items={items}
            value={area}
            getItemCurrent={(item, { active }) => (active ? (item.value === 'ask' ? 'true' : 'page') : undefined)}
            renderLink={(item, props) => <a {...props} onClick={(event) => { preventNavigation(event); props.onClick?.(event); }} />}
            header={<RailLogo />}
            footer={<RailAccount />}
          />
        )}
        panel={withPanel ? <QuestionPanel /> : undefined}
        panelOpen={panelOpen}
        onPanelOpenChange={setPanelOpen}
        panelId={panelId}
        panelReturnFocusRef={toggleRef}
        temporaryNavigationOpen={drawerOpen}
        onTemporaryNavigationClose={() => setDrawerOpen(false)}
        temporaryNavigationId={drawerId}
        temporaryNavigationTitle="LK Portal"
        temporaryNavigationReturnFocusRef={drawerTriggerRef}
        style={{ height }}
      >
        <RailPanelBody />
      </DashboardShell>
    </div>
  );
}

function railPanelParts(canvasElement, testId) {
  const shell = canvasElement.querySelector(`[data-testid="${testId}"]`);
  const children = shell ? [...shell.children].filter((node) => node.tagName !== 'STYLE') : [];
  return {
    shell,
    children,
    skip: shell?.querySelector('.lk-dashboard-shell__skip'),
    rail: shell?.querySelector('.lk-dashboard-shell__navigation nav[data-surface="docked"]'),
    railList: shell?.querySelector('.lk-dashboard-shell__navigation [data-slot="list"]'),
    panelRegion: shell?.querySelector('.lk-dashboard-shell__panel'),
    header: shell?.querySelector('.lk-dashboard-shell__header'),
    main: shell?.querySelector('main.lk-dashboard-shell__main'),
  };
}

export const RailPanel = {
  name: '변형·상태 · 레일과 맥락 패널',
  parameters: storyDescription(
    'topology="rail-panel"은 docked NavRail(영역, 3~7개)과 ShellPanel(영역 안 긴 목록)을 전체 높이 두 열로 둡니다. 레일 항목은 영역의 첫 화면으로 가는 링크이고 캡션이 늘 보입니다. 패널은 제목, 검색 동작, 새 질문 행, 대화 목록 스크롤 구역 하나를 갖습니다. 레일과 패널은 스크롤되지 않고 main만 스크롤됩니다. 읽기와 Tab 순서는 건너뛰기 → 레일 → 패널 → 상단 바 → 본문입니다.',
  ),
  render: () => <RailPanelShell testId="rail-panel-shell" />,
  play: async ({ canvasElement }) => {
    const { shell, children, skip, rail, railList, panelRegion, header, main } = railPanelParts(canvasElement, 'rail-panel-shell');
    if (!shell || !skip || !rail || !railList || !panelRegion || !header || !main) throw new Error('The rail-panel shell regions are incomplete.');
    const order = children.map((node) => node.className.split(' ').find((name) => name.startsWith('lk-dashboard-shell__')) || node.tagName.toLowerCase());
    if (order.slice(0, 5).join(',') !== 'lk-dashboard-shell__skip,lk-dashboard-shell__navigation,lk-dashboard-shell__panel,lk-dashboard-shell__header,lk-dashboard-shell__main') {
      throw new Error(`rail-panel DOM order must be skip → rail → panel → header → main; got ${order.join(' → ')}.`);
    }
    const panelNav = panelRegion.querySelector('nav');
    const title = panelRegion.querySelector('h2');
    if (!panelNav || !title || panelNav.getAttribute('aria-labelledby') !== title.id || rail.getAttribute('aria-label') === title.textContent) {
      throw new Error('The rail nav and the panel nav need distinct names; the panel nav is labelled by the panel title.');
    }
    if (panelRegion.querySelectorAll('[data-scroll-region]').length !== 1) throw new Error('The panel owns exactly one scroll region.');
    if (railList.scrollHeight > railList.clientHeight + 1 || shell.scrollHeight > shell.clientHeight + 1) {
      throw new Error('The rail and the shell must not scroll; only main scrolls.');
    }
    if (getComputedStyle(main).overflowY !== 'auto') throw new Error('main is the rail-panel scroll container.');
    const current = rail.querySelector('[aria-current]');
    if (!current || current.getAttribute('aria-current') !== 'true' || current.dataset.navRailValue !== 'ask') {
      throw new Error('getItemCurrent must let the product mark a screen inside the area with aria-current="true".');
    }
    const railRect = rail.getBoundingClientRect();
    const panelRect = panelRegion.getBoundingClientRect();
    if (Math.abs(railRect.width - 64) > 1 || Math.abs(panelRect.width - 240) > 1 || Math.abs(panelRect.left - railRect.right) > 1) {
      throw new Error('The rail is 64px and the panel 240px, side by side.');
    }
    await userEvent.tab();
    if (canvasElement.ownerDocument.activeElement !== skip) throw new Error('The skip link is the first stop.');
    await userEvent.tab();
    await userEvent.tab();
    if (!rail.contains(canvasElement.ownerDocument.activeElement)) throw new Error('The rail follows the skip link (logo, then areas).');
  },
};

export const RailPanelCollapse = {
  name: '상호작용 · 패널 접기와 펼치기',
  parameters: storyDescription(
    '패널 토글은 상단 바 시작에 하나만 둡니다. 이름은 「패널 접기」와 「패널 펼치기」이고 aria-expanded와 aria-controls로 패널을 가리킵니다. 접힌 패널은 폭 0, inert, aria-hidden이며 레일은 그대로입니다. 패널 안에 focus가 있을 때 접으면 focus가 토글로 돌아갑니다.',
  ),
  render: () => <RailPanelShell testId="rail-panel-collapse" />,
  play: async ({ canvasElement }) => {
    const { panelRegion } = railPanelParts(canvasElement, 'rail-panel-collapse');
    const toggle = canvasElement.querySelector('[data-testid="rail-panel-toggle"]');
    if (!panelRegion || !toggle) throw new Error('The collapse fixture is incomplete.');
    if (toggle.getAttribute('aria-controls') !== panelRegion.id || toggle.getAttribute('aria-expanded') !== 'true') {
      throw new Error('The header toggle must control the panel by id and expose its expanded state.');
    }
    panelRegion.querySelector('a[href]')?.focus();
    await userEvent.click(toggle);
    await waitFor(() => {
      if (panelRegion.dataset.state !== 'closed' || panelRegion.getAttribute('aria-hidden') !== 'true' || !panelRegion.hasAttribute('inert')) {
        throw new Error('A collapsed panel must be closed, aria-hidden and inert.');
      }
      if (toggle.getAttribute('aria-expanded') !== 'false' || toggle.getAttribute('aria-label') !== '패널 펼치기') {
        throw new Error('The toggle must report the collapsed state.');
      }
    });
    await waitFor(() => {
      if (panelRegion.getBoundingClientRect().width > 1) throw new Error('The collapsed panel takes no width.');
    }, { timeout: 2000 });
    await userEvent.click(toggle);
    await waitFor(() => {
      if (panelRegion.dataset.state !== 'open' || panelRegion.hasAttribute('inert')) throw new Error('The panel reopens.');
    });
  },
};

export const RailPanelNoPanel = {
  name: '변형·상태 · 패널 없는 영역',
  parameters: storyDescription(
    '하위 목적지가 2~4개뿐인 영역은 패널을 두지 않고 본문 머리의 경로 탭으로 보입니다. 반쯤 비는 패널을 만들지 않기 위해서입니다. 레일은 같은 자리에 남고 본문이 패널 폭만큼 넓어집니다.',
  ),
  render: () => <RailPanelShell testId="rail-panel-no-panel" area="catalog" withPanel={false} />,
  play: async ({ canvasElement }) => {
    const { shell, rail, panelRegion, main } = railPanelParts(canvasElement, 'rail-panel-no-panel');
    if (!shell || !rail || !main) throw new Error('The no-panel fixture is incomplete.');
    if (panelRegion || shell.hasAttribute('data-panel-mode')) throw new Error('An area without a long list renders no panel region.');
    if (Math.abs(main.getBoundingClientRect().left - rail.getBoundingClientRect().right) > 1) {
      throw new Error('Without a panel, main starts right after the rail.');
    }
    if (rail.querySelector('[aria-current]')?.getAttribute('aria-current') !== 'page') {
      throw new Error('The area first screen is aria-current="page".');
    }
  },
};

export const RailPanelMaxItems = {
  name: '반응형 · 레일 항목 7개와 600px 높이',
  parameters: storyDescription(
    '레일 항목은 3~7개입니다. 문서 높이 600px(1280×720 화면에서 브라우저 크롬을 뺀 높이)에서 7개가 스크롤 없이 들어가야 합니다. 이보다 낮은 창에서만 레일 목록이 스크롤바 없이 스크롤됩니다.',
  ),
  render: () => <RailPanelShell testId="rail-panel-max" items={railAreasMax} height={600} />,
  play: async ({ canvasElement }) => {
    const { rail, railList } = railPanelParts(canvasElement, 'rail-panel-max');
    if (!rail || !railList) throw new Error('The max-items fixture is incomplete.');
    if (railList.querySelectorAll('[data-nav-rail-value]').length !== 7) throw new Error('The fixture renders seven areas.');
    if (railList.scrollHeight > railList.clientHeight + 1) {
      throw new Error(`Seven rail areas must fit a 600px document without scrolling (scrollHeight ${railList.scrollHeight}, clientHeight ${railList.clientHeight}).`);
    }
    const longCaption = railList.querySelector('[data-nav-rail-value="robots"] [data-slot="label"]');
    if (!longCaption || getComputedStyle(longCaption).textOverflow !== 'ellipsis') {
      throw new Error('A long caption truncates on one line.');
    }
  },
};

export const RailPanelOverlay = {
  name: '반응형 · 768~1023px 덮는 패널',
  parameters: storyDescription(
    '768~1023px에서는 패널이 본문을 밀지 않고 덮는 overlay로 열립니다. 이 범위에 들어오면 패널은 접힌 상태로 시작하고, 열면 덮는 쪽에만 그림자를 두며 Escape로 닫혀 focus가 토글로 돌아갑니다. 이 예시는 panelMode="overlay"로 상태를 고정합니다.',
  ),
  render: () => <RailPanelShell testId="rail-panel-overlay" panelMode="overlay" defaultPanelOpen={false} />,
  play: async ({ canvasElement }) => {
    const { shell, panelRegion, main, rail } = railPanelParts(canvasElement, 'rail-panel-overlay');
    const toggle = canvasElement.querySelector('[data-testid="rail-panel-toggle"]');
    if (!shell || !panelRegion || !main || !toggle) throw new Error('The overlay fixture is incomplete.');
    if (shell.dataset.panelMode !== 'overlay' || panelRegion.dataset.state !== 'closed') throw new Error('The overlay panel starts collapsed.');
    const mainLeft = main.getBoundingClientRect().left;
    await userEvent.click(toggle);
    await waitFor(() => {
      if (panelRegion.dataset.state !== 'open' || getComputedStyle(panelRegion).position !== 'absolute') throw new Error('The open overlay panel covers the body.');
    });
    if (Math.abs(main.getBoundingClientRect().left - mainLeft) > 1 || Math.abs(main.getBoundingClientRect().left - rail.getBoundingClientRect().right) > 1) {
      throw new Error('The overlay panel must not push main.');
    }
    panelRegion.querySelector('a[href]')?.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (panelRegion.dataset.state !== 'closed') throw new Error('Escape closes the overlay panel.');
      if (canvasElement.ownerDocument.activeElement !== toggle) throw new Error('Escape returns focus to the panel toggle.');
    });
  },
};

export const RailPanelNarrow = {
  name: '반응형 · 좁은 화면 드로어 하나',
  parameters: storyDescription(
    '768px 미만(예: 375×812)에서는 레일과 패널을 숨기고 드로어 하나로 합칩니다. 드로어는 같은 레일 항목을 가로 행으로, 이어서 현재 영역의 패널(스크롤 구역 하나)과 계정 행을 둡니다. 제품은 항목을 한 번만 넘깁니다. 320px 폭에서도 같은 순서를 지킵니다.',
  ),
  render: () => (
    <div style={{ width: 375, maxWidth: '100%' }}>
      <RailPanelShell testId="rail-panel-narrow" layout="narrow" height={812} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const { shell, rail, panelRegion, main } = railPanelParts(canvasElement, 'rail-panel-narrow');
    const trigger = canvasElement.querySelector('[data-testid="rail-panel-drawer-trigger"]');
    if (!shell || !main || !trigger) throw new Error('The narrow fixture is incomplete.');
    if (rail || panelRegion) throw new Error('The narrow shell renders neither the docked rail nor the inline panel.');
    await userEvent.click(trigger);
    const documentRef = canvasElement.ownerDocument;
    await waitFor(() => {
      const drawer = documentRef.querySelector('[data-rail-panel-drawer]');
      if (!drawer) throw new Error('The drawer opens.');
    });
    const drawer = documentRef.querySelector('[data-rail-panel-drawer]');
    const areas = drawer.querySelector('nav[data-surface="drawer"]');
    const panelNav = drawer.querySelector('[data-rail-panel-drawer-panel] nav');
    const footer = drawer.querySelector('[data-rail-panel-drawer-footer]');
    if (!areas || !panelNav || !footer) throw new Error('The drawer holds area rows, the panel and the account row.');
    if (!(areas.compareDocumentPosition(panelNav) & Node.DOCUMENT_POSITION_FOLLOWING) || !(panelNav.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Drawer order is areas → panel → account.');
    }
    if (drawer.querySelectorAll('[data-scroll-region]').length !== 1) throw new Error('The drawer keeps one scroll region.');
    const rows = areas.querySelectorAll('[data-nav-rail-value]');
    if (rows.length !== railAreas.length || rows[0].getBoundingClientRect().height > 48) throw new Error('Areas render as compact horizontal rows.');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (documentRef.querySelector('[data-rail-panel-drawer]')) throw new Error('Escape closes the drawer.');
    });
  },
};

export const RailPanelDark = {
  name: '변형·상태 · 레일과 패널 다크',
  parameters: storyDescription(
    '다크 테마에서도 레일과 패널은 같은 neutral 토큰을 따릅니다. 선택은 무채색 채움, 가장 진한 글자, 굵기로 표시하고 파랑은 포커스에만 남습니다.',
  ),
  render: () => <RailPanelShell testId="rail-panel-dark" theme="dark" />,
  play: async ({ canvasElement }) => {
    const { rail, panelRegion } = railPanelParts(canvasElement, 'rail-panel-dark');
    const current = rail?.querySelector('[data-state="active"]');
    const row = panelRegion?.querySelector('[data-current="true"]');
    if (!rail || !current || !row) throw new Error('The dark fixture is incomplete.');
    const expected = resolveColor(current, 'var(--component-nav-rail-neutral-foreground)');
    if (getComputedStyle(current).color !== expected || Number(getComputedStyle(current.querySelector('[data-slot="label"]')).fontWeight) < 700) {
      throw new Error('The current area uses the strongest neutral ink and bold weight in dark.');
    }
    if (getComputedStyle(row).backgroundColor === getComputedStyle(row.parentElement).backgroundColor) throw new Error('The current conversation keeps its achromatic fill in dark.');
  },
};
