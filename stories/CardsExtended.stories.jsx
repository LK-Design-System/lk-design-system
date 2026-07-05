import React from 'react';
import {
  ChecklistItem,
  FeatureCard,
  Icon,
  NewsCard,
  ProductCard,
  SpecRow,
  Stat,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/카드 상세',
  parameters: {
    docs: {
      description: {
        component: 'Card 계열의 제품, 기능, 스펙, 통계 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ProductAndContentCards = {
  name: '제품과 콘텐츠 카드',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <ProductCard
          id="LKR-T1"
          category="Autonomous Robot"
          description="실내 순찰과 임무 수행을 위한 자율주행 로봇 플랫폼입니다."
        />
        <NewsCard
          category="PRESS"
          title="로보틱스 운영 플랫폼 고도화"
          excerpt="관제, 지도, 상태 알림을 하나의 운영 화면에서 확인하는 카드 패턴입니다."
          source="LK ROBOTICS"
          date="2026.07.05"
          cta="읽기"
        />
      </section>
    </main>
  ),
};

export const FeatureSpecAndStats = {
  name: '기능, 스펙, 통계',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <FeatureCard
          boxed
          tone="signal"
          icon={<Icon name="lidar" size={22} />}
          title="라이다 기반 인지"
        >
          지도, 장애물, 경로 상태를 운영자가 빠르게 판단할 수 있게 정리합니다.
        </FeatureCard>
        <FeatureCard
          boxed
          tone="amber"
          icon={<Icon name="triangle-exclamation" size={22} />}
          title="위험 상태 알림"
        >
          경고와 조치가 필요한 이벤트를 차분한 상태 색상으로 분리합니다.
        </FeatureCard>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)', maxWidth: 560 }}>
        <ChecklistItem>ROS 2 토픽 상태 표시</ChecklistItem>
        <ChecklistItem>원격 제어 권한 분리</ChecklistItem>
        <ChecklistItem cross muted>
          임의 색상 사용
        </ChecklistItem>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <SpecRow label="통신" value="MQTT / ROS bridge" />
          <SpecRow label="지도" value="2D occupancy grid" />
          <SpecRow label="상태" value="online / weak / offline" />
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Stat value="24" label="운영 로봇" accent="signal" />
          <Stat value="99.7%" label="플릿 가동률" stacked />
        </div>
      </section>
    </main>
  ),
};
