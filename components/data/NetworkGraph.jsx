import React from 'react';
import { VisuallyHidden } from '../layout/VisuallyHidden.jsx';

/**
 * LDS Product Data — NetworkGraph
 * 대상과 그 사이의 관계를 노드·엣지로 그립니다. 색은 소비자가 정하고, 배치와
 * 상호작용과 접근성 계약은 이 컴포넌트가 정합니다.
 */

const NODE_WIDTH = 168;
const NODE_HEIGHT = 52;
const COLUMN_GAP = 220;
const ROW_GAP = 84;

/* 상태는 색이 아니라 의미다. 소비자가 유형 색을 주고, 상태는 그 색을 어떻게
   누그러뜨릴지만 정한다 — 그래야 「무엇인가」와 「지금 어떤가」가 한 색에서
   섞이지 않는다. */
const NODE_STATE_STYLE = {
  normal: { opacity: 1, strokeDasharray: undefined },
  muted: { opacity: 0.45, strokeDasharray: undefined },
  degraded: { opacity: 1, strokeDasharray: '6 3' },
  blocked: { opacity: 1, strokeDasharray: '2 3' },
  disabled: { opacity: 0.3, strokeDasharray: '2 3' },
};

const EDGE_STATE_STYLE = {
  normal: { opacity: 1, dash: undefined, width: 1.5 },
  live: { opacity: 1, dash: undefined, width: 2.5 },
  degraded: { opacity: 0.9, dash: '6 4', width: 2 },
  blocked: { opacity: 0.9, dash: '2 4', width: 2 },
  idle: { opacity: 0.5, dash: '4 4', width: 1.5 },
  disabled: { opacity: 0.3, dash: '2 4', width: 1 },
};

function nodeText(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).filter(Boolean).join(' ');
  if (React.isValidElement(node)) return nodeText(node.props.children);
  return '';
}

/* 같은 입력이면 같은 그림이어야 시각 회귀 시험이 성립한다. 위치가 필요한
   모든 결정은 정렬된 순서나 이 해시에서 나오고, 난수는 쓰지 않는다. */
function stableHash(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 100000;
  }
  return hash;
}

function resolveColumns(nodes) {
  const explicit = nodes.some((node) => Number.isInteger(node.column));
  if (explicit) {
    return nodes.map((node) => (Number.isInteger(node.column) ? node.column : 0));
  }
  // 열이 주어지지 않으면 뿌리에서의 거리로 층을 만든다.
  return nodes.map((node) => (node.root ? 0 : Math.max(1, Number(node.depth) || 1)));
}

/**
 * 좌표 계산. `manual`은 소비자가 준 x/y를 그대로 쓰고, 그 외에는 열/층으로
 * 격자를 만든 뒤 같은 칸에 겹친 노드를 밀어낸다.
 */
function layoutNodes(nodes, layout) {
  if (!nodes.length) return new Map();
  if (layout === 'manual') {
    return new Map(
      nodes.map((node) => [node.id, { x: Number(node.x) || 0, y: Number(node.y) || 0 }]),
    );
  }

  const columns = resolveColumns(nodes);
  const byColumn = new Map();
  nodes.forEach((node, index) => {
    const column = columns[index];
    byColumn.set(column, [...(byColumn.get(column) ?? []), node]);
  });

  const positions = new Map();
  const orderedColumns = [...byColumn.keys()].sort((left, right) => left - right);
  const tallest = Math.max(
    ...orderedColumns.map((column) => byColumn.get(column).length),
    1,
  );

  orderedColumns.forEach((column, columnIndex) => {
    const inColumn = [...byColumn.get(column)].sort((left, right) => {
      const group = String(left.group ?? '').localeCompare(String(right.group ?? ''));
      return group !== 0 ? group : String(left.id).localeCompare(String(right.id));
    });
    const columnHeight = (inColumn.length - 1) * ROW_GAP;
    const top = ((tallest - 1) * ROW_GAP - columnHeight) / 2;
    inColumn.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x: columnIndex * COLUMN_GAP,
        y: top + rowIndex * ROW_GAP,
      });
    });
  });

  return positions;
}

function edgePath(from, to) {
  if (!from || !to) return null;
  const startX = from.x + NODE_WIDTH / 2;
  const startY = from.y;
  const endX = to.x - NODE_WIDTH / 2;
  const endY = to.y;
  // 같은 열 안의 연결은 직선이면 노드를 관통하므로 바깥으로 부풀린다.
  const sameColumn = Math.abs(startX - endX) < 1;
  const controlX = sameColumn
    ? startX + Math.max(48, Math.abs(endY - startY) / 2)
    : (startX + endX) / 2;
  const controlY = sameColumn ? (startY + endY) / 2 : (startY + endY) / 2;
  return {
    d: `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`,
    label: {
      x: 0.25 * startX + 0.5 * controlX + 0.25 * endX,
      y: 0.25 * startY + 0.5 * controlY + 0.25 * endY,
    },
  };
}

export function NetworkGraph({
  nodes = [],
  edges = [],
  layout = 'layered',
  nodeColor = 'var(--color-semantic-primary-normal)',
  edgeColor = 'var(--color-semantic-line-solid-normal)',
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
  onToggleNode,
  label,
  description,
  summary,
  emptyLabel = '표시할 관계가 없습니다.',
  height = 480,
  style,
  ...rest
}) {
  const rawId = React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const descriptionId = `${rawId}-description`;
  const summaryId = `${rawId}-summary`;

  const positions = React.useMemo(() => layoutNodes(nodes, layout), [layout, nodes]);
  const nodeById = React.useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  );

  /* 화살표 마커는 색마다 하나씩 필요하다. 색은 소비자가 주므로 실제로 쓰인
     값만 모아 정의한다 — 팔레트 전체를 미리 찍으면 쓰지 않는 defs가 남는다. */
  const edgeColors = React.useMemo(
    () => [...new Set(edges.map((edge) => edge.color || edgeColor))].sort(),
    [edgeColor, edges],
  );
  const markerId = React.useCallback(
    (color) => `lds-network-arrow-${rawId}-${stableHash(color)}`,
    [rawId],
  );

  const bounds = React.useMemo(() => {
    const values = [...positions.values()];
    if (!values.length) return { minX: 0, minY: 0, width: NODE_WIDTH, height: NODE_HEIGHT };
    const xs = values.map((point) => point.x);
    const ys = values.map((point) => point.y);
    const padding = NODE_WIDTH;
    return {
      minX: Math.min(...xs) - padding,
      minY: Math.min(...ys) - NODE_HEIGHT,
      width: Math.max(...xs) - Math.min(...xs) + padding * 2,
      height: Math.max(...ys) - Math.min(...ys) + NODE_HEIGHT * 2,
    };
  }, [positions]);

  const hasData = nodes.length > 0;
  const automaticSummary = hasData
    ? `대상 ${nodes.length}개, 관계 ${edges.length}개. ${nodes
      .map((node) => nodeText(node.label) || node.id)
      .join(', ')}`
    : nodeText(emptyLabel);
  const resolvedSummary = summary ?? automaticSummary;

  /*
    키보드 계약. 노드가 하나의 tab stop 묶음(roving tabindex)이 되고, 방향키로
    옮겨 다니며 Enter/Space로 선택한다. 이 계약을 컴포넌트가 갖는 이유는 두
    소비자가 각각 `role="button" tabIndex={0}`을 손으로 세우고 있었고, 한쪽은
    바깥 SVG에 `role="img"`를 얹어 그 노드들을 보조기술에서 통째로 지워버리고
    있었기 때문이다. 포커스가 가는 곳은 반드시 이름을 가져야 한다.
  */
  const [focusedId, setFocusedId] = React.useState(null);
  const activeId = focusedId && nodeById.has(focusedId) ? focusedId : nodes[0]?.id;

  const moveFocus = React.useCallback(
    (fromId, delta) => {
      const order = nodes.map((node) => node.id);
      const index = order.indexOf(fromId);
      if (index < 0) return;
      const next = order[(index + delta + order.length) % order.length];
      setFocusedId(next);
      const element = document.getElementById(`${rawId}-node-${stableHash(String(next))}`);
      element?.focus();
    },
    [nodes, rawId],
  );

  function nodeKeyDown(event, node) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectNode?.(node);
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(node.id, 1);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(node.id, -1);
      return;
    }
    if (onToggleNode && (event.key === '+' || event.key === '-')) {
      event.preventDefault();
      onToggleNode(node);
    }
  }

  return (
    <div
      data-chart-type="network"
      style={{ minWidth: 0, height, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {description != null && <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden>}
      {resolvedSummary != null && (
        <VisuallyHidden id={summaryId} data-chart-summary>{resolvedSummary}</VisuallyHidden>
      )}
      {!hasData ? (
        <span
          data-chart-empty
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: 'var(--color-semantic-label-alternative)',
            fontSize: 'var(--label2-size)',
            lineHeight: 'var(--label2-line)',
          }}
        >
          {emptyLabel}
        </span>
      ) : (
        <svg
          /* `role="img"`를 쓰지 않는다 — 안에 포커스 가능한 노드가 있고, `img`는
             하위 트리를 presentational로 만들어 그것들을 지워 버린다. */
          role="group"
          aria-label={label || '관계도'}
          aria-describedby={
            [description != null && descriptionId, resolvedSummary != null && summaryId]
              .filter(Boolean)
              .join(' ') || undefined
          }
          viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
          style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}
        >
          <defs>
            {edgeColors.map((color) => (
              <marker
                key={color}
                id={markerId(color)}
                viewBox="0 0 8 8"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0,0 L8,4 L0,8 Z" fill={color} />
              </marker>
            ))}
          </defs>

          <g data-network-edges>
            {edges.map((edge) => {
              const path = edgePath(positions.get(edge.from), positions.get(edge.to));
              if (!path) return null;
              const color = edge.color || edgeColor;
              const tone = EDGE_STATE_STYLE[edge.state] ?? EDGE_STATE_STYLE.normal;
              const selected = selectedEdgeId === edge.id;
              const labelText = nodeText(edge.label);
              return (
                <g key={edge.id} data-network-edge={edge.id} data-state={edge.state ?? 'normal'}>
                  <path
                    d={path.d}
                    fill="none"
                    stroke={color}
                    strokeWidth={selected ? tone.width + 1.5 : tone.width}
                    strokeDasharray={tone.dash}
                    opacity={tone.opacity}
                    markerEnd={edge.directed === false ? undefined : `url(#${markerId(color)})`}
                  />
                  {onSelectEdge && (
                    /* 곡선은 누르기 어려우므로 투명한 넓은 선을 겹쳐 표적을
                       넓힌다. 이름은 아래 접근 가능한 요소가 갖는다. */
                    <path
                      d={path.d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={16}
                      style={{ cursor: 'pointer' }}
                      role="button"
                      tabIndex={-1}
                      aria-label={labelText || '관계'}
                      onClick={() => onSelectEdge(edge)}
                    />
                  )}
                  {labelText && (
                    <text
                      x={path.label.x}
                      y={path.label.y - 6}
                      textAnchor="middle"
                      style={{
                        fontSize: 'var(--caption1-size)',
                        fill: 'var(--color-semantic-label-alternative)',
                        pointerEvents: 'none',
                      }}
                    >
                      {labelText}
                      {edge.count > 1 ? ` ${edge.count}` : ''}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          <g data-network-nodes>
            {nodes.map((node) => {
              const position = positions.get(node.id);
              if (!position) return null;
              const color = node.color || nodeColor;
              const tone = NODE_STATE_STYLE[node.state] ?? NODE_STATE_STYLE.normal;
              const selected = selectedNodeId === node.id;
              const labelText = nodeText(node.label) || node.id;
              const captionText = nodeText(node.caption);
              const domId = `${rawId}-node-${stableHash(String(node.id))}`;
              return (
                <g
                  key={node.id}
                  id={domId}
                  data-network-node={node.id}
                  data-state={node.state ?? 'normal'}
                  data-selected={selected ? 'true' : undefined}
                  role="button"
                  tabIndex={node.id === activeId ? 0 : -1}
                  aria-label={[labelText, captionText].filter(Boolean).join(', ')}
                  aria-pressed={selected ? 'true' : undefined}
                  aria-expanded={
                    onToggleNode && node.collapsedCount != null
                      ? node.collapsedCount === 0 ? 'true' : 'false'
                      : undefined
                  }
                  transform={`translate(${position.x} ${position.y})`}
                  style={{ cursor: onSelectNode ? 'pointer' : 'default', opacity: tone.opacity }}
                  onFocus={() => setFocusedId(node.id)}
                  onClick={() => onSelectNode?.(node)}
                  onDoubleClick={() => onToggleNode?.(node)}
                  onKeyDown={(event) => nodeKeyDown(event, node)}
                >
                  <rect
                    x={-NODE_WIDTH / 2}
                    y={-NODE_HEIGHT / 2}
                    width={NODE_WIDTH}
                    height={NODE_HEIGHT}
                    rx="var(--radius-md)"
                    fill="var(--color-semantic-background-elevated-normal)"
                    stroke={color}
                    strokeWidth={selected ? 2.5 : 1.5}
                    strokeDasharray={tone.strokeDasharray}
                  />
                  <circle cx={-NODE_WIDTH / 2 + 18} cy={0} r={5} fill={color} />
                  <text
                    x={-NODE_WIDTH / 2 + 32}
                    y={captionText ? -2 : 5}
                    style={{
                      fontSize: 'var(--label2-size)',
                      fontWeight: 'var(--fw-bold)',
                      fill: 'var(--color-semantic-label-strong)',
                      pointerEvents: 'none',
                    }}
                  >
                    {labelText}
                  </text>
                  {captionText && (
                    <text
                      x={-NODE_WIDTH / 2 + 32}
                      y={13}
                      style={{
                        fontSize: 'var(--caption1-size)',
                        fill: 'var(--color-semantic-label-alternative)',
                        pointerEvents: 'none',
                      }}
                    >
                      {captionText}
                    </text>
                  )}
                  {node.collapsedCount > 0 && (
                    /* 접힌 이웃의 개수. 눌러서 펼치는 동작은 노드 자신이
                       갖고(`aria-expanded`), 이 배지는 그 상태의 표시다. */
                    <>
                      <circle
                        cx={NODE_WIDTH / 2 - 14}
                        cy={0}
                        r={10}
                        fill="var(--color-semantic-background-normal-alternative)"
                        stroke={color}
                        strokeWidth={1}
                      />
                      <text
                        x={NODE_WIDTH / 2 - 14}
                        y={4}
                        textAnchor="middle"
                        style={{
                          fontSize: 'var(--caption1-size)',
                          fill: 'var(--color-semantic-label-neutral)',
                          pointerEvents: 'none',
                        }}
                      >
                        {node.collapsedCount}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
