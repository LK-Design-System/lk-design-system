import React from 'react';
import { Icon } from '../icon/Icon.jsx';
import { Switch } from '../selection/Switch.jsx';

function TopicNode({ node, depth, onToggle }) {
  const kids = node.children || [];
  const has = kids.length > 0;
  const [open, setOpen] = React.useState(depth < 1);
  const [hover, setHover] = React.useState(false);
  const hasHz = typeof node.hz === 'number';
  return (
    <div>
      <div onClick={() => has && setOpen(!open)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 'var(--radius-sm)',
          cursor: has ? 'pointer' : 'default', background: hover ? 'var(--fill-alt)' : 'transparent',
          transition: 'background var(--dur-fast) var(--ease-out)' }}>
        <span style={{ width: 16, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--label-assistive)',
          transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform var(--dur-fast) var(--ease-out)' }}>
          {has && <Icon name="chevron-down" size={14} />}
        </span>
        <span style={{ fontSize: 13.5, fontWeight: has ? 700 : 500, color: 'var(--label-normal)' }}>{node.name}</span>
        {node.type && <code style={{ fontSize: 11, color: 'var(--label-alternative)', fontFamily: 'ui-monospace,SFMono-Regular,monospace' }}>{node.type}</code>}
        {(hasHz || node.subscribable) && (
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {hasHz && <span style={{ fontSize: 11, color: 'var(--label-assistive)', fontVariantNumeric: 'tabular-nums' }}>{node.hz} Hz</span>}
            {node.subscribable && (
              <span onClick={(e) => e.stopPropagation()} style={{ display: 'inline-flex' }}>
                <Switch size="sm" checked={!!node.subscribed} onChange={() => onToggle && onToggle(node)} />
              </span>
            )}
          </span>
        )}
      </div>
      {open && has && (
        <div style={{ marginLeft: 18, borderLeft: '1px solid var(--bw-band)', paddingLeft: 2 }}>
          {kids.map((k, i) => <TopicNode key={i} node={k} depth={depth + 1} onToggle={onToggle} />)}
        </div>
      )}
    </div>
  );
}

/**
 * LK ROBOTICS — TopicTree
 * ROS topic / TF hierarchy — expandable rows (chevron via the DS `Icon`, hover
 * highlight, nested guide line) with type + Hz metadata and an optional
 * per-topic subscribe toggle (DS `Switch`). Domain-specialized data tree.
 */
export function TopicTree({ nodes = [], onToggleSubscribe, style, ...rest }) {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', ...style }} {...rest}>
      {nodes.map((n, i) => <TopicNode key={i} node={n} depth={0} onToggle={onToggleSubscribe} />)}
    </div>
  );
}
