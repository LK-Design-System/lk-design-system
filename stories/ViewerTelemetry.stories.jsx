import React from 'react';
import { TelemetryGauge } from '../src/index.js';
import { TelemetryGaugeCard as TelemetryGaugeCardStory } from './RoboticsAndViz.shared.jsx';

const meta = {
  title: 'LDS Robotics/Viewer/Telemetry',
  parameters: {
    docs: {
      description: {
        component: '뷰어 주변에서 함께 읽는 수치 정보를 게이지와 컴팩트 수치 표시로 정리하는 텔레메트리 패턴입니다.',
      },
    },
  },
};

export default meta;

export const TelemetryOverview = {
  name: '텔레메트리 게이지',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 820 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)', alignItems: 'end' }}>
        <TelemetryGauge value={86} unit="%" label="배터리" thresholds={{ low: 20, high: 50 }} />
        <TelemetryGauge value={1.4} max={2} unit="m/s" label="속도" tone="signal" />
        <TelemetryGauge value={68} unit="%" label="신호" tone="positive" />
        <TelemetryGauge value={14} unit="%" label="부하" tone="cautionary" thresholds={{ low: 20, high: 80 }} />
      </section>
    </main>
  ),
};

export const TelemetryGaugeCard = { ...TelemetryGaugeCardStory, name: 'TelemetryGauge card parity', tags: ['!dev', 'visual-parity'] };
