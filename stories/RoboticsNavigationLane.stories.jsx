import React from 'react';
import { Button, LaneOverlay, Map2DCanvas } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Robotics/Navigation/Lane',
  component: LaneOverlay,
  parameters: {
    storyGuide: {
      storyId: 'lds-robotics-navigation-lane--lane-overview',
      eyebrow: 'Robotics / Navigation / Lane',
      title: '레인은 두 지점을 잇는 선이 아니라 방향과 통행 조건을 가진 그래프 연결입니다',
      description:
        '정적 geometry와 방향, 반대 레인 관계, 속도·상호 배제 정보를 먼저 읽고 현재 폐쇄·충돌 상태를 별도로 확인하세요. 실제 주행 궤적이나 문·엘리베이터 상태에는 이 레인이 적합하지 않습니다.',
    },
    docs: {
      description: {
        component:
          '방향성 navigation-graph lane을 renderer-neutral data와 non-scaling SVG fragment로 표현하는 LK Robotics Extension입니다.',
      },
    },
  },
};

export default meta;

const BASE_LANE = {
  id: 'lane-a-b',
  label: 'A → B',
  mapId: 'L1',
  points: [
    { x: 72, y: 178 },
    { x: 190, y: 178 },
    { x: 286, y: 92 },
    { x: 440, y: 92 },
  ],
  entry: { waypointId: 'A', orientation: 'forward' },
  exit: { waypointId: 'B', orientation: 'forward' },
  relation: { kind: 'paired', pairedLaneId: 'lane-b-a' },
  speedLimitMps: 0.8,
  mutexGroupId: 'corridor-2',
};

function StoryPage({ title, description, children, maxWidth = 1040 }) {
  return (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth, minWidth: 0 }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)', maxWidth: 760 }}>
        <h2 style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--title3-size)', lineHeight: 'var(--title3-line)' }}>{title}</h2>
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', lineHeight: 1.7 }}>{description}</p>
      </section>
      {children}
    </main>
  );
}

function LaneMap({ appearance = 'light', label, children, height = 270, testId }) {
  return (
    <Map2DCanvas
      appearance={appearance}
      label={label}
      controls={false}
      panEnabled={false}
      wheelZoom={false}
      keyboard={false}
      grid
      defaultViewport={{ x: 0, y: 0, z: 1 }}
      data-testid={testId}
      style={{ width: '100%', minWidth: 0, height }}
    >
      <svg
        width="520"
        height="250"
        viewBox="0 0 520 250"
        role="group"
        aria-label={`${label}의 레인 계층`}
        style={{ display: 'block', width: 'min(520px, calc(100cqw - 32px))', height: 'auto' }}
      >
        <path d="M24 214 H496 M24 36 H496" stroke="var(--viewer-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {children}
      </svg>
    </Map2DCanvas>
  );
}

export const LaneOverview = {
  name: '개요',
  parameters: storyDescription(
    '같은 방향·endpoint·속도·상호 배제 관계를 light와 dark 지도에서 비교합니다. 테마가 달라도 방향 arrow, endpoint, 선 pattern과 label의 정보 우선순위가 유지되는지 확인하세요.',
  ),
  render: () => (
    <StoryPage
      title="레인은 방향, 관계, 제한을 한 번에 읽되 시설 상태와 궤적은 분리합니다"
      description="entry에서 exit로 향하는 arrow가 실제 이동 방향입니다. paired relation은 반대 방향 레인이 별도 graph entity로 존재한다는 뜻이며 양방향 boolean이 아닙니다."
    >
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(360px, 100%), 1fr))', gap: 'var(--space-4)', minWidth: 0 }}>
        <LaneMap label="Light 레인 지도">
          <LaneOverlay lane={BASE_LANE} />
        </LaneMap>
        <LaneMap appearance="dark" label="Dark 레인 지도">
          <LaneOverlay lane={BASE_LANE} />
        </LaneMap>
      </section>
    </StoryPage>
  ),
  play: async ({ canvasElement }) => {
    const lanes = canvasElement.querySelectorAll('[data-lk-lane-overlay]');
    if (lanes.length !== 2) throw new Error(`Light/dark lane parity expected 2 lanes, found ${lanes.length}.`);
    lanes.forEach((lane) => {
      if (lane.getAttribute('data-relation') !== 'paired') throw new Error('Paired lane relation was not preserved.');
      const path = lane.querySelector('[data-lane-path]');
      if (!path?.getAttribute('d')?.startsWith('M 72 178 L')) throw new Error('Lane geometry did not preserve directed points.');
      if (path.getAttribute('vector-effect') !== 'non-scaling-stroke') throw new Error('Lane stroke must remain non-scaling.');
    });
  },
};

const STATE_LANES = [
  {
    lane: {
      ...BASE_LANE,
      id: 'lane-open',
      label: '통행 가능',
      points: [{ x: 60, y: 52 }, { x: 460, y: 52 }],
      relation: { kind: 'single' },
    },
    availability: 'available',
  },
  {
    lane: {
      ...BASE_LANE,
      id: 'lane-closed',
      label: '폐쇄',
      points: [{ x: 60, y: 116 }, { x: 460, y: 116 }],
      entry: { waypointId: 'C', orientation: 'forward', transitionIds: ['transition-door-a'] },
      exit: { waypointId: 'D', orientation: 'backward', transitionIds: ['transition-lift-a', 'transition-lift-b'] },
      relation: { kind: 'single' },
    },
    availability: 'closed',
  },
  {
    lane: {
      ...BASE_LANE,
      id: 'lane-unknown-conflict',
      label: '미확인 · 충돌',
      points: [{ x: 60, y: 186 }, { x: 230, y: 186 }, { x: 320, y: 154 }, { x: 460, y: 154 }],
      relation: { kind: 'single' },
    },
    availability: 'unknown',
    conflict: true,
  },
];

export const LaneStatesAndConstraints = {
  name: '변형·상태 · 폐쇄, 충돌, 전환 참조',
  parameters: storyDescription(
    'available/closed/unknown과 conflict를 독립 조합하고 entry/exit 전환 참조를 중립 T/count로 표시합니다. 색을 가려도 dash와 ×/?/! glyph로 상태를 구분할 수 있어야 합니다.',
  ),
  render: () => (
    <StoryPage
      title="폐쇄와 충돌은 같은 상태가 아니며 시설 전환은 중립 참조로만 남깁니다"
      description="문이나 엘리베이터의 실시간 상태는 Facility Transition이 소유합니다. 레인은 해당 경계에 전환이 있다는 사실과 개수만 표시하고 종류를 ID에서 추론하지 않습니다."
      maxWidth={780}
    >
      <LaneMap label="레인 복합 상태 지도" height={280}>
        {STATE_LANES.map(({ lane, availability, conflict }) => (
          <LaneOverlay key={lane.id} lane={lane} availability={availability} conflict={conflict} />
        ))}
      </LaneMap>
    </StoryPage>
  ),
  play: async ({ canvasElement }) => {
    const closed = canvasElement.querySelector('[data-lane-id="lane-closed"]');
    const unknownConflict = canvasElement.querySelector('[data-lane-id="lane-unknown-conflict"]');
    if (!closed?.querySelector('[data-lane-path]')?.getAttribute('stroke-dasharray')) {
      throw new Error('Closed lane needs a non-color dash pattern.');
    }
    if (closed.querySelectorAll('[data-lane-transition-count]').length !== 2) {
      throw new Error('Entry and exit transition counts must stay independently visible.');
    }
    if (!unknownConflict?.querySelector('[data-lane-conflict-pattern]')) {
      throw new Error('Conflict must remain an independent pattern over unknown availability.');
    }
    const glyphs = Array.from(unknownConflict.querySelectorAll('[data-lane-state-glyph]'))
      .map((element) => element.getAttribute('data-lane-state-glyph'));
    if (!glyphs.includes('?') || !glyphs.includes('!')) {
      throw new Error(`Unknown + conflict needs both ? and ! glyphs: ${glyphs.join(',')}`);
    }
  },
};

function LaneActivationFixture() {
  const [selectedId, setSelectedId] = React.useState('');
  const [activations, setActivations] = React.useState(0);
  const activate = (id) => {
    setSelectedId(id);
    setActivations((count) => count + 1);
  };

  return (
    <StoryPage
      title="선택 가능한 레인은 pointer와 키보드가 같은 identity를 전달합니다"
      description="선택은 path의 굵은 solid halo로 남습니다. disabled 레인은 맥락을 보존하지만 Tab 순서와 activation에서 빠지며, 전체 그래프 탐색은 이름 있는 목록을 함께 제공해야 합니다."
      maxWidth={780}
    >
      <LaneMap label="레인 선택 지도">
        <LaneOverlay
          lane={{ ...BASE_LANE, id: 'lane-selectable', label: '검사할 레인' }}
          selected={selectedId === 'lane-selectable'}
          onActivate={activate}
        />
        <LaneOverlay
          lane={{
            ...BASE_LANE,
            id: 'lane-disabled',
            label: '잠긴 레인',
            points: [{ x: 72, y: 220 }, { x: 440, y: 220 }],
          }}
          availability="closed"
          disabled
          onActivate={activate}
        />
      </LaneMap>
      <output data-testid="lane-activation-output" style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--body2-size)' }}>
        선택: {selectedId || '없음'} · activation {activations}회
      </output>
    </StoryPage>
  );
}

function nextRender() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

export const LaneSelectionAndActivation = {
  name: '상호작용 · 선택과 비활성',
  parameters: storyDescription(
    '레인 path를 클릭하거나 focus 후 Enter/Space를 눌러 같은 callback이 실행되는지 확인합니다. disabled path는 activation이 발생하지 않고 tabIndex -1을 유지해야 합니다.',
  ),
  render: () => <LaneActivationFixture />,
  play: async ({ canvasElement }) => {
    const enabled = canvasElement.querySelector('[data-lane-id="lane-selectable"]');
    const disabled = canvasElement.querySelector('[data-lane-id="lane-disabled"]');
    const output = () => canvasElement.querySelector('[data-testid="lane-activation-output"]')?.textContent ?? '';
    const view = canvasElement.ownerDocument.defaultView;
    if (!enabled || enabled.getAttribute('role') !== 'button' || !enabled.getAttribute('aria-label')?.includes('검사할 레인')) {
      throw new Error('Interactive lane needs a button role and useful accessible name.');
    }
    const hitCore = enabled.querySelector('[data-lane-hit-target-core]');
    if (!hitCore || Number(hitCore.getAttribute('r')) * Math.SQRT2 < 24) {
      throw new Error('Interactive lane needs a midpoint target that contains 24×24 CSS px.');
    }
    enabled.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    await nextRender();
    enabled.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await nextRender();
    enabled.dispatchEvent(new view.KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await nextRender();
    if (!output().includes('activation 3회') || enabled.getAttribute('data-selected') !== 'true') {
      throw new Error(`Pointer/keyboard activation or selected state failed: ${output()}`);
    }
    if (disabled.getAttribute('tabindex') !== '-1' || disabled.getAttribute('aria-disabled') !== 'true') {
      throw new Error('Disabled lane must expose aria-disabled and leave the Tab order.');
    }
    disabled.dispatchEvent(new view.MouseEvent('click', { bubbles: true, cancelable: true }));
    disabled.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    await nextRender();
    if (!output().includes('activation 3회')) throw new Error('Disabled lane invoked onActivate.');
  },
};

export const LaneNarrow320 = {
  name: '반응형 · 320px 좁은 폭',
  parameters: storyDescription(
    '320px 폭에서 지도 viewport가 페이지 폭을 밀어내지 않는지, label과 상태 glyph가 clip되더라도 레인의 accessible name과 semantic mirror가 유지되는지 확인합니다.',
  ),
  render: () => (
    <div data-testid="lane-narrow" style={{ width: 320, maxWidth: '100%', minWidth: 0, overflow: 'hidden' }}>
      <StoryPage
        title="좁은 화면에서는 viewport를 보존하고 상세 탐색은 목록으로 이어집니다"
        description="지도 안 label을 억지로 여러 줄 card로 만들지 않습니다. 보이는 선과 glyph는 유지하고 동일 레인 identity를 아래 목록에서 다시 선택할 수 있게 구성합니다."
      >
        <LaneMap label="320px 레인 지도" height={230}>
          <LaneOverlay lane={BASE_LANE} availability="closed" conflict viewportScale={0.8} />
        </LaneMap>
        <Button type="button" variant="secondary" full>A → B 레인 상세 열기 · 폐쇄 · 충돌</Button>
      </StoryPage>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const narrow = canvasElement.querySelector('[data-testid="lane-narrow"]');
    if (!narrow || narrow.scrollWidth > narrow.clientWidth) {
      throw new Error(`Lane narrow story overflowed: ${narrow?.scrollWidth}/${narrow?.clientWidth}`);
    }
    const lane = narrow.querySelector('[data-lk-lane-overlay]');
    if (!lane?.getAttribute('aria-label')?.includes('폐쇄') || !lane.getAttribute('aria-label')?.includes('충돌')) {
      throw new Error('Narrow visual clipping must not remove lane state from the accessible name.');
    }
  },
};

export const LaneVisualParity = {
  ...LaneStatesAndConstraints,
  name: 'Lane overlay visual parity',
  tags: ['!dev', 'visual-parity'],
};
