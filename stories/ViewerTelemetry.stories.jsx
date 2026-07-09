import React from 'react';
import {
  Table,
  TelemetryGauge,
  TelemetryValue,
} from '../src/index.js';
import { TelemetryGaugeCard as TelemetryGaugeCardStory } from './RoboticsAndViz.shared.jsx';

const telemetryRows = [
  { sensor: '배터리', value: '18', unit: '%', tone: 'negative', note: '임계값 이하', timestamp: '10:42:18 KST' },
  { sensor: 'RSSI', value: '-71', unit: 'dBm', tone: 'cautionary', note: '약한 신호', timestamp: '10:42:18 KST' },
  { sensor: '속도', value: '1.4', unit: 'm/s', tone: 'signal', note: '정상 범위', timestamp: '10:42:18 KST' },
  { sensor: 'LiDAR', value: '0', unit: 'Hz', stale: true, note: '지연', timestamp: '10:38:02 KST' },
];

const columns = [
  { key: 'sensor', label: '항목', width: 160 },
  {
    key: 'value',
    label: '값',
    render: (row) => (
      <TelemetryValue
        value={row.value}
        unit={row.unit}
        tone={row.tone}
        stale={row.stale}
        showStaleBadge={false}
        size="sm"
      />
    ),
  },
  { key: 'note', label: '상태' },
  { key: 'timestamp', label: '수집 시각', width: 140 },
];

const meta = {
  title: 'LDS Robotics/Viewer/Telemetry',
  parameters: {
    docs: {
      description: {
        component: '뷰어 주변에서 함께 읽는 수치 정보를 게이지와 컴팩트 수치 표시로 정리하는 텔레메트리 패턴입니다. 작은 패널과 표 셀에서는 값, 단위, 최신 여부, 수집 시각을 함께 읽습니다.',
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

export const TelemetryReadouts = {
  name: '값 읽기',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 860 }}>
      <Table columns={columns} rows={telemetryRows} size="sm" />
      <section style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'end', flexWrap: 'wrap' }}>
        <TelemetryGauge value={18} unit="%" label="배터리" thresholds={{ low: 20, high: 50 }} />
        <div style={{ display: 'grid', gap: 'var(--space-3)', minWidth: 220 }}>
          <TelemetryValue label="전압" value="23.8" unit="V" tone="positive" timestamp="10:42:18 KST" />
          <TelemetryValue label="온도" value="41" unit="°C" tone="cautionary" timestamp="10:42:18 KST" />
        </div>
      </section>
    </main>
  ),
};

export const TelemetryGaugeCard = { ...TelemetryGaugeCardStory, name: 'TelemetryGauge card parity', tags: ['!dev', 'visual-parity'] };
