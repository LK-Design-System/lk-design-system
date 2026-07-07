import React from 'react';

/**
 * LK ROBOTICS — Joystick
 * A virtual teleop joystick. Drag the knob within the base; `onChange` streams
 * normalized {x, y} in −1..1 (y positive = up). Snaps back to center on release
 * unless `sticky`. Keyboard-operable: focus + arrow keys nudge, Space/Esc center.
 */
export function Joystick({ size = 160, onChange, onEnd, sticky = false, disabled = false, label, style, ...rest }) {
  const ref = React.useRef(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [active, setActive] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const R = size / 2;
  const knob = Math.round(size * 0.32);
  const max = R - knob / 2 - 4;
  const emit = (x, y) => { setPos({ x, y }); onChange && onChange({ x: +(x / max).toFixed(3), y: +(-y / max).toFixed(3) }); };
  const set = (cx, cy) => {
    const el = ref.current; if (!el) return;
    const b = el.getBoundingClientRect();
    let dx = cx - (b.left + R), dy = cy - (b.top + R);
    const dist = Math.hypot(dx, dy);
    if (dist > max) { dx = (dx / dist) * max; dy = (dy / dist) * max; }
    emit(dx, dy);
  };
  const start = (e) => { if (disabled) return; setActive(true); e.currentTarget.setPointerCapture(e.pointerId); set(e.clientX, e.clientY); };
  const move = (e) => { if (active) set(e.clientX, e.clientY); };
  const end = () => { setActive(false); if (!sticky) emit(0, 0); onEnd && onEnd(); };
  const key = (e) => {
    if (disabled) return;
    const s = max * 0.34; let { x, y } = pos;
    if (e.key === 'ArrowUp') y -= s; else if (e.key === 'ArrowDown') y += s;
    else if (e.key === 'ArrowLeft') x -= s; else if (e.key === 'ArrowRight') x += s;
    else if (e.key === ' ' || e.key === 'Escape') { x = 0; y = 0; } else return;
    e.preventDefault();
    const d = Math.hypot(x, y); if (d > max) { x = (x / d) * max; y = (y / d) * max; }
    emit(x, y);
  };
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, ...style }} {...rest}>
      <div ref={ref} role="application" aria-label={typeof label === 'string' ? label : '조이스틱'} tabIndex={disabled ? -1 : 0}
        onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
        onKeyDown={key} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ position: 'relative', width: size, height: size, borderRadius: '50%', outline: 'none',
          background: 'var(--fill-normal)', border: '1px solid var(--border-subtle)',
          boxShadow: focus ? '0 0 0 4px var(--focus-ring)' : 'inset var(--shadow-sm)', touchAction: 'none',
          cursor: disabled ? 'not-allowed' : (active ? 'grabbing' : 'grab'), opacity: disabled ? 0.5 : 1 }}>
        <span style={{ position: 'absolute', left: '50%', top: 10, bottom: 10, width: 1, background: 'var(--line-neutral)', transform: 'translateX(-0.5px)' }} />
        <span style={{ position: 'absolute', top: '50%', left: 10, right: 10, height: 1, background: 'var(--line-neutral)', transform: 'translateY(-0.5px)' }} />
        <span style={{ position: 'absolute', left: '50%', top: '50%', width: knob, height: knob, marginLeft: -knob / 2, marginTop: -knob / 2, borderRadius: '50%',
          background: 'var(--lk-accent-ink)', boxShadow: 'var(--shadow-control)',
          transform: `translate(${pos.x}px, ${pos.y}px)`, transition: active ? 'none' : 'transform var(--dur-base) var(--ease-out)' }} />
      </div>
      {label != null && <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--label-alternative)' }}>{label}</span>}
    </div>
  );
}
