import * as React from 'react';
import type { LdsClassNames, LdsStyles, LdsVars } from '@lk-design-system/lds-core/component-authoring';
import type { DataToolbarProps } from './DataToolbar';
import type { ResourceStateProps } from './ResourceState';

export type DataCollectionPanelPart =
  | 'root'
  | 'toolbar'
  | 'state'
  | 'wideContent'
  | 'compactContent'
  | 'footer';

export type DataCollectionPanelVariable =
  | '--lds-data-collection-panel-min-height'
  | '--lds-data-collection-panel-footer-padding';

export interface DataCollectionPanelOwnProps {
  /** Root element. Name a section with aria-label or aria-labelledby when it should be a landmark. @default "section" */
  as?: React.ElementType;
  /** DataToolbar props. The panel always applies variant="embedded". */
  toolbar?: Omit<DataToolbarProps, 'variant'>;
  /** ResourceState props. The panel owns its children and always applies messageVariant="embedded". */
  resourceState?: Omit<ResourceStateProps, 'children' | 'messageVariant'>;
  /** Wide/default collection content, commonly Table or DataGrid. */
  children?: React.ReactNode;
  /** Product-authored semantic narrow representation. Omit to preserve the wide content and its own overflow behavior. */
  compactContent?: React.ReactNode;
  /** Footer content, commonly Pagination. Omit it when navigation is unnecessary; an adapter that renders null leaves no visible footer strip. */
  footer?: React.ReactNode;
  /** Responsive content policy. auto switches at the compactBelow container width only when compactContent exists. @default "auto" */
  layout?: 'auto' | 'wide' | 'narrow';
  /**
   * `auto`가 좁은 본문으로 넘어가는 컨테이너 폭. `md`는 767px, `sm`은 559px입니다.
   * 넓은 본문이 전화기 폭 기준보다 좁은 폭에서도 읽히는 표라면 `sm`을 쓰세요 —
   * 셸 탐색이 폭을 가져가 컨테이너만 좁아진 데스크톱에서 좁은 화면용 목록으로
   * 떨어지는 것을 막습니다. `layout`이 `wide`/`narrow`면 무시됩니다. @default "md"
   */
  compactBelow?: 'md' | 'sm';
  classNames?: LdsClassNames<DataCollectionPanelPart>;
  styles?: LdsStyles<DataCollectionPanelPart>;
  vars?: LdsVars<DataCollectionPanelVariable>;
}

export type DataCollectionPanelProps<Element extends React.ElementType = 'section'> = DataCollectionPanelOwnProps &
  Omit<React.ComponentPropsWithoutRef<Element>, keyof DataCollectionPanelOwnProps | 'as'> & {
    as?: Element;
    ref?: React.ComponentPropsWithRef<Element>['ref'];
  };

/** Continuous toolbar, resource-state, collection-content, and footer surface. */
export function DataCollectionPanel<Element extends React.ElementType = 'section'>(props: DataCollectionPanelProps<Element>): React.JSX.Element;
