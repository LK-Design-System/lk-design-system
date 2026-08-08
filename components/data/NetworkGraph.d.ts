import * as React from 'react';

/** 노드가 지금 어떤 상태인지. 유형 색과 별개의 축입니다. */
export type NetworkGraphNodeState =
  | 'normal'
  | 'muted'
  | 'degraded'
  | 'blocked'
  | 'disabled';

/** 관계가 지금 어떤 상태인지. 흐르는 연결과 멈춘 연결을 구분합니다. */
export type NetworkGraphEdgeState =
  | 'normal'
  | 'live'
  | 'degraded'
  | 'blocked'
  | 'idle'
  | 'disabled';

/**
 * 배치 전략.
 * - `layered`: `root`/`depth`로 층을 만듭니다. 뿌리에서 뻗어 나가는 관계도용.
 * - `columns`: `column`으로 단계를 고정합니다. source → processor → sink처럼
 *   진행 방향이 정해진 흐름도용.
 * - `manual`: 노드의 `x`/`y`를 그대로 씁니다. 앱이 자체 배치기를 가진 경우.
 * - `force`: 물리(고무줄·반발·충돌·중심)로 자리를 잡는 노드-링크 장르의 표준
 *   배치. 격자에서 출발해 고정 틱 수만큼 결정론적으로 수렴하고, 모션이
 *   허용되면 잦아드는 과정을 애니메이션으로 보여주며 노드를 끌 수 있습니다.
 *   `dot`과 함께 쓰세요 — 단계가 고정된 카드 흐름도에 물리를 넣으면 읽을 수
 *   없습니다.
 */
export type NetworkGraphLayout = 'layered' | 'columns' | 'manual' | 'force';

/**
 * 관계도 UI의 두 관행. 장르를 섞으면 둘 다 실패합니다.
 * - `dot`: 노드-링크 다이어그램(Neo4j Bloom · Gephi · Obsidian 계열). 색이 찬
 *   원과 바깥 라벨. 색은 범주, 반지름은 `size`가 정하는 양을 인코딩합니다.
 *   연결 **구조**를 읽는 것이 목적일 때 — 지식 그래프, 의존성 탐색.
 * - `card`: 플로우 에디터(n8n · React Flow · Node-RED 계열). 이름을 담는 카드와
 *   좌우 포트. 각 단계가 **무엇을 하는가**를 읽는 것이 목적일 때 — 파이프라인,
 *   워크플로.
 */
export type NetworkGraphNodeShape = 'dot' | 'card';

export interface NetworkGraphNode {
  id: string;
  label: React.ReactNode;
  /** 이름 아래 한 줄. 유형 이름이나 짧은 상태 문구. */
  caption?: React.ReactNode;
  /** 유형 구분 색. 값을 구분하는 데이터이므로 앱이 소유합니다. */
  color?: string;
  state?: NetworkGraphNodeState;
  /** `columns` 배치에서의 단계. */
  column?: number;
  /** 같은 단계 안의 묶음. 정렬에만 쓰입니다. */
  group?: string;
  /**
   * 탐색이 시작된 노드.
   *
   * `layered` 배치에서는 층의 중심이 되고, `dot`에서는 파선 링과 「탐색
   * 시작점」이라는 이름으로 드러납니다. `card`에서는 첫 단계라는 사실을 이미
   * 왼쪽 끝이라는 자리가 말하므로 아무것도 덧그리지 않습니다.
   */
  root?: boolean;
  /** `layered` 배치에서 뿌리로부터의 거리. */
  depth?: number;
  /** `dot`에서 반지름이 인코딩할 양. 넓이가 값에 비례하도록 제곱근으로 매핑합니다. */
  size?: number;
  /** 접혀 있는 이웃의 수. 0보다 크면 노드 왼쪽 위에 `+N` 펼치기 큐를 그리고,
      노드의 접근 가능한 이름도 그 개수를 말합니다. `nodeShape="dot"`에서만
      쓰입니다 — 플로우 에디터에서 접히는 것은 이웃이 아니라 한 노드 안의
      서브그래프이고, 그것은 다른 개념입니다. */
  collapsedCount?: number;
  /**
   * 이 노드의 이웃이 펼쳐져 있는지. 펼치고 나면 `collapsedCount`가 0이 되어
   * 그것만으로는 「접을 것이 있다」를 알 수 없으므로 따로 받습니다. `true`면
   * 큐가 사라지지 않고 `−`(접기)로 바뀌어 같은 자리에 남습니다 — 없애면
   * 왕복이 비대칭이 되고 키보드로는 접을 길이 사라집니다.
   */
  expanded?: boolean;
  /** `manual` 배치에서의 좌표. */
  x?: number;
  y?: number;
}

export interface NetworkGraphEdge {
  id: string;
  from: string;
  to: string;
  label?: React.ReactNode;
  /** 관계 유형 구분 색. 노드와 같은 이유로 앱이 소유합니다. */
  color?: string;
  state?: NetworkGraphEdgeState;
  /** 접힌 동일 관계의 수. 1보다 크면 라벨 옆에 붙습니다. */
  count?: number;
  /** 화살표를 그릴지. @default true */
  directed?: boolean;
}

export interface NetworkGraphProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  nodes?: NetworkGraphNode[];
  edges?: NetworkGraphEdge[];
  /** @default "layered" */
  layout?: NetworkGraphLayout;
  /** 노드를 어느 관행으로 그릴지. @default "card" */
  nodeShape?: NetworkGraphNodeShape;
  /** 관계 라벨을 그릴지. 노드가 많으면 꺼서 구조만 남깁니다. @default true */
  showEdgeLabels?: boolean;
  /**
   * `force` 배치의 움직임. `auto`는 수렴 애니메이션과 드래그를 켜되
   * `prefers-reduced-motion`이면 수렴 상태를 바로 그립니다. `none`은 항상
   * 수렴 상태만 그립니다(결정적 레이아웃 검증·SSR용). @default "auto"
   */
  motion?: 'auto' | 'none';
  /** 노드에 색이 없을 때 쓰는 기본값. */
  nodeColor?: string;
  /** 관계에 색이 없을 때 쓰는 기본값. */
  edgeColor?: string;
  selectedNodeId?: string;
  selectedEdgeId?: string;
  onSelectNode?: (node: NetworkGraphNode) => void;
  onSelectEdge?: (edge: NetworkGraphEdge) => void;
  /** 이웃 펼치기/접기. 주면 `+N` 큐가 이름과 `aria-expanded`를 가진 별도
      버튼이 되어 클릭·키보드 순회 양쪽에서 같은 표적으로 동작하고, 노드
      더블클릭도 같은 동작을 부릅니다. 노드·관계를 실제로 늘리고 줄이는 것은
      소비자의 몫이며, `force`에서는 새 노드가 이웃의 자리에서 태어나 물리에
      밀려 퍼집니다(진입 애니메이션). */
  onToggleNode?: (node: NetworkGraphNode) => void;
  /** 그림 전체의 접근성 이름. @default "관계도" */
  label?: string;
  /** 화면에 보이지 않는 설명. */
  description?: React.ReactNode;
  /** 화면에 보이지 않는 요약. 생략하면 대상·관계 수와 이름으로 자동 생성합니다. */
  summary?: React.ReactNode;
  /** @default "표시할 관계가 없습니다." */
  emptyLabel?: React.ReactNode;
  /** @default 480 */
  height?: number | string;
}

/** 대상과 관계를 노드·엣지로 그리는 관계도입니다. */
export function NetworkGraph(props: NetworkGraphProps): React.JSX.Element;
