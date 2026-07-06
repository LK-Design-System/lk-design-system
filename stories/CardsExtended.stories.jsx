import React from 'react';
import {
  Card,
  ChecklistItem,
  FeatureCard,
  Icon,
  NewsCard,
  ProductCard,
  SpecRow,
  Stat,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/카드',
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

const productStageStyle = {
  display: 'flex',
  gap: 16,
  padding: 26,
  background:
    'radial-gradient(120% 82% at 100% 0%, rgba(78, 124, 168, 0.20), transparent 56%), linear-gradient(158deg, var(--lk-stage-from) 0%, var(--lk-stage-to) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 'var(--radius-2xl)',
  boxShadow: 'var(--shadow-xl)',
  overflow: 'hidden',
};

export const ProductCardCard = {
  name: 'ProductCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 420, background: 'var(--bw-mist)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={productStageStyle}>
        <div style={{ width: 250 }}>
          <ProductCard
            id="LKR-CP"
            category="Patrol & Cleaning Robot"
            description="순찰과 청소를 하나의 플랫폼에서 수행."
            image="assets/products/lkr-cp.webp"
            href="#"
          />
        </div>
        <div style={{ width: 250 }}>
          <ProductCard
            id="LKR-T1"
            category="Patrol Robot"
            description="계단·요철 지형까지 순찰하는 점검 로봇."
            image="assets/products/lkr-t1.webp"
            imagePosition="46% 22%"
            href="#"
          />
        </div>
      </div>
    </div>
  ),
};

export const NewsCardCard = {
  name: 'NewsCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 460, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <NewsCard
          image="assets/industry/ind-defense-patrol.webp"
          category="산업 로봇"
          title="LKR-T1, 3교대 무인 순찰 현장 투입"
          excerpt="야간 시설 점검을 자동화한 첫 상용 배치."
          source="LK ROBOTICS"
          date="2026.02.11"
          cta="자세히"
        />
        <NewsCard
          category="R&D"
          title="비전 AI 결함 탐지 정확도 99.2%"
          excerpt="제조 라인 검사 모델을 현장 데이터로 재학습해 오탐을 줄였습니다. 이상 감지 시 관제로 즉시 알립니다."
          source="기술 블로그"
          date="2026.01.30"
          cta="자세히"
        />
      </div>
    </div>
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

const specRows = [
  { label: '크기', value: '520 × 420 × 490 mm' },
  { label: '배터리', value: '20Ah · 25.6V' },
  { label: '작동 시간', value: '습식 3.5h · 건식 8h' },
  { label: '청소 모드', value: '스위핑 · 진공 · 물청소' },
];

const CompassIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

export const FeatureCardCard = {
  name: 'FeatureCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 360, height: 220, background: 'var(--bw-mist)', padding: 24, boxSizing: 'border-box' }}>
      <Card elevation="md" interactive style={{ width: 300 }}>
        <FeatureCard tone="signal" icon={CompassIcon} title="자율주행">
          사전 지정 경로와 실시간 장애물 회피로 사람 개입 없이 이동합니다.
        </FeatureCard>
      </Card>
    </div>
  ),
};

function SpecsBlock() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 6 }}>
        <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--label-alternative)' }}>
          제원 · Specifications
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, fontVariantNumeric: 'tabular-nums', color: 'var(--label-assistive)' }}>
          LKR-CP
        </span>
      </div>
      {specRows.map((row) => <SpecRow key={row.label} label={row.label} value={row.value} />)}
    </div>
  );
}

function DarkSpecsBlock() {
  return (
    <div data-theme="dark">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 6 }}>
        <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--lk-accent)' }}>
          제원 · Specifications
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, fontVariantNumeric: 'tabular-nums', color: 'rgba(255, 255, 255, 0.42)' }}>
          LKR-CP
        </span>
      </div>
      {specRows.map((row) => <SpecRow key={row.label} label={row.label} value={row.value} />)}
    </div>
  );
}

export const SpecRowCard = {
  name: 'SpecRow card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 820, height: 400, background: 'var(--bw-mist)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
        <div style={{ flex: 1, background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xs)', padding: '22px 24px' }}>
          <SpecsBlock />
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)', padding: '22px 24px', background: 'radial-gradient(120% 82% at 100% 0%, rgba(78, 124, 168, 0.20), transparent 56%), linear-gradient(158deg, var(--lk-stage-from) 0%, var(--lk-stage-to) 100%)' }}>
          <DarkSpecsBlock />
        </div>
      </div>
    </div>
  ),
};

export const ChecklistItemCard = {
  name: 'ChecklistItem card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 320, height: 180, background: 'var(--bw-mist)', padding: 24, boxSizing: 'border-box' }}>
      <Card elevation="sm" padding={22} style={{ width: 260 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <ChecklistItem>순찰·청소 통합 운용</ChecklistItem>
          <ChecklistItem>EO/IR 영상 감시</ChecklistItem>
          <ChecklistItem cross muted>가격 · 장바구니</ChecklistItem>
        </div>
      </Card>
    </div>
  ),
};

export const StatCard = {
  name: 'Stat card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 320, height: 180, background: 'var(--bw-mist)', padding: 24, boxSizing: 'border-box' }}>
      <Card elevation="sm" padding={22} style={{ width: 260 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Stat value="2024" label="LK ROBOTICS 설립" accent="signal" />
          <Stat value="7" label="보유 핵심기술" accent="ink" />
        </div>
      </Card>
    </div>
  ),
};

export const CardCard = {
  name: 'Card card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 320, height: 160, background: 'var(--bw-mist)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--label-neutral)', fontSize: 14 }}>
      <Card elevation="sm" padding={22} style={{ width: 260 }}>
        기본 서피스 카드 — elevation·padding·radius를 토큰으로 구성합니다.
      </Card>
    </div>
  ),
};
