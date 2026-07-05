import React from 'react';
import { Banner, Button, Icon, MetricCard } from '../src/index.js';

const meta = {
  title: '컴포넌트/데이터와 상태',
  parameters: {
    docs: {
      description: {
        component: '대시보드에 노출되는 KPI와 상태 예시입니다.',
      },
    },
  },
};

export default meta;

export const Metrics = {
  name: '지표',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, width: 'min(820px, 100%)' }}>
      <MetricCard label="플릿 가동률" value="99.7%" delta={1.8} caption="지난주 대비" icon={<Icon name="signal" size={22} />} />
      <MetricCard label="운영 로봇" value="24" delta="stable" deltaTone="flat" caption="3개 시설 기준" icon={<Icon name="robot" size={22} />} />
      <MetricCard label="알림" value="3" delta={-12} caption="열린 이슈" icon={<Icon name="triangle-exclamation" size={22} />} />
    </div>
  ),
};

export const Banners = {
  name: '배너',
  render: () => (
    <div style={{ display: 'grid', gap: 14, width: 'min(720px, 100%)' }}>
      <Banner tone="info" title="지도 동기화 진행 중">
        최신 창고 지도가 운영 중인 로봇에 배포되고 있습니다.
      </Banner>
      <Banner
        tone="warning"
        title="배터리 임계값"
        action={<Button size="sm" variant="ghost">플릿 열기</Button>}
      >
        로봇 3대가 설정된 배터리 임계값 아래에 있습니다.
      </Banner>
      <Banner tone="success" title="미션 대기열 정상">
        예약된 모든 작업이 현재 할당되어 있습니다.
      </Banner>
    </div>
  ),
};
