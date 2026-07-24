import React from 'react';
import foundationContent from '../docs/foundations/foundation-content.json';
import { storyDescription } from './StoryGuide.shared.jsx';

const foundations = new Map(foundationContent.foundations.map((foundation) => [foundation.slug, foundation]));

const sections = [
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

const bodyStyle = {
  margin: 0,
  color: 'var(--color-semantic-label-neutral)',
  lineHeight: 1.75,
};

function SectionHeading({ number, children }) {
  return (
    <div className="foundation-guide__section-heading">
      <span aria-hidden="true" className="foundation-guide__section-number">
        {String(number).padStart(2, '0')}
      </span>
      <h2>{children}</h2>
    </div>
  );
}

function Rows({ headers, rows }) {
  return (
    <div className="foundation-guide__table-scroll" tabIndex={0} aria-label={`${headers.join(', ')} 표`}>
      <table className="foundation-guide__table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${cellIndex}-${cell}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GuideSection({ id, number, title, children }) {
  return (
    <section className="foundation-guide__section" id={id}>
      <SectionHeading number={number}>{title}</SectionHeading>
      {children}
    </section>
  );
}

function BulletList({ items }) {
  return (
    <ul className="foundation-guide__list">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function DoDont({ rows }) {
  const pairs = [];
  for (let index = 0; index < rows.length; index += 2) {
    pairs.push({ doText: rows[index]?.[1], dontText: rows[index + 1]?.[1] });
  }

  return (
    <div className="foundation-guide__comparisons">
      {pairs.map(({ doText, dontText }, index) => (
        <div className="foundation-guide__comparison" key={`${doText}-${dontText}`}>
          <div className="foundation-guide__example foundation-guide__example--do">
            <strong><span aria-hidden="true">✓</span> Do</strong>
            <p>{doText}</p>
          </div>
          <div className="foundation-guide__example foundation-guide__example--dont">
            <strong><span aria-hidden="true">×</span> Don’t</strong>
            <p>{dontText}</p>
          </div>
          <span className="foundation-guide__comparison-label" aria-hidden="true">
            예시 {index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}

function ReferenceGroup({ label, items }) {
  return (
    <div className="foundation-guide__reference-group">
      <h3>{label}</h3>
      <div className="foundation-guide__chips">
        {items.map((item) => <code key={item}>{item}</code>)}
      </div>
    </div>
  );
}

function GuideStyles() {
  return (
    <style>{`
      .foundation-guide {
        width: min(920px, 100%);
        min-width: 0;
        color: var(--color-semantic-label-normal);
      }

      .foundation-guide__lead {
        max-width: 760px;
        padding: var(--space-4) var(--space-5);
        border-inline-start: 3px solid var(--color-semantic-accent-blue-text);
        background: var(--color-semantic-background-normal-alternative);
        border-radius: 0 var(--radius-md) var(--radius-md) 0;
      }

      .foundation-guide__contents {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-block: var(--space-7) var(--space-3);
        padding-block-end: var(--space-5);
        border-bottom: 1px solid var(--color-semantic-line-normal-normal);
      }

      .foundation-guide__contents a {
        display: inline-flex;
        align-items: center;
        min-height: 32px;
        padding-inline: 11px;
        border-radius: var(--radius-pill);
        background: var(--color-semantic-fill-alternative);
        color: var(--color-semantic-label-neutral);
        font-size: 12px;
        font-weight: var(--fw-medium);
        text-decoration: none;
      }

      .foundation-guide__contents a:hover,
      .foundation-guide__contents a:focus-visible {
        background: var(--color-semantic-fill-normal);
        color: var(--color-semantic-label-strong);
        outline: 2px solid transparent;
      }

      .foundation-guide__section {
        scroll-margin-top: var(--space-5);
        display: grid;
        gap: var(--space-4);
        padding-block: var(--space-7);
        border-bottom: 1px solid var(--color-semantic-line-normal-normal);
      }

      .foundation-guide__section-heading {
        display: flex;
        align-items: baseline;
        gap: var(--space-3);
      }

      .foundation-guide__section-heading h2 {
        margin: 0;
        color: var(--color-semantic-label-strong);
        font-size: var(--heading1-size);
        line-height: var(--heading1-line);
        letter-spacing: -0.015em;
      }

      .foundation-guide__section-number {
        flex: 0 0 auto;
        color: var(--color-semantic-accent-blue-text);
        font-size: 12px;
        font-weight: var(--fw-bold);
        letter-spacing: 0.08em;
      }

      .foundation-guide__list {
        display: grid;
        gap: var(--space-3);
        margin: 0;
        padding-inline-start: 22px;
        color: var(--color-semantic-label-neutral);
        line-height: 1.75;
      }

      .foundation-guide__list li::marker {
        color: var(--color-semantic-accent-blue-text);
      }

      .foundation-guide__table-scroll {
        max-width: 100%;
        overflow-x: auto;
        border-block: 1px solid var(--color-semantic-line-solid-normal);
      }

      .foundation-guide__table-scroll:focus-visible {
        outline: 2px solid var(--color-semantic-accent-blue-text);
        outline-offset: 2px;
      }

      .foundation-guide__table {
        width: 100%;
        min-width: 560px;
        border-collapse: collapse;
        font-size: 14px;
      }

      .foundation-guide__table th,
      .foundation-guide__table td {
        padding: 13px 12px;
        text-align: start;
        vertical-align: top;
        border-bottom: 1px solid var(--color-semantic-line-normal-alternative);
        line-height: 1.65;
      }

      .foundation-guide__table th {
        color: var(--color-semantic-label-alternative);
        font-size: 12px;
        font-weight: var(--fw-semibold);
      }

      .foundation-guide__table td {
        color: var(--color-semantic-label-neutral);
      }

      .foundation-guide__table td:first-child {
        color: var(--color-semantic-label-strong);
        font-weight: var(--fw-semibold);
      }

      .foundation-guide__table tbody tr:last-child td {
        border-bottom: 0;
      }

      .foundation-guide__comparisons {
        display: grid;
        gap: var(--space-4);
      }

      .foundation-guide__comparison {
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1px;
        overflow: hidden;
        border: 1px solid var(--color-semantic-line-normal-normal);
        border-radius: var(--radius-frame-lg);
        background: var(--color-semantic-line-normal-normal);
      }

      .foundation-guide__example {
        min-width: 0;
        padding: var(--space-5);
        background: var(--color-semantic-background-elevated-normal);
      }

      .foundation-guide__example strong {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-block-end: var(--space-3);
        font-size: 13px;
      }

      .foundation-guide__example strong span {
        display: inline-grid;
        place-items: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        color: white;
        font-size: 14px;
      }

      .foundation-guide__example--do strong {
        color: var(--color-semantic-status-positive-text);
      }

      .foundation-guide__example--do strong span {
        background: var(--color-semantic-status-positive);
      }

      .foundation-guide__example--dont strong {
        color: var(--color-semantic-status-negative-text);
      }

      .foundation-guide__example--dont strong span {
        background: var(--color-semantic-status-negative);
      }

      .foundation-guide__example p {
        margin: 0;
        color: var(--color-semantic-label-neutral);
        line-height: 1.65;
        overflow-wrap: anywhere;
      }

      .foundation-guide__comparison-label {
        position: absolute;
        inset: 8px 10px auto auto;
        color: var(--color-semantic-label-alternative);
        font-size: 10px;
      }

      .foundation-guide__references {
        display: grid;
        gap: var(--space-5);
        padding: var(--space-5);
        border-radius: var(--radius-frame-lg);
        background: var(--color-semantic-background-normal-alternative);
      }

      .foundation-guide__reference-group {
        display: grid;
        gap: var(--space-2);
      }

      .foundation-guide__reference-group h3 {
        margin: 0;
        color: var(--color-semantic-label-alternative);
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .foundation-guide__chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }

      .foundation-guide__chips code {
        padding: 7px 9px;
        border: 1px solid var(--color-semantic-line-normal-normal);
        border-radius: var(--radius-sm);
        background: var(--color-semantic-background-elevated-normal);
        color: var(--color-semantic-label-normal);
        font-size: 12px;
        overflow-wrap: anywhere;
      }

      @media (max-width: 640px) {
        .foundation-guide__lead {
          padding: var(--space-4);
        }

        .foundation-guide__contents {
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-block-end: var(--space-4);
        }

        .foundation-guide__contents a {
          flex: 0 0 auto;
        }

        .foundation-guide__section {
          padding-block: var(--space-6);
        }

        .foundation-guide__comparison {
          grid-template-columns: 1fr;
        }

        .foundation-guide__comparison-label {
          display: none;
        }

        .foundation-guide__table {
          min-width: 520px;
        }
      }
    `}</style>
  );
}

export function getFoundation(slug) {
  const foundation = foundations.get(slug);
  if (!foundation) throw new Error(`Unknown foundation guide: ${slug}`);
  return foundation;
}

export function FoundationGuide({ slug }) {
  const foundation = getFoundation(slug);
  return (
    <main className="foundation-guide">
      <GuideStyles />
      <div className="foundation-guide__lead">
        <p style={bodyStyle}>{foundation.purpose}</p>
      </div>
      <nav className="foundation-guide__contents" aria-label={`${foundation.title} 문서 목차`}>
        {sections.map(([id, label], index) => (
          <a key={id} href={`#${slug}-${id}`}>
            {String(index + 1).padStart(2, '0')} {label}
          </a>
        ))}
      </nav>

      <GuideSection id={`${slug}-principles`} number={1} title="목적과 원리">
        <BulletList items={foundation.principles} />
      </GuideSection>
      <GuideSection id={`${slug}-semantic-model`} number={2} title="Semantic model">
        <Rows headers={['역할', '의미']} rows={foundation.semanticModel} />
      </GuideSection>
      <GuideSection id={`${slug}-selection`} number={3} title="선택 기준">
        <Rows headers={['상황', '사용', '피함']} rows={foundation.selectionCriteria} />
      </GuideSection>
      <GuideSection id={`${slug}-rules`} number={4} title="정량 규칙">
        <Rows headers={['항목', '기준']} rows={foundation.quantitativeRules} />
      </GuideSection>
      <GuideSection id={`${slug}-do-dont`} number={5} title="Do / Don’t">
        <DoDont rows={foundation.doDont} />
      </GuideSection>
      <GuideSection id={`${slug}-exceptions`} number={6} title="예외">
        <BulletList items={foundation.exceptions} />
      </GuideSection>
      <GuideSection id={`${slug}-accessibility`} number={7} title="접근성">
        <BulletList items={foundation.accessibility} />
      </GuideSection>
      <GuideSection id={`${slug}-internationalization`} number={8} title="국제화">
        <BulletList items={foundation.internationalization} />
      </GuideSection>
      <GuideSection id={`${slug}-examples`} number={9} title="LDS 예시">
        <Rows headers={['상황', '결정']} rows={foundation.examples} />
      </GuideSection>
      <GuideSection id={`${slug}-references`} number={10} title="토큰과 API">
        <div className="foundation-guide__references">
          <ReferenceGroup label="Tokens" items={foundation.tokens} />
          <ReferenceGroup label="APIs and surfaces" items={foundation.apis} />
        </div>
      </GuideSection>
    </main>
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
  const guide = canvasElement.querySelector('.foundation-guide');
  const sectionHeadings = guide?.querySelectorAll('.foundation-guide__section-heading h2') ?? [];
  const contentsLinks = guide?.querySelectorAll('.foundation-guide__contents a') ?? [];
  if (!guide || sectionHeadings.length !== 10 || contentsLinks.length !== 10) {
    throw new Error('A Foundation guide must render its purpose, ten decision sections, and ten contents links.');
  }
  if (guide.scrollWidth > guide.clientWidth + 1) {
    throw new Error('A Foundation guide must keep page-level content inside its normal or narrow canvas.');
  }
  const tableRegions = guide.querySelectorAll('.foundation-guide__table-scroll[tabindex="0"]');
  if (tableRegions.length < 4) {
    throw new Error('Wide Foundation reference tables must own a keyboard-focusable scroll region.');
  }
}
