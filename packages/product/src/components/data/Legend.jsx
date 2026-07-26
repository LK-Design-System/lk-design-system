import React from 'react';
import { VisuallyHidden } from '@lk-robotics/lds-core/components/layout/VisuallyHidden';

/* `muted` and `disabled` used to render identically (same label ink, same 0.45
   swatch opacity), so the two contracted meanings were only distinguishable by
   guessing. `disabled` now also strikes the label through, which is a shape
   cue rather than a color cue (WCAG 1.4.1), and both states carry a short
   spoken suffix because `aria-disabled` is not supported on `listitem`. */
const STATE_LABEL = {
  disabled: '표시 꺼짐',
  muted: '강조 낮음',
};

const SIZE = {
  sm: {
    fontSize: 'var(--caption1-size)',
    lineHeight: 'var(--caption1-line)',
    marker: 8,
    square: 10,
    line: 16,
    gap: 'var(--space-1-5)',
    rowGap: 'var(--space-1)',
    columnGap: 'var(--space-3)',
  },
  md: {
    fontSize: 'var(--label2-size)',
    lineHeight: 'var(--label2-line)',
    marker: 10,
    square: 12,
    line: 20,
    gap: 'var(--space-2)',
    rowGap: 'var(--space-2)',
    columnGap: 'var(--space-4)',
  },
};

function getItemKey(item, index) {
  if (item.id != null) return item.id;
  return typeof item.label === 'string' ? item.label : index;
}

function Swatch({ shape = 'square', color, dashed = false, disabled = false, size }) {
  const cfg = SIZE[size] || SIZE.md;
  const opacity = disabled ? 0.45 : 1;

  if (shape === 'line') {
    return (
      <span
        aria-hidden="true"
        style={{
          width: cfg.line,
          height: 0,
          borderTop: `2px ${dashed ? 'dashed' : 'solid'} ${color}`,
          borderRadius: 2,
          opacity,
          flexShrink: 0,
        }}
      />
    );
  }

  const isDot = shape === 'dot';
  const boxSize = isDot ? cfg.marker : cfg.square;

  return (
    <span
      aria-hidden="true"
      style={{
        width: boxSize,
        height: boxSize,
        // radius-sm (6px) meets or exceeds half of the 10-12px swatch box, which
        // rounds the square into a circle and collapses the shape vocabulary —
        // keep the same 2px softening the line swatch uses so square reads square.
        borderRadius: isDot ? '50%' : 2,
        background: color,
        opacity,
        flexShrink: 0,
      }}
    />
  );
}

/**
 * LDS Product Data — Legend
 * Compact color key for maps, charts, and diagrams. Each item is
 * {id?, label, color, shape, dashed?, value?, muted?, disabled?}. It stays
 * presentational and pairs with chart/map components rather than owning data.
 */
export function Legend({
  items = [],
  direction = 'horizontal',
  size = 'md',
  emptyLabel,
  style,
  'aria-label': ariaLabel,
  ...rest
}) {
  const vertical = direction === 'vertical';
  const cfg = SIZE[size] || SIZE.md;
  const hasItems = items.length > 0;

  return (
    <ul
      aria-label={ariaLabel || '범례'}
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: vertical ? 'column' : 'row',
        flexWrap: vertical ? 'nowrap' : 'wrap',
        alignItems: vertical ? 'stretch' : 'center',
        rowGap: cfg.rowGap,
        columnGap: cfg.columnGap,
        fontFamily: 'var(--font-sans)',
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {!hasItems && emptyLabel != null && (
        <li
          style={{
            color: 'var(--color-semantic-label-alternative)',
            fontSize: cfg.fontSize,
            lineHeight: cfg.lineHeight,
            fontWeight: 'var(--fw-medium)',
            letterSpacing: 0,
          }}
        >
          {emptyLabel}
        </li>
      )}

      {items.map((item, index) => {
        const disabled = !!item.disabled;
        const muted = !!item.muted || disabled;
        const itemColor = muted
          ? 'var(--color-semantic-label-alternative)'
          : 'var(--color-semantic-label-neutral)';

        const state = disabled ? 'disabled' : (item.muted ? 'muted' : undefined);

        return (
          <li
            key={getItemKey(item, index)}
            data-legend-state={state}
            style={{
              display: vertical ? 'grid' : 'inline-flex',
              gridTemplateColumns: vertical ? `${cfg.line}px minmax(0, 1fr) auto` : undefined,
              alignItems: 'center',
              gap: cfg.gap,
              minWidth: 0,
              color: itemColor,
              fontSize: cfg.fontSize,
              lineHeight: cfg.lineHeight,
              fontWeight: 'var(--fw-medium)',
              letterSpacing: 0,
              opacity: 1,
            }}
          >
            <Swatch
              shape={item.shape}
              color={item.color}
              dashed={item.dashed}
              disabled={muted}
              size={size}
            />
            <span
              data-legend-label
              style={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textDecoration: disabled ? 'line-through' : undefined,
              }}
            >
              {item.label}
              {state && <VisuallyHidden>{` (${STATE_LABEL[state]})`}</VisuallyHidden>}
            </span>
            {item.value != null && (
              <span
                style={{
                  color: muted
                    ? 'var(--color-semantic-label-alternative)'
                    : 'var(--color-semantic-label-alternative)',
                  fontVariantNumeric: 'tabular-nums',
                  justifySelf: 'end',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.value}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
