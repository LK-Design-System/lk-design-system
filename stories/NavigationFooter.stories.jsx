import React from 'react';
import { Footer } from '../src/index.js';
import { FooterCard as FooterCardStory } from './NavigationFull.shared.jsx';

const meta = {
  title: 'WDS Core/3 Component/6 Navigation/Footer',
  parameters: {
    docs: {
      description: {
        component: '제품 하단 영역과 보조 링크를 구성하는 Footer 패턴입니다.',
      },
    },
  },
};

export default meta;

export const FooterPatterns = {
  name: '푸터 패턴',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        <Footer
          links={[
            { label: '고객지원', href: '#' },
            { label: '릴리즈 노트', href: '#' },
            { label: '개인정보 처리방침', href: '#' },
          ]}
        />
      </section>
      <Footer
        compact
        copyright="Copyright 2026 LK ROBOTICS Inc."
        links={[
          { label: '지원', href: '#' },
          { label: '약관', href: '#' },
        ]}
      />
    </main>
  ),
};

export const FooterCard = { ...FooterCardStory, name: "Footer card parity", tags: ['!dev', 'visual-parity'] };
