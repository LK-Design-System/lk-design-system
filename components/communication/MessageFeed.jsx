import React from 'react';
import { Button } from '../buttons/Button.jsx';
import { IconButton } from '../buttons/IconButton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { VisuallyHidden } from '../layout/VisuallyHidden.jsx';

const useIsomorphicLayoutEffect = typeof window === 'undefined'
  ? React.useEffect
  : React.useLayoutEffect;
const BOTTOM_THRESHOLD = 8;

function isAtBottom(viewport) {
  return viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= BOTTOM_THRESHOLD;
}

function requestFrame(callback) {
  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
    callback();
    return null;
  }
  return window.requestAnimationFrame(callback);
}

function cancelFrame(frame) {
  if (
    frame != null
    && typeof window !== 'undefined'
    && typeof window.cancelAnimationFrame === 'function'
  ) {
    window.cancelAnimationFrame(frame);
  }
}

/**
 * LK Product Extension for general conversations. MessageFeed owns the
 * accessible log and reading-position behavior without introducing an outer
 * product surface. Rendering, transport, persistence, and streaming content
 * are supplied through `children`.
 */
export function MessageFeed({
  ariaLabel = '메시지 내역',
  children,
  empty,
  maxHeight = 400,
  viewportMinHeight,
  busy = false,
  hasPrevious = false,
  loadingPrevious = false,
  onLoadPrevious,
  loadPreviousLabel = '이전 메시지 불러오기',
  following,
  onFollowingChange,
  unreadCount = 0,
  jumpToLatestLabel = '최신 메시지로 이동',
  onJumpToLatest,
  liveStatus,
  style,
  ...rest
}) {
  const generatedId = React.useId();
  const viewportId = `lk-message-feed-${String(generatedId).replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const viewportRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const historyAnchorRef = React.useRef(null);
  const historySettlingRef = React.useRef(false);
  const programmaticScrollRef = React.useRef(false);
  const programmaticFrameRef = React.useRef(null);
  const settlingFrameRef = React.useRef(null);
  const requestFallbackFrameRef = React.useRef(null);
  const followingRef = React.useRef(following);
  const loadingPreviousRef = React.useRef(loadingPrevious);
  const lastRequestedFollowingRef = React.useRef(following);
  const [retainJumpFocus, setRetainJumpFocus] = React.useState(false);
  const [historyLiveSuppressed, setHistoryLiveSuppressed] = React.useState(false);

  if (followingRef.current !== following) {
    followingRef.current = following;
    lastRequestedFollowingRef.current = following;
  }
  loadingPreviousRef.current = loadingPrevious;

  const releaseProgrammaticScroll = React.useCallback(() => {
    cancelFrame(programmaticFrameRef.current);
    programmaticFrameRef.current = requestFrame(() => {
      programmaticFrameRef.current = requestFrame(() => {
        programmaticScrollRef.current = false;
        programmaticFrameRef.current = null;
      });
    });
  }, []);

  const markHistorySettled = React.useCallback(() => {
    historySettlingRef.current = true;
    cancelFrame(settlingFrameRef.current);
    settlingFrameRef.current = requestFrame(() => {
      settlingFrameRef.current = requestFrame(() => {
        historySettlingRef.current = false;
        settlingFrameRef.current = null;
        // Older history is prepended into the same DOM log, but it is not a new
        // live update. Re-enable announcements only after the prepend and scroll
        // restoration have both settled so assistive technology does not read a
        // batch of old messages as newly arrived content.
        setHistoryLiveSuppressed(false);
      });
    });
  }, []);

  const finishHistoryRequest = React.useCallback((anchor) => {
    const viewport = viewportRef.current;
    if (!viewport || historyAnchorRef.current !== anchor) return;
    const heightDelta = viewport.scrollHeight - anchor.scrollHeight;
    programmaticScrollRef.current = true;
    viewport.scrollTop = Math.max(0, anchor.scrollTop + heightDelta);
    historyAnchorRef.current = null;
    releaseProgrammaticScroll();
    markHistorySettled();
  }, [markHistorySettled, releaseProgrammaticScroll]);

  const scheduleNoSignalHistoryFallback = React.useCallback((anchor) => {
    cancelFrame(requestFallbackFrameRef.current);
    requestFallbackFrameRef.current = requestFrame(() => {
      requestFallbackFrameRef.current = requestFrame(() => {
        requestFallbackFrameRef.current = null;
        if (
          historyAnchorRef.current === anchor
          && !anchor.sawLoading
          && !loadingPreviousRef.current
        ) {
          finishHistoryRequest(anchor);
        }
      });
    });
  }, [finishHistoryRequest]);

  const scrollToBottom = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    programmaticScrollRef.current = true;
    viewport.scrollTop = viewport.scrollHeight;
    releaseProgrammaticScroll();
  }, [releaseProgrammaticScroll]);

  React.useEffect(() => () => {
    cancelFrame(programmaticFrameRef.current);
    cancelFrame(settlingFrameRef.current);
    cancelFrame(requestFallbackFrameRef.current);
  }, []);

  React.useEffect(() => {
    if (!hasPrevious && historyAnchorRef.current) {
      finishHistoryRequest(historyAnchorRef.current);
    }
  }, [finishHistoryRequest, hasPrevious]);

  useIsomorphicLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const anchor = historyAnchorRef.current;
    if (anchor) {
      if (loadingPrevious) anchor.sawLoading = true;
      const heightDelta = viewport.scrollHeight - anchor.scrollHeight;
      const childrenChanged = anchor.children !== children;
      const loadingFinished = anchor.sawLoading && !loadingPrevious;

      if (heightDelta !== 0 || loadingFinished || (childrenChanged && !loadingPrevious)) {
        finishHistoryRequest(anchor);
      }
      return;
    }

    if (following) scrollToBottom();
  }, [children, finishHistoryRequest, following, loadingPrevious, maxHeight, scrollToBottom, viewportMinHeight]);

  React.useEffect(() => {
    const content = contentRef.current;
    const Observer = typeof globalThis === 'undefined' ? undefined : globalThis.ResizeObserver;
    if (!content || typeof Observer !== 'function') return undefined;

    const observer = new Observer(() => {
      if (historyAnchorRef.current || historySettlingRef.current) return;
      if (followingRef.current) scrollToBottom();
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [scrollToBottom]);

  const handleScroll = (event) => {
    if (programmaticScrollRef.current) return;
    const nextFollowing = isAtBottom(event.currentTarget);
    if (nextFollowing === followingRef.current) {
      lastRequestedFollowingRef.current = nextFollowing;
      return;
    }
    if (nextFollowing === lastRequestedFollowingRef.current) return;
    lastRequestedFollowingRef.current = nextFollowing;
    onFollowingChange?.(nextFollowing, 'user-scroll');
  };

  const handleViewportKeyDown = (event) => {
    if (
      event.target !== event.currentTarget
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
    ) return;

    const viewport = event.currentTarget;
    const page = Math.max(1, viewport.clientHeight - 32);
    let nextScrollTop;

    switch (event.key) {
      case 'Home':
        nextScrollTop = 0;
        break;
      case 'End':
        nextScrollTop = viewport.scrollHeight;
        break;
      case 'PageUp':
        nextScrollTop = Math.max(0, viewport.scrollTop - page);
        break;
      case 'PageDown':
        nextScrollTop = Math.min(viewport.scrollHeight, viewport.scrollTop + page);
        break;
      default:
        return;
    }

    event.preventDefault();
    viewport.scrollTop = nextScrollTop;
  };

  const handleLoadPrevious = () => {
    const viewport = viewportRef.current;
    if (!viewport || !onLoadPrevious || loadingPrevious) return;
    setHistoryLiveSuppressed(true);
    const anchor = {
      scrollHeight: viewport.scrollHeight,
      scrollTop: viewport.scrollTop,
      children,
      sawLoading: false,
    };
    historyAnchorRef.current = anchor;
    let request;
    try {
      request = onLoadPrevious();
    } catch (error) {
      finishHistoryRequest(anchor);
      throw error;
    }
    if (request && typeof request.then === 'function') {
      const settleReturnedRequest = () => {
        if (historyAnchorRef.current === anchor && !loadingPreviousRef.current) {
          finishHistoryRequest(anchor);
        }
      };
      Promise.resolve(request).then(settleReturnedRequest, settleReturnedRequest);
    } else {
      scheduleNoSignalHistoryFallback(anchor);
    }
  };

  const handleJumpToLatest = (event) => {
    const button = event.currentTarget;
    setRetainJumpFocus(true);
    scrollToBottom();
    button.focus({ preventScroll: true });
    onFollowingChange?.(true, 'jump-to-latest');
    onJumpToLatest?.();
  };

  const messageCount = React.Children.toArray(children).length;
  const emptyContent = empty === undefined ? '메시지가 없습니다.' : empty;
  const normalizedUnreadCount = Math.max(0, Math.floor(Number(unreadCount) || 0));
  const showJump = !following || normalizedUnreadCount > 0 || retainJumpFocus;
  const jumpAccessibleLabel = normalizedUnreadCount > 0
    ? `${jumpToLatestLabel}, 읽지 않은 메시지 ${normalizedUnreadCount}개`
    : jumpToLatestLabel;
  const isBusy = busy || loadingPrevious;

  return (
    <section
      {...rest}
      data-message-feed
      data-following={following ? 'true' : 'false'}
      style={{
        display: 'grid',
        gap: 'var(--space-2)',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        ...style,
      }}
    >
      {hasPrevious && (
        <div
          data-message-feed-history-control
          style={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}
        >
          <Button
            type="button"
            size="sm"
            variant="ghost"
            aria-controls={viewportId}
            disabled={!onLoadPrevious}
            loading={loadingPrevious}
            loadingLabel={`${loadPreviousLabel} 중`}
            onClick={handleLoadPrevious}
          >
            {loadPreviousLabel}
          </Button>
        </div>
      )}

      <div
        id={viewportId}
        ref={viewportRef}
        data-message-feed-viewport
        data-history-live-suppressed={historyLiveSuppressed ? 'true' : undefined}
        role="log"
        aria-label={ariaLabel}
        aria-live={historyLiveSuppressed ? 'off' : 'polite'}
        aria-relevant="additions"
        aria-atomic="false"
        aria-busy={isBusy ? 'true' : undefined}
        aria-keyshortcuts="Home End PageUp PageDown"
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleViewportKeyDown}
        style={{
          boxSizing: 'border-box',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          maxHeight,
          minHeight: viewportMinHeight,
          overflowX: 'hidden',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          scrollbarGutter: 'stable',
          padding: 'var(--space-3) var(--space-2)',
          border: 0,
          borderRadius: 0,
          background: 'transparent',
          boxShadow: 'none',
          color: 'var(--color-semantic-label-normal)',
          outlineOffset: 'var(--space-1)',
        }}
      >
        <div
          ref={contentRef}
          data-message-feed-content
          style={{
            display: 'grid',
            gap: 'var(--space-6)',
            width: 'min(48rem, 100%)',
            minWidth: 0,
            marginInline: 'auto',
          }}
        >
          {messageCount > 0 ? children : (
            <div
              data-message-feed-empty
              style={{
                display: 'grid',
                minHeight: 'var(--space-20)',
                placeItems: 'center',
                minWidth: 0,
                padding: 'var(--space-4)',
                color: 'var(--color-semantic-label-alternative)',
                fontSize: 'var(--body2-size)',
                lineHeight: 'var(--body2-line)',
                textAlign: 'center',
                overflowWrap: 'anywhere',
              }}
            >
              {emptyContent}
            </div>
          )}
        </div>
      </div>

      {showJump && (
        <div
          data-message-feed-jump-control
          style={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}
        >
          {/* Scroll-to-latest reads as the conventional circular down control;
              the unread count rides as a decorative corner badge because the
              accessible name already carries it. */}
          <span style={{ position: 'relative', display: 'inline-flex' }}>
            <IconButton
              type="button"
              size="medium"
              variant="soft"
              aria-controls={viewportId}
              label={jumpAccessibleLabel}
              data-message-feed-jump
              onClick={handleJumpToLatest}
              onBlur={() => setRetainJumpFocus(false)}
            >
              <Icon name="arrow-down" size={18} aria-hidden="true" />
            </IconButton>
            {normalizedUnreadCount > 0 && (
              <span
                aria-hidden="true"
                data-message-feed-unread
                style={{
                  position: 'absolute',
                  top: 'calc(var(--space-1) * -1)',
                  right: 'calc(var(--space-1) * -1)',
                  minWidth: 'var(--space-4)',
                  height: 'var(--space-4)',
                  padding: '0 var(--space-1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  background: 'var(--color-semantic-primary-normal)',
                  color: 'var(--color-semantic-static-white)',
                  border: 'var(--border-thin) solid var(--color-semantic-background-normal-normal)',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: 'var(--caption2-size)',
                  lineHeight: 1,
                  fontWeight: 'var(--fw-bold)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {normalizedUnreadCount > 99 ? '99+' : normalizedUnreadCount}
              </span>
            )}
          </span>
        </div>
      )}

      {liveStatus != null && liveStatus !== '' && (
        <VisuallyHidden
          as="div"
          data-message-feed-live-status
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {liveStatus}
        </VisuallyHidden>
      )}
    </section>
  );
}
