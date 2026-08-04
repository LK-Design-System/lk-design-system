import React from 'react';
import { Icon } from '../icon/Icon.jsx';

/**
 * LK ROBOTICS — Footer
 * The site footer: a navy band with a compact legal/info block — contact rows (tel · business reg.),
 * location rows (HQ · R&D · factory), and a copyright line. Defaults carry the
 * real LK company data, so a bare `<Footer />` produces the standard footer.
 * White-alpha text is fixed (not themed) so the band reads the same in
 * both themes; the surface uses `--color-semantic-inverse-background` so dark mode lifts it off
 * the page like the rest of the system.
 * Extensions beyond the live site (all opt-in): `columns` link columns +
 * `brand` (marketing growth), `links` policy row, `compact` one-line app
 * footer, `backToTop` floating button.
 * A11y: column headings carry role="heading"/aria-level 3, link groups render
 * as ul/li, and href-less links render as plain text (no `href="#"` fallback).
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

const plainList = { listStyle: 'none', margin: 0, padding: 0 };
// One spacing value for a link column: heading→list and link→link read as the same rhythm.
const linkColumnGap = 11;

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
      style={{ position: 'fixed', right: 28, bottom: 28, zIndex: 60, width: 50, height: 50, borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--color-semantic-line-solid-normal)', background: 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-label-normal)', cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)',
        opacity: show ? 1 : 0, transform: show ? 'none' : 'translateY(8px)', pointerEvents: show ? 'auto' : 'none',
        transition: 'opacity 180ms var(--ease-out), transform 180ms var(--ease-out)' }}>
      <Icon name="chevron-up" size={22} aria-hidden="true" />
    </button>
  );
}

export function Footer({
  contact = DEFAULT_CONTACT, locations = DEFAULT_LOCATIONS, copyright = DEFAULT_COPYRIGHT,
  brand, columns = [], links = [],
  compact = false, backToTop = false, maxWidth = 1280, style, ...rest
}) {
  const [hov, setHov] = React.useState(null);
  const linkEl = (key, l, base, hover, size, weight) => {
    const typography = { fontFamily: 'var(--font-sans)', fontSize: size, fontWeight: weight || 'var(--fw-medium)', lineHeight: 1.5, letterSpacing: 0, whiteSpace: 'nowrap', wordBreak: 'keep-all' };
    if (l.href == null) {
      /* href 없는 항목은 탐색 부작용 없는 일반 텍스트로 렌더한다(가짜 '#' 링크 금지). */
      return <span key={key} style={{ ...typography, color: base }}>{l.label}</span>;
    }
    return (
      <a key={key} href={l.href} onMouseEnter={() => setHov(key)} onMouseLeave={() => setHov(null)}
        style={{ ...typography, textDecoration: 'none', color: hov === key ? hover : base, transition: 'color 160ms ease' }}>{l.label}</a>
    );
  };

  if (compact) {
    return (
      <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px 24px', flexWrap: 'wrap', padding: '14px 2px', borderTop: '1px solid var(--color-semantic-line-normal-normal)', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
        <span style={{ fontSize: 'var(--caption1-size)', letterSpacing: 0, color: 'var(--color-semantic-label-alternative)' }}>{copyright}</span>
        {links.length > 0 && (
          <ul style={{ ...plainList, display: 'flex', alignItems: 'center', gap: 'var(--space-4-5)' }}>
            {links.map((l, i) => (
              <li key={i} style={{ display: 'inline-flex' }}>
                {linkEl('c' + i, l, 'var(--color-semantic-label-alternative)', 'var(--color-semantic-label-normal)', 'var(--caption1-size)')}
              </li>
            ))}
          </ul>
        )}
      </footer>
    );
  }

  const entryRow = (items) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
      {items.map((it, i) => (
        <span key={i} style={{ whiteSpace: 'nowrap' }}>
          <span style={{ color: 'var(--color-semantic-inverse-label-neutral-soft)', fontWeight: 700 }}>{it.label}</span>{' '}{it.value}
        </span>
      ))}
    </div>
  );

  return (
    <footer style={{ background: 'var(--color-semantic-inverse-background)', padding: '32px 0 40px', fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {backToTop && <BackToTopButton />}
      <div style={{ maxWidth, margin: '0 auto', padding: '0 32px', boxSizing: 'border-box' }}>
        {(brand != null || columns.length > 0) && (
          <React.Fragment>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '32px 48px', paddingTop: 20 }}>
              {brand != null && <div style={{ flex: '1 1 240px', minWidth: 220 }}>{brand}</div>}
              {columns.map((col, ci) => (
                <nav key={ci} aria-label={typeof col.heading === 'string' ? col.heading : undefined} style={{ display: 'flex', flexDirection: 'column', gap: linkColumnGap, minWidth: 108 }}>
                  {col.heading != null && <span role="heading" aria-level={3} style={{ fontSize: 'var(--body2-size)', fontWeight: 800, letterSpacing: 0, lineHeight: 1.5, color: 'var(--color-semantic-inverse-label)', marginBottom: 'var(--space-0-5)', wordBreak: 'keep-all' }}>{col.heading}</span>}
                  {(col.links || []).length > 0 && (
                    <ul style={{ ...plainList, display: 'flex', flexDirection: 'column', gap: linkColumnGap }}>
                      {(col.links || []).map((l, li) => (
                        <li key={li} style={{ display: 'flex' }}>
                          {linkEl(ci + '-' + li, l, 'var(--color-semantic-inverse-label-alternative-soft)', 'var(--color-semantic-inverse-label-strong-soft)', 'var(--label2-size)')}
                        </li>
                      ))}
                    </ul>
                  )}
                </nav>
              ))}
            </div>
            <div style={{ height: 1, background: 'var(--color-semantic-inverse-line-normal)', margin: '32px 0 24px' }} />
          </React.Fragment>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8, fontSize: 'var(--label2-size)', lineHeight: 1.6, color: 'var(--color-semantic-inverse-label-neutral-soft)', wordBreak: 'keep-all' }}>
          {contact.length > 0 && entryRow(contact)}
          {locations.length > 0 && entryRow(locations)}
          <div style={{ marginTop: 'var(--space-4-5)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 20px', color: 'var(--color-semantic-inverse-label-alternative-soft)' }}>
            {copyright}
            {links.length > 0 && (
              <ul style={{ ...plainList, display: 'flex', alignItems: 'center', gap: 16 }}>
                {links.map((l, i) => (
                  <li key={i} style={{ display: 'inline-flex' }}>
                    {linkEl('p' + i, l, 'var(--color-semantic-inverse-label-alternative-soft)', 'var(--color-semantic-inverse-label-strong-soft)', 'var(--caption1-size)')}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
