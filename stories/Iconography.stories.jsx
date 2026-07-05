import React from 'react';
import { BRAND_LOGO_NAMES, BrandLogo, ICON_NAMES, Icon } from '../src/index.js';

const meta = {
  title: 'Foundations/Iconography',
  parameters: {
    docs: {
      description: {
        component: 'Core monochrome icons and full-color platform brand marks.',
      },
    },
  },
};

export default meta;

export const IconRegistry = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(132px, 1fr))', gap: 12, width: 'min(920px, 100%)' }}>
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'grid',
            placeItems: 'center',
            gap: 8,
            minHeight: 92,
            padding: 12,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-card)',
            color: 'var(--label-normal)',
          }}
        >
          <Icon name={name} />
          <code style={{ fontSize: 11, color: 'var(--label-alternative)', textAlign: 'center' }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const BrandLogos = {
  render: () => (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', maxWidth: 760 }}>
      {BRAND_LOGO_NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-card)',
          }}
        >
          <BrandLogo name={name} />
          <span style={{ fontWeight: 700, color: 'var(--label-normal)' }}>{name}</span>
        </div>
      ))}
    </div>
  ),
};
