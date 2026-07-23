import * as React from 'react';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 클립보드에 복사되는 텍스트. */
  value: string;
  /** 대기 라벨. @default "복사" */
  children?: React.ReactNode;
  /** 복사 성공 라벨. 라이브 리전으로도 같은 문구가 알림됩니다. @default "복사됨" */
  copiedLabel?: React.ReactNode;
  /**
   * 복사 실패 라벨(권한 거부·비보안 컨텍스트·Clipboard API 미지원).
   * 실패는 성공으로 표시하지 않으며, 라이브 리전으로도 같은 문구가 알림됩니다.
   * @default "복사 실패"
   */
  errorLabel?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** value를 클립보드에 복사; 성공·실패를 라벨과 상시 live region으로 함께 알립니다. */
export function CopyButton(props: CopyButtonProps): React.JSX.Element;
