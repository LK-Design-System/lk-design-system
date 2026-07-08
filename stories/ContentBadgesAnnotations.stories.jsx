import {
  ContentBadge,
  Icon,
  StatusBadge,
} from '../src/index.js';
import { ContentBadgeStatusBadgeCard as ContentBadgeStatusBadgeCardStory } from './Content.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Content Badge',
  parameters: {
    docs: {
      description: {
        component: 'ContentBadge and StatusBadge patterns for compact content metadata and state labels.',
      },
    },
  },
};

export default meta;

export const ContentBadgePatterns = {
  name: 'Content badge patterns',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="android" />}>Android</ContentBadge>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="apple" />}>iOS</ContentBadge>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="globe" />}>Web</ContentBadge>
        <StatusBadge tone="online" pulse>Live</StatusBadge>
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <ContentBadge variant="solid">Text</ContentBadge>
          <ContentBadge>Text</ContentBadge>
          <ContentBadge variant="outlined">Text</ContentBadge>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <ContentBadge size="xsmall" leading={<Icon name="square" />}>Text</ContentBadge>
          <ContentBadge size="small" leading={<Icon name="square" />}>Text</ContentBadge>
          <ContentBadge size="medium" leading={<Icon name="square" />} trailing={<Icon name="square" />}>Text</ContentBadge>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          <ContentBadge color="neutral">Text</ContentBadge>
          <ContentBadge color="accent">Text</ContentBadge>
          <ContentBadge color="accent" variant="outlined">Text</ContentBadge>
          <ContentBadge color="accent" accentBackgroundColor="var(--lk-accent-tint-2)" accentContentColor="var(--accent-foreground-cyan)">Text</ContentBadge>
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
