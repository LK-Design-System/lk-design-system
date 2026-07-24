import * as React from 'react';

export interface ExpandableTextProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 표시할 텍스트/노드. 전체가 항상 DOM에 있고 클램프는 시각적 컷입니다. */
  children?: React.ReactNode;
  /** 접힘 상태에서 보여줄 줄 수. @default 3 */
  lines?: number;
  /** 펼치기 컨트롤 라벨. @default "더 보기" */
  moreLabel?: React.ReactNode;
  /** 접기 컨트롤 라벨. @default "접기" */
  lessLabel?: React.ReactNode;
  /** 제어형 펼침 상태. 주면 컴포넌트는 상태를 소유하지 않습니다. */
  expanded?: boolean;
  /** 비제어형 초기 펼침 상태. @default false */
  defaultExpanded?: boolean;
  /** 펼침 상태가 바뀔 때 호출됩니다. */
  onToggle?: (expanded: boolean) => void;
  /** 텍스트를 렌더할 요소. @default "div" */
  as?: React.ElementType;
  /** 텍스트 요소에 병합할 스타일(색·크기 등 커스터마이즈). */
  textStyle?: React.CSSProperties;
}

/**
 * 지정한 줄 수로 클램프하고 "더 보기 / 접기" 토글로 나머지를 펼치는 인라인 텍스트.
 * 전체 텍스트는 항상 DOM에 있으며(스크린리더는 전문을 읽음), 토글은 `aria-expanded`·
 * `aria-controls`를 소유하고 실제로 넘칠 때만 나타납니다.
 */
export function ExpandableText(props: ExpandableTextProps): React.JSX.Element;
