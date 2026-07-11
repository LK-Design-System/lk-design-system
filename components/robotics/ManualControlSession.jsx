import React from 'react';
import { Button } from '../buttons/Button.jsx';
import { StatusBadge } from '../content/StatusBadge.jsx';
import { Icon } from '../icon/Icon.jsx';
import { Banner } from '../status/Banner.jsx';
import { ConnectionBadge } from './ConnectionBadge.jsx';

const LINK_LABELS = {
  ready: '연결 준비됨',
  stale: '연결 정보 오래됨',
  lost: '연결 끊김',
};

const AUTHORITY_LABELS = {
  checking: '권한 확인 중',
  granted: '권한 부여됨',
  denied: '권한 거부됨',
  revoked: '권한 회수됨',
};

const LINK_CONNECTION_STATUS = {
  ready: 'online',
  stale: 'stale',
  lost: 'offline',
};

const CONTROL_MODE_LABELS = {
  pointer: '포인터',
  keyboard: '키보드',
  hybrid: '포인터 + 키보드',
};

const GUARD_STATUS = {
  'link-unavailable': {
    tone: 'error',
    title: '제어 연결 없음',
    message: '연결이 복구되면 UI 제어를 다시 활성화하세요.',
  },
  'authority-unavailable': {
    tone: 'error',
    title: '제어 권한 없음',
    message: '서버에서 이 세션의 제어 권한을 부여하지 않았습니다.',
  },
  disarmed: {
    tone: 'warning',
    title: 'UI 제어 꺼짐',
    message: 'UI 제어를 활성화해야 조작기를 사용할 수 있습니다.',
  },
  'deadman-released': {
    tone: 'warning',
    title: 'Dead-man 입력 대기',
    message: 'Dead-man 입력을 유지하는 동안만 제어 명령을 보낼 수 있습니다.',
  },
  'focus-lost': {
    tone: 'warning',
    title: '제어 포커스 해제',
    message: '제어 영역을 다시 선택해 포커스를 복구하세요.',
  },
};

const READY_STATUS = {
  tone: 'success',
  title: '제어 입력 가능',
  message: '조작기 입력이 활성화되었습니다.',
};

function releaseReason({ linkReady, authorityGranted, armed, deadmanRequired, deadmanActive, focusSatisfied, windowActive }) {
  if (!linkReady) return 'link-unavailable';
  if (!authorityGranted) return 'authority-unavailable';
  if (!armed) return 'disarmed';
  if (deadmanRequired && !deadmanActive) return 'deadman-released';
  if (!windowActive || !focusSatisfied) return 'focus-lost';
  return null;
}

function guardStatus(reason) {
  return reason == null ? READY_STATUS : GUARD_STATUS[reason] || GUARD_STATUS.disarmed;
}

function blockMessage(reason) {
  return reason == null ? null : guardStatus(reason).message;
}

function statusTone(value, positiveValue) {
  if (value === positiveValue) return 'positive';
  if (value === 'checking' || value === 'stale') return 'cautionary';
  return 'negative';
}

/** UI boundary for a manual-control session. Transport STOP and watchdog guarantees remain application responsibilities. */
export function ManualControlSession({
  title = '수동 제어 세션',
  linkState = 'lost',
  authority = 'checking',
  armed = false,
  deadmanRequired = true,
  deadmanActive = false,
  controlMode = 'pointer',
  focusRequired = false,
  sessionMeta,
  deadmanControl,
  onArmedChange,
  onSafetyReleaseRequest,
  onEmergencyStopRequest,
  onFocusChange,
  children,
  onFocus,
  onBlur,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const [windowActive, setWindowActive] = React.useState(true);
  const controlsRef = React.useRef(null);
  const linkReady = linkState === 'ready';
  const authorityGranted = authority === 'granted';
  const focusSatisfied = !focusRequired || controlMode === 'pointer' || focused;
  const reason = releaseReason({ linkReady, authorityGranted, armed, deadmanRequired, deadmanActive, focusSatisfied, windowActive });
  const interactionEnabled = reason == null;
  const guard = guardStatus(reason);

  const latestEnabled = React.useRef(interactionEnabled);
  const previousEnabled = React.useRef(interactionEnabled);
  const releaseRequest = React.useRef(onSafetyReleaseRequest);
  const armedChange = React.useRef(onArmedChange);

  React.useEffect(() => {
    latestEnabled.current = interactionEnabled;
    releaseRequest.current = onSafetyReleaseRequest;
    armedChange.current = onArmedChange;
  });

  React.useEffect(() => {
    if (previousEnabled.current && !interactionEnabled && reason != null) {
      releaseRequest.current?.(reason);
      if (reason === 'link-unavailable' || reason === 'authority-unavailable' || reason === 'focus-lost') {
        armedChange.current?.(false);
      }
    }
    previousEnabled.current = interactionEnabled;
  }, [interactionEnabled, reason]);

  React.useEffect(() => {
    const handleWindowBlur = () => setWindowActive(false);
    const handleWindowFocus = () => setWindowActive(true);
    const handleVisibility = () => setWindowActive(document.visibilityState === 'visible');
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  React.useEffect(() => () => {
    if (latestEnabled.current) releaseRequest.current?.('unmount');
  }, []);

  React.useEffect(() => {
    if (!interactionEnabled && controlsRef.current?.contains(document.activeElement)) {
      document.activeElement?.blur();
    }
  }, [interactionEnabled]);

  const setFocusState = (next) => {
    setFocused(next);
    onFocusChange?.(next);
  };

  const renderedControls = typeof children === 'function'
    ? children({ interactionEnabled, blockReason: blockMessage(reason), focused, controlMode })
    : children;

  const canRequestArm = linkReady && authorityGranted;

  return (
    <section
      aria-label={typeof title === 'string' ? title : '수동 제어 세션'}
      tabIndex={controlMode === 'pointer' ? undefined : 0}
      onFocus={(event) => {
        setFocusState(true);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusState(false);
        onBlur?.(event);
      }}
      style={{
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: 'var(--component-card-border)',
        borderRadius: 'var(--component-card-radius)',
        background: 'var(--color-semantic-background-elevated-normal)',
        boxShadow: focused && controlMode !== 'pointer'
          ? '0 0 0 3px var(--color-semantic-focus-ring)'
          : 'var(--component-card-shadow-sm)',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        ...style,
      }}
      {...rest}
    >
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', padding: 'var(--space-4) var(--space-5)' }}>
        <div style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
          <strong style={{ color: 'var(--color-semantic-label-strong)', fontSize: 'var(--body1-size)', lineHeight: 'var(--body1-line)', overflowWrap: 'anywhere' }}>{title}</strong>
          {sessionMeta != null && (
            <span style={{ color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-semibold)', overflowWrap: 'anywhere' }}>{sessionMeta}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <ConnectionBadge status={LINK_CONNECTION_STATUS[linkState] || 'offline'} label={LINK_LABELS[linkState]} size="sm" />
          <StatusBadge tone={statusTone(authority, 'granted')}>{AUTHORITY_LABELS[authority]}</StatusBadge>
          <Button
            variant="danger"
            size="sm"
            disabled={typeof onEmergencyStopRequest !== 'function'}
            onClick={onEmergencyStopRequest}
          >
            <Icon name="circle-block" size={16} aria-hidden="true" />
            비상 정지 요청
          </Button>
        </div>
      </header>

      <Banner
        role="status"
        tone={guard.tone}
        title={guard.title}
        style={{ borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderRadius: 0, padding: 'var(--space-3) var(--space-5)' }}
      >
        {guard.message}
      </Banner>

      {renderedControls != null && (
        <div
          ref={controlsRef}
          aria-label="제어 입력"
          aria-disabled={!interactionEnabled}
          inert={!interactionEnabled ? true : undefined}
          data-interaction-enabled={interactionEnabled ? 'true' : 'false'}
          onClickCapture={(event) => {
            if (!interactionEnabled) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          onKeyDownCapture={(event) => {
            if (!interactionEnabled) {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          style={{ display: 'flex', minHeight: 240, alignItems: 'center', justifyContent: 'center', padding: 'var(--space-5)', opacity: interactionEnabled ? 1 : 0.42, pointerEvents: interactionEnabled ? 'auto' : 'none', transition: 'opacity var(--dur-fast) var(--ease-out)' }}
        >
          {renderedControls}
        </div>
      )}

      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)', flexWrap: 'wrap', padding: 'var(--space-3) var(--space-5)', borderTop: '1px solid var(--color-semantic-line-normal-alternative)', background: 'var(--color-semantic-fill-normal)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)', fontWeight: 'var(--fw-semibold)' }}>
          <Icon name="joystick" size={16} aria-hidden="true" />
          입력 방식 · {CONTROL_MODE_LABELS[controlMode] || controlMode}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          <Button
            variant={armed ? 'outlined' : 'primary'}
            color={armed ? 'assistive' : 'primary'}
            aria-pressed={armed}
            disabled={typeof onArmedChange !== 'function' || (!armed && !canRequestArm)}
            onClick={() => onArmedChange?.(!armed)}
          >
            {armed ? 'UI 제어 해제' : 'UI 제어 활성화'}
          </Button>
          {armed && deadmanRequired && deadmanControl != null && deadmanControl}
        </div>
      </footer>
    </section>
  );
}
