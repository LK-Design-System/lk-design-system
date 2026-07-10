import * as React from 'react';

export interface LayerPanelLayer {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  color?: string;
  visible?: boolean;
  locked?: boolean;
  disabled?: boolean;
  count?: React.ReactNode;
  meta?: React.ReactNode;
  status?: React.ReactNode;
  children?: LayerPanelLayer[];
}

export interface LayerPanelProps extends React.HTMLAttributes<HTMLElement> {
  layers?: LayerPanelLayer[];
  activeLayerId?: string;
  defaultActiveLayerId?: string;
  onActiveLayerChange?: (id: string) => void;
  visibleLayerIds?: string[];
  defaultVisibleLayerIds?: string[];
  onVisibleLayerIdsChange?: (ids: string[], changedId: string, visible: boolean) => void;
  lockedLayerIds?: string[];
  defaultLockedLayerIds?: string[];
  onLockedLayerIdsChange?: (ids: string[], changedId: string, locked: boolean) => void;
  title?: React.ReactNode;
  label?: string;
  emptyLabel?: React.ReactNode;
  disabled?: boolean;
}

/** 맵/포인트클라우드 편집기용 레이어 패널 — 표시, 잠금, 활성 레이어, 중첩 그룹, 개수/메타. */
export function LayerPanel(props: LayerPanelProps): JSX.Element;
