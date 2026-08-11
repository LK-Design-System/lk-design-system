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
      title: 'LK + 제품명은 LK Portal과 같은 outline Product Lockup 규격을 사용합니다',
      description:
        'Montserrat ExtraBold 800 outline, 대문자, 제품명 visible height 1X, mark visible 폭의 0.35 간격을 승인 registry 전체에 적용합니다. Console과 Portal은 동일한 조형이며 런타임 font와 SVG text를 사용하지 않습니다.',
      decisionGuidance: {
        useWhen: 'TopBar 또는 expanded SideNav에서 승인 registry의 제품을 LK mark와 함께 한 번 식별할 때 사용합니다.',
        avoidWhen: '미등록 제품명, 페이지 제목, workspace·환경·상태 라벨, 대외용 신규 로고 자산을 임의로 만들 때 사용하지 않습니다.',
      },
    },
    docs: {
      description: {
        component: 'ProductLockup은 고정 LK Portal 로크업의 조형을 승인 제품 registry로 일반화한 단일 SVG outline 컴포넌트입니다. 회사 Lockup과 제품별 고정 배포 자산은 별도 승인 계약을 유지합니다.',
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
  name: '표준 · LK Portal 조형',
  parameters: storyDescription(
    '고정 LK Portal 자산과 registry Portal이 완전히 같은지 비교하고, 같은 1X·0.35 mark-width 규칙의 LK Console, reverse, compact 조합을 확인합니다.',
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
        <ExampleLabel>Portal parity · 고정 자산 / registry</ExampleLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, auto) 1fr', alignItems: 'center', columnGap: 'var(--space-4)', rowGap: 'var(--space-3)', padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
          <ExampleLabel>fixed</ExampleLabel>
          <Lockup data-testid="lockup-portal-fixed" variant="portal" height={20} />
          <ExampleLabel>registry</ExampleLabel>
          <ProductLockup data-testid="lockup-portal-parity" product="portal" height={20} />
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
    const parityPortal = canvasElement.querySelector('[data-testid="lockup-portal-parity"]');
    const reverse = canvasElement.querySelector('[data-testid="lockup-reverse"]');
    const compact = canvasElement.querySelector('[data-testid="lockup-compact"]');
    const home = canvasElement.querySelector('[data-testid="lockup-home"]');
    const linkedLockup = canvasElement.querySelector('[data-testid="lockup-link-child"]');
    if (!consoleLockup || !portal || !fixedPortal || !parityPortal || !reverse || !compact || !home || !linkedLockup) {
      throw new Error('ProductLockup standard fixture is incomplete.');
    }

    if (consoleLockup.tagName.toLowerCase() !== 'svg' || consoleLockup.getAttribute('role') !== 'img' || consoleLockup.getAttribute('aria-label') !== 'LK Console') {
      throw new Error('A standalone full ProductLockup must expose one named SVG image.');
    }
    if (consoleLockup.getAttribute('data-product-lockup-wordmark') !== 'CONSOLE' || consoleLockup.querySelector('text')) {
      throw new Error('ProductLockup must use the approved uppercase outline and no SVG text element.');
    }
    if (consoleLockup.getAttribute('height') !== '20' || consoleLockup.getAttribute('viewBox') !== '342.60933 149.18987 481.61547 64.1628') {
      throw new Error('Console must retain the approved 20px minimum and generated outline viewBox.');
    }
    if (consoleLockup.querySelector('[data-product-lockup-wordmark-paths]')?.getAttribute('transform') !== 'matrix(0.077147 0 0 0.077147 426.005147 208.272616)') {
      throw new Error('Console geometry drifted from the Portal-derived 1X and 0.35 mark-width construction.');
    }

    const fixedPaths = [...fixedPortal.querySelectorAll('g[transform] path')].map((path) => path.getAttribute('d'));
    const registryPaths = [...parityPortal.querySelectorAll('[data-product-lockup-wordmark-paths] path')].map((path) => path.getAttribute('d'));
    if (parityPortal.getAttribute('viewBox') !== fixedPortal.getAttribute('viewBox')
      || parityPortal.getAttribute('width') !== fixedPortal.getAttribute('width')
      || parityPortal.querySelector('[data-product-lockup-wordmark-paths]')?.getAttribute('transform') !== fixedPortal.querySelector('g[transform]')?.getAttribute('transform')
      || JSON.stringify(registryPaths) !== JSON.stringify(fixedPaths)) {
      throw new Error('The registry Portal must remain path, transform, viewBox, and intrinsic-size identical to the fixed Portal Lockup.');
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
