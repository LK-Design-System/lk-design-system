import { Divider } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Layout/Divider',
  component: Divider,
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-layout-divider--divider-variants',
      eyebrow: 'Core / Layout / Divider',
      title: '인접한 콘텐츠 그룹의 경계를 최소한의 선으로 구분합니다',
      description:
        '같은 표면 안에서 의미가 다른 섹션이나 인라인 그룹의 경계를 보조할 때 적합합니다. 공간만으로 위계가 충분하면 여백을 우선하고, 독립된 표면이 필요하면 Card나 Section을 사용하며 모든 행 사이에 습관적으로 선을 넣지 마세요.',
    },
    docs: {
      description: {
        component: 'Divider의 WDS 변형(normal, thick, vertical)을 다루는 레이아웃 프리미티브입니다.',
      },
    },
  },
};

export default meta;

export const DividerVariants = {
  name: '개요',
  parameters: storyDescription(
    '콘텐츠 구획의 강도와 방향에 따라 기본선, 굵은선, 세로선을 선택하는 상황입니다. 선이 주변 여백과 정렬되고 세로 구분선은 인라인 항목의 높이를 넘지 않으며 불필요한 시각 소음을 만들지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-5)', maxWidth: 720 }}>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>variant = normal</strong>
        <Divider />
      </div>
      <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>variant = thick</strong>
        <Divider variant="thick" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 56 }}>
        <strong style={{ color: 'var(--color-semantic-label-normal)' }}>vertical = true</strong>
        <Divider vertical />
        <span style={{ color: 'var(--color-semantic-label-neutral)' }}>인라인 그룹 구분선</span>
      </div>
    </main>
  ),
};
