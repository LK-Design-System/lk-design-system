import React from 'react';
import {
  TelemetryGauge,
  TelemetryValue,
} from '../src/index.js';

const readouts = [
  { sensor: '배터리', value: '18', unit: '%', tone: 'negative', statusLabel: '충전 필요', helper: '임계값 20% 이하', timestamp: '10:42:18 KST' },
  { sensor: 'RSSI', value: '-71', unit: 'dBm', tone: 'cautionary', statusLabel: '신호 약함', helper: '최근 10초 평균', timestamp: '10:42:18 KST' },
  { sensor: '속도', value: '1.4', unit: 'm/s', tone: 'positive', statusLabel: '정상 범위', helper: '목표 1.5 m/s', timestamp: '10:42:18 KST' },
  { sensor: 'LiDAR', value: '0', unit: 'Hz', stale: true, helper: '마지막 패킷 4분 전', timestamp: '10:38:02 KST' },
];

function ReadoutGrid({ rows = readouts }) {
  return (
    <section
      aria-label="센서 텔레메트리"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
        width: '100%',
        minWidth: 0,
        borderTop: '1px solid var(--color-semantic-line-normal-normal)',
      }}
    >
      {rows.map((row) => (
        <article
          key={row.sensor}
          style={{
            minWidth: 0,
            padding: 'var(--space-4) var(--space-3)',
            borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
          }}
        >
          <TelemetryValue
            label={row.sensor}
            value={row.value}
            unit={row.unit}
            tone={row.tone}
            statusLabel={row.statusLabel}
            stale={row.stale}
            helper={row.helper}
            timestamp={row.timestamp}
            size="sm"
          />
        </article>
      ))}
    </section>
  );
}

const meta = {
  title: 'LDS Robotics/Viewer/Telemetry',
  component: TelemetryGauge,
  parameters: {
    docs: {
      description: {
        component: '뷰어 주변의 범위형 수치와 컴팩트 readout을 표현하는 LK Robotics telemetry 패턴입니다. 제품이 severity를 판정하고, 값·단위·상태·freshness·수집 시각을 색에만 의존하지 않고 함께 전달합니다.',
      },
    },
  },
};

export default meta;

export const TelemetryOverview = {
  name: '게이지 개요',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 820, minWidth: 0 }}>
      <section
        aria-label="주요 텔레메트리"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: 'var(--space-4)', alignItems: 'end', minWidth: 0 }}
      >
        <TelemetryGauge value={86} unit="%" label="배터리" tone="positive" statusLabel="충분" />
        <TelemetryGauge value={1.4} max={2} unit="m/s" label="속도" tone="signal" statusLabel="주행 중" />
        <TelemetryGauge value={68} unit="%" label="신호" tone="positive" statusLabel="안정" />
        <TelemetryGauge value={74} unit="%" label="부하" tone="cautionary" statusLabel="주의" />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const meters = [...canvasElement.querySelectorAll('[role="meter"]')];
    if (meters.length !== 4) throw new Error(`TelemetryOverview must expose four meters; received ${meters.length}.`);
    if (!meters.every((meter) => meter.hasAttribute('aria-valuemin') && meter.hasAttribute('aria-valuemax') && meter.hasAttribute('aria-valuenow') && meter.hasAttribute('aria-valuetext'))) {
      throw new Error('Every telemetry gauge must expose min, max, now, and human-readable value text.');
    }
    const speedMeter = meters.find((meter) => meter.getAttribute('aria-valuenow') === '1.4');
    if (!speedMeter || !speedMeter.textContent?.includes('1.4')) throw new Error('Meaningful decimal values must remain visible without implicit rounding.');
  },
};

export const SeverityStates = {
  name: '상태 tone',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 760, minWidth: 0 }}>
      <section aria-label="텔레메트리 상태" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 'var(--space-4)', alignItems: 'end' }}>
        <TelemetryGauge value={48} unit="%" label="기본 정보" tone="signal" statusLabel="측정 중" />
        <TelemetryGauge value={82} unit="%" label="정상 상태" tone="positive" statusLabel="정상" />
        <TelemetryGauge value={64} unit="°C" label="주의 상태" tone="cautionary" statusLabel="상한 접근" />
        <TelemetryGauge value={92} unit="°C" label="위험 상태" tone="negative" statusLabel="상한 초과" />
      </section>
    </main>
  ),
};

export const ThresholdDirections = {
  name: '임계 방향 호환',
  parameters: {
    docs: {
      description: {
        story: '새 제품 코드는 severity를 계산해 tone을 전달하는 방식을 우선합니다. 기존 threshold 사용처는 값이 클수록 좋은지 또는 나쁜지를 반드시 명시합니다.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 640, minWidth: 0 }}>
      <section aria-label="임계 방향 비교" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 'var(--space-5)', alignItems: 'end' }}>
        <TelemetryGauge
          value={18}
          unit="%"
          label="배터리"
          thresholds={{ low: 20, high: 50, direction: 'higher-is-better' }}
        />
        <TelemetryGauge
          value={82}
          max={120}
          unit="°C"
          label="모터 온도"
          thresholds={{ low: 50, high: 67, direction: 'lower-is-better' }}
        />
      </section>
    </main>
  ),
};

export const CompactReadouts = {
  name: '컴팩트 값 읽기',
  parameters: {
    docs: {
      description: {
        story: '고정 폭 table 대신 readout 자체가 320px에서도 줄바꿈되는 반응형 grid를 사용합니다.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', width: '100%', maxWidth: 860, minWidth: 0 }}>
      <ReadoutGrid />
    </main>
  ),
};

export const StaleAndMetadata = {
  name: '지연과 메타데이터',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 360, minWidth: 0 }}>
      <TelemetryValue
        label="LiDAR scan rate"
        value="0"
        unit="Hz"
        stale
        staleLabel="수신 지연"
        helper="마지막 패킷 4분 전"
        timestamp="10:38:02 KST"
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const text = canvasElement.textContent || '';
    if (!text.includes('마지막 패킷 4분 전') || !text.includes('10:38:02 KST')) {
      throw new Error('TelemetryValue must preserve helper and timestamp when both are supplied.');
    }
    if (!text.includes('수신 지연')) throw new Error('Stale state must have a visible non-colour label.');
  },
};

export const FormattingAndValueText = {
  name: '포맷과 접근 가능한 값',
  render: () => (
    <main style={{ display: 'grid', width: '100%', maxWidth: 280, minWidth: 0 }}>
      <TelemetryGauge
        value={0.8467}
        max={1}
        unit="%"
        label="모델 신뢰도"
        tone="positive"
        statusLabel="허용 범위"
        formatter={(current) => (current * 100).toFixed(2)}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const meter = canvasElement.querySelector('[role="meter"]');
    if (!meter) throw new Error('TelemetryGauge must expose role=meter.');
    if (meter.getAttribute('aria-valuenow') !== '0.8467') throw new Error('aria-valuenow must preserve the measured value.');
    if (meter.getAttribute('aria-valuetext') !== '84.67 %, 허용 범위') throw new Error('aria-valuetext must follow the visible formatter output by default.');
    if (!meter.textContent?.includes('84.67')) throw new Error('Custom formatter output must be visible.');
  },
};

export const TelemetryGaugeCard = {
  name: 'TelemetryGauge card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 920, height: 248, background: 'var(--color-semantic-background-normal-normal)', padding: 24, boxSizing: 'border-box', fontFamily: 'var(--font-sans)', color: 'var(--color-semantic-label-normal)' }}>
      <div style={{ margin: '0 0 12px', color: 'var(--color-semantic-label-neutral)', fontSize: 11, lineHeight: 1.4, fontWeight: 'var(--fw-extra)', letterSpacing: 1.6, textTransform: 'uppercase' }}>
        TelemetryGauge
      </div>
      <div style={{ display: 'flex', gap: 26, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TelemetryGauge value={82} unit="%" label="배터리" thresholds={{ low: 20, high: 50, direction: 'higher-is-better' }} />
        <TelemetryGauge value={14} unit="%" label="배터리" thresholds={{ low: 20, high: 50, direction: 'higher-is-better' }} />
        <TelemetryGauge value={1.4} max={2} unit="m/s" label="속도" tone="signal" statusLabel="주행 중" size={104} />
        <TelemetryGauge value={68} unit="%" label="신호" tone="positive" statusLabel="안정" size={104} />
      </div>
    </div>
  ),
};
