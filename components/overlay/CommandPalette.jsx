import React from 'react';

/**
 * LK ROBOTICS — CommandPalette
 * A ⌘K-style modal with a search field and a filtered command list. Controlled
 * via `open`; Esc / scrim close. Each command runs `onSelect` on click.
 */
export function CommandPalette({ open = false, onClose, commands = [], placeholder = '명령 검색…', style, ...rest }) {
  const [q, setQ] = React.useState('');
  React.useEffect(() => {
    if (!open) return undefined;
    setQ('');
    const onKey = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const filtered = q ? commands.filter((c) => String(c.label).toLowerCase().includes(q.toLowerCase())) : commands;
  return (
    <div role="presentation" onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }} style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '12vh', background: 'var(--scrim-dark)', backdropFilter: 'blur(2px)' }}>
      <div role="dialog" aria-modal="true" style={{ width: '100%', maxWidth: 560, background: 'var(--color-semantic-background-elevated-normal)', borderRadius: 'var(--radius-2xl)', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid var(--color-semantic-line-solid-normal)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-semantic-label-assistive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} aria-label={typeof placeholder === 'string' ? placeholder : '명령 검색'} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--color-semantic-label-normal)' }} />
        </div>
        <div style={{ maxHeight: 340, overflowY: 'auto', padding: 8 }}>
          {filtered.length === 0
            ? <div style={{ padding: 28, textAlign: 'center', color: 'var(--color-semantic-label-alternative)', fontSize: 14 }}>결과 없음</div>
            : filtered.map((c, i) => (
              <button key={i} type="button" onClick={() => { if (onClose) onClose(); c.onSelect && c.onSelect(); }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-semantic-fill-normal)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 'var(--fw-medium)', color: 'var(--color-semantic-label-normal)' }}>
                {c.icon && <span style={{ color: 'var(--color-semantic-primary-normal)', display: 'inline-flex' }}>{c.icon}</span>}
                <span style={{ flex: 1 }}>{c.label}</span>
                {c.shortcut && <span style={{ fontSize: 12, color: 'var(--color-semantic-label-assistive)', fontWeight: 'var(--fw-semibold)' }}>{c.shortcut}</span>}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
