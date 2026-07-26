import React from 'react';
import { Meter } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';
import { DemoCard } from './StatusProgress.shared.jsx';

const meta = {
  title: 'LDS Product/Status/Meter',
  tags: ['autodocs'],
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
          'Meter는 알려진 범위 안의 현재 측정값과 선택적 임계 상태를 표시하는 LDS Product 확장입니다. 접근성 트리에는 진행률이 아니라 측정값을 뜻하는 role="meter"로 노출되고, aria-valuenow/min/max는 화면에 보이는 value/max 단위를 그대로 씁니다. 임계 구간은 색상만이 아니라 값 옆의 낱말과 aria-valuetext로도 전달됩니다.',
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

export const MeterSemanticsContract = {
  name: '측정값 의미와 임계 전달 계약',
  tags: ['!dev'],
  parameters: storyDescription(
    'Meter가 진행률이 아니라 측정값으로 노출되고(role="meter"), 발화되는 값이 보이는 value/max와 같은 단위인지, 그리고 임계 구간이 색상 외 단서로도 전달되는지 확인하는 계약입니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: 560 }}>
      <div data-testid="meter-scaled">
        <Meter label="냉각수 수위" value={12} max={40} thresholds={{ low: 20, high: 50 }} />
      </div>
      <div data-testid="meter-plain">
        <Meter label={<strong>위험 점수</strong>} value={82} max={100} />
      </div>
      <div data-testid="meter-renamed">
        <Meter label="품질 점수" value={95} max={100} thresholds={{ low: 20, high: 50 }} thresholdLabels={{ positive: '합격' }} />
      </div>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const meterIn = (testId) => {
      const meter = canvasElement.querySelector(`[data-testid="${testId}"] [role="meter"]`);
      if (!meter) throw new Error(`${testId} must expose role="meter"; a progressbar reports task progress, not a measurement.`);
      return meter;
    };

    // A bounded measurement speaks in the caller's units, not in percent.
    const scaled = meterIn('meter-scaled');
    if (scaled.getAttribute('aria-valuenow') !== '12' || scaled.getAttribute('aria-valuemax') !== '40') {
      throw new Error('Meter must report aria-valuenow/aria-valuemax in the caller value/max units.');
    }
    if (!/^12\/40/.test(scaled.getAttribute('aria-valuetext') || '')) {
      throw new Error('The spoken value must match the visible value/max caption even when max !== 100.');
    }

    // The threshold band is never color-only: it is a word on screen and in the value text.
    const band = canvasElement.querySelector('[data-testid="meter-scaled"] [data-meter-threshold]');
    if (band?.textContent !== '주의' || band.dataset.meterThreshold !== 'cautionary') {
      throw new Error('A threshold band must be printed as a word next to the value (WCAG 1.4.1).');
    }
    if (!scaled.getAttribute('aria-valuetext').includes('주의')) {
      throw new Error('A threshold band must also reach assistive technology through aria-valuetext.');
    }
    if (canvasElement.querySelector('[data-testid="meter-renamed"] [data-meter-threshold]')?.textContent !== '합격') {
      throw new Error('thresholdLabels must override the default band wording.');
    }
    if (canvasElement.querySelector('[data-testid="meter-plain"] [data-meter-threshold]')) {
      throw new Error('A meter without thresholds must not invent a band label.');
    }

    // A ReactNode label still names the meter through aria-labelledby.
    const plain = meterIn('meter-plain');
    const labelledBy = plain.getAttribute('aria-labelledby');
    const name = labelledBy && canvasElement.ownerDocument.getElementById(labelledBy)?.textContent?.trim();
    if (name !== '위험 점수') {
      throw new Error('A non-string label must still name the meter through aria-labelledby.');
    }
  },
};
