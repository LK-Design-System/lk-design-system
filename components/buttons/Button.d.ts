import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 비주얼 스타일. @default "primary" */
  variant?: 'primary' | 'secondary' | 'signal' | 'dark' | 'flat' | 'ghost' | 'on-dark';
  /** 컨트롤 높이 + 패딩. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** @deprecated 더 이상 시각 요소를 렌더하지 않습니다. 호환성 유지를 위한 no-op입니다. */
  arrow?: boolean;
  /** 컨테이너 전체 폭으로 늘림. @default false */
  full?: boolean;
  /** 비활성(흐림, 상호작용 불가). @default false */
  disabled?: boolean;
  /** 다른 요소/컴포넌트로 렌더(예: 링크 CTA는 "a"). @default "button" */
  as?: React.ElementType;
  children?: React.ReactNode;
}

/**
 * 기본 콜투액션 버튼. `primary`는 LK 애저 브랜드 컬러;
 * 그래파이트 중립 액션은 `secondary`, 시안 강조 CTA는 `signal`,
 * 네이비 섹션 위에는 `on-dark`를 쓰세요.
 */
export function Button(props: ButtonProps): JSX.Element;
