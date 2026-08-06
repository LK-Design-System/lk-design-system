import { useState } from 'react';
import { NetworkGraph } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

/*
  관계도의 계약 중 자동으로 지킬 수 있는 것들.

  이 셋을 고정하는 이유는 두 소비 제품이 각각 손으로 구현하면서 정확히 이
  지점들에서 어긋났기 때문이다 — 한쪽은 바깥 SVG에 `role="img"`를 얹어 안쪽
  노드를 보조기술에서 지웠고, 배치가 난수를 타면 시각 회귀 비교가 불가능했다.
*/
function assertFocusableNodes(canvasElement, label) {
  const nodes = Array.from(canvasElement.querySelectorAll('[data-network-node]'));
  if (!nodes.length) throw new Error(`${label} must render a node per entity.`);

  const unnamed = nodes.filter((node) => !node.getAttribute('aria-label'));
  if (unnamed.length) {
    throw new Error(`${label}: every focusable node needs an accessible name (${unnamed.length} without one).`);
  }

  /* roving tabindex — 그림 전체가 하나의 tab stop이어야 한다. 순회의 자리는
     노드와 «펼치기 큐» 둘 다이므로 큐까지 세어 하나만 열려 있는지 본다. */
  const stops = Array.from(
    canvasElement.querySelectorAll('[data-network-node], [data-network-collapse-cue]'),
  );
  const tabStops = stops.filter((stop) => stop.getAttribute('tabindex') === '0');
  if (tabStops.length !== 1) {
    throw new Error(`${label}: the drawing must expose exactly one tab stop (found ${tabStops.length}).`);
  }

  /* 큐는 클릭 표적이면서 키보드 표적이어야 한다 — 한쪽만 열면 같은 동작에
     두 등급의 접근이 생긴다. 실제로 그렇게 났던 결함이라 못 박는다. */
  Array.from(canvasElement.querySelectorAll('[data-network-collapse-cue]')).forEach((cue) => {
    if (cue.getAttribute('aria-hidden') === 'true') {
      throw new Error(`${label}: the expand cue is clickable, so it must not be hidden from assistive technology.`);
    }
    if (!cue.getAttribute('aria-label') || cue.getAttribute('tabindex') === null) {
      throw new Error(`${label}: the expand cue needs an accessible name and a place in the focus order.`);
    }
    if (!['true', 'false'].includes(cue.getAttribute('aria-expanded'))) {
      throw new Error(`${label}: a cue must report its expanded state.`);
    }
  });

  /* 노드는 «선택»만 한다. 노드가 aria-expanded까지 들면 스크린 리더는
     「축소됨, 버튼」으로 읽는데 누르면 선택이 되어 기대와 어긋난다. */
  const confused = nodes.filter((node) => node.hasAttribute('aria-expanded'));
  if (confused.length) {
    throw new Error(`${label}: selection and expansion must not share one control (${confused.length} node(s) carry aria-expanded).`);
  }
}

function assertNoPresentationalSubtree(canvasElement, label) {
  const svg = canvasElement.querySelector('svg[aria-label]');
  if (!svg) throw new Error(`${label} must name its drawing.`);
  if (svg.getAttribute('role') === 'img') {
    throw new Error(`${label}: role="img" makes the focusable nodes presentational; assistive technology cannot report what took focus.`);
  }
}

/*
  엣지는 두 노드의 마주 보는 면에 붙어야 한다. 진행 방향을 보지 않고 늘 출발
  노드의 오른쪽과 도착 노드의 왼쪽을 잡으면, 오른쪽에서 왼쪽으로 흐르는 관계가
  두 노드를 관통하며 화면을 가로지른다. 실제로 그렇게 났던 결함이라 못 박는다.
*/
function assertEdgesAttachFacingSides(canvasElement, label) {
  const center = new Map(
    Array.from(canvasElement.querySelectorAll('[data-network-node]')).map((node) => {
      const [, x, y] = /translate\((-?[\d.]+) (-?[\d.]+)\)/.exec(node.getAttribute('transform')) ?? [];
      return [node.getAttribute('data-network-node'), { x: Number(x), y: Number(y) }];
    }),
  );

  const centers = [...center.values()];
  const nearestCenter = (px, py) =>
    centers.reduce((best, c) => (Math.hypot(c.x - px, c.y - py) < Math.hypot(best.x - px, best.y - py) ? c : best), centers[0]);

  Array.from(canvasElement.querySelectorAll('[data-network-edge]')).forEach((group) => {
    const d = group.querySelector('path')?.getAttribute('d') ?? '';
    const match = /M (-?[\d.]+) (-?[\d.]+) Q (-?[\d.]+) (-?[\d.]+) (-?[\d.]+) (-?[\d.]+)/.exec(d);
    if (!match) throw new Error(`${label}: edge must render a quadratic path.`);
    const [, sx, sy, , , ex, ey] = match.map(Number);

    // 마주 보는 면에 붙으면 끝점 사이는 중심 사이보다 «짧다». 반대편에 붙어
    // 감싸 돌면 노드 하나 폭만큼 «길어진다» — 그게 이 결함의 지문이다.
    const endpointSpan = Math.hypot(ex - sx, ey - sy);
    const fromCenter = nearestCenter(sx, sy);
    const toCenter = nearestCenter(ex, ey);
    const centerSpan = Math.hypot(toCenter.x - fromCenter.x, toCenter.y - fromCenter.y);
    if (endpointSpan > centerSpan + 1) {
      throw new Error(
        `${label}: edge attaches to the far sides and sweeps across its own nodes (endpoints ${Math.round(endpointSpan)}px apart, centres ${Math.round(centerSpan)}px).`,
      );
    }
  });
}

function assertDeterministicLayout(canvasElement, label) {
  const positions = Array.from(canvasElement.querySelectorAll('[data-network-node]'))
    .map((node) => node.getAttribute('transform'));
  if (positions.some((value) => !value)) {
    throw new Error(`${label}: every node must be positioned by the layout, not by chance.`);
  }
  if (new Set(positions).size !== positions.length) {
    throw new Error(`${label}: layout must not stack two nodes on the same point.`);
  }
}

const knowledgeColor = {
  project: 'var(--color-semantic-primary-normal)',
  system: 'var(--color-semantic-accent-foreground-orange)',
  developer: 'var(--color-semantic-accent-foreground-purple)',
};

const pipelineColor = {
  source: 'var(--color-semantic-accent-foreground-cyan)',
  processor: 'var(--color-semantic-accent-foreground-violet)',
  sink: 'var(--color-semantic-accent-foreground-green)',
};

const meta = {
  title: 'LDS Product/Data/Visualization/Network Graph',
  tags: ['autodocs'],
  component: NetworkGraph,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-visualization-network-graph--relationship-overview',
      eyebrow: 'Product / Data / Network Graph',
      title: '사용자가 대상들이 서로 어떻게 이어져 있는지 봅니다',
      description:
        '대상 사이의 연결 자체가 답인 화면에 씁니다. 값의 크기를 비교할 때는 Bar Chart, 시간에 따른 변화는 Line Chart, 공간 위의 위치는 Map2DCanvas를 쓰세요. 액자·확대 조절·범례는 ViewerFrame · ViewerToolbar · Legend와 조합합니다.',
    },
    docs: {
      description: {
        component: '대상과 관계를 노드·엣지로 그리는 NetworkGraph 패턴입니다.',
      },
    },
  },
};

export default meta;

export const RelationshipOverview = {
  name: '개요',
  parameters: storyDescription(
    '회사 지식망에서 프로젝트·시스템·개발자가 어떻게 이어져 있는지 보는 상황입니다. 뿌리에서 뻗어 나가는 층 배치와 접힌 이웃 배지가 규모를 전달하는지, 노드마다 접근 가능한 이름이 있는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(760px, 100%)' }}>
      <section style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
        <NetworkGraph
          label="회사 지식망"
          description="LK Portal을 중심으로 시스템과 개발자가 어떻게 이어져 있는지 보여 줍니다."
          layout="layered"
          height={360}
          nodes={[
            { id: 'portal', label: 'LK Portal', caption: '프로젝트', color: knowledgeColor.project, root: true },
            { id: 'gateway', label: 'Context Gateway', caption: '시스템', color: knowledgeColor.system, depth: 1 },
            { id: 'wiki', label: 'Semantic Wiki', caption: '시스템', color: knowledgeColor.system, depth: 1 },
            { id: 'jin', label: '장진혁', caption: '개발자', color: knowledgeColor.developer, depth: 1, collapsedCount: 3 },
          ]}
          edges={[
            { id: 'e-gateway', from: 'portal', to: 'gateway', label: '사용함' },
            { id: 'e-wiki', from: 'portal', to: 'wiki', label: '사용함' },
            { id: 'e-jin', from: 'jin', to: 'portal', label: '기여함', count: 4 },
          ]}
          onSelectNode={() => {}}
          onToggleNode={() => {}}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    assertNoPresentationalSubtree(canvasElement, '회사 지식망');
    assertFocusableNodes(canvasElement, '회사 지식망');
    assertEdgesAttachFacingSides(canvasElement, '회사 지식망');
    assertDeterministicLayout(canvasElement, '회사 지식망');
    /*
      방향키는 «방향»을 뜻한다. 순회가 입력 배열 순서를 따르면 →를 눌렀는데
      왼쪽 노드로 가는 일이 생기므로, 순서는 화면에 놓인 자리를 따라야 한다 —
      위에서 아래로, 같은 줄 안에서는 왼쪽에서 오른쪽으로.
    */
    const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
    const spotOf = (element) => {
      const owner = element?.closest?.('[data-network-node]');
      const parsed = /translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(owner?.getAttribute('transform') ?? '');
      return parsed ? { x: Number(parsed[1]), y: Number(parsed[2]) } : null;
    };
    const entry = canvasElement.querySelector('[data-network-node][tabindex="0"]');
    entry.focus();
    const walked = [spotOf(document.activeElement)];
    for (let step = 0; step < canvasElement.querySelectorAll('[data-network-node]').length - 1; step += 1) {
      document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await wait(60);
      walked.push(spotOf(document.activeElement));
    }
    for (let step = 1; step < walked.length; step += 1) {
      const previous = walked[step - 1];
      const current = walked[step];
      if (!previous || !current) throw new Error('Arrow navigation left the node set.');
      const movedDown = current.y > previous.y;
      const sameRowMovedRight = current.y === previous.y && current.x > previous.x;
      if (!movedDown && !sameRowMovedRight) {
        throw new Error(
          `Arrow order must read top-to-bottom then left-to-right (${JSON.stringify(previous)} → ${JSON.stringify(current)}).`,
        );
      }
    }
  },
};

export const StagedFlow = {
  name: '배치 · 단계가 정해진 흐름',
  parameters: storyDescription(
    'source → processor → sink처럼 진행 방향이 정해진 파이프라인입니다. `column`으로 단계를 고정하고 노드·관계의 상태를 함께 표시하는 상황이며, 상태가 유형 색을 흔들지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(760px, 100%)' }}>
      <section style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
        <NetworkGraph
          label="영상 파이프라인"
          description="카메라 입력에서 검출을 거쳐 저장으로 이어지는 흐름과 각 단계의 상태입니다."
          layout="columns"
          height={320}
          nodes={[
            { id: 'cam', label: 'RTSP 입력', caption: 'source', color: pipelineColor.source, column: 0 },
            { id: 'detect', label: '객체 검출', caption: 'processor', color: pipelineColor.processor, column: 1 },
            { id: 'track', label: '추적', caption: 'processor · 지연', color: pipelineColor.processor, column: 1, state: 'degraded' },
            { id: 'store', label: '이벤트 저장', caption: 'sink', color: pipelineColor.sink, column: 2 },
            { id: 'stream', label: '스트림 송출', caption: 'sink · 중지됨', color: pipelineColor.sink, column: 2, state: 'disabled' },
          ]}
          edges={[
            { id: 'p1', from: 'cam', to: 'detect', label: 'frame', state: 'live' },
            { id: 'p2', from: 'detect', to: 'track', label: 'box', state: 'degraded' },
            { id: 'p3', from: 'track', to: 'store', label: 'event' },
            { id: 'p4', from: 'detect', to: 'stream', label: 'overlay', state: 'disabled' },
          ]}
          onSelectNode={() => {}}
          onSelectEdge={() => {}}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    assertNoPresentationalSubtree(canvasElement, '영상 파이프라인');
    assertFocusableNodes(canvasElement, '영상 파이프라인');
    /* 흐름도에서 첫 단계라는 사실은 «왼쪽 끝»이라는 자리가 이미 말한다.
       노드-링크의 「탐색 시작점」 표시를 여기 두면 없는 개념을 그리는 셈이다. */
    if (canvasElement.querySelector('[data-network-root-ring]')) {
      throw new Error('The flow genre must not draw the node-link root ring.');
    }
    /* 이름은 «면 안»에 있다. 면 밖으로 흘러나오면 그건 담긴 것이 아니다. */
    for (const node of canvasElement.querySelectorAll('[data-network-node]')) {
      const face = node.querySelector('rect')?.getBBox();
      if (!face) continue;
      for (const text of node.querySelectorAll('text')) {
        const box = text.getBBox();
        if (box.x < face.x || box.x + box.width > face.x + face.width) {
          throw new Error(`A card label must stay inside its face ("${text.textContent}").`);
        }
      }
    }
    assertEdgesAttachFacingSides(canvasElement, '영상 파이프라인');
    assertDeterministicLayout(canvasElement, '영상 파이프라인');

    // 상태는 색이 아니라 별도 축이어야 한다 — 같은 유형이면 상태가 달라도 색이 같다.
    const nodes = Array.from(canvasElement.querySelectorAll('[data-network-node]'));
    const strokeOf = (id) => nodes
      .find((node) => node.getAttribute('data-network-node') === id)
      ?.querySelector('rect')
      ?.getAttribute('stroke');
    if (strokeOf('detect') !== strokeOf('track')) {
      throw new Error('State must not change the categorical colour: two processors drifted apart.');
    }
    const degraded = nodes.find((node) => node.getAttribute('data-state') === 'degraded');
    if (!degraded) throw new Error('Node state must reach the DOM so it can be styled and tested.');
  },
};

export const EmptyGraph = {
  name: '변형·상태 · 빈 관계',
  parameters: storyDescription(
    '필터가 모든 대상을 걸러낸 상태입니다. 빈 그림 대신 왜 비었는지 읽을 수 있는 문구가 남는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(440px, 100%)' }}>
      <section style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
        <NetworkGraph
          label="회사 지식망"
          height={160}
          nodes={[]}
          edges={[]}
          emptyLabel="선택한 유형에 해당하는 대상이 없습니다."
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const empty = canvasElement.querySelector('[data-chart-empty]');
    if (!empty || !empty.textContent.trim()) {
      throw new Error('An empty graph must say why it is empty.');
    }
  },
};

/*
  같은 데이터를 업계의 두 관행으로 나란히 그린다. 이 스토리의 목적은 «고르기»다
  — 어느 쪽이 예쁜지가 아니라, 이 화면이 무엇을 읽히려는 화면인지에 따라 답이
  정해진다는 것을 눈으로 확인하는 자리다.
*/
const sameNodes = [
  { id: 'portal', label: 'LK Portal', caption: '프로젝트', color: knowledgeColor.project, root: true, column: 0, size: 9 },
  { id: 'gateway', label: 'Context Gateway', caption: '시스템', color: knowledgeColor.system, depth: 1, column: 1, size: 5 },
  { id: 'wiki', label: 'Semantic Wiki', caption: '시스템', color: knowledgeColor.system, depth: 1, column: 1, size: 4 },
  { id: 'jin', label: '장진혁', caption: '개발자', color: knowledgeColor.developer, depth: 1, column: 1, size: 3, collapsedCount: 3 },
  { id: 'pet', label: 'PET Collector', caption: '프로젝트', color: knowledgeColor.project, depth: 2, column: 2, size: 6 },
  { id: 'vision', label: 'Vision Automation', caption: '프로젝트', color: knowledgeColor.project, depth: 2, column: 2, size: 2 },
];

const sameEdges = [
  { id: 'c1', from: 'portal', to: 'gateway', label: '사용함' },
  { id: 'c2', from: 'portal', to: 'wiki', label: '사용함' },
  { id: 'c3', from: 'jin', to: 'portal', label: '기여함', count: 4 },
  { id: 'c4', from: 'gateway', to: 'pet', label: '수집함' },
  { id: 'c5', from: 'gateway', to: 'vision', label: '수집함' },
];

function ConventionPanel({ title, note, children }) {
  return (
    <section style={{ minWidth: 0, background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
      <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)' }}>{title}</h3>
      <p style={{ margin: 'var(--space-1) 0 var(--space-4)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', color: 'var(--color-semantic-label-alternative)' }}>{note}</p>
      {children}
    </section>
  );
}

export const ConventionComparison = {
  name: '관행 비교 · 노드-링크와 플로우 에디터',
  parameters: storyDescription(
    '같은 데이터를 업계의 두 관행으로 나란히 그린 상황입니다. 어느 쪽이 이 데이터를 더 잘 읽히게 하는지 비교하세요 — 연결 구조를 읽는 화면인지, 각 단계가 무엇을 하는지 읽는 화면인지에 따라 답이 갈립니다.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', width: 'min(1100px, 100%)' }}>
      <ConventionPanel
        title="노드-링크 다이어그램 — nodeShape=&quot;dot&quot;"
        note="Neo4j Bloom · Gephi · Obsidian 계열. 색이 찬 원과 바깥 라벨. 색은 범주, 반지름은 양. 노드가 작아 연결 구조가 먼저 읽힙니다."
      >
        <NetworkGraph
          label="회사 지식망 · 노드-링크"
          nodeShape="dot"
          layout="layered"
          height={340}
          nodes={sameNodes}
          edges={sameEdges}
          onSelectNode={() => {}}
          onToggleNode={() => {}}
        />
      </ConventionPanel>

      <ConventionPanel
        title="플로우 에디터 — nodeShape=&quot;card&quot;"
        note="n8n · React Flow · Node-RED 계열. 이름을 담는 카드와 좌우 포트. 각 단계가 무엇을 하는지 먼저 읽히고, 흐름이 한 방향으로 정렬됩니다."
      >
        <NetworkGraph
          label="회사 지식망 · 플로우 에디터"
          nodeShape="card"
          layout="columns"
          height={340}
          nodes={sameNodes}
          edges={sameEdges}
          onSelectNode={() => {}}
          onToggleNode={() => {}}
        />
      </ConventionPanel>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const graphs = canvasElement.querySelectorAll('[data-chart-type="network"]');
    if (graphs.length !== 2) throw new Error('Comparison must render both conventions side by side.');

    /* 장르 경계: 펼치기 큐는 노드-링크의 개념이라 dot에만 있어야 한다.
       플로우에서 접히는 것은 이웃이 아니라 서브그래프이고 열리는 방향도
       다르므로, 같은 기호를 쓰면 둘 다 잘못 읽힌다. */
    if (graphs[1].querySelector('[data-network-collapse-cue]')) {
      throw new Error('The flow-editor convention must not borrow the node-link expand cue.');
    }

    // dot 관행의 핵심: 반지름이 양을 인코딩한다. 값이 다르면 원도 달라야 한다.
    const circles = Array.from(graphs[0].querySelectorAll('[data-network-node-body]'))
      .map((c) => Number(c.getAttribute('r')));
    if (new Set(circles).size < 2) {
      throw new Error('Node-link convention must encode size, otherwise the radius carries no data.');
    }

    // card 관행의 핵심: 연결이 정해진 포트로 들고 난다.
    if (!graphs[1].querySelector('[data-network-port]')) {
      throw new Error('Flow-editor convention must expose ports, or connections have no declared entry and exit.');
    }
  },
};

export const ForceLayout = {
  name: '배치 · 물리로 잦아드는 관계도',
  parameters: storyDescription(
    '노드-링크 장르의 표준인 force-directed 배치입니다. 격자에서 출발해 물리(고무줄·반발·충돌·중심)로 잦아들고, 노드를 끌면 이웃이 따라 출렁입니다. 모션 줄이기 설정에서는 수렴한 자리에 바로 그려지는지, 수렴 결과가 실행마다 같은지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(760px, 100%)' }}>
      <section style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
        <NetworkGraph
          label="회사 지식망 · force"
          nodeShape="dot"
          layout="force"
          height={420}
          nodes={sameNodes}
          edges={sameEdges}
          onSelectNode={() => {}}
          onToggleNode={() => {}}
        />
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    /*
      물리는 살아 있어도 계약은 죽어 있으면 안 된다. 수렴을 기다린 뒤
      확인한다 — 프레임 간 이동이 멎을 때까지 표를 두 번 떠서 비교한다.
    */
    const read = () => Array.from(canvasElement.querySelectorAll('[data-network-node]'))
      .map((node) => node.getAttribute('transform'))
      .join('|');
    const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
    let before = read();
    for (let i = 0; i < 40; i += 1) {
      await wait(200);
      const after = read();
      if (after === before && after) break;
      before = after;
    }
    const transforms = Array.from(canvasElement.querySelectorAll('[data-network-node]'))
      .map((node) => node.getAttribute('transform'));
    if (transforms.some((value) => !value || value.includes('NaN'))) {
      throw new Error('Force layout must settle every node on a finite position.');
    }
    if (new Set(transforms).size !== transforms.length) {
      throw new Error('Force layout must not settle two nodes on the same point.');
    }
    /*
      이름이 서로 겹치면 안 된다. 점 관행에서 이름은 원 «밖»에 있고 원보다
      훨씬 넓으므로, 충돌이 반지름만 보고 밀면 점은 안 닿는데 이름끼리
      포개진다. 실제로 그래서 포털 화면에서 이름 위로 관계선과 다른 이름이
      올라탔고, 몸집을 이름까지로 넓혀 고쳤다. 여기서 지키는 것은 그 결과다 —
      「이름 상자 둘이 겹치지 않는가」이지 어떤 힘으로 그걸 이뤘는가가 아니다.

      1px 이하는 글자 상자의 반올림 오차로 보고 넘긴다.
    */
    const boxes = Array.from(canvasElement.querySelectorAll('svg text'))
      .map((text) => text.getBoundingClientRect())
      .filter((box) => box.width > 0 && box.height > 0);
    for (let i = 0; i < boxes.length; i += 1) {
      for (let j = i + 1; j < boxes.length; j += 1) {
        const a = boxes[i];
        const b = boxes[j];
        const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        if (overlapX > 1 && overlapY > 1) {
          throw new Error('Force layout must not settle two labels on top of each other.');
        }
      }
    }
    /*
      탐색의 출발점은 그림에서 읽혀야 하고, 보는 방법이 하나뿐이어서는 안
      된다. 링만 있으면 눈으로 보는 사람에게만 전해지므로 이름에도 있어야
      한다 — 여기서 지키는 것은 그 둘이 «같은 노드»를 가리킨다는 점이다.
    */
    const rings = canvasElement.querySelectorAll('[data-network-root-ring]');
    if (rings.length !== 1) {
      throw new Error(`Exactly one root ring expected, found ${rings.length}.`);
    }
    const ringOwner = rings[0].closest('[data-network-node]');
    if (!ringOwner?.getAttribute('aria-label')?.includes('탐색 시작점')) {
      throw new Error('The root node must announce that it is the starting point.');
    }
    const announced = Array.from(canvasElement.querySelectorAll('[data-network-node]'))
      .filter((node) => node.getAttribute('aria-label')?.includes('탐색 시작점'));
    if (announced.length !== 1 || announced[0] !== ringOwner) {
      throw new Error('The drawn root and the announced root must be the same node.');
    }
    assertNoPresentationalSubtree(canvasElement, '회사 지식망 · force');
    assertFocusableNodes(canvasElement, '회사 지식망 · force');
  },
};

/*
  펼치기는 데이터의 일이다 — 컴포넌트는 `+N` 큐(클릭 표적)와 더블클릭·`+`/`-`
  키로 `onToggleNode`를 부르고, 노드·관계를 실제로 늘리는 것은 소비자다. 이
  데모가 그 계약의 소비자 쪽 절반이다. force에서는 새 노드가 이웃의 자리에서
  태어나 물리에 밀려 퍼지므로, 펼침 애니메이션은 별도 트랜지션이 아니라 물리
  그 자체다.
*/
const hiddenNeighbours = [
  { id: 'repo-portal', label: 'lk_portal', caption: '리포지토리', color: '#0e7490', size: 2 },
  { id: 'repo-pet', label: 'pet', caption: '리포지토리', color: '#0e7490', size: 1 },
  { id: 'doc-runbook', label: '운영 런북', caption: '문서', color: '#15803d', size: 1 },
];

const hiddenEdges = [
  { id: 'x1', from: 'jin', to: 'repo-portal', label: '커밋함' },
  { id: 'x2', from: 'jin', to: 'repo-pet', label: '커밋함' },
  { id: 'x3', from: 'jin', to: 'doc-runbook', label: '작성함' },
];

function ExpandableKnowledgeGraph() {
  const [expanded, setExpanded] = useState(false);
  const nodes = [
    ...sameNodes.map((node) => (
      node.id === 'jin'
        // 펼친 뒤에는 접힌 것이 없지만 «접을 것»은 있다. 그래서 `expanded`를
        // 함께 넘겨야 큐가 `−`로 남아 왕복이 대칭이 된다.
        ? { ...node, collapsedCount: expanded ? 0 : 3, expanded }
        : node
    )),
    ...(expanded ? hiddenNeighbours : []),
  ];
  const edges = [...sameEdges, ...(expanded ? hiddenEdges : [])];
  return (
    <NetworkGraph
      label="회사 지식망 · 펼치기"
      nodeShape="dot"
      layout="force"
      height={420}
      nodes={nodes}
      edges={edges}
      onSelectNode={() => {}}
      onToggleNode={(node) => {
        if (node.id === 'jin') setExpanded((value) => !value);
      }}
    />
  );
}

export const ExpandCollapse = {
  name: '상호작용 · 접힌 이웃 펼치기',
  parameters: storyDescription(
    '장진혁의 `+3` 큐를 누르면 접혀 있던 리포지토리·문서가 그 자리에서 태어나 물리에 밀려 퍼집니다. 큐가 직접 눌리는지, 새 노드가 튀지 않고 퍼져 나오는지, 다시 접으면 큐가 돌아오는지 확인하세요.',
  ),
  render: () => <ExpandableKnowledgeGraph />,
  play: async ({ canvasElement }) => {
    const wait = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
    const nodeCount = () => canvasElement.querySelectorAll('[data-network-node]').length;
    const cue = () => canvasElement.querySelector('[data-network-collapse-cue]');

    for (let i = 0; i < 40 && !cue(); i += 1) await wait(150);
    if (!cue()) throw new Error('Collapsed node must show its +N cue.');
    const before = nodeCount();
    if (cue().getAttribute('aria-expanded') !== 'false') {
      throw new Error('A collapsed cue must report aria-expanded="false".');
    }
    /*
      눌리는 자리는 보이는 칩보다 넓다. 칩은 노드를 가리지 않도록 작아야 하지만
      (18px), 손가락과 거친 포인터에게 그것은 좁다 — WCAG 2.2가 요구하는
      24×24다. 칩이 아니라 «투명한 표적»이 포인터를 받는지도 함께 지킨다.
    */
    const target = cue().querySelector('[data-network-cue-target]');
    if (!target) throw new Error('The cue must carry a widened pointer target.');
    const targetBox = target.getBoundingClientRect();
    if (targetBox.width < 24 || targetBox.height < 24) {
      throw new Error(`The cue target must be at least 24x24 (got ${targetBox.width}x${targetBox.height}).`);
    }
    const chip = cue().querySelector('rect:not([data-network-cue-target])');
    if (chip && getComputedStyle(chip).pointerEvents !== 'none') {
      throw new Error('The visible chip must not intercept the widened target.');
    }

    cue().dispatchEvent(new MouseEvent('click', { bubbles: true }));
    for (let i = 0; i < 40 && nodeCount() === before; i += 1) await wait(150);
    if (nodeCount() !== before + 3) {
      throw new Error(`Pressing the cue must expand the hidden neighbours (${before} → ${nodeCount()}).`);
    }

    /* 큐는 사라지지 않고 접기로 바뀌어야 한다 — 사라지면 키보드로 되돌아갈
       길이 없어져 왕복이 비대칭이 된다. 실제로 그렇게 났던 결함이다. */
    if (!cue()) throw new Error('The cue must remain as a collapse control after expanding.');
    if (cue().getAttribute('aria-expanded') !== 'true') {
      throw new Error('An expanded cue must report aria-expanded="true".');
    }

    // 키보드만으로 되접기.
    cue().focus();
    document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    for (let i = 0; i < 40 && nodeCount() !== before; i += 1) await wait(150);
    if (nodeCount() !== before) {
      throw new Error(`Enter on the cue must collapse again (${nodeCount()} ≠ ${before}).`);
    }
  },
};

/*
  실제 데이터는 깨끗하지 않다. 자기 자신을 가리키는 관계, 없는 끝점, 같은 `id`가
  둘. 이 스토리는 그런 입력에서도 그림이 서지 그림이 무너지지 않는다는 계약을
  붙잡는다 — 그리고 «무엇을 버렸는지»가 규칙으로 정해져 있다는 것도.
*/
export const DegenerateInput = {
  name: '변형·상태 · 성치 않은 입력',
  parameters: {
    docs: {
      description: {
        story:
          '자기 참조·재귀·순환은 실제로 있는 사실이므로 노드 위의 고리로 그립니다. 같은 노드에 고리가 여럿이면 각도를 돌립니다. 없는 끝점을 가리키는 관계와 중복된 `id`는 그리지 않습니다 — 먼저 온 것을 남깁니다.',
      },
    },
  },
  render: () => (
    <main style={{ width: 'min(760px, 100%)' }}>
      <NetworkGraph
        label="성치 않은 입력"
        nodeShape="dot"
        layout="force"
        height={360}
        nodes={[
          { id: 'hub', label: '스케줄러', caption: '시스템', color: '#c2410c', root: true },
          { id: 'hub', label: '중복된 스케줄러', caption: '버려집니다' },
          { id: 'job', label: '집계 작업', caption: '작업', color: '#2563eb', depth: 1 },
        ]}
        edges={[
          { id: 'self-1', from: 'hub', to: 'hub', label: '자신을 다시 부름' },
          { id: 'self-2', from: 'hub', to: 'hub', label: '재시도' },
          { id: 'runs', from: 'hub', to: 'job', label: '실행함' },
          { id: 'ghost', from: 'hub', to: '없는-노드', label: '그려지지 않음' },
        ]}
        onSelectNode={() => {}}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const nodes = canvasElement.querySelectorAll('[data-network-node]');
    if (nodes.length !== 2) {
      throw new Error(`A duplicate id must not become a second node (found ${nodes.length}).`);
    }
    /* 탭 스톱은 «하나»다. 중복 `id`가 roving tabindex를 무너뜨려 실제로 둘이 된
       적이 있다 — 그림 안으로 들어가는 문이 둘이 되면 계약이 아니다. */
    const stops = canvasElement.querySelectorAll('[data-network-node][tabindex="0"]');
    if (stops.length !== 1) {
      throw new Error(`The node set must be one tab stop (found ${stops.length}).`);
    }
    const drawn = Array.from(canvasElement.querySelectorAll('[data-network-edge]'));
    if (drawn.some((edge) => edge.getAttribute('data-network-edge') === 'ghost')) {
      throw new Error('An edge pointing at a missing endpoint must not be drawn.');
    }
    /* 고리는 «보여야» 한다. 2차 베지어로는 시작점과 끝점이 같아 길이 0의
       선이 되어 사라졌다. 제어점 둘짜리 3차여야 고리가 된다. */
    for (const id of ['self-1', 'self-2']) {
      const path = canvasElement.querySelector(`[data-network-edge="${id}"] path`);
      const d = path?.getAttribute('d') ?? '';
      if (!d.includes(' C ')) {
        throw new Error(`A self-referencing edge must be drawn as a loop (${id}).`);
      }
      if (path.getTotalLength() < 40) {
        throw new Error(`A self-referencing loop must have visible length (${id}).`);
      }
    }
    const [first, second] = ['self-1', 'self-2'].map(
      (id) => canvasElement.querySelector(`[data-network-edge="${id}"] path`).getAttribute('d'),
    );
    if (first === second) {
      throw new Error('Two loops on the same node must not sit on top of each other.');
    }
  },
};

/*
  규모가 커졌을 때. 여기서 지키는 것은 그림이 아니라 «요약»이다 — 보조기술
  사용자가 그림을 훑지 않고도 규모를 알게 하려던 장치가, 이름을 전부 이어
  붙이는 바람에 훑는 것보다 오래 걸리는 일이 되어 있었다.
*/
export const LargeGraph = {
  name: '배치 · 규모가 큰 관계도',
  parameters: {
    docs: {
      description: {
        story:
          '자동 요약은 «규모»를 말하고 내용을 옮겨 적지 않습니다. 앞의 열 개만 이름으로 부르고 나머지는 수로 말합니다 — 하나하나의 이름은 그 노드에 닿았을 때 노드가 말합니다.',
      },
    },
  },
  render: () => (
    <main style={{ width: 'min(760px, 100%)' }}>
      <NetworkGraph
        label="규모가 큰 관계도"
        nodeShape="dot"
        layout="force"
        height={420}
        nodes={Array.from({ length: 24 }, (_, index) => ({
          id: `n${index}`,
          label: `대상 ${index + 1}`,
          caption: index % 3 === 0 ? '시스템' : '프로젝트',
          color: index % 3 === 0 ? '#c2410c' : '#2563eb',
          root: index === 0,
        }))}
        edges={Array.from({ length: 23 }, (_, index) => ({
          id: `e${index}`,
          from: `n${Math.floor(index / 3)}`,
          to: `n${index + 1}`,
        }))}
        showEdgeLabels={false}
        onSelectNode={() => {}}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    const summary = canvasElement.querySelector('[data-chart-summary]')?.textContent ?? '';
    if (!summary.startsWith('대상 24개, 관계 23개.')) {
      throw new Error(`The summary must lead with scale (got "${summary.slice(0, 40)}").`);
    }
    /* 이름을 전부 부르지 않는다. 24개를 다 부르면 요약이 아니라 목록이다. */
    const named = summary.split('.').slice(1).join('.').split(',').length;
    if (named > 11) {
      throw new Error(`The summary must not name every node (named ${named}).`);
    }
    if (!/외 \d+개/.test(summary)) {
      throw new Error('The summary must say how many nodes it did not name.');
    }
  },
};
