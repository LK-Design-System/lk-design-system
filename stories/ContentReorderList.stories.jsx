import React from 'react';
import { userEvent, waitFor } from 'storybook/test';
import { ReorderList } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Content/Reorder List',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-content-reorder-list--reorder-lists',
      eyebrow: 'Product / Reorder List',
      title: '사용자가 같은 수준의 항목을 원하는 우선순서로 다시 배열합니다',
      description:
        '대시보드 패널이나 표시 항목처럼 동등한 목록의 순서를 직접 바꿀 때 적합합니다. 단계형 절차나 부모·자식 구조에는 ReorderList 대신 Steps 또는 Tree를 사용하세요.',
    },
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
  name: '개요',
  parameters: storyDescription(
    '대시보드 패널의 표시 순서를 사용자가 다시 정하는 기본 상황입니다. 드래그와 키보드 조작 모두에서 이동 대상, 새 위치, 보조 상태가 분명한지 확인하세요.',
  ),
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
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument;
    const titles = () => Array.from(canvasElement.querySelectorAll('li[aria-posinset]'))
      .map((row) => row.getAttribute('aria-label'));
    const initial = titles();
    if (initial.length !== 4) throw new Error('재정렬 목록에는 네 개의 항목이 있어야 합니다.');

    const up = canvasElement.querySelector('button[aria-label="로봇 상태 위로 이동"]');
    if (!up) throw new Error('문맥명이 붙은 위로 이동 버튼이 필요합니다.');
    if (up.disabled) throw new Error('이동 버튼은 native disabled 대신 aria-disabled를 써야 포커스를 잃지 않습니다.');

    await userEvent.click(up);
    await waitFor(() => {
      if (!titles()[0].includes('로봇 상태')) throw new Error('위로 이동 버튼이 항목을 실제로 옮겨야 합니다.');
    });
    if (up.getAttribute('aria-disabled') !== 'true') {
      throw new Error('맨 위에 도달하면 위로 이동은 aria-disabled로 거절되어야 합니다.');
    }
    if (doc.activeElement !== up) {
      throw new Error('끝단에 도달해도 포커스가 body로 떨어지지 않고 이동 버튼에 남아 있어야 합니다.');
    }
    const live = canvasElement.querySelector('[role="status"]');
    if (!live || !live.textContent.includes('위치로 이동')) {
      throw new Error('이동 결과는 polite live region으로 공지되어야 합니다.');
    }

    // 이름난 상태로 복귀 — 원래 순서를 되돌린다.
    const down = canvasElement.querySelector('button[aria-label="로봇 상태 아래로 이동"]');
    if (!down) throw new Error('아래로 이동 버튼이 필요합니다.');
    await userEvent.click(down);
    await waitFor(() => {
      if (titles().join('|') !== initial.join('|')) throw new Error('스토리는 원래 순서로 복귀해야 합니다.');
    });
    down.blur();
  },
};

export const WithIndex = {
  name: '반응형 · 조밀한 밀도와 순번',
  parameters: storyDescription(
    '제한된 공간에서 순번을 함께 보여 주며 항목을 재정렬하는 상황입니다. compact 밀도에서도 핸들·순번·라벨·후행 정보가 겹치지 않고 조작 가능 영역을 유지하는지 확인하세요.',
  ),
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
  name: '변형·상태 · 항목 없음',
  parameters: storyDescription(
    '아직 재정렬할 항목이 없는 초기 상태입니다. 빈 목록이 고장 난 화면처럼 보이지 않고 다음에 항목이 생길 수 있다는 맥락을 방해 없이 전달하는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(640px, 100%)', minWidth: 0 }}>
      <ReorderList items={[]} />
    </main>
  ),
};
