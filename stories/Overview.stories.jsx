import React from 'react';
import { Button, Icon, MetricCard } from '../src/index.js';

const meta = {
  title: '문서/개요',
  parameters: {
    docs: {
      description: {
        component:
          'LK 디자인 시스템 코어는 LK ROBOTICS 토큰, React 컴포넌트, 자산, 템플릿, 정적 미리보기의 패키지 진입점입니다.',
      },
    },
  },
};

export default meta;

const sectionStyle = {
  display: 'grid',
  gap: 20,
  width: '100%',
  maxWidth: 1040,
  minWidth: 0,
  boxSizing: 'border-box',
};

const panelStyle = {
  background: 'var(--surface-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: 'clamp(16px, 5vw, 24px)',
  boxShadow: 'var(--shadow-xs)',
  minWidth: 0,
};

export const RepositoryBaseline = {
  name: '레포 기준',
  render: () => (
    <main style={sectionStyle}>
      <header style={{ display: 'grid', gap: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--lk-accent-ink)', fontWeight: 800 }}>
          <Icon name="robot" size={22} />
          LK ROBOTICS
        </div>
        <h1 style={{ margin: 0, fontSize: 'clamp(30px, 10vw, 40px)', lineHeight: 1.08, color: 'var(--label-strong)' }}>디자인 시스템 코어</h1>
        <p style={{ margin: 0, maxWidth: 760, color: 'var(--label-neutral)', lineHeight: 1.65 }}>
          이 Storybook은 CSS 토큰, 재사용 React 컴포넌트, 로보틱스 전용 UI 패턴,
          아이콘, 패키지 사용 규칙을 문서화합니다.
        </p>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: 16, minWidth: 0 }}>
        <MetricCard label="컴포넌트" value="145" caption="React 컴포넌트 소스" />
        <MetricCard label="그룹" value="16" caption="컴포넌트 디렉터리" />
        <MetricCard label="패키지" value="0.1.0" caption="@lk-robotics/design-system-core" />
      </section>

      <section style={panelStyle}>
        <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>사용 앱 import</h2>
        <pre style={{ margin: 0, maxWidth: '100%', overflowX: 'auto', background: 'var(--fill-normal)', padding: 16, borderRadius: 'var(--radius-md)', boxSizing: 'border-box' }}>
          <code>{`import { Button, ProductCard, TopBar } from '@lk-robotics/design-system-core';
import '@lk-robotics/design-system-core/styles.css';`}</code>
        </pre>
      </section>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Button>주요 액션</Button>
        <Button variant="ghost">보조 액션</Button>
        <Button variant="dark" arrow>
          로봇 콘솔
        </Button>
      </section>
    </main>
  ),
};
