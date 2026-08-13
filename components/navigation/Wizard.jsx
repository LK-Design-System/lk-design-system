import React from 'react';
import { Steps } from './Steps.jsx';

/**
 * LK ROBOTICS — Wizard
 * A multi-step flow: a Steps indicator on top, step content in the middle, and
 * back/next controls. `children` may be a node or a render fn `(current) => …`.
 * Controlled (`current`) or uncontrolled (`defaultCurrent`).
 * The indicator reuses the Steps component (ol/li + aria-current="step");
 * the step content region is wrapped in `aria-live="polite"` so step changes
 * are announced, and receives focus after a wizard-initiated transition so
 * keyboard/screen-reader users land on the new step. `onBeforeStepChange` is
 * a sync/async transition guard: `false` (or a promise resolving `false`, or a
 * rejection) keeps the current step; while a guard or async `onComplete` is
 * pending, back/next/complete are blocked. `footer`: null hides the controls,
 * a node replaces them, a function receives the navigation context
 * ({ current, count, isFirst, isLast, pending, nextIsComplete, back, next,
 * complete }), undefined keeps the default 이전/다음 pair. On the last step,
 * providing `onComplete` turns the next button into a primary complete action
 * (`completeLabel`, default '완료').
 */
export function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, onBeforeStepChange, onComplete, completeLabel = '완료', labelPolicy, children, footer, style, ...rest }) {
  const isControlled = current !== undefined;
  const [internal, setInternal] = React.useState(defaultCurrent);
  const [pending, setPending] = React.useState(false);
  const cur = isControlled ? current : internal;
  const contentRef = React.useRef(null);
  /* Focus moves only after wizard-initiated transitions (default controls or
   * footer context), never when the parent re-renders with a new `current`
   * for its own reasons — so the flag is set in commit(), not on every change. */
  const focusNextChangeRef = React.useRef(false);
  /* Synchronous mirror of `pending` so a double-activation in the same tick
   * (before React re-renders the disabled buttons) is still blocked. */
  const pendingRef = React.useRef(false);
  const setPendingState = (value) => { pendingRef.current = value; setPending(value); };
  const commit = (c) => { focusNextChangeRef.current = true; if (!isControlled) setInternal(c); onStepChange && onStepChange(c); };
  const go = (n) => {
    if (pendingRef.current) return;
    const c = Math.max(0, Math.min(steps.length - 1, n));
    if (c === cur) return;
    if (!onBeforeStepChange) { commit(c); return; }
    let verdict;
    try { verdict = onBeforeStepChange(c, cur); } catch { return; }
    if (verdict === false) return;
    if (verdict && typeof verdict.then === 'function') {
      setPendingState(true);
      verdict.then(
        (ok) => { setPendingState(false); if (ok !== false) commit(c); },
        () => { setPendingState(false); },
      );
      return;
    }
    commit(c);
  };
  const complete = () => {
    if (pendingRef.current || typeof onComplete !== 'function') return;
    const result = onComplete();
    if (result && typeof result.then === 'function') {
      setPendingState(true);
      result.then(() => setPendingState(false), () => setPendingState(false));
    }
  };
  React.useEffect(() => {
    if (!focusNextChangeRef.current) return;
    focusNextChangeRef.current = false;
    if (contentRef.current && typeof contentRef.current.focus === 'function') contentRef.current.focus();
  }, [cur]);
  const isLast = cur === steps.length - 1;
  const nextIsComplete = isLast && typeof onComplete === 'function';
  const nextDisabled = pending || (isLast && !nextIsComplete);
  const footerContext = {
    current: cur,
    count: steps.length,
    isFirst: cur === 0,
    isLast,
    pending,
    nextIsComplete,
    back: () => go(cur - 1),
    next: () => { if (nextIsComplete) complete(); else go(cur + 1); },
    complete,
  };
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <Steps steps={steps} current={cur} labelPolicy={labelPolicy} style={{ marginBottom: 'var(--space-8)' }} />
      <div ref={contentRef} tabIndex={-1} aria-live="polite" aria-busy={pending || undefined} style={{ outline: 'none' }}>{typeof children === 'function' ? children(cur) : children}</div>
      {footer === null ? null : typeof footer === 'function' ? footer(footerContext) : footer !== undefined ? footer : (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button type="button" onClick={footerContext.back} disabled={cur === 0 || pending} style={{ height: 44, padding: '0 18px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-normal)', cursor: cur === 0 || pending ? 'not-allowed' : 'pointer', opacity: cur === 0 || pending ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)' }}>이전</button>
          <button type="button" onClick={footerContext.next} disabled={nextDisabled} style={{ height: 44, padding: '0 20px', border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-primary-normal)', color: 'var(--color-semantic-static-white)', cursor: nextDisabled ? 'not-allowed' : 'pointer', opacity: nextDisabled ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)' }}>{nextIsComplete ? completeLabel : '다음'}</button>
        </div>
      )}
    </div>
  );
}
