import React from 'react';
import {
  Badge,
  CanvasEditorShell,
  ConnectionBadge,
  EditorToolbar,
  EquipmentStatusCard,
  HistoryToolbar,
  Icon,
  Joystick,
  Map2DCanvas,
  RobotStatusCard,
  Scene3DFrame,
  StatusBadge,
  TelemetryGauge,
  TopicTree,
  VideoStreamTile,
  ViewerToolbar,
  ViewerToolbarButton,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/로보틱스와 뷰어',
  parameters: {
    docs: {
      description: {
        component: '로봇 상태, 설비 상태, 토픽 트리, 지도/3D/비디오/에디터 셸 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

const topicNodes = [
  {
    name: '/fleet',
    type: 'namespace',
    children: [
      { name: '/amr_07/status', type: 'lk_msgs/RobotStatus', hz: 5, subscribable: true, subscribed: true },
      { name: '/amr_07/scan', type: 'sensor_msgs/LaserScan', hz: 12, subscribable: true },
    ],
  },
];

export const RoboticsStatus = {
  name: '로보틱스 상태',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <section style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <ConnectionBadge status="online" />
        <ConnectionBadge status="weak" />
        <ConnectionBadge status="reconnecting" />
        <ConnectionBadge status="offline" />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <RobotStatusCard name="AMR-07" status="online" battery={86} mode="순찰" selected />
        <RobotStatusCard name="Forklift-B2" status="reconnecting" battery={47} mode="수동" />
        <EquipmentStatusCard
          icon={<Icon name="home" />}
          title="화물 엘리베이터 2호기"
          ringLabel="3F"
          ringCaption="상승 중"
          direction="up"
          chips={[{ label: '호출됨', tone: 'signal' }, { label: '정상', tone: 'positive' }]}
        />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '260px minmax(320px, 1fr)', gap: 'var(--space-5)', alignItems: 'start' }}>
        <Joystick label="수동 조작" />
        <TopicTree nodes={topicNodes} />
      </section>
    </main>
  ),
};

export const ViewerAndTelemetry = {
  name: '뷰어와 텔레메트리',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        <TelemetryGauge value={72} unit="%" label="배터리" thresholds={{ low: 20, high: 50 }} />
        <VideoStreamTile label="RGB" status="live">
          <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.72)', background: 'linear-gradient(135deg, #0E1329, #273A5E)' }}>
            live stream
          </div>
        </VideoStreamTile>
      </section>

      <Map2DCanvas style={{ height: 320 }}>
        <svg width="360" height="240" viewBox="-180 -120 360 240" aria-label="map overlay">
          <rect x="-150" y="-90" width="300" height="180" rx="12" fill="rgba(47,111,174,0.14)" stroke="var(--lk-accent-ink)" />
          <path d="M-110 40 C-20 -40 60 70 120 -30" fill="none" stroke="var(--bw-green)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="120" cy="-30" r="10" fill="var(--bw-red)" />
        </svg>
      </Map2DCanvas>

      <Scene3DFrame
        title="3D VIEW"
        badges={<StatusBadge tone="online">live</StatusBadge>}
        toolbar={
          <ViewerToolbar>
            <ViewerToolbarButton label="줌" active><Icon name="search" size={16} /></ViewerToolbarButton>
            <ViewerToolbarButton label="레이어"><Icon name="layers" size={16} /></ViewerToolbarButton>
          </ViewerToolbar>
        }
        style={{ height: 300 }}
      >
        <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.52)', background: 'linear-gradient(180deg, #101828, #0E1329)' }}>
          3D canvas slot
        </div>
      </Scene3DFrame>
    </main>
  ),
};

export const EditorShell = {
  name: '에디터 셸',
  render: () => (
    <CanvasEditorShell
      title="미션 경로 편집"
      tools={
        <EditorToolbar
          items={[
            { value: 'select', label: '선택', icon: <Icon name="crosshair" size={18} /> },
            { value: 'route', label: '경로', icon: <Icon name="route" size={18} /> },
            { value: 'zone', label: '구역', icon: <Icon name="zone" size={18} /> },
          ]}
          defaultValue="route"
        />
      }
      panel={
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <strong>속성</strong>
          <span style={{ color: 'var(--label-neutral)' }}>웨이포인트 12개</span>
          <Badge tone="navy">draft</Badge>
        </div>
      }
      status={<HistoryToolbar canUndo canRedo count={8} onReset={() => {}} />}
      style={{ minHeight: 420 }}
    >
      <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: 'var(--label-alternative)' }}>
        캔버스 영역
      </div>
    </CanvasEditorShell>
  ),
};

const parityCloudPoints = Array.from({ length: 130 }, (_, index) => {
  const x = (index * 37) % 100;
  const y = (index * 53) % 100;
  return {
    x,
    y,
    r: 0.6 + ((index * 7) % 12) / 10,
    opacity: 0.25 + ((index * 11) % 7) / 12,
  };
});

function ParityCloudPlaceholder() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 20%, rgba(132,146,164,0.14), transparent 60%)' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {parityCloudPoints.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={point.x}
            cy={point.y}
            r={point.r}
            fill={index % 5 === 0 ? 'var(--lk-accent)' : '#fff'}
            opacity={point.opacity}
          />
        ))}
      </svg>
    </div>
  );
}

export const Scene3DFrameCard = {
  name: 'Scene3DFrame card parity',
  render: () => (
    <Scene3DFrame
      title="POINT CLOUD"
      badges={<ConnectionBadge status="online" size="sm" />}
      toolbar={(
        <ViewerToolbar orientation="horizontal">
          <ViewerToolbarButton label="?"><Icon name="home" size={16} /></ViewerToolbarButton>
          <ViewerToolbarButton label="???" active><Icon name="filter" size={16} /></ViewerToolbarButton>
        </ViewerToolbar>
      )}
      style={{ height: 300 }}
    >
      <ParityCloudPlaceholder />
    </Scene3DFrame>
  ),
};

export const TelemetryGaugeCard = {
  name: 'TelemetryGauge card parity',
  render: () => (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.6, textTransform: 'uppercase', color: 'var(--label-assistive)', margin: '0 0 12px' }}>
        TelemetryGauge
      </div>
      <div style={{ display: 'flex', gap: 26, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TelemetryGauge value={82} unit="%" label="???" thresholds={{ low: 20, high: 50 }} />
        <TelemetryGauge value={14} unit="%" label="???" thresholds={{ low: 20, high: 50 }} />
        <TelemetryGauge value={1.4} max={2} unit="m/s" label="??" tone="signal" size={104} />
        <TelemetryGauge value={68} unit="%" label="??" tone="positive" size={104} />
      </div>
    </div>
  ),
};
