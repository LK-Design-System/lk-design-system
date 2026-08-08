import * as React from 'react';
import type { DropdownMenuItem } from '@lk-design-system/lds-core/components/overlay/DropdownMenu';

export interface SelectionInspectorItem {
  label: React.ReactNode;
  kind?: React.ReactNode;
  status?: React.ReactNode;
  statusTone?: 'positive' | 'online' | 'cautionary' | 'warning' | 'negative' | 'offline' | 'signal' | 'critical';
  /** Availability, connection, or freshness uses the Core StatusIndicator; lifecycle/results use StatusBadge. @default "badge" */
  statusPresentation?: 'badge' | 'indicator';
}

export interface SelectionInspectorField {
  label: React.ReactNode;
  /** Standard scalar value normalized through the shared unit contract. */
  value?: string | number | boolean;
  /** Explicit custom-node escape. When supplied, unit formatting is bypassed. */
  valueNode?: React.ReactNode;
  /** String unit for scalar values only. */
  unit?: string;
  tone?: 'default' | 'cautionary' | 'negative' | 'warning' | 'danger';
  /** 여러 선택 항목의 값이 서로 다름을 `—`로 표시합니다. */
  mixed?: boolean;
  /** @default 'left' */
  align?: 'left' | 'right';
}

export interface SelectionInspectorSection {
  title?: React.ReactNode;
  fields?: SelectionInspectorField[];
  children?: React.ReactNode;
  /** @default true */
  collapsible?: boolean;
  /** @default true */
  defaultExpanded?: boolean;
}

export interface SelectionInspectorProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  item?: SelectionInspectorItem | null;
  /** 다중 선택 개수. 2 이상이면 공통 속성 inspector 제목으로 표시합니다. */
  selectionCount?: number;
  title?: React.ReactNode;
  /** 제목을 시각적으로만 숨깁니다. region의 접근 가능한 이름은 유지됩니다. @default false */
  titleVisuallyHidden?: boolean;
  emptyLabel?: React.ReactNode;
  sections?: SelectionInspectorSection[];
  actions?: React.ReactNode;
  /** 헤더 오버플로 메뉴에 놓이는 객체 범위 명령. 파괴적 항목은 `danger: true`를 사용합니다. */
  menuItems?: DropdownMenuItem[];
  /** 오버플로 트리거의 접근 가능한 이름. @default '객체 작업' */
  menuLabel?: string;
  onClearSelection?: React.MouseEventHandler<HTMLButtonElement>;
  clearSelectionLabel?: React.ReactNode;
  clearSelectionAriaLabel?: string;
  children?: React.ReactNode;
}

/** 선택 객체 속성 인스펙터 - 맵 객체, 포인트클라우드 영역, 웨이포인트, 레인, 3D crop volume용. */
export function SelectionInspector(props: SelectionInspectorProps): React.JSX.Element;
