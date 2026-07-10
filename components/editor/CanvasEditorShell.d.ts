import * as React from 'react';

export interface CanvasEditorShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 문서/워크스페이스 제목. */
  title?: React.ReactNode;
  /** 제목 아래의 짧은 상태 또는 문서 메타데이터. */
  description?: React.ReactNode;
  /** 제목 앞의 뒤로가기 또는 프레임 구조 제어. */
  headerStart?: React.ReactNode;
  /** 헤더 오른쪽의 문서 단위 명령. */
  toolbar?: React.ReactNode;
  /** 헤더 아래에서 전체 편집 모드를 바꾸는 탭/필터. */
  subheader?: React.ReactNode;
  /** 좌측 편집 도구 레일. */
  tools?: React.ReactNode;
  /** 실제 레이어/디스플레이 구조가 있을 때만 쓰는 좌측 패널. */
  layers?: React.ReactNode;
  /** 중앙 캔버스 또는 워크플로우 본문. */
  children?: React.ReactNode;
  /** 우측 속성/설정 패널. */
  panel?: React.ReactNode;
  /** `drawer`는 중앙 영역 위에 겹치며 열고 닫을 때 전환됩니다. @default 'docked' */
  panelMode?: 'docked' | 'drawer';
  /** 우측 패널 표시 여부. @default true */
  panelOpen?: boolean;
  /** drawer가 Escape로 닫힐 때도 호출됩니다. */
  onPanelOpenChange?: (open: boolean, reason: 'escape') => void;
  /** 선택적인 하단 수동 상태 표시줄. */
  status?: React.ReactNode;
  /** 우측 패널 폭(px). @default 280 */
  panelWidth?: number;
  /** 좌측 레이어 패널 폭(px). @default 236 */
  layerPanelWidth?: number;
  toolsLabel?: string;
  layersLabel?: string;
  canvasLabel?: string;
  panelLabel?: string;
  statusLabel?: string;
}

/** 캔버스 에디터의 공통 프레임. 도메인별 워크플로우와 패널 내용은 각 슬롯의 소유자가 구성합니다. */
export function CanvasEditorShell(props: CanvasEditorShellProps): JSX.Element;
