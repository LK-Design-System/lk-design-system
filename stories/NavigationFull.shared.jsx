import React from 'react';
import {
  Anchor,
  BottomNav,
  Breadcrumb,
  Button,
  Footer,
  Icon,
  IconButton,
  Lockup,
  Menubar,
  NavRail,
  Pagination,
  SideNav,
  Steps,
  Tabs,
  Toolbar,
  TopBar,
  TopBarNavItem,
  UserMenu,
  Wizard,
} from '../src/index.js';

const navItems = [
  { heading: '관리' },
  { value: 'dashboard', label: '대시보드', icon: <Icon name="home" size={18} /> },
  {
    value: 'content',
    label: '콘텐츠',
    icon: <Icon name="document" size={18} />,
    children: [
      { value: 'pages', label: '문서', badge: 24 },
      { value: 'reviews', label: '검토', badge: 8 },
    ],
  },
  { value: 'tokens', label: '토큰', icon: <Icon name="tag" size={18} /> },
  { heading: '시스템' },
  { value: 'settings', label: '설정', icon: <Icon name="setting" size={18} /> },
];

const topBarMenuItems = [
  { label: '문서', href: '#' },
  { label: '컴포넌트', href: '#' },
  { label: '토큰', href: '#' },
];

function AccentTintAction({ children }) {
  const [hover, setHover] = React.useState(false);

  return (
    <Button
      size="sm"
      variant="ghost"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? 'var(--color-semantic-primary-surface-strong)' : 'var(--color-semantic-primary-surface-normal)',
        color: 'var(--color-semantic-primary-normal)',
        border: 'none',
        boxShadow: 'none',
      }}
    >
      {children}
    </Button>
  );
}

export const AppNavigation = {
  name: '앱 내비게이션',
  render: () => {
    const [sideCollapsed, setSideCollapsed] = React.useState(true);

    return (
      <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 1100, minWidth: 0 }}>
        <div style={{ position: 'relative', zIndex: 2, width: '100%', minWidth: 0, overflow: 'hidden', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          <TopBar
            navAlign="center"
            brand={<Lockup variant="inline" height={22} />}
            actions={<AccentTintAction>새 항목</AccentTintAction>}
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <TopBarNavItem active href="#" menuItems={topBarMenuItems}>문서</TopBarNavItem>
            <TopBarNavItem href="#">컴포넌트</TopBarNavItem>
            <TopBarNavItem href="#">알림</TopBarNavItem>
          </TopBar>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: '64px minmax(0, 1fr)', gap: 'var(--space-5)', alignItems: 'start', minWidth: 0, overflow: 'hidden' }}>
          <SideNav
            items={navItems}
            defaultValue="pages"
            overlay
            collapsed={sideCollapsed}
            onCollapsedChange={setSideCollapsed}
            style={{ height: 312 }}
            header={<Lockup variant="inline" height={22} />}
            headerCollapsed={<Lockup variant="mark" height={22} />}
            footer={<UserMenu name="운영자" detail="관리자" status="online" collapsed={sideCollapsed} items={[{ label: '프로필' }, { label: '로그아웃', danger: true }]} />}
          />
          <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>
            <Breadcrumb items={[{ label: '홈', href: '#' }, { label: '문서', href: '#' }, { label: '개요' }]} />
            <Tabs items={[{ value: 'status', label: '상태', count: 3 }, { value: 'log', label: '로그' }, { value: 'setting', label: '설정' }]} defaultValue="status" />
            <Steps steps={['작성', '검토', '게시']} current={1} />
            <Toolbar>
              <IconButton label="확대" size={36}><Icon name="plus" size={17} /></IconButton>
              <IconButton label="축소" size={36}><Icon name="minus" size={17} /></IconButton>
              <IconButton label="레이어" size={36}><Icon name="layers" size={17} /></IconButton>
            </Toolbar>
          </div>
        </section>
      </main>
    );
  },
};

export const SideNavUserMenuCard = {
  name: 'SideNav · UserMenu card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [tab, setTab] = React.useState('docs-overview');
    const [collapsed, setCollapsed] = React.useState(true);
    return (
      <div data-visual-crop-root style={{ width: 330, height: 650, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
        <SideNav
          value={tab}
          onChange={setTab}
          width={252}
          overlay
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          style={{ height: 560 }}
          header={<Lockup variant="inline" color="var(--color-semantic-label-normal)" height={24} />}
          headerCollapsed={<Lockup variant="mark" color="var(--color-semantic-label-normal)" height={20} />}
          items={[
            { heading: '문서' },
            { value: 'dash', label: '대시보드', icon: <Icon name="home" size={19} /> },
            {
              value: 'docs',
              label: '문서',
              icon: <Icon name="document" size={19} />,
              children: [
                { value: 'docs-overview', label: '개요', badge: '8' },
                { value: 'docs-components', label: '컴포넌트' },
                { value: 'docs-tokens', label: '토큰' },
              ],
            },
            { value: 'assets', label: '자산', icon: <Icon name="layers" size={19} /> },
            { heading: '운영' },
            { value: 'events', label: '이벤트', icon: <Icon name="bell" size={19} />, badge: '5' },
            { value: 'plan', label: '일정', icon: <Icon name="calendar" size={19} /> },
          ]}
          footer={
            <UserMenu
              name="김도윤"
              detail="관리자"
              status="online"
              collapsed={collapsed}
              items={[
                { label: '프로필' },
                { label: '환경설정' },
                { divider: true },
                { label: '로그아웃', danger: true },
              ]}
            />
          }
        />
      </div>
    );
  },
};

export const CompactNavigation = {
  name: '컴팩트 내비게이션',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <section style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'start', flexWrap: 'wrap' }}>
        <NavRail
          defaultValue="docs"
          items={[
            { value: 'home', label: '홈', icon: <Icon name="home" /> },
            { value: 'docs', label: '문서', icon: <Icon name="document" /> },
            { value: 'components', label: '컴포넌트', icon: <Icon name="layers" /> },
          ]}
        />
        <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 280 }}>
          <Anchor
            active="#map"
            items={[
              { href: '#summary', label: '요약' },
              { href: '#components', label: '컴포넌트' },
              { href: '#history', label: '변경 이력', level: 1 },
            ]}
          />
          <Pagination page={4} count={12} />
        </div>
      </section>

      <div style={{ width: 360, border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <BottomNav
          defaultValue="docs"
          items={[
            { value: 'home', label: '홈', icon: <Icon name="home" size={19} /> },
            { value: 'docs', label: '문서', icon: <Icon name="document" size={19} /> },
            { value: 'alert', label: '알림', icon: <Icon name="bell" size={19} /> },
          ]}
        />
      </div>
    </main>
  ),
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
            value={nav}
            onChange={setNav}
            items={[
              { value: 'home', label: '홈', icon: <Icon name="home" size={22} /> },
              { value: 'docs', label: '문서', icon: <Icon name="document" size={22} /> },
              { value: 'alerts', label: '알림', icon: <Icon name="bell" size={22} /> },
              { value: 'me', label: '내정보', icon: <Icon name="person" size={22} /> },
            ]}
          />
        </div>
      </div>
    );
  },
};

export const MenusAndWizard = {
  name: '메뉴와 위저드',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 920 }}>
      <Menubar
        menus={[
          { label: '파일', items: [{ label: '새 문서' }, { label: '내보내기', shortcut: '⌘E' }] },
          { label: '보기', items: [{ label: '목록' }, { label: '미리보기' }] },
        ]}
      />
      <Wizard steps={['작성', '검토', '게시']} defaultCurrent={1} />
      <Footer compact />
    </main>
  ),
};

export const FooterCard = {
  name: 'Footer card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 900, height: 300, background: 'var(--color-semantic-background-normal-normal)' }}>
      <Footer />
      <div style={{ padding: '14px 20px 0' }}>
        <Footer
          compact
          copyright="© 2026 LK ROBOTICS Inc. · Design System v0.1"
          links={[{ label: '고객지원', href: '#' }, { label: '릴리스 노트', href: '#' }]}
        />
      </div>
    </div>
  ),
};

export const TabsCard = {
  name: 'Tabs card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [tab, setTab] = React.useState('all');
    return (
      <div data-visual-crop-root style={{ width: 520, height: 110, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box' }}>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'all', label: '전체', count: 24 },
            { value: 'review', label: '검토' },
            { value: 'approved', label: '승인' },
            { value: 'pending', label: '보류' },
          ]}
        />
      </div>
    );
  },
};

export const StepsCard = {
  name: 'Steps card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 720, height: 180, background: 'var(--color-semantic-background-normal-normal)', padding: '28px 24px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 560 }}>
        <Steps current={2} steps={['작성', '검토', '승인', '게시']} />
      </div>
    </div>
  ),
};

export const BreadcrumbCard = {
  name: 'Breadcrumb card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => <Breadcrumb items={[{ label: '홈', href: '#' }, { label: '문서', href: '#' }, { label: '개요' }]} />,
};
