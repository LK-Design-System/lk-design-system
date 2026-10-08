import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { TextButton } from '../buttons/TextButton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { DropdownMenu } from '../overlay/DropdownMenu.jsx';
import { Skeleton } from '../status/Skeleton.jsx';
import { ResourceState } from '../data/ResourceState.jsx';
import { ShellPanelContext } from '../layout/shell-panel-context.js';

/* The row action is a sibling of the link, never nested inside it. It stays in
   the DOM; on hover-capable pointers it is visible only while the row is
   hovered, focused within, current or its menu is open. Touch shows it always. */
const CONVERSATION_LIST_STYLES = `
  .lk-conversation-list__row{position:relative;display:flex;align-items:center;gap:var(--space-1);min-height:var(--component-conversation-list-row-height);padding-inline-end:var(--space-1);border-radius:var(--radius-lg);background:transparent;transition:background var(--dur-fast) var(--ease-out)}
  .lk-conversation-list__row:hover{background:var(--component-conversation-list-hover-surface)}
  .lk-conversation-list__row[data-current="true"]{background:var(--component-conversation-list-active-surface)}
  .lk-conversation-list__row[data-current="true"]:hover{background:var(--component-conversation-list-active-hover-surface)}
  .lk-conversation-list__row:has(.lk-conversation-list__link:active){background:var(--component-conversation-list-pressed-surface)}
  .lk-conversation-list__link{flex:1 1 auto;min-width:0;align-self:stretch;display:flex;align-items:center;padding:0 var(--space-3);border-radius:var(--radius-lg);color:var(--component-conversation-list-muted-foreground);font-family:var(--font-sans);font-size:var(--label1-size);line-height:var(--label1-line);font-weight:var(--fw-medium);text-decoration:none;transition:color var(--dur-fast) var(--ease-out)}
  .lk-conversation-list__row:hover .lk-conversation-list__link{color:var(--component-conversation-list-hover-foreground)}
  .lk-conversation-list__row[data-current="true"] .lk-conversation-list__link{color:var(--component-conversation-list-foreground);font-weight:var(--fw-bold)}
  .lk-conversation-list__link:focus-visible{outline-color:var(--component-conversation-list-focus-indicator)!important;outline-offset:-2px!important}
  .lk-conversation-list__title{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .lk-conversation-list__action{flex-shrink:0;opacity:0;transition:opacity var(--dur-fast) var(--ease-out)}
  .lk-conversation-list__row:hover .lk-conversation-list__action,
  .lk-conversation-list__row:focus-within .lk-conversation-list__action,
  .lk-conversation-list__row[data-current="true"] .lk-conversation-list__action,
  .lk-conversation-list__action:has([aria-expanded="true"]){opacity:1}
  @media(hover:none){.lk-conversation-list__action{opacity:1}}
  @media(forced-colors:active){.lk-conversation-list__row[data-current="true"] .lk-conversation-list__link{background:Highlight;color:HighlightText;background:SelectedItem;color:SelectedItemText}}
  @media(prefers-reduced-motion:reduce){.lk-conversation-list__row,.lk-conversation-list__link,.lk-conversation-list__action{transition:none!important}}
`;

const DEFAULT_ACTIONS = [];

/**
 * LK Product — ConversationList
 *
 * A navigation list of conversations grouped by product-computed date labels:
 * `nav > section[aria-labelledby] > h3 + ul > li > a + button`. Each row is a
 * real link (current one gets `aria-current="page"`, an achromatic fill and
 * bold weight) with a sibling "more" menu button, so no interactive control is
 * nested inside another. Loading, empty, error and "load more" states are part
 * of the contract; data, routes, rename and delete execution stay in the product.
 */
export function ConversationList({
  groups = [],
  currentId,
  renderLink,
  itemActions = DEFAULT_ACTIONS,
  onItemAction,
  moreLabel = (item) => `${item.title} 더 보기`,
  headingLevel = 3,
  loading = false,
  error,
  onRetry,
  retryLabel = '다시 시도',
  emptyLabel = '아직 대화가 없습니다.',
  hasMore = false,
  onLoadMore,
  loadingMore = false,
  loadMoreLabel = '더 불러오기',
  className,
  style,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}) {
  const panel = React.useContext(ShellPanelContext);
  const generatedId = React.useId().replace(/:/g, '');
  const labelledBy = ariaLabel ? undefined : ariaLabelledBy ?? panel?.titleId;
  const HeadingTag = `h${Math.min(6, Math.max(1, Number(headingLevel) || 3))}`;
  const itemCount = groups.reduce((total, group) => total + (group.items?.length || 0), 0);

  let body;
  if (loading && itemCount === 0) {
    body = (
      <div data-slot="loading" aria-busy="true" style={{ display: 'grid', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)' }}>
        {[0, 1, 2, 3].map((index) => <Skeleton key={index} variant="text" length={index % 2 ? '75%' : '100%'} />)}
      </div>
    );
  } else if (error != null && itemCount === 0) {
    body = (
      <ResourceState
        data-slot="error"
        state="error"
        messageVariant="embedded"
        headingLevel={Math.min(6, Number(headingLevel) || 3)}
        description={error === true ? undefined : error}
        action={onRetry ? <TextButton size="sm" onClick={onRetry}>{retryLabel}</TextButton> : undefined}
      />
    );
  } else if (itemCount === 0) {
    body = <p data-slot="empty" style={{ margin: 0, padding: 'var(--space-2) var(--space-3)', color: 'var(--component-conversation-list-muted-foreground)', fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)' }}>{emptyLabel}</p>;
  } else {
    body = groups.filter((group) => group.items?.length).map((group) => {
      const headingId = `lk-conversation-group-${generatedId}-${group.id}`;
      return (
        <section key={group.id} data-slot="group" aria-labelledby={headingId} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--space-0-5)', minWidth: 0 }}>
          <HeadingTag id={headingId} data-slot="groupHeading" style={{ margin: 0, padding: 'var(--space-3) var(--space-3) var(--space-1)', fontSize: 'var(--label2-size)', lineHeight: 'var(--label2-line)', fontWeight: 'var(--fw-medium)', letterSpacing: 0, color: 'var(--component-conversation-list-group-foreground)' }}>
            {group.label}
          </HeadingTag>
          <ul role="list" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--space-0-5)', margin: 0, padding: 0, listStyle: 'none', minWidth: 0 }}>
            {group.items.map((item) => {
              const current = item.current ?? (currentId != null && item.id === currentId);
              const linkProps = {
                className: 'lk-conversation-list__link',
                'data-slot': 'link',
                href: item.href,
                'aria-current': current ? 'page' : undefined,
                onClick: item.onClick,
                children: <span className="lk-conversation-list__title">{item.title}</span>,
              };
              const actions = typeof itemActions === 'function' ? itemActions(item) : itemActions;
              return (
                <li key={item.id} className="lk-conversation-list__row" data-slot="row" data-current={current ? 'true' : undefined}>
                  {renderLink ? renderLink(item, linkProps) : <a {...linkProps} />}
                  {actions?.length > 0 && (
                    <span className="lk-conversation-list__action" data-slot="rowAction">
                      <DropdownMenu
                        align="right"
                        trigger={(
                          <IconButton variant="plain" size="xs" round={false} label={moreLabel(item)}>
                            <Icon name="more-horizontal" size={16} aria-hidden="true" />
                          </IconButton>
                        )}
                        items={actions.map((action) => (action.divider
                          ? { divider: true }
                          : {
                              label: action.label,
                              icon: action.icon,
                              danger: action.danger,
                              disabled: action.disabled,
                              onClick: () => onItemAction?.(action.id, item),
                            }))}
                      />
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      );
    });
  }

  return (
    <nav
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-busy={loading || loadingMore ? true : undefined}
      className={['lk-conversation-list', className].filter(Boolean).join(' ')}
      style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--space-1)', minWidth: 0, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      <style>{CONVERSATION_LIST_STYLES}</style>
      {body}
      {hasMore && itemCount > 0 && (
        <div data-slot="loadMore" style={{ padding: 'var(--space-2) var(--space-3)' }}>
          <TextButton size="sm" onClick={onLoadMore} disabled={loadingMore} aria-busy={loadingMore || undefined}>{loadMoreLabel}</TextButton>
        </div>
      )}
    </nav>
  );
}
