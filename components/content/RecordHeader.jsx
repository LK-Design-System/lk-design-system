import React from 'react';

/**
 * LK ROBOTICS — RecordHeader
 * A product-level identity header for a person, robot, order, or other record.
 * It keeps the record visual, name, badge, details, and actions in one stable
 * reading order without taking over page location or navigation context.
 */
export function RecordHeader({
  visual,
  title,
  badge,
  description,
  details,
  actions,
  headingLevel = 1,
  style,
  ...rest
}) {
  const resolvedHeadingLevel = Math.min(6, Math.max(1, headingLevel));
  const Heading = `h${resolvedHeadingLevel}`;

  return (
    <header
      style={{
        width: '100%',
        minWidth: 0,
        color: 'var(--color-semantic-label-normal)',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          columnGap: 'var(--space-4)',
          rowGap: 'var(--space-4)',
          minWidth: 0,
        }}
      >
        {visual != null && (
          <div data-record-header-visual style={{ display: 'flex', flexShrink: 0 }}>
            {visual}
          </div>
        )}
        <div
          data-record-header-content
          style={{
            display: 'grid',
            gap: 'var(--space-2)',
            flex: '1 1 12rem',
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
              minWidth: 0,
            }}
          >
            <Heading
              style={{
                margin: 0,
                minWidth: 0,
                color: 'var(--color-semantic-label-strong)',
                fontSize: 'var(--heading1-size)',
                lineHeight: 'var(--heading1-line)',
                fontWeight: 'var(--fw-extra)',
                letterSpacing: 'var(--heading1-spacing)',
                wordBreak: 'keep-all',
                overflowWrap: 'anywhere',
              }}
            >
              {title}
            </Heading>
            {badge != null && (
              <div data-record-header-badge style={{ display: 'flex', flexShrink: 0 }}>
                {badge}
              </div>
            )}
          </div>
          {description != null && (
            <p
              style={{
                margin: 0,
                maxWidth: 680,
                color: 'var(--color-semantic-label-neutral)',
                fontSize: 'var(--label1-size)',
                lineHeight: 'var(--label1-reading-line)',
                letterSpacing: 'var(--label1-spacing)',
                wordBreak: 'keep-all',
                overflowWrap: 'anywhere',
              }}
            >
              {description}
            </p>
          )}
          {details != null && (
            <div
              data-record-header-details
              style={{
                minWidth: 0,
                color: 'var(--color-semantic-label-neutral)',
                fontSize: 'var(--label2-size)',
                lineHeight: 'var(--label2-line)',
                letterSpacing: 'var(--label2-spacing)',
              }}
            >
              {details}
            </div>
          )}
        </div>
        {actions != null && (
          <div
            data-record-header-actions
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flex: '0 1 auto',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
              minWidth: 0,
              maxWidth: '100%',
              marginInlineStart: 'auto',
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
