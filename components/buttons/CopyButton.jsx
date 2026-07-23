import React from 'react';
import { Button } from './Button.jsx';
import { Icon } from '../icon/Icon.jsx';

// Screen-reader-only announcer geometry — the same recipe ToastStack uses for
// its always-mounted live regions, so every announcement surface in the system
// stays visually inert in exactly one way.
const SR_ONLY_STYLE = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

const FEEDBACK_DURATION_MS = 1400;

/**
 * Clipboard access has three distinct failure modes that all have to surface as
 * failures: the API is missing (non-secure context / old browser), permission is
 * denied, or the write itself rejects. Anything that is not a resolved
 * `writeText` is treated as "not copied".
 */
async function writeToClipboard(value) {
  const clipboard = typeof navigator === 'undefined' ? undefined : navigator.clipboard;
  if (!clipboard || typeof clipboard.writeText !== 'function') {
    throw new Error('Clipboard API is unavailable in this context.');
  }
  await clipboard.writeText(String(value));
}

/**
 * LK ROBOTICS — CopyButton
 * Copies `value` to the clipboard and flips to a check + "복사됨" for ~1.4s. A
 * cool-gray flat button by default — composed from Button (variant="flat") so
 * the rest fill/transition come from the button tokens. Geometry and typography
 * are explicit style overrides: the 36/44 heights predate the Button height
 * scale (32/40/48) and are preserved exactly. Candidate for future
 * normalization onto the token scale (needs design sign-off).
 *
 * Feedback contract — a failed clipboard write is reported as a failure
 * (`errorLabel`), never as success: the previous implementation swallowed the
 * rejection and still claimed "복사됨", which is a false success message. Both
 * outcomes are pushed into an always-mounted visually hidden
 * `role="status"` region instead of relying on the button's own label swap,
 * because renaming the focused control is not a guaranteed announcement.
 * The reset timer is cleared on unmount and on every re-press.
 */
export function CopyButton({
  value,
  children = '복사',
  copiedLabel = '복사됨',
  errorLabel = '복사 실패',
  size = 'md',
  style,
  onClick,
  ...rest
}) {
  // 'idle' | 'copied' | 'error'
  const [status, setStatus] = React.useState('idle');
  const timerRef = React.useRef(null);
  const liveRef = React.useRef(null);

  React.useEffect(() => () => clearTimeout(timerRef.current), []);

  const announce = React.useCallback((message) => {
    const node = liveRef.current;
    if (!node || !message) return;
    if (node.textContent !== message) {
      // A changed text node is the mutation assistive tech reports — write it
      // synchronously so the announcement does not depend on frame scheduling.
      node.textContent = message;
      return;
    }
    // Repeating the same message is not a mutation, so blank the region first
    // and restore it on the next task to make the change observable.
    const view = node.ownerDocument?.defaultView ?? window;
    node.textContent = '';
    view.setTimeout(() => {
      if (node.isConnected) node.textContent = message;
    }, 50);
  }, []);

  const copy = async (event) => {
    onClick?.(event);
    let copied = true;
    try {
      await writeToClipboard(value);
    } catch {
      copied = false;
    }
    clearTimeout(timerRef.current);
    setStatus(copied ? 'copied' : 'error');
    announce(copied ? copiedLabel : errorLabel);
    timerRef.current = setTimeout(() => setStatus('idle'), FEEDBACK_DURATION_MS);
  };

  const copied = status === 'copied';
  const failed = status === 'error';
  const feedbackBackground = copied
    ? { background: 'var(--color-semantic-primary-surface-strong)' }
    : failed
      ? { background: 'var(--color-semantic-status-negative-surface)' }
      : null;

  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <Button
        variant="flat"
        size={size}
        data-copy-status={status}
        onClick={copy}
        style={{
          // Overrides that intentionally diverge from the Button md/sm recipe —
          // kept to avoid any visual change; normalize in a future pass.
          gap: 7,
          height: size === 'sm' ? 36 : 44,
          padding: '0 14px',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--label1-size)',
          lineHeight: 'normal',
          fontWeight: 'var(--fw-bold)',
          letterSpacing: 0,
          color: copied
            ? 'var(--color-semantic-primary-normal)'
            : failed
              ? 'var(--color-semantic-status-negative-text)'
              : 'var(--color-semantic-label-normal)',
          ...feedbackBackground,
          ...style,
        }}
        {...rest}
      >
        <Icon name={copied ? 'check' : failed ? 'triangle-exclamation' : 'copy'} size={16} aria-hidden="true" />
        {copied ? copiedLabel : failed ? errorLabel : children}
      </Button>
      {/* Mounted for the whole lifetime of the button — a live region that is
          inserted together with its text is unreliable in most screen readers. */}
      <span ref={liveRef} role="status" aria-live="polite" aria-atomic="true" style={SR_ONLY_STYLE} />
    </span>
  );
}
