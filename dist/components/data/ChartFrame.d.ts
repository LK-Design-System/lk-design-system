import * as React from 'react';
import type { ResourceStateValue } from './ResourceState';

export interface ChartFrameProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  legend?: React.ReactNode;
  resourceState?: ResourceStateValue;
  stateTitle?: React.ReactNode;
  stateDescription?: React.ReactNode;
  stateAction?: React.ReactNode;
  lastUpdated?: React.ReactNode;
  loadingContent?: React.ReactNode;
  /** 주변 문서 구조에 맞춘 제목 단계. @default 3 */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
  bodyStyle?: React.CSSProperties;
}

/** 제목·맥락·액션·차트·범례·resource state를 한 표면에 묶는 LDS Product chart container입니다. */
export function ChartFrame(props: ChartFrameProps): React.JSX.Element;
