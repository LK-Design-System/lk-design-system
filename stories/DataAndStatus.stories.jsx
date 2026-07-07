import React from 'react';
import { Icon, MetricCard } from '../src/index.js';

const meta = {
  title: 'LK Product Extension/Data/Dashboard Metrics',
  parameters: {
    docs: {
      description: {
        component: '대시보드에 노출되는 KPI 지표 예시입니다.',
      },
    },
  },
};

export default meta;

export const Metrics = {
  name: '지표',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, width: 'min(820px, 100%)' }}>
      <MetricCard label="완료율" value="99.7%" delta={1.8} caption="지난주 대비" icon={<Icon name="circle-check" size={22} />} />
      <MetricCard label="활성 사용자" value="24" delta="stable" deltaTone="flat" caption="3개 그룹 기준" icon={<Icon name="persons" size={22} />} />
      <MetricCard label="알림" value="3" delta={-12} caption="열린 이슈" icon={<Icon name="triangle-exclamation" size={22} />} />
    </div>
  ),
};
