import {
  Cluster,
  Spacer,
  Stack,
} from '../src/index.js';
import {
  ClusterCard as ClusterCardStory,
  StackCard as StackCardStory,
} from './Layout.shared.jsx';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Core/Components/Layout/Stack and Alignment',
  tags: ['autodocs'],
  parameters: {
    storyGuide: {
      storyId: 'lds-core-components-layout-stack-and-alignment--stack-and-alignment',
      eyebrow: 'Core / Layout / Stack and Alignment',
      title: '한 방향의 간격과 정렬을 예측 가능한 리듬으로 유지합니다',
      description:
        '세로 콘텐츠 묶음, 줄바꿈 가능한 가로 태그 묶음, 양끝 정렬처럼 단순한 흐름을 구성할 때 적합합니다. 여러 열의 반응형 배치는 Grid나 Columns를, 페이지 전체 구획은 Page Structure를 사용하고 의미 없는 래퍼를 늘리지 마세요.',
    },
    docs: {
      description: {
        component: '수직 리듬, 가로 묶음, 남는 공간 배분에 쓰는 Stack, Cluster, Spacer 패턴입니다.',
      },
    },
  },
};

export default meta;

export const StackAndAlignment = {
  name: '개요',
  parameters: storyDescription(
    '상태 카드의 세로 리듬, 태그의 가로 줄바꿈, 좌우 액션의 공간 배분을 구성하는 상황입니다. 간격 토큰이 일관되고 좁은 너비에서 Cluster가 자연스럽게 줄바꿈하며 Spacer가 읽기 순서를 바꾸지 않는지 확인하세요.',
  ),
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
      <Stack gap="var(--space-3)">
        {['상태 요약', '검토 목록', '알림 로그'].map((label) => (
          <div
            key={label}
            style={{
              padding: 'var(--space-4)',
              border: '1px solid var(--color-semantic-line-normal-normal)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-semantic-background-elevated-normal)',
              color: 'var(--color-semantic-label-neutral)',
              fontWeight: 'var(--fw-bold)',
            }}
          >
            {label}
          </div>
        ))}
      </Stack>

      <Cluster gap="var(--space-2)">
        {['활성', '검토', '비활성', '보류'].map((label) => (
          <span key={label} style={{ padding: '8px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)' }}>
            {label}
          </span>
        ))}
      </Cluster>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', maxWidth: 520 }}>
        <strong>좌측 그룹</strong>
        <Spacer axis="horizontal" />
        <span style={{ color: 'var(--color-semantic-label-neutral)' }}>우측 액션</span>
      </div>
    </main>
  ),
};

export const ClusterCard = { ...ClusterCardStory, name: 'Cluster card parity', tags: ['!dev', 'visual-parity'] };
export const StackCard = { ...StackCardStory, name: 'Stack card parity', tags: ['!dev', 'visual-parity'] };
