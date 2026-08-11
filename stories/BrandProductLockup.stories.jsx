import React, { useState } from 'react';
import { userEvent } from 'storybook/test';
import { Button, Lockup, ProductLockup } from '../src/index.js';
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
        component: 'ProductLockup은 LK mark를 모브랜드로 우선하고 승인 제품명을 SemiBold outline으로 조합하는 단일 SVG 컴포넌트입니다. 고정 LK Portal 정본도 같은 SemiBold 조형으로 동기화됩니다.',
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

function CompactRevealFixture() {
  const [compact, setCompact] = useState(true);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: compact ? '64px 1fr' : '180px 1fr',
        minHeight: 160,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        background: 'var(--color-semantic-background-normal-normal)',
        transition: 'grid-template-columns var(--dur-base) var(--ease-out)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', paddingBlock: 'var(--space-4)', paddingInlineStart: 22, overflow: 'hidden', borderInlineEnd: '1px solid var(--color-semantic-line-normal-normal)' }}>
        <ProductLockup data-testid="lockup-reveal" product="console" compact={compact} height={20} />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-4)', color: 'var(--color-semantic-label-normal)', fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)' }}>
        <Button data-testid="lockup-reveal-toggle" size="small" onClick={() => setCompact((value) => !value)}>
          {compact ? '펼치기' : '접기'}
        </Button>
        <span>LK mark는 그대로 두고, 승인된 CONSOLE 영역만 오른쪽으로 드러냅니다.</span>
      </div>
    </div>
  );
}

export const ProductLockupStandard = {
  name: '표준 · 모브랜드 우선',
  parameters: storyDescription(
    '고정 Lockup과 registry ProductLockup의 Portal 정본이 같은지 확인하고, LK가 먼저 읽히는 Console·reverse·compact 조합을 검증합니다.',
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
        <ExampleLabel>Portal 정본 동기화 · Lockup / ProductLockup</ExampleLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(100px, auto) 1fr', alignItems: 'center', columnGap: 'var(--space-4)', rowGap: 'var(--space-3)', padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
          <ExampleLabel>Lockup canonical</ExampleLabel>
          <Lockup data-testid="lockup-portal-fixed" variant="portal" height={20} />
          <ExampleLabel>ProductLockup registry</ExampleLabel>
          <ProductLockup data-testid="lockup-portal-canonical" product="portal" height={20} />
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
    const canonicalPortal = canvasElement.querySelector('[data-testid="lockup-portal-canonical"]');
    const reverse = canvasElement.querySelector('[data-testid="lockup-reverse"]');
    const compact = canvasElement.querySelector('[data-testid="lockup-compact"]');
    const home = canvasElement.querySelector('[data-testid="lockup-home"]');
    const linkedLockup = canvasElement.querySelector('[data-testid="lockup-link-child"]');
    if (!consoleLockup || !portal || !fixedPortal || !canonicalPortal || !reverse || !compact || !home || !linkedLockup) {
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
    const registryPaths = [...canonicalPortal.querySelectorAll('[data-product-lockup-wordmark-paths] path')].map((path) => path.getAttribute('d'));
    const expectedPortalViewBox = '342.60933 149.18987 409.912753 64.1628';
    const expectedPortalTransform = 'matrix(0.078004 0 0 0.078004 421.295769 208.572631)';
    if (fixedPortal.getAttribute('viewBox') !== expectedPortalViewBox
      || canonicalPortal.getAttribute('viewBox') !== expectedPortalViewBox
      || fixedPortal.querySelector('g[transform]')?.getAttribute('transform') !== expectedPortalTransform
      || canonicalPortal.querySelector('[data-product-lockup-wordmark-paths]')?.getAttribute('transform') !== expectedPortalTransform
      || fixedPortal.getAttribute('width') !== '127.772713'
      || canonicalPortal.getAttribute('width') !== '127.772713'
      || fixedPortal.getAttribute('height') !== '20'
      || canonicalPortal.getAttribute('height') !== '20'
      || fixedPortal.getAttribute('role') !== 'img'
      || canonicalPortal.getAttribute('role') !== 'img'
      || fixedPortal.getAttribute('aria-label') !== 'LK Portal'
      || canonicalPortal.getAttribute('aria-label') !== 'LK Portal'
      || fixedPaths.length !== 6
      || registryPaths.length !== 6
      || JSON.stringify(registryPaths) !== JSON.stringify(fixedPaths)) {
      throw new Error('The fixed and registry Portal lockups must share the approved canonical SemiBold geometry and accessible name.');
    }

    if (compact.getAttribute('data-product-lockup-mode') !== 'compact'
      || compact.getAttribute('aria-label') !== 'LK Console'
      || compact.getAttribute('height') !== '20'
      || compact.getAttribute('width') !== '21.431318'
      || compact.getAttribute('viewBox') !== '342.60933 149.18987 480.740284 64.1628'
      || compact.getAttribute('preserveAspectRatio') !== 'xMinYMid slice'
      || !compact.querySelector('[data-product-lockup-wordmark-paths]')) {
      throw new Error('Compact mode must retain the full SVG tree, clip to the approved mark width, and preserve the complete product name.');
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
    '제품 셸이 자신의 breakpoint에서 같은 SVG의 viewport 폭만 바꾸는 예입니다. LK mark는 고정되고 제품명 영역만 오른쪽으로 reveal/conceal 됩니다.',
  ),
  render: () => <CompactRevealFixture />,
  play: async ({ canvasElement }) => {
    const lockup = canvasElement.querySelector('[data-testid="lockup-reveal"]');
    const toggle = canvasElement.querySelector('[data-testid="lockup-reveal-toggle"]');
    if (!lockup || !toggle) throw new Error('Compact reveal fixture is incomplete.');

    const markPath = lockup.querySelector('g > path');
    const wordmarkPaths = lockup.querySelector('[data-product-lockup-wordmark-paths]');
    if (!markPath || !wordmarkPaths || lockup.getAttribute('data-product-lockup-mode') !== 'compact' || lockup.getAttribute('width') !== '21.431318') {
      throw new Error('Compact reveal must start with one complete SVG clipped to the mark width.');
    }

    await userEvent.click(toggle);
    const expandedLockup = canvasElement.querySelector('[data-testid="lockup-reveal"]');
    if (expandedLockup !== lockup
      || expandedLockup.querySelector('g > path') !== markPath
      || expandedLockup.querySelector('[data-product-lockup-wordmark-paths]') !== wordmarkPaths
      || expandedLockup.getAttribute('data-product-lockup-mode') !== 'full'
      || expandedLockup.getAttribute('width') !== '149.850157') {
      throw new Error('Expansion must preserve the SVG and LK path identities while revealing the product wordmark to the right.');
    }

    await userEvent.click(toggle);
    const collapsedLockup = canvasElement.querySelector('[data-testid="lockup-reveal"]');
    if (collapsedLockup !== lockup
      || collapsedLockup.querySelector('g > path') !== markPath
      || collapsedLockup.getAttribute('data-product-lockup-mode') !== 'compact'
      || collapsedLockup.getAttribute('width') !== '21.431318'
      || !collapsedLockup.querySelector('style')?.textContent?.includes('prefers-reduced-motion:reduce')) {
      throw new Error('Collapse must preserve identity, restore the mark viewport, and expose the reduced-motion contract.');
    }
  },
};
