import {
  BarChart,
  DonutChart,
  Sparkline,
} from '../src/index.js';

const meta = {
  title: 'LDS Product/Data/Charts',
  parameters: {
    docs: {
      description: {
        component: '수치와 추세를 읽기 쉽게 보여주는 BarChart, DonutChart, Sparkline 패턴입니다.',
      },
    },
  },
};

export default meta;

export const ChartPatterns = {
  name: '차트 패턴',
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', width: '100%', maxWidth: 920 }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)' }}>
        <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <BarChart
            height={180}
            showValue
            data={[
              { label: '초안', value: 42 },
              { label: '검토', value: 28 },
              { label: '승인', value: 18 },
              { label: '보류', value: 7 },
            ]}
          />
        </div>
        <div style={{ background: 'var(--color-semantic-background-elevated-normal)', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)' }}>
          <DonutChart
            centerLabel="95%"
            segments={[
              { label: '정상', value: 72, color: 'var(--color-semantic-status-positive)' },
              { label: '검토', value: 18, color: 'var(--color-semantic-status-cautionary)' },
              { label: '중지', value: 5, color: 'var(--color-semantic-status-negative)' },
            ]}
          />
        </div>
      </section>

      <section style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <Sparkline data={[8, 12, 9, 16, 15, 22, 18, 28]} width={220} height={64} />
        <span style={{ color: 'var(--color-semantic-label-neutral)' }}>일일 처리량 추세</span>
      </section>
    </main>
  ),
};
