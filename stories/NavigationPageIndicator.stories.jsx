import React from 'react';
import { PageIndicator } from '../src/index.js';
import { userEvent } from 'storybook/test';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Navigation/Page Indicator',
  tags: ['autodocs'],
  component: PageIndicator,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-navigation-page-indicator--counter-and-dots',
      eyebrow: 'Core / Navigation',
      title: 'Page Indicator는 연속된 화면 중 현재 위치와 전체 범위를 보여줍니다',
      description:
        '캐러셀이나 단계별 콘텐츠처럼 앞뒤 이동은 다른 제어가 담당하고 현재 위치만 간결하게 알려줄 때 적합합니다. 사용자가 특정 페이지를 직접 선택해야 하면 Pagination을, 업무 단계의 이름과 완료 상태를 설명해야 하면 Stepper를 사용하세요.',
    },
    docs: {
      description: {
        component: 'PageIndicator의 카운터·도트와 standalone·media presentation 계약을 보여줍니다.',
      },
    },
  },
};

export default meta;

function MediaDotsDemo({ groupLabel = '미디어 슬라이드 선택' }) {
  const [page, setPage] = React.useState(1);
  return (
    <PageIndicator
      variant="dot"
      presentation="media"
      page={page}
      count={6}
      onChange={setPage}
      getItemLabel={(item, count) => `${item}번째 미디어, ${item} / ${count}`}
      groupLabel={groupLabel}
    />
  );
}

function IndicatorSpecimen({ label, dark = false, mediaRail = false, children, ...rest }) {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)', justifyItems: 'start' }} {...rest}>
      <span style={{ color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-semibold)' }}>
        {label}
      </span>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: mediaRail ? 32 : undefined,
          minHeight: mediaRail ? undefined : 34,
          padding: mediaRail ? '0 var(--space-2)' : 'var(--space-2)',
          borderRadius: 'var(--radius-10)',
          background: dark ? 'var(--color-semantic-label-alternative)' : 'transparent',
          overflow: mediaRail ? 'visible' : undefined,
        }}
        data-page-indicator-media-rail={mediaRail ? '' : undefined}
      >
        {children}
      </div>
    </div>
  );
}

export const CounterAndDots = {
  name: '개요',
  parameters: storyDescription(
    '카운터와 도트의 기본 축을 비교합니다. standalone의 기본·alternative는 같은 medium 지오메트리를 유지하고 색 대비만 바뀝니다. media는 Carousel scrim 위에서만 쓰는 명시적 표현으로 8px 도트와 22×8px 활성 pill, 32×44px 선택 영역을 사용합니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-8)', width: 'min(880px, 100%)' }}>
      <section aria-labelledby="page-indicator-counter-heading" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="page-indicator-counter-heading" style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--headline2-size)', lineHeight: 'var(--headline2-line)', fontWeight: 'var(--fw-bold)' }}>
          카운터
        </h2>
        <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <IndicatorSpecimen label="Small">
            <PageIndicator page={1} count={10} size="small" />
          </IndicatorSpecimen>
          <IndicatorSpecimen label="Medium">
            <PageIndicator page={1} count={10} size="medium" />
          </IndicatorSpecimen>
          <IndicatorSpecimen label="Alternative">
            <PageIndicator page={1} count={10} alternative />
          </IndicatorSpecimen>
        </div>
      </section>

      <section aria-labelledby="page-indicator-dot-heading" style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <h2 id="page-indicator-dot-heading" style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--headline2-size)', lineHeight: 'var(--headline2-line)', fontWeight: 'var(--fw-bold)' }}>
          도트
        </h2>
        <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <IndicatorSpecimen label="Default" data-page-indicator-specimen="dot-default">
            <PageIndicator variant="dot" page={1} count={6} size="medium" groupLabel="기본 배경 도트" />
          </IndicatorSpecimen>
          <IndicatorSpecimen label="Alternative" dark data-page-indicator-specimen="dot-alternative">
            <PageIndicator variant="dot" page={1} count={6} size="medium" alternative groupLabel="어두운 배경 도트" />
          </IndicatorSpecimen>
          <IndicatorSpecimen label="Media · Carousel" dark mediaRail data-page-indicator-specimen="dot-media">
            <MediaDotsDemo />
          </IndicatorSpecimen>
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const specimenGeometry = (name) => {
      const specimen = canvasElement.querySelector(`[data-page-indicator-specimen="${name}"]`);
      const visual = specimen?.querySelector('[role="group"] > [aria-hidden="true"]');
      const dots = visual ? Array.from(visual.children) : [];
      if (!visual || dots.length !== 6) {
        throw new Error(`The ${name} dot specimen is incomplete.`);
      }
      const dotRects = dots.map((dot) => dot.getBoundingClientRect());
      const first = dotRects[0];
      if (dotRects.some((rect) => rect.width !== first.width || rect.height !== first.height)) {
        throw new Error(`Every dot in ${name} must use the same visual size.`);
      }
      return {
        width: first.width,
        height: first.height,
        gap: Number.parseFloat(getComputedStyle(visual).gap),
      };
    };

    const defaultGeometry = specimenGeometry('dot-default');
    const alternativeGeometry = specimenGeometry('dot-alternative');
    if (
      defaultGeometry.width !== alternativeGeometry.width
      || defaultGeometry.height !== alternativeGeometry.height
      || defaultGeometry.gap !== alternativeGeometry.gap
    ) {
      throw new Error('Default and alternative dots must share one size and gap contract.');
    }

    const media = canvasElement.querySelector('[data-page-indicator-specimen="dot-media"] [data-page-indicator-presentation="media"]');
    const mediaButtons = media ? Array.from(media.querySelectorAll('button')) : [];
    const active = media?.querySelector('[data-lds-page-indicator-dot="active"]');
    const inactive = media?.querySelector('[data-lds-page-indicator-dot="inactive"]');
    const mediaRail = canvasElement.querySelector('[data-page-indicator-media-rail]');
    if (mediaButtons.length !== 6 || !active || !inactive || !mediaRail) {
      throw new Error('The media presentation must expose one picker per item and distinct active geometry.');
    }
    const activeRect = active.getBoundingClientRect();
    const inactiveRect = inactive.getBoundingClientRect();
    const targetRect = mediaButtons[0].getBoundingClientRect();
    const railRect = mediaRail.getBoundingClientRect();
    if (
      activeRect.width !== 22
      || activeRect.height !== 8
      || inactiveRect.width !== 8
      || inactiveRect.height !== 8
      || railRect.height !== 32
      || targetRect.width < 32
      || targetRect.height < 44
    ) {
      throw new Error('Media dots must keep the 32px visual rail, 22x8 active pill, 8px inactive dots, and 32x44 targets.');
    }
    await userEvent.click(mediaButtons[1]);
    if (
      media.querySelector('[aria-current="true"]') !== mediaButtons[1]
      || mediaButtons[1].getAttribute('aria-label') !== '2번째 미디어, 2 / 6'
    ) {
      throw new Error('Media selection must update aria-current and keep the consumer-provided item label.');
    }
    await userEvent.click(mediaButtons[0]);
    canvasElement.ownerDocument.activeElement?.blur?.();
  },
};

function InteractiveDotsDemo() {
  const [page, setPage] = React.useState(2);
  return (
    <div style={{ display: 'grid', gap: 10, justifyItems: 'start' }}>
      <PageIndicator variant="dot" page={page} count={6} onChange={setPage} groupLabel="배너 페이지 표시기" />
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', color: 'var(--color-semantic-label-neutral)' }}>
        현재 페이지: {page}
      </span>
    </div>
  );
}

export const InteractiveDots = {
  name: '상호작용 · 도트 클릭 이동과 히트 영역',
  parameters: storyDescription(
    'onChange를 넘긴 도트는 버튼이 되어 특정 페이지로 바로 이동합니다. 각 도트가 "{n}페이지로 이동" 레이블과 24×24px 이상 히트 영역을 갖는지, 클릭 시 현재 페이지가 갱신되는지 확인하세요.',
  ),
  render: () => <InteractiveDotsDemo />,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector('[role="group"][aria-label="배너 페이지 표시기"]');
    const target = group?.querySelector('button[aria-label="4페이지로 이동"]');
    if (!target) throw new Error('Interactive dots must be buttons labeled "{n}페이지로 이동".');
    const box = target.getBoundingClientRect();
    if (box.width < 24 || box.height < 24) {
      throw new Error('Each interactive dot needs a minimum 24x24px hit area (WCAG 2.5.8).');
    }
    await userEvent.click(target);
    if (group.querySelector('[aria-current="page"]')?.getAttribute('aria-label') !== '4페이지로 이동') {
      throw new Error('Clicking a dot must call onChange with that page and move aria-current.');
    }
  },
};
