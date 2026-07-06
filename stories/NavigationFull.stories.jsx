import React from 'react';
import {
  Anchor,
  Badge,
  BottomNav,
  Breadcrumb,
  Button,
  FloorSelector,
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

const meta = {
  title: '컴포넌트/내비게이션',
  parameters: {
    docs: {
      description: {
        component: '상단, 측면, 하단, 경로, 단계, 페이지 이동을 구성하는 내비게이션 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

const navItems = [
  { heading: '운영' },
  { value: 'dashboard', label: '대시보드', icon: <Icon name="home" size={18} /> },
  {
    value: 'fleet',
    label: '플릿',
    icon: <Icon name="robot" size={18} />,
    children: [
      { value: 'robots', label: '로봇', badge: 24 },
      { value: 'missions', label: '미션', badge: 8 },
    ],
  },
  { value: 'map', label: '지도', icon: <Icon name="map" size={18} /> },
  { heading: '시스템' },
  { value: 'settings', label: '설정', icon: <Icon name="setting" size={18} /> },
];

const topBarMenuItems = [
  { label: '로봇', href: '#' },
  { label: '미션', href: '#' },
  { label: '관제 플랫폼', href: '#' },
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
        background: hover ? 'var(--lk-accent-tint-2)' : 'var(--lk-accent-tint)',
        color: 'var(--accent-text)',
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
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 1100, minWidth: 0 }}>
      <div style={{ position: 'relative', zIndex: 2, width: '100%', minWidth: 0, overflow: 'hidden', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)' }}>
        <TopBar
          navAlign="center"
          brand={<Lockup variant="inline" height={22} />}
          actions={<AccentTintAction>새 미션</AccentTintAction>}
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <TopBarNavItem active href="#" menuItems={topBarMenuItems}>플릿</TopBarNavItem>
          <TopBarNavItem href="#">지도</TopBarNavItem>
          <TopBarNavItem href="#">알림</TopBarNavItem>
        </TopBar>
      </div>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', gap: 'var(--space-5)', alignItems: 'start', minWidth: 0, overflow: 'hidden' }}>
        <SideNav
          items={navItems}
          defaultValue="robots"
          collapsible
          header={<Lockup variant="inline" height={22} />}
          headerCollapsed={<Lockup variant="mark" height={22} />}
          footer={<UserMenu name="운영자" detail="Fleet Manager" status="online" items={[{ label: '프로필' }, { label: '로그아웃', danger: true }]} />}
        />
        <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>
          <Breadcrumb items={[{ label: '홈', href: '#' }, { label: '플릿', href: '#' }, { label: 'AMR-07' }]} />
          <Tabs items={[{ value: 'status', label: '상태', count: 3 }, { value: 'log', label: '로그' }, { value: 'setting', label: '설정' }]} defaultValue="status" />
          <Steps steps={['설정', '검증', '배포']} current={1} />
          <Toolbar>
            <IconButton label="확대" size={36}><Icon name="plus" size={17} /></IconButton>
            <IconButton label="축소" size={36}><Icon name="minus" size={17} /></IconButton>
            <IconButton label="레이어" size={36}><Icon name="layers" size={17} /></IconButton>
          </Toolbar>
        </div>
      </section>
    </main>
  ),
};

export const SideNavUserMenuCard = {
  name: 'SideNav · UserMenu card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => {
    const [tab, setTab] = React.useState('fleet-patrol');
    const [collapsed, setCollapsed] = React.useState(true);
    return (
      <div data-visual-crop-root style={{ width: 330, height: 650, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
        <SideNav
          value={tab}
          onChange={setTab}
          width={252}
          overlay
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          style={{ height: 560 }}
          header={<Lockup variant="inline" color="var(--label-normal)" height={24} />}
          headerCollapsed={<Lockup variant="mark" color="var(--label-normal)" height={20} />}
          items={[
            { heading: '관제' },
            { value: 'dash', label: '대시보드', icon: <Icon name="home" size={19} /> },
            {
              value: 'fleet',
              label: '플릿',
              icon: <Icon name="setting" size={19} />,
              children: [
                { value: 'fleet-patrol', label: '순찰 로봇', badge: '8' },
                { value: 'fleet-clean', label: '청소 로봇' },
                { value: 'fleet-logi', label: '물류 로봇' },
              ],
            },
            { value: 'map', label: '맵', icon: <Icon name="location" size={19} /> },
            { heading: '운영' },
            { value: 'events', label: '이벤트', icon: <Icon name="bell" size={19} />, badge: '5' },
            { value: 'plan', label: '일정', icon: <Icon name="calendar" size={19} /> },
          ]}
          footer={
            <UserMenu
              name="김도윤"
              detail="관제 어드민"
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
          defaultValue="map"
          items={[
            { value: 'home', label: '홈', icon: <Icon name="home" /> },
            { value: 'map', label: '지도', icon: <Icon name="map" /> },
            { value: 'robot', label: '로봇', icon: <Icon name="robot" /> },
          ]}
        />
        <div style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 280 }}>
          <Anchor
            active="#map"
            items={[
              { href: '#summary', label: '요약' },
              { href: '#map', label: '지도' },
              { href: '#history', label: '기록', level: 1 },
            ]}
          />
          <FloorSelector floors={['B1', '1F', '2F', '3F']} defaultValue="2F" />
          <Pagination page={4} count={12} />
        </div>
      </section>

      <div style={{ width: 360, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <BottomNav
          defaultValue="mission"
          items={[
            { value: 'home', label: '홈', icon: <Icon name="home" size={19} /> },
            { value: 'mission', label: '미션', icon: <Icon name="route" size={19} /> },
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
      <div data-visual-crop-root style={{ width: 360, height: 220, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ width: 320, border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ height: 90, background: 'var(--bw-mist)' }} />
          <BottomNav
            value={nav}
            onChange={setNav}
            items={[
              { value: 'home', label: '홈', icon: <Icon name="home" size={22} /> },
              { value: 'fleet', label: '로봇', icon: <Icon name="setting" size={22} /> },
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
          { label: '파일', items: [{ label: '새 미션' }, { label: '내보내기', shortcut: '⌘E' }] },
          { label: '보기', items: [{ label: '지도 레이어' }, { label: '텔레메트리' }] },
        ]}
      />
      <Wizard steps={['미션', '로봇', '검증']} defaultCurrent={1}>
        {(current) => (
          <div style={{ padding: 'var(--space-5)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
            현재 단계: <Badge>{current + 1}</Badge>
          </div>
        )}
      </Wizard>
      <Footer compact />
    </main>
  ),
};

export const FooterCard = {
  name: 'Footer card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 900, height: 300, background: 'var(--bw-paper)' }}>
      <Footer />
      <div style={{ padding: '14px 20px 0' }}>
        <Footer
          compact
          copyright="© 2026 LK ROBOTICS Inc. · 관제 플랫폼 v2.4"
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
      <div data-visual-crop-root style={{ width: 520, height: 110, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'all', label: '전체', count: 24 },
            { value: 'patrol', label: '순찰' },
            { value: 'vision', label: '비전' },
            { value: 'transport', label: '운반' },
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
    <div data-visual-crop-root style={{ width: 720, height: 180, background: 'var(--bw-paper)', padding: '28px 24px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 560 }}>
        <Steps current={2} steps={['문의', '현장 실사', '설치', '관제 연동']} />
      </div>
    </div>
  ),
};

export const BreadcrumbCard = {
  name: 'Breadcrumb card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => <Breadcrumb items={[{ label: '홈', href: '#' }, { label: '제품', href: '#' }, { label: 'LKR-T1' }]} />,
};
