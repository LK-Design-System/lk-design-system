import React from 'react';
import {
  BarChart,
  Calendar,
  Carousel,
  DataGrid,
  DescriptionList,
  DonutChart,
  Icon,
  Sparkline,
  StatusBadge,
  Table,
  Tree,
} from '../src/index.js';

const meta = {
  title: '컴포넌트/데이터',
  parameters: {
    docs: {
      description: {
        component: '운영 데이터, 표, 차트, 계층 구조를 표시하는 데이터 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

const rows = [
  { id: 'AMR-07', site: '대덕 2F', status: 'online', battery: '86%' },
  { id: 'Forklift-B2', site: '고양 공장', status: 'weak', battery: '47%' },
  { id: 'Docking-03', site: '서울 R&D', status: 'offline', battery: '12%' },
];

const columns = [
  { key: 'id', label: '로봇' },
  { key: 'site', label: '위치' },
  { key: 'status', label: '상태' },
  { key: 'battery', label: '배터리', align: 'right' },
];

export const ChartsAndCalendar = {
  name: '차트와 캘린더',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <BarChart
            height={180}
            showValue
            data={[
              { label: '순찰', value: 42 },
              { label: '청소', value: 28 },
              { label: '운반', value: 18 },
              { label: '대기', value: 7 },
            ]}
          />
        </div>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <DonutChart
            centerLabel="95%"
            segments={[
              { label: '정상', value: 72, color: 'var(--bw-green)' },
              { label: '점검', value: 18, color: 'var(--bw-amber)' },
              { label: '오프라인', value: 5, color: 'var(--bw-red)' },
            ]}
          />
        </div>
        <Calendar defaultValue="2026-07-05" />
      </section>

      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Sparkline data={[8, 12, 9, 16, 15, 22, 18, 28]} width={220} height={64} />
        <span style={{ color: 'var(--label-neutral)' }}>일일 미션 처리량 추세</span>
      </section>
    </main>
  ),
};

export const CalendarCard = {
  name: 'Calendar card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 360, height: 340, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <Calendar defaultValue="2026-07-03" />
    </div>
  ),
};

export const TablesAndHierarchy = {
  name: '표와 계층',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 1040 }}>
      <DataGrid columns={columns} rows={rows} selectable />
      <Table columns={columns} rows={rows} />

      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(260px, 1fr)', gap: 'var(--space-5)', alignItems: 'start' }}>
        <DescriptionList
          columns={1}
          items={[
            { term: '메시지 타입', description: 'sensor_msgs/LaserScan' },
            { term: '주기', description: '12 Hz' },
            { term: 'QoS', description: 'Reliable' },
          ]}
        />
        <Tree
          defaultExpanded={['fleet', 'amr-07']}
          nodes={[
            {
              id: 'fleet',
              label: 'fleet',
              icon: <Icon name="robot" size={16} />,
              children: [
                { id: 'amr-07', label: 'AMR-07', icon: <Icon name="circle-dot" size={16} />, children: [{ id: 'status', label: '/status' }, { id: 'battery', label: '/battery' }] },
                { id: 'dock-03', label: 'Docking-03', icon: <Icon name="circle" size={16} /> },
              ],
            },
          ]}
        />
      </section>

      <Carousel
        slides={[
          <div key="one" style={{ minHeight: 140, display: 'grid', placeItems: 'center', background: 'var(--lk-accent-tint)', borderRadius: 'var(--radius-lg)' }}>지도 카드</div>,
          <div key="two" style={{ minHeight: 140, display: 'grid', placeItems: 'center', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>텔레메트리 카드</div>,
        ]}
      />
    </main>
  ),
};

export const TableCard = {
  name: 'Table card parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div data-visual-crop-root style={{ width: 440, height: 260, background: 'var(--bw-paper)', padding: 24, boxSizing: 'border-box' }}>
      <div style={{ background: 'var(--bw-white)', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-xl)', padding: 8 }}>
        <Table
          columns={[
            { key: 'code', label: '모델' },
            { key: 'site', label: '현장' },
            { key: 'status', label: '상태', render: (row) => <StatusBadge tone={row.tone}>{row.status}</StatusBadge> },
          ]}
          rows={[
            { code: 'LKR-T1', site: '판교 물류센터', status: '가동중', tone: 'positive' },
            { code: 'LKR-CP', site: '인천공항 T2', status: '점검 중', tone: 'warning' },
            { code: 'LKR-S1', site: '고리 발전소', status: '오프라인', tone: 'offline' },
          ]}
        />
      </div>
    </div>
  ),
};
