import {
  ContentBadge,
  Icon,
  StatusBadge,
} from '../src/index.js';
import { ContentBadgeStatusBadgeCard as ContentBadgeStatusBadgeCardStory } from './Content.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Content Badges',
  parameters: {
    docs: {
      description: {
        component: '콘텐츠 메타 정보와 상태 라벨을 표시하는 ContentBadge, StatusBadge 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ContentBadgePatterns = {
  name: '콘텐츠 배지 패턴',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="android" />}>Android</ContentBadge>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="apple" />}>iOS</ContentBadge>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="globe" />}>Web</ContentBadge>
        <StatusBadge tone="online" pulse>실시간 연결</StatusBadge>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <ContentBadge variant="solid">텍스트</ContentBadge>
          <ContentBadge>텍스트</ContentBadge>
          <ContentBadge variant="outlined">텍스트</ContentBadge>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <ContentBadge size="xsmall" leading={<Icon name="square" />}>텍스트</ContentBadge>
          <ContentBadge size="small" leading={<Icon name="square" />}>텍스트</ContentBadge>
          <ContentBadge size="medium" leading={<Icon name="square" />} trailing={<Icon name="square" />}>텍스트</ContentBadge>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <ContentBadge color="neutral">텍스트</ContentBadge>
          <ContentBadge color="accent">텍스트</ContentBadge>
          <ContentBadge color="accent" variant="outlined">텍스트</ContentBadge>
          <ContentBadge color="accent" accentBackgroundColor="var(--lk-accent-tint-2)" accentContentColor="var(--accent-foreground-cyan)">텍스트</ContentBadge>
        </div>
      </section>
    </main>
  ),
};

export const ContentBadgeStatusBadgeCard = {
  ...ContentBadgeStatusBadgeCardStory,
  name: 'ContentBadge · StatusBadge card parity',
  tags: ['!dev', 'visual-parity'],
};
