import * as React from 'react';

export interface SelectionInspectorItem {
  label: React.ReactNode;
  kind?: React.ReactNode;
  status?: React.ReactNode;
  statusTone?: 'positive' | 'online' | 'cautionary' | 'warning' | 'negative' | 'offline' | 'signal' | 'critical';
}

export interface SelectionInspectorField {
  label: React.ReactNode;
  value?: React.ReactNode;
  valueNode?: React.ReactNode;
  unit?: React.ReactNode;
  tone?: 'default' | 'warning' | 'danger';
}

export interface SelectionInspectorSection {
  title?: React.ReactNode;
  fields?: SelectionInspectorField[];
  children?: React.ReactNode;
}

export interface SelectionInspectorProps extends React.HTMLAttributes<HTMLElement> {
  item?: SelectionInspectorItem | null;
  title?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  sections?: SelectionInspectorSection[];
  actions?: React.ReactNode;
  onClearSelection?: React.MouseEventHandler<HTMLButtonElement>;
  clearSelectionLabel?: React.ReactNode;
  clearSelectionAriaLabel?: string;
  children?: React.ReactNode;
}

/** 선택 객체 속성 인스펙터 - 맵 객체, 포인트클라우드 영역, 웨이포인트, 레인, 3D crop volume용. */
export function SelectionInspector(props: SelectionInspectorProps): JSX.Element;
