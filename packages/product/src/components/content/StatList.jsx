import React from 'react';

/**
 * LK ROBOTICS — StatList
 * A compact inline row of LABELED stats — 팔로워 128 · 팔로잉 64 · 포인트 3,000P —
 * for a profile/account masthead, an org summary, or a resource header.
 *
 * This is the "labeled detail row" a record masthead carries (Lightning's
 * page-header detail fields), not a dashboard metric tile: `Stat` stands a big
 * number over a caption, and `DescriptionList` is a block key/value table with
 * hairline rows and no link support. Here each pair sits inline and can be a
 * link (팔로워 → follower list).
 *
 * Accessibility — the pairs render as a semantic list so assistive tech can
 * announce the count and step through them. A stat with `href` becomes a link
 * whose accessible name joins the label and the value ("팔로워 128"), so a
 * screen-reader user never lands on a bare number with no idea what it counts.
 */
export function StatList({ items = [], size = 'md', style, ...rest }) {
  const rows = Array.isArray(items) ? items.filter(Boolean) : [];
  if (rows.length === 0) return null;

  const fontSize = size === 'sm' ? 'var(--caption1-size)' : 'var(--body2-size)';

  const pair = (item) => (
    <>
      <span style={{ color: 'var(--color-semantic-label-alternative)' }}>{item.label}</span>
      <span style={{ fontWeight: 'var(--fw-bold)', color: 'var(--color-semantic-label-strong)', fontVariantNumeric: 'tabular-nums' }}>
        {item.value}
      </span>
    </>
  );

  return (
    <ul
      role="list"
      style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        gap: 'var(--space-3)', listStyle: 'none', margin: 0, padding: 0,
        fontSize,
        ...style,
      }}
      {...rest}
    >
      {rows.map((item, index) => (
        <li key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0 }}>
          {item.href
            ? (
              <a
                href={item.href}
                aria-label={`${item.label} ${item.value}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color: 'inherit', textDecoration: 'none' }}
              >
                {pair(item)}
              </a>
            )
            : pair(item)}
        </li>
      ))}
    </ul>
  );
}
