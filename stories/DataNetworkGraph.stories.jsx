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

  // roving tabindex — 노드 묶음은 하나의 tab stop이어야 한다.
  const tabStops = nodes.filter((node) => node.getAttribute('tabindex') === '0');
  if (tabStops.length !== 1) {
    throw new Error(`${label}: node group must expose exactly one tab stop (found ${tabStops.length}).`);
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
