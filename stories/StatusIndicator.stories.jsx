import { StatusIndicator } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Status Indicator',
  tags: ['autodocs'],
  component: StatusIndicator,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-status-status-indicator--status-indicator-overview',
      eyebrow: 'Core / Status',
      title: 'Status Indicator는 실시간 가용성과 연결 신호만 조용하게 표시합니다',
      description:
        '온라인·재연결·데이터 지연·오프라인처럼 계속 관찰되는 신호를 표시할 때 사용합니다. 진행·마감·게시처럼 정적인 결과에는 사용하지 않고 상태 배지를 선택합니다. 점만으로 의미를 전달하거나 단순 장식으로 pulse를 켜지 마세요.',
    },
    docs: {
      description: {
        component: '실시간 가용성·연결·freshness를 컬러 점과 명시적 라벨로 표시하는 StatusIndicator 패턴입니다.',
      },
    },
  },
};

export default meta;

export const StatusIndicatorOverview = {
  name: '개요',
  parameters: storyDescription(
    'steady online, 실제 변화 중인 재연결 pulse, 데이터 지연과 오프라인을 비교합니다. 모든 신호가 visible label을 유지하고 pulse가 의미적으로 필요한 한 상태에만 제한되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap', maxWidth: 760 }}>
      <StatusIndicator data-testid="status-indicator" tone="positive">온라인</StatusIndicator>
      <StatusIndicator tone="cautionary" pulse>재연결 중</StatusIndicator>
      <StatusIndicator tone="cautionary">데이터 지연</StatusIndicator>
      <StatusIndicator tone="offline">오프라인</StatusIndicator>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const indicator = canvasElement.querySelector('[data-testid="status-indicator"]');
    const dot = indicator?.querySelector('[data-status-indicator-dot]');
    if (!indicator || !dot) throw new Error('StatusIndicator dot and visible label are required.');
    if (dot.getAttribute('aria-hidden') !== 'true') {
      throw new Error('StatusIndicator dot must remain decorative.');
    }
    if (!indicator.textContent?.includes('온라인')) {
      throw new Error('StatusIndicator must keep a visible status label.');
    }
  },
};

export const DarkTheme = {
  name: '변형·상태 · 다크 테마',
  parameters: storyDescription(
    '다크 배경에서 semantic dot과 neutral label의 대비를 확인합니다. 신호 점보다 라벨이 먼저 읽히고 critical 정적 링이 배경과 분리되는지 검토하세요.',
  ),
  render: () => (
    <main
      data-theme="dark"
      className="theme-dark"
      style={{
        display: 'flex',
        gap: 'var(--space-5)',
        alignItems: 'center',
        flexWrap: 'wrap',
        minHeight: 120,
        padding: 'var(--space-6)',
        boxSizing: 'border-box',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <StatusIndicator tone="positive">온라인</StatusIndicator>
      <StatusIndicator tone="cautionary" pulse>동기화 중</StatusIndicator>
      <StatusIndicator tone="critical">비상 신호</StatusIndicator>
      <StatusIndicator tone="offline">오프라인</StatusIndicator>
    </main>
  ),
};
