import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { VisuallyHidden } from '../layout/VisuallyHidden.jsx';
import { StatusBadge } from './StatusBadge.jsx';

/**
 * LDS Product Content — LogViewer
 * Monospace log / console stream. Lines are {time, level, source, text};
 * `level` (debug/info/warn/error) drives the accent. Includes level filters,
 * search, tail pause/resume, latest jump, visible clear, and per-line copy.
 *
 * Accessibility — terminal convention: quiet while parked, announcing only
 * while following. The scroll viewport is a named `role="log"` region with
 * `tabIndex=0` so the stream is readable with the keyboard (WCAG 2.1.1), but it
 * is NOT itself a live region: virtualization inserts and removes rows on every
 * scroll, which would announce the whole viewport line by line. A separate
 * always-mounted polite status region announces only newly arrived lines while
 * the viewer is following the tail (and copy confirmations).
 */
const LEVELS = {
  debug: { c: 'var(--color-semantic-label-assistive)', log: 'var(--color-semantic-inverse-label-neutral-soft)', label: 'DEBUG' },
  info: { c: 'var(--color-semantic-primary-normal)', log: 'var(--color-semantic-accent-background-light-blue)', label: 'INFO' },
  warn: { c: 'var(--color-semantic-status-cautionary)', log: 'var(--color-semantic-status-cautionary)', label: 'WARN' },
  error: { c: 'var(--color-semantic-status-negative)', log: 'var(--color-semantic-status-negative)', label: 'ERROR' },
};
const ORDER = ['debug', 'info', 'warn', 'error'];

const STREAM_STATUS = {
  connecting: { tone: 'cautionary', pulse: true, label: '연결 중' },
  online: { tone: 'online', pulse: false, label: '온라인' },
  reconnecting: { tone: 'cautionary', pulse: true, label: '재연결 중' },
  weak: { tone: 'cautionary', pulse: false, label: '신호 약함' },
  stale: { tone: 'cautionary', pulse: true, label: '데이터 지연' },
  error: { tone: 'negative', pulse: false, label: '연결 오류' },
  offline: { tone: 'offline', pulse: false, label: '오프라인' },
};

const DENSITY = {
  compact: { fontSize: 'var(--caption2-size)', lineHeight: 'var(--caption2-line)', rowMinHeight: 18, panelPadding: '8px 10px', time: '60px', level: '48px', source: 'minmax(44px, 80px)', copy: '24px' },
  comfortable: { fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', rowMinHeight: 20, panelPadding: '10px 12px', time: '64px', level: '52px', source: 'minmax(54px, 96px)', copy: '28px' },
};

function nodeText(value) {
  if (value == null || typeof value === 'boolean') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map(nodeText).filter(Boolean).join(' ');
  if (React.isValidElement(value)) return nodeText(value.props.children);
  return '';
}

function formatLine(line) {
  const cfg = LEVELS[line.level] || LEVELS.info;
  return [line.time, cfg.label, line.source, line.text].map(nodeText).filter(Boolean).join(' ');
}

function IconButton({ label, icon, active = false, disabled = false, rail = false, children, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      disabled={disabled}
      onClick={onClick}
      style={{
        position: 'relative',
        width: 28,
        height: 28,
        border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-sm)',
        background: active ? 'var(--color-semantic-inverse-background)' : 'var(--color-semantic-background-elevated-normal)',
        color: active ? 'var(--color-semantic-inverse-label)' : 'var(--color-semantic-label-neutral)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.45 : 1,
        fontFamily: 'inherit',
        padding: 0,
      }}
    >
      <Icon name={icon} size={15} aria-hidden="true" />
      {rail && <span aria-hidden="true" style={{ position: 'absolute', left: 8, right: 8, bottom: 6, height: 1.5, borderRadius: 'var(--radius-pill)', background: 'currentColor' }} />}
      {children}
    </button>
  );
}

export function LogViewer({
  lines = [],
  filter = true,
  search = true,
  tools = true,
  copyable = true,
  autoScroll = true,
  height = 260,
  density = 'comfortable',
  wrap = false,
  virtualized = true,
  overscan = 8,
  initialQuery = '',
  streamStatus,
  lastUpdatedAt,
  droppedCount = 0,
  announceNewLines = true,
  'aria-label': ariaLabel = '로그 스트림',
  onExport,
  onClear,
  onCopyLine,
  style,
  ...rest
}) {
  const [active, setActive] = React.useState(() => new Set(ORDER));
  const [query, setQuery] = React.useState(initialQuery);
  const [paused, setPaused] = React.useState(false);
  const [pausedLines, setPausedLines] = React.useState([]);
  const [clearedUntil, setClearedUntil] = React.useState(0);
  const [copiedIndex, setCopiedIndex] = React.useState(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(height);
  const [tailLocked, setTailLocked] = React.useState(true);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [announcement, setAnnouncement] = React.useState('');
  const boxRef = React.useRef(null);
  const rowFocusRef = React.useRef(null);
  const previousLineCountRef = React.useRef(lines.length);
  const metrics = DENSITY[density] || DENSITY.comfortable;
  const normalizedQuery = query.trim().toLowerCase();

  const matchesFilters = React.useCallback((line) => {
    const level = line.level || 'info';
    if (!active.has(level)) return false;
    if (!normalizedQuery) return true;
    return formatLine(line).toLowerCase().includes(normalizedQuery);
  }, [active, normalizedQuery]);

  const currentLines = React.useMemo(() => lines.slice(clearedUntil), [lines, clearedUntil]);
  const sourceLines = paused ? pausedLines : currentLines;
  const shown = React.useMemo(() => sourceLines.filter(matchesFilters), [matchesFilters, sourceLines]);

  const pausedCount = paused ? Math.max(0, currentLines.length - pausedLines.length) : 0;
  const latestCount = paused ? pausedCount : unreadCount;
  const copyColumn = copyable ? ` ${metrics.copy}` : '';
  const gridTemplateColumns = `${metrics.time} ${metrics.level} ${metrics.source} minmax(0, 1fr)${copyColumn}`;
  const rowHeight = metrics.rowMinHeight;
  const safeOverscan = Math.max(0, overscan);
  const virtualActive = virtualized && !wrap && shown.length * rowHeight > (viewportHeight + safeOverscan * rowHeight * 2);
  const virtualStart = virtualActive ? Math.max(0, Math.floor(scrollTop / rowHeight) - safeOverscan) : 0;
  const virtualEnd = virtualActive ? Math.min(shown.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + safeOverscan) : shown.length;
  const visibleLines = virtualActive ? shown.slice(virtualStart, virtualEnd) : shown;
  const topSpacer = virtualStart * rowHeight;
  const bottomSpacer = (shown.length - virtualEnd) * rowHeight;

  const updateScrollState = React.useCallback(() => {
    const box = boxRef.current;
    if (!box) return;
    const nextTop = box.scrollTop;
    const nextHeight = box.clientHeight || height;
    const atTail = box.scrollHeight - nextTop - nextHeight <= Math.max(rowHeight * 2, 32);
    setScrollTop(nextTop);
    setViewportHeight(nextHeight);
    setTailLocked(atTail);
    if (atTail) setUnreadCount(0);
  }, [height, rowHeight]);

  const scrollToLatest = React.useCallback(() => {
    const box = boxRef.current;
    if (box) {
      box.scrollTop = box.scrollHeight;
      setScrollTop(box.scrollTop);
      setViewportHeight(box.clientHeight || height);
    }
    setTailLocked(true);
    setUnreadCount(0);
  }, [height]);

  React.useEffect(() => {
    if (clearedUntil > lines.length) setClearedUntil(0);
  }, [clearedUntil, lines.length]);

  // Terminal convention — the viewer is "following" only while it is not paused
  // and still parked at the tail. Parked-away or paused viewers stay silent and
  // surface the backlog through the visible +N badge instead.
  const following = !paused && tailLocked;
  React.useEffect(() => {
    const previous = previousLineCountRef.current;
    const added = Math.max(0, lines.length - previous);
    previousLineCountRef.current = lines.length;
    if (lines.length < previous) setUnreadCount(0);
    if (added === 0) return;
    if (!following) {
      setUnreadCount((count) => Math.min(999, count + added));
      return;
    }
    if (!announceNewLines) return;
    const arrivals = lines.slice(lines.length - added).filter(matchesFilters);
    if (arrivals.length === 0) return;
    const latest = formatLine(arrivals[arrivals.length - 1]);
    setAnnouncement(arrivals.length === 1 ? latest : `새 로그 ${arrivals.length}줄, 마지막 ${latest}`);
  }, [lines, announceNewLines, following, matchesFilters]);

  React.useEffect(() => {
    if (!paused && autoScroll && tailLocked) {
      window.requestAnimationFrame(scrollToLatest);
    }
  }, [lines.length, shown.length, autoScroll, paused, tailLocked, scrollToLatest]);

  React.useLayoutEffect(() => {
    updateScrollState();
  }, [height, density, virtualActive, shown.length, updateScrollState]);

  // Virtualization removes the row a per-line control lives on once it leaves
  // the viewport. Without this, focus would fall back to <body>; move it to the
  // log region instead so keyboard reading continues where it left off.
  React.useLayoutEffect(() => {
    const focused = rowFocusRef.current;
    const box = boxRef.current;
    if (!focused || !box || typeof document === 'undefined') return;
    if (document.contains(focused)) return;
    rowFocusRef.current = null;
    if (document.activeElement == null || document.activeElement === document.body) {
      box.focus({ preventScroll: true });
    }
  });

  const toggle = (lvl) => setActive((s) => { const n = new Set(s); n.has(lvl) ? n.delete(lvl) : n.add(lvl); return n; });
  const jumpToLatest = () => {
    setPaused(false);
    setPausedLines([]);
    window.requestAnimationFrame(scrollToLatest);
  };
  const togglePause = () => {
    if (paused) {
      jumpToLatest();
    } else {
      setPausedLines(currentLines);
      setPaused(true);
    }
  };
  const clearVisible = () => {
    setClearedUntil(lines.length);
    setPaused(false);
    setPausedLines([]);
    setCopiedIndex(null);
    setTailLocked(true);
    setUnreadCount(0);
    previousLineCountRef.current = lines.length;
    onClear && onClear();
  };
  const copyLine = async (line, index) => {
    const text = formatLine(line);
    onCopyLine && onCopyLine(line, text);
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedIndex(index);
      // The copied state is an aria-hidden icon swap, so the confirmation is
      // published as text on the shared status region instead.
      setAnnouncement(`로그 라인 복사됨: ${text}`);
      window.setTimeout(() => setCopiedIndex((value) => (value === index ? null : value)), 1200);
    } catch {
      setCopiedIndex(null);
      setAnnouncement('로그 라인을 복사하지 못했습니다.');
    }
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-2)', width: '100%', maxWidth: '100%', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {(streamStatus != null || lastUpdatedAt != null || droppedCount > 0) && (
        <div role="status" aria-live="polite" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {streamStatus != null && (() => {
              const cfg = STREAM_STATUS[streamStatus] || STREAM_STATUS.online;
              return <StatusBadge tone={cfg.tone} pulse={cfg.pulse} data-status={streamStatus}>{cfg.label}</StatusBadge>;
            })()}
            {lastUpdatedAt != null && <span>마지막 수신 <strong>{lastUpdatedAt}</strong></span>}
          </div>
          {droppedCount > 0 && <span style={{ color: 'var(--color-semantic-status-cautionary)', fontWeight: 'var(--fw-semibold)' }}>누락 {droppedCount}줄</span>}
        </div>
      )}
      {(filter || search || tools) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {filter && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: '1 1 220px' }}>
              {ORDER.map((lvl) => {
                const on = active.has(lvl);
                return (
                  <button key={lvl} type="button" onClick={() => toggle(lvl)} aria-pressed={on}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 24, padding: '0 9px', borderRadius: 'var(--radius-pill)', border: `1px solid ${on ? LEVELS[lvl].c : 'var(--color-semantic-line-normal-normal)'}`, background: on ? 'var(--color-semantic-primary-surface-normal)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'var(--caption2-size)', fontWeight: 'var(--fw-bold)', letterSpacing: 0, color: on ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-assistive)' }}>
                    <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: LEVELS[lvl].c }} />
                    {LEVELS[lvl].label}
                  </button>
                );
              })}
            </div>
          )}
          {search && (
            <label style={{ flex: '1 1 180px', maxWidth: 260, minWidth: 160, height: 28, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0 9px', boxSizing: 'border-box', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-assistive)' }}>
              <Icon name="search" size={14} aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="로그 검색"
                placeholder="검색"
                /* 텍스트 높이(16px)가 아니라 필드 안쪽 높이를 그대로 채워
                   포인터 타깃이 24px 아래로 내려가지 않게 한다 (WCAG 2.5.8). */
                style={{ minWidth: 0, flex: 1, alignSelf: 'stretch', border: 'none', outline: 'none', background: 'transparent', color: 'var(--color-semantic-label-normal)', fontFamily: 'inherit', fontSize: 'var(--caption1-size)', fontWeight: 'var(--fw-semibold)' }}
              />
              {query && (
                <button type="button" aria-label="검색어 지우기" onClick={() => setQuery('')} style={{ width: 18, height: 18, border: 'none', background: 'transparent', color: 'var(--color-semantic-label-assistive)', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="close" size={12} aria-hidden="true" />
                </button>
              )}
            </label>
          )}
          {tools && (
            <div role="group" aria-label="로그 도구" style={{ display: 'inline-flex', gap: 6, flex: '0 0 auto' }}>
              <IconButton label={paused ? '로그 tail 재개' : '로그 tail 일시정지'} icon={paused ? 'play' : 'pause'} active={paused} onClick={togglePause} />
              <IconButton label={latestCount > 0 ? `최신 로그로 이동, 새 로그 ${latestCount > 99 ? '99+' : latestCount}줄` : '최신 로그로 이동'} icon="arrow-down" rail onClick={jumpToLatest}>
                {latestCount > 0 && <span aria-hidden="true" style={{ position: 'absolute', top: -5, right: -5, minWidth: 16, height: 16, padding: '0 4px', boxSizing: 'border-box', borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-status-negative)', color: 'var(--color-semantic-static-white)', fontSize: 'var(--caption2-size)', lineHeight: '16px', fontWeight: 'var(--fw-bold)' }}>{latestCount > 99 ? '99+' : `+${latestCount}`}</span>}
              </IconButton>
              <IconButton label="표시 로그 지우기" icon="trash" disabled={currentLines.length === 0} onClick={clearVisible} />
              {onExport && <IconButton label="로그 내보내기" icon="download" disabled={shown.length === 0} onClick={() => onExport(shown)} />}
            </div>
          )}
        </div>
      )}
      <VisuallyHidden role="status" aria-live="polite" aria-atomic="true">{announcement}</VisuallyHidden>
      <div ref={boxRef} role="log" aria-live="off" aria-label={ariaLabel} tabIndex={0} onScroll={updateScrollState} style={{ height, overflow: 'auto', scrollbarGutter: 'stable', padding: metrics.panelPadding, borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-inverse-background)', border: '1px solid var(--color-semantic-inverse-line-normal)', fontFamily: 'var(--font-mono)', fontSize: metrics.fontSize, lineHeight: metrics.lineHeight }}>
        {shown.length === 0 && (
          <div style={{ minHeight: '100%', display: 'grid', placeItems: 'center', color: 'var(--color-semantic-inverse-label-neutral-soft)', fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)' }}>
            {normalizedQuery ? '검색 결과 없음' : '로그 없음'}
          </div>
        )}
        {virtualActive && topSpacer > 0 && <div aria-hidden="true" style={{ height: topSpacer }} />}
        {visibleLines.map((line, visibleIndex) => {
          const index = virtualStart + visibleIndex;
          const cfg = LEVELS[line.level] || LEVELS.info;
          const copied = copiedIndex === index;
          return (
            <div key={index} style={{ display: 'grid', gridTemplateColumns, columnGap: 10, alignItems: 'baseline', minHeight: metrics.rowMinHeight, height: virtualActive ? rowHeight : undefined, overflow: virtualActive ? 'hidden' : undefined, whiteSpace: virtualActive || !wrap ? 'nowrap' : 'pre-wrap', wordBreak: virtualActive || !wrap ? 'normal' : 'break-word' }}>
              <span style={{ color: 'var(--color-semantic-inverse-label-neutral-soft)', fontVariantNumeric: 'tabular-nums' }}>{line.time}</span>
              <span style={{ color: cfg.log, fontWeight: 'var(--fw-bold)' }}>{cfg.label}</span>
              <span style={{ color: 'var(--color-semantic-inverse-label-neutral-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{line.source}</span>
              <span style={{ color: 'var(--color-semantic-inverse-label)', minWidth: 0, overflow: virtualActive || !wrap ? 'hidden' : 'visible', textOverflow: virtualActive || !wrap ? 'ellipsis' : 'clip' }}>{line.text}</span>
              {copyable && (
                <button
                  type="button"
                  aria-label="로그 라인 복사"
                  title="로그 라인 복사"
                  onFocus={(event) => { rowFocusRef.current = event.target; }}
                  onBlur={(event) => {
                    // A row unmounted by virtualization can emit focusout while
                    // already detached — keep the reference so the layout effect
                    // can recover focus instead of losing it to <body>.
                    const node = event.target;
                    if (rowFocusRef.current === node && node.isConnected) rowFocusRef.current = null;
                  }}
                  onClick={() => copyLine(line, index)}
                  style={{ width: 24, height: 24, border: 'none', borderRadius: 'var(--radius-sm)', background: copied ? 'var(--color-semantic-inverse-fill-strong)' : 'transparent', color: copied ? 'var(--color-semantic-status-positive)' : 'var(--color-semantic-inverse-label-neutral-soft)', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                >
                  <Icon name={copied ? 'circle-check' : 'copy'} size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          );
        })}
        {virtualActive && bottomSpacer > 0 && <div aria-hidden="true" style={{ height: bottomSpacer }} />}
      </div>
    </div>
  );
}
