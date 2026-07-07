import {
  Cluster,
  Spacer,
  Stack,
} from '../src/index.js';
import {
  ClusterCard as ClusterCardStory,
  StackCard as StackCardStory,
} from './Layout.shared.jsx';

const meta = {
  title: 'LDS Core/3 Component/1 Layout/Stack and Alignment',
  parameters: {
    docs: {
      description: {
        component: '수직 리듬, 가로 묶음, 남는 공간 배분에 쓰는 Stack, Cluster, Spacer 패턴입니다.',
      },
    },
  },
};

export default meta;

export const StackAndAlignment = {
  name: '스택과 정렬',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 760 }}>
      <Stack gap="var(--space-3)">
        {['상태 요약', '검토 목록', '알림 로그'].map((label) => (
          <div
            key={label}
            style={{
              padding: 'var(--space-4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--surface-card)',
              color: 'var(--label-neutral)',
              fontWeight: 'var(--fw-bold)',
            }}
          >
            {label}
          </div>
        ))}
      </Stack>

      <Cluster gap="var(--space-2)">
        {['활성', '검토', '비활성', '보류'].map((label) => (
          <span key={label} style={{ padding: '8px 12px', borderRadius: 'var(--radius-pill)', background: 'var(--surface-card)', border: '1px solid var(--border-subtle)' }}>
            {label}
          </span>
        ))}
      </Cluster>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', maxWidth: 520 }}>
        <strong>좌측 그룹</strong>
        <Spacer axis="horizontal" />
        <span style={{ color: 'var(--label-neutral)' }}>우측 액션</span>
      </div>
    </main>
  ),
};

export const ClusterCard = { ...ClusterCardStory, name: 'Cluster card parity', tags: ['!dev', 'visual-parity'] };
export const StackCard = { ...StackCardStory, name: 'Stack card parity', tags: ['!dev', 'visual-parity'] };
