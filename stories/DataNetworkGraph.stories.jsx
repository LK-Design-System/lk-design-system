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
  project: '#2563eb',
  system: '#c2410c',
  developer: '#a21caf',
};

const pipelineColor = {
  source: '#0e7490',
  processor: '#4f46e5',
  sink: '#15803d',
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
