import { DashboardGrid } from '../components/layout/DashboardGrid.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Layout/Dashboard Grid',
  component: DashboardGrid,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-layout-dashboard-grid--responsive-card-flow',
      eyebrow: 'Product / Dashboard Grid',
      title: '사용자가 반복되는 대시보드 카드를 화면 너비에 맞춰 빠르게 훑습니다',
      description:
        '같은 위계의 지표·상태 카드를 최소 폭을 지키며 반응형으로 반복할 때 적합합니다. 크기와 역할이 크게 다른 콘텐츠를 자유롭게 배치할 때는 DashboardGrid 대신 Grid 또는 명시적인 레이아웃 구성을 사용하세요.',
    },
    docs: {
      description: {
        component: 'DashboardGrid는 카드 반복의 최소 폭과 overflow 방지, 좁은 폭의 한 열 전환을 담당하는 LK Product Extension입니다. 카드 표면은 각 카드가 소유합니다. 페이지 골격은 Dashboard Shell을 참고하세요.',
      },
    },
  },
};

export default meta;

function GridCard({ title, description }) {
  return (
    <article
      style={{
        display: 'grid',
        alignContent: 'start',
        gap: 'var(--space-2)',
        minHeight: 116,
        padding: 'var(--space-4)',
        boxSizing: 'border-box',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-xl)',
        background: 'var(--color-semantic-background-elevated-normal)',
      }}
    >
      <strong style={{ color: 'var(--color-semantic-label-strong)' }}>{title}</strong>
      <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-reading-line)' }}>{description}</span>
    </article>
  );
}

export const ResponsiveCardFlow = {
  name: '개요',
  parameters: storyDescription(
    '일반 폭의 여러 카드와 320px 한 열 레이아웃을 함께 비교하는 상황입니다. 긴 제목이 있어도 카드 최소 폭과 컨테이너 경계가 유지되고 좁은 폭에서 가로 overflow가 없는지 확인하세요.',
  ),
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', boxSizing: 'border-box' }}>
      <DashboardGrid data-testid="grid-normal" style={{ maxWidth: 960 }}>
        <GridCard title="지표 A" description="일반 폭" />
        <GridCard title="지표 B" description="일반 폭" />
        <GridCard title="지표 C" description="일반 폭" />
        <GridCard title="아주 긴 지표 이름과 보조 정보" description="긴 실제 콘텐츠" />
      </DashboardGrid>
      <div style={{ width: 320, maxWidth: '100%' }}>
        <DashboardGrid data-testid="grid-narrow">
          <GridCard title="아주 긴 지표 이름과 보조 정보" description="320px에서도 카드가 컨테이너를 밀어내지 않습니다." />
          <GridCard title="지표 B" description="한 열 전환" />
        </DashboardGrid>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const normal = canvasElement.querySelector('[data-testid="grid-normal"]');
    const narrow = canvasElement.querySelector('[data-testid="grid-narrow"]');
    if (!normal || !narrow || normal.scrollWidth > normal.clientWidth + 1 || narrow.scrollWidth > narrow.clientWidth + 1) {
      throw new Error('DashboardGrid must stay inside both normal and narrow containers.');
    }
    if (getComputedStyle(narrow).gridTemplateColumns.trim().split(' ').length !== 1) {
      throw new Error('The 320px DashboardGrid must resolve to one card column.');
    }
  },
};
