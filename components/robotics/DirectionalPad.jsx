import React from 'react';

/**
 * LK ROBOTICS — DirectionalPad
 * A D-pad for PTZ / gimbal / jog control. Press-and-hold repeats `onStep(dir)`
 * at `rate` Hz until release; a tap fires once. Directions are up/down/left/
 * right plus an optional centre (home) button. Arrow keys drive it while
 * focused. For discrete stepped motion — pair with Joystick for analog.
 */
const DIRS = {
  up: { d: 'm6 15 6-6 6 6', gc: '2 / 2' },
  left: { d: 'm15 6-6 6 6 6', gc: '3 / 1' },
  right: { d: 'm9 6 6 6-6 6', gc: '3 / 3' },
  down: { d: 'm6 9 6 6 6-6', gc: '4 / 2' },
};

export function DirectionalPad({ onStep, rate = 8, size = 48, disabled = false, center, onCenter, style, ...rest }) {
  const timer = React.useRef(null);
  const stop = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
  React.useEffect(() => stop, []);

  const start = (dir) => {
    if (disabled) return;
    onStep && onStep(dir);
    stop();
    timer.current = setInterval(() => onStep && onStep(dir), Math.max(40, 1000 / rate));
  };

  const btn = (dir) => (
    <button type="button" aria-label={dir} disabled={disabled}
      onPointerDown={(e) => { e.preventDefault(); start(dir); }}
      onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStep && onStep(dir); } }}
      style={{ gridArea: DIRS[dir].gc, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer', background: 'var(--color-semantic-background-elevated-normal)', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', touchAction: 'none', fontFamily: 'var(--font-sans)' }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d={DIRS[dir].d} /></svg>
    </button>
  );

  return (
    <div role="group" aria-label="방향 패드"
      style={{ display: 'grid', gridTemplateColumns: `repeat(3, ${size}px)`, gridTemplateRows: `${size}px repeat(3, ${size}px)`, gap: 6, width: 'fit-content', ...style }} {...rest}>
      {btn('up')}
      {btn('left')}
      <button type="button" aria-label="가운데" disabled={disabled || !onCenter} onClick={() => onCenter && onCenter()}
        style={{ gridArea: '3 / 2', width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--bw-border)', borderRadius: '50%', cursor: onCenter && !disabled ? 'pointer' : 'default', background: 'var(--lk-accent-tint)', color: 'var(--color-semantic-primary-normal)', fontSize: 12, fontWeight: 'var(--fw-bold)', fontFamily: 'var(--font-sans)' }}>
        {center}
      </button>
      {btn('right')}
      {btn('down')}
    </div>
  );
}
