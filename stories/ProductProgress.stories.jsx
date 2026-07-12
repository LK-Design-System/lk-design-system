import React from 'react';
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

export const CircularProgressCard = { ...CircularProgressCardStory, name: 'CircularProgress card parity', tags: ['!dev', 'visual-parity'] };
export const ProgressBarCard = { ...ProgressBarCardStory, name: 'ProgressBar card parity', tags: ['!dev', 'visual-parity'] };
