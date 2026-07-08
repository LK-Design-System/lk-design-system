import React from 'react';

function Mini({ children, onClick, disabled, label }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={label} aria-label={label}
      style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-neutral)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, fontSize: 13 }}>
      {children}
    </button>
  );
}

/**
 * LK ROBOTICS — StepList
 * An editable, ordered step sequence — task authoring (waypoints, actions).
 * Numbered rows with reorder (↑/↓) + remove, and an optional add row. Emits the
 * next array on every change (controlled).
 */
export function StepList({ steps = [], onChange, editable = true, onAdd, addLabel = '단계 추가', style, ...rest }) {
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= steps.length) return; const s = [...steps]; const tmp = s[i]; s[i] = s[j]; s[j] = tmp; onChange && onChange(s); };
  const remove = (i) => { onChange && onChange(steps.filter((_, k) => k !== i)); };
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {steps.map((st, i) => (
        <div key={st.id != null ? st.id : i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', marginBottom: 8 }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--lk-accent-tint)', color: 'var(--color-semantic-primary-normal)', fontSize: 12, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-semantic-label-strong)' }}>{st.label}</div>
            {st.detail != null && <div style={{ fontSize: 12.5, color: 'var(--color-semantic-label-alternative)', marginTop: 1 }}>{st.detail}</div>}
          </div>
          {editable && (
            <div style={{ display: 'inline-flex', gap: 2, flexShrink: 0 }}>
              <Mini onClick={() => move(i, -1)} disabled={i === 0} label="위로">↑</Mini>
              <Mini onClick={() => move(i, 1)} disabled={i === steps.length - 1} label="아래로">↓</Mini>
              <Mini onClick={() => remove(i)} label="삭제">✕</Mini>
            </div>
          )}
        </div>
      ))}
      {editable && onAdd && (
        <button type="button" onClick={onAdd}
          style={{ width: '100%', padding: 10, border: '1px dashed var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--color-semantic-label-alternative)', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
          + {addLabel}
        </button>
      )}
    </div>
  );
}
