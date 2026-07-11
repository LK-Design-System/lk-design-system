import React from 'react';

if (typeof document !== 'undefined' && !document.querySelector('link[data-lk-ds-styles]')) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/styles.css';
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

export const decorators = [
  (Story, context) => {
    const theme = isDarkBackground(getBackgroundValue(context)) ? 'dark' : 'light';

    return (
      <div data-theme={theme} className={`theme-${theme}`} style={canvasShell}>
        <Story />
      </div>
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
    storySort: {
      order: [
        'LDS Core',
        [
          'Foundation',
          ['Basic', 'Color', 'Typography', 'Spacing', 'Decorate', 'Icon'],
          'Components',
          [
            'Layout',
            'Action',
            'Selection and Input',
            'Content',
            'Navigation',
            'Status',
            'Feedback',
            'Overlay',
          ],
        ],
        'LDS Theme',
        ['Brand', 'Theme'],
        'LDS Product',
        ['Action', 'Content', 'Data', 'Feedback', 'Layout', 'Overlay', 'Selection and Input'],
        'LDS Robotics',
        ['Editor', 'Robotics', 'Viewer'],
      ],
    },
  },
};
