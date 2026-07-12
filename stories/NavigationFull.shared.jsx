import React from 'react';
import {
  Breadcrumb,
  Footer,
  Icon,
  Lockup,
  SideNav,
  Steps,
  Tabs,
  UserMenu,
} from '../src/index.js';

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
