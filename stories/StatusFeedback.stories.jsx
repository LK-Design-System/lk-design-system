import React from 'react';
import { Banner, Button, Callout } from '../src/index.js';
import { BannerCard as BannerCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Notices and Callouts',
  tags: ['autodocs'],
  component: Banner,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-status-notices-and-callouts--notices-and-callouts',
      eyebrow: 'Core / Notices and Callouts',
      title: '변하는 상태와 계속 참고할 안내를 서로 다른 표면으로 전달합니다',
      description:
        '시스템 변화와 선택적 행동을 알려야 할 때는 Banner가, 본문 맥락에 남는 절차·주의에는 Callout이 적합합니다. 짧게 사라지는 완료 피드백에는 이 패턴을 사용하지 말고 Toast 또는 Snackbar를 사용하세요.',
    },
    docs: {
      description: {
        component: 'Banner는 변하는 시스템 상태와 선택적 액션을 알리고, Callout은 본문에 계속 남는 정적 안내를 묶습니다.',
      },
    },
  },
};

export default meta;

export const NoticesAndCallouts = {
  name: '개요',
  parameters: storyDescription(
    '변화가 발표되는 Banner와 본문에 계속 남는 Callout을 실제 메시지로 비교합니다. 저장·동기화 상태에는 적절한 role과 선택적 행동이 제공되고 절차 안내에는 불필요한 live 상태나 닫기 동작이 없는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-8)', maxWidth: 820 }}>
      <section aria-labelledby="dynamic-banner-examples" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <h2 id="dynamic-banner-examples" style={{ margin: 0, fontSize: 'var(--body1-size)', color: 'var(--color-semantic-label-strong)' }}>변하는 시스템 상태 · Banner</h2>
          <p style={{ margin: 0, fontSize: 'var(--label1-size)', color: 'var(--color-semantic-label-neutral)' }}>상태 변화가 발표되며, 필요한 경우 다음 행동이나 닫기를 제공합니다.</p>
        </div>
        <Banner tone="info" title="데이터 동기화 진행 중" action={<Button size="sm" variant="ghost">상세 보기</Button>}>
          최신 데이터를 불러오고 있습니다. 동기화가 끝나면 편집을 다시 시작할 수 있습니다.
        </Banner>
        <Banner tone="success" title="변경 사항 저장 완료" onClose={() => {}}>
          게시 전 검토할 초안이 저장되었습니다.
        </Banner>
      </section>

      <section aria-labelledby="standing-callout-examples" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <h2 id="standing-callout-examples" style={{ margin: 0, fontSize: 'var(--body1-size)', color: 'var(--color-semantic-label-strong)' }}>본문에 남는 가이드 · Callout</h2>
          <p style={{ margin: 0, fontSize: 'var(--label1-size)', color: 'var(--color-semantic-label-neutral)' }}>상태를 실시간 발표하지 않고, 작업 중 계속 참고할 절차와 맥락을 설명합니다.</p>
        </div>
        <Callout tone="cautionary" title="작업 전 확인" headingLevel={3}>
          저장하기 전에 필수 입력값과 적용 대상을 확인하세요. 이 안내는 작업 절차가 끝날 때까지 본문에 남습니다.
        </Callout>
        <Callout tone="signal" title="권한 요청 방법">
          편집 권한이 없다면 프로젝트 관리자에게 역할 변경을 요청하세요. 승인 후 페이지를 새로고침하면 됩니다.
        </Callout>
        <Callout tone="navy" title="브랜드 기준 안내">
          네이비 안내 면은 공식 SVG와 같은 #05132B를 사용합니다.
        </Callout>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const semanticTitle = [...canvasElement.querySelectorAll('h3')]
      .find((heading) => heading.textContent?.trim() === '작업 전 확인');
    if (!semanticTitle) {
      throw new Error('Callout headingLevel must render its title as the requested semantic heading.');
    }
  },
};

export const BannerSurfaceVariants = {
  name: '변형·상태 · 독립형과 결합형 안내',
  parameters: storyDescription(
    '독립형 Banner, 패널 결합형 Banner, 본문 Callout의 배치와 의미를 비교합니다. 동적 상태는 외곽선 없는 톤 면 또는 패널 경계에 결합된 상태 밴드로 읽히고 정적 가이드는 작업 맥락 안에 남으며 각 패턴의 상태·행동 계약이 섞이지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-8)', width: 'min(680px, 100%)' }}>
      <section aria-labelledby="standalone-banner-title" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 id="standalone-banner-title" style={{ margin: 0, fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}>독립형 Banner · 동적 알림</h2>
        <Banner data-testid="standalone-banner" tone="warning" title="동기화가 지연되고 있습니다" onClose={() => {}}>
          네트워크 상태를 확인한 뒤 다시 시도할 수 있습니다.
        </Banner>
      </section>

      <section aria-labelledby="embedded-banner-title" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 id="embedded-banner-title" style={{ margin: 0, fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}>패널 결합형 Banner · 컴팩트 상태</h2>
        <div style={{ overflow: 'hidden', border: 'var(--component-card-border)', borderRadius: 'var(--component-card-radius)', background: 'var(--color-semantic-background-elevated-normal)', boxShadow: 'var(--component-card-shadow-sm)' }}>
          <header style={{ padding: 'var(--space-4) var(--space-5)', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)', fontWeight: 'var(--fw-bold)' }}>
            AMR 수동 주행
          </header>
          <Banner data-testid="embedded-banner" variant="embedded" tone="info" title="수동 제어 잠김" />
          <div style={{ minHeight: 72, padding: 'var(--space-5)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)' }}>
            준비 상태를 확인한 뒤 조작기를 사용할 수 있습니다.
          </div>
        </div>
      </section>

      <section aria-labelledby="standing-callout-title" style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <h2 id="standing-callout-title" style={{ margin: 0, fontSize: 'var(--body2-size)', color: 'var(--color-semantic-label-normal)' }}>본문 Callout · 정적 가이드</h2>
        <Callout data-testid="standing-callout" tone="cautionary" title="운행 전 경로 확인">
          지도에서 출발지와 도착지, 통행 제한 구역을 확인하세요. 이 안내는 운행 준비 과정에서 계속 참고하는 절차 설명입니다.
        </Callout>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const standalone = canvasElement.querySelector('[data-testid="standalone-banner"]');
    const embedded = canvasElement.querySelector('[data-testid="embedded-banner"]');
    const standingCallout = canvasElement.querySelector('[data-testid="standing-callout"]');
    if (!standalone || !embedded || !standingCallout || standalone.getAttribute('role') !== 'status' || embedded.getAttribute('role') !== 'status') {
      throw new Error('Both Banner surface variants must preserve status semantics.');
    }
    if (standalone.dataset.bannerVariant !== 'standalone' || embedded.dataset.bannerVariant !== 'embedded') {
      throw new Error('Banner must expose the selected surface variant in rendered output.');
    }
    const standaloneStyle = getComputedStyle(standalone);
    if (['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'].some((property) => parseFloat(standaloneStyle[property]) !== 0)) {
      throw new Error('A standalone Banner must communicate status with its tonal surface, not a perimeter border.');
    }
    const embeddedStyle = getComputedStyle(embedded);
    if (parseFloat(embeddedStyle.borderRadius) !== 0 || parseFloat(embeddedStyle.borderTopWidth) === 0 || parseFloat(embeddedStyle.borderLeftWidth) !== 0 || parseFloat(embeddedStyle.borderRightWidth) !== 0 || parseFloat(embeddedStyle.borderBottomWidth) === 0) {
      throw new Error('An embedded Banner must join its parent surface with top and bottom separators only.');
    }
    if (embedded.textContent.trim() !== '수동 제어 잠김') {
      throw new Error('A compact embedded status example must remain a single, self-contained message line.');
    }
    if (standingCallout.hasAttribute('role') || standingCallout.hasAttribute('aria-live') || standingCallout.querySelector('button')) {
      throw new Error('A standing Callout must not introduce live status, action, or dismiss semantics by default.');
    }
    // The two surfaces once differed by 2px of padding, so the documented rank
    // ("Callout is heavier than Banner") was prose the render never delivered and
    // the pair read as interchangeable. Rank is geometry, so assert it as geometry.
    const calloutBox = getComputedStyle(standingCallout);
    if (['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'].some((property) => parseFloat(calloutBox[property]) !== 0)) {
      throw new Error('A standing Callout must communicate guidance with its tonal surface, not a perimeter border.');
    }
    if (!['paddingTop', 'paddingLeft', 'borderTopLeftRadius'].every((property) => parseFloat(calloutBox[property]) > parseFloat(standaloneStyle[property]))) {
      throw new Error('A standing Callout must outrank Banner in the same tone — block padding and the wider panel radius — so a static guide is never mistaken for a dynamic notice.');
    }
    if (!standalone.querySelector(':scope > svg[aria-hidden="true"]') || !embedded.querySelector(':scope > svg[aria-hidden="true"]') || !standalone.querySelector('button[aria-label="닫기"] svg[aria-hidden="true"]')) {
      throw new Error('Banner tone and close actions must use decorative registry icons with an accessible control label.');
    }
  },
};

export const BannerCard = { ...BannerCardStory, name: 'Banner card parity', tags: ['!dev', 'visual-parity'] };
