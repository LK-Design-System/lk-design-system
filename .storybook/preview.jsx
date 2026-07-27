import React from 'react';
import {
  Description,
  DocsContext,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';
import componentGuideIndex from '../docs/components/component-guide-index.json';
import foundationContent from '../docs/foundations/foundation-content.json';
import { ComponentGuideForStory } from '../stories/ComponentGuide.shared.jsx';
import { FoundationGuide } from '../stories/FoundationGuide.shared.jsx';
import { patternGuides } from '../stories/PatternGuide.data.mjs';
import { PatternGuide } from '../stories/PatternGuide.shared.jsx';
import {
  RelatedPatternLinks,
  StoryGuide,
} from '../stories/StoryGuide.shared.jsx';

if (typeof document !== 'undefined' && !document.querySelector('link[data-lk-ds-styles]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './styles.css';
  link.dataset.lkDsStyles = 'true';
  document.head.appendChild(link);
}

/**
 * The shell every story renders inside.
 *
 * `100vh` is right on the Canvas, where the story owns the viewport. It is wrong on a Docs page,
 * where stories stack: a 40px demo becomes a 900px white box, and 24% of the whole Docs surface
 * was empty frame. The portal this replaced already knew that and cleared the height explicitly;
 * the exemption was lost when the guide moved onto the Docs tab, so it is stated here instead.
 */
const canvasShell = (viewMode) => ({
  minHeight: viewMode === 'docs' ? 0 : '100vh',
  boxSizing: 'border-box',
  padding: 'clamp(16px, 5vw, 32px)',
  background: 'var(--color-semantic-background-normal-normal)',
  color: 'var(--color-semantic-label-normal)',
  fontFamily: 'var(--font-sans)',
});

/** The typography and colour a guide needs when it is embedded outside the canvas shell. */
const guideShell = {
  marginTop: 'var(--space-8)',
  minWidth: 0,
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-semantic-label-normal)',
};

/*
 * A Docs page is one document, and a reader judges it as one: one typeface, one type ramp, one
 * rhythm. The Docs tab no longer embeds stories or Controls, so every element here belongs to
 * that document and uses the system's type and spacing scales.
 */
const DOCS_SURFACE = `
  .sbdocs-content * { font-family: var(--font-sans); }
  .sbdocs-content :is(code,pre,kbd,samp) {
    font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  }

  /* One heading ramp, whoever emitted the heading. */
  .sbdocs-content :is(h1,h2,h3,h4,h5,h6) {
    color: var(--color-semantic-label-strong);
    font-weight: 700;
    border: 0;
    padding: 0;
    text-transform: none;
    letter-spacing: normal;
  }
  .sbdocs-content h1 {
    font-size: var(--title1-size); line-height: var(--title1-line); letter-spacing: var(--title1-spacing);
    margin: 0 0 var(--space-4);
  }
  .sbdocs-content h2 {
    font-size: var(--title3-size); line-height: var(--title3-line); letter-spacing: var(--title3-spacing);
    margin: var(--space-12) 0 var(--space-5);
  }
  .sbdocs-content h3 {
    font-size: var(--headline2-size); line-height: var(--headline2-line);
    margin: var(--space-8) 0 var(--space-3);
  }

  /* Storybook's own prose sits a step below the body text the guide uses; one size for both. */
  .sbdocs-content > p,
  .sbdocs-content .sb-anchor > p {
    font-size: var(--body1-size);
    line-height: var(--body1-reading-line, var(--body1-line));
    color: var(--color-semantic-label-normal);
    margin: 0 0 var(--space-6);
  }

  /* Block rhythm on the spacing scale. Storybook's defaults are 25px and 56px, neither of which
     is a step, so the page alternated between its rhythm and the guide's 32/64. Both classes are
     on the container so this outweighs the emotion class Storybook puts on the block itself. */
  .sbdocs.sbdocs-content > * { margin-block: 0 var(--space-8); }
  .sbdocs.sbdocs-content > *:last-child { margin-block-end: 0; }
`;

/*
 * Jumping to a section instantly loses the reader's place: nothing shows which way the page
 * moved or how far. The Motion foundation declares the durations and easing for exactly this,
 * and its reduced-motion rule says continuous movement is removed rather than shortened.
 */
const DOCS_MOTION = `
  @media (prefers-reduced-motion: no-preference) {
    html:has(.sbdocs) { scroll-behavior: smooth; }
  }
  .sbdocs-toc--custom a {
    transition:
      color var(--duration-fast) var(--ease-standard),
      opacity var(--duration-fast) var(--ease-standard);
  }
`;

const darkBackgroundNames = new Set(['dark', 'navy', 'inverse']);
const darkBackgroundValues = new Set(['#101828', '#0e1329', '#0a0e1a', '#151a2b']);
const componentGuideByTitle = new Map(componentGuideIndex.map((guide) => [guide.storybookTitle, guide.slug]));
// Foundation pages are titled by the foundation they document, so the last title segment is
// the join key back to the structured guide.
const foundationGuideByTitle = new Map(
  foundationContent.foundations.map((foundation) => [`LDS Core/Foundation/${foundation.title}`, foundation.slug]),
);
const patternGuideByTitle = new Map(
  patternGuides.map((pattern) => [pattern.storybookTitle, pattern]),
);
function normalizeBackground(value) {
  if (value == null) return '';
  if (typeof value === 'object' && 'value' in value) return normalizeBackground(value.value);
  return String(value).trim().toLowerCase();
}

function isDarkBackground(value) {
  const background = normalizeBackground(value);

  if (darkBackgroundNames.has(background) || darkBackgroundValues.has(background)) {
    return true;
  }

  const hex = background.match(/^#([0-9a-f]{6})$/i);
  if (!hex) return false;

  const r = Number.parseInt(hex[1].slice(0, 2), 16);
  const g = Number.parseInt(hex[1].slice(2, 4), 16);
  const b = Number.parseInt(hex[1].slice(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance < 110;
}

function getBackgroundValue(context) {
  const backgrounds = context.globals?.backgrounds;
  return typeof backgrounds === 'object' ? backgrounds?.value : backgrounds;
}

/**
 * The Docs tab is where the decision guide belongs. A Canvas is the place you go to look at
 * the component, so it stays the component — the guide runs several thousand pixels and used
 * to bury the Button demo underneath it.
 */
function GuideDocsPage() {
  const docsContext = React.useContext(DocsContext);
  // Resolution must never throw: a docs page that cannot name its guide still keeps the
  // Storybook-authored title and description.
  let title;
  let relatedPatterns = [];
  try {
    const componentStories = docsContext?.componentStories?.() ?? [];
    const primaryStory = componentStories[0];
    title = docsContext?.attachedCSFFile?.meta?.title
      ?? primaryStory?.title;
    relatedPatterns = primaryStory?.parameters?.relatedPatterns
      ?? docsContext?.attachedCSFFile?.meta?.parameters?.relatedPatterns
      ?? [];
  } catch {
    title = undefined;
  }
  const componentSlug = title ? componentGuideByTitle.get(title) : null;
  const foundationSlug = title ? foundationGuideByTitle.get(title) : null;
  const patternGuide = title ? patternGuideByTitle.get(title) : null;

  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      {/* Component and Foundation guides are the same kind of content, so they land in the
          same place: the Docs tab, one heading level below the page title. */}
      <style>{DOCS_SURFACE}{DOCS_MOTION}</style>
      {componentSlug ? (
        <div data-theme="light" className="theme-light" data-component-guide-layout style={guideShell}>
          <ComponentGuideForStory slug={componentSlug} embedded />
        </div>
      ) : null}
      {relatedPatterns.length ? (
        <div data-theme="light" className="theme-light" data-related-pattern-layout style={guideShell}>
          <RelatedPatternLinks patterns={relatedPatterns} />
        </div>
      ) : null}
      {foundationSlug ? (
        <div data-theme="light" className="theme-light" data-foundation-guide-layout style={guideShell}>
          <FoundationGuide slug={foundationSlug} sectionLevel={2} />
        </div>
      ) : null}
      {patternGuide ? (
        <div data-theme="light" className="theme-light" data-pattern-guide-layout style={guideShell}>
          <PatternGuide pattern={patternGuide} sectionLevel={2} />
        </div>
      ) : null}
    </>
  );
}

export const decorators = [
  (Story, context) => {
    const theme = isDarkBackground(getBackgroundValue(context)) ? 'dark' : 'light';
    const guide = context.parameters?.storyGuide;
    // The canvas header is the Canvas view's page title. A Docs page already renders its own
    // title and description, so carrying the header into an embedded story preview would
    // print the same heading twice on one page.
    const showGuide = guide?.storyId === context.id
      && guide?.hideCanvasHeader !== true
      && context.viewMode !== 'docs';

    return (
      <div data-theme={theme} className={`theme-${theme}`} style={canvasShell(context.viewMode)}>
        {showGuide ? (
          <div data-story-guide-layout style={{ display: 'grid', gap: 'var(--space-6)', minWidth: 0 }}>
            <StoryGuide
              eyebrow={guide.eyebrow}
              title={guide.title}
              description={guide.description}
              relatedPatterns={context.parameters?.relatedPatterns}
            />
            <div style={{ minWidth: 0 }}>
              <Story />
            </div>
          </div>
        ) : (
          <Story />
        )}
      </div>
    );
  },
];

/*
 * Autodocs is opted into per meta, not globally: component and Foundation pages own their own
 * decision guide, and each cross-component Pattern resolves through the same guide registry.
 */

export const parameters = {
  layout: 'fullscreen',
  backgrounds: {
    default: 'Base',
    values: [
      { name: 'Base', value: '#f7f8fb' },
      { name: 'Card', value: '#ffffff' },
      { name: 'Navy', value: '#101828' },
      { name: 'Dark', value: '#0a0e1a' },
    ],
  },
  docs: {
    /*
     * Storybook's table of contents is off: its links resolve, but tocbot scrolls its own
     * container rather than the page, so it moved a single pixel and read as navigation that does
     * nothing. Each guide already renders a contents rail built from the same heading ids, and
     * that one is verified end to end by `npm run check:docs-surface --manager`. One working
     * index beats one working and one broken.
     */
    toc: false,
    page: GuideDocsPage,
  },
  options: {
    storySort: (a, b) => {
      const titleA = a.title.trim().split(/\s*\/\s*/);
      const titleB = b.title.trim().split(/\s*\/\s*/);
      const groupOrder = {
        '': ['LDS Core', 'LDS Theme', 'LDS Product'],
        'LDS Core': ['Robotics', 'Foundation', 'Components', 'Patterns'],
        'LDS Core/Foundation': [
          'Design Token',
          'Color',
          'Typography',
          'Iconography',
          'Elevation',
          'Gradient',
          'Inclusive Design',
          'International Design',
          'Layout',
          'Motion',
          'Radius',
          'Spacing',
          'State',
          'Voice and Tone',
          'Writing',
          'Aspect Ratio',
        ],
        'LDS Core/Components': ['Layout', 'Action', 'Selection and Input', 'Content', 'Navigation', 'Status', 'Overlay'],
        'LDS Theme': ['Brand', 'Controls', 'Status'],
        'LDS Product': ['Action', 'Content', 'Data', 'Status', 'Feedback', 'Layout', 'Navigation', 'Overlay', 'Selection and Input'],
        'LDS Product/Data': ['Display', 'Visualization', 'Collections', 'Operations'],
      };

      if (a.title === b.title) {
        const storyOrder = ['개요', '참조 · ', '사용법 · ', '변형·상태 · ', '상호작용 · ', '반응형 · ', '시나리오 · '];
        const storyRank = (name) => {
          const index = storyOrder.findIndex((prefix) => name === prefix.trim() || name.startsWith(prefix));
          return index === -1 ? storyOrder.length : index;
        };
        const rankA = storyRank(a.name);
        const rankB = storyRank(b.name);
        return rankA - rankB || a.name.localeCompare(b.name, 'ko', { numeric: true, sensitivity: 'accent' });
      }

      const depth = Math.max(titleA.length, titleB.length);
      for (let index = 0; index < depth; index += 1) {
        const segmentA = titleA[index];
        const segmentB = titleB[index];
        if (segmentA === segmentB) continue;
        if (segmentA == null) return -1;
        if (segmentB == null) return 1;

        const parent = titleA.slice(0, index).join('/');
        const order = groupOrder[parent] || [];
        const orderA = order.indexOf(segmentA);
        const orderB = order.indexOf(segmentB);
        if (orderA !== -1 || orderB !== -1) {
          return (orderA === -1 ? order.length : orderA) - (orderB === -1 ? order.length : orderB);
        }

        return segmentA.localeCompare(segmentB, 'en', { numeric: true, sensitivity: 'accent' });
      }

      return 0;
    },
  },
};
