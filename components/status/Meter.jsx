import React from 'react';

const THRESHOLD_FILL = {
  negative: 'var(--color-semantic-status-negative)',
  cautionary: 'var(--color-semantic-status-cautionary)',
  positive: 'var(--color-semantic-status-positive)',
};

const THRESHOLD_TEXT = {
  negative: 'var(--color-semantic-status-negative-text)',
  cautionary: 'var(--color-semantic-status-cautionary-text)',
  positive: 'var(--color-semantic-status-positive-text)',
};

const DEFAULT_THRESHOLD_LABELS = {
  negative: '위험',
  cautionary: '주의',
  positive: '양호',
};

const valueStyle = { fontVariantNumeric: 'tabular-nums', color: 'var(--color-semantic-label-alternative)' };

/**
 * LK ROBOTICS — Meter
 * A labelled value bar with optional thresholds (완료율, 품질). Without
 * thresholds it uses the signal ink; with `{ low, high }` (percent) it steps
 * red → amber → steel-green.
 *
 * Accessibility: a bounded measurement is `role="meter"`, not
 * `role="progressbar"` — a progressbar reports how far a *task* has advanced.
 * That role cannot be expressed through `ProgressBar` (which owns
 * `role="progressbar"`), so Meter renders the track itself with the same
 * geometry ProgressBar would have produced (Meter sm → 6px, md → 10px) and owns
 * `aria-valuenow/min/max` in the caller's own `value`/`max` units so the spoken
 * value matches the visible `value/max` caption even when `max !== 100`.
 * The threshold band is never color-only: it is announced through
 * `aria-valuetext` and printed as a word next to the value (WCAG 1.4.1).
 */
export function Meter({
  value = 0,
  max = 100,
  label,
  thresholds,
  thresholdLabels,
  size = 'md',
  showValue = true,
  style,
  'aria-label': ariaLabelProp,
  'aria-labelledby': ariaLabelledBy,
  'aria-valuetext': ariaValueText,
  ...rest
}) {
  const rawId = React.useId();
  const labelId = `${rawId}-label`;
  const safeMax = Number(max) || 0;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const clampedValue = Math.max(0, Math.min(safeMax, Number(value) || 0));
  const band = thresholds
    ? (pct <= thresholds.low ? 'negative' : pct <= thresholds.high ? 'cautionary' : 'positive')
    : null;
  const bandLabel = band ? { ...DEFAULT_THRESHOLD_LABELS, ...thresholdLabels }[band] : null;
  const fill = band ? THRESHOLD_FILL[band] : 'var(--color-semantic-primary-normal)';
  const height = size === 'sm' ? 6 : 10;
  const valueText = `${value}/${max}`;
  const hasVisibleLabel = label != null;
  /* The caption row also carries the threshold word, so it stays mounted while
     a band is active even when the caller hides the numeric readout. */
  const showCaption = hasVisibleLabel || showValue || bandLabel != null;

  return (
    <div style={{ ...style }} {...rest}>
      {showCaption && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6, fontFamily: 'var(--font-sans)', fontSize: 'var(--label2-size)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-neutral)' }}>
          <span id={hasVisibleLabel ? labelId : undefined}>{label}</span>
          {/* Without a threshold the caption keeps its original two-cell shape;
              the band word only introduces a wrapper when there is one. */}
          {bandLabel == null
            ? showValue && <span style={valueStyle}>{valueText}</span>
            : (
              <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, minWidth: 0 }}>
                {showValue && <span style={valueStyle}>{valueText}</span>}
                <span data-meter-threshold={band} style={{ color: THRESHOLD_TEXT[band], whiteSpace: 'nowrap' }}>{bandLabel}</span>
              </span>
            )}
        </div>
      )}
      <div
        role="meter"
        aria-label={ariaLabelProp ?? (hasVisibleLabel || ariaLabelledBy ? undefined : '측정값')}
        aria-labelledby={ariaLabelledBy ?? (ariaLabelProp == null && hasVisibleLabel ? labelId : undefined)}
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuetext={ariaValueText ?? (bandLabel != null ? `${valueText}, ${bandLabel}` : valueText)}
        style={{ position: 'relative', height, borderRadius: 'var(--radius-pill)', background: 'var(--color-semantic-fill-strong)', overflow: 'hidden' }}
      >
        <span style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${pct}%`, background: fill, borderRadius: 'var(--radius-pill)', transition: 'width var(--dur-base) var(--ease-out)' }} />
      </div>
    </div>
  );
}
