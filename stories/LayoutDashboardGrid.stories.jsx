import { MetricCard } from '../src/index.js';
import { DashboardGrid } from '../components/layout/DashboardGrid.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

// Use when summary cards have equal information priority and can flow by container width.
// Avoid when a dominant analysis surface or fixed spans require an explicit Columns/Col composition.

const meta = {
  title: 'LDS Product/Operations Dashboard/Dashboard Grid',
  id: 'lds-product-layout-dashboard-grid',
  component: DashboardGrid,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-layout-dashboard-grid--responsive-card-flow',
      eyebrow: 'Product / Operations Dashboard / Dashboard Grid',
      title: '동급의 반복 정보 표면을 컨테이너 폭에 맞춰 배치합니다',
      description:
        'DashboardGrid는 동급인 요약 카드의 최소 폭과 간격만 관리합니다. 중요도가 다른 분석 표면이나 고정 span이 필요하면 Columns/Col을 사용하고, 표면·상태·본문 위계는 실제 카드 컴포넌트가 소유합니다.',
    },
    docs: {
      description: {
        component: 'DashboardGrid는 동급 반복 카드의 최소 폭과 overflow 방지, 좁은 폭의 단일 열 전환을 담당하는 LK Product Extension입니다. KPI-first 화면이나 카드 내용의 우선순위는 규정하지 않습니다.',
      },
    },
  },
};

export default meta;

function ReadyMetrics() {
  return (
    <>
      <MetricCard label="진행 중" value="24" unit="건" period="현재" caption="처리 중인 작업" />
      <MetricCard label="확인 필요" value="3" unit="건" period="현재" caption="사용자 판단이 필요한 항목" />
      <MetricCard label="완료율" value="92" unit="%" period="최근 24시간" baseline="90%" />
      <MetricCard label="평균 처리 시간" value="18" unit="분" period="최근 7일" caption="완료된 작업 기준" />
    </>
  );
}

export const ResponsiveCardFlow = {
  name: '개요',
  parameters: storyDescription(
    '실제 MetricCard를 사용해 normal과 320px 컨테이너의 반복 흐름을 비교합니다. 카드가 같은 위계와 표면을 유지하고, 좁은 폭에서 텍스트나 수치가 컨테이너를 밀어내지 않는지 확인하세요.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', boxSizing: 'border-box' }}>
      <DashboardGrid data-testid="grid-normal" minCardWidth={200} style={{ maxWidth: 960 }}>
        <ReadyMetrics />
      </DashboardGrid>
      <div style={{ width: 320, maxWidth: '100%' }}>
        <DashboardGrid data-testid="grid-narrow">
          <MetricCard label="아주 긴 확인 필요 항목 이름" value="3" unit="건" period="현재" caption="320px에서도 카드와 본문이 컨테이너를 밀어내지 않습니다." />
          <MetricCard label="최근 동기화" value="2" unit="분 전" stale staleLabel="업데이트 지연" lastUpdated="오늘 14:21" />
        </DashboardGrid>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const normal = canvasElement.querySelector('[data-testid="grid-normal"]');
    const narrow = canvasElement.querySelector('[data-testid="grid-narrow"]');
    const metrics = canvasElement.querySelectorAll('[data-metric-state]');
    if (!normal || !narrow || metrics.length !== 6 || normal.scrollWidth > normal.clientWidth + 1 || narrow.scrollWidth > narrow.clientWidth + 1) {
      throw new Error('DashboardGrid must arrange real MetricCard surfaces inside normal and narrow containers.');
    }
    if (getComputedStyle(narrow).gridTemplateColumns.trim().split(' ').length !== 1) {
      throw new Error('The 320px DashboardGrid must resolve to one card column.');
    }
    if (!narrow.querySelector('[data-metric-state="stale"]')) {
      throw new Error('The narrow fixture must retain the card-owned stale state.');
    }
  },
};
