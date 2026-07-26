import React from 'react';
import { userEvent } from 'storybook/test';
import { BottomNav, Icon, NavRail } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const preventNavigation = (event) => event.preventDefault();

const destinations = [
  { value: 'summary', label: '요약', href: '#summary', icon: <Icon name="home" size={20} />, onClick: preventNavigation },
  { value: 'resources', label: '리소스와 원격 점검 상태', href: '#resources', icon: <Icon name="layers" size={20} />, onClick: preventNavigation },
  { value: 'events', label: '이벤트', href: '#events', icon: <Icon name="bell" size={20} />, onClick: preventNavigation },
  { value: 'account', label: '계정', href: '#profile', icon: <Icon name="person" size={20} />, onClick: preventNavigation },
  { value: 'disabled', label: '비활성', href: '#disabled', icon: <Icon name="setting" size={20} />, disabled: true, onClick: preventNavigation },
];

const meta = {
  title: 'LDS Product/Navigation/Adaptive Navigation',
  tags: ['autodocs'],
  component: NavRail,
  subcomponents: { BottomNav },
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-adaptive-navigation--native-destinations',
      eyebrow: 'Product / Adaptive Navigation',
      title: '하나의 목적지 모델을 화면 폭에 맞는 탐색으로 바꿉니다',
      description:
        '데스크톱 레일과 모바일 하단에서 같은 3~5개 최상위 목적지를 유지할 때 적합합니다. 깊은 계층에는 Side Nav를, 페이지 안 섹션 이동에는 Anchor를 사용하세요.',
    },
    docs: {
      description: {
        component: '같은 평면 목적지를 데스크톱 탐색 레일과 좁은 화면 하단 탐색으로 표현하는 LK Product 계약입니다. href는 native anchor, renderLink는 router adapter에 사용합니다.',
      },
    },
  },
};

export default meta;

function AdaptiveNavigationFixture({ router = false }) {
  const [value, setValue] = React.useState('summary');
  const renderLink = router
    ? (item, { href, ...props }) => <a {...props} href={href == null ? undefined : `/app${href}`} data-router-link={item.value} />
    : undefined;

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 720 }}>
      <section aria-labelledby="rail-heading" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="rail-heading" style={{ margin: 0, fontSize: 'var(--label1-size)' }}>일반 폭 · NavRail</h2>
        <NavRail aria-label="데스크톱 주 탐색" items={destinations} value={value} onChange={setValue} renderLink={renderLink} />
      </section>

      <section aria-labelledby="bottom-heading" style={{ display: 'grid', gap: 'var(--space-3)', width: 320, maxWidth: '100%' }}>
        <h2 id="bottom-heading" style={{ margin: 0, fontSize: 'var(--label1-size)' }}>320px · BottomNav</h2>
        <BottomNav aria-label="모바일 주 탐색" items={destinations.slice(0, 4)} value={value} onChange={setValue} renderLink={renderLink} />
      </section>

      <output data-testid="selected-destination" style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>
        선택: {value}
      </output>
    </div>
  );
}

function assertNavigationContract(canvasElement, router) {
  const rail = canvasElement.querySelector('nav[aria-label="데스크톱 주 탐색"]');
  const bottom = canvasElement.querySelector('nav[aria-label="모바일 주 탐색"]');
  if (!rail || !bottom) throw new Error('Adaptive navigation must expose two named nav landmarks.');
  const railLinks = rail.querySelectorAll('a');
  const bottomLinks = bottom.querySelectorAll('a');
  if (railLinks.length !== destinations.length || bottomLinks.length !== 4) {
    throw new Error('Every href destination must render as a native or router anchor.');
  }
  if (router && (!rail.querySelector('[data-router-link="summary"]') || !bottom.querySelector('[data-router-link="summary"]'))) {
    throw new Error('renderLink must replace anchors in both adaptive navigation surfaces.');
  }
  const disabled = rail.querySelector('a[aria-disabled="true"]');
  if (!disabled || disabled.hasAttribute('href') || disabled.tabIndex !== -1) {
    throw new Error('Disabled link destinations must be non-navigable and leave the tab order.');
  }
  const longRailLabel = Array.from(rail.querySelectorAll('span')).find((node) => node.textContent === '리소스와 원격 점검 상태');
  const longBottomLabel = Array.from(bottom.querySelectorAll('span')).find((node) => node.textContent === '리소스와 원격 점검 상태');
  if (!longRailLabel || !longBottomLabel || getComputedStyle(longRailLabel).textOverflow !== 'ellipsis' || getComputedStyle(longBottomLabel).textOverflow !== 'ellipsis' || longRailLabel.scrollWidth <= longRailLabel.clientWidth || longBottomLabel.scrollWidth <= longBottomLabel.clientWidth) {
    throw new Error('Both compact navigation orientations must truncate stressed long labels.');
  }
  if (bottom.scrollWidth > bottom.clientWidth + 1 || Math.round(bottom.getBoundingClientRect().width) !== 320) {
    throw new Error('BottomNav must stay within the 320px narrow contract width.');
  }
  return { rail, bottom };
}

export const NativeDestinations = {
  name: '개요',
  parameters: storyDescription(
    '같은 목적지 목록이 NavRail과 BottomNav에서 native link로 유지되는 기본 계약입니다. 키보드 활성화, 현재 목적지 동기화, 비활성 항목 제외가 두 표현에서 같은지 확인하세요.',
  ),
  render: () => <AdaptiveNavigationFixture />,
  play: async ({ canvasElement }) => {
    const { rail } = assertNavigationContract(canvasElement, false);
    const eventLink = rail.querySelector('a[href="#events"]');
    if (!eventLink) throw new Error('The events destination must remain a native href.');
    eventLink.focus();
    await userEvent.keyboard('{Enter}');
    const output = canvasElement.querySelector('[data-testid="selected-destination"]');
    if (!output?.textContent?.includes('events') || eventLink.getAttribute('aria-current') !== 'page') {
      throw new Error('Keyboard activation must update controlled selection and aria-current.');
    }
  },
};

export const DefaultLandmarkLabel = {
  name: '기본 landmark 라벨',
  tags: ['!dev'],
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 720 }}>
      <NavRail items={destinations.slice(0, 3)} defaultValue="summary" />
      <div style={{ width: 320 }}>
        <BottomNav items={destinations.slice(0, 3)} defaultValue="summary" />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const navs = canvasElement.querySelectorAll('nav[aria-label="주 탐색"]');
    if (navs.length !== 2) {
      throw new Error('NavRail and BottomNav must default their nav landmark label to 주 탐색.');
    }
  },
};

export const RouterRenderer = {
  name: 'router link 렌더 훅',
  tags: ['!dev'],
  render: () => <AdaptiveNavigationFixture router />,
  play: async ({ canvasElement }) => {
    const { rail } = assertNavigationContract(canvasElement, true);
    const summary = rail.querySelector('[data-router-link="summary"]');
    if (!summary || !summary.getAttribute('href')?.endsWith('/app#summary')) {
      throw new Error('The router adapter must receive and remap the destination href.');
    }
  },
};

export const CompactNavigation = {
  name: '반응형 · 데스크톱 레일과 모바일 하단 탐색',
  parameters: storyDescription(
    '일반 폭의 아이콘 레일과 좁은 폭의 하단 내비게이션을 나란히 비교합니다. 목적지 순서와 라벨은 유지하면서 화면 폭에 맞게 배치만 달라지는지 확인하세요.',
  ),
  render: () => (
    <main data-compact-navigation-pattern style={{ display: 'grid', gap: 'var(--space-8)', maxWidth: 920 }}>
      <section aria-labelledby="desktop-compact-navigation" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <header style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <h2 id="desktop-compact-navigation" style={{ margin: 0, fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}>
            데스크톱 컴팩트 탐색
          </h2>
          <span style={{ fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-neutral)' }}>
            NavRail은 계층 없는 3~5개 주요 목적지를 담당합니다.
          </span>
        </header>
        <NavRail
          aria-label="데스크톱 주요 탐색"
          defaultValue="docs"
          items={[
            { value: 'home', label: '홈', icon: <Icon name="home" aria-hidden="true" /> },
            { value: 'docs', label: '문서', icon: <Icon name="document" aria-hidden="true" /> },
            { value: 'components', label: '컴포넌트', icon: <Icon name="layers" aria-hidden="true" /> },
          ]}
        />
      </section>

      <section aria-labelledby="mobile-compact-navigation" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <header style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <h2 id="mobile-compact-navigation" style={{ margin: 0, fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}>
            모바일 대체 탐색
          </h2>
          <span style={{ fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-neutral)' }}>
            BottomNav는 같은 주요 목적지를 3~5개로 줄여 제공하는 대체안입니다.
          </span>
        </header>
        <div style={{ width: 360, maxWidth: '100%', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <BottomNav
            aria-label="모바일 주요 탐색"
            defaultValue="docs"
            items={[
              { value: 'home', label: '홈', icon: <Icon name="home" size={19} aria-hidden="true" /> },
              { value: 'docs', label: '문서', icon: <Icon name="document" size={19} aria-hidden="true" /> },
              { value: 'alert', label: '알림', icon: <Icon name="bell" size={19} aria-hidden="true" /> },
            ]}
          />
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const pattern = canvasElement.querySelector('[data-compact-navigation-pattern]');
    const expectedLabels = ['데스크톱 주요 탐색', '모바일 주요 탐색'];
    if (!pattern || expectedLabels.some((label) => !pattern.querySelector(`nav[aria-label="${label}"]`))) {
      throw new Error('Compact navigation must expose desktop and mobile navigation landmarks separately.');
    }
    if (pattern.querySelector('.lk-sidenav')) {
      throw new Error('Compact navigation must remain an alternative to SideNav, not a simultaneous composition.');
    }
  },
};

export const BottomNavCard = {
  name: 'BottomNav card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [nav, setNav] = React.useState('home');
    return (
      <div data-visual-crop-root style={{ width: 360, height: 220, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ width: 320, border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ height: 90, background: 'var(--color-semantic-background-normal-alternative)' }} />
          <BottomNav
            aria-label="모바일 주요 탐색"
            value={nav}
            onChange={setNav}
            items={[
              { value: 'home', label: '홈', icon: <Icon name="home" size={22} aria-hidden="true" /> },
              { value: 'docs', label: '문서', icon: <Icon name="document" size={22} aria-hidden="true" /> },
              { value: 'alerts', label: '알림', icon: <Icon name="bell" size={22} aria-hidden="true" /> },
              { value: 'me', label: '내정보', icon: <Icon name="person" size={22} aria-hidden="true" /> },
            ]}
          />
        </div>
      </div>
    );
  },
};
