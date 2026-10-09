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
  name: '개요',
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
    if (consoleLockup.hasAttribute('data-product-lockup-endorsement')) {
      throw new Error('The default mark form must keep its pre-endorsement attribute surface.');
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
  name: '반응형 · 좁은 영역의 제품명 전환',
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

const COMPANY_PORTAL_VIEWBOX = '342.60933 149.18987 761.091156 64.1628';
const COMPANY_PORTAL_TRANSFORM = 'matrix(0.077573 0 0 0.077573 864.499368 208.421795)';

function expectTypeError(render, message) {
  try {
    render();
  } catch (error) {
    if (error instanceof TypeError) return;
    throw error;
  }
  throw new Error(message);
}

const companyPanelStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  gap: 'var(--space-6)',
  padding: 'var(--space-5)',
  border: '1px solid var(--color-semantic-line-normal-normal)',
  borderRadius: 'var(--radius-lg)',
  background: 'var(--color-semantic-background-elevated-normal)',
};

export const CompanyEndorsed = {
  name: '변형·상태 · 회사 보증 형',
  parameters: storyDescription(
    '회사 inline 로크업(LK ROBOTICS) 뒤에 승인 제품명 Portal을 SemiBold 600 outline으로 붙인 회사 보증 형입니다. 제품명 대문자 높이는 ROBOTICS와 같고 baseline을 공유하며, ROBOTICS 끝에서 LK mark 폭의 0.525배 간격을 둬 제품명이 별도 단어로 읽힙니다. 홈 hero·로그인처럼 넓은 첫인상 표면에만 쓰고, 같은 화면에 mark 형과 함께 두지 않습니다. 아래 비교 줄은 같은 28px에서 회사 inline과 mark 형을 나란히 둔 구성 비교입니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', width: 'min(880px, 100%)', fontFamily: 'var(--font-sans)' }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <ExampleLabel>positive · 20 / 28 / 32px</ExampleLabel>
        <div style={companyPanelStyle}>
          <ProductLockup data-testid="company-20" product="portal" endorsement="company" height={20} />
          <ProductLockup data-testid="company-28" product="portal" endorsement="company" />
          <ProductLockup data-testid="company-32" product="portal" endorsement="company" height={32} />
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <ExampleLabel>LK Navy · reverse</ExampleLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'var(--space-6)', padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-brand-surface)' }}>
          <ProductLockup data-testid="company-reverse" product="portal" endorsement="company" appearance="reverse" height={28} />
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <ExampleLabel>구성 비교 · 회사 inline / 회사 보증 형 / mark 형 (28px)</ExampleLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, auto) 1fr', alignItems: 'center', columnGap: 'var(--space-4)', rowGap: 'var(--space-4)', padding: 'var(--space-5)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
          <ExampleLabel>Lockup inline</ExampleLabel>
          <Lockup data-testid="company-sibling-inline" variant="inline" height={28} />
          <ExampleLabel>회사 보증 형</ExampleLabel>
          <ProductLockup data-testid="company-sibling-company" product="portal" endorsement="company" height={28} />
          <ExampleLabel>mark 형</ExampleLabel>
          <ProductLockup data-testid="company-sibling-mark" product="portal" height={28} />
        </div>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <ExampleLabel>홈 링크 · 링크가 이름을 소유</ExampleLabel>
        <a data-testid="company-home" href="#portal-home" aria-label="LK ROBOTICS Portal 홈" onClick={(event) => event.preventDefault()} style={{ display: 'inline-flex', width: 'fit-content', textDecoration: 'none' }}>
          <ProductLockup data-testid="company-link-child" product="portal" endorsement="company" decorative height={28} />
        </a>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const byId = (id) => canvasElement.querySelector(`[data-testid="${id}"]`);
    const sizes = [['company-20', '20', '237.237513'], ['company-28', '28', '332.132519'], ['company-32', '32', '379.580021']];
    const inline = byId('company-sibling-inline');
    const reverse = byId('company-reverse');
    const home = byId('company-home');
    const linked = byId('company-link-child');
    if (!inline || !reverse || !home || !linked || sizes.some(([id]) => !byId(id))) {
      throw new Error('The company-endorsed ProductLockup fixture is incomplete.');
    }

    for (const [id, height, width] of sizes) {
      const lockup = byId(id);
      if (lockup.getAttribute('role') !== 'img' || lockup.getAttribute('aria-label') !== 'LK ROBOTICS Portal') {
        throw new Error('A standalone company-endorsed lockup must expose one image named like its visible text.');
      }
      if (lockup.getAttribute('data-product-lockup-endorsement') !== 'company'
        || lockup.getAttribute('data-product-lockup-wordmark') !== 'Portal'
        || lockup.querySelector('text')) {
        throw new Error('The company-endorsed lockup must render the canonical-case outline without SVG text.');
      }
      if (lockup.getAttribute('viewBox') !== COMPANY_PORTAL_VIEWBOX
        || lockup.getAttribute('height') !== height
        || lockup.getAttribute('width') !== width
        || lockup.getAttribute('preserveAspectRatio') !== 'xMidYMid meet') {
        throw new Error(`The company-endorsed lockup at ${height}px drifted from the generated frame (${width} x ${height}).`);
      }
      if (lockup.querySelector('[data-product-lockup-wordmark-paths]')?.getAttribute('transform') !== COMPANY_PORTAL_TRANSFORM) {
        throw new Error('The product name must share the ROBOTICS baseline and cap height at the 0.35 mark-width gap.');
      }
    }

    // The company unit is the unchanged inline lockup: same paths, same transform, same vertical frame.
    const company = byId('company-28');
    const inlineGroup = inline.querySelector('g[transform]');
    const companyGroup = company.querySelector('[data-product-lockup-company-paths]');
    const pathsOf = (group) => [...(group?.querySelectorAll('path') ?? [])].map((path) => path.getAttribute('d'));
    const [inlineX, inlineY, , inlineH] = inline.getAttribute('viewBox').split(' ');
    const [companyX, companyY, , companyH] = COMPANY_PORTAL_VIEWBOX.split(' ');
    if (!inlineGroup || !companyGroup
      || companyGroup.getAttribute('transform') !== inlineGroup.getAttribute('transform')
      || JSON.stringify(pathsOf(companyGroup)) !== JSON.stringify(pathsOf(inlineGroup))
      || inlineX !== companyX || inlineY !== companyY || inlineH !== companyH) {
      throw new Error('The company unit must equal Lockup variant="inline" in geometry and vertical frame.');
    }
    if (byId('company-sibling-mark')?.hasAttribute('data-product-lockup-endorsement')) {
      throw new Error('The default mark form must keep its unchanged attribute surface.');
    }
    if (reverse.querySelector('g')?.getAttribute('fill') !== '#ffffff' || company.querySelector('g')?.getAttribute('fill') !== '#05132b') {
      throw new Error('The company-endorsed lockup must stay one colour: navy positive or white reverse.');
    }
    if (home.getAttribute('aria-label') !== 'LK ROBOTICS Portal 홈' || linked.getAttribute('aria-hidden') !== 'true' || linked.hasAttribute('role')) {
      throw new Error('A home link must own the name while its company-endorsed lockup stays decorative.');
    }

    expectTypeError(
      () => ProductLockup({ product: 'portal', endorsement: 'company', compact: true }),
      'The company-endorsed lockup must reject compact.',
    );
    expectTypeError(
      () => ProductLockup({ product: 'console', endorsement: 'company' }),
      'A product without an approved company form must be rejected.',
    );
    expectTypeError(
      () => ProductLockup({ product: 'portal', endorsement: 'tagline' }),
      'An unknown endorsement must be rejected.',
    );
    const clamped = ProductLockup({ product: 'portal', endorsement: 'company', height: 10 });
    if (clamped.props.height !== 20 || clamped.props.width !== 237.237513) {
      throw new Error('A company-endorsed height below 20px must clamp to the 20px minimum.');
    }
  },
};

export const CompanyEndorsedNarrow = {
  name: '반응형 · 회사 보증 형의 좁은 슬롯',
  parameters: storyDescription(
    '회사 보증 형은 비례 축소만 합니다. 자르거나 줄바꿈하지 않으며 compact도 없습니다. 20px에서 필요한 최소 폭 233.92px를 확보하지 못하는 슬롯은 셸이 회사 Lockup inline으로 전환합니다.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-5)', fontFamily: 'var(--font-sans)' }}>
      <section style={{ display: 'grid', gap: 'var(--space-3)', width: 360, maxWidth: '100%' }}>
        <ExampleLabel>360px 슬롯 · 32px 요청이 폭에 맞게 비례 축소</ExampleLabel>
        <div data-testid="company-slot-360" style={{ padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
          <ProductLockup data-testid="company-scaled" product="portal" endorsement="company" height={32} />
        </div>
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-3)', width: 220, maxWidth: '100%' }}>
        <ExampleLabel>220px 슬롯 · 최소 폭 미만이라 회사 inline으로 전환</ExampleLabel>
        <div data-testid="company-slot-220" style={{ padding: 'var(--space-4)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)' }}>
          <Lockup data-testid="company-fallback-inline" variant="inline" height={20} />
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const slot = canvasElement.querySelector('[data-testid="company-slot-360"]');
    const scaled = canvasElement.querySelector('[data-testid="company-scaled"]');
    const fallback = canvasElement.querySelector('[data-testid="company-fallback-inline"]');
    if (!slot || !scaled || !fallback) throw new Error('The narrow company-endorsed fixture is incomplete.');
    const slotStyle = getComputedStyle(slot);
    const available = slot.clientWidth - Number.parseFloat(slotStyle.paddingLeft) - Number.parseFloat(slotStyle.paddingRight);
    const rect = scaled.getBoundingClientRect();
    const [, , viewBoxWidth, viewBoxHeight] = COMPANY_PORTAL_VIEWBOX.split(' ').map(Number);
    if (rect.width > available + 0.5 || rect.width >= 374) {
      throw new Error('A company-endorsed lockup wider than its slot must scale down instead of overflowing.');
    }
    if (Math.abs(rect.height - rect.width * viewBoxHeight / viewBoxWidth) > 0.75) {
      throw new Error('Scaling must stay proportional; the lockup must not crop or stretch.');
    }
    if (fallback.getAttribute('data-lockup-variant') !== 'inline') {
      throw new Error('A slot below the 233.92px minimum must switch to the company inline lockup.');
    }
  },
};
