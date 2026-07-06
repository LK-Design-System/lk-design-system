import React from 'react';
import { IconButton, Lockup, TopBar, TopBarNavItem } from '../src/index.js';

const meta = {
  title: '컴포넌트/내비게이션',
  component: TopBar,
  parameters: {
    docs: {
      description: {
        component: '제품 및 운영 화면을 위한 application shell navigation pattern입니다.',
      },
    },
  },
};

export default meta;

const productMenu = [
  { label: '순찰 로봇', href: '#' },
  { label: '방역 로봇', href: '#' },
  { label: '관제 플랫폼', href: '#' },
];

const SearchIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const TopBarDefault = {
  name: '기본 TopBar',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-7)', width: 'min(880px, 100%)' }}>
      <div data-theme="light" className="theme-light" style={{ position: 'relative', zIndex: 2, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <TopBar
          navAlign="center"
          brand={<Lockup variant="inline" tone="ink" height={22} />}
          actions={<IconButton variant="ghost" label="검색" size={40} style={{ background: 'transparent', border: 'none', color: 'var(--label-normal)' }}>{SearchIcon}</IconButton>}
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <TopBarNavItem active href="#" menuItems={productMenu}>제품</TopBarNavItem>
          <TopBarNavItem href="#">기술</TopBarNavItem>
          <TopBarNavItem href="#">회사소개</TopBarNavItem>
          <TopBarNavItem href="#">문의</TopBarNavItem>
        </TopBar>
      </div>

      <div style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <TopBar
          dark
          navAlign="center"
          brand={<Lockup variant="inline" tone="white" height={22} />}
          actions={<IconButton variant="on-dark" label="검색" size={40} style={{ background: 'transparent', border: 'none', color: '#fff' }}>{SearchIcon}</IconButton>}
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          <TopBarNavItem active href="#" menuItems={productMenu}>제품</TopBarNavItem>
          <TopBarNavItem href="#">기술</TopBarNavItem>
          <TopBarNavItem href="#">회사소개</TopBarNavItem>
          <TopBarNavItem href="#">문의</TopBarNavItem>
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
  letterSpacing: -0.1,
  textDecoration: 'none',
};

const topBarMenuStyle = {
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translate(-50%, 4px)',
  background: 'var(--surface-card, #fff)',
  border: '1px solid var(--line-normal, #E1E2E4)',
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
  const activeColor = dark ? '#fff' : 'var(--lk-accent-ink)';
  const idleColor = dark ? 'rgba(255,255,255,0.66)' : 'var(--label-alternative)';
  const underline = dark ? 'var(--lk-accent)' : 'var(--lk-accent-ink)';
  const itemStyle = {
    padding: '10px 12px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--label-normal)',
    textDecoration: 'none',
  };

  return (
    <React.Fragment>
      <span style={{ position: 'relative', display: 'inline-flex', alignSelf: 'stretch' }}>
        <a href="#" style={{ ...topBarNavStyle, color: activeColor, boxShadow: `inset 0 -2.5px 0 ${underline}` }}>제품</a>
        <span style={topBarMenuStyle}>
          <a href="#" style={itemStyle}>순찰 로봇</a>
          <a href="#" style={itemStyle}>방역 로봇</a>
          <a href="#" style={itemStyle}>관제 플랫폼</a>
        </span>
      </span>
      <a href="#" style={{ ...topBarNavStyle, color: idleColor }}>기술</a>
      <a href="#" style={{ ...topBarNavStyle, color: idleColor }}>회사소개</a>
      <a href="#" style={{ ...topBarNavStyle, color: idleColor }}>문의</a>
    </React.Fragment>
  );
}

export const TopBarCard = {
  name: 'TopBar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div style={{ background: 'var(--bw-mist)', padding: 20, fontFamily: 'var(--font-sans)' }}>
      <div data-theme="light" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <TopBar
          navAlign="center"
          brand={<Lockup variant="inline" tone="ink" height={22} />}
          actions={<IconButton variant="ghost" label="검색" style={{ background: 'transparent', border: 'none', color: 'var(--label-normal)' }}>{SearchIcon}</IconButton>}
        >
          <TopBarStaticNav />
        </TopBar>
      </div>
      <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', marginBottom: 16 }}>
        <TopBar
          dark
          navAlign="center"
          brand={<Lockup variant="inline" tone="white" height={22} />}
          actions={<IconButton variant="ghost" label="검색" style={{ background: 'transparent', border: 'none', color: '#fff' }}>{SearchIcon}</IconButton>}
        >
          <TopBarStaticNav dark />
        </TopBar>
      </div>
    </div>
  ),
};
