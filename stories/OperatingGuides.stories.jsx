import React from 'react';
import { Icon } from '../src/index.js';

const meta = {
  title: 'Documents/Contracts/Operating Model',
  parameters: {
    docs: {
      description: {
        component:
          '접근성, 토큰, 컴포넌트 API, 도메인 상태 의미처럼 디자인 시스템 사용자가 지켜야 하는 계약입니다.',
      },
    },
  },
};

export default meta;

const pageStyle = {
  display: 'grid',
  gap: 'var(--space-6)',
  width: '100%',
  maxWidth: 1120,
  minWidth: 0,
  margin: '0 auto',
  color: 'var(--label-normal)',
  letterSpacing: 0,
};

const sectionStyle = {
  display: 'grid',
  gap: 'var(--space-4)',
  minWidth: 0,
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
  gap: 'var(--space-3)',
  minWidth: 0,
};

const cardStyle = {
  display: 'grid',
  gap: 'var(--space-2)',
  alignContent: 'start',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--surface-card)',
  padding: 'var(--space-4)',
  minWidth: 0,
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  background: 'var(--surface-card)',
  fontSize: 14,
  lineHeight: 1.55,
};

const accessibilityRows = [
  ['Semantic', 'native element 우선, custom role은 필요한 경우만 사용', '컴포넌트 JSX, a11y 패널'],
  ['Keyboard', 'Tab, Enter, Space, Escape, Arrow key 동작을 명시', 'Storybook interaction 또는 prompt'],
  ['Focus', 'focus visible, trap, restore, disabled focus 정책', '컴포넌트 예시와 수동 QA'],
  ['Screen reader', 'accessible name, aria state, live region 문구', 'JSX, story text'],
  ['State', 'hover, focus, selected, disabled, loading, invalid 상태', '상태 매트릭스'],
];

const tokenRows = [
  ['Primitive', '브랜드 원값, scale, effect 값', '제품 코드 직접 사용 금지'],
  ['Semantic', 'surface, text, border, action, status 의미', '일반 제품 UI에서 우선 사용'],
  ['Component', 'Button, Input, Card 같은 구현 계약', '컴포넌트 내부에서 우선 사용'],
  ['Runtime CSS', '앱 import 산출물', 'styles.css 또는 필요한 CSS entry'],
];

const componentRows = [
  ['Button', 'variant, size, disabled, loading, icon-only, on-dark', 'variants story, icon accessible name'],
  ['ChoiceCard', 'checked, unchecked, disabled, focus, keyboard selection', 'selection story, radio/checkbox semantics'],
  ['Callout', 'info, success, warning, danger, dismissible, action', 'icon size, non-color label'],
  ['SideNav', 'expanded, compact hover, selected, nested group, overflow', 'hover behavior, hidden scrollbar policy'],
  ['PageHeader', 'breadcrumb, eyebrow, title, status, meta, action alignment', 'layout page header story'],
  ['DataToolbar', 'search, filter, selected bulk action, result count, compact density', 'toolbar with grid story'],
  ['ContentEditor', 'title/body, toolbar, draft status, readonly, invalid, action slots', 'writing editor story'],
  ['TopicTree', 'expanded, collapsed, selected, nested, topic metadata', 'Tree parity, domain story'],
  ['CanvasEditorShell', 'toolbar, canvas, panel, status bar, history controls', 'editor shell story'],
  ['TelemetryValue', 'value, unit, tone, stale, timestamp, compact density, table column separation', 'numeric readout story'],
  ['ConfirmDialog', 'default, danger, warning, cancel, confirm, dismiss', 'confirmation dialog story'],
];

const domainRows = [
  ['Connection status', 'online, weak, reconnecting, offline은 색상과 텍스트를 함께 쓴다.', 'ConnectionBadge, RobotStatusCard'],
  ['Editor shell', 'toolbar, canvas, panel, status 영역을 분리하고 history action은 status 우측에 둔다.', 'CanvasEditorShell, HistoryToolbar'],
  ['Hierarchy and topic', '계층/토픽 구조는 공통 Tree, selection, density, expand affordance를 따른다.', 'Map2DCanvas, TopicTree'],
  ['Control safety', '잠김, 승인 대기, 비활성, 조작 가능 상태를 명확히 구분한다.', 'Joystick, ViewerToolbar, Callout'],
  ['Numeric readout', '숫자와 단위는 함께 읽되, 표에서는 값/상태/수집 시각을 독립 컬럼으로 분리한다.', 'TelemetryValue, TelemetryGauge, Sparkline'],
];

function Hero({ icon, eyebrow, title, description }) {
  return (
    <header style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 0 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-text)', fontWeight: 800 }}>
        <Icon name={icon} size={22} />
        <span>{eyebrow}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: 'var(--title1-size)', lineHeight: 'var(--title1-line)', color: 'var(--label-strong)' }}>{title}</h1>
      <p style={{ margin: 0, maxWidth: 780, color: 'var(--label-neutral)', lineHeight: 1.65 }}>{description}</p>
    </header>
  );
}

function Table({ columns, rows }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} style={{ textAlign: 'left', padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', color: 'var(--label-strong)' }}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, index) => (
                <td key={`${row[0]}-${index}`} style={{ padding: '12px 14px', borderTop: index === 0 ? 0 : undefined, borderBottom: '1px solid var(--border-subtle)', color: index === 0 ? 'var(--label-strong)' : 'var(--label-neutral)', verticalAlign: 'top' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContractCard({ icon, title, body, href }) {
  return (
    <article style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--accent-text)' }}>
        <Icon name={icon} size={20} />
        <strong style={{ color: 'var(--label-strong)' }}>{title}</strong>
      </div>
      <p style={{ margin: 0, color: 'var(--label-neutral)', lineHeight: 1.6 }}>{body}</p>
      {href && <code style={{ color: 'var(--label-alternative)', fontSize: 12, wordBreak: 'break-word' }}>{href}</code>}
    </article>
  );
}

function Checklist({ items }) {
  return (
    <ul style={{ display: 'grid', gap: 'var(--space-2)', margin: 0, padding: 0, listStyle: 'none' }}>
      {items.map((item) => (
        <li key={item} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 'var(--space-2)', alignItems: 'start', color: 'var(--label-neutral)', lineHeight: 1.6 }}>
          <Icon name="circle-check" size={18} color="var(--bw-green)" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export const AccessibilityContracts = {
  name: '접근성 계약',
  render: () => (
    <main style={pageStyle}>
      <Hero icon="eye" eyebrow="Accessibility" title="키보드와 보조기술 기준" description="interactive 컴포넌트는 semantic, keyboard, focus, screen reader, state 근거를 가져야 합니다." />
      <section style={sectionStyle}>
        <Table columns={['항목', '기준', '증거']} rows={accessibilityRows} />
      </section>
      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>컴포넌트 검증 기준</h2>
        <Checklist
          items={[
            'icon-only control은 accessible name을 가진다.',
            'Modal/Drawer/Sheet는 focus trap과 restore를 검증한다.',
            '상태는 색상만으로 전달하지 않는다.',
            'Storybook accessibility panel에서 blocking violation이 없다.',
          ]}
        />
      </section>
    </main>
  ),
};

export const TokenGovernance = {
  name: '토큰 거버넌스',
  render: () => (
    <main style={pageStyle}>
      <Hero icon="layers" eyebrow="Token governance" title="토큰 lifecycle과 변경 영향도" description="tokens/source.json은 Figma, Storybook, CSS runtime, AI 지시가 함께 참조하는 제품 계약입니다." />
      <Table columns={['Layer', '역할', '제품 코드 사용']} rows={tokenRows} />
      <section style={gridStyle}>
        {['proposed', 'active', 'deprecated', 'removed'].map((state) => (
          <ContractCard key={state} icon={state === 'active' ? 'circle-check' : 'circle-info'} title={state} body={state === 'deprecated' ? '대체 토큰과 migration note가 필요합니다.' : state === 'removed' ? 'major 또는 명시된 breaking release에서만 제거합니다.' : state === 'proposed' ? '실험 또는 후보 토큰입니다.' : '제품 사용 가능한 공식 토큰입니다.'} />
        ))}
      </section>
    </main>
  ),
};

export const ComponentStateMatrix = {
  name: '컴포넌트 상태 매트릭스',
  render: () => (
    <main style={pageStyle}>
      <Hero icon="document" eyebrow="Component contracts" title="API, 상태, 접근성 증거" description="각 컴포넌트는 public API와 visual state, token, accessibility evidence를 한 표로 설명해야 합니다." />
      <Table columns={['Component', 'Public states', 'Required evidence']} rows={componentRows} />
      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>금지 패턴</h2>
        <Checklist
          items={[
            'primitive token을 앱 화면에서 직접 쓰지 않는다.',
            'toolbar action icon을 새로 그리지 않고 Icon registry를 우선한다.',
            'visual parity story는 !dev와 visual-parity tag를 유지한다.',
            '상태가 많은 컴포넌트는 playground와 state matrix를 분리한다.',
          ]}
        />
      </section>
    </main>
  ),
};

export const RoboticsComponentContracts = {
  name: '도메인 컴포넌트 계약',
  render: () => (
    <main style={pageStyle}>
      <Hero icon="layers" eyebrow="Domain contracts" title="도메인 상태와 책임 경계" description="도메인 컴포넌트는 완성 화면 예시가 아니라 상태 의미, 안전 문구, 단위, editor/viewer 책임을 계약으로 공유합니다." />
      <Table columns={['영역', '기준', '관련 컴포넌트']} rows={domainRows} />
      <section style={cardStyle}>
        <h2 style={{ margin: 0, fontSize: 'var(--heading2-size)', lineHeight: 'var(--heading2-line)' }}>범위 기준</h2>
        <Checklist
          items={[
            'Storybook에는 완성된 업무 화면이 아니라 컴포넌트와 컴포넌트 상태를 둔다.',
            '완성 화면과 서비스 절차는 애플리케이션 문서에서 다룬다.',
            '도메인 safety state는 색상만으로 구분하지 않는다.',
            '표에서는 한 컬럼에 하나의 데이터 속성만 두고 값, 상태, 수집 시각을 분리한다.',
          ]}
        />
      </section>
    </main>
  ),
};
