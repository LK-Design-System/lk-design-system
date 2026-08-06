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

/*
  글자 폭을 어림한다. SVG 텍스트의 실제 폭은 그려 봐야 알 수 있는데, 배치는
  그리기 «전»에 정해져야 한다.

  글자 수에 평균값을 곱하던 방식은 한글에서 틀린다 — 한글은 라틴의 두 배 폭에
  가깝고, 「LK Portal」과 「플랫폼·개발자 도구」는 같은 12자라도 폭이 배쯤
  차이난다. 넓은 글자와 좁은 글자를 나눠 세면 그 오차가 사라진다.

  일부러 조금 «넉넉하게» 잡는다. 좁게 잡으면 라벨이 놓을 자리가 없다고 잘못
  판단하거나, 자를 글자를 덜 잘라 상자 밖으로 흘러넘친다.
*/
const LABEL_FONT_SIZE = 13;
const CAPTION_FONT_SIZE = 12;
const NARROW_RATIO = 0.55;
/** 점 관행에서 이름 한 줄에 허용할 최대 폭. 이름 하나가 그림의 폭을 정하지 않도록. */
const DOT_LABEL_MAX_WIDTH = 168;
/** 펼치기 큐가 «눌리는» 최소 크기. WCAG 2.2 «Target Size (Minimum)»의 24px. */
const CUE_MIN_TARGET = 24;
/** 자동 요약이 이름으로 부르는 대상의 수. 나머지는 수로 말한다. */
const SUMMARY_NAME_LIMIT = 10;

/* 한 줄이 세로로 차지하는 자리. 글꼴 크기에서 나와야 한다 — 숫자를 따로 적어
   두면 글꼴이 바뀔 때 라벨이 피하는 상자만 옛 크기에 남는다. */
const LINE_HEIGHT_RATIO = 1.35;
function lineHeight(fontSize) {
  return fontSize * LINE_HEIGHT_RATIO;
}

function isWideGlyph(code) {
  // 한글·한자·가나와 전각 문장부호. 대략 한 글자가 한 em을 차지한다.
  return (code >= 0x1100 && code <= 0x115f)
    || (code >= 0x2e80 && code <= 0xa4cf)
    || (code >= 0xac00 && code <= 0xd7a3)
    || (code >= 0xf900 && code <= 0xfaff)
    || (code >= 0xfe30 && code <= 0xfe6f)
    || (code >= 0xff00 && code <= 0xff60);
}

function estimateTextWidth(text, fontSize) {
  if (!text) return 0;
  let width = 0;
  for (let index = 0; index < text.length; index += 1) {
    width += isWideGlyph(text.charCodeAt(index)) ? fontSize : fontSize * NARROW_RATIO;
  }
  return width;
}

/*
  이름이 담길 자리보다 길면 잘라 «…»을 붙인다.

  카드 관행에서는 이름이 면 «안»에 있으므로 넘치면 상자 밖으로 흘러나온다 —
  실제로 그랬다. 점 관행에서는 밖에 있어 흘러넘칠 상자가 없지만, 그대로 두면
  이름 하나가 그림 전체의 폭을 정한다.

  SVG에는 `text-overflow`가 없어 위의 어림치로 자른다. 라벨 배치가 쓰는 것과
  같은 함수다 — 두 곳이 다른 폭을 믿으면 한쪽이 반드시 틀린다.

  자르는 것은 «보이는 글자»뿐이다. 전체 이름은 노드의 접근성 이름과 `<title>`에
  그대로 남으므로, 보조기술과 마우스 양쪽에서 온전히 읽을 수 있다.
*/
function fitText(text, maxWidth, fontSize) {
  if (!text || estimateTextWidth(text, fontSize) <= maxWidth) return text;
  const room = maxWidth - estimateTextWidth('…', fontSize);
  let width = 0;
  let cut = 0;
  while (cut < text.length) {
    const step = isWideGlyph(text.charCodeAt(cut)) ? fontSize : fontSize * NARROW_RATIO;
    if (width + step > room) break;
    width += step;
    cut += 1;
  }
  return cut === 0 ? '…' : `${text.slice(0, cut).trimEnd()}…`;
}

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
    /*
      준 좌표는 그대로 쓴다. 문제는 «주지 않은» 좌표다.

      종전에는 `Number(node.x) || 0`으로 원점에 놓았다. 그러면 좌표 없는
      노드가 여럿일 때 모두 한 점에 쌓이고, 하필 그 자리에 놓인 노드가 있으면
      그 아래로 숨는다 — 화면에서 사라진 것과 같은데 아무도 알려 주지 않는다.

      그래서 놓인 것들의 «아래»에 한 줄로 늘어놓는다. 남의 자리를 침범하지
      않고, 좌표를 주지 않았다는 사실이 눈에 보이며, 순서가 입력에서만 나오므로
      여전히 결정론이다.
    */
    const placed = new Map();
    const unplaced = [];
    nodes.forEach((node) => {
      const x = Number(node.x);
      const y = Number(node.y);
      if (Number.isFinite(x) && Number.isFinite(y)) placed.set(node.id, { x, y });
      else unplaced.push(node);
    });
    if (!unplaced.length) return placed;
    const lowest = placed.size
      ? Math.max(...[...placed.values()].map((point) => point.y)) + metrics.rowPitch
      : 0;
    const leftmost = placed.size
      ? Math.min(...[...placed.values()].map((point) => point.x))
      : 0;
    unplaced.forEach((node, index) => {
      placed.set(node.id, { x: leftmost + index * metrics.columnPitch, y: lowest });
    });
    return placed;
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

  /*
    자기 자신을 잇는 관계. 「이 대상이 자기 자신에게 무언가 한다」는 실제로
    있는 사실이므로(자기 참조·재귀·순환) 조용히 지워서는 안 된다. 그런데
    시작점과 끝점이 같으면 방향이 없어 보통의 곡선 식이 성립하지 않는다.

    관행대로 노드 «위»에 작은 고리를 얹는다. 노드 둘레의 두 점에서 나가고
    들어오며, 제어점 둘을 바깥으로 밀어 고리를 만든다. 같은 노드에 고리가
    여럿이면 각도를 돌려 겹치지 않게 한다.
  */
  if (from === to || (from.x === to.x && from.y === to.y)) {
    const radius = from.radius ?? (metrics.shape === 'dot' ? DOT_RADIUS : metrics.height / 2);
    const turn = (metrics.selfIndex ?? 0) * (Math.PI / 3);
    const spread = Math.PI / 7;
    const base = -Math.PI / 2 + turn;
    const exit = base - spread;
    const enter = base + spread;
    /* 3차 베지어는 제어점까지 «닿지» 않고 그 안쪽으로 부푼다. 고리가 노드만큼은
       커야 관계로 읽히므로 제어점을 노드 반지름의 몇 배까지 밀어 둔다. */
    const reach = radius * 4.2;
    return {
      start: { x: from.x + Math.cos(exit) * radius, y: from.y + Math.sin(exit) * radius },
      control: { x: from.x + Math.cos(exit) * reach, y: from.y + Math.sin(exit) * reach },
      controlOut: { x: from.x + Math.cos(enter) * reach, y: from.y + Math.sin(enter) * reach },
      end: { x: from.x + Math.cos(enter) * radius, y: from.y + Math.sin(enter) * radius },
    };
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;

  /* 원은 어느 방향에서 와도 둘레가 같으므로 중심을 잇는 선 위에서 반지름만큼
     물러난다. 사각형처럼 «어느 면에 붙일지»를 고를 필요가 없다 — 노드-링크
     관행이 배치를 자유롭게 둘 수 있는 이유이기도 하다.

     선은 «직선»이 기본이다. Obsidian·Gephi·Bloom 모두 원 사이를 곧게 긋는다
     — 구조를 읽는 그림에서 곡률은 정보가 아니라 장식이다. 휘는 것은 같은 두
     노드 사이에 관계가 여럿일 때뿐이고, 그때의 곡률은 겹침을 푸는 정보다.
     왕복 한 쌍은 단위 벡터가 반대라 같은 식으로도 서로 반대쪽으로 휜다. */
  if (metrics.shape === 'dot') {
    const distance = Math.hypot(dx, dy) || 1;
    const unitX = dx / distance;
    const unitY = dy / distance;
    const startX = from.x + unitX * (from.radius ?? DOT_RADIUS);
    const startY = from.y + unitY * (from.radius ?? DOT_RADIUS);
    const endX = to.x - unitX * (to.radius ?? DOT_RADIUS);
    const endY = to.y - unitY * (to.radius ?? DOT_RADIUS);
    /*
      같은 두 노드를 잇는 관계가 여럿이면 부채처럼 벌린다.

      종전에는 「여럿인가」만 보고 모두에게 «같은» 곡률을 주었다. 그러면 같은
      방향으로 난 둘은 정확히 포개져, 곡률을 쓰는 이유(겹침을 푼다)가 사라진다.
      제 몫의 자리를 주려면 각자가 무리 안에서 «몇 번째»인지 알아야 한다.

      가운데를 0으로 두고 좌우로 벌리므로, 홀수 개일 때 한가운데 것은 곧게
      남는다 — 굽힐 이유가 없는 선은 굽히지 않는다.

      부채는 «쌍»을 기준으로 편다. 법선은 진행 방향에서 나오므로, 반대로 흐르는
      관계는 같은 자리 번호를 받고도 거울처럼 뒤집혀 남의 자리에 앉는다. 실제로
      정방향 둘과 역방향 하나를 두었더니 첫째와 셋째가 같은 길로 갔다. 그래서
      역방향이면 자리 번호의 부호를 미리 뒤집어 그 뒤집힘을 상쇄한다.
    */
    const fanStep = Math.min(28, distance / 6);
    const seat = metrics.parallelCount > 1
      ? (metrics.parallelIndex ?? 0) - (metrics.parallelCount - 1) / 2
      : 0;
    const bow = seat * (metrics.parallelReversed ? -1 : 1) * fanStep;
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
  /*
    세로로 이어지는 관계. 직선이면 «사이에 낀» 노드를 관통하므로 옆으로
    부풀려 돌아간다.

    다만 돌아가는 것은 피할 것이 있을 때뿐이다. 종전에는 사이에 아무것도
    없어도 늘 부풀렸고, 거리가 멀수록 더 부풀었다 — 위아래로 나란한 카드 둘
    사이에 74px짜리 활이 생겨, 없는 장애물을 피해 가는 것처럼 읽혔다.
    흐름 편집기(n8n·Node-RED)에서 위아래로 이어진 두 노드는 완만한 S로
    잇지 큰 호를 그리지 않는다.
  */
  const bow = metrics.verticallyBlocked
    ? Math.max(48, Math.abs(endY - startY) / 2)
    : 0;
  const controlX = (from.x + to.x) / 2 + bow;
  const controlY = (startY + endY) / 2;
  return { start: { x: from.x, y: startY }, control: { x: controlX, y: controlY }, end: { x: to.x, y: endY } };
}

/*
  Force-directed 배치. 노드-링크 장르(Obsidian 그래프 뷰 · Neo4j Bloom ·
  Gephi)의 사실상 표준으로, 격자가 아니라 물리로 자리를 잡는다 — 관계는
  고무줄처럼 당기고, 노드끼리는 밀어내고, 겹치면 튕겨나고, 전체는 중심에
  묶인다. 잦아드는 과정이 이 장르 특유의 「찰랑거림」이다.

  d3-force를 들이지 않고 직접 쓴 이유: LDS는 런타임 의존성이 없는 구조이고,
  필요한 물리는 힘 넷과 감쇠 적분뿐이다. 우리 규모(수십 노드)에서는 O(n²)
  반발로 충분해 Barnes-Hut 같은 근사도 필요 없다.

  결정론은 유지된다. 초기 좌표는 격자 배치 + id 해시의 미세한 흔들림이고
  (완전히 일직선인 노드들이 같은 선 위에서만 밀리는 것을 막는다), 난수 없이
  고정 틱 수만큼 돌리므로 같은 입력이면 같은 수렴 상태가 나온다. 사용자가
  끌면 그때부터는 입력이 달라진 것이므로 결정론 주장 밖이다.
*/
/*
  틱 수와 «프레임당» 틱 수가 함께 체감 속도를 정한다. 프레임당 3틱은 물리를
  세 배로 감아 퍼지는 것이 아니라 튀는 것으로 읽혔다. 1틱이면 감쇠 곡선이
  그대로 눈에 보인다. 그만큼 총 시간이 늘어나므로 틱 수는 줄인다 — 감쇠가
  0.82라 150틱이면 속도가 사실상 0이라(0.82^150) 수렴에는 충분하고,
  60fps에서 2.5초 남짓이라 기다린다는 느낌도 들지 않는다.
*/
const FORCE_TICKS = 150;
const FORCE_TICKS_PER_FRAME = 1;
const FORCE_LINK_LENGTH = 132;
const FORCE_CHARGE = 9000;
const FORCE_LINK_K = 0.06;
const FORCE_CENTER_K = 0.012;
const FORCE_DAMPING = 0.82;
const FORCE_COLLIDE_PADDING = 16;
/** 펼칠 때 새 노드가 이웃 둘레 어디쯤에서 태어날지. */
const FORCE_BIRTH_RADIUS = 46;

function forceJitter(id, axis) {
  return ((stableHash(`${id}:${axis}`) % 1000) / 1000 - 0.5) * 8;
}

function createForceBodies(nodes, base, radiusOf, footprintOf) {
  return nodes.map((node) => {
    const point = base.get(node.id) ?? { x: 0, y: 0 };
    return {
      id: node.id,
      x: point.x + forceJitter(node.id, 'x'),
      y: point.y + forceJitter(node.id, 'y'),
      vx: 0,
      vy: 0,
      r: footprintOf ? footprintOf(node) : radiusOf(node) || DOT_RADIUS,
      fx: null,
      fy: null,
    };
  });
}

function createForceLinks(edges, bodies) {
  const byId = new Map(bodies.map((body) => [body.id, body]));
  return edges
    .map((edge) => ({ a: byId.get(edge.from), b: byId.get(edge.to) }))
    .filter((link) => link.a && link.b && link.a !== link.b);
}

function forceTick(bodies, links) {
  for (let i = 0; i < bodies.length; i += 1) {
    for (let j = i + 1; j < bodies.length; j += 1) {
      const a = bodies[i];
      const b = bodies[j];
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let squared = dx * dx + dy * dy;
      if (squared < 1) {
        // 정확히 겹친 두 노드는 밀 방향이 없다. 난수 대신 id 해시로 방향을
        // 정해 결정론을 지킨다.
        const angle = stableHash(`${a.id}:${b.id}`) % 360;
        dx = Math.cos(angle);
        dy = Math.sin(angle);
        squared = 1;
      }
      const distance = Math.sqrt(squared);
      const ux = dx / distance;
      const uy = dy / distance;
      const repulsion = Math.min(FORCE_CHARGE / squared, 60);
      a.vx -= ux * repulsion;
      a.vy -= uy * repulsion;
      b.vx += ux * repulsion;
      b.vy += uy * repulsion;
      const overlap = a.r + b.r + FORCE_COLLIDE_PADDING - distance;
      if (overlap > 0) {
        a.vx -= ux * overlap * 0.5;
        a.vy -= uy * overlap * 0.5;
        b.vx += ux * overlap * 0.5;
        b.vy += uy * overlap * 0.5;
      }
    }
  }
  for (const link of links) {
    const dx = link.b.x - link.a.x;
    const dy = link.b.y - link.a.y;
    const distance = Math.hypot(dx, dy) || 1;
    const pull = FORCE_LINK_K * (distance - FORCE_LINK_LENGTH);
    const ux = dx / distance;
    const uy = dy / distance;
    link.a.vx += ux * pull;
    link.a.vy += uy * pull;
    link.b.vx -= ux * pull;
    link.b.vy -= uy * pull;
  }
  for (const body of bodies) {
    if (body.fx != null) {
      // 끌리는 중인 노드는 포인터가 소유한다. 물리는 이웃에만 흐른다.
      body.x = body.fx;
      body.y = body.fy;
      body.vx = 0;
      body.vy = 0;
      continue;
    }
    body.vx -= body.x * FORCE_CENTER_K;
    body.vy -= body.y * FORCE_CENTER_K;
    body.vx *= FORCE_DAMPING;
    body.vy *= FORCE_DAMPING;
    body.x += body.vx;
    body.y += body.vy;
  }
}

function settledForcePositions(nodes, edges, base, radiusOf, footprintOf) {
  const bodies = createForceBodies(nodes, base, radiusOf, footprintOf);
  const links = createForceLinks(edges, bodies);
  for (let tick = 0; tick < FORCE_TICKS; tick += 1) forceTick(bodies, links);
  return new Map(bodies.map((body) => [body.id, { x: body.x, y: body.y }]));
}

/*
  곡선은 두 가지다. 보통의 관계는 2차 베지어로 충분하지만, 자기 자신을 잇는
  관계는 시작점과 끝점이 같아 2차로는 «고리»가 되지 않는다 — 제어점이 하나뿐
  이면 나갔다 되돌아오는 선분이 되어, 길이 0의 path로 화면에서 사라진다.
  실제로 그랬다. 고리에는 제어점이 둘 필요하므로 3차를 쓴다.
*/
function pointOnCurve(curve, t) {
  const { start, control, controlOut, end } = curve;
  const inverse = 1 - t;
  if (controlOut) {
    const a = inverse * inverse * inverse;
    const b = 3 * inverse * inverse * t;
    const c = 3 * inverse * t * t;
    const d = t * t * t;
    return {
      x: a * start.x + b * control.x + c * controlOut.x + d * end.x,
      y: a * start.y + b * control.y + c * controlOut.y + d * end.y,
    };
  }
  return {
    x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
    y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y,
  };
}

/* 「겹치는가」가 아니라 「얼마나 겹치는가」. 0이면 빈자리이고, 빈자리가 하나도
   없을 때는 이 값으로 후보들 사이의 우열을 가린다. */
function boxOverlapArea(a, b) {
  const x = Math.min(a.x + a.width / 2, b.x + b.width / 2)
    - Math.max(a.x - a.width / 2, b.x - b.width / 2);
  const y = Math.min(a.y + a.height / 2, b.y + b.height / 2)
    - Math.max(a.y - a.height / 2, b.y - b.height / 2);
  return x > 0 && y > 0 ? x * y : 0;
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

function curveTangent(curve, t) {
  const { start, control, controlOut, end } = curve;
  let x;
  let y;
  if (controlOut) {
    const inverse = 1 - t;
    x = 3 * inverse * inverse * (control.x - start.x)
      + 6 * inverse * t * (controlOut.x - control.x)
      + 3 * t * t * (end.x - controlOut.x);
    y = 3 * inverse * inverse * (control.y - start.y)
      + 6 * inverse * t * (controlOut.y - control.y)
      + 3 * t * t * (end.y - controlOut.y);
  } else {
    x = 2 * (1 - t) * (control.x - start.x) + 2 * t * (end.x - control.x);
    y = 2 * (1 - t) * (control.y - start.y) + 2 * t * (end.y - control.y);
  }
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
    const width = estimateTextWidth(entry.text, CAPTION_FONT_SIZE) + 6;
    const height = 16;
    /* 빈자리를 못 찾더라도 후보들이 «얼마나» 나쁜지는 서로 다르다. 그래서
       도는 동안 가장 덜 겹치는 후보를 기억해 둔다 — 예전에는 곡선 한가운데로
       되돌렸는데, 그 자리는 하필 후보 중 첫 번째, 즉 이미 막힌다고 판정한
       자리였다. 겹침이 불가피할 때 고를 것은 «제자리»가 아니라 «가장 덜
       겹치는 자리»다. */
    let best = null;
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
        const cost = placed.reduce((sum, other) => sum + boxOverlapArea(box, other), 0);
        if (cost === 0) {
          placed.push(box);
          return { ...entry, label: point };
        }
        if (!best || cost < best.cost) best = { cost, point, box };
      }
    }
    if (best) {
      // 놓은 자리는 겹치더라도 «놓았다»고 기록한다. 그래야 뒤따르는 라벨이
      // 같은 자리에 또 쌓이지 않는다.
      placed.push(best.box);
      return { ...entry, label: best.point };
    }
    return { ...entry, label: pointOnCurve(entry.curve, LABEL_CANDIDATE_T[0]) };
  });
}

export function NetworkGraph({
  nodes: nodesInput = [],
  edges: edgesInput = [],
  layout = 'layered',
  nodeShape = 'card',
  showEdgeLabels = true,
  motion = 'auto',
  nodeColor = 'var(--color-semantic-primary-normal)',
  /*
    관계선의 기본색. 종전에는 구분선용 hairline 토큰이었는데, 그것은 «칸을
    나누는» 색이지 «데이터를 그리는» 색이 아니다. 배경 대비가 1.3:1이라
    색을 주지 않은 소비자에게는 관계가 사실상 보이지 않았다 — 관계선은 내용을
    이해하는 데 필요한 그래픽이므로 3:1을 지켜야 한다(WCAG 1.4.11).

    여전히 «선» 토큰이면서 대비를 갖는 것으로 바꾼다(측정 4.74:1).
  */
  edgeColor = 'var(--color-semantic-line-normal-normal)',
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
  /*
    물리는 `dot`에만 건다.

    흐름도에서는 «위치가 곧 의미»이고(왼쪽이 앞 단계), 사용자가 배치한 자리는
    사용자의 저작물이다. 물리가 노드를 옮기면 둘 다 무너진다 —
    n8n·Node-RED·Blender·Unreal 어디도 노드를 스스로 움직이게 두지 않는다.
    계약 문서는 이미 그렇게 적혀 있었는데 구현이 따르지 않아, `card`에
    `force`를 주면 카드가 실제로 떠다녔다. 문서가 거짓말을 하고 있던 셈이다.

    `dot`이 아니면 층 배치로 돌린다. 펼치기 큐를 `card`에서 그리지 않는 것과
    같은 태도다 — 장르에 없는 개념은 조용히 없다.
  */
  const isForce = layout === 'force' && isDot;
  const effectiveLayout = layout === 'force' ? 'layered' : layout;

  /*
    `id`는 이 컴포넌트의 «열쇠»다. 노드를 잇고, 포커스 순회를 세우고, 애니메이션
    사이에 같은 노드를 알아보는 일이 모두 `id`로 이뤄진다. 같은 `id`가 둘이면
    그 셋이 한꺼번에 어긋난다 — 실제로 roving tabindex가 무너져 `tabindex="0"`인
    노드가 둘이 되었다. 탭 한 번에 그림 «안»으로 들어가고 그 다음은 방향키라는
    계약이 깨지는 것이다.

    데이터가 잘못됐다고 그림 전체를 포기하지는 않는다. 먼저 온 것을 남기고
    뒤엣것을 버린다 — 「없는 끝점을 가리키는 엣지는 그리지 않는다」와 같은 태도다.
  */
  const nodes = React.useMemo(() => {
    const seen = new Set();
    return nodesInput.filter((node) => {
      if (seen.has(node.id)) return false;
      seen.add(node.id);
      return true;
    });
  }, [nodesInput]);

  const edges = React.useMemo(() => {
    const seen = new Set();
    return edgesInput.filter((edge) => {
      if (seen.has(edge.id)) return false;
      seen.add(edge.id);
      return true;
    });
  }, [edgesInput]);

  /* force도 격자에서 출발한다 — 초기 좌표가 결정론의 절반이다. */
  const gridPositions = React.useMemo(
    () => layoutNodes(nodes, effectiveLayout, metrics),
    [effectiveLayout, metrics, nodes],
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

  /*
    충돌이 밀어내야 하는 것은 «점»이 아니라 «점과 그 이름»이다.

    점 관행에서 이름은 원 밖 아래에 있고, 원보다 훨씬 넓다 — 반지름 16px짜리
    점에 「플랫폼·개발자 도구」가 붙으면 실제로 차지하는 폭은 110px가 넘는다.
    반지름만 보고 밀면 점 둘은 안 닿는데 이름끼리는 포개진다. 자리를 옮겨
    피하는 수도 없다. 이름의 자리는 점에 매여 있기 때문이다.

    그래서 이름을 감싸는 원까지를 몸집으로 친다. 세로로는 캡션 밑선까지,
    가로로는 두 줄 중 넓은 쪽의 절반까지다. 원 하나로는 아래로만 뻗은 이 모양을
    정확히 표현할 수 없지만, 어긋나는 쪽이 «더 넉넉히»이므로 안전하다.

    카드 관행에서는 이름이 «안»에 있으므로 상자 자체가 몸집이다.
  */
  /* 밀어낼 자리도, 라벨이 피할 자리도 «그려지는» 글자를 따라야 한다. 잘리기
     «전»의 폭으로 재면 있지도 않은 글자를 피하게 된다. */
  const labelRoomFor = React.useCallback(
    () => (isDot ? DOT_LABEL_MAX_WIDTH : metrics.width - 32),
    [isDot, metrics.width],
  );
  const fittedLabelWidth = React.useCallback(
    (node) => estimateTextWidth(
      fitText(nodeText(node.label) || node.id, labelRoomFor(), LABEL_FONT_SIZE),
      LABEL_FONT_SIZE,
    ),
    [labelRoomFor],
  );
  const fittedCaptionWidth = React.useCallback(
    (node) => estimateTextWidth(
      fitText(nodeText(node.caption), labelRoomFor(), CAPTION_FONT_SIZE),
      CAPTION_FONT_SIZE,
    ),
    [labelRoomFor],
  );

  const footprintOf = React.useCallback(
    (node) => {
      if (!isDot) return Math.hypot(metrics.width, metrics.height) / 2;
      const radius = radiusOf(node) || DOT_RADIUS;
      const nameWidth = fittedLabelWidth(node);
      const captionWidth = fittedCaptionWidth(node);
      const below = radius + (nodeText(node.caption) ? 35 : 20);
      return Math.max(radius, below, nameWidth / 2, captionWidth / 2);
    },
    [fittedCaptionWidth, fittedLabelWidth, isDot, metrics.height, metrics.width, radiusOf],
  );

  const settledPositions = React.useMemo(
    () => (isForce
      ? settledForcePositions(nodes, edges, gridPositions, radiusOf, footprintOf)
      : null),
    [edges, footprintOf, gridPositions, isForce, nodes, radiusOf],
  );

  /*
    움직임은 선택이고 도착점은 결정론이다. 수렴 애니메이션과 드래그의 살아
    있는 좌표는 이 상태가 들고, 꺼져 있으면(모션 줄이기 설정·`motion="none"`)
    수렴 상태를 바로 그린다. 애니메이션도 같은 tick 함수를 같은 횟수만큼
    돌리므로 마지막 프레임은 정적 수렴 상태와 동일하다.
  */
  const [livePositions, setLivePositions] = React.useState(null);
  /* 첫 렌더 «전에» 알아야 한다. effect에서 읽어 상태를 뒤집으면 첫 페인트가
     수렴 상태로 찍힌 뒤 격자로 되돌아가 애니메이션이 시작된다 — 한 프레임
     번쩍임이 생긴다. SSR에서는 모른다고 치고 움직임 없는 쪽으로 둔다. */
  const [reduceMotion, setReduceMotion] = React.useState(() => (
    typeof window === 'undefined' || !window.matchMedia
      ? true
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const simRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event) => setReduceMotion(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const motionAllowed = isForce && motion !== 'none' && !reduceMotion;

  /* 직전 커밋의 표시 좌표. 펼치기로 노드가 늘어날 때 «기존 노드는 제자리,
     새 노드는 이웃의 자리에서 출발»을 만들기 위한 기억이다. */
  const lastPositionsRef = React.useRef(null);

  React.useEffect(() => {
    if (!isForce) {
      simRef.current = null;
      setLivePositions(null);
      return undefined;
    }
    /*
      출발 좌표. 첫 마운트는 격자에서(결정론의 절반), 그 뒤의 변경 — 펼치기 —
      에서는 기존 노드를 직전 자리에 두고 새 노드를 «이미 자리 잡은 이웃» 위에
      태어나게 한다. 그러면 반발력이 밀어내며 꽃 피듯 퍼진다. 이 장르의 펼침
      애니메이션은 별도 트랜지션이 아니라 물리 그 자체다(Obsidian·Bloom).
    */
    const previous = lastPositionsRef.current;
    const seeds = new Map();
    nodes.forEach((node) => {
      const kept = previous?.get(node.id);
      if (kept) seeds.set(node.id, kept);
    });
    nodes.forEach((node) => {
      if (seeds.has(node.id)) return;
      const link = edges.find((edge) => (
        (edge.from === node.id && seeds.has(edge.to))
        || (edge.to === node.id && seeds.has(edge.from))
      ));
      const anchorId = link ? (link.from === node.id ? link.to : link.from) : null;
      const anchor = anchorId && seeds.get(anchorId);
      if (!anchor) {
        seeds.set(node.id, gridPositions.get(node.id) || { x: 0, y: 0 });
        return;
      }
      /* 같은 이웃에서 태어나는 노드가 여럿이면 «정확히 같은 점»에서 출발하게
         된다. 그러면 첫 틱에 반발이 상한까지 걸려 폭발하듯 튄다. 이웃 둘레의
         작은 원 위에 id 해시로 자리를 나눠 앉히면 — 여전히 결정론이면서 —
         처음부터 서로 떨어져 있어 부드럽게 퍼진다. */
      const angle = (stableHash(node.id) % 360) * (Math.PI / 180);
      seeds.set(node.id, {
        x: anchor.x + Math.cos(angle) * FORCE_BIRTH_RADIUS,
        y: anchor.y + Math.sin(angle) * FORCE_BIRTH_RADIUS,
      });
    });
    const bodies = createForceBodies(nodes, seeds, radiusOf, footprintOf);
    const links = createForceLinks(edges, bodies);
    simRef.current = { bodies, links, byId: new Map(bodies.map((b) => [b.id, b])) };
    if (!motionAllowed) {
      /*
        움직임 없이 도착점만. 도착점은 `settledPositions`가 «이미» 같은 tick
        함수를 같은 횟수만큼 돌려 구해 두었으므로, 여기서 다시 돌리는 것은
        같은 계산을 두 번 하는 것이다 — 노드 800개에서 0.5초를 한 번 더
        무는 일이었다. 몸체에는 그 결과를 옮겨 담기만 한다.

        (모션이 꺼져 있으면 드래그도 막혀 있으므로 몸체를 쓰는 곳은 없다.
        그래도 맞춰 두는 것은, 사용자가 도중에 모션 설정을 바꿔 이 effect가
        다시 도는 순간 몸체가 엉뚱한 자리에 있으면 안 되기 때문이다.)
      */
      bodies.forEach((body) => {
        const settled = settledPositions?.get(body.id);
        if (!settled) return;
        body.x = settled.x;
        body.y = settled.y;
        body.vx = 0;
        body.vy = 0;
      });
      setLivePositions(null);
      return undefined;
    }
    let frame = 0;
    let ticked = 0;
    const step = () => {
      for (let i = 0; i < FORCE_TICKS_PER_FRAME && ticked < FORCE_TICKS; i += 1, ticked += 1) {
        forceTick(bodies, links);
      }
      setLivePositions(new Map(bodies.map((b) => [b.id, { x: b.x, y: b.y }])));
      if (ticked < FORCE_TICKS) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [edges, footprintOf, gridPositions, isForce, motionAllowed, nodes, radiusOf, settledPositions]);

  /*
    드래그. 노드를 끌면 그 노드는 포인터가 소유하고 물리는 이웃으로 흐른다 —
    이 장르에서 사용자가 구조를 «만져 보는» 방법이다. 끌린 뒤의 좌표는 입력이
    달라진 것이므로 결정론 주장 밖이고, 모션이 꺼져 있으면 드래그도 물리를
    돌리지 않는다(수렴 상태 유지).
  */
  const svgRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const suppressClickRef = React.useRef(false);

  const toGraphPoint = React.useCallback((event) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const matrix = svg.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  }, []);

  const dragTicker = React.useCallback(() => {
    const sim = simRef.current;
    if (!sim || !dragRef.current) return;
    forceTick(sim.bodies, sim.links);
    setLivePositions(new Map(sim.bodies.map((b) => [b.id, { x: b.x, y: b.y }])));
    dragRef.current.frame = window.requestAnimationFrame(dragTicker);
  }, []);

  const nodePointerDown = React.useCallback((event, node) => {
    if (!isForce || !motionAllowed || !simRef.current) return;
    const start = toGraphPoint(event);
    if (!start) return;
    dragRef.current = { id: node.id, start, moved: false, frame: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [isForce, motionAllowed, toGraphPoint]);

  const nodePointerMove = React.useCallback((event) => {
    const drag = dragRef.current;
    const sim = simRef.current;
    if (!drag || !sim) return;
    const point = toGraphPoint(event);
    if (!point) return;
    if (!drag.moved) {
      if (Math.hypot(point.x - drag.start.x, point.y - drag.start.y) < 4) return;
      drag.moved = true;
      suppressClickRef.current = true;
      drag.frame = window.requestAnimationFrame(dragTicker);
    }
    const body = sim.byId.get(drag.id);
    if (body) {
      body.fx = point.x;
      body.fy = point.y;
    }
  }, [dragTicker, toGraphPoint]);

  const nodePointerUp = React.useCallback(() => {
    const drag = dragRef.current;
    const sim = simRef.current;
    if (!drag) return;
    window.cancelAnimationFrame(drag.frame);
    dragRef.current = null;
    if (sim) {
      const body = sim.byId.get(drag.id);
      if (body) {
        body.fx = null;
        body.fy = null;
      }
      if (drag.moved) {
        /* 손을 뗀 뒤 잦아드는 꼬리. 프레임당 한 틱이라 이 횟수가 곧 지속
           시간이다(150틱 ≈ 2.5초). 짧게 끊으면 아직 움직이는 중에 멎어
           경직돼 보인다. */
        let cooled = 0;
        const cool = () => {
          if (!simRef.current || dragRef.current) return;
          forceTick(sim.bodies, sim.links);
          setLivePositions(new Map(sim.bodies.map((b) => [b.id, { x: b.x, y: b.y }])));
          cooled += 1;
          if (cooled < 150) window.requestAnimationFrame(cool);
        };
        window.requestAnimationFrame(cool);
      }
    }
    // click은 pointerup 뒤에 온다. 다음 틱에 풀어 끌기 끝의 오선택만 막는다.
    window.setTimeout(() => { suppressClickRef.current = false; }, 0);
  }, []);

  /* 움직임이 켜져 있으면 첫 페인트는 «출발점»(격자)이어야 한다. 도착점을
     먼저 보여주고 출발점으로 되감으면 번쩍인다. 꺼져 있으면 도착점만 그린다. */
  const positions = isForce
    ? (livePositions ?? (motionAllowed ? gridPositions : settledPositions))
    : gridPositions;

  React.useEffect(() => {
    lastPositionsRef.current = positions;
  });

  /* 마운트 이후에 «새로» 들어온 노드만 진입 애니메이션을 받는다. 첫 렌더의
     전체 등장까지 애니메이션하면 화면이 열릴 때마다 전부 튀어오른다. */
  const mountedRef = React.useRef(false);
  const previousIdsRef = React.useRef(new Set());
  const enteringIds = React.useMemo(() => {
    const entering = new Set();
    if (mountedRef.current) {
      nodes.forEach((node) => {
        if (!previousIdsRef.current.has(node.id)) entering.add(node.id);
      });
    }
    return entering;
  }, [nodes]);
  React.useEffect(() => {
    mountedRef.current = true;
    previousIdsRef.current = new Set(nodes.map((node) => node.id));
  }, [nodes]);

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
    /* 액자는 «도착점» 기준으로 잡는다. 수렴 애니메이션이나 드래그 중의 살아
       있는 좌표를 따라가면 화면 전체가 프레임마다 출렁인다 — 흔들리는 것은
       노드여야지 액자가 아니다. */
    const frame = isForce ? settledPositions : positions;
    const values = [...(frame?.values() ?? [])];
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
  }, [isForce, metrics, positions, settledPositions]);

  /* 관계의 곡선과 라벨 자리를 한 번에 계산한다. 라벨 배치가 «다른» 라벨과
     노드를 모두 봐야 하므로, 그리는 중에 하나씩 정할 수 없다. */
  const laidOutEdges = React.useMemo(() => {
    // 같은 두 노드를 잇는 관계가 여럿인 쌍. 이때만 직선을 포기하고 휜다.
    const pairCounts = new Map();
    edges.forEach((edge) => {
      const key = [edge.from, edge.to].sort().join('→');
      pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1);
    });
    // 같은 노드에 걸린 고리가 여럿이면 각도를 돌려 겹치지 않게 한다.
    const selfSeen = new Map();
    // 같은 쌍을 잇는 관계가 여럿이면 부채처럼 벌린다. 각자 «몇 번째»인지 센다.
    const pairSeen = new Map();
    const entries = edges.map((edge) => ({
      edge,
      curve: edgePath(anchors.get(edge.from), anchors.get(edge.to), {
        ...metrics,
        shape: nodeShape,
        parallelCount: pairCounts.get([edge.from, edge.to].sort().join('→')) ?? 1,
        parallelIndex: (() => {
          const key = [edge.from, edge.to].sort().join('→');
          const seen = pairSeen.get(key) ?? 0;
          pairSeen.set(key, seen + 1);
          return seen;
        })(),
        // 이 관계가 쌍의 «정렬된» 방향과 반대로 흐르는가.
        parallelReversed: [edge.from, edge.to].sort()[0] !== edge.from,
        /*
          세로로 이을 때 두 노드 «사이»에 다른 노드가 끼어 있는가. 끼어 있으면
          직선이 그 노드를 관통하므로 옆으로 돌아가야 하고, 없으면 돌아갈
          이유가 없다. 카드 폭의 절반 안에 들어오는 것만 장애물로 본다 —
          옆 칸의 노드는 직선의 길을 막지 않는다.
        */
        verticallyBlocked: (() => {
          const from = anchors.get(edge.from);
          const to = anchors.get(edge.to);
          if (!from || !to) return false;
          const top = Math.min(from.y, to.y);
          const bottom = Math.max(from.y, to.y);
          return nodes.some((other) => {
            if (other.id === edge.from || other.id === edge.to) return false;
            const point = anchors.get(other.id);
            if (!point) return false;
            return point.y > top && point.y < bottom
              && Math.abs(point.x - (from.x + to.x) / 2) < metrics.width / 2;
          });
        })(),
        selfIndex: edge.from === edge.to
          ? (() => {
            const seen = selfSeen.get(edge.from) ?? 0;
            selfSeen.set(edge.from, seen + 1);
            return seen;
          })()
          : 0,
      }),
      /*
        관계 이름도 담길 자리에 맞춘다. 노드 이름과 달리 상자가 없어 흘러넘칠
        데가 없어 보이지만, 그대로 두면 라벨 하나가 그림 «밖»으로 뻗어나가
        액자에 잘리거나 가로 스크롤을 만든다. 실제로 28자짜리 이름이 폭
        192px 그림에서 336px를 차지했다.

        전체 이름은 관계의 접근성 이름과 `<title>`에 남는다.
      */
      fullText: showEdgeLabels
        ? `${nodeText(edge.label)}${edge.count > 1 ? ` ${edge.count}` : ''}`.trim()
        : '',
      text: showEdgeLabels
        ? fitText(
          `${nodeText(edge.label)}${edge.count > 1 ? ` ${edge.count}` : ''}`.trim(),
          isDot ? DOT_LABEL_MAX_WIDTH : metrics.width,
          CAPTION_FONT_SIZE,
        )
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
      /* 상자는 글자가 «실제로» 놓이는 자리를 따라간다. 이름의 밑선은
         `radius + 16`, 캡션은 `radius + 31`이고 상자는 밑선이 아니라 가운데를
         기준으로 하므로 각각 글자 높이의 절반만큼 올려 잡는다. 2px씩 넉넉하게
         두는 것은 여백이 아니라 오차 몫이다 — 글자 폭을 글자 수로 어림하고
         있어서 실제와 몇 px 어긋난다. */
      const nameWidth = fittedLabelWidth(node) + 8;
      const captionWidth = fittedCaptionWidth(node) + 8;
      return [
        { x: point.x, y: point.y, width: point.radius * 2, height: point.radius * 2 },
        { x: point.x, y: point.y + point.radius + 12, width: nameWidth, height: lineHeight(LABEL_FONT_SIZE) },
        ...(captionWidth > 8
          ? [{ x: point.x, y: point.y + point.radius + 28, width: captionWidth, height: lineHeight(CAPTION_FONT_SIZE) }]
          : []),
      ];
    });
    return placeEdgeLabels(entries, obstacles);
  }, [anchors, edges, fittedCaptionWidth, fittedLabelWidth, isDot, metrics, nodeShape, nodes, showEdgeLabels]);

  const hasData = nodes.length > 0;
  /*
    요약이 하는 일은 «규모»를 알려 주는 것이지 내용을 옮겨 적는 것이 아니다.
    이름을 전부 이어 붙이면 노드 300개짜리 그림에서 3,200자가 되어, 사용자가
    아직 아무것도 하지 않았는데 이름 300개를 끝까지 듣게 된다 — 그림을 훑지
    않아도 되게 하려던 것이 훑는 것보다 오래 걸리는 일이 된다.

    그래서 앞의 몇 개만 이름으로 말하고 나머지는 수로 말한다. 하나하나의
    이름은 노드에 닿았을 때 그 노드가 말한다.
  */
  const automaticSummary = hasData
    ? (() => {
      const names = nodes.map((node) => nodeText(node.label) || node.id);
      const shown = names.slice(0, SUMMARY_NAME_LIMIT);
      const rest = names.length - shown.length;
      const listed = rest > 0 ? `${shown.join(', ')} 외 ${rest}개` : shown.join(', ');
      return `대상 ${nodes.length}개, 관계 ${edges.length}개. ${listed}`;
    })()
    : nodeText(emptyLabel);
  const resolvedSummary = summary ?? automaticSummary;

  /*
    키보드 계약. 그림 전체가 하나의 tab stop 묶음(roving tabindex)이고, 방향키로
    옮겨 다니며 Enter/Space로 그 자리의 것을 실행한다. 이 계약을 컴포넌트가 갖는
    이유는 두 소비자가 각각 `role="button" tabIndex={0}`을 손으로 세우고 있었고,
    한쪽은 바깥 SVG에 `role="img"`를 얹어 그 노드들을 보조기술에서 통째로
    지워버리고 있었기 때문이다. 포커스가 가는 곳은 반드시 이름을 가져야 한다.

    묶음의 «자리»는 노드 하나가 아니라 「노드」와 「그 노드의 펼치기 큐」 둘이다.
    큐를 시각 사용자에게만 클릭 표적으로 열어 주고 키보드에는 닫아 두면, 같은
    동작에 두 등급의 접근을 만드는 셈이 된다. 그래서 큐도 이름과 `aria-expanded`
    를 가진 별도의 버튼으로 순회에 들어온다 — 시각과 키보드가 같은 표적을 쓴다.

    노드에서 `aria-expanded`를 떼어낸 것도 같은 이유다. 한 요소가 「누르면
    선택」과 「펼침 상태」를 동시에 말하면 스크린 리더는 "축소됨, 버튼"으로
    읽어 주는데 정작 누르면 선택이 된다 — 기대와 동작이 어긋난다.
  */
  const [focusedKey, setFocusedKey] = React.useState(null);

  /*
    큐가 있는 노드인가. 접을 것이 있거나(`expanded`) 펼칠 것이 있으면 있다.
    `expanded`를 소비자가 알려주는 이유: 펼치고 나면 `collapsedCount`는 0이
    되므로 그것만으로는 「접을 게 있다」를 알 수 없다.
  */
  /*
    뿌리 강조도 `dot` 전용이다. 노드-링크에서 `root`는 「탐색이 여기서
    시작했다」는 뜻이지만, 플로우에서 `root`는 그저 «첫 단계»이고 그 사실은
    이미 왼쪽 끝이라는 자리가 말한다. 같은 표시를 양쪽에 두면 한쪽에서는
    거짓말이 된다.
  */
  const isRootNode = React.useCallback(
    (node) => isDot && node.root === true,
    [isDot],
  );

  const hasCue = React.useCallback(
    (node) => (
      /*
        큐는 `dot`에만 그린다. 「접힌 이웃을 사방으로 펼친다」는 노드-링크의
        개념이고, 플로우 에디터에서 접히는 것은 이웃이 아니라 «한 노드 안의
        서브그래프»다(n8n 서브워크플로 · Node-RED subflow · Blender node group ·
        Unreal collapsed graph). 열리는 방향도 다르다 — 사방이 아니라 안으로
        들어가거나 그 자리에서 아래로 펼쳐진다. 같은 기호로 다른 개념을
        말하면 둘 다 잘못 읽히므로, 플로우 쪽 서브그래프는 요구가 확인된 뒤
        별도 개념으로 설계한다.
      */
      isDot
      && Boolean(onToggleNode)
      && (node.expanded === true || node.collapsedCount > 0)
    ),
    [isDot, onToggleNode],
  );
  const isExpanded = React.useCallback((node) => node.expanded === true, []);

  /*
    방향키가 도는 순서는 «화면에 놓인 자리»를 따른다.

    입력 배열 순서로 돌면 →를 눌렀는데 왼쪽 노드로 가는 일이 생긴다. 그림에서
    방향키는 방향을 뜻하므로 그것은 거짓말이다. 그렇다고 「누른 방향에서 가장
    가까운 노드」로 바꾸면 큐가 순회에서 떨어져 나간다 — 큐는 자기 노드 «옆»에
    있어야 키보드로 닿을 수 있고, 그 도달 가능성이 방향의 정확함보다 크다.

    그래서 순서 자체를 읽는 순서로 세운다. 위에서 아래로, 같은 줄 안에서는
    왼쪽에서 오른쪽으로. 그러면 →는 대체로 오른쪽으로 가고 ↓는 아래로 가면서도
    큐는 자기 노드 바로 뒤에 남는다.

    줄은 노드 높이의 절반으로 묶는다. 정확히 같은 y가 아니어도 나란히 보이는
    것들은 한 줄로 읽히기 때문이다. 자리를 모르면(좌표가 아직 없으면) 입력
    순서를 쓴다 — 순서가 없는 것보다는 낫다.

    기준은 «도착» 좌표다. 물리로 흔들리는 중의 좌표를 쓰면 순회 순서가 프레임
    마다 바뀌어, 방향키를 누르는 동안 발밑이 움직인다.
  */
  const focusOrder = React.useMemo(() => {
    const row = Math.max(1, metrics.rowPitch / 2);
    const settled = settledPositions ?? gridPositions;
    const ordered = [...nodes].sort((left, right) => {
      const a = settled.get(left.id);
      const b = settled.get(right.id);
      if (!a || !b) return 0;
      const rowDelta = Math.round(a.y / row) - Math.round(b.y / row);
      if (rowDelta !== 0) return rowDelta;
      if (a.x !== b.x) return a.x - b.x;
      // 자리가 같으면 `id`로 가른다 — 순회 순서도 결정론이어야 한다.
      return String(left.id).localeCompare(String(right.id));
    });
    /*
      관계도 순회의 «자리»다.

      종전에는 관계에 `role="button"`과 이름을 주고도 `tabIndex={-1}`로 두어,
      마우스로는 고를 수 있는데 키보드로는 닿을 수 없었다. 큐에서 이미
      「시각 사용자에게만 표적을 열어 주면 같은 동작에 두 등급의 접근이
      생긴다」고 정해 놓고 관계선에는 지키지 않고 있었다.

      자리는 «떠나는 노드» 뒤다. 큐가 자기 노드 뒤에 붙는 것과 같은 규칙이고,
      그래야 「이 대상 — 이 대상에서 나가는 관계들 — 다음 대상」으로 읽힌다.
      관계를 따로 모아 두면 어느 대상의 관계인지가 순서에서 사라진다.
    */
    const leaving = new Map();
    if (onSelectEdge) {
      edges.forEach((edge) => {
        const bucket = leaving.get(edge.from);
        if (bucket) bucket.push(edge);
        else leaving.set(edge.from, [edge]);
      });
    }
    const order = [];
    ordered.forEach((node) => {
      order.push({ key: `node:${node.id}`, node, kind: 'node' });
      if (hasCue(node)) order.push({ key: `cue:${node.id}`, node, kind: 'cue' });
      (leaving.get(node.id) ?? []).forEach((edge) => {
        order.push({ key: `edge:${edge.id}`, edge, kind: 'edge' });
      });
    });
    return order;
  }, [edges, gridPositions, hasCue, metrics.rowPitch, nodes, onSelectEdge, settledPositions]);

  const activeKey = focusOrder.some((stop) => stop.key === focusedKey)
    ? focusedKey
    : focusOrder[0]?.key;

  const stopDomId = React.useCallback(
    (key) => `${rawId}-stop-${stableHash(key)}`,
    [rawId],
  );

  const moveFocus = React.useCallback(
    (fromKey, delta) => {
      const index = focusOrder.findIndex((stop) => stop.key === fromKey);
      if (index < 0) return;
      const next = focusOrder[(index + delta + focusOrder.length) % focusOrder.length];
      setFocusedKey(next.key);
      document.getElementById(stopDomId(next.key))?.focus();
    },
    [focusOrder, stopDomId],
  );

  function stopKeyDown(event, stop) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (stop.kind === 'cue') onToggleNode?.(stop.node);
      else if (stop.kind === 'edge') onSelectEdge?.(stop.edge);
      else onSelectNode?.(stop.node);
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      moveFocus(stop.key, 1);
      return;
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      moveFocus(stop.key, -1);
    }
  }

  return (
    <div
      data-chart-type="network"
      style={{ minWidth: 0, height, fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {description != null && <VisuallyHidden id={descriptionId}>{description}</VisuallyHidden>}
      {/* 요약이 «보이는 문장과 같으면» 숨겨서 또 말하지 않는다. 빈 그림에서
          자동 요약은 빈 상태 문구 그 자체이므로, 두 번 들리기만 한다. */}
      {resolvedSummary != null && (hasData || resolvedSummary !== nodeText(emptyLabel)) && (
        <VisuallyHidden id={summaryId} data-chart-summary>{resolvedSummary}</VisuallyHidden>
      )}
      {!hasData ? (
        /*
          빈 그림에도 «이름»이 있어야 한다.

          종전에는 이름을 가진 것이 SVG뿐이라, 그릴 것이 없으면 SVG가 통째로
          빠지면서 이름도 함께 사라졌다. 스크린 리더에는 「표시할 관계가
          없습니다」만 남는데, 무엇이 비었는지가 없다 — 한 화면에 관계도가
          둘이면 어느 쪽 이야기인지조차 알 수 없다.

          설명도 미아가 되어 있었다. `aria-describedby`를 들고 있던 것이
          그 사라진 SVG였으므로, 숨은 설명은 DOM에 남아 아무도 가리키지 않는
          죽은 마크업이었다. 여기서 다시 이어 준다.
        */
        <div
          role="group"
          aria-label={label || '관계도'}
          aria-describedby={description != null ? descriptionId : undefined}
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
        </div>
      ) : (
        <svg
          ref={svgRef}
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
          {/* 진입 스케일-인. 노드 로컬 원점(0,0) 기준으로 자라난다. */}
          {/* 진입은 «자라난다»여야지 «튀어오른다»가 아니다. 0.3에서 시작하면
              배율이 세 배 넘게 뛰어 화면이 들썩이므로 0.72에서 시작하고,
              감속 곡선(ease-out)에 시간을 넉넉히 준다. */}
          {/*
            포커스는 «보여야» 한다. 이 그림은 방향키로 돌아다니고 큐를 눌러
            펼치는, 거의 전부가 키보드 계약인 컴포넌트인데 정작 지금 어디에
            있는지가 화면에 없었다 — 포커스는 갔지만 `outline`은 `none`이었다.
            SVG에서는 `outline`이 제대로 그려지지 않으므로 링을 직접 그린다.

            «언제» 보일지는 `:focus-visible`에 맡긴다. 마우스로 눌렀을 때까지
            링이 남으면 선택 표시와 뒤섞인다 — 이 저장소의 다른 컴포넌트들이
            쓰는 것과 같은 규칙이다.
          */}
          <style>
            {'@keyframes ldsNetworkEnter { from { opacity: 0; transform: scale(0.72); } }'
              + '[data-network-focus-ring]{opacity:0;}'
              + '[data-network-node]:focus-visible [data-network-focus-ring],'
              + '[data-network-collapse-cue]:focus-visible [data-network-focus-ring]{opacity:1;}'
              /* 관계선의 링은 포커스를 받는 path의 «형제»다(링이 아래로 깔려야
                 선을 덮지 않는다). 그래서 조상에서 걸어 준다. */
              + '[data-network-edge]:has(path:focus-visible) [data-network-focus-ring]{opacity:1;}'
              + '[data-network-node]:focus,[data-network-collapse-cue]:focus,'
              + '[data-network-edge] path:focus{outline:none;}'}
          </style>
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
            {laidOutEdges.map(({ edge, curve, text, fullText, label: labelPoint }) => {
              if (!curve) return null;
              const path = {
                // 제어점이 둘이면 고리(3차), 하나면 보통의 관계(2차).
                d: curve.controlOut
                  ? `M ${curve.start.x} ${curve.start.y} C ${curve.control.x} ${curve.control.y} ${curve.controlOut.x} ${curve.controlOut.y} ${curve.end.x} ${curve.end.y}`
                  : `M ${curve.start.x} ${curve.start.y} Q ${curve.control.x} ${curve.control.y} ${curve.end.x} ${curve.end.y}`,
                label: labelPoint,
              };
              const color = edge.color || edgeColor;
              const tone = EDGE_STATE_STYLE[edge.state] ?? EDGE_STATE_STYLE.normal;
              const selected = selectedEdgeId === edge.id;
              const labelText = text;
              return (
                <g key={edge.id} data-network-edge={edge.id} data-state={edge.state ?? 'normal'}>
                  {/* 잘린 관계 이름의 전체를 마우스에도 돌려준다. */}
                  {fullText && fullText !== labelText && <title>{fullText}</title>}
                  <path
                    d={path.d}
                    fill="none"
                    stroke={color}
                    strokeWidth={selected ? tone.width + 1.5 : tone.width}
                    strokeDasharray={tone.dash}
                    opacity={tone.opacity}
                    markerEnd={edge.directed === false ? undefined : `url(#${markerId(color)})`}
                  />
                  {onSelectEdge && (() => {
                    /*
                      곡선은 가늘어 누르기 어려우므로 투명한 넓은 선을 겹쳐
                      표적을 넓힌다. 그리고 그 표적은 «키보드에도» 열려 있다 —
                      종전에는 `tabIndex={-1}`이라 마우스로만 고를 수 있었다.
                    */
                    const edgeStop = { key: `edge:${edge.id}`, edge, kind: 'edge' };
                    /*
                      관계가 «무엇과 무엇 사이»인지 말한다.

                      종전에는 라벨만 이름으로 썼다. 그래서 스크린 리더에는
                      「사용함, 버튼」이라고만 들렸고, 같은 라벨을 가진 관계가
                      여럿이면 서로 구별조차 되지 않았다 — 관계가 전부인 그림
                      에서 관계의 자리가 아무 정보도 나르지 않았던 셈이다.

                      눈으로 보는 사람은 선의 «양 끝»에서 그것을 읽는다. 듣는
                      사람에게는 이름이 그 자리다. 방향이 있으면 「A에서 B로」,
                      화살표를 끈 관계는 「A와 B 사이」로 말한다.
                    */
                    const fromName = nodeText(nodeById.get(edge.from)?.label) || edge.from;
                    const toName = nodeText(nodeById.get(edge.to)?.label) || edge.to;
                    const between = edge.from === edge.to
                      ? `${fromName} 자기 자신`
                      : (edge.directed === false
                        ? `${fromName}와 ${toName} 사이`
                        : `${fromName}에서 ${toName}로`);
                    const edgeName = [between, fullText].filter(Boolean).join(', ') || '관계';
                    return (
                      <>
                        {/* 포커스 링. 관계선은 면이 없으므로 링도 «선»이다 —
                            같은 길을 더 굵게, 포커스 지시 색으로 덧그린다. */}
                        <path
                          data-network-focus-ring
                          d={path.d}
                          fill="none"
                          stroke="var(--color-semantic-focus-indicator)"
                          strokeWidth={tone.width + 4}
                          strokeLinecap="round"
                          pointerEvents="none"
                        />
                        <path
                          d={path.d}
                          fill="none"
                          stroke="transparent"
                          strokeWidth={16}
                          style={{ cursor: 'pointer' }}
                          id={stopDomId(edgeStop.key)}
                          role="button"
                          tabIndex={edgeStop.key === activeKey ? 0 : -1}
                          aria-label={edgeName}
                          aria-pressed={selected ? 'true' : undefined}
                          onFocus={() => setFocusedKey(edgeStop.key)}
                          onKeyDown={(event) => stopKeyDown(event, edgeStop)}
                          onClick={() => onSelectEdge(edge)}
                        />
                      </>
                    );
                  })()}
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
              const nodeStop = { key: `node:${node.id}`, node, kind: 'node' };
              const radius = radiusOf(node);
              /* 카드는 면 안쪽 여백을 뺀 만큼, 점은 이름 하나가 그림의 폭을
                 정하지 않을 만큼. 두 관행의 담을 자리가 다르다. */
              const labelRoom = isDot ? DOT_LABEL_MAX_WIDTH : metrics.width - 32;
              const shownLabel = fitText(labelText, labelRoom, LABEL_FONT_SIZE);
              const shownCaption = fitText(captionText, labelRoom, CAPTION_FONT_SIZE);
              const truncated = shownLabel !== labelText || shownCaption !== captionText;
              return (
                <g
                  key={node.id}
                  id={stopDomId(nodeStop.key)}
                  data-network-node={node.id}
                  data-state={node.state ?? 'normal'}
                  data-selected={selected ? 'true' : undefined}
                  role="button"
                  tabIndex={nodeStop.key === activeKey ? 0 : -1}
                  /* 접힘 여부는 이름에도 넣는다. 큐가 따로 있어도, 노드에
                     닿았을 때 「이 노드에 아직 더 있다」를 듣지 못하면
                     스크린 리더 사용자는 큐로 갈 이유를 모른다. */
                  aria-label={[
                    labelText,
                    captionText,
                    /* 뿌리는 링으로도 보이지만 그것만으로는 눈으로 보는
                       사람에게만 전해진다. 「여기서 시작했다」는 탐색의
                       사실이므로 이름에도 넣는다. */
                    isRootNode(node) ? '탐색 시작점' : null,
                    // 큐가 없는 장르에서는 이 안내도 없다 — 갈 곳 없는 사실이다.
                    hasCue(node) && node.collapsedCount > 0
                      ? `접힌 연결 ${node.collapsedCount}개`
                      : null,
                    hasCue(node) && isExpanded(node) ? '연결 펼침' : null,
                  ].filter(Boolean).join(', ')}
                  aria-pressed={selected ? 'true' : undefined}
                  transform={`translate(${position.x} ${position.y})`}
                  style={{
                    cursor: onSelectNode ? 'pointer' : 'default',
                    opacity: tone.opacity,
                    touchAction: isForce ? 'none' : undefined,
                  }}
                  onFocus={() => setFocusedKey(nodeStop.key)}
                  onClick={() => {
                    // 드래그 끝의 pointerup 직후 오는 click은 선택이 아니다.
                    if (suppressClickRef.current) return;
                    onSelectNode?.(node);
                  }}
                  /* 더블클릭도 큐가 있는 장르에서만. 큐를 안 그리는 화면에서
                     숨은 단축키만 살아 있으면 발견도 예측도 되지 않는다. */
                  onDoubleClick={() => { if (hasCue(node)) onToggleNode?.(node); }}
                  onPointerDown={(event) => nodePointerDown(event, node)}
                  onPointerMove={nodePointerMove}
                  onPointerUp={nodePointerUp}
                  onPointerCancel={nodePointerUp}
                  onKeyDown={(event) => stopKeyDown(event, nodeStop)}
                >
                  {/* 펼치기로 «마운트 이후에» 들어온 노드의 진입. force에서는
                      이웃 자리에서 태어나 물리에 밀려 퍼지는 것이 이미 진입
                      애니메이션이고, 이 스케일-인은 격자 배치에서도 새 노드가
                      튀지 않고 자라나게 한다. 모션 줄이기면 애니메이션 없음. */}
                  <g
                    style={
                      enteringIds.has(node.id) && !reduceMotion && motion !== 'none'
                        ? { animation: 'ldsNetworkEnter 520ms cubic-bezier(0.22, 1, 0.36, 1)' }
                        : undefined
                    }
                  >
                  {/* 잘린 이름의 «전체»를 마우스에도 돌려준다. 보조기술은 이미
                      노드의 접근성 이름에서 전체를 받는다. 자르지 않았으면
                      같은 말을 두 번 하지 않는다. */}
                  {truncated && <title>{[labelText, captionText].filter(Boolean).join(', ')}</title>}
                  {/* 포커스 링. 선택 링(유형 색)과 «다른 색»이어야 한다 —
                      「지금 여기 있다」와 「이것을 골랐다」는 다른 말이다. */}
                  {isDot ? (
                    <circle
                      data-network-focus-ring
                      r={radius + 7}
                      fill="none"
                      stroke="var(--color-semantic-focus-indicator)"
                      strokeWidth={2}
                    />
                  ) : (
                    <rect
                      data-network-focus-ring
                      x={-metrics.width / 2 - 3}
                      y={-metrics.height / 2 - 3}
                      width={metrics.width + 6}
                      height={metrics.height + 6}
                      rx="var(--radius-md)"
                      fill="none"
                      stroke="var(--color-semantic-focus-indicator)"
                      strokeWidth={2}
                    />
                  )}
                  {isDot ? (
                    /* 노드-링크 관행: 색이 찬 원 + 바깥 라벨. 라벨을 밖에 두면
                       원이 작아질 수 있고, 원이 작아야 노드가 많아져도 연결
                       구조가 보인다. 선택은 테두리 링으로 표시한다 — 채움색은
                       이미 범주가 쓰고 있다. */
                    <>
                      {/*
                        탐색이 시작된 자리. 노드-링크 도구들(Bloom의 씨앗 노드가
                        대표)은 뿌리를 눈에 띄게 두는데, 그러지 않으면 「이 그림이
                        무엇을 중심으로 펼쳐진 것인가」가 사라진다.

                        크기로 말하지 않는다 — 반지름은 이미 «양»을 인코딩한다.
                        선택 링(실선, r+5)보다 «바깥»에 «파선»으로 둔다. 그래야
                        뿌리를 선택했을 때 두 링이 자리도 모양도 달라 겹쳐 읽히지
                        않는다.
                      */}
                      {isRootNode(node) && (
                        <circle
                          data-network-root-ring="true"
                          r={radius + 9}
                          fill="none"
                          stroke={color}
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          opacity={0.75}
                        />
                      )}
                      {selected && (
                        /*
                          「이것을 골랐다」는 표시.

                          종전에는 노드의 유형 색을 40% 불투명도로 둘렀다.
                          범주와 이어져 보기에는 좋았지만, 배경 대비가
                          1.6:1까지 떨어져 사실상 보이지 않았다 — 비텍스트
                          표시가 지켜야 하는 3:1의 절반이다.

                          색을 «앱이 소유»하는 것이 문제의 핵심이다. 어떤 색이
                          올지 모르는데 그 색에 대비를 맡길 수는 없다. 그래서
                          선택 링은 글자와 같은 강한 중립색으로 긋는다 — 어떤
                          팔레트가 와도 읽힌다. 무엇을 골랐는지는 그 링 «안»의
                          채움색이 이미 말하고 있다.
                        */
                        <circle
                          data-network-selected-ring
                          r={radius + 4}
                          fill="none"
                          stroke="var(--color-semantic-label-strong)"
                          strokeWidth={2}
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
                      {/*
                        이름은 원 «밖»에 있으므로 관계선이 그 위를 지날 수 있다.
                        선은 직선이라 돌아가지 않고, 라벨 자리를 옮기는 해법도
                        여기서는 못 쓴다 — 이름의 자리는 노드에 매여 있다.

                        그래서 배경색 테두리를 글자 «뒤»에 깐다(`paint-order`).
                        지나가는 선이 글자에 닿기 직전에 끊겨 보이므로 이름이
                        계속 읽힌다. 관계 라벨이 마지막 후보까지 막혔을 때 쓰는
                        것과 같은 장치이고, 이 관행의 도구들(Gephi·Bloom)이
                        라벨에 후광을 두는 이유도 같다.
                      */}
                      <text
                        y={radius + 16}
                        textAnchor="middle"
                        style={{
                          fontSize: 'var(--label2-size)',
                          fontWeight: 'var(--fw-bold)',
                          fill: 'var(--color-semantic-label-strong)',
                          paintOrder: 'stroke',
                          stroke: 'var(--color-semantic-background-elevated-normal)',
                          strokeWidth: 4,
                          strokeLinejoin: 'round',
                          pointerEvents: 'none',
                        }}
                      >
                        {shownLabel}
                      </text>
                      {captionText && (
                        <text
                          y={radius + 31}
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
                          {shownCaption}
                        </text>
                      )}
                    </>
                  ) : (
                    /* 플로우 에디터 관행: 이름을 담는 카드 + 좌우 포트. 포트가
                       있어야 연결이 어디로 들고 나는지 읽히고, 흐름이 한 방향
                       으로 정렬된다. */
                    <>
                      {selected && (
                        /* 점 관행과 같은 이유로 강한 중립색이다. 테두리를
                           1.5에서 2.5로 굵히는 것만으로는 「골랐다」가 서지
                           않는다 — 색이 앱 소유라 굵기 차이가 어떤 팔레트에서
                           얼마나 보일지 이 컴포넌트가 알 수 없다. */
                        <rect
                          data-network-selected-ring
                          x={-metrics.width / 2 - 4}
                          y={-metrics.height / 2 - 4}
                          width={metrics.width + 8}
                          height={metrics.height + 8}
                          rx="var(--radius-md)"
                          fill="none"
                          stroke="var(--color-semantic-label-strong)"
                          strokeWidth={2}
                        />
                      )}
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
                        {shownLabel}
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
                          {shownCaption}
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
                  {hasCue(node) && (() => {
                    /*
                      펼치기·접기 큐. 그래프 도구의 관행(Cytoscape
                      expand-collapse가 대표)은 노드 «왼쪽 위»에 plus 계열
                      기호를 그린다. 숫자만 적으면 무엇의 숫자인지 읽히지
                      않는다 — `+`가 「더 있다」와 「눌러서 연다」를 함께
                      말하므로 `+N`으로 적는다. 오른쪽 위가 아닌 이유: 그쪽
                      축은 카드의 출력 포트가 이미 쓰고 있고, 관행의 기본
                      자리도 왼쪽 위다.

                      큐는 «사라지지 않는다». 펼친 뒤 `−`로 바뀌어 같은 자리에
                      남는다 — Cytoscape가 expand 큐와 collapse 큐를 쌍으로
                      두는 이유이고, 없애면 왕복이 비대칭이 된다. 실제로 그렇게
                      만들었다가 키보드로는 펼칠 수만 있고 접을 수 없는 상태가
                      나왔다(접기가 노드 더블클릭에만 있었다).

                      큐는 표시이자 버튼이다. 그래서 이름과 `aria-expanded`를
                      이것이 갖고 키보드 순회에도 들어온다. 시각 사용자에게만
                      표적을 열어 주면 같은 동작에 두 등급의 접근이 생긴다.
                    */
                    const expanded = isExpanded(node);
                    const cue = isDot
                      ? { x: -radius * 0.72, y: -radius * 0.72 }
                      : { x: -metrics.width / 2 + 8, y: -metrics.height / 2 };
                    const cueText = expanded ? '−' : `+${node.collapsedCount}`;
                    const cueWidth = Math.max(18, cueText.length * 7 + 8);
                    const cueStop = { key: `cue:${node.id}`, node, kind: 'cue' };
                    return (
                      /*
                        노드로 이벤트가 흐르면 클릭이 «선택»이 되고 pointerdown이
                        드래그를 시작하므로 여기서 끊는다.
                      */
                      <g
                        data-network-collapse-cue
                        id={stopDomId(cueStop.key)}
                        role="button"
                        tabIndex={cueStop.key === activeKey ? 0 : -1}
                        aria-label={
                          expanded
                            ? `${labelText}의 펼친 연결 접기`
                            : `${labelText}의 접힌 연결 ${node.collapsedCount}개 펼치기`
                        }
                        aria-expanded={expanded ? 'true' : 'false'}
                        style={{ cursor: onToggleNode ? 'pointer' : undefined }}
                        onFocus={() => setFocusedKey(cueStop.key)}
                        onKeyDown={(event) => {
                          /* 큐는 노드의 자식이라 keydown이 두 번 처리된다 —
                             큐에서 한 칸, 노드에서 또 한 칸 움직여 순회가
                             상쇄되거나 건너뛴다. 클릭·포인터와 같은 이유로
                             여기서 끊는다. */
                          event.stopPropagation();
                          stopKeyDown(event, cueStop);
                        }}
                        onClick={(event) => {
                          if (!onToggleNode) return;
                          event.stopPropagation();
                          onToggleNode(node);
                        }}
                        onDoubleClick={(event) => event.stopPropagation()}
                        onPointerDown={(event) => event.stopPropagation()}
                      >
                        {/*
                          누를 수 있는 자리를 최소 표적 크기까지 넓힌다. 보이는
                          칩은 노드를 가리지 않도록 작아야 하지만(18px), 손가락과
                          거친 포인터에게 18px는 좁다 — WCAG 2.2의 24×24다.
                          그래서 관계선이 이미 쓰는 방법을 그대로 쓴다: 보이지
                          않는 넓은 표적을 겹친다.
                        */}
                        <rect
                          data-network-cue-target
                          x={cue.x - Math.max(cueWidth, CUE_MIN_TARGET) / 2}
                          y={cue.y - CUE_MIN_TARGET / 2}
                          width={Math.max(cueWidth, CUE_MIN_TARGET)}
                          height={CUE_MIN_TARGET}
                          fill="transparent"
                        />
                        {/* 큐도 순회의 «자리»이므로 포커스가 보여야 한다.
                            링은 눌리는 표적을 두르지, 보이는 칩이 아니다. */}
                        <rect
                          data-network-focus-ring
                          x={cue.x - Math.max(cueWidth, CUE_MIN_TARGET) / 2 - 2}
                          y={cue.y - CUE_MIN_TARGET / 2 - 2}
                          width={Math.max(cueWidth, CUE_MIN_TARGET) + 4}
                          height={CUE_MIN_TARGET + 4}
                          rx={9}
                          fill="none"
                          stroke="var(--color-semantic-focus-indicator)"
                          strokeWidth={2}
                          pointerEvents="none"
                        />
                        <rect
                          x={cue.x - cueWidth / 2}
                          y={cue.y - 9}
                          width={cueWidth}
                          height={18}
                          rx={9}
                          fill="var(--color-semantic-background-normal-alternative)"
                          stroke={color}
                          strokeWidth={1}
                          pointerEvents="none"
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
                </g>
              );
            })}
          </g>
        </svg>
      )}
    </div>
  );
}
