import React from 'react';
import { Callout, Chip, Divider, Overline, Stack, Table, Tag } from '../src/index.js';
import foundationContent from '../docs/foundations/foundation-content.json';
import {
  publicFoundationContent,
  publicFoundationReferences,
} from './FoundationGuide.logic.mjs';
import { storyDescription } from './StoryGuide.shared.jsx';

/**
 * Foundation guides are the first pages a new consumer reads, so they are assembled from
 * the public component set rather than a private stylesheet. Callout carries the lead and
 * the Do/Don't pairs, Table carries every reference grid, Chip carries the contents rail,
 * and Divider separates sections — the same primitives these pages tell people to use.
 */

const foundations = new Map(foundationContent.foundations.map((foundation) => [foundation.slug, foundation]));

const SECTIONS = [
  ['principles', '목적과 원리'],
  ['semantic-model', 'Semantic model'],
  ['selection', '선택 기준'],
  ['rules', '정량 규칙'],
  ['do-dont', 'Do / Don’t'],
  ['exceptions', '예외'],
  ['accessibility', '접근성'],
  ['internationalization', '국제화'],
  ['examples', 'LDS 예시'],
  ['references', '토큰과 API'],
];

const headingStyle = {
  margin: 0,
  color: 'var(--color-semantic-label-strong)',
  fontSize: 'var(--title3-size)',
  lineHeight: 'var(--title3-line)',
};

/*
 * A reference is a token name or a file path, and neither has a space to wrap at. Tag is a
 * single-line pill by design, so one `stories/FoundationsTypography.stories.jsx` measured 412px
 * and pushed the whole Typography page sideways at phone width. For this use it wraps and grows.
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

const PRIMER_CARD = {
  minWidth: 0,
  padding: 'var(--space-4)',
  border: 'var(--border-thin) solid var(--color-semantic-line-normal-neutral)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--color-semantic-background-elevated-normal)',
  overflowWrap: 'anywhere',
};

function BulletList({ items }) {
  return (
    <ul
      style={{
        display: 'grid',
        gap: 'var(--space-3)',
        margin: 0,
        paddingInlineStart: 'var(--space-5)',
        color: 'var(--color-semantic-label-normal)',
        lineHeight: 1.75,
      }}
    >
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

/**
 * Design Token is a decision Foundation, not a visual scale. Its first viewport therefore
 * answers the two questions a consumer arrives with — how values move through the system and
 * which layer owns a new decision — before the full evidence sections begin.
 */
function DesignTokenPrimer({ foundation }) {
  return (
    <Stack
      gap="var(--space-5)"
      data-design-token-primer
      style={{
        padding: 'clamp(var(--space-4), 3vw, var(--space-6))',
        border: 'var(--border-thin) solid var(--color-semantic-line-normal-neutral)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-fill-alternative)',
      }}
    >
      <Stack gap="var(--space-3)" as="section" aria-labelledby="design-token-flow-label">
        <Overline as="span" id="design-token-flow-label">Token flow</Overline>
        <ol
          data-design-token-flow
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
            gap: 'var(--space-3)',
            margin: 0,
            padding: 0,
            listStyle: 'none',
          }}
        >
          {foundation.semanticModel.map(([role, meaning], index) => (
            <li key={role} style={PRIMER_CARD}>
              <Stack gap="var(--space-2)">
                <Tag
                  tone={index === 1 || index === 2 ? 'steel' : 'neutral'}
                  style={{ alignSelf: 'flex-start' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </Tag>
                <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{role}</strong>
                <span style={{ color: 'var(--color-semantic-label-alternative)', lineHeight: 1.6 }}>
                  {meaning}
                </span>
              </Stack>
            </li>
          ))}
        </ol>
      </Stack>

      <Divider decorative />

      <Stack gap="var(--space-3)" as="section" aria-labelledby="design-token-decision-label">
        <Overline as="span" id="design-token-decision-label">빠른 선택</Overline>
        <div
          data-design-token-decisions
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          {foundation.selectionCriteria.map(([situation, use, avoid]) => (
            <article key={situation} style={PRIMER_CARD}>
              <Stack gap="var(--space-3)">
                <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{situation}</strong>
                <Stack gap="var(--space-1)">
                  <span style={{ color: 'var(--color-semantic-label-normal)' }}>
                    <strong>사용</strong> · {use}
                  </span>
                  <span style={{ color: 'var(--color-semantic-label-alternative)' }}>
                    <strong>피함</strong> · {avoid}
                  </span>
                </Stack>
              </Stack>
            </article>
          ))}
        </div>
      </Stack>
    </Stack>
  );
}

const COLOR_ROLES = [
  {
    label: 'Primary',
    decision: '주요 행동과 현재 선택',
    color: 'var(--color-semantic-primary-normal)',
    surface: 'var(--color-semantic-primary-surface-normal)',
    token: '--color-semantic-primary-normal',
  },
  {
    label: 'Positive',
    decision: '완료와 정상 상태',
    color: 'var(--color-semantic-status-positive-foreground)',
    surface: 'var(--color-semantic-status-positive-surface)',
    token: '--color-semantic-status-positive',
  },
  {
    label: 'Caution',
    decision: '주의와 확인이 필요한 상태',
    color: 'var(--color-semantic-status-cautionary-foreground)',
    surface: 'var(--color-semantic-status-cautionary-surface)',
    token: '--color-semantic-status-cautionary',
  },
  {
    label: 'Negative',
    decision: '오류와 파괴적 결과',
    color: 'var(--color-semantic-status-negative-foreground)',
    surface: 'var(--color-semantic-status-negative-surface)',
    token: '--color-semantic-status-negative',
  },
  {
    label: 'Neutral',
    decision: '정보 위계와 비활성 맥락',
    color: 'var(--color-semantic-label-neutral)',
    surface: 'var(--color-semantic-status-neutral-surface)',
    token: '--color-semantic-label-neutral',
  },
];

/**
 * Color needs to look like a color system before it reads like a specification. This primer
 * exposes the five semantic decisions consumers make most often and keeps the exhaustive token
 * evidence in the sections below.
 */
function ColorPrimer() {
  return (
    <Stack
      gap="var(--space-4)"
      data-color-primer
      style={{
        padding: 'clamp(var(--space-4), 3vw, var(--space-6))',
        border: 'var(--border-thin) solid var(--color-semantic-line-normal-neutral)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-fill-alternative)',
      }}
    >
      <Stack gap="var(--space-2)">
        <Overline as="span">Semantic color roles</Overline>
        <p
          style={{
            maxWidth: '68ch',
            margin: 0,
            color: 'var(--color-semantic-label-normal)',
            lineHeight: 1.65,
          }}
        >
          색상값을 직접 고르지 않고, 화면에서 전달할 의미를 먼저 선택합니다.
        </p>
      </Stack>
      <div
        data-color-role-grid
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 168px), 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {COLOR_ROLES.map((role) => (
          <article
            key={role.label}
            style={{
              ...PRIMER_CARD,
              padding: 0,
              overflow: 'hidden',
              background: role.surface,
            }}
          >
            <div
              aria-hidden="true"
              style={{ height: 72, background: role.color }}
            />
            <Stack gap="var(--space-2)" style={{ padding: 'var(--space-4)' }}>
              <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{role.label}</strong>
              <span style={{ color: 'var(--color-semantic-label-normal)', lineHeight: 1.5 }}>
                {role.decision}
              </span>
              <code
                style={{
                  color: 'var(--color-semantic-label-alternative)',
                  fontSize: 'var(--caption1-size)',
                  overflowWrap: 'anywhere',
                }}
              >
                {role.token}
              </code>
            </Stack>
          </article>
        ))}
      </div>
    </Stack>
  );
}

/** Reference grids stay wide, so each owns a labelled keyboard-reachable scroll region. */
function ReferenceTable({ label, headers, rows }) {
  const columns = headers.map((header, index) => ({ key: `c${index}`, label: header }));
  const mapped = rows.map((row) => Object.fromEntries(row.map((cell, index) => [`c${index}`, cell])));
  return (
    <Table
      columns={columns}
      rows={mapped}
      size="sm"
      rowHeaderKey="c0"
      tableLabel={label}
      role="region"
      aria-label={label}
      tabIndex={0}
      data-foundation-table
      getRowId={(row, index) => `${row.c0}-${index}`}
    />
  );
}

function GuideSection({ id, title, children, last, level }) {
  const Heading = `h${level}`;
  return (
    <>
      <Stack as="section" gap="var(--space-4)" style={{ paddingBlock: 'var(--space-8)' }}>
        {/*
          The id is on the heading, not on the section wrapper, so an anchor lands on the title
          the reader is looking for rather than on the whitespace above it — and `scrollMarginTop`
          has to travel with it or the sticky docs header covers the title it just scrolled to.

          No number beside the title either — the contents rail above already numbers every
          section, and a second copy is decoration the type scale has no step for.
        */}
        <div data-foundation-heading>
          <Heading id={id} style={{ ...headingStyle, scrollMarginTop: 'var(--space-5)' }}>{title}</Heading>
        </div>
        {children}
      </Stack>
      {last ? null : <Divider decorative />}
    </>
  );
}

function DoDont({ rows }) {
  const pairs = [];
  for (let index = 0; index < rows.length; index += 2) {
    pairs.push({ doText: rows[index]?.[1], dontText: rows[index + 1]?.[1] });
  }

  return (
    <Stack gap="var(--space-4)">
      {pairs.map(({ doText, dontText }) => (
        <div
          key={`${doText}-${dontText}`}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}
        >
          <Callout tone="positive" title="Do">{doText}</Callout>
          <Callout tone="negative" title="Don’t">{dontText}</Callout>
        </div>
      ))}
    </Stack>
  );
}

/**
 * The label names a group of tags, not a section to navigate to. It stays a label rather than a
 * heading: as a heading it entered the docs table of contents, where its uppercased text was
 * wider than the rail and clipped — and it was never a destination worth listing.
 */
function ReferenceGroup({ label, items }) {
  if (items.length === 0) return null;
  const groupId = `reference-group-${label.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <Stack gap="var(--space-2)">
      <Overline as="span" id={groupId}>{label}</Overline>
      <Stack direction="row" gap="var(--space-2)" wrap role="list" aria-labelledby={groupId}>
        {items.map((item) => <Tag key={item} role="listitem" tone="neutral" style={REFERENCE_TAG}>{item}</Tag>)}
      </Stack>
    </Stack>
  );
}

export function getFoundation(slug) {
  const foundation = foundations.get(slug);
  if (!foundation) throw new Error(`Unknown foundation guide: ${slug}`);
  return foundation;
}

/**
 * `sectionLevel` is the heading level the guide's ten sections occupy. The guide has no title
 * of its own — the page it is embedded in owns that — so this is the only level it needs. On
 * the Docs tab Storybook's title block is the h1, which makes 2 the correct value.
 */
export function FoundationGuide({ slug, sectionLevel = 2 }) {
  const sourceFoundation = getFoundation(slug);
  const foundation = publicFoundationContent(sourceFoundation);
  const publicReferences = publicFoundationReferences(sourceFoundation);
  return (
    // The guide is embedded in a Docs page that already owns the page landmark, the title and
    // the specimen — which leads with this foundation's purpose. Repeating the purpose here
    // would print the same sentence twice on one page, so the guide opens on its contents.
    // Full width of the docs column, like the component guide and like every other block on
    // the page. A fixed 920 was a canvas reading measure; carried onto the Docs tab it left the
    // guide 80px short of the story frames directly above it on all 15 Foundation pages.
    <section data-foundation-guide style={{ width: '100%', minWidth: 0 }}>
      {slug === 'design-token' ? <DesignTokenPrimer foundation={foundation} /> : null}
      {slug === 'color' ? <ColorPrimer /> : null}
      <Stack
        as="nav"
        direction="row"
        gap="var(--space-2)"
        wrap
        aria-label={`${foundation.title} 문서 목차`}
        data-foundation-contents
        style={{ paddingBlock: 'var(--space-8)' }}
      >
        {/*
          target is explicit because Storybook's preview template declares
          `<base target="_parent">`. Without it every in-page anchor is resolved against that
          base, so clicking a contents chip navigates the whole manager window to the bare
          preview iframe and the sidebar disappears instead of the page scrolling.
        */}
        {SECTIONS.map(([id, label], index) => (
          <Chip key={id} as="a" href={`#${slug}-${id}`} target="_self" size="sm">
            {String(index + 1).padStart(2, '0')} {label}
          </Chip>
        ))}
      </Stack>
      <Divider decorative />

      <GuideSection level={sectionLevel} id={`${slug}-principles`} title="목적과 원리">
        <BulletList items={foundation.principles} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-semantic-model`} title="Semantic model">
        <ReferenceTable label="Semantic model" headers={['역할', '의미']} rows={foundation.semanticModel} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-selection`} title="선택 기준">
        <ReferenceTable label="선택 기준" headers={['상황', '사용', '피함']} rows={foundation.selectionCriteria} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-rules`} title="정량 규칙">
        <ReferenceTable label="정량 규칙" headers={['항목', '기준']} rows={foundation.quantitativeRules} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-do-dont`} title="Do / Don’t">
        <DoDont rows={foundation.doDont} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-exceptions`} title="예외">
        <BulletList items={foundation.exceptions} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-accessibility`} title="접근성">
        <BulletList items={foundation.accessibility} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-internationalization`} title="국제화">
        <BulletList items={foundation.internationalization} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-examples`} title="LDS 예시">
        <ReferenceTable label="LDS 예시" headers={['상황', '결정']} rows={foundation.examples} />
      </GuideSection>
      <GuideSection level={sectionLevel} id={`${slug}-references`} title="토큰과 API" last>
        <Stack gap="var(--space-5)">
          <ReferenceGroup label="Tokens" items={publicReferences.tokens} />
          <ReferenceGroup label="APIs and surfaces" items={publicReferences.apis} />
        </Stack>
      </GuideSection>
    </section>
  );
}

export function foundationGuideStory(slug, name = '개요') {
  const foundation = getFoundation(slug);
  return {
    name,
    parameters: storyDescription(
      `${foundation.title}의 원리, semantic model, 선택 기준, 정량 규칙, Do/Don’t, 예외, 접근성, 국제화, LDS 예시와 token/API 연결을 한 화면에서 확인합니다.`,
    ),
    render: () => <FoundationGuide slug={slug} />,
  };
}

export async function verifyFoundationGuideAtNarrowWidth({ canvasElement }) {
  const guide = canvasElement.querySelector('[data-foundation-guide]');
  const sectionHeadings = guide?.querySelectorAll('[data-foundation-heading] h2') ?? [];
  const contentsLinks = guide?.querySelectorAll('[data-foundation-contents] a') ?? [];
  if (!guide || sectionHeadings.length !== 10 || contentsLinks.length !== 10) {
    throw new Error('A Foundation guide must render its purpose, ten decision sections, and ten contents links.');
  }
  if (guide.scrollWidth > guide.clientWidth + 1) {
    throw new Error('A Foundation guide must keep page-level content inside its normal or narrow canvas.');
  }
  const tableRegions = guide.querySelectorAll('[data-foundation-table][tabindex="0"]');
  if (tableRegions.length < 4) {
    throw new Error('Wide Foundation reference tables must own a keyboard-focusable scroll region.');
  }
}
