import * as React from 'react';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 클립보드에 복사되는 텍스트. */
  value: string;
  /** 대기 라벨. @default "복사" */
  children?: React.ReactNode;
  /** 복사 후 라벨. @default "복사됨" */
  copiedLabel?: React.ReactNode;
  /** @default "md" */
  size?: 'sm' | 'md';
}

/** value를 클립보드에 복사; 잠깐 체크 + "복사됨"으로 바뀝니다. */
export function CopyButton(props: CopyButtonProps): JSX.Element;
