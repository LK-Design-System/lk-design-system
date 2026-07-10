import React from 'react';
import { ReorderList } from '../src/index.js';

const meta = {
  title: 'LDS Product/Content/Reorder List',
  parameters: {
    docs: {
      description: {
        component: '같은 레벨의 리스트 항목 순서를 바꾸는 ReorderList 패턴입니다. 작업 단계 저작은 단계형 목록 패턴을 사용합니다.',
      },
    },
  },
};

export default meta;

function StatusPill({ children }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 24,
        padding: '0 8px',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--color-semantic-fill-normal)',
        color: 'var(--color-semantic-label-neutral)',
        fontSize: 'var(--label2-size)',
        lineHeight: 'var(--label2-line)',
        fontWeight: 'var(--fw-semibold)',
        letterSpacing: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

const panels = [
  { id: 'map', label: '지도 패널', detail: '실시간 위치와 경로 오버레이', trailing: <StatusPill>필수</StatusPill> },
  { id: 'status', label: '로봇 상태', detail: '배터리, 모드, 연결 상태' },
  { id: 'alerts', label: '이벤트 큐', detail: 'WARN 이상 알림 우선 표시', trailing: <StatusPill>3건</StatusPill> },
  { id: 'telemetry', label: '텔레메트리', detail: '속도, 전류, 주행 거리' },
];

function reorder(current, ids) {
  return ids.map((id) => current.find((item) => item.id === id)).filter(Boolean);
}

export const ReorderLists = {
  name: '정렬 리스트',
  render: () => {
    const [items, setItems] = React.useState(panels);

    return (
      <main style={{ width: 'min(640px, 100%)', minWidth: 0 }}>
        <ReorderList
          items={items}
          onReorder={(ids) => setItems((current) => reorder(current, ids))}
        />
      </main>
    );
  },
};

export const WithIndex = {
  name: '순번 표시',
  render: () => {
    const [items, setItems] = React.useState(panels);

    return (
      <main style={{ width: 'min(640px, 100%)', minWidth: 0 }}>
        <ReorderList
          items={items}
          showIndex
          density="compact"
          onReorder={(ids) => setItems((current) => reorder(current, ids))}
        />
      </main>
    );
  },
};

export const Empty = {
  name: '항목 없음',
  render: () => (
    <main style={{ width: 'min(640px, 100%)', minWidth: 0 }}>
      <ReorderList items={[]} />
    </main>
  ),
};
