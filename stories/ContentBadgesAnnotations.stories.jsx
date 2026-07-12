import {
  ContentBadge,
  Icon,
} from '../src/index.js';
import { ContentBadgeStatusBadgeCard as ContentBadgeStatusBadgeCardStory } from './Content.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Content/Content Badge',
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-content-content-badge--content-badge-patterns',
      eyebrow: 'Core / Content / Content Badge',
      title: '콘텐츠의 범주와 짧은 메타 정보를 보조적으로 표시합니다',
      description:
        '플랫폼, 유형, 추천 여부처럼 콘텐츠를 분류하는 짧은 메타 정보에 적합합니다. 성공·경고·오류처럼 현재 상태를 전달할 때는 Status Badge를 사용하고, 긴 설명이나 주요 행동을 배지 안에 넣지 마세요.',
    },
    docs: {
      description: {
        component: '콘텐츠 메타 정보를 표시하는 ContentBadge 패턴입니다. 상태 라벨은 상태 배지 페이지에서 확인합니다.',
      },
    },
  },
};

export default meta;

export const ContentBadgePatterns = {
  name: '개요',
  parameters: storyDescription(
    '플랫폼과 콘텐츠 속성을 변형, 크기, 아이콘, 색상으로 구분하는 상황입니다. 배지가 본문보다 과도하게 강조되지 않고 텍스트와 아이콘 조합이 작은 크기에서도 읽히는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 760 }}>
      <section style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap' }}>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="android" />}>Android</ContentBadge>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="apple" />}>iOS</ContentBadge>
        <ContentBadge variant="solid" color="accent" leading={<Icon name="globe" />}>Web</ContentBadge>
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
          <ContentBadge color="accent" accentBackgroundColor="var(--color-semantic-primary-surface-strong)" accentContentColor="var(--color-semantic-status-info-text)">텍스트</ContentBadge>
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
