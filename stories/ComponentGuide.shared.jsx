import React from 'react';
import {
  Callout,
  Chip,
  Collapsible,
  Link,
  PageHeader,
  Stack,
  Table,
  Tag,
} from '../src/index.js';
import {
  publicGuideText,
  shouldShowDecisionPanels,
  shouldRenderSectionNavigation,
  storybookManagerHref,
} from './ComponentGuide.logic.mjs';

/**
 * The component decision guide renders on every component overview page, so it is the
 * surface most likely to be read as "what LDS looks like". It is built out of the public
 * component set on purpose: a page that documents Badge, Card, Callout and Table while
 * hand-rolling its own copies of them teaches the wrong thing and drifts the moment a
 * primitive changes.
 */

/*
 * Four sections, because a component viewer is not a documentation site. These are the questions
 * a reader has while looking at the component. The exhaustive guide is already generated to
 * docs/components/guides/*.md and llms.txt, so the last section points at it instead of
 * reprinting it — that reprint was 3,400px per page, most of it text that also appeared on 147
 * other pages.
 */
const SECTIONS = [
  ['decision', '사용 판단'],
  ['api', 'Properties'],
  ['accessibility', 'Accessibility'],
  ['tokens', 'Tokens'],
];

const headingStyle = {
  margin: 0,
  color: 'var(--color-semantic-label-strong)',
  fontSize: 'var(--title3-size)',
  lineHeight: 'var(--title3-line)',
};

const subheadingStyle = {
  margin: 0,
  color: 'var(--color-semantic-label-strong)',
  fontSize: 'var(--headline2-size)',
  lineHeight: 'var(--headline2-line)',
};

function BulletList({ items }) {
  return (
    <ul
      style={{
        display: 'grid',
        gap: 'var(--space-2)',
        margin: 0,
        paddingInlineStart: 'var(--space-5)',
        color: 'var(--color-semantic-label-normal)',
        fontSize: 'var(--body2-size)',
        lineHeight: 1.65,
      }}
    >
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

/**
 * Every wide reference table owns a labelled, keyboard-reachable scroll region.
 *
 * A column whose every cell holds the same value is not a column — it is one sentence printed
 * once per row. Such a column is lifted out and stated once beneath the table, which is where a
 * fact about every row belongs.
 */
function GuideTable({ label, columns, rows, rowHeaderKey }) {
  const constant = rows.length > 1
    ? columns.filter((column) => column.key !== rowHeaderKey
      && new Set(rows.map((row) => row[column.key])).size === 1
      && String(rows[0][column.key] ?? '').trim().length > 0)
    : [];
  const constantKeys = new Set(constant.map((column) => column.key));
  const shown = columns.filter((column) => !constantKeys.has(column.key));

  return (
    <Stack gap="var(--space-2)">
      <Table
        columns={shown}
        rows={rows}
        size="sm"
        rowHeaderKey={rowHeaderKey}
        tableLabel={label}
        role="region"
        aria-label={label}
        tabIndex={0}
        data-component-guide-table
        getRowId={(row, index) => `${row[rowHeaderKey] ?? index}-${index}`}
      />
      {constant.map((column) => (
        <p
          key={column.key}
          style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}
        >
          {column.label}: {rows[0][column.key]}
        </p>
      ))}
    </Stack>
  );
}

/*
 * The panel label is a real heading and takes the same step as every other subheading in the
 * guide. It used to say `font: 'inherit'` so it would read as the callout's own title, but an
 * inline shorthand also sets font-family: that beat every stylesheet, pulled Storybook's typeface
 * into 106 of these headings, and left h3 rendering at two sizes on one page.
 */
function DecisionPanel({ title, items, kind, level }) {
  const Heading = `h${level}`;
  return (
    <Callout
      tone={kind === 'do' ? 'positive' : 'negative'}
      title={<Heading style={subheadingStyle}>{title}</Heading>}
      data-decision-panel={kind}
    >
      <BulletList items={items} />
    </Callout>
  );
}

/*
 * A token name has no space to wrap at, so a single-line pill grows a page sideways on a phone.
 * For this use it wraps and grows instead.
 */
const REFERENCE_TAG = {
  maxWidth: '100%',
  height: 'auto',
  minHeight: 'var(--component-tag-height)',
  paddingBlock: 'var(--space-0-5)',
  whiteSpace: 'normal',
  overflowWrap: 'anywhere',
  textAlign: 'start',
};

function Section({ id, title, level, children }) {
  const Heading = `h${level}`;
  return (
    // The id sits on the heading because the docs table of contents anchors to heading ids;
    // with it on the section wrapper every contents entry resolved to href="#".
    <Stack as="section" gap="var(--space-4)" style={{ paddingTop: 'var(--space-8)' }}>
      <Heading id={id} style={{ ...headingStyle, scrollMarginTop: 'var(--space-6)' }}>{title}</Heading>
      {children}
    </Stack>
  );
}

/** Auto-fit columns share one minimum so panels never collapse into a cramped column. */
function SplitGrid({ min, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${min}), 1fr))`, gap: 'var(--space-4)', alignItems: 'start' }}>
      {children}
    </div>
  );
}

/**
 * `embedded` says the host page already renders the component's title and purpose — the Docs
 * tab does. The guide then contributes only what the host has not said, so the same title is
 * never printed twice on one page.
 */
export function ComponentGuide({ guide, embedded = false }) {
  if (!guide) return null;

  // Standalone, the guide owns the page title at h1. Embedded, the host page owns it. Either
  // way the outline below the title is the same, so sections stay at h2 and panels at h3.
  const sectionLevel = 2;
  const panelLevel = 3;

  const purpose = publicGuideText(guide.purpose);
  const useWhen = guide.useWhen.map(publicGuideText).filter(Boolean);
  const avoidWhen = guide.avoidWhen.map(publicGuideText).filter(Boolean);
  const propertyRows = guide.properties.map((property) => ({
    name: property.name,
    type: property.type,
    required: property.required ? '필수' : '선택',
    description: publicGuideText(property.description),
  }));
  const stateRows = guide.states.map((row) => ({
    state: row.state,
    rule: publicGuideText(row.rule),
  }));
  const accessibilityItems = guide.accessibility.map(publicGuideText).filter(Boolean);
  const hasPropertyDescriptions = propertyRows.some((property) => property.description?.trim());
  const hasDecisionEvidence = Boolean(useWhen.length || avoidWhen.length);
  const hasDecision = Boolean(
    (purpose || hasDecisionEvidence)
    && (!guide.canonicalGuide || hasDecisionEvidence),
  );
  const hasApi = Boolean(guide.properties.length || guide.states.length);
  const hasAccessibility = accessibilityItems.length > 0;
  const hasReferences = guide.tokens.length > 0;
  const decisionTitle = '사용 판단';
  const showDecisionPanels = shouldShowDecisionPanels(useWhen, avoidWhen);
  const sections = SECTIONS.filter(([id]) => (
    (id === 'decision' && hasDecision)
    || (id === 'api' && hasApi)
    || (id === 'accessibility' && hasAccessibility)
    || (id === 'tokens' && hasReferences)
  )).map(([id, label]) => [id, id === 'decision' ? decisionTitle : label]);
  const canonicalHref = guide.canonicalGuide
    ? storybookManagerHref(guide.canonicalGuide.storybookDocsId)
    : null;

  return (
    <article
      data-component-guide
      data-component-guide-slug={guide.slug}
      style={{ width: '100%', maxWidth: 1180, minWidth: 0, margin: '0 auto' }}
    >
      {embedded ? null : (
        <PageHeader
          headingLevel={1}
          eyebrow={`${guide.layer} / ${guide.family}`}
          title={guide.title}
          description={purpose}
        />
      )}

      {guide.canonicalGuide ? (
        <Callout tone="signal" title="정본 문서" data-canonical-guide-callout>
          <strong>{guide.title}</strong>에서는 {purpose}{' '}
          공통 동작과 API의 기준은{' '}
          <Link
            href={canonicalHref}
            target="_parent"
            tone="neutral"
            underline="always"
            data-canonical-guide-link
          >
            {guide.canonicalGuide.title} 정본 열기
          </Link>
          에서 확인하세요.
        </Callout>
      ) : null}

      {hasDecision ? (
        <Section id="decision" level={sectionLevel} title={decisionTitle}>
          {purpose ? (
            <p
              data-component-guide-decision-summary
              style={{
                maxWidth: '72ch',
                margin: 0,
                color: 'var(--color-semantic-label-normal)',
                fontSize: 'var(--body1-size)',
                lineHeight: 1.7,
              }}
            >
              {purpose}
            </p>
          ) : null}
          {showDecisionPanels ? (
            <SplitGrid min="320px">
              <DecisionPanel title="사용합니다" items={useWhen} kind="do" level={panelLevel} />
              <DecisionPanel title="사용하지 않습니다" items={avoidWhen} kind="dont" level={panelLevel} />
            </SplitGrid>
          ) : (useWhen.length || avoidWhen.length) ? (
            <Collapsible title="판단 근거 자세히 보기" defaultOpen={false}>
              <Stack gap="var(--space-5)" data-component-guide-decision-evidence>
                {useWhen.length ? (
                  <Stack gap="var(--space-2)">
                    <strong style={{ color: 'var(--color-semantic-label-strong)' }}>사용 근거</strong>
                    <BulletList items={useWhen} />
                  </Stack>
                ) : null}
                {avoidWhen.length ? (
                  <Stack gap="var(--space-2)">
                    <strong style={{ color: 'var(--color-semantic-label-strong)' }}>피해야 할 경우</strong>
                    <BulletList items={avoidWhen} />
                  </Stack>
                ) : null}
              </Stack>
            </Collapsible>
          ) : null}
        </Section>
      ) : null}

      {shouldRenderSectionNavigation(sections) ? (
        <Stack
          as="nav"
          direction="row"
          gap="var(--space-2)"
          wrap
          aria-label={`${guide.title} 문서 목차`}
          style={{ marginTop: 'var(--space-4)' }}
        >
          {sections.map(([id, label]) => (
            <Chip key={id} as="a" href={`#${id}`} target="_self" size="sm">{label}</Chip>
          ))}
        </Stack>
      ) : null}

      {hasApi ? (
        <Section id="api" level={sectionLevel} title="Properties">
          <Collapsible title="API와 상태 표 보기" defaultOpen={false}>
            <Stack gap="var(--space-5)">
              {guide.properties.length ? (
                <GuideTable
                  label={`${guide.title} public properties`}
                  columns={[
                    { key: 'name', label: 'Name', render: (row) => <code>{row.name}</code> },
                    { key: 'type', label: 'Type', render: (row) => <code>{row.type}</code> },
                    { key: 'required', label: 'Required' },
                    ...(hasPropertyDescriptions ? [{ key: 'description', label: 'Contract' }] : []),
                  ]}
                  rows={propertyRows}
                  rowHeaderKey="name"
                />
              ) : null}
              {guide.states.length ? (
                <GuideTable
                  label={`${guide.title} states`}
                  columns={[{ key: 'state', label: 'State' }, { key: 'rule', label: 'Contract' }]}
                  rows={stateRows}
                  rowHeaderKey="state"
                />
              ) : null}
            </Stack>
          </Collapsible>
        </Section>
      ) : null}

      {hasAccessibility ? (
        <Section id="accessibility" level={sectionLevel} title="Accessibility">
          <Callout tone="signal" title="접근성 계약">
            <BulletList items={accessibilityItems} />
          </Callout>
        </Section>
      ) : null}

      {hasReferences ? (
        <Section id="tokens" level={sectionLevel} title="Tokens" last>
          <Collapsible title="사용 토큰 보기" defaultOpen={false}>
            <Stack direction="row" gap="var(--space-2)" wrap role="list" aria-label={`${guide.title} tokens`}>
              {guide.tokens.map((token) => (
                <Tag key={token} role="listitem" tone="neutral" style={REFERENCE_TAG}>{token}</Tag>
              ))}
            </Stack>
          </Collapsible>
        </Section>
      ) : null}
    </article>
  );
}

const componentGuideModules = import.meta.glob('../docs/components/runtime/*.json');

export function ComponentGuideForStory({ slug, embedded }) {
  const [state, setState] = React.useState({ status: 'loading', guide: null, error: null });
  React.useEffect(() => {
    let active = true;
    const load = componentGuideModules[`../docs/components/runtime/${slug}.json`];
    setState({ status: 'loading', guide: null, error: null });
    if (!load) {
      setState({
        status: 'error',
        guide: null,
        error: new Error(`No component guide runtime module exists for "${slug}".`),
      });
      return () => {
        active = false;
      };
    }
    load()
      .then((module) => {
        if (active) setState({ status: 'ready', guide: module.default || module, error: null });
      })
      .catch((error) => {
        if (active) {
          setState({
            status: 'error',
            guide: null,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (state.status === 'error') {
    return (
      <div
        role="alert"
        data-component-guide-error
        data-component-guide-slug={slug}
        style={{ padding: 'var(--space-5)', color: 'var(--color-semantic-status-negative)' }}
      >
        Component guide unavailable: {state.error?.message || slug}
      </div>
    );
  }
  if (state.status === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        data-component-guide-loading
        data-component-guide-slug={slug}
        style={{ padding: 'var(--space-5)', color: 'var(--color-semantic-label-neutral)' }}
      >
        컴포넌트 결정 가이드를 불러오는 중입니다.
      </div>
    );
  }
  return <ComponentGuide guide={state.guide} embedded={embedded} />;
}

export async function verifyComponentGuideAtNarrowWidth(canvasElement) {
  const root = canvasElement.querySelector('[data-component-guide]');
  if (!root) throw new Error('Component guide root is required.');
  // Every rendered section is represented once in the local contents navigation.
  const headings = root.querySelectorAll('h2');
  const links = root.querySelectorAll('nav a');
  const expectedLinks = headings.length > 1 ? headings.length : 0;
  if (links.length !== expectedLinks) throw new Error('Component guide contents navigation is incomplete.');
  const documentElement = canvasElement.ownerDocument.documentElement;
  if (documentElement.scrollWidth > documentElement.clientWidth) {
    throw new Error(`Component guide created page overflow: ${documentElement.scrollWidth}/${documentElement.clientWidth}.`);
  }
  const tables = [...root.querySelectorAll('[data-component-guide-table]')];
  if (!tables.length || tables.some((table) => table.tabIndex !== 0)) {
    throw new Error('Every component guide table must expose a focusable horizontal-scroll region.');
  }
}
