import React from 'react';
import { TextButton } from '../buttons/TextButton.jsx';
import { StatusBadge } from './StatusBadge.jsx';

const AVAILABILITY_META = {
  available: { label: '사용 가능', tone: 'positive' },
  stale: { label: '오래됨', tone: 'cautionary' },
  missing: { label: '찾을 수 없음', tone: 'negative' },
  restricted: { label: '접근 제한', tone: 'cautionary' },
  error: { label: '확인 실패', tone: 'negative' },
  unknown: { label: '상태 불명', tone: 'offline' },
};

/** Product-provided provenance and availability for evidence sources. */
export function SourceDisclosure({
  title = '출처',
  headingLevel = 2,
  description,
  sources = [],
  emptyMessage = '표시할 출처가 없습니다.',
  onSourceActivate,
  openLabel = '출처 열기',
  style,
  ...rest
}) {
  const titleId = React.useId();
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;

  return (
    <section aria-labelledby={titleId} style={{ display: 'grid', gap: 'var(--space-3)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <header style={{ display: 'grid', gap: 'var(--space-1)' }}>
        <Heading id={titleId} style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)', lineHeight: 'var(--body1-line)' }}>{title}</Heading>
        {description != null && <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>{description}</p>}
      </header>

      {sources.length === 0 ? (
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)' }}>{emptyMessage}</p>
      ) : (
        <ol style={{ margin: 0, padding: 0, overflow: 'hidden', listStyle: 'none', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)' }}>
          {sources.map((source, index) => {
            const availability = AVAILABILITY_META[source.availability ?? 'unknown'] ?? AVAILABILITY_META.unknown;
            const hasDetails = source.excerpt != null || source.description != null || source.observedAt != null || source.updatedAt != null || (source.metadata?.length ?? 0) > 0 || source.href != null || typeof onSourceActivate === 'function';
            const summary = (
              <span style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-3)', width: '100%', minWidth: 0 }}>
                <span style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
                  <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', overflowWrap: 'anywhere' }}>{source.label}</strong>
                  {(source.kind != null || source.location != null) && <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>{[source.kind, source.location].filter(Boolean).join(' · ')}</span>}
                </span>
                <StatusBadge tone={availability.tone}>{source.availabilityLabel ?? availability.label}</StatusBadge>
              </span>
            );

            return (
              <li key={source.id} style={{ borderTop: index > 0 ? '1px solid var(--color-semantic-line-normal-alternative)' : 'none' }}>
                {hasDetails ? (
                  <details open={source.defaultExpanded || undefined}>
                    <summary style={{ padding: 'var(--space-3) var(--space-4)', cursor: 'pointer' }}>{summary}</summary>
                    <div style={{ display: 'grid', gap: 'var(--space-3)', padding: '0 var(--space-4) var(--space-4) var(--space-6)' }}>
                      {source.description != null && <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}>{source.description}</p>}
                      {source.excerpt != null && <blockquote style={{ margin: 0, padding: 'var(--space-3)', borderLeft: '3px solid var(--color-semantic-line-normal-strong)', background: 'var(--color-semantic-fill-alternative)', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>{source.excerpt}</blockquote>}
                      {(source.observedAt != null || source.updatedAt != null || (source.metadata?.length ?? 0) > 0) && (
                        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: 'var(--space-3)', margin: 0 }}>
                          {source.observedAt != null && <div><dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>관측 시각</dt><dd style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)' }}>{source.observedAt}</dd></div>}
                          {source.updatedAt != null && <div><dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>갱신 시각</dt><dd style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)' }}>{source.updatedAt}</dd></div>}
                          {(source.metadata ?? []).map((item) => <div key={item.label}><dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>{item.label}</dt><dd style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)', overflowWrap: 'anywhere' }}>{item.value}</dd></div>)}
                        </dl>
                      )}
                      {source.href != null ? (
                        <TextButton as="a" href={source.href} target="_blank" rel="noopener noreferrer" size="sm" tone="neutral" underline>{source.actionLabel ?? openLabel}</TextButton>
                      ) : typeof onSourceActivate === 'function' ? (
                        <TextButton size="sm" tone="neutral" underline onClick={() => onSourceActivate(source)}>{source.actionLabel ?? openLabel}</TextButton>
                      ) : null}
                    </div>
                  </details>
                ) : (
                  <div style={{ padding: 'var(--space-3) var(--space-4)' }}>{summary}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
