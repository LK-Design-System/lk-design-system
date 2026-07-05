import React from 'react';

/**
 * LK ROBOTICS — Footer
 * The site footer, mirroring the live lkrobotics-homepage `LKFooter`: a navy
 * band with a compact legal/info block — contact rows (tel · business reg.),
 * location rows (HQ · R&D · factory), and a copyright line. Defaults carry the
 * real LK company data, so a bare `<Footer />` reproduces the production
 * footer. White-alpha text is fixed (not themed) so the band reads the same in
 * both themes; the surface uses `--surface-inverse` so dark mode lifts it off
 * the page like the rest of the system.
 * Extensions beyond the live site (all opt-in): `columns` link columns +
 * `brand` (marketing growth), `links` policy row, `compact` one-line app
 * footer, `backToTop` floating button (part of the live footer's render).
 */

const DEFAULT_CONTACT = [
  { label: '대표전화', value: '02-3159-2865' },
  { label: '사업자등록번호', value: '391-81-03300' },
];
const DEFAULT_LOCATIONS = [
  { label: '본사', value: '대전광역시 유성구 테크노3로 65, 한신에스메카 633호' },
  { label: 'R&D 센터', value: '서울특별시 마포구 백범로31길 21, 서울창업허브 별관 306호' },
  { label: '공장', value: '경기도 고양시 덕양구 꽃마을로 38, DMC 스타비즈 7st 해링턴타워 613호' },
];
const DEFAULT_COPYRIGHT = 'Copyright ⓒ 2024 - 2026 LK ROBOTICS Inc. All rights reserved.';

function BackToTopButton() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };
  return (
    <button type="button" onClick={toTop} aria-label="맨 위로"
      style={{ position: 'fixed', right: 28, bottom: 28, zIndex: 60, width: 50, height: 50, borderRadius: 999,
        border: '1px solid var(--bw-border)', background: 'var(--bw-white)', color: 'var(--bw-ink)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)',
        opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(8px)', pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 180ms var(--ease-out), transform 180ms var(--ease-out)' }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
    </button>
  );
}

export function Footer({
  contact = DEFAULT_CONTACT, locations = DEFAULT_LOCATIONS, copyright = DEFAULT_COPYRIGHT,
  brand, columns = [], links = [],
  compact = false, backToTop = false, maxWidth = 1280, style, ...rest
}) {
  const [hov, setHov] = React.useState(null);
  const linkEl = (key, l, base, hover, size, weight) => (
    <a key={key} href={l.href || '#'} onMouseEnter={() => setHov(key)} onMouseLeave={() => setHov(null)}
      style={{ fontFamily: 'var(--font-sans)', fontSize: size, fontWeight: weight || 'var(--fw-medium)', lineHeight: 1.5, letterSpacing: 0, textDecoration: 'none', whiteSpace: 'nowrap', color: hov === key ? hover : base, transition: 'color 160ms ease', wordBreak: 'keep-all' }}>{l.label}</a>
  );

  if (compact) {
    return (
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px 24px', flexWrap: 'wrap', padding: '14px 2px', borderTop: '1px solid var(--border-subtle)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
        <span style={{ fontSize: 12.5, letterSpacing: 0, color: 'var(--label-assistive)' }}>{copyright}</span>
        {links.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {links.map((l, i) => linkEl('c' + i, l, 'var(--label-alternative)', 'var(--label-normal)', 12.5))}
          </span>
        )}
      </footer>
    );
  }

  const entryRow = (items) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
      {items.map((it, i) => (
        <span key={i} style={{ whiteSpace: 'nowrap' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.62)', fontWeight: 700 }}>{it.label}</span>{' '}{it.value}
        </span>
      ))}
    </div>
  );

  return (
    <footer style={{ background: 'var(--surface-inverse)', padding: '32px 0 40px', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {backToTop && <BackToTopButton />}
      <div style={{ maxWidth, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box' }}>
        {(brand != null || columns.length > 0) && (
          <React.Fragment>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '36px 48px', paddingTop: 20 }}>
              {brand != null && <div style={{ flex: '1 1 240px', minWidth: 220 }}>{brand}</div>}
              {columns.map((col, ci) => (
                <nav key={ci} aria-label={typeof col.heading === 'string' ? col.heading : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 11, minWidth: 108 }}>
                  {col.heading != null && <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 0, lineHeight: 1.5, color: '#fff', marginBottom: 2, wordBreak: 'keep-all' }}>{col.heading}</span>}
                  {(col.links || []).map((l, li) => linkEl(ci + '-' + li, l, 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.92)', 13.5))}
                </nav>
              ))}
            </div>
            <div style={{ height: 1, background: 'rgba(255, 255, 255, 0.14)', margin: '32px 0 24px' }} />
          </React.Fragment>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, fontSize: 13, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.45)', wordBreak: 'keep-all' }}>
          {contact.length > 0 && entryRow(contact)}
          {locations.length > 0 && entryRow(locations)}
          <span style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 20px', color: 'rgba(255, 255, 255, 0.38)' }}>
            {copyright}
            {links.length > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {links.map((l, i) => linkEl('p' + i, l, 'rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.92)', 12.5))}
              </span>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
