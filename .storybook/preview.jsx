import React from 'react';
import {
  LdsStorybookDocsStyles,
  LdsStorybookGuideLayout,
} from '@lk-design-system/lds-product/storybook';
import {
  Description,
  DocsContext,
  Subtitle,
  Title,
} from '@storybook/addon-docs/blocks';
import componentGuideIndex from '../docs/components/component-guide-index.json';
import foundationContent from '../docs/foundations/foundation-content.json';
import { ComponentGuideForStory } from '../stories/ComponentGuide.shared.jsx';
import { DesignSystemDirectory } from '../stories/DesignSystemDirectory.shared.jsx';
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
  let directPatternGuide = null;
  let docsGuide = null;
  try {
    // `attachedCSFFile` is an internal field and is no longer part of the
    // Storybook 10 DocsContext contract. Resolve the attached meta through the
    // public API, then fall back to the primary prepared story.
    const resolvedMeta = docsContext?.resolveOf?.('meta', ['meta']);
    const preparedMeta = resolvedMeta?.preparedMeta;
    const primaryStory = docsContext?.storyById?.()
      ?? docsContext?.componentStories?.()?.[0];
    const metaParameters = preparedMeta?.parameters;
    title = preparedMeta?.title ?? primaryStory?.title;
    relatedPatterns = primaryStory?.parameters?.relatedPatterns
      ?? metaParameters?.relatedPatterns
      ?? [];
    directPatternGuide = primaryStory?.parameters?.patternGuide
      ?? metaParameters?.patternGuide
      ?? null;
    docsGuide = primaryStory?.parameters?.docsGuide
      ?? metaParameters?.docsGuide
      ?? null;
  } catch {
    title = undefined;
  }
  const componentSlug = title ? componentGuideByTitle.get(title) : null;
  const foundationSlug = title ? foundationGuideByTitle.get(title) : null;
  const patternGuide = directPatternGuide ?? (title ? patternGuideByTitle.get(title) : null);

  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      {/* Component and Foundation guides are the same kind of content, so they land in the
          same place: the Docs tab, one heading level below the page title. */}
      <LdsStorybookDocsStyles />
      {componentSlug ? (
        <LdsStorybookGuideLayout data-component-guide-layout>
          <ComponentGuideForStory slug={componentSlug} embedded />
        </LdsStorybookGuideLayout>
      ) : null}
      {relatedPatterns.length ? (
        <LdsStorybookGuideLayout data-related-pattern-layout>
          <RelatedPatternLinks patterns={relatedPatterns} />
        </LdsStorybookGuideLayout>
      ) : null}
      {foundationSlug ? (
        <LdsStorybookGuideLayout data-foundation-guide-layout>
          <FoundationGuide slug={foundationSlug} sectionLevel={2} />
        </LdsStorybookGuideLayout>
      ) : null}
      {patternGuide ? (
        <LdsStorybookGuideLayout data-pattern-guide-layout>
          <PatternGuide pattern={patternGuide} sectionLevel={2} />
        </LdsStorybookGuideLayout>
      ) : null}
      {docsGuide === 'directory' ? (
        <LdsStorybookGuideLayout data-pattern-guide-layout>
          <DesignSystemDirectory guide />
        </LdsStorybookGuideLayout>
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
        '': ['LDS', 'LDS Core', 'LDS Theme', 'LDS Product'],
        'LDS Core': ['Foundation', 'Components', 'Patterns'],
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
        'LDS Product': [
          'Action',
          'Content',
          'Data',
          'Status',
          'Feedback',
          'Layout',
          'Navigation',
          'Overlay',
          'Selection and Input',
          'Communication',
          'Editor',
          'Operations Dashboard',
          'Viewer',
        ],
        'LDS Product/Data': ['Display', 'Visualization', 'Collections', 'Operations'],
        'LDS Product/Viewer': [
          'Viewer Frame',
          'Toolbar',
          '2D Map',
          '3D Viewport Frame',
          'Video Stream',
          'Floor Selector',
          'Elevator Fleet Overview',
        ],
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
