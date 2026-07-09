import React from 'react';

/**
 * LK ROBOTICS — PropertyField
 * A single tunable parameter row: label + control + a per-field Apply that only
 * enables once the value differs from the committed baseline (dirty tracking).
 * `type` = 'number' | 'text' | 'toggle'; `onApply(value)` commits. Used for
 * nav-tuning / settings panels where each param is applied independently.
 */
export function PropertyField({ label, hint, value: committed, type = 'text', min, max, step = 1, unit, onApply, style, ...rest }) {
  const [draft, setDraft] = React.useState(committed);
  React.useEffect(() => { setDraft(committed); }, [committed]);
  const dirty = draft !== committed;
  const apply = () => { if (dirty) onApply && onApply(draft); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 1fr) auto auto', alignItems: 'center', gap: 10, padding: '8px 0', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ display: 'grid', gap: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13.5, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-normal)' }}>{label}{dirty && <span aria-label="변경됨" style={{ color: 'var(--color-semantic-status-cautionary)' }}> •</span>}</span>
        {hint != null && <span style={{ fontSize: 11.5, color: 'var(--color-semantic-label-alternative)' }}>{hint}</span>}
      </div>

      {type === 'toggle' ? (
        <button type="button" role="switch" aria-checked={!!draft} aria-label={String(label)} onClick={() => setDraft(!draft)}
          style={{ width: 52, height: 26, borderRadius: 'var(--radius-pill)', border: 'none', cursor: 'pointer', position: 'relative', background: draft ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-interaction-inactive)', transition: 'background var(--dur-fast) var(--ease-out)' }}>
          <span aria-hidden="true" style={{ position: 'absolute', top: 3, left: draft ? 29 : 3, width: 20, height: 20, borderRadius: '50%', background: 'var(--color-semantic-static-white)', transition: 'left var(--dur-fast) var(--ease-out)' }} />
        </button>
      ) : (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <input type={type === 'number' ? 'number' : 'text'} value={draft ?? ''} min={min} max={max} step={step} aria-label={String(label)}
            onChange={(e) => setDraft(type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') apply(); }}
            style={{ width: type === 'number' ? 88 : 160, height: 34, padding: '0 10px', border: `1px solid ${dirty ? 'var(--color-semantic-primary-normal)' : 'var(--bw-border)'}`, borderRadius: 'var(--radius-md)', outline: 'none', background: 'var(--bw-white)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-normal)', textAlign: type === 'number' ? 'right' : 'left', fontVariantNumeric: 'tabular-nums' }} />
          {unit != null && <span style={{ fontSize: 12.5, color: 'var(--color-semantic-label-alternative)' }}>{unit}</span>}
        </span>
      )}

      <button type="button" onClick={apply} disabled={!dirty} aria-label={`${label} 적용`}
        style={{ height: 32, padding: '0 12px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: dirty ? 'pointer' : 'not-allowed', fontFamily: 'inherit', fontSize: 13, fontWeight: 'var(--fw-bold)',
          background: dirty ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-interaction-disable)', color: dirty ? 'var(--component-button-primary-fg)' : 'var(--color-semantic-label-disable)' }}>
        적용
      </button>
    </div>
  );
}
