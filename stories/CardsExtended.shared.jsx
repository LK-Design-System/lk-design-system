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

export const ProductAndContentCards = {
  name: '제품과 콘텐츠 카드',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <ProductCard
          id="Core Kit"
          description="토큰, 컴포넌트, 문서 예제를 하나의 패키지로 제공합니다."
        />
        <NewsCard
          category="보도자료"
          title="디자인 시스템 문서 개편"
          excerpt="카드 안에서 제목, 요약, 출처, 액션의 위계를 확인하는 예제입니다."
          source="Design System"
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
  padding: 24,
  background: 'var(--color-semantic-brand-surface)',
  border: '1px solid var(--color-semantic-brand-on-surface-border)',
  borderRadius: 'var(--radius-2xl)',
  boxShadow: 'var(--shadow-xl)',
  overflow: 'hidden',
};

export const ProductCardCard = {
  name: 'ProductCard card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 700, height: 420, background: 'var(--color-semantic-background-normal-alternative)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={productStageStyle}>
        <div style={{ width: 250 }}>
          <ProductCard
            id="Core Kit"
            description="기본 컴포넌트와 토큰을 한 번에 확인."
            href="#"
          />
        </div>
        <div style={{ width: 250 }}>
          <ProductCard
            id="Docs Kit"
            description="가이드와 예제를 함께 제공."
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
    <div data-visual-crop-root style={{ width: 700, height: 460, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <NewsCard
          category="릴리스"
          title="컴포넌트 문서 업데이트"
          excerpt="선택, 상태, 오버레이 컴포넌트 예제를 디자인 시스템 기준으로 정리했습니다."
          source="Design System"
          date="2026.02.11"
          cta="자세히"
        />
        <NewsCard
          category="R&D"
          title="접근성 점검 항목 확장"
          excerpt="키보드 이동, 라벨, 색상 대비를 스토리별로 확인할 수 있게 정리했습니다."
          source="운영 노트"
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
          icon={<Icon name="layers" size={22} />}
          title="정보 위계 정리"
        >
          제목, 본문, 액션의 우선순위를 컴포넌트 안에서 일관되게 유지합니다.
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

      <section style={{ maxWidth: 560 }}>
        <ul style={{ display: 'grid', gap: 'var(--space-3)', listStyle: 'none', margin: 0, padding: 0 }}>
          <ChecklistItem>상태 라벨 표시</ChecklistItem>
          <ChecklistItem>권한별 액션 분리</ChecklistItem>
          <ChecklistItem cross muted>
            임의 색상 사용
          </ChecklistItem>
        </ul>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <dl style={{ margin: 0 }}>
            <SpecRow grouped label="상태" value="active / review / disabled" />
            <SpecRow grouped label="밀도" value="compact / regular" />
            <SpecRow grouped label="테마" value="light / dark" divider={false} />
          </dl>
        </div>
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Stat value="24" label="컴포넌트" accent="signal" />
          <Stat value="99.7" unit="%" label="검증 완료율" stacked />
        </div>
      </section>
    </main>
  ),
};

const specRows = [
  { label: '크기', value: '520 × 420 × 490 mm' },
  { label: '밀도', value: 'compact · regular' },
  { label: '상태', value: 'active · review · disabled' },
  { label: '테마', value: 'light · dark' },
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
    <div data-visual-crop-root style={{ width: 360, height: 220, background: 'var(--color-semantic-background-normal-alternative)', padding: 24, boxSizing: 'border-box' }}>
      <Card elevation="md" interactive style={{ width: 300 }}>
        <FeatureCard tone="signal" icon={CompassIcon} title="명확한 구조">
          반복되는 제목, 본문, 보조 정보를 같은 간격과 위계로 정렬합니다.
        </FeatureCard>
      </Card>
    </div>
  ),
};

function SpecsBlock() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 6 }}>
        <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--color-semantic-label-alternative)' }}>
          제원 · Specifications
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, fontVariantNumeric: 'tabular-nums', color: 'var(--color-semantic-label-alternative)' }}>
          CORE
        </span>
      </div>
      <dl style={{ margin: 0 }}>
        {specRows.map((row, i) => <SpecRow grouped key={row.label} label={row.label} value={row.value} divider={i !== specRows.length - 1} />)}
      </dl>
    </div>
  );
}

function DarkSpecsBlock() {
  return (
    <div data-theme="dark">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, paddingBottom: 6 }}>
        <span style={{ fontSize: 'var(--fs-caption)', fontWeight: 'var(--fw-bold)', letterSpacing: 'var(--ls-overline)', textTransform: 'uppercase', color: 'var(--color-semantic-primary-normal)' }}>
          제원 · Specifications
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.4, fontVariantNumeric: 'tabular-nums', color: 'var(--color-semantic-inverse-label-neutral-soft)' }}>
          CORE
        </span>
      </div>
      <dl style={{ margin: 0 }}>
        {specRows.map((row, i) => <SpecRow grouped key={row.label} label={row.label} value={row.value} divider={i !== specRows.length - 1} />)}
      </dl>
    </div>
  );
}

export const SpecRowCard = {
  name: 'SpecRow card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 820, height: 400, background: 'var(--color-semantic-background-normal-alternative)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)' }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
        <div style={{ flex: 1, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xs)', padding: '22px 24px' }}>
          <SpecsBlock />
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', border: '1px solid var(--color-semantic-inverse-line-normal)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)', padding: '22px 24px', background: 'var(--color-semantic-brand-surface)' }}>
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
    <div data-visual-crop-root style={{ width: 320, height: 180, background: 'var(--color-semantic-background-normal-alternative)', padding: 24, boxSizing: 'border-box' }}>
      <Card elevation="sm" padding={22} style={{ width: 260 }}>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', margin: 0, padding: 0 }}>
          <ChecklistItem>상태 라벨 표시</ChecklistItem>
          <ChecklistItem>키보드 접근성</ChecklistItem>
          <ChecklistItem cross muted>임의 색상 사용</ChecklistItem>
        </ul>
      </Card>
    </div>
  ),
};

export const StatCard = {
  name: 'Stat card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 320, height: 180, background: 'var(--color-semantic-background-normal-alternative)', padding: 24, boxSizing: 'border-box' }}>
      <Card elevation="sm" padding={22} style={{ width: 260 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Stat value="208" label="구현 검증" accent="signal" />
          <Stat value="503" label="공개 스토리" accent="ink" />
        </div>
      </Card>
    </div>
  ),
};

export const CardCard = {
  name: 'Card card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 320, height: 160, background: 'var(--color-semantic-background-normal-alternative)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-neutral)', fontSize: 14 }}>
      <Card elevation="sm" padding={22} style={{ width: 260 }}>
        기본 서피스 카드 — elevation·padding·radius를 토큰으로 구성합니다.
      </Card>
    </div>
  ),
};
