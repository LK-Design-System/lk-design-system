import React from 'react';

function Mini({ children, onClick, disabled, label }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={label} aria-label={label}
      style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-semantic-line-normal-normal)',
        borderRadius: 'var(--radius-sm)', background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-neutral)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, fontFamily: 'inherit', fontSize: 'var(--label2-size)' }}>
      {children}
    </button>
  );
}

/** `label`/`detail` 이 정식 키이고, `title`/`description` 은 호환 별칭입니다. */
function readStep(step) {
  return {
    label: step.label ?? step.title,
    detail: step.detail ?? step.description,
  };
}

/** 버튼 aria-label에 넣을 단계 이름 — 문자열이 아니면 순번으로 대체합니다. */
function stepName(label, index) {
  return typeof label === 'string' && label.trim() ? label : `${index + 1}단계`;
}

/**
 * LK ROBOTICS — StepList
 * An editable, ordered step sequence — task authoring (waypoints, actions).
 * Numbered rows with reorder (↑/↓) + remove, and an optional add row. Emits the
 * next array on every change (controlled).
 *
 * Accessibility — the sequence is a real `ol`/`li` so assistive tech announces
 * position/size (WCAG 1.3.1); the number chip is decorative (`aria-hidden`).
 * Row controls carry the step name so identical labels never repeat (WCAG 2.4.6).
 */
export function StepList({ steps = [], onChange, editable = true, onAdd, addLabel = '단계 추가', label, style, ...rest }) {
  const move = (i, d) => { const j = i + d; if (j < 0 || j >= steps.length) return; const s = [...steps]; const tmp = s[i]; s[i] = s[j]; s[j] = tmp; onChange && onChange(s); };
  const remove = (i) => { onChange && onChange(steps.filter((_, k) => k !== i)); };
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <ol aria-label={label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {steps.map((st, i) => {
          const { label: stepLabel, detail } = readStep(st);
          const name = stepName(stepLabel, i);
          return (
            <li key={st.id != null ? st.id : i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--color-semantic-line-normal-normal)', borderRadius: 'var(--radius-md)', background: 'var(--color-semantic-background-elevated-normal)', marginBottom: 8 }}>
              <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-semantic-primary-surface-normal)', color: 'var(--color-semantic-primary-normal)', fontSize: 'var(--caption1-size)', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--label1-size)', fontWeight: 700, color: 'var(--color-semantic-label-strong)' }}>{stepLabel}</div>
                {detail != null && <div style={{ fontSize: 'var(--caption1-size)', color: 'var(--color-semantic-label-alternative)', marginTop: 'var(--space-0-5)' }}>{detail}</div>}
              </div>
              {editable && (
                <div style={{ display: 'inline-flex', gap: 'var(--space-0-5)', flexShrink: 0 }}>
                  <Mini onClick={() => move(i, -1)} disabled={i === 0} label={`${name} 위로 이동`}>↑</Mini>
                  <Mini onClick={() => move(i, 1)} disabled={i === steps.length - 1} label={`${name} 아래로 이동`}>↓</Mini>
                  <Mini onClick={() => remove(i)} label={`${name} 삭제`}>✕</Mini>
                </div>
              )}
            </li>
          );
        })}
      </ol>
      {editable && onAdd && (
        <button type="button" onClick={onAdd}
          style={{ width: '100%', padding: 'var(--space-2-5)', border: '1px dashed var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--color-semantic-label-alternative)', cursor: 'pointer', fontSize: 'var(--label2-size)', fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
          + {addLabel}
        </button>
      )}
    </div>
  );
}
