import { StatusBadge, Tag } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Status/Status Badge',
  tags: ['autodocs'],
  component: StatusBadge,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-status-status-badge--status-tones',
      eyebrow: 'Core / Status',
      title: 'Status Badge는 대상의 현재 상태를 옅은 의미 배경과 짧은 라벨로 구분합니다',
      description:
        '진행·마감·게시·검토처럼 현재 상태가 정해진 어휘로 반복 표시될 때 적합합니다. 실시간 연결·freshness에는 상태 신호를, 단순 분류에는 Tag를 사용하고 변화의 원인과 다음 행동까지 설명해야 하면 Banner나 Notification을 사용하세요.',
    },
    docs: {
      description: {
        component: '옅은 의미 배경과 명시적 라벨로 현재 상태를 표시하는 StatusBadge 패턴입니다. dot과 pulse는 포함하지 않으며 실시간 가용성은 상태 신호 컴포넌트가 소유합니다.',
      },
    },
  },
};

export default meta;

export const StatusTones = {
  name: '개요',
  parameters: storyDescription(
    '진행중·마감 임박·처리 실패·종료·검토 상태를 의미별 tone으로 비교합니다. 배경과 텍스트가 같은 의미 계열을 사용하되 라벨만 읽어도 상태가 구분되고 서로 다른 배경에서도 대비와 간격이 일관적인지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap', maxWidth: 760 }}>
      <StatusBadge data-testid="status-badge" tone="positive">진행중</StatusBadge>
      <StatusBadge tone="cautionary">마감 임박</StatusBadge>
      <StatusBadge tone="negative">처리 실패</StatusBadge>
      <StatusBadge tone="offline">종료</StatusBadge>
      <StatusBadge tone="signal">검토 중</StatusBadge>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const status = canvasElement.querySelector('[data-testid="status-badge"]');
    if (!status) throw new Error('StatusBadge contract target is required.');
    if (status.querySelector('[data-status-indicator-dot]')) {
      throw new Error('StatusBadge must not render an indicator dot.');
    }
    if (Math.abs(status.getBoundingClientRect().height - 20) > 0.5) {
      throw new Error('StatusBadge must keep the 20px inline metadata height.');
    }
  },
};

export const InlineWithTag = {
  name: '사용법 · 상태 배지와 태그 조합',
  parameters: storyDescription(
    '분류 Tag와 현재 상태를 한 메타데이터 행에 놓을 때는 기본 soft Tag를 사용합니다. 두 컴포넌트가 20px 외곽 높이와 12px 글자 크기로 정렬되면서도 대문자 분류 Tag와 의미 기반 StatusBadge의 역할이 구분되는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-4)', width: '100%', maxWidth: 520 }}>
      <section
        data-testid="inline-metadata-row"
        style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Tag data-testid="inline-tag" size="sm" tone="neutral">Robotics</Tag>
        <StatusBadge data-testid="inline-status" tone="positive">운영 중</StatusBadge>
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <Tag size="sm" tone="amber">Safety</Tag>
        <StatusBadge tone="negative">오류</StatusBadge>
      </section>
      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap', maxWidth: 280 }}>
        <span style={{ fontSize: 'var(--label2-size)', color: 'var(--color-semantic-label-alternative)' }}>AMR-017</span>
        <Tag size="sm" tone="steel">관제 대상</Tag>
        <StatusBadge tone="cautionary">점검 대기</StatusBadge>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const tag = canvasElement.querySelector('[data-testid="inline-tag"]');
    const status = canvasElement.querySelector('[data-testid="inline-status"]');
    if (!tag || !status) throw new Error('Inline Tag and StatusBadge contract targets are required.');

    const tagRect = tag.getBoundingClientRect();
    const statusRect = status.getBoundingClientRect();
    if (Math.abs(tagRect.height - statusRect.height) > 0.5) {
      throw new Error(`Inline Tag and StatusBadge must share a visual height (got ${tagRect.height}px and ${statusRect.height}px).`);
    }
    if (Math.abs((tagRect.top + tagRect.bottom) / 2 - (statusRect.top + statusRect.bottom) / 2) > 0.5) {
      throw new Error('Inline Tag and StatusBadge must share the same vertical center.');
    }
    if (getComputedStyle(tag).fontSize !== getComputedStyle(status).fontSize) {
      throw new Error('Inline Tag and StatusBadge must use the same font-size tier.');
    }
  },
};

export const DarkTheme = {
  name: '변형·상태 · 다크 테마',
  parameters: storyDescription(
    '다크 배경에서 positive·cautionary·negative soft surface와 텍스트 대비를 함께 확인합니다. 채도가 배경보다 과도하게 튀지 않고 세 상태가 라벨과 색으로 구분되는지 검토하세요.',
  ),
  render: () => (
    <main
      data-theme="dark"
      className="theme-dark"
      style={{
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'center',
        flexWrap: 'wrap',
        minHeight: 120,
        padding: 'var(--space-6)',
        boxSizing: 'border-box',
        background: 'var(--color-semantic-background-normal-normal)',
      }}
    >
      <StatusBadge tone="positive">진행중</StatusBadge>
      <StatusBadge tone="cautionary">마감 임박</StatusBadge>
      <StatusBadge tone="negative">처리 실패</StatusBadge>
    </main>
  ),
};
