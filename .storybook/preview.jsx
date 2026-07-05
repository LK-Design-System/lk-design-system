import React from 'react';
import '../styles.css';

const canvasShell = {
  minHeight: '100vh',
  boxSizing: 'border-box',
  padding: 'clamp(16px, 5vw, 32px)',
  background: 'var(--surface-base)',
  color: 'var(--text-body)',
  fontFamily: 'var(--font-sans)',
};

export const decorators = [
  (Story) => (
    <div style={canvasShell}>
      <Story />
    </div>
  ),
];

export const parameters = {
  layout: 'fullscreen',
  backgrounds: {
    default: 'Base',
    values: [
      { name: 'Base', value: '#f7f8fb' },
      { name: 'Card', value: '#ffffff' },
      { name: 'Navy', value: '#101828' },
    ],
  },
  docs: {
    toc: true,
  },
};
