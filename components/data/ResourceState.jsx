import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { VisuallyHidden } from '../layout/VisuallyHidden.jsx';
import { Banner } from '../status/Banner.jsx';
import { EmptyState } from '../status/EmptyState.jsx';
import { Skeleton } from '../status/Skeleton.jsx';

const STATE_PRESENTATION = {
  ready: {
    title: null,
    description: null,
    tone: 'info',
    icon: 'circle-info',
  },
  loading: {
    title: '데이터를 불러오는 중입니다',
    description: '최신 정보를 준비하고 있습니다.',
    tone: 'info',
    icon: 'hourglass',
  },
  refreshing: {
    title: '데이터를 새로 고치는 중입니다',
    description: '현재 내용을 유지한 채 최신 정보를 확인하고 있습니다.',
    tone: 'info',
    icon: 'refresh',
  },
  empty: {
    title: '표시할 데이터가 없습니다',
    description: '조건을 변경하거나 새 항목을 추가해 보세요.',
    tone: 'info',
    icon: 'inbox',
  },
  error: {
    title: '데이터를 불러오지 못했습니다',
    description: '잠시 후 다시 시도해 주세요.',
    tone: 'error',
    icon: 'circle-close-fill',
  },
  stale: {
    title: '최신 상태가 아닌 데이터입니다',
    description: '마지막으로 확인된 정보를 표시하고 있습니다.',
    tone: 'warning',
    icon: 'clock',
  },
  offline: {
    title: '오프라인 상태입니다',
    description: '마지막으로 확인된 정보를 표시하고 있습니다.',
    tone: 'warning',
    icon: 'signal',
  },
  restricted: {
    title: '데이터를 볼 권한이 없습니다',
    description: '접근 권한을 확인하거나 관리자에게 문의해 주세요.',
    tone: 'warning',
    icon: 'lock',
  },
};

const PRESERVED_DATA_STATES = new Set(['refreshing', 'error', 'stale', 'offline']);
const BLOCKING_STATES = new Set(['empty', 'restricted']);

function DefaultLoadingContent() {
  return (
    <div
      data-resource-state-skeleton
      style={{
        display: 'grid',
        gap: 'var(--space-4)',
        minWidth: 0,
        padding: 'var(--space-6) var(--space-5)',
      }}
    >
      <Skeleton variant="text" width="42%" height={16} />
      <Skeleton variant="text" width="100%" lines={3} />
      <Skeleton variant="rect" width="100%" height={104} />
    </div>
  );
}

/**
 * LK Product Extension — ResourceState
 * Composes LDS status primitives into a consistent resource-state contract.
 * Products still own fetching, retry execution, freshness calculation and
 * permission decisions; this component owns their visual and a11y treatment.
 */
export function ResourceState({
  state = 'ready',
  title,
  description,
  action,
  lastUpdated,
  lastUpdatedLabel = '마지막 업데이트',
  loadingContent,
  messageVariant = 'embedded',
  children,
  style,
  ...rest
}) {
  const resolvedState = STATE_PRESENTATION[state] ? state : 'ready';
  const presentation = STATE_PRESENTATION[resolvedState];
  const resolvedTitle = title ?? presentation.title;
  const resolvedDescription = description ?? presentation.description;
  const hasContent = React.Children.count(children) > 0;
  const isLoading = resolvedState === 'loading' || (resolvedState === 'refreshing' && !hasContent);
  const isBlocking = BLOCKING_STATES.has(resolvedState)
    || (!hasContent && !isLoading && resolvedState !== 'ready');
  const preservesContent = hasContent && PRESERVED_DATA_STATES.has(resolvedState);
  const statusRole = resolvedState === 'error' || resolvedState === 'offline' ? 'alert' : 'status';
  const statusLive = statusRole === 'alert' ? 'assertive' : 'polite';

  return (
    <section
      data-resource-state={resolvedState}
      data-preserves-content={preservesContent ? 'true' : 'false'}
      aria-busy={isLoading || resolvedState === 'refreshing' ? 'true' : undefined}
      style={{
        display: 'grid',
        gap: messageVariant === 'standalone' ? 'var(--space-4)' : 0,
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      {preservesContent && (
        <Banner
          role={statusRole}
          aria-live={statusLive}
          tone={presentation.tone}
          variant={messageVariant}
          title={resolvedTitle}
          action={action}
          style={{ minWidth: 0 }}
        >
          {resolvedDescription}
        </Banner>
      )}

      {isLoading && (
        <div role="status" aria-live="polite" style={{ minWidth: 0 }}>
          <VisuallyHidden>
            {resolvedTitle}{resolvedDescription ? `. ${resolvedDescription}` : ''}
          </VisuallyHidden>
          {loadingContent ?? <DefaultLoadingContent />}
        </div>
      )}

      {isBlocking && (
        <div role={statusRole} aria-live={statusLive} style={{ minWidth: 0 }}>
          <EmptyState
            icon={<Icon name={presentation.icon} size={26} aria-hidden="true" />}
            title={resolvedTitle}
            description={resolvedDescription}
            action={action}
          />
        </div>
      )}

      {!isLoading && !isBlocking && children}

      {!isLoading && !isBlocking && lastUpdated != null && (
        <div
          data-resource-state-freshness
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            minWidth: 0,
            padding: messageVariant === 'embedded'
              ? 'var(--space-3) var(--space-5)'
              : 'var(--space-2) 0 0',
            borderTop: messageVariant === 'embedded'
              ? '1px solid var(--color-semantic-line-normal-normal)'
              : 'none',
            color: 'var(--color-semantic-label-alternative)',
            fontSize: 'var(--caption1-size)',
            lineHeight: 'var(--caption1-line)',
          }}
        >
          <Icon name="history" size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
          <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
            {lastUpdatedLabel}: {lastUpdated}
          </span>
        </div>
      )}
    </section>
  );
}
