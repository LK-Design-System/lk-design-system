import React from 'react';
import { thStyle, tdStyle } from './table-cell-styles.js';

function TableRow({ columns, row, pad, hover, rowHeaderKey }) {
  const [h, setH] = React.useState(false);
  return (
    <tr
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ background: hover && h ? 'var(--color-semantic-fill-alternative)' : 'transparent', transition: 'background var(--dur-fast) var(--ease-out)' }}
    >
      {columns.map((c) => {
        const content = typeof c.render === 'function' ? c.render(row) : row[c.key];
        const cellStyle = { ...tdStyle(pad), textAlign: c.align || 'left' };
        // WCAG 1.3.1 / APG Table pattern: the cell that identifies the row is a
        // row header, so a screen reader can read it back with every other cell
        // of that row. Presentation stays identical to a data cell (the <th>
        // user-agent bold is reset) — only the semantics change.
        if (rowHeaderKey != null && c.key === rowHeaderKey) {
          return <th key={c.key} scope="row" style={{ ...cellStyle, fontWeight: 'inherit' }}>{content}</th>;
        }
        return <td key={c.key} style={cellStyle}>{content}</td>;
      })}
    </tr>
  );
}

/**
 * LK ROBOTICS — Table
 * A calm data table: uppercase caption headers on a hairline, tabular rows with
 * a soft hover wash. `columns` describe each field; `render` a cell for custom
 * content (status dots, links). Scrolls horizontally on overflow.
 *
 * Accessibility — column headers carry `scope="col"` and `rowHeaderKey` promotes
 * the identifying cell of each row to `<th scope="row">`, so header/data
 * association survives linearised reading (WCAG 1.3.1, APG Table pattern). The
 * table itself is named by a visible `<caption>`, or by `tableLabel` /
 * `tableLabelledBy` when the title already lives outside the table.
 */
export function Table({
  columns = [],
  rows = [],
  size = 'md',
  hover = true,
  caption,
  tableLabel,
  tableLabelledBy,
  rowHeaderKey,
  getRowId,
  style,
  ...rest
}) {
  const pad = size === 'sm' ? '10px 12px' : '14px 16px';
  // A visible <caption> already names the table. An aria-label on top of it
  // would silently replace that visible name and risk a name/visible-text
  // mismatch (WCAG 2.5.3), so the ARIA names only apply without a caption.
  const nameFromAria = caption == null;
  return (
    <div style={{ overflowX: 'auto', ...style }} {...rest}>
      <table
        aria-label={nameFromAria ? tableLabel : undefined}
        aria-labelledby={nameFromAria ? tableLabelledBy : undefined}
        style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-sans)' }}
      >
        {caption != null && (
          <caption
            style={{
              captionSide: 'top',
              paddingBottom: 'var(--space-2)',
              color: 'var(--color-semantic-label-strong)',
              fontSize: 'var(--label1-size)',
              lineHeight: 'var(--label1-line)',
              fontWeight: 'var(--fw-semibold)',
              textAlign: 'left',
            }}
          >
            {caption}
          </caption>
        )}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" style={{ ...thStyle(pad), textAlign: c.align || 'left', width: c.width }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <TableRow
              key={getRowId ? getRowId(r, ri) : (r?.id ?? ri)}
              columns={columns}
              row={r}
              pad={pad}
              hover={hover}
              rowHeaderKey={rowHeaderKey}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
