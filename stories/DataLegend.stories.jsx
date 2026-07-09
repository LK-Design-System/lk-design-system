import { Legend } from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Legend',
  parameters: {
    docs: {
      description: {
        component: '맵·차트·다이어그램의 색상을 라벨과 짝지어 설명하는 Legend 패턴입니다.',
      },
    },
  },
};

export default meta;

export const Legends = {
  name: '범례',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 520 }}>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 14, color: 'var(--color-semantic-label-strong)' }}>가로 (맵 상태)</h3>
        <Legend
          items={[
            { label: '가용', color: 'var(--color-semantic-status-positive)', shape: 'dot' },
            { label: '점검', color: 'var(--color-semantic-status-cautionary)', shape: 'dot' },
            { label: '오프라인', color: 'var(--color-semantic-label-disable)', shape: 'dot' },
            { label: '경로', color: 'var(--color-semantic-primary-normal)', shape: 'line' },
          ]}
        />
      </section>
      <section style={{ display: 'grid', gap: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, fontSize: 14, color: 'var(--color-semantic-label-strong)' }}>세로 (값 포함)</h3>
        <Legend
          direction="vertical"
          items={[
            { label: 'AMR', color: 'var(--color-semantic-primary-normal)', value: 12 },
            { label: 'Forklift', color: 'var(--color-semantic-accent-foreground-violet)', value: 5 },
            { label: 'Docking', color: 'var(--color-semantic-status-positive)', value: 3 },
            { label: '미배정', color: 'var(--color-semantic-label-disable)', value: 2, muted: true },
          ]}
        />
      </section>
    </main>
  ),
};
