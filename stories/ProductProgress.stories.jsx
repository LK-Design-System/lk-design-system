import React from 'react';
import { waitFor } from 'storybook/test';
import { CircularProgress, ProgressBar } from '../src/index.js';
import { CircularProgressCard as CircularProgressCardStory, ProgressBarCard as ProgressBarCardStory } from './SelectionStatus.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';
import { DemoCard } from './StatusProgress.shared.jsx';

const meta = {
  title: 'LDS Product/Status/Progress',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-status-progress--progress-indicators',
      eyebrow: 'Product / Progress',
      title: '진행 표시는 작업이 얼마나 완료됐거나 아직 처리 중인지 알려줍니다',
      description:
        '업로드·분석·생성처럼 시작과 완료가 있는 작업의 진행률이나 대기 상태를 전달할 때 적합합니다. 작업이 아닌 현재 측정값을 알려진 범위 안에서 비교하려면 Progress 대신 Meter를 사용하세요.',
    },
    docs: {
      description: {
        component:
          'CircularProgress와 ProgressBar로 determinate·indeterminate 작업 진행, 크기와 상태 tone을 표현하는 LDS Product 진행 표시 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ProgressIndicators = {
  name: '개요',
  parameters: storyDescription(
    '리포트 처리와 펌웨어 업로드의 determinate·indeterminate 진행을 원형과 선형 표시로 비교합니다. 값 유무, sm·md·lg 크기와 positive·cautionary·negative tone이 작업 상태를 일관되게 전달하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 820 }}>
      <DemoCard title="원형 진행 표시">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <CircularProgress value={72} label="리포트 진행률" showValue />
          <CircularProgress value={100} label="완료" tone="positive" size={44} />
          <CircularProgress value={34} label="주의 진행률" tone="cautionary" size={44} />
          <CircularProgress label="처리 중" indeterminate size={44} />
          <CircularProgress value={14} label="오류 진행률" tone="negative" size={44} showValue />
        </div>
      </DemoCard>

      <DemoCard title="선형 진행 표시">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <ProgressBar label="진행률" value={64} showValue />
          <ProgressBar label="펌웨어 업로드" value={38} tone="positive" showValue />
          <ProgressBar label="처리 중" indeterminate />
          <ProgressBar label="컴팩트" value={52} size="sm" />
          <ProgressBar label="라지" value={82} size="lg" tone="cautionary" showValue />
        </div>
      </DemoCard>
    </main>
  ),
};

function reducedMotionRule(ownerDocument, styleId, selector) {
  const node = ownerDocument.getElementById(styleId);
  if (!node?.sheet) throw new Error(`${styleId} 스타일시트가 주입되지 않았습니다.`);
  const media = [...node.sheet.cssRules].find((rule) => (
    /prefers-reduced-motion/.test(rule.conditionText || rule.media?.mediaText || '')
  ));
  if (!media) throw new Error(`${styleId} must ship a prefers-reduced-motion guard.`);
  const target = [...media.cssRules].find((rule) => rule.selectorText === selector);
  if (!target) throw new Error(`${styleId} must stop ${selector} under reduced motion.`);
  return target;
}

export const ProgressAriaAndMotionContract = {
  name: '진행 표시 ARIA와 모션 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    'determinate 진행은 valuenow를, indeterminate 진행은 aria-busy와 한국어 valuetext를 노출하는지, 그리고 인라인으로 지정된 애니메이션이 prefers-reduced-motion에서 실제로 멈추는지 확인하는 계약입니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 560 }}>
      <ProgressBar data-testid="bar-determinate" label="펌웨어 업로드" value={3} max={5} showValue />
      <ProgressBar data-testid="bar-indeterminate" label="처리 중" indeterminate />
      <CircularProgress data-testid="ring-determinate" value={72} label="리포트 진행률" showValue />
      <CircularProgress data-testid="ring-indeterminate" label="처리 중" indeterminate />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const ownerDocument = canvasElement.ownerDocument;
    const find = (testId) => {
      const host = canvasElement.querySelector(`[data-testid="${testId}"]`);
      if (!host) throw new Error(`${testId} 픽스처가 렌더되지 않았습니다.`);
      return host.getAttribute('role') === 'progressbar' ? host : host.querySelector('[role="progressbar"]');
    };

    for (const [testId, valuenow] of [['bar-determinate', '60'], ['ring-determinate', '72']]) {
      const determinate = find(testId);
      if (determinate.getAttribute('aria-valuenow') !== valuenow) {
        throw new Error(`${testId} must report its progress through aria-valuenow.`);
      }
      if (determinate.hasAttribute('aria-busy')) {
        throw new Error(`${testId} is determinate and must not claim aria-busy.`);
      }
    }

    for (const testId of ['bar-indeterminate', 'ring-indeterminate']) {
      const indeterminate = find(testId);
      if (indeterminate.hasAttribute('aria-valuenow')) {
        throw new Error(`${testId} must omit aria-valuenow while the duration is unknown.`);
      }
      if (indeterminate.getAttribute('aria-busy') !== 'true' || indeterminate.getAttribute('aria-valuetext') !== '진행 중') {
        throw new Error(`${testId} must announce the Korean busy state instead of a numeric value.`);
      }
    }

    /* The indeterminate sweep and the ring rotation are inline styles, so the
       reduced-motion override only wins with `!important` — dropping it left the
       animation running under prefers-reduced-motion (WCAG 2.3.3). */
    for (const [styleId, selector] of [
      ['lk-prog-kf', '[data-lds-progress-indeterminate]'],
      ['lk-circular-kf', '[data-lds-circular-progress]'],
    ]) {
      /* 키프레임 style 태그는 effect에서 주입되므로 play가 먼저 도달할 수 있다. */
      await waitFor(() => {
        const rule = reducedMotionRule(ownerDocument, styleId, selector);
        const value = rule.style.getPropertyValue('animation') || rule.style.getPropertyValue('animation-name');
        const priority = rule.style.getPropertyPriority('animation') || rule.style.getPropertyPriority('animation-name');
        if (!/\bnone\b/.test(value) || priority !== 'important') {
          throw new Error(`${selector} takes its animation from an inline style, so the reduced-motion override must declare animation:none!important.`);
        }
      });
    }
  },
};

export const CircularProgressCard = { ...CircularProgressCardStory, name: 'CircularProgress card parity', tags: ['!dev', 'visual-parity'] };
export const ProgressBarCard = { ...ProgressBarCardStory, name: 'ProgressBar card parity', tags: ['!dev', 'visual-parity'] };
