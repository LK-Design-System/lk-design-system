import React from 'react';
import { StatusIndicator } from '@lk-robotics/lds-core/components/content/StatusIndicator';
import { Icon } from '@lk-robotics/lds-core/components/icon/Icon';
import { Spinner } from '@lk-robotics/lds-core/components/status/Spinner';
import { VisuallyHidden } from '@lk-robotics/lds-core/components/layout/VisuallyHidden';
import {
  resolveViewerState,
  VIEWER_BLOCKING_STATES as INTERNAL_VIEWER_BLOCKING_STATES,
  VIEWER_STATES as INTERNAL_VIEWER_STATES,
} from '../internal/viewer-state.js';

export const VIEWER_BLOCKING_STATES = INTERNAL_VIEWER_BLOCKING_STATES;
export const VIEWER_STATES = INTERNAL_VIEWER_STATES;

const STATE_PRESENTATION = {
  idle: {
    label: '소스 대기 중',
    description: '표시할 소스를 연결해 주세요.',
    icon: 'video',
    tone: 'neutral',
    blocking: true,
  },
  'no-source': {
    label: '소스 없음',
    description: '표시할 소스를 선택해 주세요.',
    icon: 'video',
    tone: 'neutral',
    blocking: true,
  },
  loading: {
    label: '불러오는 중',
    description: '콘텐츠를 준비하고 있습니다.',
    busy: true,
    tone: 'primary',
    blocking: true,
  },
  connecting: {
    label: '연결 중',
    description: '소스와 연결하고 있습니다.',
    busy: true,
    tone: 'primary',
    blocking: true,
  },
  ready: {
    label: '준비됨',
    icon: 'circle-check-fill',
    tone: 'positive',
    blocking: false,
  },
  live: {
    label: '라이브',
    icon: 'circle-fill',
    tone: 'negative',
    blocking: false,
    corner: true,
  },
  degraded: {
    label: '품질 저하',
    description: '마지막 콘텐츠를 유지하며 수신 상태를 확인합니다.',
    icon: 'triangle-exclamation-fill',
    tone: 'cautionary',
    blocking: false,
    edge: true,
    contentOpacity: 0.9,
  },
  stale: {
    label: '데이터 지연',
    description: '마지막으로 수신한 콘텐츠를 표시합니다.',
    icon: 'clock',
    tone: 'cautionary',
    blocking: false,
    edge: true,
    contentOpacity: 0.76,
  },
  frozen: {
    label: '화면 멈춤',
    description: '마지막 프레임을 표시합니다.',
    icon: 'pause',
    tone: 'cautionary',
    blocking: false,
    edge: true,
    contentOpacity: 0.76,
  },
  paused: {
    label: '일시정지',
    description: '마지막 프레임을 표시합니다.',
    icon: 'pause',
    tone: 'neutral',
    blocking: false,
    edge: true,
    contentOpacity: 1,
  },
  unavailable: {
    label: '사용할 수 없음',
    description: '소스 상태와 접근 권한을 확인해 주세요.',
    icon: 'circle-block',
    tone: 'neutral',
    blocking: true,
  },
  disconnected: {
    label: '연결 끊김',
    description: '소스 연결을 확인해 주세요.',
    icon: 'circle-close',
    tone: 'negative',
    blocking: true,
  },
  'no-signal': {
    label: '신호 없음',
    description: '소스 연결과 전송 상태를 확인해 주세요.',
    icon: 'signal',
    tone: 'negative',
    blocking: true,
  },
  error: {
    label: '표시 오류',
    description: '콘텐츠를 불러오지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    icon: 'circle-close-fill',
    tone: 'negative',
    blocking: true,
  },
};

const ASSERTIVE_BLOCKING_STATES = new Set(['disconnected', 'no-signal', 'error']);

const TONE_COLOR = {
  primary: 'var(--color-semantic-primary-normal)',
  positive: 'var(--color-semantic-status-positive)',
  cautionary: 'var(--color-semantic-status-cautionary)',
  negative: 'var(--color-semantic-status-negative)',
  neutral: 'var(--viewer-muted)',
};

function StateMark({ presentation, icon, size = 22 }) {
  if (presentation.busy && icon == null) {
    return (
      <span data-viewer-state-icon="spinner" aria-hidden="true" style={{ display: 'inline-flex' }}>
        <Spinner
          size={size}
          thickness={2}
          color="var(--color-semantic-primary-normal)"
          role="presentation"
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <span
      data-viewer-state-icon={icon == null ? presentation.icon : 'custom'}
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        width: size,
        height: size,
        overflow: 'hidden',
        color: TONE_COLOR[presentation.tone] ?? TONE_COLOR.neutral,
      }}
    >
      {icon ?? <Icon name={presentation.icon ?? 'circle-info'} size={size} />}
    </span>
  );
}

/**
 * LDS Product — ViewerFrame
 * Shared viewport chrome for map, 3D, and video renderers. The frame owns the
 * named region, source/HUD/tool slots, and normalized state presentation while
 * the application continues to own rendering, transport, and recovery logic.
 */
export const ViewerFrame = React.forwardRef(function ViewerFrame({
  children,
  label,
  source,
  badges,
  liveness,
  hud,
  scope,
  toolbar,
  overlay,
  status,
  state,
  availability,
  connection,
  freshness,
  playback,
  stateLabel,
  stateDescription,
  stateIcon,
  stateAction,
  appearance = 'dark',
  variant = 'standalone',
  chromeVariant = 'surface',
  toolbarVisibility = 'always',
  // 배치 규약: 뷰포트 조작은 우하단, 상단은 정체성과 상시 상태에 남긴다.
  toolbarPlacement = 'bottom-right',
  style,
  tabIndex,
  onFocusCapture,
  onBlurCapture,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  ...rest
}, forwardedRef) {
  const rootRef = React.useRef(null);
  const blockingLayerRef = React.useRef(null);
  const toolbarShelfRef = React.useRef(null);
  const topbarRef = React.useRef(null);
  const lastFocusWithinRef = React.useRef(null);
  const focusInsideBlockingLayerRef = React.useRef(false);
  const returnFocusRef = React.useRef(null);
  const wasBlockingRef = React.useRef(false);
  const [pointerWithin, setPointerWithin] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [topToolbarOwnsChrome, setTopToolbarOwnsChrome] = React.useState(false);
  // scope 레일이 상단에서 비켜가야 할 거리. 우측 열을 쓰는 상단 요소(liveness,
  // top-right 툴바)의 아래끝이며, 그런 요소가 없으면 0이라 레일은 다른 크롬과
  // 같은 12px 인셋으로 상단에 붙는다. 높이가 콘텐츠에 따라 변하므로 측정한다.
  const [scopeTopOffset, setScopeTopOffset] = React.useState(0);
  // 같은 우측 열을 쓰는 하단 툴바가 차지한 높이. scope 레일이 표면 기준으로만
  // 잘리면 화면이 짧아질 때 두 컨트롤이 같은 자리에서 겹친다.
  const [bottomShelfHeight, setBottomShelfHeight] = React.useState(0);
  const resolvedState = resolveViewerState({
    state,
    availability,
    connection,
    freshness,
    playback,
  });
  const presentation = STATE_PRESENTATION[resolvedState];
  const blocking = presentation.blocking;
  const busy = Boolean(presentation.busy);
  const blockingStatusRole = ASSERTIVE_BLOCKING_STATES.has(resolvedState) ? 'alert' : 'status';
  const labelContent = stateLabel ?? presentation.label;
  const descriptionContent = stateDescription === undefined
    ? presentation.description
    : stateDescription;
  const topToolbar = toolbarPlacement === 'top-right' ? toolbar : null;
  const bottomToolbar = toolbarPlacement === 'bottom-right' ? toolbar : null;
  // 우상단 생존성 영역이 렌더되는지. 이 영역이 자동 여백으로 오른쪽을 잡으므로
  // 툴바가 같은 여백을 또 잡으면 둘 사이가 벌어진다(툴바가 숨겨져 있어도).
  const hasLiveness = liveness != null || Boolean(presentation.corner);
  const overlayChrome = chromeVariant === 'overlay';
  const interactionToolbar = toolbarVisibility === 'interaction';
  const toolbarVisible = !interactionToolbar || pointerWithin || focusWithin;

  React.useImperativeHandle(forwardedRef, () => rootRef.current, []);

  React.useLayoutEffect(() => {
    const ownsChrome = Boolean(toolbarShelfRef.current?.querySelector(
      '[data-viewer-toolbar-appearance="surface"], [data-viewer-toolbar-appearance="on-dark"]',
    ));
    setTopToolbarOwnsChrome((current) => current === ownsChrome ? current : ownsChrome);
    // 배치와 무관하게 감지한다. top/bottom 중 하나만 렌더되므로 같은 ref를 쓴다.
  }, [toolbar, toolbarPlacement]);

  React.useLayoutEffect(() => {
    const node = topbarRef.current;
    if (scope == null || node == null) {
      setScopeTopOffset(0);
      return undefined;
    }
    const view = node.ownerDocument.defaultView;
    const update = () => {
      // 비켜갈 대상은 topbar 전체가 아니라 **같은 우측 열에 실제로 놓인 것**뿐이다.
      // 정체성 칩은 좌측이라 우측 레일을 가리지 않는데, topbar 높이를 그대로 쓰면
      // 오른쪽이 비어 있어도 레일이 그만큼 내려가 어디에도 붙지 않은 채 뜬다.
      const occupants = [
        node.querySelector('[data-viewer-liveness]'),
        node.querySelector('[data-viewer-toolbar]'),
      ].filter(Boolean);
      const top = node.getBoundingClientRect().top;
      const next = occupants.length === 0
        ? 0
        : Math.max(...occupants.map((el) => el.getBoundingClientRect().bottom - top));
      setScopeTopOffset((current) => (Math.abs(current - next) > 0.5 ? next : current));
    };
    update();
    const observer = view?.ResizeObserver ? new view.ResizeObserver(update) : null;
    observer?.observe(node);
    return () => observer?.disconnect();
  }, [scope, source, badges, liveness, hud, topToolbar, presentation.corner]);

  React.useLayoutEffect(() => {
    const node = toolbarShelfRef.current;
    if (scope == null || bottomToolbar == null || node == null) {
      setBottomShelfHeight(0);
      return undefined;
    }
    const view = node.ownerDocument.defaultView;
    const update = () => {
      const next = node.getBoundingClientRect().height;
      setBottomShelfHeight((current) => (Math.abs(current - next) > 0.5 ? next : current));
    };
    update();
    const observer = view?.ResizeObserver ? new view.ResizeObserver(update) : null;
    observer?.observe(node);
    return () => observer?.disconnect();
  }, [scope, bottomToolbar]);

  React.useLayoutEffect(() => {
    if (typeof document === 'undefined') return;
    const wasBlocking = wasBlockingRef.current;
    wasBlockingRef.current = blocking;

    if (!blocking) {
      const focusNeedsRestore = document.activeElement === document.body
        || document.activeElement === document.documentElement;
      if (wasBlocking && focusInsideBlockingLayerRef.current && focusNeedsRestore) {
        const exactTarget = returnFocusRef.current;
        const exactTargetAvailable = exactTarget instanceof HTMLElement
          && rootRef.current?.contains(exactTarget)
          && !exactTarget.matches('[disabled], [aria-disabled="true"]')
          && !exactTarget.closest('[inert]');
        const restoredTarget = exactTargetAvailable
          ? exactTarget
          : rootRef.current?.querySelector(
              '[data-viewer-toolbar] [data-lk-viewer-toolbar-item]:not([disabled]):not([aria-disabled="true"])',
            ) ?? rootRef.current;
        restoredTarget?.focus?.({ preventScroll: true });
      }
      focusInsideBlockingLayerRef.current = false;
      returnFocusRef.current = null;
      return;
    }
    const focused = document.activeElement;
    const blockedRegions = rootRef.current?.querySelectorAll('[data-viewer-blocked-region]') ?? [];
    const blockedFocusTarget = Array.from(blockedRegions).reduce((target, region) => {
      if (target) return target;
      if (focused instanceof HTMLElement && region.contains(focused)) return focused;
      if (lastFocusWithinRef.current instanceof HTMLElement && region.contains(lastFocusWithinRef.current)) {
        return lastFocusWithinRef.current;
      }
      return null;
    }, null);
    const focusWasBlocked = blockedFocusTarget != null;
    if (!focusWasBlocked) return;
    returnFocusRef.current = blockedFocusTarget;

    const focusTarget = blockingLayerRef.current?.querySelector([
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')) ?? blockingLayerRef.current;
    focusTarget?.focus?.({ preventScroll: true });
  }, [blocking, resolvedState]);

  const stateSummary = (
    <React.Fragment>
      <StateMark presentation={presentation} icon={stateIcon} size={16} />
      <span style={{ display: 'grid', gap: 2, minWidth: 0 }}>
        <span data-viewer-edge-label="" style={{ fontSize: 'var(--caption2-size)', lineHeight: 1.35, fontWeight: 'var(--fw-bold)', color: 'var(--viewer-foreground)' }}>
          {labelContent}
        </span>
        {descriptionContent != null && (
          <span
            data-viewer-edge-description=""
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              padding: 0,
              margin: -1,
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0,
            }}
          >
            {descriptionContent}
          </span>
        )}
      </span>
    </React.Fragment>
  );

  return (
    <div
      {...rest}
      ref={rootRef}
      role="region"
      aria-label={label}
      aria-busy={busy || undefined}
      tabIndex={tabIndex ?? -1}
      onFocusCapture={(event) => {
        lastFocusWithinRef.current = event.target;
        focusInsideBlockingLayerRef.current = Boolean(event.target.closest?.('[data-viewer-blocking-state]'));
        setFocusWithin(true);
        onFocusCapture?.(event);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false);
        onBlurCapture?.(event);
      }}
      onPointerEnter={(event) => {
        setPointerWithin(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setPointerWithin(false);
        onPointerLeave?.(event);
      }}
      onPointerDown={(event) => {
        setPointerWithin(true);
        onPointerDown?.(event);
      }}
      data-lds-viewer-frame=""
      data-viewer-appearance={appearance}
      data-viewer-variant={variant}
      data-viewer-chrome={chromeVariant}
      data-viewer-toolbar-visibility={toolbarVisibility}
      data-viewer-toolbar-visible={toolbarVisible ? 'true' : 'false'}
      data-viewer-state={resolvedState}
      data-viewer-availability={availability}
      data-viewer-connection={connection}
      data-viewer-freshness={freshness}
      data-viewer-playback={playback}
      data-viewer-blocking={blocking ? '' : undefined}
      style={{
        '--viewer-surface': appearance === 'light'
          ? 'var(--component-viewer-light-surface)'
          : 'var(--component-viewer-surface)',
        '--viewer-surface-elevated': appearance === 'light'
          ? 'var(--component-viewer-light-surface-elevated)'
          : 'var(--component-viewer-surface-elevated)',
        '--viewer-foreground': appearance === 'light'
          ? 'var(--component-viewer-light-foreground)'
          : 'var(--component-viewer-foreground)',
        '--viewer-muted': appearance === 'light'
          ? 'var(--component-viewer-light-muted)'
          : 'var(--component-viewer-muted)',
        '--viewer-border': appearance === 'light'
          ? 'var(--component-viewer-light-border)'
          : 'var(--component-viewer-border)',
        // Appearance-aware state/accent tones for a true dark control-room HUD.
        // Light keeps the semantic tokens verbatim (no light-theme change); dark
        // lifts each tone toward white, which RAISES luminance on the dark
        // viewer surface and therefore only improves non-text contrast (never
        // drops it). Consumers reference these with a semantic fallback so any
        // surface that has not opted in is unaffected.
        '--viewer-accent': appearance === 'light'
          ? 'var(--color-semantic-primary-normal)'
          : 'color-mix(in srgb, var(--color-semantic-primary-normal), white 28%)',
        '--viewer-danger': appearance === 'light'
          ? 'var(--color-semantic-status-negative-foreground)'
          : 'color-mix(in srgb, var(--color-semantic-status-negative-foreground), white 22%)',
        '--viewer-warning': appearance === 'light'
          ? 'var(--color-semantic-status-cautionary-foreground)'
          : 'color-mix(in srgb, var(--color-semantic-status-cautionary-foreground), white 20%)',
        '--viewer-positive': appearance === 'light'
          ? 'var(--color-semantic-status-positive-foreground)'
          : 'color-mix(in srgb, var(--color-semantic-status-positive-foreground), white 22%)',
        position: 'relative',
        isolation: 'isolate',
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        // variant="embedded" drops the frame's own perimeter so a parent
        // surface (CanvasEditorShell, Card) owns one continuous outline; every
        // viewport role — chrome, state model, HUD/toolbar, a11y region — is
        // otherwise unchanged.
        border: variant === 'embedded' ? 0 : '1px solid var(--viewer-border)',
        borderRadius: variant === 'embedded' ? 0 : 'var(--radius-lg)',
        background: 'var(--viewer-surface)',
        color: 'var(--viewer-foreground)',
        fontFamily: 'var(--font-sans)',
        containerType: 'inline-size',
        ...style,
      }}
    >
      {/* The frame's one announcement channel, mounted for its whole lifetime
          with only its text replaced. The visible state chips are conditional —
          a corner badge, an edge chip, a blocking panel, each appearing with the
          state it describes — and a live region inserted together with its
          message is not a mutation of an existing region, so the announcement
          that mattered most (the state just entered) was the one dropped. Those
          chips keep their looks and their hooks and step out of the
          accessibility tree; politeness still follows the state, so retained
          content stays polite and severe blocking states interrupt.
          VisuallyHidden is absolutely positioned, so this costs no layout. */}
      <VisuallyHidden
        as="div"
        data-viewer-state-live=""
        role={blockingStatusRole}
        aria-live={blockingStatusRole === 'alert' ? 'assertive' : 'polite'}
        aria-atomic="true"
      >
        {[labelContent, descriptionContent]
          .filter((part) => typeof part === 'string' && part !== '')
          .join(', ')}
      </VisuallyHidden>
      <div
        data-viewer-content=""
        data-viewer-blocked-region=""
        inert={blocking ? true : undefined}
        aria-hidden={blocking || undefined}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          overflow: 'hidden',
          opacity: !blocking && overlayChrome ? presentation.contentOpacity ?? 1 : 1,
        }}
      >
        {children}
        {overlay != null && (
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {overlay}
          </div>
        )}
      </div>

      {(source != null || badges != null || liveness != null || hud != null || topToolbar != null || presentation.corner) && (
        <div
          ref={topbarRef}
          data-viewer-topbar=""
          inert={blocking ? true : undefined}
          aria-hidden={blocking || undefined}
          style={{
            position: 'absolute',
            zIndex: 2,
            inset: '0 0 auto',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            columnGap: 4,
            padding: 12,
            pointerEvents: 'none',
          }}
        >
          {(source != null || badges != null || hud != null) && (
            <div
              data-viewer-identity=""
              style={{
                display: 'grid',
                flex: '0 1 auto',
                minWidth: 0,
                width: 'fit-content',
                maxWidth: 'min(360px, 100%)',
                overflow: 'hidden',
                border: overlayChrome
                  ? '1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)'
                  : '1px solid var(--viewer-border)',
                borderRadius: 'var(--radius-md)',
                background: overlayChrome
                  ? 'color-mix(in srgb, var(--viewer-surface) 82%, transparent)'
                  : 'var(--viewer-surface-elevated)',
                boxShadow: overlayChrome ? 'none' : 'var(--shadow-sm)',
                backdropFilter: overlayChrome ? 'blur(8px)' : undefined,
              }}
            >
              {(source != null || badges != null) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    minWidth: 0,
                    maxWidth: '100%',
                    minHeight: 28,
                    padding: '4px 8px',
                    boxSizing: 'border-box',
                  }}
                >
                  {source != null && (
                    <span
                      data-viewer-source=""
                      style={{
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'var(--viewer-foreground)',
                        fontSize: 'var(--caption1-size)',
                        lineHeight: 'var(--caption1-line)',
                        fontWeight: 'var(--fw-semibold)',
                      }}
                    >
                      {source}
                    </span>
                  )}
                  {badges}
                </div>
              )}
              {hud != null && (
                <div
                  data-viewer-hud=""
                  style={{
                    minWidth: 0,
                    maxWidth: '100%',
                    padding: (source != null || badges != null) ? '7px 10px 8px' : '8px 10px',
                    borderTop: (source != null || badges != null) ? '1px solid var(--viewer-border)' : undefined,
                    color: 'var(--viewer-foreground)',
                  }}
                >
                  {hud}
                </div>
              )}
            </div>
          )}
          {/* 생존성(라이브 등)은 정체성과 다른 축이라 source 옆이 아니라 우상단에
              자리를 따로 갖는다. toolbar 슬롯은 자동 숨김(opacity)이 걸려 있어
              상시 표시가 필요한 신호를 담을 수 없다. `liveness`가 없으면 아래
              toolbar는 기존과 완전히 동일하게 렌더된다. */}
          {hasLiveness && (
            <div
              data-viewer-liveness=""
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: '0 0 auto',
                marginLeft: 'auto',
                minHeight: 28,
                padding: '4px 8px',
                boxSizing: 'border-box',
                border: overlayChrome
                  ? '1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)'
                  : '1px solid var(--viewer-border)',
                borderRadius: 'var(--radius-md)',
                background: overlayChrome
                  ? 'color-mix(in srgb, var(--viewer-surface) 82%, transparent)'
                  : 'var(--viewer-surface-elevated)',
                backdropFilter: overlayChrome ? 'blur(8px)' : undefined,
              }}
            >
              {presentation.corner && (
                <StatusIndicator
                  data-viewer-corner-status=""
                  aria-hidden="true"
                  tone={presentation.tone}
                  style={{ flex: '0 0 auto', color: 'var(--viewer-foreground)' }}
                >
                  {labelContent}
                </StatusIndicator>
              )}
              {liveness}
            </div>
          )}
          {topToolbar != null && (
            <div
              ref={toolbarShelfRef}
              data-viewer-toolbar=""
              data-viewer-control-shelf=""
              data-viewer-blocked-region=""
              inert={blocking ? true : undefined}
              aria-hidden={blocking || undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: '0 0 auto',
                // liveness가 이미 우측으로 밀어놨으면 여기서 또 밀지 않는다.
                marginLeft: hasLiveness ? 0 : 'auto',
                // 래퍼가 표면을 그릴 때만 안쪽 여백을 낸다. minimal 툴바는 패딩이 0이라
                // 래퍼가 메우지 않으면 버튼이 테두리에 붙고, on-dark는 자체 패딩 2를
                // 가지므로 래퍼는 0이어야 두 외형의 버튼 정렬선이 맞는다.
                padding: topToolbarOwnsChrome ? 0 : 2,
                border: topToolbarOwnsChrome
                  ? 'none'
                  : overlayChrome
                    ? '1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)'
                    : '1px solid var(--viewer-border)',
                borderRadius: topToolbarOwnsChrome ? 0 : 'var(--radius-md)',
                background: topToolbarOwnsChrome
                  ? 'transparent'
                  : overlayChrome
                    ? 'color-mix(in srgb, var(--viewer-surface) 82%, transparent)'
                    : 'var(--viewer-surface-elevated)',
                boxShadow: 'none',
                opacity: toolbarVisible ? 1 : 0,
                pointerEvents: blocking || !toolbarVisible ? 'none' : 'auto',
                backdropFilter: !topToolbarOwnsChrome && overlayChrome ? 'blur(8px)' : undefined,
              }}
            >
              {topToolbar}
            </div>
          )}
        </div>
      )}

      {/* 범위 전환(층·레벨·카메라)은 뷰 조작과 다른 축이라 우하단 툴바와 자리를
          나눠 갖는다: 위는 "무엇을 보는가", 아래는 "어떻게 보는가". 상단 우측
          셸프(`toolbarPlacement="top-right"`)는 헤더 안 in-flow 자리라 세로
          스택을 넣으면 헤더가 그만큼 늘어나므로, 이 레일은 별도 오버레이다. */}
      {scope != null && (
        <div
          data-viewer-scope=""
          data-viewer-blocked-region=""
          inert={blocking ? true : undefined}
          aria-hidden={blocking || undefined}
          style={{
            position: 'absolute',
            zIndex: 3,
            right: 12,
            // 비켜갈 요소가 있으면 그 아래로 8px 띄우고, 없으면 다른 크롬과 같은
            // 12px 인셋으로 상단에 붙는다.
            top: scopeTopOffset > 0 ? Math.round(scopeTopOffset) + 8 : 12,
            // 하단 툴바와 같은 우측 열을 쓰므로 그 자리를 비워두고 남은 높이만
            // 쓴다. 길어지면 지도 밖으로 나가거나 툴바를 덮지 않고 스크롤된다.
            maxHeight: `calc(100% - ${
              (scopeTopOffset > 0 ? Math.round(scopeTopOffset) + 8 : 12)
              + 12
              + (bottomShelfHeight > 0 ? Math.round(bottomShelfHeight) + 8 : 0)
            }px)`,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            pointerEvents: blocking ? 'none' : 'auto',
          }}
        >
          {scope}
        </div>
      )}

      {bottomToolbar != null && (
        <div
          ref={toolbarShelfRef}
          data-viewer-toolbar=""
          data-viewer-blocked-region=""
          inert={blocking ? true : undefined}
          aria-hidden={blocking || undefined}
          style={{
            position: 'absolute',
            zIndex: 3,
            right: 12,
            bottom: presentation.edge ? 56 : 12,
            // The shelf is bottom-anchored and sized by its content, so a tall
            // control stack (zoom cluster + floor selector) grows upward with
            // nothing stopping it: on a fixed-aspect canvas the stack kept its
            // height while the surface shrank and spilled out through the top
            // edge. Clamp it to the surface and let it scroll instead.
            maxHeight: `calc(100% - ${presentation.edge ? 68 : 24}px)`,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            // block이면 인라인 자식 아래에 베이스라인 여유가 붙어 외형마다 하단
            // 여백이 달라진다. 상단 셸프와 같이 flex로 두어 leading을 없앤다.
            display: 'flex',
            alignItems: 'center',
            // 내부 툴바가 이미 자체 표면을 그리면 래퍼는 크롬을 내려놓는다.
            // 그러지 않으면 같은 12px 라디우스가 겹쳐 카드 안 카드가 된다.
            // 래퍼가 표면을 그릴 때만 안쪽 여백을 낸다(minimal 툴바는 패딩 0).
            padding: topToolbarOwnsChrome ? 0 : 2,
            border: topToolbarOwnsChrome ? 'none' : '1px solid var(--viewer-border)',
            borderRadius: topToolbarOwnsChrome ? 0 : 'var(--radius-md)',
            background: topToolbarOwnsChrome ? 'transparent' : 'var(--viewer-surface-elevated)',
            boxShadow: 'none',
            // toolbarVisibility는 배치와 무관한 계약이다. 이전에는 top-right에만
            // 적용돼, 같은 값으로도 bottom-right에서는 컨트롤이 항상 보였다.
            opacity: toolbarVisible ? 1 : 0,
            pointerEvents: blocking || !toolbarVisible ? 'none' : 'auto',
          }}
        >
          {bottomToolbar}
        </div>
      )}

      {!blocking && !presentation.edge && status != null && (
        <div
          data-viewer-status=""
          style={{
            position: 'absolute',
            zIndex: 2,
            left: 12,
            bottom: 12,
            display: 'inline-flex',
            alignItems: 'center',
            maxWidth: 'calc(100% - 24px)',
            minHeight: 24,
            boxSizing: 'border-box',
            padding: '4px 8px',
            border: '1px solid var(--viewer-border)',
            borderRadius: 'var(--radius-sm)',
            background: overlayChrome
              ? 'color-mix(in srgb, var(--viewer-surface) 82%, transparent)'
              : 'var(--viewer-surface-elevated)',
            boxShadow: overlayChrome ? 'none' : 'var(--shadow-sm)',
            backdropFilter: overlayChrome ? 'blur(8px)' : undefined,
            color: 'var(--viewer-muted)',
            fontSize: 'var(--caption2-size)',
            lineHeight: 1.35,
            fontWeight: 'var(--fw-semibold)',
            fontVariantNumeric: 'tabular-nums',
            overflowWrap: 'anywhere',
          }}
        >
          {status}
        </div>
      )}

      {!blocking && presentation.edge && (
        <div
          data-viewer-edge-state=""
          style={{
            position: 'absolute',
            zIndex: 3,
            left: 12,
            right: 'auto',
            bottom: 12,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
            gap: 6,
            width: 'max-content',
            minHeight: 24,
            maxWidth: 'calc(100% - 24px)',
            padding: '2px 8px',
            boxSizing: 'border-box',
            border: overlayChrome
              ? '1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)'
              : '1px solid var(--viewer-border)',
            borderRadius: 'var(--radius-sm)',
            background: overlayChrome
              ? 'color-mix(in srgb, var(--viewer-surface) 86%, transparent)'
              : 'var(--viewer-surface-elevated)',
            boxShadow: 'none',
            backdropFilter: overlayChrome ? 'blur(8px)' : undefined,
            overflow: 'hidden',
          }}
        >
          {/* 라이브 리전은 상태 전환만 감싼다. FPS·해상도 같은 판독값이 안에 들어가면
              `aria-atomic`과 맞물려 값이 바뀔 때마다 칩 전체가 다시 낭독된다.
              판독값은 시각적으로만 인접하고 낭독 대상에서는 빠진다. */}
          <div
            data-viewer-edge-summary=""
            aria-hidden="true"
            style={{ display: 'flex', alignItems: 'center', gap: 4, flex: '0 1 auto', minWidth: 0, overflow: 'hidden' }}
          >
            {stateSummary}
          </div>
          {status != null && (
              <React.Fragment>
                <span aria-hidden="true" style={{ flex: '0 0 auto', color: 'var(--viewer-muted)', fontSize: 'var(--caption2-size)' }}>·</span>
                <span
                  data-viewer-edge-metadata=""
                  style={{
                    flex: '0 1 auto',
                    minWidth: 0,
                    maxWidth: 160,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: 'var(--viewer-muted)',
                    fontSize: 'var(--caption2-size)',
                    fontWeight: 'var(--fw-semibold)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {status}
                </span>
              </React.Fragment>
          )}
          {stateAction != null && <div style={{ flex: '0 0 auto' }}>{stateAction}</div>}
        </div>
      )}

      {blocking && (
        <div
          ref={blockingLayerRef}
          role="group"
          aria-label={typeof labelContent === 'string' ? labelContent : undefined}
          tabIndex={-1}
          data-viewer-blocking-state=""
          style={{
            position: 'absolute',
            zIndex: 4,
            inset: 0,
            display: 'grid',
            gridTemplateRows: source != null ? 'auto minmax(0, 1fr)' : 'minmax(0, 1fr)',
            alignItems: 'stretch',
            padding: 12,
            boxSizing: 'border-box',
            background: 'var(--viewer-surface)',
            textAlign: 'center',
          }}
        >
          {source != null && (
            <div
              data-viewer-blocking-source=""
              style={{
                alignSelf: 'start',
                justifySelf: 'start',
                width: 'fit-content',
                maxWidth: 'min(360px, 100%)',
                boxSizing: 'border-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'var(--viewer-foreground)',
                fontSize: 'var(--caption1-size)',
                lineHeight: 'var(--caption1-line)',
                fontWeight: 'var(--fw-semibold)',
                textAlign: 'left',
                padding: overlayChrome ? '5px 8px' : '7px 10px',
                border: overlayChrome
                  ? '1px solid color-mix(in srgb, var(--viewer-foreground) 18%, transparent)'
                  : '1px solid var(--viewer-border)',
                borderRadius: 'var(--radius-md)',
                background: overlayChrome
                  ? 'color-mix(in srgb, var(--viewer-surface) 82%, transparent)'
                  : 'var(--viewer-surface-elevated)',
                boxShadow: overlayChrome ? 'none' : 'var(--shadow-sm)',
              }}
            >
              {source}
            </div>
          )}
          <div
            data-viewer-blocking-body=""
            style={{
              alignSelf: 'center',
              justifySelf: 'center',
              display: 'grid',
              justifyItems: 'center',
              gap: 10,
              width: 'min(100%, 360px)',
              minHeight: 0,
            }}
          >
            <div
              data-viewer-blocking-live=""
              aria-hidden="true"
              style={{ display: 'grid', justifyItems: 'center', gap: 10 }}
            >
              <div
                data-viewer-blocking-icon=""
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 24,
                  minHeight: 24,
                }}
              >
                <StateMark presentation={presentation} icon={stateIcon} />
              </div>
              <div style={{ display: 'grid', justifyItems: 'center', gap: 4 }}>
                <strong style={{ color: 'var(--viewer-foreground)', fontSize: 'var(--label1-size)', lineHeight: 1.4 }}>
                  {labelContent}
                </strong>
                {descriptionContent != null && (
                  <span data-viewer-blocking-description="" style={{ color: 'var(--viewer-muted)', fontSize: 'var(--caption1-size)', lineHeight: 1.55, overflowWrap: 'anywhere' }}>
                    {descriptionContent}
                  </span>
                )}
              </div>
            </div>
            {stateAction != null && <div data-viewer-blocking-action="" style={{ marginTop: 4 }}>{stateAction}</div>}
          </div>
        </div>
      )}
    </div>
  );
});

ViewerFrame.displayName = 'ViewerFrame';
