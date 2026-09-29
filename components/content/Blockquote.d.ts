import * as React from 'react';

export interface BlockquoteProps extends Omit<React.HTMLAttributes<HTMLElement>, 'cite'> {
  /** 사람이 읽는 출처 표기 줄. `figcaption` 으로 blockquote 바깥에 렌더링됩니다. */
  attribution?: React.ReactNode;
  /** `attribution` 의 레거시 별칭. HTML `cite` 속성(URL)과 이름이 겹치므로 새 코드에서는 `attribution` 을 쓰세요. */
  cite?: React.ReactNode;
  /** HTML `cite` 속성에 들어가는 출처 문서 URL. */
  citeUrl?: string;
  /** 본문 박스는 body(8px), default는 기존 컴포넌트 모서리를 유지합니다. @default "default" */
  radius?: 'default' | 'body';
  children?: React.ReactNode;
}

/** 채움 표면과 선택적 출처가 있는 인용(figure/figcaption). */
export function Blockquote(props: BlockquoteProps): React.JSX.Element;
