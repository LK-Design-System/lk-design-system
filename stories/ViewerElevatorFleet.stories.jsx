import React from 'react';
import { ElevatorFleetOverview } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const buildings = [
  {
    id: 'a',
    name: 'A동 연구센터',
    floors: ['8F', '7F', '6F', '5F', '4F', '3F', '2F', '1F', 'B1'],
    groundFloor: '1F',
    elevators: [
      {
        id: 'a-1',
        name: 'E/V 1',
        currentFloor: '7F',
        direction: 'up',
        directionLabel: '상승 중',
        status: 'normal',
        statusLabel: '정상',
        updatedLabel: '2초 전',
      },
      {
        id: 'a-2',
        name: 'E/V 2',
        currentFloor: '3F',
        direction: 'idle',
        directionLabel: '정지',
        status: 'normal',
        statusLabel: '정상',
        updatedLabel: '1초 전',
      },
    ],
  },
  {
    id: 'b',
    name: 'B동 업무센터',
    floors: ['12F', '11F', '10F', '9F', '8F', '7F', '6F', '5F', '4F', '3F', '2F', '1F'],
    groundFloor: '1F',
    elevators: [
      {
        id: 'b-1',
        name: 'E/V 1',
        currentFloor: '11F',
        direction: 'up',
        directionLabel: '상승 중',
        status: 'normal',
        statusLabel: '정상',
        updatedLabel: '방금',
      },
      {
        id: 'b-2',
        name: 'E/V 2',
        currentFloor: '9F',
        direction: 'down',
        directionLabel: '하강 중',
        status: 'normal',
        statusLabel: '정상',
        updatedLabel: '3초 전',
      },
      {
        id: 'b-3',
        name: '화물 E/V',
        currentFloor: '4F',
        direction: 'idle',
        directionLabel: '정지',
        status: 'maintenance',
        statusLabel: '점검',
        updatedLabel: '12초 전',
      },
    ],
  },
  {
    id: 'c',
    name: 'C동 물류센터',
    floors: ['6F', '5F', '4F', '3F', '2F', '1F', 'B1', 'B2'],
    groundFloor: '1F',
    elevators: [
      {
        id: 'c-1',
        name: 'E/V 1',
        currentFloor: '6F',
        direction: 'idle',
        directionLabel: '정지',
        status: 'fault',
        statusLabel: '고장',
        updatedLabel: '1분 전',
      },
      {
        id: 'c-2',
        name: 'E/V 2',
        currentFloor: 'B1',
        direction: 'down',
        directionLabel: '하강 중',
        status: 'offline',
        statusLabel: '연결 끊김',
        updatedLabel: '5분 전',
      },
    ],
  },
  {
    id: 'd',
    name: 'D동 생산동',
    floors: ['5F', '4F', '3F', '2F', '1F'],
    groundFloor: '1F',
    elevators: [
      {
        id: 'd-1',
        name: 'E/V 1',
        currentFloor: '2F',
        direction: 'up',
        status: 'normal',
        statusLabel: '정상',
        updatedLabel: '4초 전',
      },
      {
        id: 'd-2',
        name: '화물 E/V',
        currentFloor: '5F',
        direction: 'idle',
        directionLabel: '정지',
        status: 'normal',
        statusLabel: '정상',
        updatedLabel: '방금',
      },
    ],
  },
];

const meta = {
  title: 'LDS Product/Viewer/Elevator Fleet Overview',
  tags: ['autodocs'],
  component: ElevatorFleetOverview,
  parameters: {
    layout: 'fullscreen',
    storyGuide: {
      storyId: 'lds-product-viewer-elevator-fleet-overview--fleet-overview',
      eyebrow: 'Product / Viewer',
      title: '건물을 전환하지 않고 모든 엘리베이터의 현재 층을 훑어봅니다.',
      description:
        '같은 건물의 엘리베이터는 하나의 층 눈금을 공유하고, 건물 그룹은 좌우로 이어 붙습니다. 건물마다 층 구성이 다르므로 건물 사이의 같은 층 이름을 같은 높이에 맞추지 않습니다.',
    },
    docs: {
      description: {
        component:
          '엘리베이터 한 대를 하나의 세로 위치 컬럼으로 표현하고, 건물 그룹을 좌우로 확장하는 읽기 전용 fleet projection입니다.',
      },
    },
  },
};

export default meta;

function FleetFixture({ narrow = false }) {
  return (
    <main
      style={{
        width: narrow ? 390 : '100%',
        maxWidth: '100%',
        minHeight: '100vh',
        padding: narrow ? 'var(--space-3) 0' : 'var(--space-5)',
        boxSizing: 'border-box',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 1320, margin: '0 auto' }}>
        <ElevatorFleetOverview buildings={buildings} headingLevel={2} />
      </div>
    </main>
  );
}

export const FleetOverview = {
  name: '통합 관제',
  parameters: storyDescription(
    '건물별 엘리베이터 컬럼을 동일한 방향으로 배치해 현재 위치와 운행 상태를 동시에 확인합니다.',
  ),
  render: () => <FleetFixture />,
};

export const NarrowViewport = {
  name: '좁은 화면',
  tags: ['!dev'],
  parameters: {
    ...storyDescription(
      '좁은 화면에서도 엘리베이터 컬럼 폭을 유지하고 하나의 명명된 가로 스크롤 영역으로 탐색합니다.',
    ),
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => <FleetFixture narrow />,
};

export const DarkTheme = {
  name: '다크 테마',
  tags: ['!dev'],
  parameters: {
    ...storyDescription(
      '관제실 환경에서 승강로 경계, 차량 위치, 고장·점검·연결 끊김 상태의 대비를 확인합니다.',
    ),
    backgrounds: { default: 'Dark' },
  },
  render: () => (
    <div
      data-theme="dark"
      style={{
        minHeight: '100vh',
        padding: 'var(--space-5)',
        boxSizing: 'border-box',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <ElevatorFleetOverview buildings={buildings} headingLevel={2} />
    </div>
  ),
};

export const EmptyFleet = {
  name: '빈 관제',
  tags: ['!dev'],
  parameters: storyDescription(
    '등록된 건물이 없을 때 빈 차트 대신 하나의 명확한 상태 메시지를 제공합니다.',
  ),
  render: () => (
    <main style={{ maxWidth: 640, padding: 'var(--space-6)' }}>
      <ElevatorFleetOverview buildings={[]} emptyMessage="등록된 건물이 없습니다." />
    </main>
  ),
};

export const ReadOnlyContract = {
  name: '읽기 전용 계약',
  tags: ['!dev'],
  render: () => <FleetFixture />,
  play: async ({ canvasElement }) => {
    const fleet = canvasElement.querySelector('[aria-label="건물별 엘리베이터 현황"]');
    if (!fleet) throw new Error('Fleet overview needs a named landmark.');

    const columns = canvasElement.querySelectorAll('[data-elevator-id]');
    if (columns.length !== 9) throw new Error('Every elevator needs one visible position column.');
    if (fleet.querySelector('button, [aria-pressed]')) {
      throw new Error('The monitoring projection must remain read-only.');
    }

    const firstColumn = canvasElement.querySelector('[data-elevator-id="a-1"]');
    const firstDirection = firstColumn?.querySelector('[data-direction-glyph]');
    const firstPosition = firstColumn?.querySelector('[data-position-value]');
    if (!firstDirection || firstColumn.querySelectorAll('[data-direction-glyph]').length !== 1) {
      throw new Error('Each elevator needs one read-only direction signal.');
    }
    if (!firstDirection.querySelector('svg') || firstDirection.dataset.direction !== 'up') {
      throw new Error('Moving elevators need the matching LDS chevron.');
    }
    if (!firstDirection.style.color.includes('primary-normal')) {
      throw new Error('Moving chevrons need the primary direction color.');
    }
    const normalCurrentRow = firstColumn?.querySelector('[data-current-floor="true"]');
    if (normalCurrentRow?.style.borderInline) {
      throw new Error('Current-floor rows must not reintroduce a lateral outline.');
    }
    const normalDoor = normalCurrentRow?.querySelector('[data-door-variant="solid"]');
    if (
      !normalDoor
      || !normalDoor.style.background.includes('primary-normal')
      || normalDoor.style.background.includes('surface')
    ) {
      throw new Error('Normal current-floor door icons must keep the solid primary treatment.');
    }
    if (firstDirection.previousElementSibling !== firstPosition?.parentElement) {
      throw new Error('The direction signal must follow the current floor.');
    }
    if (firstColumn?.querySelectorAll('.lk-status-indicator').length !== 1) {
      throw new Error('Each elevator needs one live status indicator.');
    }
    if (firstColumn?.querySelector('.lk-status-badge')) {
      throw new Error('Per-elevator live status must not use an aggregate status badge.');
    }

    const idleDirection = canvasElement.querySelector(
      '[data-elevator-id="a-2"] [data-direction-glyph="idle"]',
    );
    if (!idleDirection || idleDirection.textContent !== '—') {
      throw new Error('Idle elevators need one neutral dash.');
    }
    if (!idleDirection.style.color.includes('label-alternative')) {
      throw new Error('Idle direction needs secondary visual hierarchy.');
    }

    const offlineColumn = canvasElement.querySelector('[data-elevator-id="c-2"]');
    if (offlineColumn?.querySelector('[data-position-value]')?.textContent !== 'B1') {
      throw new Error('Offline elevators must keep their last confirmed floor visible.');
    }
    if (!offlineColumn?.textContent.includes('마지막')) {
      throw new Error('Offline elevators must identify the floor as a last-known position.');
    }
    if (offlineColumn?.querySelector('[data-direction-glyph]')) {
      throw new Error('Offline elevators must suppress stale direction.');
    }

    const maintenanceDoor = canvasElement.querySelector(
      '[data-elevator-id="b-3"] [data-current-floor="true"] [data-door-variant="solid"]',
    );
    if (
      !maintenanceDoor?.style.background.includes('status-cautionary')
      || maintenanceDoor.style.background.includes('border')
      || maintenanceDoor.style.background.includes('surface')
    ) {
      throw new Error('Maintenance current-floor door icons must keep the solid cautionary treatment.');
    }

    const faultDoor = canvasElement.querySelector(
      '[data-elevator-id="c-1"] [data-current-floor="true"] [data-door-variant="solid"]',
    );
    if (
      !faultDoor?.style.background.includes('status-negative')
      || faultDoor.style.background.includes('border')
      || faultDoor.style.background.includes('surface')
    ) {
      throw new Error('Fault current-floor door icons must keep the solid negative treatment.');
    }

    const fallbackSummary = canvasElement.querySelector(
      '[data-elevator-id="d-1"] [role="img"]',
    )?.getAttribute('aria-label');
    if (!fallbackSummary?.includes('상승 중')) {
      throw new Error('Direction text must be derived when directionLabel is omitted.');
    }

    // The stylesheet is appended by an effect, so reading it synchronously
    // asserted against whichever moment the runner happened to reach first.
    const guarded = async () => {
      const deadline = Date.now() + 2000;
      while (Date.now() < deadline) {
        const sheet = canvasElement.ownerDocument.getElementById('lk-elevator-fleet-css');
        if (sheet?.textContent.includes('prefers-reduced-motion:reduce')) return true;
        await new Promise((resolve) => { setTimeout(resolve, 25); });
      }
      return false;
    };
    if (!await guarded()) {
      throw new Error('Direction motion needs a reduced-motion guard.');
    }
  },
};

export const ElevatorFleetOverviewCard = {
  name: 'ElevatorFleetOverview console parity',
  tags: ['!dev', 'visual-parity'],
  render: () => (
    <div style={{ width: 1240, maxWidth: '100%', padding: 'var(--space-4)', boxSizing: 'border-box' }}>
      <ElevatorFleetOverview buildings={buildings} headingLevel={2} />
    </div>
  ),
};
