import React from 'react';

/**
 * LK ROBOTICS — FileBrowser
 * Server-side file / directory navigator. Presentational: the host supplies the
 * current `path`, `entries` ([{name, type:'dir'|'file', size}]), and handles
 * `onOpen(dir)` / `onUp` / `onSelect(entry)`. Renders a breadcrumb path bar, an
 * up control, and a typed row list. Pairs with a Modal for a "pick a folder".
 */
const FolderIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>;
const FileIcon = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>;

export function FileBrowser({ path = '/', entries = [], selected, onOpen, onUp, onSelect, height = 300, style, ...rest }) {
  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', width: 420, border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bw-white)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderBottom: '1px solid var(--bw-border)', background: 'var(--color-semantic-background-elevated-alternative)' }}>
        <button type="button" onClick={onUp} aria-label="상위 폴더" disabled={path === '/' || !onUp}
          style={{ width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--bw-border)', borderRadius: 'var(--radius-sm)', background: 'var(--bw-white)', cursor: path === '/' ? 'not-allowed' : 'pointer', color: 'var(--color-semantic-label-neutral)', fontFamily: 'inherit', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
        </button>
        <code style={{ fontSize: 12.5, color: 'var(--color-semantic-label-neutral)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', direction: 'rtl', textAlign: 'left', flex: 1 }}>{path}</code>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 4, overflow: 'auto', maxHeight: height }}>
        {entries.length === 0 && <li style={{ padding: '18px 10px', textAlign: 'center', color: 'var(--color-semantic-label-assistive)', fontSize: 13 }}>비어 있습니다</li>}
        {entries.map((e) => {
          const isDir = e.type === 'dir';
          const isSel = selected != null && selected === e.name;
          return (
            <li key={e.name}>
              <button type="button"
                onClick={() => (isDir ? onOpen && onOpen(e) : onSelect && onSelect(e))}
                onDoubleClick={() => (!isDir && onOpen ? undefined : undefined)}
                style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', height: 34, padding: '0 8px', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', textAlign: 'left', background: isSel ? 'var(--lk-accent-tint)' : 'transparent', color: 'var(--color-semantic-label-normal)', fontFamily: 'inherit' }}>
                <span aria-hidden="true" style={{ display: 'inline-flex', color: isDir ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-label-assistive)', flexShrink: 0 }}>{isDir ? FolderIcon : FileIcon}</span>
                <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: isDir ? 'var(--fw-semibold)' : 'var(--fw-medium)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
                {e.size != null && !isDir && <span style={{ fontSize: 11.5, color: 'var(--color-semantic-label-assistive)', fontVariantNumeric: 'tabular-nums' }}>{e.size}</span>}
                {isDir && <span aria-hidden="true" style={{ color: 'var(--color-semantic-label-assistive)' }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg></span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
