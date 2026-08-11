import React from 'react';
import { Lockup, ProductLockup } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Theme/Brand/Product Lockup',
  component: ProductLockup,
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-theme-brand-product-lockup--product-lockup-standard',
      eyebrow: 'Theme / Brand',
      title: 'LK + 제품명은 LK가 먼저 읽히는 모브랜드 우선 Product Lockup을 사용합니다',
      description:
        'LK mark는 그대로 두고 제품명을 Montserrat SemiBold 600 outline으로 낮춥니다. 제품명 visible height 1X와 mark visible 폭의 0.35 간격은 유지해 Portal의 리듬을 계승하면서 LK가 먼저 읽히게 합니다.',
      decisionGuidance: {
        useWhen: 'TopBar 또는 expanded SideNav에서 승인 registry의 제품을 LK mark와 함께 한 번 식별할 때 사용합니다.',
        avoidWhen: '미등록 제품명, 페이지 제목, workspace·환경·상태 라벨, 대외용 신규 로고 자산을 임의로 만들 때 사용하지 않습니다.',
      },
    },
    docs: {
      description: {
        component: 'ProductLockup은 LK mark를 모브랜드로 우선하고 승인 제품명을 SemiBold outline으로 조합하는 단일 SVG 컴포넌트입니다. 기존 ExtraBold LK Portal 고정 자산은 호환·비교 계약으로 별도 유지합니다.',
      },
    },
  },
};

export default meta;

const ExampleLabel = ({ children }) => (
  <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
    {children}
  </span>
);

export const ProductLockupStandard = {
  name: '표준 · 모브랜드 우선',
  parameters: storyDescription(
    '기존 ExtraBold 800 LK Portal과 새 SemiBold 600 ProductLockup Portal을 직접 비교하고, LK가 먼저 읽히는 Console·reverse·compact 조합을 확인합니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(760px, 100%)', fontFamily: 'var(--font-sans)' }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <ExampleLabel>승인 registry · full</ExampleLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-6)', padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          <ProductLockup data-testid="lockup-console" product="console" height={20} />
          <ProductLockup data-testid="lockup-portal" product="portal" height={20} />
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <ExampleLabel>Portal 위계 비교 · legacy 800 / 제안 600</ExampleLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, auto) 1fr', alignItems: 'center', columnGap: 'var(--space-4)', rowGap: 'var(--space-3)', padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
          <ExampleLabel>legacy 800</ExampleLabel>
          <Lockup data-testid="lockup-portal-fixed" variant="portal" height={20} />
          <ExampleLabel>parent-first 600</ExampleLabel>
          <ProductLockup data-testid="lockup-portal-proposal" product="portal" height={20} />
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <ExampleLabel>브랜드 네이비 · reverse</ExampleLabel>
        <div style={{ padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-brand-surface)' }}>
          <ProductLockup data-testid="lockup-reverse" product="console" appearance="reverse" height={20} />
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <ExampleLabel>접힌 rail · compact / 홈 링크</ExampleLabel>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <ProductLockup data-testid="lockup-compact" product="console" compact height={20} />
          <a data-testid="lockup-home" href="#console-home" aria-label="LK Console 홈" onClick={(event) => event.preventDefault()} style={{ display: 'inline-flex', textDecoration: 'none' }}>
            <ProductLockup data-testid="lockup-link-child" product="console" decorative height={20} />
          </a>
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const consoleLockup = canvasElement.querySelector('[data-testid="lockup-console"]');
    const portal = canvasElement.querySelector('[data-testid="lockup-portal"]');
    const fixedPortal = canvasElement.querySelector('[data-testid="lockup-portal-fixed"]');
    const proposedPortal = canvasElement.querySelector('[data-testid="lockup-portal-proposal"]');
    const reverse = canvasElement.querySelector('[data-testid="lockup-reverse"]');
    const compact = canvasElement.querySelector('[data-testid="lockup-compact"]');
    const home = canvasElement.querySelector('[data-testid="lockup-home"]');
    const linkedLockup = canvasElement.querySelector('[data-testid="lockup-link-child"]');
    if (!consoleLockup || !portal || !fixedPortal || !proposedPortal || !reverse || !compact || !home || !linkedLockup) {
      throw new Error('ProductLockup standard fixture is incomplete.');
    }

    if (consoleLockup.tagName.toLowerCase() !== 'svg' || consoleLockup.getAttribute('role') !== 'img' || consoleLockup.getAttribute('aria-label') !== 'LK Console') {
      throw new Error('A standalone full ProductLockup must expose one named SVG image.');
    }
    if (consoleLockup.getAttribute('data-product-lockup-wordmark') !== 'CONSOLE' || consoleLockup.querySelector('text')) {
      throw new Error('ProductLockup must use the approved uppercase outline and no SVG text element.');
    }
    if (consoleLockup.getAttribute('height') !== '20' || consoleLockup.getAttribute('viewBox') !== '342.60933 149.18987 480.740284 64.1628') {
      throw new Error('Console must retain the approved 20px minimum and generated outline viewBox.');
    }
    if (consoleLockup.querySelector('[data-product-lockup-wordmark-paths]')?.getAttribute('transform') !== 'matrix(0.078004 0 0 0.078004 425.195963 208.572631)') {
      throw new Error('Console geometry drifted from the approved SemiBold 600, 1X and 0.35 mark-width construction.');
    }

    const fixedPaths = [...fixedPortal.querySelectorAll('g[transform] path')].map((path) => path.getAttribute('d'));
    const registryPaths = [...proposedPortal.querySelectorAll('[data-product-lockup-wordmark-paths] path')].map((path) => path.getAttribute('d'));
    if (proposedPortal.getAttribute('viewBox') !== '342.60933 149.18987 409.912753 64.1628'
      || proposedPortal.querySelector('[data-product-lockup-wordmark-paths]')?.getAttribute('transform') !== 'matrix(0.078004 0 0 0.078004 421.295769 208.572631)'
      || JSON.stringify(registryPaths) === JSON.stringify(fixedPaths)) {
      throw new Error('The registry Portal must use the approved parent-first SemiBold outlines while the fixed legacy Portal stays unchanged.');
    }

    if (compact.getAttribute('data-lockup-variant') !== 'mark' || compact.getAttribute('aria-label') !== 'LK Console' || compact.getAttribute('height') !== '20') {
      throw new Error('Compact mode must use the approved mark and preserve the complete product name.');
    }
    if (home.getAttribute('aria-label') !== 'LK Console 홈' || linkedLockup.getAttribute('aria-hidden') !== 'true' || linkedLockup.hasAttribute('role')) {
      throw new Error('A home link must own the action name while its ProductLockup child remains decorative.');
    }
    if (reverse.querySelector('g')?.getAttribute('fill') !== '#ffffff') {
      throw new Error('The reverse ProductLockup must use the approved white outline.');
    }
  },
};

export const NarrowCompact = {
  name: '좁은 영역 · compact 전환',
  parameters: storyDescription(
    '제품 셸이 자신의 breakpoint에서 full을 compact로 바꾸는 예입니다. full SVG를 찌그러뜨리거나 제품명을 줄바꿈·말줄임하지 않습니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr', minHeight: 160, border: '1px solid var(--color-semantic-line-normal-normal)', background: 'var(--color-semantic-background-normal-normal)' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingBlock: 'var(--space-4)', borderInlineEnd: '1px solid var(--color-semantic-line-normal-normal)' }}>
        <ProductLockup product="console" compact height={20} />
      </div>
      <div style={{ padding: 'var(--space-4)', color: 'var(--color-semantic-label-normal)', fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)' }}>
        20px mark는 유지하고, 충분한 폭에서만 승인된 full LK CONSOLE lockup을 표시합니다.
      </div>
    </div>
  ),
};
