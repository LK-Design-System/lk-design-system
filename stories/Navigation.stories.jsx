import React from 'react';
import { Button, Icon, TextButton, TopBar } from '../src/index.js';

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

export const TopBarDefault = {
  name: '기본 TopBar',
  render: () => (
    <div style={{ width: 'min(960px, 100%)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--surface-card)' }}>
      <TopBar
        brand={
          <strong style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--label-strong)' }}>
            <Icon name="robot" size={22} color="var(--lk-accent-ink)" />
            LK ROBOTICS
          </strong>
        }
        actions={<Button size="sm">새 미션</Button>}
      >
        <TextButton>플릿</TextButton>
        <TextButton>지도</TextButton>
        <TextButton>알림</TextButton>
      </TopBar>
      <div style={{ padding: 24, color: 'var(--label-neutral)' }}>
        내비게이션 컴포넌트는 내부 업무 흐름이 바뀌어도 화면 골격을 안정적으로 유지해야 합니다.
      </div>
    </div>
  ),
};
