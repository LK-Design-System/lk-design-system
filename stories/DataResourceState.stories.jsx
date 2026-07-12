import React from 'react';
import { Button, ResourceState, StatusBadge } from '../src/index.js';
import { storyDescription } from './StoryGuide.shared.jsx';

function ResourceRows() {
  return (
    <div data-testid="preserved-resource-content" style={{ display: 'grid', padding: 'var(--space-5)' }}>
      {[
        ['가동 중 로봇', '18대', 'positive'],
        ['점검 필요', '2대', 'cautionary'],
        ['대기 작업', '7건', 'neutral'],
      ].map(([label, value, tone], index) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            minWidth: 0,
            padding: 'var(--space-3) 0',
            borderTop: index ? '1px solid var(--color-semantic-line-normal-normal)' : 'none',
          }}
        >
          <span style={{ minWidth: 0, color: 'var(--color-semantic-label-neutral)', overflowWrap: 'anywhere' }}>{label}</span>
          <StatusBadge tone={tone}>{value}</StatusBadge>
        </div>
      ))}
    </div>
  );
}

function ResourceSurface({ label, children }) {
  return (
    <section
      aria-label={label}
      style={{
        minWidth: 0,
        overflow: 'hidden',
        border: 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        background: 'var(--color-semantic-background-elevated-normal)',
        boxShadow: 'var(--component-card-shadow-sm)',
      }}
    >
      <header style={{ padding: 'var(--space-4) var(--space-5)', fontSize: 'var(--body1-size)', fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)' }}>
        {label}
      </header>
      {children}
    </section>
  );
}

const meta = {
  title: 'LDS Product/Data/Display/Resource State',
  component: ResourceState,
  parameters: {
    layout: 'padded',
    storyGuide: {
      storyId: 'lds-product-data-display-resource-state--preserved-data-states',
      eyebrow: 'Product / Data / Resource State',
      title: '사용자가 비동기 데이터의 가용성과 다음 복구 행동을 판단합니다',
      description:
        '로딩·오류·지연 중에도 마지막 정상 데이터를 유지하며 현재 신뢰도를 알려야 할 때 적합합니다. 단일 필드 검증이나 짧은 작업 결과에는 Resource State 대신 Form 메시지 또는 Toast를 사용하세요.',
    },
    docs: {
      description: {
        component: '비동기 리소스의 loading, empty, error, stale, offline, restricted 상태와 마지막 정상 데이터 유지 순서를 통일하는 LK Product 조합 컴포넌트입니다.',
      },
    },
  },
};

export default meta;

export const PreservedDataStates = {
  name: '개요',
  parameters: storyDescription(
    '새로고침·지연·오류 중에도 마지막 정상 운영 데이터를 유지하는 상황입니다. 상태 메시지 다음에 보존 데이터와 freshness가 읽히고 복구 action이 명확한지 확인하세요.',
  ),
  render: () => (
    <main
      data-testid="resource-state-grid"
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'var(--space-5)', width: 'min(100%, 980px)' }}
    >
      <ResourceSurface label="실시간 운영 현황">
        <ResourceState state="refreshing" lastUpdated="오늘 14:32">
          <ResourceRows />
        </ResourceState>
      </ResourceSurface>
      <ResourceSurface label="로봇 상태 요약">
        <ResourceState
          state="stale"
          lastUpdated="오늘 14:21"
          action={<Button size="sm" variant="ghost">새로고침</Button>}
        >
          <ResourceRows />
        </ResourceState>
      </ResourceSurface>
      <ResourceSurface label="미션 처리 현황">
        <ResourceState
          state="error"
          lastUpdated="오늘 14:08"
          action={<Button size="sm" variant="ghost">다시 시도</Button>}
        >
          <ResourceRows />
        </ResourceState>
      </ResourceSurface>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const grid = canvasElement.querySelector('[data-testid="resource-state-grid"]');
    const stale = canvasElement.querySelector('[data-resource-state="stale"]');
    const error = canvasElement.querySelector('[data-resource-state="error"]');
    for (const resource of [stale, error]) {
      if (!resource || resource.dataset.preservesContent !== 'true' || !resource.querySelector('[data-testid="preserved-resource-content"]')) {
        throw new Error('Stale and error states must preserve the last successful resource content.');
      }
      const message = resource.querySelector('[role="status"], [role="alert"]');
      const content = resource.querySelector('[data-testid="preserved-resource-content"]');
      const freshness = resource.querySelector('[data-resource-state-freshness]');
      if (!message || !content || !freshness || !(message.compareDocumentPosition(content) & Node.DOCUMENT_POSITION_FOLLOWING) || !(content.compareDocumentPosition(freshness) & Node.DOCUMENT_POSITION_FOLLOWING)) {
        throw new Error('ResourceState reading order must be message, preserved content, then freshness.');
      }
    }
    if (!grid || grid.scrollWidth > grid.clientWidth + 1 || error.querySelector('[role="alert"]') == null) {
      throw new Error('Resource states must fit their container and errors must expose alert semantics.');
    }
  },
};

export const NarrowBlockingStates = {
  name: '반응형 · 좁은 폭의 로딩과 차단 상태',
  parameters: storyDescription(
    '320px 폭에서 loading·empty·restricted처럼 콘텐츠를 대체하는 상태를 비교하는 상황입니다. 각 상태의 의미와 가능한 action이 보이고 가로 overflow 없이 읽히는지 확인하세요.',
  ),
  render: () => (
    <main data-testid="narrow-resource-states" style={{ display: 'grid', gap: 'var(--space-5)', width: 320, maxWidth: '100%' }}>
      <ResourceSurface label="처리량">
        <ResourceState state="loading" />
      </ResourceSurface>
      <ResourceSurface label="검색 결과">
        <ResourceState
          state="empty"
          action={<Button size="sm" variant="secondary">필터 초기화</Button>}
        />
      </ResourceSurface>
      <ResourceSurface label="비용 분석">
        <ResourceState state="restricted" />
      </ResourceSurface>
    </main>
  ),
  play: async ({ canvasElement }) => {
    const wrapper = canvasElement.querySelector('[data-testid="narrow-resource-states"]');
    const loading = canvasElement.querySelector('[data-resource-state="loading"]');
    const empty = canvasElement.querySelector('[data-resource-state="empty"]');
    const restricted = canvasElement.querySelector('[data-resource-state="restricted"]');
    if (!loading || loading.getAttribute('aria-busy') !== 'true' || !loading.querySelector('[data-resource-state-skeleton]')) {
      throw new Error('Loading resources must expose busy semantics and a progressive Skeleton.');
    }
    if (!empty?.querySelector('[role="status"]') || !restricted?.querySelector('[role="status"]')) {
      throw new Error('Blocking resource states must expose their text and icon through status semantics.');
    }
    if (!wrapper || wrapper.scrollWidth > wrapper.clientWidth + 1) {
      throw new Error('ResourceState must not create horizontal overflow at 320px.');
    }
  },
};
