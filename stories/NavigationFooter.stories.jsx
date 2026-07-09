import React from 'react';
import { Footer } from '../src/index.js';
import { FooterCard as FooterCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Footer',
  parameters: {
    docs: {
      description: {
        component: '사이트 정보, 지원 링크, 컴팩트 앱 푸터를 위한 Footer 패턴입니다.',
      },
    },
  },
};

export default meta;

export const FooterPatterns = {
  name: '푸터 패턴',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-semantic-line-normal-normal)' }}>
        <Footer
          links={[
            { label: '고객지원', href: '#' },
            { label: '릴리스 노트', href: '#' },
            { label: '개인정보처리방침', href: '#' },
          ]}
        />
      </section>
      <Footer
        compact
        copyright="Copyright 2026 LK ROBOTICS Inc."
        links={[
          { label: '고객지원', href: '#' },
          { label: '문서', href: '#' },
        ]}
      />
    </main>
  ),
};

export const FooterCard = { ...FooterCardStory, name: 'Footer card parity', tags: ['!dev', 'visual-parity'] };
