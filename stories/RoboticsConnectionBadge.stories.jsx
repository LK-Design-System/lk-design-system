import { ConnectionBadge } from '../src/index.js';
import { ConnectionBadgeCard as ConnectionBadgeCardStory } from './ProductEditorAndViz.shared.jsx';

const meta = {
  title: 'LDS Product/Status/Connection Badge',
  tags: ['autodocs'],
  component: ConnectionBadge,
  parameters: {
    storyGuide: {
      storyId: 'lds-product-status-connection-badge--connection-badges',
      eyebrow: 'Product / Connection Badge',
      title: '연결 배지는 transport truth만 보여 줍니다',
      description:
        'MQTT·WebSocket처럼 제품이 의존하는 transport의 연결 사실과 품질을 표시할 때 적합합니다. 연결 상태가 데이터 freshness, 장비 health, 동작 가능 여부까지 대신하지 않도록 각각 별도 상태로 조합하세요.',
    },
    docs: {
      description: {
        component: 'MQTT·rosbridge transport truth를 신호 막대와 라벨로 보여주는 ConnectionBadge 패턴입니다. 연결, freshness, health, operability, authority를 서로 다른 의미 축으로 유지합니다. transport 연결 상태 표시에 적합하며, 데이터 freshness나 장비 건강 상태 표현에는 이 배지를 사용하지 마세요.',
      },
    },
  },
};

export default meta;

export const ConnectionBadges = {
  name: '개요',
  parameters: {
    docs: {
      description: {
        story:
          'unknown부터 failed까지 7개 transport 상태를 나란히 봅니다. connected가 freshness나 command readiness를 암시하지 않는지, 320px에서도 막대와 라벨이 함께 유지되는지 확인하세요.',
      },
    },
  },
  render: () => (
    <main style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 720 }}>
      <section aria-label="Transport 상태" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'center' }}>
        <ConnectionBadge connectionState="unknown" />
        <ConnectionBadge connectionState="connecting" />
        <ConnectionBadge connectionState="connected" />
        <ConnectionBadge connectionState="degraded" />
        <ConnectionBadge connectionState="reconnecting" />
        <ConnectionBadge connectionState="disconnected" />
        <ConnectionBadge connectionState="failed" />
      </section>
      <section aria-label="320px 좁은 폭" style={{ display: 'grid', gap: 'var(--space-2)', width: 320, maxWidth: '100%' }}>
        <strong style={{ color: 'var(--color-semantic-label-strong)' }}>320px narrow</strong>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
          <ConnectionBadge connectionState="connected" />
          <ConnectionBadge connectionState="degraded" />
          <ConnectionBadge connectionState="reconnecting" />
          <ConnectionBadge connectionState="disconnected" />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', color: 'var(--color-semantic-label-neutral)', fontSize: 13 }}>
          <span>Hidden-label contract</span>
          <ConnectionBadge data-contract="hidden-label" connectionState="connected" showLabel={false} aria-label="로봇 링크 연결됨" />
        </div>
      </section>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const expected = {
      unknown: '연결 상태 알 수 없음',
      connecting: '연결 중',
      connected: '연결됨',
      degraded: '연결 품질 저하',
      reconnecting: '재연결 중',
      disconnected: '연결 끊김',
      failed: '연결 실패',
    };
    for (const [state, label] of Object.entries(expected)) {
      const badge = canvasElement.querySelector(`[aria-label="Transport 상태"] [data-connection-state="${state}"]`);
      if (!badge || !badge.textContent?.includes(label)) {
        throw new Error(`ConnectionBadge must expose the ${state} transport label.`);
      }
    }
    const hiddenLabel = canvasElement.querySelector('[data-contract="hidden-label"]');
    if (hiddenLabel?.getAttribute('role') !== 'img' || hiddenLabel.getAttribute('aria-label') !== '로봇 링크 연결됨') {
      throw new Error('A hidden ConnectionBadge label must remain programmatically named.');
    }
  },
};

export const ConnectionBadgeCard = { ...ConnectionBadgeCardStory, name: 'ConnectionBadge card parity', tags: ['!dev', 'visual-parity'] };
