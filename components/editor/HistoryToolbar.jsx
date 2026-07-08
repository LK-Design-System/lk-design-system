import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — HistoryToolbar
 * Undo / redo / reset controls for editors, wired to a history state
 * (`canUndo` / `canRedo` gate the buttons; `onReset` adds the reset button).
 */
export function HistoryToolbar({ canUndo = false, canRedo = false, onUndo, onRedo, onReset, style, ...rest }) {
  const base = { width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-semantic-line-normal-normal)',
    borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-neutral)', lineHeight: 0 };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <button type="button" disabled={!canUndo} onClick={onUndo} title="실행 취소" aria-label="실행 취소" style={{ ...base, cursor: canUndo ? 'pointer' : 'not-allowed', opacity: canUndo ? 1 : 0.4 }}><Icon name="flip-backward" size={16} aria-hidden="true" /></button>
      <button type="button" disabled={!canRedo} onClick={onRedo} title="다시 실행" aria-label="다시 실행" style={{ ...base, cursor: canRedo ? 'pointer' : 'not-allowed', opacity: canRedo ? 1 : 0.4 }}><span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}><Icon name="flip-backward" size={16} aria-hidden="true" /></span></button>
      {onReset && <button type="button" onClick={onReset} title="초기화" aria-label="초기화" style={{ ...base, cursor: 'pointer' }}><Icon name="reset" size={16} aria-hidden="true" /></button>}
    </div>
  );
}
