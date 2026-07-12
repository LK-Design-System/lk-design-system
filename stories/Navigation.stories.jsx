import React from 'react';
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
