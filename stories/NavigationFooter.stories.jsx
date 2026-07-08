import React from 'react';
import { Footer } from '../src/index.js';
import { FooterCard as FooterCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Footer',
  parameters: {
    docs: {
      description: {
        component: 'Footer patterns for site-level information, support links, and compact app footers.',
      },
    },
  },
};

export default meta;

export const FooterPatterns = {
  name: 'Footer patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        <Footer
          links={[
            { label: 'Support', href: '#' },
            { label: 'Release notes', href: '#' },
            { label: 'Privacy', href: '#' },
          ]}
        />
      </section>
      <Footer
        compact
        copyright="Copyright 2026 LK ROBOTICS Inc."
        links={[
          { label: 'Support', href: '#' },
          { label: 'Docs', href: '#' },
        ]}
      />
    </main>
  ),
};

export const FooterCard = { ...FooterCardStory, name: 'Footer card parity', tags: ['!dev', 'visual-parity'] };
