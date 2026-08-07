import React from 'react';
import { TextButton } from '@lk-design-system/lds-core/components/buttons/TextButton';
import { Icon } from '@lk-design-system/lds-core/components/icon/Icon';
import { Chip } from '@lk-design-system/lds-core/components/feedback/Chip';
import { Popover } from '../overlay/Popover.jsx';
import { StatusBadge } from '@lk-design-system/lds-core/components/content/StatusBadge';

// Availability answers one question: can the user still reach this source? A
// reachable source answers it by saying nothing. Badging the normal case is
// what stops the abnormal ones from standing out — three rows carrying three
// different colours read as a status dashboard rather than as evidence — so
// only exceptions carry a badge, and both `available` and an omitted
// availability stay silent.
//
// `restricted` is absent on purpose. A source the user cannot open never
// becomes a row at all, so it never needs a badge; see `partitionSources`.
const AVAILABILITY_META = {
  stale: { label: '오래됨', tone: 'cautionary' },
  missing: { label: '찾을 수 없음', tone: 'negative' },
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

// A source the current user has no read permission for is withheld, not
// listed. Rendering its label discloses that the document exists, which is the
// disclosure the permission check exists to prevent — RFC 9110 §15.5.5 leaves
// a server free to deny that a forbidden resource exists at all, and every
// permission-aware search product surveyed omits such hits rather than
// showing a locked placeholder. The count is reported on its own line and
// never folded into a visible source total, because a total computed before
// trimming leaks the same fact the omission was protecting.
function partitionSources(sources) {
  const visible = [];
  let withheld = 0;
  for (const source of sources) {
    if (source.availability === 'restricted') withheld += 1;
    else visible.push(source);
  }
  return { visible, withheld };
}

function hasDisclosureContent(source) {
  return source.excerpt != null
    || source.description != null
    || source.observedAt != null
    || source.updatedAt != null
    || (source.metadata?.length ?? 0) > 0;
}

// The toggle reveals provenance for one named source, so its accessible name
// has to carry that name — a row of identical "세부 정보" buttons is
// unnavigable by name. Falls back to the generic name only when the label is
// not a plain string and the product supplied no `actionAriaLabel`.
function disclosureAriaLabel(source) {
  if (typeof source.label === 'string') return `${source.label} 세부 정보`;
  if (source.actionAriaLabel != null) return `${source.actionAriaLabel} 세부 정보`;
  return '출처 세부 정보';
}

function ExternalLinkContent({ children }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0 }}>
      <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{children}</span>
      <Icon name="external-link" size={14} aria-hidden="true" style={{ flexShrink: 0 }} />
    </span>
  );
}

// The source label is the destination, not a heading that happens to sit above
// one. Giving the row a prominent name that only expands it, and burying the
// actual navigation in a small link inside the panel, puts the heaviest
// element on the least useful action.
function SourceLabel({ source, onSourceActivate }) {
  const linkStyle = {
    justifyContent: 'flex-start',
    maxWidth: '100%',
    minHeight: 0,
    lineHeight: 'var(--label1-line)',
    textAlign: 'left',
    whiteSpace: 'normal',
  };
  if (source.href != null) {
    return (
      <TextButton
        as="a"
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        size="sm"
        underline
        aria-label={source.actionAriaLabel}
        className="lk-textbtn lk-source-disclosure__source-link"
        style={linkStyle}
      >
        <ExternalLinkContent>{source.label}</ExternalLinkContent>
      </TextButton>
    );
  }
  if (typeof onSourceActivate === 'function') {
    return (
      <TextButton
        size="sm"
        underline
        aria-label={source.actionAriaLabel}
        onClick={() => onSourceActivate(source)}
        className="lk-textbtn lk-source-disclosure__source-link"
        style={linkStyle}
      >
        {source.label}
      </TextButton>
    );
  }
  return (
    <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', fontWeight: 'var(--fw-semibold)', overflowWrap: 'anywhere' }}>
      {source.label}
    </strong>
  );
}

function SourceBadges({ source }) {
  const availability = source.availability != null ? AVAILABILITY_META[source.availability] : undefined;
  if (source.badge == null && availability == null) return null;
  return (
    <span className="lk-source-disclosure__status" style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 'var(--space-1)', flexShrink: 0 }}>
      {/* A product-owned verdict and a reachability exception are different
          axes — a claim can be 확인됨 and its source simultaneously 오래됨 —
          so they render as separate badges rather than one overloaded slot. */}
      {source.badge != null && (
        <StatusBadge tone={source.badge.tone ?? 'neutral'} style={{ whiteSpace: 'nowrap' }}>
          {source.badge.label}
        </StatusBadge>
      )}
      {availability != null && (
        <StatusBadge tone={availability.tone} style={{ whiteSpace: 'nowrap' }}>
          {source.availabilityLabel ?? availability.label}
        </StatusBadge>
      )}
    </span>
  );
}

// One provenance row for the `list` variant.
//
// This is a custom disclosure rather than native `details`/`summary`. The row
// carries a link and a badge, and nested interactive content inside `summary`
// is exactly where native support degrades; iOS Safari + VoiceOver fails the
// role and the state outright; and hiding the default marker — which this
// component has to do to draw its own chevron — is itself what breaks state
// announcement in VoiceOver, JAWS and NVDA, since in some pairings the marker
// direction is the only state signal. A real button with `aria-expanded` and
// `aria-controls` keeps the state, and keeps the badge and the link outside
// the control that owns it.
function SourceRow({ source, first, onSourceActivate }) {
  const panelId = React.useId();
  const [expanded, setExpanded] = React.useState(Boolean(source.defaultExpanded));
  const hasPanel = hasDisclosureContent(source);
  const showMetadata = source.observedAt != null || source.updatedAt != null || (source.metadata?.length ?? 0) > 0;

  return (
    <li style={{ borderTop: first ? 'none' : '1px solid var(--color-semantic-line-normal-alternative)' }}>
      <div
        className="lk-source-disclosure__source-row"
        style={{
          display: 'grid',
          gridTemplateColumns: 'var(--space-6) minmax(0, 1fr) auto',
          alignItems: 'start',
          columnGap: 'var(--space-2)',
          rowGap: 'var(--space-1)',
          padding: 'var(--space-3) var(--space-4)',
        }}
      >
        {hasPanel ? (
          <button
            type="button"
            className="lk-source-disclosure__disclosure"
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={disclosureAriaLabel(source)}
            onClick={() => setExpanded((open) => !open)}
            style={{
              /* WCAG 2.2 SC 2.5.8 asks for 24x24; a bare chevron glyph is
                 smaller than that, so the button owns the target. */
              display: 'grid',
              placeItems: 'center',
              width: 'var(--space-6)',
              height: 'var(--space-6)',
              padding: 0,
              border: 0,
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              color: 'var(--color-semantic-label-alternative)',
              cursor: 'pointer',
              transition: 'background var(--dur-fast) var(--ease-out)',
            }}
          >
            <Icon
              className="lk-source-disclosure__chevron"
              name="chevron-right-small"
              size={16}
              aria-hidden="true"
              style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }}
            />
          </button>
        ) : (
          /* Keeps identity aligned down the column when a row has nothing to
             expand, without inventing a control that does nothing. */
          <span aria-hidden="true" style={{ width: 'var(--space-6)' }} />
        )}

        <span style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
          <SourceLabel source={source} onSourceActivate={onSourceActivate} />
          {(source.kind != null || source.location != null) && (
            <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', overflowWrap: 'anywhere' }}>
              {[source.kind, source.location].filter(Boolean).join(' · ')}
            </span>
          )}
        </span>

        <SourceBadges source={source} />
      </div>

      {hasPanel && (
        <div
          id={panelId}
          className="lk-source-disclosure__panel"
          style={{
            display: expanded ? 'grid' : 'none',
            gap: 'var(--space-3)',
            padding: '0 var(--space-4) var(--space-4)',
            marginInlineStart: 'var(--space-8)',
          }}
        >
          {/* The quoted passage is why the row is worth opening, so it leads
              the panel and reads at body weight. It sits on the same quiet
              fill surface `Blockquote` uses — the snippet idiom, text visibly
              lifted out of the original — so quoting looks like one thing
              across the system. A colored bar here read as a selection or
              link accent, not as quoting. */}
          {source.excerpt != null && (
            <blockquote
              cite={source.href}
              className="lk-source-disclosure__excerpt"
              style={{ margin: 0, padding: 'var(--space-2) var(--space-3)', background: 'var(--color-semantic-fill-alternative)', borderRadius: 'var(--radius-sm)', color: 'var(--color-semantic-label-strong)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}
            >
              {source.excerpt}
            </blockquote>
          )}
          {source.description != null && (
            <p style={{ margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
              {source.description}
            </p>
          )}
          {showMetadata && (
            /* Key beside value, not spread across the panel width: an
               auto-fit track stretches two pairs to opposite edges of a wide
               surface and stops reading as one record. */
            <dl style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr)', columnGap: 'var(--space-4)', rowGap: 'var(--space-1)', margin: 0 }}>
              {source.observedAt != null && (
                <>
                  <dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>관측 시각</dt>
                  <dd style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', overflowWrap: 'anywhere' }}>{source.observedAt}</dd>
                </>
              )}
              {source.updatedAt != null && (
                <>
                  <dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>갱신 시각</dt>
                  <dd style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', overflowWrap: 'anywhere' }}>{source.updatedAt}</dd>
                </>
              )}
              {(source.metadata ?? []).map((item) => (
                <React.Fragment key={item.label}>
                  <dt style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>{item.label}</dt>
                  <dd style={{ margin: 0, color: 'var(--color-semantic-label-strong)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', overflowWrap: 'anywhere' }}>{item.value}</dd>
                </React.Fragment>
              ))}
            </dl>
          )}
        </div>
      )}
    </li>
  );
}

// One source as an attachment-weight link chip, for the `chips` variant.
function renderSourceChip(source, onSourceActivate) {
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
}

// One source inside the `inline` popover: a borderless row, with the quoted
// passage beneath it when there is one. The panel is already an elevated card,
// so the rows carry no border of their own.
function renderSourceRow(source, onSourceActivate) {
  const Comp = source.href != null ? 'a' : typeof onSourceActivate === 'function' ? 'button' : 'span';
  const interactive = Comp !== 'span';
  const linkProps = source.href != null
    ? { href: source.href, target: '_blank', rel: 'noopener noreferrer' }
    : typeof onSourceActivate === 'function'
      ? { type: 'button', onClick: () => onSourceActivate(source) }
      : {};
  return (
    <li key={source.id} style={{ minWidth: 0 }}>
      <Comp
        className="lk-source-disclosure__row"
        aria-label={source.actionAriaLabel}
        {...linkProps}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          width: '100%',
          minWidth: 0,
          padding: 'var(--space-2)',
          boxSizing: 'border-box',
          border: 0,
          borderRadius: 'var(--radius-sm)',
          background: 'transparent',
          color: 'var(--color-semantic-label-normal)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--label1-size)',
          lineHeight: 'var(--label1-line)',
          textAlign: 'left',
          textDecoration: 'none',
          cursor: interactive ? 'pointer' : 'default',
          transition: 'background var(--dur-fast) var(--ease-out)',
        }}
      >
        <Icon name="document-text" size={16} aria-hidden="true" style={{ flexShrink: 0, color: 'var(--color-semantic-label-alternative)' }} />
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {source.label}
        </span>
        {source.href != null && (
          <Icon name="arrow-up-right" size={14} aria-hidden="true" style={{ flexShrink: 0, color: 'var(--color-semantic-label-alternative)' }} />
        )}
      </Comp>
      {source.excerpt != null && (
        <blockquote
          cite={source.href}
          className="lk-source-disclosure__row-excerpt"
          style={{ margin: '0 var(--space-2) var(--space-1)', padding: 'var(--space-1) var(--space-2)', background: 'var(--color-semantic-fill-alternative)', borderRadius: 'var(--radius-sm)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}
        >
          {source.excerpt}
        </blockquote>
      )}
    </li>
  );
}

const PANEL_CSS = `.lk-source-disclosure__toggle:hover,
.lk-source-disclosure__row:hover,
.lk-source-disclosure__disclosure:hover {
  background: var(--color-semantic-fill-alternative);
}
.lk-source-disclosure__toggle:focus-visible,
.lk-source-disclosure__disclosure:focus-visible {
  outline: 2px solid var(--color-semantic-focus-ring);
  outline-offset: 2px;
}
.lk-source-disclosure__row:focus-visible {
  outline: 2px solid var(--color-semantic-focus-ring);
  outline-offset: -2px;
}
@container (max-width: 400px) {
  .lk-source-disclosure__source-row {
    grid-template-columns: var(--space-6) minmax(0, 1fr) !important;
  }
  .lk-source-disclosure__status {
    grid-column: 2;
    grid-row: 2;
    justify-self: start;
  }
  .lk-source-disclosure__panel {
    margin-inline-start: 0 !important;
    padding: 0 var(--space-3) var(--space-3) !important;
  }
}
@media (prefers-reduced-motion: reduce) {
  .lk-source-disclosure__chevron {
    transition: none !important;
  }
}`;

/** Product-provided provenance and availability for evidence sources. */
export function SourceDisclosure({
  title = '출처',
  headingLevel = 2,
  titleVisuallyHidden = false,
  description,
  sources = [],
  emptyMessage = '표시할 출처가 없습니다.',
  onSourceActivate,
  variant = 'inline',
  defaultOpen = false,
  hiddenCount = 0,
  hiddenMessage,
  className,
  style,
  ...rest
}) {
  const titleId = React.useId();
  const Heading = `h${Math.min(6, Math.max(2, headingLevel))}`;
  const { visible, withheld } = partitionSources(sources);
  const withheldTotal = withheld + Math.max(0, hiddenCount);
  const withheldLine = withheldTotal > 0
    ? (hiddenMessage ?? `권한이 없어 출처 ${withheldTotal}개는 표시하지 않았습니다.`)
    : null;
  const mutedLineStyle = { margin: 0, color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' };

  // Collapsed provenance: a plain "출처 N개" icon+label toggle that opens the
  // source list in an anchored Popover rather than pushing the message body
  // down. This is the resting shape the surveyed assistants converged on — a
  // recessive one-line trigger beside the action bar, with the panel floating
  // so the surrounding layout never shifts. The toggle label is the
  // disclosure's accessible name, so no repeated landmark heading is
  // projected. The count reports visible sources only; folding withheld ones
  // into it would leak the existence the omission is protecting.
  if (variant === 'inline') {
    if (visible.length === 0) {
      return (
        <div {...rest} className={['lk-source-disclosure', 'lk-source-disclosure--inline', className].filter(Boolean).join(' ')} style={{ minWidth: 0, fontFamily: 'var(--font-sans)', ...style }}>
          <p style={mutedLineStyle}>{withheldLine ?? emptyMessage}</p>
        </div>
      );
    }
    return (
      <>
        <style>{PANEL_CSS}</style>
        <Popover
          {...rest}
          className={['lk-source-disclosure', 'lk-source-disclosure--inline', className].filter(Boolean).join(' ')}
          align="left"
          width="max-content"
          defaultOpen={defaultOpen}
          ariaLabel={typeof title === 'string' ? title : '출처'}
          style={style}
          trigger={(
            <button
              type="button"
              className="lk-source-disclosure__toggle"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                height: 'var(--space-8)',
                minWidth: 0,
                maxWidth: '100%',
                padding: '0 var(--space-2)',
                boxSizing: 'border-box',
                border: 0,
                borderRadius: 'var(--radius-sm)',
                background: 'transparent',
                color: 'var(--color-semantic-label-neutral)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--caption1-size)',
                lineHeight: 'var(--caption1-line)',
                fontWeight: 'var(--fw-medium)',
                cursor: 'pointer',
                transition: 'background var(--dur-fast) var(--ease-out)',
              }}
            >
              <Icon name="book" size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
              {/* Label and count share one span so a real space separates them
                  in the accessible name — a flex gap is drawn, not spoken, and
                  the toggle would otherwise be announced as "출처3개". */}
              <span style={{ whiteSpace: 'nowrap' }}>
                {title}{' '}
                <span style={{ color: 'var(--color-semantic-label-alternative)', fontVariantNumeric: 'tabular-nums' }}>
                  {visible.length}개
                </span>
              </span>
            </button>
          )}
        >
          <ul
            className="lk-source-disclosure__rows"
            style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, maxWidth: 360 }}
          >
            {visible.map((source) => renderSourceRow(source, onSourceActivate))}
          </ul>
          {withheldLine != null && (
            <p className="lk-source-disclosure__withheld" style={{ margin: 'var(--space-2) 0 0', padding: '0 var(--space-2)', maxWidth: 360, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
              {withheldLine}
            </p>
          )}
        </Popover>
      </>
    );
  }

  // A standalone provenance list is a named region landmark; an inline chip
  // strip is not — otherwise every cited answer projects a repeated "출처"
  // landmark into the conversation. The visually-hidden heading still provides
  // the group name and heading-navigation structure either way.
  const Root = variant === 'list' ? 'section' : 'div';

  return (
    <Root
      {...rest}
      aria-labelledby={titleId}
      className={['lk-source-disclosure', `lk-source-disclosure--${variant}`, className].filter(Boolean).join(' ')}
      style={{
        display: 'grid',
        gap: variant === 'chips' ? 'var(--space-2)' : 'var(--space-3)',
        minWidth: 0,
        containerType: 'inline-size',
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      <style>{PANEL_CSS}</style>

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
              : variant === 'chips'
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

      {visible.length === 0 ? (
        <p style={mutedLineStyle}>{withheldLine ?? emptyMessage}</p>
      ) : variant === 'chips' ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', minWidth: 0 }}>
          {visible.map((source) => renderSourceChip(source, onSourceActivate))}
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
          {visible.map((source, index) => (
            <SourceRow key={source.id} source={source} first={index === 0} onSourceActivate={onSourceActivate} />
          ))}
        </ul>
      )}

      {visible.length > 0 && withheldLine != null && (
        <p className="lk-source-disclosure__withheld" style={{ margin: 0, color: 'var(--color-semantic-label-alternative)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>
          {withheldLine}
        </p>
      )}
    </Root>
  );
}
