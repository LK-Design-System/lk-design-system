import React from 'react';
import { IconButton, Lockup, TopBar, TopBarNavItem } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Navigation/Top Bar',
  component: TopBar,
  parameters: {
    docs: {
      description: {
        component: '브랜드, 중앙 정렬 내비게이션, 드롭다운 항목, 액션 컨트롤을 갖춘 TopBar 내비게이션 패턴입니다.',
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const TopBarDefault = {
  name: 'TopBar 기본',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-7)', width: 'min(880px, 100%)', minWidth: 0 }}>
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
