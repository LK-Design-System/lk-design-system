import React from 'react';

/**
 * LK ROBOTICS — HistoryToolbar
 * Undo / redo / reset controls for editors, wired to a history state
 * (`canUndo` / `canRedo` gate the buttons; optional `count` shows the depth).
 */
export function HistoryToolbar({ canUndo = false, canRedo = false, onUndo, onRedo, onReset, count, style, ...rest }) {
  const base = { width: 34, height: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)', background: 'var(--surface-raised)', color: 'var(--label-neutral)', fontSize: 15, fontWeight: 700 };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <button type="button" disabled={!canUndo} onClick={onUndo} title="실행 취소" aria-label="실행 취소" style={{ ...base, cursor: canUndo ? 'pointer' : 'not-allowed', opacity: canUndo ? 1 : 0.4 }}>↶</button>
      <button type="button" disabled={!canRedo} onClick={onRedo} title="다시 실행" aria-label="다시 실행" style={{ ...base, cursor: canRedo ? 'pointer' : 'not-allowed', opacity: canRedo ? 1 : 0.4 }}>↷</button>
      {onReset && <button type="button" onClick={onReset} title="초기화" aria-label="초기화" style={{ ...base, cursor: 'pointer' }}>⟲</button>}
      {typeof count === 'number' && <span style={{ fontSize: 11.5, color: 'var(--label-assistive)', fontVariantNumeric: 'tabular-nums', marginLeft: 4 }}>{count} 단계</span>}
    </div>
  );
}
