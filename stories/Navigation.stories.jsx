import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { Button, Icon, IconButton, Lockup, TopBar, TopBarNavItem } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/Top Bar',
  component: TopBar,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-top-bar--top-bar-default',
      eyebrow: 'Product / Top Bar',
      title: '탑 바는 제품 전역의 브랜드·탐색·유틸리티를 한 줄로 정리합니다',
      description:
        '랜딩의 주요 섹션이나 대시보드의 전역 검색·알림을 상단에 유지할 때 적합합니다. 깊은 제품 계층에는 Top Bar 목적지를 반복하지 말고 Side Nav를 사용하세요.',
    },
    docs: {
      description: {
        component: 'TopBar는 랜딩·콘텐츠의 사이트 탐색 또는 대시보드의 전역 utility bar로 사용하는 LK Product Extension입니다. 사이드 내비게이션과 함께 쓸 때는 로고와 로컬 목적지를 반복하지 않습니다.',
      },
    },
  },
};

export default meta;

const productMenu = [
  { label: '개요', href: '#' },
  { label: '컴포넌트', href: '#' },
  { label: '토큰', href: '#' },
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

export const TopBarDefault = {
  name: '개요',
  parameters: storyDescription(
    '브랜드·주요 목적지·검색을 포함한 사이트 탐색을 밝은 표면과 어두운 표면에서 비교합니다. 두 테마에서 선택 상태와 액션 대비가 같은 위계로 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-8)', width: 'min(880px, 100%)', minWidth: 0 }}>
      <div data-theme="light" className="theme-light" style={{ position: 'relative', zIndex: 2, width: '100%', minWidth: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <TopBar
          navAlign="center"
          navigationLabel="밝은 표면 주 탐색"
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
          navigationLabel="어두운 표면 주 탐색"
          brand={<Lockup variant="inline" tone="white" height={22} />}
          actions={<IconButton variant="on-dark" label="검색" size={40} style={{ background: 'transparent', border: 'none', color: 'var(--color-semantic-inverse-label)' }}>{SearchIcon}</IconButton>}
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <TopBarNavItem active href="#" menuItems={productMenu}>개요</TopBarNavItem>
          <TopBarNavItem href="#">컴포넌트</TopBarNavItem>
          <TopBarNavItem href="#">토큰</TopBarNavItem>
          <TopBarNavItem href="#">지원</TopBarNavItem>
        </TopBar>
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const topBar = canvasElement.querySelector('[data-theme="light"] header');
    const primary = topBar?.querySelector('[data-top-bar-primary]');
    const trigger = topBar?.querySelector('[data-top-bar-menu-trigger]');
    const menu = topBar?.querySelector('[data-top-bar-menu]');
    if (!topBar || !primary || !trigger || !menu) {
      throw new Error('TopBar dropdown fixture is incomplete.');
    }
    if (primary.tagName !== 'A' || primary.getAttribute('href') !== '#') {
      throw new Error('A TopBar item with href and menuItems must preserve its primary link destination.');
    }
    if (primary.hasAttribute('aria-expanded') || trigger.tagName !== 'BUTTON') {
      throw new Error('The route link and dropdown disclosure must remain separate controls.');
    }
    if (trigger.getAttribute('aria-controls') !== menu.id || menu.tagName !== 'UL') {
      throw new Error('The disclosure must control a native navigation list.');
    }

    await userEvent.click(trigger);
    await waitForLayout(canvasElement);

    const barRect = topBar.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const view = canvasElement.ownerDocument.defaultView;
    if (trigger.getAttribute('aria-expanded') !== 'true' || menuRect.width === 0 || menuRect.height === 0) {
      throw new Error('TopBar dropdown must become visibly open from its trigger.');
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
      <TopBar navigationLabel="제품 탐색" brand={<strong>LK Console</strong>}>
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
    const items = panel ? Array.from(panel.querySelectorAll('a, button')) : [];
    if (!fixture || !wrapper || !primary || !trigger || !panel || !outside || !output || items.length !== 3) {
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
    'Side Nav가 로컬 탐색을 소유하는 대시보드에서 Top Bar를 검색·알림·사용자 작업만 담는 유틸리티 영역으로 사용합니다. 브랜드와 목적지가 중복되지 않는지 확인하세요.',
  ),
  render: () => (
    <div style={{ width: 'min(880px, 100%)', minWidth: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
      <TopBar
        aria-label="대시보드 전역 유틸리티"
        height={56}
        brand={<strong style={{ fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}>AMR 운영</strong>}
        actions={(
          <React.Fragment>
            <IconButton variant="ghost" label="전역 검색" size={36}><span aria-hidden="true">{SearchIcon}</span></IconButton>
            <IconButton variant="ghost" label="알림" size={36}><Icon name="bell" size={19} aria-hidden="true" /></IconButton>
            <Button size="sm" variant="outlined">제품 전환</Button>
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
  },
};

export const NarrowWidth = {
  name: '반응형 · 320px 브랜드와 전역 액션',
  parameters: storyDescription(
    '320px 폭에서도 브랜드와 전역 액션을 제거하지 않고, 가운데 내비가 남은 공간에서 가로 스크롤하는지 확인합니다. 좁은 화면의 SideNav 전환 자체는 DashboardShell 책임입니다.',
  ),
  render: () => (
    <div style={{ width: 'min(320px, 100%)', minWidth: 0, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
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
        style={{ borderRadius: 'var(--radius-xl)' }}
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
  const activeColor = dark ? 'var(--color-semantic-inverse-label)' : 'var(--color-semantic-primary-normal)';
  const idleColor = dark ? 'var(--color-semantic-inverse-label-neutral-soft)' : 'var(--color-semantic-label-alternative)';
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
          actions={<IconButton variant="ghost" label="Search" style={{ background: 'transparent', border: 'none', color: 'var(--color-semantic-inverse-label)' }}>{SearchIcon}</IconButton>}
        >
          <TopBarStaticNav dark />
        </TopBar>
      </div>
    </div>
  ),
};
