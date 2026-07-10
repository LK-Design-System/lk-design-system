import { Legend } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Legend',
  parameters: {
    docs: {
      description: {
        component: '맵·차트·다이어그램의 색상, 선, 레이어 의미를 라벨과 짝지어 설명하는 Legend 패턴입니다.',
      },
    },
  },
};

export default meta;

export const Legends = {
  name: '범례',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: 'min(560px, 100%)' }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-strong)' }}>
          지도 레이어
        </h3>
        <Legend
          aria-label="지도 레이어 범례"
          items={[
            { id: 'robot', label: '로봇 위치', color: 'var(--color-semantic-primary-normal)', shape: 'dot' },
            { id: 'route', label: '주행 경로', color: 'var(--color-semantic-status-positive)', shape: 'line' },
            { id: 'predicted', label: '예측 경로', color: 'var(--color-semantic-status-cautionary)', shape: 'line', dashed: true },
            { id: 'restricted', label: '제한 구역', color: 'var(--color-semantic-status-negative)' },
            { id: 'offline', label: '오프라인', color: 'var(--color-semantic-label-disable)', shape: 'dot', disabled: true },
          ]}
        />
      </section>

      <section style={{ display: 'grid', gap: 'var(--space-2)', maxWidth: 320 }}>
        <h3 style={{ margin: 0, fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', color: 'var(--color-semantic-label-strong)' }}>
          설비 상태
        </h3>
        <Legend
          aria-label="설비 상태 범례"
          direction="vertical"
          items={[
            { id: 'available', label: '가용', color: 'var(--color-semantic-status-positive)', shape: 'dot', value: 12 },
            { id: 'charging', label: '충전 중', color: 'var(--color-semantic-status-cautionary)', shape: 'dot', value: 4 },
            { id: 'blocked', label: '작업 정지', color: 'var(--color-semantic-status-negative)', shape: 'dot', value: 2 },
            { id: 'hidden', label: '숨김 레이어', color: 'var(--color-semantic-label-disable)', shape: 'dot', value: 1, muted: true },
          ]}
        />
      </section>
    </main>
  ),
};

export const CompactChartLegend = {
  name: '컴팩트 차트 범례',
  render: () => (
    <Legend
      aria-label="컴팩트 차트 범례"
      size="sm"
      items={[
        { id: 'actual', label: '실측', color: 'var(--color-semantic-primary-normal)', shape: 'line' },
        { id: 'target', label: '목표', color: 'var(--color-semantic-accent-foreground-violet)', shape: 'line', dashed: true },
        { id: 'warning', label: '주의', color: 'var(--color-semantic-status-cautionary)', shape: 'dot' },
      ]}
    />
  ),
};

export const Empty = {
  name: '빈 범례',
  render: () => <Legend emptyLabel="표시할 범례가 없습니다" />,
};
