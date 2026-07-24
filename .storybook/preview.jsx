import React from 'react';
import { createPortal } from 'react-dom';
import componentGuideIndex from '../docs/components/component-guide-index.json';
import { ComponentGuideForStory } from '../stories/ComponentGuide.shared.jsx';
import { StoryGuide } from '../stories/StoryGuide.shared.jsx';

if (typeof document !== 'undefined' && !document.querySelector('link[data-lk-ds-styles]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = './styles.css';
  link.dataset.lkDsStyles = 'true';
  document.head.appendChild(link);
}

const canvasShell = {
  minHeight: '100vh',
  boxSizing: 'border-box',
  padding: 'clamp(16px, 5vw, 32px)',
  background: 'var(--color-semantic-background-normal-normal)',
  color: 'var(--color-semantic-label-normal)',
  fontFamily: 'var(--font-sans)',
};

const darkBackgroundNames = new Set(['dark', 'navy', 'inverse']);
const darkBackgroundValues = new Set(['#101828', '#0e1329', '#0a0e1a', '#151a2b']);
const componentGuideByTitle = new Map(componentGuideIndex.map((guide) => [guide.storybookTitle, guide.slug]));

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

function ComponentGuidePortal({ slug, theme }) {
  const [host] = React.useState(() => {
    const element = document.createElement('div');
    element.dataset.componentGuidePortal = slug;
    return element;
  });

  React.useLayoutEffect(() => {
    const storybookRoot = document.getElementById('storybook-root');
    if (storybookRoot?.parentNode) storybookRoot.parentNode.insertBefore(host, storybookRoot);
    else document.body.appendChild(host);
    return () => host.remove();
  }, [host]);

  return createPortal(
    <div data-theme={theme} className={`theme-${theme}`} style={{ ...canvasShell, minHeight: 0 }}>
      <ComponentGuideForStory slug={slug} />
    </div>,
    host,
  );
}

export const decorators = [
  (Story, context) => {
    const theme = isDarkBackground(getBackgroundValue(context)) ? 'dark' : 'light';
    const guide = context.parameters?.storyGuide;
    const showGuide = guide?.storyId === context.id && guide?.hideCanvasHeader !== true;
    const componentGuideSlug = context.name === '개요' ? componentGuideByTitle.get(context.title) : null;
    const portalComponentGuide = componentGuideSlug && context.viewMode !== 'docs';

    return (
      <>
        {portalComponentGuide ? <ComponentGuidePortal slug={componentGuideSlug} theme={theme} /> : null}
        <div data-theme={theme} className={`theme-${theme}`} style={canvasShell}>
          {componentGuideSlug && context.viewMode === 'docs' ? (
            <div data-component-guide-layout style={{ display: 'grid', gap: 'var(--space-8)', minWidth: 0 }}>
              <ComponentGuideForStory slug={componentGuideSlug} />
              <section aria-label={`${context.title.split('/').at(-1)} live example`} style={{ display: 'grid', gap: 'var(--space-4)', minWidth: 0 }}>
                <p className="lk-overline lk-overline--signal" style={{ margin: 0 }}>Live example</p>
                <div style={{ minWidth: 0 }}>
                  <Story />
                </div>
              </section>
            </div>
          ) : showGuide ? (
            <div data-story-guide-layout style={{ display: 'grid', gap: 'var(--space-6)', minWidth: 0 }}>
              <StoryGuide
                eyebrow={guide.eyebrow}
                title={guide.title}
                description={guide.description}
                maxWidth={guide.maxWidth}
              />
              <div style={{ minWidth: 0 }}>
                <Story />
              </div>
            </div>
          ) : (
            <Story />
          )}
        </div>
      </>
    );
  },
];

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
    toc: true,
  },
  options: {
    storySort: (a, b) => {
      const titleA = a.title.trim().split(/\s*\/\s*/);
      const titleB = b.title.trim().split(/\s*\/\s*/);
      const groupOrder = {
        '': ['LDS Core', 'LDS Theme', 'LDS Product'],
        'LDS Core': ['Foundation', 'Components'],
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
        'LDS Core/Components': ['Overview', 'Progress Board', 'Layout', 'Action', 'Selection and Input', 'Content', 'Navigation', 'Status', 'Overlay'],
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
