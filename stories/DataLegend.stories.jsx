import { Legend } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

const meta = {
  title: 'LDS Product/Data/Visualization/Legend',
  parameters: {
    storyGuide: {
      storyId: 'lds-product-data-visualization-legend--legends',
      eyebrow: 'Product / Data / Legend',
      title: '사용자가 색·선·도형이 데이터에서 뜻하는 바를 확인합니다',
      description:
        '맵·차트·다이어그램의 시각 인코딩을 명시적인 라벨과 값에 연결할 때 적합합니다. 항목 자체에 충분한 직접 라벨이 있거나 단순 상태 하나만 설명할 때는 별도 Legend 대신 인라인 라벨을 사용하세요.',
    },
    docs: {
      description: {
        component: '맵·차트·다이어그램의 색상, 선, 레이어 의미를 라벨과 짝지어 설명하는 Legend 패턴입니다.',
      },
    },
  },
};

export default meta;

export const Legends = {
  name: '개요',
  parameters: storyDescription(
    '지도 레이어와 설비 상태의 색·선·도형·값을 가로 및 세로 범례로 설명하는 상황입니다. 각 표식이 라벨과 명확히 짝지어지고 비활성·점선 의미가 색 외 단서로도 구분되는지 확인하세요.',
  ),
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
  play: async ({ canvasElement }) => {
    const map = canvasElement.querySelector('ul[aria-label="지도 레이어 범례"]');
    const equipment = canvasElement.querySelector('ul[aria-label="설비 상태 범례"]');
    if (!map || !equipment) throw new Error('Every legend must be a named list.');

    /* ARIA 1.2에서 aria-disabled는 글로벌 상태가 아니고 listitem에서 지원되지 않는다. */
    if (canvasElement.querySelector('li[aria-disabled]')) {
      throw new Error('aria-disabled is not supported on listitem and must not be used to mark a legend state.');
    }

    const disabled = map.querySelector('[data-legend-state="disabled"]');
    const muted = equipment.querySelector('[data-legend-state="muted"]');
    if (!disabled || !muted) throw new Error('The legend fixture must cover both the disabled and the muted state.');

    // 두 상태가 색·대비 차이만으로 갈리면 WCAG 1.4.1 위반이다.
    const label = disabled.querySelector('[data-legend-label]');
    if (canvasElement.ownerDocument.defaultView.getComputedStyle(label).textDecorationLine !== 'line-through') {
      throw new Error('A disabled legend item needs a non-color cue that a muted item does not have.');
    }
    if (!disabled.textContent.includes('표시 꺼짐') || !muted.textContent.includes('강조 낮음')) {
      throw new Error('Both legend states must reach assistive technology as text, not only as reduced contrast.');
    }
    if (muted.textContent.includes('표시 꺼짐')) {
      throw new Error('A muted legend item must not be announced as switched off.');
    }
  },
};

export const CompactChartLegend = {
  name: '반응형 · 좁은 차트의 조밀한 배치',
  parameters: storyDescription(
    '작은 차트 주변에 실측·목표·주의 series를 압축해 표시하는 상황입니다. 작은 크기에서도 선 종류와 라벨이 구분되고 차트와 같은 순서를 유지하는지 확인하세요.',
  ),
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
  name: '변형·상태 · 항목 없음',
  parameters: storyDescription(
    '표시할 series나 레이어가 없어 범례 항목이 비어 있는 상황입니다. 빈 공간만 남기지 않고 현재 설명할 항목이 없다는 메시지가 제공되는지 확인하세요.',
  ),
  render: () => <Legend emptyLabel="표시할 범례가 없습니다" />,
};
