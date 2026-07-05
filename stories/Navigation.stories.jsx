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
