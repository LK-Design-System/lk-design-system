import React from 'react';
import { VisuallyHidden } from '@lk-design-system/lds-core/components/layout/VisuallyHidden';

/**
 * LDS Product Data — NetworkGraph
 * 대상과 그 사이의 관계를 노드·엣지로 그립니다. 색은 소비자가 정하고, 배치와
 * 상호작용과 접근성 계약은 이 컴포넌트가 정합니다.
 */

/*
  관계도 UI는 두 갈래의 관행으로 갈리고, 이 컴포넌트는 둘 다 그린다.

  `dot` — 노드-링크 다이어그램(Neo4j Bloom · Gephi · Obsidian 계열). 원 + 바깥
  라벨. 색은 범주, 반지름은 양(`size`)을 인코딩한다. 연결 «구조»를 읽는 것이
  목적이라 노드가 작아야 하고, 라벨이 원 밖에 있어야 원이 작아질 수 있다.

  `card` — 플로우 에디터(n8n · React Flow · Node-RED 계열). 모서리 둥근 사각 +
  안쪽 라벨 + 좌우 포트. 각 단계가 «무엇을 하는가»를 읽는 것이 목적이라 노드가
  이름을 담을 만큼 커야 하고, 연결이 정해진 포트에 붙어 흐름이 한 방향으로
  읽혀야 한다.

  장르를 섞으면 둘 다 실패한다. 지식망을 카드로 그리면 노드 수십 개에 화면이
  카드로 덮여 구조가 안 보이고, 파이프라인을 점으로 그리면 어느 단계가 무엇을
  하는지 읽을 수 없다.
*/
const SHAPE = {
  /* 열 간격은 카드 폭 + 관계 라벨이 들어갈 통로다. 220이면 통로가 52px뿐이라
     라벨이 놓일 자리가 아예 없어 노드 위로 밀려났다. 플로우 에디터가 열을
     넉넉히 띄우는 이유가 이것이다. */
  card: { width: 168, height: 52, columnPitch: 300, rowPitch: 92 },
  dot: { width: 96, height: 96, columnPitch: 150, rowPitch: 92 },
};
const DOT_RADIUS = 16;
const DOT_RADIUS_MAX = 30;

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
function layoutNodes(nodes, layout, metrics) {
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
    const columnHeight = (inColumn.length - 1) * metrics.rowPitch;
    const top = ((tallest - 1) * metrics.rowPitch - columnHeight) / 2;
    inColumn.forEach((node, rowIndex) => {
      positions.set(node.id, {
        x: columnIndex * metrics.columnPitch,
        y: top + rowIndex * metrics.rowPitch,
      });
    });
  });

  return positions;
}

/*
  엣지는 두 노드의 «마주 보는» 면에 붙어야 한다. 진행 방향을 보지 않고 늘
  출발 노드의 오른쪽과 도착 노드의 왼쪽을 잡으면, 오른쪽에서 왼쪽으로 가는
  관계가 두 노드를 관통하며 화면을 가로지른다. 배치가 층·열이어도 관계는
  거꾸로 흐를 수 있다 — 개발자가 프로젝트에 기여하는 방향이 그렇다.
*/
function edgePath(from, to, metrics) {
  if (!from || !to) return null;

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  /* 원은 어느 방향에서 와도 둘레가 같으므로 중심을 잇는 선 위에서 반지름만큼
     물러난다. 사각형처럼 «어느 면에 붙일지»를 고를 필요가 없다 — 노드-링크
     관행이 배치를 자유롭게 둘 수 있는 이유이기도 하다. */
  if (metrics.shape === 'dot') {
    const distance = Math.hypot(dx, dy) || 1;
    const unitX = dx / distance;
    const unitY = dy / distance;
    const startX = from.x + unitX * (from.radius ?? DOT_RADIUS);
    const startY = from.y + unitY * (from.radius ?? DOT_RADIUS);
    const endX = to.x - unitX * (to.radius ?? DOT_RADIUS);
    const endY = to.y - unitY * (to.radius ?? DOT_RADIUS);
    // 살짝 휘게 해서 같은 두 노드 사이의 왕복 관계가 겹쳐 보이지 않게 한다.
    const bow = Math.min(28, distance / 6);
    const controlX = (startX + endX) / 2 - unitY * bow;
    const controlY = (startY + endY) / 2 + unitX * bow;
    return { start: { x: startX, y: startY }, control: { x: controlX, y: controlY }, end: { x: endX, y: endY } };
  }

  const halfWidth = metrics.width / 2;
  const halfHeight = metrics.height / 2;

  // 가로 간격이 노드 폭보다 좁으면 좌우로 붙일 자리가 없어 위아래로 붙인다.
  const horizontal = Math.abs(dx) > metrics.width * 0.75;

  if (horizontal) {
    const direction = Math.sign(dx);
    const startX = from.x + direction * halfWidth;
    const endX = to.x - direction * halfWidth;
    const controlX = (startX + endX) / 2;
    const controlY = (from.y + to.y) / 2;
    return { start: { x: startX, y: from.y }, control: { x: controlX, y: controlY }, end: { x: endX, y: to.y } };
  }

  const direction = Math.sign(dy) || 1;
  const startY = from.y + direction * halfHeight;
  const endY = to.y - direction * halfHeight;
  // 같은 칸에 세로로 이웃한 노드는 직선이면 사이의 노드를 관통하므로 옆으로 부풀린다.
  const bow = Math.max(48, Math.abs(endY - startY) / 2);
  const controlX = (from.x + to.x) / 2 + bow;
  const controlY = (startY + endY) / 2;
  return { start: { x: from.x, y: startY }, control: { x: controlX, y: controlY }, end: { x: to.x, y: endY } };
}

function pointOnCurve({ start, control, end }, t) {
  const inverse = 1 - t;
  return {
    x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
    y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y,
  };
}

function boxesHit(a, b) {
  return !(
    a.x + a.width / 2 <= b.x - b.width / 2
    || b.x + b.width / 2 <= a.x - a.width / 2
    || a.y + a.height / 2 <= b.y - b.height / 2
    || b.y + b.height / 2 <= a.y - a.height / 2
  );
}

/*
  관계 라벨을 곡선 중점에 고정하면 두 가지가 겹친다. 교차하는 두 곡선은 중점이
  거의 같은 자리라 라벨끼리 포개지고, 옆으로 부풀린 곡선은 중점이 노드 쪽으로
  밀려 라벨이 노드 위에 얹힌다.

  그래서 중점을 기본 후보로 두되, 겹치면 곡선을 따라 앞뒤로 옮겨 가며 빈자리를
  찾는다. 후보 순서가 고정이고 관계도 정렬된 순서로 처리되므로 결과는 여전히
  결정론적이다 — 같은 입력이면 같은 자리에 놓인다.

  빈자리를 못 찾으면 마지막 후보에 그냥 둔다. 라벨을 지우는 것보다 겹치더라도
  보이는 편이 낫고, 글자 뒤의 배경 테두리가 그 경우의 가독성을 맡는다.
*/
const LABEL_CANDIDATE_T = [0.5, 0.38, 0.62, 0.28, 0.72];
/* 곡선을 «따라» 옮기는 것만으로는 부족하다. 노드가 촘촘하면 곡선 위 어느
   지점도 어떤 노드 상자 안에 들어가, 후보를 다 돌고 제자리로 돌아온다.
   곡선에서 수직으로 «떨어뜨리는» 후보가 있어야 빠져나갈 자리가 생긴다. */
const LABEL_CANDIDATE_OFFSET = [0, 18, -18, 34, -34, 52, -52];

function curveTangent({ start, control, end }, t) {
  const x = 2 * (1 - t) * (control.x - start.x) + 2 * t * (end.x - control.x);
  const y = 2 * (1 - t) * (control.y - start.y) + 2 * t * (end.y - control.y);
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function placeEdgeLabels(entries, obstacles) {
  const placed = [...obstacles];
  return entries.map((entry) => {
    if (!entry.curve || !entry.text) return { ...entry, label: null };
    // 글자 폭은 대략치로 잡는다. SVG 텍스트 측정은 배치 시점에 할 수 없고,
    // 여기서 필요한 것은 «겹치는가»의 판정이지 정확한 폭이 아니다.
    // 12px caption 기준 실측에 가까운 글자당 폭. 과대평가하면 놓을 자리가 없다고
    // 잘못 판단해 라벨이 제자리로 되돌아온다.
    const width = entry.text.length * 6.2 + 6;
    const height = 16;
    for (const t of LABEL_CANDIDATE_T) {
      const base = pointOnCurve(entry.curve, t);
      const tangent = curveTangent(entry.curve, t);
      for (const offset of LABEL_CANDIDATE_OFFSET) {
        // 접선의 법선 방향으로 민다 — 선을 가로지르지 않고 옆으로 비켜난다.
        const point = {
          x: base.x - tangent.y * offset,
          y: base.y + tangent.x * offset,
        };
        const box = { x: point.x, y: point.y - 6, width, height };
        if (!placed.some((other) => boxesHit(box, other))) {
          placed.push(box);
          return { ...entry, label: point };
        }
      }
    }
    const fallback = pointOnCurve(entry.curve, LABEL_CANDIDATE_T[0]);
    return { ...entry, label: fallback };
  });
}

export function NetworkGraph({
  nodes = [],
  edges = [],
  layout = 'layered',
  nodeShape = 'card',
  showEdgeLabels = true,
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

  const metrics = SHAPE[nodeShape] ?? SHAPE.card;
  const isDot = nodeShape === 'dot';

  const positions = React.useMemo(
    () => layoutNodes(nodes, layout, metrics),
    [layout, metrics, nodes],
  );
  const nodeById = React.useMemo(
    () => new Map(nodes.map((node) => [node.id, node])),
    [nodes],
  );

  /* 반지름은 «양»을 인코딩한다(노드-링크 관행의 기본 축). 넓이가 값에
     비례해야 사람이 크기를 제대로 읽으므로 제곱근을 쓴다 — 반지름을 값에
     그대로 비례시키면 큰 값이 실제보다 과장돼 보인다. */
  const radiusOf = React.useCallback(
    (node) => {
      if (!isDot) return 0;
      const values = nodes.map((item) => Number(item.size) || 0);
      const max = Math.max(...values, 0);
      if (!max) return DOT_RADIUS;
      const ratio = Math.sqrt(Math.max(0, Number(node.size) || 0) / max);
      return DOT_RADIUS + (DOT_RADIUS_MAX - DOT_RADIUS) * ratio;
    },
    [isDot, nodes],
  );

  const anchors = React.useMemo(() => {
    const map = new Map();
    nodes.forEach((node) => {
      const point = positions.get(node.id);
      if (point) map.set(node.id, { ...point, radius: radiusOf(node) });
    });
    return map;
  }, [nodes, positions, radiusOf]);

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
    if (!values.length) return { minX: 0, minY: 0, width: metrics.width, height: metrics.height };
    const xs = values.map((point) => point.x);
    const ys = values.map((point) => point.y);
    const padding = metrics.width;
    return {
      minX: Math.min(...xs) - padding,
      minY: Math.min(...ys) - metrics.height,
      width: Math.max(...xs) - Math.min(...xs) + padding * 2,
      height: Math.max(...ys) - Math.min(...ys) + metrics.height * 2,
    };
  }, [metrics, positions]);

  /* 관계의 곡선과 라벨 자리를 한 번에 계산한다. 라벨 배치가 «다른» 라벨과
     노드를 모두 봐야 하므로, 그리는 중에 하나씩 정할 수 없다. */
  const laidOutEdges = React.useMemo(() => {
    const entries = edges.map((edge) => ({
      edge,
      curve: edgePath(anchors.get(edge.from), anchors.get(edge.to), {
        ...metrics,
        shape: nodeShape,
      }),
      text: showEdgeLabels
        ? `${nodeText(edge.label)}${edge.count > 1 ? ` ${edge.count}` : ''}`.trim()
        : '',
    }));
    const obstacles = nodes.flatMap((node) => {
      const point = anchors.get(node.id);
      if (!point) return [];
      if (!isDot) {
        // 카드는 이름이 «안»에 있으므로 카드 하나가 곧 장애물이다.
        return [{ x: point.x, y: point.y, width: metrics.width, height: metrics.height }];
      }
      /* 점은 이름이 원 «밖»에 있다. 원만 피하면 라벨 위에 얹히므로, 원 아래
         두 줄도 함께 막는다 — 이 관행에서 이름은 노드의 일부다. */
      const nameWidth = (nodeText(node.label) || node.id).length * 6.8 + 8;
      const captionWidth = nodeText(node.caption).length * 6.2 + 8;
      return [
        { x: point.x, y: point.y, width: point.radius * 2, height: point.radius * 2 },
        { x: point.x, y: point.y + point.radius + 11, width: nameWidth, height: 16 },
        ...(captionWidth > 8
          ? [{ x: point.x, y: point.y + point.radius + 26, width: captionWidth, height: 14 }]
          : []),
      ];
    });
    return placeEdgeLabels(entries, obstacles);
  }, [anchors, edges, isDot, metrics, nodeShape, nodes, showEdgeLabels]);

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
            {laidOutEdges.map(({ edge, curve, text, label: labelPoint }) => {
              if (!curve) return null;
              const path = {
                d: `M ${curve.start.x} ${curve.start.y} Q ${curve.control.x} ${curve.control.y} ${curve.end.x} ${curve.end.y}`,
                label: labelPoint,
              };
              const color = edge.color || edgeColor;
              const tone = EDGE_STATE_STYLE[edge.state] ?? EDGE_STATE_STYLE.normal;
              const selected = selectedEdgeId === edge.id;
              const labelText = text;
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
                  {labelText && path.label && (
                    /* 자리는 위 `placeEdgeLabels`가 다른 라벨·노드를 모두 보고
                       정한다. 그래도 마지막 후보까지 막히면 겹친 채로 놓이므로,
                       배경색 테두리를 글자 «뒤»로 깔아(`paint-order`) 그 경우의
                       가독성을 지킨다. */
                    <text
                      x={path.label.x}
                      y={path.label.y - 6}
                      textAnchor="middle"
                      style={{
                        fontSize: 'var(--caption1-size)',
                        fill: 'var(--color-semantic-label-alternative)',
                        paintOrder: 'stroke',
                        stroke: 'var(--color-semantic-background-elevated-normal)',
                        strokeWidth: 3,
                        strokeLinejoin: 'round',
                        pointerEvents: 'none',
                      }}
                    >
                      {labelText}
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
              const radius = radiusOf(node);
              return (
                <g
                  key={node.id}
                  id={domId}
                  data-network-node={node.id}
                  data-state={node.state ?? 'normal'}
                  data-selected={selected ? 'true' : undefined}
                  role="button"
                  tabIndex={node.id === activeId ? 0 : -1}
                  /* 접힌 개수는 눈에는 +N 큐로, 귀에는 이름으로 전달한다.
                     배지가 그림일 뿐이라 aria-expanded만으로는 「몇 개가
                     접혔는지」를 스크린 리더가 들을 수 없다. */
                  aria-label={[
                    labelText,
                    captionText,
                    node.collapsedCount > 0 ? `접힌 연결 ${node.collapsedCount}개` : null,
                  ].filter(Boolean).join(', ')}
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
                  {isDot ? (
                    /* 노드-링크 관행: 색이 찬 원 + 바깥 라벨. 라벨을 밖에 두면
                       원이 작아질 수 있고, 원이 작아야 노드가 많아져도 연결
                       구조가 보인다. 선택은 테두리 링으로 표시한다 — 채움색은
                       이미 범주가 쓰고 있다. */
                    <>
                      {selected && (
                        <circle
                          r={radius + 5}
                          fill="none"
                          stroke={color}
                          strokeWidth={2}
                          opacity={0.4}
                        />
                      )}
                      <circle
                        data-network-node-body="dot"
                        r={radius}
                        fill={color}
                        stroke="var(--color-semantic-background-elevated-normal)"
                        strokeWidth={2}
                        strokeDasharray={tone.strokeDasharray}
                      />
                      <text
                        y={radius + 16}
                        textAnchor="middle"
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
                          y={radius + 31}
                          textAnchor="middle"
                          style={{
                            fontSize: 'var(--caption1-size)',
                            fill: 'var(--color-semantic-label-alternative)',
                            pointerEvents: 'none',
                          }}
                        >
                          {captionText}
                        </text>
                      )}
                    </>
                  ) : (
                    /* 플로우 에디터 관행: 이름을 담는 카드 + 좌우 포트. 포트가
                       있어야 연결이 어디로 들고 나는지 읽히고, 흐름이 한 방향
                       으로 정렬된다. */
                    <>
                      <rect
                        x={-metrics.width / 2}
                        y={-metrics.height / 2}
                        width={metrics.width}
                        height={metrics.height}
                        rx="var(--radius-md)"
                        fill="var(--color-semantic-background-elevated-normal)"
                        stroke={color}
                        strokeWidth={selected ? 2.5 : 1.5}
                        strokeDasharray={tone.strokeDasharray}
                      />
                      {/* 안쪽에 색 점을 두지 않는다. 테두리가 이미 같은 색으로
                          같은 범주를 말하고 있어 한 변수를 두 번 그리게 된다.
                          이 자리에 놓을 값이 있다면 색이 아니라 아이콘처럼
                          «다른» 정보를 나르는 것이어야 한다. */}
                      <text
                        x={-metrics.width / 2 + 16}
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
                        // 이름과 같은 왼쪽 기준선. 두 줄은 한 덩어리로 읽혀야 한다.
                        <text
                          x={-metrics.width / 2 + 16}
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
                      {[-1, 1].map((side) => (
                        <circle
                          key={side}
                          data-network-port={side < 0 ? 'in' : 'out'}
                          cx={(side * metrics.width) / 2}
                          cy={0}
                          r={4}
                          fill="var(--color-semantic-background-elevated-normal)"
                          stroke={color}
                          strokeWidth={1.5}
                        />
                      ))}
                    </>
                  )}
                  {node.collapsedCount > 0 && (() => {
                    /*
                      접힌 이웃의 확장 큐. 그래프 도구의 관행(Cytoscape
                      expand-collapse가 대표)은 접힌 노드 «왼쪽 위»에 plus 계열
                      기호를 그린다. 숫자만 적으면 무엇의 숫자인지 읽히지
                      않는다 — `+`가 「더 있다」와 「눌러서 연다」를 함께
                      말하므로 `+N`으로 적는다. 오른쪽 위가 아닌 이유: 그쪽
                      축은 카드의 출력 포트가 이미 쓰고 있고, 관행의 기본
                      자리도 왼쪽 위다.

                      펼치는 동작(더블클릭·`+`/`-` 키)은 노드가 갖고, 이 큐는
                      그 상태의 표시다. 개수는 노드의 접근 가능한 이름에도
                      들어가므로 눈과 귀가 같은 사실을 듣는다.
                    */
                    const cue = isDot
                      ? { x: -radius * 0.72, y: -radius * 0.72 }
                      : { x: -metrics.width / 2 + 8, y: -metrics.height / 2 };
                    const cueText = `+${node.collapsedCount}`;
                    const cueWidth = cueText.length * 7 + 8;
                    return (
                      <g data-network-collapse-cue aria-hidden="true">
                        <rect
                          x={cue.x - cueWidth / 2}
                          y={cue.y - 9}
                          width={cueWidth}
                          height={18}
                          rx={9}
                          fill="var(--color-semantic-background-normal-alternative)"
                          stroke={color}
                          strokeWidth={1}
                        />
                        <text
                          x={cue.x}
                          y={cue.y + 4}
                          textAnchor="middle"
                          style={{
                            fontSize: 'var(--caption1-size)',
                            fontWeight: 'var(--fw-bold)',
                            fill: 'var(--color-semantic-label-neutral)',
                            pointerEvents: 'none',
                          }}
                        >
                          {cueText}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
