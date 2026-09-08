import React from 'react';

/**
 * LK Product Extension — DotMatrixPreview
 * Renders a 1-bit dot-matrix frame (LED sign, robot side panel, marquee) the
 * way the physical panel will show it: fixed columns × rows geometry, lit
 * pixels in the panel colour scaled by brightness, unlit pixels as faint dots.
 * The component owns the panel chrome and the accessible text alternative.
 * Rasterising text into the bitmap, the wire encoding and the transport stay
 * with the product.
 */

const DOT_SIZE = 6;
const DOT_GAP = 1;

function normalizeHex(color) {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(color ?? '').trim());
  return match ? match[1].toLowerCase() : 'ffffff';
}

function channel(hex, offset, ratio) {
  return Math.round(parseInt(hex.slice(offset, offset + 2), 16) * ratio);
}

function isLit(bitmap, pixels, index) {
  if (pixels) return Boolean(pixels[index]);
  if (!bitmap) return false;
  const byte = bitmap[index >> 3];
  return byte != null && (byte & (1 << (7 - (index & 7)))) !== 0;
}

function countLitPixels({ columns, rows, bitmap, pixels }) {
  let count = 0;
  for (let index = 0; index < columns * rows; index += 1) if (isLit(bitmap, pixels, index)) count += 1;
  return count;
}

export const DotMatrixPreview = React.forwardRef(function DotMatrixPreview({
  columns = 128,
  rows = 32,
  bitmap,
  pixels,
  color = '#ffffff',
  brightness = 255,
  label,
  description,
  status,
  dotShape = 'square',
  emptyLabel = '꺼진 화면',
  style,
  ...rest
}, ref) {
  const canvasRef = React.useRef(null);
  const hex = normalizeHex(color);
  const ratio = Math.min(1, Math.max(0, Number(brightness) / 255));
  const litCount = React.useMemo(() => countLitPixels({ columns, rows, bitmap, pixels }), [columns, rows, bitmap, pixels]);
  const isEmpty = litCount === 0;

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = columns * DOT_SIZE;
    const height = rows * DOT_SIZE;
    ctx.fillStyle = '#08090c';
    ctx.fillRect(0, 0, width, height);
    const on = `rgb(${channel(hex, 0, ratio)}, ${channel(hex, 2, ratio)}, ${channel(hex, 4, ratio)})`;
    const off = 'rgba(255, 255, 255, 0.06)';
    const size = DOT_SIZE - DOT_GAP;
    const radius = size / 2;
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const lit = isLit(bitmap, pixels, y * columns + x);
        ctx.fillStyle = lit ? on : off;
        const px = x * DOT_SIZE;
        const py = y * DOT_SIZE;
        if (dotShape === 'round') {
          ctx.beginPath();
          ctx.arc(px + radius, py + radius, radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(px, py, size, size);
        }
      }
    }
  }, [columns, rows, bitmap, pixels, hex, ratio, dotShape]);

  const summary = isEmpty ? emptyLabel : (description ?? `${litCount}개 픽셀 켜짐`);
  const percent = Math.round(ratio * 100);
  const accessibleName = `${label}${description && !isEmpty ? `: ${description}` : isEmpty ? `: ${emptyLabel}` : ''}, 밝기 ${percent}%`;

  return (
    <figure
      ref={ref}
      data-dot-matrix-preview=""
      data-empty={isEmpty || undefined}
      style={{
        display: 'grid',
        gap: 'var(--space-2)',
        margin: 0,
        minWidth: 0,
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-semantic-label-normal)',
        ...style,
      }}
      {...rest}
    >
      <figcaption style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2) var(--space-3)', flexWrap: 'wrap', minWidth: 0 }}>
        <span style={{ fontSize: 'var(--label1-size)', lineHeight: 'var(--label1-line)', fontWeight: 'var(--fw-semibold)', color: 'var(--color-semantic-label-strong)', minWidth: 0, overflowWrap: 'anywhere' }}>
          {label}
        </span>
        {status != null && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>{status}</span>}
      </figcaption>
      <div
        data-slot="panel"
        style={{
          padding: 'var(--space-2)',
          background: '#08090c',
          border: '1px solid var(--color-semantic-line-solid-_strong, var(--color-semantic-line-solid-normal))',
          borderRadius: 'var(--radius-md)',
          minWidth: 0,
        }}
      >
        <canvas
          ref={canvasRef}
          width={columns * DOT_SIZE}
          height={rows * DOT_SIZE}
          role="img"
          aria-label={accessibleName}
          data-lit-pixels={litCount}
          style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: `${columns} / ${rows}`, imageRendering: 'pixelated' }}
        >
          {accessibleName}
        </canvas>
      </div>
      <div
        data-slot="summary"
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 'var(--space-2) var(--space-3)',
          flexWrap: 'wrap',
          minWidth: 0,
          fontSize: 'var(--caption1-size)',
          lineHeight: 'var(--caption1-line)',
          color: 'var(--color-semantic-label-alternative)',
        }}
      >
        <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{summary}</span>
        <span style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{columns}×{rows} · 밝기 {percent}%</span>
      </div>
    </figure>
  );
});
