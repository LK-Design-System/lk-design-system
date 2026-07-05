import React from 'react';

function TableRow({ columns, row, pad, hover }) {
  const [h, setH] = React.useState(false);
  return (
    <tr
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ background: hover && h ? 'var(--fill-alt)' : 'transparent', transition: 'background var(--dur-fast) var(--ease-out)' }}
    >
      {columns.map((c) => (
        <td key={c.key} style={{ textAlign: c.align || 'left', padding: pad, borderBottom: '1px solid var(--bw-border)', fontSize: 14.5, color: 'var(--label-neutral)', whiteSpace: 'nowrap' }}>
          {typeof c.render === 'function' ? c.render(row) : row[c.key]}
        </td>
      ))}
    </tr>
  );
}

/**
 * LK ROBOTICS — Table
 * A calm data table: uppercase caption headers on a hairline, tabular rows with
 * a soft hover wash. `columns` describe each field; `render` a cell for custom
 * content (status dots, links). Scrolls horizontally on overflow.
 */
export function Table({ columns = [], rows = [], size = 'md', hover = true, style, ...rest }) {
  const pad = size === 'sm' ? '10px 12px' : '14px 16px';
  return (
    <div style={{ overflowX: 'auto', ...style }} {...rest}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ textAlign: c.align || 'left', padding: pad, borderBottom: '1px solid var(--bw-border)', fontSize: 12, fontWeight: 'var(--fw-bold)', letterSpacing: '0.4px', textTransform: 'uppercase', color: 'var(--label-alternative)', width: c.width, whiteSpace: 'nowrap' }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => <TableRow key={ri} columns={columns} row={r} pad={pad} hover={hover} />)}
        </tbody>
      </table>
    </div>
  );
}
