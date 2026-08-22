import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import {
  Avatar,
  BottomNav,
  Button,
  DashboardShell,
  Icon,
  IconButton,
  Lockup,
  ProductLockup,
  SideNav,
  TopBar,
  TopBarNavItem,
} from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/Top Bar',
  tags: ['autodocs'],
  component: TopBar,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-top-bar--top-bar-default',
      eyebrow: 'Product / Top Bar',
      title: '탑 바는 제품 전역의 브랜드·탐색·유틸리티를 한 줄로 정리합니다',
      description:
        '기본형은 제품 셸 최상단의 전폭 헤더입니다. 랜딩에서는 가운데 탐색과 플로팅 표면을 명시적으로 선택하고, 깊은 제품 계층에는 Top Bar 목적지를 반복하지 말고 Side Nav를 사용하세요.',
    },
    docs: {
      description: {
        component: 'TopBar는 제품 셸의 전폭 상단 헤더 또는 랜딩·콘텐츠 사이트의 전역 탐색으로 사용하는 LK Product Extension입니다. 제품 셸 기본형은 모서리와 외곽 그림자 없이 하단 구분선으로 본문과 연결하고, 가운데 정렬·플로팅 표면은 랜딩에서만 명시적으로 선택합니다. Side Nav와 함께 쓸 때는 로고와 로컬 목적지를 반복하지 않습니다.',
      },
    },
  },
};

export default meta;

const productMenu = [
  { label: '개요', href: '#', current: 'page' },
  { label: '컴포넌트', href: '#' },
  { label: '토큰', href: '#' },
];

const operationsMenu = [
  { label: '운영 개요', href: '#operations-overview', current: 'page' },
  { label: '가동 현황', href: '#operations-live' },
  { label: '점검 현황', href: '#operations-inspection' },
];

const productShellDestinations = [
  { value: 'operations', label: '운영 현황', href: '#operations' },
  { value: 'robots', label: '장비', href: '#robots' },
  { value: 'tasks', label: '작업', href: '#tasks' },
  { value: 'reports', label: '리포트', href: '#reports' },
];

const shellNavigationItems = [
  { value: 'overview', label: '운영 현황', icon: <Icon name="home" size={18} aria-hidden="true" /> },
  { value: 'resources', label: '장비', icon: <Icon name="layers" size={18} aria-hidden="true" /> },
  { value: 'activity', label: '변경 이력', icon: <Icon name="history" size={18} aria-hidden="true" /> },
];

const compactNavigationItems = [
  { value: 'overview', label: '현황', icon: <Icon name="home" size={20} aria-hidden="true" /> },
  { value: 'resources', label: '장비', icon: <Icon name="layers" size={20} aria-hidden="true" /> },
  { value: 'activity', label: '기록', icon: <Icon name="history" size={20} aria-hidden="true" /> },
];

const SearchIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

function waitForLayout(element) {
  const view = element.ownerDocument.defaultView;
  return new Promise((resolve) => {
    view.requestAnimationFrame(() => view.requestAnimationFrame(resolve));
  });
}

function waitForPointerGrace(element) {
  const view = element.ownerDocument.defaultView;
  return new Promise((resolve) => view.setTimeout(resolve, 220));
}

function ProductActions({ compact = false }) {
  return (
    <React.Fragment>
      <IconButton variant="plain" label="전역 검색" size={compact ? 36 : 40}>
        <span aria-hidden="true">{SearchIcon}</span>
      </IconButton>
      {!compact && (
        <IconButton variant="plain" label="알림" size={40}>
          <Icon name="bell" size={19} aria-hidden="true" />
        </IconButton>
      )}
      <IconButton variant="plain" label="사용자 메뉴" size={compact ? 36 : 40}>
        <Avatar name="김한" size={compact ? 24 : 28} aria-hidden="true" />
      </IconButton>
    </React.Fragment>
  );
}

function ProductShellTopBarFixture({ showTransitionDemo = false }) {
  const [activeDestination, setActiveDestination] = React.useState('operations');
  const replayTimerRef = React.useRef(null);
  const activeLabel = productShellDestinations.find(
    ({ value }) => value === activeDestination,
  )?.label;
  const selectDestination = (destination) => (event) => {
    event.preventDefault();
    clearTimeout(replayTimerRef.current);
    setActiveDestination(destination);
  };
  const replayActiveTransition = () => {
    clearTimeout(replayTimerRef.current);
    setActiveDestination('operations');
    replayTimerRef.current = setTimeout(() => setActiveDestination('robots'), 360);
  };

  React.useEffect(() => () => clearTimeout(replayTimerRef.current), []);

  return (
    <div
      data-theme="light"
      data-active-destination={activeDestination}
      className="theme-light"
      style={{ width: '100%', minWidth: 0 }}
    >
      <TopBar
        aria-label="제품 전역 헤더"
        navAlign="start"
        navigationLabel="제품 주 탐색"
        brand={<Lockup variant="inline" tone="ink" height={22} />}
        actions={<ProductActions />}
      >
        {productShellDestinations.map(({ value, label, href }) => (
          <TopBarNavItem
            key={value}
            active={activeDestination === value}
            href={href}
            menuItems={value === 'operations' ? operationsMenu : undefined}
            menuTriggerLabel={value === 'operations' ? '운영 현황 하위 메뉴' : undefined}
            onClick={selectDestination(value)}
          >
            {label}
          </TopBarNavItem>
        ))}
      </TopBar>
      <div style={{ minHeight: 148, padding: 'var(--space-8)', boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)' }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)', fontWeight: 'var(--fw-bold)' }}>
          {activeLabel}
        </h2>
        <p style={{ maxWidth: 560, margin: 'var(--space-3) 0 0', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)' }}>
          상단 바는 페이지 위에 떠 있는 카드가 아니라 제품 셸과 본문을 연결하는 전역 탐색 영역입니다.
        </p>
        {showTransitionDemo ? (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-6)',
            }}
          >
            <Button size="sm" variant="outlined" color="assistive" onClick={replayActiveTransition}>
              전환 다시 보기
            </Button>
            <span
              data-top-bar-transition-status
              role="status"
              aria-live="polite"
              style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)' }}
            >
              현재 목적지: <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{activeLabel}</strong>
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export const TopBarDefault = {
  name: '개요',
  parameters: storyDescription(
    '제품 셸 최상단에서 브랜드·좌측 정렬 주 탐색·우측 전역 도구를 전폭으로 배치합니다. 모서리와 외곽 그림자 없이 하단 구분선으로 본문에 연결되는 기본형인지 확인하세요.',
  ),
  render: () => <ProductShellTopBarFixture />,
  play: async ({ canvasElement }) => {
    const topBar = canvasElement.querySelector('header[aria-label="제품 전역 헤더"]');
    const primary = topBar?.querySelector('[data-top-bar-primary]');
    const trigger = topBar?.querySelector('[data-top-bar-menu-trigger]');
    const menu = topBar?.querySelector('[data-top-bar-menu]');
    const chevron = trigger?.querySelector('[data-top-bar-menu-chevron]');
    if (!topBar || !primary || !trigger || !menu || !chevron) {
      throw new Error('TopBar dropdown fixture is incomplete.');
    }
    if (primary.tagName !== 'A' || primary.getAttribute('href') !== '#operations') {
      throw new Error('A TopBar item with href and menuItems must preserve its primary link destination.');
    }
    if (primary.hasAttribute('aria-expanded') || trigger.tagName !== 'BUTTON') {
      throw new Error('The route link and dropdown disclosure must remain separate controls.');
    }
    if (trigger.getAttribute('aria-controls') !== menu.id || menu.tagName !== 'UL') {
      throw new Error('The disclosure must control a native navigation list.');
    }
    const topBarStyle = getComputedStyle(topBar);
    if (topBarStyle.borderRadius !== '0px' || topBarStyle.boxShadow !== 'none') {
      throw new Error('The product-shell TopBar must remain edge-to-edge without card radius or outer shadow.');
    }
    const activeIndicator = primary.querySelector('[data-top-bar-active-indicator]');
    const textNode = Array.from(primary.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
    );
    if (!activeIndicator || !textNode) {
      throw new Error('The active TopBar destination must expose its text-width indicator.');
    }
    const textRange = canvasElement.ownerDocument.createRange();
    textRange.selectNodeContents(textNode);
    const textRect = textRange.getBoundingClientRect();
    const indicatorRect = activeIndicator.getBoundingClientRect();
    const indicatorGap = indicatorRect.top - textRect.bottom;
    const chevronGap = chevron.getBoundingClientRect().left - textRect.right;
    const indicatorDuration = Number.parseFloat(getComputedStyle(activeIndicator).transitionDuration);
    const prefersReducedMotion = canvasElement.ownerDocument.defaultView
      .matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (
      Math.abs(indicatorRect.width - textRect.width) > 2
      || indicatorGap < 0
      || indicatorGap > 6
      || indicatorRect.bottom >= topBar.getBoundingClientRect().bottom - 8
    ) {
      throw new Error('The active indicator must sit directly below the text instead of on the TopBar edge.');
    }
    if (chevronGap < 2 || chevronGap > 6 || trigger.getBoundingClientRect().width < 28) {
      throw new Error('The disclosure chevron must stay visually close to the label without shrinking its target.');
    }
    if (
      (!prefersReducedMotion && Math.abs(indicatorDuration - 0.2) > 0.01)
      || (prefersReducedMotion && indicatorDuration !== 0)
      || activeIndicator.style.transformOrigin !== 'left center'
    ) {
      throw new Error('The active indicator must use the 200ms left-origin route transition and respect reduced motion.');
    }
    for (const label of ['전역 검색', '알림', '사용자 메뉴']) {
      if (!topBar.querySelector(`button[aria-label="${label}"]`)) {
        throw new Error(`The product-shell TopBar must preserve its global action: ${label}`);
      }
    }

    await userEvent.click(trigger);
    await waitForLayout(canvasElement);

    const barRect = topBar.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const view = canvasElement.ownerDocument.defaultView;
    if (trigger.getAttribute('aria-expanded') !== 'true' || menuRect.width === 0 || menuRect.height === 0) {
      throw new Error('TopBar dropdown must become visibly open from its trigger.');
    }
    if (chevron.style.transform !== 'rotate(180deg)') {
      throw new Error('The disclosure chevron must rotate when the menu opens.');
    }
    if (menuRect.top >= barRect.top && menuRect.bottom <= barRect.bottom) {
      throw new Error('TopBar dropdown must extend outside the bar instead of being clipped by it.');
    }
    if (menuRect.left < 0 || menuRect.right > view.innerWidth) {
      throw new Error('TopBar dropdown must remain inside the viewport.');
    }
    await userEvent.click(trigger);
    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'false') throw new Error('The disclosure must close on a second click.');
    });
    if (chevron.style.transform !== 'rotate(0deg)') {
      throw new Error('The disclosure chevron must reset when the menu closes.');
    }
    await userEvent.click(trigger);
    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'true') throw new Error('The disclosure must reopen for visual contract checks.');
    });
    await waitForLayout(canvasElement);
    const menuItems = Array.from(menu.querySelectorAll('[data-top-bar-menu-item]'));
    if (menuItems.length !== 3 || menuItems[0].getAttribute('aria-current') !== 'page') {
      throw new Error('The current TopBar dropdown destination must expose aria-current.');
    }
    const menuStyle = getComputedStyle(menu);
    const currentStyle = getComputedStyle(menuItems[0]);
    const idleStyle = getComputedStyle(menuItems[2]);
    const expectedItemWidth = menu.clientWidth - parseFloat(menuStyle.paddingLeft) - parseFloat(menuStyle.paddingRight);
    if (
      menuStyle.paddingTop !== '8px'
      || menuStyle.paddingLeft !== '8px'
      || menuStyle.gap !== '4px'
      || menuStyle.borderRadius !== '12px'
      || currentStyle.minHeight !== '40px'
      || currentStyle.paddingTop !== '10px'
      || currentStyle.paddingLeft !== '16px'
      || Math.abs(menuItems[0].getBoundingClientRect().width - expectedItemWidth) > 1
    ) {
      throw new Error('TopBar dropdown spacing and full-row hit-area tokens must remain intact.');
    }
    const idleBackground = idleStyle.backgroundColor;
    const selectedBackground = currentStyle.backgroundColor;
    menuItems[1].focus();
    await waitFor(() => {
      if (getComputedStyle(menuItems[1]).backgroundColor === idleBackground) {
        throw new Error('Keyboard focus must expose the TopBar menu hover background.');
      }
    });
    const focusBackground = getComputedStyle(menuItems[1]).backgroundColor;
    if (selectedBackground === idleBackground || focusBackground === idleBackground) {
      throw new Error('Current and keyboard-focus menu states must remain visually distinguishable.');
    }

    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'false') throw new Error('Escape must close the visually verified dropdown.');
    });
    if (chevron.style.transform !== 'rotate(0deg)') {
      throw new Error('The disclosure chevron must reset when the menu closes.');
    }
    await userEvent.unhover(trigger);
    await waitForPointerGrace(canvasElement);
    trigger.blur();

    const robotsPrimary = Array.from(topBar.querySelectorAll('[data-top-bar-primary]')).find(
      (item) => item.textContent?.trim() === '장비',
    );
    const robotsIndicator = robotsPrimary?.querySelector('[data-top-bar-active-indicator]');
    const fixture = topBar.parentElement;
    if (!robotsPrimary || !robotsIndicator || !fixture) {
      throw new Error('The product-shell route transition fixture is incomplete.');
    }

    await userEvent.click(robotsPrimary);
    await waitFor(() => {
      if (
        fixture.dataset.activeDestination !== 'robots'
        || robotsPrimary.getAttribute('aria-current') !== 'page'
        || primary.hasAttribute('aria-current')
      ) {
        throw new Error('Selecting a route must move the active destination.');
      }
    });
    if (activeIndicator.style.transform !== 'scaleX(0)' || robotsIndicator.style.transform !== 'scaleX(1)') {
      throw new Error('Selecting a route must animate the underline to the new destination.');
    }

    await userEvent.hover(primary);
    if (activeIndicator.style.transform !== 'scaleX(0)' || robotsIndicator.style.transform !== 'scaleX(1)') {
      throw new Error('Hover must not steal the current active underline.');
    }
    await userEvent.unhover(primary);
    await waitForPointerGrace(canvasElement);
    primary.click();
    await waitFor(() => {
      if (
        fixture.dataset.activeDestination !== 'operations'
        || primary.getAttribute('aria-current') !== 'page'
        || robotsPrimary.hasAttribute('aria-current')
      ) {
        throw new Error('The fixture must restore its initial active destination.');
      }
    });
  },
};

export const ActiveDestinationTransition = {
  name: '상호작용 · 활성 목적지 전환',
  parameters: storyDescription(
    '주 탐색 목적지를 직접 선택하거나 전환 다시 보기를 눌러 활성 밑줄의 200ms 왼쪽 기준 전환을 확인합니다. hover는 현재 밑줄을 가져가지 않으며 모션 축소 설정에서는 상태만 즉시 바뀝니다.',
  ),
  render: () => <ProductShellTopBarFixture showTransitionDemo />,
  play: async ({ canvasElement }) => {
    const replay = Array.from(canvasElement.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '전환 다시 보기',
    );
    const fixture = canvasElement.querySelector('[data-active-destination]');
    if (!replay || !fixture) {
      throw new Error('The active-destination transition replay control is incomplete.');
    }

    await userEvent.click(replay);
    await waitFor(() => {
      const activeLink = fixture.querySelector('[data-top-bar-primary][aria-current="page"]');
      const status = fixture.querySelector('[data-top-bar-transition-status]');
      if (
        fixture.dataset.activeDestination !== 'robots'
        || activeLink?.textContent?.trim() !== '장비'
        || !status?.textContent?.includes('장비')
      ) {
        throw new Error('The replay control must demonstrate the operations-to-robots active transition.');
      }
    }, { timeout: 1000 });
  },
};

export const LandingHeader = {
  name: '시나리오 · 랜딩 브랜드 헤더',
  parameters: storyDescription(
    '랜딩이나 콘텐츠 사이트에서만 가운데 정렬 탐색과 플로팅 표면을 명시적으로 선택합니다. 밝은·어두운 브랜드 표면에서 선택 상태와 검색 액션이 같은 위계로 읽히는지 비교하세요.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-8)', width: 'min(880px, 100%)', minWidth: 0 }}>
      <div data-theme="light" className="theme-light" style={{ position: 'relative', zIndex: 2, width: '100%', minWidth: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <TopBar
          navAlign="center"
          navigationLabel="밝은 랜딩 주 탐색"
          brand={<Lockup variant="inline" tone="ink" height={22} />}
          actions={<IconButton variant="ghost" label="검색" size={40} style={{ background: 'transparent', border: 'none', color: 'var(--color-semantic-label-normal)' }}>{SearchIcon}</IconButton>}
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <TopBarNavItem active href="#" menuItems={productMenu}>개요</TopBarNavItem>
          <TopBarNavItem href="#">컴포넌트</TopBarNavItem>
          <TopBarNavItem href="#">토큰</TopBarNavItem>
          <TopBarNavItem href="#">지원</TopBarNavItem>
        </TopBar>
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', minWidth: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <TopBar
          dark
          navAlign="center"
          navigationLabel="어두운 랜딩 주 탐색"
          brand={<Lockup variant="inline" tone="white" height={22} />}
          actions={<IconButton variant="on-dark" label="검색" size={40} style={{ background: 'transparent', border: 'none', color: 'var(--color-semantic-brand-on-surface)' }}>{SearchIcon}</IconButton>}
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <TopBarNavItem active href="#" menuItems={productMenu}>개요</TopBarNavItem>
          <TopBarNavItem href="#">컴포넌트</TopBarNavItem>
          <TopBarNavItem href="#">토큰</TopBarNavItem>
          <TopBarNavItem href="#">지원</TopBarNavItem>
        </TopBar>
      </div>
    </div>
  ),
};

function ShellPreview({ layout }) {
  const compact = layout === 'narrow';
  const label = compact ? '모바일 제품 전역 헤더' : '데스크톱 제품 전역 헤더';

  return (
    <DashboardShell
      layout={layout}
      header={(
        <TopBar
          aria-label={label}
          height={compact ? 56 : 60}
          brand={<Lockup variant={compact ? 'mark' : 'inline'} tone="ink" height={compact ? 22 : 20} />}
          actions={<ProductActions compact={compact} />}
        />
      )}
      navigation={(
        <SideNav
          surface="docked"
          items={shellNavigationItems}
          defaultValue="overview"
          width={216}
          style={{ height: '100%', minHeight: 0 }}
        />
      )}
      narrowNavigation={<BottomNav items={compactNavigationItems} defaultValue="overview" />}
      mainLabel={compact ? '모바일 제품 본문' : '데스크톱 제품 본문'}
      mainStyle={{ padding: compact ? 'var(--space-5)' : 'var(--space-8)', boxSizing: 'border-box', background: 'var(--color-semantic-background-normal-normal)' }}
      style={{ minHeight: compact ? 420 : 340, height: compact ? 420 : 340 }}
    >
      <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: compact ? 'var(--headline1-size)' : 'var(--heading2-size)', lineHeight: 1.35, fontWeight: 'var(--fw-bold)' }}>
        운영 현황
      </h2>
      <p style={{ margin: 'var(--space-3) 0 0', color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--body2-size)', lineHeight: 'var(--body2-line)' }}>
        로컬 목적지는 화면 폭에 맞춰 Side Nav와 Bottom Nav가 나눠 맡고, Top Bar는 브랜드와 전역 도구만 유지합니다.
      </p>
    </DashboardShell>
  );
}

export const DashboardShellComposition = {
  name: '반응형 · 대시보드 셸 전환',
  parameters: storyDescription(
    '제품에 Side Nav가 있으면 Top Bar는 브랜드와 전역 도구만 소유합니다. 넓은 화면의 Side Nav와 좁은 화면의 Bottom Nav를 DashboardShell이 전환하며 로컬 목적지를 Top Bar에 중복하지 않습니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-8)', width: '100%', minWidth: 0 }}>
      <div data-shell-example="wide" style={{ width: '100%', minWidth: 0, overflow: 'hidden', border: '1px solid var(--color-semantic-line-normal-normal)' }}>
        <ShellPreview layout="wide" />
      </div>
      <div data-shell-example="narrow" style={{ width: 'min(360px, 100%)', minWidth: 0, overflow: 'hidden', border: '1px solid var(--color-semantic-line-normal-normal)' }}>
        <ShellPreview layout="narrow" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const wide = canvasElement.querySelector('[data-shell-example="wide"]');
    const narrow = canvasElement.querySelector('[data-shell-example="narrow"]');
    const wideTopBar = wide?.querySelector('header[aria-label="데스크톱 제품 전역 헤더"]');
    const narrowTopBar = narrow?.querySelector('header[aria-label="모바일 제품 전역 헤더"]');
    const wideNavigation = wide?.querySelector('.lk-dashboard-shell__navigation');
    const narrowWideNavigation = narrow?.querySelector('.lk-dashboard-shell__navigation');
    const narrowNavigation = narrow?.querySelector('.lk-dashboard-shell__narrow-navigation');
    if (!wide || !narrow || !wideTopBar || !narrowTopBar || !wideNavigation || !narrowWideNavigation || !narrowNavigation) {
      throw new Error('The DashboardShell TopBar composition fixture is incomplete.');
    }
    if (wideTopBar.querySelector('nav') || narrowTopBar.querySelector('nav')) {
      throw new Error('A TopBar paired with local shell navigation must not duplicate local destinations.');
    }
    if (getComputedStyle(wideNavigation).display === 'none') {
      throw new Error('The wide shell must expose Side Nav navigation.');
    }
    if (getComputedStyle(narrowWideNavigation).display !== 'none' || getComputedStyle(narrowNavigation).display === 'none') {
      throw new Error('The narrow shell must replace Side Nav with Bottom Nav.');
    }
  },
};

const disclosureMenu = [
  { label: '제품 개요', href: '#product-overview', onClick: (event) => event.preventDefault() },
  { label: '컴포넌트', href: '#product-components', onClick: (event) => event.preventDefault() },
  { label: '새 항목', onClick: () => {} },
];

function TopBarDisclosureContractFixture() {
  const [events, setEvents] = React.useState({ hoverCount: 0, keyCount: 0, linkUnblocked: false });

  return (
    <div data-top-bar-contract style={{ display: 'grid', gap: 24, width: 'min(720px, 100%)' }}>
      <TopBar
        navigationLabel="제품 탐색"
        brand={(
          <a
            data-top-bar-home
            href="#console-home"
            aria-label="LK Console 홈"
            onClick={(event) => event.preventDefault()}
            style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
          >
            <ProductLockup product="console" height={20} decorative />
          </a>
        )}
      >
        <TopBarNavItem
          active
          href="#topbar-destination"
          menuItems={disclosureMenu}
          menuTriggerLabel="제품 하위 메뉴"
          onClick={(event) => {
            const linkUnblocked = !event.defaultPrevented;
            event.preventDefault();
            setEvents((previous) => ({ ...previous, linkUnblocked }));
          }}
          onMouseEnter={() => setEvents((previous) => ({ ...previous, hoverCount: previous.hoverCount + 1 }))}
          onKeyDown={() => setEvents((previous) => ({ ...previous, keyCount: previous.keyCount + 1 }))}
        >
          제품
        </TopBarNavItem>
        <TopBarNavItem href="#support">지원</TopBarNavItem>
      </TopBar>
      <button type="button" data-top-bar-outside>드롭다운 바깥 대상</button>
      <output
        data-top-bar-events
        data-hover-count={events.hoverCount}
        data-key-count={events.keyCount}
        data-link-unblocked={events.linkUnblocked ? 'true' : 'false'}
      />
    </div>
  );
}

export const DisclosureNavigationContract = {
  name: '상호작용 · 링크와 하위 탐색',
  parameters: storyDescription(
    '목적지 링크와 하위 탐색 disclosure를 분리하고, hover 간격·방향키·Escape·외부 touch 닫힘 및 사용자 이벤트 합성을 회귀 검증합니다.',
  ),
  render: () => <TopBarDisclosureContractFixture />,
  play: async ({ canvasElement }) => {
    const fixture = canvasElement.querySelector('[data-top-bar-contract]');
    const wrapper = fixture?.querySelector('[data-top-bar-nav-item]');
    const primary = wrapper?.querySelector('[data-top-bar-primary]');
    const trigger = wrapper?.querySelector('[data-top-bar-menu-trigger]');
    const panel = wrapper?.querySelector('[data-top-bar-menu]');
    const outside = fixture?.querySelector('[data-top-bar-outside]');
    const output = fixture?.querySelector('[data-top-bar-events]');
    const brandHome = fixture?.querySelector('[data-top-bar-home]');
    const brandLockup = brandHome?.querySelector('[data-product-lockup]');
    const items = panel ? Array.from(panel.querySelectorAll('a, button')) : [];
    if (!fixture || !wrapper || !primary || !trigger || !panel || !outside || !output || items.length !== 3
      || brandHome?.getAttribute('aria-label') !== 'LK Console 홈'
      || brandHome?.getAttribute('href') !== '#console-home'
      || !brandLockup
      || brandLockup.getAttribute('aria-hidden') !== 'true'
      || brandLockup.getAttribute('data-product-lockup-product') !== 'console'
      || brandLockup.getAttribute('data-product-lockup-wordmark') !== 'CONSOLE'
      || brandLockup.getAttribute('height') !== '20') {
      throw new Error('TopBar disclosure contract fixture is incomplete.');
    }
    if (primary.tagName !== 'A' || primary.getAttribute('href') !== '#topbar-destination' || primary.hasAttribute('aria-expanded')) {
      throw new Error('The primary destination must remain a link without disclosure state.');
    }
    if (trigger.tagName !== 'BUTTON' || trigger.getAttribute('aria-controls') !== panel.id || trigger.getAttribute('aria-expanded') !== 'false') {
      throw new Error('A separate button must expose the disclosure relationship and state.');
    }
    if (panel.tagName !== 'UL' || panel.hasAttribute('role') || panel.querySelector('[role="menuitem"]')) {
      throw new Error('TopBar navigation dropdowns must retain native list/link/button semantics.');
    }

    await userEvent.click(primary);
    await waitFor(() => {
      if (output.dataset.linkUnblocked !== 'true') throw new Error('The primary link callback must run before any internal prevention.');
    });
    await userEvent.click(outside);
    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'false') throw new Error('An outside pointer interaction must dismiss the dropdown.');
    });

    await userEvent.hover(primary);
    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'true' || Number(output.dataset.hoverCount) < 1) {
        throw new Error('User hover handlers and internal disclosure behavior must both run.');
      }
    });
    await userEvent.unhover(primary);
    await userEvent.hover(panel);
    await waitForPointerGrace(canvasElement);
    if (trigger.getAttribute('aria-expanded') !== 'true') {
      throw new Error('The pointer must be able to cross the 4px trigger-to-panel gap.');
    }
    await userEvent.unhover(panel);
    await waitForPointerGrace(canvasElement);

    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      if (canvasElement.ownerDocument.activeElement !== items[0]) throw new Error('ArrowDown must focus the first dropdown destination.');
    });
    await userEvent.keyboard('{ArrowDown}');
    if (canvasElement.ownerDocument.activeElement !== items[1]) throw new Error('ArrowDown must advance through dropdown destinations.');
    await userEvent.keyboard('{End}');
    if (canvasElement.ownerDocument.activeElement !== items[2]) throw new Error('End must focus the last dropdown destination.');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'false' || canvasElement.ownerDocument.activeElement !== trigger) {
        throw new Error('Escape must dismiss the dropdown and restore disclosure focus.');
      }
      if (Number(output.dataset.keyCount) < 4) throw new Error('User key handlers and internal focus behavior must both run.');
    });

    await userEvent.click(trigger);
    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'true') throw new Error('The disclosure must reopen before outside-touch verification.');
    });
    const view = canvasElement.ownerDocument.defaultView;
    const PointerEventCtor = view.PointerEvent || view.Event;
    outside.dispatchEvent(new PointerEventCtor('pointerdown', { bubbles: true, pointerType: 'touch' }));
    await waitFor(() => {
      if (trigger.getAttribute('aria-expanded') !== 'false') throw new Error('An outside touch pointerdown must dismiss the manual popover.');
    });
  },
};

export const UtilityOnly = {
  name: '시나리오 · 대시보드 전역 도구',
  parameters: storyDescription(
    'Side Nav가 로컬 탐색을 소유하는 대시보드에서 Top Bar를 검색·알림·사용자 작업만 담는 유틸리티 영역으로 사용합니다. 제품 전환은 주요 CTA가 아닌 보조 전역 동작이므로 중립 outlined 버튼으로 표현하고, 브랜드와 목적지가 중복되지 않는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 'min(880px, 100%)', minWidth: 0, overflow: 'hidden' }}>
      <TopBar
        aria-label="대시보드 전역 유틸리티"
        height={56}
        brand={<strong style={{ fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}>AMR 운영</strong>}
        actions={(
          <React.Fragment>
            <IconButton variant="ghost" label="전역 검색" size={36}><span aria-hidden="true">{SearchIcon}</span></IconButton>
            <IconButton variant="ghost" label="알림" size={36}><Icon name="bell" size={19} aria-hidden="true" /></IconButton>
            <Button size="sm" variant="outlined" color="assistive">제품 전환</Button>
          </React.Fragment>
        )}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const topBar = canvasElement.querySelector('header[aria-label="대시보드 전역 유틸리티"]');
    if (!topBar || topBar.querySelector('nav')) {
      throw new Error('Utility TopBar must omit primary navigation when local routes belong to SideNav.');
    }
    for (const label of ['전역 검색', '알림']) {
      if (!topBar.querySelector(`button[aria-label="${label}"]`)) {
        throw new Error(`Utility TopBar must preserve its global action: ${label}`);
      }
    }
    const productSwitcher = Array.from(topBar.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '제품 전환',
    );
    if (
      !productSwitcher
      || productSwitcher.type !== 'button'
      || !productSwitcher.classList.contains('lk-btn--outlined-assistive')
    ) {
      throw new Error('Product switching must remain a neutral, secondary button action.');
    }
  },
};

export const NarrowWidth = {
  name: '반응형 · 320px 단독 사용',
  parameters: storyDescription(
    'DashboardShell 밖에서 Top Bar를 단독 사용해야 할 때의 구조적 fallback입니다. 320px에서도 브랜드와 전역 액션은 유지되고 내비가 가로 스크롤하지만, 이를 완성된 모바일 헤더로 사용하지 말고 제품에서는 DashboardShell의 Side Nav·Bottom Nav 전환을 명시하세요.',
  ),
  render: () => (
    <div style={{ width: 'min(320px, 100%)', minWidth: 0 }}>
      <TopBar
        aria-label="좁은 폭 탑 바"
        height={56}
        navAlign="start"
        brand={<Lockup variant="inline" tone="ink" height={20} />}
        actions={(
          <React.Fragment>
            <IconButton variant="ghost" label="전역 검색" size={36}><span aria-hidden="true">{SearchIcon}</span></IconButton>
            <IconButton variant="ghost" label="알림" size={36}><Icon name="bell" size={19} aria-hidden="true" /></IconButton>
          </React.Fragment>
        )}
      >
        <TopBarNavItem active href="#">장비 운영 현황</TopBarNavItem>
        <TopBarNavItem href="#">변경 이력</TopBarNavItem>
      </TopBar>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const topBar = canvasElement.querySelector('header[aria-label="좁은 폭 탑 바"]');
    const brand = topBar?.querySelector('[data-top-bar-brand]');
    const actions = topBar?.querySelector('[data-top-bar-actions]');
    const nav = topBar?.querySelector('[data-top-bar-nav]');
    if (!topBar || !brand || !actions || !nav) {
      throw new Error('Narrow TopBar must preserve brand, navigation, and actions.');
    }
    const navList = nav.querySelector(':scope > ul');
    if (!navList
      || getComputedStyle(navList).listStyleType !== 'none'
      || navList.querySelectorAll(':scope > li').length !== 2
      || !navList.querySelector(':scope > li [data-top-bar-primary]')) {
      throw new Error('TopBar primary navigation must render its items inside a native unstyled ul/li list.');
    }

    const barRect = topBar.getBoundingClientRect();
    const brandRect = brand.getBoundingClientRect();
    const actionsRect = actions.getBoundingClientRect();
    if (brandRect.width === 0 || actionsRect.width === 0) {
      throw new Error('Narrow TopBar brand and actions must remain usable.');
    }
    if (brandRect.left < barRect.left - 1 || actionsRect.right > barRect.right + 1) {
      throw new Error('Narrow TopBar brand and actions must remain inside the bar.');
    }
    if (nav.scrollWidth <= nav.clientWidth + 1) {
      throw new Error('The narrow fixture must exercise actual horizontal navigation overflow.');
    }
    if (topBar.scrollWidth > topBar.clientWidth + 1) {
      throw new Error('Scrollable navigation must not make the complete TopBar overflow.');
    }
  },
};

const topBarNavStyle = {
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'stretch',
  whiteSpace: 'nowrap',
  padding: '0 14px',
  fontSize: 14.5,
  fontWeight: 700,
  letterSpacing: 0,
  textDecoration: 'none',
};

const topBarMenuStyle = {
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translate(-50%, 4px)',
  background: 'var(--color-semantic-background-elevated-normal)',
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 14,
  boxShadow: 'var(--shadow-md)',
  padding: 8,
  minWidth: 176,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  opacity: 0,
  visibility: 'hidden',
  zIndex: 60,
};

function TopBarStaticNav({ dark = false }) {
  const activeColor = dark ? 'var(--color-semantic-brand-on-surface)' : 'var(--color-semantic-primary-normal)';
  const idleColor = dark ? 'var(--color-semantic-brand-on-surface-subtle)' : 'var(--color-semantic-label-alternative)';
  const underline = dark ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-primary-normal)';
  const itemStyle = {
    padding: '10px 12px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--color-semantic-label-normal)',
    textDecoration: 'none',
  };

  return (
    <React.Fragment>
      <span style={{ position: 'relative', display: 'inline-flex', alignSelf: 'stretch' }}>
        <a href="#" style={{ ...topBarNavStyle, color: activeColor, boxShadow: `inset 0 -2.5px 0 ${underline}` }}>Overview</a>
        <span style={topBarMenuStyle}>
          <a href="#" style={itemStyle}>Overview</a>
          <a href="#" style={itemStyle}>Components</a>
          <a href="#" style={itemStyle}>Tokens</a>
        </span>
      </span>
      <a href="#" style={{ ...topBarNavStyle, color: idleColor }}>Components</a>
      <a href="#" style={{ ...topBarNavStyle, color: idleColor }}>Tokens</a>
      <a href="#" style={{ ...topBarNavStyle, color: idleColor }}>Support</a>
    </React.Fragment>
  );
}

export const TopBarCard = {
  name: 'TopBar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div style={{ background: 'var(--color-semantic-background-normal-alternative)', padding: 20, fontFamily: 'var(--font-sans)' }}>
      <div data-theme="light" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <TopBar
          navAlign="center"
          brand={<Lockup variant="inline" tone="ink" height={22} />}
          actions={<IconButton variant="ghost" label="Search" style={{ background: 'transparent', border: 'none', color: 'var(--color-semantic-label-normal)' }}>{SearchIcon}</IconButton>}
        >
          <TopBarStaticNav />
        </TopBar>
      </div>
      <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <TopBar
          dark
          navAlign="center"
          brand={<Lockup variant="inline" tone="white" height={22} />}
          actions={<IconButton variant="ghost" label="Search" style={{ background: 'transparent', border: 'none', color: 'var(--color-semantic-brand-on-surface)' }}>{SearchIcon}</IconButton>}
        >
          <TopBarStaticNav dark />
        </TopBar>
      </div>
    </div>
  ),
};
