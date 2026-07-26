import React from 'react';
import { Steps } from './Steps.jsx';

/**
 * LK ROBOTICS — Wizard
 * A multi-step flow: a Steps indicator on top, step content in the middle, and
 * back/next controls. `children` may be a node or a render fn `(current) => …`.
 * Controlled (`current`) or uncontrolled (`defaultCurrent`).
 * The indicator reuses the Steps component (ol/li + aria-current="step");
 * the step content region is wrapped in `aria-live="polite"` so step changes
 * are announced. `footer`: null hides the controls, a node replaces them,
 * undefined keeps the default 이전/다음 pair. On the last step, providing
 * `onComplete` turns the next button into a primary complete action
 * (`completeLabel`, default '완료').
 */
export function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, onComplete, completeLabel = '완료', children, footer, style, ...rest }) {
  const isControlled = current !== undefined;
  const [internal, setInternal] = React.useState(defaultCurrent);
  const cur = isControlled ? current : internal;
  const go = (n) => { const c = Math.max(0, Math.min(steps.length - 1, n)); if (!isControlled) setInternal(c); onStepChange && onStepChange(c); };
  const isLast = cur === steps.length - 1;
  const nextIsComplete = isLast && typeof onComplete === 'function';
  const nextDisabled = isLast && !nextIsComplete;
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <Steps steps={steps} current={cur} style={{ marginBottom: 'var(--space-8)' }} />
      <div aria-live="polite">{typeof children === 'function' ? children(cur) : children}</div>
      {footer === null ? null : footer !== undefined ? footer : (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button type="button" onClick={() => go(cur - 1)} disabled={cur === 0} style={{ height: 44, padding: '0 18px', border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-normal)', cursor: cur === 0 ? 'not-allowed' : 'pointer', opacity: cur === 0 ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)' }}>이전</button>
          <button type="button" onClick={() => { if (nextIsComplete) { onComplete(); } else { go(cur + 1); } }} disabled={nextDisabled} style={{ height: 44, padding: '0 20px', border: 'none', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-primary-normal)', color: 'var(--color-semantic-static-white)', cursor: nextDisabled ? 'not-allowed' : 'pointer', opacity: nextDisabled ? 0.5 : 1, fontFamily: 'var(--font-sans)', fontSize: 'var(--body2-size)', fontWeight: 'var(--fw-bold)' }}>{nextIsComplete ? completeLabel : '다음'}</button>
        </div>
      )}
    </div>
  );
}
