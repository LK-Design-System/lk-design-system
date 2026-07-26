import React from 'react';
import { Footer } from '../src/index.js';
import { FooterCard as FooterCardStory } from './NavigationFull.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Navigation/Footer',
  tags: ['autodocs'],
  component: Footer,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-navigation-footer--footer-patterns',
      eyebrow: 'Product / Footer',
      title: '푸터는 화면 끝에서 보조 링크와 제품 정보를 정리합니다',
      description:
        '랜딩·콘텐츠의 법적 링크나 대시보드의 작은 제품 정보를 일관되게 제공할 때 적합합니다. 핵심 작업이나 현재 위치 탐색에는 Footer 대신 본문 CTA나 Navigation을 사용하세요.',
    },
    docs: {
      description: {
        component: 'Footer는 랜딩·콘텐츠의 전체형 정보 영역과 대시보드의 선택적 compact 메타데이터 영역을 제공하는 LK Product Extension입니다.',
      },
    },
  },
};

export default meta;

export const FooterPatterns = {
  name: '개요',
  parameters: storyDescription(
    '랜딩·콘텐츠용 전체 푸터와 대시보드용 컴팩트 푸터를 비교합니다. 제품 맥락에 따라 링크와 메타데이터 밀도만 달라지고 보조 정보의 위계가 유지되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 980 }}>
      <section aria-labelledby="full-footer-label" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="full-footer-label" style={{ margin: 0, fontSize: 'var(--body2-size)' }}>랜딩·콘텐츠용 전체형</h2>
        <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-semantic-line-normal-normal)' }}>
          <Footer
            links={[
              { label: '고객지원', href: '#' },
              { label: '릴리스 노트', href: '#' },
              { label: '개인정보처리방침', href: '#' },
            ]}
          />
        </div>
      </section>
      <section aria-labelledby="compact-footer-label" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="compact-footer-label" style={{ margin: 0, fontSize: 'var(--body2-size)' }}>대시보드용 컴팩트</h2>
        <Footer
          compact
          copyright="Copyright 2026 LK ROBOTICS Inc."
          links={[
            { label: '고객지원', href: '#' },
            { label: '문서', href: '#' },
          ]}
        />
      </section>
    </main>
  ),
};

export const FooterCard = { ...FooterCardStory, name: 'Footer card parity', tags: ['!dev', 'visual-parity'] };
