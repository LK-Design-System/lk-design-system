import React from 'react';
import { TextButton } from '../buttons/TextButton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { statusToneStyle } from '../status/status-presentation.js';

const SEVERITY_META = {
  error: {
    label: '오류',
    tone: 'negative',
  },
  warning: {
    label: '주의',
    tone: 'cautionary',
  },
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

function severityMeta(severity) {
  const meta = SEVERITY_META[severity] ?? SEVERITY_META.error;
  return { ...meta, ...statusToneStyle(meta.tone) };
}

/**
 * Form-level validation issue summary with a return path to the owning field
 * or step. Field rendering, focus policy, and validation remain product-owned.
 */
export const ValidationSummary = React.forwardRef(function ValidationSummary({
  title,
  headingLevel = 2,
  description,
  issues = [],
  emptyMessage = '저장 또는 제출을 진행할 수 있습니다.',
  onIssueActivate,
  actionLabel = '이동',
  announce = false,
  tabIndex,
  className,
  style,
  ...rest
}, forwardedRef) {
  const titleId = React.useId();
  const errorHeadingId = React.useId();
  const warningHeadingId = React.useId();
  const resolvedHeadingLevel = Math.min(6, Math.max(2, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;
  const GroupHeading = `h${Math.min(6, resolvedHeadingLevel + 1)}`;
  const errorIssues = issues.filter((issue) => issue.severity !== 'warning');
  const warningIssues = issues.filter((issue) => issue.severity === 'warning');
  const errorCount = errorIssues.length;
  const warningCount = warningIssues.length;
  const resolvedTitle = title ?? (issues.length > 0 ? '수정이 필요한 항목' : '확인이 완료되었습니다');
  const summaryLabel = issues.length > 0
    ? `검증 결과: 오류 ${errorCount}개, 주의 ${warningCount}개`
    : '검증 결과: 문제 없음';
  const resolvedTabIndex = tabIndex ?? (errorCount > 0 ? -1 : undefined);
  const groups = [
    {
      key: 'error',
      headingId: errorHeadingId,
      items: errorIssues,
      ...severityMeta('error'),
    },
    {
      key: 'warning',
      headingId: warningHeadingId,
      items: warningIssues,
      ...severityMeta('warning'),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <section
      {...rest}
      ref={forwardedRef}
      aria-labelledby={titleId}
      tabIndex={resolvedTabIndex}
      className={['lk-validation-summary', className].filter(Boolean).join(' ')}
      style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        containerType: 'inline-size',
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--color-semantic-background-elevated-normal)',
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <style>
        {`.lk-validation-summary:focus {
          outline: 2px solid var(--color-semantic-focus-indicator);
          outline-offset: 2px;
        }
        .lk-validation-summary__group + .lk-validation-summary__group {
          border-top: 1px solid var(--color-semantic-line-normal-normal);
        }
        .lk-validation-summary__item + .lk-validation-summary__item {
          border-top: 1px solid var(--color-semantic-line-normal-alternative);
        }
        @container (max-width: 360px) {
          .lk-validation-summary__header,
          .lk-validation-summary__item {
            padding: var(--space-3) !important;
          }
          .lk-validation-summary__group-heading {
            padding: var(--space-2) var(--space-3) !important;
          }
        }`}
      </style>

      <header
        className="lk-validation-summary__header"
        style={{
          display: 'grid',
          gap: 'var(--space-1)',
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--color-semantic-line-normal-normal)',
          background: 'var(--color-semantic-background-elevated-normal)',
        }}
      >
        <Heading
          id={titleId}
          style={{
            margin: 0,
            color: 'var(--color-semantic-label-strong)',
            fontSize: 'var(--body1-size)',
            lineHeight: 'var(--body1-line)',
            fontWeight: 'var(--fw-bold)',
            letterSpacing: 'var(--body1-spacing)',
          }}
        >
          {resolvedTitle}
        </Heading>
        {description != null && (
          <p
            style={{
              margin: 0,
              color: 'var(--color-semantic-label-neutral)',
              fontSize: 'var(--caption1-size)',
              lineHeight: 'var(--caption1-line)',
              wordBreak: 'keep-all',
            }}
          >
            {description}
          </p>
        )}
      </header>

      {announce && (
        <span
          role={errorCount > 0 ? 'alert' : 'status'}
          aria-live={errorCount > 0 ? undefined : 'polite'}
          aria-atomic="true"
          style={VISUALLY_HIDDEN_STYLE}
        >
          {summaryLabel}
        </span>
      )}

      {issues.length === 0 ? (
        <p
          style={{
            margin: 0,
            padding: 'var(--space-3) var(--space-4)',
            color: 'var(--color-semantic-label-neutral)',
            fontSize: 'var(--label1-size)',
            lineHeight: 'var(--label1-line)',
          }}
        >
          {emptyMessage}
        </p>
      ) : (
        <div className="lk-validation-summary__groups">
          {groups.map((group) => (
            <section
              key={group.key}
              aria-labelledby={group.headingId}
              className="lk-validation-summary__group"
              data-severity={group.key}
            >
              <div
                className="lk-validation-summary__group-heading"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-4)',
                  borderBottom: '1px solid var(--color-semantic-line-normal-alternative)',
                  background: 'var(--color-semantic-background-elevated-alternative)',
                }}
              >
                <Icon name={group.icon} size={16} color={group.foreground} aria-hidden="true" />
                <GroupHeading
                  id={group.headingId}
                  style={{
                    margin: 0,
                    color: group.foreground,
                    fontSize: 'var(--label1-size)',
                    lineHeight: 'var(--label1-line)',
                    fontWeight: 'var(--fw-semibold)',
                    letterSpacing: 'var(--label1-spacing)',
                  }}
                >
                  {group.label} {group.items.length}개
                </GroupHeading>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {group.items.map((issue) => {
                  const canActivate = typeof onIssueActivate === 'function';
                  const actionContent = issue.message ?? issue.label ?? issue.actionLabel ?? actionLabel;
                  const sharedActionProps = {
                    size: 'sm',
                    underline: true,
                    tone: group.key === 'error' ? 'danger' : 'signal',
                    'aria-label': issue.actionAriaLabel,
                    className: 'lk-textbtn lk-validation-summary__issue-link',
                    style: {
                      alignSelf: 'start',
                      justifyContent: 'flex-start',
                      maxWidth: '100%',
                      minHeight: 0,
                      ...(group.key === 'error' ? { color: group.foreground } : {}),
                      lineHeight: 'var(--label1-line)',
                      textAlign: 'left',
                      whiteSpace: 'normal',
                      wordBreak: 'keep-all',
                    },
                  };
                  const action = issue.href != null ? (
                    <TextButton {...sharedActionProps} as="a" href={issue.href}>
                      {actionContent}
                    </TextButton>
                  ) : canActivate ? (
                    <TextButton {...sharedActionProps} onClick={() => onIssueActivate(issue)}>
                      {actionContent}
                    </TextButton>
                  ) : null;

                  return (
                    <li
                      key={issue.id}
                      className="lk-validation-summary__item"
                      data-severity={group.key}
                      style={{
                        display: 'grid',
                        gap: 'var(--space-1)',
                        minHeight: 64,
                        padding: 'var(--space-3) var(--space-4)',
                        boxSizing: 'border-box',
                      }}
                    >
                      <strong
                        style={{
                          color: 'var(--color-semantic-label-neutral)',
                          fontSize: 'var(--caption1-size)',
                          lineHeight: 'var(--caption1-line)',
                          fontWeight: 'var(--fw-semibold)',
                        }}
                      >
                        {issue.label}
                      </strong>
                      {action ?? (
                        <span
                          style={{
                            color: 'var(--color-semantic-label-normal)',
                            fontSize: 'var(--label1-size)',
                            lineHeight: 'var(--label1-line)',
                            fontWeight: 'var(--fw-medium)',
                            wordBreak: 'keep-all',
                          }}
                        >
                          {issue.message}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </section>
  );
});

ValidationSummary.displayName = 'ValidationSummary';
