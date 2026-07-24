import React from 'react';

const colors = {
  ink: 'var(--color-semantic-label-strong)',
  text: 'var(--color-semantic-label-normal)',
  muted: 'var(--color-semantic-label-neutral)',
  line: 'var(--color-semantic-line-solid-normal)',
  surface: 'var(--color-semantic-background-normal-alternative)',
  positive: 'var(--color-semantic-positive-normal)',
  negative: 'var(--color-semantic-negative-normal)',
};

const sectionStyle = {
  display: 'grid',
  gap: 'var(--space-4)',
  paddingTop: 'var(--space-7)',
  scrollMarginTop: 24,
};

const headingStyle = {
  margin: 0,
  color: colors.ink,
  fontSize: 'clamp(1.25rem, 2vw, 1.625rem)',
  lineHeight: 1.25,
};

const panelStyle = {
  minWidth: 0,
  padding: 'clamp(16px, 3vw, 24px)',
  border: `1px solid ${colors.line}`,
  borderRadius: 'var(--radius-xl)',
  background: 'var(--color-semantic-background-normal-normal)',
};

function Badge({ children, tone = 'neutral' }) {
  const palette = {
    neutral: ['var(--color-semantic-fill-normal)', colors.text],
    signal: ['var(--color-semantic-primary-surface-normal)', 'var(--color-semantic-primary-strong)'],
    positive: ['var(--color-semantic-positive-surface-normal)', 'var(--color-semantic-positive-normal)'],
  };
  const [background, color] = palette[tone] || palette.neutral;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 28,
        padding: '3px 10px',
        borderRadius: '999px',
        background,
        color,
        fontSize: 'var(--caption-size)',
        fontWeight: 700,
        lineHeight: 1.35,
      }}
    >
      {children}
    </span>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ display: 'grid', gap: 10, margin: 0, paddingInlineStart: 20, color: colors.text, lineHeight: 1.65 }}>
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function Table({ label, columns, rows }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      data-component-guide-table
      style={{
        overflowX: 'auto',
        border: `1px solid ${colors.line}`,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', color: colors.text }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                style={{
                  padding: '11px 14px',
                  borderBottom: `1px solid ${colors.line}`,
                  background: colors.surface,
                  color: colors.ink,
                  fontSize: 'var(--caption-size)',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                }}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row[0]}`}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${cellIndex}-${String(cell).slice(0, 24)}`}
                  style={{
                    padding: '12px 14px',
                    borderBottom: rowIndex === rows.length - 1 ? 'none' : `1px solid ${colors.line}`,
                    verticalAlign: 'top',
                    lineHeight: 1.55,
                    fontSize: 'var(--body2-size)',
                  }}
                >
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

function DecisionPanel({ title, items, kind }) {
  const positive = kind === 'do';
  const color = positive ? colors.positive : colors.negative;
  return (
    <section style={{ ...panelStyle, borderTop: `4px solid ${color}` }}>
      <h3 style={{ margin: 0, color, fontSize: 'var(--headline2-size)' }}>{title}</h3>
      <BulletList items={items} />
    </section>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} style={sectionStyle}>
      <h2 style={headingStyle}>{title}</h2>
      {children}
    </section>
  );
}

export function ComponentGuide({ guide, showExample = true }) {
  if (!guide) return null;
  const propertyRows = guide.properties.length
    ? guide.properties.map((property) => [
      <code key={`${property.name}-name`}>{property.name}</code>,
      <code key={`${property.name}-type`} style={{ whiteSpace: 'normal' }}>
        {property.type}
      </code>,
      property.required ? '필수' : '선택',
      property.description,
    ])
    : [['—', '—', '—', '별도의 공개 prop 없이 children 또는 기본 HTML 계약을 사용합니다.']];

  return (
    <article data-component-guide data-component-guide-slug={guide.slug} style={{ width: '100%', maxWidth: 1180, minWidth: 0, margin: '0 auto' }}>
      <header style={{ display: 'grid', gap: 'var(--space-4)', padding: 'clamp(20px, 4vw, 40px)', borderRadius: 'var(--radius-2xl)', background: colors.surface }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Badge tone="signal">{guide.layer} / {guide.family}</Badge>
          <Badge tone="positive">React 구현 완료</Badge>
          <Badge>{guide.platformStatus.figma === 'mapped' ? 'Figma 매핑' : 'Figma 상태 미추적'}</Badge>
        </div>
        <h1 style={{ margin: 0, color: colors.ink, fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.04, letterSpacing: '-0.035em' }}>
          {guide.title}
        </h1>
        <p style={{ maxWidth: 820, margin: 0, color: colors.text, fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.75 }}>
          {guide.purpose}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {guide.ownerComponents.map((component) => <Badge key={component}>{component}</Badge>)}
        </div>
      </header>

      <nav aria-label={`${guide.title} 문서 목차`} style={{ position: 'sticky', top: 0, zIndex: 2, display: 'flex', gap: 6, marginTop: 12, padding: '10px 0', overflowX: 'auto', background: 'var(--color-semantic-background-normal-normal)' }}>
        {[
          ['decision', '사용 판단'],
          ['anatomy', 'Anatomy'],
          ['api', 'Properties'],
          ['behavior', 'Behavior'],
          ['accessibility', 'Accessibility'],
          ['dos-donts', "Do / Don't"],
          ['reference', 'Reference'],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            style={{
              flex: '0 0 auto',
              padding: '7px 11px',
              border: `1px solid ${colors.line}`,
              borderRadius: '999px',
              color: colors.text,
              background: 'var(--color-semantic-background-normal-normal)',
              fontSize: 'var(--caption-size)',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <Section id="decision" title="언제 사용해야 하나요?">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
          <DecisionPanel title="사용합니다" items={guide.useWhen} kind="do" />
          <DecisionPanel title="사용하지 않습니다" items={guide.avoidWhen} kind="dont" />
        </div>
      </Section>

      <Section id="anatomy" title="Anatomy와 상태">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 390px), 1fr))', gap: 16, alignItems: 'start' }}>
          <Table label={`${guide.title} anatomy`} columns={['Part', 'Contract']} rows={guide.anatomy.map((row) => [row.part, row.rule])} />
          <Table label={`${guide.title} states`} columns={['State', 'Contract']} rows={guide.states.map((row) => [row.state, row.rule])} />
        </div>
      </Section>

      <Section id="api" title="Properties">
        <Table label={`${guide.title} public properties`} columns={['Name', 'Type', 'Required', 'Contract']} rows={propertyRows} />
      </Section>

      <Section id="behavior" title="Behavior와 정량 규칙">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: 16, alignItems: 'start' }}>
          <div style={panelStyle}>
            <h3 style={{ margin: '0 0 14px', color: colors.ink }}>Interaction</h3>
            <BulletList items={guide.behavior} />
          </div>
          <Table label={`${guide.title} quantitative rules`} columns={['Subject', 'Rule']} rows={guide.quantitativeRules.map((row) => [row.subject, row.rule])} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
          {[
            ['Responsive', guide.responsive],
            ['Content & writing', guide.contentGuidance],
            ['Exceptions', guide.exceptions],
          ].map(([title, items]) => (
            <section key={title} style={panelStyle}>
              <h3 style={{ margin: '0 0 14px', color: colors.ink }}>{title}</h3>
              <BulletList items={items} />
            </section>
          ))}
        </div>
      </Section>

      <Section id="accessibility" title="Accessibility">
        <div style={{ ...panelStyle, borderInlineStart: '4px solid var(--color-semantic-primary-normal)' }}>
          <BulletList items={guide.accessibility} />
        </div>
      </Section>

      <Section id="dos-donts" title="Do / Don't">
        <div style={{ display: 'grid', gap: 16 }}>
          {Array.from({ length: guide.doDont.length / 2 }, (_, index) => {
            const positive = guide.doDont[index * 2];
            const negative = guide.doDont[index * 2 + 1];
            return (
              <div key={positive[1]} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
                <DecisionPanel title="Do" items={[positive[1]]} kind="do" />
                <DecisionPanel title="Don't" items={[negative[1]]} kind="dont" />
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="reference" title="Related, tokens와 API">
        <Table
          label={`${guide.title} related components`}
          columns={['Component', 'Relationship']}
          rows={guide.related.map((row) => [
            <code key={`${row.component}-related`}>{row.component}</code>,
            row.relationship,
          ])}
        />
        <details style={panelStyle}>
          <summary style={{ cursor: 'pointer', color: colors.ink, fontWeight: 800 }}>Token과 source 계약 보기</summary>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20, marginTop: 18 }}>
            <div>
              <h3 style={{ color: colors.ink }}>Tokens</h3>
              <BulletList items={guide.tokens.slice(0, 24)} />
            </div>
            <div>
              <h3 style={{ color: colors.ink }}>API sources</h3>
              <BulletList items={guide.apiLinks} />
            </div>
            <div>
              <h3 style={{ color: colors.ink }}>Migration</h3>
              <BulletList items={guide.migration} />
            </div>
          </div>
        </details>
        {showExample ? (
          <details style={panelStyle}>
            <summary style={{ cursor: 'pointer', color: colors.ink, fontWeight: 800 }}>코드 예제 보기</summary>
            {guide.examples.map((example) => (
              <section key={example.label} style={{ marginTop: 18 }}>
                <h3 style={{ color: colors.ink }}>{example.label}</h3>
                <pre style={{ margin: 0, padding: 16, overflowX: 'auto', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-normal-alternative)', color: colors.text }}>
                  <code>{example.code}</code>
                </pre>
              </section>
            ))}
          </details>
        ) : null}
      </Section>
    </article>
  );
}

const componentGuideModules = import.meta.glob('../docs/components/runtime/*.json');

export function ComponentGuideForStory({ slug }) {
  const [guide, setGuide] = React.useState(null);
  React.useEffect(() => {
    let active = true;
    const load = componentGuideModules[`../docs/components/runtime/${slug}.json`];
    if (!load) {
      setGuide(false);
      return () => {
        active = false;
      };
    }
    load().then((module) => {
      if (active) setGuide(module.default || module);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (guide === false) return null;
  if (!guide) {
    return (
      <div role="status" aria-live="polite" style={{ padding: 20, color: colors.muted }}>
        컴포넌트 결정 가이드를 불러오는 중입니다.
      </div>
    );
  }
  return <ComponentGuide guide={guide} />;
}

export async function verifyComponentGuideAtNarrowWidth(canvasElement) {
  const root = canvasElement.querySelector('[data-component-guide]');
  if (!root) throw new Error('Component guide root is required.');
  const headings = root.querySelectorAll('h2');
  if (headings.length < 7) throw new Error(`Component guide requires at least 7 major sections; received ${headings.length}.`);
  const links = root.querySelectorAll('nav a');
  if (links.length < 7) throw new Error('Component guide contents navigation is incomplete.');
  const documentElement = canvasElement.ownerDocument.documentElement;
  if (documentElement.scrollWidth > documentElement.clientWidth) {
    throw new Error(`Component guide created page overflow: ${documentElement.scrollWidth}/${documentElement.clientWidth}.`);
  }
  const tables = [...root.querySelectorAll('[data-component-guide-table]')];
  if (!tables.length || tables.some((table) => table.tabIndex !== 0)) {
    throw new Error('Every component guide table must expose a focusable horizontal-scroll region.');
  }
}
