import { Divider, MobileSystemBars } from '../src/index.js';

const meta = {
  title: 'LDS Core/Components/Layout/Essential and Divider',
  parameters: {
    docs: {
      description: {
        component: 'Essential 모바일 시스템 바와 Divider 변형을 다루는 레이아웃 커버리지입니다.',
      },
    },
  },
};

export default meta;

const panelStyle = {
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-frame-lg)',
  background: 'var(--color-semantic-background-elevated-normal)',
  padding: 'var(--space-5)',
  boxShadow: 'var(--shadow-xs)',
};

function PhoneMock({ platform }) {
  return (
    <div
      style={{
        width: 220,
        height: 420,
        border: '1px dashed var(--color-semantic-primary-normal)',
        borderRadius: 'var(--radius-frame-xl)',
        background: 'var(--color-semantic-background-normal-alternative)',
        overflow: 'hidden',
      }}
    >
      <MobileSystemBars platform={platform} style={{ minHeight: '100%' }} />
    </div>
  );
}

export const EssentialAndDivider = {
  name: '필수 요소와 구분선',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1100 }}>
      <header style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>
          레이아웃 / Essential + Divider
        </p>
        <h1 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title2-size)', lineHeight: 'var(--title2-line)' }}>
          레이아웃 에센셜은 제품 레이아웃 컴포넌트와 분리해 유지합니다
        </h1>
        <p style={{ margin: 0, maxWidth: 820, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>
          레이아웃 원본은 Essential 모바일 시스템 바와 Divider 변형을 정의합니다. LDS는 이를 PageHeader, Grid, 제품 전용 셸에
          녹이지 않고 작은 프리미티브로 매핑합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>Essential / iOS</h2>
          <PhoneMock platform="ios" />
        </article>
        <article style={panelStyle}>
          <h2 style={{ margin: '0 0 var(--space-3)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>Essential / Android</h2>
          <PhoneMock platform="android" />
        </article>
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 var(--space-4)', color: 'var(--color-semantic-label-strong)', fontSize: 18 }}>Divider 변형</h2>
        <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <strong style={{ color: 'var(--color-semantic-label-normal)' }}>variant = normal</strong>
            <Divider />
          </div>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <strong style={{ color: 'var(--color-semantic-label-normal)' }}>variant = thick</strong>
            <Divider variant="thick" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 56 }}>
            <strong style={{ color: 'var(--color-semantic-label-normal)' }}>vertical = true</strong>
            <Divider vertical />
            <span style={{ color: 'var(--color-semantic-label-neutral)' }}>인라인 그룹 구분선</span>
          </div>
        </div>
      </section>
    </main>
  ),
};
