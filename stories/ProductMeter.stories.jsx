import React from 'react';
import { Meter } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';
import { DemoCard } from './StatusProgress.shared.jsx';

const meta = {
  title: 'LDS Product/Status/Meter',
  component: Meter,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-status-meter--bounded-measurements',
      eyebrow: 'Product / Meter',
      title: '미터는 알려진 범위 안에서 현재 측정값의 수준을 보여줍니다',
      description:
        '수위·품질·위험 점수처럼 최소·최대 경계가 있는 현재 측정값을 비교할 때 적합합니다. 업로드나 처리 작업의 완료율에는 Meter 대신 ProgressBar 또는 CircularProgress를 사용하세요.',
    },
    docs: {
      description: {
        component:
          'Meter는 알려진 범위 안의 현재 측정값과 선택적 임계 상태를 표시하는 LDS Product 확장입니다. 현재 구현은 막대형 진행 표시를 합성하므로 접근성 트리에 role="meter"가 아니라 role="progressbar"로 노출되는 호환성 한계가 있습니다. 이 한계는 의미 권장사항이 아니며 엄격한 meter semantics가 필요한 제품에서는 해소 전 사용하지 않습니다.',
      },
    },
  },
};

export default meta;

export const BoundedMeasurements = {
  name: '개요',
  parameters: storyDescription(
    '냉각수 수위와 위험 점수를 각각 0~100 범위의 현재 측정값으로 비교합니다. value/max 표기와 threshold 색상이 작업 완료율이 아니라 현재 수준을 읽는 보조 정보로 전달되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 820 }}>
      <DemoCard title="현재 측정값">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Meter label="냉각수 수위" value={47} max={100} thresholds={{ low: 20, high: 50 }} />
          <Meter label="위험 점수" value={82} max={100} />
        </div>
      </DemoCard>
    </main>
  ),
};
