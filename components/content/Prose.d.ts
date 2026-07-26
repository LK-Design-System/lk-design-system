import * as React from 'react';

export interface ProseProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 이미 렌더된 형식화 콘텐츠(마크다운을 파싱·정화한 React 노드, 문서 본문,
   * 어시스턴트 rich response). Prose는 이 자식의 요소별 타이포그래피만 소유하며
   * 파싱·정화·하이라이팅·편집은 제품 책임입니다. heading 레벨은 콘텐츠가 정하고
   * 재번호하지 않으므로, 주변 문서 계층에 맞는 레벨을 넘기세요(WCAG 1.3.1).
   */
  children?: React.ReactNode;
  /**
   * 읽기 폭 상한(measure). 긴 줄이 가독성을 해치지 않도록 제한합니다.
   * @default "68ch"
   */
  measure?: string;
}

/** 형식화된 글 한 덩어리에 DS 문서 타이포그래피를 입히는 표면. */
export function Prose(props: ProseProps): React.JSX.Element;
