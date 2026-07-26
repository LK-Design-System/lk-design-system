import * as React from 'react';

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 서피스 채움. 대상 배경 위에서 읽히는 쪽을 고르는 **시각 선택일 뿐**,
   * 화자·발신자 같은 의미를 담지 않습니다. @default "navy"
   */
  tone?: 'navy' | 'light';
  /** 꼬리 방향 — 설명 대상을 가리킵니다. @default "bottom" */
  tail?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
}

/** 꼬리가 있는 지속형 콜아웃 — 코치 마크, 주석, 지도 설명. 대화에는 ConversationMessage를 쓰세요. */
export function Bubble(props: BubbleProps): React.JSX.Element;
