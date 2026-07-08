import React from 'react';

/**
 * LK ROBOTICS — FileUpload
 * A dropzone: click or drag files onto a dashed tile. Highlights cyan while
 * dragging; lists chosen filenames. `onFiles` receives a File[].
 */
export function FileUpload({ onFiles, accept, multiple = false, hint = '클릭하거나 파일을 끌어다 놓으세요', disabled = false, style, ...rest }) {
  const inputRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const [names, setNames] = React.useState([]);
  const handle = (files) => { const arr = Array.from(files || []); setNames(arr.map((f) => f.name)); onFiles && onFiles(arr); };
  return (
    <div
      onClick={() => { if (!disabled && inputRef.current) inputRef.current.click(); }}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); if (!disabled) handle(e.dataTransfer.files); }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '32px 20px', textAlign: 'center',
        border: `1.5px dashed ${drag ? 'var(--color-semantic-primary-normal)' : 'var(--bw-border)'}`, borderRadius: 'var(--radius-xl)',
        background: drag ? 'var(--lk-accent-tint)' : 'var(--bw-white)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        fontFamily: 'var(--font-sans)', transition: 'border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)', ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'inline-flex', width: 44, height: 44, borderRadius: 'var(--radius-lg)', background: 'var(--lk-accent-tint)', color: 'var(--color-semantic-primary-normal)', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
      </span>
      <div style={{ fontSize: 14, fontWeight: 'var(--fw-semibold)', color: names.length ? 'var(--color-semantic-label-normal)' : 'var(--color-semantic-label-neutral)', wordBreak: 'break-all' }}>{names.length ? names.join(', ') : hint}</div>
      <input ref={inputRef} type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={(e) => handle(e.target.files)} style={{ display: 'none' }} />
    </div>
  );
}
