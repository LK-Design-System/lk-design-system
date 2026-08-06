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
 */
export type NetworkGraphLayout = 'layered' | 'columns' | 'manual';

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
  /** `layered` 배치의 중심 노드. */
  root?: boolean;
  /** `layered` 배치에서 뿌리로부터의 거리. */
  depth?: number;
  /** `dot`에서 반지름이 인코딩할 양. 넓이가 값에 비례하도록 제곱근으로 매핑합니다. */
  size?: number;
  /** 접혀 있는 이웃의 수. 0보다 크면 노드 왼쪽 위에 `+N` 확장 큐를 그리고,
      접근 가능한 이름과 `aria-expanded`가 함께 따라갑니다. */
  collapsedCount?: number;
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
  /** 노드에 색이 없을 때 쓰는 기본값. */
  nodeColor?: string;
  /** 관계에 색이 없을 때 쓰는 기본값. */
  edgeColor?: string;
  selectedNodeId?: string;
  selectedEdgeId?: string;
  onSelectNode?: (node: NetworkGraphNode) => void;
  onSelectEdge?: (edge: NetworkGraphEdge) => void;
  /** 이웃 펼치기/접기. 주면 노드가 `aria-expanded`를 갖고 더블클릭·`+`/`-`에 반응합니다. */
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
