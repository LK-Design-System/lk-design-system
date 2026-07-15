import React from 'react';
import { TextButton } from '../buttons/TextButton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { Chip } from '../feedback/Chip.jsx';
import { StatusBadge } from './StatusBadge.jsx';

const AVAILABILITY_META = {
  available: { label: '사용 가능', tone: 'positive' },
  stale: { label: '오래됨', tone: 'cautionary' },
  missing: { label: '찾을 수 없음', tone: 'negative' },
  restricted: { label: '접근 제한', tone: 'cautionary' },
  error: { label: '확인 실패', tone: 'negative' },
  unknown: { label: '상태 불명', tone: 'offline' },
};

const VISUALLY_HIDDEN_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

function hasDisclosureContent(source) {
  return source.excerpt != null
    || source.description != null
    || source.observedAt != null
    || source.updatedAt != null
    || (source.metadata?.length ?? 0) > 0;
}

function actionAriaLabel(source, resolvedActionLabel) {
  if (source.actionAriaLabel != null) return source.actionAriaLabel;
  if (typeof source.label === 'string' && typeof resolvedActionLabel === 'string') {
    return `${source.label}: ${resolvedActionLabel}`;
  }
  return undefined;
}

function ExternalLinkContent({ children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0 }}>
      <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{children}</span>
      <Icon name="external-link" size={14} aria-hidden="true" style={{ flexShrink: 0 }} />
    </span>
  );
}

/** Product-provided provenance and availability for evidence sources. */
export function SourceDisclosure({
  title = '출처',
  headingLevel = 2,
  titleVisuallyHidden = false,
  description,
  sources = [],
  emptyMessage = '표시할 출처가 없습니다.',
  onSourceActivate,
  openLabel = '출처 열기',
  compact = false,
  className,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  // A standalone provenance panel is a named region landmark; an inline
  // compact citation is not — otherwise every cited answer projects a repeated
  // "출처" landmark into the conversation. The visually-hidden heading still
  // provides the group name and heading-navigation structure either way.
  const Root = compact ? 'div' : 'section';

  return (
    <Root
      {...rest}
      aria-labelledby={titleId}
      className={['lk-source-disclosure', className].filter(Boolean).join(' ')}
      style={{
        display: 'grid',
        gap: compact ? 'var(--space-2)' : 'var(--space-3)',
        minWidth: 0,
        containerType: 'inline-size',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <style>
        {`.lk-source-disclosure__summary {
          list-style: none;
        }
        .lk-source-disclosure__summary::-webkit-details-marker {
          display: none;
        }
        .lk-source-disclosure__summary:hover {
          background: var(--color-semantic-fill-alternative);
        }
        .lk-source-disclosure__summary:focus-visible {
          outline: 2px solid var(--color-semantic-focus-ring);
          outline-offset: -2px;
        }
        .lk-source-disclosure__details[open] .lk-source-disclosure__chevron {
          transform: rotate(180deg);
        }
        @container (max-width: 400px) {
          .lk-source-disclosure__summary,
          .lk-source-disclosure__static-row {
            padding: var(--space-3) !important;
          }
          .lk-source-disclosure__summary-content {
            grid-template-columns: minmax(0, 1fr) 16px !important;
          }
          .lk-source-disclosure__static-content {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .lk-source-disclosure__status {
            grid-column: 1;
            grid-row: 2;
            justify-self: start;
          }
          .lk-source-disclosure__chevron {
            grid-column: 2;
            grid-row: 1;
          }
          .lk-source-disclosure__panel {
            padding: var(--space-2) var(--space-3) var(--space-3) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .lk-source-disclosure__chevron {
            transition: none !important;
          }
        }`}
      </style>

      {titleVisuallyHidden && description == null ? (
        <Heading id={titleId} style={VISUALLY_HIDDEN_STYLE}>
          {title}
        </Heading>
      ) : (
        <header style={{ display: 'grid', gap: 'var(--space-1)' }}>
          <Heading
            id={titleId}
            style={titleVisuallyHidden
              ? VISUALLY_HIDDEN_STYLE
              : compact
                ? {
                    margin: 0,
                    color: 'var(--color-semantic-label-neutral)',
                    fontSize: 'var(--caption1-size)',
                    lineHeight: 'var(--caption1-line)',
                    fontWeight: 'var(--fw-semibold)',
                  }
                : {
                    margin: 0,
                    color: 'var(--color-semantic-label-strong)',
                    fontSize: 'var(--body1-size)',
                    lineHeight: 'var(--body1-line)',
                    fontWeight: 'var(--fw-bold)',
                    letterSpacing: 'var(--body1-spacing)',
                  }}
          >
            {title}
          </Heading>
          {description != null && (
            <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
              {description}
            </p>
          )}
        </header>
      )}

      {sources.length === 0 ? (
        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}>
          {emptyMessage}
        </p>
      ) : compact ? (
        // Compact provenance reads at the weight of an attachment chip: one
        // line per source, opens the original on activation, no inline
        // disclosure, availability, or card surface.
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', minWidth: 0 }}>
          {sources.map((source) => {
            const chipLink = source.href != null
              ? { as: 'a', href: source.href, target: '_blank', rel: 'noopener noreferrer' }
              : typeof onSourceActivate === 'function'
                ? { as: 'button', type: 'button', onClick: () => onSourceActivate(source) }
                : {};
            return (
              <li key={source.id} style={{ minWidth: 0, maxWidth: '100%' }}>
                <Chip
                  size="sm"
                  variant="outlined"
                  leading={<Icon name="document-text" size={14} />}
                  aria-label={source.actionAriaLabel}
                  className="lk-source-disclosure__chip"
                  {...chipLink}
                  style={{ maxWidth: '100%', minWidth: 0 }}
                >
                  <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {source.label}
                  </span>
                  {source.href != null && (
                    <Icon name="arrow-up-right" size={12} aria-hidden="true" style={{ flexShrink: 0 }} />
                  )}
                </Chip>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul
          style={{
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            listStyle: 'none',
            border: '1px solid var(--color-semantic-line-normal-normal)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-semantic-background-elevated-normal)',
          }}
        >
          {sources.map((source, index) => {
            const availability = AVAILABILITY_META[source.availability ?? 'unknown'] ?? AVAILABILITY_META.unknown;
            const hasDetails = hasDisclosureContent(source);
            const hasAction = source.href != null || typeof onSourceActivate === 'function';
            const resolvedActionLabel = source.actionLabel ?? openLabel;
            const resolvedActionAriaLabel = actionAriaLabel(source, resolvedActionLabel);
            const directAction = !hasDetails && hasAction;
            const directLabel = directAction && source.href != null ? (
              <TextButton
                as="a"
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                underline
                aria-label={source.actionAriaLabel}
                className="lk-textbtn lk-source-disclosure__source-link"
                style={{ justifyContent: 'flex-start', maxWidth: '100%', minHeight: 0, lineHeight: 'var(--label1-line)', textAlign: 'left', whiteSpace: 'normal' }}
              >
                <ExternalLinkContent>{source.label}</ExternalLinkContent>
              </TextButton>
            ) : directAction ? (
              <TextButton
                size="sm"
                underline
                aria-label={source.actionAriaLabel}
                onClick={() => onSourceActivate(source)}
                className="lk-textbtn lk-source-disclosure__source-link"
                style={{ justifyContent: 'flex-start', maxWidth: '100%', minHeight: 0, lineHeight: 'var(--label1-line)', textAlign: 'left', whiteSpace: 'normal' }}
              >
                {source.label}
              </TextButton>
            ) : (
              <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', fontWeight: 'var(--fw-semibold)', overflowWrap: 'anywhere' }}>
                {source.label}
              </strong>
            );
            const identity = (
              <span style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
                {directLabel}
                {(source.kind != null || source.location != null) && (
                  <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', overflowWrap: 'anywhere' }}>
                    {[source.kind, source.location].filter(Boolean).join(' · ')}
                  </span>
                )}
              </span>
            );
            const rowSummary = (
              <span
                className={hasDetails ? 'lk-source-disclosure__summary-content' : 'lk-source-disclosure__static-content'}
                style={{
                  display: 'grid',
                  gridTemplateColumns: hasDetails ? 'minmax(0, 1fr) auto 16px' : 'minmax(0, 1fr) auto',
                  alignItems: 'start',
                  columnGap: 'var(--space-2)',
                  rowGap: 'var(--space-1)',
                  width: '100%',
                  minWidth: 0,
                }}
              >
                {identity}
                <StatusBadge className="lk-source-disclosure__status" tone={availability.tone} style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                  {source.availabilityLabel ?? availability.label}
                </StatusBadge>
                {hasDetails && (
                  <Icon
                    className="lk-source-disclosure__chevron"
                    name="chevron-down-small"
                    size={16}
                    color="var(--color-semantic-label-alternative)"
                    aria-hidden="true"
                    style={{ transition: 'transform var(--dur-base) var(--ease-out)' }}
                  />
                )}
              </span>
            );

            return (
              <li key={source.id} style={{ borderTop: index > 0 ? '1px solid var(--color-semantic-line-normal-alternative)' : 'none' }}>
                {hasDetails ? (
                  <details className="lk-source-disclosure__details" open={source.defaultExpanded || undefined}>
                    <summary
                      className="lk-source-disclosure__summary"
                      style={{ padding: 'var(--space-3) var(--space-4)', cursor: 'pointer', transition: 'background var(--dur-fast) var(--ease-out)' }}
                    >
                      {rowSummary}
                    </summary>
                    <div className="lk-source-disclosure__panel" style={{ display: 'grid', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-4) var(--space-4)' }}>
                      {source.description != null && (
                        <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}>
                          {source.description}
                        </p>
                      )}
                      {source.excerpt != null && (
                        <blockquote
                          cite={source.href}
                          style={{ margin: 0, padding: '0 0 0 var(--space-3)', borderLeft: '3px solid var(--color-semantic-line-normal-strong)', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}
                        >
                          {source.excerpt}
                        </blockquote>
                      )}
                      {(source.observedAt != null || source.updatedAt != null || (source.metadata?.length ?? 0) > 0) && (
                        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: 'var(--space-3)', margin: 0 }}>
                          {source.observedAt != null && <div><dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>관측 시각</dt><dd style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)' }}>{source.observedAt}</dd></div>}
                          {source.updatedAt != null && <div><dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>갱신 시각</dt><dd style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)' }}>{source.updatedAt}</dd></div>}
                          {(source.metadata ?? []).map((item) => <div key={item.label}><dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>{item.label}</dt><dd style={{ margin: 'var(--space-1) 0 0', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)', overflowWrap: 'anywhere' }}>{item.value}</dd></div>)}
                        </dl>
                      )}
                      {source.href != null ? (
                        <TextButton as="a" href={source.href} target="_blank" rel="noopener noreferrer" size="sm" underline aria-label={resolvedActionAriaLabel}>
                          <ExternalLinkContent>{resolvedActionLabel}</ExternalLinkContent>
                        </TextButton>
                      ) : typeof onSourceActivate === 'function' ? (
                        <TextButton size="sm" underline aria-label={resolvedActionAriaLabel} onClick={() => onSourceActivate(source)}>
                          {resolvedActionLabel}
                        </TextButton>
                      ) : null}
                    </div>
                  </details>
                ) : (
                  <div className="lk-source-disclosure__static-row" style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    {rowSummary}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Root>
  );
}
