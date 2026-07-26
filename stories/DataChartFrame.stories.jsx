import React from 'react';
import { BarChart, Button, ChartFrame, DonutChart, Legend, RefreshControl } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const BAR_DATA = [
  { id: 'ready', label: '운행 가능', value: 18 },
  { id: 'inspection', label: '점검 필요', value: 4 },
  { id: 'offline', label: '오프라인', value: 2 },
];

const DONUT_DATA = [
  { id: 'ready', label: '운행 가능한 로봇', value: 18, color: 'var(--color-semantic-data-viz-series-1)' },
  { id: 'inspection', label: '정기 점검이 필요한 로봇', value: 4, color: 'var(--color-semantic-data-viz-series-5)' },
  { id: 'offline', label: '연결되지 않은 로봇', value: 2, color: 'var(--color-semantic-data-viz-series-3)' },
];

const meta = {
  title: 'LDS Product/Data/Visualization/Chart Frame',
  tags: ['autodocs'],
  component: ChartFrame,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-visualization-chart-frame--chart-surface',
      eyebrow: 'Product / Data / Chart Frame',
      title: '사용자가 차트의 목적·범례·최신 상태와 복구 행동을 함께 읽습니다',
      description:
        '차트를 제목·설명·범례·action·resource 상태와 하나의 분석 표면으로 묶을 때 적합합니다. 주변 정보가 필요 없는 작은 인라인 추세에는 Chart Frame 대신 Sparkline 또는 단독 Chart를 사용하세요.',
    },
    docs: {
      description: {
        component: '차트의 제목·설명·action·범례와 resource/freshness 상태를 한 표면의 일관된 읽기 순서로 묶습니다.',
      },
    },
  },
};

export default meta;

export const ChartSurface = {
  name: '개요',
  parameters: storyDescription(
    '로봇 가용 상태 차트에 제목·설명·메타데이터·갱신 action·범례를 함께 제공하는 상황입니다. 프레임의 읽기 순서와 차트·범례의 접근성 계약이 연결되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ width: 'min(100%, 720px)' }}>
      <ChartFrame
        headingLevel={2}
        title="로봇 가용 상태"
        description="현재 fleet의 운행 가능 여부를 비교합니다."
        meta="전체 24대"
        actions={<RefreshControl lastUpdated="오늘 14:32" onRefresh={() => {}} />}
        legend={<Legend items={BAR_DATA.map((item, index) => ({ label: item.label, color: `var(--color-semantic-data-viz-series-${index + 1})` }))} />}
      >
        <BarChart aria-label="상태별 로봇 수" description="운행 가능, 점검 필요, 오프라인 로봇 수를 비교합니다." data={BAR_DATA} height={190} />
      </ChartFrame>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('[data-chart-frame-state="ready"]');
    const chart = canvasElement.querySelector('[aria-label="상태별 로봇 수"]');
    const legend = canvasElement.querySelector('[data-chart-frame-legend]');
    if (!frame || !frame.getAttribute('aria-labelledby') || !chart || !legend) {
      throw new Error('ChartFrame must name the region while retaining the chart and legend accessibility contracts.');
    }
    if (!canvasElement.querySelector('[data-story-guide] h1') || !frame.querySelector('h2')) {
      throw new Error('The overview guide and ChartFrame title must preserve adjacent heading levels.');
    }
  },
};

export const NarrowStaleData = {
  name: '반응형 · 좁은 폭과 오래된 데이터 유지',
  parameters: storyDescription(
    '320px 폭에서 마지막 정상 차트를 유지한 채 stale 상태와 새로고침 action을 보여 주는 상황입니다. 상태 메시지가 데이터를 가리지 않고 freshness와 복구 행동이 명확한지 확인하세요.',
  ),
  render: () => (
    <main data-testid="narrow-chart-frame" style={{ width: 320, maxWidth: '100%' }}>
      <ChartFrame
        headingLevel={1}
        title="현장 전체 로봇의 긴 상태 구성 제목"
        description="좁은 화면에서도 마지막 정상 데이터와 복구 action을 유지합니다."
        resourceState="stale"
        stateAction={<Button size="sm" variant="secondary">새로고침</Button>}
        lastUpdated="오늘 14:21"
        legend={<Legend items={DONUT_DATA.map((item) => ({ label: item.label, color: item.color }))} />}
      >
        <DonutChart aria-label="상태 구성 도넛" description="상태별 로봇 구성을 보여줍니다." segments={DONUT_DATA} size={156} legend={false} />
      </ChartFrame>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-testid="narrow-chart-frame"]');
    const frame = canvasElement.querySelector('[data-chart-frame-state="stale"]');
    const state = frame?.querySelector('[role="status"]');
    const body = frame?.querySelector('[data-chart-frame-body]');
    const freshness = frame?.querySelector('[data-resource-state-freshness]');
    if (!wrapper || !frame || wrapper.scrollWidth > wrapper.clientWidth + 1 || frame.scrollWidth > frame.clientWidth + 1) {
      throw new Error('ChartFrame must fit its 320px container without horizontal overflow.');
    }
    if (!state || !body || !freshness || !(state.compareDocumentPosition(body) & Node.DOCUMENT_POSITION_FOLLOWING) || !(body.compareDocumentPosition(freshness) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      throw new Error('Stale chart reading order must be status, preserved chart/legend, then freshness.');
    }
  },
};

export const LoadingAndError = {
  name: '변형·상태 · 로딩과 오류',
  parameters: storyDescription(
    '차트 데이터를 불러오는 중이거나 요청에 실패한 두 상태를 비교하는 상황입니다. loading과 error가 서로 다른 의미를 전달하고 오류에는 적절한 복구 경로가 보이는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'var(--space-5)', width: 'min(100%, 680px)' }}>
      {/* The class carries the step's tracking as well as its size; pinning only size left the
          heading on the element default, which changed when this stopped being an h1. */}
      <h2 className="type-heading2" style={{ gridColumn: '1 / -1', margin: 0 }}>차트 리소스 상태</h2>
      <ChartFrame headingLevel={2} title="처리량" resourceState="loading" />
      <ChartFrame headingLevel={2} title="실패율" resourceState="error" stateAction={<Button size="sm" variant="secondary">다시 시도</Button>}>{false}</ChartFrame>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const errorFrame = canvasElement.querySelector('[data-chart-frame-state="error"]');
    if (!errorFrame?.querySelector('[role="alert"]') || errorFrame.querySelector('[data-chart-frame-body]')) {
      throw new Error('A false conditional child must render a blocking error state instead of preserved chart data.');
    }
    // The document title belongs to the page, not to a story, so the demo's grouping heading
    // sits at the same level as the card headings it introduces.
    if (canvasElement.querySelectorAll('main h1').length !== 0 || canvasElement.querySelectorAll('main h2').length !== 3) {
      throw new Error('Resource-state comparisons must preserve one grouping heading followed by card headings.');
    }
  },
};
